# STATE — UX Research Coach v2

> Última actualización: 2026-05-19

## Dónde estamos
Reescritura v2 en curso. Spec aprobado (`docs/SPEC-V2.md`). Rama `v2` (v1 monolito → `legacy/index.html`, `main` intacto).

## Decisiones gate confirmadas (2026-05-19)
1. v2 en **rama git** separada (no carpeta /v2).
2. Banco de preguntas por parámetro: **textual de la fuente**.
3. **Sin fase post-test** — definitivo. Si se quiere vender, producto separado.

## Completado
- **F0 — Andamiaje** ✅ (commit 44866f8). Estructura modular SPEC-V2 §7, build Vite verde, store + persistencia localStorage, shell con sidebar 3 fases + cierre, 8 pasos + brief navegables en orden canónico. coach/client.js con timeout 20s + estado honesto. Orden canónico verificado por assert (build + datos). Click-through DOM completo queda para F5 (verificación E2E) — el browser MCP estaba tomado por otra sesión.
- **F1 — Fuente como datos** ✅. Constantes de la fuente en `src/source/`: Bloom 6 niveles (45 verbos), 6 parámetros + forma de criterio + 78% fijo, tabla Moderado/No Moderado, 6 preguntas stakeholders, buenas prácticas de preguntas. Validadores deterministas §5 portados de v1 con bugs corregidos: `bias-detector` (7 sesgos + 6 malas prácticas), `ui-jargon-detector` (escenario), `bloom-verb` (objetivos específicos). Vitest: **32/32 verdes**. Build verde.

## En progreso
Ninguno. F1 cerrado.

## Siguiente
- **F2 — Pasos 1–4** (Fase 1 + 2 del flujo): cablear los campos de cada paso a sus schemas reales (SPEC-V2 §3), conectar coach por campo (contrato §4), agregar la tabla M/NoM siempre visible en paso 4, mostrar las 6 preguntas de stakeholders como guía previa al paso 2.
- **Pendiente externo**: cargar texto literal de "preguntas que funcionan" por parámetro en `question-bank.js` (necesita el PDF Módulo 3 — hoy queda con `examples: []` para no inventar).

## Notas
- Stack: Vanilla JS + ES modules + Vite → bundle estático. Deploy idéntico a v1 (static + 1 Netlify function), se cablea en F6.
- `netlify.toml publish="."` aún apunta a v1; se cambia a `dist` en F6 (no antes, para no romper deploy actual de v1).
