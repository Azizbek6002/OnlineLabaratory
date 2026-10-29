/* ============================================================
   Virtual Kimyo Laboratoriyasi — eksperimentlar moduli
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};
    const { $, $$, el, escapeHTML } = Lab.utils;
    const data = Lab.experimentData;

    if (!data) {
        console.error("Eksperiment ma'lumotlari topilmadi.");
        return;
    }

    const state = {
        current: null,
        running: false,
        runToken: 0,
        difficulty: "all"
    };

    const difficultyLabel = value => (data.difficulty[value] || { label: value }).label;

    function renderCards() {
        const grid = document.getElementById("experimentsGrid");
        if (!grid) return;
        grid.innerHTML = "";

        data.experiments.forEach(experiment => {
            const card = el("article", "experiment-card", { "data-id": experiment.id });
            card.innerHTML = `
                <div class="experiment-card-head">
                    <span class="difficulty-badge ${experiment.difficulty}">${difficultyLabel(experiment.difficulty)}</span>
                    <span class="experiment-duration"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${escapeHTML(experiment.duration)}</span>
                </div>
                <div class="experiment-icon" aria-hidden="true"><i class="${experiment.icon}"></i></div>
                <h3>${escapeHTML(experiment.title)}</h3>
                <p class="experiment-formula">${escapeHTML(experiment.subtitle)}</p>
                <p class="experiment-description">${escapeHTML(experiment.description)}</p>
                <div class="chemical-tags">
                    ${experiment.chemicals.map(chemical => `<span class="chemical-chip">${escapeHTML(chemical)}</span>`).join("")}
                </div>
                <div class="experiment-card-footer">
                    <span class="experiment-done" hidden><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Bajarilgan</span>
                    <button type="button" class="btn btn-primary btn-sm" data-open-experiment="${experiment.id}">
                        <i class="fa-solid fa-play" aria-hidden="true"></i> Laboratoriyani ochish
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        updateCompletedBadges();
        applyDifficultyFilter();
    }

    function applyDifficultyFilter() {
        const cards = $$(".experiment-card");
        cards.forEach(card => {
            const experiment = data.get(card.dataset.id);
            const visible = state.difficulty === "all" || experiment.difficulty === state.difficulty;
            card.hidden = !visible;
        });
    }

    function updateCompletedBadges() {
        $$(".experiment-card").forEach(card => {
            const done = Lab.progress.isExperimentDone(card.dataset.id);
            const badge = $(".experiment-done", card);
            if (badge) badge.hidden = !done;
            card.classList.toggle("is-completed", done);
        });
    }

    function buildControls(experiment) {
        const box = document.getElementById("experimentControls");
        if (!box) return;
        box.innerHTML = "";

        experiment.params.forEach(param => {
            const id = `param-${experiment.id}-${param.id}`;
            const group = el("div", "lab-param");
            group.innerHTML = `
                <div class="lab-param-head">
                    <label for="${id}">${escapeHTML(param.label)}</label>
                    <span class="lab-param-value"><output for="${id}" data-output="${param.id}">${param.value}</output> ${escapeHTML(param.unit)}</span>
                </div>
                <input type="range" id="${id}" data-param="${param.id}" min="${param.min}" max="${param.max}" step="${param.step}" value="${param.value}">
                <div class="lab-param-scale"><span>${param.min}</span><span>${param.max}</span></div>
            `;
            box.appendChild(group);

            const input = $("input", group);
            const output = $("output", group);
            input.addEventListener("input", () => {
                output.textContent = input.value;
                markStale();
            });
        });
    }

    function readParams() {
        const params = {};
        $$("#experimentControls [data-param]").forEach(input => {
            params[input.dataset.param] = input.value;
        });
        return params;
    }

    function resetParams(experiment) {
        experiment.params.forEach(param => {
            const input = document.querySelector(`#experimentControls [data-param="${param.id}"]`);
            const output = document.querySelector(`#experimentControls [data-output="${param.id}"]`);
            if (input) input.value = param.value;
            if (output) output.textContent = param.value;
        });
    }

    function buildProcedure(experiment) {
        const list = document.getElementById("experimentProcedure");
        if (!list) return;
        list.innerHTML = experiment.procedure.map((step, index) => `
            <li>
                <span class="step-index">${index + 1}</span>
                <span>${escapeHTML(step)}</span>
            </li>
        `).join("");
    }

    function buildChemicals(experiment) {
        const box = document.getElementById("experimentChemicals");
        if (!box) return;
        box.innerHTML = experiment.chemicals.map(chemical => `
            <span class="chemical-chip"><i class="fa-solid fa-vial" aria-hidden="true"></i> ${escapeHTML(chemical)}</span>
        `).join("");
    }

    function setText(id, value) {
        const node = document.getElementById(id);
        if (node) node.textContent = value;
    }

    function open(id) {
        const experiment = data.get(id) || data.experiments[0];
        if (!experiment) return;
        state.current = experiment;
        state.runToken += 1;
        state.running = false;

        setText("experimentTitle", experiment.title);
        setText("experimentSubtitle", experiment.subtitle);
        setText("experimentType", experiment.type);
        setText("experimentEquation", experiment.equation);
        setText("experimentSafety", experiment.safety);
        setText("experimentDescriptionText", experiment.description);

        buildControls(experiment);
        buildProcedure(experiment);
        buildChemicals(experiment);
        resetLab(experiment);

        const modal = document.getElementById("experimentLab");
        if (modal) {
            modal.dataset.experiment = experiment.id;
            modal.style.setProperty("--experiment-accent", experiment.difficulty === "advanced" ? "#f97316" : experiment.difficulty === "intermediate" ? "#eab308" : "#10b981");
        }

        Lab.modal.open("experimentLab", { focus: "#runExperiment" });
    }

    function clearStage() {
        const stage = document.getElementById("labStage");
        const bubbles = document.getElementById("labBubbles");
        const liquid = document.getElementById("labLiquid");
        if (stage) {
            stage.className = "lab-stage";
            stage.style.removeProperty("--liquid-color");
            stage.style.removeProperty("--liquid-level");
        }
        if (bubbles) bubbles.innerHTML = "";
        $$(".electrode-bubbles").forEach(node => {
            node.innerHTML = "";
        });
        if (liquid) liquid.style.background = "";
        const readout = document.getElementById("labReadout");
        if (readout) readout.textContent = "Tayyor";
        const precipitate = document.getElementById("labPrecipitate");
        if (precipitate) precipitate.style.opacity = "0";
    }

    function resetLab(experiment) {
        state.runToken += 1;
        state.running = false;
        clearStage();
        resetParams(experiment || state.current);
        const progress = document.getElementById("experimentProgressBar");
        if (progress) progress.style.width = "0%";
        const results = document.getElementById("experimentResults");
        if (results) {
            results.innerHTML = `
                <div class="results-placeholder">
                    <i class="fa-solid fa-flask" aria-hidden="true"></i>
                    <p>Parametrlarni tanlang va <strong>“Ishga tushirish”</strong> tugmasini bosing.</p>
                </div>
            `;
        }
        const runBtn = document.getElementById("runExperiment");
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Ishga tushirish';
        }
        const readout = document.getElementById("labReadout");
        if (readout) readout.textContent = "Tayyor";
    }

    function markStale() {
        const results = document.getElementById("experimentResults");
        if (results && results.dataset.filled === "true") {
            results.classList.add("is-stale");
            const note = $(".stale-note", results);
            if (note) note.hidden = false;
        }
    }

    function makeBubbles(container, options = {}) {
        if (!container) return;
        const count = options.count || 18;
        const color = options.color || "rgba(255,255,255,0.65)";
        for (let i = 0; i < count; i += 1) {
            const bubble = el("span", "bubble");
            bubble.style.left = `${5 + Math.random() * 88}%`;
            bubble.style.width = `${4 + Math.random() * 10}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.animationDelay = `${Math.random() * 1.6}s`;
            bubble.style.animationDuration = `${1.1 + Math.random() * 1.7}s`;
            bubble.style.background = color;
            container.appendChild(bubble);
        }
    }

    function applyEffect(result) {
        const stage = document.getElementById("labStage");
        if (!stage) return;
        clearStage();
        stage.classList.add("is-active");
        stage.style.setProperty("--liquid-color", result.color || "#dbeafe");
        stage.style.setProperty("--liquid-level", `${58 + (result.intensity || 0.5) * 20}%`);

        const bubbles = document.getElementById("labBubbles");
        const readout = document.getElementById("labReadout");
        const precipitate = document.getElementById("labPrecipitate");

        switch (result.effect) {
            case "bubbles":
            case "gas":
                stage.classList.add("is-bubbling");
                makeBubbles(bubbles, { count: 24 });
                if (readout) readout.textContent = result.effect === "gas" ? "Gaz ajralmoqda" : "Pufakchalar ajralmoqda";
                break;
            case "electrolysis":
                stage.classList.add("is-electrolysis", "is-bubbling");
                makeBubbles($(".electrode-bubbles.left"), { count: 12 });
                makeBubbles($(".electrode-bubbles.right"), { count: 12 });
                if (readout) readout.textContent = "Elektroliz ketmoqda";
                break;
            case "flame":
                stage.classList.add("is-burning");
                if (readout) readout.textContent = "Yonish reaksiyasi";
                break;
            case "precipitate":
                stage.classList.add("is-precipitating");
                if (precipitate) precipitate.style.opacity = "1";
                if (readout) readout.textContent = "Cho'kma hosil bo'ldi";
                break;
            case "color":
                stage.classList.add("is-color-changing");
                if (readout) readout.textContent = result.intensity > 0.6 ? "Rang o'zgardi" : "Reaksiya yakunlandi";
                break;
            default:
                if (readout) readout.textContent = "Reaksiya yakunlandi";
        }
    }

    function renderResults(experiment, result) {
        const box = document.getElementById("experimentResults");
        if (!box) return;
        box.dataset.filled = "true";
        box.classList.remove("is-stale");
        box.innerHTML = `
            <div class="result-success">
                <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
                <div>
                    <strong>Eksperiment yakunlandi</strong>
                    <span>Natijalar hisob-kitob asosida olindi.</span>
                </div>
            </div>
            <div class="result-equation">${escapeHTML(experiment.equation)}</div>
            <p class="stale-note" hidden><i class="fa-solid fa-rotate" aria-hidden="true"></i> Parametrlar o'zgardi — natijani yangilash uchun qayta ishga tushiring.</p>
            <div class="result-list">
                ${result.results.map(item => `
                    <div class="result-row">
                        <span>${escapeHTML(item.label)}</span>
                        <strong>${escapeHTML(item.value)}</strong>
                    </div>
                `).join("")}
            </div>
            <div class="observations">
                <h4><i class="fa-solid fa-eye" aria-hidden="true"></i> Kuzatishlar</h4>
                <ul>
                    ${result.observations.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
                </ul>
            </div>
        `;
    }

    function run() {
        const experiment = state.current;
        if (!experiment || state.running) return;

        const params = readParams();
        const result = experiment.simulate(params);
        const runBtn = document.getElementById("runExperiment");
        const progress = document.getElementById("experimentProgressBar");
        const token = ++state.runToken;
        state.running = true;

        if (runBtn) {
            runBtn.disabled = true;
            runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Jarayonda...';
        }

        const start = performance.now();
        const duration = 1300;

        // setInterval (not requestAnimationFrame) so the simulation also
        // finishes when the browser tab is in the background and rAF is paused.
        const timer = setInterval(() => {
            if (token !== state.runToken) {
                clearInterval(timer);
                return;
            }
            const ratio = Math.min(1, (performance.now() - start) / duration);
            if (progress) progress.style.width = `${Math.round(ratio * 100)}%`;
            if (ratio >= 1) {
                clearInterval(timer);
                state.running = false;
                applyEffect(result);
                renderResults(experiment, result);
                Lab.progress.completeExperiment(experiment.id);
                updateCompletedBadges();
                Lab.notify("Eksperiment muvaffaqiyatli yakunlandi!", "success");
                if (runBtn) {
                    runBtn.disabled = false;
                    runBtn.innerHTML = '<i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Qayta ishga tushirish';
                }
            }
        }, 40);
    }

    function bindEvents() {
        const grid = document.getElementById("experimentsGrid");
        if (grid) {
            grid.addEventListener("click", event => {
                const button = event.target.closest("[data-open-experiment]");
                if (button) open(button.dataset.openExperiment);
            });
        }

        $$(".experiment-filter").forEach(chip => {
            chip.addEventListener("click", () => {
                state.difficulty = chip.dataset.difficulty;
                $$(".experiment-filter").forEach(item => {
                    const active = item === chip;
                    item.classList.toggle("is-active", active);
                    item.setAttribute("aria-pressed", active ? "true" : "false");
                });
                applyDifficultyFilter();
            });
        });

        const runBtn = document.getElementById("runExperiment");
        if (runBtn) runBtn.addEventListener("click", run);

        const resetBtn = document.getElementById("resetExperiment");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                resetLab(state.current);
                Lab.notify("Laboratoriya qayta tiklandi", "info");
            });
        }

        document.addEventListener("lab:progress-change", updateCompletedBadges);
    }

    const api = { open, render: renderCards, state };
    Lab.experiments = api;

    Lab.utils.ready(() => {
        renderCards();
        bindEvents();
    });
})(typeof window !== "undefined" ? window : globalThis);
