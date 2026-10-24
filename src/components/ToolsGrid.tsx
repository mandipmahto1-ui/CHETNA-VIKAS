import React, { useState, useMemo } from 'react';
import { Search, Layers, ArrowRight } from 'lucide-react';
import type { ToolCategory, PdfTool } from '../types';
import { CATEGORIES_LIST, PDF_TOOLS } from '../data/toolsData';
import { DynamicIcon } from './DynamicIcon';

interface ToolsGridProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  onSelectTool: (tool: PdfTool) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectTool,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="tools-grid" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <Layers className="w-3.5 h-3.5" />
            Complete PDF Studio Toolbox
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Every Tool You Need, Completely Client-Side
          </h2>
        </div>

        {/* Dynamic Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ToolCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid Tools Cards */}
      {filteredTools.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-3">
          <p className="text-base font-semibold text-slate-700">
            No PDF tools matched your search "{searchQuery}"
          </p>
          <p className="text-xs text-slate-400">
            Try searching for terms like "merge", "split", "jpg", "watermark", or "compress".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => {
            let iconBg = 'bg-indigo-100 text-indigo-600';
            let borderHover = 'hover:border-indigo-300';
            if (tool.category === 'organize') {
              iconBg = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
              borderHover = 'hover:border-indigo-400';
            } else if (tool.category === 'optimize') {
              iconBg = 'bg-sky-50 text-sky-600 border border-sky-100';
              borderHover = 'hover:border-sky-400';
            } else if (tool.category === 'convert-to') {
              iconBg = 'bg-rose-50 text-rose-600 border border-rose-100';
              borderHover = 'hover:border-rose-400';
            } else if (tool.category === 'convert-from') {
              iconBg = 'bg-amber-50 text-amber-600 border border-amber-100';
              borderHover = 'hover:border-amber-400';
            } else if (tool.category === 'edit-sign') {
              iconBg = 'bg-purple-50 text-purple-600 border border-purple-100';
              borderHover = 'hover:border-purple-400';
            } else if (tool.category === 'security') {
              iconBg = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
              borderHover = 'hover:border-emerald-400';
            }

            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className={`relative rounded-3xl p-5 sm:p-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-300 flex flex-col justify-between group cursor-pointer ${borderHover} hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${iconBg}`}
                    >
                      <DynamicIcon name={tool.iconName} className="w-6 h-6" />
                    </div>

                    {tool.badge && (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                          tool.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  <span>Open Tool</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
