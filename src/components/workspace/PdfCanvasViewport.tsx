import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { AnnotationItem, OperationId } from '../../types/workspace';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPageToCanvas } from '../../utils/pdfRenderer';

interface PdfCanvasViewportProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  currentPageIndex: number;
  totalPages: number;
  activeOperation: OperationId | null;
  annotations: AnnotationItem[];
  onAddAnnotation: (ann: AnnotationItem) => void;
  onRemoveAnnotation: (id: string) => void;
  onSelectPage: (index: number) => void;
  drawToolColor?: string;
  drawStrokeWidth?: number;
}

export const PdfCanvasViewport: React.FC<PdfCanvasViewportProps> = ({
  pdfDoc,
  currentPageIndex,
  totalPages,
  activeOperation,
  annotations,
  onAddAnnotation,
  onRemoveAnnotation,
  onSelectPage,
  drawToolColor = '#ef4444',
  drawStrokeWidth = 3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState<number>(1.25);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 800,
  });

  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);

  // Render current PDF page whenever pdfDoc, currentPageIndex, or scale changes
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      const pageNumber = currentPageIndex + 1;
      const targetCanvas = canvasRef.current;
      await renderPageToCanvas(pdfDoc, pageNumber, scale, targetCanvas);
      setCanvasDimensions({
        width: targetCanvas.width,
        height: targetCanvas.height,
      });
    } catch (err) {
      console.error('Error rendering page in viewport', err);
    }
  }, [pdfDoc, currentPageIndex, scale]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Handle freehand pen / highlighter mouse events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeOperation !== 'annotate') return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setCurrentPoints([{ x: xPct, y: yPct }]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activeOperation !== 'annotate') return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentPoints((prev) => [...prev, { x: xPct, y: yPct }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 1) {
      onAddAnnotation({
        id: `ann-${Date.now()}`,
        type: 'drawing',
        pageIndex: currentPageIndex,
        x: 0,
        y: 0,
        points: currentPoints,
        color: drawToolColor,
        strokeWidth: drawStrokeWidth,
      });
    }
    setCurrentPoints([]);
  };

  // Zoom controls
  const handleZoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.25).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));
  const handleFitWidth = () => {
    if (containerRef.current) {
      const containerW = containerRef.current.clientWidth - 80;
      const calculated = +(containerW / 600).toFixed(2);
      setScale(Math.max(0.6, Math.min(2.0, calculated)));
    }
  };

  const currentPageAnnotations = annotations.filter((a) => a.pageIndex === currentPageIndex);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-slate-100/70 overflow-auto relative flex flex-col items-center justify-start p-4 sm:p-8"
    >
      {/* Top Floating Viewport Control Bar */}
      <div className="sticky top-2 z-30 mb-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-200/50 rounded-2xl px-3 py-1.5 flex items-center gap-2 select-none text-xs font-semibold text-slate-700">
        {/* Page Pagination */}
        <button
          type="button"
          disabled={currentPageIndex <= 0}
          onClick={() => onSelectPage(currentPageIndex - 1)}
          className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs px-2">
          Page {currentPageIndex + 1} of {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPageIndex >= totalPages - 1}
          onClick={() => onSelectPage(currentPageIndex + 1)}
          className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        {/* Zoom Controls */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="font-mono text-[11px] w-12 text-center text-slate-600">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleFitWidth}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Fit to Width"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center PDF Render & Canvas Overlay Container */}
      <div
        className="relative shadow-2xl rounded-sm transition-all duration-150 border border-slate-300/80 bg-white"
        style={{
          width: canvasDimensions.width || 'auto',
          height: canvasDimensions.height || 'auto',
        }}
      >
        {/* Native PDF.js Canvas */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{ imageRendering: 'auto' }}
        />

        {/* Interactive Annotation & Drawing Layer */}
        <div
          ref={overlayRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute inset-0 z-20 ${
            activeOperation === 'annotate' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        >
          {/* Render SVG Drawing Paths (Pen & Highlighter) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {currentPageAnnotations
              .filter((a) => a.type === 'drawing' || a.type === 'highlight')
              .map((ann) => {
                if (!ann.points || ann.points.length < 2) return null;
                const pathStr = ann.points
                  .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${(p.x / 100) * canvasDimensions.width} ${(p.y / 100) * canvasDimensions.height}`)
                  .join(' ');

                return (
                  <path
                    key={ann.id}
                    d={pathStr}
                    stroke={ann.color || '#ef4444'}
                    strokeWidth={ann.strokeWidth || 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity={ann.type === 'highlight' ? 0.45 : (ann.opacity ?? 1)}
                  />
                );
              })}

            {/* Currently In-Progress Drawing Path */}
            {isDrawing && currentPoints.length > 1 && (
              <path
                d={currentPoints
                  .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${(p.x / 100) * canvasDimensions.width} ${(p.y / 100) * canvasDimensions.height}`)
                  .join(' ')}
                stroke={drawToolColor}
                strokeWidth={drawStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </svg>

          {/* Render Interactive Overlay Elements (Whiteout, Text, Shapes, Signatures, Links) */}
          {currentPageAnnotations.map((ann) => {
            if (ann.type === 'drawing' || ann.type === 'highlight') return null;

            return (
              <div
                key={ann.id}
                className="absolute group select-none"
                style={{
                  left: `${ann.x}%`,
                  top: `${ann.y}%`,
                  width: ann.width ? `${ann.width}%` : 'auto',
                  height: ann.height ? `${ann.height}%` : 'auto',
                }}
              >
                {/* Delete button on hover */}
                <button
                  type="button"
                  onClick={() => onRemoveAnnotation(ann.id)}
                  className="absolute -top-3 -right-3 z-30 p-1 rounded-full bg-rose-600 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                  title="Remove annotation"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>

                {/* Whiteout Redaction Box */}
                {ann.type === 'whiteout' && (
                  <div
                    className="w-full h-full border border-slate-300"
                    style={{
                      backgroundColor: ann.fillColor || '#ffffff',
                    }}
                  />
                )}

                {/* Text Box */}
                {ann.type === 'text' && (
                  <div
                    className="px-2 py-1 rounded-sm border border-dashed border-indigo-400/60 bg-white/70"
                    style={{
                      fontSize: `${ann.fontSize || 14}px`,
                      color: ann.color || '#0f172a',
                      fontWeight: 600,
                    }}
                  >
                    {ann.text}
                  </div>
                )}

                {/* Shape */}
                {ann.type === 'shape' && (
                  <div
                    className="w-full h-full"
                    style={{
                      borderWidth: `${ann.strokeWidth || 2}px`,
                      borderColor: ann.color || '#4f46e5',
                      borderStyle: 'solid',
                      backgroundColor: ann.fillColor || 'transparent',
                      borderRadius: ann.shapeType === 'ellipse' ? '50%' : '4px',
                    }}
                  />
                )}

                {/* Image or Signature Stamp */}
                {(ann.type === 'signature' || ann.type === 'image') && ann.imageDataUrl && (
                  <img
                    src={ann.imageDataUrl}
                    alt="Stamp"
                    className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                  />
                )}

                {/* Hyperlink Bounding Box */}
                {ann.type === 'link' && (
                  <a
                    href={ann.linkUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full block border-2 border-dashed border-blue-500 bg-blue-100/30 p-1 text-[10px] text-blue-700 font-bold hover:bg-blue-100/50 transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {ann.text || ann.linkUrl}
                    </span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
