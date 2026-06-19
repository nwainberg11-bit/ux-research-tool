import { describe, it, expect } from 'vitest';
import { assembleBrief } from '../src/brief/assemble.js';
import { briefToMarkdown } from '../src/brief/export.js';

const fullState = {
  meta: { version: '2.0.0-test' },
  steps: {
    '1': {
      quien_que_donde:
        'Usuarios primerizos no logran reservar un turno en menos de 5 minutos en horario pico.',
      por_que: 'El formulario tiene 14 campos sin jerarquía visible.',
      por_que_hipotesis: true,
      que_provoca: '38% de abandono en el paso 2 del funnel.',
      evidencia: 'GA4 funnel paso 1→2 mostrando drop del 38%.',
      paragraph: 'Párrafo integrado editado a mano.'
    },
    '2': {
      in_scope: 'Flujo completo de reserva en mobile web.',
      out_scope: 'Pagos, recordatorios por email, app nativa.'
    },
    '3': {
      objetivo_general: 'Validar si el usuario comprende los pasos para reservar un turno.',
      objetivos_especificos: [
        'Identificar si el usuario reconoce el primer paso del flujo.',
        'Evaluar la claridad del campo de horarios.'
      ]
    },
    '4': {
      tipo: 'moderado',
      justificacion: 'Necesitamos los por qué detrás de las decisiones.'
    },
    '5': {
      byObjective: {
        '0': { paramId: 'encontrabilidad' },
        '1': { paramId: 'percepcion' }
      }
    },
    '6': {
      byObjective: {
        '0': { criterion: 'Que el usuario haga clic en "Empezar". ≥78%.' },
        '1': { criterion: 'Promedio ≥4 en claridad + ¿por qué calificás?' }
      }
    },
    '7': {
      byObjective: {
        '0': { questions: ['¿Qué información usás para decidir por dónde empezar?'] },
        '1': {
          questions: [
            'En una escala del 1 al 5, ¿qué tan clara es la lista de horarios? ¿por qué calificás así?'
          ]
        }
      }
    },
    '8': {
      contexto_realista: 'Jueves a la tarde, recién salís del trabajo.',
      detalles_accionar: 'Ya conocés al profesional y tenés tu cédula a mano.',
      relato: 'Es jueves, querés reservar un turno antes del fin de semana.'
    }
  }
};

describe('assembleBrief', () => {
  it('estado vacío → completitud 0/total y missing == total', () => {
    const b = assembleBrief({ steps: {} });
    expect(b.completeness.done).toBe(0);
    expect(b.completeness.missing.length).toBe(b.completeness.total);
    expect(b.objetivos.especificos).toEqual([]);
  });

  it('estado completo → completeness done == total, sin missing', () => {
    const b = assembleBrief(fullState);
    expect(b.completeness.missing).toEqual([]);
    expect(b.completeness.done).toBe(b.completeness.total);
  });

  it('traza objetivo→parámetro→criterio→preguntas correctamente', () => {
    const b = assembleBrief(fullState);
    expect(b.objetivos.especificos).toHaveLength(2);
    const o0 = b.objetivos.especificos[0];
    expect(o0.parameter.id).toBe('encontrabilidad');
    expect(o0.thresholdFixed).toBe(true);
    expect(o0.questions).toHaveLength(1);
    const o1 = b.objetivos.especificos[1];
    expect(o1.parameter.id).toBe('percepcion');
    expect(o1.thresholdFixed).toBe(false);
  });

  it('detecta nivel Bloom cuando el objetivo arranca con verbo válido', () => {
    const b = assembleBrief(fullState);
    expect(b.objetivos.especificos[0].bloomLevel).toBe('Conocimiento');
    expect(b.objetivos.especificos[1].bloomLevel).toBe('Evaluación');
  });

  it('preserva flag por_que_hipotesis', () => {
    const b = assembleBrief(fullState);
    expect(b.problema.por_que_hipotesis).toBe(true);
  });

  it('filtra objetivos vacíos del paso 3', () => {
    const state = {
      steps: {
        '3': { objetivos_especificos: ['  ', '', 'Identificar algo.', null] }
      }
    };
    const b = assembleBrief(state);
    expect(b.objetivos.especificos.map((o) => o.text)).toEqual(['Identificar algo.']);
  });
});

describe('briefToMarkdown', () => {
  it('incluye las 3 fases, la trazabilidad y el escenario', () => {
    const md = briefToMarkdown(assembleBrief(fullState));
    expect(md).toContain('# Brief de validación de soluciones');
    expect(md).toContain('## Fase 1 · El problema');
    expect(md).toContain('## Fase 2 · Los objetivos');
    expect(md).toContain('## Fase 3 · El test');
    expect(md).toContain('| Objetivo específico | Qué se mide | Criterio de éxito | Tarea o pregunta |');
    expect(md).toContain('Identificar si el usuario reconoce el primer paso del flujo.');
    expect(md).toContain('Encontrabilidad / eficacia');
    expect(md).toContain('78% fijo');
    expect(md).toContain('probá el escenario');
  });

  it('marca "hipótesis a validar" cuando por_que_hipotesis = true', () => {
    const md = briefToMarkdown(assembleBrief(fullState));
    expect(md).toMatch(/Por qué \(hipótesis a validar/);
  });

  it('estado vacío → markdown válido con bloque de faltantes', () => {
    const md = briefToMarkdown(assembleBrief({ steps: {} }));
    expect(md).toContain('# Brief de validación de soluciones');
    expect(md).toMatch(/Faltan:/);
  });
});
