/* ============================================================
   Virtual Kimyo Laboratoriyasi — bilim testi moduli
   ============================================================ */
(function (global) {
    "use strict";

    const Lab = global.Lab = global.Lab || {};
    const { $, $$, el, escapeHTML, shuffle } = Lab.utils;
    const data = Lab.quizData;

    if (!data) {
        console.error("Test savollari topilmadi.");
        return;
    }

    const QUESTION_COUNT = 12;

    const state = {
        questions: [],
        index: 0,
        score: 0,
        answers: [],
        answered: false,
        startTime: 0,
        timer: null
    };

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${String(sec).padStart(2, "0")}`;
    }

    function updateBest() {
        const best = Lab.progress.get().quizBest || 0;
        const node = document.getElementById("quizBest");
        if (node) node.textContent = best > 0 ? `${best}/${QUESTION_COUNT}` : "—";
        const startBest = document.getElementById("quizStartBest");
        if (startBest) startBest.textContent = best > 0 ? `Eng yaxshi natija: ${best}/${QUESTION_COUNT}` : "Hali topshirilmagan";
    }

    function showScreen(name) {
        ["quizStart", "quizGame", "quizResult"].forEach(id => {
            const node = document.getElementById(id);
            if (node) node.hidden = id !== name;
        });
    }

    function start() {
        state.questions = shuffle(data.questions).slice(0, QUESTION_COUNT);
        state.index = 0;
        state.score = 0;
        state.answers = [];
        state.answered = false;
        state.startTime = Date.now();
        showScreen("quizGame");
        updateBest();
        renderQuestion();
        if (state.timer) clearInterval(state.timer);
        state.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            const time = document.getElementById("quizTime");
            if (time) time.textContent = formatTime(elapsed);
        }, 500);
        Lab.notify("Test boshlandi. Omad!", "info", 2500);
    }

    function renderQuestion() {
        const question = state.questions[state.index];
        if (!question) return finish();

        state.answered = false;
        const progress = ((state.index) / state.questions.length) * 100;
        const bar = document.getElementById("quizProgressBar");
        if (bar) bar.style.width = `${progress}%`;
        const progressText = document.getElementById("quizProgressText");
        if (progressText) progressText.textContent = `${state.index + 1} / ${state.questions.length}`;
        const scoreNode = document.getElementById("quizScore");
        if (scoreNode) scoreNode.textContent = String(state.score);
        const topic = document.getElementById("quizTopic");
        if (topic) topic.textContent = question.topic;
        const text = document.getElementById("quizQuestion");
        if (text) text.textContent = question.question;

        const options = document.getElementById("quizOptions");
        if (options) {
            options.innerHTML = "";
            question.options.forEach((option, index) => {
                const button = el("button", "quiz-option", {
                    type: "button",
                    "data-index": index
                });
                button.innerHTML = `<span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span>`;
                button.addEventListener("click", () => answer(index));
                options.appendChild(button);
            });
        }

        const feedback = document.getElementById("quizFeedback");
        if (feedback) {
            feedback.hidden = true;
            feedback.innerHTML = "";
        }
        const next = document.getElementById("quizNext");
        if (next) next.hidden = true;
    }

    function answer(selected) {
        if (state.answered) return;
        state.answered = true;
        const question = state.questions[state.index];
        const correct = selected === question.answer;
        if (correct) state.score += 1;

        state.answers.push({
            question,
            selected,
            correct
        });

        $$(".quiz-option").forEach(button => {
            const index = Number(button.dataset.index);
            button.disabled = true;
            if (index === question.answer) button.classList.add("is-correct");
            if (index === selected && !correct) button.classList.add("is-wrong");
            if (index === selected) button.classList.add("is-selected");
        });

        const feedback = document.getElementById("quizFeedback");
        if (feedback) {
            feedback.hidden = false;
            feedback.className = `quiz-feedback ${correct ? "is-correct" : "is-wrong"}`;
            feedback.innerHTML = `
                <strong>${correct ? "To'g'ri javob!" : "Noto'g'ri javob"}</strong>
                <p>${escapeHTML(question.explanation)}</p>
            `;
        }

        const scoreNode = document.getElementById("quizScore");
        if (scoreNode) scoreNode.textContent = String(state.score);

        const next = document.getElementById("quizNext");
        if (next) {
            next.hidden = false;
            next.textContent = state.index === state.questions.length - 1 ? "Natijani ko'rish" : "Keyingi savol";
            next.focus({ preventScroll: true });
        }
    }

    function next() {
        if (!state.answered) return;
        state.index += 1;
        if (state.index >= state.questions.length) finish();
        else renderQuestion();
    }

    function finish() {
        if (state.timer) {
            clearInterval(state.timer);
            state.timer = null;
        }
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const percentage = Math.round((state.score / state.questions.length) * 100);
        Lab.progress.setQuizResult(state.score, state.questions.length);
        showScreen("quizResult");
        updateBest();

        const score = document.getElementById("quizResultScore");
        if (score) score.textContent = `${state.score} / ${state.questions.length}`;
        const percent = document.getElementById("quizResultPercent");
        if (percent) percent.textContent = `${percentage}%`;
        const time = document.getElementById("quizResultTime");
        if (time) time.textContent = formatTime(elapsed);

        const title = document.getElementById("quizResultTitle");
        if (title) {
            title.textContent = percentage >= 85
                ? "Ajoyib natija!"
                : percentage >= 60
                    ? "Yaxshi natija!"
                    : "Yana mashq qilish kerak";
        }
        const message = document.getElementById("quizResultMessage");
        if (message) {
            message.textContent = percentage >= 85
                ? "Siz kimyoviy tushunchalarni juda yaxshi o'zlashtirgansiz."
                : percentage >= 60
                    ? "Yaxshi boshlanish. Ba'zi mavzularni yana takrorlang."
                    : "Xafa bo'lmang — nazariyani takrorlab, yana urinib ko'ring.";
        }

        const ring = document.getElementById("quizResultRing");
        if (ring) ring.style.setProperty("--progress", `${percentage}%`);

        const review = document.getElementById("quizReview");
        if (review) {
            review.innerHTML = state.answers.map((entry, index) => `
                <div class="quiz-review-item ${entry.correct ? "is-correct" : "is-wrong"}">
                    <div class="quiz-review-head">
                        <span class="quiz-review-index">${index + 1}</span>
                        <span>${escapeHTML(entry.question.question)}</span>
                        <i class="fa-solid ${entry.correct ? "fa-circle-check" : "fa-circle-xmark"}" aria-hidden="true"></i>
                    </div>
                    <div class="quiz-review-body">
                        <p><strong>Sizning javobingiz:</strong> ${escapeHTML(entry.question.options[entry.selected])}</p>
                        ${entry.correct ? "" : `<p><strong>To'g'ri javob:</strong> ${escapeHTML(entry.question.options[entry.question.answer])}</p>`}
                        <p class="muted">${escapeHTML(entry.question.explanation)}</p>
                    </div>
                </div>
            `).join("");
        }

        Lab.notify(`Test yakunlandi: ${state.score}/${state.questions.length}`, percentage >= 60 ? "success" : "warning");
    }

    function bind() {
        const startBtn = document.getElementById("quizStartBtn");
        if (startBtn) startBtn.addEventListener("click", start);
        const nextBtn = document.getElementById("quizNext");
        if (nextBtn) nextBtn.addEventListener("click", next);
        const restart = document.getElementById("quizRestart");
        if (restart) restart.addEventListener("click", start);
        document.addEventListener("lab:progress-change", updateBest);
        updateBest();
    }

    const api = { start, state, updateBest };
    Lab.quiz = api;

    Lab.utils.ready(() => {
        bind();
        showScreen("quizStart");
    });
})(typeof window !== "undefined" ? window : globalThis);
