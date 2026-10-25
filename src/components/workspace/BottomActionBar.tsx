import React from 'react';
import {
  Undo2,
  Redo2,
  Download,
  CheckCircle2,
  History,
} from 'lucide-react';

interface BottomActionBarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onApplyChanges: () => void;
  onExportPdf: () => void;
  onOpenHistory: () => void;
  hasUnsavedChanges: boolean;
  pageCount: number;
  fileName: string;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onApplyChanges,
  onExportPdf,
  onOpenHistory,
  hasUnsavedChanges,
  pageCount,
  fileName,
}) => {
  return (
    <footer className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 sm:px-6 lg:px-8 shadow-lg shadow-slate-200/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Document Status & History Trigger */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
              {fileName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-[11px] text-slate-500">
              {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer text-[11px] font-semibold"
            title="View Undo/Redo Version History"
          >
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>History</span>
          </button>
        </div>

        {/* Center: Global Undo / Redo */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer shadow-2xs disabled:shadow-none"
            title="Undo Last Action (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer shadow-2xs disabled:shadow-none"
            title="Redo Action (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>Redo</span>
          </button>
        </div>

        {/* Right: Apply Changes & Export Download */}
        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={onApplyChanges}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/90 text-xs font-bold transition-all cursor-pointer hover:scale-[1.02]"
              title="Bake active annotations and commit modifications"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Apply Changes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExportPdf}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export / Download PDF</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
