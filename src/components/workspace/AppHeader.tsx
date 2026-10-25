import React from 'react';
import { RefreshCw, FileText, Sparkles, Shield, UploadCloud } from 'lucide-react';

interface AppHeaderProps {
  fileName?: string;
  pageCount?: number;
  fileSizeBytes?: number;
  hasUnsavedChanges?: boolean;
  onReset: () => void;
  onLoadSample: () => void;
  onTriggerUpload: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  fileName,
  pageCount,
  fileSizeBytes,
  hasUnsavedChanges,
  onReset,
  onLoadSample,
  onTriggerUpload,
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
                  // Fallback if logo.png not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Chetna
                </span>
                <span className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Vikas
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 uppercase tracking-widest hidden sm:inline-block">
                  Studio
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

        {/* Global Action Header Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 rounded-xl font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Private • Local Processing</span>
          </div>

          {!fileName ? (
            <>
              <button
                type="button"
                onClick={onLoadSample}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Try Sample PDF</span>
              </button>

              <button
                type="button"
                onClick={onTriggerUpload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload PDF</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLoadSample}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                title="Switch to Sample 4-page PDF"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sample PDF</span>
              </button>

              {/* Persistent Reset / New Document Button */}
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                title="Clear current document and start over"
              >
                <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset / New Document</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
