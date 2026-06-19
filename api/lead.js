// Vercel Serverless Function — api/lead.js
// Proxy entre el frontend y el webhook de Apps Script (envío de mail + Sheet de leads/eventos).
// La URL del webhook vive en Vercel env vars — nunca llega al cliente.
// Mismo patrón de endurecimiento que api/coach.js: rate-limit + validación de input.
//
// PAUSADO (2026-06-19): Google bloquea las llamadas servidor-a-servidor desde
// IPs de datacenter (Vercel/AWS) hacia script.google.com/.../exec con un 404 —
// no es un bug de este código, es un bloqueo del lado de Google. Mientras no
// se resuelva (alternativa: Resend + Google Sheets API con cuenta de servicio),
// este endpoint no funciona en producción. No exponer la URL al cliente como
// workaround — fue evaluado y descartado por riesgo de abuso del mail.

const MAX_PDF_BASE64_CHARS = 2_000_000; // ~1.5MB de PDF, de sobra para un brief de texto
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

export const config = {
  api: { bodyParser: { sizeLimit: '3mb' } }
};

const rateStore = new Map();

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  return req.headers['client-ip'] || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const arr = rateStore.get(ip) || [];
  const fresh = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_MAX) {
    rateStore.set(ip, fresh);
    return { ok: false, retryAfter: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - fresh[0])) / 1000) };
  }
  fresh.push(now);
  rateStore.set(ip, fresh);
  if (rateStore.size > 1000) {
    for (const [k, v] of rateStore) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateStore.delete(k);
    }
  }
  return { ok: true };
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook no configurado' });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Demasiados pedidos, esperá un momento.' });
  }

  const body = req.body || {};

  if (body.action === 'send_brief') {
    if (!isValidEmail(body.email)) {
      return res.status(400).json({ error: 'Mail inválido' });
    }
    if (typeof body.pdfBase64 !== 'string' || !body.pdfBase64.trim()) {
      return res.status(400).json({ error: 'Falta el PDF del brief' });
    }
    if (body.pdfBase64.length > MAX_PDF_BASE64_CHARS) {
      return res.status(400).json({ error: 'El PDF es demasiado pesado' });
    }
  } else if (body.action === 'event') {
    if (typeof body.type !== 'string' || !body.type.trim()) {
      return res.status(400).json({ error: 'Falta type' });
    }
  } else {
    return res.status(400).json({ error: 'Acción inválida' });
  }

  try {
    // Apps Script /exec responde con un 302 a script.googleusercontent.com que
    // solo acepta GET — seguimos el redirect a mano en vez de dejar que fetch
    // lo siga automático. Aun así, Google devuelve 404 en el primer salto
    // cuando la llamada sale de una IP de datacenter (ver nota arriba).
    let r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'manual'
    });
    if (r.status >= 300 && r.status < 400 && r.headers.get('location')) {
      r = await fetch(r.headers.get('location'));
    }
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch {
    return res.status(502).json({ ok: false, error: 'No se pudo contactar el webhook' });
  }
}
