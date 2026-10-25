import React, { useState } from 'react';
import { PdfWorkspace } from './components/workspace/PdfWorkspace';
import { AboutFounder } from './components/AboutFounder';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'workspace' | 'founder'>('workspace');

  if (activePage === 'founder') {
    return (
      <AboutFounder
        onBackToHome={() => {
          setActivePage('workspace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <PdfWorkspace
      onNavigateFounder={() => {
        setActivePage('founder');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
};

export default App;
