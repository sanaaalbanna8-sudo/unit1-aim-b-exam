/**
 * امتحان الوحدة 1 · نتاج ب
 * الصق هذا الملف في: Extensions → Apps Script داخل جدول النتائج
 * ثم Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * انسخي رابط Web app وضعيه في config.js → SHEET_URL
 */

var TOKEN = 'UNIT1-AIM-B-2026';

function doGet() {
  return ContentService.createTextOutput('unit1-aim-b-exam-ok');
}

function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (body.token !== TOKEN) {
      return json_({ ok: false, error: 'token' });
    }
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      ensureHeaders_();
      appendResult_(body);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('النتائج');
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName('النتائج');
  }
  sh.setRightToLeft(true);
  return sh;
}

function ensureHeaders_() {
  var sh = sheet_();
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'التاريخ والوقت',
      'الاسم',
      'الشعبة',
      'الدرجة',
      'من',
      'النسبة %',
      'عدد الصحيح',
      'عدد الخطأ',
      'تفاصيل الإجابات'
    ]);
    sh.getRange(1, 1, 1, 9).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
}

function appendResult_(body) {
  var total = Number(body.total) || 60;
  var score = Number(body.score) || 0;
  var pct = total ? Math.round((score / total) * 100) : 0;
  var detail = (body.answers || []).map(function (a, i) {
    return (i + 1) + ':' + (a.isCorrect ? 'صح' : 'خطأ') +
      '(اختارت ' + (a.selectedLetter || '') +
      '/الصحيحة ' + (a.correctLetter || '') + ')';
  }).join(' | ');

  sheet_().appendRow([
    body.at || new Date().toISOString(),
    body.name || '',
    body.klass || '',
    score,
    total,
    pct,
    score,
    total - score,
    detail
  ]);
}

/** شغّلي مرة واحدة من المحرر لتجهيز عناوين الأعمدة */
function setupExamSheet() {
  ensureHeaders_();
}
