import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  MobileStepper,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface ProjectDetailProps {
  project: {
    id: number;
    title: string;
    description: string;
    image_urls: string[];
    technologies: string[];
    github_url: string;
    live_url: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, open, onClose }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  if (!project) return null;

  const images = project.image_urls || [];
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{project.title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {maxSteps > 0 && (
          <Box sx={{ mb: 3, position: 'relative' }}>
            <Paper
              square
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 50,
                pl: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography>{images[activeStep] ? `Image ${activeStep + 1} of ${maxSteps}` : ''}</Typography>
            </Paper>
            <Box sx={{ height: 400, maxWidth: '100%', width: '100%', p: 2 }}>
              <img
                src={images[activeStep]}
                alt={`${project.title} - Image ${activeStep + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Box>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </Box>
        )}
        <Typography variant="body1" paragraph>
          {project.description}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          {project.technologies.map((tech) => (
            <Chip 
              key={tech} 
              label={tech} 
              size="small" 
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => window.open(project.github_url, '_blank')}
          >
            View on GitHub
          </Button>
          {project.live_url && (
            <Button
              variant="contained"
              startIcon={<LaunchIcon />}
              onClick={() => window.open(project.live_url, '_blank')}
            >
              Live Demo
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetail; 