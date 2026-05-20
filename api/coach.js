// Vercel Serverless Function — api/coach.js
// Convertido desde netlify/functions/coach.js.
// Proxy entre el frontend y Gemini API.
// La GEMINI_API_KEY vive en Vercel env vars — nunca llega al cliente.

const MAX_PROMPT_CHARS        = 8_000;
const MAX_SYSTEM_PROMPT_CHARS = 4_000;
const RATE_LIMIT_WINDOW_MS    = 60_000;
const RATE_LIMIT_MAX          = 20;

export const config = {
  api: { bodyParser: { sizeLimit: '12kb' } }
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
  const fresh = arr.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_MAX) {
    rateStore.set(ip, fresh);
    return { ok: false, retryAfter: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - fresh[0])) / 1000) };
  }
  fresh.push(now);
  rateStore.set(ip, fresh);
  if (rateStore.size > 1000) {
    for (const [k, v] of rateStore) {
      if (v.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) rateStore.delete(k);
    }
  }
  return { ok: true };
}

function getAllowedOrigins(req) {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) return env.split(',').map(s => s.trim()).filter(Boolean);
  const host = req.headers.host;
  return host ? [`https://${host}`] : [];
}

function setCorsHeaders(res, origin, allowed) {
  if (!origin || !allowed.includes(origin)) return;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export default async function handler(req, res) {
  const origin  = req.headers.origin;
  const allowed = getAllowedOrigins(req);
  setCorsHeaders(res, origin, allowed);

  if (req.method === 'OPTIONS') {
    return res.status(origin && allowed.includes(origin) ? 204 : 403).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (origin && !allowed.includes(origin)) {
    return res.status(403).json({ error: 'Origin no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key no configurada. Agregá GEMINI_API_KEY en Vercel → Settings → Environment Variables.'
    });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Demasiados pedidos, esperá un momento.' });
  }

  const { prompt, systemPrompt } = req.body || {};

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Falta el campo prompt' });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return res.status(400).json({ error: `prompt excede ${MAX_PROMPT_CHARS} caracteres` });
  }
  if (systemPrompt !== undefined) {
    if (typeof systemPrompt !== 'string') {
      return res.status(400).json({ error: 'systemPrompt debe ser string' });
    }
    if (systemPrompt.length > MAX_SYSTEM_PROMPT_CHARS) {
      return res.status(400).json({ error: `systemPrompt excede ${MAX_SYSTEM_PROMPT_CHARS} caracteres` });
    }
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Error de Gemini', detail: errText });
    }

    const data = await response.json();
    const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { parsed = { raw }; }

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: 'Error interno', detail: err.message });
  }
}
