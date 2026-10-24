import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import confetti from 'canvas-confetti';

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#EC4899', '#06B6D4', '#F59E0B', '#10B981'],
    });
  } catch (err) {
    console.warn('Confetti could not be triggered', err);
  }
}

export function downloadPdfBlob(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Merge multiple PDF files into one in client-side memory
 */
export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split PDF pages based on a range string like "1-3, 5, 7-10" or extract individual pages
 */
export async function splitPdfFile(file: File, pageRangeStr: string): Promise<{ bytes: Uint8Array; extractedCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const pagesToInclude = new Set<number>();

  if (!pageRangeStr.trim() || pageRangeStr.trim().toLowerCase() === 'all') {
    for (let i = 0; i < totalPages; i++) pagesToInclude.add(i);
  } else {
    const parts = pageRangeStr.split(',').map((p) => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(totalPages, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            pagesToInclude.add(p - 1);
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          pagesToInclude.add(pageNum - 1);
        }
      }
    }
  }

  const sortedPageIndices = Array.from(pagesToInclude).sort((a, b) => a - b);
  if (sortedPageIndices.length === 0) {
    throw new Error(`No valid pages found in range "${pageRangeStr}". Total pages available: ${totalPages}`);
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, sortedPageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const bytes = await newDoc.save();
  return { bytes, extractedCount: sortedPageIndices.length };
}

/**
 * Convert multiple image files (JPG, PNG, WebP) into a single PDF
 */
export async function imagesToPdf(
  files: File[],
  options: {
    orientation?: 'portrait' | 'landscape';
    margin?: number;
    pageSize?: 'a4' | 'fit';
  } = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const margin = options.margin ?? 20;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const type = file.type.toLowerCase();

    let embeddedImage;
    if (type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      try {
        embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
      } catch {
        const imgBlob = new Blob([arrayBuffer], { type: file.type });
        const imgUrl = URL.createObjectURL(imgBlob);
        const imgElem = new Image();
        imgElem.src = imgUrl;
        await new Promise((resolve) => {
          imgElem.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = imgElem.width;
        canvas.height = imgElem.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(imgElem, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const rawBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
          embeddedImage = await pdfDoc.embedJpg(rawBytes);
        }
        URL.revokeObjectURL(imgUrl);
      }
    }

    if (!embeddedImage) continue;

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let pageWidth = 595.28;
    let pageHeight = 841.89;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else if (options.orientation === 'landscape' || imgWidth > imgHeight) {
      pageWidth = 841.89;
      pageHeight = 595.28;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const maxDrawWidth = pageWidth - margin * 2;
    const maxDrawHeight = pageHeight - margin * 2;

    const scale = Math.min(maxDrawWidth / imgWidth, maxDrawHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const x = margin + (maxDrawWidth - scaledWidth) / 2;
    const y = margin + (maxDrawHeight - scaledHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  return await pdfDoc.save();
}

/**
 * Rotate pages and add customizable text watermark to a PDF
 */
export async function rotateAndWatermarkPdf(
  file: File,
  options: {
    rotationDeg?: number;
    watermarkText?: string;
    opacity?: number;
    fontSize?: number;
    textColor?: string;
    watermarkAngle?: number;
  }
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const rotationDeg = options.rotationDeg || 0;
  const watermarkText = options.watermarkText?.trim();
  const opacity = options.opacity ?? 0.25;
  const fontSize = options.fontSize ?? 44;
  const watermarkAngle = options.watermarkAngle ?? 45;

  let r = 0.4, g = 0.4, b = 0.4;
  if (options.textColor === 'red') { r = 0.9; g = 0.1; b = 0.1; }
  else if (options.textColor === 'blue') { r = 0.1; g = 0.4; b = 0.9; }
  else if (options.textColor === 'emerald') { r = 0.05; g = 0.7; b = 0.4; }
  else if (options.textColor === 'amber') { r = 0.9; g = 0.55; b = 0.1; }

  pages.forEach((page) => {
    if (rotationDeg !== 0) {
      const currentRot = page.getRotation().angle;
      page.setRotation(degrees((currentRot + rotationDeg) % 360));
    }

    if (watermarkText) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(watermarkText, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: fontSize,
        font: font,
        color: rgb(r, g, b),
        opacity: opacity,
        rotate: degrees(watermarkAngle),
      });
    }
  });

  return await pdfDoc.save();
}

/**
 * Text to PDF: Generate professional PDF from raw text
 */
export async function textToPdf(title: string, bodyText: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const usableWidth = pageWidth - margin * 2;
  const lineHeight = 18;
  const bodyFontSize = 11;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  if (title) {
    page.drawText(title, {
      x: margin,
      y: currentY - 24,
      size: 20,
      font: fontBold,
      color: rgb(0.12, 0.16, 0.23),
    });
    currentY -= 48;

    page.drawLine({
      start: { x: margin, y: currentY + 12 },
      end: { x: pageWidth - margin, y: currentY + 12 },
      thickness: 1,
      color: rgb(0.85, 0.88, 0.92),
    });
  }

  const paragraphs = bodyText.split('\n');

  for (const para of paragraphs) {
    if (para.trim() === '') {
      currentY -= lineHeight;
      if (currentY < margin + 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, bodyFontSize);

      if (testWidth > usableWidth && currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: bodyFontSize,
          font: fontRegular,
          color: rgb(0.2, 0.25, 0.33),
        });
        currentY -= lineHeight;

        if (currentY < margin + 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      page.drawText(currentLine, {
        x: margin,
        y: currentY,
        size: bodyFontSize,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.33),
      });
      currentY -= lineHeight;

      if (currentY < margin + 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
    }
  }

  return await pdfDoc.save();
}

/**
 * Edit and sanitize PDF metadata
 */
export async function updatePdfMetadata(
  file: File,
  meta: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
  }
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  if (meta.title !== undefined) pdfDoc.setTitle(meta.title);
  if (meta.author !== undefined) pdfDoc.setAuthor(meta.author);
  if (meta.subject !== undefined) pdfDoc.setSubject(meta.subject);
  if (meta.keywords !== undefined) {
    pdfDoc.setKeywords(meta.keywords.split(',').map((k) => k.trim()));
  }
  if (meta.creator !== undefined) pdfDoc.setCreator(meta.creator || 'Chetna Vikas PDF Suite');
  if (meta.producer !== undefined) pdfDoc.setProducer(meta.producer || 'Chetna Vikas Client Engine');

  return await pdfDoc.save();
}

/**
 * Inspect page count of a PDF file quickly
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (err) {
    console.error('Error inspecting page count', err);
    return 1;
  }
}
