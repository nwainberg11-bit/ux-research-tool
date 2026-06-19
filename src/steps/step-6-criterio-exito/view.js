// Vista del paso 6. Por cada objetivo, muestra el parámetro elegido en paso 5
// con su forma de criterio prerrellenada. El 78% se muestra como sello fijo
// (no editable). Si el parámetro no se eligió → bloquea con alerta.
import schema from './schema.js';
import { escapeHtml } from '../../ui/fields.js';
import { PARAM_BY_ID, SUCCESS_THRESHOLD } from '../../source/parameters.js';
import { getObjectives, getByObjective, setByObjective } from '../../state/chain.js';

export const meta = schema;

function renderObjective(text, idx) {
  const param5 = getByObjective(5, idx);
  const param = PARAM_BY_ID[param5.paramId];
  const data = getByObjective(6, idx);

  if (!param) {
    return `
      <div class="chain-card" data-idx="${idx}">
        <div class="chain-objective">
          <span class="chain-label">Objetivo ${idx + 1}</span>
          <p>${escapeHtml(text)}</p>
        </div>
        <div class="alert small">Asigná un parámetro en el paso 5 para definir el criterio de este objetivo.</div>
      </div>`;
  }

  const thresholdBadge = param.binary
    ? `<span class="threshold-fixed">Umbral fijo: ${SUCCESS_THRESHOLD}% — no editable</span>`
    : `<span class="threshold-fixed soft">Sin criterio binario — definí qué vas a explorar</span>`;

  return `
    <div class="chain-card" data-idx="${idx}">
      <div class="chain-objective">
        <span class="chain-label">Objetivo ${idx + 1}</span>
        <p>${escapeHtml(text)}</p>
        <p class="chain-param">Parámetro: <strong>${escapeHtml(param.label)}</strong></p>
        <p class="criterion-form-hint">Forma esperada: <em>${escapeHtml(param.criterionForm)}</em></p>
      </div>
      <div class="chain-control">
        <label for="c-${idx}">Criterio de éxito</label>
        <textarea id="c-${idx}" data-criterion-for="${idx}" rows="3"
          placeholder="${escapeHtml(param.criterionForm)}">${escapeHtml(data.criterion || '')}</textarea>
        <div class="criterion-meta">
          ${thresholdBadge}
          <small class="hint">Concreto, no interpretable. Sin "si ve" / "si nota" — mide algo medible.</small>
        </div>
      </div>
    </div>`;
}

export function render() {
  const objectives = getObjectives();
  if (!objectives.length) {
    return `
      <span class="step-kicker">Paso 6 · Fase 3</span>
      <h1>${escapeHtml(schema.title)}</h1>
      <div class="alert">Sin objetivos específicos cargados (paso 3) no se puede definir criterios.</div>`;
  }
  const cards = objectives.map((t, i) => renderObjective(t, i)).join('');
  return `
    <span class="step-kicker">Paso 6 · Fase 3</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Cada criterio sigue la forma típica de su parámetro. El umbral 78% es fijo (decisión de la fuente).</p>
    <div class="chain">${cards}</div>`;
}

export function bind(host) {
  host.querySelectorAll('[data-criterion-for]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.dataset.criterionFor);
      setByObjective(6, idx, { criterion: el.value });
    });
  });
}
