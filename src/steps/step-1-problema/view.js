// Vista del paso 1. Renderiza los 4 campos + el párrafo integrado editable.
// El párrafo se auto-ensambla a partir de los campos cuando el usuario no lo
// editó manualmente; una vez editado, NO lo pisamos.
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';
import { callCoach } from '../../coach/client.js';
import { buildCoachPrompt } from '../../coach/prompts.js';
import { trackEvent } from '../../analytics/track.js';

export const meta = schema;

function hipotesisAvisoHtml(active) {
  return active
    ? `<div class="alert">Causa no validada: esto requiere un discovery previo. Queda como hipótesis.</div>`
    : '';
}

function lowerFirst(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

function autoParagraph(d) {
  const partes = [];
  if (d.quien_que_donde) partes.push(d.quien_que_donde.trim());
  if (d.por_que) {
    const prefix = d.por_que_hipotesis ? 'Hipótesis (a validar): ' : 'Esto sucede porque ';
    partes.push(prefix + lowerFirst(d.por_que.trim()));
  }
  if (d.que_provoca) partes.push('Esto provoca ' + lowerFirst(d.que_provoca.trim()));
  if (d.evidencia) partes.push('Evidencia: ' + d.evidencia.trim());
  return partes.join('. ').replace(/\.\.+/g, '.');
}

export function render(data) {
  const fieldsHtml = schema.fields
    .map((f) =>
      renderField(f, data[f.id] || '', {
        extras: { por_que_hipotesis: !!data.por_que_hipotesis }
      })
    )
    .join('');

  const paragraph = data.paragraph_manual_edit
    ? data.paragraph
    : autoParagraph(data);

  return `
    <span class="step-kicker">Paso 1 · Fase 1</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Describí el problema con cuatro miradas. La fuente exige objetividad: causa desde la experiencia, consecuencia concreta y, si la tenés, evidencia.</p>
    <div data-hipotesis-aviso>${hipotesisAvisoHtml(data.por_que_hipotesis)}</div>
    <div class="fields">${fieldsHtml}</div>

    <section class="output-block">
      <h2>Párrafo integrado del problema</h2>
      <p class="hint">Se arma automáticamente con tus campos. Editalo si querés (queda fijo cuando lo hagas).</p>
      <textarea id="f-paragraph" rows="5" data-field="paragraph">${escapeHtml(paragraph || '')}</textarea>
      ${data.paragraph_manual_edit ? '<small class="hint">Editado manualmente · no se sobrescribe.</small>' : ''}
      <div class="objective-meta">
        <button class="coach-btn small" id="eval-paragraph-btn">Evaluar con coach</button>
      </div>
      <div class="coach-panel" id="coach-paragraph-panel" hidden></div>
    </section>`;
}

export function bind(host, ctx) {
  bindFields(host, ctx);
  const paraEl = host.querySelector('#f-paragraph');
  if (paraEl) {
    paraEl.addEventListener('input', () => {
      ctx.setValue('paragraph', paraEl.value);
      ctx.setValue('paragraph_manual_edit', true);
    });
  }
  const evalBtn = host.querySelector('#eval-paragraph-btn');
  const coachPanel = host.querySelector('#coach-paragraph-panel');
  if (evalBtn && coachPanel) {
    evalBtn.addEventListener('click', async () => {
      const text = ctx.getValue('paragraph') || paraEl?.value || '';
      coachPanel.hidden = false;
      if (!text.trim()) {
        coachPanel.innerHTML = '<div class="coach-honest">El párrafo está vacío.</div>';
        return;
      }
      coachPanel.innerHTML = '<div class="coach-loading">Evaluando…</div>';
      trackEvent('coach_eval', { step: 1, field: 'paragraph' });
      const { prompt, systemPrompt } = buildCoachPrompt({
        step: 1,
        field: 'paragraph',
        value: text,
        context: {
          quien_que_donde: ctx.getValue('quien_que_donde'),
          por_que: ctx.getValue('por_que'),
          que_provoca: ctx.getValue('que_provoca'),
          evidencia: ctx.getValue('evidencia'),
        },
      });
      const res = await callCoach({ prompt, systemPrompt });
      coachPanel.innerHTML = renderCoachPanel(res);
    });
  }

  // Auto-actualizar el párrafo mientras editás campos, mientras no lo hayas
  // tocado manualmente. NO re-renderiza la página (no perdés foco).
  const avisoEl = host.querySelector('[data-hipotesis-aviso]');
  host.querySelectorAll('[data-field]:not(#f-paragraph)').forEach((el) => {
    const evt = el.type === 'checkbox' || el.type === 'radio' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      const d = { ...(ctx.getContext()['paso_1'] || {}) };
      // Reconstruimos data del paso 1 leyendo lo recién seteado en el store.
      ['quien_que_donde', 'por_que', 'que_provoca', 'evidencia', 'por_que_hipotesis'].forEach((k) => {
        d[k] = ctx.getValue(k);
      });
      if (avisoEl) avisoEl.innerHTML = hipotesisAvisoHtml(d.por_que_hipotesis);
      if (!ctx.getValue('paragraph_manual_edit') && paraEl) {
        paraEl.value = autoParagraph(d);
        ctx.setValue('paragraph', paraEl.value);
      }
    });
  });
}

function renderCoachPanel(res) {
  if (res.status === 'unavailable') {
    return `<div class="coach-honest">${escapeHtml(res.message)}</div>`;
  }
  const statusLabel = { ok: 'OK', mejorable: 'Mejorable', no_cumple: 'No cumple' }[res.status];
  const parts = [];
  if (res.diagnostico) parts.push(`<p><strong>Diagnóstico.</strong> ${escapeHtml(res.diagnostico)}</p>`);
  if (res.que_falta) parts.push(`<p><strong>Qué falta.</strong> ${escapeHtml(res.que_falta)}</p>`);
  if (res.pregunta_socratica) parts.push(`<p class="socratic">↳ ${escapeHtml(res.pregunta_socratica)}</p>`);
  if (res.ejemplo) parts.push(`<p class="coach-example"><em>Ejemplo ilustrativo (adaptalo, no lo copies):</em> ${escapeHtml(res.ejemplo)}</p>`);
  return `<div class="coach-result status-${res.status}">
    <div class="coach-status">${statusLabel}</div>${parts.join('')}</div>`;
}
