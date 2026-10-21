export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  hasDemo?: boolean;
  featured?: boolean;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  brand: string;
  experienceTitle: string;
  tagline: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  cvUrl?: string;
  socials: SocialLink[];
  stats: Stat[];
}

export interface Stat {
  label: string;
  value: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  grade: string;
}

export interface Internship {
  role: string;
  company: string;
  period: string;
  topics: string[];
  finalProject: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
}
