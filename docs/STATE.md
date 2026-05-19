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

## En progreso
Ninguno. F0 cerrado.

## Siguiente
- **F1 — Fuente como datos**: constantes (Bloom 6 niveles, 6 parámetros + forma de criterio, tabla Moderado/No Moderado, 6 preguntas stakeholders, banco de preguntas textual) en `src/source/` + validadores deterministas §5 (sesgos paso 7, UI/jerga paso 8) portados de v1 con tests Vitest.

## Notas
- Stack: Vanilla JS + ES modules + Vite → bundle estático. Deploy idéntico a v1 (static + 1 Netlify function), se cablea en F6.
- `netlify.toml publish="."` aún apunta a v1; se cambia a `dist` en F6 (no antes, para no romper deploy actual de v1).
