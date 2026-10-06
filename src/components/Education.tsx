import React from 'react';
import { GraduationCap, Award, BookOpen, Sparkles, Compass } from 'lucide-react';
import { educationConceptImg } from '../assets/images';
import { useSiteContent } from '../context/SiteContentContext';

export const Education: React.FC = () => {
  const { config } = useSiteContent();
  const edu = config.education;
  const theme = config.theme;

  const educationTimeline = [
    {
      id: 'bcom',
      title: edu.bcomTitle || 'B.Com Honours',
      statusOrScore: edu.bcomStatus || 'Currently Pursuing',
      isStatus: true,
      description: edu.bcomDesc,
      icon: GraduationCap,
      accent: 'purple',
    },
    {
      id: 'class12',
      title: edu.class12Title || 'Class 12',
      statusOrScore: edu.class12Score || '79%',
      isStatus: false,
      description: edu.class12Desc,
      icon: Award,
      accent: 'blue',
    },
    {
      id: 'class10',
      title: edu.class10Title || 'Class 10',
      statusOrScore: edu.class10Score || '84%',
      isStatus: false,
      description: edu.class10Desc,
      icon: BookOpen,
      accent: 'purple',
    },
  ];

  return (
    <section
      id="education"
      className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme?.backgroundColor || '#ffffff' }}
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/3 left-0 -z-10 w-96 h-96 bg-purple-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 -z-10 w-96 h-96 bg-blue-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: theme?.primaryColor || '#3b0764' }}
          >
            {edu.heading || 'My Education'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {edu.subtitle || 'My academic journey and learning foundation'}
          </p>
        </div>

        {/* Desktop Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          
          {/* LEFT: 2. Modern Vertical Education Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-purple-200/80 space-y-8 sm:space-y-10">
              {educationTimeline.map((item) => {
                const Icon = item.icon;
                const isPurple = item.accent === 'purple';

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node Indicator */}
                    <div
                      className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-110 text-white"
                      style={{
                        backgroundColor: isPurple
                          ? theme?.primaryColor || '#6b21a8'
                          : theme?.secondaryColor || '#2563eb',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Timeline Item Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-purple-100/80 hover:border-purple-300 shadow-xs hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <h3 className="heading-font text-xl sm:text-2xl font-bold text-purple-950">
                          {item.title}
                        </h3>

                        <div>
                          {item.isStatus ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200/80 text-xs font-bold tracking-wide">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              {item.statusOrScore}
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1.5">
                              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                Achievement:
                              </span>
                              <span
                                className="heading-font text-2xl font-extrabold highlight-yellow"
                                style={{ color: theme?.primaryColor || '#3b0764' }}
                              >
                                {item.statusOrScore}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: 6. Decorative Visual */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-purple-100/90 shadow-lg bg-white p-2">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-50">
                <img
                  src={educationConceptImg}
                  alt="Education and Learning Abstract Illustration"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Academic Foundation</span>
                    </div>
                    <div className="heading-font text-base font-bold">
                      Commerce & Continuous Learning
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Academic Highlights: Three Compact Cards */}
        <div className="mb-14">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 px-1">
            Academic Highlights
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: B.Com Honours */}
            <div className="p-5 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all text-center group">
              <div className="heading-font text-xl sm:text-2xl font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                {edu.bcomTitle || 'B.Com Honours'}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {edu.bcomStatus || 'Currently Pursuing'}
              </div>
              <div
                className="w-8 h-1 mx-auto mt-3 rounded-full"
                style={{ backgroundColor: theme?.accentColor || '#facc15' }}
              />
            </div>

            {/* Card 2: Class 12 */}
            <div className="p-5 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all text-center group">
              <div
                className="heading-font text-2xl sm:text-3xl font-extrabold"
                style={{ color: theme?.secondaryColor || '#2563eb' }}
              >
                {edu.class12Score || '79%'}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {edu.class12Title || 'Class 12'}
              </div>
              <div
                className="w-8 h-1 mx-auto mt-3 rounded-full"
                style={{ backgroundColor: theme?.accentColor || '#facc15' }}
              />
            </div>

            {/* Card 3: Class 10 */}
            <div className="p-5 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all text-center group">
              <div
                className="heading-font text-2xl sm:text-3xl font-extrabold"
                style={{ color: theme?.primaryColor || '#6b21a8' }}
              >
                {edu.class10Score || '84%'}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {edu.class10Title || 'Class 10'}
              </div>
              <div
                className="w-8 h-1 mx-auto mt-3 rounded-full"
                style={{ backgroundColor: theme?.accentColor || '#facc15' }}
              />
            </div>

          </div>
        </div>

        {/* 4. Learning Beyond Academics */}
        <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50/60 via-white to-blue-50/50 border-2 border-purple-100/80 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h4
              className="heading-font text-xl sm:text-2xl font-bold"
              style={{ color: theme?.primaryColor || '#3b0764' }}
            >
              Beyond Academics
            </h4>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {edu.beyondAcademicsText}
          </p>
        </div>

      </div>
    </section>
  );
};
