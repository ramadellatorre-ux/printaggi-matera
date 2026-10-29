/* ============ CONFIG — EDITAR ACÁ ============ */
const CONFIG = {
  whatsapp: "5491124030147",   // código de país + área + número, sin "+" ni espacios
  instagram: "printaggi",      // usuario de Instagram, sin @
  precio: "",                  // ej: "$ 45.000" — vacío muestra "Consultá el precio"
  mpLink: "",                  // link de pago de Mercado Pago — vacío oculta el botón
  ediciones: {
    clasica: { nombre: "Edición Clásica", corto: "Clásica" },
    boca: { nombre: "Edición Boca", corto: "Boca · La Mitad +1" }
  },
  mensajes: {
    clasica: "Hola Printaggi! 🧉 Quiero la Matera Premium edición Clásica. ¿Me pasás precio, formas de pago y envío?",
    boca: "Hola Printaggi! 💙💛 Quiero la Matera Premium edición Boca · La Mitad +1. ¿Me pasás precio, formas de pago y envío?",
    equipo: "Hola Printaggi! Quiero la Matera Premium con los colores de mi equipo: ____. ¿Se puede?",
    empresas: "Hola Printaggi! Quiero cotizar Materas Premium personalizadas con el logo de mi empresa. Serían aprox. ___ unidades."
  }
};

const root = document.documentElement;
const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = key => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensajes[key])}`;

/* ============ Links fijos: Instagram, precio, Mercado Pago ============ */
document.querySelectorAll("[data-ig]").forEach(a => { a.href = `https://instagram.com/${CONFIG.instagram}`; });
document.querySelectorAll("[data-price]").forEach(el => { el.textContent = CONFIG.precio || "Consultá el precio por WhatsApp"; });
document.querySelectorAll("[data-price-short]").forEach(el => { el.textContent = CONFIG.precio || "Consultá precio y envío"; });
if (CONFIG.mpLink) document.querySelectorAll("[data-mp]").forEach(a => { a.href = CONFIG.mpLink; a.hidden = false; });
document.querySelectorAll("[data-wa]").forEach(a => { a.target = "_blank"; a.rel = "noopener"; });

/* ============ Edición (Clásica / Boca) ============ */
let edition = "clasica";
try { edition = localStorage.getItem("printaggi-ed") || "clasica"; } catch (e) {}
if (!CONFIG.ediciones[edition]) edition = "clasica";

function swapImages(frame, ed, animate) {
  // si el usuario cambia rápido, cortamos la transición anterior
  frame.querySelectorAll(".ed-img.is-entering").forEach(n => n.classList.remove("is-entering"));
  const next = frame.querySelector(`.ed-img[data-ed="${ed}"]`);
  const cur = frame.querySelector(".ed-img.is-active");
  if (!next || next === cur) return;
  if (!animate || reduce) {
    cur && cur.classList.remove("is-active");
    next.classList.add("is-active");
    return;
  }
  next.classList.add("is-entering");
  const scan = frame.querySelector(".scan");
  if (scan) { scan.classList.remove("is-run"); void scan.offsetWidth; scan.classList.add("is-run"); }
  next.addEventListener("animationend", () => {
    next.classList.remove("is-entering");
    next.classList.add("is-active");
    cur && cur.classList.remove("is-active");
  }, { once: true });
}

function setEdition(ed, animate = true) {
  edition = ed;
  root.dataset.edition = ed;
  try { localStorage.setItem("printaggi-ed", ed); } catch (e) {}
  const info = CONFIG.ediciones[ed];
  document.querySelectorAll("[data-set-ed]").forEach(b => b.setAttribute("aria-checked", b.dataset.setEd === ed));
  document.querySelectorAll("[data-ed-name]").forEach(el => { el.textContent = info.nombre; });
  document.querySelectorAll("[data-ed-short]").forEach(el => { el.textContent = info.corto; });
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = waLink(a.dataset.wa === "ed" ? ed : a.dataset.wa);
  });
  document.querySelectorAll(".hero-frame, .anat-frame").forEach(f => swapImages(f, ed, animate));
  placeHotspots();
}
document.querySelectorAll("[data-set-ed]").forEach(b => b.addEventListener("click", () => setEdition(b.dataset.setEd)));

/* ============ Palabras grandes: llenan el ancho del título ============ */
function fitTitles() {
  document.querySelectorAll(".fit").forEach(f => {
    const word = f.firstElementChild;
    const cs = getComputedStyle(f);
    const fill = parseFloat(cs.getPropertyValue("--fill")) || 0.98;
    const max = parseFloat(cs.getPropertyValue("--max")) || 180;
    const target = f.closest(".title").clientWidth * fill;
    // la fuente cambia de forma según el tamaño (tamaño óptico), así que medimos y corregimos 3 veces
    let size = 100;
    for (let k = 0; k < 3; k++) {
      f.style.fontSize = `${size}px`;
      size = Math.min(size * target / word.offsetWidth, max);
    }
    f.style.fontSize = `${size.toFixed(1)}px`;
  });
}
fitTitles();
document.fonts.ready.then(fitTitles);
let fitTimer;
addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitTitles, 120); });

document.querySelectorAll(".title").forEach(t => t.querySelectorAll(".ln").forEach((ln, k) => ln.style.setProperty("--k", k)));

/* ============ Reveal on scroll ============ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  });
}, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => {
  const sib = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
  el.style.setProperty("--d", `${sib.indexOf(el) * 0.07}s`);
  io.observe(el);
});
document.querySelectorAll(".title").forEach(el => io.observe(el));

/* ============ Menú (celu) ============ */
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
function toggleMenu(open) {
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("menu-open", open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
  } else {
    menu.classList.remove("is-open");
    setTimeout(() => { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 350);
  }
}
menuBtn.addEventListener("click", () => toggleMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape" && !menu.hidden) toggleMenu(false); });

/* ============ Anatomía: puntos ↔ lista ============ */
const hs = [...document.querySelectorAll(".hs")];
const partBtns = [...document.querySelectorAll(".parts button")];
function placeHotspots() {
  hs.forEach(h => {
    const [x, y] = (h.dataset[edition] || "50,50").split(",");
    h.style.setProperty("--x", `${x}%`);
    h.style.setProperty("--y", `${y}%`);
  });
}
function showPart(i) {
  hs.forEach(h => h.classList.toggle("is-on", +h.dataset.i === i));
  partBtns.forEach(b => b.classList.toggle("is-on", +b.dataset.i === i));
}
let autoI = 0, autoTimer = null, autoDone = false;
const stopAuto = () => { clearInterval(autoTimer); autoDone = true; };
[...hs, ...partBtns].forEach(el => {
  el.addEventListener("click", () => { stopAuto(); showPart(+el.dataset.i); });
  if (canHover) el.addEventListener("mouseenter", () => { stopAuto(); showPart(+el.dataset.i); });
});
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !autoTimer && !autoDone) {
    showPart(0);
    autoTimer = setInterval(() => { autoI = (autoI + 1) % hs.length; showPart(autoI); }, 2400);
  }
}, { threshold: 0.4 }).observe(document.getElementById("anatFrame"));

/* ============ Galerías de las ediciones ============ */
document.querySelectorAll(".gallery").forEach(g => {
  const main = g.querySelector(".g-main img");
  g.querySelectorAll(".thumbs button").forEach(b => b.addEventListener("click", () => {
    g.querySelectorAll(".thumbs button").forEach(o => o.classList.toggle("is-on", o === b));
    main.classList.add("is-fading");
    setTimeout(() => { main.src = b.dataset.src; main.classList.remove("is-fading"); }, 200);
  }));
});

/* ============ Carruseles: puntitos ============ */
function syncDots(track, dots) {
  if (!track || !dots) return;
  const spans = dots.querySelectorAll("span");
  track.addEventListener("scroll", () => {
    const step = track.firstElementChild.getBoundingClientRect().width + 12;
    const i = Math.min(Math.round(track.scrollLeft / step), spans.length - 1);
    spans.forEach((d, k) => d.classList.toggle("is-active", k === i));
  }, { passive: true });
}
syncDots(document.getElementById("eds"), document.getElementById("edsDots"));
syncDots(document.getElementById("cards"), document.getElementById("cardsDots"));

/* ============ Scroll: nav, barra de compra, tarjetas apiladas ============ */
const nav = document.getElementById("nav");
const mbar = document.getElementById("mbar");
const waFloat = document.querySelector(".wa-float");
const heroCtas = document.querySelector(".hero-ctas");
const footer = document.querySelector(".footer");
const scards = [...document.querySelectorAll(".scard")];
let lastY = 0, ticking = false;

function onScroll() {
  const y = scrollY;
  nav.classList.toggle("is-scrolled", y > 20);
  nav.classList.toggle("is-hidden", y > 400 && y > lastY + 2 && menu.hidden);
  lastY = y;

  const pastHero = heroCtas.getBoundingClientRect().bottom < 0;
  const atFooter = footer.getBoundingClientRect().top < innerHeight - 40;
  mbar.classList.toggle("is-on", pastHero && !atFooter);
  waFloat.classList.toggle("is-on", pastHero);

  if (!reduce) {
    scards.forEach((card, i) => {
      const next = scards[i + 1];
      if (!next) return;
      const r = card.getBoundingClientRect(), nr = next.getBoundingClientRect();
      const p = Math.min(Math.max((r.bottom - nr.top) / r.height, 0), 1);
      card.style.setProperty("--sc", (1 - p * 0.07).toFixed(3));
      card.style.setProperty("--dim", (p * 0.5).toFixed(3));
    });
  }
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

/* ============ Tilt 3D (solo mouse) ============ */
if (canHover && !reduce) {
  document.querySelectorAll("[data-tilt]").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
      el.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); });
  });
}

/* ============ FAQ: uno abierto a la vez ============ */
const faqs = document.querySelectorAll(".faq-list details");
faqs.forEach(d => d.addEventListener("toggle", () => { if (d.open) faqs.forEach(o => o !== d && (o.open = false)); }));

/* ============ Arranque ============ */
setEdition(edition, false);
onScroll();
