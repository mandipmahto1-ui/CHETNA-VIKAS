import React from 'react';
import type { OperationId, PdfOperationMeta } from '../../types/workspace';
import { DynamicIcon } from '../DynamicIcon';

interface WorkspaceToolbarProps {
  operations: PdfOperationMeta[];
  activeOperation: OperationId | null;
  onSelectOperation: (opId: OperationId) => void;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  operations,
  activeOperation,
  onSelectOperation,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-2 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        {operations.map((op) => {
          const isActive = activeOperation === op.id;

          let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
          if (op.category === 'organize') badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
          else if (op.category === 'convert') badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
          else if (op.category === 'edit') badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
          else if (op.category === 'security-ai') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

          return (
            <button
              key={op.id}
              type="button"
              onClick={() => onSelectOperation(op.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer group shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs hover:border-slate-300'
              }`}
              title={op.description}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600'
                }`}
              >
                <DynamicIcon name={op.iconName} className="w-3.5 h-3.5" />
              </div>

              <span>{op.name}</span>

              {op.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : badgeColor
                  }`}
                >
                  {op.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
