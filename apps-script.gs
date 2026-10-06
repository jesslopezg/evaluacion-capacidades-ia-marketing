function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Resultados') || ss.insertSheet('Resultados');
  const d = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha','Nombre','Código','Intento','Total',
      'Alfabetización IA','Prompting','Evaluación crítica',
      'Aplicación marketing','Riesgo y ética',
      'Prompt','Crítica','Prompt de seguimiento','Justificación'
    ]);
  }

  sheet.appendRow([
    d.date,d.student.name,d.student.id,d.attemptCode,d.total,
    d.dimensions['Alfabetización IA'],
    d.dimensions['Prompting'],
    d.dimensions['Evaluación crítica'],
    d.dimensions['Aplicación en marketing'],
    d.dimensions['Riesgo y ética'],
    d.evidence.prompt,d.evidence.critique,d.evidence.followup,d.evidence.businessJustification
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}