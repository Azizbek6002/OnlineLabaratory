# Virtual Kimyo Laboratoriyasi

O'zbek tilidagi interaktiv kimyo ta'lim platformasi. To'liq 118 elementli davriy jadval, real hisob-kitoblarga asoslangan virtual eksperimentlar, laboratoriya texnologiyalari simulyatsiyalari, bilim testi va o'quv vositalari — bitta statik saytda.

Loyiha **HTML, CSS va sof JavaScript** asosida yozilgan. Build bosqichi, server yoki ma'lumotlar bazasi talab qilinmaydi. Barcha foydalanuvchi ma'lumotlari faqat brauzerdagi `localStorage` da saqlanadi.

## Imkoniyatlar

### Davriy jadval
- 118 element: nomi, belgisi, atom raqami, massasi, guruhi, davri, bloki, holati va asosiy xossalari.
- 10 kategoriya bo'yicha filtr, sevimlilar ro'yxati.
- Nom, belgi, atom raqami yoki massa bo'yicha qidiruv.
- Element kartasini bosib batafsil oyna, tavsif, qo'llanilishi va tegishli eksperimentga o'tish.
- Klaviatura bilan jadval bo'ylab harakatlanish.

### Virtual laboratoriya
6 ta interaktiv eksperiment:

| Eksperiment | Asosiy hisob-kitob |
| --- | --- |
| Neytrallanish reaksiyasi | Modda miqdori, ekvivalent hajm, pH |
| Metall va kislota reaksiyasi | Stoxiometriya, cheklovchi reagent, gaz hajmi |
| Magniyning yonishi | Massa balansi, hosil unumi |
| Tuz eritmasining elektrolizi | Faradey qonuni, ajralgan massa |
| Cho'kma hosil bo'lishi | Erish ko'paytmasi, cho'kma massasi |
| Gaz ajralishi | Karbonat–kislota stoxiometriyasi |

Har bir tajribada parametrlar slayderlari, bosqichma-bosqich yo'riqnoma, xavfsizlik eslatmalari, animatsiyalar (pufakchalar, alanga, cho'kma, rang o'zgarishi), natijalar jadvali va kuzatishlar mavjud.

### Laboratoriya texnologiyalari
- **Spektroskopiya** — 6 namunaning emissiya spektri va to'lqin uzunligi chiziqlari.
- **Xromatografiya** — qog'oz xromatografiyasi, 3 namuna va 3 erituvchi, Rf qiymatlari.
- **Mikroskopiya** — 4 preparat, kattalashtirish, fokus va yorug'lik sozlamalari, canvas chizish.
- **Titratsiya** — NaOH bilan HCl titrlash, pH egri chizig'i, tomchilab yoki avtomatik qo'shish.

### Test va vositalar
- 18 savoldan tasodifiy 12 tasi, izohli javoblar, taymer, natija tahlili va eng yaxshi natija.
- Molyar massa kalkulyatori: qavslar, indekslar va kristallogidratlar (`Ca(OH)2`, `Al2(SO4)3`, `CuSO4*5H2O`).
- Suyultirish kalkulyatori (`C₁V₁ = C₂V₂`).
- 10 raundlik element o'yini.
- Chop etiladigan va yuklab olinadigan formulalar varaqasi.

### Interfeys
- Yorug' va qorong'u rejim, tanlov brauzerda saqlanadi.
- Glassmorphism, scroll-reveal animatsiyalari, toast xabarnomalar.
- Demo tur, klaviatura yorliqlari, “yuqoriga qaytish” tugmasi.
- Mobil, planshet va kompyuterga moslashgan dizayn.
- `prefers-reduced-motion` va chop etish (print) rejimlari uchun alohida stillar.
- Profil: ism, email, avatar; eksperimentlar, test natijasi, sevimlilar va ko'rilgan elementlar statistikasi.

## Tuzilma

```text
.
├── index.html            # Barcha bo'limlar va modal oynalar
├── styles.css            # Dizayn tizimi, komponentlar, responsivlik
├── assets/
│   └── favicon.svg
├── data/
│   ├── elements.js       # 118 element va kategoriyalar
│   ├── experiments.js    # 6 eksperiment, parametrlar, simulate()
│   └── quizzes.js        # 18 test savoli
└── js/
    ├── core.js           # Utilitlar, toast, modal, profil, progress, sevimlilar
    ├── table.js          # Davriy jadval va element oynasi
    ├── experiments.js    # Laboratoriya interfeysi va animatsiyalar
    ├── technology.js     # Spektroskopiya, xromatografiya, mikroskop, titratsiya
    ├── quiz.js           # Test dvigateli
    ├── tools.js          # Kalkulyatorlar, o'yin, formulalar varaqasi
    └── app.js            # Tema, navigatsiya, profil, demo tur, init
```

Skriptlar oddiy `<script>` teglari orqali ketma-ket yuklanadi va `window.Lab` obyekti ostida birlashadi. Shu sababli sayt `file://` orqali ham, har qanday statik serverda ham ishlaydi.

## Ishga tushirish

Eng oddiy usul — `index.html` faylini brauzerda ochish.

Lokal server bilan:

```bash
python3 -m http.server 4173
# yoki
npx serve .
```

So'ng `http://localhost:4173` manzilini oching.

## GitHub Pages

1. Repozitoriyni GitHub'ga yuboring.
2. **Settings → Pages** bo'limida manba sifatida branch va `/ (root)` ni tanlang.
3. Sayt `https://<foydalanuvchi>.github.io/<repo>/` manzilida ochiladi.

Qo'shimcha build yoki konfiguratsiya kerak emas. Barcha yo'llar nisbiy.

## Ma'lumotlar va saqlash

| Kalit | Maqsad |
| --- | --- |
| `vkl_profile_v1` | Ism, email, avatar, qo'shilgan sana |
| `vkl_progress_v1` | Eksperimentlar, test natijalari, ko'rilgan elementlar |
| `vkl_favorites_v1` | Sevimli elementlar |
| `vkl_theme_v1` | Tanlangan mavzu (`light` / `dark`) |
| `vkl_game_best_v1` | O'yindagi eng yaxshi natija |

- Ma'lumotlar serverga yuborilmaydi.
- Brauzer ma'lumotlarini tozalash yoki profil oynasidagi **“Progressni tozalash”** tugmasi barcha saqlangan natijalarni o'chiradi.
- Turli qurilmalar o'rtasida sinxronizatsiya mavjud emas.

## Klaviatura yorliqlari

| Tugma | Amal |
| --- | --- |
| `Ctrl` + `K` | Element qidiruviga o'tish |
| `Esc` | Ochiq oynani yopish |
| `←` `→` `↑` `↓` | Jadval bo'ylab harakat |
| `Home` / `End` | Birinchi / oxirgi element |
| `Enter` | Demo turda keyingi qadam |

## Tashqi resurslar

- [Google Fonts](https://fonts.google.com/) — Inter va Roboto Mono.
- [Font Awesome 6.4.0](https://fontawesome.com/) — ikonkalar.

Sayt oflayn rejimda ham asosiy funksiyalar bilan ishlaydi; internet bo'lmasa ikonkalar va shriftlar tizim standartlariga tushadi.

## Brauzerlar

Zamonaviy Chrome, Edge, Firefox va Safari versiyalari qo'llab-quvvatlanadi. `color-mix()`, `backdrop-filter` va CSS grid kabi zamonaviy xususiyatlardan foydalaniladi.

## Litsenziya va foydalanish

Loyiha ta'lim maqsadida yaratilgan. Virtual eksperimentlar real laboratoriya ishlarini almashtirmaydi; haqiqiy tajribalar faqat mutaxassis nazoratida va xavfsizlik qoidalariga rioya qilgan holda bajarilishi kerak.
