/* ============================================================
   Virtual Kimyo Laboratoriyasi — kalkulyator, o'yin, formulalar
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};
    const { $, $$, el, escapeHTML, storage, shuffle } = Lab.utils;
    const elementData = Lab.elementData;

    /* ---------------- Molyar massa kalkulyatori ---------------- */
    function parseFormula(formula) {
        if (!formula || !formula.trim()) throw new Error("Formulani kiriting.");
        let input = formula.replace(/\s+/g, "").replace(/[·.]/g, "*");
        if (!input) throw new Error("Formulani kiriting.");

        const bySymbol = elementData.bySymbol;
        const segments = input.split("*");
        const totalCounts = {};
        let totalMass = 0;

        const parseSegment = segment => {
            const counts = {};
            const stack = [counts];
            let i = 0;
            while (i < segment.length) {
                const char = segment[i];
                if (char === "(") {
                    stack.push({});
                    i += 1;
                } else if (char === ")") {
                    if (stack.length === 1) throw new Error("Qavslar noto'g'ri yopilgan.");
                    const group = stack.pop();
                    i += 1;
                    let number = "";
                    while (i < segment.length && /\d/.test(segment[i])) number += segment[i++];
                    const multiplier = number ? Number(number) : 1;
                    Object.entries(group).forEach(([symbol, count]) => {
                        stack[stack.length - 1][symbol] = (stack[stack.length - 1][symbol] || 0) + count * multiplier;
                    });
                } else if (/[A-Z]/.test(char)) {
                    let symbol = char;
                    i += 1;
                    if (i < segment.length && /[a-z]/.test(segment[i])) {
                        symbol += segment[i];
                        i += 1;
                    }
                    if (!bySymbol.has(symbol.toLowerCase())) throw new Error(`Noma'lum element: ${symbol}`);
                    let number = "";
                    while (i < segment.length && /\d/.test(segment[i])) number += segment[i++];
                    const count = number ? Number(number) : 1;
                    stack[stack.length - 1][symbol] = (stack[stack.length - 1][symbol] || 0) + count;
                } else {
                    throw new Error(`Formulada noto'g'ri belgi: "${char}"`);
                }
            }
            if (stack.length !== 1) throw new Error("Qavslar yopilmagan.");
            return counts;
        };

        segments.forEach(segment => {
            const match = segment.match(/^(\d+)(.*)$/);
            let multiplier = 1;
            let body = segment;
            if (match) {
                multiplier = Number(match[1]);
                body = match[2];
            }
            if (!body) throw new Error("Formulada element ko'rsatilmagan.");
            const counts = parseSegment(body);
            Object.entries(counts).forEach(([symbol, count]) => {
                totalCounts[symbol] = (totalCounts[symbol] || 0) + count * multiplier;
            });
        });

        const breakdown = Object.entries(totalCounts).map(([symbol, count]) => {
            const element = bySymbol.get(symbol.toLowerCase());
            const mass = parseFloat(element.mass) || 0;
            totalMass += mass * count;
            return { symbol, count, mass, subtotal: mass * count, name: element.name };
        });

        return { totalMass, breakdown, formula: formula.trim() };
    }

    const calculator = {
        init() {
            $$("[data-calc-tab]").forEach(tab => {
                tab.addEventListener("click", () => {
                    const id = tab.dataset.calcTab;
                    $$("[data-calc-tab]").forEach(item => item.classList.toggle("is-active", item === tab));
                    $$("[data-calc-panel]").forEach(panel => {
                        panel.hidden = panel.dataset.calcPanel !== id;
                    });
                });
            });

            const calculate = document.getElementById("molarCalculate");
            const input = document.getElementById("molarFormula");
            if (calculate) calculate.addEventListener("click", () => this.calculate());
            if (input) {
                input.addEventListener("keydown", event => {
                    if (event.key === "Enter") this.calculate();
                });
            }
            $$("[data-formula-example]").forEach(button => {
                button.addEventListener("click", () => {
                    if (input) input.value = button.dataset.formulaExample;
                    this.calculate();
                });
            });

            const dilution = document.getElementById("dilutionCalculate");
            if (dilution) dilution.addEventListener("click", () => this.dilute());
        },
        calculate() {
            const input = document.getElementById("molarFormula");
            const result = document.getElementById("molarResult");
            if (!input || !result) return;
            try {
                const parsed = parseFormula(input.value);
                result.className = "calc-result is-success";
                result.innerHTML = `
                    <div class="calc-total">
                        <span>Molyar massa</span>
                        <strong>${parsed.totalMass.toFixed(3)} g/mol</strong>
                    </div>
                    <div class="calc-breakdown">
                        <div class="calc-breakdown-head"><span>Element</span><span>Soni</span><span>Massa</span></div>
                        ${parsed.breakdown.map(item => `
                            <div class="calc-breakdown-row">
                                <span><strong>${escapeHTML(item.symbol)}</strong> ${escapeHTML(item.name)}</span>
                                <span>${item.count}</span>
                                <span>${item.subtotal.toFixed(3)} g/mol</span>
                            </div>
                        `).join("")}
                    </div>
                    <p class="hint">Hisoblash: ${parsed.breakdown.map(item => `${item.count}×${item.mass}`).join(" + ")} = ${parsed.totalMass.toFixed(3)} g/mol</p>
                `;
                Lab.notify(`${input.value} — ${parsed.totalMass.toFixed(2)} g/mol`, "success");
            } catch (error) {
                result.className = "calc-result is-error";
                result.innerHTML = `<p><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${escapeHTML(error.message)}</p>`;
            }
        },
        dilute() {
            const c1 = parseFloat(document.getElementById("dilutionC1")?.value);
            const v1 = parseFloat(document.getElementById("dilutionV1")?.value);
            const c2 = parseFloat(document.getElementById("dilutionC2")?.value);
            const result = document.getElementById("dilutionResult");
            if (!result) return;
            if (![c1, v1, c2].every(value => Number.isFinite(value) && value > 0)) {
                result.className = "calc-result is-error";
                result.innerHTML = '<p><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Barcha qiymatlarni musbat son bilan kiriting.</p>';
                return;
            }
            if (c2 > c1) {
                result.className = "calc-result is-error";
                result.innerHTML = '<p><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Suyultirishda oxirgi konsentratsiya boshlang\'ichdan kichik bo\'lishi kerak.</p>';
                return;
            }
            const v2 = (c1 * v1) / c2;
            const water = v2 - v1;
            result.className = "calc-result is-success";
            result.innerHTML = `
                <div class="calc-total">
                    <span>Yakuniy hajm</span>
                    <strong>${v2.toFixed(2)} mL</strong>
                </div>
                <div class="calc-breakdown">
                    <div class="calc-breakdown-row"><span>Qo'shiladigan suv</span><span>${water.toFixed(2)} mL</span></div>
                    <div class="calc-breakdown-row"><span>Boshlang'ich eritma</span><span>${v1.toFixed(2)} mL</span></div>
                    <div class="calc-breakdown-row"><span>Tekshirish</span><span>C₁V₁ = C₂V₂</span></div>
                </div>
                <p class="hint">${c1} M × ${v1} mL = ${c2} M × ${v2.toFixed(2)} mL</p>
            `;
            Lab.notify("Suyultirish hisoblandi", "success");
        }
    };

    /* ---------------- Element o'yini ---------------- */
    const GAME_KEY = "vkl_game_best_v1";
    const game = {
        rounds: 10,
        index: 0,
        score: 0,
        best: 0,
        current: null,
        locked: false,
        init() {
            this.best = storage.get(GAME_KEY, 0);
            this.updateBest();
            const start = document.getElementById("gameStartBtn");
            if (start) start.addEventListener("click", () => this.start());
            const restart = document.getElementById("gameRestart");
            if (restart) restart.addEventListener("click", () => this.start());
        },
        updateBest() {
            const node = document.getElementById("gameBest");
            if (node) node.textContent = this.best > 0 ? `${this.best}/${this.rounds}` : "—";
            const startBest = document.getElementById("gameStartBest");
            if (startBest) startBest.textContent = this.best > 0 ? `Eng yaxshi natija: ${this.best}/${this.rounds}` : "Hali o'ynalmagan";
        },
        showScreen(name) {
            ["gameStart", "gamePlay", "gameResult"].forEach(id => {
                const node = document.getElementById(id);
                if (node) node.hidden = id !== name;
            });
        },
        start() {
            this.index = 0;
            this.score = 0;
            this.locked = false;
            this.showScreen("gamePlay");
            this.nextQuestion();
        },
        pool() {
            return elementData.elements.filter(element => element.n <= 92);
        },
        nextQuestion() {
            if (this.index >= this.rounds) {
                this.finish();
                return;
            }
            const pool = this.pool();
            const target = pool[Math.floor(Math.random() * pool.length)];
            const type = Math.random() > 0.5 ? "symbol-to-name" : "name-to-symbol";
            const distractors = shuffle(pool.filter(element => element.n !== target.n)).slice(0, 3);
            const options = shuffle([target, ...distractors]);
            this.current = { target, type, options };
            this.locked = false;

            const question = document.getElementById("gameQuestion");
            if (question) {
                question.innerHTML = type === "symbol-to-name"
                    ? `<span class="game-symbol">${escapeHTML(target.s)}</span><span class="game-prompt">Bu qaysi element?</span>`
                    : `<span class="game-name">${escapeHTML(target.name)}</span><span class="game-prompt">Uning kimyoviy belgisi qaysi?</span>`;
            }

            const round = document.getElementById("gameRound");
            if (round) round.textContent = `${this.index + 1} / ${this.rounds}`;
            const score = document.getElementById("gameScore");
            if (score) score.textContent = String(this.score);

            const optionsBox = document.getElementById("gameOptions");
            if (optionsBox) {
                optionsBox.innerHTML = "";
                options.forEach(option => {
                    const button = el("button", "game-option", { type: "button" });
                    button.textContent = type === "symbol-to-name" ? option.name : option.s;
                    button.addEventListener("click", () => this.answer(option, button));
                    optionsBox.appendChild(button);
                });
            }
        },
        answer(option, button) {
            if (this.locked || !this.current) return;
            this.locked = true;
            const correct = option.n === this.current.target.n;
            if (correct) this.score += 1;
            const score = document.getElementById("gameScore");
            if (score) score.textContent = String(this.score);

            $$(".game-option").forEach(node => {
                node.disabled = true;
                const value = node.textContent;
                const expected = this.current.type === "symbol-to-name" ? this.current.target.name : this.current.target.s;
                if (value === expected) node.classList.add("is-correct");
            });
            if (!correct) button.classList.add("is-wrong");

            setTimeout(() => {
                this.index += 1;
                this.nextQuestion();
            }, correct ? 650 : 1100);
        },
        finish() {
            this.showScreen("gameResult");
            if (this.score > this.best) {
                this.best = this.score;
                storage.set(GAME_KEY, this.best);
                this.updateBest();
            }
            const score = document.getElementById("gameResultScore");
            if (score) score.textContent = `${this.score} / ${this.rounds}`;
            const message = document.getElementById("gameResultMessage");
            if (message) {
                message.textContent = this.score >= 9
                    ? "Zo'r! Siz elementlarni mukammal bilasiz."
                    : this.score >= 6
                        ? "Yaxshi natija! Yana biroz mashq qiling."
                        : "Elementlarni takrorlashga arziydi. Yana urinib ko'ring!";
            }
            Lab.notify(`O'yin yakunlandi: ${this.score}/${this.rounds}`, this.score >= 6 ? "success" : "info");
        }
    };

    /* ---------------- Formulalar varaqasi ---------------- */
    const formula = {
        init() {
            const print = document.getElementById("printFormulas");
            if (print) print.addEventListener("click", () => window.print());
            const download = document.getElementById("downloadFormulas");
            if (download) {
                download.addEventListener("click", () => {
                    const content = document.getElementById("formulaSheet");
                    if (!content) return;
                    const html = `<!DOCTYPE html><html lang="uz"><head><meta charset="UTF-8"><title>Kimyo formulalari</title><style>
                        body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6;color:#0f172a}
                        h1{color:#2563eb;border-bottom:3px solid #10b981;padding-bottom:10px}
                        h2{color:#0f766e;margin-top:28px}
                        table{border-collapse:collapse;width:100%;margin:10px 0}
                        th,td{border:1px solid #cbd5e1;padding:8px 10px;text-align:left}
                        th{background:#f1f5f9}
                        .formula{font-family:ui-monospace,monospace;background:#f8fafc;padding:2px 6px;border-radius:4px}
                        footer{margin-top:40px;font-size:12px;color:#64748b;text-align:center}
                    </style></head><body>${content.innerHTML}<footer>Virtual Kimyo Laboratoriyasi — formulalar varaqasi</footer></body></html>`;
                    Lab.utils.downloadText("kimyo-formulalari.html", html, "text/html;charset=utf-8");
                    Lab.notify("Formulalar varaqasi yuklab olindi", "success");
                });
            }
        }
    };

    Lab.utils.ready(() => {
        calculator.init();
        game.init();
        formula.init();
    });

    Lab.tools = { calculator, game, formula, parseFormula };
})(typeof window !== "undefined" ? window : globalThis);
