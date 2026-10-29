/* ============================================================
   Virtual Kimyo Laboratoriyasi — bilim testi savollari
   ============================================================ */
(function (global) {
    "use strict";

    const QUESTIONS = [
        {
            id: 1,
            topic: "Davriy jadval",
            question: "Mendeleyev davriy jadvalining birinchi elementi qaysi?",
            options: ["Geliy", "Vodorod", "Litiy", "Kislorod"],
            answer: 1,
            explanation: "Vodorod (H) atom raqami 1 bo'lgan eng yengil elementdir."
        },
        {
            id: 2,
            topic: "Molyar massa",
            question: "Suvning (H₂O) molyar massasi qancha?",
            options: ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"],
            answer: 1,
            explanation: "H₂O: 2×1 + 16 = 18 g/mol."
        },
        {
            id: 3,
            topic: "Kislota va asos",
            question: "Kislota bilan asosning reaksiyasi qanday nomlanadi?",
            options: ["Oksidlanish", "Neytrallanish", "Elektroliz", "Polimerlanish"],
            answer: 1,
            explanation: "Kislota va asos reaksiyasida tuz va suv hosil bo'ladi — bu neytrallanish."
        },
        {
            id: 4,
            topic: "pH",
            question: "pH = 7 bo'lgan eritma qanday muhitni bildiradi?",
            options: ["Kislotali", "Ishqoriy", "Neytral", "Oksidlovchi"],
            answer: 2,
            explanation: "25°C da pH 7 neytral muhit hisoblanadi."
        },
        {
            id: 5,
            topic: "Elementlar",
            question: "Natriy elementining kimyoviy belgisi qaysi?",
            options: ["N", "Na", "Ni", "Ne"],
            answer: 1,
            explanation: "Natriyning belgisi Na (lotincha natrium)."
        },
        {
            id: 6,
            topic: "Mol",
            question: "1 mol moddada qancha zarracha bo'ladi?",
            options: ["6,022×10²²", "6,022×10²³", "3,14×10²³", "9,81×10²³"],
            answer: 1,
            explanation: "Avogadro doimiysi: 1 mol = 6,022×10²³ zarracha."
        },
        {
            id: 7,
            topic: "Yonish",
            question: "Qaysi gaz yonish jarayonini qo'llab-quvvatlaydi?",
            options: ["Azot", "Argon", "Kislorod", "Geliy"],
            answer: 2,
            explanation: "Kislorod (O₂) yonish uchun zarur oksidlovchidir."
        },
        {
            id: 8,
            topic: "Elektroliz",
            question: "Elektrolizda katodda qanday jarayon sodir bo'ladi?",
            options: ["Oksidlanish", "Qaytarilish", "Neytrallanish", "Bug'lanish"],
            answer: 1,
            explanation: "Katodda elektronlar qabul qilinadi — qaytarilish jarayoni kechadi."
        },
        {
            id: 9,
            topic: "Metallar",
            question: "Quyidagi elementlardan qaysi biri eng yengil metall?",
            options: ["Alyuminiy", "Litiy", "Temir", "Mis"],
            answer: 2,
            explanation: "Litiy (Li) eng yengil metall bo'lib, zichligi 0,534 g/cm³."
        },
        {
            id: 10,
            topic: "Cho'kma",
            question: "Kumush xlorid (AgCl) cho'kmasi qanday rangda bo'ladi?",
            options: ["Qizil", "Ko'k", "Oq", "Yashil"],
            answer: 2,
            explanation: "AgCl oq rangli, suvda kam eriydigan cho'kmadir."
        },
        {
            id: 11,
            topic: "Indikatorlar",
            question: "Fenolftalein ishqoriy muhitda qanday rangga o'zgaradi?",
            options: ["Ko'k", "Pushti", "Sariq", "Yashil"],
            answer: 1,
            explanation: "Fenolftalein pH > 8,2 bo'lganda pushti rangga o'zgaradi."
        },
        {
            id: 12,
            topic: "Reaksiyalar",
            question: "Zn + H₂SO₄ reaksiyasida qanday gaz ajraladi?",
            options: ["Kislorod", "Vodorod", "Xlor", "Azot"],
            answer: 1,
            explanation: "Rux sulfat kislota bilan reaksiyaga kirishib vodorod (H₂) ajratadi."
        },
        {
            id: 13,
            topic: "Davriy jadval",
            question: "Davriy jadvalning 18-guruhida qaysi elementlar joylashgan?",
            options: ["Ishqoriy metallar", "Galogenlar", "Nobial gazlar", "Lantanidlar"],
            answer: 2,
            explanation: "18-guruh — nobial gazlar (He, Ne, Ar, Kr, Xe, Rn, Og)."
        },
        {
            id: 14,
            topic: "Oksidlar",
            question: "2Mg + O₂ → 2MgO reaksiyasida MgO qanday modda?",
            options: ["Kislota", "Asos", "Oksid", "Tuz"],
            answer: 2,
            explanation: "Magniy oksidi (MgO) — metall oksidi."
        },
        {
            id: 15,
            topic: "Xavfsizlik",
            question: "Laboratoriyada kislota bilan ishlashda birinchi qoida nima?",
            options: ["Kislotani suvga quyish", "Himoya ko'zoyagi taqish", "Tez aralashtirish", "Ochiq olov ishlatish"],
            answer: 1,
            explanation: "Ko'zni himoya qilish uchun himoya ko'zoyagi taqish majburiy."
        },
        {
            id: 16,
            topic: "Konsentratsiya",
            question: "Molyar konsentratsiya qanday formula bilan topiladi?",
            options: ["C = m/V", "C = n/V", "C = V/n", "C = n×V"],
            answer: 1,
            explanation: "Molyar konsentratsiya C = n/V, bunda n — mol, V — litr."
        },
        {
            id: 17,
            topic: "Yadro kimyosi",
            question: "Quyidagi elementlardan qaysi biri yadro yoqilg'isi sifatida ishlatiladi?",
            options: ["Temir", "Uran", "Mis", "Kalsiy"],
            answer: 1,
            explanation: "Uran-235 yadro reaktorlarida yoqilg'i sifatida qo'llaniladi."
        },
        {
            id: 18,
            topic: "Gazlar",
            question: "Karbonat angidrid (CO₂) gazini qanday aniqlash mumkin?",
            options: ["Ohak suvini loyqalantirish", "Olovni yondirish", "Rangini o'zgartirish", "Hidini aniqlash"],
            answer: 0,
            explanation: "CO₂ ohak suvi (Ca(OH)₂) bilan reaksiyaga kirishib uni loyqalantiradi."
        }
    ];

    const API = { questions: QUESTIONS };
    if (typeof module !== "undefined" && module.exports) module.exports = API;
    global.Lab = global.Lab || {};
    global.Lab.quizData = API;
})(typeof window !== "undefined" ? window : globalThis);
