import React from 'react';
import type { OperationId, ToolCategory } from '../../types/workspace';
import { PDF_OPERATIONS, TOOL_CATEGORIES } from '../../data/operationsData';
import { DynamicIcon } from '../DynamicIcon';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

interface AllOperationsGridProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onSelectOperation: (opId: OperationId) => void;
  hasDocument: boolean;
  onTriggerUpload: () => void;
}

export const AllOperationsGrid: React.FC<AllOperationsGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectOperation,
  hasDocument,
  onTriggerUpload,
}) => {
  const filteredTools = PDF_OPERATIONS.filter((tool) => {
    return selectedCategory === 'all' || tool.category === selectedCategory;
  });

  const handleCardClick = (opId: OperationId) => {
    onSelectOperation(opId);
    if (!hasDocument) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Small timeout to allow scroll before file dialog
      setTimeout(() => {
        onTriggerUpload();
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCategoryTheme = (category: ToolCategory) => {
    switch (category) {
      case 'organize':
        return {
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          hoverBorder: 'hover:border-indigo-400 group-hover:shadow-indigo-500/10',
          accent: 'text-indigo-600',
        };
      case 'convert':
        return {
          bg: 'bg-sky-50 text-sky-600 border-sky-100',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          hoverBorder: 'hover:border-sky-400 group-hover:shadow-sky-500/10',
          accent: 'text-sky-600',
        };
      case 'edit':
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          hoverBorder: 'hover:border-purple-400 group-hover:shadow-purple-500/10',
          accent: 'text-purple-600',
        };
      case 'security-ai':
        return {
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          hoverBorder: 'hover:border-emerald-400 group-hover:shadow-emerald-500/10',
          accent: 'text-emerald-600',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          hoverBorder: 'hover:border-slate-400 group-hover:shadow-slate-500/10',
          accent: 'text-slate-800',
        };
    }
  };

  return (
    <section id="all-30-tools" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/90 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete 30-Tool PDF Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore All 30 PDF Operations
          </h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Every capability executes entirely client-side in your browser. Select any card below to launch its workspace controls directly.
          </p>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TOOL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of All 30 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTools.map((tool) => {
          const theme = getCategoryTheme(tool.category);

          return (
            <div
              key={tool.id}
              onClick={() => handleCardClick(tool.id)}
              className={`group relative rounded-3xl p-5 bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${theme.hoverBorder}`}
            >
              <div className="space-y-3.5">
                {/* Card Header: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs group-hover:scale-110 transition-transform ${theme.bg}`}>
                    <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                  </div>

                  {tool.badge ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs uppercase tracking-wider ${theme.badge}`}>
                      {tool.badge}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 capitalize flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {tool.category}
                    </span>
                  )}
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className={`text-base font-bold text-slate-900 transition-colors ${theme.accent} group-hover:text-indigo-600`}>
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Action */}
              <div className="pt-4 mt-3 border-t border-slate-100/90 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                <span>{hasDocument ? 'Open in Workspace' : 'Select Tool & Upload'}</span>
                <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
