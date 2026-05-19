// Shell de la app: sidebar con las 3 fases + cierre, área de contenido y nav.
// Si un paso tiene view.js, se delega a su render/bind; si no, placeholder F0.
import { PHASES, STEP_BY_N } from '../source/steps.js';
import { schemas, views } from '../steps/index.js';
import { getState, goToStep, setStepData, subscribe } from '../state/store.js';
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

function renderFooter() {
  const p = prevKey();
  const n = nextKey();
  return `
    <button id="btn-prev" ${p ? '' : 'disabled'}>← Anterior</button>
    <button id="btn-next" ${n ? '' : 'disabled'}>Siguiente →</button>`;
}

function buildCtx(stepN, refresh) {
  const dataOf = (n) => getState().steps[String(n)] || {};
  return {
    stepN,
    refresh,
    getValue: (fid) => dataOf(stepN)[fid],
    setValue: (fid, val) => setStepData(stepN, { [fid]: val }),
    getContext: () => {
      // Contexto para el coach: snapshot de los pasos previos completados.
      const out = {};
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
  function render() {
    const cur = getState().currentStep;
    const view = views[cur];
    const stepBody = view
      ? view.render(getState().steps[cur] || {})
      : renderPlaceholder(cur);

    root.innerHTML = `
      <div class="layout">
        <aside class="sidebar">
          <div class="brand">UX Research Coach <span class="tag">v2</span></div>
          ${renderSidebar(cur)}
        </aside>
        <main class="content">
          <section class="step">${stepBody}</section>
          <footer class="nav-footer">${renderFooter()}</footer>
        </main>
      </div>`;

    root.querySelectorAll('.nav-item').forEach((el) =>
      el.addEventListener('click', () => goToStep(el.dataset.step))
    );
    root.querySelector('#btn-prev')?.addEventListener('click', goPrev);
    root.querySelector('#btn-next')?.addEventListener('click', goNext);

    if (view) {
      const stepEl = root.querySelector('.step');
      const refresh = () => {
        stepEl.innerHTML = view.render(getState().steps[cur] || {});
        view.bind(stepEl, buildCtx(cur, refresh));
      };
      view.bind(stepEl, buildCtx(cur, refresh));
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
