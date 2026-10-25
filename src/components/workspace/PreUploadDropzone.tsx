import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  PlusSquare,
} from 'lucide-react';

interface PreUploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSample: () => void;
  onCreateBlank: () => void;
}

export const PreUploadDropzone: React.FC<PreUploadDropzoneProps> = ({
  onFilesSelected,
  onLoadSample,
  onCreateBlank,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'bg-indigo-50/90 border-indigo-500 scale-[1.01] shadow-2xl shadow-indigo-100'
            : 'bg-white/85 backdrop-blur-xl border-slate-300/80 hover:border-indigo-400 shadow-xl shadow-slate-200/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.webp"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Central Graphic */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-200 cursor-pointer group hover:scale-105 transition-transform"
        >
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50/60 transition-colors">
            <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>

        {/* Main Headings */}
        <div className="mt-6 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Drag & Drop Your Document Here
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Upload any file to unlock the full suite of{' '}
            <span className="font-bold text-indigo-600">30 client-side PDF tools</span>.
            Zero server uploads, 100% private.
          </p>
        </div>

        {/* Staging Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Browse from Computer</span>
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200/80 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Try with 4-Page Sample PDF</span>
          </button>

          <button
            type="button"
            onClick={onCreateBlank}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-sm border border-slate-200 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <PlusSquare className="w-4 h-4 text-slate-500" />
            <span>New Blank PDF</span>
          </button>
        </div>

        {/* Supported Format Pills */}
        <div className="mt-10 pt-8 border-t border-slate-100/90 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mr-1">
            Supported Formats:
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 text-red-700 border border-red-100">
            <FileText className="w-3.5 h-3.5" />
            .PDF
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <FileText className="w-3.5 h-3.5" />
            .DOCX
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-100">
            <Presentation className="w-3.5 h-3.5" />
            .PPTX
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            .XLSX
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            <ImageIcon className="w-3.5 h-3.5" />
            .JPG / .PNG
          </span>
        </div>
      </div>
    </div>
  );
};
