// Helpers para la cadena de trazabilidad objetivo → parámetro → criterio →
// preguntas (SPEC-V2 §3 paso 3 "decisión de arquitectura clave" + §6.7 N7).
//
// La fuente de verdad de los objetivos específicos vive en steps['3'].
// Los pasos 5/6/7 indexan SUS datos por índice de objetivo en `byObjective`.

import { getState, setStepData } from './store.js';

/** @returns {string[]} */
export function getObjectives() {
  const arr = getState().steps['3']?.objetivos_especificos;
  return Array.isArray(arr) ? arr.filter((t) => String(t || '').trim()) : [];
}

/** @returns {string|undefined} */
export function getObjectiveGeneral() {
  return getState().steps['3']?.objetivo_general;
}

/**
 * @param {number|string} stepN
 * @param {number} idx
 * @returns {object}
 */
export function getByObjective(stepN, idx) {
  const data = getState().steps[String(stepN)] || {};
  return (data.byObjective || {})[String(idx)] || {};
}

/**
 * @param {number|string} stepN
 * @param {number} idx
 * @param {object} patch
 */
export function setByObjective(stepN, idx, patch) {
  const prev = getState().steps[String(stepN)] || {};
  const byObj = { ...(prev.byObjective || {}) };
  byObj[String(idx)] = { ...(byObj[String(idx)] || {}), ...patch };
  setStepData(stepN, { byObjective: byObj });
}
