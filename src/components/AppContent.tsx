import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from './Toast';
import { usePageAssets } from '../hooks/usePageAssets';

// Direct imports instead of lazy loading to fix navigation
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Skills from '../pages/Skills';
import Contact from '../pages/Contact';



const AppContent: React.FC = () => {
  // Initialize page-specific asset preloading
  usePageAssets();

  return (
    <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden noise-bg">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 right-0 z-[1] h-full w-full pointer-events-none animate-flicker">
        <div className="absolute top-0 left-0 h-1/2 w-full bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>
      
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
      <Footer />
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AppContent;