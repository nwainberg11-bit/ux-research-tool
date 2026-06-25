// Vista del paso 3. Renderiza el objetivo general (textarea) + la lista de
// objetivos específicos con add/remove. Cada item corre el validador Bloom
// inline (verbo válido + nivel cognitivo) ANTES de pedir coach.
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';
import { checkBloomVerb } from '../../coach/validators/bloom-verb.js';
import { callCoach } from '../../coach/client.js';
import { buildCoachPrompt } from '../../coach/prompts.js';
import { trackEvent } from '../../analytics/track.js';

export const meta = schema;

function bloomBadgeHtml(text) {
  const r = checkBloomVerb(text);
  const badge = r.hasBloomVerb
    ? `<span class="bloom-badge ok">${escapeHtml(r.levelLabel)}</span>`
    : text
      ? `<span class="bloom-badge warn">sin verbo Bloom</span>`
      : '';
  return `${badge}<small class="hint">${escapeHtml(r.message)}</small>`;
}

function renderItem(text, idx) {
  return `
    <li class="objective-item" data-idx="${idx}">
      <div class="objective-row">
        <textarea rows="2" data-objective="${idx}" placeholder="${escapeHtml(
          schema.fields[1].placeholder
        )}">${escapeHtml(text || '')}</textarea>
        <button class="icon-btn" data-remove="${idx}" title="Quitar">×</button>
      </div>
      <div class="objective-meta">
        <span data-bloom-badge="${idx}">${bloomBadgeHtml(text)}</span>
        <button class="coach-btn small" data-eval-objective="${idx}">Evaluar con coach</button>
      </div>
      <div class="coach-panel" data-coach-objective="${idx}" hidden></div>
    </li>`;
}

export function render(data) {
  const general = schema.fields[0];
  const items = Array.isArray(data.objetivos_especificos) ? data.objetivos_especificos : [];
  const list = items.map((t, i) => renderItem(t, i)).join('') || renderItem('', 0);

  return `
    <span class="step-kicker">Paso 3 · Fase 2</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Un objetivo general (en singular) + N específicos que en conjunto lo cubren. Cada específico arranca con un verbo de Bloom.</p>

    <div class="fields">${renderField(general, data[general.id] || '')}</div>

    <section class="block">
      <h2>Objetivos específicos</h2>
      <p class="hint">${escapeHtml(schema.fields[1].hint)}</p>
      <ol class="objectives">${list}</ol>
      <button class="add-btn" data-add-objective="1">+ Agregar objetivo específico</button>
    </section>`;
}

export function bind(host, ctx) {
  bindFields(host, ctx);

  const getItems = () => {
    const arr = ctx.getValue('objetivos_especificos');
    return Array.isArray(arr) ? [...arr] : [];
  };
  const writeItems = (next, withRefresh = false) => {
    ctx.setValue('objetivos_especificos', next);
    if (withRefresh) ctx.refresh?.();
  };

  host.querySelectorAll('[data-objective]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.dataset.objective);
      const next = getItems();
      while (next.length <= idx) next.push('');
      next[idx] = el.value;
      writeItems(next);
      const badge = host.querySelector(`[data-bloom-badge="${idx}"]`);
      if (badge) badge.innerHTML = bloomBadgeHtml(el.value);
    });
  });

  host.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.remove);
      const next = getItems();
      next.splice(idx, 1);
      writeItems(next.length ? next : [''], true);
    });
  });

  host.querySelector('[data-add-objective]')?.addEventListener('click', () => {
    const next = getItems();
    next.push('');
    writeItems(next, true);
  });

  host.querySelectorAll('[data-eval-objective]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const idx = Number(btn.dataset.evalObjective);
      const panel = host.querySelector(`[data-coach-objective="${idx}"]`);
      const text = getItems()[idx] || '';
      panel.hidden = false;
      if (!text.trim()) {
        panel.innerHTML = '<div class="coach-honest">El objetivo está vacío.</div>';
        return;
      }
      // Pre-check determinista: si falta verbo Bloom, no llamamos al coach.
      const b = checkBloomVerb(text);
      if (!b.hasBloomVerb) {
        panel.innerHTML = `<div class="coach-honest">Chequeo automático: ${escapeHtml(b.message)}</div>`;
        return;
      }
      panel.innerHTML = '<div class="coach-loading">Evaluando…</div>';
      trackEvent('coach_eval', { step: 3, field: 'objetivo_especifico', idx });
      const { prompt, systemPrompt } = buildCoachPrompt({
        step: 3,
        field: 'objetivo_especifico',
        value: text,
        context: {
          objetivo_general: ctx.getValue('objetivo_general'),
          nivel_bloom_detectado: b.levelLabel,
          otros_especificos: getItems().filter((_, i) => i !== idx)
        }
      });
      const res = await callCoach({ prompt, systemPrompt });
      panel.innerHTML = renderObjectivePanel(res);
    });
  });
}

function renderObjectivePanel(res) {
  if (res.status === 'unavailable') {
    return `<div class="coach-honest">${escapeHtml(res.message)}</div>`;
  }
  const statusLabel = { ok: 'OK', mejorable: 'Mejorable', no_cumple: 'No cumple' }[res.status];
  const parts = [];
  if (res.diagnostico) parts.push(`<p><strong>Diagnóstico.</strong> ${escapeHtml(res.diagnostico)}</p>`);
  if (res.que_falta) parts.push(`<p><strong>Qué falta.</strong> ${escapeHtml(res.que_falta)}</p>`);
  if (res.pregunta_socratica)
    parts.push(`<p class="socratic">↳ ${escapeHtml(res.pregunta_socratica)}</p>`);
  return `<div class="coach-result status-${res.status}">
    <div class="coach-status">${statusLabel}</div>${parts.join('')}</div>`;
}
