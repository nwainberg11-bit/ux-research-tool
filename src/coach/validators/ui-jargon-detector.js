// Detector de UI/jerga en el escenario (SPEC-V2 §5.2 + §3 paso 8).
// Origen: material de capacitación, Módulo 3 — "construir el escenario".
// Portado de v1 `M6_BIAS_PATTERNS` (la lógica HONESTA, no el motor `improveM6Field`
// que reescribía — eso se descarta entero, ver SPEC-V2 §9).
//
// El detector NO reescribe. Sólo señala qué sacar y por qué.

/**
 * @typedef {Object} JargonHit
 * @property {string} id
 * @property {'instruccion_ui'|'anticipa'|'jerga_interna'|'valoracion'|'elemento_ui'|'corto'} kind
 * @property {string} message
 */

const PATTERNS = [
  {
    id: 'instruccion_ui',
    kind: 'instruccion_ui',
    re: /(entrá a|tocá|hacé clic en|presioná|buscá en|andá a la sección)/i,
    message:
      'Estás dando instrucciones de UI. El escenario debe decir QUÉ necesita lograr el usuario, no CÓMO hacerlo.'
  },
  {
    id: 'anticipa_respuesta',
    kind: 'anticipa',
    re: /(queremos ver si encontrás|vamos a evaluar si|vamos a ver si)/i,
    message:
      'Anticipás lo que querés validar e inducís la respuesta. Reformulalo desde la necesidad del usuario, no desde lo que medís.'
  },
  {
    id: 'jerga_interna',
    kind: 'jerga_interna',
    re: /(usá el nuevo flujo|probá la nueva|la nueva (versión|pantalla|app))/i,
    message:
      '"Nuevo flujo" / "nueva versión" es lenguaje interno del equipo. Usá una situación cotidiana y comprensible para el participante.'
  },
  {
    id: 'valoracion_previa',
    kind: 'valoracion',
    re: /imaginá que (la app|el flujo|la pantalla) es (fácil|rápid|simple|mejor)/i,
    message:
      'Cargás el escenario con una valoración positiva. Evitá influir en la percepción del usuario antes de empezar.'
  },
  {
    id: 'elemento_ui',
    kind: 'elemento_ui',
    re: /\b(botón|pantalla|sección|tab|menú|ícono|icono|link|campo|formulario)\b/i,
    message:
      'El escenario describe la interfaz. No debe mencionar elementos de UI — solo la situación y la necesidad.'
  }
];

const MIN_SCENARIO_CHARS = 60;

/**
 * Analiza un escenario completo y devuelve los hits + flag de longitud mínima.
 * @param {string} scenario
 * @returns {{ hits: JargonHit[], tooShort: boolean, length: number }}
 */
export function detectUIJargon(scenario) {
  const t = (scenario ?? '').trim();
  const result = { hits: [], tooShort: false, length: t.length };
  if (!t) return result;

  for (const p of PATTERNS) {
    if (p.re.test(t)) {
      result.hits.push({ id: p.id, kind: p.kind, message: p.message });
    }
  }
  if (t.length < MIN_SCENARIO_CHARS) {
    result.tooShort = true;
    result.hits.push({
      id: 'longitud_minima',
      kind: 'corto',
      message: `El escenario es muy breve (${t.length} caracteres). Necesita al menos una situación + la tarea + una frase que comunique el propósito de la sesión.`
    });
  }
  return result;
}

export { MIN_SCENARIO_CHARS };
