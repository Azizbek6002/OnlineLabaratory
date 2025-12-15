// Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();
});

async function initApp() {
    console.log('Virtual Kimyo Laboratoriyasi yuklanmoqda...');

    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        showNotification('Virtual Laboratoriya tayyor!', 'success');
    }, 2000);

    // Initialize all components
    initNavigation();
    initTheme();
    initPeriodicTable();
    initExperiments();
    initTechnology();
    initModals();

    // Check server connection
    checkServerStatus();

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Active navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }

            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                scrollToSection(target.substring(1));
            }
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.nav-toggle').innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
}

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDarkTheme();
    } else {
        setLightTheme();
    }

    // Theme toggle button event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'dark') {
                setLightTheme();
            } else {
                setDarkTheme();
            }
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                setDarkTheme();
            } else {
                setLightTheme();
            }
        }
    });
}

function setDarkTheme() {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = 'fas fa-sun';
    }
    showNotification('Qorongʻu rejim yoqildi', 'info');
}

function setLightTheme() {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = 'fas fa-moon';
    }
    showNotification('Yorugʻ rejim yoqildi', 'info');
}

// Periodic Table
async function initPeriodicTable() {
    console.log('Periodik jadval yuklanmoqda...');

    const elements = await loadElementsData();
    const tableContainer = document.getElementById('periodicTable');
    const searchInput = document.getElementById('elementSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Generate periodic table
    generatePeriodicTable(elements);

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterElements(searchTerm, elements);
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            filterElementsByCategory(filter, elements);
        });
    });
}

async function loadElementsData() {
    try {
        // Real data yuklash uchun API chaqiruvi
        // Hozircha mock data ishlatamiz
        return [
            {
                number: 1,
                symbol: "H",
                name: "Vodorod",
                category: "nonmetal",
                mass: "1.008",
                group: 1,
                period: 1,
                block: "s",
                state: "Gaz",
                description: "Eng oddiy va eng keng tarqalgan element. Koinotdagi mavjud elementlarning 75% ini tashkil qiladi.",
                electrons: "1",
                density: "0.0000899 g/cm³",
                melt: "-259.16°C",
                boil: "-252.87°C",
                discovered: "1766"
            },
            {
                number: 2,
                symbol: "He",
                name: "Geliy",
                category: "noble",
                mass: "4.0026",
                group: 18,
                period: 1,
                block: "s",
                state: "Gaz",
                description: "Nobial gazlar guruhining birinchi a'zosi. Er yuzasida kam uchraydi.",
                electrons: "2",
                density: "0.0001785 g/cm³",
                melt: "-272.20°C",
                boil: "-268.93°C",
                discovered: "1868"
            },
            {
                number: 3,
                symbol: "Li",
                name: "Lity",
                category: "alkali",
                mass: "6.94",
                group: 1,
                period: 2,
                block: "s",
                state: "Qattiq",
                description: "Eng engil metall. Havoda tez oksidlanadi.",
                electrons: "3",
                density: "0.534 g/cm³",
                melt: "180.54°C",
                boil: "1342°C",
                discovered: "1817"
            },
            {
                number: 6,
                symbol: "C",
                name: "Uglerod",
                category: "nonmetal",
                mass: "12.011",
                group: 14,
                period: 2,
                block: "p",
                state: "Qattiq",
                description: "Hayotning asosiy elementi. Olmos va grafit shakllarida uchraydi.",
                electrons: "6",
                density: "2.267 g/cm³",
                melt: "3550°C",
                boil: "4027°C",
                discovered: "Qadimgi"
            },
            {
                number: 8,
                symbol: "O",
                name: "Kislorod",
                category: "nonmetal",
                mass: "15.999",
                group: 16,
                period: 2,
                block: "p",
                state: "Gaz",
                description: "Hayot uchun eng muhim gaz. Havoning 21% ini tashkil qiladi.",
                electrons: "8",
                density: "0.001429 g/cm³",
                melt: "-218.79°C",
                boil: "-182.95°C",
                discovered: "1774"
            },
            {
                number: 11,
                symbol: "Na",
                name: "Natry",
                category: "alkali",
                mass: "22.990",
                group: 1,
                period: 3,
                block: "s",
                state: "Qattiq",
                description: "Ishqoriy metall, suv bilan kuchli reaksiyaga kirishadi.",
                electrons: "11",
                density: "0.968 g/cm³",
                melt: "97.72°C",
                boil: "883°C",
                discovered: "1807"
            },
            {
                number: 17,
                symbol: "Cl",
                name: "Xlor",
                category: "halogen",
                mass: "35.45",
                group: 17,
                period: 3,
                block: "p",
                state: "Gaz",
                description: "Zaharli gaz, dezinfeksiyalashda ishlatiladi.",
                electrons: "17",
                density: "0.003214 g/cm³",
                melt: "-101.5°C",
                boil: "-34.04°C",
                discovered: "1774"
            },
            {
                number: 26,
                symbol: "Fe",
                name: "Temir",
                category: "transition",
                mass: "55.845",
                group: 8,
                period: 4,
                block: "d",
                state: "Qattiq",
                description: "Eng keng tarqalgan va muhim metall. Qurilish va texnikada ishlatiladi.",
                electrons: "26",
                density: "7.874 g/cm³",
                melt: "1538°C",
                boil: "2862°C",
                discovered: "Qadimgi"
            },
            {
                number: 29,
                symbol: "Cu",
                name: "Mis",
                category: "transition",
                mass: "63.546",
                group: 11,
                period: 4,
                block: "d",
                state: "Qattiq",
                description: "Yaxshi o'tkazuvchanlikka ega metall. Elektr va issiqlik o'tkazgich.",
                electrons: "29",
                density: "8.96 g/cm³",
                melt: "1084.62°C",
                boil: "2562°C",
                discovered: "Qadimgi"
            },
            {
                number: 79,
                symbol: "Au",
                name: "Oltin",
                category: "transition",
                mass: "196.97",
                group: 11,
                period: 6,
                block: "d",
                state: "Qattiq",
                description: "Qimmatbaho metall. Kimyoviy jihatdan inert.",
                electrons: "79",
                density: "19.32 g/cm³",
                melt: "1064.18°C",
                boil: "2970°C",
                discovered: "Qadimgi"
            }
        ];
    } catch (error) {
        console.error('Elementlar ma\'lumotlarini yuklashda xatolik:', error);
        showNotification('Elementlar ma\'lumotlari yuklanmadi', 'error');
        return [];
    }
}

function generatePeriodicTable(elements) {
    const table = document.getElementById('periodicTable');
    if (!table) return;

    table.innerHTML = '';

    // Create empty grid (18 columns × 7 rows)
    for (let row = 1; row <= 7; row++) {
        for (let col = 1; col <= 18; col++) {
            const cell = document.createElement('div');
            cell.className = 'element-cell empty';
            cell.dataset.row = row;
            cell.dataset.col = col;
            table.appendChild(cell);
        }
    }

    // Place elements in their correct positions
    elements.forEach(element => {
        const position = getElementPosition(element);
        if (position) {
            const cell = document.querySelector(`.element-cell[data-row="${position.row}"][data-col="${position.col}"]`);
            if (cell) {
                cell.className = `element-cell ${element.category}`;
                cell.innerHTML = `
                    <span class="element-number">${element.number}</span>
                    <span class="element-symbol">${element.symbol}</span>
                    <span class="element-name">${element.name}</span>
                `;
                cell.dataset.element = JSON.stringify(element);
                cell.addEventListener('click', () => showElementDetails(element));
                cell.title = `${element.name} (${element.symbol}) - Atom raqami: ${element.number}`;
            }
        }
    });

    // Remove empty cells
    document.querySelectorAll('.element-cell.empty').forEach(cell => {
        cell.style.visibility = 'hidden';
    });
}

function getElementPosition(element) {
    // Periodic table positions (simplified version)
    const positions = {
        1: {row: 1, col: 1},   // H
        2: {row: 1, col: 18},  // He
        3: {row: 2, col: 1},   // Li
        4: {row: 2, col: 2},   // Be
        5: {row: 2, col: 13},  // B
        6: {row: 2, col: 14},  // C
        7: {row: 2, col: 15},  // N
        8: {row: 2, col: 16},  // O
        9: {row: 2, col: 17},  // F
        10: {row: 2, col: 18}, // Ne
        11: {row: 3, col: 1},  // Na
        12: {row: 3, col: 2},  // Mg
        13: {row: 3, col: 13}, // Al
        14: {row: 3, col: 14}, // Si
        15: {row: 3, col: 15}, // P
        16: {row: 3, col: 16}, // S
        17: {row: 3, col: 17}, // Cl
        18: {row: 3, col: 18}, // Ar
        19: {row: 4, col: 1},  // K
        20: {row: 4, col: 2},  // Ca
        26: {row: 4, col: 8},  // Fe
        29: {row: 4, col: 11}, // Cu
        79: {row: 6, col: 11}, // Au
    };

    return positions[element.number] || null;
}

function filterElements(searchTerm, elements) {
    const cells = document.querySelectorAll('.element-cell:not(.empty)');
    cells.forEach(cell => {
        const element = JSON.parse(cell.dataset.element);
        const matches = element.name.toLowerCase().includes(searchTerm) ||
                       element.symbol.toLowerCase().includes(searchTerm) ||
                       element.number.toString().includes(searchTerm);

        cell.style.display = matches ? 'flex' : 'none';
    });
}

function filterElementsByCategory(category, elements) {
    const cells = document.querySelectorAll('.element-cell:not(.empty)');
    cells.forEach(cell => {
        const element = JSON.parse(cell.dataset.element);
        const matches = category === 'all' || element.category === category;

        cell.style.display = matches ? 'flex' : 'none';
    });
}

function showElementDetails(element) {
    const modal = document.getElementById('elementModal');
    if (!modal) return;

    modal.classList.add('active');

    // Fill modal with element data
    document.getElementById('elementName').textContent = element.name;
    document.getElementById('elementSymbolLarge').textContent = element.symbol;
    document.getElementById('elementSymbolLarge').style.background = getCategoryColor(element.category);
    document.getElementById('atomicNumber').textContent = element.number;
    document.getElementById('atomicMass').textContent = element.mass;
    document.getElementById('group').textContent = element.group;
    document.getElementById('period').textContent = element.period;
    document.getElementById('block').textContent = element.block.toUpperCase();
    document.getElementById('state').textContent = element.state;

    const description = document.getElementById('elementDescription');
    if (description) {
        description.innerHTML = `
            <h4>Tavsif:</h4>
            <p>${element.description}</p>
            <div class="element-properties">
                <p><strong>Elektronlar soni:</strong> ${element.electrons}</p>
                <p><strong>Zichlik:</strong> ${element.density}</p>
                <p><strong>Erish harorati:</strong> ${element.melt}</p>
                <p><strong>Qaynash harorati:</strong> ${element.boil}</p>
                <p><strong>Kashf qilingan yili:</strong> ${element.discovered}</p>
            </div>
        `;
    }

    // Add event listeners to modal buttons
    document.getElementById('experimentWithElement')?.addEventListener('click', () => {
        showNotification(`${element.name} bilan eksperiment oynasi ochiladi`, 'info');
        modal.classList.remove('active');
        setTimeout(() => openExperimentLab(element), 300);
    });

    document.getElementById('saveElement')?.addEventListener('click', () => {
        saveElementToFavorites(element);
    });
}

function getCategoryColor(category) {
    const colors = {
        metal: '#4ECDC4',
        nonmetal: '#FF6B6B',
        alkali: '#FFD166',
        'alkaline-earth': '#FF9E6D',
        transition: '#06D6A0',
        metalloid: '#9D4EDD',
        noble: '#118AB2',
        halogen: '#FB5607',
        lanthanide: '#8338EC',
        actinide: '#FF006E'
    };
    return colors[category] || '#3498db';
}

// Experiments
function initExperiments() {
    console.log('Eksperimentlar yuklanmoqda...');

    const experiments = [
        {
            id: 1,
            title: "Asos va Kislota Reaksiyasi",
            description: "NaOH va HCl o'rtasidagi neytrallanish reaksiyasini kuzatish. Bu eksperimentda asos va kislota o'rtasidagi reaksiya natijasida tuz va suv hosil bo'lishini kuzatasiz.",
            difficulty: "beginner",
            icon: "fas fa-vial",
            chemicals: ["NaOH", "HCl", "Fenolftalein"],
            safety: "Muhim: Laboratoriya xalatini kiyish va himoya ko'zoynaklarini taqish zarur.",
            procedure: [
                "1. 50ml HCl eritmasini olib, unga 2-3 tomchi fenolftalein qo'shing",
                "2. Asta-sekin NaOH eritmasini qo'shib borib aralashtiring",
                "3. Rang o'zgarishini kuzating (qizil → rangssiz)",
                "4. pH o'lchagich yordamida pH o'zgarishini kuzating"
            ]
        },
        {
            id: 2,
            title: "Metallarni Kislota Bilan Reaksiyasi",
            description: "Rux (Zn) va Sulfat kislota (H₂SO₄) reaksiyasini o'rganish. Metallarning kislotalar bilan reaksiyasida vodorod gazi ajralib chiqishini kuzatasiz.",
            difficulty: "intermediate",
            icon: "fas fa-bolt",
            chemicals: ["Zn", "H₂SO₄", "Suv"],
            safety: "Ogohlantirish: Vodorod gazi portlovchi, ochiq olovdan uzoqroq ishlang.",
            procedure: [
                "1. 2-3 bo'lak ruxni olib, kolbaga soling",
                "2. Ustiga 20ml H₂SO₄ eritmasini quying",
                "3. Vodorod gazi chiqishini kuzating",
                "4. Chiqqan gazni sinov naychasida yondiring"
            ]
        },
        {
            id: 3,
            title: "Yonish Reaksiyasi",
            description: "Magniy lentasining yonishini kuzatish. Bu eksperiment metallarning kislorod bilan reaksiyasida porloq yorug'lik va issiqlik ajralishini namoyish etadi.",
            difficulty: "advanced",
            icon: "fas fa-fire",
            chemicals: ["Mg lenta", "O₂", "Bunzen jirovi"],
            safety: "Ehtiyot bo'ling: Magniy juda porloq yonadi, qoraytirilgan ko'zoynak taqing.",
            procedure: [
                "1. Magniy lentalarini olib, ularni tozalang",
                "2. Bunzen jirovini yoqing",
                "3. Magniy lentasini pensetada ushlab, olovga tuting",
                "4. Porloq yorug'lik chiqishini kuzating"
            ]
        },
        {
            id: 4,
            title: "Tuzlarning Elektrolizi",
            description: "Suvda erigan tuzlarning elektroliz jarayonini o'rganish. Bu eksperiment elektrolitik reaksiyalar va ionlar harakatini tushunishga yordam beradi.",
            difficulty: "intermediate",
            icon: "fas fa-bolt",
            chemicals: ["NaCl", "Suv", "Elektrodlar"],
            safety: "Ehtiyot: Yuqori kuchlanish, elektr shokidan saqlaning.",
            procedure: [
                "1. NaCl eritmasini tayyorlang",
                "2. Karbon elektrodlarni joylashtiring",
                "3. Tok o'tkazishni boshlang",
                "4. Elektrodlarda gaz ajralishini kuzating"
            ]
        }
    ];

    const grid = document.querySelector('.experiments-grid');
    if (!grid) return;

    grid.innerHTML = '';

    experiments.forEach(experiment => {
        const card = document.createElement('div');
        card.className = 'experiment-card';
        card.innerHTML = `
            <div class="experiment-image">
                <i class="${experiment.icon}"></i>
            </div>
            <div class="experiment-content">
                <span class="experiment-difficulty difficulty-${experiment.difficulty}">
                    ${getDifficultyText(experiment.difficulty)}
                </span>
                <h3>${experiment.title}</h3>
                <p>${experiment.description}</p>
                <div class="chemicals">
                    ${experiment.chemicals.map(chem =>
                        `<span class="chemical-tag">${chem}</span>`
                    ).join('')}
                </div>
                <button class="btn btn-primary" onclick="openExperimentLab(${experiment.id})">
                    <i class="fas fa-play"></i> Boshlash
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getDifficultyText(level) {
    const levels = {
        beginner: "Boshlang'ich",
        intermediate: "O'rta",
        advanced: "Murakkab"
    };
    return levels[level] || level;
}

function openExperimentLab(experimentId) {
    const modal = document.getElementById('experimentLab');
    if (!modal) return;

    modal.classList.add('active');

    // Load experiment data based on ID
    const experiments = {
        1: {
            title: "Asos va Kislota Reaksiyasi",
            description: "NaOH va HCl o'rtasidagi neytrallanish reaksiyasini kuzatish.",
            chemicals: ["NaOH", "HCl", "Fenolftalein"],
            equation: "NaOH + HCl → NaCl + H₂O",
            type: "Neytrallanish reaksiyasi"
        },
        2: {
            title: "Metallarni Kislota Bilan Reaksiyasi",
            description: "Rux (Zn) va Sulfat kislota (H₂SO₄) reaksiyasini o'rganish.",
            chemicals: ["Zn", "H₂SO₄"],
            equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
            type: "Metallarning kislotalar bilan reaksiyasi"
        },
        3: {
            title: "Yonish Reaksiyasi",
            description: "Magniy lentasining yonishini kuzatish.",
            chemicals: ["Mg lenta", "O₂"],
            equation: "2Mg + O₂ → 2MgO",
            type: "Yonish reaksiyasi"
        }
    };

    const experiment = experiments[experimentId] || experiments[1];

    document.getElementById('experimentTitle').textContent = experiment.title;

    // Initialize chemical list
    const chemicalList = document.getElementById('chemicalList');
    if (chemicalList) {
        chemicalList.innerHTML = experiment.chemicals.map(chem =>
            `<div class="chemical-item">
                <i class="fas fa-vial"></i>
                <span>${chem}</span>
                <input type="number" value="1" min="0.1" max="10" step="0.1">
                <span>mol</span>
            </div>`
        ).join('');
    }

    // Initialize experiment lab
    initExperimentLab(experiment);
}

function initExperimentLab(experiment) {
    // Temperature control
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('tempValue');

    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', (e) => {
            tempValue.textContent = `${e.target.value}°C`;
        });
    }

    // Concentration control
    const concSlider = document.getElementById('concentration');
    const concValue = document.getElementById('concValue');

    if (concSlider && concValue) {
        concSlider.addEventListener('input', (e) => {
            concValue.textContent = `${e.target.value}M`;
        });
    }

    // Run experiment button
    const runBtn = document.getElementById('runExperiment');
    if (runBtn) {
        runBtn.onclick = () => runExperiment(experiment);
    }

    // Reset button
    const resetBtn = document.getElementById('resetExperiment');
    if (resetBtn) {
        resetBtn.onclick = resetExperiment;
    }
}

function runExperiment(experiment) {
    showNotification('Eksperiment bajarilmoqda...', 'info');

    // Disable controls during experiment
    const runBtn = document.getElementById('runExperiment');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Jarayonda...';
    }

    // Simulate experiment with progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
            clearInterval(interval);
            showNotification('Eksperiment muvaffaqiyatli yakunlandi!', 'success');
            showExperimentResults(experiment);

            // Re-enable button
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fas fa-play"></i> Ishga tushirish';
            }
        }
    }, 500);
}

function showExperimentResults(experiment) {
    const reactionInfo = document.getElementById('reactionInfo');
    if (!reactionInfo) return;

    const temperature = document.getElementById('temperature')?.value || '25';
    const concentration = document.getElementById('concentration')?.value || '1';

    reactionInfo.innerHTML = `
        <h4>Eksperiment Natijalari:</h4>
        <div class="result-item">
            <strong>Reaksiya tenglamasi:</strong>
            <span class="equation">${experiment.equation}</span>
        </div>
        <div class="result-item">
            <strong>Reaksiya turi:</strong>
            <span>${experiment.type}</span>
        </div>
        <div class="result-item">
            <strong>Harorat:</strong>
            <span>${temperature}°C</span>
        </div>
        <div class="result-item">
            <strong>Konsentratsiya:</strong>
            <span>${concentration}M</span>
        </div>
        <div class="result-item">
            <strong>Reaksiya tezligi:</strong>
            <span>${(Math.random() * 10 + 5).toFixed(2)} mol/L·s</span>
        </div>
        <div class="result-item">
            <strong>Harorat o'zgarishi:</strong>
            <span class="temperature-change">+${(Math.random() * 8 + 2).toFixed(1)}°C</span>
        </div>
        <div class="result-item">
            <strong>pH o'zgarishi:</strong>
            <span>13 → 7 (neytral)</span>
        </div>
        <div class="success-note">
            <i class="fas fa-check-circle"></i>
            <span>Eksperiment muvaffaqiyatli yakunlandi!</span>
        </div>
    `;
}

function resetExperiment() {
    // Reset sliders
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('tempValue');
    if (tempSlider && tempValue) {
        tempSlider.value = 25;
        tempValue.textContent = '25°C';
    }

    const concSlider = document.getElementById('concentration');
    const concValue = document.getElementById('concValue');
    if (concSlider && concValue) {
        concSlider.value = 1;
        concValue.textContent = '1M';
    }

    // Clear results
    const reactionInfo = document.getElementById('reactionInfo');
    if (reactionInfo) {
        reactionInfo.innerHTML = '';
    }

    showNotification('Eksperiment qayta tiklandi', 'info');
}

// Technology
function initTechnology() {
    console.log('Texnologiyalar yuklanmoqda...');

    const tabs = document.querySelectorAll('.tech-tab');
    const panels = document.querySelectorAll('.tech-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tabId) {
                    panel.classList.add('active');
                }
            });

            // Initialize the selected technology
            initializeTechnology(tabId);
        });
    });

    // Initialize first technology
    if (tabs.length > 0) {
        initializeTechnology(tabs[0].dataset.tab);
    }
}

function initializeTechnology(techId) {
    switch(techId) {
        case 'spectroscopy':
            initSpectrometer();
            break;
        case 'chromatography':
            initChromatography();
            break;
        case 'microscopy':
            initMicroscopy();
            break;
        case 'titration':
            initTitration();
            break;
    }
}

function initSpectrometer() {
    const analyzeBtn = document.getElementById('analyzeSample');
    const sampleSelect = document.getElementById('sampleSelect');
    const spectrumDisplay = document.getElementById('spectrumDisplay');

    if (!analyzeBtn || !sampleSelect || !spectrumDisplay) return;

    analyzeBtn.addEventListener('click', () => {
        const sample = sampleSelect.value;
        analyzeSpectrum(sample);
    });

    // Auto-analyze on sample change
    sampleSelect.addEventListener('change', (e) => {
        analyzeSpectrum(e.target.value);
    });

    // Initial analysis
    analyzeSpectrum(sampleSelect.value);
}

function analyzeSpectrum(sample) {
    const spectra = {
        na: [
            {wavelength: '589.0 nm', intensity: 90, color: '#FFD700', element: 'Natrium'},
            {wavelength: '589.6 nm', intensity: 85, color: '#FFD700', element: 'Natrium'}
        ],
        k: [
            {wavelength: '766.5 nm', intensity: 95, color: '#FF4500', element: 'Kaliy'},
            {wavelength: '769.9 nm', intensity: 92, color: '#FF4500', element: 'Kaliy'}
        ],
        cu: [
            {wavelength: '324.7 nm', intensity: 88, color: '#1E90FF', element: 'Mis'},
            {wavelength: '327.4 nm', intensity: 85, color: '#1E90FF', element: 'Mis'}
        ],
        h2o: [
            {wavelength: '656.3 nm', intensity: 80, color: '#FF0000', element: 'Vodorod'},
            {wavelength: '486.1 nm', intensity: 75, color: '#00FF00', element: 'Vodorod'},
            {wavelength: '434.0 nm', intensity: 70, color: '#0000FF', element: 'Vodorod'}
        ]
    };

    const sampleNames = {
        na: 'Natrium (Na)',
        k: 'Kaliy (K)',
        cu: 'Mis (Cu)',
        h2o: 'Suv (H₂O)'
    };

    const spectrumData = spectra[sample] || spectra.na;
    const spectrumDisplay = document.getElementById('spectrumDisplay');

    if (!spectrumDisplay) return;

    // Clear previous spectrum
    spectrumDisplay.innerHTML = '';

    // Create spectrum lines
    spectrumData.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.className = 'spectrum-line';
        lineElement.style.left = `${(parseFloat(line.wavelength) - 300) / 2}px`;
        lineElement.style.height = `${line.intensity}%`;
        lineElement.style.backgroundColor = line.color;
        lineElement.title = `${line.element}: ${line.wavelength}`;
        spectrumDisplay.appendChild(lineElement);
    });

    // Show analysis result
    showNotification(`${sampleNames[sample]} tahlil qilindi - ${spectrumData.length} ta spektr chizig'i aniqlangan`, 'success');
}

function initChromatography() {
    // Chromatography initialization
    console.log('Xromatografiya tizimi ishga tushirildi');
}

function initMicroscopy() {
    // Microscopy initialization
    console.log('Mikroskopiya tizimi ishga tushirildi');
}

function initTitration() {
    // Titration initialization
    console.log('Titratsiya tizimi ishga tushirildi');
}

// Modals
function initModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 16px 24px;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;

    // Add styles for animation
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'var(--secondary-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--primary-color)'
    };
    return colors[type] || 'var(--primary-color)';
}

async function checkServerStatus() {
    try {
        // In real app, check backend connection
        // For now, simulate success
        setTimeout(() => {
            showNotification('Backend serverga muvaffaqiyatli ulandi', 'success');
        }, 1500);
    } catch (error) {
        showNotification('Serverni ishga tushiring: python app.py', 'error');
    }
}

function saveElementToFavorites(element) {
    const favorites = JSON.parse(localStorage.getItem('favoriteElements') || '[]');

    // Check if element already in favorites
    const existingIndex = favorites.findIndex(fav => fav.number === element.number);

    if (existingIndex === -1) {
        // Add to favorites
        favorites.push(element);
        localStorage.setItem('favoriteElements', JSON.stringify(favorites));
        showNotification(`${element.name} sevimlilarga qo'shildi`, 'success');
    } else {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        localStorage.setItem('favoriteElements', JSON.stringify(favorites));
        showNotification(`${element.name} sevimlilardan olib tashlandi`, 'info');
    }
}

// Demo button
document.getElementById('demo-btn')?.addEventListener('click', () => {
    showNotification('Demo rejimi ishga tushirildi', 'info');

    // Start demo tour
    setTimeout(() => {
        scrollToSection('elements');
        showNotification('Elementlar jadvalini ko\'rib chiqing', 'info');
    }, 1000);

    setTimeout(() => {
        const element = {
            number: 1,
            symbol: "H",
            name: "Vodorod",
            category: "nonmetal",
            mass: "1.008",
            group: 1,
            period: 1,
            block: "s",
            state: "Gaz",
            description: "Eng oddiy va eng keng tarqalgan element.",
            electrons: "1",
            density: "0.0000899 g/cm³",
            melt: "-259.16°C",
            boil: "-252.87°C",
            discovered: "1766"
        };
        showElementDetails(element);
    }, 3000);
});

// Login button
document.getElementById('login-btn')?.addEventListener('click', () => {
    showNotification('Tizimga kirish oynasi ochiladi', 'info');
    // In real app, show login modal
    // For now, show notification
    setTimeout(() => {
        showNotification('Kirish oynasi: Backend bilan birga ishlaydi', 'warning');
    }, 500);
});

// Window load event
window.addEventListener('load', () => {
    console.log('Virtual Kimyo Laboratoriyasi yuklandi!');

    // Add some interactivity
    const atoms = document.querySelectorAll('.atom');
    atoms.forEach(atom => {
        atom.addEventListener('mouseenter', () => {
            atom.style.transform = 'scale(1.2)';
        });

        atom.addEventListener('mouseleave', () => {
            atom.style.transform = 'scale(1)';
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + D for dark mode toggle
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.click();
        }

        // Escape to close all modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
});