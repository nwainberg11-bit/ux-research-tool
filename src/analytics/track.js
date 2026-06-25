// Tracking de uso anónimo. Nunca debe romper el flujo ni bloquear la UI:
// si falla o no hay localStorage/sendBeacon disponible, se ignora en silencio.
// No manda contenido del brief ni mail — eso va aparte por src/brief/send.js.
const ENDPOINT = '/api/lead';
const SESSION_KEY = 'uxrc_session_id';

export function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

export const COACH_USE_LIMIT = 3;

function coachKey(step, field) {
  return `uxrc_coach_${step}_${field}`;
}

export function getCoachUseCount(step, field) {
  try {
    return Number(localStorage.getItem(coachKey(step, field)) || 0);
  } catch {
    return 0;
  }
}

export function incrementCoachUseCount(step, field) {
  try {
    const next = getCoachUseCount(step, field) + 1;
    localStorage.setItem(coachKey(step, field), String(next));
    return next;
  } catch {
    return 1;
  }
}

export function trackSessionStart() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    const type = existing ? 'session_resume' : 'session_new';
    getSessionId(); // crea el ID si no existía
    trackEvent(type);
  } catch {
    /* nunca romper el flujo */
  }
}

export function trackEvent(type, extra = {}) {
  try {
    const body = JSON.stringify({
      action: 'event',
      sessionId: getSessionId(),
      type,
      ts: new Date().toISOString(),
      ...extra
    });
    const sent =
      navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    if (!sent) {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(
        () => {}
      );
    }
  } catch {
    /* el tracking nunca debe romper el flujo */
  }
}
