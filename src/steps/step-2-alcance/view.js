// Vista del paso 2. Las 6 preguntas a stakeholders se muestran como guía PREVIA
// colapsable; no son campos del brief (la fuente las pone como ayuda al investigador).
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';
import { STAKEHOLDER_QUESTIONS } from '../../source/stakeholders.js';

export const meta = schema;

function stakeholderGuide() {
  const items = STAKEHOLDER_QUESTIONS.map(
    (q, i) => `<li><strong>${i + 1}.</strong> ${escapeHtml(q.text)}</li>`
  ).join('');
  return `
    <details class="guide">
      <summary>Guía previa · 6 preguntas a stakeholders para definir el alcance</summary>
      <p class="hint">Llevá la respuesta de estas preguntas pensada antes de completar el alcance. No se cargan acá.</p>
      <ol class="stakeholder-list">${items}</ol>
    </details>`;
}

export function render(data) {
  const fieldsHtml = schema.fields.map((f) => renderField(f, data[f.id] || '')).join('');
  return `
    <span class="step-kicker">Paso 2 · Fase 2</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Antes de los objetivos, dejá explícito qué entra y qué queda afuera. La fuente insiste en el "out of scope" definido.</p>
    ${stakeholderGuide()}
    <div class="fields">${fieldsHtml}</div>`;
}

export function bind(host, ctx) {
  bindFields(host, ctx);
}
