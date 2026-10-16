/* ============ CONFIG — EDITAR ACÁ ============ */
const CONFIG = {
  whatsapp: "5491124030147",  // código de país + área + número, sin "+" ni espacios
  precio: "",                  // ej: "$ 45.000" — vacío muestra "Consultá el precio"
  mpLink: "",                  // link de pago de Mercado Pago — vacío oculta el botón
  mensajes: {
    general: "Hola Printaggi! 🧉 Quiero la Matera Premium. ¿Me pasás precio, formas de pago y envío?",
    empresas: "Hola Printaggi! Quiero cotizar Materas Premium personalizadas con el logo de mi empresa. Serían aprox. ___ unidades."
  }
};

/* ============ WhatsApp, precio y Mercado Pago ============ */
document.querySelectorAll("[data-wa]").forEach(a => {
  const msg = CONFIG.mensajes[a.dataset.wa] || CONFIG.mensajes.general;
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll("[data-price]").forEach(el => {
  el.textContent = CONFIG.precio || "Consultá el precio por WhatsApp";
});
document.querySelectorAll("[data-price-short]").forEach(el => {
  el.textContent = CONFIG.precio || "Consultá precio y envío";
});
if (CONFIG.mpLink) {
  document.querySelectorAll("[data-mp]").forEach(a => { a.href = CONFIG.mpLink; a.hidden = false; });
}

const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============ Palabras grandes: llenan el ancho exacto del título ============
   --fill (opcional, en el HTML) = qué porcentaje del ancho ocupa (1 = todo) */
function fitTitles() {
  document.querySelectorAll(".fit").forEach(f => {
    const word = f.firstElementChild;
    const cs = getComputedStyle(f);
    const fill = parseFloat(cs.getPropertyValue("--fill")) || 0.98; // 2% de aire para el contorno
    const max = parseFloat(cs.getPropertyValue("--max")) || 176;
    f.style.fontSize = "100px";
    const size = 100 * f.closest(".title").clientWidth * fill / word.offsetWidth;
    f.style.fontSize = `${Math.min(size, max).toFixed(1)}px`;
  });
}
fitTitles();
document.fonts.ready.then(fitTitles);
let fitTimer;
addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitTitles, 120); });

/* ============ Índice de cada línea de los títulos (para escalonar) ============ */
document.querySelectorAll(".title").forEach(t => {
  t.querySelectorAll(".ln").forEach((ln, k) => ln.style.setProperty("--k", k));
});

/* ============ Reveal on scroll ============ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  });
}, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
  el.style.setProperty("--d", `${siblings.indexOf(el) * 0.08}s`);
  io.observe(el);
});
document.querySelectorAll(".title").forEach(t => io.observe(t));

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
  nav.classList.toggle("is-hidden", y > 400 && y > lastY + 2);
  lastY = y;

  // La barra aparece cuando los botones del hero salen de pantalla y se va al llegar al footer
  const pastHero = heroCtas.getBoundingClientRect().bottom < 0;
  const atFooter = footer.getBoundingClientRect().top < innerHeight - 40;
  mbar.classList.toggle("is-on", pastHero && !atFooter);
  waFloat.classList.toggle("is-on", pastHero);

  // Cada tarjeta se achica y oscurece a medida que la siguiente la tapa
  if (!reduce) {
    scards.forEach((card, i) => {
      const next = scards[i + 1];
      if (!next) return;
      const r = card.getBoundingClientRect();
      const nr = next.getBoundingClientRect();
      const p = Math.min(Math.max((r.bottom - nr.top) / r.height, 0), 1);
      card.style.setProperty("--sc", (1 - p * 0.08).toFixed(3));
      card.style.setProperty("--dim", (p * 0.35).toFixed(3));
    });
  }
  ticking = false;
}
addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ============ Tilt 3D (solo mouse) ============ */
function tilt(el, strength) {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * strength}deg`);
    el.style.setProperty("--rx", `${-y * strength}deg`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  });
}
if (canHover && !reduce) {
  document.querySelectorAll("[data-tilt]").forEach(el => tilt(el, 10));
  const arch = document.getElementById("heroArch");
  arch.addEventListener("animationend", () => tilt(arch, 8), { once: true });
}

/* ============ Hotspots de la anatomía ============ */
const tip = document.querySelector(".tip");
const tipText = tip.querySelector(".tip-text");
const spots = [...document.querySelectorAll(".hotspot")];
function showSpot(s) {
  spots.forEach(o => o.classList.toggle("is-on", o === s));
  tip.classList.add("is-swapping");
  setTimeout(() => { tipText.innerHTML = s.dataset.tip; tip.classList.remove("is-swapping"); }, 200);
}
spots.forEach(s => {
  s.addEventListener("click", () => { stopAuto(); showSpot(s); });
  if (canHover) s.addEventListener("mouseenter", () => { stopAuto(); showSpot(s); });
});
// Recorrido automático hasta que el usuario toque un punto
let auto = 0, autoTimer = null, autoDone = false;
function stopAuto() { clearInterval(autoTimer); autoDone = true; }
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !autoTimer && !autoDone) {
    showSpot(spots[0]);
    autoTimer = setInterval(() => { auto = (auto + 1) % spots.length; showSpot(spots[auto]); }, 2600);
  }
}, { threshold: 0.5 }).observe(document.querySelector(".anatomy-visual"));

/* ============ Carrusel de lugares: puntitos ============ */
const cards = document.getElementById("cards");
const cardDots = document.querySelectorAll(".cards-dots span");
cards.addEventListener("scroll", () => {
  const w = cards.firstElementChild.getBoundingClientRect().width;
  const i = Math.round(cards.scrollLeft / w);
  cardDots.forEach((d, k) => d.classList.toggle("is-active", k === i));
}, { passive: true });

/* ============ Yerbero: abrir/cerrar al tocar ============ */
const yerbero = document.querySelector(".material-yerbero");
const hint = yerbero.querySelector(".hint");
function toggleYerbero() {
  const open = yerbero.classList.toggle("is-open");
  hint.textContent = open ? "Tocá para cerrar" : "Tocá para abrir";
}
yerbero.addEventListener("click", toggleYerbero);
yerbero.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleYerbero(); }
});

/* ============ FAQ: uno abierto a la vez ============ */
const faqs = document.querySelectorAll(".faq-list details");
faqs.forEach(d => d.addEventListener("toggle", () => {
  if (d.open) faqs.forEach(o => o !== d && (o.open = false));
}));
