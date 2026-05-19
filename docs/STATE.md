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

## En progreso
Ninguno. F2 cerrado.

## Siguiente
- **F3 — Pasos 5–8** (Fase 3 del flujo): cablear parámetros + criterio + preguntas + escenario. Implementar la TRAZABILIDAD clave (cada objetivo específico arrastra su parámetro/criterio/preguntas — entidad que viaja). Render del banco de preguntas + validadores ya portados (`bias-detector` para paso 7, `ui-jargon-detector` para paso 8). 78% como label fijo no editable.
- **Pendiente externo**: cargar texto literal de "preguntas que funcionan" por parámetro en `question-bank.js` (necesita el PDF Módulo 3 — hoy queda con `examples: []` para no inventar).
- **Pendiente verificación**: smoke E2E real en navegador del paso 1→4 (el browser MCP estaba tomado en sesiones previas; queda para F5 según spec §10).

## Notas
- Stack: Vanilla JS + ES modules + Vite → bundle estático. Deploy idéntico a v1 (static + 1 Netlify function), se cablea en F6.
- `netlify.toml publish="."` aún apunta a v1; se cambia a `dist` en F6 (no antes, para no romper deploy actual de v1).
