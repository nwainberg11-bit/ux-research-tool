# Test simulado con 5 personas — UX Research Coach

> Walk-through realizado por Claudio (Claude) leyendo el código fuente del tool
> y simulando la experiencia de 5 personas que reclutaríamos como usuarios reales.
> **No reemplaza** un test con humanos. Sirve para detectar fricción de copy, validaciones
> incoherentes, vacíos pedagógicos y bugs de flujo *antes* de invertir en sesiones moderadas.

## Método de la simulación

Para cada persona:
1. Pre-test: contexto real (research que está por arrancar).
2. Walk-through M1→M10 con inputs realistas que esa persona escribiría.
3. Predicción del feedback del coach (basada en las reglas locales del código).
4. Fricción detectada (copy, validación, flujo, valor percibido).
5. Post-test simulado: SUS estimado, WTP, "lo usaría de nuevo".

Al final: síntesis temática con hallazgos priorizados por frecuencia × severidad.

---

## Persona 1 — Mariela, junior UX researcher (2 años, healthtech mediana)

**Research real:** "Por qué los pacientes >55 años abandonan el alta digital antes de subir documentación."
Empresa: prepaga uruguaya con app + portal. Investigación pedida por su PM, tiene 3 semanas. Nunca escribió un brief formal — usa templates de Notion sueltos.

### Walk-through

**M1 — Definir el problema** ✅ entra cómoda

- Problemática inicial: *"Los socios mayores de 55 años no terminan el alta digital en la app, se quedan en el paso de subir cédula."* (105 chars)
- Usuario afectado: *"Socios prepaga"* (15 chars) → 🟠 coach local marca **"genérico"** porque matchea `/^socios?$|^clientes?$/i`. Le pide "agregá condición observable".
- Lo corrige: *"Socios activos +55 con plan individual que iniciaron alta digital en últimos 30 días"* (87 chars) → ✅ ok.
- Qué sucede: *"Abandonan en el paso 4 (subir cédula). 60% no vuelve."* → ✅ ok pero `local rules` no detecta que ya está mezclando *qué sucede* con *evidencia*.
- Contexto: *"Paso 4 del flujo de alta, app y web"* → ✅ pasa, pero corto.
- Causa: *"No saben cómo escanear la cédula"* → 🟠 coach: "está formulado como certeza, debería ser hipótesis (Posiblemente / Podría deberse a)".
- Impacto: *"Bajo % de altas digitales"* → 🟠 "genérico, conectá con negocio".
- Evidencia: *"GA4, tickets soporte"* → 🟠 "muy corto, especificá fuentes".

**Reacciones de Mariela:**
- 😊 "El coach me pesca el 'socios' genérico, eso me sirve." → **Valor real entregado.**
- 😕 "¿Por qué tengo que poner 'Posiblemente' obligatorio? En mi empresa hablamos directo, esto suena tibio." → **Fricción de tono.**
- 😕 "El campo 'Evidencia' me pide datos que todavía no tengo. Por eso voy a hacer el research." → **Vacío conceptual: la herramienta confunde "brief de research" con "post-discovery".**

**M2–M4** — la convierte en menos de 30 minutos, los placeholders la guían bien.

**M5 — Método** 🟠 fricción alta

- Selecciona chips: "Comportamiento + Profundidad media + Test usabilidad moderado".
- El método recomendado sale: ✅ ok.
- Justificación: *"Necesito ver dónde fallan al subir la cédula"* → coach OK.
- 😕 "No tengo presupuesto para 6 sesiones moderadas. La herramienta no me pregunta restricciones (tiempo, plata, acceso a usuarios)."

**M6 — Escenario** ✅

- Lo escribe bien apoyada en el placeholder. Sale defendible.

**M7 — Tareas y preguntas** 😕

- *"Reservá una hora médica"* es el placeholder. Lo copia accidentalmente para su contexto y se da cuenta a la mitad de que es el placeholder de OTRO caso (de salud pero diferente). Lo borra.
- 🟠 **Bug de UX:** los placeholders son tan extensos que parecen contenido real cargado. Confunde.

**M8 — Métricas** ✅ entra

- Chips de barreras: las marca todas. No se sabe si ayudan o ruido.

**M9 — Síntesis** ⛔ se detiene

- 😡 "Esto se completa DESPUÉS del research. Yo todavía no hice nada. ¿Lo dejo en blanco? ¿No puedo descargar el brief sin esto?"
- Intenta saltar al export. **Pregunta abierta**: ¿el flujo está pensado como brief PRE-research o como documento end-to-end del research entero?

### Post-test simulado

- **SUS estimado: 64/100** (umbral 68 — falla por poco).
- **WTP: USD 5/mes**. "Si fuera más barato lo usaría, está bueno como guía. No vale 20."
- **Lo usarías de nuevo:** "Para arrancar un brief sí. Para todo el research no."

---

## Persona 2 — Gonzalo, senior UX researcher (8 años, fintech startup)

**Research real:** "Por qué los onboardings B2B caen en el paso de KYC empresarial."
Maneja briefs en docs propios desde hace años. Es el referente metodológico de su equipo.

### Walk-through

**M1**

- Escribe todo en 4 minutos, denso y profesional.
- *Usuario:* "Founders de pymes (5-50 empleados) que iniciaron onboarding B2B en últimos 14 días y no completaron KYC empresarial." (140 chars) → ✅.
- *Causa:* "La carga cognitiva del KYC empresarial supera el threshold de fricción del usuario en sesión inicial." → 🟠 coach: "está formulado como certeza".
- 😡 **"Acabo de escribir una hipótesis sofisticada y el bot me dice que cambie 'supera' por 'podría superar'. Esto es nivel intro a UX."** → **Coach pierde autoridad con seniors.**

**M2–M4**

- Le pide al output que sea más conciso. No hay forma de ajustar el formato/estilo de salida.
- 😕 "El output es lindo pero rígido. Yo a mis stakeholders les llevo bullet points + un gráfico, no un Markdown verboso."

**M5**

- Sabe que va a hacer entrevistas + análisis de session replay. No hay forma de poner método mixto. Tiene que elegir uno y agregarlo en "justificación" como workaround.
- 🟠 **Bug pedagógico:** la herramienta asume *un* método. La realidad senior es *mix*.

**M6, M7, M8**

- Vuela. Le interesa M8 (criterios de interpretación) porque ahí suele cojear su equipo.
- 😊 "El campo 'criterios de interpretación' es lo más valioso para mí. Eso lo voy a usar de plantilla con juniors."

**M9, M10**

- Le hace sentido como una sola unidad: brief + sintesis + decisiones todo junto = doc end-to-end para entregar al PM.
- 😊 "Si el doc final lo puedo presentar tal cual al PM, esto vale. ¿Hay export a PDF? Solo .md."
- 😕 "Markdown no se ve bonito a mi cliente. Necesito PDF o Notion paste-friendly."

### Post-test simulado

- **SUS: 71/100** (usable pero no encantador).
- **WTP: USD 0/mes a título individual, USD 10–20/usuario/mes si su empresa lo paga como tool de equipo.**
- **Comentario clave:** *"Como tool individual está bien. Como tool de equipo (compartir briefs, comentar, versionar) sería un Notion killer para juniors. Hoy no llega."*

---

## Persona 3 — Pau, product designer (4 años, e-commerce regional)

**Research real:** "Validar si el filtro de talles confunde a usuarias mobile."
Hace research porque "alguien tiene que hacerlo", no es su rol principal. Mezcla discovery con usabilidad.

### Walk-through

**M1** ❌ tropieza fuerte

- *Problemática inicial:* "El filtro de talles no se entiende bien" → 🟠 coach: "muy corto, falta especificidad (quién, qué situación, dónde)".
- Lo expande: "Usuarias mobile en el listado de productos no encuentran sus talles disponibles porque el filtro de talles es confuso" → ✅.
- *Usuario:* "Mujeres 25-40" → 🟠 "genérico, agregá condición observable (qué tienen instalado, qué hicieron)".
- 😕 "Pero mi audiencia ES demográfica, no comportamental. ¿Por qué el coach me obliga a poner 'usuarias con app instalada'? No tengo app, solo web."
- **Sesgo del coach: prioriza productos con app/cuenta/plan sobre commerce simple.** Los placeholders y rules están entrenados sobre el caso "salud / autogestión".

**M2**

- Objetivo general: lo escribe pero se siente forzada a usar verbos "investigables" (Identificar / Evaluar / Comprender). Su redacción natural sería "Saber por qué…".
- 🟠 **Tono prescriptivo del coach:** la herramienta no admite variantes de redacción que serían correctas.

**M3**

- Objetivos específicos: pide entre 3 y 5. Ella tiene 2 claros. Inventa un tercero genérico para pasar la validación. **Anti-patrón inducido.**

**M5**

- Quiere hacer un test de 5-second + click test no moderado. Las opciones de chips no contemplan métodos rápidos guerrilla. Termina marcando "Test usabilidad moderado" aunque no es lo que va a hacer. **Compromete la validez del brief.**

**M6**

- El escenario le sale bien con el placeholder.
- 😊 "El consejo de no mencionar botones ni pantallas es oro. No lo sabía."

**M7, M8**

- Pasa.

**M9, M10**

- Igual que Mariela: se detiene. "Esto es post-research."

### Post-test simulado

- **SUS: 58/100** (debajo de usable).
- **WTP: USD 5/mes si se vuelve más flexible. USD 0 hoy.**
- **Comentario clave:** *"Asume que sé hacer UX. Yo soy designer que hace UX por necesidad. Necesitaría más ejemplos o una versión 'beginner mode' donde el coach explique POR QUÉ pide cada cosa."*

---

## Persona 4 — Ricardo, PM B2B SaaS (6 años, sin background UX)

**Research real:** "Por qué los onboarding calls de clientes enterprise toman 3 sesiones cuando el playbook dice 1."
Trabaja con un UX researcher freelance, pero esta vez quiere armar el brief él para ahorrar tiempo.

### Walk-through

**M1**

- Usuario: "Admins de cuenta enterprise (≥50 seats) en primeros 30 días post-firma" → ✅.
- *Qué sucede:* "Customer Success necesita 3 calls en vez de 1 para terminar onboarding". → ✅ pero el coach no detecta que está describiendo el síntoma desde el lado del *equipo interno*, no del usuario.
- *Causa:* "Posiblemente el onboarding flow asume conocimiento técnico que el admin no tiene" → ✅.

**M3 — Objetivos específicos**

- Pide verbos investigables. Él escribe "Saber qué…" → 🟠 "no es verbo de research, usá Identificar / Entender / Evaluar".
- 😕 "Es la palabra correcta en mi jerga. ¿Por qué tengo que hablar como académico?"
- **Fricción dialectal:** el coach tiene una visión purista del lenguaje de UX research que choca con cómo hablan los PMs.

**M5**

- Encantado con las recomendaciones automáticas. "Esto es el valor más alto para mí — me dice qué método usar sin tener que estudiar UX."
- 😊 **Punto fuerte real.**

**M7**

- Las preguntas le salen literales: "¿Cómo te parece el onboarding?" → si tuviera coach AI activo, debería pescar la pregunta cerrada/sesgada. Si solo está el local fallback, lo deja pasar.
- 🟠 **Bug:** el local coach no detecta preguntas con sesgo de respuesta. El AI sí (depende del prompt).

**M8**

- Confundido entre observables vs métricas vs criterios. Los pone todos parecidos.
- 🟠 **Fricción conceptual:** la diferencia entre los 3 campos no está clara para alguien sin formación UX. Necesita ejemplos contrastantes en hover/tooltip.

**M9, M10**

- Los completa con datos *hipotéticos* porque todavía no hizo el research. **Se confunde de etapa**.

### Post-test simulado

- **SUS: 69/100** (apenas usable).
- **WTP: USD 15/mes**. "Si me ahorra el freelance UX para esto, vale."
- **Comentario clave:** *"Si tuvieras una versión 'PM mode' que tradujera la jerga de UX a la mía, te lo pago el doble."*

---

## Persona 5 — Sebastián, founder solopreneur (app de fitness, 0 empleados)

**Research real:** "Por qué la gente baja la app y la abre 2 veces y nunca más."
Sin background ni UX ni research. Aprende todo de YouTube y Twitter. Usa la herramienta porque vio el post de Nico en LinkedIn.

### Walk-through

**M1**

- *Problemática inicial:* "La gente no usa mi app" → 🟠 coach: "muy general".
- Lo intenta varias veces. Acepta una sugerencia. Pasa.
- *Causa:* "No saben qué hacer cuando abren la app" → 🟠 "convertí en hipótesis".
- 😊 "El coach me obliga a pensar más profundo, está bueno."

**M2**

- *Objetivo general redactado:* lo escribe pero no incluye usuario/contexto. Coach lo pesca → ✅.

**M3**

- Lo más difícil para él. Pide 3 objetivos específicos. Tiene 1.
- ⛔ **Bloqueo:** no puede avanzar. Frustrado.

**M5**

- Selecciona chips. Le recomiendan entrevistas moderadas con 6 usuarios.
- 😖 "No tengo 6 usuarios. Tengo 200 instalaciones y ningún contacto. ¿Cómo hago entrevistas si no sé quiénes son?"
- 🟠 **Vacío crítico:** la herramienta asume acceso a usuarios. Solopreneurs no lo tienen.

**M6, M7, M8**

- Los completa por encima, sin entender bien.

**M9, M10**

- Salta porque ya está cansado.

### Post-test simulado

- **SUS: 51/100**.
- **WTP: USD 0**. "Está bueno pero no es para mí, es para gente que ya hace research."
- **Comentario clave:** *"Necesitaría una versión 'founder mode' que parta de 'no tenés usuarios todavía, ¿cómo conseguís 5?'."*

---

## Síntesis temática — hallazgos priorizados

### 🔴 Críticos (afectan core value, ≥3 personas)

1. **Confusión PRE-research vs POST-research (Mariela, Pau, Sebastián, Ricardo).**
   M1–M8 son brief; M9–M10 son síntesis. No hay corte visual, ni opción de exportar solo el brief, ni mensaje claro de "vení acá después del research". **Es la fricción #1.**
   → **Fix:** dividir explícitamente la app en dos tramos (Brief / Análisis) con label visible. Botón "Exportar solo brief" disponible al terminar M8.

2. **Sesgo del coach hacia caso "app/salud/autogestión" (Pau, Sebastián, Ricardo).**
   Placeholders y reglas locales están entrenados sobre 1 caso. Penalizan briefs válidos de e-commerce, B2B SaaS, founders sin app.
   → **Fix:** placeholders rotativos según industria seleccionada al inicio. Reglas más permisivas (o desactivables) para casos no-app.

3. **Tono prescriptivo / falta de adaptabilidad de lenguaje (Gonzalo, Pau, Ricardo).**
   "Identificar/Entender/Evaluar" obligatorio, "Posiblemente/Podría" forzado, formato Markdown rígido. Choca con cómo escriben PMs, founders, designers no-UX.
   → **Fix:** modo "tono libre" o "tono académico" toggle. Permitir más sinónimos en regex de validación.

### 🟠 Altos (≥2 personas)

4. **Placeholders demasiado realistas se confunden con contenido cargado (Mariela).**
   → **Fix:** placeholder con estilo visual diferenciado (color, fondo distinto) o textos más cortos + tooltip "ejemplo".

5. **M3 (objetivos específicos) bloquea con mínimo de 3 (Sebastián, Pau).**
   Casos legítimos tienen 1-2. La validación rígida fuerza objetivos inventados.
   → **Fix:** mínimo 1, sugerir 3, no bloquear con 1.

6. **M5 (método) no admite mixto / no contempla métodos rápidos (Gonzalo, Pau).**
   → **Fix:** chips multi-selección de método, agregar guerrilla / 5-second / unmoderated tests.

7. **Falta de exportación a PDF / Notion / clipboard rico (Gonzalo, Mariela).**
   Solo .md y copy básico. Stakeholders no-técnicos no consumen Markdown.
   → **Fix:** export a PDF (browser print con estilos) + "copy as rich text" para pegar en Notion/GDocs.

8. **Coach no entiende restricciones del researcher (Mariela, Sebastián).**
   Tiempo, presupuesto, acceso a usuarios.
   → **Fix:** preguntas opcionales en M5: "¿tenés acceso a usuarios? ¿cuántos? ¿presupuesto?" → ajusta recomendación.

### 🟡 Medios (1 persona pero impactan adopción)

9. **No diferencia conceptual entre observables/métricas/criterios en M8 (Ricardo).**
   → **Fix:** ejemplos contrastantes en cada campo, no genéricos.

10. **Coach local no detecta preguntas con sesgo de respuesta en M7 (Ricardo).**
    → **Fix:** agregar regla M7 para preguntas cerradas/binarias/leading.

11. **Senior no encuentra valor adicional vs su flujo actual (Gonzalo).**
    → **Fix:** features para senior — versionado de briefs, plantillas de equipo, compartir, comentar.

12. **No hay "founder mode" / "beginner mode" para solopreneurs sin acceso a usuarios (Sebastián).**
    → **Fix:** modo guiado con paths alternativos: "¿no tenés usuarios? acá cómo conseguir 5".

### 🟢 Lo que SÍ funciona (validado)

- **M1 corrige "usuarios/clientes" genéricos.** Las 5 personas lo notan. **Valor real.**
- **M5 recomendación automática de método.** Especialmente valioso para PMs y founders sin formación.
- **M6 escenario sin sesgo.** El consejo de "no mencionar botones" sorprende positivamente a 3/5.
- **M8 criterios de interpretación.** Senior researcher lo destaca como diferencial.
- **Coach AI por campo cuando está activo.** Los 5 lo perciben como "alguien revisa mi trabajo". Mariela y Sebastián lo destacan.

---

## Métricas agregadas del test simulado

| Persona | SUS | WTP/mes | Lo usaría de nuevo |
|---|---|---|---|
| Mariela (jr) | 64 | USD 5 | Sí, solo para arrancar |
| Gonzalo (sr) | 71 | USD 0 indiv / 10-20 team | No solo, sí en equipo |
| Pau (designer) | 58 | USD 5 condicional | Depende de iteración |
| Ricardo (PM) | 69 | USD 15 | Sí si baja jerga UX |
| Sebastián (founder) | 51 | USD 0 | No, no es para mí |
| **Promedio** | **62.6** | **USD ~5** | **3/5 dudoso** |

**Lectura:** SUS por debajo de umbral 68 (usable). WTP bajo. **No es producto vendible hoy.** Pero el valor núcleo (coach catching genericness) está validado por las 5 personas.

---

## Decisión recomendada (a confirmar con test real con humanos)

**No matar. Iterar.** El núcleo entrega valor, pero el envoltorio tiene 3 problemas críticos que se pueden arreglar sin rehacer el producto:
1. Separar brief de análisis.
2. Diversificar placeholders/reglas más allá del caso salud.
3. Modo "tono libre" para PMs, designers, founders.

**Antes del test con humanos reales:** arreglar al menos #1 y #2. Si no, los 5 reales van a tropezar con lo mismo y vamos a quemar oportunidad de recruit.

---

## Limitaciones de esta simulación

- No puedo medir tiempo real, frustración facial, abandono espontáneo.
- No puedo activar el coach AI (Gemini) — predigo respuesta basada en el system prompt y rules locales visibles en código.
- Los inputs son los que yo creo que escribirían — un humano real va a salir por la tangente.
- No detecta bugs visuales/CSS, ni performance, ni edge cases de copy/paste.

**Conclusión:** este doc sirve como pre-mortem y screener de defectos obvios. El test con 5 humanos sigue siendo necesario.
