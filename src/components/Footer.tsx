import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';
import type { ToolCategory } from '../types';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './BrandIcons';

interface FooterProps {
  onNavigate: (page: 'home' | 'founder') => void;
  onFilterCategory?: (category: ToolCategory) => void;
  onOpenPrivacyModal: () => void;
  onSelectToolById: (toolId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacyModal,
  onSelectToolById,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-xl pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <img
                src="/logo.png"
                alt="Chetna Vikas Logo"
                className="w-10 h-10 rounded-xl object-contain shadow-xs border border-slate-200/60 bg-white p-0.5 shrink-0"
              />
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Chetna{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                  Vikas
                </span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Fast, secure, and client-side online PDF suite combining the best capabilities of iLovePDF and Sejda with 100% in-browser confidentiality.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenPrivacyModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Privacy Verified
              </button>
            </div>
          </div>

          {/* Column: Core Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Core PDF Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectToolById('merge-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('split-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('image-to-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  JPG/PNG to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('rotate-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Rotate & Watermark
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('compress-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Compress PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Conversions & Edit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Conversions & Edits
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectToolById('text-to-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Text to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('word-to-pdf')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Word to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('pdf-to-jpg')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  PDF to JPG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('edit-metadata')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Edit Metadata
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('protect-password')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Protect / Password
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Company & Leadership */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Company & Owner
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => {
                    onNavigate('founder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 font-semibold text-indigo-600 transition-colors cursor-pointer"
                >
                  Founder &amp; Owner Profile →
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('founder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <span className="text-slate-400">Zero Server Telemetry</span>
              </li>
              <li>
                <span className="text-slate-400">GDPR & DPDP Friendly</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Chetna Vikas. All rights reserved. Zero server tracking.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              Developed &amp; Managed By{' '}
              <button
                type="button"
                onClick={() => {
                  onNavigate('founder');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 hover:decoration-indigo-600 underline-offset-4 transition-colors cursor-pointer"
                title="View Founder Profile - Mandip Kumar Mahto"
              >
                Mandip Kumar Mahto
              </button>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
