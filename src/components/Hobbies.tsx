import React from 'react';
import { Music, Palette, Scissors, Sparkles } from 'lucide-react';
import { guitarImg, artImg, craftImg } from '../assets/images';
import { useSiteContent } from '../context/SiteContentContext';

export const Hobbies: React.FC = () => {
  const { config } = useSiteContent();
  const hobbies = config.hobbies;
  const theme = config.theme;

  const hobbiesData = [
    {
      id: 'guitar',
      title: hobbies.guitarTitle || 'Guitar',
      category: 'Music & Melody',
      image: hobbies.guitarImg || guitarImg,
      icon: Music,
      description: hobbies.guitarDesc,
    },
    {
      id: 'art',
      title: hobbies.artTitle || 'Art',
      category: 'Sketching & Painting',
      image: hobbies.artImg || artImg,
      icon: Palette,
      description: hobbies.artDesc,
    },
    {
      id: 'craft',
      title: hobbies.craftTitle || 'Craft',
      category: 'Handmade Creations',
      image: hobbies.craftImg || craftImg,
      icon: Scissors,
      description: hobbies.craftDesc,
    },
  ];

  return (
    <section
      id="hobbies"
      className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme?.backgroundColor || '#ffffff' }}
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-0 -z-10 w-96 h-96 bg-purple-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 -z-10 w-96 h-96 bg-blue-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Creative Passions</span>
          </div>

          <h2
            className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: theme?.primaryColor || '#3b0764' }}
          >
            {hobbies.heading || 'Hobbies & Interests'}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {hobbies.subtitle ||
              'Creative activities that bring balance, inspiration and mindfulness'}
          </p>
        </div>

        {/* 3 Hobby Cards with dynamic images and text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hobbiesData.map((hobby) => {
            const Icon = hobby.icon;

            return (
              <div
                key={hobby.id}
                className="group relative bg-white rounded-3xl border-2 border-purple-100/90 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden"
              >
                {/* Image Display Viewport */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img
                    src={hobby.image}
                    alt={hobby.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                  {/* Category Pill overlay on Image */}
                  <div className="absolute bottom-3.5 left-4 text-white">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{hobby.category}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content: Hobby Name → Short Description */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3
                      className="heading-font text-2xl font-bold group-hover:text-purple-700 transition-colors"
                      style={{ color: theme?.primaryColor || '#3b0764' }}
                    >
                      {hobby.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>

                  {/* Clean bottom separator */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-medium">
                    <span>Personal Creative Outlet</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme?.primaryColor || '#6b21a8' }}
                    />
                  </div>
                </div>

                {/* Bottom accent bar using dynamic theme colors */}
                <div
                  className="h-1.5 w-full transition-all"
                  style={{
                    background: `linear-gradient(to right, ${theme?.primaryColor || '#6b21a8'}, ${
                      theme?.secondaryColor || '#2563eb'
                    }, ${theme?.accentColor || '#facc15'})`,
                  }}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
