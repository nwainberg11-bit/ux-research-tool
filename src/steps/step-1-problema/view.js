// Vista del paso 1. Renderiza los 4 campos + el párrafo integrado editable.
// El párrafo se auto-ensambla a partir de los campos cuando el usuario no lo
// editó manualmente; una vez editado, NO lo pisamos.
import schema from './schema.js';
import { renderField, bindFields, escapeHtml } from '../../ui/fields.js';

export const meta = schema;

function autoParagraph(d) {
  const partes = [];
  if (d.quien_que_donde) partes.push(d.quien_que_donde.trim());
  if (d.por_que) {
    const prefix = d.por_que_hipotesis ? 'Hipótesis (a validar): ' : 'Esto sucede porque ';
    partes.push(prefix + d.por_que.trim());
  }
  if (d.que_provoca) partes.push('Esto provoca ' + d.que_provoca.trim());
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

  const hipotesisAviso = data.por_que_hipotesis
    ? `<div class="alert">Causa no validada: esto requiere un discovery previo. Queda como hipótesis.</div>`
    : '';

  const paragraph = data.paragraph_manual_edit
    ? data.paragraph
    : autoParagraph(data);

  return `
    <span class="step-kicker">Paso 1 · Fase 1</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Describí el problema con cuatro miradas. La fuente exige objetividad: causa desde la experiencia, consecuencia concreta y, si la tenés, evidencia.</p>
    ${hipotesisAviso}
    <div class="fields">${fieldsHtml}</div>

    <section class="output-block">
      <h2>Párrafo integrado del problema</h2>
      <p class="hint">Se arma automáticamente con tus campos. Editalo si querés (queda fijo cuando lo hagas).</p>
      <textarea id="f-paragraph" rows="5" data-field="paragraph">${escapeHtml(paragraph || '')}</textarea>
      ${data.paragraph_manual_edit ? '<small class="hint">Editado manualmente · no se sobrescribe.</small>' : ''}
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
  // Auto-actualizar el párrafo mientras editás campos, mientras no lo hayas
  // tocado manualmente. NO re-renderiza la página (no perdés foco).
  host.querySelectorAll('[data-field]').forEach((el) => {
    el.addEventListener('input', () => {
      const d = { ...(ctx.getContext()['paso_1'] || {}) };
      // Reconstruimos data del paso 1 leyendo lo recién seteado en el store.
      ['quien_que_donde', 'por_que', 'que_provoca', 'evidencia', 'por_que_hipotesis'].forEach((k) => {
        d[k] = ctx.getValue(k);
      });
      if (!ctx.getValue('paragraph_manual_edit') && paraEl) {
        paraEl.value = autoParagraph(d);
        ctx.setValue('paragraph', paraEl.value);
      }
    });
  });
}
