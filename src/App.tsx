import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolsGrid } from './components/ToolsGrid';
import { FeatureHighlights } from './components/FeatureHighlights';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AboutFounder } from './components/AboutFounder';
import { SearchModal } from './components/SearchModal';
import { PrivacyModal } from './components/PrivacyModal';
import { MergePdfModal } from './components/tools/MergePdfModal';
import { SplitPdfModal } from './components/tools/SplitPdfModal';
import { ImageToPdfModal } from './components/tools/ImageToPdfModal';
import { RotateWatermarkModal } from './components/tools/RotateWatermarkModal';
import { TextToPdfModal } from './components/tools/TextToPdfModal';
import { PdfMetadataModal } from './components/tools/PdfMetadataModal';
import { GenericToolModal } from './components/tools/GenericToolModal';
import type { ToolCategory, PdfTool } from './types';
import { PDF_TOOLS } from './data/toolsData';

export const App: React.FC = () => {
  // Navigation State
  const [activePage, setActivePage] = useState<'home' | 'founder'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Tool Specific Modals & Files
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [splitFile, setSplitFile] = useState<File | undefined>(undefined);

  const [isImageToPdfOpen, setIsImageToPdfOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [isRotateWatermarkOpen, setIsRotateWatermarkOpen] = useState(false);
  const [rotateFile, setRotateFile] = useState<File | undefined>(undefined);
  const [activeRotateToolId, setActiveRotateToolId] = useState<string>('');

  const [isTextToPdfOpen, setIsTextToPdfOpen] = useState(false);

  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [metadataFile, setMetadataFile] = useState<File | undefined>(undefined);

  const [genericModalTool, setGenericModalTool] = useState<PdfTool | null>(null);
  const [genericFile, setGenericFile] = useState<File | undefined>(undefined);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Launch tool dispatcher
  const handleSelectTool = (tool: PdfTool, file?: File) => {
    if (activePage !== 'home') {
      setActivePage('home');
    }

    switch (tool.actionType) {
      case 'merge':
        setMergeFiles(file ? [file] : []);
        setIsMergeOpen(true);
        break;
      case 'split':
        setSplitFile(file);
        setIsSplitOpen(true);
        break;
      case 'image-to-pdf':
        setImageFiles(file ? [file] : []);
        setIsImageToPdfOpen(true);
        break;
      case 'rotate-watermark':
        setActiveRotateToolId(tool.id);
        setRotateFile(file);
        setIsRotateWatermarkOpen(true);
        break;
      case 'text-to-pdf':
        setIsTextToPdfOpen(true);
        break;
      case 'metadata':
        setMetadataFile(file);
        setIsMetadataOpen(true);
        break;
      default:
        setGenericModalTool(tool);
        setGenericFile(file);
        break;
    }
  };

  const handleSelectToolById = (toolId: string, file?: File) => {
    const found = PDF_TOOLS.find((t) => t.id === toolId);
    if (found) {
      handleSelectTool(found, file);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-pastel flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('tools-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectTool={handleSelectTool}
      />

      {/* Main Multi-Page Content */}
      <main className="flex-1">
        {activePage === 'founder' ? (
          <AboutFounder onBackToHome={() => setActivePage('home')} />
        ) : (
          <>
            {/* Hero Section with Universal Dropper */}
            <Hero
              onOpenMergeWithFiles={(files) => {
                setMergeFiles(files);
                setIsMergeOpen(true);
              }}
              onOpenSplitWithFile={(file) => {
                setSplitFile(file);
                setIsSplitOpen(true);
              }}
              onOpenImageToPdfWithFiles={(files) => {
                setImageFiles(files);
                setIsImageToPdfOpen(true);
              }}
              onOpenRotateWithFile={(file) => {
                setRotateFile(file);
                setIsRotateWatermarkOpen(true);
              }}
              onOpenMetadataWithFile={(file) => {
                setMetadataFile(file);
                setIsMetadataOpen(true);
              }}
              onSelectTool={handleSelectToolById}
            />

            {/* Categorized Bento-Grid Tools */}
            <ToolsGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectTool={handleSelectTool}
            />

            {/* Privacy & Speed Feature Highlights */}
            <FeatureHighlights
              onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
            />

            {/* FAQ Accordion */}
            <FaqSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFilterCategory={(cat) => {
          setActivePage('home');
          setSelectedCategory(cat);
          const el = document.getElementById('tools-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
        onSelectToolById={handleSelectToolById}
      />

      {/* Interactive Working Tool Modals */}
      <MergePdfModal
        isOpen={isMergeOpen}
        onClose={() => {
          setIsMergeOpen(false);
          setMergeFiles([]);
        }}
        initialFiles={mergeFiles}
      />

      <SplitPdfModal
        isOpen={isSplitOpen}
        onClose={() => {
          setIsSplitOpen(false);
          setSplitFile(undefined);
        }}
        initialFile={splitFile}
      />

      <ImageToPdfModal
        isOpen={isImageToPdfOpen}
        onClose={() => {
          setIsImageToPdfOpen(false);
          setImageFiles([]);
        }}
        initialFiles={imageFiles}
      />

      <RotateWatermarkModal
        isOpen={isRotateWatermarkOpen}
        onClose={() => {
          setIsRotateWatermarkOpen(false);
          setRotateFile(undefined);
          setActiveRotateToolId('');
        }}
        initialFile={rotateFile}
        toolId={activeRotateToolId}
      />

      <TextToPdfModal
        isOpen={isTextToPdfOpen}
        onClose={() => setIsTextToPdfOpen(false)}
      />

      <PdfMetadataModal
        isOpen={isMetadataOpen}
        onClose={() => {
          setIsMetadataOpen(false);
          setMetadataFile(undefined);
        }}
        initialFile={metadataFile}
      />

      <GenericToolModal
        tool={genericModalTool}
        isOpen={!!genericModalTool}
        onClose={() => {
          setGenericModalTool(null);
          setGenericFile(undefined);
        }}
        initialFile={genericFile}
      />

      {/* Search & Privacy Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
};

export default App;
