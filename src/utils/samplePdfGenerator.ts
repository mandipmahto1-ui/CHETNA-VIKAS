import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateRichSamplePdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // Page 1: Executive Cover & Overview
  const page1 = doc.addPage([595.28, 841.89]);
  
  // Decorative top banner
  page1.drawRectangle({
    x: 0,
    y: 750,
    width: 595.28,
    height: 92,
    color: rgb(0.31, 0.27, 0.89), // Indigo 600
  });

  page1.drawText('CHETNA VIKAS PDF STUDIO', {
    x: 48,
    y: 800,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Executive Sample Document • In-Browser Interactive Test Suite', {
    x: 48,
    y: 775,
    size: 11,
    font: fontRegular,
    color: rgb(0.85, 0.9, 1),
  });

  page1.drawText('1. Document Assembly & Page Management', {
    x: 48,
    y: 700,
    size: 16,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.24),
  });

  page1.drawText(
    'This sample document contains 4 comprehensive pages specifically designed for testing client-side PDF capabilities:\n• Page Reordering, Page Insertion, and Page Deletion\n• Margin Cropping, Header/Footer Bates Stamping, and High-fidelity Watermarking\n• In-place text annotations, whiteout redaction, digital signatures, and shape layers.',
    {
      x: 48,
      y: 640,
      size: 11,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.42),
      lineHeight: 18,
    }
  );

  // Stat Callout Boxes
  page1.drawRectangle({
    x: 48,
    y: 500,
    width: 235,
    height: 80,
    color: rgb(0.95, 0.96, 1),
    borderColor: rgb(0.79, 0.82, 0.98),
    borderWidth: 1,
  });

  page1.drawText('TOTAL OPERATIONS', {
    x: 64,
    y: 555,
    size: 9,
    font: fontBold,
    color: rgb(0.38, 0.35, 0.82),
  });
  page1.drawText('30 Seamless Tools', {
    x: 64,
    y: 525,
    size: 18,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.24),
  });

  page1.drawRectangle({
    x: 312,
    y: 500,
    width: 235,
    height: 80,
    color: rgb(0.94, 0.99, 0.96),
    borderColor: rgb(0.65, 0.92, 0.75),
    borderWidth: 1,
  });

  page1.drawText('CLIENT ARCHITECTURE', {
    x: 328,
    y: 555,
    size: 9,
    font: fontBold,
    color: rgb(0.08, 0.58, 0.32),
  });
  page1.drawText('100% Zero Server Delay', {
    x: 328,
    y: 525,
    size: 18,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.24),
  });

  // Page 2: Tabular Data for Excel & AI Extraction Testing
  const page2 = doc.addPage([595.28, 841.89]);
  page2.drawText('2. Tabular Data & Financial Summary', {
    x: 48,
    y: 790,
    size: 18,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.24),
  });

  page2.drawText('This table can be converted to Excel (.xlsx) or summarized with the AI Summarizer tool:', {
    x: 48,
    y: 765,
    size: 11,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.48),
  });

  // Draw Table header
  page2.drawRectangle({
    x: 48,
    y: 710,
    width: 499,
    height: 28,
    color: rgb(0.93, 0.94, 0.98),
  });
  page2.drawText('Quarter', { x: 60, y: 720, size: 10, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  page2.drawText('Documents Processed', { x: 140, y: 720, size: 10, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  page2.drawText('Bandwidth Saved', { x: 300, y: 720, size: 10, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  page2.drawText('Status', { x: 440, y: 720, size: 10, font: fontBold, color: rgb(0.2, 0.25, 0.35) });

  const rows = [
    { q: 'Q1 2026', docs: '14,250 PDFs', saved: '182.4 GB', st: 'Completed' },
    { q: 'Q2 2026', docs: '28,910 PDFs', saved: '344.8 GB', st: 'Completed' },
    { q: 'Q3 2026', docs: '46,120 PDFs', saved: '512.0 GB', st: 'In Progress' },
    { q: 'Q4 2026', docs: '68,400 PDFs', saved: '790.5 GB', st: 'Projected' },
  ];

  rows.forEach((r, idx) => {
    const y = 675 - idx * 30;
    page2.drawLine({
      start: { x: 48, y: y + 24 },
      end: { x: 547, y: y + 24 },
      thickness: 0.5,
      color: rgb(0.85, 0.88, 0.92),
    });
    page2.drawText(r.q, { x: 60, y, size: 10, font: fontRegular, color: rgb(0.15, 0.2, 0.25) });
    page2.drawText(r.docs, { x: 140, y, size: 10, font: fontRegular, color: rgb(0.15, 0.2, 0.25) });
    page2.drawText(r.saved, { x: 300, y, size: 10, font: fontRegular, color: rgb(0.15, 0.2, 0.25) });
    page2.drawText(r.st, { x: 440, y, size: 10, font: fontBold, color: r.st === 'Completed' ? rgb(0.1, 0.6, 0.3) : rgb(0.3, 0.3, 0.8) });
  });

  // Page 3: Presentation & Markup Slide
  const page3 = doc.addPage([595.28, 841.89]);
  page3.drawText('3. Annotation, Signature & Redaction Testbed', {
    x: 48,
    y: 790,
    size: 18,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.24),
  });

  page3.drawText('Test the in-place editing tools right on this section:', {
    x: 48,
    y: 765,
    size: 11,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.48),
  });

  // Redaction Target Box
  page3.drawRectangle({
    x: 48,
    y: 650,
    width: 499,
    height: 70,
    color: rgb(0.99, 0.95, 0.95),
    borderColor: rgb(0.95, 0.75, 0.75),
    borderWidth: 1,
  });

  page3.drawText('CONFIDENTIAL SECTION (Use Whiteout Tool to Redact)', {
    x: 60,
    y: 695,
    size: 10,
    font: fontBold,
    color: rgb(0.85, 0.2, 0.2),
  });
  page3.drawText('Account Number: 9842-1049-3829-9481 | Secret PIN: 4829', {
    x: 60,
    y: 672,
    size: 11,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Signature line box
  page3.drawRectangle({
    x: 48,
    y: 480,
    width: 499,
    height: 120,
    color: rgb(0.98, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  page3.drawText('AUTHORIZED SIGNATURE AREA', {
    x: 60,
    y: 575,
    size: 10,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.55),
  });
  page3.drawLine({
    start: { x: 60, y: 515 },
    end: { x: 320, y: 515 },
    thickness: 1,
    color: rgb(0.4, 0.45, 0.55),
  });
  page3.drawText('Sign here using the Add Signature tool (draw, type, or upload)', {
    x: 60,
    y: 498,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.55, 0.65),
  });

  // Page 4: Appendix & Multi-language Verification
  const page4 = doc.addPage([595.28, 841.89]);
  page4.drawText('4. Appendix & Document Verification', {
    x: 48,
    y: 790,
    size: 18,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.24),
  });

  page4.drawText(
    'Chetna Vikas PDF Studio was developed to give individuals, educators, and enterprise users\nunrivaled speed, zero server costs, and complete privacy.\n\nAll 30 PDF operations execute natively in your browser using modern WebAssembly, Canvas rendering,\nand client-side cryptographic and document assembly algorithms.\n\nThank you for choosing Chetna Vikas!',
    {
      x: 48,
      y: 740,
      size: 11,
      font: fontRegular,
      color: rgb(0.3, 0.35, 0.45),
      lineHeight: 18,
    }
  );

  return await doc.save();
}
