import type { OperationId } from '../../types/workspace';
import { ShieldCheck, User, Heart } from 'lucide-react';

interface StudioFooterProps {
  onSelectOperation: (opId: OperationId) => void;
  onNavigateFounder: () => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  onSelectOperation,
  onNavigateFounder,
}) => {
  return (
    <footer className="w-full bg-gradient-to-b from-white via-pink-50/20 to-pink-50/50 border-t border-pink-100 text-slate-600 text-xs py-14 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden">
      {/* 8D Ambient Glow in Footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Real Size Logo in the Middle */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="max-w-md mx-auto group">
            <img
              src="/logo.png"
              alt="Chetna Vikas PDF Editor Official Logo"
              className="w-56 sm:w-64 md:w-72 max-w-full h-auto object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-chetna-vikas text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 tracking-wide">
              Chetna Vikas PDF Editor
            </h3>
            <p className="text-xs font-semibold text-slate-500 tracking-wider">
              100% Private • Military-Grade Client-Side Engine • Free Forever
            </p>
          </div>
        </div>

        {/* Multi-column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 border-t border-pink-100/80 pt-10">
          {/* 1. POPULAR */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Popular
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('add-text')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Edit PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('compress')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('merge')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('split')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('add-signature')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Fill & Sign
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('delete-page')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Delete Pages
                </button>
              </li>
            </ul>
          </div>

          {/* 2. MERGE */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Merge
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('merge')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Alternate & Mix
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('merge')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Merge PDF
                </button>
              </li>
            </ul>
          </div>

          {/* 3. SPLIT */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Split
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('split')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Split by pages
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('split')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Split in half
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('split')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Split by size
                </button>
              </li>
            </ul>
          </div>

          {/* 4. EDIT & SIGN */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Edit & Sign
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('add-text')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  PDF Editor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('add-signature')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Fill & Sign PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('organize')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Organize PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('rotate')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Rotate PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('crop')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Crop PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('page-numbering')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Page Numbers
                </button>
              </li>
            </ul>
          </div>

          {/* 5. CONVERT FROM PDF */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Convert From PDF
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('pdf-to-word')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  PDF to Word
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('pdf-to-excel')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  PDF to Excel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('pdf-to-jpg')}
                  className="hover:text-purple-600 transition-colors cursor-pointer"
                >
                  PDF to JPG
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('pdf-to-pptx')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  PDF to PPTX
                </button>
              </li>
            </ul>
          </div>

          {/* 6. CONVERT TO PDF */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Convert To PDF
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('word-to-pdf')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Word to PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('excel-to-pdf')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  Excel to PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('jpg-to-pdf')}
                  className="hover:text-purple-600 transition-colors cursor-pointer"
                >
                  JPG to PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('pptx-to-pdf')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  PPT to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* 7. SECURITY */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              Security
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('protect')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Protect PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('unlock')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Unlock PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectOperation('whiteout')}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  Watermark PDF
                </button>
              </li>
            </ul>
          </div>

          {/* 8. ABOUT & FOUNDER */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-pink-100">
              About & Founder
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onNavigateFounder}
                  className="hover:text-pink-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-slate-800"
                >
                  <User className="w-3.5 h-3.5 text-pink-600" />
                  <span>Mandip Kumar Mahto</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateFounder}
                  className="hover:text-pink-600 transition-colors cursor-pointer"
                >
                  About <span className="font-chetna-vikas font-semibold text-slate-800 hover:text-pink-600">Chetna Vikas PDF Editor</span>
                </button>
              </li>
              <li>
                <span className="text-pink-600 font-semibold">100% Free & Private</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Credits */}
        <div className="pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span>
              &copy; {new Date().getFullYear()} <strong className="font-chetna-vikas font-bold text-slate-800">Chetna Vikas PDF Editor</strong>. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-pink-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-pink-600" />
              <span>Client-Side In-Browser Engine</span>
            </span>

            <span>•</span>

            <button
              type="button"
              onClick={onNavigateFounder}
              className="text-slate-800 hover:text-pink-600 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Developed by Mandip Kumar Mahto</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
