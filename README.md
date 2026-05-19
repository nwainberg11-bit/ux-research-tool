# UX Research Coach

Herramienta que guía a un investigador a construir un **Brief de validación de soluciones** (test de usabilidad) siguiendo la secuencia canónica de la fuente: problema → alcance → objetivos → tipo de test → parámetros → criterio → preguntas → escenario → brief listo para exportar.

---

## Versiones

| Versión | Dónde vive | Estado |
|---|---|---|
| **v1 (legacy)** | rama `main` · `legacy/index.html` (monolito) | En producción |
| **v2 (modular)** | rama `v2` · `src/` modular | En desarrollo · listo para previsualizar |

Esta v2 es una reescritura desde cero, fiel a la fuente, con arquitectura modular (ningún archivo > ~500 líneas), validadores deterministas testeables, y export del brief a Markdown. Spec completo en [`docs/SPEC-V2.md`](docs/SPEC-V2.md).

---

## Probar v2 en tu máquina (5 comandos)

Requisitos: **Node 18+** y `git`.

```bash
git clone https://github.com/nwainberg11-bit/ux-research-tool.git
cd ux-research-tool
git checkout v2
npm install
npm run dev
```

Se abre en **http://localhost:5173** automáticamente. La app persiste el estado en `localStorage`, así que podés cerrar y volver y tus campos siguen ahí.

### Qué funciona sin configurar nada

- Los 8 pasos del brief + el cierre, navegables en el orden canónico.
- Detector de **7 sesgos cognitivos + 6 malas prácticas** en las preguntas (live, sin IA).
- Detector de **UI/jerga** en el escenario (live, sin IA).
- Badge de **nivel Bloom** en objetivos específicos (Conocimiento, Comprensión, …).
- Trazabilidad objetivo → parámetro → criterio → preguntas como entidad que viaja.
- Export del brief completo a `.md` (botones Copiar y Descargar).

### Qué requiere Gemini conectado

El botón "Evaluar con coach" en cada campo llama a Gemini 2.0 Flash a través de una Netlify Function. Sin configurar la key, devuelve el estado honesto _"coach no disponible"_ — no se cuelga ni inventa.

Para activarlo en local, ver sección [Coach AI en local](#coach-ai-en-local) abajo.

---

## Tests

```bash
npm test
```

41 tests Vitest sobre los validadores deterministas y el ensamblado del brief. Cubren:
- 7 sesgos cognitivos + 6 malas prácticas (incluye los 2 bugs corregidos de v1)
- 45 verbos de la taxonomía de Bloom
- 5 patrones de UI/jerga + longitud mínima del escenario
- 9 tests de assemble + export del brief

---

## Estructura (v2)

```
src/
├── source/                       constantes textuales del material de origen
│   ├── steps.js                  secuencia canónica de 8 pasos + cierre
│   ├── bloom.js                  6 niveles + 45 verbos
│   ├── parameters.js             6 parámetros + forma de criterio + 78% fijo
│   ├── test-types.js             tabla Moderado vs No Moderado
│   ├── stakeholders.js           6 preguntas para definir alcance
│   └── question-bank.js          banco de preguntas + buenas prácticas
├── coach/
│   ├── client.js                 transporte a la Netlify Function (timeout + honest-fail)
│   ├── prompts.js                builder system + user prompt por campo
│   └── validators/               puros, testeables, sin DOM
│       ├── bias-detector.js      paso 7
│       ├── ui-jargon-detector.js paso 8
│       └── bloom-verb.js         paso 3
├── state/
│   ├── store.js                  store + persistencia localStorage
│   └── chain.js                  trazabilidad por objetivo (pasos 5-7)
├── steps/
│   ├── step-1-problema/          schema + view por paso
│   ├── step-2-alcance/
│   ├── step-3-objetivos/
│   ├── step-4-tipo-test/
│   ├── step-5-parametros/
│   ├── step-6-criterio-exito/
│   ├── step-7-preguntas/
│   ├── step-8-escenario/
│   └── step-brief/               cierre con render del brief
├── brief/
│   ├── assemble.js               state → brief estructurado (pura)
│   └── export.js                 brief → Markdown (pura)
├── ui/
│   ├── shell.js                  layout, sidebar, navegación
│   ├── nav.js                    prev/next entre pasos
│   ├── fields.js                 renderer genérico + panel del coach
│   └── styles.css                sistema de diseño (portado de v1)
└── main.js
netlify/functions/coach.js        proxy a Gemini (reusado de v1, ya endurecido)
tests/                            Vitest sobre validadores + brief
```

---

## Coach AI en local

Para probar el coach con Gemini en local hace falta correr Vite **+** Netlify Functions juntas. Pasos:

1. Conseguir una key gratis en [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Crear `.env` en la raíz con `GEMINI_API_KEY=tu_key`.
3. Instalar la CLI: `npm install -g netlify-cli`.
4. Correr `netlify dev` en vez de `npm run dev`. Te abre en otro puerto (8888) y el endpoint `/.netlify/functions/coach` queda funcional.

---

## Deploy a Netlify (cuando esté listo para producción)

1. Conseguir API key de Gemini → [aistudio.google.com](https://aistudio.google.com)
2. Conectar el repo a Netlify. La rama de producción se configura en _Site configuration → Build & deploy → Branches_.
3. En _Site configuration → Environment variables_, agregar:
   - `GEMINI_API_KEY` con la key del paso 1
   - `ALLOWED_ORIGINS` con la URL del site (separar por coma si hay varias)
4. El `netlify.toml` de la rama `v2` ya tiene `command = npm run build` y `publish = dist`.

Para promover v2 a producción: merge `v2 → main`.

---

## Límites del plan gratuito

- **Gemini 2.0 Flash**: 15 req/min, 1.500 req/día. Suficiente para uso de un equipo chico.
- **Netlify free**: 125k invocations/mes, 100GB bandwidth, 300 build minutes. Suficiente para nicho.

La función `coach.js` tiene rate-limit propio de 20 req/min por IP para no explotar la key.
