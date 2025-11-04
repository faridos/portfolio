import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Grow,
  Fade,
  Zoom,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { usePersonalData } from '../hooks/usePersonalData';
import { useProjects } from '../hooks/useProjects';
import ProjectDetail from '../components/ProjectDetail';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Launch as LaunchIcon,
  Code as CodeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

interface QuickLink {
  text: string;
  to?: string;
  href?: string;
  icon?: React.ReactNode;
}

const Home: React.FC = () => {
  const { personalData } = usePersonalData();
  const { projects, loading: projectsLoading } = useProjects();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animatedElements, setAnimatedElements] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Add default values for personalData
  const safePersonalData = {
    name: personalData?.name || 'Your Name',
    title: personalData?.title || 'Your Title',
    bio: personalData?.bio || 'Your Bio',
    summary: personalData?.summary || '',
    avatar_url: personalData?.avatar_url || '',
    photo_url: personalData?.photo_url || '',
    github_url: personalData?.github_url || '#',
    linkedin_url: personalData?.linkedin_url || '#',
    skills: personalData?.skills || [],
  };

  // Get featured projects for showcase
  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || [];
  const recentProjects = projects?.slice(0, 6) || [];

  // Handle project preview click
  const handleProjectClick = (projectId: number) => {
    setSelectedProject(projectId);
  };

  const selectedProjectData = selectedProject
    ? featuredProjects.find(p => p.id === selectedProject) || null
    : null;

  // Animation trigger for elements
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimated = new Set<number>();
      for (let i = 0; i < 10; i++) {
        newAnimated.add(i);
      }
      setAnimatedElements(newAnimated);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: <CodeIcon />, value: projects?.length || 0, label: 'Projects', color: '#2196f3' },
    { icon: <WorkIcon />, value: '5+', label: 'Years Experience', color: '#4caf50' },
    { icon: <StarIcon />, value: safePersonalData.skills.length, label: 'Skills', color: '#ff9800' },
    { icon: <TrendingUpIcon />, value: '100%', label: 'Passion', color: '#e91e63' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box
            sx={{
              pt: isMobile ? 8 : 12,
              pb: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.1,
              }
            }}
          >
            <Zoom in={animatedElements.has(0)} timeout={1000}>
              <Avatar
                src={safePersonalData.avatar_url}
                alt={safePersonalData.name}
                sx={{
                  width: isMobile ? 180 : 250,
                  height: isMobile ? 180 : 250,
                  mb: 4,
                  border: `6px solid rgba(255,255,255,0.3)`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                  },
                }}
              >
                {safePersonalData.name.charAt(0)}
              </Avatar>
            </Zoom>

            <Grow in={animatedElements.has(1)} timeout={1000}>
              <Box>
                <Typography
                  variant={isMobile ? "h3" : "h1"}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    mb: 2,
                  }}
                >
                  {safePersonalData.name}
                </Typography>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 4,
                    fontWeight: 300,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  {safePersonalData.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: '700px',
                    mx: 'auto',
                    fontSize: '1.2rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.8)',
                    mb: 6,
                  }}
                >
                  {safePersonalData.summary || safePersonalData.bio}
                </Typography>
              </Box>
            </Grow>

            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mt: 4, mb: 6, maxWidth: '800px' }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={stat.label}>
                  <Grow in={animatedElements.has(index + 2)} timeout={1000 + index * 200}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          background: 'rgba(255,255,255,0.15)',
                        },
                      }}
                    >
                      <Box sx={{ color: stat.color, mb: 1, fontSize: '2rem' }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            <Grow in={animatedElements.has(6)} timeout={1000}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 8 }}>
                <Button
                  component={Link}
                  to="/contact"
                  variant="contained"
                  size="large"
                  startIcon={<EmailIcon />}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: '50px',
                    background: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    '&:hover': {
                      background: 'white',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get In Touch
                </Button>
                <Button
                  component={Link}
                  to="/projects"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: '50px',
                    borderColor: 'white',
                    borderWidth: 2,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  View All Projects
                </Button>
              </Box>
            </Grow>
          </Box>
        </Fade>
      </Container>

      {/* Featured Projects Section */}
      <Box sx={{ background: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Fade in={animatedElements.has(7)} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Featured Projects
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Showcasing my best work and creative solutions
              </Typography>
            </Box>
          </Fade>

          {projectsLoading ? (
            <Grid container spacing={4}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {featuredProjects.map((project, index) => (
                <Grid item xs={12} md={4} key={project.id}>
                  <Grow in={animatedElements.has(index + 8)} timeout={1000 + index * 300}>
                    <Card
                      onClick={() => handleProjectClick(project.id)}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'white',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.01)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={project.image_urls && project.image_urls.length > 0 ? project.image_urls[0] : ''}
                        alt={project.title}
                        sx={{
                          transition: 'transform 0.4s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label="Featured"
                            color="secondary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          {project.image_urls && project.image_urls.length > 1 && (
                            <Tooltip title={`${project.image_urls.length} images`}>
                              <Chip
                                icon={<StarIcon />}
                                label={project.image_urls.length}
                                size="small"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {project.description.length > 120
                            ? `${project.description.substring(0, 120)}...`
                            : project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {project.technologies.length > 3 && (
                            <Chip
                              label={`+${project.technologies.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(project.created_at).toLocaleDateString()}
                          </Typography>
                          <Box>
                            {project.github_url && (
                              <IconButton
                                size="small"
                                href={project.github_url}
                                target="_blank"
                                sx={{ color: 'text.secondary' }}
                              >
                                <GitHubIcon fontSize="small" />
                              </IconButton>
                            )}
                            {project.live_url && (
                              <IconButton
                                size="small"
                                href={project.live_url}
                                target="_blank"
                                sx={{ color: 'text.secondary' }}
                              >
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          )}

          {featuredProjects.length === 0 && !projectsLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No featured projects yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back soon for amazing projects!
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Project Detail Modal */}
      <ProjectDetail
        project={selectedProjectData}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Skills Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
        <Container maxWidth="lg">
          <Fade in={animatedElements.has(11)} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Skills & Expertise
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Technologies and tools I work with
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={2} justifyContent="center">
            {safePersonalData.skills.map((skill: string, index: number) => (
              <Grow key={skill} in={animatedElements.has(index + 12)} timeout={1000 + index * 100}>
                <Grid item>
                  <Chip
                    label={skill}
                    sx={{
                      px: 3,
                      py: 2,
                      fontSize: '1rem',
                      fontWeight: 500,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                    }}
                  />
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 