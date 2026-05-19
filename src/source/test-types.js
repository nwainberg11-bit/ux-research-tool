// Moderado vs No Moderado (SPEC-V2 §3 paso 4).
// Fuente: material de capacitación, Módulo 2 — tabla comparativa. La app la muestra
// SIEMPRE visible junto al radio cuando el usuario está en el paso 4.

export const TEST_TYPES = [
  {
    id: 'moderado',
    label: 'Moderado',
    whatIs:
      'Test con moderador presente que guía la sesión, observa al usuario y puede repreguntar en vivo.',
    whenToUse:
      'Flujo completo, interacciones complejas, necesidad de descubrir motivaciones y modelos mentales.',
    whatYouGet:
      'Observaciones cualitativas profundas, comentarios verbales, modelos mentales, métricas cuantitativas.',
    advantages:
      'Más y mejor info cualitativa. Permite guiar al usuario e indagar los "por qué" en el momento.',
    disadvantages:
      'Más costoso, riesgo de sesgo del moderador, el usuario cambia su comportamiento al ser observado.'
  },
  {
    id: 'no_moderado',
    label: 'No Moderado',
    whatIs:
      'Test sin moderador en vivo. El usuario ejecuta las tareas solo, generalmente vía plataforma.',
    whenToUse:
      'Microflujos, tareas directas, ciclos de iteración rápidos, validación cuantitativa.',
    whatYouGet:
      'Respuestas breves, métricas cuantitativas precisas, heatmaps, datos comportamentales en escala.',
    advantages:
      'Menos costoso, más rápido, sin sesgo de observación, respuestas más sinceras.',
    disadvantages:
      'Poca info cualitativa, no se puede ayudar al usuario si se atasca, el orden de tareas es fijo.'
  }
];

export const TEST_TYPE_BY_ID = Object.fromEntries(TEST_TYPES.map((t) => [t.id, t]));
