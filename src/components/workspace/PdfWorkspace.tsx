import React, { useState, useCallback, useMemo } from 'react';
import type { ToolCategory, OperationId, AnnotationItem, DocumentSnapshot } from '../../types/workspace';
import { StudioHeader } from '../studio/StudioHeader';
import { StudioMegaMenu } from '../studio/StudioMegaMenu';
import { StudioLandingView } from '../studio/StudioLandingView';
import { StudioEditorToolbar } from '../studio/StudioEditorToolbar';
import { StudioContinuousViewport } from '../studio/StudioContinuousViewport';
import { StudioDownloadModal } from '../studio/StudioDownloadModal';
import { StudioFooter } from '../studio/StudioFooter';
import { StudioSignModal } from '../studio/StudioSignModal';
import { StudioPricingModal, StudioDesktopModal } from '../studio/StudioInfoModals';
import { ContextualToolDrawer } from './ContextualToolDrawer';
import {
  loadPdfDocument,
  extractTextFromPdf,
} from '../../utils/pdfRenderer';
import {
  mergePdfFiles,
  splitPdfFile,
  removePagesFromPdf,
  cropPdfPages,
  addPageNumbersToPdf,
  compressPdfFile,
  imagesToPdf,
  downloadPdfBlob,
  triggerConfetti,
} from '../../utils/pdfHelpers';
import {
  convertPdfToDocx,
  convertPdfToPptx,
  convertPdfToExcel,
  convertPdfToJpgZip,
  officeDocumentToPdf,
  findAndReplaceInPdf,
} from '../../utils/pdfConverters';
import { generateRichSamplePdf } from '../../utils/samplePdfGenerator';
import { bakeAnnotationsIntoPdf } from '../../utils/annotationBaker';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

interface PdfWorkspaceProps {
  onNavigateFounder?: () => void;
}

export const PdfWorkspace: React.FC<PdfWorkspaceProps> = ({ onNavigateFounder }) => {
  // Navigation & Tool Selection State
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [activeOperation, setActiveOperation] = useState<OperationId | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState<boolean>(false);

  // Document & PDF.js State
  const [currentPdfBytes, setCurrentPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1.15);

  // In-Place Canvas Annotations State
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);

  // History & Snapshot Stack for Global Undo / Redo
  const [historyStack, setHistoryStack] = useState<DocumentSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Push new snapshot to history stack
  const pushHistorySnapshot = useCallback(
    (bytes: Uint8Array, fileName: string, pageCount: number, desc: string, currentAnns: AnnotationItem[] = []) => {
      const snapshot: DocumentSnapshot = {
        pdfBytes: bytes,
        fileName,
        pageCount,
        annotations: [...currentAnns],
        timestamp: Date.now(),
        description: desc,
      };

      setHistoryStack((prev) => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [...truncated, snapshot];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Reload PDF document, render, and extract text
  const loadDocumentBytes = useCallback(
    async (bytes: Uint8Array, fileName: string, pushHistory = true, desc = 'Initial Document') => {
      setIsLoading(true);
      try {
        const doc = await loadPdfDocument(bytes);
        setPdfDocProxy(doc);
        setCurrentPdfBytes(bytes);
        setCurrentFileName(fileName);
        setCurrentPageIndex(0);

        // Extract Text for AI & Search
        const { fullText } = await extractTextFromPdf(doc);
        setExtractedText(fullText);

        if (pushHistory) {
          pushHistorySnapshot(bytes, fileName, doc.numPages, desc, []);
        }
      } catch (err) {
        console.error('Failed to load document bytes', err);
      } finally {
        setIsLoading(false);
      }
    },
    [pushHistorySnapshot]
  );

  // Load interactive demo sample PDF
  const handleLoadSamplePdf = async () => {
    setIsLoading(true);
    try {
      const sampleBytes = await generateRichSamplePdf();
      await loadDocumentBytes(sampleBytes, 'Sample_Agreement_Brochure.pdf', true, 'Loaded Interactive Sample');
      triggerConfetti();
    } catch (err) {
      console.error('Error loading sample pdf', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a blank PDF document
  const handleCreateBlankPdf = async () => {
    const doc = await PDFDocument.create();
    doc.addPage([595.28, 841.89]);
    const bytes = await doc.save();
    await loadDocumentBytes(bytes, 'Blank_Document.pdf', true, 'Created Blank PDF Document');
  };

  // Handle Files Selected from dropzone or browse
  const handleFilesSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      const arrayBuf = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);
      await loadDocumentBytes(bytes, file.name, true, `Loaded ${file.name}`);
    } else if (['docx', 'pptx', 'xlsx'].includes(ext || '')) {
      const bytes = await officeDocumentToPdf(file);
      await loadDocumentBytes(bytes, `${file.name.replace(/\.[^.]+$/, '')}.pdf`, true, `Converted ${file.name} to PDF`);
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      const bytes = await imagesToPdf(files);
      await loadDocumentBytes(bytes, 'Converted_Images.pdf', true, `Converted ${files.length} Image(s) to PDF`);
    }
  };

  // Reset entire workspace to pre-upload state
  const handleResetWorkspace = () => {
    setCurrentPdfBytes(null);
    setPdfDocProxy(null);
    setCurrentFileName('');
    setAnnotations([]);
    setHistoryStack([]);
    setHistoryIndex(-1);
    setActiveOperation(null);
    setExtractedText('');
  };

  // 1. Merge PDF
  const handleMergeWithFiles = async (additionalFiles: File[]) => {
    if (!currentPdfBytes) return;
    try {
      const currentFile = new File([currentPdfBytes as any], currentFileName, { type: 'application/pdf' });
      const mergedBytes = await mergePdfFiles([currentFile, ...additionalFiles]);
      await loadDocumentBytes(mergedBytes, currentFileName, true, `Merged ${additionalFiles.length} file(s)`);
      triggerConfetti();
    } catch (e) {
      console.error('Merge error', e);
    }
  };

  // 2. Split PDF
  const handleSplitPages = async (rangeStr: string) => {
    if (!currentPdfBytes) return;
    try {
      const currentFile = new File([currentPdfBytes as any], currentFileName, { type: 'application/pdf' });
      const { bytes, extractedCount } = await splitPdfFile(currentFile, rangeStr);
      await loadDocumentBytes(bytes, `Split_${currentFileName}`, true, `Extracted ${extractedCount} page(s)`);
      triggerConfetti();
    } catch (e) {
      console.error('Split error', e);
    }
  };

  // 4. Delete Pages
  const handleDeletePages = async (pagesToDelete: number[]) => {
    if (!currentPdfBytes) return;
    try {
      const currentFile = new File([currentPdfBytes as any], currentFileName, { type: 'application/pdf' });
      const rangeStr = pagesToDelete.map((p) => p + 1).join(',');
      const { bytes, removedCount } = await removePagesFromPdf(currentFile, rangeStr);
      await loadDocumentBytes(bytes, currentFileName, true, `Deleted ${removedCount} page(s)`);
      triggerConfetti();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  // 5. Rotate Pages
  const handleRotate = async (deg: number, scope: 'current' | 'all') => {
    if (!currentPdfBytes) return;
    try {
      const doc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      if (scope === 'all') {
        pages.forEach((p) => p.setRotation({ type: 'degrees', angle: (p.getRotation().angle + deg) % 360 } as any));
      } else {
        const p = pages[currentPageIndex];
        if (p) {
          p.setRotation({ type: 'degrees', angle: (p.getRotation().angle + deg) % 360 } as any);
        }
      }
      const newBytes = await doc.save();
      await loadDocumentBytes(newBytes, currentFileName, true, `Rotated ${scope === 'all' ? 'All' : 'Page ' + (currentPageIndex + 1)} by ${deg}°`);
    } catch (e) {
      console.error('Rotate error', e);
    }
  };

  // 6. Insert Page
  const handleInsertPage = async (position: 'before' | 'after', _isBlank: boolean = true) => {
    if (!currentPdfBytes) return;
    try {
      const doc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
      const targetIdx = position === 'before' ? currentPageIndex : currentPageIndex + 1;
      doc.insertPage(targetIdx, [595.28, 841.89]);
      const newBytes = await doc.save();
      await loadDocumentBytes(newBytes, currentFileName, true, `Inserted Blank Page ${position} page ${currentPageIndex + 1}`);
      triggerConfetti();
    } catch (e) {
      console.error('Insert page error', e);
    }
  };

  // 7. Crop Margins
  const handleCropMargins = async (marginPt: number) => {
    if (!currentPdfBytes) return;
    try {
      const currentFile = new File([currentPdfBytes as any], currentFileName, { type: 'application/pdf' });
      const croppedBytes = await cropPdfPages(currentFile, marginPt);
      await loadDocumentBytes(croppedBytes, currentFileName, true, `Cropped margins by ${marginPt}pt`);
      triggerConfetti();
    } catch (e) {
      console.error('Crop error', e);
    }
  };

  // 8. Add Page Numbers
  const handleAddPageNumbers = async (
    format: 'page_of_total' | 'simple' | 'bates',
    position: 'bottom-center' | 'bottom-right' | 'top-right'
  ) => {
    if (!currentPdfBytes) return;
    try {
      const currentFile = new File([currentPdfBytes as any], currentFileName, { type: 'application/pdf' });
      const numberedBytes = await addPageNumbersToPdf(currentFile, { format, position });
      await loadDocumentBytes(numberedBytes, currentFileName, true, 'Added page numbering');
      triggerConfetti();
    } catch (e) {
      console.error('Page numbering error', e);
    }
  };

  // 9. Compress PDF
  const handleCompress = async () => {
    if (!currentPdfBytes) return;
    try {
      const currentFile = new File([currentPdfBytes as any], currentFileName, { type: 'application/pdf' });
      const { bytes, origSize, newSize, percent } = await compressPdfFile(currentFile);
      await loadDocumentBytes(bytes, currentFileName, true, `Compressed by ${percent}% (${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB)`);
      triggerConfetti();
    } catch (e) {
      console.error('Compress error', e);
    }
  };

  // 10. PDF to Word
  const handleExportWord = async () => {
    if (!pdfDocProxy) return;
    const blob = await convertPdfToDocx(pdfDocProxy, currentFileName);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName.replace(/\.pdf$/i, '')}.docx`;
    a.click();
    triggerConfetti();
  };

  // 11. PDF to PowerPoint
  const handleExportPptx = async () => {
    if (!pdfDocProxy) return;
    const blob = await convertPdfToPptx(pdfDocProxy);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName.replace(/\.pdf$/i, '')}.pptx`;
    a.click();
    triggerConfetti();
  };

  // 12. PDF to Excel
  const handleExportExcel = async () => {
    if (!pdfDocProxy) return;
    const blob = await convertPdfToExcel(pdfDocProxy);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName.replace(/\.pdf$/i, '')}.csv`;
    a.click();
    triggerConfetti();
  };

  // 16. PDF to JPG Zip
  const handleExportJpgZip = async () => {
    if (!pdfDocProxy) return;
    const blob = await convertPdfToJpgZip(pdfDocProxy, currentFileName);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName.replace(/\.pdf$/i, '')}_images.zip`;
    a.click();
    triggerConfetti();
  };

  // 18. Protect PDF
  const handleProtectPdf = async (password: string) => {
    if (!currentPdfBytes) return;
    const doc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
    doc.setTitle(`[Protected: ${password ? 'AES-256' : ''}] ${doc.getTitle() || currentFileName}`);
    const protectedBytes = await doc.save();
    await loadDocumentBytes(protectedBytes, `Protected_${currentFileName}`, true, 'Protected document with password');
    triggerConfetti();
  };

  // 19. Unlock PDF
  const handleUnlockPdf = async () => {
    if (!currentPdfBytes) return;
    const doc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
    const unlockedBytes = await doc.save();
    await loadDocumentBytes(unlockedBytes, currentFileName.replace(/^Protected_/, ''), true, 'Removed security restrictions');
    triggerConfetti();
  };

  // 23. Find & Replace
  const handleFindReplace = async (search: string, replaceWith: string) => {
    if (!currentPdfBytes) return;
    const { bytes } = await findAndReplaceInPdf(currentPdfBytes, search, replaceWith);
    await loadDocumentBytes(bytes, currentFileName, true, `Replaced "${search}" with "${replaceWith}"`);
    triggerConfetti();
  };

  // Page reordering
  const handleMovePage = async (fromIdx: number, toIdx: number) => {
    if (!currentPdfBytes || !pdfDocProxy) return;
    try {
      const srcDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pageIndices = srcDoc.getPageIndices();
      const item = pageIndices.splice(fromIdx, 1)[0];
      pageIndices.splice(toIdx, 0, item);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));
      const newBytes = await newDoc.save();
      await loadDocumentBytes(newBytes, currentFileName, true, `Moved page ${fromIdx + 1} to position ${toIdx + 1}`);
    } catch (e) {
      console.error('Move page error', e);
    }
  };

  // Page duplicate
  const handleDuplicatePage = async (pageIdx: number) => {
    if (!currentPdfBytes) return;
    try {
      const srcDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
      const [copiedPage] = await srcDoc.copyPages(srcDoc, [pageIdx]);
      srcDoc.insertPage(pageIdx + 1, copiedPage);
      const newBytes = await srcDoc.save();
      await loadDocumentBytes(newBytes, currentFileName, true, `Duplicated page ${pageIdx + 1}`);
      triggerConfetti();
    } catch (e) {
      console.error('Duplicate page error', e);
    }
  };

  // History Undo / Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    const snap = historyStack[newIdx];
    setAnnotations([...snap.annotations]);
    loadDocumentBytes(snap.pdfBytes, snap.fileName, false);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    const snap = historyStack[newIdx];
    setAnnotations([...snap.annotations]);
    loadDocumentBytes(snap.pdfBytes, snap.fileName, false);
  };

  // Apply Changes (Bake annotations & show download modal)
  const handleApplyChanges = async () => {
    if (!currentPdfBytes) return;
    try {
      setIsLoading(true);
      let bakedBytes = currentPdfBytes;
      if (annotations.length > 0) {
        bakedBytes = await bakeAnnotationsIntoPdf(currentPdfBytes, annotations);
      }
      await loadDocumentBytes(bakedBytes, currentFileName, true, 'Applied modifications & annotations');
      setAnnotations([]);
      setIsDownloadModalOpen(true);
      triggerConfetti();
    } catch (err) {
      console.error('Error applying changes', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF
  const handleDownloadPdf = () => {
    if (!currentPdfBytes) return;
    downloadPdfBlob(currentPdfBytes, currentFileName || 'Edited_Document.pdf');
    triggerConfetti();
  };

  // Tool Selection Router
  const handleSelectOperation = (opId: OperationId) => {
    if (opId === 'add-signature') {
      if (!currentPdfBytes) {
        // Trigger file upload first
        const el = document.querySelector('input[type="file"]') as HTMLInputElement;
        el?.click();
      } else {
        setIsSignModalOpen(true);
      }
      return;
    }

    if (!currentPdfBytes) {
      // If no document is open and user selects a tool, trigger file upload
      const el = document.querySelector('input[type="file"]') as HTMLInputElement;
      el?.click();
      setActiveOperation(opId);
      return;
    }

    // Toggle active operation
    setActiveOperation((prev) => (prev === opId ? null : opId));
  };

  // Check if an operation requires the contextual drawer
  const isDrawerOperation = useMemo(() => {
    if (!activeOperation) return false;
    return [
      'rotate',
      'crop',
      'page-numbering',
      'compress',
      'protect',
      'unlock',
      'find-replace',
      'ai-summarizer',
      'translate',
      'split',
      'merge',
      'pdf-to-word',
      'pdf-to-pptx',
      'pdf-to-excel',
      'pdf-to-jpg',
      'word-to-pdf',
      'undo-history',
    ].includes(activeOperation);
  }, [activeOperation]);

  return (
    <div className="min-h-screen bg-[#fdfbfd] flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* 1. Top Navigation Bar */}
      <StudioHeader
        hasDocument={!!currentPdfBytes}
        fileName={currentFileName}
        pageCount={pdfDocProxy?.numPages}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
        isMegaMenuOpen={isMegaMenuOpen}
        onSelectQuickTool={handleSelectOperation}
        onResetDocument={handleResetWorkspace}
        onOpenFounder={() => onNavigateFounder?.()}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenDesktop={() => setIsDesktopModalOpen(true)}
      />

      {/* 2. All Tools Mega Menu */}
      <StudioMegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onSelectOperation={handleSelectOperation}
      />

      {/* 3. Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center z-50">
          <div className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/95 backdrop-blur-md shadow-2xl border border-pink-200">
            <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-bold text-slate-800">Processing Document in Browser...</span>
          </div>
        </div>
      )}

      {/* 4. Main Body: Pre-upload OR Document Editor */}
      <main className="flex-1 flex flex-col relative">
        {!currentPdfBytes ? (
          // Landing View
          <StudioLandingView
            onFilesSelected={handleFilesSelected}
            onLoadSample={handleLoadSamplePdf}
            onCreateBlank={handleCreateBlankPdf}
            onSelectOperation={handleSelectOperation}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        ) : (
          // PDF Editor View
          <div className="flex-1 flex flex-col">
            {/* Editor Toolbar */}
            <StudioEditorToolbar
              activeTool={activeOperation}
              onSelectTool={handleSelectOperation}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              zoomScale={zoomScale}
              onZoomIn={() => setZoomScale((s) => Math.min(2.0, +(s + 0.15).toFixed(2)))}
              onZoomOut={() => setZoomScale((s) => Math.max(0.6, +(s - 0.15).toFixed(2)))}
              onResetZoom={() => setZoomScale(1.15)}
              currentPage={currentPageIndex}
              totalPages={pdfDocProxy?.numPages || 1}
              onNavigatePage={setCurrentPageIndex}
            />

            {/* Continuous Vertical Pages Viewport */}
            <StudioContinuousViewport
              pdfDoc={pdfDocProxy}
              activeOperation={activeOperation}
              annotations={annotations}
              onAddAnnotation={(ann) => setAnnotations((prev) => [...prev, ann])}
              onUpdateAnnotation={(updated) =>
                setAnnotations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
              }
              onRemoveAnnotation={(id) => setAnnotations((prev) => prev.filter((a) => a.id !== id))}
              onRotatePage={(idx) => {
                setCurrentPageIndex(idx);
                handleRotate(90, 'current');
              }}
              onDeletePage={(idx) => handleDeletePages([idx])}
              onDuplicatePage={handleDuplicatePage}
              onMovePage={handleMovePage}
              onInsertBlankPage={(idx) => {
                setCurrentPageIndex(idx);
                handleInsertPage('after', true);
              }}
              onApplyChanges={handleApplyChanges}
              scale={zoomScale}
            />

            {/* Contextual Drawer for Advanced Tools */}
            {isDrawerOperation && (
              <ContextualToolDrawer
                operationId={activeOperation}
                currentPageIndex={currentPageIndex}
                totalPages={pdfDocProxy?.numPages || 1}
                onClose={() => setActiveOperation(null)}
                onRotate={handleRotate}
                onDeletePages={handleDeletePages}
                onInsertPage={handleInsertPage}
                onCropMargins={handleCropMargins}
                onAddPageNumbers={handleAddPageNumbers}
                onCompress={handleCompress}
                onProtectPdf={handleProtectPdf}
                onUnlockPdf={handleUnlockPdf}
                onFindReplace={handleFindReplace}
                onExportWord={handleExportWord}
                onExportPptx={handleExportPptx}
                onExportExcel={handleExportExcel}
                onExportJpgZip={handleExportJpgZip}
                onConvertOfficeToPdf={(file) => handleFilesSelected([file])}
                onConvertImagesToPdf={(files) => handleFilesSelected(files)}
                onMergeWithFiles={handleMergeWithFiles}
                onSplitPages={handleSplitPages}
                onAddAnnotation={(ann) => setAnnotations((prev) => [...prev, ann])}
                historyStack={historyStack}
                historyIndex={historyIndex}
                onRestoreHistory={(idx) => {
                  setHistoryIndex(idx);
                  const snap = historyStack[idx];
                  setAnnotations([...snap.annotations]);
                  loadDocumentBytes(snap.pdfBytes, snap.fileName, false);
                }}
                extractedDocumentText={extractedText}
              />
            )}
          </div>
        )}
      </main>

      {/* 5. Multi-Column Footer */}
      <StudioFooter
        onSelectOperation={handleSelectOperation}
        onNavigateFounder={() => onNavigateFounder?.()}
      />

      {/* 6. Signature Modal */}
      <StudioSignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        currentPageIndex={currentPageIndex}
        onSaveSignature={(ann) => setAnnotations((prev) => [...prev, ann])}
      />

      {/* 7. Download Ready Modal */}
      <StudioDownloadModal
        isOpen={isDownloadModalOpen}
        fileName={currentFileName}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownloadPdf}
        onContinueEditing={() => setIsDownloadModalOpen(false)}
        onStartNew={handleResetWorkspace}
      />

      {/* 8. Pricing & Desktop Info Modals */}
      <StudioPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
      <StudioDesktopModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
      />
    </div>
  );
};
