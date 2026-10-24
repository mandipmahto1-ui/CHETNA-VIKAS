import React, { useState } from 'react';
import {
  X,
  AlignLeft,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
} from 'lucide-react';
import { textToPdf, downloadPdfBlob, triggerConfetti, formatBytes } from '../../utils/pdfHelpers';

interface TextToPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextToPdfModal: React.FC<TextToPdfModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('Official Documentation & Project Brief');
  const [content, setContent] = useState(
`1. Introduction & Overview
Chetna Vikas PDF Studio is an enterprise-grade, browser-based PDF suite designed to process documents entirely on the client side with 100% data confidentiality.

2. Architecture & Design Principles
- Zero Server Latency: All PDF operations occur within your browser's local sandbox memory.
- Privacy-First: Your contracts, personal identity cards, and financial statements never travel through remote third-party servers.
- High Precision: Built on top of WebAssembly and pdf-lib engine for vector accuracy and crisp print output.

3. Key Capabilities
- Merge and split documents without page limits.
- High-fidelity conversion from photos, scans, and raw text streams.
- Client-side Bates stamping, watermarking, and metadata sanitization.

4. Conclusion
Built with passion to elevate productivity and safeguard user security worldwide.`
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<{ bytes: Uint8Array; filename: string } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!content.trim()) {
      setErrorMsg('Please enter some text content to generate your PDF.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      const pdfBytes = await textToPdf(title, content);
      const filename = `ChetnaVikas_${title.replace(/[^a-zA-Z0-9]/g, '_') || 'TextDoc'}.pdf`;

      setDownloadReady({ bytes: pdfBytes, filename });
      downloadPdfBlob(pdfBytes, filename);
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while creating PDF from text.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-cyan-50/80 via-white to-sky-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-cyan-200">
              <AlignLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Text to PDF Creator
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold border border-cyan-200">
                  Instant Formatter
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Compose, paste notes, or format plain text into an elegant multi-page PDF.
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
                  <h4 className="font-bold text-emerald-900">PDF Generated Successfully!</h4>
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

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 uppercase tracking-wider">
              Document Header Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Proposal / Meeting Notes"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Body Content (Auto-wrapped pages)
              </label>
              <button
                type="button"
                onClick={() => {
                  setTitle('Chetna Vikas Quick Note');
                  setContent('This is a quick formatted PDF note generated in Chetna Vikas PDF Studio.\nAll client-side and 100% private.');
                }}
                className="text-xs text-cyan-600 hover:underline cursor-pointer"
              >
                Load Sample Text
              </button>
            </div>
            <textarea
              rows={9}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full p-4 rounded-xl border border-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
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
            onClick={handleGenerate}
            disabled={!content.trim() || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Formatting PDF...
              </>
            ) : (
              <>
                Create & Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
