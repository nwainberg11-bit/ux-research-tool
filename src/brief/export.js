// Export del brief a Markdown (SPEC-V2 §3 cierre + §6.6 N11).
// Función PURA: briefData → string Markdown. Sin DOM, sin estado.
//
// El brief es el ENTREGABLE del producto. Cierre explícito y visible.
import { completenessLabel } from './completeness-labels.js';

/**
 * @param {ReturnType<import('./assemble.js').assembleBrief>} brief
 * @returns {string} Markdown listo para descargar / copiar.
 */
export function briefToMarkdown(brief) {
  const lines = [];
  lines.push('# Brief de validación de soluciones');
  lines.push('');
  lines.push(
    `_Generado con UX Research Coach ${brief.meta.version} · ${formatDate(
      brief.meta.generatedAt
    )}_`
  );
  lines.push('');

  // Fase 1 · Problema
  lines.push('## Fase 1 · El problema');
  lines.push('');
  if (brief.problema.paragraph) {
    lines.push(brief.problema.paragraph);
    lines.push('');
  }
  pushKV(lines, 'Quién, qué, dónde', brief.problema.quien_que_donde);
  if (brief.problema.por_que) {
    const label = brief.problema.por_que_hipotesis
      ? 'Por qué (hipótesis a validar — causa no validada)'
      : 'Por qué';
    pushKV(lines, label, brief.problema.por_que);
  }
  pushKV(lines, 'Qué provoca', brief.problema.que_provoca);
  pushKV(lines, 'Evidencia', brief.problema.evidencia);
  lines.push('');

  // Fase 2 · Objetivos
  lines.push('## Fase 2 · Los objetivos');
  lines.push('');
  lines.push('### Alcance');
  pushKV(lines, 'In scope', brief.alcance.in_scope);
  pushKV(lines, 'Out of scope', brief.alcance.out_scope);
  lines.push('');

  lines.push('### Objetivos');
  if (brief.objetivos.general) {
    lines.push(`**Objetivo general.** ${brief.objetivos.general}`);
    lines.push('');
  }
  if (brief.objetivos.especificos.length) {
    lines.push('**Objetivos específicos:**');
    brief.objetivos.especificos.forEach((o, i) => {
      const lvl = o.bloomLevel ? ` _(${o.bloomLevel})_` : '';
      lines.push(`${i + 1}. ${o.text}${lvl}`);
    });
    lines.push('');
  }

  lines.push('### Tipo de test');
  if (brief.tipoTest.label) lines.push(`**Tipo:** ${brief.tipoTest.label}`);
  if (brief.tipoTest.justificacion) {
    lines.push('');
    lines.push(brief.tipoTest.justificacion);
  }
  lines.push('');

  // Fase 3 · El test
  lines.push('## Fase 3 · El test');
  lines.push('');
  lines.push('### Trazabilidad por objetivo específico');
  lines.push('');
  if (!brief.objetivos.especificos.length) {
    lines.push('_Sin objetivos específicos cargados._');
    lines.push('');
  } else {
    brief.objetivos.especificos.forEach((o, i) => {
      lines.push(`#### Objetivo ${i + 1}`);
      lines.push('');
      lines.push(`> ${o.text}`);
      lines.push('');
      pushKV(lines, 'Parámetro', o.parameter?.label || '_(sin parámetro asignado)_');
      if (o.criterion) {
        const fixed = o.thresholdFixed
          ? ` _(umbral fijo ${brief.meta.thresholdFixed}%, no editable)_`
          : '';
        pushKV(lines, 'Criterio de éxito', `${o.criterion}${fixed}`);
      }
      if (o.questions.length) {
        lines.push('');
        lines.push('**Preguntas:**');
        o.questions.forEach((q) => lines.push(`- ${q}`));
        lines.push('');
      } else {
        lines.push('');
        lines.push('_Sin preguntas cargadas para este objetivo._');
        lines.push('');
      }
    });
  }

  lines.push('### Escenario');
  pushKV(lines, 'Contexto realista', brief.escenario.contexto_realista);
  pushKV(lines, 'Detalles para accionar', brief.escenario.detalles_accionar);
  if (brief.escenario.relato) {
    lines.push('');
    lines.push('**Relato final:**');
    lines.push('');
    lines.push(`> ${brief.escenario.relato.replace(/\n+/g, '\n> ')}`);
    lines.push('');
  }
  lines.push('_Recordatorio: probá el escenario con alguien interno antes del test real._');
  lines.push('');

  // Completeness
  lines.push('---');
  lines.push('');
  lines.push(
    `**Completitud:** ${brief.completeness.done} / ${brief.completeness.total} requisitos cumplidos.`
  );
  if (brief.completeness.missing.length) {
    lines.push('');
    lines.push('Faltan:');
    brief.completeness.missing.forEach((k) => lines.push(`- ${completenessLabel(k)}`));
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function pushKV(lines, key, value) {
  if (!value) return;
  lines.push(`**${key}.** ${value}`);
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' });
  } catch {
    return iso;
  }
}
