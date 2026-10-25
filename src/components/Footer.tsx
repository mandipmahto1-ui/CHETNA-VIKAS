import React from 'react';
import { ShieldCheck, ArrowUp, Heart, Sparkles, ExternalLink } from 'lucide-react';
import type { OperationId } from '../types/workspace';

interface FooterProps {
  onNavigate: (page: 'workspace' | 'founder') => void;
  onSelectOperation?: (opId: OperationId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectOperation,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToolClick = (opId: OperationId) => {
    onSelectOperation?.(opId);
    scrollToTop();
  };

  return (
    <footer className="mt-20 border-t border-slate-200/90 bg-white/80 backdrop-blur-xl pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('workspace')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <img
                src="/logo.png"
                alt="Chetna Vikas Logo"
                className="w-10 h-10 rounded-xl object-contain shadow-xs border border-slate-200 bg-white p-0.5 shrink-0 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Chetna{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Vikas
                </span>{' '}
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 uppercase tracking-widest">
                  Studio
                </span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              All-in-one client-side PDF suite combining the most powerful capabilities of modern document manipulation with 100% in-browser confidentiality and zero server latency.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% In-Browser Confidentiality
              </span>

              <button
                type="button"
                onClick={() => {
                  onNavigate('founder');
                  scrollToTop();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Meet the Founder
              </button>
            </div>
          </div>

          {/* Column 1: Organize & Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Organize & Pages
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('merge')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('split')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('organize')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Organize Pages
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('delete-page')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Delete Pages
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('rotate')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Rotate PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('page-numbering')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Page Numbering
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Conversions & Export */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Convert & Export
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('compress')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-word')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  PDF to Word (.docx)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-pptx')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  PDF to PowerPoint
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-excel')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  PDF to Excel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('pdf-to-jpg')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  PDF to JPG Zip
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('jpg-to-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  JPG to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Edit, AI & Founder */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Edit, AI & About
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('ai-summarizer')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer font-semibold text-indigo-700"
                >
                  AI Summarizer PDF ✨
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('translate')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Translate PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('add-signature')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Add Signature
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleToolClick('protect')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Protect & Lock
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('founder');
                    scrollToTop();
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Founder Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Prominent "Developed by Mandip Kumar Mahto" */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Chetna Vikas PDF Studio. Zero server tracking.</p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 shadow-2xs font-medium">
              <span>Developed with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>by</span>
              <button
                type="button"
                onClick={() => {
                  onNavigate('founder');
                  scrollToTop();
                }}
                className="font-extrabold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 hover:decoration-indigo-600 underline-offset-4 transition-colors cursor-pointer hover:scale-105 inline-flex items-center gap-1"
                title="Click to view About Founder - Mandip Kumar Mahto"
              >
                <span>Mandip Kumar Mahto</span>
              </button>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
