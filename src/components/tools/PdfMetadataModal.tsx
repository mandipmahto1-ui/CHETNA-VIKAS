import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCog,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { updatePdfMetadata, downloadPdfBlob, triggerConfetti, formatBytes } from '../../utils/pdfHelpers';

interface PdfMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile?: File;
}

export const PdfMetadataModal: React.FC<PdfMetadataModalProps> = ({
  isOpen,
  onClose,
  initialFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<{ bytes: Uint8Array; filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialFile) {
      handleFileSelected(initialFile);
    }
  }, [initialFile]);

  if (!isOpen) return null;

  const handleFileSelected = (file: File) => {
    setErrorMsg(null);
    setDownloadReady(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF document.');
      return;
    }
    setSelectedFile(file);
    setTitle(file.name.replace(/\.pdf$/i, ''));
    setAuthor('Chetna Vikas Studio');
    setSubject('Official Document');
    setKeywords('PDF, Chetna Vikas, Verified');
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a PDF file first.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      const modifiedBytes = await updatePdfMetadata(selectedFile, {
        title,
        author,
        subject,
        keywords,
      });

      const filename = `ChetnaVikas_Meta_${selectedFile.name}`;
      setDownloadReady({ bytes: modifiedBytes, filename });
      downloadPdfBlob(modifiedBytes, filename);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error updating metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-200">
              <FileCog className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Edit PDF Metadata
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                  Header Security
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Modify document properties, author names, tags, and sanitize tracking headers.
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
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
                  <h4 className="font-bold text-emerald-900">Metadata Successfully Updated!</h4>
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

          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileSelected(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 hover:bg-purple-50/60 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                accept="application/pdf"
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Choose a PDF to View & Edit Metadata
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Zero quality loss • Fast client-side property preservation
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-lg hover:bg-purple-50"
                >
                  Change File
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Author / Creator
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
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
            onClick={handleSave}
            disabled={!selectedFile || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Properties...
              </>
            ) : (
              <>
                Apply & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
