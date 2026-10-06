export type SectionId = 'home' | 'about' | 'skills' | 'education' | 'hobbies' | 'contact';

export interface SkillItem {
  id: string;
  title: string;
  status: 'Learning' | 'Developing' | 'Currently Exploring';
  description: string;
  category: 'Marketing' | 'AI & Tech' | 'Creative';
  tools: string[];
  image?: string;
  highlightWords: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  timeline: string;
  score?: string;
  status: 'Currently Pursuing' | 'Completed';
  highlights: string[];
}

export interface HobbyItem {
  id: 'guitar' | 'art' | 'craft';
  name: string;
  tagline: string;
  description: string;
  defaultImage: string;
  customImageKey: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
