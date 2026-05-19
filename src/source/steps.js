// Secuencia canónica de la fuente (SPEC-V2 §2). El orden NO se altera.
// FASE 1 · EL PROBLEMA          → paso 1
// FASE 2 · LOS OBJETIVOS        → pasos 2, 3, 4
// FASE 3 · EL TEST              → pasos 5, 6, 7, 8
// CIERRE  · EL BRIEF            → ensamblado + export .md (entregable final)

export const PHASES = [
  { id: 'p1', label: 'Fase 1 · El problema', steps: [1] },
  { id: 'p2', label: 'Fase 2 · Los objetivos', steps: [2, 3, 4] },
  { id: 'p3', label: 'Fase 3 · El test', steps: [5, 6, 7, 8] },
  { id: 'cierre', label: 'Cierre · El brief', steps: ['brief'] }
];

export const STEPS = [
  { n: 1, slug: 'problema', title: 'Definir el problema', phase: 'p1' },
  { n: 2, slug: 'alcance', title: 'Definir el alcance', phase: 'p2' },
  { n: 3, slug: 'objetivos', title: 'Definir los objetivos', phase: 'p2' },
  { n: 4, slug: 'tipo-test', title: 'Seleccionar el tipo de test', phase: 'p2' },
  { n: 5, slug: 'parametros', title: 'Parámetros de medición', phase: 'p3' },
  { n: 6, slug: 'criterio-exito', title: 'Definir el criterio de éxito', phase: 'p3' },
  { n: 7, slug: 'preguntas', title: 'Construir preguntas', phase: 'p3' },
  { n: 8, slug: 'escenario', title: 'Construir el escenario', phase: 'p3' },
  { n: 'brief', slug: 'brief', title: 'El brief', phase: 'cierre' }
];

export const STEP_BY_N = Object.fromEntries(STEPS.map((s) => [String(s.n), s]));

export function orderedKeys() {
  return STEPS.map((s) => String(s.n));
}
