/* ============================================================
   ICT EXPO — LIVE WORKS: 12 interactive demos (one per project)
   Each demo: LIVE_DEMOS[key](stageEl, project)
   Hints shown under the stage come from LIVE_HINTS.
   ============================================================ */

const LIVE_HINTS = {
  dailyAlgo: "👉 Tap steps in the right order to build the daily algorithm — then play it!",
  beebot: "👉 Plan the route, tap the arrows, then press <b>GO</b> — Bee-Bot remembers the whole sequence!",
  nextStep: "👉 Look at the pattern in the window and predict: what happens next?",
  spotBug: "👉 Click the picture where the silly robot has a BUG, then pick the right fix!",
  dataDetective: "👉 Be a data detective: read the picture chart, then answer each question!",
  ipo: "👉 Feed an INPUT card into the computer, watch it PROCESS, and read the OUTPUT!",
  sandwich: "👉 Order the chef's steps PRECISELY — vague steps make a mess!",
  scratch: "👉 Snap Scratch blocks onto the script, then press the <b>GREEN FLAG ▶</b> to animate the frog!",
  maze: "👉 Be the Debugging Detective 🔍: tap the WRONG arrow in the code to fix the path.",
  traffic: "👉 Press <b>START LOOP</b> and watch the lights — can you point at the <b>repeat</b> block in the code?",
  baskets: "👉 Tap a picture card, then tap the right basket. Watch the tally marks grow!",
  bargraph: "👉 Vote for your favourite fruit — sticky votes make the bars grow live, just like at the expo!",
};

const LIVE_DEMOS = {

  /* ============ G1-1. ALGORITHMS ALL AROUND US ============ */
  dailyAlgo(stage) {
    const TASKS = [
      { name: "🪥 Brushing Teeth", steps: ["👄", "🦷", "🪥", "💦", "🧖"] },
      { name: "🧃 Making Juice", steps: ["🍊", "🔪", "🫗", "🥤", "😋"] },
      { name: "🎒 Getting Ready for School", steps: ["⏰", "🛏️", "👕", "🍚", "🎒"] },
      { name: "🌱 Planting a Seed", steps: ["🪴", "🌰", "🫗", "☀️", "🌱"] },
      { name: "🍞 Making a Sandwich", steps: ["🍞", "🔪", "🧈", "🥪", "😋"] },
      { name: "🧦 Getting Dressed", steps: ["🧦", "👟", "🧥", "🎒", "🚶"] },
      { name: "🪟 Washing Hands", steps: ["🤲", "🧼", "🤲", "💦", "🧻"] },
    ];
    let task, pool, ordered, done, qNo;

    stage.innerHTML = `
      <div style="font-family:'Baloo 2';font-weight:700;color:#8e2157;z-index:1" id="da-task"></div>
      <div class="brick-wall" id="da-wall" style="min-height:120px"></div>
      <div class="brick-pal" id="da-pool"></div>
      <div class="lw-row">
        <button class="lw-btn" id="da-check">✅ Check my algorithm</button>
        <button class="lw-btn white" id="da-new">🔀 Another task</button>
      </div>
      <div class="lw-note" id="da-note"></div>`;

    const wallEl = stage.querySelector("#da-wall");
    const poolEl = stage.querySelector("#da-pool");
    const noteEl = stage.querySelector("#da-note");
    const taskEl = stage.querySelector("#da-task");

    function newTask() {
      let next;
      do { next = TASKS[Math.floor(Math.random() * TASKS.length)]; }
      while (TASKS.length > 1 && next === task);
      task = next;
      ordered = [];
      done = false;
      qNo++;
      pool = shuffle(task.steps.slice());
      taskEl.textContent = `Question ${qNo}: Build the algorithm — ${task.name}`;
      noteEl.textContent = "Tap the step cards in order — first, next, then… last!";
      render();
    }

    function render() {
      wallEl.innerHTML = ordered.length
        ? ordered.map((s, i) => `<span class="brick">${i + 1}. ${s}</span>`).join("")
        : '<span style="color:#b58aa0;font-size:.85rem">The algorithm is empty — add steps! 👇</span>';
      poolEl.innerHTML = pool.map((s, i) => `<button class="brick" data-i="${i}" style="border:none">${s}</button>`).join("");
    }

    poolEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b || done) return;
      ordered.push(pool.splice(+b.dataset.i, 1)[0]);
      render();
    });
    wallEl.addEventListener("click", (e) => {
      const b = e.target.closest(".brick");
      if (!b || done) return;
      const i = [...wallEl.children].indexOf(b);
      pool.push(ordered.splice(i, 1)[0]);
      render();
    });
    stage.querySelector("#da-check").addEventListener("click", () => {
      if (ordered.length !== task.steps.length) { noteEl.textContent = "⚠️ Use ALL the steps first!"; return; }
      if (!task.steps.every((s, i) => ordered[i] === s)) {
        noteEl.textContent = "❌ Wrong order — this task will fail! Tap steps on the wall to put them back, then try again.";
        return;
      }
      done = true;
      noteEl.textContent = "🎉 Perfect algorithm! First … next … then … last. Loading a new question…";
      setTimeout(newTask, 1400);
    });
    stage.querySelector("#da-new").addEventListener("click", newTask);

    qNo = 0;
    newTask();
  },

  /* ============ G1-2. BEE-BOT BEGINNINGS ============ */
  beebot(stage) {
    const N = 4;
    let pos, flower, seq, running;
    /* direction pad: every command moves the bee one square */
    const MOVE = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
    const LABEL = { U: "⬆ Up", D: "⬇ Down", L: "⬅ Left", R: "➡ Right" };

    stage.innerHTML = `
      <div class="robot-wrap">
        <div class="robot-grid" id="bb-grid"></div>
        <div class="rprog">
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,max-content));gap:10px;justify-content:start;align-items:center">
            <span></span>
            <button class="lw-btn" data-c="U">⬆ Up</button>
            <span></span>
            <button class="lw-btn" data-c="L">⬅ Left</button>
            <button class="lw-btn" data-c="D">⬇ Down</button>
            <button class="lw-btn" data-c="R">➡ Right</button>
          </div>
          <div style="font-size:.72rem;font-weight:700;color:#8a6f7c;letter-spacing:.04em">YOUR PROGRAM — click a step to remove it 👇</div>
          <div class="cell-cmds" id="bb-seq"></div>
          <div class="lw-row" style="justify-content:flex-start">
            <button class="lw-btn" id="bb-go">🟢 GO</button>
            <button class="lw-btn white" id="bb-clear">🧹 Clear</button>
            <button class="lw-btn white" id="bb-new">🌸 New flower</button>
          </div>
        </div>
      </div>
      <div class="lw-note" id="bb-note"></div>`;

    const grid = stage.querySelector("#bb-grid");
    const seqEl = stage.querySelector("#bb-seq");
    const noteEl = stage.querySelector("#bb-note");
    const dirBtns = stage.querySelectorAll("[data-c]");

    function newRound() {
      pos = { x: 0, y: 3 };
      do { flower = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
      while (flower.x === pos.x && flower.y === pos.y);
      seq = []; running = false;
      render();
      noteEl.textContent = "Plan the route! Use the arrows to move Bee-Bot to the flower 🌸";
    }

    function render() {
      let h = "";
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const isBee = pos.x === x && pos.y === y;
        const isFlower = flower.x === x && flower.y === y;
        h += `<div class="rcell ${isFlower ? "goal" : ""}">${isBee ? "🐝" : isFlower ? "🌸" : ""}</div>`;
      }
      grid.innerHTML = h;
      seqEl.innerHTML = seq.length
        ? seq.map((c, i) => `<button class="cmd-chip" data-i="${i}" style="border:none;cursor:pointer" title="Remove this step">${i + 1}. ${LABEL[c]}</button>`).join("")
        : '<span style="color:#b58aa0;font-size:.82rem">No steps yet — tap the arrows 👆</span>';
      dirBtns.forEach((b) => (b.disabled = running));
    }

    /* planning: only store the step — the bee moves when you press GO */
    dirBtns.forEach((b) => b.addEventListener("click", () => {
      if (running) return;
      seq.push(b.dataset.c);
      render();
      noteEl.textContent = `${LABEL[b.dataset.c]} added — step ${seq.length}. Press GO to run the program.`;
    }));

    /* click a step in the program to remove a wrong move */
    seqEl.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-i]");
      if (!chip || running) return;
      seq.splice(+chip.dataset.i, 1);
      render();
      noteEl.textContent = "Wrong step removed — the program is shorter now.";
    });

    stage.querySelector("#bb-go").addEventListener("click", () => {
      if (running) return;
      if (!seq.length) { noteEl.textContent = "⚠️ Move the arrows to build a route first!"; return; }
      running = true;
      render();
      noteEl.textContent = "🐝 Bee-Bot is following its program…";
      let i = 0;
      const step = () => {
        if (i >= seq.length) {
          running = false;
          render();
          if (pos.x === flower.x && pos.y === flower.y) noteEl.textContent = "🎉 BUZZ! Bee-Bot reached the flower — perfect sequence!";
          else noteEl.textContent = "🤔 Bee-Bot stopped on the wrong square. Click a step to remove it, or press Clear.";
          return;
        }
        const c = seq[i];
        const nx = pos.x + MOVE[c][0];
        const ny = pos.y + MOVE[c][1];
        if (nx < 0 || ny < 0 || nx >= N || ny >= N) {
          /* the move that caused the bump is the wrong move — remove it */
          seq.splice(i, 1);
          running = false;
          render();
          noteEl.textContent = "💥 BUMP! Bee-Bot hit the edge — the wrong move was removed. Fix the program and press GO.";
          return;
        }
        pos.x = nx; pos.y = ny;
        render(); i++;
        setTimeout(step, 520);
      };
      step();
    });
    stage.querySelector("#bb-clear").addEventListener("click", () => {
      if (running) return;
      pos = { x: 0, y: 3 }; seq = [];
      render();
      noteEl.textContent = "Program cleared — Bee-Bot is back on the start square.";
    });
    stage.querySelector("#bb-new").addEventListener("click", () => { if (!running) newRound(); });

    newRound();
  },

  /* ============ G1-3. WHAT HAPPENS NEXT? ============ */
  nextStep(stage) {
    const SEQS = [
      { name: "🌱 Seed grows", seq: ["🌰", "🌱", "🌿", "🌳"], opts: ["🌳", "🌰", "🥀"] },
      { name: "🐛 Butterfly", seq: ["🥚", "🐛", "🦋"], opts: ["🦋", "🐛", "🕷️"] },
      { name: "🌞 Day cycle", seq: ["🌅", "🌞", "🌇"], opts: ["🌙", "🌞", "⛅"] },
      { name: "🥛 Milk to cheese", seq: ["🐄", "🥛", "🧈"], opts: ["🧈", "🐄", "🍞"] },
      { name: "🌧️ Rain grows plant", seq: ["☁️", "🌧️", "💧", "🌿"], opts: ["🌿", "☃️", "🌪️"] },
      { name: "🐣 Chick hatches", seq: ["🥚", "🐣", "🐤", "🐔"], opts: ["🐔", "🥚", "🦜"] },
      { name: "🌸 Flower blooms", seq: ["🌰", "🌱", "🌿", "🌸"], opts: ["🌸", "🌰", "🌵"] },
      { name: "🫖 Hot drink", seq: ["🫖", "🔥", "💨", "☕"], opts: ["☕", "🧊", "🥤"] },
    ];
    let cur, shown, locked, qNo;

    stage.innerHTML = `
      <div style="font-family:'Baloo 2';font-weight:700;color:#8e2157;z-index:1" id="ns-name"></div>
      <div style="display:flex;gap:10px;font-size:2.6rem;background:#fdf4f8;border:2px solid #f0dbe6;border-radius:16px;padding:18px 26px;z-index:1" id="ns-window"></div>
      <div style="font-size:.8rem;font-weight:700;color:#8a6f7c;z-index:1">WHAT HAPPENS NEXT? 👇</div>
      <div class="quiz-opts" id="ns-opts"></div>
      <div class="lw-row"><button class="lw-btn white" id="ns-new">🔄 New sequence</button></div>
      <div class="lw-note" id="ns-note"></div>`;

    const winEl = stage.querySelector("#ns-window");
    const optsEl = stage.querySelector("#ns-opts");
    const noteEl = stage.querySelector("#ns-note");

    function newSeq() {
      let next;
      do { next = SEQS[Math.floor(Math.random() * SEQS.length)]; }
      while (SEQS.length > 1 && next === cur);
      cur = next;
      shown = cur.seq.length - 1;
      locked = false;
      qNo++;
      stage.querySelector("#ns-name").textContent = `Question ${qNo}: Pattern machine — ${cur.name}`;
      noteEl.textContent = "Study the pattern, then predict the next card!";
      render();
    }

    function render() {
      winEl.innerHTML = cur.seq.slice(0, shown).map((s) => `<span>${s}</span>`).join("<span style='color:#c9a0b5'>→</span>") + '<span style="opacity:.35;border:2px dashed #c9a0b5;border-radius:10px;padding:0 10px">?</span>';
      optsEl.innerHTML = "";
      shuffle(cur.opts.slice()).forEach((o) => {
        const b = document.createElement("button");
        b.className = "quiz-opt";
        b.innerHTML = `<span style="font-size:1.7rem">${o}</span>`;
        b.addEventListener("click", () => {
          if (locked) return;
          if (o === cur.seq[shown]) {
            locked = true;
            b.classList.add("right");
            noteEl.textContent = "✅ Correct prediction! Programs follow patterns — loading a new question…";
            setTimeout(newSeq, 1400);
          } else {
            b.classList.add("wrong");
            noteEl.textContent = "❌ Not that one — look at the pattern again!";
            setTimeout(() => b.classList.remove("wrong"), 600);
          }
        });
        optsEl.appendChild(b);
      });
    }

    stage.querySelector("#ns-new").addEventListener("click", newSeq);
    qNo = 0;
    newSeq();
  },

  /* ============ G1-4. SPOT THE BUG ============ */
  spotBug(stage) {
    const SCENES = [
      { q: "🤖 The robot brushes teeth…", pics: ["🪥😄", "🧦🪥", "😁"], bug: 1, why: "A SOCK is not a toothbrush!", fix: "🪥" },
      { q: "🤖 The robot wears shoes…", pics: ["🦶", "🥿", "🧦"], bug: 1, why: "One shoe, one sock — wrong feet!", fix: "👟" },
      { q: "🤖 The robot drinks milk…", pics: ["🥛", "🥤", "😋"], bug: 1, why: "A straw cup is not for milk here!", fix: "🥛" },
      { q: "🤖 The robot reads a book…", pics: ["📖", "🔨", "👀"], bug: 1, why: "A hammer is not for reading!", fix: "📖" },
      { q: "🤖 The robot eats soup…", pics: ["🥣", "🍴", "🥄"], bug: 1, why: "A FORK is hard for soup — use a spoon!", fix: "🥄" },
      { q: "🤖 The robot plants a seed…", pics: ["🌰", "🪴", "🔨"], bug: 2, why: "A hammer cannot plant — water it instead!", fix: "🫗" },
      { q: "🤖 The robot draws a picture…", pics: ["🖍️", "📄", "🍌"], bug: 2, why: "A BANANA cannot draw on paper!", fix: "✏️" },
      { q: "🤖 The robot washes hands…", pics: ["🧼", "💧", "🧦"], bug: 2, why: "A SOCK cannot wash — we need water!", fix: "🧽" },
      { q: "🤖 The robot listens to music…", pics: ["🎵", "🎧", "🍕"], bug: 2, why: "Headphones play music, not a PIZZA!", fix: "📻" },
      { q: "🤖 The robot goes to sleep…", pics: ["🛏️", "🧸", "⚽"], bug: 2, why: "A football is not a pillow!", fix: "🛌" },
      { q: "🤖 The robot drinks juice…", pics: ["🧃", "🥤", "🪥"], bug: 2, why: "A TOOTHBRUSH cannot drink juice!", fix: "🫗" },
      { q: "🤖 The robot writes a letter…", pics: ["✉️", "🖊️", "🥄"], bug: 2, why: "A SPOON cannot write a letter!", fix: "✏️" },
    ];
    let deck, si, cur, locked;

    stage.innerHTML = `
      <div class="quiz-q" id="sb-q"></div>
      <div class="quiz-opts" id="sb-pics"></div>
      <div class="lw-note" id="sb-note">Find the BUG — click the picture where the robot got it wrong!</div>
      <div class="fix-chip" id="sb-fix"></div>
      <div class="lw-row"><button class="lw-btn white" id="sb-new">🔄 Start again</button></div>`;

    const qEl = stage.querySelector("#sb-q");
    const picsEl = stage.querySelector("#sb-pics");
    const noteEl = stage.querySelector("#sb-note");
    const fixEl = stage.querySelector("#sb-fix");

    function newGame() {
      /* fresh copies each round, so pasting a fix never changes the source scenes */
      deck = SCENES.map((s) => ({ ...s, pics: s.pics.slice() })).sort(() => Math.random() - 0.5);
      si = 0;
      newScene();
    }

    function newScene() {
      cur = deck[si];
      locked = false;
      fixEl.innerHTML = "";
      qEl.textContent = `🐞 Bug ${si + 1} of ${deck.length}: ${cur.q}`;
      noteEl.textContent = "Find the BUG — click the picture where the robot got it wrong!";
      render();
    }

    function nextScene() {
      if (si < deck.length - 1) {
        si++;
        newScene();
      } else {
        qEl.textContent = "🏆 All bugs found and fixed — you are a debugging detective!";
        picsEl.innerHTML = "";
        fixEl.innerHTML = "";
        noteEl.textContent = "Debugging = find the bug + fix it. Well done!";
      }
    }

    function render() {
      picsEl.innerHTML = "";
      cur.pics.forEach((p, i) => {
        const b = document.createElement("button");
        b.className = "quiz-opt";
        b.innerHTML = `<span style="font-size:1.9rem">${p}</span>`;
        b.addEventListener("click", () => {
          if (locked) return;
          if (i === cur.bug) {
            locked = true;
            b.classList.add("right");
            noteEl.textContent = "🎉 BUG FOUND! " + cur.why + " Now FIX it:";
            const fix = document.createElement("button");
            fix.className = "lw-btn";
            fix.textContent = "Paste fix: " + cur.fix;
            fix.addEventListener("click", () => {
              cur.pics[cur.bug] = cur.fix;
              noteEl.textContent = "✅ BUG FIXED! On to the next robot…";
              render();
              setTimeout(nextScene, 900);
            });
            fixEl.innerHTML = "";
            fixEl.appendChild(fix);
          } else {
            b.classList.add("wrong");
            setTimeout(() => b.classList.remove("wrong"), 600);
          }
        });
        picsEl.appendChild(b);
      });
    }

    stage.querySelector("#sb-new").addEventListener("click", newGame);
    newGame();
  },

  /* ============ G1-5. USING DATA — DATA DETECTIVE ============ */
  dataDetective(stage) {
    const POOL = [
      { n: "Butterfly", e: "🦋" }, { n: "Bee", e: "🐝" },
      { n: "Ladybird", e: "🐞" }, { n: "Snail", e: "🐌" },
    ];
    let items, counts, questions, qi, locked;

    stage.innerHTML = `
      <div style="font-family:'Baloo 2';font-weight:800;font-size:1.1rem;color:#4f1130;z-index:1;text-align:center">🔍 DATA DETECTIVE — read the chart, then answer the questions</div>
      <div style="font-size:.78rem;font-weight:800;color:#8a6f7c;z-index:1;text-align:center">🔑 Key: 1 picture = 1 creature</div>
      <div class="baskets" id="dd-chart"></div>
      <div style="font-family:'Baloo 2';font-weight:800;font-size:1rem;color:#8e2157;z-index:1;text-align:center;margin-top:8px" id="dd-q"></div>
      <div class="lw-row" id="dd-opts"></div>
      <div class="lw-row"><button class="lw-btn white" id="dd-new">🔄 New chart</button></div>
      <div class="lw-note" id="dd-note"></div>`;

    const chartEl = stage.querySelector("#dd-chart");
    const qEl = stage.querySelector("#dd-q");
    const optsEl = stage.querySelector("#dd-opts");
    const noteEl = stage.querySelector("#dd-note");

    const label = (it) => `${it.e} ${it.n}`;

    function numberOpts(correct) {
      const set = new Set([correct]);
      while (set.size < 3) {
        const d = correct + Math.floor(Math.random() * 5) - 2;
        if (d > 0) set.add(d);
      }
      return [...set].sort(() => Math.random() - 0.5);
    }

    function newChart() {
      /* four different counts, so there is always one MOST and one LEAST */
      items = POOL.slice().sort(() => Math.random() - 0.5);
      counts = [2, 3, 4, 5].sort(() => Math.random() - 0.5);
      const maxIdx = counts.indexOf(Math.max(...counts));
      const minIdx = counts.indexOf(Math.min(...counts));
      const mx = items[maxIdx], mn = items[minIdx];
      const total = counts.reduce((a, b) => a + b, 0);
      questions = [
        { q: "Which creature did we see the MOST?", opts: items.map(label), ans: label(mx) },
        { q: "Which creature did we see the LEAST?", opts: items.map(label), ans: label(mn) },
        { q: `How many ${mx.e} are in the chart?`, opts: numberOpts(counts[maxIdx]), ans: counts[maxIdx] },
        { q: `How many ${mn.e} are in the chart?`, opts: numberOpts(counts[minIdx]), ans: counts[minIdx] },
        { q: `How many MORE ${mx.e} than ${mn.e}?`, opts: numberOpts(counts[maxIdx] - counts[minIdx]), ans: counts[maxIdx] - counts[minIdx] },
        { q: "How many creatures are in the chart ALTOGETHER?", opts: numberOpts(total), ans: total },
      ];
      qi = 0;
      renderChart();
      showQuestion();
    }

    function renderChart() {
      chartEl.innerHTML = items.map((it, i) => `
        <div class="basket" style="min-width:140px">
          <h5>${it.e} ${it.n}</h5>
          <div style="font-size:1.3rem;letter-spacing:2px;color:#8e2157;margin-top:6px;word-break:break-all">${it.e.repeat(counts[i])}</div>
        </div>`).join("");
    }

    function showQuestion() {
      locked = false;
      const cur = questions[qi];
      qEl.textContent = `🔍 Question ${qi + 1} of ${questions.length}: ${cur.q}`;
      optsEl.innerHTML = cur.opts.map((o, i) => `<button class="lw-btn white" data-o="${i}">${o}</button>`).join("");
      if (qi === 0) noteEl.textContent = "Count the pictures in the chart to find the answer — you are the detective!";
    }

    optsEl.addEventListener("click", (e) => {
      if (locked) return;
      const b = e.target.closest("[data-o]");
      if (!b) return;
      const cur = questions[qi];
      if (cur.opts[+b.dataset.o] !== cur.ans) {
        noteEl.textContent = "🤔 Not quite — count the pictures in the chart and try again.";
        return;
      }
      locked = true;
      noteEl.textContent = "🎉 Correct! Great data detective work.";
      if (qi < questions.length - 1) {
        setTimeout(() => { qi++; showQuestion(); }, 700);
      } else {
        setTimeout(() => {
          qEl.textContent = "🏆 Case closed — you used the chart to answer every question!";
          optsEl.innerHTML = "";
          noteEl.textContent = "Well done, Detective. That is what USING data means!";
        }, 600);
      }
    });

    stage.querySelector("#dd-new").addEventListener("click", newChart);
    newChart();
  },

  /* ============ G1-6. INPUT · PROCESS · OUTPUT ============ */
  ipo(stage) {
    const TASKS = [
      { in: "2 + 3", out: "= 5 ⭐", why: "The computer added 2 and 3." },
      { in: "10 − 4", out: "= 6 ⭐", why: "The computer subtracted." },
      { in: "abc", out: "ABC ⭐", why: "The computer made capitals." },
      { in: "🐶🐱", out: "2 animals ⭐", why: "The computer counted." },
      { in: "sun 🌞", out: "day ⭐", why: "The computer matched." },
    ];
    let cur, processing;

    stage.innerHTML = `
      <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:center;z-index:1">
        <div style="text-align:center">
          <div style="font-size:.72rem;font-weight:800;color:#8e2157;letter-spacing:.1em">INPUT 👇</div>
          <div id="ipo-in" style="width:92px;height:92px;display:grid;place-items:center;font-size:1.5rem;background:#fff;border:2.5px dashed #a63a6e;border-radius:16px;margin-top:6px">?</div>
        </div>
        <div style="text-align:center">
          <div style="width:130px;height:150px;background:linear-gradient(160deg,#6d1843,#8e2157);border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#fff;box-shadow:0 20px 60px rgba(142,33,87,.2)">
            <div style="font-family:'Baloo 2';font-weight:800;font-size:.8rem">💻 COMPUTER</div>
            <div id="ipo-led" style="width:26px;height:26px;border-radius:50%;background:#5a2c42"></div>
            <div id="ipo-status" style="font-size:.66rem;opacity:.85">sleeping…</div>
          </div>
          <div style="font-size:.68rem;font-weight:700;color:#8a6f7c;margin-top:4px">PROCESS (thinking)</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.72rem;font-weight:800;color:#8e2157;letter-spacing:.1em">OUTPUT 👇</div>
          <div id="ipo-out" style="width:92px;height:92px;display:grid;place-items:center;font-size:1.2rem;background:#fff;border:2.5px dashed #a63a6e;border-radius:16px;margin-top:6px;font-weight:700;color:#8e2157">?</div>
        </div>
      </div>
      <div class="lw-row" id="ipo-cards"></div>
      <div class="lw-note" id="ipo-note">Pick an INPUT card and feed it to the computer!</div>`;

    const inEl = stage.querySelector("#ipo-in");
    const outEl = stage.querySelector("#ipo-out");
    const ledEl = stage.querySelector("#ipo-led");
    const statEl = stage.querySelector("#ipo-status");
    const noteEl = stage.querySelector("#ipo-note");
    const cardsEl = stage.querySelector("#ipo-cards");

    function render() {
      cardsEl.innerHTML = "";
      shuffle(TASKS.slice()).slice(0, 3).forEach((t) => {
        const b = document.createElement("button");
        b.className = "lw-btn white";
        b.textContent = t.in;
        b.addEventListener("click", () => feed(t));
        cardsEl.appendChild(b);
      });
    }

    function feed(t) {
      if (processing) return;
      processing = true;
      cur = t;
      inEl.textContent = t.in;
      outEl.textContent = "?";
      noteEl.textContent = "⬆️ Input going in… the computer is THINKING…";
      let blink = 0;
      const iv = setInterval(() => {
        ledEl.style.background = blink % 2 ? "#5a2c42" : "#ffd24d";
        ledEl.style.boxShadow = blink % 2 ? "none" : "0 0 18px #ffd24d";
        statEl.textContent = "thinking" + ".".repeat((blink % 3) + 1);
        blink++;
      }, 220);
      setTimeout(() => {
        clearInterval(iv);
        ledEl.style.background = "#4dff88";
        ledEl.style.boxShadow = "0 0 18px #4dff88";
        statEl.textContent = "done!";
        outEl.textContent = t.out;
        noteEl.textContent = "⬇️ OUTPUT! " + t.why + " — INPUT → PROCESS → OUTPUT!";
        processing = false;
        render();
      }, 1600);
    }

    render();
  },

  /* ============ G2-1. PRECISE ALGORITHMS — SANDWICH CHEF ============ */
  sandwich(stage) {
    const STEPS = [
      { t: "Take 2 bread slices 🍞", ok: true },
      { t: "Open the jam jar 🫙", ok: true },
      { t: "Spread jam with the knife 🥄", ok: true },
      { t: "Cover with slice 2 🍞", ok: true },
      { t: "Press gently 🤏", ok: true },
      { t: "Serve the sandwich 🍽️", ok: true },
      { t: "Put the bread 🤷", ok: false, bad: "Put the bread WHERE? How many? The chef is confused!" },
      { t: "Add jam 🙂", ok: false, bad: "Add jam with WHAT? On WHAT? Too vague!" },
      { t: "Make it nice ✨", ok: false, bad: "'Make it nice' is not a step a computer can follow!" },
    ];
    let pool, ordered, played;

    stage.innerHTML = `
      <div style="display:flex;gap:26px;flex-wrap:wrap;justify-content:center;align-items:flex-start;z-index:1">
        <div style="text-align:center">
          <div style="font-size:4rem" id="sw-chef">👨‍🍳</div>
          <div style="font-size:.72rem;font-weight:700;color:#8e2157">ROBOT CHEF — follows EVERY word!</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;align-items:center">
          <div class="brick-wall" id="sw-wall" style="min-height:100px;max-width:420px"></div>
          <div class="brick-pal" id="sw-pool"></div>
          <div class="lw-row">
            <button class="lw-btn" id="sw-run">🍳 Cook it!</button>
            <button class="lw-btn white" id="sw-new">🔀 New cards</button>
          </div>
        </div>
      </div>
      <div class="lw-note" id="sw-note">Order the chef's steps — every word must be PRECISE!</div>`;

    const wallEl = stage.querySelector("#sw-wall");
    const poolEl = stage.querySelector("#sw-pool");
    const noteEl = stage.querySelector("#sw-note");
    const chefEl = stage.querySelector("#sw-chef");

    function newDeck() {
      const good = STEPS.filter((s) => s.ok);
      const bad = shuffle(STEPS.filter((s) => !s.ok).slice()).slice(0, 2);
      pool = shuffle([...good, ...bad]);
      ordered = [];
      played = false;
      noteEl.textContent = "Order the chef's steps — every word must be PRECISE!";
      render();
    }

    function render() {
      wallEl.innerHTML = ordered.length
        ? ordered.map((s, i) => `<span class="brick" data-i="${i}" style="${s.ok ? "" : "background:#e2506a"}">${i + 1}. ${s.t}</span>`).join("")
        : '<span style="color:#b58aa0;font-size:.85rem">Give the chef his instructions 👇</span>';
      poolEl.innerHTML = pool.map((s, i) => `<button class="brick" data-i="${i}" style="border:none;${s.ok ? "" : "background:#e2506a"}">${s.t}</button>`).join("");
    }

    function move(fromEl, from, to) {
      const card = from.splice(from, 1)[0];
    }

    poolEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b || played) return;
      ordered.push(pool.splice(+b.dataset.i, 1)[0]);
      render();
    });
    wallEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b || played) return;
      pool.push(ordered.splice(+b.dataset.i, 1)[0]);
      render();
    });
    stage.querySelector("#sw-run").addEventListener("click", () => {
      if (played) return;
      if (!ordered.length) { noteEl.textContent = "⚠️ Give the chef some steps first!"; return; }
      played = true;
      const bad = ordered.filter((s) => !s.ok);
      if (bad.length) {
        noteEl.textContent = "🤦 " + bad[0].bad + " PRECISE words only!";
        chefEl.textContent = "🤯";
        return;
      }
      const perfect = ordered.length === 6 && ordered.every((s) => s.ok);
      chefEl.textContent = "😋";
      noteEl.textContent = perfect
        ? "🎉 PERFECT sandwich! Precise algorithm = take 2 bread → open jar → spread → cover → press → serve!"
        : "⚠️ Steps are precise but not complete — a precise algorithm needs ALL 6 steps in order!";
    });
    stage.querySelector("#sw-new").addEventListener("click", newDeck);

    newDeck();
  },

  /* ============ G2-3. ANIMAL ANIMATIONS — SCRATCH ============ */
  scratch(stage) {
    const BLOCKS = [
      { id: "flag", label: "when ⚑ clicked", cat: "events" },
      { id: "forever", label: "forever", cat: "control" },
      { id: "move", label: "move 10 steps", cat: "motion" },
      { id: "costume", label: "next costume", cat: "looks" },
      { id: "wait", label: "wait 0.2 secs", cat: "control" },
      { id: "sound", label: "start sound ribbit", cat: "sound" },
    ];
    let script = [], playing = null, hops = 0;

    stage.innerHTML = `
      <div style="display:flex;gap:30px;flex-wrap:wrap;justify-content:center;align-items:flex-start;z-index:1">
        <div style="display:flex;flex-direction:column;gap:14px;align-items:center">
          <div style="background:#fff;border:8px solid #8e2157;border-radius:14px;width:300px;height:190px;position:relative;overflow:hidden" id="sc-stage">
            <div id="sc-sprite" style="position:absolute;bottom:12px;left:12px;font-size:3rem;transition:left .25s, transform .25s">🐸</div>
            <div style="position:absolute;top:6px;right:10px;font-size:.66rem;font-weight:700;color:#8a6f7c">Scratch STAGE</div>
            <div id="sc-hopcount" style="position:absolute;top:6px;left:10px;font-size:.66rem;font-weight:700;color:#8e2157"></div>
          </div>
          <div class="lw-row">
            <button class="lw-btn" id="sc-flag" style="background:#16a34a">⚑ GREEN FLAG</button>
            <button class="lw-btn white" id="sc-stop">⛔ Stop</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="font-size:.72rem;font-weight:800;color:#8e2157;letter-spacing:.08em">BLOCKS PALETTE</div>
          <div class="brick-pal" id="sc-palette" style="flex-direction:column;align-items:stretch;max-width:220px"></div>
          <div style="font-size:.72rem;font-weight:800;color:#8e2157;letter-spacing:.08em;margin-top:6px">YOUR SCRIPT (tap block to remove)</div>
          <div class="brick-wall" id="sc-script" style="min-height:80px;max-width:220px;padding:10px;display:flex;flex-direction:column;align-items:stretch;gap:6px"></div>
        </div>
      </div>
      <div class="lw-note" id="sc-note">Build the real Scratch script: when flag clicked → forever → move → next costume → wait!</div>`;

    const paletteEl = stage.querySelector("#sc-palette");
    const scriptEl = stage.querySelector("#sc-script");
    const sprite = stage.querySelector("#sc-sprite");
    const hopEl = stage.querySelector("#sc-hopcount");
    const noteEl = stage.querySelector("#sc-note");
    const CATC = { events: "#c88a00", control: "#cf8b17", motion: "#4c97ff", looks: "#9966ff", sound: "#cf63cf" };

    paletteEl.innerHTML = BLOCKS.map((b, i) =>
      `<button class="sc-block" data-i="${i}" style="background:${CATC[b.cat]}">${b.label}</button>`).join("");

    function renderScript() {
      scriptEl.innerHTML = script.length
        ? script.map((i, k) => `<span class="sc-block" data-k="${k}" style="background:${CATC[BLOCKS[i].cat]};cursor:pointer">${BLOCKS[i].label} <small>✕</small></span>`).join("")
        : '<span style="color:#b58aa0;font-size:.8rem">Empty script — snap blocks from the palette!</span>';
    }

    paletteEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b) return;
      if (script.length >= 7) { noteEl.textContent = "Script is full — that is enough to animate!"; return; }
      script.push(+b.dataset.i);
      renderScript();
      noteEl.textContent = "Block snapped in! Build: flag → forever → move → costume → wait.";
    });
    scriptEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-k]");
      if (!b) return;
      script.splice(+b.dataset.k, 1);
      renderScript();
    });

    function stop() {
      if (playing) { clearInterval(playing); playing = null; }
      sprite.style.left = "12px"; sprite.style.transform = "";
    }

    stage.querySelector("#sc-stop").addEventListener("click", () => { stop(); noteEl.textContent = "Script stopped. Edit your blocks and run again!"; });
    stage.querySelector("#sc-flag").addEventListener("click", () => {
      stop();
      if (!script.includes(0)) { noteEl.textContent = "⚠️ Scratch needs the 'when ⚑ clicked' hat block first!"; return; }
      if (!script.includes(2)) { noteEl.textContent = "⚠️ Add 'move 10 steps' so the frog can hop!"; return; }
      const body = script.filter((i) => i !== 0);
      const forever = body.includes(1);
      hops = 0;
      noteEl.textContent = "▶ Script running — the frog is animating!";
      let x = 12, costume = 0;
      const tick = () => {
        body.forEach((bi) => {
          if (bi === 2) { x = Math.min(250, x + 24); sprite.style.left = x + "px"; hops++; }
          if (bi === 3) { costume = 1 - costume; sprite.style.transform = costume ? "scaleY(.82) translateY(-9px)" : ""; }
          if (bi === 4) { /* wait handled by interval */ }
          if (bi === 5 && hops % 4 === 0) noteEl.textContent = "🐸 Ribbit! Sound block works too!";
        });
        hopEl.textContent = "hops: " + hops;
        if (x >= 250) {
          stop();
          noteEl.textContent = forever
            ? "♻️ Reached the edge — with 'forever' Scratch would REPEAT from the start!"
            : "✅ Script finished! Add 'forever' to loop the animation like real Scratch.";
          return;
        }
        playing = setTimeout(tick, body.includes(4) ? 300 : 130);
      };
      tick();
    });

    renderScript();
  },

  /* ============ 1. LED QUIZ — input or output? ============ */
  ledQuiz(stage) {
    const qs = [
      { n: "Keyboard ⌨️", i: true },
      { n: "Monitor 🖥️", i: false },
      { n: "Mouse 🖱️", i: true },
      { n: "Printer 🖨️", i: false },
      { n: "Microphone 🎤", i: true },
      { n: "Speaker 🔊", i: false },
      { n: "Scanner 📠", i: true },
      { n: "Headphones 🎧", i: false },
    ];
    let order = shuffle(qs.slice());
    let idx = 0, score = 0;

    stage.innerHTML = `
      <div class="quiz-q" id="qz-q"></div>
      <div class="quiz-opts">
        <button class="quiz-opt" data-v="1"><span class="led"></span>⬅ INPUT device</button>
        <button class="quiz-opt" data-v="0"><span class="led"></span>OUTPUT device ➡</button>
      </div>
      <div class="quiz-score" id="qz-score"></div>
      <div class="lw-note" id="qz-note">Press the button that matches the device!</div>`;

    const qEl = stage.querySelector("#qz-q");
    const scoreEl = stage.querySelector("#qz-score");
    const noteEl = stage.querySelector("#qz-note");
    const opts = [...stage.querySelectorAll(".quiz-opt")];

    function show() {
      const q = order[idx];
      qEl.innerHTML = `LED QUIZ ${idx + 1}/${order.length}<br/>Is a <b>${q.n}</b> an…`;
      scoreEl.textContent = `⭐ Score: ${score}`;
      opts.forEach(o => o.classList.remove("right", "wrong"));
      noteEl.textContent = "Press the button that matches the device!";
    }

    opts.forEach(btn => btn.addEventListener("click", () => {
      const q = order[idx];
      const correct = (btn.dataset.v === "1") === q.i;
      btn.classList.add(correct ? "right" : "wrong");
      if (correct) {
        score++;
        noteEl.textContent = `✅ Correct! ${q.n.replace(/[⌨️🖥️🖱️🖨️🎤🔊📠🎧]/g, "").trim()} is an ${q.i ? "INPUT" : "OUTPUT"} device — the green LED lights up!`;
        setTimeout(() => { idx = (idx + 1) % order.length; if (idx === 0) order = shuffle(qs.slice()); show(); }, 1300);
      } else {
        noteEl.textContent = "❌ Red LED! Try again — does the computer receive data from it, or show results with it?";
        setTimeout(() => btn.classList.remove("wrong"), 600);
      }
      scoreEl.textContent = `⭐ Score: ${score}`;
    }));

    show();
  },

  /* ============ 2. CODING BRICK WALL ============ */
  bricks(stage) {
    const CMDS = [
      { c: "MOVE", e: "🚶", d: "move 1 step" },
      { c: "TURN", e: "↩️", d: "turn around" },
      { c: "JUMP", e: "🦘", d: "move 2 steps" },
      { c: "PICK", e: "⭐", d: "pick the star" },
    ];
    const TRACK = 6;
    let wall = [];

    stage.innerHTML = `
      <div class="brick-wall" id="bw-wall"><span style="color:#b58aa0;font-size:.85rem">The wall is empty — add command bricks! 👇</span></div>
      <div class="robo-track" id="bw-track"></div>
      <div class="brick-pal" id="bw-pal"></div>
      <div class="lw-row">
        <button class="lw-btn" id="bw-run">▶ RUN PROGRAM</button>
        <button class="lw-btn white" id="bw-clear">🧹 Clear wall</button>
      </div>
      <div class="lw-note" id="bw-note">Build an algorithm that walks the robot exactly onto the star ⭐ (6 steps away).</div>`;

    const wallEl = stage.querySelector("#bw-wall");
    const trackEl = stage.querySelector("#bw-track");
    const noteEl = stage.querySelector("#bw-note");

    function renderTrack(pos, bump) {
      let html = "";
      for (let i = 0; i <= TRACK; i++) {
        let cell = i === TRACK ? '<span class="star">⭐</span>' : (i === 0 ? "🏁" : "·");
        html += `<span style="display:inline-grid;place-items:center;width:38px">${pos === i ? (bump ? "🤖💥" : "🤖") : cell}</span>`;
        if (i < TRACK) html += '<span style="color:#d9a8bf">—</span>';
      }
      trackEl.innerHTML = html;
    }

    function renderWall() {
      if (!wall.length) {
        wallEl.innerHTML = '<span style="color:#b58aa0;font-size:.85rem">The wall is empty — add command bricks! 👇</span>';
        return;
      }
      wallEl.innerHTML = wall.map((b, i) =>
        `<span class="brick" data-i="${i}">${b.e} ${b.c} <span style="font-weight:400;opacity:.8">(${b.d})</span><span class="bx" data-x="${i}">✕</span></span>`).join("");
    }

    stage.querySelector("#bw-pal").innerHTML = CMDS.map((b, i) =>
      `<button class="brick" data-add="${i}" style="border:none">+ ${b.e} ${b.c}</button>`).join("");

    stage.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => {
      wall.push(CMDS[+btn.dataset.add]); renderWall(); noteEl.textContent = "Brick added! Keep building, then RUN the program.";
    }));

    wallEl.addEventListener("click", e => {
      const x = e.target.dataset.x;
      if (x !== undefined) { wall.splice(+x, 1); renderWall(); }
    });
    stage.querySelector("#bw-clear").addEventListener("click", () => { wall = []; renderWall(); renderTrack(0); noteEl.textContent = "Wall cleared — build a new algorithm!"; });

    stage.querySelector("#bw-run").addEventListener("click", () => {
      if (!wall.length) { noteEl.textContent = "⚠️ An empty algorithm does nothing! Add bricks first."; return; }
      let pos = 0, ok = true, msg = "";
      renderTrack(0);
      let i = 0;
      const step = () => {
        if (i >= wall.length) { finish(); return; }
        const b = wall[i];
        if (b.c === "MOVE") pos += 1;
        else if (b.c === "JUMP") pos += 2;
        else if (b.c === "PICK") {
          if (pos === TRACK) { trackEl.innerHTML = trackEl.innerHTML.replace("🤖", "🤖🎉"); noteEl.textContent = "🎉 SUCCESS! The precise algorithm walked the robot to the star and it picked it!"; return; }
          else { ok = false; msg = `⚠️ PICK failed — the robot is on step ${pos}, not on the star. Debug your brick order!`; }
        }
        if (pos > TRACK) { ok = false; msg = "💥 The robot jumped past the star! Move fewer steps — algorithms must be precise."; renderTrack(TRACK, true); finish(); return; }
        renderTrack(pos);
        i++;
        setTimeout(step, 420);
      };
      const finish = () => { if (!ok) noteEl.textContent = msg; else if (pos !== TRACK) noteEl.textContent = `🤖 The robot stopped ${TRACK - pos} step(s) short of the star. Add more MOVE bricks and run again!`; };
      noteEl.textContent = "🤖 Running the program…";
      step();
    });

    renderTrack(0); renderWall();
  },

  /* ============ 3. TRAFFIC LIGHT — REPEAT LOOP ============ */
  traffic(stage) {
    let timer = null, loops = 0;
    stage.innerHTML = `
      <div class="tl-frame">
        <div class="tl-bulb red" data-b="red"></div>
        <div class="tl-bulb yellow" data-b="yellow"></div>
        <div class="tl-bulb green" data-b="green"></div>
      </div>
      <div class="tl-loop">while (true) { <span class="rep">REPEAT</span> → 🔴 wait → 🟢 wait → 🟡 wait → }</div>
      <div class="lw-row">
        <button class="lw-btn" id="tl-btn">▶ START LOOP</button>
        <span class="quiz-score" id="tl-count">Loops: 0</span>
      </div>
      <div class="lw-note" id="tl-note">The same pattern repeats forever — that is a REPEAT loop!</div>`;

    const bulbs = {};
    stage.querySelectorAll(".tl-bulb").forEach(b => bulbs[b.dataset.b] = b);
    const btn = stage.querySelector("#tl-btn");
    const note = stage.querySelector("#tl-note");
    const count = stage.querySelector("#tl-count");
    const SEQ = [["red", 2600, "🔴 RED — stop and wait…"], ["green", 2600, "🟢 GREEN — go!"], ["yellow", 1400, "🟡 YELLOW — get ready…"]];

    function cycle(i) {
      Object.values(bulbs).forEach(b => b.classList.remove("on"));
      const [name, ms, msg] = SEQ[i];
      bulbs[name].classList.add("on");
      note.textContent = msg;
      timer = setTimeout(() => {
        if (i === SEQ.length - 1) { loops++; count.textContent = `Loops: ${loops}`; note.textContent = "🔁 Pattern finished — REPEAT! Back to red…"; setTimeout(() => cycle(0), 500); return; }
        cycle(i + 1);
      }, ms);
    }

    btn.addEventListener("click", () => {
      if (timer) { clearTimeout(timer); timer = null; Object.values(bulbs).forEach(b => b.classList.remove("on")); btn.textContent = "▶ START LOOP"; note.textContent = "Loop paused. Press start to repeat again!"; }
      else { btn.textContent = "⏸ STOP LOOP"; loops = 0; count.textContent = "Loops: 0"; cycle(0); }
    });
  },

  /* ============ 4. DATA SORTING BASKETS ============ */
  baskets(stage) {
    const CATS = [
      { name: "Fruits 🍎", items: ["🍎", "🍌", "🍇", "🍓"] },
      { name: "Animals 🐾", items: ["🐶", "🐱", "🐰", "🦁"] },
      { name: "Shapes 🔷", items: ["🔺", "⬛", "⚪", "🔶"] },
    ];
    let deck = [], selected = null;
    CATS.forEach((c, ci) => c.items.forEach(it => deck.push({ e: it, ci })));
    deck = shuffle(deck);
    const counts = [0, 0, 0];

    stage.innerHTML = `
      <div class="card-deck" id="bk-deck"></div>
      <div class="baskets" id="bk-baskets"></div>
      <div class="lw-note" id="bk-note">Tap a card, then tap its basket. Sort all 12 cards!</div>`;

    const deckEl = stage.querySelector("#bk-deck");
    const basketsEl = stage.querySelector("#bk-baskets");
    const noteEl = stage.querySelector("#bk-note");

    function tally(n) {
      let out = "";
      const fives = Math.floor(n / 5), rem = n % 5;
      for (let i = 0; i < fives; i++) out += "////̸ ";
      if (rem) out += "/".repeat(rem);
      return out || "—";
    }

    function render() {
      deckEl.innerHTML = deck.map((c, i) => `<div class="data-card ${selected === i ? "sel" : ""}" data-i="${i}" style="${selected === i ? "border-color:#8e2157;background:#f7e9f0" : ""}">${c.e}<small>card ${i + 1}</small></div>`).join("") || '<span style="color:#8a6f7c;font-size:.85rem">Deck empty — all cards sorted! 🎉</span>';
      basketsEl.innerHTML = CATS.map((c, i) => `
        <div class="basket" data-b="${i}">
          <h5>${c.name}</h5>
          <div class="items">${c.items.filter((_, k) => sorted[i].includes(c.items[k])).join("")}</div>
          <div class="tally">${tally(counts[i])} <b>${counts[i]}</b></div>
        </div>`).join("");
    }

    const sorted = [[], [], []];

    function drop(bi, ci) {
      const card = deck[ci];
      if (card.ci === bi) {
        sorted[bi].push(card.e); counts[bi]++;
        deck.splice(ci, 1); selected = null;
        const left = deck.length;
        noteEl.textContent = left ? `✅ Sorted! ${left} card${left > 1 ? "s" : ""} left.` : "🎉 ALL DATA COLLECTED & SORTED! The tally chart is our class database.";
      } else {
        noteEl.textContent = "❌ Wrong basket — look at the picture again!";
        setTimeout(render, 350);
        return;
      }
      render();
    }

    deckEl.addEventListener("click", e => {
      const card = e.target.closest("[data-i]");
      if (!card) return;
      selected = +card.dataset.i;
      noteEl.textContent = "Card selected — now tap the correct basket!";
      render();
    });
    basketsEl.addEventListener("click", e => {
      const b = e.target.closest("[data-b]");
      if (!b) return;
      if (selected === null) { noteEl.textContent = "👆 First tap a picture card from the deck!"; return; }
      drop(+b.dataset.b, selected);
    });

    render();
  },

  /* ============ 5. PAPER CUP NETWORK PHONE ============ */
  cupphone(stage) {
    const quick = ["Hello! 👋", "Meet at 4pm ⏰", "Send homework 📚", "Happy birthday! 🎂"];
    stage.innerHTML = `
      <div class="cup-scene">
        <div class="cup"><span class="cupicon">🥤</span><span class="cuplabel">SENDER 🗣️</span></div>
        <div class="string-wrap">
          <div class="string-line"><span class="string-msg" id="cp-msg"></span></div>
        </div>
        <div class="cup" id="cp-rx"><span class="cupicon">🥤</span><span class="cuplabel">RECEIVER 👂</span></div>
      </div>
      <div class="lw-row" id="cp-quick"></div>
      <div class="lw-row">
        <input id="cp-in" maxlength="26" placeholder="Type your message…" style="padding:11px 16px;border:2px solid #f0dbe6;border-radius:999px;font-family:inherit;font-size:.88rem;outline:none;width:min(260px,70vw)" />
        <button class="lw-btn" id="cp-send">📡 SEND ON NETWORK</button>
      </div>
      <div class="lw-note" id="cp-note">The string is the network line — the message travels node to node!</div>`;

    const msgEl = stage.querySelector("#cp-msg");
    const rx = stage.querySelector("#cp-rx");
    const note = stage.querySelector("#cp-note");
    const input = stage.querySelector("#cp-in");
    const quickEl = stage.querySelector("#cp-quick");

    quickEl.innerHTML = quick.map(q => `<button class="lw-btn white" data-q="${q}">${q}</button>`).join("");
    quickEl.addEventListener("click", e => {
      const b = e.target.closest("[data-q]");
      if (b) { input.value = b.dataset.q; send(); }
    });

    function send() {
      const text = (input.value || "Hello! 👋").replace(/[<>&"]/g, "");
      msgEl.textContent = "📨 " + text;
      msgEl.classList.remove("travel");
      void msgEl.offsetWidth;
      msgEl.classList.add("travel");
      note.textContent = "📡 Message travelling on the network line…";
      setTimeout(() => {
        rx.style.transform = "rotate(-6deg)";
        setTimeout(() => (rx.style.transform = ""), 350);
        note.textContent = "👂 Receiver got the message! That is a network: sender → line → receiver.";
      }, 1500);
    }
    stage.querySelector("#cp-send").addEventListener("click", send);
    input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  },

  /* ============ 6. HUMAN ROBOT GAME ============ */
  robot(stage) {
    const N = 4;
    let walls, pos, goal, cmds, moves, lastMsg;

    const LAYOUTS = [
      { w: [[1, 1], [1, 2], [2, 1]] },
      { w: [[2, 0], [2, 1], [1, 3]] },
      { w: [[0, 2], [1, 2], [3, 1]] },
    ];
    let li = 0;

    function newRound() {
      walls = LAYOUTS[li % LAYOUTS.length].w;
      li++;
      pos = [0, 0]; goal = [3, 3];
      cmds = []; moves = 0; lastMsg = "";
      render();
    }

    function render() {
      stage.innerHTML = `
        <div class="robot-wrap">
          <div class="robot-grid">
            ${(() => {
              let h = "";
              for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
                const isWall = walls.some(w => w[0] === x && w[1] === y);
                const isGoal = goal[0] === x && goal[1] === y;
                const isPos = pos[0] === x && pos[1] === y;
                let inner = isWall ? "🧱" : isGoal ? "⭐" : "";
                let cls = "rcell" + (isWall ? " wall" : "") + (isGoal ? " goal" : "");
                h += `<div class="${cls}">${isPos ? "🤖" : inner}</div>`;
              }
              return h;
            })()}
          </div>
          <div class="rprog">
            <div class="lw-row" style="justify-content:flex-start">
              <button class="lw-btn" data-mv="0,-1">⬆</button>
              <button class="lw-btn" data-mv="-1,0">⬅</button>
              <button class="lw-btn" data-mv="1,0">➡</button>
              <button class="lw-btn" data-mv="0,1">⬇</button>
            </div>
            <div class="cell-cmds" id="rb-cmds">${cmds.map(c => `<span class="cmd-chip">${c}</span>`).join("")}</div>
            <button class="lw-btn white" id="rb-reset">🔄 New grid</button>
          </div>
        </div>
        <div class="lw-note" id="rb-note">${lastMsg || "Command the robot! ⬆⬇⬅➡ — it obeys exactly like a real robot."}</div>`;

      stage.querySelectorAll("[data-mv]").forEach(b => b.addEventListener("click", () => {
        const [dx, dy] = b.dataset.mv.split(",").map(Number);
        const nx = pos[0] + dx, ny = pos[1] + dy;
        cmds.push({ "0,-1": "⬆", "-1,0": "⬅", "1,0": "➡", "0,1": "⬇" }[b.dataset.mv]);
        moves++;
        if (nx < 0 || ny < 0 || nx >= N || ny >= N || walls.some(w => w[0] === nx && w[1] === ny)) {
          lastMsg = "💥 BUG! The robot bumped a wall. Debug your command list and try again!";
        } else {
          pos = [nx, ny];
          if (pos[0] === goal[0] && pos[1] === goal[1]) {
            lastMsg = `🎉 GOAL REACHED in ${moves} commands! The human programmed the robot step by step.`;
          } else {
            lastMsg = "🤖 Beep boop — command followed. Keep going!";
          }
        }
        render();
      }));
      const rb = stage.querySelector("#rb-reset");
      if (rb) rb.addEventListener("click", newRound);
    }

    newRound();
  },

  /* ============ 7. DEBUGGING DETECTIVE MAZE ============ */
  maze(stage) {
    const MAZES = [
      {
        walls: [[1, 0], [1, 3], [2, 3], [3, 2], [3, 3], [0, 0]],
        start: [0, 3], goal: [3, 0],
        path: ["↑", "↑", "→", "→", "↑", "→"],
        bug: 4, fix: "↑",
      },
      {
        walls: [[0, 1], [1, 1], [3, 0], [1, 2], [3, 1], [0, 2], [0, 3], [1, 3]],
        start: [0, 0], goal: [3, 3],
        path: ["→", "→", "↓", "↓", "↓", "→"],
        bug: 5, fix: "→",
      },
    ];
    let mi = 0, fixed = false;

    function build() {
      const m = MAZES[mi % MAZES.length];
      fixed = false;
      stage.innerHTML = `
        <div style="display:flex;gap:26px;flex-wrap:wrap;justify-content:center;align-items:flex-start;z-index:1">
          <div class="maze-grid" id="mz-grid"></div>
          <div style="display:flex;flex-direction:column;gap:12px;align-items:center">
            <div style="font-size:.8rem;font-weight:700;color:#8e2157">🔍 THE ARROW CODE (one arrow is a BUG!)</div>
            <div class="fix-chip" id="mz-code"></div>
            <div class="lw-note" id="mz-note" style="max-width:240px">Trace the code cell by cell. Tap the wrong arrow to fix it!</div>
            <button class="lw-btn white" id="mz-new">🔄 New maze</button>
          </div>
        </div>`;

      const grid = stage.querySelector("#mz-grid");
      let h = "";
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
        const isWall = m.walls.some(w => w[0] === x && w[1] === y);
        const isGoal = m.goal[0] === x && m.goal[1] === y;
        const isStart = m.start[0] === x && m.start[1] === y;
        h += `<div class="mz ${isWall ? "wall" : ""} ${isGoal ? "goal" : ""}" data-x="${x}" data-y="${y}">${isStart ? "🚦" : isWall ? "🧱" : isGoal ? "💎" : ""}</div>`;
      }
      grid.innerHTML = h;

      const code = stage.querySelector("#mz-code");
      code.innerHTML = m.path.map((a, i) => `<button class="cmd-chip" data-i="${i}" style="cursor:pointer">${a}</button>`).join("");

      code.querySelectorAll("[data-i]").forEach(chip => chip.addEventListener("click", () => {
        const i = +chip.dataset.i;
        if (i === m.bug && !fixed) {
          fixed = true;
          chip.textContent = m.fix;
          chip.classList.add("fixed");
          chip.style.background = "#2fae62";
          stage.querySelector("#mz-note").textContent = "🎉 BUG FIXED! Now watch the robot follow the corrected path to the treasure 💎";
          walkPath(m, grid);
        } else if (!fixed) {
          chip.style.background = "#e2506a";
          setTimeout(() => (chip.style.background = ""), 500);
          stage.querySelector("#mz-note").textContent = "🕵️ That arrow looks OK… follow the path cell by cell from 🚦!";
        }
      }));

      stage.querySelector("#mz-new").addEventListener("click", () => { mi++; build(); });
    }

    function walkPath(m, grid) {
      let x = m.start[0], y = m.start[1];
      const cells = [[x, y]];
      m.path.forEach(a => {
        if (a === "↑") y--; if (a === "↓") y++; if (a === "→") x++; if (a === "←") x--;
        cells.push([x, y]);
      });
      let i = 1;
      const step = () => {
        if (i >= cells.length) { grid.querySelector(`[data-x="${m.goal[0]}"][data-y="${m.goal[1]}"]`).textContent = "🎉"; return; }
        const [cx, cy] = cells[i];
        grid.querySelectorAll(".mz").forEach(c => { if (!c.classList.contains("wall")) c.textContent = c.classList.contains("goal") ? "💎" : ""; });
        const cell = grid.querySelector(`[data-x="${cx}"][data-y="${cy}"]`);
        if (cell) cell.textContent = "🤖";
        i++;
        setTimeout(step, 420);
      };
      setTimeout(step, 500);
    }

    build();
  },

  /* ============ 8. ANIMATION FLIP BOOK ============ */
  flipbook(stage) {
    const FRAMES = [
      { t: 0, r: 0 }, { t: -18, r: -6 }, { t: -36, r: -10 }, { t: -52, r: -4 },
      { t: -40, r: 6 }, { t: -22, r: 3 }, { t: 0, r: 0 }, { t: 0, r: 0 },
    ];
    let page = 0, playing = false, timer = null, speed = 160;

    stage.innerHTML = `
      <div class="flip-scene">
        <div class="flip-book">
          <div class="flip-page" id="fb-page">
            <div style="position:absolute;bottom:34px;font-size:1.4rem">🪷 🪷 🪷</div>
            <div class="animal" id="fb-animal">🐸</div>
          </div>
          <div style="position:absolute;bottom:6px;right:12px;font-size:.68rem;color:#8a6f7c" id="fb-count">page 1 / ${FRAMES.length}</div>
        </div>
        <div class="lw-row">
          <button class="lw-btn" id="fb-play">▶ PLAY ANIMATION</button>
          <button class="lw-btn white" id="fb-flip">👉 Flip one page</button>
        </div>
        <div class="lw-row" style="gap:6px">
          <span style="font-size:.78rem;color:#8a6f7c">Speed:</span>
          <button class="lw-btn white" data-sp="260" style="padding:7px 14px">🐢 Slow</button>
          <button class="lw-btn white" data-sp="160" style="padding:7px 14px">🚶 Normal</button>
          <button class="lw-btn white" data-sp="70" style="padding:7px 14px">⚡ Fast</button>
        </div>
      </div>`;

    const animal = stage.querySelector("#fb-animal");
    const pageEl = stage.querySelector("#fb-page");
    const count = stage.querySelector("#fb-count");
    const playBtn = stage.querySelector("#fb-play");

    function draw() {
      const f = FRAMES[page];
      animal.style.transform = `translateY(${f.t}px) rotate(${f.r}deg)`;
      count.textContent = `page ${page + 1} / ${FRAMES.length}`;
    }
    function flip() { page = (page + 1) % FRAMES.length; pageEl.classList.remove("left"); void pageEl.offsetWidth; pageEl.classList.add("left"); setTimeout(() => { pageEl.classList.remove("left"); draw(); }, 130); draw(); }

    playBtn.addEventListener("click", () => {
      if (playing) { clearInterval(timer); playing = false; playBtn.textContent = "▶ PLAY ANIMATION"; }
      else { playing = true; playBtn.textContent = "⏸ STOP"; timer = setInterval(flip, speed); }
    });
    stage.querySelector("#fb-flip").addEventListener("click", () => { if (!playing) flip(); });
    stage.querySelectorAll("[data-sp]").forEach(b => b.addEventListener("click", () => {
      speed = +b.dataset.sp;
      if (playing) { clearInterval(timer); timer = setInterval(flip, speed); }
    }));

    draw();
  },

  /* ============ 9. BAR GRAPH — LIVE VOTES ============ */
  bargraph(stage) {
    const FRUITS = [
      { n: "Apple", e: "🍎" }, { n: "Banana", e: "🍌" },
      { n: "Grapes", e: "🍇" }, { n: "Mango", e: "🥭" },
    ];
    const votes = FRUITS.map(() => Math.floor(Math.random() * 3) + 1);

    stage.innerHTML = `
      <div class="bgraph" id="bg-graph"></div>
      <div class="lw-row" id="bg-vote"></div>
      <div class="lw-row">
        <button class="lw-btn" id="bg-random">🎫 Visitor votes the popular one</button>
        <button class="lw-btn white" id="bg-reset">🔄 Reset votes</button>
      </div>
      <div class="vote-note" id="bg-note">Every sticky note is one vote — watch the bar grow!</div>`;

    const graph = stage.querySelector("#bg-graph");
    const voteRow = stage.querySelector("#bg-vote");
    const note = stage.querySelector("#bg-note");

    voteRow.innerHTML = FRUITS.map((f, i) => `<button class="lw-btn" data-v="${i}">${f.e} vote ${f.n}</button>`).join("");

    function render() {
      const max = Math.max(...votes, 5);
      graph.innerHTML = FRUITS.map((f, i) => `
        <div class="bcol">
          <div class="bbar" style="height:${Math.round((votes[i] / max) * 170)}px"><b>${votes[i]}</b></div>
          <span class="blabel">${f.e}<br/>${f.n}</span>
        </div>`).join("");
      const lead = votes.indexOf(Math.max(...votes));
      note.innerHTML = `🗳️ Total votes: <b style="color:#8e2157">${votes.reduce((a, b) => a + b, 0)}</b> — the tallest bar is <b style="color:#8e2157">${FRUITS[lead].e} ${FRUITS[lead].n}</b>!`;
    }

    voteRow.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
      votes[+b.dataset.v]++; render();
    }));
    stage.querySelector("#bg-random").addEventListener("click", () => {
      const weights = votes.map(v => v + 1);
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      for (let i = 0; i < votes.length; i++) { r -= weights[i]; if (r <= 0) { votes[i]++; break; } }
      render();
    });
    stage.querySelector("#bg-reset").addEventListener("click", () => { votes.forEach((_, i) => votes[i] = Math.floor(Math.random() * 3) + 1); render(); });

    render();
  },

  /* ============ 10. CARDBOARD SORTING MACHINE ============ */
  sorter(stage) {
    const SMALL = "⚪", LARGE = "🟠";
    let deck = [], sel = null, counts = { s: 0, l: 0 };
    function refill() {
      deck = shuffle(Array.from({ length: 8 }, (_, i) => (i % 2 ? LARGE : SMALL)));
      counts = { s: 0, l: 0 }; sel = null;
    }

    stage.innerHTML = `
      <div class="sort-machine">
        <div class="shape-deck" id="so-deck" style="flex-direction:column;max-width:120px"></div>
        <div class="machine">
          <div style="font-family:'Baloo 2';font-weight:700;font-size:.8rem;letter-spacing:.08em">SORTING MACHINE</div>
          <div class="slot" data-s="l">LARGE slot<small>big shapes</small></div>
          <div class="slot" data-s="s">SMALL slot<small>tiny shapes</small></div>
        </div>
        <div class="sort-out">
          <div class="out-bin">LARGE bin → <span class="cnt" id="so-lc">0</span><div class="pieces" id="so-lp"></div></div>
          <div class="out-bin">SMALL bin → <span class="cnt" id="so-sc">0</span><div class="pieces" id="so-sp"></div></div>
        </div>
      </div>
      <div class="lw-note" id="so-note">DROP → CHECK SIZE → SEND TO SLOT → COUNT — the sorting algorithm!</div>`;

    const deckEl = stage.querySelector("#so-deck");
    const note = stage.querySelector("#so-note");

    function render() {
      deckEl.innerHTML = deck.map((s, i) => `<div class="shape-chip" data-i="${i}" style="${sel === i ? "border-color:#8e2157;background:#f7e9f0" : ""};font-size:${s === LARGE ? "1.9rem" : "1.1rem"}">${s}</div>`).join("") || '<div style="font-size:.8rem;color:#8a6f7c">All sorted! 🎉</div>';
      stage.querySelector("#so-lc").textContent = counts.l;
      stage.querySelector("#so-sc").textContent = counts.s;
      stage.querySelector("#so-lp").innerHTML = Array(counts.l).fill(LARGE).map(e => `<span style="font-size:1.2rem">${e}</span>`).join("");
      stage.querySelector("#so-sp").innerHTML = Array(counts.s).fill(SMALL).map(e => `<span style="font-size:.9rem">${e}</span>`).join("");
      if (!deck.length) note.innerHTML = "🎉 THE ALGORITHM FINISHED! DROP → CHECK → SORT → COUNT done — <b style='color:#8e2157'>press Shuffle to run again</b>.";
    }

    deckEl.addEventListener("click", e => {
      const c = e.target.closest("[data-i]");
      if (!c) return;
      sel = +c.dataset.i;
      note.textContent = "Shape loaded ⬆ — now tap the correct slot on the machine!";
      render();
    });
    stage.querySelectorAll(".slot").forEach(slot => slot.addEventListener("click", () => {
      if (sel === null) { note.textContent = "👆 First tap a shape from the deck!"; return; }
      const shape = deck[sel];
      const isLarge = shape === LARGE;
      const correct = (slot.dataset.s === "l") === isLarge;
      if (correct) {
        if (isLarge) counts.l++; else counts.s++;
        deck.splice(sel, 1); sel = null;
        note.textContent = "✅ Sorted correctly! The CHECK SIZE step sent it down the right slot.";
      } else {
        note.textContent = "❌ Wrong slot! Read the algorithm: CHECK the size first.";
      }
      render();
    }));

    refill(); render();
    const shuffleBtn = document.createElement("button");
    shuffleBtn.className = "lw-btn white";
    shuffleBtn.textContent = "🔀 Shuffle new shapes";
    shuffleBtn.addEventListener("click", () => { refill(); render(); note.textContent = "New shapes loaded — sort them all!"; });
    stage.appendChild(shuffleBtn);
  },

  /* ============ 11. WI-FI & NETWORK SIGNAL ============ */
  wifi(stage) {
    let wifiOn = true, sent = 0;
    stage.innerHTML = `
      <div class="wifi-scene">
        <div class="wifi-devices">
          <div class="wifi-node" id="wf-laptop"><span class="icon">💻</span><span class="lbl">LAPTOP</span></div>
          <div class="wifi-node" id="wf-router"><span class="icon" id="wf-sym">📡</span><span class="lbl">ROUTER (Wi-Fi)</span></div>
          <div class="wifi-node" id="wf-printer"><span class="icon">🖨️</span><span class="lbl">PRINTER</span></div>
        </div>
        <div class="packet-lane"><div class="lane-line"></div><span class="packet" id="wf-packet">📁</span></div>
        <div class="lw-row">
          <button class="lw-btn" id="wf-send">📨 SEND FILE TO PRINT</button>
          <button class="lw-btn white" id="wf-toggle">📡 Wi-Fi: ON</button>
        </div>
        <div class="wifi-status" id="wf-status">The network is ready — devices are connected! 🟢</div>
      </div>`;

    const packet = stage.querySelector("#wf-packet");
    const status = stage.querySelector("#wf-status");
    const sym = stage.querySelector("#wf-sym");
    const sendBtn = stage.querySelector("#wf-send");
    const toggleBtn = stage.querySelector("#wf-toggle");
    const laptop = stage.querySelector("#wf-laptop");
    const router = stage.querySelector("#wf-router");
    const printer = stage.querySelector("#wf-printer");

    function glow(el) { el.classList.add("active"); setTimeout(() => el.classList.remove("active"), 900); }
    function fly(fromNote) {
      packet.style.left = "0%";
      packet.classList.remove("travel"); void packet.offsetWidth;
      packet.classList.add("travel");
    }

    sendBtn.addEventListener("click", () => {
      if (!wifiOn) {
        status.innerHTML = "📴 NO NETWORK! The laptop cannot reach the printer — you would have to carry the file on a USB stick 🥲 <b style='color:#8e2157'>This is why we have a network!</b>";
        return;
      }
      sendBtn.disabled = true;
      glow(laptop);
      status.textContent = "1️⃣ File leaves the laptop → travelling to the router…";
      fly();
      setTimeout(() => {
        glow(router);
        status.textContent = "2️⃣ Router received the file → sending to the printer…";
        fly();
        setTimeout(() => {
          glow(printer);
          status.textContent = "3️⃣ Printer is printing! 🖨️📄 — laptop → router → printer, all thanks to the network!";
          sent++;
          sendBtn.disabled = false;
        }, 1450);
      }, 1450);
    });

    toggleBtn.addEventListener("click", () => {
      wifiOn = !wifiOn;
      sym.textContent = wifiOn ? "📡" : "📴";
      toggleBtn.textContent = wifiOn ? "📡 Wi-Fi: ON" : "📴 Wi-Fi: OFF";
      status.textContent = wifiOn ? "The network is ready — devices are connected! 🟢" : "Network disconnected — devices are isolated! 🔴";
    });
  },

  /* ============ 12. TYPES OF COMPUTERS MUSEUM ============ */
  museum(stage) {
    const BOXES = [
      { id: "desktop", e: "🖥️", l: "Desktop" },
      { id: "laptop", e: "💻", l: "Laptop" },
      { id: "tablet", e: "📱", l: "Tablet" },
      { id: "phone", e: "☎️", l: "Phone" },
      { id: "atm", e: "🏧", l: "ATM" },
      { id: "traffic", e: "🚦", l: "Traffic-light computer" },
    ];
    const PLACES = [
      { id: "desktop", l: "Office desk 🏢" },
      { id: "laptop", l: "School bag 🎒" },
      { id: "tablet", l: "Home sofa 🛋️" },
      { id: "phone", l: "Pocket 👖" },
      { id: "atm", l: "Bank 🏦" },
      { id: "traffic", l: "Road junction 🛣️" },
    ];
    let sel = null, matched = 0;
    const shuffledPlaces = shuffle(PLACES.slice());

    stage.innerHTML = `
      <div style="font-size:.8rem;font-weight:700;color:#8e2157;z-index:1">🏛️ MUSEUM BOX — tap a computer, then tap where it is used</div>
      <div class="museum" id="mu-boxes"></div>
      <div class="place-pool" id="mu-places"></div>
      <div class="lw-note" id="mu-note">Matched: 0 / 6</div>`;

    const boxesEl = stage.querySelector("#mu-boxes");
    const placesEl = stage.querySelector("#mu-places");
    const note = stage.querySelector("#mu-note");

    function render() {
      boxesEl.innerHTML = BOXES.map(b => `
        <div class="mus-box ${matchedSet.has(b.id) ? "matched" : ""}" data-id="${b.id}" style="${sel === b.id && !matchedSet.has(b.id) ? "border-color:#8e2157;background:#f7e9f0" : ""}">
          <span class="mi">${b.e}</span><span class="ml">${b.l}</span>
        </div>`).join("");
      placesEl.innerHTML = shuffledPlaces.map(p => `
        <span class="place-tag ${matchedSet.has(p.id) ? "used" : ""}" data-id="${p.id}">${p.l}</span>`).join("");
      note.textContent = `Matched: ${matched} / 6`;
    }

    const matchedSet = new Set();

    boxesEl.addEventListener("click", e => {
      const b = e.target.closest("[data-id]");
      if (!b || matchedSet.has(b.dataset.id)) return;
      sel = b.dataset.id;
      note.textContent = `${b.querySelector(".ml").textContent} selected — now tap WHERE it is used!`;
      render();
    });
    placesEl.addEventListener("click", e => {
      const p = e.target.closest("[data-id]");
      if (!p || matchedSet.has(p.dataset.id)) return;
      if (sel === null) { note.textContent = "👆 First tap a computer in the museum box!"; return; }
      if (p.dataset.id === sel) {
        matchedSet.add(sel); matched++; sel = null;
        note.textContent = `✅ Correct! ${matched === 6 ? "🎉 ALL MATCHED — a computer is ANY input-process-output device, whatever its shape!" : "Great matching — keep going!"}`;
      } else {
        note.textContent = "❌ Not that place — think again about where this computer works!";
      }
      render();
    });

    render();
  },
};

/* ---------- tiny helpers ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
