import { useState, useEffect } from 'react';
import { getExperiences, Experience } from '../services/api';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExperiences();
        // Sort experiences by start date in descending order
        const sortedData = data.sort(
          (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        setExperiences(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch experiences'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { experiences, loading, error };
}; 