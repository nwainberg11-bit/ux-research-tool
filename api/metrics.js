// Vercel Serverless Function — api/metrics.js
// TODO: hoy devuelve datos mock. Cuando se resuelva la arquitectura de logging
// (Apps Script Web App quedó bloqueado para llamadas servidor-a-servidor desde
// Vercel, ver pendiente), reemplazar el cuerpo de este handler por la lectura
// real (Google Sheets API u otra fuente) — el shape de la respuesta no cambia,
// así que src/panel/view.js no necesita tocarse.

const MOCK_METRICS = {
  mock: true,
  totalSessions: 42,
  sessionReturns: 12,
  briefSent: 11,
  leadsCollected: 11,
  coachEvals: {
    total: 23,
    byStep: { 1: 8, 3: 15 }
  },
  funnel: {
    intro: 42,
    1: 38,
    2: 30,
    3: 26,
    4: 22,
    5: 19,
    6: 16,
    7: 14,
    8: 12,
    brief: 11
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json(MOCK_METRICS);
}
