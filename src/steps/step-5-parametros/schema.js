// Paso 5 · Parámetros de medición (SPEC-V2 §3 paso 5).
// Por CADA objetivo específico del paso 3 → asignar EXACTAMENTE 1 de los 6
// parámetros. El estado se guarda en `byObjective: { [idx]: { paramId } }`.
//
// La vista se renderiza desde view.js (no es un campo plano).

export default {
  n: 5,
  slug: 'parametros',
  title: 'Parámetros de medición',
  fase: 'Fase 3 · El test',
  perObjective: true,
  fields: [] // los controles los maneja la vista (1 select por objetivo)
};
