// Store mínimo F0: estado del brief + persistencia localStorage + suscriptores.
// El esquema por paso se completa en F2/F3; acá sólo el contenedor y la nav.

const KEY = 'uxrc_v2_state';

const initial = {
  currentStep: 'intro',      // string: 'intro' | '1'..'8' | 'brief'
  steps: {},                 // { [stepN]: { ...campos } } — se llena en F2/F3
  meta: { version: '2.0.0-f0', updatedAt: null }
};

let state = load();
const subs = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(initial);
    return { ...structuredClone(initial), ...JSON.parse(raw) };
  } catch {
    return structuredClone(initial);
  }
}

function persist() {
  state.meta.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* cuota llena / modo privado: el flujo no se bloquea */
  }
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

function emit() {
  subs.forEach((fn) => fn(state));
}

export function goToStep(stepN) {
  state.currentStep = String(stepN);
  persist();
  emit();
}

export function setStepData(stepN, data) {
  state.steps[String(stepN)] = { ...(state.steps[String(stepN)] || {}), ...data };
  persist();
  emit();
}

export function resetAll() {
  state = structuredClone(initial);
  persist();
  emit();
}
