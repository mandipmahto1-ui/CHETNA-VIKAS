import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  RotateCw,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  FileCheck,
  Type,
} from 'lucide-react';
import { formatBytes, getPdfPageCount, rotateAndWatermarkPdf, downloadPdfBlob, triggerConfetti } from '../../utils/pdfHelpers';

interface RotateWatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile?: File;
  toolId?: string;
}

export const RotateWatermarkModal: React.FC<RotateWatermarkModalProps> = ({
  isOpen,
  onClose,
  initialFile,
  toolId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  // Rotation states - default to +90deg if user clicked Rotate PDF
  const [rotationDeg, setRotationDeg] = useState<number>(toolId === 'rotate-pdf' ? 90 : 0);

  // Watermark states
  const [enableWatermark, setEnableWatermark] = useState<boolean>(toolId !== 'rotate-pdf');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState<string>('red');
  const [opacity, setOpacity] = useState<number>(0.35);
  const [fontSize, setFontSize] = useState<number>(44);
  const [watermarkAngle, setWatermarkAngle] = useState<number>(45);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<{ bytes: Uint8Array; filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialFile) {
      handleFileSelected(initialFile);
    }
  }, [initialFile]);

  React.useEffect(() => {
    if (toolId === 'rotate-pdf') {
      setRotationDeg(90);
      setEnableWatermark(false);
    } else if (toolId === 'add-watermark') {
      setRotationDeg(0);
      setEnableWatermark(true);
    }
  }, [toolId, isOpen]);

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
  };

  const handleApply = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a PDF document first.');
      return;
    }

    if (rotationDeg === 0 && (!enableWatermark || !watermarkText.trim())) {
      setErrorMsg('Please select a rotation angle (e.g. +90°) or enable a watermark so changes can be applied to the document.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      const modifiedBytes = await rotateAndWatermarkPdf(selectedFile, {
        rotationDeg,
        watermarkText: enableWatermark ? watermarkText : '',
        opacity,
        fontSize,
        textColor: watermarkColor,
        watermarkAngle,
      });

      const filename = `ChetnaVikas_${rotationDeg !== 0 ? `Rotated_${rotationDeg}deg_` : ''}${selectedFile.name}`;
      setDownloadReady({ bytes: modifiedBytes, filename });
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while rotating/watermarking PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Rotate & Watermark
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  Visual Controls
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Fix sideways scans and overlay dynamic text watermarks with custom opacity & angle.
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
                  <h4 className="font-bold text-emerald-900">Document Updated!</h4>
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
              className="border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/30 hover:bg-amber-50/60 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                accept="application/pdf"
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Choose a PDF to Rotate or Watermark
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop any PDF document to apply client-side modifications
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File Card */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
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
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* 1. Rotation Selector */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                    Rotate All Pages
                  </label>
                  <span className="text-xs font-medium text-amber-600">
                    Current: +{rotationDeg}°
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotationDeg(deg)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        rotationDeg === deg
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {deg === 0 ? 'No Rotation' : `+${deg}°`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Watermark Controls */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-600" />
                    Text Watermark Overlay
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableWatermark}
                      onChange={(e) => setEnableWatermark(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {enableWatermark && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL / DRAFT / DO NOT COPY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Color */}
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1.5">
                          Text Color
                        </label>
                        <div className="flex gap-2">
                          {[
                            { id: 'gray', label: 'Gray', bg: 'bg-slate-400' },
                            { id: 'red', label: 'Red', bg: 'bg-rose-500' },
                            { id: 'blue', label: 'Blue', bg: 'bg-blue-500' },
                            { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setWatermarkColor(c.id)}
                              className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                                watermarkColor === c.id
                                  ? 'ring-2 ring-offset-2 ring-slate-800 scale-110'
                                  : 'opacity-70 hover:opacity-100'
                              }`}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Opacity */}
                      <div>
                        <label className="text-xs font-medium text-slate-600 flex justify-between mb-1">
                          <span>Opacity</span>
                          <span className="font-semibold text-slate-800">
                            {Math.round(opacity * 100)}%
                          </span>
                        </label>
                        <input
                          type="range"
                          min="0.05"
                          max="0.8"
                          step="0.05"
                          value={opacity}
                          onChange={(e) => setOpacity(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Font Size */}
                      <div>
                        <label className="text-xs font-medium text-slate-600 flex justify-between mb-1">
                          <span>Font Size</span>
                          <span className="font-semibold text-slate-800">{fontSize}px</span>
                        </label>
                        <input
                          type="range"
                          min="18"
                          max="72"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      {/* Angle */}
                      <div>
                        <label className="text-xs font-medium text-slate-600 flex justify-between mb-1">
                          <span>Rotation Angle</span>
                          <span className="font-semibold text-slate-800">{watermarkAngle}°</span>
                        </label>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={watermarkAngle}
                          onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Live Preview Stamp */}
                    <div className="h-20 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                      <span
                        style={{
                          transform: `rotate(${watermarkAngle}deg)`,
                          opacity: opacity,
                          fontSize: `${Math.min(fontSize, 32)}px`,
                          color:
                            watermarkColor === 'red'
                              ? '#ef4444'
                              : watermarkColor === 'blue'
                              ? '#3b82f6'
                              : watermarkColor === 'amber'
                              ? '#f59e0b'
                              : '#64748b',
                        }}
                        className="font-extrabold tracking-widest select-none"
                      >
                        {watermarkText || 'WATERMARK PREVIEW'}
                      </span>
                    </div>
                  </div>
                )}
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
            onClick={handleApply}
            disabled={!selectedFile || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-semibold text-sm shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Applying Changes...
              </>
            ) : (
              <>
                Save & Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
