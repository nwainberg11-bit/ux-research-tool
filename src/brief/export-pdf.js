import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PW = 595.28; // A4 pt
const PH = 841.89;
const M  = 36;     // page margin
const CW = PW - M * 2;

// Palette — matches styles.css
const BG   = [10,  10,  10];
const BG2  = [22,  22,  22];
const BORD = [42,  42,  42];
const LIME = [212, 240, 100];
const T1   = [240, 240, 240];
const T2   = [160, 160, 160];
const T3   = [96,  96,  96];
const OK   = [74,  222, 128];
const WARN = [250, 204, 21];
const ERR  = [248, 113, 113];

let _doc;

function fillBg() {
  _doc.setFillColor(...BG);
  _doc.rect(0, 0, PW, PH, 'F');
}

function addPage() {
  _doc.addPage();
  fillBg();
}

function ensure(y, needed = 20) {
  if (y + needed > PH - M) {
    addPage();
    return M;
  }
  return y;
}

function drawText(text, x, y, { sz = 10.5, col = T1, bold = false, maxW } = {}) {
  if (!text) return y;
  _doc.setFont('helvetica', bold ? 'bold' : 'normal');
  _doc.setFontSize(sz);
  _doc.setTextColor(...col);
  const lh = sz * 1.5;
  const mw = maxW ?? (PW - x - M);
  for (const line of _doc.splitTextToSize(String(text), mw)) {
    y = ensure(y, lh);
    _doc.text(line, x, y);
    y += lh;
  }
  return y;
}

function kicker(label, y) {
  y = ensure(y, 32);
  _doc.setFont('helvetica', 'bold');
  _doc.setFontSize(7.5);
  _doc.setTextColor(...LIME);
  _doc.text(label, M, y);
  y += 8;
  _doc.setDrawColor(...LIME);
  _doc.setLineWidth(0.4);
  _doc.line(M, y, PW - M, y);
  return y + 14;
}

function kv(key, value, y) {
  if (!value) return y;
  y = ensure(y, 26);
  _doc.setFont('helvetica', 'bold');
  _doc.setFontSize(8);
  _doc.setTextColor(...T3);
  _doc.text(key.toUpperCase(), M, y);
  y += 13; // key line height (8pt * 1.5) + small gap
  y = drawText(value, M, y, { sz: 9.5, col: T2 });
  return y + 8;
}

/**
 * @param {ReturnType<import('./assemble.js').assembleBrief>} brief
 * @returns {Blob}
 */
export function briefToPdf(brief) {
  _doc = new jsPDF({ unit: 'pt', format: 'a4' });
  fillBg();
  let y = M + 14;

  // ── Header ────────────────────────────────────────────────────────────
  _doc.setFont('helvetica', 'bold');
  _doc.setFontSize(8);
  _doc.setTextColor(...LIME);
  _doc.text('UX RESEARCH COACH', M, y);
  y += 12;

  _doc.setFont('helvetica', 'normal');
  _doc.setFontSize(22);
  _doc.setTextColor(...T1);
  _doc.text('Brief de validaci\xf3n de soluciones', M, y);
  y += 26;

  _doc.setFont('helvetica', 'normal');
  _doc.setFontSize(8);
  _doc.setTextColor(...T3);
  _doc.text(
    `Generado con UX Research Coach ${brief.meta.version} · ${formatDate(brief.meta.generatedAt)}`,
    M, y
  );
  y += 16;

  _doc.setDrawColor(...BORD);
  _doc.setLineWidth(0.5);
  _doc.line(M, y, PW - M, y);
  y += 22;

  // ── FASE 1: El problema ───────────────────────────────────────────────
  y = kicker('FASE 1 · EL PROBLEMA', y);

  if (brief.problema.paragraph) {
    y = drawText(brief.problema.paragraph, M, y, { sz: 10.5, col: T1, bold: true });
    y += 10;
  }
  if (brief.problema.por_que_hipotesis) {
    y = drawText('[!] Causa marcada como hip\xf3tesis a validar (no validada con discovery previo).', M, y, { sz: 9, col: WARN });
    y += 6;
  }
  y = kv('Qui\xe9n, qu\xe9, d\xf3nde', brief.problema.quien_que_donde, y);
  y = kv('Por qu\xe9', brief.problema.por_que, y);
  y = kv('Qu\xe9 provoca', brief.problema.que_provoca, y);
  y = kv('Evidencia', brief.problema.evidencia, y);
  y += 14;

  // ── FASE 2: Objetivos ─────────────────────────────────────────────────
  y = kicker('FASE 2 · LOS OBJETIVOS', y);

  y = kv('In scope', brief.alcance.in_scope, y);
  y = kv('Out of scope', brief.alcance.out_scope, y);

  if (brief.objetivos.general) {
    y += 6;
    y = drawText(`Objetivo general: ${brief.objetivos.general}`, M, y, { sz: 10.5, col: T1, bold: true });
    y += 8;
  }

  brief.objetivos.especificos.forEach((o, i) => {
    const bloom = o.bloomLevel ? `  (${o.bloomLevel})` : '';
    y = drawText(`${i + 1}. ${o.text}${bloom}`, M, y, { sz: 9.5, col: T2 });
    y += 3;
  });

  if (brief.tipoTest.label) {
    y += 8;
    y = drawText(`Tipo de test: ${brief.tipoTest.label}`, M, y, { sz: 10, col: T1, bold: true });
    if (brief.tipoTest.justificacion) {
      y += 2;
      y = drawText(brief.tipoTest.justificacion, M, y, { sz: 9.5, col: T2 });
    }
  }
  y += 16;

  // ── FASE 3: El test ───────────────────────────────────────────────────
  y = kicker('FASE 3 · EL TEST', y);

  if (brief.objetivos.especificos.length) {
    const rows = brief.objetivos.especificos.flatMap((o) => {
      const bloom = o.bloomLevel ? ` (${o.bloomLevel})` : '';
      const param = o.parameter?.label || '—';
      const fixed = o.thresholdFixed ? ' (78% fijo)' : '';
      const crit  = o.criterion ? `${o.criterion}${fixed}` : '—';
      const qs    = o.questions.length ? o.questions : ['—'];
      return qs.map((q) => [`${o.text}${bloom}`, param, crit, q || '—']);
    });

    autoTable(_doc, {
      startY: y,
      margin: { left: M, right: M },
      head: [['Objetivo espec\xedfico', 'Qu\xe9 se mide', 'Criterio de \xe9xito', 'Tarea / Pregunta']],
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 6,
        textColor: T2,
        fillColor: BG2,
        lineColor: BORD,
        lineWidth: 0.4,
      },
      headStyles: {
        fillColor: LIME,
        textColor: BG,
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: 0,
      },
      alternateRowStyles: {
        fillColor: BG,
      },
      didAddPage: () => fillBg(),
    });
    y = _doc.lastAutoTable.finalY + 20;
  } else {
    y = drawText('Sin objetivos especificos cargados.', M, y, { sz: 9, col: T3 });
    y += 20;
  }

  // ── Escenario ─────────────────────────────────────────────────────────
  y = ensure(y, 50);
  y = kicker('ESCENARIO', y);

  y = kv('Contexto realista', brief.escenario.contexto_realista, y);
  y = kv('Detalles para accionar', brief.escenario.detalles_accionar, y);

  if (brief.escenario.relato) {
    y += 6;
    const relato = `"${brief.escenario.relato}"`;
    _doc.setFontSize(10.5);
    const relaLines = _doc.splitTextToSize(relato, CW - 16);
    const relaH = relaLines.length * 10.5 * 1.5 + 10;
    // Lime left accent line (drawn before text so it sits behind)
    _doc.setDrawColor(...LIME);
    _doc.setLineWidth(2.5);
    _doc.line(M, y - 10, M, y - 10 + relaH);
    y = drawText(relato, M + 14, y, { sz: 10.5, col: T1, maxW: CW - 16 });
    y += 10;
  }

  y += 4;
  y = drawText('Recordatorio: proba el escenario con alguien interno antes del test real.', M, y, { sz: 8.5, col: T3 });
  y += 18;

  // ── Completitud ───────────────────────────────────────────────────────
  y = ensure(y, 60);
  y = kicker('COMPLETITUD', y);

  const pct = brief.completeness.total > 0
    ? Math.round((brief.completeness.done / brief.completeness.total) * 100)
    : 0;
  const barCol = pct >= 80 ? OK : pct >= 50 ? WARN : ERR;

  y = drawText(
    `${brief.completeness.done} / ${brief.completeness.total} requisitos cumplidos (${pct}%)`,
    M, y, { sz: 10, col: barCol, bold: true }
  );
  y += 10;

  _doc.setFillColor(...BORD);
  _doc.roundedRect(M, y, CW, 5, 2, 2, 'F');
  if (pct > 0) {
    _doc.setFillColor(...barCol);
    _doc.roundedRect(M, y, Math.max(8, CW * (pct / 100)), 5, 2, 2, 'F');
  }

  return _doc.output('blob');
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' });
  } catch {
    return iso;
  }
}
