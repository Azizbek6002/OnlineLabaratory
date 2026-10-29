/* ============================================================
   Virtual Kimyo Laboratoriyasi — asosiy ilova
   Navigatsiya, tema, profil, tur va umumiy interaktivlik
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};
    const { $, $$, storage, clamp } = Lab.utils;

    const THEME_KEY = "vkl_theme_v1";

    /* ---------------- Theme ---------------- */
    const theme = {
        init() {
            const saved = storage.get(THEME_KEY, null);
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = saved || (prefersDark ? "dark" : "light");
            this.apply(initial, false);

            const toggle = document.getElementById("themeToggle");
            if (toggle) toggle.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                this.apply(current === "dark" ? "light" : "dark", true);
            });

            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
                if (!storage.get(THEME_KEY, null)) {
                    this.apply(event.matches ? "dark" : "light", false);
                }
            });
        },
        apply(value, notify) {
            document.documentElement.setAttribute("data-theme", value);
            storage.set(THEME_KEY, value);
            const toggle = document.getElementById("themeToggle");
            if (toggle) {
                const dark = value === "dark";
                toggle.innerHTML = `<i class="fa-solid ${dark ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i>`;
                toggle.setAttribute("aria-label", dark ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish");
                toggle.setAttribute("title", dark ? "Yorug' rejim" : "Qorong'u rejim");
                toggle.setAttribute("aria-pressed", dark ? "true" : "false");
            }
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute("content", value === "dark" ? "#0b1120" : "#f8fafc");
            if (notify) Lab.notify(value === "dark" ? "Qorong'u rejim yoqildi" : "Yorug' rejim yoqildi", "info", 2200);
        }
    };

    /* ---------------- Navigation ---------------- */
    const navigation = {
        init() {
            const nav = document.getElementById("navMenu");
            const toggle = document.getElementById("navToggle");
            if (!nav || !toggle) return;

            const close = () => {
                nav.classList.remove("is-open");
                toggle.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            };

            toggle.addEventListener("click", () => {
                const open = !nav.classList.contains("is-open");
                nav.classList.toggle("is-open", open);
                toggle.classList.toggle("is-open", open);
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });

            document.addEventListener("click", event => {
                if (!nav.classList.contains("is-open")) return;
                if (!event.target.closest("#navMenu") && !event.target.closest("#navToggle")) close();
            });

            document.addEventListener("keydown", event => {
                if (event.key === "Escape") close();
            });

            $$('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener("click", event => {
                    const href = anchor.getAttribute("href");
                    if (!href || href === "#") return;
                    const target = document.querySelector(href);
                    if (!target) return;
                    event.preventDefault();
                    close();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", href);
                });
            });

            this.spy();
            this.header();
        },
        spy() {
            const links = $$(".nav-link");
            const sections = links
                .map(link => {
                    const id = link.getAttribute("href");
                    return id && id.startsWith("#") ? document.querySelector(id) : null;
                })
                .filter(Boolean);
            if (!sections.length || typeof IntersectionObserver === "undefined") return;

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = `#${entry.target.id}`;
                    links.forEach(link => {
                        const active = link.getAttribute("href") === id;
                        link.classList.toggle("is-active", active);
                        if (active) link.setAttribute("aria-current", "page");
                        else link.removeAttribute("aria-current");
                    });
                });
            }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

            sections.forEach(section => observer.observe(section));
        },
        header() {
            const header = document.getElementById("siteHeader");
            const progress = document.getElementById("scrollProgress");
            const backToTop = document.getElementById("backToTop");

            const update = () => {
                const y = window.scrollY || 0;
                if (header) header.classList.toggle("is-scrolled", y > 8);
                if (progress) {
                    const height = document.documentElement.scrollHeight - window.innerHeight;
                    progress.style.width = `${height > 0 ? clamp((y / height) * 100, 0, 100) : 0}%`;
                }
                if (backToTop) backToTop.classList.toggle("is-visible", y > 600);
            };

            window.addEventListener("scroll", update, { passive: true });
            update();
            if (backToTop) {
                backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
            }
        }
    };

    /* ---------------- Auth / Profile ---------------- */
    const account = {
        avatars: {
            atom: "fa-atom",
            flask: "fa-flask",
            microscope: "fa-microscope",
            star: "fa-star"
        },
        init() {
            const button = document.getElementById("authButton");
            if (button) {
                button.addEventListener("click", () => {
                    if (Lab.profile.isLoggedIn()) this.openProfile();
                    else this.openAuth();
                });
            }

            const form = document.getElementById("authForm");
            if (form) {
                form.addEventListener("submit", event => {
                    event.preventDefault();
                    this.submit();
                });
            }

            const profileShortcut = document.getElementById("openProfileBtn");
            if (profileShortcut) {
                profileShortcut.addEventListener("click", () => {
                    if (Lab.profile.isLoggedIn()) this.openProfile();
                    else this.openAuth();
                });
            }

            $$("[data-avatar]").forEach(option => {
                option.addEventListener("click", () => {
                    $$("[data-avatar]").forEach(item => {
                        const active = item === option;
                        item.classList.toggle("is-active", active);
                        item.setAttribute("aria-pressed", active ? "true" : "false");
                    });
                });
            });

            const logout = document.getElementById("profileLogout");
            if (logout) {
                logout.addEventListener("click", () => {
                    Lab.profile.remove();
                    Lab.modal.close("profileModal");
                    this.renderHeader();
                    Lab.notify("Hisobdan chiqdingiz", "info");
                });
            }

            const edit = document.getElementById("profileEdit");
            if (edit) {
                edit.addEventListener("click", () => {
                    Lab.modal.close("profileModal");
                    setTimeout(() => this.openAuth(), 160);
                });
            }

            const reset = document.getElementById("profileResetProgress");
            if (reset) {
                reset.addEventListener("click", () => {
                    if (window.confirm("Barcha progress, sevimlilar va test natijalari o'chiriladi. Davom etasizmi?")) {
                        Lab.progress.reset();
                        Lab.favorites.clear();
                        storage.remove("vkl_game_best_v1");
                        if (Lab.tools?.game) {
                            Lab.tools.game.best = 0;
                            Lab.tools.game.updateBest();
                        }
                        this.renderProfile();
                        Lab.notify("Progress tozalandi", "info");
                    }
                });
            }

            document.addEventListener("lab:profile-change", () => this.renderHeader());
            document.addEventListener("lab:progress-change", () => {
                if (document.getElementById("profileModal")?.classList.contains("is-open")) this.renderProfile();
            });
            document.addEventListener("lab:favorites-change", () => {
                if (document.getElementById("profileModal")?.classList.contains("is-open")) this.renderProfile();
            });

            this.renderHeader();
        },
        openAuth() {
            const profile = Lab.profile.get();
            const name = document.getElementById("authName");
            const email = document.getElementById("authEmail");
            if (name) name.value = profile?.name || "";
            if (email) email.value = profile?.email || "";
            const avatar = profile?.avatar || "atom";
            $$("[data-avatar]").forEach(option => {
                const active = option.dataset.avatar === avatar;
                option.classList.toggle("is-active", active);
                option.setAttribute("aria-pressed", active ? "true" : "false");
            });
            const title = document.getElementById("authTitle");
            if (title) title.textContent = profile ? "Profilni tahrirlash" : "Tizimga kirish";
            const submit = document.getElementById("authSubmit");
            if (submit) submit.textContent = profile ? "Saqlash" : "Kirish";
            Lab.modal.open("authModal", { focus: "#authName" });
        },
        submit() {
            const nameInput = document.getElementById("authName");
            const emailInput = document.getElementById("authEmail");
            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const error = document.getElementById("authError");

            const fail = message => {
                if (error) {
                    error.textContent = message;
                    error.hidden = false;
                }
                Lab.notify(message, "error");
            };

            if (name.length < 2) return fail("Ismingizni kamida 2 ta harf bilan kiriting.");
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Email manzil noto'g'ri.");
            if (error) error.hidden = true;

            const avatar = $("[data-avatar].is-active")?.dataset.avatar || "atom";
            const existing = Lab.profile.get();
            Lab.profile.save({
                name,
                email,
                avatar,
                joined: existing?.joined || new Date().toISOString()
            });
            Lab.modal.close("authModal");
            this.renderHeader();
            Lab.notify(`Xush kelibsiz, ${name}!`, "success");
        },
        openProfile() {
            this.renderProfile();
            Lab.modal.open("profileModal", { focus: "[data-modal-close]" });
        },
        renderHeader() {
            const profile = Lab.profile.get();
            const button = document.getElementById("authButton");
            const label = document.getElementById("authButtonLabel");
            const avatar = document.getElementById("authAvatar");
            if (!button) return;

            button.classList.toggle("is-logged-in", Boolean(profile));
            if (profile) {
                button.setAttribute("aria-label", `${profile.name} profili`);
                if (label) label.textContent = profile.name.split(" ")[0];
                if (avatar) {
                    avatar.hidden = false;
                    avatar.innerHTML = `<i class="fa-solid ${this.avatars[profile.avatar] || "fa-atom"}" aria-hidden="true"></i>`;
                }
            } else {
                button.setAttribute("aria-label", "Tizimga kirish");
                if (label) label.textContent = "Kirish";
                if (avatar) avatar.hidden = true;
            }
        },
        renderProfile() {
            const profile = Lab.profile.get();
            if (!profile) return;
            const progress = Lab.progress.get();
            const set = (id, value) => {
                const node = document.getElementById(id);
                if (node) node.textContent = value;
            };
            set("profileName", profile.name);
            set("profileEmail", profile.email || "Email kiritilmagan");
            set("profileJoined", new Date(profile.joined).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" }));
            set("profileFavorites", String(Lab.favorites.count()));
            set("profileExperiments", `${Lab.progress.completedExperiments()} / 6`);
            set("profileQuizBest", progress.quizBest ? `${progress.quizBest} / 12` : "—");
            set("profileElements", String(progress.elementsViewed.length));
            const avatar = document.getElementById("profileAvatar");
            if (avatar) avatar.innerHTML = `<i class="fa-solid ${this.avatars[profile.avatar] || "fa-atom"}" aria-hidden="true"></i>`;
        }
    };

    /* ---------------- Demo tour ---------------- */
    const tour = {
        steps: [
            { target: "#elements", title: "118 elementli jadval", text: "Elementlarni nomi, belgisi yoki raqami bo'yicha qidiring. Har bir katakni bosib to'liq ma'lumot oling." },
            { target: "#experiments", title: "Virtual laboratoriya", text: "6 ta interaktiv eksperiment. Parametrlarni o'zgartiring va real hisob-kitob natijalarini ko'ring." },
            { target: "#technology", title: "Zamonaviy texnologiyalar", text: "Spektroskopiya, xromatografiya, mikroskopiya va titratsiya bilan amaliy tanishuv." },
            { target: "#quiz", title: "Bilimni sinang", text: "12 savollik test orqali bilimingizni tekshiring va natijangizni saqlang." }
        ],
        index: 0,
        active: false,
        previous: null,
        init() {
            const start = document.getElementById("demoBtn");
            if (start) start.addEventListener("click", () => this.start());
            const next = document.getElementById("tourNext");
            const skip = document.getElementById("tourSkip");
            if (next) next.addEventListener("click", () => this.next());
            if (skip) skip.addEventListener("click", () => this.end());
            document.addEventListener("keydown", event => {
                if (!this.active) return;
                if (event.key === "Escape") this.end();
                if (event.key === "Enter") this.next();
            });
        },
        start() {
            this.index = 0;
            this.active = true;
            const card = document.getElementById("tourCard");
            if (card) card.hidden = false;
            this.show();
            Lab.notify("Demo tur boshlandi", "info", 2000);
        },
        show() {
            const step = this.steps[this.index];
            if (!step) return this.end();
            const target = document.querySelector(step.target);
            if (this.previous) this.previous.classList.remove("tour-highlight");
            if (target) {
                target.classList.add("tour-highlight");
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                this.previous = target;
            }
            const title = document.getElementById("tourTitle");
            const text = document.getElementById("tourText");
            const counter = document.getElementById("tourStep");
            const next = document.getElementById("tourNext");
            if (title) title.textContent = step.title;
            if (text) text.textContent = step.text;
            if (counter) counter.textContent = `${this.index + 1} / ${this.steps.length}`;
            if (next) next.textContent = this.index === this.steps.length - 1 ? "Tugatish" : "Keyingi";
        },
        next() {
            this.index += 1;
            if (this.index >= this.steps.length) this.end();
            else this.show();
        },
        end() {
            this.active = false;
            if (this.previous) this.previous.classList.remove("tour-highlight");
            this.previous = null;
            const card = document.getElementById("tourCard");
            if (card) card.hidden = true;
            Lab.notify("Demo tur yakunlandi", "info", 1800);
        }
    };

    /* ---------------- Reveal animations & counters ---------------- */
    function initReveal() {
        const items = $$(".reveal");
        if (!items.length) return;
        if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            items.forEach(item => item.classList.add("is-visible"));
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(item => observer.observe(item));
    }

    function initCounters() {
        const counters = $$("[data-count]");
        if (!counters.length) return;
        const animate = node => {
            const target = Number(node.dataset.count);
            const suffix = node.dataset.suffix || "";
            const duration = 900;
            const start = performance.now();
            // Uses a timer instead of rAF so the numbers still finish when
            // the tab is in the background and animation frames are paused.
            const timer = setInterval(() => {
                const ratio = Math.min(1, (performance.now() - start) / duration);
                const value = Math.round(target * (1 - Math.pow(1 - ratio, 3)));
                node.textContent = `${value}${suffix}`;
                if (ratio >= 1) clearInterval(timer);
            }, 30);
        };

        if (typeof IntersectionObserver === "undefined") {
            counters.forEach(animate);
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(counter => observer.observe(counter));
    }

    /* ---------------- Resources / misc ---------------- */
    function initMisc() {
        $$("[data-placeholder]").forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                Lab.notify("Bu bo'lim tez orada ishga tushadi", "info");
            });
        });

        const year = document.getElementById("currentYear");
        if (year) year.textContent = String(new Date().getFullYear());

        const shortcuts = document.getElementById("shortcutsBtn");
        if (shortcuts) shortcuts.addEventListener("click", () => Lab.modal.open("shortcutsModal"));

        document.addEventListener("keydown", event => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                const search = document.getElementById("elementSearch");
                if (search) {
                    search.focus({ preventScroll: false });
                    search.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });

        Lab.progress.touchVisit();
    }

    function initLoading() {
        const screen = document.getElementById("loadingScreen");
        if (!screen) return;
        const hide = () => {
            screen.classList.add("is-hidden");
            setTimeout(() => screen.remove(), 450);
        };
        const start = performance.now();
        const finish = () => {
            const elapsed = performance.now() - start;
            setTimeout(hide, Math.max(0, 420 - elapsed));
        };
        if (document.readyState === "complete") finish();
        else window.addEventListener("load", finish, { once: true });
        // Xavfsizlik uchun: agar biror resurs yuklanmasa ham ekran qotib qolmasin
        setTimeout(hide, 5000);
    }

    Lab.utils.ready(() => {
        theme.init();
        navigation.init();
        account.init();
        tour.init();
        initReveal();
        initCounters();
        initMisc();
        initLoading();
    });

    Lab.app = { theme, navigation, account, tour };
})(typeof window !== "undefined" ? window : globalThis);
