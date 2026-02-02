'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Phone, MapPin, Linkedin, Github, Calendar, Award, Code, Briefcase } from 'lucide-react';
import { getPersonalData, getExperiences, getEducation } from '@/services/api';
import { PersonalData, Experience, Education } from '@/types';
import Link from 'next/link';

export default function ResumePage() {
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personal, exp, edu] = await Promise.all([
          getPersonalData(),
          getExperiences(),
          getEducation(),
        ]);
        setPersonalData(personal);
        setExperiences(exp);
        setEducation(edu);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPersonalData({
          name: 'Your Name',
          title: 'Full Stack Developer',
          bio: 'Passionate about building beautiful, functional web applications.',
          summary: 'Experienced Full Stack Developer with expertise in modern web technologies.',
          email: 'contact@example.com',
          phone: '+1234567890',
          location: 'Berlin, Germany',
          avatar_url: '',
          photo_url: '',
          linkedin_url: 'https://linkedin.com',
          github_url: 'https://github.com',
          skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
        });
        setEducation([
          {
            id: 1,
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berlin, Germany',
            start_date: '2016-09-01',
            end_date: '2020-06-30',
            description: 'Studied computer science with focus on software engineering.',
            achievements: ['Graduated with honors', 'President of Coding Club'],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center flex-shrink-0">
              {personalData?.avatar_url ? (
                <img src={personalData.avatar_url} alt={personalData.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold">{personalData?.name?.charAt(0) || 'P'}</span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalData?.name}</h1>
              <p className="text-xl text-primary-600 mb-4">{personalData?.title}</p>
              <p className="text-gray-600 mb-6 max-w-2xl">{personalData?.summary || personalData?.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {personalData?.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {personalData?.phone || '+1234567890'}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {personalData?.location || 'Berlin, Germany'}
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-4 mt-4">
                {personalData?.github_url && (
                  <a href={personalData.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {personalData?.linkedin_url && (
                  <a href={personalData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            <button className="flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2 text-primary-600" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {personalData?.skills?.map((skill) => (
              <span key={skill} className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-gray-700 font-medium rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-primary-600" />
            Work Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-4 border-primary-600 pl-6">
                <div className="flex flex-wrap items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-primary-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                  </span>
                </div>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-primary-600" />
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-secondary-600 pl-6">
                <div className="flex flex-wrap items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-primary-600 font-medium">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(edu.start_date).getFullYear()} - {new Date(edu.end_date).getFullYear()}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{edu.field}</p>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-600">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
