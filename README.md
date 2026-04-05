# Kurdish Expression Detector

A real-time facial expression detection app that runs entirely in your browser. No API, no server, no data leaves your device.

It maps 478 facial landmarks onto your face using MediaPipe FaceMesh and detects your expression using face-api.js, displaying the result in Sorani Kurdish.

**[Live Demo](https://karo-bakhtiyar.github.io/kurdish-expression-detector)**

---

## What it does

- Draws a 478-point neon green face mesh over your face in real-time
- Detects your current expression and displays it in Sorani Kurdish
- Supports 7 expressions: happy, sad, angry, fearful, disgusted, surprised, and neutral
- Everything runs locally on your device, nothing is uploaded anywhere

---

## How to run

```bash
git clone https://github.com/Karo-Bakhtiyar/kurdish-expression-detector
cd kurdish-expression-detector
npm install
npm run dev
```

Then open `localhost` in your browser and allow camera access.

---

## Tech

- React + Vite
- MediaPipe FaceMesh (`@mediapipe/tasks-vision`) for 478-point face landmark detection
- face-api.js (`@vladmandic/face-api`) for expression classification
- All model weights bundled locally, no internet required after install
- Rabar font for Sorani Kurdish text rendering

---

*Built by [Karo Bakhtiyar](https://github.com/Karo-Bakhtiyar), Sulaymaniyah, Kurdistan, Iraq*

---

<div dir="rtl">

# دیاریکردنی دەربڕینی دەموچاو بە کوردی

ئەپڵیکەیشنێکی ڕاستەوخۆیە (Real-time) بۆ دیاریکردنی دەربڕینەکانی ڕووخسار کە بە تەواوی لەناو وێبگەرەکەتدا کار دەکات. بێ بەکارهێنانی API یان سێرڤەر.

ئەم ئەپە ٤٧٨ خاڵی نیشانەکەری ڕووخسار (Landmarks) لە ڕێگەی MediaPipe FaceMesh دیاری دەکات و بە بەکارهێنانی face-api.js دەربڕینەکان دەناسێتەوە و ئەنجامەکەت بە شێوەزاری کوردیی سۆرانی بۆ نمایش دەکات.

**[نموونەی زیندوو](https://karo-bakhtiyar.github.io/kurdish-expression-detector)**

---

## کارەکانی چییە؟

- کێشانی تۆڕێکی ڕووخساری سەوزی نیۆنی بە ٤٧٨ خاڵ لەسەر دەموچاوت بە شێوەی ڕاستەوخۆ
- دۆزینەوەی دەربڕینی ئێستای ڕووخسارت و پیشاندانی بە سۆرانی
- پشتیگیری لە ٧ دەربڕین دەکات: دڵخۆش، خەمبار، تووڕە، ترساو، بێزار، سەرسام، و ئاسایی
- هەموو شتێک لەسەر ئامێرەکەی خۆت کار دەکات

---

## چۆن کارپێدەکرێت؟

```bash
git clone https://github.com/Karo-Bakhtiyar/kurdish-expression-detector
cd kurdish-expression-detector
npm install
npm run dev
```

پاشان ناونیشانی `لۆکاڵهۆست` لە وێبگەرەکەتدا بکەرەوە و ڕێگە بدە کامێراکەت کار بکات.

---

## تەکنەلۆژیا بەکارهاتووەکان

- React + Vite
- MediaPipe FaceMesh (`@mediapipe/tasks-vision`) بۆ دۆزینەوەی ٤٧٨ خاڵی نیشانەکەری ڕووخسار
- face-api.js (`@vladmandic/face-api`) بۆ پۆلێنکردنی دەربڕینەکان
- هەموو کێشی مۆدێلەکان بە شێوەی ناوخۆیی دانراون، دوای دامەزراندن پێویستی بە ئینتەرنێت نییە
- فۆنتی ڕابەر بۆ نیشاندانی تێکستی کوردیی سۆرانی

---

*دروستکراوە لەلایەن [کارۆ بەختیار](https://github.com/Karo-Bakhtiyar)، سلێمانی، هەرێمی کوردستان*


</div>
