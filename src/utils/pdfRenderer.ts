import * as pdfjsLib from 'pdfjs-dist';

// Configure worker to use official CDN matching version to ensure no build/worker packaging issues
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  // Use unpkg worker URL corresponding to pdfjs version or fallback
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
}

export interface RenderedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * Loads a PDF from ArrayBuffer or Uint8Array and returns the PDFDocumentProxy
 */
export async function loadPdfDocument(data: ArrayBuffer | Uint8Array) {
  const loadingTask = pdfjsLib.getDocument({
    data: data instanceof Uint8Array ? data : new Uint8Array(data),
    cMapUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/**
 * Render a single page to a canvas
 */
export async function renderPageToCanvas(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 1.0,
  targetCanvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = targetCanvas || document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d canvas context');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvas: canvas,
  };

  await page.render(renderContext).promise;
  return canvas;
}

/**
 * Generate thumbnail data URL for a specific page
 */
export async function renderPageThumbnail(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  maxWidth: number = 200
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const defaultViewport = page.getViewport({ scale: 1.0 });
  const scale = maxWidth / defaultViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');
  if (!context) return '';

  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Extract all text from PDF across all pages
 */
export async function extractTextFromPdf(pdfDoc: pdfjsLib.PDFDocumentProxy): Promise<{
  fullText: string;
  pagesText: { pageNumber: number; text: string }[];
}> {
  const totalPages = pdfDoc.numPages;
  const pagesText: { pageNumber: number; text: string }[] = [];
  let fullText = '';

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageStr = textContent.items
      // @ts-expect-error item has str property
      .map((item) => (item.str ? item.str : ''))
      .join(' ');

    pagesText.push({ pageNumber: i, text: pageStr });
    fullText += `--- Page ${i} ---\n${pageStr}\n\n`;
  }

  return { fullText, pagesText };
}
