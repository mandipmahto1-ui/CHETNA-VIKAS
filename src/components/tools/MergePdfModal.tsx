import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  Plus,
} from 'lucide-react';
import type { MergedFileItem } from '../../types';
import { formatBytes, getPdfPageCount, mergePdfFiles, downloadPdfBlob, triggerConfetti } from '../../utils/pdfHelpers';

interface MergePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFiles?: File[];
}

export const MergePdfModal: React.FC<MergePdfModalProps> = ({
  isOpen,
  onClose,
  initialFiles,
}) => {
  const [items, setItems] = useState<MergedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<{ bytes: Uint8Array; filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with initial files if passed
  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      loadFiles(initialFiles);
    }
  }, [initialFiles]);

  if (!isOpen) return null;

  const loadFiles = async (newFiles: File[]) => {
    setErrorMsg(null);
    setDownloadReady(null);
    const pdfsOnly = Array.from(newFiles).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfsOnly.length === 0) {
      setErrorMsg('Please select valid PDF files.');
      return;
    }

    const loadedItems: MergedFileItem[] = [];
    for (const file of pdfsOnly) {
      const pageCount = await getPdfPageCount(file);
      loadedItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
      });
    }

    setItems((prev) => [...prev, ...loadedItems]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      setErrorMsg('Please add at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const filesToMerge = items.map((i) => i.file);
      const mergedBytes = await mergePdfFiles(filesToMerge);

      const filename = `ChetnaVikas_Merged_${Date.now()}.pdf`;
      setDownloadReady({ bytes: mergedBytes, filename });
      downloadPdfBlob(mergedBytes, filename);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to merge PDF files. Some files may have protected security restrictions.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = items.reduce((acc, curr) => acc + (curr.pageCount || 1), 0);
  const totalSize = items.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Merge PDF Files
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  Client-Side Fast
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Drag, reorder, and combine your PDF files into a single master document.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div>{errorMsg}</div>
            </div>
          )}

          {downloadReady && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Merge Completed Successfully!</h4>
                  <p className="text-xs text-emerald-700">
                    Downloaded {downloadReady.filename} ({formatBytes(downloadReady.bytes.length)})
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadPdfBlob(downloadReady.bytes, downloadReady.filename)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Again
              </button>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              multiple
              accept="application/pdf"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Click to browse or drop PDF files here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports unlimited files • Processed safely inside your browser
            </p>
          </div>

          {/* Files List */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <span>
                  FILES TO COMBINE ({items.length}) • {totalPages} TOTAL PAGES • {formatBytes(totalSize)}
                </span>
                <button
                  onClick={() => setItems([])}
                  className="text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.pageCount ? `${item.pageCount} ${item.pageCount === 1 ? 'page' : 'pages'}` : 'Analyzing...'} • {formatBytes(item.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        title="Remove"
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add More Files
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={items.length < 2 || isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Merging In Browser...
                </>
              ) : (
                <>
                  Merge {items.length > 0 ? `${items.length} PDFs` : 'PDFs'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
