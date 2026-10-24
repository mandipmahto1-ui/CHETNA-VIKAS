import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Split,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { formatBytes, getPdfPageCount, splitPdfFile, downloadPdfBlob, triggerConfetti } from '../../utils/pdfHelpers';

interface SplitPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile?: File;
}

export const SplitPdfModal: React.FC<SplitPdfModalProps> = ({
  isOpen,
  onClose,
  initialFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeMode, setRangeMode] = useState<'custom' | 'odd' | 'even' | 'first'>('custom');
  const [rangeText, setRangeText] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<{ bytes: Uint8Array; filename: string; count: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialFile) {
      handleFileSelected(initialFile);
    }
  }, [initialFile]);

  if (!isOpen) return null;

  const handleFileSelected = async (file: File) => {
    setErrorMsg(null);
    setDownloadReady(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please upload a valid PDF document.');
      return;
    }

    setSelectedFile(file);
    const count = await getPdfPageCount(file);
    setPageCount(count);
    setRangeText(count > 1 ? `1-${Math.min(count, 3)}` : '1');
  };

  const handleRangeModeChange = (mode: 'custom' | 'odd' | 'even' | 'first') => {
    setRangeMode(mode);
    if (mode === 'odd') {
      const odds = [];
      for (let i = 1; i <= pageCount; i += 2) odds.push(i);
      setRangeText(odds.join(', '));
    } else if (mode === 'even') {
      const evens = [];
      for (let i = 2; i <= pageCount; i += 2) evens.push(i);
      setRangeText(evens.length > 0 ? evens.join(', ') : '2');
    } else if (mode === 'first') {
      setRangeText('1');
    }
  };

  const handleSplit = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a PDF file to split.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      const result = await splitPdfFile(selectedFile, rangeText);
      const filename = `ChetnaVikas_Split_${selectedFile.name.replace(/\.pdf$/i, '')}_p${rangeText.replace(/[^0-9-]/g, '_')}.pdf`;

      setDownloadReady({
        bytes: result.bytes,
        filename,
        count: result.extractedCount,
      });

      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while splitting PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/80 via-white to-sky-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-200">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Split PDF Document
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
                  Instant Extraction
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Extract page ranges, individual pages, or even/odd sets with zero quality loss.
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
                  <h4 className="font-bold text-emerald-900">Extracted {downloadReady.count} Pages!</h4>
                  <p className="text-xs text-emerald-700">
                    Saved as {downloadReady.filename} ({formatBytes(downloadReady.bytes.length)})
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

          {/* Upload Area */}
          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileSelected(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/60 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                accept="application/pdf"
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Choose a PDF to Split
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop your PDF here to view pages and extract ranges
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Selected File Card */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {pageCount} total pages • {formatBytes(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPageCount(0);
                    setDownloadReady(null);
                  }}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Extraction Modes */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Select Split Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRangeModeChange('custom')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      rangeMode === 'custom'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    Custom Range
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRangeModeChange('first')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      rangeMode === 'first'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    First Page Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRangeModeChange('odd')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      rangeMode === 'odd'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    Odd Pages
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRangeModeChange('even')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      rangeMode === 'even'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    Even Pages
                  </button>
                </div>
              </div>

              {/* Page Range Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Pages to Extract:
                  </label>
                  <span className="text-xs text-slate-400">
                    Range available: 1 to {pageCount}
                  </span>
                </div>
                <input
                  type="text"
                  value={rangeText}
                  onChange={(e) => {
                    setRangeText(e.target.value);
                    setRangeMode('custom');
                  }}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-xs text-slate-500">
                  Example: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700">1-4</code> extracts the first 4 pages, or <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700">1, 3, 5</code> extracts non-contiguous pages.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSplit}
            disabled={!selectedFile || !rangeText.trim() || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 text-white font-semibold text-sm shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Splitting PDF...
              </>
            ) : (
              <>
                Split & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
