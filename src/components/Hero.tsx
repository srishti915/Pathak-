import React from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, Cpu } from 'lucide-react';
import { srishtiPhotoImg } from '../assets/images';
import { useSiteContent } from '../context/SiteContentContext';

export const Hero: React.FC = () => {
  const { config } = useSiteContent();

  const scrollToSkills = () => {
    const el = document.getElementById('skills');
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const hero = config.hero;
  const theme = config.theme;

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
      style={{ backgroundColor: theme?.backgroundColor || '#ffffff' }}
    >
      {/* Subtle Creative AI Decorative Elements in the background */}
      <div className="absolute top-12 right-12 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-6 left-6 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Abstract Digital Nodes & Connected Lines (Subtle AI-inspired graphics) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ai-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme?.primaryColor || '#7c3aed'} stopOpacity="0.4" />
            <stop offset="50%" stopColor={theme?.secondaryColor || '#2563eb'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={theme?.accentColor || '#facc15'} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Minimal connected lines */}
        <path
          d="M 50 120 Q 200 80 400 160 T 750 140"
          fill="none"
          stroke="url(#ai-line-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <path
          d="M 650 320 Q 850 260 1100 350 T 1350 280"
          fill="none"
          stroke="url(#ai-line-grad)"
          strokeWidth="1.2"
          strokeDasharray="3 5"
        />

        {/* Abstract Digital Nodes */}
        <circle cx="400" cy="160" r="4" fill={theme?.primaryColor || '#7c3aed'} />
        <circle cx="400" cy="160" r="8" fill="none" stroke={theme?.primaryColor || '#7c3aed'} strokeOpacity="0.3" />
        <circle cx="750" cy="140" r="3.5" fill={theme?.secondaryColor || '#2563eb'} />
        <circle cx="850" cy="260" r="4.5" fill={theme?.accentColor || '#facc15'} />
        <circle cx="1100" cy="350" r="4" fill={theme?.primaryColor || '#7c3aed'} />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop / Tablet Two-Column Layout | Mobile Stacked in required sequence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT SIDE — Introduction & Text */}
          <div className="lg:col-span-7 text-left space-y-6 order-1">
            
            {/* 1. Small Introductory Text: HELLO, I'M */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 border border-purple-200/80 text-purple-800 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme?.accentColor || '#facc15' }}
              />
              <span>{hero.introKicker || "HELLO, I'M"}</span>
            </div>

            {/* 2. Prominent Name: Srishti Pathak */}
            <h1
              className="heading-font text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
              style={{ color: theme?.primaryColor || '#3b0764' }}
            >
              {hero.name || 'Srishti Pathak'}
            </h1>

            {/* 3. Professional Headline with Yellow Underlines */}
            <div
              className="text-base sm:text-lg lg:text-xl font-semibold leading-snug"
              style={{ color: theme?.secondaryColor || '#1e3a8a' }}
            >
              <span>{hero.headline}</span>
            </div>

            {/* 4. Introduction Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {hero.bio}
            </p>

            {/* 5. Call-to-Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Purple filled primary button */}
              <button
                type="button"
                onClick={scrollToSkills}
                className="px-6.5 py-3.5 rounded-xl text-white font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center gap-2 cursor-pointer group"
                style={{ backgroundColor: theme?.primaryColor || '#6b21a8' }}
              >
                <span>{hero.ctaSkillsText || 'Explore My Skills'}</span>
                <ArrowDown className="w-4 h-4 text-yellow-300 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Blue outline / secondary button */}
              <button
                type="button"
                onClick={scrollToContact}
                className="px-6.5 py-3.5 rounded-xl bg-white hover:bg-blue-50/80 font-semibold text-base transition-all active:scale-98 flex items-center gap-2 cursor-pointer shadow-2xs group border-2"
                style={{
                  color: theme?.secondaryColor || '#2563eb',
                  borderColor: theme?.secondaryColor || '#2563eb',
                }}
              >
                <span>{hero.ctaConnectText || "Let's Connect"}</span>
                <ArrowUpRight className="w-4 h-4 text-purple-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Only: 6. My Photograph */}
            <div className="block lg:hidden pt-4">
              <PersonalPhotoDisplay photoUrl={hero.photoUrl} />
            </div>

            {/* 7. Quick Profile Highlights */}
            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Highlight 1: B.Com Honours */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-purple-100 hover:border-purple-300 transition-colors">
                  <div
                    className="text-xs uppercase font-bold tracking-wider"
                    style={{ color: theme?.primaryColor || '#6b21a8' }}
                  >
                    B.Com Honours
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Currently pursuing
                  </div>
                </div>

                {/* Highlight 2: Digital Marketing */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-blue-100 hover:border-blue-300 transition-colors">
                  <div
                    className="text-xs uppercase font-bold tracking-wider"
                    style={{ color: theme?.secondaryColor || '#2563eb' }}
                  >
                    Digital Marketing
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Currently Learning
                  </div>
                </div>

                {/* Highlight 3: AI Automation */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-yellow-100/90 hover:border-yellow-300 transition-colors">
                  <div className="text-xs uppercase font-bold tracking-wider text-purple-900 flex items-center justify-between">
                    <span>AI Automation</span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme?.accentColor || '#facc15' }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Currently Exploring
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE (Desktop / Tablet): Personal Photograph */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end order-2">
            <PersonalPhotoDisplay photoUrl={hero.photoUrl} />
          </div>

        </div>

      </div>
    </section>
  );
};

const PersonalPhotoDisplay: React.FC<{ photoUrl?: string }> = ({ photoUrl }) => {
  const imgSrc = photoUrl || srishtiPhotoImg;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
      
      {/* Small Yellow Decorative Accent */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 shadow-md flex items-center justify-center text-purple-950 font-bold z-20 pointer-events-none">
        <Sparkles className="w-4 h-4 text-purple-950" />
      </div>

      {/* Subtle outer ambient purple & blue glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-purple-600/25 via-blue-500/20 to-yellow-300/30 rounded-[2.2rem] blur-md -z-10" />

      {/* Main Organic / Rounded Photo Frame Container with Purple and Blue Border */}
      <div className="relative bg-white rounded-3xl p-3 border-2 border-purple-200/90 hover:border-blue-300 shadow-xl transition-all duration-300">
        
        {/* Photo Display Viewport with modern rounded shape */}
        <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-slate-50 border border-purple-100/60 shadow-inner">
          <img
            src={imgSrc}
            alt="Srishti Pathak - B.Com Honours Student & Digital Marketing Learner"
            className="w-full h-full object-cover object-top select-none transition duration-500 hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Clean, Elegant Caption under Photograph */}
        <div className="pt-3 pb-1 px-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span className="font-bold text-purple-950">Srishti Pathak</span>
          </div>
          <span className="text-[11px] text-blue-700 font-semibold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">
            B.Com (Hons) · 2026
          </span>
        </div>

      </div>

      {/* Decorative AI Technology Badge at bottom corner */}
      <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white border border-purple-100 rounded-2xl p-3 shadow-lg flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
          <Cpu className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <div className="text-xs font-bold text-purple-950">B.Com Honours & AI</div>
          <div className="text-[11px] text-blue-600 font-medium">Digital Marketing Vision</div>
        </div>
      </div>

    </div>
  );
};
