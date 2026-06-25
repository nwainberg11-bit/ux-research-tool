// Banco de preguntas por parámetro (SPEC-V2 §3 paso 7 + decisión gate 2026-05-19:
// "textual de la fuente"). Origen: material de capacitación, Módulo 3 —
// "preguntas que funcionan" (ejemplos por parámetro de medición).
//
// PENDIENTE F2/F3: cargar el TEXTO EXACTO de los ejemplos por parámetro desde
// los PDFs del módulo 3. Principio §6.2 (no inventar contexto): la estructura
// vive acá, pero NO se rellenan ejemplos hasta tener el texto literal de la
// fuente — los ejemplos vienen rotulados como "ejemplo de la fuente, adaptalo,
// no lo copies" (§4 contrato del coach + §6.4 N5).

import { PARAMETERS } from './parameters.js';

export const QUESTION_BANK = {
  encontrabilidad: {
    parameter: 'encontrabilidad',
    label: 'Encontrabilidad / eficacia',
    examples: [
      'Imagina que ______, ¿dónde harías clic para __________?',
      'Según lo que ves en la pantalla, ¿dónde harías clic para _________?',
      'Indica con un clic dónde ________.',
      // Preguntas de seguimiento recomendadas (no son tareas, son follow-ups)
      '→ Seguimiento: ¿Por qué hiciste clic en ese lugar?',
      '→ Seguimiento: ¿Por qué crees que ahí encontrarás ____________?',
      '→ Nivel de confianza: ¿Qué tan confiado/a estás de haber encontrado el lugar? (escala 1–5, donde 1 es muy desconfiado/a y 5 muy confiado/a)',
    ],
  },
  comprension: {
    parameter: 'comprension',
    label: 'Comprensión / eficacia',
    examples: [
      // Pantalla general
      '¿Qué entiendes por la información que se muestra en la pantalla?',
      '¿Qué entiendes de lo que se está informando en la pantalla?',
      'Según la imagen, ¿qué entiendes por la información que se muestra?',
      '¿Qué entiendes por la información que te acaba de enviar [marca]? [para notificaciones o correos]',
      'Después de leer esta pantalla, ¿qué entendiste? Explica brevemente.',
      // Paso a seguir
      '¿Qué entiendes que tienes que hacer al ver este mensaje?',
      'Según lo que entendiste del mensaje, ¿cómo seguirías para hacer ________?',
      'Suponiendo que ____________, ¿qué deberías hacer según el mensaje?',
      'En caso de ____________, ¿qué comprendes que podrías hacer según el mensaje?',
      'Según la información entregada, ¿qué puedes hacer con ____________?',
      // Concepto específico
      '¿Qué entiendes por _________ en el contexto de la imagen?',
      '¿Qué comprendes cuando nos referimos a __________ en la pantalla?',
      'Explica con tus palabras qué entiendes por __________ en el contexto de la pantalla.',
      // Contenido específico
      'En tus palabras, ¿qué entiendes del mensaje señalado?',
      'Según lo que ves en esta pantalla, ¿qué entiendes del cuadro destacado?',
      '¿Qué entiendes de la información destacada en el cuadro rojo en la pantalla?',
      'Según lo que entiendes del siguiente mensaje, ¿qué pasó con ________?',
      '¿Qué entiendes por el mensaje destacado sobre __________? (Desliza la pantalla hacia abajo)',
    ],
  },
  usabilidad: {
    parameter: 'usabilidad',
    label: 'Usabilidad / eficacia',
    examples: [
      'Imagina que ______. ¿Qué harías para _______?',
      'Usa el prototipo de abajo para ________.',
      '¿Cómo lo harías para ________, y luego ________?',
    ],
  },
  percepcion: {
    parameter: 'percepcion',
    label: 'Percepción',
    examples: [
      'En escala de 1 a 5, ¿qué tan fácil fue ________? Donde 1 es muy difícil y 5 es muy fácil.',
      'En escala de 1 a 5, ¿qué tan útil es ________? Donde 1 es muy inútil y 5 es muy útil.',
      'En escala de 1 a 5, ¿qué tan suficiente es la información para ________? Donde 1 es muy insuficiente y 5 es muy suficiente.',
      'En escala de 1 a 5, ¿qué tan clara es la información respecto a ________? Donde 1 es muy poco claro y 5 es muy claro.',
      '→ Seguimiento obligatorio después de toda escala: ¿Por qué calificás con esa nota?',
    ],
  },
  expectativa: {
    parameter: 'expectativa',
    label: 'Expectativa',
    examples: [
      '¿Qué esperás que ocurra cuando __________?',
      '¿Qué creés que pasará al ___________?',
      '¿Qué creés que podría ocurrir si _________?',
    ],
  },
  exploratoria: {
    parameter: 'exploratoria',
    label: 'Exploratoria',
    examples: [
      '¿Tenés alguna sugerencia para mejorar esta experiencia?',
      '¿Qué elementos de la página llaman más tu atención?',
      '¿Cómo creés que se podría hacer más fácil este proceso?',
      '¿Hubo algún paso durante el proceso que te resultó confuso o que te llevó más tiempo entender? Si es así, explicá brevemente.',
      '¿Qué elementos te ayudaron a entender los pasos a seguir?',
    ],
  },
};

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
