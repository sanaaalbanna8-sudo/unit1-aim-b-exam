(function () {
  const LETTERS = ["أ", "ب", "ج", "د"];

  const els = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
    name: document.getElementById("studentName"),
    klass: document.getElementById("studentClass"),
    btnStart: document.getElementById("btnStart"),
    studentLabel: document.getElementById("studentLabel"),
    progressLabel: document.getElementById("progressLabel"),
    liveCorrect: document.getElementById("liveCorrect"),
    progressFill: document.getElementById("progressFill"),
    qNum: document.getElementById("qNum"),
    qText: document.getElementById("qText"),
    choices: document.getElementById("choices"),
    feedback: document.getElementById("feedback"),
    btnNext: document.getElementById("btnNext"),
    finalScore: document.getElementById("finalScore"),
    resultTitle: document.getElementById("resultTitle"),
    resultMsg: document.getElementById("resultMsg"),
    sendStatus: document.getElementById("sendStatus"),
    btnReview: document.getElementById("btnReview"),
    btnRestart: document.getElementById("btnRestart"),
    reviewList: document.getElementById("reviewList"),
    toast: document.getElementById("toast")
  };

  let state = {
    name: "",
    klass: "",
    index: 0,
    correct: 0,
    answers: [],
    finishedAt: null
  };

  function toast(msg) {
    els.toast.hidden = false;
    els.toast.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { els.toast.hidden = true; }, 2800);
  }

  function show(screen) {
    [els.start, els.quiz, els.result].forEach((s) => s.classList.remove("on"));
    screen.classList.add("on");
  }

  function questions() {
    return window.EXAM_QUESTIONS || [];
  }

  function cfg() {
    return window.EXAM_CONFIG || {};
  }

  function startExam() {
    const name = (els.name.value || "").trim();
    if (!name) {
      toast("اكتبي الاسم قبل البدء");
      els.name.focus();
      return;
    }
    state = {
      name,
      klass: (els.klass.value || "").trim(),
      index: 0,
      correct: 0,
      answers: [],
      finishedAt: null
    };
    els.studentLabel.textContent = state.klass
      ? `${state.name} · ${state.klass}`
      : state.name;
    els.liveCorrect.textContent = "0";
    show(els.quiz);
    renderQuestion();
  }

  function renderQuestion() {
    const list = questions();
    const i = state.index;
    const item = list[i];
    if (!item) return;

    els.qNum.textContent = `السؤال ${i + 1}`;
    els.qText.textContent = item.q;
    els.progressLabel.textContent = `سؤال ${i + 1} من ${list.length}`;
    els.progressFill.style.width = `${(i / list.length) * 100}%`;
    els.feedback.hidden = true;
    els.feedback.textContent = "";
    els.feedback.className = "feedback";
    els.btnNext.disabled = true;
    els.btnNext.textContent = i === list.length - 1 ? "إنهاء الامتحان" : "السؤال التالي";

    els.choices.innerHTML = "";
    item.choices.forEach((text, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.innerHTML = `<span class="letter">${LETTERS[idx]}</span><span>${text}</span>`;
      btn.addEventListener("click", () => selectChoice(idx));
      els.choices.appendChild(btn);
    });
  }

  function selectChoice(choiceIndex) {
    const list = questions();
    const item = list[state.index];
    if (!item || state.answers[state.index]) return;

    const isCorrect = choiceIndex === item.answer;
    if (isCorrect) state.correct += 1;

    state.answers[state.index] = {
      qId: item.id,
      question: item.q,
      choices: item.choices.slice(),
      selected: choiceIndex,
      correct: item.answer,
      isCorrect,
      selectedLetter: LETTERS[choiceIndex],
      correctLetter: LETTERS[item.answer]
    };

    els.liveCorrect.textContent = String(state.correct);

    [...els.choices.querySelectorAll(".choice")].forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === item.answer) btn.classList.add("correct");
      if (idx === choiceIndex && !isCorrect) btn.classList.add("wrong");
    });

    els.feedback.hidden = false;
    if (isCorrect) {
      els.feedback.className = "feedback ok";
      els.feedback.textContent = `صح ✓ الإجابة الصحيحة: ${LETTERS[item.answer]}) ${item.choices[item.answer]}`;
    } else {
      els.feedback.className = "feedback bad";
      els.feedback.textContent =
        `خطأ ✗ اخترتِ: ${LETTERS[choiceIndex]}) ${item.choices[choiceIndex]} — الصحيحة: ${LETTERS[item.answer]}) ${item.choices[item.answer]}`;
    }

    els.btnNext.disabled = false;
  }

  function nextQuestion() {
    const list = questions();
    if (!state.answers[state.index]) {
      toast("اختاري إجابة أولًا");
      return;
    }
    if (state.index >= list.length - 1) {
      finishExam();
      return;
    }
    state.index += 1;
    renderQuestion();
  }

  function gradeMessage(score, total) {
    const pct = (score / total) * 100;
    if (pct >= 90) return "ممتاز — فهم قوي للمصطلحات والتمييز بينها.";
    if (pct >= 75) return "جيد جدًا — راجعي الأسئلة الخاطئة لتثبّتي الفرق بين المصطلحات.";
    if (pct >= 60) return "مقبول — أعيدي قراءة المصطلحات الرئيسة ثم حاولي مرة أخرى.";
    return "يحتاج تحسين — ركّزي على تعريفات المصطلحات والفروق بينها.";
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatStamp(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function finishExam() {
    const total = questions().length;
    state.finishedAt = new Date();
    els.progressFill.style.width = "100%";
    els.finalScore.textContent = String(state.correct);
    els.resultTitle.textContent = `نتيجتك يا ${state.name}`;
    els.resultMsg.textContent = gradeMessage(state.correct, total);
    els.reviewList.hidden = true;
    els.reviewList.innerHTML = "";
    els.sendStatus.textContent = "جاري إرسال نتيجتك للمعلمة…";
    els.sendStatus.className = "send-status";
    show(els.result);
    sendToSheet();
  }

  function buildReview() {
    els.reviewList.innerHTML = state.answers.map((a, i) => {
      const mark = a.isCorrect ? "صحيح" : "خطأ";
      const cls = a.isCorrect ? "ok" : "bad";
      return `
        <div class="review-item">
          <div class="meta ${cls}">${i + 1}. ${mark}</div>
          <p><strong>${a.question}</strong></p>
          <p>إجابتك: ${LETTERS[a.selected]}) ${a.choices[a.selected]}</p>
          <p>الصحيحة: ${LETTERS[a.correct]}) ${a.choices[a.correct]}</p>
        </div>
      `;
    }).join("");
    els.reviewList.hidden = false;
  }

  function payload() {
    const total = questions().length;
    return {
      token: cfg().TOKEN || "UNIT1-AIM-B-2026",
      name: state.name,
      klass: state.klass,
      score: state.correct,
      total,
      at: formatStamp(state.finishedAt || new Date()),
      answers: state.answers.map((a) => ({
        qId: a.qId,
        isCorrect: a.isCorrect,
        selectedLetter: a.selectedLetter,
        correctLetter: a.correctLetter
      }))
    };
  }

  function sendToSheet() {
    const url = (cfg().SHEET_URL || "").trim();
    if (!url) {
      els.sendStatus.textContent = "لم يُضبط رابط الإرسال بعد — نتيجتك ظاهرة لك هنا فقط.";
      els.sendStatus.className = "send-status warn";
      return;
    }

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload())
    })
      .then(() => {
        els.sendStatus.textContent = "تم إرسال نتيجتك للمعلمة.";
        els.sendStatus.className = "send-status ok";
      })
      .catch(() => {
        els.sendStatus.textContent = "تعذّر الإرسال — نتيجتك ظاهرة لك هنا. أخبرِ المعلمة.";
        els.sendStatus.className = "send-status bad";
      });
  }

  function restart() {
    els.reviewList.hidden = true;
    els.reviewList.innerHTML = "";
    show(els.start);
    els.name.focus();
  }

  els.btnStart.addEventListener("click", startExam);
  els.btnNext.addEventListener("click", nextQuestion);
  els.btnReview.addEventListener("click", () => {
    if (els.reviewList.hidden) buildReview();
    else els.reviewList.hidden = true;
  });
  els.btnRestart.addEventListener("click", restart);

  els.name.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startExam();
  });
  els.klass.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startExam();
  });
})();
