import React, { useEffect, useRef } from 'react';
import {
  X,
  FileText,
  Minimize2,
  Trash2,
  Combine,
  Crop,
  Shuffle,
  Split,
  FileSpreadsheet,
  FileImage,
  Presentation,
  FileUp,
  ImagePlus,
  PenTool,
  RotateCw,
  Hash,
  Lock,
  Unlock,
  Stamp,
  Sparkles,
  Languages,
  Layers,
  Type,
  FileDigit,
  LayoutGrid,
} from 'lucide-react';
import type { OperationId } from '../../types/workspace';

interface StudioMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperation: (opId: OperationId) => void;
}

export const StudioMegaMenu: React.FC<StudioMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectOperation,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToolClick = (opId: OperationId) => {
    onSelectOperation(opId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex flex-col justify-start items-center overflow-y-auto">
      {/* Background click listener */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Mega Menu Card with 8D Glass Depth */}
      <div
        ref={menuRef}
        className="relative z-10 w-full max-w-7xl mx-auto my-4 sm:my-8 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-pink-200/80 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
      >
        {/* Header Bar with Title & Close X */}
        <div className="px-6 py-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/70 via-white to-purple-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">All PDF Tools</h3>
            <span className="font-chetna-vikas text-xs text-pink-600 font-bold bg-pink-100/60 px-2.5 py-0.5 rounded-full border border-pink-200">
              Chetna Vikas PDF Editor
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-100/60 transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Columns Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 text-xs text-slate-600">
          {/* 1. MOST USED */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Most Used
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('add-text')}
                  className="w-full text-left flex items-center gap-2 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Type className="w-3 h-3" />
                  </span>
                  <span>Edit</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('compress')}
                  className="w-full text-left flex items-center gap-2 text-slate-700 hover:text-amber-600 font-medium transition-colors cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Minimize2 className="w-3 h-3" />
                  </span>
                  <span>Compress</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('delete-page')}
                  className="w-full text-left flex items-center gap-2 text-slate-700 hover:text-rose-600 font-medium transition-colors cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Trash2 className="w-3 h-3" />
                  </span>
                  <span>Delete Pages</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('merge')}
                  className="w-full text-left flex items-center gap-2 text-slate-700 hover:text-purple-600 font-medium transition-colors cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Combine className="w-3 h-3" />
                  </span>
                  <span>Merge</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('crop')}
                  className="w-full text-left flex items-center gap-2 text-slate-700 hover:text-sky-600 font-medium transition-colors cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Crop className="w-3 h-3" />
                  </span>
                  <span>Crop</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 2. MERGE */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Merge
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('merge')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alternate & Mix</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('merge')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Combine className="w-3.5 h-3.5 text-slate-400" />
                  <span>Merge PDF</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 3. SPLIT */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Split
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('split')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Split className="w-3.5 h-3.5 text-slate-400" />
                  <span>Split by pages</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('split')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Split in half</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('split')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Split by size</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('split')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Split by bookmarks</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 4. CONVERT FROM PDF */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Convert From PDF
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-word')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>PDF to Word</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-excel')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 font-medium transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>PDF to Excel</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-jpg')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
                >
                  <FileImage className="w-3.5 h-3.5 text-purple-500" />
                  <span>PDF to JPG</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-pptx')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                >
                  <Presentation className="w-3.5 h-3.5 text-orange-500" />
                  <span>PDF to PPTX</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 5. CONVERT TO PDF */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Convert To PDF
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('word-to-pdf')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                  <FileUp className="w-3.5 h-3.5 text-blue-500" />
                  <span>Word to PDF</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('excel-to-pdf')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 font-medium transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Excel to PDF</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('jpg-to-pdf')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-purple-600 font-medium transition-colors cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-purple-500" />
                  <span>JPG to PDF</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pptx-to-pdf')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-orange-600 font-medium transition-colors cursor-pointer"
                >
                  <Presentation className="w-3.5 h-3.5 text-orange-500" />
                  <span>PPT to PDF</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 6. EDIT & SIGN */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Edit & Sign
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('add-text')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Type className="w-3.5 h-3.5 text-pink-500" />
                  <span>PDF Editor</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('add-signature')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-pink-500" />
                  <span>Fill & Sign</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('organize')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-pink-500" />
                  <span>Organize PDF</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('rotate')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-pink-500" />
                  <span>Rotate</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('crop')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5 text-pink-500" />
                  <span>Crop</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('page-numbering')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Hash className="w-3.5 h-3.5 text-pink-500" />
                  <span>Page Numbering</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 7. SECURITY */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Security
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('protect')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Protect PDF</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('unlock')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Unlock PDF</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('whiteout')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <Stamp className="w-3.5 h-3.5 text-pink-500" />
                  <span>Watermark</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 8. OTHER */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Other
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-summarizer')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-purple-600 font-bold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>AI Summarizer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('translate')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-purple-600 font-bold transition-colors cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5 text-purple-500" />
                  <span>Translate</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('find-replace')}
                  className="w-full text-left flex items-center gap-1.5 text-slate-700 hover:text-pink-600 font-medium transition-colors cursor-pointer"
                >
                  <FileDigit className="w-3.5 h-3.5 text-pink-500" />
                  <span>Find & Replace</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer in MegaMenu */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-pink-50/50 via-white to-purple-50/50 border-t border-pink-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-pink-700">Client-Side Security • Zero Server Retention • Fast Processing</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
          >
            Close menu
          </button>
        </div>
      </div>
    </div>
  );
};
