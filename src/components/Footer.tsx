import React from 'react';
import { ArrowUp, Mail, Instagram, MessageSquare, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              SP
            </div>
            <div>
              <span className="heading-font font-bold text-base text-white block">
                Srishti Pathak
              </span>
              <span className="text-xs text-purple-300 font-medium">
                B.Com (Hons) · Digital Marketing & AI Automation
              </span>
            </div>
          </div>

          {/* Quick Links per user instruction: Instagram, Email, Contact */}
          <div className="flex items-center gap-5 sm:gap-6 text-sm font-medium flex-wrap justify-center">
            <a
              href="https://www.instagram.com/Srishti.diaries_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
            </a>

            <a
              href="mailto:srishtidigital36@gmail.com"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email</span>
            </a>

            <a
              href="#contact"
              onClick={scrollToContact}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-yellow-400" />
              <span>Contact</span>
            </a>

            {/* Admin Portal Button */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-purple-300 hover:text-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-purple-500/30"
                title="Open Admin Panel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Back to top button */}
          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-900/60 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-medium"
              title="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Copyright notice required by prompt: © 2026 Srishti Pathak. All Rights Reserved. */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Srishti Pathak. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Crafted with passion for Commerce, Marketing & AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
