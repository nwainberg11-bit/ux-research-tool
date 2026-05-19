// Paso 1 · Definir el problema (SPEC-V2 §3 paso 1).
// Salida del paso: párrafo de problema integrado, auto-ensamblado y editable.

export default {
  n: 1,
  slug: 'problema',
  title: 'Definir el problema',
  fase: 'Fase 1 · El problema',
  fields: [
    {
      id: 'quien_que_donde',
      type: 'textarea',
      label: 'Quién, qué, dónde',
      hint:
        'Situación en conflicto descrita objetivamente. ¿Quién sufre el problema? ¿Qué le sucede? ¿Cuándo o dónde ocurre? Sin juicio de valor.',
      placeholder:
        'Ej: usuarios que intentan reservar un turno por primera vez no logran completar el formulario en menos de 5 minutos durante el horario de mayor demanda.',
      required: true,
      ai: true,
      rows: 3
    },
    {
      id: 'por_que',
      type: 'textarea',
      label: 'Por qué',
      hint:
        'Causa desde la experiencia del usuario. Si la causa no está validada con discovery previo, marcá la opción de "hipótesis": queda como supuesto a validar.',
      placeholder: 'Ej: el formulario tiene 14 campos y no comunica el orden de prioridad.',
      required: true,
      ai: true,
      rows: 3,
      extras: [
        {
          id: 'por_que_hipotesis',
          type: 'checkbox',
          label:
            'La causa no está validada — queda como hipótesis a validar (requiere discovery previo)'
        }
      ]
    },
    {
      id: 'que_provoca',
      type: 'textarea',
      label: 'Qué provoca',
      hint:
        'Consecuencia actual para el negocio o el usuario: baja de KPI, reclamos, costo, churn.',
      placeholder:
        'Ej: 38% de abandono en el paso 2, +200 tickets/mes pidiendo ayuda para completar el formulario.',
      required: true,
      ai: true,
      rows: 2
    },
    {
      id: 'evidencia',
      type: 'textarea',
      label: 'Evidencia',
      hint:
        'Opcional. Fuentes que validan el problema (analytics, encuestas, sesiones previas, tickets).',
      placeholder:
        'Ej: GA4 funnel paso 1→2 con drop del 38%; 12 tickets/sem con consultas similares.',
      required: false,
      ai: true,
      rows: 2
    }
  ]
};
