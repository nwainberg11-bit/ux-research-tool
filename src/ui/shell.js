// Shell de la app: sidebar con las 3 fases + cierre, área de contenido y nav.
// F0: cada paso renderiza su título y un placeholder. DONE = se navegan los 8 + brief.
import { PHASES, STEP_BY_N } from '../source/steps.js';
import { schemas } from '../steps/index.js';
import { getState, goToStep, subscribe } from '../state/store.js';
import { goPrev, goNext, prevKey, nextKey } from './nav.js';

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

function renderContent(current) {
  const s = STEP_BY_N[current];
  if (!s) return '<p>Paso desconocido.</p>';
  if (current === 'brief') {
    return `
      <h1>${s.title}</h1>
      <p class="placeholder">El brief ensamblado y el export <code>.md</code>
      (el entregable de cierre) se construyen en F4.</p>`;
  }
  const schema = schemas[current];
  const fieldsTxt =
    schema && schema.fields.length
      ? `${schema.fields.length} campos`
      : 'campos de la fuente → se cablean en F2/F3';
  return `
    <span class="step-kicker">Paso ${current}</span>
    <h1>${s.title}</h1>
    <p class="placeholder">Andamiaje F0. Este paso es navegable y vacío
    (${fieldsTxt}).</p>`;
}

function renderFooter() {
  const p = prevKey();
  const n = nextKey();
  return `
    <button id="btn-prev" ${p ? '' : 'disabled'}>← Anterior</button>
    <button id="btn-next" ${n ? '' : 'disabled'}>Siguiente →</button>`;
}

export function mount(root) {
  function render() {
    const cur = getState().currentStep;
    root.innerHTML = `
      <div class="layout">
        <aside class="sidebar">
          <div class="brand">UX Research Coach <span class="tag">v2</span></div>
          ${renderSidebar(cur)}
        </aside>
        <main class="content">
          <section class="step">${renderContent(cur)}</section>
          <footer class="nav-footer">${renderFooter()}</footer>
        </main>
      </div>`;

    root.querySelectorAll('.nav-item').forEach((el) =>
      el.addEventListener('click', () => goToStep(el.dataset.step))
    );
    root.querySelector('#btn-prev')?.addEventListener('click', goPrev);
    root.querySelector('#btn-next')?.addEventListener('click', goNext);
  }

  subscribe(render);
  render();
}
