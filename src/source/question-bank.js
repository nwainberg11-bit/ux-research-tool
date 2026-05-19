// Banco de preguntas por parámetro (SPEC-V2 §3 paso 7 + decisión gate 2026-05-19:
// "textual de la fuente"). Origen: Capacitación LATAM, Módulo 3 —
// "preguntas que funcionan" (ejemplos por parámetro de medición).
//
// PENDIENTE F2/F3: cargar el TEXTO EXACTO de los ejemplos por parámetro desde
// los PDFs del módulo 3. Principio §6.2 (no inventar contexto): la estructura
// vive acá, pero NO se rellenan ejemplos hasta tener el texto literal de la
// fuente — los ejemplos vienen rotulados como "ejemplo de la fuente, adaptalo,
// no lo copies" (§4 contrato del coach + §6.4 N5).

import { PARAMETERS } from './parameters.js';

export const QUESTION_BANK = Object.fromEntries(
  PARAMETERS.map((p) => [p.id, { parameter: p.id, label: p.label, examples: [] }])
);

// Las buenas prácticas de redacción (SPEC-V2 §3 paso 7) SÍ son texto literal
// de la fuente y se cargan ya — son criterios, no ejemplos a copiar.
export const QUESTION_BEST_PRACTICES = [
  'Evitar inducir la respuesta. Pregunta única, precisa y concreta.',
  'Evitar recordación: usar tiempo presente, sobre lo que el usuario tiene delante.',
  'Evitar palabras literales de la pantalla.',
  'Evitar lenguaje técnico (a menos que sea jerga del usuario).',
  'Evitar preguntas sí/no, salvo para perfilamiento.',
  'Si hay escala, SIEMPRE acompañar con "¿por qué calificás con esa nota?".'
];
