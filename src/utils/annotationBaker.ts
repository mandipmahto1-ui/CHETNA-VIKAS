import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { AnnotationItem } from '../types/workspace';

/**
 * Bakes canvas annotations (Text, Shapes, Whiteout, Signatures, Drawings, Images) into PDF pages
 */
export async function bakeAnnotationsIntoPdf(
  sourceBytes: Uint8Array,
  annotations: AnnotationItem[]
): Promise<Uint8Array> {
  if (annotations.length === 0) return sourceBytes;

  const pdfDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  for (const ann of annotations) {
    if (ann.pageIndex < 0 || ann.pageIndex >= pages.length) continue;
    const page = pages[ann.pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Coordinates: from top-left percentage/pixels to PDF bottom-left coordinates
    const x = (ann.x / 100) * pageWidth;
    const y = pageHeight - (ann.y / 100) * pageHeight - (ann.height ? (ann.height / 100) * pageHeight : 0);
    const boxW = ann.width ? (ann.width / 100) * pageWidth : 100;
    const boxH = ann.height ? (ann.height / 100) * pageHeight : 30;

    switch (ann.type) {
      case 'whiteout': {
        // Redact mask box (white or black)
        const isBlack = ann.fillColor === '#000000' || ann.fillColor === 'black';
        page.drawRectangle({
          x,
          y,
          width: boxW,
          height: boxH,
          color: isBlack ? rgb(0, 0, 0) : rgb(1, 1, 1),
          opacity: 1,
        });
        break;
      }

      case 'text': {
        if (ann.text) {
          const fontSize = ann.fontSize || 12;
          const { r, g, b } = parseHexColor(ann.color || '#1e293b');
          page.drawText(ann.text, {
            x,
            y: y + boxH - fontSize,
            size: fontSize,
            font: fontRegular,
            color: rgb(r, g, b),
          });
        }
        break;
      }

      case 'shape': {
        const { r, g, b } = parseHexColor(ann.color || '#4f46e5');
        const fill = ann.fillColor && ann.fillColor !== 'transparent' ? parseHexColor(ann.fillColor) : null;
        const borderWidth = ann.strokeWidth || 2;

        if (ann.shapeType === 'ellipse') {
          page.drawEllipse({
            x: x + boxW / 2,
            y: y + boxH / 2,
            xScale: boxW / 2,
            yScale: boxH / 2,
            borderColor: rgb(r, g, b),
            borderWidth,
            color: fill ? rgb(fill.r, fill.g, fill.b) : undefined,
            opacity: ann.opacity ?? 1,
          });
        } else if (ann.shapeType === 'line' || ann.shapeType === 'arrow') {
          page.drawLine({
            start: { x, y: y + boxH },
            end: { x: x + boxW, y },
            thickness: borderWidth,
            color: rgb(r, g, b),
            opacity: ann.opacity ?? 1,
          });
        } else {
          // Rectangle
          page.drawRectangle({
            x,
            y,
            width: boxW,
            height: boxH,
            borderColor: rgb(r, g, b),
            borderWidth,
            color: fill ? rgb(fill.r, fill.g, fill.b) : undefined,
            opacity: ann.opacity ?? 1,
          });
        }
        break;
      }

      case 'signature':
      case 'image': {
        if (ann.imageDataUrl) {
          try {
            const raw = Uint8Array.from(atob(ann.imageDataUrl.split(',')[1]), (c) => c.charCodeAt(0));
            const isPng = ann.imageDataUrl.includes('png');
            const embedded = isPng ? await pdfDoc.embedPng(raw) : await pdfDoc.embedJpg(raw);
            page.drawImage(embedded, {
              x,
              y,
              width: boxW,
              height: boxH,
              opacity: ann.opacity ?? 1,
            });
          } catch (e) {
            console.warn('Could not embed signature/image', e);
          }
        }
        break;
      }

      case 'link': {
        // Draw dashed or highlighted link box
        page.drawRectangle({
          x,
          y,
          width: boxW,
          height: boxH,
          borderColor: rgb(0.2, 0.4, 0.9),
          borderWidth: 1,
          color: rgb(0.85, 0.9, 1),
          opacity: 0.25,
        });
        if (ann.linkUrl) {
          page.drawText(`🔗 ${ann.linkUrl}`, {
            x: x + 2,
            y: y + 3,
            size: 7,
            font: fontRegular,
            color: rgb(0.1, 0.3, 0.8),
          });
        }
        break;
      }

      case 'highlight':
      case 'drawing': {
        if (ann.points && ann.points.length > 1) {
          const { r, g, b } = parseHexColor(ann.color || (ann.type === 'highlight' ? '#fde047' : '#ef4444'));
          const thickness = ann.strokeWidth || (ann.type === 'highlight' ? 14 : 2);
          const opacity = ann.type === 'highlight' ? 0.45 : (ann.opacity ?? 1);

          for (let pIdx = 0; pIdx < ann.points.length - 1; pIdx++) {
            const p1 = ann.points[pIdx];
            const p2 = ann.points[pIdx + 1];
            page.drawLine({
              start: { x: (p1.x / 100) * pageWidth, y: pageHeight - (p1.y / 100) * pageHeight },
              end: { x: (p2.x / 100) * pageWidth, y: pageHeight - (p2.y / 100) * pageHeight },
              thickness,
              color: rgb(r, g, b),
              opacity,
            });
          }
        }
        break;
      }
    }
  }

  return await pdfDoc.save();
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
}
