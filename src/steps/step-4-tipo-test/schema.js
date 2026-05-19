// Paso 4 · Seleccionar el tipo de test (SPEC-V2 §3 paso 4).
// La tabla comparativa Moderado / No Moderado se muestra siempre visible
// (la vista custom la renderiza desde src/source/test-types.js).

export default {
  n: 4,
  slug: 'tipo-test',
  title: 'Seleccionar el tipo de test',
  fase: 'Fase 2 · Los objetivos',
  fields: [
    {
      id: 'tipo',
      type: 'radio',
      label: 'Tipo de test',
      hint: 'Elegí uno. La tabla de la derecha te ayuda a decidir.',
      options: [
        { value: 'moderado', label: 'Moderado' },
        { value: 'no_moderado', label: 'No moderado' }
      ],
      required: true,
      ai: false
    },
    {
      id: 'justificacion',
      type: 'textarea',
      label: 'Justificación',
      hint:
        'Por qué este tipo es el adecuado para tus objetivos del paso 3. El coach revisa coherencia.',
      placeholder:
        'Ej: elegimos moderado porque buscamos entender los "por qué" detrás de las decisiones del usuario, no sólo medir si completa la tarea.',
      required: true,
      ai: true,
      rows: 3
    }
  ]
};
