// Shell de la app: sidebar con las 3 fases + cierre, área de contenido y nav.
// Si un paso tiene view.js, se delega a su render/bind; si no, placeholder F0.
import { PHASES, STEP_BY_N } from '../source/steps.js';
import { schemas, views } from '../steps/index.js';
import { getState, goToStep, setStepData, subscribe, resetAll } from '../state/store.js';
import { goPrev, goNext, prevKey, nextKey } from './nav.js';
import { trackEvent, trackSessionStart } from '../analytics/track.js';

function renderSidebar(current) {
  return PHASES.map((ph) => {
    const items = ph.steps
      .map((n) => {
        const s = STEP_BY_N[String(n)];
        const active = String(n) === current ? ' active' : '';
        const label = n === 'brief' ? s.title : `${n}. ${s.title}`;
        return `<li class="nav-item${active}" data-step="${n}">${label}</li>`;
      })
      .join('');
    return `<div class="phase"><h3>${ph.label}</h3><ul>${items}</ul></div>`;
  }).join('');
}

function renderPlaceholder(current) {
  const s = STEP_BY_N[current];
  if (current === 'brief') {
    return `<h1>${s.title}</h1>
      <p class="placeholder">El brief ensamblado y el export <code>.md</code>
      se construyen en F4.</p>`;
  }
  const schema = schemas[current];
  const fieldsTxt =
    schema && schema.fields.length
      ? `${schema.fields.length} campos`
      : 'campos de la fuente → se cablean en F2/F3';
  return `<span class="step-kicker">Paso ${current}</span>
    <h1>${s.title}</h1>
    <p class="placeholder">Este paso aún no tiene vista cableada (${fieldsTxt}).</p>`;
}

function renderNewCaseModal() {
  return `
    <div class="modal-overlay" id="modal-new-case" hidden>
      <div class="modal-card">
        <h3>¿Empezar un caso nuevo?</h3>
        <p>Esto borra todo lo cargado en el caso actual — los 8 pasos y el brief inicial. No se puede deshacer.</p>
        <div class="modal-actions">
          <button id="modal-cancel" class="modal-btn-ghost">Cancelar</button>
          <button id="modal-confirm" class="modal-btn-danger">Sí, empezar de nuevo</button>
        </div>
      </div>
    </div>`;
}

function renderFooter() {
  const p = prevKey();
  const n = nextKey();
  return `
    <button id="btn-prev" ${p ? '' : 'disabled'}>← Anterior</button>
    <button id="btn-next" ${n ? '' : 'disabled'}>Siguiente →</button>`;
}

function buildCtx(stepN, refresh, returnStep) {
  const dataOf = (n) => getState().steps[String(n)] || {};
  return {
    stepN,
    refresh,
    returnStep,
    getValue: (fid) => dataOf(stepN)[fid],
    setValue: (fid, val) => setStepData(stepN, { [fid]: val }),
    getContext: () => {
      // Contexto para el coach: brief inicial de la empresa (siempre, si existe)
      // + snapshot de los pasos previos completados.
      const out = {};
      const intro = dataOf('intro').texto;
      if (intro && intro.trim()) out.brief_inicial = intro;
      ['1', '2', '3', '4', '5', '6', '7', '8']
        .filter((k) => k !== String(stepN))
        .forEach((k) => {
          const d = dataOf(k);
          if (d && Object.keys(d).length) out[`paso_${k}`] = d;
        });
      return out;
    }
  };
}

export function mount(root) {
  trackSessionStart();
  let lastRealStep = '1'; // último paso 1-8/brief visitado, para volver tras editar el brief inicial

  function render() {
    const cur = getState().currentStep;
    trackEvent('step_view', { step: cur });
    if (cur !== 'intro') lastRealStep = cur;
    const view = views[cur];
    const stepBody = view
      ? view.render(getState().steps[cur] || {})
      : renderPlaceholder(cur);

    root.innerHTML = `
      <div class="layout">
        <header class="mobile-topbar">
          <button id="nav-toggle" class="nav-toggle" aria-label="Abrir menú">☰</button>
          <span class="brand">UX Coach</span>
        </header>
        <aside class="sidebar">
          <a href="https://nicowainberg.com" class="back-to-portfolio">
            <span class="back-arrow">←</span>
            <span class="back-text"><strong>Nico Wainberg</strong><small>UX Coach Ontológico</small></span>
          </a>
          <div class="brand">UX Research Coach <span class="tag">v2</span></div>
          <button id="btn-new-case" class="new-case-btn">+ Nuevo caso</button>
          <button id="btn-view-case" class="view-case-btn">Ver el caso</button>
          ${renderSidebar(cur)}
        </aside>
        <div class="sidebar-overlay" id="sidebar-overlay" hidden></div>
        <main class="content">
          <section class="step">${stepBody}</section>
          ${cur === 'intro' ? '' : `<footer class="nav-footer">${renderFooter()}</footer>`}
        </main>
      </div>
      ${renderNewCaseModal()}`;

    const sidebarEl = root.querySelector('.sidebar');
    const overlayEl = root.querySelector('#sidebar-overlay');
    const closeDrawer = () => {
      sidebarEl.classList.remove('nav-open');
      overlayEl.hidden = true;
    };
    root.querySelector('#nav-toggle')?.addEventListener('click', () => {
      sidebarEl.classList.add('nav-open');
      overlayEl.hidden = false;
    });
    overlayEl?.addEventListener('click', closeDrawer);

    root.querySelectorAll('.nav-item').forEach((el) =>
      el.addEventListener('click', () => goToStep(el.dataset.step))
    );
    root.querySelector('#btn-prev')?.addEventListener('click', goPrev);
    root.querySelector('#btn-next')?.addEventListener('click', goNext);
    root.querySelector('#btn-view-case')?.addEventListener('click', () => goToStep('intro'));

    const modal = root.querySelector('#modal-new-case');
    const closeModal = () => (modal.hidden = true);
    root.querySelector('#btn-new-case')?.addEventListener('click', () => (modal.hidden = false));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    root.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
    root.querySelector('#modal-confirm')?.addEventListener('click', () => {
      closeModal();
      resetAll();
    });

    if (view) {
      const stepEl = root.querySelector('.step');
      const refresh = () => {
        stepEl.innerHTML = view.render(getState().steps[cur] || {});
        view.bind(stepEl, buildCtx(cur, refresh));
      };
      view.bind(stepEl, buildCtx(cur, refresh, lastRealStep));
    }
  }

  // Sólo re-renderiza en cambio de paso, no en cada keystroke (el setValue
  // persiste pero el render lo dispara la nav). Evita el efecto "se cierra el
  // teclado en mobile" o pérdida de foco al tipear.
  let lastStep = null;
  subscribe(() => {
    const cur = getState().currentStep;
    if (cur !== lastStep) {
      lastStep = cur;
      render();
    }
  });
  lastStep = getState().currentStep;
  render();
}
