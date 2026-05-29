// Netlify Function — coach.js
// Proxy entre el HTML y Gemini API.
// La GEMINI_API_KEY vive en Netlify env vars — nunca llega al cliente.
//
// Seguridad:
// - Allowlist de origins (env ALLOWED_ORIGINS, coma-separados). Si no está,
//   se permite solo same-origin del propio deploy.
// - Rate limit por IP (sliding window in-memory).
// - Validación de tamaño de body y de cada campo.

const MAX_BODY_BYTES        = 12_000;   // ~12KB del payload completo
const MAX_PROMPT_CHARS      = 8_000;
const MAX_SYSTEM_PROMPT_CHARS = 4_000;
const RATE_LIMIT_WINDOW_MS  = 60_000;   // 1 minuto
const RATE_LIMIT_MAX        = 20;       // 20 reqs/min por IP

// In-memory store (vive mientras la function esté "warm"). Suficiente como
// primera barrera anti-abuso; para producción real usar Netlify Blobs / KV.
const rateStore = new Map();

function getClientIp(event) {
  const xff = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'];
  if (xff) return xff.split(',')[0].trim();
  return event.headers?.['client-ip'] || 'unknown';
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

function getAllowedOrigins(event) {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) return env.split(',').map(s => s.trim()).filter(Boolean);
  const host = event.headers?.host || event.headers?.Host;
  return host ? [`https://${host}`] : [];
}

function corsHeaders(origin, allowed) {
  if (!origin || !allowed.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

exports.handler = async (event) => {
  const origin  = event.headers?.origin || event.headers?.Origin;
  const allowed = getAllowedOrigins(event);
  const cors    = corsHeaders(origin, allowed);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: cors['Access-Control-Allow-Origin'] ? 204 : 403, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (origin && !allowed.includes(origin)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Origin no permitido' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: 'API key no configurada en Netlify. Agregá GEMINI_API_KEY en Environment Variables.' })
    };
  }

  const ip = getClientIp(event);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return {
      statusCode: 429,
      headers: { ...cors, 'Retry-After': String(rl.retryAfter) },
      body: JSON.stringify({ error: 'Demasiados pedidos, esperá un momento.' })
    };
  }

  const rawBody = event.body || '';
  if (rawBody.length > MAX_BODY_BYTES) {
    return { statusCode: 413, headers: cors, body: JSON.stringify({ error: 'Payload demasiado grande' }) };
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Body inválido' }) };
  }

  const { prompt, systemPrompt } = body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Falta el campo prompt' }) };
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: `prompt excede ${MAX_PROMPT_CHARS} caracteres` }) };
  }
  if (systemPrompt !== undefined) {
    if (typeof systemPrompt !== 'string') {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'systemPrompt debe ser string' }) };
    }
    if (systemPrompt.length > MAX_SYSTEM_PROMPT_CHARS) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: `systemPrompt excede ${MAX_SYSTEM_PROMPT_CHARS} caracteres` }) };
    }
  }

  try {
    // [NICO] gemini-2.0-flash da cuota 0 en la cuenta de Nico (429 RESOURCE_EXHAUSTED);
    // 2.5-flash sí tiene free tier. thinkingBudget:0 evita que el "pensamiento"
    // se coma el presupuesto y corte el JSON a la mitad (verificado 2026-05-29).
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiBody = {
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      systemInstruction: systemPrompt
        ? { parts: [{ text: systemPrompt }] }
        : undefined,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 }
      }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        headers: cors,
        body: JSON.stringify({ error: 'Error de Gemini', detail: errText })
      };
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { parsed = { raw }; }

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: 'Error interno', detail: err.message })
    };
  }
};
