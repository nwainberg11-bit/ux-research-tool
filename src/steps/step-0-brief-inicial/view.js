// Vista del paso "intro". Pantalla única que se muestra al arrancar un caso
// nuevo (botón "Nuevo caso" o primera vez sin localStorage). El texto es
// opcional y nunca se evalúa con el coach: es insumo, no un campo a redactar.
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';
import { goToStep } from '../../state/store.js';

export const meta = schema;

export function render(data) {
  const fieldsHtml = schema.fields.map((f) => renderField(f, data[f.id] || '')).join('');
  return `
    <span class="step-kicker">Antes de empezar</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Si la empresa ya te dio contexto (un brief, un mail, datos de funnel), pegalo acá. El coach lo va a tener en cuenta en los 8 pasos siguientes. Si no tenés nada todavía, podés dejarlo vacío y arrancar igual.</p>
    <div class="fields">${fieldsHtml}</div>
    <button id="intro-start" class="intro-start-btn">Empezar →</button>`;
}

export function bind(host, ctx) {
  bindFields(host, ctx);
  host.querySelector('#intro-start')?.addEventListener('click', () => goToStep('1'));
}
