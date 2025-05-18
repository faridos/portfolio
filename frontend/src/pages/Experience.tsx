import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import { Business as WorkIcon } from '@mui/icons-material';
import { useExperiences } from '../hooks/useExperiences';

const Experience: React.FC = () => {
  const { experiences, loading } = useExperiences();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Add default empty array if experiences is undefined
  const safeExperiences = experiences || [];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Work Experience
      </Typography>
      {safeExperiences.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No work experience available.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {safeExperiences.map((experience) => (
            <Grid item key={experience.id} xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    {experience.position}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {experience.company} • {experience.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {experience.start_date} - {experience.end_date || 'Present'}
                </Typography>
                <Typography variant="body1" paragraph>
                  {experience.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Experience; 