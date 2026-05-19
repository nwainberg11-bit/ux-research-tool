import { describe, it, expect } from 'vitest';
import { detectUIJargon, MIN_SCENARIO_CHARS } from '../src/coach/validators/ui-jargon-detector.js';

const ids = (s) => detectUIJargon(s).hits.map((h) => h.id);

describe('detectUIJargon — escenario', () => {
  it('instrucción de UI', () => {
    const s = 'Entrá a la sección de pagos y hacé clic en confirmar para terminar la compra del producto seleccionado.';
    expect(ids(s)).toContain('instruccion_ui');
  });
  it('anticipa la respuesta', () => {
    const s = 'Queremos ver si encontrás el flujo de pago. Te dejamos la pantalla abierta y vamos a observar tu recorrido.';
    expect(ids(s)).toContain('anticipa_respuesta');
  });
  it('jerga interna del equipo', () => {
    const s = 'Probá la nueva versión del flujo de checkout, vemos cómo te resulta y después conversamos un poco al final.';
    expect(ids(s)).toContain('jerga_interna');
  });
  it('valoración previa', () => {
    const s = 'Imaginá que la app es fácil y querés agendar un turno antes del cierre de la tarde para resolverlo rápido.';
    expect(ids(s)).toContain('valoracion_previa');
  });
  it('menciona elementos de UI (botón, pantalla)', () => {
    const s = 'Te mostramos una pantalla donde hay un botón verde grande. Tu tarea es lograr cerrar la operación rápido.';
    expect(ids(s)).toContain('elemento_ui');
  });
  it('escenario muy corto → flag de longitud', () => {
    const s = 'Estás apurado.';
    const r = detectUIJargon(s);
    expect(r.tooShort).toBe(true);
    expect(r.hits.find((h) => h.id === 'longitud_minima')).toBeTruthy();
  });
  it(`escenario neutro y suficientemente largo (>${MIN_SCENARIO_CHARS} chars) sin UI → sólo length ok`, () => {
    const s = 'Estás en tu casa después del trabajo y querés agendar una consulta con un profesional antes del fin de semana porque necesitás resolverlo cuanto antes.';
    const r = detectUIJargon(s);
    expect(r.tooShort).toBe(false);
    expect(r.hits).toEqual([]);
  });
  it('vacío → sin hits, no tooShort', () => {
    const r = detectUIJargon('');
    expect(r.hits).toEqual([]);
    expect(r.tooShort).toBe(false);
  });
});
