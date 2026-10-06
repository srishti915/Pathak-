import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  hero: {
    introKicker: string;
    name: string;
    headline: string;
    bio: string;
    photoUrl: string;
    ctaSkillsText: string;
    ctaConnectText: string;
  };
  about: {
    heading: string;
    subtitle: string;
    greeting: string;
    block1: string;
    block2: string;
    block3: string;
    block4: string;
    quickIntro: {
      name: string;
      education: string;
      class12: string;
      class10: string;
      learning: string;
      interests: string;
    };
  };
  skills: {
    heading: string;
    subtitle: string;
    intro: string;
    featuredTitle: string;
    featuredDesc: string;
  };
  education: {
    heading: string;
    subtitle: string;
    bcomTitle: string;
    bcomStatus: string;
    bcomDesc: string;
    class12Title: string;
    class12Score: string;
    class12Desc: string;
    class10Title: string;
    class10Score: string;
    class10Desc: string;
    beyondAcademicsText: string;
  };
  hobbies: {
    heading: string;
    subtitle: string;
    guitarTitle: string;
    guitarDesc: string;
    guitarImg: string;
    artTitle: string;
    artDesc: string;
    artImg: string;
    craftTitle: string;
    craftDesc: string;
    craftImg: string;
  };
  contact: {
    heading: string;
    subtitle: string;
    email: string;
    instagram: string;
    whatsappText: string;
    ctaHeading: string;
    ctaDesc: string;
  };
}

export const defaultSiteConfig: SiteConfig = {
  theme: {
    primaryColor: '#6b21a8',
    secondaryColor: '#2563eb',
    accentColor: '#facc15',
    backgroundColor: '#ffffff',
  },
  hero: {
    introKicker: "HELLO, I'M",
    name: 'Srishti Pathak',
    headline: 'B.Com Honours Student | Digital Marketing Learner | AI Automation Enthusiast',
    bio: "I'm currently pursuing B.Com Honours while learning Digital Marketing and AI Automation. I love exploring technology, creativity, and new ideas while building skills for my future career.",
    photoUrl: '/srishti_pathak.webp',
    ctaSkillsText: 'Explore My Skills',
    ctaConnectText: "Let's Connect",
  },
  about: {
    heading: 'About Me',
    subtitle: 'A little more about my journey, interests and goals',
    greeting: "Hi, I'm Srishti Pathak.",
    block1: 'I am currently pursuing B.Com Honours and exploring the world of Digital Marketing and AI Automation.',
    block2: 'I am interested in learning how digital platforms, marketing strategies and AI tools can be combined to create useful and creative solutions.',
    block3: 'Along with technology and marketing, I also enjoy creative activities such as playing guitar, art and craft.',
    block4: 'My current goal is to continuously improve my skills, gain practical experience and build a strong foundation for my future career in the digital world.',
    quickIntro: {
      name: 'Srishti Pathak',
      education: 'B.Com Honours — Currently Pursuing',
      class12: '79%',
      class10: '84%',
      learning: 'Digital Marketing & AI Automation',
      interests: 'Guitar • Art • Craft',
    },
  },
  skills: {
    heading: 'My Skills',
    subtitle: "Skills I'm learning, developing and exploring",
    intro: "I'm currently building my skills in Digital Marketing, AI, automation, content creation and creative technology. I'm focused on learning through practice and continuously improving my abilities.",
    featuredTitle: 'Digital Marketing + AI Automation',
    featuredDesc: 'My current focus is understanding how digital marketing and AI automation can work together to create smarter, more efficient digital workflows.',
  },
  education: {
    heading: 'My Education',
    subtitle: 'My academic journey and learning foundation',
    bcomTitle: 'B.Com Honours',
    bcomStatus: 'Currently Pursuing',
    bcomDesc: 'Currently pursuing B.Com Honours and building a foundation in commerce, business and related subjects while developing additional digital skills.',
    class12Title: 'Class 12',
    class12Score: '79%',
    class12Desc: 'Successfully completed Class 12 with 79%.',
    class10Title: 'Class 10',
    class10Score: '84%',
    class10Desc: 'Successfully completed Class 10 with 84%.',
    beyondAcademicsText: 'Alongside my formal education, I am developing practical skills in Digital Marketing, AI Automation and creative areas such as Guitar, Art and Craft.',
  },
  hobbies: {
    heading: 'Hobbies & Interests',
    subtitle: 'Creative activities that bring balance, inspiration and mindfulness',
    guitarTitle: 'Guitar',
    guitarDesc: 'Playing acoustic guitar brings a sense of rhythm and mindfulness to my day. Learning chord transitions and melodies nurtures patience, focus, and a creative outlet alongside my studies.',
    guitarImg: '/hobby_guitar_1791262467059.jpg',
    artTitle: 'Art',
    artDesc: 'Exploring watercolor painting and pencil sketching allows me to experiment with colors, textures, and visual compositions. This creative interest helps me develop an intuitive eye for design and aesthetics.',
    artImg: '/hobby_art_1791262480246.jpg',
    craftTitle: 'Craft',
    craftDesc: 'Working on handmade crafts, paper art, and DIY projects sharpens my precision and attention to fine detail. Turning simple materials into thoughtful creations is both relaxing and creatively fulfilling.',
    craftImg: '/hobby_craft_1791262496525.jpg',
  },
  contact: {
    heading: "Let's Connect",
    subtitle: "Have a project, idea, or simply want to get in touch? I'd love to hear from you.",
    email: 'srishtidigital36@gmail.com',
    instagram: 'Srishti.diaries_',
    whatsappText: 'Hi Srishti! I saw your portfolio and would like to connect.',
    ctaHeading: "Let's Work Together",
    ctaDesc: 'Whether you have a project idea, collaboration opportunity, or a question, feel free to send me a message.',
  },
};

interface SiteContentContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  reloadConfig: () => Promise<void>;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  config: defaultSiteConfig,
  updateConfig: () => {},
  reloadConfig: async () => {},
  loading: false,
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/site-config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not load site config, using defaults:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Dynamically apply background color & CSS custom properties
  useEffect(() => {
    if (config.theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', config.theme.primaryColor || '#6b21a8');
      root.style.setProperty('--secondary-color', config.theme.secondaryColor || '#2563eb');
      root.style.setProperty('--accent-color', config.theme.accentColor || '#facc15');
      root.style.setProperty('--bg-color', config.theme.backgroundColor || '#ffffff');
      document.body.style.backgroundColor = config.theme.backgroundColor || '#ffffff';
    }
  }, [config.theme]);

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  return (
    <SiteContentContext.Provider
      value={{
        config,
        updateConfig,
        reloadConfig: fetchConfig,
        loading,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
