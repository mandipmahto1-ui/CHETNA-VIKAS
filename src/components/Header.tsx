import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  Search,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import type { ToolCategory, PdfTool } from '../types';
import { PDF_TOOLS } from '../data/toolsData';
import { DynamicIcon } from './DynamicIcon';

interface HeaderProps {
  activePage: 'home' | 'founder';
  onNavigate: (page: 'home' | 'founder') => void;
  onFilterCategory?: (category: ToolCategory) => void;
  onOpenSearch: () => void;
  onSelectTool: (tool: PdfTool) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onFilterCategory,
  onOpenSearch,
  onSelectTool,
}) => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (cat: ToolCategory) => {
    if (activePage !== 'home') {
      onNavigate('home');
    }
    onFilterCategory?.(cat);
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleToolClick = (tool: PdfTool) => {
    onSelectTool(tool);
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-indigo-100/60 group-hover:scale-105 transition-all duration-300 shrink-0 bg-white p-0.5 border border-slate-200/80">
            <img
              src="/logo.png"
              alt="Chetna Vikas Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-chetna-vikas text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Chetna
              </span>
              <span className="font-chetna-vikas text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 tracking-tight">
                Vikas
              </span>
              <span className="text-xs font-bold text-slate-700 tracking-wide font-sans">
                PDF Editor
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase -mt-0.5 hidden sm:block">
              All-in-One Online PDF Editor
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Mega Dropdown for All Tools */}
          <div className="relative" ref={megaMenuRef}>
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                megaMenuOpen
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              All Tools
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  megaMenuOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Mega Dropdown Modal/Menu */}
            {megaMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[760px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 grid grid-cols-3 gap-6 animate-fade-in z-50">
                {/* Column 1: Organize & Optimize */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2">
                      Organize PDF
                    </span>
                    <ul className="space-y-1">
                      {PDF_TOOLS.filter((t) => t.category === 'organize')
                        .slice(0, 4)
                        .map((tool) => (
                          <li key={tool.id}>
                            <button
                              onClick={() => handleToolClick(tool)}
                              className="w-full text-left text-xs text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 p-1.5 rounded-lg font-medium transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <span>{tool.name}</span>
                              <DynamicIcon
                                name={tool.iconName}
                                className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600"
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2">
                      Optimize PDF
                    </span>
                    <ul className="space-y-1">
                      {PDF_TOOLS.filter((t) => t.category === 'optimize')
                        .slice(0, 3)
                        .map((tool) => (
                          <li key={tool.id}>
                            <button
                              onClick={() => handleToolClick(tool)}
                              className="w-full text-left text-xs text-slate-700 hover:text-sky-600 hover:bg-sky-50/60 p-1.5 rounded-lg font-medium transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <span>{tool.name}</span>
                              <DynamicIcon
                                name={tool.iconName}
                                className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600"
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Column 2: Conversions */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-2">
                      Convert to PDF
                    </span>
                    <ul className="space-y-1">
                      {PDF_TOOLS.filter((t) => t.category === 'convert-to')
                        .slice(0, 4)
                        .map((tool) => (
                          <li key={tool.id}>
                            <button
                              onClick={() => handleToolClick(tool)}
                              className="w-full text-left text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50/60 p-1.5 rounded-lg font-medium transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <span>{tool.name}</span>
                              <DynamicIcon
                                name={tool.iconName}
                                className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600"
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-2">
                      Convert from PDF
                    </span>
                    <ul className="space-y-1">
                      {PDF_TOOLS.filter((t) => t.category === 'convert-from')
                        .slice(0, 3)
                        .map((tool) => (
                          <li key={tool.id}>
                            <button
                              onClick={() => handleToolClick(tool)}
                              className="w-full text-left text-xs text-slate-700 hover:text-amber-600 hover:bg-amber-50/60 p-1.5 rounded-lg font-medium transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <span>{tool.name}</span>
                              <DynamicIcon
                                name={tool.iconName}
                                className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600"
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3: Edit & Security + Banner */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-2">
                      Edit & Security
                    </span>
                    <ul className="space-y-1">
                      {PDF_TOOLS.filter(
                        (t) => t.category === 'edit-sign' || t.category === 'security'
                      )
                        .slice(0, 4)
                        .map((tool) => (
                          <li key={tool.id}>
                            <button
                              onClick={() => handleToolClick(tool)}
                              className="w-full text-left text-xs text-slate-700 hover:text-purple-600 hover:bg-purple-50/60 p-1.5 rounded-lg font-medium transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <span>{tool.name}</span>
                              <DynamicIcon
                                name={tool.iconName}
                                className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600"
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      100% Client-Side
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Zero server telemetry. Everything executes right in your browser.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direct Category Shortcuts */}
          <button
            onClick={() => handleCategoryClick('organize')}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            Merge & Split
          </button>

          <button
            onClick={() => handleCategoryClick('convert-to')}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            Convert PDF
          </button>

          <button
            onClick={() => handleCategoryClick('security')}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            Edit & Security
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            title="Search tools (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Search tools</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-400 font-mono shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          {/* Action Button: Explore All Tools */}
          <button
            onClick={() => {
              if (activePage !== 'home') onNavigate('home');
              const el = document.getElementById('tools-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl animate-fade-in">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Home & All Tools
            </button>
            <button
              onClick={() => handleCategoryClick('organize')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Merge & Split
            </button>
            <button
              onClick={() => handleCategoryClick('convert-to')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Convert to PDF
            </button>
            <button
              onClick={() => handleCategoryClick('security')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Edit & Security
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search 24+ Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
