// Validador de objetivo específico: arranca con verbo de Bloom (SPEC-V2 §3 paso 3 + §5.3).
// La fuente exige que cada objetivo específico arranque con un verbo de la
// taxonomía de Bloom. El validador NO reescribe; sólo identifica si hay verbo
// y devuelve el nivel cognitivo detectado.

import { VERB_TO_LEVEL, BLOOM_LEVELS, normalize } from '../../source/bloom.js';

/**
 * @typedef {Object} BloomCheck
 * @property {boolean} hasBloomVerb
 * @property {string|null} verb             Verbo detectado (forma original del texto).
 * @property {string|null} levelId          ID del nivel Bloom (conocimiento, ...).
 * @property {string|null} levelLabel       Label humano del nivel.
 * @property {string} message
 */

/**
 * @param {string} objective
 * @returns {BloomCheck}
 */
export function checkBloomVerb(objective) {
  const t = (objective ?? '').trim();
  if (!t) {
    return {
      hasBloomVerb: false,
      verb: null,
      levelId: null,
      levelLabel: null,
      message: 'Vacío. Empezá con un verbo de la taxonomía de Bloom (ej: Identificar, Comprender, Evaluar).'
    };
  }
  const firstWord = t.split(/\s+/, 1)[0];
  const key = normalize(firstWord.replace(/[.,;:]$/, ''));
  const levelId = VERB_TO_LEVEL.get(key);
  if (!levelId) {
    return {
      hasBloomVerb: false,
      verb: firstWord,
      levelId: null,
      levelLabel: null,
      message: `"${firstWord}" no figura en la taxonomía de Bloom de la fuente. Reformulá empezando con un verbo de los 6 niveles (Conocimiento, Comprensión, Aplicación, Análisis, Síntesis, Evaluación).`
    };
  }
  const level = BLOOM_LEVELS.find((l) => l.id === levelId);
  return {
    hasBloomVerb: true,
    verb: firstWord,
    levelId,
    levelLabel: level.label,
    message: `Verbo "${firstWord}" — nivel ${level.label}.`
  };
}
