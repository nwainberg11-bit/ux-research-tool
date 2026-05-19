// Vista del paso 8. Renderiza los 3 campos + el detector de UI/jerga live
// sobre el `relato`. Recordatorio final de la fuente: "probá el escenario
// antes del test real" — visible siempre.
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';
import { detectUIJargon } from '../../coach/validators/ui-jargon-detector.js';

export const meta = schema;

function relatoHits(text) {
  if (!text || !text.trim()) return '';
  const { hits } = detectUIJargon(text);
  if (!hits.length) {
    return '<div class="bias-ok">Sin UI ni jerga detectadas. Recordá probar el escenario antes del test real.</div>';
  }
  const items = hits
    .map(
      (h) => `<li class="bias-hit ${h.kind}">${escapeHtml(h.message)}</li>`
    )
    .join('');
  return `<ul class="bias-hits">${items}</ul>`;
}

export function render(data) {
  const fieldsHtml = schema.fields.map((f) => renderField(f, data[f.id] || '')).join('');
  return `
    <span class="step-kicker">Paso 8 · Fase 3</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Construí la situación que vas a leerle al participante. No describas la interfaz, no anticipes pasos.</p>

    <div class="fields">${fieldsHtml}</div>

    <section class="output-block">
      <h2>Chequeo automático del relato</h2>
      <div data-jargon-host>${relatoHits(data.relato || '')}</div>
      <div class="reminder">Recordatorio de la fuente: probá el escenario con alguien interno antes del test real para detectar ambigüedades.</div>
    </section>`;
}

export function bind(host, ctx) {
  bindFields(host, ctx);
  const relato = host.querySelector('#f-relato');
  const hitsHost = host.querySelector('[data-jargon-host]');
  if (relato && hitsHost) {
    relato.addEventListener('input', () => {
      hitsHost.innerHTML = relatoHits(relato.value);
    });
  }
}
