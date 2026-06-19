// Vista del cierre. Renderiza el brief ensamblado en pantalla con
// completitud visible. La única forma de llevárselo es dejar el mail y enviarlo.
import schema from './schema.js';
import { escapeHtml } from '../../ui/fields.js';
import { getState, setStepData } from '../../state/store.js';
import { assembleBrief } from '../../brief/assemble.js';
import { briefToMarkdown } from '../../brief/export.js';
import { completenessLabel } from '../../brief/completeness-labels.js';
import { sendBriefByMail, isValidEmail } from '../../brief/send.js';
import { trackEvent, getSessionId } from '../../analytics/track.js';

export const meta = schema;

function pct(done, total) {
  if (!total) return 0;
  return Math.round((done * 100) / total);
}

function renderObjectivesTable(objectives) {
  const rows = objectives.flatMap((o) =>
    (o.questions.length ? o.questions : ['']).map((q) => ({ o, q }))
  );
  const body = rows
    .map(
      ({ o, q }) => `
      <tr>
        <td>${escapeHtml(o.text)}${
          o.bloomLevel ? ` <span class="bloom-badge ok">${escapeHtml(o.bloomLevel)}</span>` : ''
        }</td>
        <td>${o.parameter ? escapeHtml(o.parameter.label) : '<em class="muted">sin parámetro</em>'}</td>
        <td>${
          o.criterion
            ? escapeHtml(o.criterion) +
              (o.thresholdFixed ? ' <span class="threshold-fixed">78% fijo</span>' : '')
            : '<em class="muted">sin criterio</em>'
        }</td>
        <td>${q ? escapeHtml(q) : '<span class="muted">Sin preguntas cargadas.</span>'}</td>
      </tr>`
    )
    .join('');
  return `
    <table class="brief-table">
      <thead>
        <tr>
          <th>Objetivo específico</th>
          <th>Qué se mide</th>
          <th>Criterio de éxito</th>
          <th>Tarea o pregunta</th>
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>`;
}

export function render() {
  const brief = assembleBrief(getState());
  const c = brief.completeness;
  const cls = c.missing.length === 0 ? 'ok' : c.missing.length <= 3 ? 'warn' : 'bad';
  const missing = c.missing.length
    ? `<details class="missing"><summary>Faltan ${c.missing.length} requisitos para el brief completo</summary>
        <ul>${c.missing.map((k) => `<li>${escapeHtml(completenessLabel(k))}</li>`).join('')}</ul></details>`
    : '<p class="brief-ready">Brief completo. Listo para ir a ejecutar el test.</p>';

  const email = getState().steps.intro?.email || '';

  return `
    <span class="step-kicker">Cierre · El brief</span>
    <h1>${escapeHtml(schema.title)}</h1>
    <p class="step-intro">Acá termina el flujo. El brief es tu entregable — te lo mandamos por mail para que te lo lleves a tu doc de trabajo.</p>

    <div class="brief-meter ${cls}">
      <div class="meter-bar"><span style="width:${pct(c.done, c.total)}%"></span></div>
      <div class="meter-label">${c.done} / ${c.total} requisitos cumplidos</div>
    </div>
    ${missing}

    <div class="brief-mail-gate" data-state="idle">
      <label for="brief-email">Mail para recibir el brief</label>
      <div class="brief-mail-row">
        <input type="email" id="brief-email" placeholder="tu@mail.com" value="${escapeHtml(email)}">
        <button id="brief-send">Enviar brief por mail</button>
      </div>
      <p class="field-hint">Es información privada, usada únicamente para esto.</p>
      <p id="brief-mail-msg" class="brief-mail-msg" hidden></p>
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
        ? renderObjectivesTable(brief.objetivos.especificos)
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
  const buildMd = () => briefToMarkdown(assembleBrief(getState()));

  const gate = host.querySelector('.brief-mail-gate');
  const emailInput = host.querySelector('#brief-email');
  const sendBtn = host.querySelector('#brief-send');
  const msg = host.querySelector('#brief-mail-msg');

  const showMsg = (text) => {
    if (!msg) return;
    msg.textContent = text;
    msg.hidden = false;
  };

  sendBtn?.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      gate.dataset.state = 'error';
      showMsg('Ese mail no parece válido. Revisalo y probá de nuevo.');
      return;
    }
    setStepData('intro', { email });
    gate.dataset.state = 'sending';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Enviando…';
    msg.hidden = true;

    const md = buildMd();
    const { ok } = await sendBriefByMail({ email, markdown: md, sessionId: getSessionId() });

    sendBtn.disabled = false;
    sendBtn.textContent = 'Enviar brief por mail';

    if (ok) {
      gate.dataset.state = 'sent';
      showMsg(`Brief enviado a ${email}. Revisá tu bandeja (y spam).`);
      trackEvent('brief_sent');
    } else {
      gate.dataset.state = 'error';
      showMsg('No pudimos enviarlo ahora. Probá de nuevo en un momento.');
    }
  });
}
