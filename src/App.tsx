/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Hobbies } from './components/Hobbies';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { SectionId } from './types';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';

function PortfolioMain() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { config } = useSiteContent();

  useEffect(() => {
    // Check if URL hash is #admin
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    const sections: SectionId[] = ['home', 'about', 'skills', 'education', 'hobbies', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const backgroundColor = config.theme?.backgroundColor || '#ffffff';

  return (
    <div
      className="min-h-screen text-slate-800 flex flex-col selection:bg-yellow-200 selection:text-purple-900 transition-colors duration-300"
      style={{ backgroundColor }}
    >
      {/* Sticky Top Navigation */}
      <Navbar activeSection={activeSection} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Single-Page Content with 6 clearly defined sections */}
      <main className="flex-1">
        {/* Section 1: Hero / Introduction */}
        <Hero />

        {/* Section 2: About Me */}
        <About />

        {/* Section 3: Skills */}
        <Skills />

        {/* Section 4: Education */}
        <Education />

        {/* Section 5: Hobbies & Interests */}
        <Hobbies />

        {/* Section 6: Contact + Lead Form */}
        <Contact />
      </main>

      {/* Footer with Admin Portal Button */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Panel Modal / Portal */}
      <AdminPanel isOpen={isAdminOpen} onClose={handleCloseAdmin} />
    </div>
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <PortfolioMain />
    </SiteContentProvider>
  );
}
