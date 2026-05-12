// Netlify Function — coach.js
// Proxy entre el HTML y Gemini API.
// La GEMINI_API_KEY vive en las variables de entorno de Netlify — nunca llega al cliente.

exports.handler = async (event) => {
  // Solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key no configurada en Netlify. Agregá GEMINI_API_KEY en Environment Variables.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body inválido' }) };
  }

  const { prompt, systemPrompt } = body;
  if (!prompt) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Falta el campo prompt' }) };
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: systemPrompt
        ? { parts: [{ text: systemPrompt }] }
        : undefined,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error de Gemini', detail: errText })
      };
    }

    const data = await response.json();

    // Extraer texto de la respuesta de Gemini
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Intentar parsear como JSON (viene con responseMimeType: application/json)
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Si no parsea, devolvemos el texto crudo para que el cliente lo maneje
      parsed = { raw };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno', detail: err.message })
    };
  }
};
