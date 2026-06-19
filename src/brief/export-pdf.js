// Export del brief a PDF (texto real, no captura de pantalla).
// Función PURA: briefData → jsPDF doc. Mismo shape que export.js (briefToMarkdown),
// para que ambos formatos no se desincronicen entre sí.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MARGIN = 40;
const PAGE_WIDTH = 595.28; // A4 en pt
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/**
 * @param {ReturnType<import('./assemble.js').assembleBrief>} brief
 * @returns {Blob} PDF listo para adjuntar o descargar.
 */
export function briefToPdf(brief) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  const ensureSpace = (lineHeight) => {
    if (y + lineHeight > 800) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const heading = (text, size = 14) => {
    ensureSpace(size + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.text(text, MARGIN, y);
    y += size + 10;
  };

  const paragraph = (text, opts = {}) => {
    if (!text) return;
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(opts.size || 10.5);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    lines.forEach((line) => {
      ensureSpace(14);
      doc.text(line, MARGIN, y);
      y += 14;
    });
    y += 6;
  };

  const kv = (key, value) => {
    if (!value) return;
    paragraph(`${key}: ${value}`);
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Brief de validación de soluciones', MARGIN, y);
  y += 22;
  paragraph(`Generado con UX Research Coach ${brief.meta.version} · ${formatDate(brief.meta.generatedAt)}`, {
    size: 9
  });

  heading('Fase 1 · El problema');
  paragraph(brief.problema.paragraph, { bold: true });
  if (brief.problema.por_que_hipotesis) {
    paragraph('⚠ Causa marcada como hipótesis a validar (no validada con discovery previo).');
  }
  kv('Quién, qué, dónde', brief.problema.quien_que_donde);
  kv('Por qué', brief.problema.por_que);
  kv('Qué provoca', brief.problema.que_provoca);
  kv('Evidencia', brief.problema.evidencia);

  heading('Fase 2 · Los objetivos');
  kv('In scope', brief.alcance.in_scope);
  kv('Out of scope', brief.alcance.out_scope);
  if (brief.objetivos.general) paragraph(`Objetivo general: ${brief.objetivos.general}`, { bold: true });
  brief.objetivos.especificos.forEach((o, i) => {
    paragraph(`${i + 1}. ${o.text}${o.bloomLevel ? ` (${o.bloomLevel})` : ''}`);
  });
  if (brief.tipoTest.label) {
    paragraph(`Tipo de test: ${brief.tipoTest.label}`, { bold: true });
    paragraph(brief.tipoTest.justificacion);
  }

  heading('Fase 3 · El test');
  if (brief.objetivos.especificos.length) {
    const rows = brief.objetivos.especificos.flatMap((o) => {
      const lvl = o.bloomLevel ? ` (${o.bloomLevel})` : '';
      const param = o.parameter?.label || '(sin parámetro)';
      const fixed = o.thresholdFixed ? ' (78% fijo)' : '';
      const criterion = o.criterion ? `${o.criterion}${fixed}` : '(sin criterio)';
      const questions = o.questions.length ? o.questions : [''];
      return questions.map((q) => [`${o.text}${lvl}`, param, criterion, q || 'Sin preguntas cargadas.']);
    });
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [['Objetivo específico', 'Qué se mide', 'Criterio de éxito', 'Tarea o pregunta']],
      body: rows,
      styles: { fontSize: 8.5, cellPadding: 5 },
      headStyles: { fillColor: [20, 20, 20] }
    });
    y = doc.lastAutoTable.finalY + 16;
  } else {
    paragraph('Sin objetivos específicos cargados.');
  }

  heading('Escenario', 12);
  kv('Contexto realista', brief.escenario.contexto_realista);
  kv('Detalles para accionar', brief.escenario.detalles_accionar);
  if (brief.escenario.relato) paragraph(`"${brief.escenario.relato}"`, { size: 10.5 });
  paragraph('Recordatorio: probá el escenario con alguien interno antes del test real.', { size: 9 });

  heading(`Completitud: ${brief.completeness.done} / ${brief.completeness.total} requisitos cumplidos`, 11);

  return doc.output('blob');
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' });
  } catch {
    return iso;
  }
}
