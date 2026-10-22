# امتحان الوحدة 1 · نتاج التعلم ب

60 سؤال اختيار من متعدد. الطالبة ترى **نتيجتها فقط**، وجميع النتائج تُرسَل إلى Google Sheet للمعلمة.

## الروابط

| الغرض | الرابط |
| --- | --- |
| صفحة الامتحان للطالبات | https://sanaaalbanna8-sudo.github.io/unit1-aim-b-exam/ |
| مستودع GitHub | https://github.com/sanaaalbanna8-sudo/unit1-aim-b-exam |
| جدول النتائج (للمعلمة) | https://docs.google.com/spreadsheets/d/1QueQEmLPJr0TpRDIq-eMyvWsAdnvV7145Gk-X6FeYCg/edit |
| رابط حفظ النتائج (Web App) | يُضبط في `config.js` → `SHEET_URL` |

## ربط Google Sheet

1. افتحي جدول النتائج.
2. **Extensions → Apps Script**
3. امسحي الكود الافتراضي والصقي محتوى `gas/Code.gs`
4. احفظي المشروع، ثم **Run → setupExamSheet** مرة واحدة (وافقي على الصلاحيات).
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. انسخي رابط Web app وضعيه في `config.js` داخل `SHEET_URL` ثم ارفعي التحديث إلى GitHub.

## التشغيل المحلي

افتحي `index.html` في المتصفح.
