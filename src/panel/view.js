// Esqueleto del panel de uso. Por ahora /api/metrics devuelve datos mock
// (ver api/metrics.js) — el día que se resuelva cómo loguear eventos reales
// (Apps Script bloqueado desde Vercel, ver pendiente de arquitectura), solo
// hay que cambiar el adentro de esa function; esta vista no se toca.
import { STEP_BY_N, orderedKeys } from '../source/steps.js';

const FUNNEL_STEPS = [
  { key: 'intro', label: 'Brief inicial' },
  ...orderedKeys().map((k) => {
    const s = STEP_BY_N[k];
    return { key: k, label: s.n === 'brief' ? 'Cierre · El brief' : `${k}. ${s.title}` };
  })
];

function pct(n, total) {
  if (!total) return 0;
  return Math.round((n * 100) / total);
}

function renderFunnel(funnelCounts, totalSessions) {
  const rows = FUNNEL_STEPS.map((s, i) => {
    const count = funnelCounts[s.key] || 0;
    const prevCount = i === 0 ? count : funnelCounts[FUNNEL_STEPS[i - 1].key] || 0;
    const dropoff = i === 0 || !prevCount ? null : Math.round(((prevCount - count) * 100) / prevCount);
    return `
      <div class="funnel-row">
        <div class="funnel-label">${s.label}</div>
        <div class="funnel-bar-track">
          <div class="funnel-bar" style="width:${pct(count, totalSessions)}%"></div>
        </div>
        <div class="funnel-count">${count}</div>
        <div class="funnel-dropoff">${dropoff === null ? '' : dropoff > 0 ? `-${dropoff}%` : ''}</div>
      </div>`;
  }).join('');
  return `<div class="funnel">${rows}</div>`;
}

function renderCards(data) {
  const conversion = pct(data.briefSent, data.totalSessions);
  const returnRate = pct(data.sessionReturns || 0, data.totalSessions);
  const coachTotal = data.coachEvals?.total || 0;
  return `
    <div class="panel-cards">
      <div class="panel-card">
        <div class="panel-card-value">${data.totalSessions}</div>
        <div class="panel-card-label">Sesiones totales</div>
      </div>
      <div class="panel-card">
        <div class="panel-card-value">${returnRate}%</div>
        <div class="panel-card-label">Volvieron a la sesión</div>
      </div>
      <div class="panel-card">
        <div class="panel-card-value">${data.briefSent}</div>
        <div class="panel-card-label">Briefs enviados</div>
      </div>
      <div class="panel-card">
        <div class="panel-card-value">${conversion}%</div>
        <div class="panel-card-label">Conversión a brief enviado</div>
      </div>
      <div class="panel-card">
        <div class="panel-card-value">${data.leadsCollected}</div>
        <div class="panel-card-label">Mails recolectados</div>
      </div>
      <div class="panel-card">
        <div class="panel-card-value">${coachTotal}</div>
        <div class="panel-card-label">Evaluaciones con coach</div>
      </div>
    </div>`;
}

function renderCoachStats(coachEvals) {
  if (!coachEvals?.byStep) return '';
  const rows = Object.entries(coachEvals.byStep)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([step, count]) => `
      <div class="funnel-row">
        <div class="funnel-label">Paso ${step}</div>
        <div class="funnel-bar-track">
          <div class="funnel-bar" style="width:${pct(count, coachEvals.total)}%"></div>
        </div>
        <div class="funnel-count">${count}</div>
        <div class="funnel-dropoff"></div>
      </div>`)
    .join('');
  return `
    <h2 style="margin-top:2rem">Uso del coach por paso</h2>
    <div class="funnel">${rows}</div>`;
}

async function fetchMetrics() {
  const res = await fetch('/api/metrics');
  if (!res.ok) throw new Error('No se pudo cargar /api/metrics');
  return res.json();
}

export function mount(root) {
  root.innerHTML = `
    <div class="panel-shell">
      <span class="step-kicker">Panel de uso</span>
      <h1>UX Research Coach</h1>
      <p class="step-intro">Cuánta gente entra, hasta qué paso llega y cuántos terminan mandando el brief.</p>
      <div id="panel-body" class="panel-loading">Cargando métricas…</div>
    </div>`;

  const body = root.querySelector('#panel-body');

  fetchMetrics()
    .then((data) => {
      body.className = '';
      body.innerHTML = `
        ${data.mock ? '<p class="panel-mock-notice">Datos de ejemplo — todavía no está conectada la fuente real.</p>' : ''}
        ${renderCards(data)}
        ${renderFunnel(data.funnel, data.totalSessions)}
        ${renderCoachStats(data.coachEvals)}`;
    })
    .catch(() => {
      body.className = 'panel-error';
      body.innerHTML = 'No se pudieron cargar las métricas ahora. Probá de nuevo en un momento.';
    });
}
