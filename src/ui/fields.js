// Render genérico de campos + panel de coach por campo.
// Cubre type: textarea | text | checkbox | radio. La lista (objetivos específicos)
// se renderiza en su vista custom porque tiene add/remove y check Bloom inline.
//
// El render no decide nada de negocio: el llamador pasa values y onChange.
// El panel del coach muestra status (ok / mejorable / no_cumple / unavailable)
// SIEMPRE de forma honesta (principio §6.1 + §6.5).

import { callCoach } from '../coach/client.js';
import { buildCoachPrompt } from '../coach/prompts.js';

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

export function renderField(field, value, opts = {}) {
  const reqBadge = field.required
    ? '<span class="badge req">obligatorio</span>'
    : '<span class="badge opt">opcional</span>';
  const aiBadge = field.ai ? '<span class="badge ai">coach</span>' : '';
  const labelHtml = `
    <div class="field-head">
      <label for="f-${field.id}">${escapeHtml(field.label)}</label>
      <div class="field-badges">${reqBadge}${aiBadge}</div>
    </div>
    <p class="field-hint">${escapeHtml(field.hint)}</p>`;

  let inputHtml = '';
  if (field.type === 'textarea') {
    inputHtml = `<textarea id="f-${field.id}" rows="${field.rows || 3}" data-field="${field.id}"
      placeholder="${escapeHtml(field.placeholder || '')}">${escapeHtml(value || '')}</textarea>`;
  } else if (field.type === 'text') {
    inputHtml = `<input type="text" id="f-${field.id}" data-field="${field.id}"
      placeholder="${escapeHtml(field.placeholder || '')}" value="${escapeHtml(value || '')}">`;
  } else if (field.type === 'checkbox') {
    inputHtml = `<label class="check"><input type="checkbox" id="f-${field.id}"
      data-field="${field.id}" ${value ? 'checked' : ''}> ${escapeHtml(field.label)}</label>`;
  } else if (field.type === 'radio') {
    inputHtml = field.options
      .map(
        (o) =>
          `<label class="radio"><input type="radio" name="f-${field.id}" data-field="${field.id}"
          value="${escapeHtml(o.value)}" ${value === o.value ? 'checked' : ''}>
          ${escapeHtml(o.label)}</label>`
      )
      .join('');
  }

  const extrasHtml = (field.extras || [])
    .map((ex) => {
      if (ex.type === 'checkbox') {
        const checked = opts.extras?.[ex.id] ? 'checked' : '';
        return `<label class="check extra"><input type="checkbox"
          data-field="${ex.id}" data-extra="1" ${checked}>
          <span>${escapeHtml(ex.label)}</span></label>`;
      }
      return '';
    })
    .join('');

  const coachPanel = field.ai
    ? `<div class="coach-panel" data-coach-for="${field.id}" hidden></div>
       <button class="coach-btn" data-eval="${field.id}" ${field.type === 'checkbox' ? 'hidden' : ''}>
         Evaluar con coach
       </button>`
    : '';

  const headerHtml = field.type === 'checkbox' ? '' : labelHtml;

  return `
    <div class="field" data-field-root="${field.id}">
      ${headerHtml}
      ${inputHtml}
      ${extrasHtml}
      ${coachPanel}
    </div>`;
}

/**
 * Cablea los eventos de un bloque de campos.
 * @param {HTMLElement} host         contenedor donde están los <input>/<textarea>
 * @param {{ stepN: number|string, getValue: (fid)=>string, setValue: (fid, val)=>void, getContext: ()=>object }} ctx
 */
export function bindFields(host, ctx) {
  host.querySelectorAll('[data-field]').forEach((el) => {
    const fid = el.dataset.field;
    const isExtra = !!el.dataset.extra;
    const evt = el.type === 'checkbox' || el.type === 'radio' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      const val = el.type === 'checkbox' ? el.checked : el.value;
      ctx.setValue(fid, val, isExtra);
    });
  });
  host.querySelectorAll('[data-eval]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const fid = btn.dataset.eval;
      const panel = host.querySelector(`[data-coach-for="${fid}"]`);
      if (!panel) return;
      panel.hidden = false;
      panel.innerHTML = '<div class="coach-loading">Evaluando…</div>';
      const value = ctx.getValue(fid);
      if (!value || !String(value).trim()) {
        panel.innerHTML =
          '<div class="coach-honest">El campo está vacío. Escribí algo antes de pedir evaluación.</div>';
        return;
      }
      const { prompt, systemPrompt } = buildCoachPrompt({
        step: ctx.stepN,
        field: fid,
        value,
        context: ctx.getContext()
      });
      const res = await callCoach({ prompt, systemPrompt });
      panel.innerHTML = renderCoachPanel(res);
    });
  });
}

function renderCoachPanel(res) {
  if (res.status === 'unavailable') {
    return `<div class="coach-honest">${escapeHtml(res.message)}</div>`;
  }
  const statusLabel = { ok: 'OK', mejorable: 'Mejorable', no_cumple: 'No cumple' }[res.status];
  const lines = [];
  if (res.diagnostico) lines.push(`<p><strong>Diagnóstico.</strong> ${escapeHtml(res.diagnostico)}</p>`);
  if (res.que_falta) lines.push(`<p><strong>Qué falta.</strong> ${escapeHtml(res.que_falta)}</p>`);
  if (res.pregunta_socratica)
    lines.push(`<p class="socratic">↳ ${escapeHtml(res.pregunta_socratica)}</p>`);
  if (res.ejemplo)
    lines.push(
      `<p class="example"><em>Ejemplo ilustrativo de otro caso — adaptalo, no lo copies:</em><br>${escapeHtml(
        res.ejemplo
      )}</p>`
    );
  return `<div class="coach-result status-${res.status}">
    <div class="coach-status">${statusLabel}</div>${lines.join('')}</div>`;
}
