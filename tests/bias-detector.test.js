import { describe, it, expect } from 'vitest';
import { detectBias } from '../src/coach/validators/bias-detector.js';

const idsOf = (q) => detectBias(q).map((h) => h.id);

describe('detectBias — 7 sesgos cognitivos', () => {
  it('afecto: "¿te parece fácil X?"', () => {
    expect(idsOf('¿Te parece fácil el flujo?')).toContain('afecto');
  });
  it('confirmación: "qué te pareció la solución que te dimos"', () => {
    expect(idsOf('¿Qué te pareció la solución que te dimos?')).toContain('confirmacion');
  });
  it('ancla: escala con connotación en extremos', () => {
    expect(
      idsOf('Califica en una escala donde 1 es muy bueno y 5 es horrible.')
    ).toContain('ancla');
  });
  it('disponibilidad: "¿con qué frecuencia…?"', () => {
    expect(idsOf('¿Con qué frecuencia entrás a la sección?')).toContain('disponibilidad');
  });
  it('representatividad: edad/género sin justificación', () => {
    expect(idsOf('¿Qué edad tenés?')).toContain('representatividad');
  });
  it('halo: estética en vez de funcional', () => {
    expect(idsOf('¿Qué impresión te da?')).toContain('halo');
  });
  it('proyección: comportamiento futuro', () => {
    expect(idsOf('¿La próxima vez la usarías?')).toContain('proyeccion');
  });
});

describe('detectBias — 6 malas prácticas', () => {
  it('cerrada sí/no', () => {
    expect(idsOf('¿Te queda claro?')).toContain('cerrada');
  });
  it('elemento_ui en pregunta', () => {
    expect(idsOf('¿Encontrás el botón de pago?')).toContain('elementos_ui');
  });
  it('pistas_ui en tarea', () => {
    expect(idsOf('Andá a la sección de configuración.')).toContain('pistas_ui');
  });
  it('sin_seguimiento: escala 1 a 5 sin "por qué calificás"', () => {
    expect(idsOf('Calificá la claridad en una escala del 1 al 5.')).toContain('sin_seguimiento');
  });
});

describe('detectBias — bugs corregidos de v1', () => {
  it('doble_pregunta: dos preguntas separadas con "y" sí marcan', () => {
    expect(idsOf('¿Qué hiciste primero? y ¿qué hiciste después?')).toContain('doble_pregunta');
  });
  it('doble_pregunta: seguimiento legítimo "y por qué calificás" NO marca', () => {
    const hits = idsOf('Calificá la claridad de 1 a 5 y por qué calificás con esa nota.');
    expect(hits).not.toContain('doble_pregunta');
  });
  it('sin_seguimiento: escala con "por qué calificás" NO marca', () => {
    const hits = idsOf('En una escala del 1 al 5, ¿qué tan clara es? ¿por qué calificás así?');
    expect(hits).not.toContain('sin_seguimiento');
  });
  it('recordación: "te acordás" marca', () => {
    expect(idsOf('¿Te acordás qué decía la pantalla anterior?')).toContain('recordacion');
  });
  it('recordación: "récord" NO debe matchear (word boundary)', () => {
    // "récord" no contiene "recordás"/"acordás" como palabra completa.
    expect(idsOf('Tu récord es alto.')).not.toContain('recordacion');
  });
});

describe('detectBias — limpios', () => {
  it('pregunta funcional bien formulada → 0 hits', () => {
    const q = '¿Qué información usás para decidir si comprar este producto?';
    expect(detectBias(q)).toEqual([]);
  });
  it('vacío o whitespace → 0 hits', () => {
    expect(detectBias('')).toEqual([]);
    expect(detectBias('   ')).toEqual([]);
  });
});
