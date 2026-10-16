# Printaggi — Matera Premium · Landing

## Stack
- HTML + CSS + JS puro, sin dependencias (solo Google Fonts)
- Tipografías: Archivo (títulos) + DM Sans (texto)
- Paleta: azul marino `#1E2638`, lavanda `#DFE4FC`, periwinkle `#A9BDF0`, lima `#DDF27A`

## Configurar (todo en `script.js`, objeto `CONFIG`)
- `whatsapp`: número con código de país, sin `+` (ej: `5491123456789`)
- `precio`: ej `"$ 45.000"`. Vacío → muestra "Consultá el precio por WhatsApp"
- `mpLink`: link de pago de Mercado Pago. Vacío → el botón no aparece
- `mensajes`: textos que llegan pre-cargados al WhatsApp

## Pendiente de confirmar (buscar `EDITAR` en index.html)
- Si el bolsillo para celular viene en el modelo que se vende
- Qué incluye la matera (FAQ)

## Correr local
```bash
python3 -m http.server 8080
```

## Deploy
- **Vercel / Netlify:** arrastrar la carpeta o conectar el repo. Sin build.
- **GitHub Pages:** subir el repo → Settings → Pages → `main` / root.
