// Vercel Serverless Function — api/lead.js
// send_brief: envía el brief por mail via Resend (coach@nicowainberg.com).
// event: loguea eventos de uso — por ahora no-op, pendiente conectar analytics.
// Rate-limit + validación de input igual que api/coach.js.

import { Resend } from 'resend';

const MAX_PDF_BASE64_CHARS = 2_000_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const FROM_ADDRESS = 'UX Research Coach <uxrcoach@nicowainberg.com>';
const REPLY_TO    = 'ux.nicowainberg@gmail.com';

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

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Servicio de mail no configurado' });
    }

    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: body.email.trim(),
        replyTo: REPLY_TO,
        subject: 'Tu brief de investigación UX',
        text:
          '¡Gracias por usar el UX Research Coach!\n\n' +
          'Te dejamos adjunto el brief que armaste, listo para compartir con tu equipo ' +
          'o llevar a la ejecución del test.\n\n' +
          'Si te sirvió, contanos qué te pareció — cualquier feedback ayuda a mejorar la herramienta.\n\n' +
          '— UX Research Coach',
        attachments: [
          {
            filename: 'brief-ux-research.pdf',
            content: Buffer.from(body.pdfBase64, 'base64')
          }
        ]
      });
      if (error) {
        console.error('Resend error:', error);
        return res.status(502).json({ ok: false });
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('send_brief error:', err);
      return res.status(502).json({ ok: false });
    }

  } else if (body.action === 'event') {
    // Analytics pendiente — se recibe pero no se persiste por ahora
    return res.status(200).json({ ok: true });

  } else {
    return res.status(400).json({ error: 'Acción inválida' });
  }
}
