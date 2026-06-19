// Envío del brief por mail. Mismo principio honesto que el coach (src/coach/client.js):
// nunca un "enviado" falso — si falla, se informa y la vista ofrece el fallback manual.
const ENDPOINT = '/api/lead';
const TIMEOUT_MS = 15000;

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * @param {{ email: string, pdfBase64: string, sessionId: string }} payload
 * @returns {Promise<{ ok: boolean }>}
 */
export async function sendBriefByMail({ email, pdfBase64, sessionId }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_brief', email: email.trim(), pdfBase64, sessionId }),
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
