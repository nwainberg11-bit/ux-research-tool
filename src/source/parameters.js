// Los 6 parámetros de medición (SPEC-V2 §3 paso 5 + §5.4).
// Fuente: material de capacitación, Módulo 3 — "Identificar parámetros de medición".
//
// Reglas duras de la fuente:
// - Cada objetivo específico recibe EXACTAMENTE 1 parámetro.
// - El criterio de éxito sigue la forma típica del parámetro (campo `criterionForm`).
// - El umbral 78% es FIJO y no editable (la fuente lo afirma explícito).

export const SUCCESS_THRESHOLD = 78; // porcentaje fijo, no editable
export const SUCCESS_THRESHOLD_FIXED = true;

export const PARAMETERS = [
  {
    id: 'encontrabilidad',
    label: 'Encontrabilidad / eficacia',
    measures: '% de usuarios que encuentran un elemento en la interfaz.',
    criterionForm: 'Que el usuario haga clic en ___. ≥78%.',
    binary: true
  },
  {
    id: 'comprension',
    label: 'Comprensión / eficacia',
    measures: '% de usuarios que comprenden un label/texto sin ayuda externa.',
    criterionForm: 'Que el usuario mencione a/b/c. ≥78%.',
    binary: true
  },
  {
    id: 'usabilidad',
    label: 'Usabilidad / eficacia',
    measures: '% de usuarios que completan una tarea o un flujo.',
    criterionForm: 'Que el usuario logre [completar flujo / llegar de A a B]. ≥78%.',
    binary: true
  },
  {
    id: 'percepcion',
    label: 'Percepción',
    measures: 'Escala Likert 1–5 (claridad, CES, CSAT u otra).',
    criterionForm: 'Promedio ≥4 en escala 1–5 + pregunta de seguimiento "¿por qué calificás?".',
    binary: false
  },
  {
    id: 'expectativa',
    label: 'Expectativa',
    measures: 'Pregunta abierta: qué espera que pase / cómo cree que funciona.',
    criterionForm: 'Sin criterio binario. Define la hipótesis a validar o refutar.',
    binary: false
  },
  {
    id: 'exploratoria',
    label: 'Exploratoria',
    measures: 'Pregunta abierta de opinión o comportamiento; sirve para descubrir.',
    criterionForm: 'No aplica criterio. Sirve para descubrir, no para validar.',
    binary: false
  }
];

export const PARAM_BY_ID = Object.fromEntries(PARAMETERS.map((p) => [p.id, p]));
