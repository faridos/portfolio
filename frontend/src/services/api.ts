import axios from 'axios';
import { Project, Experience, PersonalData, Education } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apiportfolio.madeingermany.tn';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header if credentials exist
const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const credentials = localStorage.getItem('admin_credentials');
    if (credentials) {
      const { username, password } = JSON.parse(credentials);
      return {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      };
    }
  }
  return {};
};

// Set auth header on each request
api.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  Object.assign(config.headers, authHeader);
  return config;
});

// Public API calls (no auth required)
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

export const getPersonalData = async (): Promise<PersonalData> => {
  const response = await api.get('/api/personal/first');
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

// Admin API calls (auth required)
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

export const createExperience = async (data: Partial<Experience>): Promise<Experience> => {
  const response = await api.post('/api/admin/experiences', data);
  return response.data;
};

export const updateExperience = async (id: number, data: Partial<Experience>): Promise<Experience> => {
  const response = await api.put(`/api/admin/experiences/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/experiences/${id}`);
};

export const updatePersonalData = async (data: Partial<PersonalData>): Promise<PersonalData> => {
  const response = await api.put('/api/admin/personal/1', data);
  return response.data;
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
      ...getAuthHeader(),
    },
  });
  return response.data;
};

export const uploadMultipleImages = async (files: File[], projectId?: number): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  if (projectId) {
    formData.append('project_id', projectId.toString());
  }

  const response = await api.post('/api/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeader(),
    },
  });
  return response.data;
};

// Auth utilities
export const setAdminCredentials = (username: string, password: string) => {
  localStorage.setItem('admin_credentials', JSON.stringify({ username, password }));
};

export const clearAdminCredentials = () => {
  localStorage.removeItem('admin_credentials');
};

export const isAdminAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('admin_credentials');
  }
  return false;
};

// Verify credentials by making a test API call
export const verifyAdminAuth = async (): Promise<boolean> => {
  try {
    await api.get('/api/admin/projects');
    return true;
  } catch {
    clearAdminCredentials();
    return false;
  }
};
