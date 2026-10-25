import React from 'react';
import {
  Download,
  CheckCircle,
  X,
  Printer,
  RefreshCw,
  Edit3,
} from 'lucide-react';

interface StudioDownloadModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onDownload: () => void;
  onContinueEditing: () => void;
  onStartNew: () => void;
}

export const StudioDownloadModal: React.FC<StudioDownloadModalProps> = ({
  isOpen,
  fileName,
  onClose,
  onDownload,
  onContinueEditing,
  onStartNew,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-pink-200/80 p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon with Pink Glow */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500/20 via-rose-500/15 to-purple-500/20 text-pink-600 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20 border border-pink-200">
          <CheckCircle className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Your document is ready
          </h3>
          <p className="text-xs text-slate-500 font-mono truncate max-w-xs mx-auto">
            {fileName}
          </p>
        </div>

        {/* Primary Download Button with Vibrant Gradient */}
        <div>
          <button
            type="button"
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 active:scale-95 text-white font-black text-base rounded-2xl shadow-xl shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/50 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-pink-200 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onContinueEditing}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-pink-200 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Continue Editing</span>
          </button>
        </div>

        {/* Reset / Start New */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center gap-1 hover:text-pink-600 font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Edit another document</span>
          </button>

          <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            100% Private
          </span>
        </div>
      </div>
    </div>
  );
};
