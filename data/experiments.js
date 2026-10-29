/* ============================================================
   Virtual Kimyo Laboratoriyasi — interaktiv eksperimentlar
   Har bir eksperiment real kimyoviy hisob-kitoblarga asoslangan.
   ============================================================ */
(function (global) {
    "use strict";

    const GAS_MOLAR_VOLUME = 22.414; // L/mol, normal sharoit
    const FARADAY = 96485; // C/mol

    const round = (value, digits = 2) => {
        const factor = Math.pow(10, digits);
        return Math.round(value * factor) / factor;
    };

    const num = (value, fallback = 0) => {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const EXPERIMENTS = [
        {
            id: "neutralization",
            title: "Neytrallanish reaksiyasi",
            subtitle: "HCl + NaOH + fenolftalein",
            description: "Kislota va asos o'rtasidagi neytrallanishni kuzating. Fenolftalein indikatori muhit o'zgarishini ko'rsatadi.",
            difficulty: "beginner",
            icon: "fa-solid fa-flask-vial",
            duration: "3–5 daqiqa",
            chemicals: ["HCl", "NaOH", "Fenolftalein"],
            safety: "Ko'zoynak va xalat kiyish tavsiya etiladi. Kislota va asosni to'g'ridan-to'g'ri teriga tegizmang.",
            equation: "HCl + NaOH → NaCl + H₂O",
            type: "Neytrallanish (kislota-asos)",
            procedure: [
                "Kolbaga 50 mL HCl eritmasidan quying.",
                "Ustiga 2–3 tomchi fenolftalein indikatoridan qo'shing.",
                "Byuretkadan NaOH eritmasini asta-sekin qo'shib boring.",
                "Rang o'zgarishini va pH qiymatini kuzating."
            ],
            params: [
                { id: "acidVolume", label: "HCl hajmi", unit: "mL", min: 10, max: 100, step: 5, value: 50 },
                { id: "acidConc", label: "HCl konsentratsiyasi", unit: "M", min: 0.05, max: 2, step: 0.05, value: 0.1 },
                { id: "baseConc", label: "NaOH konsentratsiyasi", unit: "M", min: 0.05, max: 2, step: 0.05, value: 0.1 },
                { id: "baseVolume", label: "Qo'shilgan NaOH hajmi", unit: "mL", min: 0, max: 100, step: 1, value: 50 }
            ],
            simulate(p) {
                const acidVolume = num(p.acidVolume, 50);
                const acidConc = num(p.acidConc, 0.1);
                const baseConc = num(p.baseConc, 0.1);
                const baseVolume = num(p.baseVolume, 50);
                const nAcid = (acidVolume * acidConc) / 1000;
                const nBase = (baseVolume * baseConc) / 1000;
                const totalVolume = (acidVolume + baseVolume) / 1000;
                const equivalenceVolume = (nAcid / baseConc) * 1000;

                let pH;
                if (Math.abs(nAcid - nBase) < 1e-9) {
                    pH = 7;
                } else if (nAcid > nBase) {
                    pH = -Math.log10(Math.max((nAcid - nBase) / totalVolume, 1e-14));
                } else {
                    pH = 14 + Math.log10(Math.max((nBase - nAcid) / totalVolume, 1e-14));
                }
                pH = Math.max(0, Math.min(14, pH));
                const pink = pH >= 8.2;
                const color = pH >= 10 ? "#db2777" : pink ? "#f9a8d4" : "#dbeafe";

                const observations = [];
                observations.push(`HCl eritmasida ${round(nAcid * 1000, 2)} mmol kislota bor.`);
                if (nAcid > nBase) {
                    observations.push("Muhit kislotali: fenolftalein rangsiz bo'lib qoldi.");
                } else if (Math.abs(nAcid - nBase) < 1e-9) {
                    observations.push("Neytrallanish nuqtasiga erishildi: pH = 7.");
                } else {
                    observations.push("Muhit ishqoriy: fenolftalein pushti rangga o'zgardi.");
                }

                return {
                    effect: "color",
                    color,
                    intensity: pink ? 0.9 : 0.35,
                    observations,
                    results: [
                        { label: "HCl modda miqdori", value: `${round(nAcid * 1000, 2)} mmol` },
                        { label: "NaOH modda miqdori", value: `${round(nBase * 1000, 2)} mmol` },
                        { label: "Ekvivalent hajm", value: `${round(equivalenceVolume, 1)} mL` },
                        { label: "Muhit pH", value: round(pH, 2) },
                        { label: "Indikator rangi", value: pink ? "Pushti" : "Rangsiz" }
                    ]
                };
            }
        },
        {
            id: "metal-acid",
            title: "Metall va kislota reaksiyasi",
            subtitle: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
            description: "Ruxning sulfat kislota bilan reaksiyasida vodorod gazi ajralishini va qaysi modda cheklovchi ekanini aniqlang.",
            difficulty: "intermediate",
            icon: "fa-solid fa-bolt",
            duration: "4–6 daqiqa",
            chemicals: ["Zn", "H₂SO₄", "H₂O"],
            safety: "Vodorod gazi portlovchi. Ochiq olovdan uzoqda ishlang va gazni ehtiyotkorlik bilan chiqaring.",
            equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
            type: "O'rin olish (metall + kislota)",
            procedure: [
                "Kolbaga kerakli massadagi rux bo'laklarini soling.",
                "Ustiga sulfat kislota eritmasini quying.",
                "Gaz pufakchalari ajralishini kuzating.",
                "Ajralgan vodorod hajmini hisoblang."
            ],
            params: [
                { id: "znMass", label: "Rux massasi", unit: "g", min: 0.1, max: 5, step: 0.1, value: 1 },
                { id: "acidConc", label: "H₂SO₄ konsentratsiyasi", unit: "M", min: 0.1, max: 5, step: 0.1, value: 1 },
                { id: "acidVolume", label: "H₂SO₄ hajmi", unit: "mL", min: 10, max: 100, step: 5, value: 50 },
                { id: "temperature", label: "Harorat", unit: "°C", min: 0, max: 80, step: 5, value: 25 }
            ],
            simulate(p) {
                const znMass = num(p.znMass, 1);
                const acidConc = num(p.acidConc, 1);
                const acidVolume = num(p.acidVolume, 50);
                const temperature = num(p.temperature, 25);
                const nZn = znMass / 65.38;
                const nAcid = (acidVolume * acidConc) / 1000;
                const nH2 = Math.min(nZn, nAcid);
                const limiting = nZn < nAcid ? "Rux (Zn)" : nZn > nAcid ? "Sulfat kislota (H₂SO₄)" : "Ikkalasi teng";
                const volumeH2 = nH2 * GAS_MOLAR_VOLUME;
                const massZnSO4 = nH2 * 161.44;
                const relativeRate = round(acidConc * Math.exp((temperature - 25) / 25), 2);

                return {
                    effect: "bubbles",
                    color: "#dbeafe",
                    intensity: Math.min(1, 0.35 + nH2 * 0.4),
                    observations: [
                        `Rux bo'laklari kislotada eriy boshladi.`,
                        `${round(volumeH2, 2)} L (n.sh.) vodorod gazi ajraldi.`,
                        `Cheklovchi reagent: ${limiting}.`,
                        temperature > 40 ? "Harorat oshishi bilan pufakchalar tezlashdi." : "Reaksiya barqaror tezlikda davom etdi."
                    ],
                    results: [
                        { label: "Zn modda miqdori", value: `${round(nZn * 1000, 2)} mmol` },
                        { label: "H₂SO₄ modda miqdori", value: `${round(nAcid * 1000, 2)} mmol` },
                        { label: "H₂ hajmi (n.sh.)", value: `${round(volumeH2, 2)} L` },
                        { label: "ZnSO₄ massasi", value: `${round(massZnSO4, 2)} g` },
                        { label: "Nisbiy tezlik", value: `${relativeRate}×` },
                        { label: "Cheklovchi reagent", value: limiting }
                    ]
                };
            }
        },
        {
            id: "combustion",
            title: "Magniyning yonishi",
            subtitle: "2Mg + O₂ → 2MgO",
            description: "Magniy lentasining kislorodda yonishini kuzating. Reaksiya juda yorqin nur va issiqlik ajratadi.",
            difficulty: "advanced",
            icon: "fa-solid fa-fire",
            duration: "2–4 daqiqa",
            chemicals: ["Mg lenta", "O₂", "Bunzen jirovi"],
            safety: "Magniy yonishi juda yorqin. Qoraytirilgan ko'zoynak taqing va yonishni faqat shamollatilgan joyda bajaring.",
            equation: "2Mg + O₂ → 2MgO",
            type: "Yonish (oksidlanish)",
            procedure: [
                "Magniy lentasini qaychi bilan 5–10 sm qilib kesing.",
                "Lentani penseta bilan ushlang.",
                "Bunzen jirovi yoki gorelka olovida qizdiring.",
                "Yonish tugagach, hosil bo'lgan oq kukunni tekshiring."
            ],
            params: [
                { id: "mgMass", label: "Magniy massasi", unit: "g", min: 0.1, max: 5, step: 0.1, value: 1 },
                { id: "oxygen", label: "Kislorod ulushi", unit: "%", min: 21, max: 100, step: 1, value: 21 }
            ],
            simulate(p) {
                const mgMass = num(p.mgMass, 1);
                const oxygen = num(p.oxygen, 21);
                const nMg = mgMass / 24.305;
                const nMgO = nMg;
                const massMgO = nMgO * 40.304;
                const heat = nMg * 601.6;
                const purity = Math.min(1, oxygen / 21);

                return {
                    effect: "flame",
                    color: "#fef3c7",
                    intensity: Math.max(0.35, purity),
                    observations: [
                        "Magniy yonishda ko'zni qamashtiruvchi oq nur chiqardi.",
                        "Reaksiya natijasida oq rangli magniy oksidi hosil bo'ldi.",
                        oxygen > 50 ? "Kislorod ko'p bo'lgani uchun yonish tezroq kechdi." : "Havodagi kislorod yetarli bo'ldi."
                    ],
                    results: [
                        { label: "Mg modda miqdori", value: `${round(nMg, 3)} mol` },
                        { label: "MgO massasi", value: `${round(massMgO, 2)} g` },
                        { label: "Ajralgan issiqlik", value: `${round(heat, 1)} kJ` },
                        { label: "Kislorod ulushi", value: `${oxygen}%` }
                    ]
                };
            }
        },
        {
            id: "electrolysis",
            title: "Tuz eritmasining elektrolizi",
            subtitle: "2NaCl + 2H₂O → 2NaOH + Cl₂↑ + H₂↑",
            description: "Natrium xlorid eritmasidan tok o'tkazib, elektrodlarda ajraladigan gazlar va muhit o'zgarishini o'rganing.",
            difficulty: "intermediate",
            icon: "fa-solid fa-wave-square",
            duration: "5–8 daqiqa",
            chemicals: ["NaCl", "H₂O", "Karbon elektrodlar"],
            safety: "Yuqori kuchlanishdan saqlaning. Xlor gazi zaharli, tajribani shamollatiladigan joyda bajaring.",
            equation: "2NaCl + 2H₂O → 2NaOH + Cl₂↑ + H₂↑",
            type: "Elektroliz",
            procedure: [
                "NaCl eritmasini tayyorlang.",
                "Ikki karbon elektrodni eritmaga tushiring.",
                "Manbani ulab, tokni belgilangan qiymatga qo'ying.",
                "Katod va anodda ajralayotgan gazlarni kuzating."
            ],
            params: [
                { id: "current", label: "Tok kuchi", unit: "A", min: 0.1, max: 5, step: 0.1, value: 1 },
                { id: "time", label: "Vaqt", unit: "s", min: 10, max: 600, step: 10, value: 120 },
                { id: "naclConc", label: "NaCl konsentratsiyasi", unit: "M", min: 0.1, max: 2, step: 0.1, value: 1 }
            ],
            simulate(p) {
                const current = num(p.current, 1);
                const time = num(p.time, 120);
                const naclConc = num(p.naclConc, 1);
                const charge = current * time;
                const nElectrons = charge / FARADAY;
                const nCl2 = nElectrons / 2;
                const nH2 = nElectrons / 2;
                const vCl2 = nCl2 * GAS_MOLAR_VOLUME;
                const vH2 = nH2 * GAS_MOLAR_VOLUME;
                const nNaOH = nElectrons;

                return {
                    effect: "electrolysis",
                    color: "#e0f2fe",
                    intensity: Math.min(1, 0.3 + current / 5),
                    observations: [
                        "Katodda (manfiy elektrod) vodorod pufakchalari ajraldi.",
                        "Anodda (musbat elektrod) sarg'ish-yashil xlor gazi sezildi.",
                        "Eritmada NaOH hosil bo'lishi hisobiga muhit ishqoriylashdi.",
                        `NaCl konsentratsiyasi: ${naclConc} M.`
                    ],
                    results: [
                        { label: "O'tgan zaryad", value: `${round(charge, 0)} C` },
                        { label: "H₂ hajmi (n.sh.)", value: `${round(vH2, 3)} L` },
                        { label: "Cl₂ hajmi (n.sh.)", value: `${round(vCl2, 3)} L` },
                        { label: "Hosil bo'lgan NaOH", value: `${round(nNaOH * 1000, 2)} mmol` },
                        { label: "Elektronlar miqdori", value: `${round(nElectrons * 1000, 2)} mmol` }
                    ]
                };
            }
        },
        {
            id: "precipitation",
            title: "Cho'kma hosil bo'lishi",
            subtitle: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
            description: "Kumush nitrat va natrium xlorid eritmalarini aralashtirib, oq kumush xlorid cho'kmasini hosil qiling.",
            difficulty: "beginner",
            icon: "fa-solid fa-droplet",
            duration: "3–5 daqiqa",
            chemicals: ["AgNO₃", "NaCl", "H₂O"],
            safety: "Kumush nitrat teri va kiyimda qora dog' qoldiradi. Qo'lqop kiyish tavsiya etiladi.",
            equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
            type: "Almashinish (cho'kma)",
            procedure: [
                "Probirkaga 25 mL AgNO₃ eritmasidan quying.",
                "Ustiga 25 mL NaCl eritmasini qo'shing.",
                "Oq cho'kma hosil bo'lishini kuzating.",
                "Cheklovchi reagentni va cho'kma massasini hisoblang."
            ],
            params: [
                { id: "agno3Volume", label: "AgNO₃ hajmi", unit: "mL", min: 5, max: 50, step: 1, value: 25 },
                { id: "agno3Conc", label: "AgNO₃ konsentratsiyasi", unit: "M", min: 0.01, max: 1, step: 0.01, value: 0.1 },
                { id: "naclVolume", label: "NaCl hajmi", unit: "mL", min: 5, max: 50, step: 1, value: 25 },
                { id: "naclConc", label: "NaCl konsentratsiyasi", unit: "M", min: 0.01, max: 1, step: 0.01, value: 0.1 }
            ],
            simulate(p) {
                const agno3Volume = num(p.agno3Volume, 25);
                const agno3Conc = num(p.agno3Conc, 0.1);
                const naclVolume = num(p.naclVolume, 25);
                const naclConc = num(p.naclConc, 0.1);
                const nAg = (agno3Volume * agno3Conc) / 1000;
                const nCl = (naclVolume * naclConc) / 1000;
                const nAgCl = Math.min(nAg, nCl);
                const massAgCl = nAgCl * 143.32;
                const limiting = nAg < nCl ? "AgNO₃" : nAg > nCl ? "NaCl" : "Ikkalasi teng";
                const excessAg = Math.max(0, nAg - nCl) * 1000;
                const excessCl = Math.max(0, nCl - nAg) * 1000;

                return {
                    effect: "precipitate",
                    color: "#f1f5f9",
                    intensity: Math.min(1, 0.35 + nAgCl * 300),
                    observations: [
                        "Probirkada oq, mayda dispers cho'kma hosil bo'ldi.",
                        `Cho'kma: kumush xlorid (AgCl).`,
                        `Cheklovchi reagent: ${limiting}.`
                    ],
                    results: [
                        { label: "Ag⁺ modda miqdori", value: `${round(nAg * 1000, 2)} mmol` },
                        { label: "Cl⁻ modda miqdori", value: `${round(nCl * 1000, 2)} mmol` },
                        { label: "AgCl massasi", value: `${round(massAgCl, 2)} g` },
                        { label: "Ortib qolgan Ag⁺", value: `${round(excessAg, 2)} mmol` },
                        { label: "Ortib qolgan Cl⁻", value: `${round(excessCl, 2)} mmol` }
                    ]
                };
            }
        },
        {
            id: "gas-evolution",
            title: "Gaz ajralishi",
            subtitle: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
            description: "Soda va xlorid kislota reaksiyasida karbonat angidrid gazi ajralishini o'lchang va hisoblang.",
            difficulty: "beginner",
            icon: "fa-solid fa-wind",
            duration: "3–5 daqiqa",
            chemicals: ["Na₂CO₃", "HCl", "H₂O"],
            safety: "Reaksiya tez kechadi; probirkani yuzdan uzoq tuting. Kislota teriga tegmasin.",
            equation: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
            type: "Almashinish (gaz ajralishi)",
            procedure: [
                "Probirkaga 1 g natriy karbonat soling.",
                "Ustiga 50 mL xlorid kislota quying.",
                "Kuchli gaz pufakchalari ajralishini kuzating.",
                "Ajralgan CO₂ hajmini hisoblang."
            ],
            params: [
                { id: "na2co3Mass", label: "Na₂CO₃ massasi", unit: "g", min: 0.1, max: 5, step: 0.1, value: 1 },
                { id: "hclConc", label: "HCl konsentratsiyasi", unit: "M", min: 0.1, max: 5, step: 0.1, value: 1 },
                { id: "hclVolume", label: "HCl hajmi", unit: "mL", min: 10, max: 100, step: 5, value: 50 }
            ],
            simulate(p) {
                const na2co3Mass = num(p.na2co3Mass, 1);
                const hclConc = num(p.hclConc, 1);
                const hclVolume = num(p.hclVolume, 50);
                const nNa2co3 = na2co3Mass / 105.99;
                const nHCl = (hclVolume * hclConc) / 1000;
                const nCO2 = Math.min(nNa2co3, nHCl / 2);
                const vCO2 = nCO2 * GAS_MOLAR_VOLUME;
                const massNaCl = nCO2 * 2 * 58.44;
                const limiting = nNa2co3 < nHCl / 2 ? "Na₂CO₃" : nNa2co3 > nHCl / 2 ? "HCl" : "Ikkalasi teng";

                return {
                    effect: "gas",
                    color: "#ecfeff",
                    intensity: Math.min(1, 0.4 + nCO2 * 4),
                    observations: [
                        "Probirkada kuchli gaz pufakchalari ajraldi.",
                        "Ajralgan gaz karbonat angidrid (CO₂) ekanligi aniqlandi.",
                        `Cheklovchi reagent: ${limiting}.`
                    ],
                    results: [
                        { label: "Na₂CO₃ modda miqdori", value: `${round(nNa2co3 * 1000, 2)} mmol` },
                        { label: "HCl modda miqdori", value: `${round(nHCl * 1000, 2)} mmol` },
                        { label: "CO₂ hajmi (n.sh.)", value: `${round(vCO2, 3)} L` },
                        { label: "NaCl massasi", value: `${round(massNaCl, 2)} g` },
                        { label: "Cheklovchi reagent", value: limiting }
                    ]
                };
            }
        }
    ];

    const DIFFICULTY = {
        beginner: { label: "Boshlang'ich", class: "beginner" },
        intermediate: { label: "O'rta", class: "intermediate" },
        advanced: { label: "Murakkab", class: "advanced" }
    };

    const API = {
        experiments: EXPERIMENTS,
        difficulty: DIFFICULTY,
        constants: { GAS_MOLAR_VOLUME, FARADAY },
        get: id => EXPERIMENTS.find(item => item.id === id)
    };

    if (typeof module !== "undefined" && module.exports) module.exports = API;
    global.Lab = global.Lab || {};
    global.Lab.experimentData = API;
})(typeof window !== "undefined" ? window : globalThis);
