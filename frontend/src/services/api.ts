import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  name: string;
  title: string;
  bio: string;
  summary: string;
  email: string;
  location: string;
  avatar_url: string;
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

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/api/projects');
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await api.get('/api/experiences');
  return response.data;
};

export const getExperience = async (id: number): Promise<Experience> => {
  const response = await api.get(`/api/experiences/${id}`);
  return response.data;
};

export const getPersonalData = async (): Promise<PersonalData> => {
  const response = await api.get('/api/personal');
  return response.data;
};

export const getEducation = async (): Promise<Education[]> => {
  const response = await api.get('/api/education');
  return response.data;
};

export const sendContactMessage = async (data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> => {
  await api.post('/api/contact', data);
};

export const uploadImage = async (file: File, projectId?: number): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  if (projectId) {
    formData.append('project_id', projectId.toString());
  }

  const response = await api.post('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadMultipleImages = async (files: File[], projectId?: number): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('files', file);
  });
  if (projectId) {
    formData.append('project_id', projectId.toString());
  }

  const response = await api.post('/api/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const response = await api.post('/api/admin/projects', data);
  return response.data;
};

export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const response = await api.put(`/api/admin/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/projects/${id}`);
}; 