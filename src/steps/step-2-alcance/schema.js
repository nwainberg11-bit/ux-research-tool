// Paso 2 · Definir el alcance (SPEC-V2 §3 paso 2).
// La fuente lo pone ANTES del paso 3 (objetivos). Las 6 preguntas a stakeholders
// son guía previa (opcional), no campos del brief.

export default {
  n: 2,
  slug: 'alcance',
  title: 'Definir el alcance',
  fase: 'Fase 2 · Los objetivos',
  fields: [
    {
      id: 'in_scope',
      type: 'textarea',
      label: 'Qué entra (in scope)',
      hint:
        'Listá los flujos, pantallas, perfiles de usuario y dispositivos que SÍ participan del test.',
      placeholder:
        'Ej: flujo completo de reserva de turno desde la pantalla de búsqueda hasta la confirmación, en mobile web, para usuarios primerizos.',
      required: true,
      ai: true,
      rows: 3
    },
    {
      id: 'out_scope',
      type: 'textarea',
      label: 'Qué queda afuera (out of scope)',
      hint:
        'Listá lo que NO participa de este test, aunque podría parecer relacionado. La fuente exige que esté definido explícitamente.',
      placeholder:
        'Ej: pagos, recordatorios por email, panel del profesional, integración con calendario externo, app nativa.',
      required: true,
      ai: true,
      rows: 3
    }
  ]
};
