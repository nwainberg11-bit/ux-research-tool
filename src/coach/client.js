// Cliente del coach AI. Reusa la Netlify function endurecida de v1
// (netlify/functions/coach.js: allowlist origins + rate-limit + validación).
//
// Principio §6.5 (N1): NUNCA quedar colgado. Todo llamado tiene timeout + salida.
// Sin AI disponible → estado honesto, jamás "Analizando…" infinito.
// El contrato completo (§4) y los validadores deterministas (§5) se implementan
// en F2/F3; F0 sólo deja el transporte con el estado honesto cableado.

const ENDPOINT = '/.netlify/functions/coach';
const TIMEOUT_MS = 20000;

const HONEST_FAIL = {
  status: 'unavailable',
  message:
    'El coach no está disponible ahora. Podés seguir armando el brief con la ' +
    'guía de cada paso; volvé a evaluar cuando se reconecte.'
};

export async function evaluateField({ step, field, value, context }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, field, value, context }),
      signal: ctrl.signal
    });
    if (!res.ok) return { ...HONEST_FAIL };
    const data = await res.json();
    return data;
  } catch {
    return { ...HONEST_FAIL };
  } finally {
    clearTimeout(timer);
  }
}

export { HONEST_FAIL };
