// Vista del paso 5. Itera los objetivos específicos del paso 3 y por cada uno
// permite elegir 1 de los 6 parámetros. Al lado, la definición textual del
// parámetro elegido (de la fuente).
import schema from './schema.js';
import { escapeHtml } from '../../ui/fields.js';
import { PARAMETERS, PARAM_BY_ID } from '../../source/parameters.js';
import { getObjectives, getByObjective, setByObjective } from '../../state/chain.js';

export const meta = schema;

function paramOptions(currentId) {
  return PARAMETERS.map(
    (p) =>
      `<option value="${p.id}" ${currentId === p.id ? 'selected' : ''}>${escapeHtml(
        p.label
      )}</option>`
  ).join('');
}

function paramDefinition(paramId) {
  const p = PARAM_BY_ID[paramId];
  if (!p) return '<p class="hint">Elegí un parámetro para ver qué mide.</p>';
  return `
    <div class="param-def">
      <p><strong>Mide:</strong> ${escapeHtml(p.measures)}</p>
      <p class="hint"><strong>Forma del criterio (paso 6):</strong> ${escapeHtml(p.criterionForm)}</p>
    </div>`;
}

function renderObjective(text, idx) {
  const data = getByObjective(5, idx);
  return `
    <div class="chain-card" data-idx="${idx}">
      <div class="chain-objective">
        <span class="chain-label">Objetivo ${idx + 1}</span>
        <p>${escapeHtml(text)}</p>
      </div>
      <div class="chain-control">
        <label for="p-${idx}">Parámetro de medición</label>
        <select id="p-${idx}" data-param-for="${idx}">
          <option value="">— elegir —</option>
          ${paramOptions(data.paramId)}
        </select>
        <div class="param-def-host" data-def-for="${idx}">${paramDefinition(data.paramId)}</div>
      </div>
    </div>`;
}

export function render() {
  const objectives = getObjectives();
  if (!objectives.length) {
    return `
      <span class="step-kicker">Paso 5 · Fase 3</span>
      <h1>${escapeHtml(schema.title)}</h1>
      <div class="alert">Volvé al paso 3 y cargá al menos un objetivo específico — sin eso no se puede asignar parámetros.</div>`;
  }
  const cards = objectives.map((t, i) => renderObjective(t, i)).join('');
  return `
    <span class="step-kicker">Paso 5 · Fase 3</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Asigná exactamente UN parámetro a cada objetivo específico. La forma del criterio del paso siguiente la define este parámetro.</p>
    <div class="chain">${cards}</div>`;
}

export function bind(host) {
  host.querySelectorAll('[data-param-for]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const idx = Number(sel.dataset.paramFor);
      setByObjective(5, idx, { paramId: sel.value || null });
      const defHost = host.querySelector(`[data-def-for="${idx}"]`);
      if (defHost) defHost.innerHTML = paramDefinition(sel.value);
    });
  });
}
