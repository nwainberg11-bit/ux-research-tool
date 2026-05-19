# SPEC v2 — UX Research Coach

> [NICO] Spec de reescritura desde cero. Fiel a rajatabla a los 4 PDFs origen
> (Capacitación "Brief de validación de soluciones", Research Hub / Ebiz LATAM 2024).
> Estado: BORRADOR para revisión de Harold/Nico. No escribir código hasta aprobado.
> Fecha: 2026-05-19.

---

## 1. Qué es v2 (y qué NO es)

**Es:** una herramienta que guía a un investigador a construir **un Brief de validación de soluciones** (test de usabilidad) siguiendo la secuencia canónica de la capacitación LATAM. El entregable es **el brief armado**, listo para ir a ejecutar el test.

**NO es:**
- No es UX research general (discovery, etnografía, entrevistas abiertas). Es **validación de una solución ya diseñada** vía test de usabilidad (moderado o no moderado).
- No tiene fase post-test. La fuente termina en "construir el escenario". Análisis de hallazgos = fuera de alcance (decisión confirmada 2026-05-19).
- No reescribe el texto del usuario ni inventa contenido. (Ver §6.)

**Decisiones de producto confirmadas (2026-05-19):**
- Nombre se mantiene: **UX Research Coach**.
- **AI obligatorio**: sin Gemini disponible, el coach muestra estado honesto "coach no disponible" y el usuario sigue solo con la estructura. No hay motor de reglas que simule coaching.
- Termina en el brief. Cero post-test.

---

## 2. Fuente canónica — la secuencia de 8 pasos

La fuente (Módulo 3, "Pasos para construir un test con usuarios") prescribe ESTE orden, que v2 respeta textualmente (≠ orden del tool v1):

```
FASE 1 · EL PROBLEMA
  1. Definir el problema

FASE 2 · LOS OBJETIVOS
  2. Definir el alcance          ← antes que objetivos (la fuente lo pone acá)
  3. Definir los objetivos        (general + específicos)
  4. Seleccionar el tipo de test  (Moderado / No Moderado)

FASE 3 · EL TEST
  5. Parámetros de medición
  6. Definir el criterio de éxito
  7. Construir preguntas
  8. Construir el escenario        ← último (la fuente lo pone al final)
```

Cambios vs v1: alcance sube antes de objetivos; escenario baja al final; se eliminan los ex-M9/M10; se elimina todo el motor de "mejorar respuesta" deshonesto.

---

## 3. Estructura detallada por paso

Notación: `[req]` obligatorio · `[opt]` opcional · `[AI]` el coach evalúa este campo.

### Paso 1 · Definir el problema
Campos:
- `quien_que_donde` [req][AI] — Situación en conflicto descrita objetivamente, sin juicio: ¿quién sufre el problema? ¿qué le sucede? ¿cuándo/dónde ocurre?
- `por_que` [req][AI] — Causa desde la experiencia. **Regla dura de la fuente:** si la causa no está definida/validada → se marca como **hipótesis** y la app muestra el aviso: *"Causa no validada: esto requiere un discovery previo. Queda como hipótesis."*
- `que_provoca` [req][AI] — Consecuencia actual para el negocio (baja de KPI, reclamos, costo, etc.).
- `evidencia` [opt][AI] — Fuentes que validan el problema (GA4, Fullstory, encuestas, test previo). La fuente lo marca explícitamente OPCIONAL.
- Salida del paso: **párrafo de problema integrado** (auto-ensamblado de los campos, editable).

### Paso 2 · Definir el alcance
- `preguntas_stakeholders` [opt] — Bloque guía con las **6 preguntas** de la fuente (objetivos de negocio / usuarios y características / qué mejorar desde la experiencia / qué info o especialistas / complejidad y dependencias / plazo). No obligan a responderse en la app; son ayuda previa.
- `in_scope` [req][AI] — Qué entra.
- `out_scope` [req][AI] — Qué queda afuera (la fuente insiste: definir el out-scope explícito).

### Paso 3 · Definir los objetivos
- `objetivo_general` [req][AI] — Uno solo, en singular. Criterios de la fuente que el coach evalúa: identifica una necesidad / lógico y viable / enfocado en una meta (no actividad/proceso) / resumido / ≠ objetivo de negocio.
- `objetivos_especificos` [req][AI] — Lista (1..N). Cada uno:
  - Arranca con **verbo** (taxonomía de Bloom, 6 niveles — lista completa en §5.3).
  - Medible, claro, alcanzable, coherente con el general.
  - El coach evalúa además la propiedad de conjunto: **la suma de los específicos debe dar el general** (cobertura).
- **Decisión de arquitectura clave:** cada objetivo específico es una **entidad** que arrastra, en los pasos 5/6/7, su parámetro + criterio + preguntas. (En v1 estaban desconectados — esto era la causa de la sensación de redundancia N8.)

### Paso 4 · Seleccionar el tipo de test
- `tipo` [req] — Radio Moderado / No Moderado.
- Junto al control, **tabla comparativa** de la fuente siempre visible: Qué es / Cuándo usar / Qué obtenemos / Ventajas / Desventajas.
- `justificacion` [req][AI] — Por qué ese tipo para este objetivo. Coach chequea coherencia (ej: "querés profundidad cualitativa y elegiste No Moderado" → alerta).

### Paso 5 · Parámetros de medición
- Por **cada objetivo específico** del paso 3 → asignar exactamente **1 de los 6 parámetros**:
  Encontrabilidad/eficacia · Comprensión/eficacia · Usabilidad/eficacia · Percepción · Expectativa · Exploratoria.
- Junto a cada uno, la definición textual de la fuente (qué mide).

### Paso 6 · Definir el criterio de éxito
- Por **cada objetivo específico + su parámetro** → un criterio de éxito concreto.
- La app pre-rellena la **forma típica del criterio según el parámetro** (de la fuente):
  - Encontrabilidad → "Que el usuario haga clic en ___ . ≥78%."
  - Comprensión → "Que el usuario mencione a/b/c. ≥78%."
  - Usabilidad → "Que el usuario logre [completar flujo / llegar de A a B]. ≥78%."
  - Percepción → "Promedio ≥4 en escala 1–5 + pregunta de seguimiento ¿por qué?"
  - Expectativa → "Sin criterio binario. Define hipótesis a validar/refutar."
  - Exploratoria → "No aplica criterio. Sirve para descubrir."
- **78% es fijo** (la fuente lo dice explícito: "ese porcentaje es fijo y no se cambia"). La app no deja editarlo.
- Coach evalúa: criterio concreto, no interpretable, sin redundancia, sin medir comportamiento visual ("si ve").

### Paso 7 · Construir preguntas
- Por **cada objetivo específico** → preguntas para el test.
- **Banco de inspiración por parámetro** (de la fuente, los ejemplos de "preguntas que funcionan").
- Coach evalúa cada pregunta contra (portado de v1, lo que SÍ funcionó):
  - **7 sesgos cognitivos**: afecto, confirmación, ancla, disponibilidad, representatividad, halo, proyección.
  - **Buenas prácticas**: no inducir · pregunta única · presente · no recordación · no palabras literales de pantalla · no sí/no · no jerga técnica · escala SIEMPRE con "¿por qué calificás?".

### Paso 8 · Construir el escenario
- `contexto_realista` [req][AI] — Situación cotidiana.
- `detalles_accionar` [req][AI] — Info mínima para que el usuario pueda actuar.
- `relato` [req][AI] — Redacción final del escenario.
- Coach evalúa (portado de v1, funcionó bien — N9): NO describir UI, NO ubicación de elementos, NO pasos del flujo, NO jerga técnica, breve. + Recordatorio de la fuente: "probá el escenario antes del test real".

### Cierre · El Brief
- Pantalla final que **ensambla el brief completo** (los 8 pasos) en un documento.
- Export **.md** descargable + copiar. Es el entregable. Fin del flujo.

---

## 4. El coach AI — contrato

**Obligatorio.** Frontend → Netlify Function (`coach.js`, ya endurecida en v1: allowlist origins + rate-limit + validación input — se reusa) → Gemini.

**Qué hace el coach por campo:**
1. Evalúa el campo contra los criterios de ESE paso (definidos en §3, tomados de la fuente).
2. Devuelve: `status` (ok / mejorable / no_cumple) + `diagnostico` (qué está bien y qué no, específico al texto del usuario) + `que_falta` (accionable) + `pregunta_socratica` (para que el usuario lo mejore él).
3. **NUNCA**: reescribe el texto del usuario, inventa datos/contexto, devuelve un ejemplo de otro caso como si fuera suyo, afirma haber hecho algo que no hizo.
4. Puede ofrecer un **ejemplo ilustrativo** SOLO etiquetado "ejemplo de otro caso — adaptalo, no lo copies", sin botón de aplicar.

**Sin AI disponible** (timeout / error / sin key):
- Estado honesto: *"El coach no está disponible ahora. Podés seguir armando el brief con la guía de cada paso; volvé a evaluar cuando se reconecte."*
- Los **validadores deterministas** (§5) igual corren localmente como pre-check barato (detectan sesgos/UI/estructura) — esos NO inventan, solo detectan. No se presentan como "el coach": se presentan como "chequeo automático".

---

## 5. Validadores deterministas a portar de v1 (lo que SÍ funcionó)

Se portan como librería pura testeable (no embebida en el monolito). Corren siempre (con o sin AI) como pre-check.

### 5.1 Detector de sesgos en preguntas (paso 7)
7 sesgos + 6 malas prácticas. Lógica de v1 `M7_QUESTION_PATTERNS` ya validada con Playwright (afecto/confirmación/ancla/disponibilidad/representatividad/halo/proyección + cerrada/recordación/doble-pregunta/pistas-ui/elementos-ui/sin-seguimiento). Bugs ya corregidos (recordación regex, doble-pregunta falso positivo) — portar la versión corregida.

### 5.2 Detector de UI/jerga en escenario (paso 8)
Lógica de v1 `improveM6Field` reescrita honesta (detecta términos UI + lenguaje interno, lista exacta qué sacar, no reescribe). Funcionó bien (N9).

### 5.3 Verbos de Bloom (paso 3)
Lista completa de la fuente, 6 niveles:
- **Conocimiento**: Adquirir, Citar, Definir, Describir, Enunciar, Identificar
- **Comprensión**: Asociar, Comprender, Demostrar, Ejemplificar, Explicar, Relacionar, Resumir
- **Aplicación**: Adaptar, Aplicar, Calcular, Construir, Determinar, Modificar, Resolver, Usar
- **Análisis**: Analizar, Categorizar, Contrastar, Derivar, Detectar, Diferenciar, Examinar
- **Síntesis**: Anotar, Armar, Compilar, Crear, Diseñar, Formular, Generar, Organizar
- **Evaluación**: Calificar, Decidir, Elegir, Evaluar, Opinar, Seleccionar, Valorar, Validar

### 5.4 Los 6 parámetros + forma de criterio (pasos 5/6)
Tabla de la fuente (§3 paso 6). 78% fijo.

---

## 6. Principios irrenunciables (lecciones del test PREX, notas N1–N11)

1. **Honestidad sobre capacidad.** El coach nunca afirma haber hecho algo que no hizo (N10). Nunca dice "mejoré X" si solo borró palabras.
2. **No inventar contexto** (N4). Si para mejorar hay que inventar a quién le pasa / qué pasa → no se mejora; se pide al usuario.
3. **No repetir como si fuera mejora** (N6). Si el output = input, no se muestra como "versión mejorada".
4. **Ejemplos ajenos rotulados** (N5). Cualquier ejemplo de otro caso va marcado y sin botón de aplicar.
5. **Nunca quedar colgado** (N1). Todo estado de carga tiene timeout + salida. Si el AI no responde → estado honesto, jamás "Analizando…" infinito.
6. **El brief es el clímax** (N11). El entregable (brief .md) es el cierre explícito y visible, no algo escondido.
7. **No re-preguntar lo ya respondido** (N7/N8). Cada paso muestra y reusa lo de pasos previos (objetivo → parámetro → criterio → preguntas viajan juntos por objetivo específico).

---

## 7. Arquitectura técnica

**Problema de v1:** monolito `index.html` ~7.400 líneas. Imposible de iterar, testear, auditar (#18 quedó pendiente por esto).

**v2:**
```
ux-research-tool/                (mismo repo, v2 en rama o carpeta /v2)
├── src/
│   ├── steps/                   1 carpeta por paso (1..8)
│   │   └── step-1-problema/
│   │       ├── schema.js        campos + reglas de la fuente
│   │       ├── view.js          render
│   │       └── prompt.md        instrucción AI de este paso (versionable)
│   ├── coach/
│   │   ├── client.js            llamada a Netlify function + estados (timeout/honest-fail)
│   │   └── validators/          §5 deterministas (puros, testeables)
│   ├── state/                   store + persistencia + export brief .md
│   ├── ui/                      shell, sidebar 3 fases, navegación
│   └── source/                  constantes de la fuente (Bloom, 6 parámetros, tabla M/NoM, 6 preguntas)
├── netlify/functions/coach.js   reusada de v1 (ya endurecida)
├── tests/                       Vitest validadores + Playwright E2E
└── build → bundle estático deployable a Netlify (igual que v1)
```
Stack: Vanilla JS + módulos ES + build con esbuild/Vite → 1 bundle. Sin framework pesado. Sigue siendo static site + 1 function (deploy idéntico a v1 en Netlify).

---

## 8. Criterios de DONE de v2

- [ ] Los 8 pasos en el orden canónico de la fuente. Cero post-test.
- [ ] Cada paso pide exactamente los campos de §3 (ni más ni menos que la fuente).
- [ ] Trazabilidad objetivo específico → parámetro → criterio → preguntas (entidad que viaja).
- [ ] Coach AI cumple el contrato §4. Sin AI: estado honesto, nunca colgado.
- [ ] Validadores §5 portados, con tests Vitest verdes.
- [ ] Los 7 principios §6 verificables (test E2E que reproduzca N1/N4/N5/N6/N10 y confirme que NO ocurren).
- [ ] Export del brief .md funcional = entregable de cierre.
- [ ] Arquitectura modular §7, ningún archivo > ~500 líneas.
- [ ] README actualizado (deploy, GEMINI_API_KEY, ALLOWED_ORIGINS).

---

## 9. Qué se descarta explícitamente de v1

- Ex-módulos 9 y 10 (post-test) — no existen en la fuente.
- Motor `buildFieldImprovement` / `improveMNField` (el "Mejorar respuesta" deshonesto) — se elimina entero. El coach AI no reescribe.
- `FIELD_COACH_RULES` con `suggestion` hardcodeadas del caso salud — se eliminan. Ejemplos solo de la fuente, rotulados.
- El monolito `index.html`. v1 queda como `legacy/` de referencia hasta que v2 esté LIVE.

---

## 10. Plan de construcción (fases, sin estimaciones de tiempo)

- **F0 — Andamiaje**: estructura de carpetas §7, build, store, shell con sidebar 3 fases vacío, función coach reusada. DONE = navega los 8 pasos vacíos.
- **F1 — Fuente como datos**: §5 constantes (Bloom, 6 parámetros, tabla M/NoM, 6 preguntas, banco de preguntas) + validadores deterministas con tests Vitest.
- **F2 — Pasos 1–4** (Fase 1 + 2): campos, schema, coach por campo.
- **F3 — Pasos 5–8** (Fase 3): incluye la trazabilidad objetivo→parámetro→criterio→preguntas.
- **F4 — Cierre**: ensamblado del brief + export .md.
- **F5 — Verificación**: E2E que reproduce N1/N4/N5/N6/N10 y confirma que no ocurren + smoke de los 8 pasos.
- **F6 — Deploy**: Nico conecta Netlify + GEMINI_API_KEY + ALLOWED_ORIGINS.

---

## Pendiente de decisión de Harold/Nico antes de F0

1. ¿v2 en **rama** del repo de Nico o en **carpeta `/v2`** con v1 intacto al lado? (recomiendo carpeta `/v2` + v1 a `/legacy`, deploy apunta a v2 cuando esté listo).
2. ¿Banco de preguntas por parámetro: lo embebemos textual de la fuente, o lo resumimos? (recomiendo textual — es valor de la capacitación).
3. Confirmar que "sin post-test" es definitivo (hoy 19/05 sí; si Nico lo quiere para vender, va como producto separado, no acá).
