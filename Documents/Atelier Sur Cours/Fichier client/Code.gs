// ──────────────────────────────────────────────────────────────
//  Atelier Sur Cours — Google Apps Script
//  Paste this file in the Apps Script editor (Extensions → Apps Script)
//  then deploy as a Web App.
// ──────────────────────────────────────────────────────────────

const SHEET_ID    = '1OhqncGFd1wXMcymayvpucyx3594D08daSnvTfVx3Ww8';
const SHEET_NAME  = 'Clients';         // name of the tab in your spreadsheet
const OWNER_EMAIL = 'YOUR_EMAIL';      // optional: receives an email on each submission

/**
 * Handles POST requests from the web form.
 * Row order matches the sheet header exactly:
 * Code | Type | Civilité | Nom | Prénom | Raison sociale | Forme juridique | Famille |
 * Téléphone 1 | Portable | Fax | Email | Site web | Informations TVA N° TVA Intra |
 * Commentaire | Adresse 1 | Adresse 2 | Adresse 3 | Code postal | Cedex | Ville | Pays
 */
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    const row = [
      '',                   // Code
      '',                   // Type
      data.civilite  || '', // Civilité
      data.nom       || '', // Nom
      data.prenom    || '', // Prénom
      data.societe   || '', // Raison sociale
      '',                   // Forme juridique
      '',                   // Famille
      data.telephone || '', // Téléphone 1
      '',                   // Portable
      '',                   // Fax
      data.email     || '', // Email
      '',                   // Site web
      '',                   // Informations TVA N° TVA Intra
      '',                   // Commentaire
      data.adresse   || '', // Adresse principale Adresse 1
      '',                   // Adresse principale Adresse 2
      '',                   // Adresse principale Adresse 3
      data.codePostal || '',// Adresse principale Code postal
      '',                   // Adresse principale Cedex
      data.ville     || '', // Adresse principale Ville
      data.pays      || '', // Adresse principale Pays
    ];

    sheet.appendRow(row);

    // Optional email notification
    if (OWNER_EMAIL && OWNER_EMAIL !== 'YOUR_EMAIL') {
      const subject = `Nouveau client : ${data.societe || ''} — ${data.civilite || ''} ${data.nom || ''} ${data.prenom || ''}`;
      const body = [
        `Civilité : ${data.civilite  || ''}`,
        `Nom : ${data.nom            || ''}`,
        `Prénom : ${data.prenom      || ''}`,
        `Société : ${data.societe    || ''}`,
        `Téléphone : ${data.telephone|| ''}`,
        `Email : ${data.email        || ''}`,
        `Adresse : ${data.adresse    || ''}`,
        `Code postal : ${data.codePostal || ''}`,
        `Ville : ${data.ville        || ''}`,
        `Pays : ${data.pays          || ''}`,
      ].join('\n');
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
