import React from 'react';
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
} from '@mui/material';
import {
  Close as CloseIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';

interface ProjectDetailProps {
  project: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    technologies: string[];
    github_url: string;
    live_url: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, open, onClose }) => {
  if (!project) return null;

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
        <Box sx={{ mb: 3 }}>
          <img 
            src={project.image_url} 
            alt={project.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </Box>
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