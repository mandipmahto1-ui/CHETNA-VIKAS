import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Download,
  Languages,
} from 'lucide-react';
import type { OperationId, AnnotationItem, DocumentSnapshot } from '../../types/workspace';
import { PDF_OPERATIONS } from '../../data/operationsData';
import { DynamicIcon } from '../DynamicIcon';
import { summarizeDocumentText, translateDocumentText, type AiSummaryResult, type TranslationResult } from '../../utils/aiProcessing';
import { triggerConfetti } from '../../utils/pdfHelpers';

interface ContextualToolDrawerProps {
  operationId: OperationId | null;
  currentPageIndex: number;
  totalPages: number;
  onClose: () => void;
  // Execution callbacks
  onRotate: (deg: number, scope: 'current' | 'all') => void;
  onDeletePages: (pages: number[]) => void;
  onInsertPage: (position: 'before' | 'after', isBlank: boolean, file?: File) => void;
  onCropMargins: (marginPt: number) => void;
  onAddPageNumbers: (format: 'page_of_total' | 'simple' | 'bates', position: 'bottom-center' | 'bottom-right' | 'top-right') => void;
  onCompress: (level: 'extreme' | 'recommended' | 'low') => void;
  onProtectPdf: (password: string, restrictPermissions: boolean) => void;
  onUnlockPdf: (password: string) => void;
  onFindReplace: (find: string, replaceWith: string) => void;
  onExportWord: () => void;
  onExportPptx: () => void;
  onExportExcel: () => void;
  onExportJpgZip: () => void;
  onConvertOfficeToPdf: (file: File) => void;
  onConvertImagesToPdf: (files: File[]) => void;
  onMergeWithFiles: (files: File[]) => void;
  onSplitPages: (rangeStr: string) => void;
  onAddAnnotation: (ann: AnnotationItem) => void;
  historyStack: DocumentSnapshot[];
  historyIndex: number;
  onRestoreHistory: (index: number) => void;
  extractedDocumentText: string;
}

export const ContextualToolDrawer: React.FC<ContextualToolDrawerProps> = ({
  operationId,
  currentPageIndex,
  totalPages,
  onClose,
  onRotate,
  onDeletePages,
  onInsertPage,
  onCropMargins,
  onAddPageNumbers,
  onCompress,
  onProtectPdf,
  onUnlockPdf,
  onFindReplace,
  onExportWord,
  onExportPptx,
  onExportExcel,
  onExportJpgZip,
  onConvertOfficeToPdf,
  onConvertImagesToPdf,
  onMergeWithFiles,
  onSplitPages,
  onAddAnnotation,
  historyStack,
  historyIndex,
  onRestoreHistory,
  extractedDocumentText,
}) => {
  if (!operationId) return null;

  const operation = PDF_OPERATIONS.find((op) => op.id === operationId);

  // Operation specific local states
  // #1 Merge
  const [mergeFilesList, setMergeFilesList] = useState<File[]>([]);
  // #2 Split
  const [splitRange, setSplitRange] = useState<string>('1');
  // #4 Delete
  const [selectedDeletePages, setSelectedDeletePages] = useState<number[]>([currentPageIndex]);
  // #5 Rotate
  const [rotateDeg, setRotateDeg] = useState<number>(90);
  const [rotateScope, setRotateScope] = useState<'current' | 'all'>('current');
  // #6 Insert Page
  const [insertPos, setInsertPos] = useState<'before' | 'after'>('after');
  // #7 Crop
  const [cropMargin, setCropMargin] = useState<number>(30);
  // #8 Page Numbers
  const [pnFormat, setPnFormat] = useState<'page_of_total' | 'simple' | 'bates'>('page_of_total');
  const [pnPos, setPnPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  // #9 Compress
  const [compressLevel, setCompressLevel] = useState<'extreme' | 'recommended' | 'low'>('recommended');
  // #18 Protect
  const [protectPassword, setProtectPassword] = useState<string>('');
  const [restrictPerms, setRestrictPerms] = useState<boolean>(true);
  // #19 Unlock
  const [unlockPassword, setUnlockPassword] = useState<string>('');
  // #20 AI Summarizer
  const [aiSummary, setAiSummary] = useState<AiSummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  // #21 Translate
  const [targetLang, setTargetLang] = useState<string>('hi');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  // #22 Add Text
  const [customText, setCustomText] = useState<string>('Sample Text');
  const [textSize, setTextSize] = useState<number>(16);
  const [textColor, setTextColor] = useState<string>('#1e293b');
  // #23 Find Replace
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [replaceTerm, setReplaceTerm] = useState<string>('');
  // #24 Add Links
  const [linkUrl, setLinkUrl] = useState<string>('https://');
  const [linkLabel, setLinkLabel] = useState<string>('Clickable Link');
  // #25 Add Image Stamp
  const stampOpacity = 1;
  // #26 Signature
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw');
  const [typedSigName, setTypedSigName] = useState<string>('John Doe');
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isSigDrawing, setIsSigDrawing] = useState(false);
  // #27 Whiteout
  const [whiteoutColor, setWhiteoutColor] = useState<string>('#ffffff');
  // #28 Annotate
  const [annStrokeColor, setAnnStrokeColor] = useState<string>('#ef4444');
  const [annStrokeWidth, setAnnStrokeWidth] = useState<number>(4);
  // #29 Shapes
  const [shapeKind, setShapeKind] = useState<'rectangle' | 'ellipse' | 'line' | 'arrow'>('rectangle');
  const [shapeStrokeColor, setShapeStrokeColor] = useState<string>('#4f46e5');
  const [shapeFillColor, setShapeFillColor] = useState<string>('transparent');

  // Trigger AI Summarizer
  const handleRunAiSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await summarizeDocumentText(extractedDocumentText, customApiKey);
      setAiSummary(res);
      triggerConfetti();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Trigger Translation
  const handleRunTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await translateDocumentText(extractedDocumentText, targetLang);
      setTranslationResult(res);
      triggerConfetti();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle signature placement
  const handlePlaceSignature = () => {
    let dataUrl = '';
    if (sigMode === 'draw') {
      const canvas = sigCanvasRef.current;
      if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
      }
    } else {
      // Render typed cursive name on temporary canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'italic 36px "Brush Script MT", cursive, sans-serif';
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText(typedSigName, 20, 70);
        dataUrl = canvas.toDataURL('image/png');
      }
    }

    if (dataUrl) {
      onAddAnnotation({
        id: `sig-${Date.now()}`,
        type: 'signature',
        pageIndex: currentPageIndex,
        x: 40,
        y: 60,
        width: 30,
        height: 12,
        imageDataUrl: dataUrl,
      });
      onClose();
    }
  };

  return (
    <aside className="w-80 sm:w-96 bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl flex flex-col h-full z-40 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <DynamicIcon name={operation?.iconName || 'FileCheck'} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {operation?.name}
            </h3>
            <p className="text-[10px] text-slate-500 line-clamp-1">
              {operation?.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body - Contextual Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
        {/* 1. MERGE PDF */}
        {operationId === 'merge' && (
          <div className="space-y-4">
            <p className="text-slate-500">
              Select additional PDF files to combine with the current document.
            </p>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) setMergeFilesList(Array.from(e.target.files));
              }}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {mergeFilesList.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-[11px] text-slate-600 uppercase">
                  Files to merge ({mergeFilesList.length}):
                </span>
                <ul className="space-y-1">
                  {mergeFilesList.map((f, i) => (
                    <li key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 truncate">
                      {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="button"
              disabled={mergeFilesList.length === 0}
              onClick={() => {
                onMergeWithFiles(mergeFilesList);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Merge Documents Now
            </button>
          </div>
        )}

        {/* 2. SPLIT PDF */}
        {operationId === 'split' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Page Range to Extract:</label>
              <input
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="e.g. 1-2, 4 or all"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400">Total pages available: {totalPages}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSplitPages(splitRange);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all cursor-pointer"
            >
              Extract & Split Pages
            </button>
          </div>
        )}

        {/* 3. ORGANIZE PDF */}
        {operationId === 'organize' && (
          <div className="space-y-4">
            <p className="text-slate-500">
              Use the left thumbnail panel to drag, duplicate, or reorder pages in real-time.
            </p>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 font-medium">
              💡 Tip: Click page arrows or use the rotate button next to each thumbnail to change document orientation.
            </div>
          </div>
        )}

        {/* 4. DELETE PAGE */}
        {operationId === 'delete-page' && (
          <div className="space-y-4">
            <p className="text-slate-500">Choose which pages to remove from document:</p>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <label
                  key={i}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer font-bold text-xs ${
                    selectedDeletePages.includes(i)
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDeletePages.includes(i)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedDeletePages((prev) => [...prev, i]);
                      else setSelectedDeletePages((prev) => prev.filter((p) => p !== i));
                    }}
                    className="sr-only"
                  />
                  <span>Page {i + 1}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              disabled={selectedDeletePages.length === 0 || selectedDeletePages.length >= totalPages}
              onClick={() => {
                onDeletePages(selectedDeletePages);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Delete {selectedDeletePages.length} Page(s)
            </button>
          </div>
        )}

        {/* 5. ROTATE */}
        {operationId === 'rotate' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Rotation Angle:</label>
              <div className="grid grid-cols-3 gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setRotateDeg(deg)}
                    className={`py-2 rounded-xl font-bold border cursor-pointer ${
                      rotateDeg === deg
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {deg}° Clockwise
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800">Apply To:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRotateScope('current')}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    rotateScope === 'current'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Page {currentPageIndex + 1}
                </button>
                <button
                  type="button"
                  onClick={() => setRotateScope('all')}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    rotateScope === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  All {totalPages} Pages
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onRotate(rotateDeg, rotateScope);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer"
            >
              Rotate Now
            </button>
          </div>
        )}

        {/* 6. INSERT PAGE */}
        {operationId === 'insert-page' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Insert Position:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInsertPos('before')}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    insertPos === 'before'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Before Page {currentPageIndex + 1}
                </button>
                <button
                  type="button"
                  onClick={() => setInsertPos('after')}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    insertPos === 'after'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  After Page {currentPageIndex + 1}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onInsertPage(insertPos, true);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer"
            >
              Insert Blank Page
            </button>
          </div>
        )}

        {/* 7. CROP */}
        {operationId === 'crop' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span>Crop Margin:</span>
                <span className="font-mono text-indigo-600">{cropMargin} pt</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={cropMargin}
                onChange={(e) => setCropMargin(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Trims outer margin whitespace cleanly across all pages.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onCropMargins(cropMargin);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer"
            >
              Crop Document Margins
            </button>
          </div>
        )}

        {/* 8. PAGE NUMBERING */}
        {operationId === 'page-numbering' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Format:</label>
              <select
                value={pnFormat}
                onChange={(e) => setPnFormat(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              >
                <option value="page_of_total">Page X of Y (e.g. Page 1 of 4)</option>
                <option value="simple">Simple Page Number (e.g. 1)</option>
                <option value="bates">Bates Stamping (e.g. 00001)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800">Position:</label>
              <select
                value={pnPos}
                onChange={(e) => setPnPos(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddPageNumbers(pnFormat, pnPos);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all cursor-pointer"
            >
              Apply Page Numbers
            </button>
          </div>
        )}

        {/* 9. COMPRESS */}
        {operationId === 'compress' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Compression Level:</label>
              <div className="space-y-2">
                {[
                  { id: 'extreme', label: 'Extreme (High DPI reduction)', badge: '~70% savings' },
                  { id: 'recommended', label: 'Recommended (Balanced)', badge: '~50% savings' },
                  { id: 'low', label: 'Low (Lossless font optimization)', badge: '~25% savings' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCompressLevel(lvl.id as any)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                      compressLevel === lvl.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{lvl.label}</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                      {lvl.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onCompress(compressLevel);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer"
            >
              Compress PDF Now
            </button>
          </div>
        )}

        {/* 10, 11, 12, 16 EXPORT BUTTONS */}
        {operationId === 'pdf-to-word' && (
          <div className="space-y-4 text-center">
            <p className="text-slate-500">
              Extract typography, headings, and paragraphs directly into editable Microsoft Word (.docx) format.
            </p>
            <button
              type="button"
              onClick={() => {
                onExportWord();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-200"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Download .DOCX</span>
            </button>
          </div>
        )}

        {operationId === 'pdf-to-pptx' && (
          <div className="space-y-4 text-center">
            <p className="text-slate-500">
              Convert every page into standard widescreen PowerPoint (.pptx) presentation slides.
            </p>
            <button
              type="button"
              onClick={() => {
                onExportPptx();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-200"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Download .PPTX</span>
            </button>
          </div>
        )}

        {operationId === 'pdf-to-excel' && (
          <div className="space-y-4 text-center">
            <p className="text-slate-500">
              Detect tabular data, rows, and structured financial columns into formatted Excel spreadsheets.
            </p>
            <button
              type="button"
              onClick={() => {
                onExportExcel();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-200"
            >
              <Download className="w-4 h-4" />
              <span>Extract & Download .XLSX / CSV</span>
            </button>
          </div>
        )}

        {operationId === 'pdf-to-jpg' && (
          <div className="space-y-4 text-center">
            <p className="text-slate-500">
              Render all {totalPages} pages at high-DPI (2x clarity) and bundle them in a single .zip file.
            </p>
            <button
              type="button"
              onClick={() => {
                onExportJpgZip();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-200"
            >
              <Download className="w-4 h-4" />
              <span>Render & Download High-Res JPG Zip</span>
            </button>
          </div>
        )}

        {/* 13, 14, 15: OFFICE TO PDF */}
        {(operationId === 'word-to-pdf' || operationId === 'pptx-to-pdf' || operationId === 'excel-to-pdf') && (
          <div className="space-y-4">
            <p className="text-slate-500">Upload your office file to convert into PDF:</p>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onConvertOfficeToPdf(e.target.files[0]);
                  onClose();
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>
        )}

        {/* 17. JPG TO PDF */}
        {operationId === 'jpg-to-pdf' && (
          <div className="space-y-4">
            <p className="text-slate-500">Select image files (JPG, PNG, WebP) to combine into PDF:</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onConvertImagesToPdf(Array.from(e.target.files));
                  onClose();
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>
        )}

        {/* 18. PROTECT */}
        {operationId === 'protect' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Set AES Password:</label>
              <input
                type="password"
                value={protectPassword}
                onChange={(e) => setProtectPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={restrictPerms}
                onChange={(e) => setRestrictPerms(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Disable printing & content copying</span>
            </label>
            <button
              type="button"
              disabled={!protectPassword}
              onClick={() => {
                onProtectPdf(protectPassword, restrictPerms);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Encrypt & Protect PDF
            </button>
          </div>
        )}

        {/* 19. UNLOCK */}
        {operationId === 'unlock' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Enter Known Password:</label>
              <input
                type="password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <button
              type="button"
              disabled={!unlockPassword}
              onClick={() => {
                onUnlockPdf(unlockPassword);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Remove Password Locks
            </button>
          </div>
        )}

        {/* 20. AI SUMMARIZER */}
        {operationId === 'ai-summarizer' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-700 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client-Side LLM Intelligence</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Extracts key insights and bullet points in seconds.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">
                Optional Gemini API Key (Default uses local extractor):
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy... (optional)"
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <button
              type="button"
              disabled={isSummarizing}
              onClick={handleRunAiSummary}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSummarizing ? 'Analyzing Document...' : 'Generate Executive Summary'}</span>
            </button>

            {aiSummary && (
              <div className="space-y-3 pt-2 animate-in fade-in">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Executive Summary:</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {aiSummary.executiveSummary}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Key Takeaways:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                    {aiSummary.bulletPoints.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 21. TRANSLATE */}
        {operationId === 'translate' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Target Language:</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="pt">Portuguese (Português)</option>
              </select>
            </div>

            <button
              type="button"
              disabled={isTranslating}
              onClick={handleRunTranslate}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-200"
            >
              <Languages className="w-4 h-4" />
              <span>{isTranslating ? 'Translating...' : 'Translate Extracted Text'}</span>
            </button>

            {translationResult && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in">
                <span className="font-bold text-slate-800 block">
                  Translated into {translationResult.targetLanguage}:
                </span>
                <div className="max-h-48 overflow-y-auto p-2 bg-white rounded-lg border border-slate-200 text-[11px] leading-relaxed whitespace-pre-line text-slate-700">
                  {translationResult.translatedText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 22. ADD TEXT */}
        {operationId === 'add-text' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Overlay Text:</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Font Size:</label>
                <input
                  type="number"
                  min="8"
                  max="48"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-800 block mb-1">Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddAnnotation({
                  id: `text-${Date.now()}`,
                  type: 'text',
                  pageIndex: currentPageIndex,
                  x: 35,
                  y: 40,
                  text: customText,
                  fontSize: textSize,
                  color: textColor,
                });
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer"
            >
              Stamp Text on Current Page
            </button>
          </div>
        )}

        {/* 23. FIND & REPLACE */}
        {operationId === 'find-replace' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Search Term:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Exact text to find..."
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Replace With:</label>
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Replacement text..."
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <button
              type="button"
              disabled={!searchTerm}
              onClick={() => {
                onFindReplace(searchTerm, replaceTerm);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Replace Across Pages
            </button>
          </div>
        )}

        {/* 24. ADD LINKS */}
        {operationId === 'add-links' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Destination URL:</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Link Label:</label>
              <input
                type="text"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onAddAnnotation({
                  id: `link-${Date.now()}`,
                  type: 'link',
                  pageIndex: currentPageIndex,
                  x: 30,
                  y: 50,
                  width: 35,
                  height: 6,
                  text: linkLabel,
                  linkUrl: linkUrl,
                });
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all cursor-pointer"
            >
              Insert Link Bounding Box
            </button>
          </div>
        )}

        {/* 25. ADD IMAGE */}
        {operationId === 'add-image' && (
          <div className="space-y-4">
            <p className="text-slate-500">Upload stamp or photo asset to position on page:</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) {
                      onAddAnnotation({
                        id: `img-${Date.now()}`,
                        type: 'image',
                        pageIndex: currentPageIndex,
                        x: 30,
                        y: 35,
                        width: 30,
                        height: 20,
                        imageDataUrl: ev.target.result as string,
                        opacity: stampOpacity,
                      });
                      onClose();
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>
        )}

        {/* 26. SIGNATURE */}
        {operationId === 'add-signature' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSigMode('draw')}
                className={`py-1.5 rounded-xl font-bold border cursor-pointer ${
                  sigMode === 'draw'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Draw Pad
              </button>
              <button
                type="button"
                onClick={() => setSigMode('type')}
                className={`py-1.5 rounded-xl font-bold border cursor-pointer ${
                  sigMode === 'type'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Type to Sign
              </button>
            </div>

            {sigMode === 'draw' ? (
              <div className="space-y-2">
                <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-inner">
                  <canvas
                    ref={sigCanvasRef}
                    width={320}
                    height={140}
                    onPointerDown={(e) => {
                      const ctx = sigCanvasRef.current?.getContext('2d');
                      if (ctx) {
                        const rect = sigCanvasRef.current!.getBoundingClientRect();
                        ctx.beginPath();
                        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.lineWidth = 2.5;
                        ctx.lineCap = 'round';
                        ctx.strokeStyle = '#1e3a8a';
                        setIsSigDrawing(true);
                      }
                    }}
                    onPointerMove={(e) => {
                      if (!isSigDrawing) return;
                      const ctx = sigCanvasRef.current?.getContext('2d');
                      if (ctx) {
                        const rect = sigCanvasRef.current!.getBoundingClientRect();
                        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.stroke();
                      }
                    }}
                    onPointerUp={() => setIsSigDrawing(false)}
                    className="block w-full cursor-crosshair"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const ctx = sigCanvasRef.current?.getContext('2d');
                    if (ctx) ctx.clearRect(0, 0, 320, 140);
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Clear Draw Pad
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={typedSigName}
                  onChange={(e) => setTypedSigName(e.target.value)}
                  placeholder="Type your name..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center font-serif italic text-2xl text-blue-900 font-bold">
                  {typedSigName || 'Your Signature'}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handlePlaceSignature}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer"
            >
              Stamp Signature on Document
            </button>
          </div>
        )}

        {/* 27. WHITEOUT */}
        {operationId === 'whiteout' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Redaction Fill Color:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWhiteoutColor('#ffffff')}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    whiteoutColor === '#ffffff'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                >
                  Whiteout (Clean White)
                </button>
                <button
                  type="button"
                  onClick={() => setWhiteoutColor('#000000')}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    whiteoutColor === '#000000'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-900 text-white border-slate-700'
                  }`}
                >
                  Blackout Redact
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddAnnotation({
                  id: `whiteout-${Date.now()}`,
                  type: 'whiteout',
                  pageIndex: currentPageIndex,
                  x: 25,
                  y: 40,
                  width: 50,
                  height: 10,
                  fillColor: whiteoutColor,
                });
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-all cursor-pointer"
            >
              Place Redact Mask Box
            </button>
          </div>
        )}

        {/* 28. ANNOTATE (FREEHAND / HIGHLIGHTER) */}
        {operationId === 'annotate' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium">
              ✏️ Drawing Mode Active: Click and drag anywhere on the central document page to draw freehand.
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800">Color Palette:</label>
              <div className="flex items-center gap-2">
                {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#0f172a'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAnnStrokeColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                      annStrokeColor === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span>Stroke Width:</span>
                <span className="font-mono">{annStrokeWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={annStrokeWidth}
                onChange={(e) => setAnnStrokeWidth(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 29. SHAPES */}
        {operationId === 'shapes' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Shape Type:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['rectangle', 'ellipse', 'line', 'arrow'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShapeKind(s)}
                    className={`py-2 rounded-xl font-bold border capitalize cursor-pointer ${
                      shapeKind === s
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Stroke Color:</label>
                <input
                  type="color"
                  value={shapeStrokeColor}
                  onChange={(e) => setShapeStrokeColor(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="font-bold text-slate-800 block mb-1">Fill Color:</label>
                <select
                  value={shapeFillColor}
                  onChange={(e) => setShapeFillColor(e.target.value)}
                  className="w-full h-9 p-1 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="transparent">Transparent</option>
                  <option value="#f1f5f9">Light Gray</option>
                  <option value="#fee2e2">Light Red</option>
                  <option value="#e0e7ff">Light Indigo</option>
                  <option value="#dcfce7">Light Green</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddAnnotation({
                  id: `shape-${Date.now()}`,
                  type: 'shape',
                  shapeType: shapeKind,
                  pageIndex: currentPageIndex,
                  x: 30,
                  y: 40,
                  width: 35,
                  height: 20,
                  color: shapeStrokeColor,
                  fillColor: shapeFillColor,
                  strokeWidth: 2,
                });
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer"
            >
              Insert Shape onto Page
            </button>
          </div>
        )}

        {/* 30. UNDO HISTORY */}
        {operationId === 'undo-history' && (
          <div className="space-y-4">
            <p className="text-slate-500">
              Snapshot stack tracks every modification made to the document:
            </p>
            <div className="space-y-2">
              {historyStack.map((snap, idx) => (
                <div
                  key={idx}
                  onClick={() => onRestoreHistory(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    idx === historyIndex
                      ? 'bg-indigo-50 border-indigo-400 font-bold text-indigo-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="block text-xs">{snap.description}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(snap.timestamp).toLocaleTimeString()} • {snap.pageCount} pages
                    </span>
                  </div>
                  {idx === historyIndex && (
                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
