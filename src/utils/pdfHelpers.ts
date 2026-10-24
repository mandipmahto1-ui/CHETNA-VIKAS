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
  const opacity = options.opacity ?? 0.35;
  const watermarkAngle = options.watermarkAngle ?? 45;

  let r = 0.3, g = 0.3, b = 0.3;
  if (options.textColor === 'red') { r = 0.85; g = 0.15; b = 0.15; }
  else if (options.textColor === 'blue') { r = 0.15; g = 0.4; b = 0.9; }
  else if (options.textColor === 'emerald') { r = 0.05; g = 0.65; b = 0.35; }
  else if (options.textColor === 'amber') { r = 0.9; g = 0.55; b = 0.1; }

  pages.forEach((page) => {
    // 1. Apply Rotation
    if (rotationDeg !== 0) {
      const currentRot = page.getRotation().angle;
      page.setRotation(degrees((currentRot + rotationDeg) % 360));
    }

    // 2. Apply Watermark Overlay
    if (watermarkText) {
      const { width, height } = page.getSize();
      // Responsive font size relative to page dimensions
      const effectiveFontSize = options.fontSize || Math.max(32, Math.min(72, Math.round(width * 0.075)));
      const textWidth = font.widthOfTextAtSize(watermarkText, effectiveFontSize);
      const textHeight = font.heightAtSize(effectiveFontSize);

      // Trigonometric centering calculation for text rotated at arbitrary angle around its origin
      const rad = (watermarkAngle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x = width / 2 - (textWidth / 2) * cos + (textHeight / 2) * sin;
      const y = height / 2 - (textWidth / 2) * sin - (textHeight / 2) * cos;

      page.drawText(watermarkText, {
        x,
        y,
        size: effectiveFontSize,
        font,
        color: rgb(r, g, b),
        opacity: Math.max(0.2, opacity),
        rotate: degrees(watermarkAngle),
      });
    }
  });

  return await pdfDoc.save();
}

/**
 * Add page numbers to each page of a PDF
 */
export async function addPageNumbersToPdf(
  file: File,
  options: {
    format?: 'page_of_total' | 'simple' | 'bates';
    position?: 'bottom-center' | 'bottom-right' | 'top-right';
    prefix?: string;
  } = {}
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;
  const format = options.format || 'page_of_total';
  const position = options.position || 'bottom-center';
  const prefix = options.prefix || '';

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const pageNum = idx + 1;
    let text = `${pageNum}`;
    if (format === 'page_of_total') {
      text = `Page ${pageNum} of ${total}`;
    } else if (format === 'bates') {
      text = `${prefix}${String(pageNum).padStart(5, '0')}`;
    }

    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = width / 2 - textWidth / 2;
    let y = 25;

    if (position === 'bottom-right') {
      x = width - textWidth - 35;
      y = 25;
    } else if (position === 'top-right') {
      x = width - textWidth - 35;
      y = height - 35;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.25, 0.3),
    });
  });

  return await pdfDoc.save();
}

/**
 * Remove specific pages from a PDF document
 */
export async function removePagesFromPdf(
  file: File,
  pagesToRemoveStr: string
): Promise<{ bytes: Uint8Array; removedCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const toRemove = new Set<number>();
  const parts = pagesToRemoveStr.split(',').map((p) => p.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
          if (p >= 1 && p <= totalPages) toRemove.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) toRemove.add(p - 1);
    }
  }

  if (toRemove.size === 0) {
    throw new Error('Please specify valid page numbers to remove (e.g. 1, 3 or 2-4).');
  }

  if (toRemove.size >= totalPages) {
    throw new Error('You cannot remove all pages from the document.');
  }

  // Remove from highest index to lowest so indices do not shift
  const sortedDesc = Array.from(toRemove).sort((a, b) => b - a);
  for (const idx of sortedDesc) {
    pdfDoc.removePage(idx);
  }

  const bytes = await pdfDoc.save();
  return { bytes, removedCount: sortedDesc.length };
}

/**
 * Crop margins from all pages of a PDF
 */
export async function cropPdfPages(
  file: File,
  marginPt: number = 30
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const safeMarginX = Math.min(marginPt, width * 0.35);
    const safeMarginY = Math.min(marginPt, height * 0.35);

    page.setCropBox(
      safeMarginX,
      safeMarginY,
      width - safeMarginX * 2,
      height - safeMarginY * 2
    );
  });

  return await pdfDoc.save();
}

/**
 * Flatten form fields and interactive annotations
 */
export async function flattenPdfDocument(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  try {
    const form = pdfDoc.getForm();
    form.flatten();
  } catch (e) {
    // form might not exist or be empty
  }
  return await pdfDoc.save();
}

/**
 * Compress and optimize PDF file structure
 */
export async function compressPdfFile(
  file: File
): Promise<{ bytes: Uint8Array; origSize: number; newSize: number; percent: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const origSize = file.size;
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Strip non-essential document metadata to reduce size
  try {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
  } catch (e) {
    // ignore
  }

  const bytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
  const newSize = bytes.length;
  const percent = origSize > newSize ? Math.round(((origSize - newSize) / origSize) * 100) : 0;

  return { bytes, origSize, newSize, percent };
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
