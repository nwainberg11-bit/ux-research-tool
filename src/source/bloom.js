// Taxonomía de Bloom — 6 niveles cognitivos (SPEC-V2 §5.3).
// Fuente: material de capacitación, Módulo 2 — "Verbos para objetivos específicos".
// Cada objetivo específico DEBE arrancar con un verbo de esta lista (§3 paso 3).

export const BLOOM_LEVELS = [
  {
    id: 'conocimiento',
    label: 'Conocimiento',
    verbs: ['Adquirir', 'Citar', 'Definir', 'Describir', 'Enunciar', 'Identificar']
  },
  {
    id: 'comprension',
    label: 'Comprensión',
    verbs: [
      'Asociar',
      'Comprender',
      'Demostrar',
      'Ejemplificar',
      'Explicar',
      'Relacionar',
      'Resumir'
    ]
  },
  {
    id: 'aplicacion',
    label: 'Aplicación',
    verbs: [
      'Adaptar',
      'Aplicar',
      'Calcular',
      'Construir',
      'Determinar',
      'Modificar',
      'Resolver',
      'Usar'
    ]
  },
  {
    id: 'analisis',
    label: 'Análisis',
    verbs: ['Analizar', 'Categorizar', 'Contrastar', 'Derivar', 'Detectar', 'Diferenciar', 'Examinar']
  },
  {
    id: 'sintesis',
    label: 'Síntesis',
    verbs: ['Anotar', 'Armar', 'Compilar', 'Crear', 'Diseñar', 'Formular', 'Generar', 'Organizar']
  },
  {
    id: 'evaluacion',
    label: 'Evaluación',
    verbs: [
      'Calificar',
      'Decidir',
      'Elegir',
      'Evaluar',
      'Opinar',
      'Seleccionar',
      'Valorar',
      'Validar'
    ]
  }
];

// Mapa rápido verbo (normalizado) → nivel, para validadores.
export const VERB_TO_LEVEL = (() => {
  const map = new Map();
  for (const lvl of BLOOM_LEVELS) {
    for (const v of lvl.verbs) map.set(normalize(v), lvl.id);
  }
  return map;
})();

export function normalize(s) {
  return s
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}
