// Apps Script Web App — recibe POST de api/lead.js (Vercel).
// Dos acciones:
//   - send_brief: manda el brief por mail y loguea el lead (mail + fecha, sin el contenido del brief).
//   - event: loguea un evento de uso anónimo (sessionId + tipo + paso).
//
// Deploy: Extensiones > Apps Script en una Sheet nueva > pegar este código >
// Implementar > Nueva implementación > Aplicación web > Ejecutar como "Yo",
// Acceso "Cualquier usuario" > copiar la URL > pegarla en Vercel como
// APPS_SCRIPT_WEBHOOK_URL.

const LEADS_SHEET = 'Leads';
const EVENTS_SHEET = 'Events';

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');

  if (body.action === 'send_brief') {
    sendBrief(body);
  } else if (body.action === 'event') {
    logEvent(body);
  } else {
    return jsonResponse({ ok: false, error: 'Acción inválida' });
  }

  return jsonResponse({ ok: true });
}

function sendBrief(body) {
  const email = String(body.email || '').trim();
  const markdown = String(body.markdown || '');

  MailApp.sendEmail({
    to: email,
    subject: 'Tu brief de investigación UX',
    body: markdown
  });

  appendRow(LEADS_SHEET, ['timestamp', 'email', 'sessionId'], [
    new Date(),
    email,
    body.sessionId || ''
  ]);
}

function logEvent(body) {
  appendRow(EVENTS_SHEET, ['timestamp', 'sessionId', 'type', 'step'], [
    new Date(),
    body.sessionId || '',
    body.type || '',
    body.step || ''
  ]);
}

function appendRow(sheetName, headers, row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
  }
  sheet.appendRow(row);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
