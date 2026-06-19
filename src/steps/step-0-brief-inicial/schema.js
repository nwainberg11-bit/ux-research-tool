// Paso "intro" · Brief inicial de la empresa. No es un paso del flujo canónico
// (no entra en SPEC-V2 §2, no se evalúa con coach, no tiene orden de nav).
// Es contexto crudo que el investigador pega antes de arrancar, para que el
// coach lo tenga disponible en los 8 pasos en vez de partir de cero.

export default {
  n: 'intro',
  slug: 'brief-inicial',
  title: 'Brief inicial',
  fields: [
    {
      id: 'texto',
      type: 'textarea',
      label: 'Contexto que te dio la empresa',
      hint:
        'Pegá el brief, mail o resumen que te pasaron: funnel, datos, tickets de soporte, NPS, lo que tengas. Puede venir muy claro o muy crudo — no hace falta que esté prolijo.',
      placeholder:
        'Ej: queremos mejorar la adopción de Pago de Servicios. Conversión actual 12%, principal motivo de abandono según encuesta...',
      required: false,
      ai: false,
      rows: 12
    },
    {
      id: 'email',
      type: 'text',
      label: 'Tu mail',
      hint: 'Dejá tu mail para recibir tu brief armado. Es información privada, usada únicamente para esto.',
      placeholder: 'tu@mail.com',
      required: false,
      ai: false
    }
  ]
};
