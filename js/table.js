/* ============================================================
   Virtual Kimyo Laboratoriyasi — davriy jadval moduli
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};
    const { $, $$, el, escapeHTML, debounce, clamp } = Lab.utils;
    const data = Lab.elementData;

    if (!data) {
        console.error("Element ma'lumotlari topilmadi.");
        return;
    }

    const state = {
        filter: "all",
        search: "",
        favoritesOnly: false,
        currentElement: null
    };

    const normalize = value => String(value ?? "")
        .toLowerCase()
        .replace(/['’`]/g, "")
        .trim();

    const elementMatchesSearch = (element, term) => {
        if (!term) return true;
        const haystack = [
            element.name,
            element.s,
            element.n,
            element.mass,
            element.categoryInfo.label
        ].map(normalize).join(" ");
        return normalize(term).split(/\s+/).every(part => haystack.includes(part));
    };

    function renderPeriodicTable() {
        const table = document.getElementById("periodicTable");
        if (!table) return;
        table.innerHTML = "";

        // Asosiy 7 davr + f-blok uchun 2 qator + 1 bo'sh ajratgich
        data.elements.forEach(element => {
            const cell = el("button", "element-card", {
                type: "button",
                "data-number": element.n,
                "data-row": element.position.row,
                "data-col": element.position.col,
                "aria-label": `${element.n}-element: ${element.name} (${element.s}), ${element.categoryInfo.label}`,
                title: `${element.name} (${element.s}) — ${element.categoryInfo.label}`
            });
            cell.style.gridRow = String(element.position.row);
            cell.style.gridColumn = String(element.position.col);
            cell.style.setProperty("--cat", element.categoryInfo.color);
            cell.innerHTML = `
                <span class="element-number">${element.n}</span>
                <span class="element-symbol">${escapeHTML(element.s)}</span>
                <span class="element-name">${escapeHTML(element.name)}</span>
                <span class="element-mass">${escapeHTML(element.mass)}</span>
            `;
            if (element.synthetic) cell.classList.add("is-synthetic");
            if (Lab.favorites.has(element.n)) cell.classList.add("is-favorite");
            cell.addEventListener("click", () => openElement(element.n));
            table.appendChild(cell);
        });

        // Lantanidlar va aktinidlar uchun ko'rsatkich kataklar
        [["57–71", 6, "lanthanide", "Lantanidlar"], ["89–103", 7, "actinide", "Aktinidlar"]].forEach(([label, row, filter, title]) => {
            const marker = el("button", "element-series-marker", {
                type: "button",
                "data-filter": filter,
                "aria-label": `${title} qatoriga o'tish`,
                title
            });
            marker.style.gridRow = String(row);
            marker.style.gridColumn = "3";
            marker.innerHTML = `${label}<span>${title}</span>`;
            marker.addEventListener("click", () => setFilter(filter));
            table.appendChild(marker);
        });

        // f-blok qatorlari uchun yon yorliqlar
        [["Lantanidlar", 9, "lanthanide"], ["Aktinidlar", 10, "actinide"]].forEach(([label, row, filter]) => {
            const side = el("button", "f-block-label", {
                type: "button",
                "data-filter": filter,
                "aria-label": `${label} filtri`
            });
            side.style.gridRow = String(row);
            side.style.gridColumn = "1 / span 2";
            side.textContent = label;
            side.addEventListener("click", () => setFilter(filter));
            table.appendChild(side);
        });

        // 8-qator — vizual ajratgich
        const spacer = el("div", "table-spacer", { "aria-hidden": "true" });
        spacer.style.gridRow = "8";
        spacer.style.gridColumn = "1 / -1";
        table.appendChild(spacer);

        applyFilters();
        updateFavoriteCount();
    }

    function applyFilters() {
        const table = document.getElementById("periodicTable");
        if (!table) return;

        const cards = $$(".element-card", table);
        let visible = 0;

        cards.forEach(card => {
            const number = Number(card.dataset.number);
            const element = data.byNumber.get(number);
            if (!element) return;

            const categoryMatch = state.filter === "all" || state.filter === "favorites"
                ? true
                : element.cat === state.filter;
            const searchMatch = elementMatchesSearch(element, state.search);
            const favoriteMatch = state.filter === "favorites" ? Lab.favorites.has(number) : true;
            const favoritesOnlyMatch = state.favoritesOnly ? Lab.favorites.has(number) : true;
            const matches = categoryMatch && searchMatch && favoriteMatch && favoritesOnlyMatch;

            card.classList.toggle("is-dimmed", !matches);
            card.classList.toggle("is-match", matches && (Boolean(state.search) || state.filter !== "all" || state.favoritesOnly));
            card.setAttribute("aria-hidden", matches ? "false" : "true");
            card.tabIndex = matches ? 0 : -1;
            if (matches) visible += 1;
        });

        $$(".element-series-marker, .f-block-label", table).forEach(marker => {
            const filter = marker.dataset.filter;
            const related = data.elements.filter(item => item.cat === filter);
            const matches = related.some(element => {
                const categoryMatch = state.filter === "all" || state.filter === "favorites" ? true : element.cat === state.filter;
                const favoriteMatch = state.filter === "favorites" ? Lab.favorites.has(element.n) : true;
                const favoritesOnlyMatch = state.favoritesOnly ? Lab.favorites.has(element.n) : true;
                return categoryMatch && elementMatchesSearch(element, state.search) && favoriteMatch && favoritesOnlyMatch;
            });
            marker.classList.toggle("is-dimmed", !matches);
        });

        const counter = document.getElementById("tableResultCount");
        if (counter) {
            counter.textContent = state.search || state.filter !== "all" || state.favoritesOnly
                ? `${visible} ta element topildi`
                : "118 ta element";
        }

        const empty = document.getElementById("tableEmpty");
        if (empty) {
            empty.hidden = visible !== 0;
        }

        const activeChip = document.querySelector(".filter-chip.is-active");
        if (activeChip && activeChip.dataset.filter !== state.filter) {
            $$(".filter-chip").forEach(chip => chip.classList.toggle("is-active", chip.dataset.filter === state.filter));
        }
    }

    function setFilter(filter) {
        state.filter = filter;
        state.favoritesOnly = filter === "favorites";
        $$(".filter-chip").forEach(chip => {
            const active = chip.dataset.filter === filter;
            chip.classList.toggle("is-active", active);
            chip.setAttribute("aria-pressed", active ? "true" : "false");
        });
        applyFilters();
        if (filter !== "all") {
            const section = document.getElementById("elements");
            if (section) {
                const top = section.getBoundingClientRect().top + window.scrollY - 84;
                window.scrollTo({ top, behavior: "smooth" });
            }
        }
    }

    function setSearch(value) {
        state.search = value;
        applyFilters();
    }

    function resetFilters() {
        state.filter = "all";
        state.favoritesOnly = false;
        state.search = "";
        const searchInput = document.getElementById("elementSearch");
        if (searchInput) searchInput.value = "";
        $$(".filter-chip").forEach(chip => {
            const active = chip.dataset.filter === "all";
            chip.classList.toggle("is-active", active);
            chip.setAttribute("aria-pressed", active ? "true" : "false");
        });
        applyFilters();
    }

    function updateFavoriteCount() {
        const badge = document.getElementById("favoriteCount");
        if (badge) {
            const count = Lab.favorites.count();
            badge.textContent = String(count);
            badge.hidden = count === 0;
        }
    }

    function favoriteButtonState(element) {
        const button = document.getElementById("favoriteElementBtn");
        if (!button) return;
        const active = Lab.favorites.has(element.n);
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
        button.innerHTML = active
            ? '<i class="fa-solid fa-bookmark" aria-hidden="true"></i><span>Sevimlilarda</span>'
            : '<i class="fa-regular fa-bookmark" aria-hidden="true"></i><span>Sevimlilarga qo\'shish</span>';
    }

    function findExperimentForElement(element) {
        const experiments = Lab.experimentData?.experiments || [];
        const symbol = element.s;
        const formulaContains = chemical => {
            const words = chemical.replace(/[₀-₉]/g, ch => "0123456789"[ch.charCodeAt(0) - 0x2080])
                .split(/\s+/)
                .filter(Boolean);
            return words.some(word => {
                if (!/^(?:[A-Z][a-z]?\d*|\(|\))+$/.test(word)) return false;
                const tokens = word.match(/[A-Z][a-z]?/g) || [];
                return tokens.includes(symbol);
            });
        };
        return experiments.find(experiment => experiment.chemicals.some(formulaContains));
    }

    function openElement(number) {
        const element = data.byNumber.get(Number(number));
        if (!element) return;
        state.currentElement = element;
        Lab.progress.viewElement(element.n);

        const modal = document.getElementById("elementModal");
        if (!modal) return;

        const category = element.categoryInfo;
        modal.style.setProperty("--cat", category.color);

        const symbol = document.getElementById("elementModalSymbol");
        const name = document.getElementById("elementModalName");
        const categoryLabel = document.getElementById("elementModalCategory");
        const numberLabel = document.getElementById("elementModalNumber");
        if (symbol) symbol.textContent = element.s;
        if (name) name.textContent = element.name;
        if (categoryLabel) categoryLabel.textContent = category.label;
        if (numberLabel) numberLabel.textContent = `${element.n}-element`;

        const properties = [
            ["Atom raqami", element.n],
            ["Atom massasi", `${element.mass} a.m.b.`],
            ["Guruh", element.group],
            ["Davr", element.period],
            ["Blok", element.block.toUpperCase()],
            ["Holati (20°C)", element.state],
            ["Elektronlar soni", element.n],
            ["Elektromanfiylik", element.en ? `${element.en} (Pauling)` : "—"],
            ["Zichlik", element.density || "—"],
            ["Erish harorati", element.melt || "—"],
            ["Qaynash harorati", element.boil || "—"],
            ["Kashf etilgan", element.discovered || "—"]
        ];

        const propertiesBox = document.getElementById("elementProperties");
        if (propertiesBox) {
            propertiesBox.innerHTML = properties.map(([label, value]) => `
                <div class="property-row">
                    <span>${escapeHTML(label)}</span>
                    <strong>${escapeHTML(value)}</strong>
                </div>
            `).join("");
        }

        const description = document.getElementById("elementDescription");
        if (description) description.textContent = element.desc;
        const uses = document.getElementById("elementUses");
        if (uses) uses.textContent = element.uses;

        const note = document.getElementById("elementSyntheticNote");
        if (note) {
            note.hidden = !element.synthetic;
            note.textContent = element.synthetic
                ? "Bu element sun'iy yo'l bilan olingan yoki juda kam uchraydi; ayrim fizik qiymatlar taxminiydir."
                : "";
        }

        favoriteButtonState(element);

        const experimentBtn = document.getElementById("elementExperimentBtn");
        if (experimentBtn) {
            const experiment = findExperimentForElement(element);
            experimentBtn.dataset.experiment = experiment ? experiment.id : "";
            experimentBtn.innerHTML = experiment
                ? `<i class="fa-solid fa-flask" aria-hidden="true"></i><span>${escapeHTML(experiment.title)}</span>`
                : '<i class="fa-solid fa-flask" aria-hidden="true"></i><span>Eksperimentlar</span>';
        }

        const prev = document.getElementById("elementPrev");
        const next = document.getElementById("elementNext");
        if (prev) prev.disabled = element.n <= 1;
        if (next) next.disabled = element.n >= 118;

        Lab.modal.open("elementModal", { focus: ".modal-close" });
    }

    function stepElement(direction) {
        if (!state.currentElement) return;
        const nextNumber = clamp(state.currentElement.n + direction, 1, 118);
        openElement(nextNumber);
    }

    function navigateGrid(event, card) {
        const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const row = Number(card.dataset.row);
        const col = Number(card.dataset.col);
        let target = null;

        if (event.key === "Home") {
            target = document.querySelector('.element-card[data-number="1"]');
        } else if (event.key === "End") {
            target = document.querySelector('.element-card[data-number="118"]');
        } else {
            const direction = {
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0]
            }[event.key];
            let r = row + direction[1];
            let c = col + direction[0];
            while (r >= 1 && r <= 10 && c >= 1 && c <= 18) {
                target = document.querySelector(`.element-card[data-row="${r}"][data-col="${c}"]:not(.is-dimmed)`);
                if (target) break;
                r += direction[1];
                c += direction[0];
            }
        }

        if (target && target !== card) {
            target.focus({ preventScroll: true });
            target.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    }

    function bindEvents() {
        const search = document.getElementById("elementSearch");
        if (search) {
            search.addEventListener("input", debounce(event => setSearch(event.target.value), 120));
            search.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    search.value = "";
                    setSearch("");
                }
            });
        }

        $$(".filter-chip").forEach(chip => {
            chip.setAttribute("aria-pressed", chip.classList.contains("is-active") ? "true" : "false");
            chip.addEventListener("click", () => {
                if (chip.dataset.filter === "all") {
                    resetFilters();
                    setFilter("all");
                } else {
                    setFilter(chip.dataset.filter);
                }
            });
        });

        const reset = document.getElementById("tableReset");
        if (reset) reset.addEventListener("click", resetFilters);

        const table = document.getElementById("periodicTable");
        if (table) {
            table.addEventListener("keydown", event => {
                const card = event.target.closest(".element-card");
                if (card) navigateGrid(event, card);
            });
            table.addEventListener("mouseover", event => {
                const card = event.target.closest(".element-card");
                if (card) card.classList.add("is-hovered");
            });
            table.addEventListener("mouseout", event => {
                const card = event.target.closest(".element-card");
                if (card) card.classList.remove("is-hovered");
            });
        }

        const favoriteBtn = document.getElementById("favoriteElementBtn");
        if (favoriteBtn) {
            favoriteBtn.addEventListener("click", () => {
                if (!state.currentElement) return;
                const added = Lab.favorites.toggle(state.currentElement.n);
                favoriteButtonState(state.currentElement);
                updateFavoriteCount();
                Lab.notify(
                    added
                        ? `${state.currentElement.name} sevimlilarga qo'shildi`
                        : `${state.currentElement.name} sevimlilardan olib tashlandi`,
                    added ? "success" : "info"
                );
            });
        }

        const experimentBtn = document.getElementById("elementExperimentBtn");
        if (experimentBtn) {
            experimentBtn.addEventListener("click", () => {
                const experimentId = experimentBtn.dataset.experiment;
                Lab.modal.close("elementModal");
                if (experimentId && Lab.experiments) {
                    setTimeout(() => Lab.experiments.open(experimentId), 180);
                } else {
                    const section = document.getElementById("experiments");
                    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        }

        const prev = document.getElementById("elementPrev");
        const next = document.getElementById("elementNext");
        if (prev) prev.addEventListener("click", () => stepElement(-1));
        if (next) next.addEventListener("click", () => stepElement(1));

        document.addEventListener("lab:favorites-change", () => {
            $$(".element-card").forEach(card => {
                card.classList.toggle("is-favorite", Lab.favorites.has(Number(card.dataset.number)));
            });
            updateFavoriteCount();
            if (state.filter === "favorites" || state.favoritesOnly) applyFilters();
        });
    }

    const api = {
        render: renderPeriodicTable,
        openElement,
        setFilter,
        resetFilters,
        refresh: applyFilters,
        state
    };

    Lab.table = api;

    Lab.utils.ready(() => {
        renderPeriodicTable();
        bindEvents();
    });
})(typeof window !== "undefined" ? window : globalThis);
