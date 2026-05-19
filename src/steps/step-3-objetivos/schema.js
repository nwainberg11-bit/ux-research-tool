// Paso 3 · Definir los objetivos (SPEC-V2 §3 paso 3).
// El objetivo específico es una ENTIDAD que viaja con su parámetro / criterio /
// preguntas hasta el paso 7 (decisión clave §3 paso 3).

export default {
  n: 3,
  slug: 'objetivos',
  title: 'Definir los objetivos',
  fase: 'Fase 2 · Los objetivos',
  fields: [
    {
      id: 'objetivo_general',
      type: 'textarea',
      label: 'Objetivo general',
      hint:
        'Uno solo, en singular. Identifica una necesidad (no actividad ni proceso). Distinto al objetivo de negocio. Resumido en una frase.',
      placeholder:
        'Ej: validar si los usuarios primerizos comprenden los pasos necesarios para reservar un turno.',
      required: true,
      ai: true,
      rows: 2
    },
    {
      id: 'objetivos_especificos',
      type: 'list',
      label: 'Objetivos específicos',
      hint:
        'Cada uno arranca con un verbo de la taxonomía de Bloom. Medible, claro, alcanzable. En conjunto cubren el objetivo general.',
      itemHint: 'Empezá con un verbo (Identificar, Evaluar, Comprender, Analizar, Diseñar…)',
      placeholder: 'Ej: Identificar si el usuario reconoce el primer paso del flujo.',
      required: true,
      ai: true,
      minItems: 1
    }
  ]
};
