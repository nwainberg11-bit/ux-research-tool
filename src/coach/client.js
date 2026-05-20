// Cliente del coach AI. Llama a la Netlify function `coach.js` (reusada de v1,
// ya endurecida: allowlist origins + rate-limit + validación input).
//
// Contrato §4 SPEC-V2:
// - Envia { prompt, systemPrompt } (formato que la function ya conoce).
// - Espera JSON: { status: 'ok'|'mejorable'|'no_cumple'|'unavailable',
//                  diagnostico, que_falta, pregunta_socratica, ejemplo? }
// - Principio §6.5 (N1): NUNCA quedar colgado — timeout 20s con AbortController.
// - Sin AI disponible / error / parseo roto → estado honesto, jamás "Analizando…"
//   eterno y jamás se inventa un resultado.

const ENDPOINT = '/api/coach';
const TIMEOUT_MS = 20000;

const UNAVAILABLE = {
  status: 'unavailable',
  diagnostico: '',
  que_falta: '',
  pregunta_socratica: '',
  message:
    'El coach no está disponible ahora. Podés seguir armando el brief con la ' +
    'guía de cada paso; volvé a evaluar cuando se reconecte.'
};

/**
 * @param {{ prompt: string, systemPrompt: string }} payload
 * @returns {Promise<object>} respuesta del coach o UNAVAILABLE
 */
export async function callCoach({ prompt, systemPrompt }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemPrompt }),
      signal: ctrl.signal
    });
    if (!res.ok) return { ...UNAVAILABLE };
    const data = await res.json();
    // La function devuelve { text } (string JSON-like de Gemini) o un objeto plano.
    // Aceptamos ambas formas; si no parsea, devolvemos honesto.
    const raw = typeof data === 'string' ? data : data.text || data.raw || data;
    return normalizeCoachResponse(raw);
  } catch {
    return { ...UNAVAILABLE };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeCoachResponse(raw) {
  let obj = raw;
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch {
      return { ...UNAVAILABLE };
    }
  }
  if (!obj || typeof obj !== 'object') return { ...UNAVAILABLE };

  const status = ['ok', 'mejorable', 'no_cumple'].includes(obj.status)
    ? obj.status
    : 'unavailable';
  if (status === 'unavailable') return { ...UNAVAILABLE };

  return {
    status,
    diagnostico: String(obj.diagnostico || '').slice(0, 600),
    que_falta: String(obj.que_falta || '').slice(0, 400),
    pregunta_socratica: String(obj.pregunta_socratica || '').slice(0, 300),
    ejemplo: obj.ejemplo ? String(obj.ejemplo).slice(0, 500) : null
  };
}

export { UNAVAILABLE };
