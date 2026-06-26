// Captura el elemento .brief-doc como imagen con html2canvas y lo pagina en A4.
// La tipografía y el diseño son exactamente los del browser — no hay jsPDF manual.
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PW = 595.28; // A4 pt
const PH = 841.89;
const M  = 28;     // margen

/**
 * @param {HTMLElement} element — el nodo .brief-doc ya renderizado en el DOM
 * @returns {Promise<Blob>}
 */
export async function briefToPdf(element) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#111111', // --bg-2
    scale: 2,                   // resolución retina
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
  });

  const imgData  = canvas.toDataURL('image/jpeg', 0.93);
  const doc      = new jsPDF({ unit: 'pt', format: 'a4', compress: true });

  const contentW = PW - M * 2;
  const contentH = PH - M * 2;
  const imgH     = (canvas.height / canvas.width) * contentW;
  const pages    = Math.ceil(imgH / contentH);

  for (let i = 0; i < pages; i++) {
    if (i > 0) doc.addPage();
    // Rellenar fondo oscuro
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, PW, PH, 'F');
    // Posicionar la imagen (desplazando hacia arriba en cada página)
    doc.addImage(imgData, 'JPEG', M, M - i * contentH, contentW, imgH);
  }

  return doc.output('blob');
}
