import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCheck,
  ShieldCheck,
  Zap,
  Lock,
  FileText,
  Image as ImageIcon,
  Combine,
  Split,
  RotateCw,
  FileCog,
  Minimize2,
  ArrowRight,
} from 'lucide-react';
import { formatBytes } from '../utils/pdfHelpers';

interface HeroProps {
  onOpenMergeWithFiles: (files: File[]) => void;
  onOpenSplitWithFile: (file: File) => void;
  onOpenImageToPdfWithFiles: (files: File[]) => void;
  onOpenRotateWithFile: (file: File) => void;
  onOpenMetadataWithFile: (file: File) => void;
  onSelectTool: (toolId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenMergeWithFiles,
  onOpenSplitWithFile,
  onOpenImageToPdfWithFiles,
  onOpenRotateWithFile,
  onOpenMetadataWithFile,
  onSelectTool,
}) => {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);
    setDroppedFiles(files);
  };

  const handleSamplePdf = async () => {
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]);
      page.drawText('Sample Document for Chetna Vikas PDF', { x: 50, y: 780, size: 18 });
      page.drawText('This sample PDF was generated right in your browser to test Split, Rotate, and Merge!', {
        x: 50,
        y: 740,
        size: 12,
      });
      const page2 = doc.addPage([595.28, 841.89]);
      page2.drawText('Sample Page 2 - Great for testing Page Splitting & Range Extraction.', {
        x: 50,
        y: 780,
        size: 16,
      });
      const page3 = doc.addPage([595.28, 841.89]);
      page3.drawText('Sample Page 3 - Chetna Vikas Client-Side Verification.', {
        x: 50,
        y: 780,
        size: 16,
      });
      const pdfBytes = await doc.save();
      const sampleFile = new File([pdfBytes.buffer as ArrayBuffer], 'ChetnaVikas_Sample_Doc.pdf', {
        type: 'application/pdf',
      });
      setDroppedFiles([sampleFile]);
    } catch (e) {
      console.error(e);
    }
  };

  const isPdf = droppedFiles.length > 0 && droppedFiles.every((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
  const isImage = droppedFiles.length > 0 && droppedFiles.every((f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name));

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Decorative Pastel Background Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-indigo-100/90 shadow-sm text-xs font-semibold text-indigo-700 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>v2.0 • 100% Client-Side In-Browser Processing Engine</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-normal">Zero Server Latency</span>
        </div>

        {/* Headline & Subheadline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Empowering Your Documents with{' '}
            <span className="font-chetna-vikas text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
              Chetna Vikas PDF Editor
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and client-side PDF processing. Convert, merge, split, compress, and edit with zero server latency.
          </p>
        </div>

        {/* Universal Quick Drag-and-Drop Area */}
        <div className="max-w-3xl mx-auto">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`relative rounded-3xl p-8 sm:p-10 transition-all duration-300 ${
              isDragOver
                ? 'bg-indigo-50/90 border-2 border-dashed border-indigo-500 scale-[1.01] shadow-xl'
                : 'bg-white/80 backdrop-blur-xl border-2 border-dashed border-slate-300/80 hover:border-indigo-400 shadow-xl shadow-indigo-100/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />

            {droppedFiles.length === 0 ? (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-200 cursor-pointer group hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50/50 transition-colors">
                    <Upload className="w-9 h-9" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-800">
                    Universal File Dropper
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Drop any PDF or Image here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                    >
                      browse your device
                    </button>
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    PDF Documents
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    JPG & PNG Photos
                  </span>
                  <button
                    type="button"
                    onClick={handleSamplePdf}
                    className="text-xs px-3.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200/80 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Try with Sample PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-left animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {isPdf ? (
                        <FileText className="w-6 h-6" />
                      ) : isImage ? (
                        <ImageIcon className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {droppedFiles.length === 1
                          ? droppedFiles[0].name
                          : `${droppedFiles.length} files selected`}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {formatBytes(
                          droppedFiles.reduce((acc, f) => acc + f.size, 0)
                        )}{' '}
                        • Ready for client-side processing
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDroppedFiles([])}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline px-3 py-1.5 rounded-lg hover:bg-rose-50"
                  >
                    Change File(s)
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Choose What You'd Like To Do:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {isPdf && (
                      <>
                        <button
                          onClick={() => onOpenMergeWithFiles(droppedFiles)}
                          className="p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-indigo-950">
                              Merge with other PDFs
                            </span>
                            <Combine className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="text-xs text-indigo-700/80">
                            Combine pages in sequence
                          </p>
                        </button>

                        <button
                          onClick={() => onOpenSplitWithFile(droppedFiles[0])}
                          className="p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-teal-950">
                              Split PDF Pages
                            </span>
                            <Split className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="text-xs text-teal-700/80">
                            Extract specific pages or ranges
                          </p>
                        </button>

                        <button
                          onClick={() => onOpenRotateWithFile(droppedFiles[0])}
                          className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-amber-950">
                              Rotate & Watermark
                            </span>
                            <RotateCw className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="text-xs text-amber-700/80">
                            Change orientation or stamp text
                          </p>
                        </button>

                        <button
                          onClick={() => onOpenMetadataWithFile(droppedFiles[0])}
                          className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-purple-950">
                              Edit Metadata
                            </span>
                            <FileCog className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="text-xs text-purple-700/80">
                            Update author & document tags
                          </p>
                        </button>

                        <button
                          onClick={() => onSelectTool('compress-pdf')}
                          className="p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-left transition-all group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-sky-950">
                              Compress PDF
                            </span>
                            <Minimize2 className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="text-xs text-sky-700/80">
                            Reduce size while maintaining quality
                          </p>
                        </button>
                      </>
                    )}

                    {isImage && (
                      <button
                        onClick={() => onOpenImageToPdfWithFiles(droppedFiles)}
                        className="col-span-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-left transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-bold text-base text-rose-950">
                            Convert {droppedFiles.length}{' '}
                            {droppedFiles.length === 1 ? 'Image' : 'Images'} to PDF
                          </h5>
                          <p className="text-xs text-rose-700/80 mt-0.5">
                            Reorder, set margins, and bundle into a single clean PDF
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                    {!isPdf && !isImage && (
                      <button
                        onClick={() => onSelectTool('word-to-pdf')}
                        className="col-span-full p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-bold text-base text-blue-950">
                            Convert File to PDF
                          </h5>
                          <p className="text-xs text-blue-700/80 mt-0.5">
                            Transform document to universal PDF format
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">100% Client-Side</p>
              <p className="text-[11px] text-slate-500">Files stay in browser</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Zero Server Delay</p>
              <p className="text-[11px] text-slate-500">Gigabit local speed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Bank-Grade Privacy</p>
              <p className="text-[11px] text-slate-500">Auto-cleared memory</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Zero Watermarks</p>
              <p className="text-[11px] text-slate-500">Free & unconstrained</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
