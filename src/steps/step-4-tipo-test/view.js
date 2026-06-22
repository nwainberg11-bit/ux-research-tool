// Vista del paso 4. Radio Moderado/No Moderado + tabla comparativa SIEMPRE
// visible al costado (la fuente la pone junto al control).
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';
import { TEST_TYPES } from '../../source/test-types.js';

export const meta = schema;

function comparativeTable() {
  const cols = TEST_TYPES;
  const rows = [
    ['Qué es', 'whatIs'],
    ['Cuándo usar', 'whenToUse'],
    ['Qué obtenemos', 'whatYouGet'],
    ['Ventajas', 'advantages'],
    ['Desventajas', 'disadvantages']
  ];
  const head = cols.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('');
  const body = rows
    .map(
      ([label, key]) => `
      <tr>
        <th scope="row">${escapeHtml(label)}</th>
        ${cols.map((c) => `<td>${escapeHtml(c[key])}</td>`).join('')}
      </tr>`
    )
    .join('');
  return `
    <div class="table-scroll">
      <table class="compare">
        <thead><tr><th></th>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

export function render(data) {
  const fieldsHtml = schema.fields.map((f) => renderField(f, data[f.id] || '')).join('');
  return `
    <span class="step-kicker">Paso 4 · Fase 2</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Moderado o no moderado: la decisión depende de qué necesitás obtener. La tabla está siempre a la vista.</p>

    <div class="layout-2col">
      <div class="col-form">${fieldsHtml}</div>
      <aside class="col-table">${comparativeTable()}</aside>
    </div>`;
}

export function bind(host, ctx) {
  bindFields(host, ctx);
}
