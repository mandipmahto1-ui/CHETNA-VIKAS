import React from 'react';
import { RefreshCw, FileText } from 'lucide-react';

interface AppHeaderProps {
  fileName?: string;
  pageCount?: number;
  fileSizeBytes?: number;
  hasUnsavedChanges?: boolean;
  onReset: () => void;
  onLoadSample?: () => void;
  onTriggerUpload?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  fileName,
  pageCount,
  fileSizeBytes,
  hasUnsavedChanges,
  onReset,
}) => {
  const formattedSize = fileSizeBytes
    ? fileSizeBytes > 1024 * 1024
      ? `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(fileSizeBytes / 1024).toFixed(1)} KB`
    : '';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Document Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={onReset}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shadow-indigo-100 group-hover:scale-105 transition-all bg-white p-0.5 border border-slate-200 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Chetna Vikas Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-chetna-vikas text-xl font-black tracking-tight text-slate-900">
                  Chetna
                </span>
                <span className="font-chetna-vikas text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                  Vikas
                </span>
                <span className="text-xs font-extrabold text-slate-700 tracking-wide font-sans">
                  PDF Editor
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-0.5 hidden md:block">
                Unified 30-in-1 Client-Side PDF Workspace
              </p>
            </div>
          </div>

          {/* Active Document Badge */}
          {fileName && (
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-2 border-l border-slate-200/80 min-w-0">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold text-slate-700 truncate max-w-[240px] md:max-w-[340px]">
                <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{fileName}</span>
                {pageCount !== undefined && (
                  <span className="text-[11px] text-slate-500 font-mono shrink-0">
                    ({pageCount} {pageCount === 1 ? 'page' : 'pages'}
                    {formattedSize ? ` • ${formattedSize}` : ''})
                  </span>
                )}
              </div>

              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Modified
                </span>
              )}
            </div>
          )}
        </div>

        {/* Persistent Reset / New Document Button (when document is active) */}
        {fileName && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              title="Clear current document and start over"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset / New Document</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
