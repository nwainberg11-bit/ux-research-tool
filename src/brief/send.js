// Envío del brief por mail. Mismo principio honesto que el coach (src/coach/client.js):
// nunca un "enviado" falso — si falla, se informa y la vista ofrece el fallback manual.
const ENDPOINT = '/api/lead';
const TIMEOUT_MS = 15000;

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

/**
 * @param {{ email: string, markdown: string, sessionId: string }} payload
 * @returns {Promise<{ ok: boolean }>}
 */
export async function sendBriefByMail({ email, markdown, sessionId }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_brief', email: email.trim(), markdown, sessionId }),
      signal: ctrl.signal
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: !!data.ok };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
