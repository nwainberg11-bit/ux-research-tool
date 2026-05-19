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
- **F2 — Pasos 1–4** ✅. Schemas reales por paso (SPEC-V2 §3 pasos 1-4) + vistas custom. Paso 1: 4 campos + checkbox de hipótesis + alerta "causa no validada" + párrafo integrado auto-ensamblado y editable (no se pisa si lo editás). Paso 2: 6 preguntas a stakeholders como guía previa colapsable + in/out scope. Paso 3: objetivo general + lista de específicos con add/remove, badge de nivel Bloom inline por item, pre-check determinista antes de llamar al coach. Paso 4: radio M/NoM + tabla comparativa siempre visible al costado. Coach AI cableado vía Netlify function con prompt-builder por campo, JSON estricto, estado honesto si no disponible (§4 contrato). Build + tests 32/32 verdes.
- **Decisión 2026-05-19**: docs y constantes neutrales — sin referencias a LATAM/Research Hub/Ebiz/Airlines. La fuente se cita como "material de capacitación".
- **F3 — Pasos 5–8** ✅. Trazabilidad implementada: `src/state/chain.js` lee objetivos del paso 3, los pasos 5/6/7 guardan en `byObjective[idx]` (entidad que viaja, §3 paso 3). Paso 5: selector de parámetro por objetivo + definición textual de la fuente. Paso 6: textarea por objetivo prerrellenado con la forma de criterio del parámetro + sello "Umbral fijo 78% — no editable" (binario) o "Sin criterio binario" (expectativa/exploratoria). Paso 7: lista de preguntas por objetivo con `bias-detector` corriendo LIVE por pregunta (sesgo/mala práctica marcados al instante), buenas prácticas siempre visibles, banco por parámetro con stub honesto cuando no hay ejemplos cargados. Paso 8: 3 campos + `ui-jargon-detector` live sobre el relato + recordatorio fijo "probá el escenario antes del test real". Si volvés al paso 3 y borrás objetivos, los pasos 5-7 muestran alerta y se vacían visualmente. Tamaño máximo archivo: 162 líneas (límite 500). Build verde (37 módulos, 47kb/16kb gz). Tests 32/32 verdes.
- **F4 — Cierre** ✅. Tres archivos chicos: `src/brief/assemble.js` (función pura state→brief estructurado, con trazabilidad y completitud), `src/brief/export.js` (función pura brief→Markdown), `src/steps/step-brief/view.js` (pantalla de cierre). Brief con barra de completitud por color (verde/amarillo/rojo), lista de faltantes desplegable, botones Copiar Markdown y Descargar .md. Marca "hipótesis a validar" cuando paso 1 lo flagueó. Render del brief en pantalla con trazabilidad por objetivo + escenario + recordatorio. Tests Vitest 9 nuevos (assemble + export). **41/41 verdes**. Build verde (43 módulos, 57kb/18kb gz). Archivos del cierre: máx 154 líneas.

## En progreso
- **F6 — Deploy** (parcial). Branch `v2` pusheada al remote `nwainberg11-bit/ux-research-tool`. `netlify.toml` actualizado: `command=npm run build`, `publish=dist`, SPA redirect `/* → /index.html`. Netlify debería estar generando el branch deploy automáticamente. Producción (v1 en `main`) intacta.

## Pendientes F6
- Confirmar URL del branch deploy y status del build.
- Agregar URL preview a `ALLOWED_ORIGINS` en env vars del site (para que el coach acepte requests desde esa URL).
- Verificar que `GEMINI_API_KEY` esté cargada (heredada de v1 si Nico la tenía); si no, crear key en aistudio.google.com y agregarla.
- Smoke check de los 9 pasos + brief en la URL preview.

## Siguiente (después de F6)
- **F5 — Verificación**: E2E que reproduce N1/N4/N5/N6/N10 (lecciones del test PREX) y confirma que NO ocurren en v2. Click-through completo en navegador real que F0/F2 dejaron pendiente.
- Cuando F6 + F5 estén verdes: merge `v2 → main` para promover a producción y reemplazar el monolito v1 por el modular v2.
- **Pendiente externo**: cargar texto literal de "preguntas que funcionan" por parámetro en `question-bank.js` (necesita el PDF Módulo 3 — hoy queda con `examples: []` para no inventar).
- **Pendiente verificación**: smoke E2E real en navegador del paso 1→4 (el browser MCP estaba tomado en sesiones previas; queda para F5 según spec §10).

## Notas
- Stack: Vanilla JS + ES modules + Vite → bundle estático. Deploy idéntico a v1 (static + 1 Netlify function), se cablea en F6.
- `netlify.toml publish="."` aún apunta a v1; se cambia a `dist` en F6 (no antes, para no romper deploy actual de v1).
