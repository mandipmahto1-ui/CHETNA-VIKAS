import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does client-side PDF processing work without a server?',
    a: 'Chetna Vikas uses modern web technologies—specifically WebAssembly and high-performance JavaScript engines like pdf-lib—compiled to run natively within your browser tab. When you select a document, it is loaded into your local computer RAM and processed by your CPU, without making any external upload network requests.',
  },
  {
    q: 'Is Chetna Vikas safe for confidential financial or legal agreements?',
    a: 'Yes, absolutely. Because the files never leave your device, there is zero risk of data interception, cloud server breaches, or unauthorized storage. Even if your internet connection disconnects mid-processing, your files continue to process locally.',
  },
  {
    q: 'Are there any file size or daily page limits?',
    a: 'No artificial limits are imposed by Chetna Vikas. You can merge, split, and edit as many documents as your local device RAM can comfortably handle.',
  },
  {
    q: 'Will Chetna Vikas place a watermark on my downloaded PDFs?',
    a: 'Never. All output files are pristine and unmodified except for the exact changes (rotation, split, watermark, compression) that you explicitly configure.',
  },
  {
    q: 'Can I use Chetna Vikas on mobile devices (smartphones & tablets)?',
    a: 'Yes! The responsive layout is fully optimized for iOS Safari, Android Chrome, and modern tablet browsers with full touch and drag-and-drop support.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5" />
          Got Questions?
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about our browser-based PDF suite.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <span className="font-bold text-sm text-slate-800">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
