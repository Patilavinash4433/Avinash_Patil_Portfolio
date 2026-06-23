import { lazy, Suspense, useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';

const ServicesSection = lazy(() => import('./components/ServicesSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const CertificationsSection = lazy(() => import('./components/CertificationsSection'));
const ResumeToolsHub = lazy(() => import('./components/ResumeToolsHub'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const AIChatBot = lazy(() => import('./components/AIChatBot'));
const ResumePage = lazy(() => import('./components/ResumePage'));
const ToolsPage = lazy(() => import('./components/ToolsPage'));

const App = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    // Force scroll to top on page load/reload
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Clear section hashes on reload to always start at Home/top
    const initialHash = window.location.hash;
    if (initialHash && initialHash !== '#/resume' && initialHash !== '#/tools') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setCurrentHash('');
    }
    window.scrollTo(0, 0);
    
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash === '#/resume' || hash === '#/tools' || !hash || hash === '#' || hash === '#/') {
        window.scrollTo(0, 0);
      }
    };

    // Global navigation bridge for bulletproof iframe/sandbox routing
    (window as any).__routeTo = (hash: string) => {
      window.location.hash = hash;
      setCurrentHash(hash);
      if (hash === '#/resume' || hash === '#/tools' || !hash || hash === '#' || hash === '#/') {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      delete (window as any).__routeTo;
    };
  }, []);

  // Smooth scroll handler when hash changes to section anchors
  useEffect(() => {
    const hash = currentHash;
    if (hash && hash !== '#/resume' && hash !== '#/' && hash !== '#') {
      const elementId = hash.replace('#', '');
      
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts < 50) { // Try for up to 5 seconds
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };

      const timer = setTimeout(tryScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [currentHash]);

  const isResumeView = currentHash === '#/resume';
  const isToolsView = currentHash === '#/tools';

  return (
    <main
      className="relative w-full"
      style={{ overflowX: 'clip', background: '#0C0C0C' }}
    >
      <Suspense fallback={<div className="min-h-[100vh] bg-[#0C0C0C] flex items-center justify-center text-white font-mono text-sm">Loading...</div>}>
        {isResumeView ? (
          <ResumePage />
        ) : isToolsView ? (
          <ToolsPage />
        ) : (
          <>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <ProjectsSection />
            <CertificationsSection />
            <ResumeToolsHub />
            <ContactSection />
            <AIChatBot />
          </>
        )}
      </Suspense>
    </main>
  );
};

export default App;
