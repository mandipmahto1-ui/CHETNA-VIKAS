import React from 'react';
import {
  ShieldCheck,
  Zap,
  Check,
  CheckCircle2,
  X,
  Infinity,
} from 'lucide-react';

interface FeatureHighlightsProps {
  onOpenPrivacyModal: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({
  onOpenPrivacyModal,
}) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 3 Core Highlight Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-indigo-100/30 space-y-4 hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            100% Client-Side Processing
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike traditional PDF sites that upload your confidential files to remote servers, Chetna Vikas runs in WebAssembly and JavaScript right inside your browser tab. Your files never touch external storage.
          </p>
          <button
            onClick={onOpenPrivacyModal}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline inline-flex items-center gap-1 cursor-pointer"
          >
            Read Our Privacy Guarantee →
          </button>
        </div>

        <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-indigo-100/30 space-y-4 hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Zero Server Latency & Queueing
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Say goodbye to "Processing file 1 of 1... waiting in queue" bottlenecks. Local execution harnesses the full multi-core performance of your machine for instant splits, merges, and image-to-PDF builds.
          </p>
          <span className="text-xs font-bold text-indigo-600 inline-block">
            Instantaneous Execution ⚡
          </span>
        </div>

        <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-indigo-100/30 space-y-4 hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-rose-200">
            <Infinity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            No Watermarks & Zero Hidden Paywalls
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Clean documents every time. No forced watermark stamps, no hourly task limits, and no credit cards requested. Designed from the ground up for researchers, students, and everyday productivity.
          </p>
          <span className="text-xs font-bold text-rose-600 inline-block">
            100% Free & Open Utility
          </span>
        </div>
      </div>

      {/* Comparison Matrix: Chetna Vikas vs Traditional Cloud Tools */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
            Transparent Architectural Comparison
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Why Chetna Vikas Stands Apart
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            See how client-side PDF engineering outperforms conventional cloud-based converters.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70">
                <th className="py-4 px-6 font-bold text-slate-700">Feature / Metric</th>
                <th className="py-4 px-6 font-bold text-indigo-700 bg-indigo-50/80">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    Chetna Vikas Studio
                  </span>
                </th>
                <th className="py-4 px-6 font-medium text-slate-500">iLovePDF</th>
                <th className="py-4 px-6 font-medium text-slate-500">Sejda</th>
                <th className="py-4 px-6 font-medium text-slate-500">Adobe Acrobat Online</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-800">File Processing Location</td>
                <td className="py-4 px-6 font-bold text-emerald-700 bg-indigo-50/40">
                  100% Client-Side (Your Device)
                </td>
                <td className="py-4 px-6">Remote Cloud Server</td>
                <td className="py-4 px-6">Remote Cloud Server</td>
                <td className="py-4 px-6">Remote Adobe Cloud</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-800">Data Privacy & Leak Risk</td>
                <td className="py-4 px-6 font-bold text-emerald-700 bg-indigo-50/40 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Zero Exposure Risk
                </td>
                <td className="py-4 px-6 text-slate-500">Files Uploaded to 3rd Party</td>
                <td className="py-4 px-6 text-slate-500">Files Uploaded to 3rd Party</td>
                <td className="py-4 px-6 text-slate-500">Subject to Cloud Terms</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-800">Processing Speed</td>
                <td className="py-4 px-6 font-bold text-indigo-700 bg-indigo-50/40">
                  Instant (Zero Network Latency)
                </td>
                <td className="py-4 px-6">Depends on Upload/Download</td>
                <td className="py-4 px-6">Depends on Upload/Download</td>
                <td className="py-4 px-6">Network dependent</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-800">Daily Task Limits</td>
                <td className="py-4 px-6 font-bold text-emerald-700 bg-indigo-50/40 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Unlimited Free
                </td>
                <td className="py-4 px-6 text-rose-500 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Limited tasks/hr
                </td>
                <td className="py-4 px-6 text-rose-500 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> 3 tasks per day limit
                </td>
                <td className="py-4 px-6 text-rose-500 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Requires subscription
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-800">Watermark Added</td>
                <td className="py-4 px-6 font-bold text-emerald-700 bg-indigo-50/40">
                  Never (Always Clean)
                </td>
                <td className="py-4 px-6">Free tier restrictions</td>
                <td className="py-4 px-6">Clean within limit</td>
                <td className="py-4 px-6">Requires Adobe account</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-800">Cost / Subscription</td>
                <td className="py-4 px-6 font-bold text-indigo-700 bg-indigo-50/40">
                  100% Free Forever
                </td>
                <td className="py-4 px-6">$7 - $12 / mo</td>
                <td className="py-4 px-6">$7.50 / mo</td>
                <td className="py-4 px-6">$19.99 / mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
