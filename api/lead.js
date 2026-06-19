// Vercel Serverless Function — api/lead.js
// Proxy entre el frontend y el webhook de Apps Script (envío de mail + Sheet de leads/eventos).
// La URL del webhook vive en Vercel env vars — nunca llega al cliente.
// Mismo patrón de endurecimiento que api/coach.js: rate-limit + validación de input.

const MAX_MARKDOWN_CHARS = 20_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

export const config = {
  api: { bodyParser: { sizeLimit: '64kb' } }
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
    if (typeof body.markdown !== 'string' || !body.markdown.trim()) {
      return res.status(400).json({ error: 'Falta el brief' });
    }
    if (body.markdown.length > MAX_MARKDOWN_CHARS) {
      return res.status(400).json({ error: `brief excede ${MAX_MARKDOWN_CHARS} caracteres` });
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
    // solo acepta GET. Seguimos el redirect a mano (en vez de dejar que fetch
    // lo siga automático) porque en runtime de Vercel el follow automático
    // termina pegándole con POST y devuelve 404/405.
    let r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'manual'
    });
    const debug = { step1Status: r.status, step1Location: r.headers.get('location') };
    if (r.status >= 300 && r.status < 400 && r.headers.get('location')) {
      r = await fetch(r.headers.get('location'));
    }
    const text = await r.text();
    return res
      .status(r.ok ? 200 : 502)
      .json({ ok: r.ok, debug, step2Status: r.status, step2Body: text.slice(0, 200) });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'No se pudo contactar el webhook', debugMessage: err.message });
  }
}
