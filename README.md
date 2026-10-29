# Printaggi — Matera Premium · Landing

## Stack
- HTML + CSS + JS puro, sin dependencias (solo Google Fonts)
- Estética técnica oscura; el acento cambia por edición (Clásica: lavanda/lima · Boca: azul/oro)
- Tipografías: Bricolage Grotesque (títulos y botones), Instrument Serif itálica (palabras de acompañamiento) y DM Sans (texto)
- Pensada primero para celular: carruseles deslizables, menú desplegable y barra de compra fija

## Configurar (todo en `script.js`, objeto `CONFIG`)
- `whatsapp`: número con código de país, sin `+` (ej: `5491123456789`)
- `precio`: ej `"$ 45.000"`. Vacío → muestra "Consultá el precio por WhatsApp"
- `mpLink`: link de pago de Mercado Pago. Vacío → el botón no aparece
- `instagram`: usuario sin @
- `ediciones` / `mensajes`: nombre de cada edición y el texto que llega al WhatsApp (clasica, boca, equipo, empresas)
- Al cambiar CSS/JS, subí el `?v=` en index.html para que los celulares no usen la versión vieja

## Pendiente de confirmar (buscar `EDITAR` en index.html)
- Si termo y mate van incluidos (FAQ «¿Qué incluye?»)

## Correr local
```bash
python3 -m http.server 8080
```

## Deploy
- **Vercel / Netlify:** arrastrar la carpeta o conectar el repo. Sin build.
- **GitHub Pages:** subir el repo → Settings → Pages → `main` / root.
