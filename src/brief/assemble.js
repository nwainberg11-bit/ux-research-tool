// Ensamblado del brief completo a partir del estado (SPEC-V2 §3 cierre).
// Función PURA: state → estructura de brief. Sin DOM. Testeable sola.
//
// Reúne los 8 pasos respetando la trazabilidad: cada objetivo específico
// trae adjuntos su parámetro (paso 5), criterio (paso 6) y preguntas (paso 7).

import { PARAM_BY_ID, SUCCESS_THRESHOLD } from '../source/parameters.js';
import { TEST_TYPE_BY_ID } from '../source/test-types.js';
import { checkBloomVerb } from '../coach/validators/bloom-verb.js';

/**
 * @param {object} state          Snapshot completo del store (getState()).
 * @returns {object}              Brief estructurado, listo para exportar.
 */
export function assembleBrief(state) {
  const s = state?.steps || {};
  const p1 = s['1'] || {};
  const p2 = s['2'] || {};
  const p3 = s['3'] || {};
  const p4 = s['4'] || {};
  const p5 = s['5'] || {};
  const p6 = s['6'] || {};
  const p7 = s['7'] || {};
  const p8 = s['8'] || {};

  const objectives = (Array.isArray(p3.objetivos_especificos) ? p3.objetivos_especificos : [])
    .map((text, idx) => {
      const byObj5 = (p5.byObjective || {})[String(idx)] || {};
      const byObj6 = (p6.byObjective || {})[String(idx)] || {};
      const byObj7 = (p7.byObjective || {})[String(idx)] || {};
      const param = PARAM_BY_ID[byObj5.paramId] || null;
      return {
        idx,
        text: String(text || '').trim(),
        bloomLevel: checkBloomVerb(text || '').levelLabel || null,
        parameter: param ? { id: param.id, label: param.label, measures: param.measures } : null,
        criterion: byObj6.criterion || (param ? param.criterionForm : ''),
        thresholdFixed: param ? param.binary : false,
        questions: (Array.isArray(byObj7.questions) ? byObj7.questions : [])
          .map((q) => String(q || '').trim())
          .filter(Boolean)
      };
    })
    .filter((o) => o.text);

  return {
    meta: {
      version: state?.meta?.version || 'v2',
      generatedAt: new Date().toISOString(),
      thresholdFixed: SUCCESS_THRESHOLD
    },
    problema: {
      quien_que_donde: trim(p1.quien_que_donde),
      por_que: trim(p1.por_que),
      por_que_hipotesis: !!p1.por_que_hipotesis,
      que_provoca: trim(p1.que_provoca),
      evidencia: trim(p1.evidencia),
      paragraph: trim(p1.paragraph)
    },
    alcance: {
      in_scope: trim(p2.in_scope),
      out_scope: trim(p2.out_scope)
    },
    objetivos: {
      general: trim(p3.objetivo_general),
      especificos: objectives
    },
    tipoTest: {
      id: p4.tipo || null,
      label: TEST_TYPE_BY_ID[p4.tipo]?.label || null,
      justificacion: trim(p4.justificacion)
    },
    escenario: {
      contexto_realista: trim(p8.contexto_realista),
      detalles_accionar: trim(p8.detalles_accionar),
      relato: trim(p8.relato)
    },
    completeness: completeness({ p1, p2, p3, p4, objectives, p8 })
  };
}

function trim(v) {
  return String(v ?? '').trim();
}

function completeness({ p1, p2, p3, p4, objectives, p8 }) {
  const required = [
    ['paso_1.quien_que_donde', !!trim(p1.quien_que_donde)],
    ['paso_1.por_que', !!trim(p1.por_que)],
    ['paso_1.que_provoca', !!trim(p1.que_provoca)],
    ['paso_2.in_scope', !!trim(p2.in_scope)],
    ['paso_2.out_scope', !!trim(p2.out_scope)],
    ['paso_3.objetivo_general', !!trim(p3.objetivo_general)],
    ['paso_3.objetivos_especificos', objectives.length >= 1],
    ['paso_4.tipo', !!p4.tipo],
    ['paso_4.justificacion', !!trim(p4.justificacion)],
    // Si no hay objetivos cargados, estos chequeos no se dan por cumplidos
    // (el .every() vacuamente true sobre arr vacío sería deshonesto).
    ['paso_5.parametros', objectives.length > 0 && objectives.every((o) => !!o.parameter)],
    ['paso_6.criterios', objectives.length > 0 && objectives.every((o) => !!trim(o.criterion))],
    ['paso_7.preguntas', objectives.length > 0 && objectives.every((o) => o.questions.length >= 1)],
    ['paso_8.relato', !!trim(p8.relato)]
  ];
  const missing = required.filter(([, ok]) => !ok).map(([k]) => k);
  return {
    total: required.length,
    done: required.length - missing.length,
    missing
  };
}
