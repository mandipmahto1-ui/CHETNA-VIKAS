import React from 'react';
import { X, Check, Laptop, Zap } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioPricingModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-800">
            <span className="font-chetna-vikas font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">Chetna Vikas PDF Editor</span> Pricing
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-pink-50/80 via-rose-50/60 to-purple-50/80 border border-pink-200/80 text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-pink-600 bg-white px-3 py-1 rounded-full border border-pink-200 shadow-xs">
            Community Edition
          </span>
          <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 bg-clip-text text-transparent">$0 / Free</div>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            100% Free Forever • All 28+ PDF Tools Included • Runs 100% Client-Side with Zero Server Costs
          </p>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-pink-600" />
            <span>Unlimited merges, splits, and page reordering</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-pink-600" />
            <span>In-browser digital signatures and interactive text editing</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-pink-600" />
            <span>High-speed raster compression and Office converters</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-pink-600" />
            <span>Military-grade client privacy: your files never leave your computer</span>
          </li>
        </ul>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-xs rounded-lg shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transition-all cursor-pointer"
          >
            Start Using For Free
          </button>
        </div>
      </div>
    </div>
  );
};

export const StudioDesktopModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-bold text-slate-800">
              <span className="font-chetna-vikas font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">Chetna Vikas PDF Editor</span> Desktop & Offline Support
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            <span className="font-chetna-vikas font-bold text-slate-900">Chetna Vikas PDF Editor</span> is built from the ground up as a modern Progressive Web App (PWA) with pure client-side WebAssembly and JavaScript engines.
          </p>
          <div className="p-4 rounded-xl bg-pink-50/40 border border-pink-100/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Zap className="w-4 h-4 text-pink-600" />
              <span>Install to Desktop</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Click the install icon in your browser address bar (Chrome, Edge, Brave, Safari) to run <span className="font-chetna-vikas font-bold text-slate-800">Chetna Vikas PDF Editor</span> directly on your Windows, Mac, or Linux desktop without an internet connection!
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-xs rounded-lg shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
