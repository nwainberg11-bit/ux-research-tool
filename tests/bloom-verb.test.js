import { describe, it, expect } from 'vitest';
import { checkBloomVerb } from '../src/coach/validators/bloom-verb.js';
import { BLOOM_LEVELS } from '../src/source/bloom.js';

describe('checkBloomVerb', () => {
  it('verbo válido nivel Conocimiento', () => {
    const r = checkBloomVerb('Identificar los pasos que el usuario sigue para reservar.');
    expect(r.hasBloomVerb).toBe(true);
    expect(r.levelId).toBe('conocimiento');
  });
  it('verbo válido nivel Evaluación', () => {
    const r = checkBloomVerb('Evaluar si el usuario logra comprender el costo total.');
    expect(r.levelId).toBe('evaluacion');
  });
  it('verbo válido con tilde y mayúscula', () => {
    const r = checkBloomVerb('Diseñar un flujo alternativo.');
    expect(r.hasBloomVerb).toBe(true);
    expect(r.levelId).toBe('sintesis');
  });
  it('verbo NO de Bloom → hasBloomVerb=false con mensaje', () => {
    const r = checkBloomVerb('Mejorar la experiencia del usuario.');
    expect(r.hasBloomVerb).toBe(false);
    expect(r.verb).toBe('Mejorar');
  });
  it('vacío → hasBloomVerb=false con mensaje guía', () => {
    const r = checkBloomVerb('   ');
    expect(r.hasBloomVerb).toBe(false);
    expect(r.message).toMatch(/Bloom/);
  });
  it('todos los verbos del catálogo son detectados como su nivel declarado', () => {
    for (const lvl of BLOOM_LEVELS) {
      for (const v of lvl.verbs) {
        const r = checkBloomVerb(`${v} algo concreto del producto.`);
        expect(r.hasBloomVerb, `${v} debería ser verbo Bloom`).toBe(true);
        expect(r.levelId, `${v} → nivel ${lvl.id}`).toBe(lvl.id);
      }
    }
  });
});
