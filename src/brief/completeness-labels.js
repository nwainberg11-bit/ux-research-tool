// Etiquetas humanas para las claves de completitud del brief (assemble.js).
// Separado de assemble.js para que la lógica de completitud siga pura
// y las claves estables se usen como ID, no como texto mostrado al usuario.

const LABELS = {
  'paso_1.quien_que_donde': 'Paso 1 — Quién, qué, dónde',
  'paso_1.por_que': 'Paso 1 — Por qué',
  'paso_1.que_provoca': 'Paso 1 — Qué provoca',
  'paso_2.in_scope': 'Paso 2 — Qué entra (in scope)',
  'paso_2.out_scope': 'Paso 2 — Qué queda afuera (out of scope)',
  'paso_3.objetivo_general': 'Paso 3 — Objetivo general',
  'paso_3.objetivos_especificos': 'Paso 3 — Al menos un objetivo específico',
  'paso_4.tipo': 'Paso 4 — Tipo de test',
  'paso_4.justificacion': 'Paso 4 — Justificación del tipo de test',
  'paso_5.parametros': 'Paso 5 — Parámetro asignado a cada objetivo',
  'paso_6.criterios': 'Paso 6 — Criterio de éxito de cada objetivo',
  'paso_7.preguntas': 'Paso 7 — Al menos una pregunta por objetivo',
  'paso_8.relato': 'Paso 8 — Relato final del escenario'
};

export function completenessLabel(key) {
  return LABELS[key] || key;
}
