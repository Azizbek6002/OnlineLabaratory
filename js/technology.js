/* ============================================================
   Virtual Kimyo Laboratoriyasi — laboratoriya texnologiyalari
   Spektroskopiya, xromatografiya, mikroskopiya, titratsiya
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};
    const { $, $$, clamp } = Lab.utils;

    /* ---------------- Spektroskopiya ---------------- */
    const SPECTRA = {
        na: {
            name: "Natrium (Na)",
            lines: [
                { w: 589.0, i: 96 },
                { w: 589.6, i: 88 }
            ]
        },
        k: {
            name: "Kaliy (K)",
            lines: [
                { w: 766.5, i: 92 },
                { w: 769.9, i: 86 }
            ]
        },
        cu: {
            name: "Mis (Cu)",
            lines: [
                { w: 324.7, i: 84 },
                { w: 327.4, i: 78 },
                { w: 510.5, i: 62 },
                { w: 578.2, i: 70 }
            ]
        },
        ca: {
            name: "Kaltsiy (Ca)",
            lines: [
                { w: 422.7, i: 88 },
                { w: 526.4, i: 64 },
                { w: 612.2, i: 72 },
                { w: 616.2, i: 68 }
            ]
        },
        h: {
            name: "Vodorod (H)",
            lines: [
                { w: 410.2, i: 58 },
                { w: 434.0, i: 66 },
                { w: 486.1, i: 78 },
                { w: 656.3, i: 94 }
            ]
        },
        hg: {
            name: "Simob (Hg)",
            lines: [
                { w: 404.7, i: 70 },
                { w: 435.8, i: 82 },
                { w: 546.1, i: 92 },
                { w: 577.0, i: 74 },
                { w: 579.1, i: 76 }
            ]
        }
    };

    function wavelengthToColor(wavelength) {
        let r = 0;
        let g = 0;
        let b = 0;
        const w = clamp(wavelength, 380, 780);

        if (w >= 380 && w < 440) {
            r = -(w - 440) / 60;
            b = 1;
        } else if (w < 490) {
            g = (w - 440) / 50;
            b = 1;
        } else if (w < 510) {
            g = 1;
            b = -(w - 510) / 20;
        } else if (w < 580) {
            r = (w - 510) / 70;
            g = 1;
        } else if (w < 645) {
            r = 1;
            g = -(w - 645) / 65;
        } else {
            r = 1;
        }

        let factor = 1;
        if (w >= 380 && w < 420) factor = 0.3 + (0.7 * (w - 380)) / 40;
        else if (w > 700 && w <= 780) factor = 0.3 + (0.7 * (780 - w)) / 80;

        const gamma = 0.8;
        const convert = value => Math.round(255 * Math.pow(Math.max(0, value) * factor, gamma));
        return `rgb(${convert(r)}, ${convert(g)}, ${convert(b)})`;
    }

    function spectrumGradient() {
        const stops = [];
        for (let w = 380; w <= 780; w += 10) {
            stops.push(`${wavelengthToColor(w)} ${((w - 380) / 400) * 100}%`);
        }
        return `linear-gradient(90deg, ${stops.join(", ")})`;
    }

    const spectroscopy = {
        initialized: false,
        init() {
            if (this.initialized) return;
            this.initialized = true;
            const select = document.getElementById("spectroscopySample");
            const analyze = document.getElementById("spectroscopyAnalyze");
            const display = document.getElementById("spectrumDisplay");
            if (!select || !display) return;

            display.style.background = spectrumGradient();
            const axis = document.getElementById("spectrumAxis");
            if (axis) {
                axis.innerHTML = [400, 500, 600, 700].map(w =>
                    `<span style="left:${((w - 380) / 400) * 100}%">${w} nm</span>`
                ).join("");
            }

            const run = () => this.analyze(select.value);
            if (analyze) analyze.addEventListener("click", run);
            select.addEventListener("change", run);
            this.analyze(select.value);
        },
        analyze(key) {
            const sample = SPECTRA[key] || SPECTRA.na;
            const display = document.getElementById("spectrumDisplay");
            const linesBox = document.getElementById("spectrumLines");
            const resultBox = document.getElementById("spectroscopyResult");
            if (!display) return;

            display.classList.add("is-scanning");
            setTimeout(() => display.classList.remove("is-scanning"), 650);

            display.querySelectorAll(".spectrum-line").forEach(node => node.remove());

            sample.lines.forEach((line, index) => {
                const marker = document.createElement("span");
                marker.className = "spectrum-line";
                marker.style.left = `${((line.w - 380) / 400) * 100}%`;
                marker.style.height = `${line.i}%`;
                marker.style.background = wavelengthToColor(line.w);
                marker.style.animationDelay = `${index * 90}ms`;
                marker.title = `${line.w} nm — intensivlik ${line.i}%`;
                display.appendChild(marker);
            });

            if (linesBox) {
                linesBox.innerHTML = sample.lines.map(line => `
                    <div class="spectrum-line-row">
                        <span class="spectrum-swatch" style="background:${wavelengthToColor(line.w)}"></span>
                        <span>${line.w} nm</span>
                        <span class="spectrum-intensity">${line.i}%</span>
                    </div>
                `).join("");
            }

            if (resultBox) {
                const main = sample.lines.slice().sort((a, b) => b.i - a.i)[0];
                resultBox.innerHTML = `
                    <strong>${sample.name}</strong>
                    <span>${sample.lines.length} ta spektr chizig'i aniqlandi. Eng kuchli chiziq: ${main.w} nm.</span>
                `;
            }
        }
    };

    /* ---------------- Xromatografiya ---------------- */
    const CHROMA = {
        ink: {
            name: "Qora siyoh",
            components: [
                { name: "Ko'k pigment", color: "#2563eb", rf: { water: 0.82, ethanol: 0.55, hexane: 0.18 } },
                { name: "Qizil pigment", color: "#dc2626", rf: { water: 0.64, ethanol: 0.72, hexane: 0.28 } },
                { name: "Sariq pigment", color: "#eab308", rf: { water: 0.42, ethanol: 0.38, hexane: 0.66 } }
            ]
        },
        plant: {
            name: "O'simlik pigmentlari",
            components: [
                { name: "Karotin", color: "#f59e0b", rf: { water: 0.12, ethanol: 0.58, hexane: 0.88 } },
                { name: "Ksantofill", color: "#fbbf24", rf: { water: 0.26, ethanol: 0.62, hexane: 0.52 } },
                { name: "Xlorofill a", color: "#16a34a", rf: { water: 0.62, ethanol: 0.78, hexane: 0.34 } },
                { name: "Xlorofill b", color: "#15803d", rf: { water: 0.74, ethanol: 0.7, hexane: 0.2 } }
            ]
        },
        marker: {
            name: "Rangli marker",
            components: [
                { name: "Ko'k", color: "#1d4ed8", rf: { water: 0.76, ethanol: 0.44, hexane: 0.16 } },
                { name: "Qizil", color: "#b91c1c", rf: { water: 0.55, ethanol: 0.66, hexane: 0.24 } },
                { name: "Yashil", color: "#047857", rf: { water: 0.34, ethanol: 0.52, hexane: 0.46 } }
            ]
        }
    };

    const chromatography = {
        initialized: false,
        token: 0,
        init() {
            if (this.initialized) return;
            this.initialized = true;
            const start = document.getElementById("chromaStart");
            const reset = document.getElementById("chromaReset");
            if (start) start.addEventListener("click", () => this.run());
            if (reset) reset.addEventListener("click", () => this.reset());
            this.reset();
        },
        reset() {
            this.token += 1;
            const paper = document.getElementById("chromaPaper");
            const spots = document.getElementById("chromaSpots");
            const front = document.getElementById("chromaFront");
            const table = document.getElementById("chromaTable");
            if (paper) paper.classList.remove("is-running");
            if (spots) spots.innerHTML = "";
            if (front) front.style.height = "4%";
            if (table) table.innerHTML = '<p class="muted">Tajribani boshlang — komponentlar Rf qiymatlari bo\'yicha ajraladi.</p>';
            const readout = document.getElementById("chromaReadout");
            if (readout) readout.textContent = "Tayyor";
        },
        run() {
            this.token += 1;
            const token = this.token;
            const sampleKey = document.getElementById("chromaSample")?.value || "ink";
            const solvent = document.getElementById("chromaSolvent")?.value || "water";
            const sample = CHROMA[sampleKey] || CHROMA.ink;
            const paper = document.getElementById("chromaPaper");
            const spots = document.getElementById("chromaSpots");
            const front = document.getElementById("chromaFront");
            const table = document.getElementById("chromaTable");
            const readout = document.getElementById("chromaReadout");
            if (!paper || !spots || !front) return;

            paper.classList.add("is-running");
            spots.innerHTML = "";
            if (readout) readout.textContent = "Erituvchi ko'tarilmoqda...";

            const positions = [12, 32, 52, 72, 88];
            sample.components.forEach((component, index) => {
                const spot = document.createElement("span");
                spot.className = "chroma-spot";
                spot.style.background = component.color;
                spot.style.color = component.color;
                spot.style.left = `${positions[index % positions.length]}%`;
                spot.style.bottom = "5%";
                spot.style.transitionDelay = `${index * 0.12}s`;
                spot.title = component.name;
                spots.appendChild(spot);

                setTimeout(() => {
                    if (token !== this.token) return;
                    spot.style.bottom = `${8 + component.rf[solvent] * 80}%`;
                }, 30);
            });

            front.style.height = "4%";
            setTimeout(() => {
                if (token !== this.token) return;
                front.style.height = "92%";
            }, 30);

            if (table) table.innerHTML = "";
            setTimeout(() => {
                if (token !== this.token) return;
                if (readout) readout.textContent = "Ajralish yakunlandi";
                if (table) {
                    table.innerHTML = `
                        <p class="muted">${sample.name} — ${solvent === "water" ? "suv" : solvent === "ethanol" ? "etanol" : "geksan"} erituvchisida:</p>
                        <div class="chroma-table">
                            <div class="chroma-table-head"><span>Komponent</span><span>Rf</span></div>
                            ${sample.components.map(component => `
                                <div class="chroma-table-row">
                                    <span><i class="chroma-dot" style="background:${component.color}"></i>${component.name}</span>
                                    <strong>${component.rf[solvent].toFixed(2)}</strong>
                                </div>
                            `).join("")}
                        </div>
                        <p class="hint">Rf = komponent bosib o'tgan masofa / erituvchi fronti bosib o'tgan masofa.</p>
                    `;
                }
                Lab.notify("Xromatografik ajralish yakunlandi", "success");
            }, 3200);
        }
    };

    /* ---------------- Mikroskopiya ---------------- */
    const MICROSCOPY_SLIDES = {
        onion: {
            name: "Piyoz hujayrasi",
            draw(ctx, width, height, random) {
                ctx.fillStyle = "#f5f0ff";
                ctx.fillRect(0, 0, width, height);
                const cellW = 120;
                const cellH = 76;
                for (let y = -cellH; y < height + cellH; y += cellH) {
                    for (let x = -cellW; x < width + cellW; x += cellW) {
                        const jx = (random() - 0.5) * 10;
                        const jy = (random() - 0.5) * 10;
                        ctx.strokeStyle = "rgba(124, 58, 237, 0.5)";
                        ctx.lineWidth = 3;
                        ctx.strokeRect(x + jx, y + jy, cellW, cellH);
                        ctx.fillStyle = "rgba(167, 139, 250, 0.12)";
                        ctx.fillRect(x + jx + 3, y + jy + 3, cellW - 6, cellH - 6);
                        ctx.fillStyle = "rgba(109, 40, 217, 0.7)";
                        ctx.beginPath();
                        ctx.arc(x + jx + cellW * (0.3 + random() * 0.4), y + jy + cellH * (0.3 + random() * 0.4), 9 + random() * 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        },
        blood: {
            name: "Qon surtmasi",
            draw(ctx, width, height, random) {
                ctx.fillStyle = "#fff1f2";
                ctx.fillRect(0, 0, width, height);
                for (let i = 0; i < 220; i += 1) {
                    const x = random() * width;
                    const y = random() * height;
                    const r = 12 + random() * 9;
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(220, 38, 38, ${0.55 + random() * 0.35})`;
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(254, 202, 202, 0.75)";
                    ctx.arc(x, y, r * 0.38, 0, Math.PI * 2);
                    ctx.fill();
                }
                for (let i = 0; i < 7; i += 1) {
                    const x = random() * width;
                    const y = random() * height;
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(147, 197, 253, 0.85)";
                    ctx.arc(x, y, 18 + random() * 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
        salt: {
            name: "Tuz kristali",
            draw(ctx, width, height, random) {
                ctx.fillStyle = "#f8fafc";
                ctx.fillRect(0, 0, width, height);
                for (let i = 0; i < 36; i += 1) {
                    const x = random() * width;
                    const y = random() * height;
                    const size = 20 + random() * 46;
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate((random() - 0.5) * 0.6);
                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                    ctx.strokeStyle = "rgba(148, 163, 184, 0.75)";
                    ctx.lineWidth = 2;
                    ctx.fillRect(-size / 2, -size / 2, size, size);
                    ctx.strokeRect(-size / 2, -size / 2, size, size);
                    ctx.beginPath();
                    ctx.moveTo(-size / 2, -size / 2);
                    ctx.lineTo(0, -size / 2 - size * 0.22);
                    ctx.lineTo(size / 2, -size / 2);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        },
        leaf: {
            name: "Barg hujayrasi",
            draw(ctx, width, height, random) {
                ctx.fillStyle = "#ecfdf5";
                ctx.fillRect(0, 0, width, height);
                const cellW = 105;
                const cellH = 70;
                for (let y = -cellH; y < height + cellH; y += cellH) {
                    for (let x = -cellW; x < width + cellW; x += cellW) {
                        ctx.strokeStyle = "rgba(22, 163, 74, 0.55)";
                        ctx.lineWidth = 2.5;
                        ctx.strokeRect(x, y, cellW, cellH);
                        ctx.fillStyle = "rgba(74, 222, 128, 0.14)";
                        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);
                        for (let k = 0; k < 7; k += 1) {
                            ctx.beginPath();
                            ctx.fillStyle = "rgba(22, 163, 74, 0.65)";
                            ctx.ellipse(x + random() * cellW, y + random() * cellH, 6 + random() * 5, 3 + random() * 3, random() * Math.PI, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
                for (let i = 0; i < 4; i += 1) {
                    const x = 90 + random() * (width - 180);
                    const y = 80 + random() * (height - 160);
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(6, 78, 59, 0.55)";
                    ctx.ellipse(x, y, 28, 16, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#ecfdf5";
                    ctx.beginPath();
                    ctx.ellipse(x, y, 12, 5, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    };

    const microscopy = {
        initialized: false,
        observer: null,
        init() {
            if (this.initialized) return;
            const canvas = document.getElementById("microscopeCanvas");
            if (!canvas) return;
            this.initialized = true;
            const draw = () => this.draw();
            ["microscopeSlide", "microscopeZoom", "microscopeFocus", "microscopeLight"].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.addEventListener("input", draw);
                if (input && input.tagName === "SELECT") input.addEventListener("change", draw);
            });
            const reset = document.getElementById("microscopeReset");
            if (reset) {
                reset.addEventListener("click", () => {
                    const slide = document.getElementById("microscopeSlide");
                    const zoom = document.getElementById("microscopeZoom");
                    const focus = document.getElementById("microscopeFocus");
                    const light = document.getElementById("microscopeLight");
                    if (slide) slide.value = "onion";
                    if (zoom) zoom.value = "200";
                    if (focus) focus.value = "55";
                    if (light) light.value = "70";
                    this.draw();
                });
            }
            if (typeof ResizeObserver !== "undefined") {
                this.observer = new ResizeObserver(() => this.draw());
                this.observer.observe(canvas.parentElement || canvas);
            } else {
                window.addEventListener("resize", () => this.draw());
            }
            this.draw();
        },
        draw() {
            const canvas = document.getElementById("microscopeCanvas");
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = Math.max(320, Math.round(rect.width));
            const height = Math.max(240, Math.round(rect.height));
            if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
            }
            const ctx = canvas.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const slideKey = document.getElementById("microscopeSlide")?.value || "onion";
            const slide = MICROSCOPY_SLIDES[slideKey] || MICROSCOPY_SLIDES.onion;
            const zoom = Number(document.getElementById("microscopeZoom")?.value || 200);
            const focus = Number(document.getElementById("microscopeFocus")?.value || 55);
            const light = Number(document.getElementById("microscopeLight")?.value || 70);

            const blur = Math.abs(focus - 55) / 9;
            ctx.filter = `blur(${blur.toFixed(1)}px) brightness(${(0.55 + light / 100).toFixed(2)}) contrast(${(1 + (100 - Math.abs(focus - 55)) / 180).toFixed(2)})`;

            ctx.save();
            const scale = zoom / 200;
            ctx.translate(width / 2, height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-width / 2, -height / 2);
            slide.draw(ctx, width, height, mulberry32(slideKey.length * 97 + 13));
            ctx.restore();

            ctx.filter = "none";
            ctx.strokeStyle = "rgba(15, 23, 42, 0.22)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            const bar = 110 / scale;
            ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
            ctx.fillRect(18, height - 34, bar, 4);
            ctx.font = "12px Inter, sans-serif";
            ctx.fillText(`${Math.round(bar)} µm`, 18, height - 42);

            const readout = document.getElementById("microscopeReadout");
            if (readout) {
                readout.textContent = `${slide.name} · ${zoom}× · fokus ${focus}% · yorug'lik ${light}%`;
            }
            const zoomOut = document.getElementById("microscopeZoomValue");
            const focusOut = document.getElementById("microscopeFocusValue");
            const lightOut = document.getElementById("microscopeLightValue");
            if (zoomOut) zoomOut.textContent = `${zoom}×`;
            if (focusOut) focusOut.textContent = `${focus}%`;
            if (lightOut) lightOut.textContent = `${light}%`;
        }
    };

    function mulberry32(seed) {
        let a = seed >>> 0;
        return function random() {
            a += 0x6D2B79F5;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /* ---------------- Titratsiya ---------------- */
    const titration = {
        initialized: false,
        volume: 0,
        autoTimer: null,
        init() {
            if (this.initialized) return;
            this.initialized = true;
            const addDrop = document.getElementById("titrationDrop");
            const addHalf = document.getElementById("titrationHalf");
            const addOne = document.getElementById("titrationOne");
            const auto = document.getElementById("titrationAuto");
            const reset = document.getElementById("titrationReset");
            if (addDrop) addDrop.addEventListener("click", () => this.add(0.05));
            if (addHalf) addHalf.addEventListener("click", () => this.add(0.5));
            if (addOne) addOne.addEventListener("click", () => this.add(1));
            if (auto) auto.addEventListener("click", () => this.auto());
            if (reset) reset.addEventListener("click", () => this.reset());
            ["titrationAcidConc", "titrationBaseConc", "titrationAcidVolume"].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.addEventListener("change", () => this.reset());
            });
            this.reset();
        },
        values() {
            return {
                acidConc: Number(document.getElementById("titrationAcidConc")?.value || 0.1),
                baseConc: Number(document.getElementById("titrationBaseConc")?.value || 0.1),
                acidVolume: Number(document.getElementById("titrationAcidVolume")?.value || 25)
            };
        },
        pH(added) {
            const { acidConc, baseConc, acidVolume } = this.values();
            const nAcid = (acidVolume * acidConc) / 1000;
            const nBase = (added * baseConc) / 1000;
            const total = (acidVolume + added) / 1000;
            if (total <= 0) return 7;
            if (Math.abs(nAcid - nBase) < 1e-9) return 7;
            if (nAcid > nBase) {
                const h = (nAcid - nBase) / total;
                return clamp(-Math.log10(Math.max(h, 1e-14)), 0, 14);
            }
            const oh = (nBase - nAcid) / total;
            return clamp(14 + Math.log10(Math.max(oh, 1e-14)), 0, 14);
        },
        equivalence() {
            const { acidConc, baseConc, acidVolume } = this.values();
            return (acidVolume * acidConc) / baseConc;
        },
        add(amount) {
            if (this.autoTimer) return;
            this.volume = clamp(this.volume + amount, 0, 50);
            this.render(true);
        },
        auto() {
            if (this.autoTimer) {
                clearInterval(this.autoTimer);
                this.autoTimer = null;
                const button = document.getElementById("titrationAuto");
                if (button) button.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Avtomatik titrlash';
                return;
            }
            const button = document.getElementById("titrationAuto");
            if (button) button.innerHTML = '<i class="fa-solid fa-stop" aria-hidden="true"></i> To\'xtatish';
            this.autoTimer = setInterval(() => {
                const target = this.equivalence();
                if (this.volume >= target - 1e-9) {
                    clearInterval(this.autoTimer);
                    this.autoTimer = null;
                    this.volume = target;
                    this.render(false);
                    if (button) button.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Avtomatik titrlash';
                    Lab.notify("Ekvivalent nuqtaga erishildi", "success");
                    return;
                }
                const remaining = target - this.volume;
                const step = remaining > 2 ? 0.5 : Math.min(0.1, remaining);
                this.volume = clamp(this.volume + step, 0, target);
                this.render(false);
            }, 100);
        },
        reset() {
            if (this.autoTimer) {
                clearInterval(this.autoTimer);
                this.autoTimer = null;
            }
            this.volume = 0;
            const button = document.getElementById("titrationAuto");
            if (button) button.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Avtomatik titrlash';
            this.render(false);
        },
        render(withDrop = false) {
            const { acidConc, baseConc, acidVolume } = this.values();
            const equivalence = this.equivalence();
            const pH = this.pH(this.volume);
            const pink = pH >= 8.2;

            const volumeLabel = document.getElementById("titrationVolume");
            if (volumeLabel) volumeLabel.textContent = `${this.volume.toFixed(2)} mL`;
            const pHLabel = document.getElementById("titrationPH");
            if (pHLabel) pHLabel.textContent = pH.toFixed(2);
            const eqLabel = document.getElementById("titrationEquivalence");
            if (eqLabel) eqLabel.textContent = `${equivalence.toFixed(2)} mL`;
            const status = document.getElementById("titrationStatus");
            if (status) {
                if (Math.abs(this.volume - equivalence) < 0.12) {
                    status.textContent = "Ekvivalent nuqta — pH 7";
                    status.className = "titration-status is-equivalent";
                } else if (this.volume < equivalence) {
                    status.textContent = "Kislotali muhit";
                    status.className = "titration-status is-acidic";
                } else {
                    status.textContent = "Ishqoriy muhit";
                    status.className = "titration-status is-basic";
                }
            }

            const burette = document.getElementById("buretteFill");
            if (burette) {
                const remaining = clamp(1 - this.volume / 50, 0, 1);
                burette.style.height = `${remaining * 100}%`;
            }
            const flask = document.getElementById("titrationFlaskLiquid");
            if (flask) {
                flask.style.background = pink ? "linear-gradient(180deg, #f9a8d4, #db2777)" : "linear-gradient(180deg, #dbeafe, #bfdbfe)";
            }
            const readout = document.getElementById("titrationReadout");
            if (readout) {
                readout.textContent = `HCl ${acidConc} M · NaOH ${baseConc} M · ${acidVolume} mL kislota`;
            }

            const drop = document.getElementById("titrationDropVisual");
            if (drop && withDrop) {
                drop.classList.remove("is-dropping");
                void drop.offsetWidth;
                drop.classList.add("is-dropping");
            }

            this.drawChart();
        },
        drawChart() {
            const canvas = document.getElementById("titrationChart");
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = Math.max(280, Math.round(rect.width));
            const height = Math.max(180, Math.round(rect.height));
            if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
            }
            const ctx = canvas.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const pad = { left: 38, right: 14, top: 16, bottom: 28 };
            const plotW = width - pad.left - pad.right;
            const plotH = height - pad.top - pad.bottom;
            const maxVolume = Math.max(10, Math.ceil((this.equivalence() * 1.6 + 2) / 5) * 5);
            const x = v => pad.left + (v / maxVolume) * plotW;
            const y = ph => pad.top + ((14 - ph) / 14) * plotH;

            ctx.fillStyle = "rgba(148, 163, 184, 0.12)";
            ctx.fillRect(pad.left, pad.top, plotW, plotH);

            ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
            ctx.lineWidth = 1;
            ctx.font = "11px Inter, sans-serif";
            ctx.fillStyle = "rgba(100, 116, 139, 0.9)";
            for (let ph = 0; ph <= 14; ph += 2) {
                ctx.beginPath();
                ctx.moveTo(pad.left, y(ph));
                ctx.lineTo(width - pad.right, y(ph));
                ctx.stroke();
                ctx.fillText(String(ph), 10, y(ph) + 4);
            }
            for (let v = 0; v <= maxVolume; v += 5) {
                ctx.beginPath();
                ctx.moveTo(x(v), pad.top);
                ctx.lineTo(x(v), height - pad.bottom);
                ctx.stroke();
                ctx.fillText(String(v), x(v) - 4, height - 10);
            }

            const equivalence = this.equivalence();
            ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(x(equivalence), pad.top);
            ctx.lineTo(x(equivalence), height - pad.bottom);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.strokeStyle = "#2563eb";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            let started = false;
            for (let v = 0; v <= maxVolume; v += 0.25) {
                const ph = this.pH(v);
                if (!started) {
                    ctx.moveTo(x(v), y(ph));
                    started = true;
                } else {
                    ctx.lineTo(x(v), y(ph));
                }
            }
            ctx.stroke();

            const currentPH = this.pH(this.volume);
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(x(this.volume), y(currentPH), 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#334155";
            ctx.font = "11px Inter, sans-serif";
            ctx.fillText("pH", 10, 12);
            ctx.fillText("NaOH hajmi (mL)", width - 120, height - 4);
        }
    };

    function initTabs() {
        const tabs = $$("[data-tech-tab]");
        const panels = $$("[data-tech-panel]");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const id = tab.dataset.techTab;
                tabs.forEach(item => {
                    const active = item === tab;
                    item.classList.toggle("is-active", active);
                    item.setAttribute("aria-selected", active ? "true" : "false");
                    item.tabIndex = active ? 0 : -1;
                });
                panels.forEach(panel => {
                    const active = panel.dataset.techPanel === id;
                    panel.classList.toggle("is-active", active);
                    panel.hidden = !active;
                });
                if (id === "microscopy") microscopy.draw();
                if (id === "titration") titration.render(false);
            });
        });
    }

    Lab.utils.ready(() => {
        initTabs();
        spectroscopy.init();
        chromatography.init();
        microscopy.init();
        titration.init();
    });

    Lab.technology = { spectroscopy, chromatography, microscopy, titration };
})(typeof window !== "undefined" ? window : globalThis);
