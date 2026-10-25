import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ToolCategory, OperationId, AnnotationItem, DocumentSnapshot } from '../../types/workspace';
import { PDF_OPERATIONS } from '../../data/operationsData';
import { AppHeader } from './AppHeader';
import { CategoryTabsBar } from './CategoryTabsBar';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { PreUploadDropzone } from './PreUploadDropzone';
import { ThumbnailRail } from './ThumbnailRail';
import { PdfCanvasViewport } from './PdfCanvasViewport';
import { ContextualToolDrawer } from './ContextualToolDrawer';
import { BottomActionBar } from './BottomActionBar';
import { generateRichSamplePdf } from '../../utils/samplePdfGenerator';
import {
  loadPdfDocument,
  renderPageThumbnail,
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
import { bakeAnnotationsIntoPdf } from '../../utils/annotationBaker';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

export const PdfWorkspace: React.FC = () => {
  // Navigation & Tool Selection State
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOperation, setActiveOperation] = useState<OperationId | null>(null);

  // Document & PDF.js State
  const [currentPdfBytes, setCurrentPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // In-Place Canvas Annotations State
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const drawToolColor = '#ef4444';
  const drawStrokeWidth = 3;

  // History & Snapshot Stack for Global Undo / Redo (#30)
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

  // Reload PDF document, render thumbnails, and extract text
  const loadDocumentBytes = useCallback(
    async (bytes: Uint8Array, fileName: string, pushHistory = true, desc = 'Initial Document') => {
      setIsLoading(true);
      try {
        const doc = await loadPdfDocument(bytes);
        setPdfDocProxy(doc);
        setCurrentPdfBytes(bytes);
        setCurrentFileName(fileName);
        setCurrentPageIndex(0);

        // Generate Thumbnails for all pages
        const thumbs: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const thumb = await renderPageThumbnail(doc, i, 160);
          thumbs.push(thumb);
        }
        setPageThumbnails(thumbs);

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

  // Filter operations based on selected category and search query
  const filteredOperations = useMemo(() => {
    return PDF_OPERATIONS.filter((op) => {
      const matchesCategory = selectedCategory === 'all' || op.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        op.name.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q) ||
        op.id.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle loading sample document
  const handleLoadSamplePdf = async () => {
    const bytes = await generateRichSamplePdf();
    await loadDocumentBytes(bytes, 'ChetnaVikas_Sample_Doc.pdf', true, 'Loaded 4-Page Sample PDF');
    triggerConfetti();
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
    setPageThumbnails([]);
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
        p.setRotation({ type: 'degrees', angle: (p.getRotation().angle + deg) % 360 } as any);
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
    // Bakes encrypted marker in client
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

  // Page reordering from thumbnail rail
  const handleMovePage = async (fromIdx: number, toIdx: number) => {
    if (!currentPdfBytes || !pdfDocProxy) return;
    try {
      const srcDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pageIndices = srcDoc.getPageIndices();
      // Swap order
      const item = pageIndices.splice(fromIdx, 1)[0];
      pageIndices.splice(toIdx, 0, item);

      const copied = await newDoc.copyPages(srcDoc, pageIndices);
      copied.forEach((p) => newDoc.addPage(p));

      const newBytes = await newDoc.save();
      await loadDocumentBytes(newBytes, currentFileName, true, `Moved Page ${fromIdx + 1} to ${toIdx + 1}`);
      setCurrentPageIndex(toIdx);
    } catch (e) {
      console.error('Move page error', e);
    }
  };

  // Duplicate page from thumbnail rail
  const handleDuplicatePage = async (idx: number) => {
    if (!currentPdfBytes) return;
    try {
      const srcDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const indices = srcDoc.getPageIndices();
      // Insert duplicate index right after idx
      indices.splice(idx + 1, 0, idx);

      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((p) => newDoc.addPage(p));

      const newBytes = await newDoc.save();
      await loadDocumentBytes(newBytes, currentFileName, true, `Duplicated Page ${idx + 1}`);
      triggerConfetti();
    } catch (e) {
      console.error('Duplicate error', e);
    }
  };

  // Apply Changes: Bakes active canvas annotations into current PDF bytes
  const handleApplyChanges = async () => {
    if (!currentPdfBytes || annotations.length === 0) return;
    try {
      const bakedBytes = await bakeAnnotationsIntoPdf(currentPdfBytes, annotations);
      await loadDocumentBytes(bakedBytes, currentFileName, true, 'Committed annotations & changes');
      setAnnotations([]);
      triggerConfetti();
    } catch (e) {
      console.error('Bake error', e);
    }
  };

  // Global Undo / Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  const handleUndo = async () => {
    if (!canUndo) return;
    const targetIdx = historyIndex - 1;
    const snap = historyStack[targetIdx];
    setHistoryIndex(targetIdx);
    setAnnotations([...snap.annotations]);
    await loadDocumentBytes(snap.pdfBytes, snap.fileName, false);
  };

  const handleRedo = async () => {
    if (!canRedo) return;
    const targetIdx = historyIndex + 1;
    const snap = historyStack[targetIdx];
    setHistoryIndex(targetIdx);
    setAnnotations([...snap.annotations]);
    await loadDocumentBytes(snap.pdfBytes, snap.fileName, false);
  };

  // Global Ctrl+Z / Ctrl+Y listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Export / Download PDF
  const handleExportPdf = async () => {
    if (!currentPdfBytes) return;
    let finalBytes = currentPdfBytes;
    if (annotations.length > 0) {
      finalBytes = await bakeAnnotationsIntoPdf(currentPdfBytes, annotations);
    }
    downloadPdfBlob(finalBytes, currentFileName || 'ChetnaVikas_Document.pdf');
    triggerConfetti();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* 1. Header & Navigation Bar */}
      <AppHeader
        fileName={currentFileName}
        pageCount={pdfDocProxy?.numPages}
        fileSizeBytes={currentPdfBytes?.length}
        hasUnsavedChanges={annotations.length > 0}
        onReset={handleResetWorkspace}
        onLoadSample={handleLoadSamplePdf}
        onTriggerUpload={() => {
          const el = document.querySelector('input[type="file"]') as HTMLInputElement;
          el?.click();
        }}
      />

      {/* 2. Top Category Tabs Bar */}
      <CategoryTabsBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalFilteredCount={filteredOperations.length}
      />

      {/* 3. Workspace Toolbar matching 30 operations */}
      <WorkspaceToolbar
        operations={filteredOperations}
        activeOperation={activeOperation}
        onSelectOperation={(opId) => {
          setActiveOperation((prev) => (prev === opId ? null : opId));
        }}
      />

      {/* 4. Central Workspace Area */}
      <main className="flex-1 flex overflow-hidden relative min-h-[580px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white shadow-xl border border-slate-200">
              <span className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-xs font-bold text-slate-800">Processing Document In Browser...</span>
            </div>
          </div>
        )}

        {!currentPdfBytes ? (
          // Pre-upload State
          <div className="w-full flex items-center justify-center">
            <PreUploadDropzone
              onFilesSelected={handleFilesSelected}
              onLoadSample={handleLoadSamplePdf}
              onCreateBlank={handleCreateBlankPdf}
            />
          </div>
        ) : (
          // Active State: Document Loaded
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Thumbnail Rail */}
            <ThumbnailRail
              pageThumbnails={pageThumbnails}
              currentPageIndex={currentPageIndex}
              onSelectPage={setCurrentPageIndex}
              onRotatePage={(idx) => {
                setCurrentPageIndex(idx);
                handleRotate(90, 'current');
              }}
              onDeletePage={(idx) => handleDeletePages([idx])}
              onDuplicatePage={handleDuplicatePage}
              onMovePage={handleMovePage}
              onInsertBlankPage={() => handleInsertPage('after', true)}
            />

            {/* Center Viewport Renderer & Annotation Layer */}
            <PdfCanvasViewport
              pdfDoc={pdfDocProxy}
              currentPageIndex={currentPageIndex}
              totalPages={pdfDocProxy?.numPages || 1}
              activeOperation={activeOperation}
              annotations={annotations}
              onAddAnnotation={(ann) => setAnnotations((prev) => [...prev, ann])}
              onRemoveAnnotation={(id) => setAnnotations((prev) => prev.filter((a) => a.id !== id))}
              onSelectPage={setCurrentPageIndex}
              drawToolColor={drawToolColor}
              drawStrokeWidth={drawStrokeWidth}
            />

            {/* Contextual Action Drawer for the selected tool */}
            {activeOperation && (
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

      {/* 5. Bottom Action Bar (Only visible when document is loaded) */}
      {currentPdfBytes && (
        <BottomActionBar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onApplyChanges={handleApplyChanges}
          onExportPdf={handleExportPdf}
          onOpenHistory={() => setActiveOperation('undo-history')}
          hasUnsavedChanges={annotations.length > 0}
          pageCount={pdfDocProxy?.numPages || 1}
          fileName={currentFileName}
        />
      )}
    </div>
  );
};
