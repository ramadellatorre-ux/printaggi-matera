/* ============ CONFIG — EDITAR ACÁ ============ */
const CONFIG = {
  whatsapp: "5490000000000",   // código de país + área + número, sin "+" ni espacios
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
if (CONFIG.mpLink) {
  document.querySelectorAll("[data-mp]").forEach(a => { a.href = CONFIG.mpLink; a.hidden = false; });
}

/* ============ Nav: sombra + se esconde al bajar ============ */
const nav = document.getElementById("nav");
const waFloat = document.querySelector(".wa-float");
let lastY = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  nav.classList.toggle("is-scrolled", y > 20);
  nav.classList.toggle("is-hidden", y > 400 && y > lastY);
  waFloat.classList.toggle("is-on", y > 500);
  lastY = y;
}, { passive: true });

/* ============ Reveal on scroll (con escalonado) ============ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
  el.style.setProperty("--d", `${siblings.indexOf(el) * 0.08}s`);
  io.observe(el);
});

/* ============ Tilt 3D (solo mouse) ============ */
const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  // el arco termina su animación de entrada antes de habilitar el tilt
  arch.addEventListener("animationend", () => tilt(arch, 8), { once: true });
}

/* ============ Hotspots de la anatomía ============ */
const tip = document.querySelector(".tip");
const spots = document.querySelectorAll(".hotspot");
function showSpot(s) {
  spots.forEach(o => o.classList.toggle("is-on", o === s));
  tip.textContent = s.dataset.tip;
  tip.classList.add("is-on");
}
spots.forEach(s => {
  s.addEventListener("click", () => showSpot(s));
  if (canHover) s.addEventListener("mouseenter", () => showSpot(s));
});
// Recorrido automático hasta que el usuario interactúe
let auto = 0, autoTimer;
const anatomy = document.querySelector(".anatomy-visual");
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !autoTimer) {
    showSpot(spots[0]);
    autoTimer = setInterval(() => { auto = (auto + 1) % spots.length; showSpot(spots[auto]); }, 2600);
  }
}, { threshold: 0.5 }).observe(anatomy);
anatomy.addEventListener("pointerdown", () => clearInterval(autoTimer));
anatomy.addEventListener("mouseenter", () => clearInterval(autoTimer));

/* ============ Scroll story de detalles ============ */
const stageImgs = document.querySelectorAll(".stage img");
const stageDots = document.querySelectorAll(".stage-dots span");
const steps = document.querySelectorAll(".step");
const stepIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const i = +e.target.dataset.step;
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    stageImgs.forEach((img, k) => img.classList.toggle("is-active", k === i));
    stageDots.forEach((d, k) => d.classList.toggle("is-active", k === i));
  });
}, { rootMargin: "-45% 0px -45% 0px" });
steps.forEach(s => stepIO.observe(s));

/* ============ Yerbero: abrir/cerrar al tocar ============ */
const yerbero = document.querySelector(".material-yerbero");
yerbero.addEventListener("click", () => yerbero.classList.toggle("is-open"));

/* ============ FAQ: uno abierto a la vez ============ */
const faqs = document.querySelectorAll(".faq-list details");
faqs.forEach(d => d.addEventListener("toggle", () => {
  if (d.open) faqs.forEach(o => o !== d && (o.open = false));
}));
