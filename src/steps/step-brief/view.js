// Vista del cierre. Renderiza el brief ensamblado en pantalla con
// completitud visible y dos acciones: Copiar al portapapeles y Descargar .md.
import schema from './schema.js';
import { escapeHtml } from '../../ui/fields.js';
import { getState } from '../../state/store.js';
import { assembleBrief } from '../../brief/assemble.js';
import { briefToMarkdown } from '../../brief/export.js';
import { completenessLabel } from '../../brief/completeness-labels.js';

export const meta = schema;

function pct(done, total) {
  if (!total) return 0;
  return Math.round((done * 100) / total);
}

function renderObjectiveBlock(o, i) {
  const param = o.parameter?.label || '<em class="muted">sin parámetro</em>';
  const criterion = o.criterion
    ? escapeHtml(o.criterion) +
      (o.thresholdFixed ? ' <span class="threshold-fixed">78% fijo</span>' : '')
    : '<em class="muted">sin criterio</em>';
  const questions = o.questions.length
    ? `<ul class="brief-list">${o.questions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul>`
    : '<p class="muted">Sin preguntas cargadas.</p>';
  return `
    <article class="brief-obj">
      <h4>Objetivo ${i + 1}</h4>
      <blockquote>${escapeHtml(o.text)}${
        o.bloomLevel ? ` <span class="bloom-badge ok">${escapeHtml(o.bloomLevel)}</span>` : ''
      }</blockquote>
      <p><strong>Parámetro:</strong> ${param}</p>
      <p><strong>Criterio:</strong> ${criterion}</p>
      <div><strong>Preguntas:</strong>${questions}</div>
    </article>`;
}

export function render() {
  const brief = assembleBrief(getState());
  const c = brief.completeness;
  const cls = c.missing.length === 0 ? 'ok' : c.missing.length <= 3 ? 'warn' : 'bad';
  const missing = c.missing.length
    ? `<details class="missing"><summary>Faltan ${c.missing.length} requisitos para el brief completo</summary>
        <ul>${c.missing.map((k) => `<li>${escapeHtml(completenessLabel(k))}</li>`).join('')}</ul></details>`
    : '<p class="brief-ready">Brief completo. Listo para ir a ejecutar el test.</p>';

  return `
    <span class="step-kicker">Cierre · El brief</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Acá termina el flujo. El brief es tu entregable: bajalo en Markdown o copialo al portapapeles para llevártelo a tu doc de trabajo.</p>

    <div class="brief-meter ${cls}">
      <div class="meter-bar"><span style="width:${pct(c.done, c.total)}%"></span></div>
      <div class="meter-label">${c.done} / ${c.total} requisitos cumplidos</div>
    </div>
    ${missing}

    <div class="brief-actions">
      <button id="brief-copy">Copiar Markdown</button>
      <button id="brief-download">Descargar .md</button>
      <span id="brief-toast" class="toast" hidden></span>
    </div>

    <section class="brief-doc">
      <h2>Fase 1 · El problema</h2>
      ${brief.problema.paragraph
        ? `<p class="lead">${escapeHtml(brief.problema.paragraph)}</p>`
        : '<p class="muted">Sin párrafo integrado.</p>'}
      ${brief.problema.por_que_hipotesis
        ? '<div class="alert">Causa marcada como hipótesis a validar (no validada con discovery previo).</div>'
        : ''}

      <h2>Fase 2 · Los objetivos</h2>
      <h3>Alcance</h3>
      ${kv('In scope', brief.alcance.in_scope)}
      ${kv('Out of scope', brief.alcance.out_scope)}
      <h3>Objetivos</h3>
      ${brief.objetivos.general
        ? `<p><strong>General:</strong> ${escapeHtml(brief.objetivos.general)}</p>`
        : '<p class="muted">Sin objetivo general.</p>'}
      ${brief.objetivos.especificos.length
        ? `<ol class="brief-list">${brief.objetivos.especificos
            .map(
              (o) =>
                `<li>${escapeHtml(o.text)}${
                  o.bloomLevel
                    ? ` <span class="bloom-badge ok">${escapeHtml(o.bloomLevel)}</span>`
                    : ''
                }</li>`
            )
            .join('')}</ol>`
        : '<p class="muted">Sin objetivos específicos.</p>'}

      <h3>Tipo de test</h3>
      ${brief.tipoTest.label
        ? `<p><strong>${escapeHtml(brief.tipoTest.label)}.</strong> ${escapeHtml(
            brief.tipoTest.justificacion
          )}</p>`
        : '<p class="muted">Sin tipo seleccionado.</p>'}

      <h2>Fase 3 · El test</h2>
      <h3>Trazabilidad por objetivo</h3>
      ${brief.objetivos.especificos.length
        ? brief.objetivos.especificos.map(renderObjectiveBlock).join('')
        : '<p class="muted">Sin objetivos específicos cargados.</p>'}

      <h3>Escenario</h3>
      ${kv('Contexto realista', brief.escenario.contexto_realista)}
      ${kv('Detalles para accionar', brief.escenario.detalles_accionar)}
      ${brief.escenario.relato
        ? `<blockquote class="relato">${escapeHtml(brief.escenario.relato)}</blockquote>`
        : '<p class="muted">Sin relato final.</p>'}
      <p class="reminder">Recordatorio: probá el escenario con alguien interno antes del test real.</p>
    </section>`;
}

function kv(k, v) {
  return v ? `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>` : '';
}

export function bind(host) {
  const toast = host.querySelector('#brief-toast');
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => (toast.hidden = true), 2200);
  };

  const buildMd = () => briefToMarkdown(assembleBrief(getState()));

  host.querySelector('#brief-copy')?.addEventListener('click', async () => {
    const md = buildMd();
    try {
      await navigator.clipboard.writeText(md);
      showToast('Copiado al portapapeles');
    } catch {
      showToast('No se pudo copiar. Usá Descargar .md.');
    }
  });

  host.querySelector('#brief-download')?.addEventListener('click', () => {
    const md = buildMd();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brief-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Descarga iniciada');
  });
}
