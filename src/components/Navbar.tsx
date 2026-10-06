import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles, Lock } from 'lucide-react';
import { SectionId } from '../types';

interface NavbarProps {
  activeSection: SectionId;
  onOpenAdmin?: () => void;
}

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-purple-100/60 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo / Brand Name */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="group flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              SP
            </div>
            <div>
              <span className="heading-font font-bold text-lg text-purple-900 group-hover:text-purple-700 transition-colors block leading-tight">
                Srishti Pathak
              </span>
              <span className="text-xs text-blue-600 font-medium tracking-wide block">
                Digital Marketer & AI Explorer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-purple-900 font-semibold'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-600 via-blue-500 to-yellow-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right CTA Button & Admin Access */}
          <div className="hidden md:flex items-center gap-2.5">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                title="Admin Portal"
                className="p-2 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-98 group cursor-pointer"
            >
              <span>Let's Connect</span>
              <ArrowUpRight className="w-4 h-4 text-yellow-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-purple-900 hover:text-purple-700 hover:bg-purple-50 transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-800 font-semibold border-l-4 border-purple-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-purple-700'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-center shadow-xs"
              >
                <span>Let's Connect</span>
                <ArrowUpRight className="w-4 h-4 text-yellow-300" />
              </a>

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs text-center border border-slate-200"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-700" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
