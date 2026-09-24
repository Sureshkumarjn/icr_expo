/* ============================================================
   ICT EXPO — main app: rendering, routing, menu, detail view
   Clean URLs:  /expo-site/project/g1-p1   (Apache rewrite)
   Fallback:    index.html#/project/g1-p1  (file:// or no rewrite)
   ============================================================ */

/* ---------- routing mode ----------
   On http(s) we use real paths (/project/g1-p1).
   On file:// we fall back to hash links.                 */
const CLEAN_URLS = location.protocol.startsWith("http");

/* base path of the site folder, e.g. "/itqanuae/expo-site" */
const BASE = (() => {
  const m = location.pathname.match(/^(.*\/expo-site)/);
  if (m) return m[1];
  const p = location.pathname.replace(/\/[^/]*$/, "");
  return p.endsWith("/") ? p.slice(0, -1) : p;
})();

/* build an href for a project or home */
function hrefFor(id) {
  if (!CLEAN_URLS) return id ? `#/project/${id}` : "#/home";
  return id ? `${BASE}/project/${id}` : `${BASE}/`;
}

/* ---------- HOME: build project cards ---------- */
function buildCards() {
  const g1 = document.getElementById("grid-g1");
  const g2 = document.getElementById("grid-g2");

  PROJECTS.forEach((p) => {
    const el = document.createElement("a");
    el.className = "p-card";
    el.href = hrefFor(p.id);
    el.dataset.id = p.id;
    el.innerHTML = `
      <div class="p-thumb">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <span class="p-no">#${p.no}</span>
        <span class="p-grade">${p.grade}</span>
      </div>
      <div class="p-body">
        <span class="p-mod">📘 ${p.module.split("·")[1] ? p.module.split("·")[1].trim() : p.module}</span>
        <h4 class="p-title">${p.title}</h4>
        <p class="p-desc">${p.description}</p>
        <span class="p-link">View explanation &amp; live work <span class="arrow">→</span></span>
      </div>`;
    (p.grade === "Grade 1" ? g1 : g2).appendChild(el);
  });
}

/* fix static hrefs in the sidebar / brand for the current mode */
function fixLinks() {
  document.querySelectorAll('a[href^="#/project/"]').forEach((a) => {
    a.href = hrefFor(a.getAttribute("href").split("/").pop());
  });
  document.querySelectorAll('a[href="#/home"]').forEach((a) => {
    a.href = hrefFor(null);
  });
}

/* ---------- MENU ---------- */
const menuEl = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const menuToggle = document.getElementById("menuToggle");

function closeMenu() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
}
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  backdrop.classList.toggle("show");
});
backdrop.addEventListener("click", closeMenu);

/* ---------- ROUTER ---------- */
const viewHome = document.getElementById("view-home");
const viewProject = document.getElementById("view-project");
const topChip = document.getElementById("topGradeChip");

function parseRoute() {
  if (CLEAN_URLS) {
    /* path after BASE, e.g. "/project/g1-p1" or "/g1-p1" */
    let path = location.pathname;
    if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length);
    path = path.replace(/^\/+|\/+$/g, "");
    const seg = path.split("/");
    if (seg[0] === "project" && seg[1]) return { view: "project", id: seg[1] };
    if (/^(g[12]-p[1-6])$/.test(seg[0])) return { view: "project", id: seg[0] };
    return { view: "home" };
  }
  /* hash fallback */
  const h = location.hash.replace(/^#\/?/, "");
  const [route, param] = h.split("/");
  if (route === "project" && param) return { view: "project", id: param };
  return { view: "home" };
}

function render() {
  const { view, id } = parseRoute();
  const project = id ? PROJECTS.find((p) => p.id === id) : null;

  /* menu active states */
  menuEl.querySelectorAll(".menu-item").forEach((mi) => {
    const on = view === "home" ? mi.dataset.view === "home" : mi.dataset.id === id;
    mi.classList.toggle("active", !!on);
  });

  if (view === "project" && project) {
    viewHome.hidden = true;
    viewProject.hidden = false;
    renderProject(project);
    topChip.hidden = false;
    topChip.textContent = project.grade.toUpperCase() + " · PROJECT " + project.no;
  } else {
    viewProject.hidden = true;
    viewHome.hidden = false;
    topChip.hidden = true;
  }

  closeMenu();
  window.scrollTo({ top: 0 });
}

/* ---------- navigation helper ---------- */
function goTo(id) {
  if (CLEAN_URLS) history.pushState({}, "", hrefFor(id));
  else location.hash = id ? `#/project/${id}` : "#/home";
  render();
}

/* ---------- PROJECT DETAIL ---------- */
let currentIndex = 0;

function renderProject(p) {
  currentIndex = PROJECTS.findIndex((x) => x.id === p.id);

  /* header */
  document.getElementById("detailHead").innerHTML = `
    <div class="detail-crumb">
      <span class="crumb-no">PROJECT ${String(p.no).padStart(2, "0")} / ${p.grade.toUpperCase()}</span>
      <span>📘 ${p.module}</span>
    </div>
    <h2 class="detail-title">${p.title}</h2>`;

  /* steps */
  document.getElementById("detailSteps").innerHTML = p.steps.map((s) => `<li>${s}</li>`).join("");

  /* image + mini info — <base> already points at the site root */
  const img = document.getElementById("detailImg");
  img.src = p.image;
  img.alt = p.title;

  /* live work */
  const stage = document.getElementById("liveStage");
  stage.innerHTML = "";
  const builder = LIVE_DEMOS[p.live];
  if (builder) builder(stage, p);
  document.getElementById("liveTitle").textContent = p.title;
  document.getElementById("liveDesc").textContent = "The hand-made model, made clickable — try it yourself exactly like at the expo stall.";
  document.getElementById("liveHint").innerHTML = LIVE_HINTS[p.live] || "";

  /* prev / next */
  const prev = PROJECTS[currentIndex - 1];
  const next = PROJECTS[currentIndex + 1];
  document.getElementById("prevBtn").innerHTML = prev ? `<small>← Previous project</small><b>${prev.title}</b>` : "";
  document.getElementById("prevBtn").disabled = !prev;
  document.getElementById("nextBtn").innerHTML = next ? `<small>Next project →</small><b>${next.title}</b>` : "";
  document.getElementById("nextBtn").disabled = !next;
}

/* prev/next navigation */
document.getElementById("prevBtn").addEventListener("click", () => {
  const p = PROJECTS[currentIndex - 1];
  if (p) goTo(p.id);
});
document.getElementById("nextBtn").addEventListener("click", () => {
  const p = PROJECTS[currentIndex + 1];
  if (p) goTo(p.id);
});

/* card + menu link clicks: keep it a SPA (no page reload on http) */
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const link = a.getAttribute("href") || "";

  /* internal project links */
  if (link.includes("/project/") || /^(g[12]-p[1-6])$/.test(link.replace(/^.*\//, ""))) {
    e.preventDefault();
    goTo(link.replace(/^.*\//, ""));
    return;
  }
  if (link === hrefFor(null) || link === `${BASE}/` || link === "#/home") {
    e.preventDefault();
    goTo(null);
  }
});

/* hero CTA scroll links work on home view: intercept #grade1/#grade2 */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#grade1"], a[href="#grade2"]');
  if (!a) return;
  e.preventDefault();
  goTo(null);
  const target = document.querySelector(a.getAttribute("href"));
  if (target) target.scrollIntoView({ behavior: "smooth" });
});

/* ---------- INIT ---------- */
buildCards();
fixLinks();
window.addEventListener("hashchange", render);
window.addEventListener("popstate", render);
render();
