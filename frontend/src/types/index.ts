export interface Project {
  id: number;
  title: string;
  description: string;
  image_urls: string[];
  technologies: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  current: boolean;
}

export interface PersonalData {
  id?: number;
  name: string;
  title: string;
  bio: string;
  summary: string;
  email: string;
  phone?: string;
  location: string;
  avatar_url: string;
  photo_url: string;
  linkedin_url: string;
  github_url: string;
  skills: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  achievements: string[];
}
