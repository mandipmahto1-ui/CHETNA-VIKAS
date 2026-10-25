import React from 'react';
import {
  RotateCw,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus,
  Layers,
} from 'lucide-react';

interface ThumbnailRailProps {
  pageThumbnails: string[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onInsertBlankPage: (afterIndex: number) => void;
}

export const ThumbnailRail: React.FC<ThumbnailRailProps> = ({
  pageThumbnails,
  currentPageIndex,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
  onInsertBlankPage,
}) => {
  return (
    <aside className="w-56 sm:w-64 bg-white/90 backdrop-blur-md border-r border-slate-200/90 flex flex-col h-full shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Pages ({pageThumbnails.length})
          </span>
        </div>

        <button
          type="button"
          onClick={() => onInsertBlankPage(pageThumbnails.length - 1)}
          className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="Insert blank page at end"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Page</span>
        </button>
      </div>

      {/* Thumbnails Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {pageThumbnails.map((thumbUrl, idx) => {
          const isSelected = idx === currentPageIndex;

          return (
            <div
              key={idx}
              className={`group relative rounded-2xl p-2 transition-all duration-150 border-2 ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-600 shadow-md shadow-indigo-100'
                  : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              {/* Page Number & Quick Action Bar */}
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span
                  className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Page {idx + 1}
                </span>

                {/* Thumbnail Action Buttons (Rotate, Duplicate, Delete, Move) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMovePage(idx, idx - 1);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  )}

                  {idx < pageThumbnails.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMovePage(idx, idx + 1);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePage(idx);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(idx);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    title="Duplicate Page"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {pageThumbnails.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePage(idx);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Clickable Page Image Preview */}
              <div
                onClick={() => onSelectPage(idx)}
                className="w-full aspect-[1/1.414] rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 cursor-pointer flex items-center justify-center relative shadow-2xs hover:opacity-95"
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 text-[10px]">
                    <Layers className="w-5 h-5 mb-1" />
                    Rendering...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
