// ──────────────────────────────────────────────────────────────
//  Atelier Sur Cours — Google Apps Script
//  Paste this file in the Apps Script editor (Extensions → Apps Script)
//  then deploy as a Web App.
// ──────────────────────────────────────────────────────────────

const SHEET_ID    = 'YOUR_SHEET_ID';   // ← replace with your Google Sheet ID
const SHEET_NAME  = 'Clients';         // name of the tab in your spreadsheet
const OWNER_EMAIL = 'YOUR_EMAIL';      // optional: receives an email on each submission

// Column order — must match the header row in the sheet
const COLUMNS = [
  'nomEntreprise', 'siren',
  'civilite', 'nom', 'prenom', 'telephone', 'email',
  'adresse', 'codePostal', 'ville', 'pays',
  'notes'
];

/**
 * Handles POST requests from the web form.
 * Body must be a JSON string with the field keys listed in COLUMNS.
 */
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    // Build the row in the correct order, then append the timestamp
    const row = COLUMNS.map(key => (data[key] || '').toString().trim());
    row.push(new Date());   // Timestamp — last column

    sheet.appendRow(row);

    // Optional email notification
    if (OWNER_EMAIL && OWNER_EMAIL !== 'YOUR_EMAIL') {
      const subject = `Nouveau client : ${data.nomEntreprise || ''} — ${data.nom || ''} ${data.prenom || ''}`;
      const body    = COLUMNS.map(k => `${k}: ${data[k] || ''}`).join('\n');
      MailApp.sendEmail(OWNER_EMAIL, subject, body);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Simple GET handler — useful for a quick health-check in the browser.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Web App is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
