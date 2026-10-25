import React from 'react';
import { Search, Layers, FileCheck, RefreshCw, PenLine, ShieldCheck } from 'lucide-react';
import type { ToolCategory } from '../../types/workspace';
import { TOOL_CATEGORIES } from '../../data/operationsData';

interface CategoryTabsBarProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFilteredCount?: number;
}

export const CategoryTabsBar: React.FC<CategoryTabsBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalFilteredCount,
}) => {
  const getCategoryIcon = (catId: ToolCategory) => {
    switch (catId) {
      case 'all':
        return <Layers className="w-3.5 h-3.5" />;
      case 'organize':
        return <RefreshCw className="w-3.5 h-3.5" />;
      case 'convert':
        return <FileCheck className="w-3.5 h-3.5" />;
      case 'edit':
        return <PenLine className="w-3.5 h-3.5" />;
      case 'security-ai':
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {TOOL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10 scale-[1.01]'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={isSelected ? 'text-indigo-400' : 'text-slate-400'}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search Tool Filter */}
        <div className="relative w-full md:w-72 shrink-0 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search all 30 PDF tools..."
              className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && totalFilteredCount !== undefined && (
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 shrink-0">
              {totalFilteredCount} found
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
