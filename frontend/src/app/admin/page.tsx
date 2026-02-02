'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Code, Briefcase, User, Upload, Image } from 'lucide-react';
import { getProjects, getExperiences, getPersonalData, createProject, updateProject, deleteProject, createExperience, updateExperience, deleteExperience, updatePersonalData, uploadImage, isAdminAuthenticated, clearAdminCredentials } from '@/services/api';
import { Project, Experience, PersonalData } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'experiences' | 'personal'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({});
  const [personalForm, setPersonalForm] = useState<Partial<PersonalData>>({});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [projectsData, experiencesData, personal] = await Promise.all([
        getProjects(),
        getExperiences(),
        getPersonalData(),
      ]);
      setProjects(projectsData);
      setExperiences(experiencesData);
      setPersonalData(personal);
      setPersonalForm(personal);
    } catch (error) {
      console.error('Error fetching data:', error);
      // If auth fails, redirect to login
      clearAdminCredentials();
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const result = await uploadImage(file);
      setPersonalForm({ ...personalForm, avatar_url: result.url });
      // Also save to backend
      await updatePersonalData({ avatar_url: result.url });
      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(projectForm);
      setProjectForm({});
      setShowProjectForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleUpdateProject = async (id: number, data: Partial<Project>) => {
    try {
      await updateProject(id, data);
      fetchData();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    await handleUpdateProject(project.id, { featured: !project.featured });
  };

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExperience(experienceForm);
      setExperienceForm({});
      setShowExperienceForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating experience:', error);
      alert('Failed to create experience');
    }
  };

  const handleUpdateExperience = async (id: number, data: Partial<Experience>) => {
    try {
      await updateExperience(id, data);
      fetchData();
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await deleteExperience(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePersonalData(personalForm);
      alert('Personal data updated successfully!');
    } catch (error) {
      console.error('Error updating personal data:', error);
      alert('Failed to update personal data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your portfolio content</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'projects', label: 'Projects', icon: Code },
            { id: 'experiences', label: 'Experiences', icon: Briefcase },
            { id: 'personal', label: 'Personal Info', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Projects ({projects.length})</h2>
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Project
              </button>
            </div>

            {/* Project Form */}
            {showProjectForm && (
              <form onSubmit={handleCreateProject} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    required
                    value={projectForm.title || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    required
                    value={projectForm.technologies?.join(',') || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value.split(',').map(t => t.trim()) })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={projectForm.github_url || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="url"
                    placeholder="Live URL"
                    value={projectForm.live_url || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <textarea
                    placeholder="Description"
                    required
                    rows={3}
                    value={projectForm.description || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button type="button" onClick={() => setShowProjectForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Create Project
                  </button>
                </div>
              </form>
            )}

            {/* Projects List */}
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                        {project.featured && (
                          <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-2 rounded-lg ${project.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {project.featured ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Experiences ({experiences.length})</h2>
              <button
                onClick={() => setShowExperienceForm(!showExperienceForm)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Experience
              </button>
            </div>

            {/* Experience Form */}
            {showExperienceForm && (
              <form onSubmit={handleCreateExperience} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Position"
                    required
                    value={experienceForm.position || ''}
                    onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    required
                    value={experienceForm.company || ''}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={experienceForm.location || ''}
                    onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    required
                    value={experienceForm.start_date || ''}
                    onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="date"
                    placeholder="End Date (leave empty for current)"
                    value={experienceForm.end_date || ''}
                    onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={experienceForm.current || false}
                      onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                      className="mr-2"
                    />
                    Current Position
                  </label>
                  <textarea
                    placeholder="Description"
                    required
                    rows={3}
                    value={experienceForm.description || ''}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button type="button" onClick={() => setShowExperienceForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Create Experience
                  </button>
                </div>
              </form>
            )}

            {/* Experiences List */}
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                        {exp.current && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-primary-600 font-medium">{exp.company}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </p>
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Avatar Upload */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                    {personalForm.avatar_url ? (
                      <img src={personalForm.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-4xl font-bold">{personalForm.name?.charAt(0) || 'P'}</span>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                      <Upload className="w-5 h-5 mr-2" />
                      {avatarUploading ? 'Uploading...' : 'Upload New Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={avatarUploading}
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-2">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdatePersonal} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={personalForm.name || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={personalForm.title || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={personalForm.email || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={personalForm.location || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={personalForm.github_url || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, github_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={personalForm.linkedin_url || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, linkedin_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={personalForm.skills?.join(', ') || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, skills: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                    <textarea
                      rows={3}
                      value={personalForm.summary || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, summary: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      value={personalForm.bio || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Save Changes
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
