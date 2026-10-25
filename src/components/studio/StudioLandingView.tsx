import React, { useRef, useState } from 'react';
import {
  Upload,
  ChevronDown,
  Cloud,
  Globe,
  PlusSquare,
  Type,
  Sparkles,
} from 'lucide-react';
import type { OperationId, ToolCategory } from '../../types/workspace';
import { AllOperationsGrid } from '../workspace/AllOperationsGrid';

interface StudioLandingViewProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSample: () => void;
  onCreateBlank: () => void;
  onSelectOperation: (opId: OperationId) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
}

export const StudioLandingView: React.FC<StudioLandingViewProps> = ({
  onFilesSelected,
  onLoadSample,
  onCreateBlank,
  onSelectOperation,
  selectedCategory,
  onSelectCategory,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-mesh-8d relative overflow-hidden">
      {/* 8D Floating Ambient Light Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-400/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-60 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: '2.5s' }} />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Hero Section */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center transition-all ${
          isDragOver ? 'bg-pink-100/50 scale-[1.01]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight font-sans">
            <span className="font-chetna-vikas text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
              Chetna Vikas
            </span>{' '}
            PDF Editor
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto">
            Edit PDF files for free. Fill & sign PDF with high-speed privacy.
          </p>

          {/* Main Upload Split Button with Vibrant Multi-Color Gradient */}
          <div className="pt-6 pb-2 relative inline-flex items-center justify-center">
            <div className="relative inline-flex rounded-2xl shadow-xl shadow-pink-500/25 group hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300">
              {/* Primary Gradient Upload Button */}
              <button
                type="button"
                onClick={triggerUpload}
                className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 active:scale-[0.98] text-white font-black text-base sm:text-lg rounded-l-2xl transition-all cursor-pointer select-none"
              >
                <Upload className="w-5 h-5 text-white stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
                <span>Upload PDF file</span>
              </button>

              {/* Split Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-3.5 py-4 sm:py-4.5 bg-purple-600 hover:bg-purple-700 text-white border-l border-white/20 rounded-r-2xl transition-all cursor-pointer flex items-center justify-center"
                title="More upload options"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-60 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-pink-200 py-2 z-30 text-left text-xs font-semibold text-slate-700 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      triggerUpload();
                    }}
                    className="w-full px-4 py-2.5 hover:bg-pink-50 flex items-center gap-2.5 text-slate-800 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-pink-600" />
                    <span>Choose from computer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLoadSample();
                    }}
                    className="w-full px-4 py-2.5 hover:bg-pink-50 flex items-center gap-2.5 text-pink-700 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Load Interactive Sample PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onCreateBlank();
                    }}
                    className="w-full px-4 py-2.5 hover:bg-pink-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                  >
                    <PlusSquare className="w-4 h-4 text-slate-500" />
                    <span>Create Blank Document</span>
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      triggerUpload();
                    }}
                    className="w-full px-4 py-2 hover:bg-pink-50 flex items-center gap-2.5 text-slate-600 cursor-pointer"
                  >
                    <Cloud className="w-4 h-4 text-blue-500" />
                    <span>Google Drive / Dropbox</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      triggerUpload();
                    }}
                    className="w-full px-4 py-2 hover:bg-pink-50 flex items-center gap-2.5 text-slate-600 cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Web address (URL)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium select-none">
            or drop files here
          </p>
        </div>
      </section>

      {/* Educational & Guide Section with 8D Cards */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-pink-100/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-14">
          {/* Main Guide Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How to edit PDF files online free
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 mx-auto rounded-full" />
          </div>

          {/* Step-by-Step Cards */}
          <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
            {/* Step 1 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">1</span>
                Upload your files
              </h3>
              <p className="text-slate-600 pl-9">
                Files are safely uploaded over an encrypted connection. Files stay completely secure in your local browser sandbox and are never stored on any server.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">2</span>
                Add text to PDF
              </h3>
              <p className="text-slate-600 pl-9">
                Click on the &apos;Text&apos; tool in the top menu. Click anywhere on the PDF page to add new text. You can change font family, font size, bold, italic, and color directly.
              </p>
              {/* Illustrated Preview Card */}
              <div className="ml-9 p-4 rounded-xl bg-gradient-to-r from-pink-50/80 to-purple-50/80 border border-pink-200/80 max-w-md shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-pink-200/60 text-xs font-mono text-pink-600">
                  <Type className="w-3.5 h-3.5" />
                  <span>Text Tool Toolbar</span>
                </div>
                <div className="pt-2 text-xs text-slate-800 font-serif italic font-medium">
                  &ldquo;Your Company Name & Brochure Text&rdquo;
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">3</span>
                Change PDF text
              </h3>
              <p className="text-slate-600 pl-9">
                Click on existing text boxes to edit the content. Edit text, replace words, or adjust styling instantly without needing external desktop software.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">4</span>
                Add image to PDF
              </h3>
              <p className="text-slate-600 pl-9">
                Click the &apos;Images&apos; menu and select your files. Click on the page where the image or stamp should appear. Drag to reposition and resize freely.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">5</span>
                Fill out PDF forms
              </h3>
              <p className="text-slate-600 pl-9">
                Click form fields and type your answers. Checkboxes and radio buttons can also be toggled with a single click.
              </p>
            </div>

            {/* Step 6 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">6</span>
                Add links to PDF and edit existing hyperlinks
              </h3>
              <p className="text-slate-600 pl-9">
                Create new links to external web URLs or jump to specific pages within the document with ease.
              </p>
            </div>

            {/* Step 7 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">7</span>
                Edit PDF annotations, whiteout and shapes
              </h3>
              <p className="text-slate-600 pl-9">
                Whiteout parts of the page to hide sensitive data or mistakes. Add rectangles, ellipses, arrows, and freehand highlighter drawings.
              </p>
            </div>

            {/* Step 8 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">8</span>
                Find and replace in PDF
              </h3>
              <p className="text-slate-600 pl-9">
                Easily search for words and replace all occurrences with updated text across the entire document.
              </p>
            </div>

            {/* Step 9 */}
            <div className="space-y-2 glass-card-8d p-5 rounded-2xl">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-black shadow-2xs">9</span>
                Save your changes
              </h3>
              <p className="text-slate-600 pl-9">
                Click &apos;Apply changes&apos; to bake all text, shapes, and annotations into the document and download your updated PDF file immediately.
              </p>
            </div>

            {/* Vibrant Pink Gradient CTA Button */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={triggerUpload}
                className="px-10 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-base rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Edit PDF file
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* Section: How to Sign PDF */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                How to Sign PDF
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full" />
            </div>

            <div className="text-sm text-slate-600 space-y-3 pl-2 sm:pl-6 max-w-2xl mx-auto">
              <p>1. Click the &apos;Sign&apos; button from the top editor toolbar.</p>
              <p>2. Create your digital signature: draw with your trackpad/touchscreen, type your name in signature fonts, or upload an image stamp.</p>
              <p>3. Place the signature on the page, resize if necessary, and click &apos;Apply changes&apos;.</p>
            </div>

            {/* Signature Preview Card with Pink Glow */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-pink-50/90 via-white to-purple-50/90 border border-pink-200/80 shadow-md shadow-pink-500/10 text-center max-w-sm mx-auto">
              <div className="font-serif italic text-3xl text-slate-900 tracking-wide select-none">
                Mandip
              </div>
              <div className="text-[10px] text-pink-600 font-bold uppercase tracking-widest mt-1.5">
                Verified Digital e-Signature
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={triggerUpload}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Sign PDF
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* Section: How to Type On A PDF */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                How to Type On A PDF
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full" />
            </div>

            <div className="text-sm text-slate-600 space-y-3 pl-2 sm:pl-6 max-w-2xl mx-auto">
              <p>1. Upload your document by clicking &apos;Upload PDF file&apos;.</p>
              <p>2. Select the &apos;Text&apos; tool from the top toolbar.</p>
              <p>3. Click anywhere on the document canvas and start typing.</p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={triggerUpload}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Type on PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Operations Grid Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-pink-50/30 border-t border-pink-100/80">
        <AllOperationsGrid
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onSelectOperation={onSelectOperation}
          hasDocument={false}
          onTriggerUpload={triggerUpload}
        />
      </section>
    </div>
  );
};
