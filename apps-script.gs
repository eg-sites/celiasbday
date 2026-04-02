// ============================================================
// apps-script.gs — Google Apps Script para o Aniversário da Célia
// ============================================================
// Como usar:
//  1. Abre script.google.com
//  2. Cria um novo projeto e cola este código
//  3. Muda o valor de SHEET_NAME se necessário
//  4. Em "Implementar" → "Nova implementação" → Web App
//     - Execute como: Eu (a tua conta)
//     - Quem tem acesso: Qualquer pessoa
//  5. Copia a URL gerada e cola em config.js → googleAppsScriptUrl
// ============================================================

// 🔧 NOME DA SPREADSHEET a criar/usar automaticamente
const SHEET_NAME = 'Confirmações Célia';

// 🔧 NOME DA ABA dentro da Spreadsheet
const TAB_NAME   = 'Respostas';

// Cabeçalhos das colunas (devem corresponder ao payload do frontend)
const HEADERS = [
  'inviteId',
  'guestName',
  'dinnerAttendance',
  'dinnerCompanionsCount',
  'dinnerCompanion1',
  'dinnerCompanion2',
  'dinnerCompanion3',
  'afterAttendance',
  'afterCompanionsMode',
  'afterCompanionsCount',
  'afterCompanion1',
  'afterCompanion2',
  'afterCompanion3',
  'submittedAt',
  'userAgent',
  'source'
];

// ────────────────────────────────────────────────────────────
// getOrCreateSheet — obtém ou cria a Sheet e a aba
// ────────────────────────────────────────────────────────────
function getOrCreateSheet() {
  let ss;
  const files = DriveApp.getFilesByName(SHEET_NAME);
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(SHEET_NAME);
  }

  let sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_NAME);
  }

  // Criar cabeçalhos se a folha estiver vazia
  ensureHeaders(sheet);

  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    const currentHeaders = sheet
      .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length))
      .getValues()[0];
    const headersMatch = HEADERS.every((header, index) => currentHeaders[index] === header);

    if (!headersMatch || currentHeaders.length < HEADERS.length) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
  }

  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#f6d0dd')
    .setFontColor('#7f0912');
  sheet.setFrozenRows(1);
}

// ────────────────────────────────────────────────────────────
// doPost — receber submissões do frontend
// ────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // Construir linha na ordem dos HEADERS
    const row = HEADERS.map(key => {
      const val = data[key];
      if (val === undefined || val === null) return '';
      return String(val);
    });

    sheet.appendRow(row);

    return buildResponse({ success: true, message: 'Confirmação registada com sucesso.' });

  } catch (err) {
    return buildResponse({ success: false, error: err.toString() });
  }
}

// ────────────────────────────────────────────────────────────
// doGet — devolver estatísticas e lista (para o admin)
// ────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'stats';
    const sheet  = getOrCreateSheet();
    const rows   = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return buildResponse({ guests: [], stats: buildStats([]) });
    }

    const headers = rows[0];
    const guests  = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] || ''; });
      return obj;
    });

    const stats = buildStats(guests);

    return buildResponse({ guests, stats });

  } catch (err) {
    return buildResponse({ error: err.toString() });
  }
}

// ────────────────────────────────────────────────────────────
// buildStats — calcular estatísticas agregadas
// ────────────────────────────────────────────────────────────
function buildStats(guests) {
  const dinnerYes = guests.filter(g => g.dinnerAttendance === 'yes');
  const afterYes  = guests.filter(g => g.afterAttendance  === 'yes');

  const dinnerCompanions = dinnerYes.reduce((sum, g) => sum + (parseInt(g.dinnerCompanionsCount) || 0), 0);
  const afterCompanions  = afterYes.reduce((sum, g)  => sum + (parseInt(g.afterCompanionsCount)  || 0), 0);

  return {
    totalResponses:         guests.length,
    dinnerConfirmed:        dinnerYes.length,
    dinnerCompanions:       dinnerCompanions,
    dinnerGrandTotal:       dinnerYes.length + dinnerCompanions,
    afterConfirmed:         afterYes.length,
    afterCompanions:        afterCompanions,
    afterGrandTotal:        afterYes.length + afterCompanions,
    bothConfirmed:          guests.filter(g => g.dinnerAttendance === 'yes' && g.afterAttendance === 'yes').length,
    dinnerOnlyConfirmed:    guests.filter(g => g.dinnerAttendance === 'yes' && g.afterAttendance !== 'yes').length,
    afterOnlyConfirmed:     guests.filter(g => g.dinnerAttendance !== 'yes' && g.afterAttendance === 'yes').length,
    declinedAll:            guests.filter(g => g.dinnerAttendance !== 'yes' && g.afterAttendance !== 'yes').length
  };
}

// ────────────────────────────────────────────────────────────
// buildResponse — construir resposta JSON com headers CORS
// ────────────────────────────────────────────────────────────
function buildResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  // Nota: Apps Script não permite CORS headers customizados em doPost,
  // mas o frontend usa mode: 'no-cors'. Para doGet (admin), o JSON é devolvido normalmente.
  return output;
}
