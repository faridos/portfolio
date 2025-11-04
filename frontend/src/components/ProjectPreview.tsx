import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface ProjectPreviewProps {
  project: {
    id: number;
    title: string;
    description: string;
    image_urls: string[];
    technologies: string[];
    github_url: string;
    live_url: string;
  };
  onPreviewClick: (projectId: number) => void;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, onPreviewClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          cursor: 'pointer',
        },
      }}
      onClick={() => onPreviewClick(project.id)}
    >
      <CardMedia
        component="img"
        height="200"
        image={project.image_urls && project.image_urls.length > 0 ? project.image_urls[0] : ''}
        alt={project.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {project.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {project.description}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {project.technologies.map((tech) => (
            <Chip 
              key={tech} 
              label={tech} 
              size="small" 
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(project.image_urls && project.image_urls.length > 1) && (
              <Tooltip title={`${project.image_urls.length} images available`}>
                <Badge badgeContent={project.image_urls.length} color="primary">
                  <ImageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                </Badge>
              </Tooltip>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View on GitHub">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.github_url, '_blank');
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            {project.live_url && (
              <Tooltip title="View Live Demo">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.live_url, '_blank');
                  }}
                >
                  <LaunchIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectPreview; 