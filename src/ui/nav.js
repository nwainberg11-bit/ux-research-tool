// Navegación lineal por la secuencia canónica (SPEC-V2 §2). No se saltea el orden.
import { orderedKeys } from '../source/steps.js';
import { getState, goToStep } from '../state/store.js';

export function prevKey() {
  const keys = orderedKeys();
  const i = keys.indexOf(getState().currentStep);
  return i > 0 ? keys[i - 1] : null;
}

export function nextKey() {
  const keys = orderedKeys();
  const i = keys.indexOf(getState().currentStep);
  return i >= 0 && i < keys.length - 1 ? keys[i + 1] : null;
}

export function goPrev() {
  const k = prevKey();
  if (k) goToStep(k);
}

export function goNext() {
  const k = nextKey();
  if (k) goToStep(k);
}
