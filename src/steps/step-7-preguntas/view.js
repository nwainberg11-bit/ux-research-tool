// Vista del paso 7. Por cada objetivo: lista de preguntas con add/remove.
// El bias-detector corre LIVE por pregunta — marca el sesgo / mala práctica
// detectado en el momento, sin esperar al coach AI.
// Las buenas prácticas (§3 paso 7) están siempre visibles arriba.
// El banco por parámetro (§3 paso 7) se renderiza si tiene ejemplos cargados.
import schema from './schema.js';
import { escapeHtml } from '../../ui/fields.js';
import { PARAM_BY_ID } from '../../source/parameters.js';
import { QUESTION_BANK, QUESTION_BEST_PRACTICES } from '../../source/question-bank.js';
import { detectBias } from '../../coach/validators/bias-detector.js';
import { getObjectives, getByObjective, setByObjective } from '../../state/chain.js';

export const meta = schema;

function hitsHtml(question) {
  const hits = detectBias(question);
  if (!hits.length) {
    return question.trim()
      ? '<div class="bias-ok">Sin sesgos ni malas prácticas detectadas.</div>'
      : '';
  }
  const items = hits
    .map(
      (h) =>
        `<li class="bias-hit ${h.kind}">
          <strong>${escapeHtml(h.label)}.</strong> ${escapeHtml(h.message)}
        </li>`
    )
    .join('');
  return `<ul class="bias-hits">${items}</ul>`;
}

function bestPracticesPanel() {
  const items = QUESTION_BEST_PRACTICES.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  return `
    <details class="guide" open>
      <summary>Buenas prácticas — siempre visibles</summary>
      <ul class="best-practices">${items}</ul>
    </details>`;
}

function bankPanel(paramId) {
  const bank = QUESTION_BANK[paramId];
  if (!bank || !bank.examples.length) {
    return `
      <details class="guide">
        <summary>Banco de preguntas para "${escapeHtml(PARAM_BY_ID[paramId]?.label || '')}"</summary>
        <p class="hint">Aún sin ejemplos textuales cargados desde el material de origen. Se completará cuando esté el texto literal (no se inventa).</p>
      </details>`;
  }
  const items = bank.examples
    .map((ex) => `<li>${escapeHtml(ex)}</li>`)
    .join('');
  return `
    <details class="guide">
      <summary>Banco de preguntas para "${escapeHtml(bank.label)}" — ejemplos de la fuente</summary>
      <p class="hint">Ejemplos para inspirarte. <em>Adaptalos, no los copies.</em></p>
      <ul class="bank">${items}</ul>
    </details>`;
}

function renderQuestion(idx, qIdx, q) {
  return `
    <li class="question-item" data-q-idx="${qIdx}">
      <div class="question-row">
        <textarea rows="2" data-question="${idx}:${qIdx}"
          placeholder="Ej: ¿Qué información usás para decidir qué turno reservar?">${escapeHtml(q || '')}</textarea>
        <button class="icon-btn" data-remove-q="${idx}:${qIdx}" title="Quitar">×</button>
      </div>
      ${hitsHtml(q || '')}
    </li>`;
}

function renderObjective(text, idx) {
  const param5 = getByObjective(5, idx);
  const paramLabel = PARAM_BY_ID[param5.paramId]?.label;
  const data = getByObjective(7, idx);
  const questions = Array.isArray(data.questions) ? data.questions : [''];
  const list = questions.map((q, qi) => renderQuestion(idx, qi, q)).join('');
  return `
    <div class="chain-card chain-card-block" data-idx="${idx}">
      <div class="chain-objective">
        <span class="chain-label">Objetivo ${idx + 1}</span>
        <p>${escapeHtml(text)}</p>
        ${paramLabel
          ? `<p class="chain-param">Parámetro: <strong>${escapeHtml(paramLabel)}</strong></p>`
          : '<p class="chain-param warn">Sin parámetro asignado en paso 5.</p>'}
      </div>
      ${param5.paramId ? bankPanel(param5.paramId) : ''}
      <ol class="questions">${list}</ol>
      <button class="add-btn" data-add-q="${idx}">+ Agregar pregunta</button>
    </div>`;
}

export function render() {
  const objectives = getObjectives();
  if (!objectives.length) {
    return `
      <span class="step-kicker">Paso 7 · Fase 3</span>
      <h1>${escapeHtml(schema.title)}</h1>
      <div class="alert">Sin objetivos específicos cargados (paso 3) no hay preguntas que armar.</div>`;
  }
  const cards = objectives.map((t, i) => renderObjective(t, i)).join('');
  return `
    <span class="step-kicker">Paso 7 · Fase 3</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Por cada objetivo, construí las preguntas. El chequeo automático marca sesgos cognitivos y malas prácticas en el momento.</p>
    ${bestPracticesPanel()}
    <div class="chain">${cards}</div>`;
}

export function bind(host, ctx) {
  const readQs = (idx) => {
    const arr = getByObjective(7, idx).questions;
    return Array.isArray(arr) ? [...arr] : [''];
  };
  const writeQs = (idx, next, refresh = false) => {
    setByObjective(7, idx, { questions: next });
    if (refresh) ctx.refresh?.();
  };

  host.querySelectorAll('[data-question]').forEach((el) => {
    el.addEventListener('input', () => {
      const [idx, qi] = el.dataset.question.split(':').map(Number);
      const next = readQs(idx);
      while (next.length <= qi) next.push('');
      next[qi] = el.value;
      writeQs(idx, next);
      // Refrescar SOLO los hits inline, sin re-render: actualizo el sibling.
      const item = el.closest('.question-item');
      const existing = item.querySelector('.bias-hits, .bias-ok');
      const html = hitsHtml(el.value);
      if (existing) existing.outerHTML = html;
      else if (html) item.insertAdjacentHTML('beforeend', html);
    });
  });

  host.querySelectorAll('[data-remove-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [idx, qi] = btn.dataset.removeQ.split(':').map(Number);
      const next = readQs(idx);
      next.splice(qi, 1);
      writeQs(idx, next.length ? next : [''], true);
    });
  });

  host.querySelectorAll('[data-add-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.addQ);
      const next = readQs(idx);
      next.push('');
      writeQs(idx, next, true);
    });
  });
}
