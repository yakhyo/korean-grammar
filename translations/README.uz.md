# KIIP Grammar &amp; Vocabulary

[English](../README.md) · **Oʻzbekcha** · [Русский](README.ru.md) · [Bahasa Indonesia](README.id.md)

**Koreyaning Immigratsiya va Integratsiya dasturi (KIIP / 사회통합프로그램)** koreys tili oʻquv dasturi uchun mustaqil oʻrganishga moʻljallangan maʼlumotnoma toʻplami.

🔗 **Jonli sayt:** https://yakhyo.github.io/korean-grammar/

## Mundarija

| Daraja | Kitob | Yoʻnalish |
|-------|------|--------|
| 1-daraja | 한국어와 한국문화 초급 1 | Boshlangʻich — Hangul, asosiy yuklamalar, oddiy feʼl qoʻshimchalari |
| 2-daraja | 한국어와 한국문화 초급 2 | Yuqori boshlangʻich — bogʻlovchi qoʻshimchalar, shart, aniqlovchi ergash gaplar |
| 3-daraja | 한국어와 한국문화 중급 1 | Oʻrta — koʻchirma gap, taxmin, tuslanish ilovasi |
| 4-daraja | 한국어와 한국문화 중급 2 | Yuqori oʻrta — ijtimoiy mavzular, mavhum grammatika |
| 5-daraja | 한국사회 이해 (기본·심화) | Koreys jamiyatini anglash — fuqarolik bilimlari boʻyicha qoʻllanma |

## Imkoniyatlar

- 🌐 **Til almashtirgich** — har bir sahifada inglizcha, oʻzbekcha, ruscha va indonezcha oʻrtasida almashish uchun ochiluvchi menyu; koreyscha matn oʻz holicha qoladi, faqat izohlar va tarjimalar oʻzgaradi.
- 🧭 **Daraja almashtirgich** — har bir sahifadagi ochiluvchi menyu orqali ortga qaytmasdan istalgan darajaga (yoki bosh sahifaga) toʻgʻridan-toʻgʻri oʻtish mumkin.
- 🌗 **Tungi / kunduzgi rejim** — har bir sahifadagi tugma orqali almashtiriladi, qayta kirganda eslab qolinadi va sukut boʻyicha tizim sozlamalaringizga moslashadi.
- ⭐ **Yulduzcha tugmasi** — loyihani GitHubʼda yulduzcha bilan belgilash uchun tezkor havola.
- 🖨️ **Chop etishga tayyor** — chop etishda (yoki PDFʼga saqlashda) tungi rejimda boʻlsangiz ham, toza natija olish uchun doim kunduzgi mavzu ishlatiladi.
- 📦 **Yigʻishsiz, bogʻliqliklarsiz** — oddiy HTML va bitta umumiy CSS fayli, oflayn ishlaydi.

## Loyiha haqida

- Uslublar ikkita umumiy stil faylida joylashgan (`assets/home.css` — bosh sahifalar uchun, `assets/levels.css` — har bir daraja sahifasi uchun); har bir daraja sahifasi oʻz urgʻu rangini `html.lv1…lv5` klassi orqali tanlaydi. Sahifalar oflayn ham ishlaydi va PDFʼga toza chop etiladi (`Ctrl`/`Cmd` + `P`).
- 1–4-darajalar amaldagi KIIP darsliklari nashrlariga asoslanadi; lugʻat roʻyxatlari darsdagi soʻzlarning aynan nusxasi emas, balki kengaytirilgan mavzuli maʼlumotnomalardir.
- Har bir grammatik nuqta naqshni turli kontekstlarda koʻrsatish uchun **toʻrtta ishlangan namuna gap** bilan beriladi.
- 5-daraja *Koreys jamiyatini anglash* kursini qamrab oladi.
- Oʻzbekcha, ruscha va indonezcha nashrlar izohlar, namunalar va lugʻatning toʻliq tarjimasidir; koreyscha matnning oʻzi esa toʻrttala tilda bir xil.

## Loyiha tuzilishi

```
.
├── docs/                       # Nashr etilgan sayt — GitHub Pages shu papkani uzatadi
│   ├── index.html              # Yoʻnaltirish → /en/ (tildan xoli kirish nuqtasi)
│   ├── en/                     # Inglizcha — index.html (→ /en/) + level-1/ … level-5/ (→ /en/level-1/ …)
│   ├── uz/                     # Oʻzbekcha — index.html (→ /uz/) + level-1/ … level-5/ (→ /uz/level-1/ …)
│   ├── ru/                     # Ruscha (uz/ bilan bir xil tuzilma)
│   ├── id/                     # Indonezcha (uz/ bilan bir xil tuzilma)
│   ├── level-1/ … level-5/     # Yoʻnaltirish fayllari → /en/level-N/ (eski inglizcha URLʼlar uchun)
│   ├── assets/                 # Umumiy stil fayllari va ijtimoiy preview rasmlari
│   │   ├── home.css            # Bosh sahifalar
│   │   ├── levels.css          # Daraja sahifalari (urgʻu rangi html.lvN klassi orqali)
│   │   └── og-image*.png       # Har bir til uchun ijtimoiy preview rasmlari
│   ├── sitemap.xml             # hreflang muqobillari bilan URL roʻyxati
│   └── .nojekyll               # GitHub Pagesʼda fayllarni oʻzgartirishsiz uzatish
├── tools/                      # Texnik xizmat skriptlari (bogʻliqliklarsiz)
│   └── check-korean-sync.mjs   # Koreyscha EN/UZ/RU/ID boʻylab mosligini tekshiradi
├── translations/               # README tarjimalari (uz · ru · id)
└── README.md                   # Ushbu fayl (inglizcha)
```

## Mahalliy ishga tushirish

Yigʻish bosqichi yoʻq — `docs/` papkasini serverda ishga tushiring:

```bash
python3 -m http.server 8000 --directory docs
# soʻngra http://localhost:8000 manzilini oching
```

## Litsenziya

Ijtimoiy Integratsiya dasturi oʻquvchilari uchun. Shaxsiy oʻrganish maqsadida bepul foydalanish mumkin.
