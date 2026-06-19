import { describe, it, expect } from 'vitest';
import { assembleBrief } from '../src/brief/assemble.js';
import { briefToPdf } from '../src/brief/export-pdf.js';

const fullState = {
  meta: { version: '2.0.0-test' },
  steps: {
    '1': {
      quien_que_donde: 'Usuarios primerizos no logran reservar un turno en menos de 5 minutos.',
      por_que: 'El formulario tiene 14 campos sin jerarquía visible.',
      que_provoca: '38% de abandono en el paso 2 del funnel.',
      evidencia: 'GA4 funnel paso 1→2 mostrando drop del 38%.',
      paragraph: 'Párrafo integrado editado a mano.'
    },
    '2': { in_scope: 'Flujo completo de reserva en mobile web.', out_scope: 'Pagos, app nativa.' },
    '3': {
      objetivo_general: 'Validar si el usuario comprende los pasos para reservar un turno.',
      objetivos_especificos: ['Identificar si el usuario reconoce el primer paso del flujo.']
    },
    '4': { tipo: 'moderado', justificacion: 'Necesitamos los por qué detrás de las decisiones.' },
    '5': { byObjective: { '0': { paramId: 'encontrabilidad' } } },
    '6': { byObjective: { '0': { criterion: 'Que el usuario haga clic en "Empezar". ≥78%.' } } },
    '7': { byObjective: { '0': { questions: ['¿Dónde tocarías para empezar?'] } } },
    '8': {
      contexto_realista: 'Es lunes a la mañana.',
      detalles_accionar: 'Ya tenés tu cédula a mano.',
      relato: 'Querés reservar un turno antes de salir a trabajar.'
    }
  }
};

describe('briefToPdf', () => {
  it('genera un PDF válido y no vacío', () => {
    const blob = briefToPdf(assembleBrief(fullState));
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe('application/pdf');
  });

  it('no rompe con estado vacío', () => {
    const blob = briefToPdf(assembleBrief({ steps: {} }));
    expect(blob.size).toBeGreaterThan(0);
  });
});
