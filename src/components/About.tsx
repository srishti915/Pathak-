import React from 'react';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  Heart,
  TrendingUp,
  Cpu,
  Palette,
} from 'lucide-react';
import { aboutAiCreativityImg } from '../assets/images';
import { useSiteContent } from '../context/SiteContentContext';

export const About: React.FC = () => {
  const { config } = useSiteContent();
  const about = config.about;
  const theme = config.theme;

  return (
    <section
      id="about"
      className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme?.backgroundColor || '#ffffff' }}
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/3 left-0 -z-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 -z-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: theme?.primaryColor || '#3b0764' }}
          >
            {about.heading || 'About Me'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {about.subtitle || 'A little more about my journey, interests and goals'}
          </p>
        </div>

        {/* Desktop & Tablet Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT SIDE — About Content & Career/Learning Focus */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 2. Introduction: Divided into readable blocks */}
            <div className="space-y-4">
              <h3
                className="heading-font text-2xl sm:text-3xl font-bold"
                style={{ color: theme?.primaryColor || '#3b0764' }}
              >
                {about.greeting || "Hi, I'm Srishti Pathak."}
              </h3>

              <div className="space-y-3.5 text-slate-600 text-base sm:text-lg leading-relaxed">
                <p className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/70">
                  {about.block1}
                </p>

                <p className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  {about.block2}
                </p>

                <p className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/70">
                  {about.block3}
                </p>

                <p className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  {about.block4}
                </p>
              </div>
            </div>

            {/* Mobile Only: Quick Introduction & Achievements */}
            <div className="block lg:hidden space-y-6">
              <QuickIntroCard quickIntro={about.quickIntro} theme={theme} />
              <AchievementsHighlight quickIntro={about.quickIntro} theme={theme} />
            </div>

            {/* 5. Career & Learning Focus: What I'm Currently Exploring */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme?.primaryColor || '#6b21a8' }}
                />
                <h4
                  className="heading-font text-xl sm:text-2xl font-bold"
                  style={{ color: theme?.primaryColor || '#3b0764' }}
                >
                  What I'm Currently Exploring
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Compact Card 1: Digital Marketing */}
                <div className="p-5 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h5 className="heading-font font-bold text-base text-purple-950 mb-1.5">
                      Digital Marketing
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Learning digital marketing concepts, social media marketing, content creation and online branding.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-50 text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                    <span>Actively Learning</span>
                  </div>
                </div>

                {/* Compact Card 2: AI Automation */}
                <div className="p-5 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h5 className="heading-font font-bold text-base text-purple-950 mb-1.5">
                      AI Automation
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Exploring how AI tools and automation can improve digital workflows and productivity.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-50 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                    <span>Currently Exploring</span>
                  </div>
                </div>

                {/* Compact Card 3: Creative Skills */}
                <div className="p-5 rounded-2xl bg-white border-2 border-yellow-100 hover:border-yellow-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 text-purple-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <h5 className="heading-font font-bold text-base text-purple-950 mb-1.5">
                      Creative Skills
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Developing creativity through guitar, art, craft and visual content.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-yellow-50 text-[11px] font-semibold text-purple-900 flex items-center gap-1">
                    <span>Creative Passions</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle AI-Generated Illustration */}
            <div className="relative rounded-2xl overflow-hidden border border-purple-100 shadow-xs bg-slate-50">
              <div className="relative aspect-21/9 sm:aspect-24/8 w-full overflow-hidden">
                <img
                  src={aboutAiCreativityImg}
                  alt="Digital Marketing, AI Automation, and Creativity Concept"
                  className="w-full h-full object-cover object-center select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-transparent flex items-center p-6">
                  <div className="text-white max-w-md space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Harmonious Blend</span>
                    </div>
                    <div className="heading-font text-base sm:text-lg font-bold">
                      Digital Marketing + AI + Creativity
                    </div>
                    <p className="text-xs text-purple-100/90 leading-relaxed hidden sm:block">
                      Combining analytical business fundamentals with intelligent AI workflows and creative expression.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE — Desktop Only: Quick Introduction Card + Achievement Highlights */}
          <div className="hidden lg:block lg:col-span-5 space-y-6">
            <QuickIntroCard quickIntro={about.quickIntro} theme={theme} />
            <AchievementsHighlight quickIntro={about.quickIntro} theme={theme} />
          </div>

        </div>

      </div>
    </section>
  );
};

interface QuickIntroProps {
  quickIntro?: {
    name: string;
    education: string;
    class12: string;
    class10: string;
    learning: string;
    interests: string;
  };
  theme?: any;
}

const QuickIntroCard: React.FC<QuickIntroProps> = ({ quickIntro, theme }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-purple-100/90 hover:border-blue-200 shadow-lg shadow-purple-900/5 transition-all duration-300">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h4
            className="heading-font text-lg font-bold"
            style={{ color: theme?.primaryColor || '#3b0764' }}
          >
            Quick Introduction
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-blue-600 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
          Profile Snapshot
        </span>
      </div>

      {/* Profile Details */}
      <div className="space-y-4 text-xs sm:text-sm">
        
        {/* Name */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Name
            </div>
            <div className="font-bold text-purple-950 text-sm sm:text-base">
              {quickIntro?.name || 'Srishti Pathak'}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Education
            </div>
            <div className="font-semibold text-slate-800">
              {quickIntro?.education || 'B.Com Honours — Currently Pursuing'}
            </div>
          </div>
        </div>

        {/* Class 12 */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Class 12
            </div>
            <div
              className="font-bold text-sm"
              style={{ color: theme?.primaryColor || '#6b21a8' }}
            >
              {quickIntro?.class12 || '79%'}
            </div>
          </div>
        </div>

        {/* Class 10 */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Class 10
            </div>
            <div
              className="font-bold text-sm"
              style={{ color: theme?.secondaryColor || '#2563eb' }}
            >
              {quickIntro?.class10 || '84%'}
            </div>
          </div>
        </div>

        {/* Learning */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Learning
            </div>
            <div className="font-semibold text-purple-950">
              {quickIntro?.learning || 'Digital Marketing & AI Automation'}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Interests
            </div>
            <div className="font-semibold text-slate-800">
              {quickIntro?.interests || 'Guitar • Art • Craft'}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

const AchievementsHighlight: React.FC<QuickIntroProps> = ({ quickIntro, theme }) => {
  return (
    <div className="space-y-2.5">
      <div className="text-xs uppercase font-bold tracking-wider text-slate-400 px-1">
        Academic Highlights
      </div>

      <div className="grid grid-cols-3 gap-3">
        
        {/* Highlight 1: Class 12 */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-2xs text-center transition-all">
          <div
            className="heading-font text-2xl sm:text-3xl font-extrabold leading-tight"
            style={{ color: theme?.primaryColor || '#6b21a8' }}
          >
            {quickIntro?.class12 || '79%'}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Class 12
          </div>
          <div
            className="w-6 h-0.5 mx-auto mt-2 rounded-full"
            style={{ backgroundColor: theme?.accentColor || '#facc15' }}
          />
        </div>

        {/* Highlight 2: Class 10 */}
        <div className="p-4 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 shadow-2xs text-center transition-all">
          <div
            className="heading-font text-2xl sm:text-3xl font-extrabold leading-tight"
            style={{ color: theme?.secondaryColor || '#2563eb' }}
          >
            {quickIntro?.class10 || '84%'}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Class 10
          </div>
          <div
            className="w-6 h-0.5 mx-auto mt-2 rounded-full"
            style={{ backgroundColor: theme?.accentColor || '#facc15' }}
          />
        </div>

        {/* Highlight 3: B.Com Honours */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-2xs text-center transition-all">
          <div
            className="heading-font text-2xl sm:text-3xl font-extrabold leading-tight"
            style={{ color: theme?.primaryColor || '#6b21a8' }}
          >
            B.Com
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1 truncate">
            Currently Pursuing
          </div>
          <div
            className="w-6 h-0.5 mx-auto mt-2 rounded-full"
            style={{ backgroundColor: theme?.accentColor || '#facc15' }}
          />
        </div>

      </div>
    </div>
  );
};
