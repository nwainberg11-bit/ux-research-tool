# UX Research Coach — Deploy en Netlify

## Estructura del proyecto

```
/
├── index.html                  ← la herramienta
├── netlify.toml                ← config de Netlify
└── netlify/
    └── functions/
        └── coach.js            ← proxy a Gemini (la key vive acá, invisible al usuario)
```

## Cómo deployar

### 1. Conseguir API key de Gemini (gratis)
- Entrá a https://aistudio.google.com
- Creá un proyecto y generá una API key
- Guardala, la vas a necesitar en el paso 3

### 2. Subir a Netlify
Dos opciones:

**Opción A — drag & drop (más simple)**
1. Zipear esta carpeta completa
2. Ir a https://netlify.com → New site → Deploy manually
3. Arrastrar el zip

**Opción B — desde GitHub (recomendado para updates)**
1. Subir esta carpeta a un repo de GitHub
2. En Netlify: New site → Import from Git → elegir el repo
3. Build settings: dejar todo vacío (no hay build step)

### 3. Agregar la API key como variable de entorno
1. En Netlify, ir a **Site configuration → Environment variables**
2. Agregar:
   - Key: `GEMINI_API_KEY`
   - Value: tu API key de Google AI Studio
3. Hacer redeploy (Site overview → Deploys → Trigger deploy)

### 4. Listo
La herramienta va a estar en la URL que te asigna Netlify (algo como `https://nombre-random.netlify.app`).
Podés configurar un dominio personalizado desde Site configuration → Domain management.

## Cómo funciona la AI

- El usuario hace clic en "◈ Evaluar" en cualquier campo
- El HTML llama a `/.netlify/functions/coach` (tu backend)
- La función toma la GEMINI_API_KEY del entorno y llama a Gemini 2.0 Flash
- El resultado llega al coach panel del usuario
- La key nunca sale del servidor → el usuario nunca la ve

Si Gemini falla o no está configurado, la herramienta cae a las reglas locales (sigue funcionando).

## Límites del plan gratuito de Gemini
- 1500 requests/día con Gemini 2.0 Flash
- Suficiente para uso normal post LinkedIn

## Límites del plan gratuito de Netlify
- 125.000 function invocations/mes
- 100 GB de bandwidth/mes
- Suficiente para una herramienta de nicho en LinkedIn
