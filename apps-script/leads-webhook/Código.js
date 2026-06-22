// Apps Script Web App — recibe POST de api/lead.js (Vercel).
// Dos acciones:
//   - send_brief: manda el brief por mail y loguea el lead (mail + fecha, sin el contenido del brief).
//   - event: loguea un evento de uso anónimo (sessionId + tipo + paso).
//
// Deploy: clasp push && clasp deploy -i <deploymentId> desde esta carpeta
// (ver .clasp.json). La URL del Web App ya está en Vercel como
// APPS_SCRIPT_WEBHOOK_URL — no cambia al redeployar sobre el mismo deploymentId.

const SPREADSHEET_ID = '1vQgEvSj2EsNIkHW3pyDd2d0gO4OpJnD_ZEdtOfUi3f4';
const LEADS_SHEET = 'Leads';
const EVENTS_SHEET = 'Events';
const SENDER_ALIAS = 'ux.nicowainberg@gmail.com'; // debe estar en GmailApp.getAliases() (verificado en "Enviar correo como")

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
  const pdfBlob = Utilities.newBlob(
    Utilities.base64Decode(body.pdfBase64 || ''),
    'application/pdf',
    'brief-ux-research.pdf'
  );

  // MailApp.sendEmail no soporta "from" (solo GmailApp lo soporta, y exige que
  // la dirección esté en GmailApp.getAliases() — alias verificado).
  GmailApp.sendEmail(email, 'Tu brief de investigación UX',
    '¡Gracias por usar el UX Research Coach!\n\n' +
    'Te dejamos adjunto el brief que armaste, listo para compartir con tu equipo ' +
    'o llevar a la ejecución del test.\n\n' +
    'Si te sirvió, contanos qué te pareció — cualquier feedback ayuda a mejorar la herramienta.\n\n' +
    '— UX Research Coach',
    {
      from: SENDER_ALIAS,
      name: 'UX Research Coach',
      attachments: [pdfBlob]
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
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
