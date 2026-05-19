// Paso 8 · Construir el escenario (SPEC-V2 §3 paso 8).
// La fuente lo pone ÚLTIMO. Validador `ui-jargon-detector` corre live sobre el
// `relato` (campo principal) + recordatorio "probá el escenario antes del test".

export default {
  n: 8,
  slug: 'escenario',
  title: 'Construir el escenario',
  fase: 'Fase 3 · El test',
  fields: [
    {
      id: 'contexto_realista',
      type: 'textarea',
      label: 'Contexto realista',
      hint: 'Situación cotidiana del usuario. ¿Dónde está? ¿Qué venía haciendo? ¿Qué necesita?',
      placeholder:
        'Ej: Es jueves a la tarde. Recién salís del trabajo, querés reservar un turno antes del fin de semana.',
      required: true,
      ai: true,
      rows: 3
    },
    {
      id: 'detalles_accionar',
      type: 'textarea',
      label: 'Detalles para accionar',
      hint:
        'Información mínima para que el usuario pueda imaginar y actuar. Sin descripción de UI, sin pasos del flujo.',
      placeholder:
        'Ej: Conocés al profesional que querés y tenés tu cédula a mano.',
      required: true,
      ai: true,
      rows: 2
    },
    {
      id: 'relato',
      type: 'textarea',
      label: 'Relato final del escenario',
      hint:
        'Redacción final. Sin nombrar la UI ("botón", "pantalla", "tab"), sin pasos del flujo, sin jerga técnica. Breve, accionable.',
      placeholder:
        'Ej: Es jueves a la tarde. Acabás de salir del trabajo y querés reservar un turno con un profesional que ya conocés, antes del fin de semana. Tenés tu cédula a mano.',
      required: true,
      ai: true,
      rows: 5
    }
  ]
};
