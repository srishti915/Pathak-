import React from 'react';
import {
  TrendingUp,
  Share2,
  Sparkles,
  Cpu,
  Palette,
  Globe,
  Workflow,
  CheckCircle2,
} from 'lucide-react';
import { aiAutomationImg } from '../assets/images';
import { useSiteContent } from '../context/SiteContentContext';

interface SkillItem {
  id: string;
  title: string;
  description: string;
  status: 'Currently Learning' | 'Exploring' | 'Currently Exploring' | 'Developing';
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'purple' | 'blue' | 'yellow';
}

const skillsList: SkillItem[] = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description:
      'Learning the fundamentals of digital marketing, online branding, audience engagement and digital growth strategies.',
    status: 'Currently Learning',
    icon: TrendingUp,
    accentColor: 'purple',
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    description:
      'Exploring social media content, Instagram marketing, audience engagement and social media strategies.',
    status: 'Currently Learning',
    icon: Share2,
    accentColor: 'blue',
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description:
      'Exploring AI tools and learning how they can be used for content creation, research, productivity and digital work.',
    status: 'Exploring',
    icon: Sparkles,
    accentColor: 'yellow',
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    description:
      'Learning how AI and automation can simplify repetitive tasks and create more efficient digital workflows.',
    status: 'Currently Exploring',
    icon: Cpu,
    accentColor: 'purple',
  },
  {
    id: 'content-creative-design',
    title: 'Content & Creative Design',
    description:
      'Developing skills in creating engaging digital content and exploring creative visual ideas.',
    status: 'Developing',
    icon: Palette,
    accentColor: 'blue',
  },
  {
    id: 'website-development',
    title: 'Website Development',
    description:
      'Learning the fundamentals of creating modern websites using website-building tools, AI and web technologies.',
    status: 'Currently Learning',
    icon: Globe,
    accentColor: 'purple',
  },
];

export const Skills: React.FC = () => {
  const { config } = useSiteContent();
  const skills = config.skills;
  const theme = config.theme;

  return (
    <section
      id="skills"
      className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme?.backgroundColor || '#ffffff' }}
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/4 right-0 -z-10 w-96 h-96 bg-purple-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 -z-10 w-96 h-96 bg-blue-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2
            className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: theme?.primaryColor || '#3b0764' }}
          >
            {skills.heading || 'My Skills'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {skills.subtitle || "Skills I'm learning, developing and exploring"}
          </p>
        </div>

        {/* 2. Skills Introduction */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50/80 border border-slate-100/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
            {skills.intro}
          </p>
        </div>

        {/* 3. Skills Card Grid (3 columns desktop, 2 columns tablet, 1 column mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {skillsList.map((skill) => {
            const Icon = skill.icon;
            
            // Badge styles for the different statuses
            let badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200/80';
            if (skill.status === 'Exploring' || skill.status === 'Currently Exploring') {
              badgeStyle = 'bg-yellow-50 text-purple-950 border-yellow-300 font-bold';
            } else if (skill.status === 'Developing') {
              badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200/80 font-bold';
            }

            return (
              <div
                key={skill.id}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-purple-100/80 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-700 group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Skill Status Badge */}
                    <span
                      className={`text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border shadow-2xs tracking-wide ${badgeStyle}`}
                    >
                      {skill.status}
                    </span>
                  </div>

                  {/* Skill Name */}
                  <h3 className="heading-font text-xl font-bold text-purple-950 mb-2.5 group-hover:text-purple-700 transition-colors">
                    {skill.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Subtle Card Accent Line */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Learning by Doing</span>
                  </span>
                  <span className="text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. & 6. Featured Learning Area + AI-Generated Visual */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-purple-100/90 shadow-lg bg-white">
          
          {/* Gradient line using dynamic theme colors */}
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(to right, ${theme?.primaryColor || '#6b21a8'}, ${
                theme?.secondaryColor || '#2563eb'
              }, ${theme?.accentColor || '#facc15'})`,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-7 sm:p-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Highlighted Section Tag: Currently Learning */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span>Currently Learning</span>
              </div>

              {/* Prominent Title */}
              <h3
                className="heading-font text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: theme?.primaryColor || '#3b0764' }}
              >
                {skills.featuredTitle || 'Digital Marketing + AI Automation'}
              </h3>

              {/* Exact Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                {skills.featuredDesc}
              </p>

              {/* Key Focal Points */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-semibold text-purple-950">Marketing Analytics & Funnels</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-purple-950">Smart Workflow Automation</span>
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-purple-100/80 shadow-md group">
                <img
                  src={aiAutomationImg}
                  alt="Digital Marketing and AI Automation Workflow Illustration"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-sm">
                    <Workflow className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Connected Nodes & Intelligent Workflows</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
