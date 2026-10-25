import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Copy,
  PlusCircle,
  RotateCw,
  Trash2,
  ArrowUp,
  ArrowDown,
  Trash,
  Check,
  X,
  ExternalLink,
  Plus,
} from 'lucide-react';
import type { AnnotationItem, OperationId } from '../../types/workspace';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPageToCanvas } from '../../utils/pdfRenderer';

interface StudioContinuousViewportProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  activeOperation: OperationId | null;
  annotations: AnnotationItem[];
  onAddAnnotation: (ann: AnnotationItem) => void;
  onUpdateAnnotation: (ann: AnnotationItem) => void;
  onRemoveAnnotation: (id: string) => void;
  onRotatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onDuplicatePage: (pageIndex: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onInsertBlankPage: (pageIndex: number) => void;
  onApplyChanges: () => void;
  scale: number;
}

export const StudioContinuousViewport: React.FC<StudioContinuousViewportProps> = ({
  pdfDoc,
  activeOperation,
  annotations,
  onAddAnnotation,
  onUpdateAnnotation,
  onRemoveAnnotation,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
  onInsertBlankPage,
  onApplyChanges,
  scale = 1.15,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
  const [pageDimensions, setPageDimensions] = useState<{ [key: number]: { width: number; height: number } }>({});

  // Active inline text editing state
  const [activeTextId, setActiveTextId] = useState<string | null>(null);

  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPageIndex, setDrawingPageIndex] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);

  // Render all pages in the PDF into their respective canvas elements
  const renderAllPages = useCallback(async () => {
    if (!pdfDoc) return;
    const numPages = pdfDoc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const canvas = canvasRefs.current[pageNum - 1];
      if (!canvas) continue;

      try {
        await renderPageToCanvas(pdfDoc, pageNum, scale, canvas);
        setPageDimensions((prev) => ({
          ...prev,
          [pageNum - 1]: { width: canvas.width, height: canvas.height },
        }));
      } catch (err) {
        console.error(`Error rendering page ${pageNum}`, err);
      }
    }
  }, [pdfDoc, scale]);

  useEffect(() => {
    renderAllPages();
  }, [renderAllPages]);

  // Handle clicking on page to add text/whiteout/stamp
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeOperation === 'add-text') {
      const newId = `text-${Date.now()}`;
      const newAnn: AnnotationItem = {
        id: newId,
        type: 'text',
        pageIndex,
        x: Math.max(2, Math.min(85, xPct)),
        y: Math.max(2, Math.min(95, yPct)),
        text: 'Type text here',
        fontSize: 14,
        color: '#1e293b',
      };
      onAddAnnotation(newAnn);
      setActiveTextId(newId);
    } else if (activeOperation === 'whiteout') {
      const newAnn: AnnotationItem = {
        id: `whiteout-${Date.now()}`,
        type: 'whiteout',
        pageIndex,
        x: Math.max(2, xPct - 5),
        y: Math.max(2, yPct - 2),
        width: 15,
        height: 4,
        fillColor: '#ffffff',
      };
      onAddAnnotation(newAnn);
    } else if (activeOperation === 'shapes') {
      const newAnn: AnnotationItem = {
        id: `shape-${Date.now()}`,
        type: 'shape',
        pageIndex,
        x: Math.max(2, xPct - 8),
        y: Math.max(2, yPct - 4),
        width: 16,
        height: 8,
        color: '#ec4899',
        strokeWidth: 2,
        fillColor: 'transparent',
        shapeType: 'rectangle',
      };
      onAddAnnotation(newAnn);
    }
  };

  // Freehand drawing handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, pageIndex: number) => {
    if (activeOperation !== 'annotate') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setDrawingPageIndex(pageIndex);
    setCurrentPoints([{ x: xPct, y: yPct }]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || activeOperation !== 'annotate' || drawingPageIndex === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentPoints((prev) => [...prev, { x: xPct, y: yPct }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing || drawingPageIndex === null) return;
    setIsDrawing(false);

    if (currentPoints.length > 1) {
      onAddAnnotation({
        id: `draw-${Date.now()}`,
        type: 'drawing',
        pageIndex: drawingPageIndex,
        x: 0,
        y: 0,
        points: currentPoints,
        color: '#ec4899',
        strokeWidth: 3,
      });
    }
    setDrawingPageIndex(null);
    setCurrentPoints([]);
  };

  const numPages = pdfDoc?.numPages || 0;
  const pageNumbers = Array.from({ length: numPages }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gradient-to-b from-[#fdf8fa] via-[#fbf2f6] to-[#f7ecf2] overflow-y-auto relative flex flex-col items-center justify-start py-8 px-4 sm:px-6 min-h-[600px]"
    >
      {/* 8D Ambient Glow Behind Document */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subheader */}
      <div className="text-center mb-6 space-y-1 select-none relative z-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Online PDF{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
            editor
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Edit PDF files for free. Fill & sign PDF
        </p>
      </div>

      {/* Pages Container - Continuous Vertical Stack */}
      <div className="w-full flex flex-col items-center space-y-8 pb-32 relative z-10">
        {pageNumbers.map((pageIdx) => {
          const dims = pageDimensions[pageIdx] || { width: 595 * scale, height: 842 * scale };
          const pageAnnotations = annotations.filter((a) => a.pageIndex === pageIdx);

          return (
            <React.Fragment key={pageIdx}>
              <div
                className="flex flex-col items-center"
                style={{ width: dims.width ? `${dims.width}px` : 'auto' }}
              >
                {/* Inline Page Toolbar with Pink Accents */}
                <div className="w-full flex items-center justify-between pb-1.5 px-1 text-xs text-slate-600 font-medium select-none">
                  {/* Left: Page Number */}
                  <span className="font-extrabold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md text-xs shadow-2xs">
                    Page {pageIdx + 1}
                  </span>

                  {/* Right: Page Actions */}
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-pink-200/80 rounded-lg px-2 py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => onDuplicatePage(pageIdx)}
                      className="p-1 hover:bg-pink-50 rounded text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                      title="Duplicate page"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onInsertBlankPage(pageIdx)}
                      className="p-1 hover:bg-pink-50 rounded text-pink-600 transition-colors cursor-pointer"
                      title="Insert page after this"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRotatePage(pageIdx)}
                      className="p-1 hover:bg-pink-50 rounded text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                      title="Rotate page 90° clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeletePage(pageIdx)}
                      className="p-1 hover:bg-rose-50 rounded text-rose-600 transition-colors cursor-pointer"
                      title="Delete this page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {pageIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => onMovePage(pageIdx, pageIdx - 1)}
                        className="p-1 hover:bg-pink-50 rounded text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                        title="Move page up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {pageIdx < numPages - 1 && (
                      <button
                        type="button"
                        onClick={() => onMovePage(pageIdx, pageIdx + 1)}
                        className="p-1 hover:bg-pink-50 rounded text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                        title="Move page down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Page Canvas Container with 8D Realistic Shadow */}
                <div
                  className="relative bg-white shadow-xl shadow-pink-900/10 border border-pink-100 rounded-sm select-none"
                  style={{
                    width: dims.width ? `${dims.width}px` : 'auto',
                    height: dims.height ? `${dims.height}px` : 'auto',
                  }}
                  onClick={(e) => handlePageClick(e, pageIdx)}
                >
                  {/* Native PDF Canvas */}
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[pageIdx] = el;
                    }}
                    className="block w-full h-full"
                  />

                  {/* Interactive Annotation Layer */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, pageIdx)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className={`absolute inset-0 z-20 ${
                      activeOperation === 'annotate'
                        ? 'cursor-crosshair'
                        : activeOperation === 'add-text'
                        ? 'cursor-text'
                        : 'cursor-default'
                    }`}
                  >
                    {/* SVG Layer for Drawing Paths */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {pageAnnotations
                        .filter((a) => a.type === 'drawing' || a.type === 'highlight')
                        .map((ann) => {
                          if (!ann.points || ann.points.length < 2) return null;
                          const pathStr = ann.points
                            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${(p.x / 100) * dims.width} ${(p.y / 100) * dims.height}`)
                            .join(' ');

                          return (
                            <path
                              key={ann.id}
                              d={pathStr}
                              stroke={ann.color || '#ec4899'}
                              strokeWidth={ann.strokeWidth || 3}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                              opacity={ann.type === 'highlight' ? 0.45 : (ann.opacity ?? 1)}
                            />
                          );
                        })}

                      {/* Currently in-progress stroke */}
                      {isDrawing && drawingPageIndex === pageIdx && currentPoints.length > 1 && (
                        <path
                          d={currentPoints
                            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${(p.x / 100) * dims.width} ${(p.y / 100) * dims.height}`)
                            .join(' ')}
                          stroke="#ec4899"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      )}
                    </svg>

                    {/* Overlay Elements (Text, Whiteout, Signatures, Shapes) */}
                    {pageAnnotations.map((ann) => {
                      if (ann.type === 'drawing' || ann.type === 'highlight') return null;

                      const isSelectedText = activeTextId === ann.id;

                      return (
                        <div
                          key={ann.id}
                          className="absolute group"
                          style={{
                            left: `${ann.x}%`,
                            top: `${ann.y}%`,
                            width: ann.width ? `${ann.width}%` : 'auto',
                            height: ann.height ? `${ann.height}%` : 'auto',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (ann.type === 'text') setActiveTextId(ann.id);
                          }}
                        >
                          {/* Floating inline format toolbar for selected text */}
                          {ann.type === 'text' && isSelectedText && (
                            <div
                              className="absolute -top-10 left-0 bg-white border border-pink-300 rounded-lg shadow-xl px-2.5 py-1 flex items-center gap-1.5 z-40 text-xs select-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={ann.fontSize || 14}
                                onChange={(e) =>
                                  onUpdateAnnotation({ ...ann, fontSize: Number(e.target.value) })
                                }
                                className="border border-pink-200 rounded px-1 text-xs py-0.5 bg-white text-slate-700 font-semibold cursor-pointer"
                              >
                                <option value={10}>10</option>
                                <option value={12}>12</option>
                                <option value={14}>14</option>
                                <option value={18}>18</option>
                                <option value={24}>24</option>
                                <option value={32}>32</option>
                              </select>

                              {/* Text Color Picker */}
                              <input
                                type="color"
                                value={ann.color || '#1e293b'}
                                onChange={(e) => onUpdateAnnotation({ ...ann, color: e.target.value })}
                                className="w-5 h-5 rounded border border-pink-200 cursor-pointer"
                                title="Text color"
                              />

                              <button
                                type="button"
                                onClick={() => onRemoveAnnotation(ann.id)}
                                className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                                title="Delete text box"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveTextId(null)}
                                className="p-1 hover:bg-pink-50 text-pink-600 rounded cursor-pointer"
                                title="Done editing"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Hover Delete Button for non-text */}
                          {ann.type !== 'text' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveAnnotation(ann.id);
                              }}
                              className="absolute -top-3 -right-3 z-30 p-1 rounded-full bg-rose-600 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                              title="Delete item"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}

                          {/* Whiteout Redaction Box */}
                          {ann.type === 'whiteout' && (
                            <div
                              className="w-full h-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: ann.fillColor || '#ffffff' }}
                            />
                          )}

                          {/* Interactive Text Input Box */}
                          {ann.type === 'text' && (
                            <div className="relative">
                              <input
                                type="text"
                                value={ann.text || ''}
                                autoFocus={isSelectedText}
                                onChange={(e) => onUpdateAnnotation({ ...ann, text: e.target.value })}
                                onFocus={() => setActiveTextId(ann.id)}
                                className={`px-2 py-0.5 outline-none rounded bg-transparent ${
                                  isSelectedText
                                    ? 'border-2 border-pink-500 bg-white/95 shadow-md shadow-pink-500/20'
                                    : 'border border-transparent hover:border-pink-300'
                                }`}
                                style={{
                                  fontSize: `${ann.fontSize || 14}px`,
                                  color: ann.color || '#1e293b',
                                  fontWeight: 500,
                                }}
                              />
                            </div>
                          )}

                          {/* Shapes */}
                          {ann.type === 'shape' && (
                            <div
                              className="w-full h-full"
                              style={{
                                borderWidth: `${ann.strokeWidth || 2}px`,
                                borderColor: ann.color || '#ec4899',
                                borderStyle: 'solid',
                                backgroundColor: ann.fillColor || 'transparent',
                                borderRadius: ann.shapeType === 'ellipse' ? '50%' : '2px',
                              }}
                            />
                          )}

                          {/* Signatures or Images */}
                          {(ann.type === 'signature' || ann.type === 'image') && ann.imageDataUrl && (
                            <img
                              src={ann.imageDataUrl}
                              alt="Signature Stamp"
                              className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
                            />
                          )}

                          {/* Links */}
                          {ann.type === 'link' && (
                            <div className="w-full h-full border border-purple-400 bg-purple-50/40 p-1 text-[10px] text-purple-700 flex items-center gap-1 font-semibold">
                              <ExternalLink className="w-3 h-3" />
                              <span>{ann.text || ann.linkUrl}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* In-Between Page Button: + Insert page here */}
              <div className="w-full flex items-center justify-center my-3 select-none">
                <button
                  type="button"
                  onClick={() => onInsertBlankPage(pageIdx)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-pink-600 hover:bg-white border border-dashed border-pink-300 hover:border-pink-500 transition-all cursor-pointer shadow-sm hover:scale-105"
                >
                  <Plus className="w-3.5 h-3.5 text-pink-500" />
                  <span>Insert page here</span>
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Floating 8D Bottom Gradient Action Button: Apply changes > */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
        <button
          type="button"
          onClick={onApplyChanges}
          className="flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 active:scale-95 text-white font-black text-base rounded-2xl shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all cursor-pointer hover:scale-105 animate-pulse-glow"
        >
          <span>Apply changes</span>
          <span className="font-black text-xl leading-none">&gt;</span>
        </button>
      </div>
    </div>
  );
};
