/* ============================================================
   Virtual Kimyo Laboratoriyasi — yadro moduli
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    const el = (tag, className, attrs) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (attrs) {
            Object.entries(attrs).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                if (key === "text") node.textContent = value;
                else if (key === "html") node.innerHTML = value;
                else node.setAttribute(key, value);
            });
        }
        return node;
    };

    const escapeHTML = value => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const debounce = (fn, wait = 150) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(null, args), wait);
        };
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const formatNumber = (value, digits = 2) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return "—";
        return number.toLocaleString("uz-UZ", {
            minimumFractionDigits: 0,
            maximumFractionDigits: digits
        });
    };

    const shuffle = array => {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const storage = {
        get(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                return raw === null ? fallback : JSON.parse(raw);
            } catch (error) {
                return fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                /* ignore */
            }
        }
    };

    const downloadText = (filename, content, mime = "text/plain;charset=utf-8") => {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    /* ---------- Notifications ---------- */
    const TOAST_ICONS = {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };

    function getToastContainer() {
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = el("div", "toast-container", { id: "toastContainer", "aria-live": "polite", "aria-atomic": "false" });
            document.body.appendChild(container);
        }
        return container;
    }

    function notify(message, type = "info", duration = 4200) {
        const container = getToastContainer();
        const toast = el("div", `toast toast-${type}`, { role: "status" });
        const icon = el("i", `fa-solid ${TOAST_ICONS[type] || TOAST_ICONS.info}`, { "aria-hidden": "true" });
        const text = el("span", "toast-text");
        text.textContent = message;
        const close = el("button", "toast-close", { type: "button", "aria-label": "Xabarnomani yopish" });
        close.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

        toast.append(icon, text, close);
        container.appendChild(toast);

        setTimeout(() => toast.classList.add("is-visible"), 20);

        let removed = false;
        const remove = () => {
            if (removed) return;
            removed = true;
            toast.classList.remove("is-visible");
            toast.classList.add("is-leaving");
            setTimeout(() => toast.remove(), 320);
        };

        close.addEventListener("click", remove);
        const timer = setTimeout(remove, duration);
        toast.addEventListener("mouseenter", () => clearTimeout(timer), { once: true });
        return remove;
    }

    /* ---------- Modal manager ---------- */
    const modalState = new Map();
    let modalCounter = 0;

    const FOCUSABLE = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    function openModal(id, options = {}) {
        const modal = typeof id === "string" ? document.getElementById(id) : id;
        if (!modal) return null;

        if (!modalState.has(modal)) {
            modalState.set(modal, {
                lastFocus: document.activeElement,
                id: modal.id || `modal-${++modalCounter}`
            });
        }

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        if (options.trigger) {
            modal.dataset.trigger = options.trigger;
        }

        const focusTarget = options.focus
            ? modal.querySelector(options.focus)
            : modal.querySelector("[data-autofocus]") || modal.querySelector(FOCUSABLE);

        setTimeout(() => {
            if (focusTarget && typeof focusTarget.focus === "function") {
                focusTarget.focus({ preventScroll: true });
            } else {
                modal.focus({ preventScroll: true });
            }
        }, 30);

        return modal;
    }

    function closeModal(id) {
        const modal = typeof id === "string" ? document.getElementById(id) : id;
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        const state = modalState.get(modal);
        modalState.delete(modal);
        if (!document.querySelector(".modal.is-open")) {
            document.body.classList.remove("modal-open");
        }
        if (state && state.lastFocus && typeof state.lastFocus.focus === "function") {
            setTimeout(() => state.lastFocus.focus({ preventScroll: true }), 20);
        }
    }

    function closeAllModals() {
        Array.from(document.querySelectorAll(".modal.is-open")).forEach(closeModal);
    }

    function trapFocus(event) {
        if (event.key !== "Tab") return;
        const openModals = Array.from(document.querySelectorAll(".modal.is-open"));
        const modal = openModals[openModals.length - 1];
        if (!modal) return;
        const focusable = $$(FOCUSABLE, modal).filter(node => node.offsetParent !== null || node === document.activeElement);
        if (!focusable.length) {
            event.preventDefault();
            modal.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function initModalEvents() {
        document.addEventListener("click", event => {
            const opener = event.target.closest("[data-modal-open]");
            if (opener) {
                event.preventDefault();
                openModal(opener.dataset.modalOpen, { trigger: opener });
                return;
            }

            const closer = event.target.closest("[data-modal-close]");
            if (closer) {
                event.preventDefault();
                const modal = closer.closest(".modal");
                if (modal) closeModal(modal);
                return;
            }

            if (event.target.classList.contains("modal")) {
                closeModal(event.target);
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                const openModals = Array.from(document.querySelectorAll(".modal.is-open"));
                if (openModals.length) {
                    event.preventDefault();
                    closeModal(openModals[openModals.length - 1]);
                }
            } else {
                trapFocus(event);
            }
        });
    }

    /* ---------- Profile (local only) ---------- */
    const PROFILE_KEY = "vkl_profile_v1";

    const profile = {
        get() {
            return storage.get(PROFILE_KEY, null);
        },
        save(data) {
            const existing = this.get();
            const payload = Object.assign({
                name: "Mehmon",
                email: "",
                avatar: "atom",
                joined: new Date().toISOString()
            }, existing, data);
            storage.set(PROFILE_KEY, payload);
            document.dispatchEvent(new CustomEvent("lab:profile-change", { detail: payload }));
            return payload;
        },
        remove() {
            storage.remove(PROFILE_KEY);
            document.dispatchEvent(new CustomEvent("lab:profile-change", { detail: null }));
        },
        isLoggedIn() {
            return Boolean(this.get());
        },
        initials() {
            const current = this.get();
            if (!current || !current.name) return "M";
            return current.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
        }
    };

    /* ---------- Progress ---------- */
    const PROGRESS_KEY = "vkl_progress_v1";

    const progress = {
        get() {
            return storage.get(PROGRESS_KEY, {
                experiments: {},
                quizBest: 0,
                quizAttempts: 0,
                quizLast: 0,
                elementsViewed: [],
                lastVisit: null
            });
        },
        save(data) {
            storage.set(PROGRESS_KEY, data);
            document.dispatchEvent(new CustomEvent("lab:progress-change", { detail: data }));
            return data;
        },
        touchVisit() {
            const data = this.get();
            data.lastVisit = new Date().toISOString();
            return this.save(data);
        },
        completeExperiment(id) {
            const data = this.get();
            data.experiments[id] = {
                done: true,
                at: new Date().toISOString()
            };
            return this.save(data);
        },
        isExperimentDone(id) {
            return Boolean(this.get().experiments[id] && this.get().experiments[id].done);
        },
        completedExperiments() {
            return Object.values(this.get().experiments).filter(item => item.done).length;
        },
        viewElement(number) {
            const data = this.get();
            if (!data.elementsViewed.includes(number)) {
                data.elementsViewed.push(number);
                this.save(data);
            }
        },
        setQuizResult(score, total) {
            const data = this.get();
            data.quizAttempts += 1;
            data.quizLast = score;
            if (score > data.quizBest) data.quizBest = score;
            data.quizTotal = total;
            return this.save(data);
        },
        reset() {
            return this.save({
                experiments: {},
                quizBest: 0,
                quizAttempts: 0,
                quizLast: 0,
                elementsViewed: [],
                lastVisit: new Date().toISOString()
            });
        }
    };

    /* ---------- Favorites ---------- */
    const FAVORITES_KEY = "vkl_favorites_v1";

    const favorites = {
        get() {
            return storage.get(FAVORITES_KEY, []);
        },
        has(number) {
            return this.get().includes(number);
        },
        toggle(number) {
            const list = this.get();
            const index = list.indexOf(number);
            if (index === -1) list.push(number);
            else list.splice(index, 1);
            storage.set(FAVORITES_KEY, list);
            document.dispatchEvent(new CustomEvent("lab:favorites-change", { detail: list }));
            return index === -1;
        },
        count() {
            return this.get().length;
        },
        clear() {
            storage.set(FAVORITES_KEY, []);
            document.dispatchEvent(new CustomEvent("lab:favorites-change", { detail: [] }));
        }
    };

    const ready = callback => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            callback();
        }
    };

    const utils = {
        $, $$, el, escapeHTML, debounce, clamp, formatNumber, shuffle, storage, downloadText, ready
    };

    Object.assign(Lab, {
        utils,
        notify,
        modal: { open: openModal, close: closeModal, closeAll: closeAllModals, init: initModalEvents },
        profile,
        progress,
        favorites
    });

    // Global event wiring
    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initModalEvents, { once: true });
        } else {
            initModalEvents();
        }
    }
})(typeof window !== "undefined" ? window : globalThis);
