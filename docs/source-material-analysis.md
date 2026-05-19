# Análisis del material origen vs herramienta actual

> Fuente: 4 PDFs del material de capacitación compartido por Nico (mayo 2026).
> Material: **Capacitación de Brief de validación de soluciones**.
> Audiencia original: roles UXD y UXW (capacitación interna).
> Duración total: 4.5 horas (3 módulos × 1.5 h).

## Objetivo del material origen

> "Iniciativa: Mejorar tiempos de testeos Moderado y No Moderados."

Acelerar la creación de briefs para **test de validación de soluciones de diseño** (moderado y no moderado). NO es para UX research general — está acotado a *validar soluciones ya diseñadas* via test de usabilidad.

## Estructura del origen (3 módulos)

### Módulo 1 — El problema (1.5h)
**Competencia:** levantar la información para describir claramente un problema: a quién, dónde, cuándo, qué sucede, por qué, qué provoca, fuentes de evidencia.

**Frase clave del material:** *"Si la causa no está definida entonces hay que hacer un discovery para validar el problema, y la causa pasa a ser una hipótesis."*

**Ejemplos del material (todos aviación / ):**
- Producto  Flex con 2% conversión (info escondida en booking flow).
- Agentes Contact Center con info de millas en plataforma separada (TMO y CPC).
- Baja conversión en paquetes Disney (Miami/Orlando).

### Módulo 2 — Los objetivos (1.5h)

**Sub-competencias:**
1. Definir objetivo general (1 solo, en singular).
2. Definir objetivos específicos (con verbos de **taxonomía de Bloom**).
3. Definir alcance (in scope / out scope).
4. Discriminar **Moderado vs No Moderado**.

**Verbos de Bloom — el origen los lista por 6 niveles:**

| Nivel | Verbos sugeridos |
|---|---|
| Conocimiento | Adquirir, Citar, Definir, Describir, Enunciar, Identificar |
| Comprensión | Asociar, Comprender, Demostrar, Describir, Ejemplificar, Explicar, Relacionar, Resumir |
| Aplicación | Adaptar, Aplicar, Calcular, Construir, Determinar, Modificar, Resolver, Usar |
| Análisis | Analizar, Categorizar, Clasificar, Contrastar, Derivar, Detectar |
| Síntesis | Anotar, Armar, Buscar, Compilar, Crear, Demostrar, Diseñar, Organizar |
| Evaluación | Afirmar, Calificar, Considerar, Decidir, Elegir, Evaluar, Opinar, Seleccionar, Valorar |

**6 preguntas a stakeholders para definir alcance** (que la herramienta actual no usa):
1. ¿Cuáles son los objetivos de negocio para esta iniciativa?
2. ¿Quiénes son los usuarios y/o cuáles son sus características?
3. ¿Qué se espera mejorar para los usuarios, desde la experiencia?
4. ¿Qué información necesitamos y/o a qué especialistas necesitamos consultar?
5. ¿Qué complejidad o dependencias tiene la iniciativa?
6. ¿Cuál es el plazo esperado para la entrega de resultados?

**Moderado vs No Moderado — tabla del origen:**

| | Moderado | No Moderado |
|---|---|---|
| **Cuándo usar** | Flujo completo, interacciones complejas, descubrir motivaciones | Microflujos, tareas directas, ciclos rápidos |
| **Qué obtenemos** | Observaciones, comentarios verbales en profundidad, modelos mentales, métricas cuanti | Respuestas breves, métricas cuanti precisas, heatmaps |
| **Ventajas** | Más y mejor info cualitativa, guiar al usuario, indagar "por qués" | Menos costoso, más rápido, sinceros, sin observación |
| **Desventajas** | Costoso, cambio por ser observados, riesgo sesgo moderador | Poca cuali, no se puede ayudar si se atasca, orden único |

### Módulo 3 — El test (1.5h)

**Sub-competencias:**
1. Definir criterio de éxito.
2. Identificar **parámetros de medición**.
3. Construir preguntas en lenguaje simple sin inducir respuestas.
4. Redactar escenario.

**Los 6 parámetros de medición — corazón del método:**

| Parámetro | Mide | Tipo criterio éxito |
|---|---|---|
| **Encontrabilidad / eficacia** | % usuarios que encuentran un elemento | Que haga clic en X |
| **Comprensión / eficacia** | % usuarios que comprenden label/texto sin ayuda | Que mencione A/B/C |
| **Usabilidad / eficacia** | % usuarios que completan tarea/flujo | Que llegue de A a B |
| **Percepción** | Likert 1-5 (CES, claridad, CSAT) | ≥4 |
| **Expectativa** | Pregunta abierta: qué espera que pase | N/A — explorar hipótesis |
| **Exploratoria** | Pregunta abierta de opinión/comportamiento | N/A |

**7 sesgos cognitivos para evitar al construir preguntas** (el contenido más valioso del módulo 3, no aprovechado por la herramienta actual):

1. **Heurística del afecto** — responder "cómo me siento" vs "qué pienso". *Solución: tercera persona.*
2. **Sesgo de confirmación** — amoldar evidencia a creencias previas. *Solución: no asumir contexto del usuario.*
3. **Efecto ancla** — un valor previo fija la respuesta. *Solución: no dar connotación a escalas.*
4. **Heurística de disponibilidad** — frecuencia juzgada por facilidad de recuerdo. *Solución: cuidado con exageraciones.*
5. **Sesgo de representatividad** — atribuir por similitud, no estadística. *Solución: evitar perfilamiento no relacionado.*
6. **Efecto halo** — atributos positivos/negativos por percepción parcial. *Solución: evitar preguntas sin parámetro funcional asociado.*
7. **Sesgo de proyección** — predecir comportamiento futuro. *Solución: no medir comportamiento en test de usabilidad — para eso, experimentación (A/B).*

**Buenas prácticas de redacción de preguntas:**
- Evita inducir, pregunta única, precisa y concreta.
- Evita recordación, usa tiempo presente.
- Evita palabras literales de la pantalla.
- Evita lenguaje técnico (a menos que sea jerga del usuario).
- Evita sí/no salvo para perfilamiento.
- Si hay escala, siempre pregunta de seguimiento "¿por qué calificas con esa nota?".

**Estructura de un buen escenario:**
- Contexto realista (situación cotidiana del usuario).
- Detalles para accionar (información necesaria para imaginar y actuar).
- Relato específico (no describir literalmente UI, no indicar ubicación, no dar pistas de pasos, no usar jerga).

---

## Mapeo origen → tool actual

| Origen | Tool actual | Estado | Gap |
|---|---|---|---|
| M1 El problema | **M1** Definir problema | ✅ Fiel | — |
| M2.1 Obj. general | **M2** Objetivo general | ✅ Fiel | — |
| M2.2 Obj. específicos | **M3** Objetivos específicos | ⚠️ Parcial | **Pierde 5 niveles de Bloom** (solo enforce 3-4 verbos) |
| M2.3 Alcance | **M4** Alcance | ⚠️ Parcial | **Pierde 6 preguntas a stakeholders** |
| M2.4 Moderado vs No M. | **M5** Método | ⚠️ Sobre-extendido | El origen es dicotomía clara M/NoM; tool agrega chips extra que no están en origen |
| M3.4 Escenario | **M6** Escenario | ✅ Fiel | — |
| M3.3 Preguntas | **M7** Tareas y preguntas | 🔴 **Crítico** | **No evalúa contra los 7 sesgos cognitivos** |
| M3.1+M3.2 Parámetros + criterio | **M8** Métricas y criterios | 🔴 **Crítico** | **Pierde los 6 parámetros de medición**, M8 queda vago |
| ❌ NO EXISTE | **M9** Síntesis | 🚨 Invento | Post-test, fuera del scope origen |
| ❌ NO EXISTE | **M10** Decisiones | 🚨 Invento | Post-test, fuera del scope origen |

---

## Hallazgos críticos (re-evalúan la auditoría previa)

### 1. La herramienta cambió de naturaleza sin avisarlo

El origen es **"Brief de validación de soluciones via test de usabilidad"**. La herramienta hoy se llama **"UX Research Coach"** y promete cubrir UX research general.

Son cosas distintas:
- **Validación de soluciones via test de usabilidad** = ya tenés un diseño, lo probás con usuarios.
- **UX research** = puede ser discovery, etnografía, entrevistas en profundidad, journey mapping, etc.

Por eso en la simulación Pau (e-commerce) y Sebastián (founder sin usuarios) chocaron tan fuerte: **la herramienta no es para ellos.** Es para PMs, designers, researchers que tienen un prototipo o una solución para validar.

**Recomendación:** decidir scope explícitamente:
- **Opción narrow:** rebrand como "Brief de testeo de usabilidad" → fiel al origen.
- **Opción wide:** quedarse con "UX Research Coach" pero extender el método para discovery/entrevistas (mucho más trabajo).

### 2. M9 y M10 son inventos fuera del scope

El origen termina en construcción del test. NO incluye análisis ni síntesis post-test. Eso explica la fricción #1 de la simulación.

**Recomendación:** sacar M9-M10 del flujo principal y ofrecerlos como módulo opcional separado (o eliminar si no hay un origen documentado).

### 3. El coach de M7 deja en la mesa el contenido pedagógico más valioso

**Los 7 sesgos cognitivos son el oro del módulo 3 del origen.** La herramienta ni los menciona. Implementar reglas en el coach que evalúen preguntas contra cada sesgo = mejora pedagógica inmediata y diferenciadora.

**Reglas concretas a implementar:**
- Detectar preguntas en primera persona → flag "afecto" → sugerir tercera persona.
- Detectar preguntas con "¿usarías…?", "¿comprarías…?" → flag "proyección" → sugerir A/B testing en lugar de test usabilidad.
- Detectar preguntas con palabras literales de la UI (heurística textual) → flag "palabras literales".
- Detectar preguntas sí/no → flag "cerrada" → sugerir reformular abierto.
- Detectar preguntas en pasado ("¿recordás…?") → flag "recordación" → sugerir tiempo presente.
- Detectar ausencia de "¿por qué calificas con esa nota?" después de escala → flag "falta seguimiento".

### 4. El framework de 6 parámetros está ausente en M8

Es el **conector** entre objetivos específicos → criterio de éxito → preguntas. Sin él, M8 queda como un buzón abierto.

**Recomendación:** en M8 obligar a clasificar cada objetivo específico de M3 dentro de uno de los 6 parámetros. Eso auto-genera el criterio de éxito plantillado y guía la formulación de preguntas en M7.

### 5. La taxonomía de Bloom es subutilizada

El origen ofrece ~40 verbos en 6 categorías. La herramienta valida solo contra una whitelist mínima ("Identificar/Entender/Evaluar/Indagar/...").

**Recomendación:** ampliar la regex a los ~40 verbos del origen. Bonus: mostrar al usuario en qué nivel cognitivo está su objetivo (Conocimiento / Comprensión / Aplicación / Análisis / Síntesis / Evaluación).

---

## 3 opciones de re-estructuración

### Opción A — Fiel al origen (3 fases × sub-pasos)

```
FASE 1 · El problema
  └─ 1.1 Definir el problema

FASE 2 · Los objetivos
  ├─ 2.1 Objetivo general
  ├─ 2.2 Objetivos específicos (Bloom completo)
  ├─ 2.3 Alcance (con 6 preguntas stakeholders)
  └─ 2.4 Tipo de test (M / NoM)

FASE 3 · El test
  ├─ 3.1 Parámetros de medición (6 chips)
  ├─ 3.2 Criterios de éxito (auto-template por parámetro)
  ├─ 3.3 Preguntas (coach checa contra 7 sesgos)
  └─ 3.4 Escenario
```

M9-M10 → módulo opcional separado "Análisis post-test" o se quitan.

**Pros:** scope claro, fiel al origen, pedagogía coherente.
**Contras:** rework del UI (de 10 módulos lineales a 3 fases con sub-pasos).

### Opción B — Reagrupar visualmente, mantener código

Mantener los 10 módulos en código, pero agregar bandera visual de fase:
```
[FASE 1: El problema]
  Módulo 01

[FASE 2: Los objetivos]
  Módulo 02, 03, 04, 05

[FASE 3: El test]
  Módulo 06, 07, 08

[FASE OPCIONAL: Análisis post-test]
  Módulo 09, 10
```

Más enriquecer M3 con Bloom completo, M4 con stakeholder questions, M5 con tabla M/NoM, M7 con 7 sesgos, M8 con 6 parámetros.

**Pros:** menor rework de código, agrega lo que falta.
**Contras:** sigue siendo un flujo de 10 pasos lineales — la friction de "pre vs post" mejora con la bandera pero no se resuelve.

### Opción C — v2 nueva + v1 legacy

Construir versión nueva en paralelo (Vite + módulos separados — como en la propuesta de arquitectura de la auditoría previa) con estructura de Opción A. Mantener v1 vivo durante la migración.

**Pros:** producto limpio, dos sabores ofrecibles ("rápido" v2 + "completo" v1).
**Contras:** costo de oportunidad, dos productos a mantener.

---

## Mi recomendación

**Opción B con enriquecimiento agresivo** como primer movimiento, después **Opción C** cuando el producto valide demanda con humanos reales.

Razones:
1. **Bajo costo:** la mayoría del código se reutiliza, se agrega contenido pedagógico que faltaba.
2. **Pedagogía completa:** los 7 sesgos y 6 parámetros son valor diferencial enorme vs competidores (Notion templates, Maze, etc.).
3. **Honesto con el origen:** Nico construyó el tool sobre este material, hay que respetarlo y completarlo.
4. **No bloquea el test con humanos:** se puede salir a recrutar con Opción B implementada.

## Pendientes accionables (orden de ejecución)

| # | Tarea | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Agregar fase visual (banderas M1-8 brief, M9-10 post-test) | Bajo | Alto |
| 2 | Enriquecer M7 con coach de 7 sesgos cognitivos | Medio | Alto |
| 3 | Enriquecer M8 con framework de 6 parámetros de medición | Medio | Alto |
| 4 | Ampliar M3 con verbos de Bloom completos + categorías | Bajo | Medio |
| 5 | Ampliar M4 con 6 preguntas a stakeholders | Bajo | Medio |
| 6 | Decidir destino de M9-M10 (eliminar / mover / dejar opcional) | Decisión Nico | Alto |
| 7 | Reframe del producto: "Brief de testeo de usabilidad" o seguir como "UX Research Coach" | Decisión Nico | Crítico |
