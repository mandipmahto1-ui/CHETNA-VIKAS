import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, Cpu, CheckCircle } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Privacy & Client-Side Architecture Guarantee
              </h3>
              <p className="text-xs text-slate-500">
                100% local browser execution — Chetna Vikas PDF Editor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
              <HardDrive className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs mb-1">0 Server Uploads</h4>
              <p className="text-[11px] text-slate-500">
                Files are loaded into your computer's RAM, never sent to remote cloud disks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
              <Cpu className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs mb-1">WebAssembly Engine</h4>
              <p className="text-[11px] text-slate-500">
                Processed via high-speed JavaScript and pdf-lib engine inside the browser tab.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
              <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-xs mb-1">Instant Memory Wipe</h4>
              <p className="text-[11px] text-slate-500">
                Data is destroyed immediately when the tab is closed or download completes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Our 4 Core Security Commitments:</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Confidentiality First:</strong> We cannot view, inspect, or retain your contracts, bank statements, or identity proofs even if we wanted to.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>No Account or Tracking:</strong> No email address or credit card required. Free forever without invasive telemetry.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Server Bottlenecks:</strong> Because processing doesn't queue up on a cloud server, your gigabit processing happens at instant local speeds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Compliance:</strong> Compatible with GDPR, HIPAA, and Indian DPDP guidelines for local data processing boundaries.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
