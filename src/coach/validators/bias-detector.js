// Detector de sesgos cognitivos + malas prácticas en preguntas (SPEC-V2 §5.1).
// Origen: capacitación LATAM, Módulo 3 — 7 sesgos cognitivos + 6 malas prácticas.
// Portado de v1 `M7_QUESTION_PATTERNS` con los bugs ya corregidos
// (recordación regex y doble-pregunta sin falso positivo en "¿por qué calificás?").
//
// Pura, testeable, sin DOM. Devuelve TODOS los hits encontrados (no early-return)
// para que el coach pueda mostrar el panorama completo.

/**
 * @typedef {Object} BiasHit
 * @property {string} id            ID estable del patrón.
 * @property {'sesgo'|'mala_practica'} kind
 * @property {string} label         Nombre humano (afecto, halo, recordación, ...).
 * @property {string} message       Mensaje accionable para el usuario.
 */

const PATTERNS = [
  // ─── 7 sesgos cognitivos ───────────────────────────────────────────────
  {
    id: 'afecto',
    kind: 'sesgo',
    label: 'Heurística del afecto',
    re: /(¿te parece (fácil|difícil|claro|mejor|peor|bueno|malo|lindo|feo)|¿te gusta|¿qué opinás de|¿qué te parece (la|el|esto|esta))/i,
    message:
      'Heurística del afecto: la pregunta busca opinión/emoción en primera persona. Reformulá en tercera persona y sobre un parámetro funcional (claridad, comprensión, utilidad).'
  },
  {
    id: 'confirmacion',
    kind: 'sesgo',
    label: 'Sesgo de confirmación',
    re: /(¿qué te pareció la solución que (te dimos|te ofrecimos|implementamos|nuestra)|¿cómo te ayudó (nuestra|esta) (app|plataforma|herramienta))/i,
    message:
      'Sesgo de confirmación: asumís que la solución le sirvió. Quitá "solución/nuestra" y dejá que el usuario nombre lo que ve.'
  },
  {
    id: 'ancla',
    kind: 'sesgo',
    label: 'Efecto ancla',
    re: /escala.*(donde 1 es muy bueno|donde 1 es excelente|donde 1 es perfecto|donde 5 es horrible)/i,
    message:
      'Efecto ancla: estás dando connotación a los extremos de la escala. Usá descriptores neutros que mapeen al parámetro (muy poco claro / muy claro, muy insuficiente / muy suficiente).'
  },
  {
    id: 'disponibilidad',
    kind: 'sesgo',
    label: 'Heurística de disponibilidad',
    re: /(¿con qué frecuencia|¿cuántas veces (al día|por semana|por mes))/i,
    message:
      'Heurística de disponibilidad: la gente exagera o atenúa frecuencias según lo reciente. Si necesitás frecuencia, validalo con datos, no solo con auto-reporte.'
  },
  {
    id: 'representatividad',
    kind: 'sesgo',
    label: 'Sesgo de representatividad',
    re: /(¿qué edad tenés|¿cuál es tu (edad|sexo|género)|¿de qué (sexo|género))/i,
    message:
      'Sesgo de representatividad: evitá perfilamiento sin relación directa con el uso del producto. Si lo necesitás, justificá cómo va a ser usado.'
  },
  {
    id: 'halo',
    kind: 'sesgo',
    label: 'Efecto halo',
    re: /(¿qué impresión te da|¿qué onda (esta|el|la)|¿te resulta atractiv|¿es lind|¿se ve bien)/i,
    message:
      'Efecto halo: la pregunta atrae respuestas estéticas en vez de funcionales. Sustituí por un parámetro concreto: claridad, utilidad, comprensión.'
  },
  {
    id: 'proyeccion',
    kind: 'sesgo',
    label: 'Sesgo de proyección',
    re: /(¿usarías (esta|el|la|este)|¿lo usarías|¿comprarías|¿pagarías|¿recomendarías|¿volverías a usar|¿la próxima vez)/i,
    message:
      'Sesgo de proyección: las personas no predicen bien su comportamiento futuro. Para medir comportamiento usá experimentación (A/B). En el test, preguntá por experiencias pasadas concretas.'
  },

  // ─── 6 malas prácticas de redacción ────────────────────────────────────
  {
    id: 'cerrada',
    kind: 'mala_practica',
    label: 'Pregunta cerrada sí/no',
    re: /(¿entendés (la|el|esta|esto)\?|¿lo entendés\?|¿te queda claro\?|¿es claro\?|¿es fácil\?|¿es difícil\?)/i,
    message:
      'Pregunta cerrada (sí/no): no genera información cualitativa accionable. Reformulá abierta: "¿Qué entendés de…?", "¿Qué tan clara/fácil es…?".'
  },
  {
    id: 'recordacion',
    kind: 'mala_practica',
    label: 'Pregunta de recordación',
    // bug corregido (v1 commit posterior): word boundaries en español para no
    // hacer match a "récord", "grabar" u otros falsos positivos.
    re: /\b(record[áa]s|te acord[áa]s|qué (informaci[óo]n|datos|texto) record[áa]s|recuerdas|te acuerdas)\b/i,
    message:
      'Evaluás memoria, no usabilidad. En la vida real el usuario no necesita recordar; necesita usar lo que tiene delante. Reformulá en tiempo presente.'
  },
  {
    id: 'doble_pregunta',
    kind: 'mala_practica',
    label: 'Dos preguntas en una',
    // bug corregido: el seguimiento legítimo "y por qué calificás/elegís/decís"
    // ya NO se marca como doble pregunta.
    re: null,
    test: (v) => {
      if (/¿[^?]+\?\s*y\s*¿/i.test(v)) return true;
      if (
        /¿(c[oó]mo|qu[eé]) .+ y (c[oó]mo|qu[eé]) /i.test(v) &&
        !/y por qu[eé] (calific|eleg|dec|hiciste|preferi)/i.test(v)
      ) {
        return true;
      }
      return false;
    },
    message:
      'Mezclás dos preguntas en una. Separalas para que el usuario pueda responder cada una en orden.'
  },
  {
    id: 'pistas_ui',
    kind: 'mala_practica',
    label: 'Tarea con pistas de UI',
    re: /(entrá a|tocá (el|la|en)|hacé clic|presioná (el|la)|andá a la sección|buscá en (el|la) (tab|menú)|usá el botón)/i,
    message:
      'La pregunta/tarea da pistas del flujo. Debe indicar qué necesita lograr el usuario, no cómo hacerlo. Reformulá desde el objetivo.'
  },
  {
    id: 'elementos_ui',
    kind: 'mala_practica',
    label: 'Menciona elementos de UI',
    re: /\b(botón|pantalla|tab|menú|ícono|icono|sidebar|modal|popup|toast|drawer)\b/i,
    message:
      'La pregunta menciona elementos de interfaz. Reformulá en términos del objetivo del usuario (qué quiere lograr), no de la UI.'
  },
  {
    id: 'sin_seguimiento',
    kind: 'mala_practica',
    label: 'Escala sin "¿por qué calificás?"',
    re: null,
    test: (v) =>
      /escala (de|del) 1 a(l)? 5/i.test(v) &&
      !/(por qu[eé]|qu[eé] te llev[óo]|qu[eé] te hizo)/i.test(v),
    message:
      'Después de una escala, siempre agregá "¿Por qué calificás con esa nota?" para obtener data cualitativa accionable.'
  }
];

/**
 * Detecta todos los sesgos / malas prácticas en una pregunta.
 * @param {string} question
 * @returns {BiasHit[]}
 */
export function detectBias(question) {
  const t = (question ?? '').trim();
  if (!t) return [];
  const hits = [];
  for (const p of PATTERNS) {
    const match = p.test ? p.test(t) : p.re.test(t);
    if (match) {
      hits.push({ id: p.id, kind: p.kind, label: p.label, message: p.message });
    }
  }
  return hits;
}

export { PATTERNS as _PATTERNS_FOR_TEST };
