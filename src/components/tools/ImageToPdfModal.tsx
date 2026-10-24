import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  Plus,
} from 'lucide-react';
import type { ImageToPdfItem } from '../../types';
import { formatBytes, imagesToPdf, downloadPdfBlob, triggerConfetti } from '../../utils/pdfHelpers';

interface ImageToPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFiles?: File[];
}

export const ImageToPdfModal: React.FC<ImageToPdfModalProps> = ({
  isOpen,
  onClose,
  initialFiles,
}) => {
  const [items, setItems] = useState<ImageToPdfItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<{ bytes: Uint8Array; filename: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      loadFiles(initialFiles);
    }
  }, [initialFiles]);

  if (!isOpen) return null;

  const loadFiles = (newFiles: File[]) => {
    setErrorMsg(null);
    setDownloadReady(null);
    const validImages = Array.from(newFiles).filter(
      (f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name)
    );

    if (validImages.length === 0) {
      setErrorMsg('Please select JPG, PNG, or WebP images.');
      return;
    }

    const loaded: ImageToPdfItem[] = validImages.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...loaded]);
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
    setItems((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleConvert = async () => {
    if (items.length === 0) {
      setErrorMsg('Please add at least one image to convert.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      const files = items.map((i) => i.file);
      const pdfBytes = await imagesToPdf(files, {
        orientation,
        margin,
        pageSize,
      });

      const filename = `ChetnaVikas_Images_${Date.now()}.pdf`;
      setDownloadReady({ bytes: pdfBytes, filename });
      triggerConfetti();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while generating PDF from images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/80 via-white to-pink-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Images to PDF
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                  Batch Converter
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Transform JPG, PNG, and WebP pictures into clean, print-ready PDF albums.
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
                  <h4 className="font-bold text-emerald-900">PDF Created Successfully!</h4>
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
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Select or drop JPG, PNG, or WebP photos
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports multiple images with automatic scaling & layout customization
            </p>
          </div>

          {/* Options Grid */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              {/* Orientation */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Page Orientation
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      orientation === 'portrait'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      orientation === 'landscape'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              {/* Margins */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Page Margins
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMargin(0)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      margin === 0
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={() => setMargin(20)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      margin === 20
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Normal (20)
                  </button>
                </div>
              </div>

              {/* Page Format */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Page Size
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPageSize('a4')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      pageSize === 'a4'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Standard A4
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageSize('fit')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border cursor-pointer ${
                      pageSize === 'fit'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Fit Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Images Grid */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <span>
                  IMAGES TO CONVERT ({items.length}) • TOTAL {formatBytes(items.reduce((acc, c) => acc + c.size, 0))}
                </span>
                <button
                  onClick={() => setItems([])}
                  className="text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative group bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col"
                  >
                    <div className="h-28 w-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="p-2.5 flex items-center justify-between bg-white text-xs">
                      <span className="truncate font-medium text-slate-700 text-[11px] max-w-[90px]">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          title="Move Left/Up"
                          className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === items.length - 1}
                          title="Move Right/Down"
                          className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          title="Delete"
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add More Images
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConvert}
              disabled={items.length === 0 || isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-semibold text-sm shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  Create PDF ({items.length} {items.length === 1 ? 'Page' : 'Pages'})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
