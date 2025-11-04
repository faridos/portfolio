import { useState, useEffect } from 'react';
import { getPersonalData, PersonalData } from '../services/api';

export const usePersonalData = () => {
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: '',
    title: '',
    bio: '',
    summary: '',
    email: '',
    location: '',
    avatar_url: '',
    photo_url: '',
    linkedin_url: '',
    github_url: '',
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPersonalData();
        setPersonalData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch personal data'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { personalData, loading, error };
}; 