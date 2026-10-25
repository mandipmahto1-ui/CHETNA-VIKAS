import React, { useState } from 'react';
import {
  Type,
  Link as LinkIcon,
  CheckSquare,
  Image as ImageIcon,
  PenTool,
  Eraser,
  Highlighter,
  Shapes,
  MoreHorizontal,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  RotateCw,
  Crop,
  Hash,
  Search,
  Sparkles,
  Lock,
} from 'lucide-react';
import type { OperationId } from '../../types/workspace';

interface StudioEditorToolbarProps {
  activeTool: OperationId | null;
  onSelectTool: (toolId: OperationId) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  currentPage: number;
  totalPages: number;
  onNavigatePage?: (page: number) => void;
}

export const StudioEditorToolbar: React.FC<StudioEditorToolbarProps> = ({
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoomScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  currentPage,
  totalPages,
}) => {
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  return (
    <div className="sticky top-16 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-pink-100/90 shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Main Editor Tools */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {/* 1. Text Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('add-text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'add-text'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Add text to document"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>

          {/* 2. Links Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('add-links')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'add-links'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Create clickable hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Links</span>
          </button>

          {/* 3. Forms Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('add-text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'organize'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Interactive form fields"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Forms</span>
          </button>

          {/* 4. Images Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('add-image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'add-image'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Add image stamp or logo"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images</span>
          </button>

          {/* 5. Sign Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('add-signature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'add-signature'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Draw, type or upload signature"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Sign</span>
          </button>

          {/* 6. Whiteout Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('whiteout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'whiteout'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Redact or whiteout sensitive content"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Whiteout</span>
          </button>

          {/* 7. Annotate Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('annotate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'annotate'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Draw or highlight content"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Annotate</span>
          </button>

          {/* 8. Shapes Tool */}
          <button
            type="button"
            onClick={() => onSelectTool('shapes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'shapes'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="Insert rectangle or ellipse"
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Shapes</span>
          </button>

          {/* 9. More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
              title="More operations"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              <span>More</span>
              <ChevronDown className="w-3 h-3 text-pink-500" />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 top-full mt-1.5 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-pink-200 py-2 z-40 text-xs font-semibold text-slate-700 animate-in fade-in duration-100"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    onSelectTool('rotate');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-pink-500" />
                  <span>Rotate Pages</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    onSelectTool('crop');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2 cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5 text-pink-500" />
                  <span>Crop Margins</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    onSelectTool('page-numbering');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2 cursor-pointer"
                >
                  <Hash className="w-3.5 h-3.5 text-pink-500" />
                  <span>Page Numbering</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    onSelectTool('find-replace');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-pink-500" />
                  <span>Find & Replace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    onSelectTool('protect');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Protect with Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    onSelectTool('ai-summarizer');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2 text-purple-600 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>AI Document Summary</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Undo / Redo / Zoom */}
        <div className="flex items-center gap-2 text-slate-600">
          {/* Undo / Redo */}
          <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden bg-white/80">
            <button
              type="button"
              disabled={!canUndo}
              onClick={onUndo}
              className="p-1.5 hover:bg-pink-50 disabled:opacity-30 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5 text-pink-600" />
            </button>
            <div className="w-px h-3.5 bg-pink-200" />
            <button
              type="button"
              disabled={!canRedo}
              onClick={onRedo}
              className="p-1.5 hover:bg-pink-50 disabled:opacity-30 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5 text-pink-600" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden bg-white/80">
            <button
              type="button"
              onClick={onZoomOut}
              className="p-1.5 hover:bg-pink-50 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-pink-600" />
            </button>
            <span
              onClick={onResetZoom}
              className="px-2 text-[11px] font-mono font-bold text-pink-700 cursor-pointer hover:text-pink-900"
              title="Click to reset zoom"
            >
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={onZoomIn}
              className="p-1.5 hover:bg-pink-50 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 text-pink-600" />
            </button>
          </div>

          {/* Page Counter */}
          <div className="text-xs font-bold text-pink-700 font-mono hidden sm:block bg-pink-50 px-2 py-1 rounded-md border border-pink-200">
            {currentPage + 1} / {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
};
