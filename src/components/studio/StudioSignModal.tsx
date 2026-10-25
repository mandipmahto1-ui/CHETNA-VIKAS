import React, { useRef, useState } from 'react';
import {
  X,
  PenTool,
  Type,
  Upload,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { AnnotationItem } from '../../types/workspace';

interface StudioSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (ann: AnnotationItem) => void;
  currentPageIndex: number;
}

export const StudioSignModal: React.FC<StudioSignModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
  currentPageIndex,
}) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('Mandip');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Drawing pad handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Convert typed name to image data URL
  const getTypedSignatureDataUrl = (): string => {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 150;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    ctx.font = 'italic 48px Georgia, serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName, 200, 75);
    return c.toDataURL('image/png');
  };

  const handleApply = () => {
    let dataUrl = '';
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      dataUrl = canvas.toDataURL('image/png');
    } else if (tab === 'type') {
      dataUrl = getTypedSignatureDataUrl();
    }

    if (!dataUrl) return;

    onSaveSignature({
      id: `sig-${Date.now()}`,
      type: 'signature',
      pageIndex: currentPageIndex,
      x: 35,
      y: 65,
      width: 25,
      height: 10,
      imageDataUrl: dataUrl,
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSaveSignature({
            id: `sig-${Date.now()}`,
            type: 'signature',
            pageIndex: currentPageIndex,
            x: 35,
            y: 65,
            width: 25,
            height: 10,
            imageDataUrl: event.target.result as string,
          });
          onClose();
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 fade-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-pink-600" />
            <h3 className="text-base font-bold text-slate-800">Add Signature</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Draw / Type / Upload */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('draw')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'draw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('type')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'type' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('upload');
              fileInputRef.current?.click();
            }}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Tab 1: Draw on canvas */}
        {tab === 'draw' && (
          <div className="space-y-2">
            <div className="border border-slate-300 rounded-lg bg-slate-50 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={460}
                height={160}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-40 bg-white cursor-crosshair block"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 text-xs text-slate-500 hover:text-slate-800 bg-white/90 border border-slate-200 px-2 py-1 rounded shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Draw your signature above using your mouse or trackpad.
            </p>
          </div>
        )}

        {/* Tab 2: Type signature */}
        {tab === 'type' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400"
              />
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-lg bg-pink-50/40 border border-pink-100 text-center">
              <span className="font-serif italic text-3xl text-slate-800">
                {typedName || 'Signature'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Place Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
};
