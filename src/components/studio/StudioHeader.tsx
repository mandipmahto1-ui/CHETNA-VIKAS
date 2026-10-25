import React from 'react';
import {
  ChevronDown,
  RefreshCw,
  User,
  Laptop,
} from 'lucide-react';
import type { OperationId } from '../../types/workspace';

interface StudioHeaderProps {
  hasDocument: boolean;
  fileName?: string;
  pageCount?: number;
  onOpenMegaMenu: () => void;
  isMegaMenuOpen: boolean;
  onSelectQuickTool: (toolId: OperationId) => void;
  onResetDocument: () => void;
  onOpenFounder: () => void;
  onOpenPricing: () => void;
  onOpenDesktop: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  hasDocument,
  fileName,
  pageCount,
  onOpenMegaMenu,
  isMegaMenuOpen,
  onSelectQuickTool,
  onResetDocument,
  onOpenFounder,
  onOpenPricing,
  onOpenDesktop,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-pink-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Logo & Quick Nav Links */}
        <div className="flex items-center gap-1 sm:gap-4 lg:gap-6 min-w-0">
          {/* Brand Logo & Full Name Chetna Vikas PDF Editor */}
          <div
            onClick={onResetDocument}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            title="Chetna Vikas PDF Editor"
          >
            {/* Official Clean Logo */}
            <div className="w-10 h-10 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Chetna Vikas PDF Editor Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-chetna-vikas text-2xl font-black tracking-tight text-slate-900">
                  Chetna
                </span>
                <span className="font-chetna-vikas text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                  Vikas
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-700 tracking-wide ml-0.5">
                  PDF Editor
                </span>
              </div>
            </div>
          </div>

          {/* All Tools Dropdown Button */}
          <button
            type="button"
            onClick={onOpenMegaMenu}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              isMegaMenuOpen
                ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 border border-pink-300 shadow-xs'
                : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50/60'
            }`}
            title="View all PDF Tools"
          >
            <span>All Tools</span>
            <ChevronDown className={`w-4 h-4 text-pink-500 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Tools Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onSelectQuickTool('compress')}
              className="px-2.5 py-1.5 rounded-md hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
            >
              Compress
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickTool('add-text')}
              className="px-2.5 py-1.5 rounded-md hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickTool('add-signature')}
              className="px-2.5 py-1.5 rounded-md hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
            >
              Fill & Sign
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickTool('merge')}
              className="px-2.5 py-1.5 rounded-md hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
            >
              Merge
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickTool('delete-page')}
              className="px-2.5 py-1.5 rounded-md hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
            >
              Delete Pages
            </button>
            <button
              type="button"
              onClick={() => onSelectQuickTool('crop')}
              className="px-2.5 py-1.5 rounded-md hover:text-pink-600 hover:bg-pink-50/60 transition-colors cursor-pointer"
            >
              Crop
            </button>
          </nav>
        </div>

        {/* Right Section: Active Doc Info OR Pricing / Desktop / Founder */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {hasDocument && fileName ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700 max-w-[180px] md:max-w-[260px] truncate border border-slate-200">
                <span className="truncate">{fileName}</span>
                {pageCount && (
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">
                    ({pageCount}p)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onResetDocument}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                title="Close document and start over"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Document</span>
              </button>
            </div>
          ) : null}

          {/* Pricing link */}
          <button
            type="button"
            onClick={onOpenPricing}
            className="hidden sm:block text-sm font-medium text-slate-600 hover:text-pink-600 px-2 py-1.5 rounded hover:bg-pink-50/60 transition-colors cursor-pointer"
          >
            Pricing
          </button>

          {/* Desktop link */}
          <button
            type="button"
            onClick={onOpenDesktop}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-pink-600 px-2 py-1.5 rounded hover:bg-pink-50/60 transition-colors cursor-pointer"
          >
            <Laptop className="w-4 h-4 text-slate-500" />
            <span>Desktop</span>
          </button>

          {/* Founder Profile button */}
          <button
            type="button"
            onClick={onOpenFounder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/70 border border-pink-200 transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="About Developer Mandip Kumar Mahto & Chetna Vikas"
          >
            <User className="w-4 h-4 text-pink-600" />
            <span className="hidden md:inline">Founder</span>
            <span className="md:hidden">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
