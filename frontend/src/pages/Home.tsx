import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Grow,
  Fade,
  Zoom,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { usePersonalData } from '../hooks/usePersonalData';
import { GitHub as GitHubIcon, LinkedIn as LinkedInIcon } from '@mui/icons-material';

interface QuickLink {
  text: string;
  to?: string;
  href?: string;
  icon?: React.ReactNode;
}

const Home: React.FC = () => {
  const { personalData } = usePersonalData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Add default values for personalData
  const safePersonalData = {
    name: personalData?.name || 'Your Name',
    title: personalData?.title || 'Your Title',
    bio: personalData?.bio || 'Your Bio',
    summary: personalData?.summary || '',
    avatar_url: personalData?.avatar_url || '',
    github_url: personalData?.github_url || '#',
    linkedin_url: personalData?.linkedin_url || '#',
    skills: personalData?.skills || [],
  };

  const quickLinks: QuickLink[] = [
    { text: 'View Experience', to: '/experience' },
    { text: 'View Education', to: '/education' },
    { text: 'GitHub Profile', href: safePersonalData.github_url, icon: <GitHubIcon /> },
    { text: 'LinkedIn Profile', href: safePersonalData.linkedin_url, icon: <LinkedInIcon /> },
  ];

  return (
    <Container maxWidth="lg">
      <Fade in timeout={1000}>
        <Box
          sx={{
            my: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Zoom in timeout={1000}>
            <Avatar
              src={safePersonalData.avatar_url}
              alt={safePersonalData.name}
              sx={{
                width: isMobile ? 150 : 200,
                height: isMobile ? 150 : 200,
                mb: 4,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[4],
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[8],
                },
              }}
            />
          </Zoom>

          <Grow in timeout={1000}>
            <Box>
              <Typography
                variant="h2"
                component="h1"
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
                {safePersonalData.name}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 4 }}
              >
                {safePersonalData.title}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                }}
              >
                {safePersonalData.summary || safePersonalData.bio}
              </Typography>
            </Box>
          </Grow>

          <Grow in timeout={1000} style={{ transformOrigin: '0 0 0' }}>
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/projects"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                View Projects
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Contact Me
              </Button>
            </Box>
          </Grow>

          <Grid container spacing={4} sx={{ mt: 8 }}>
            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: 600, mb: 3 }}
                    >
                      Skills
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                      }}
                    >
                      {safePersonalData.skills.map((skill: string, index: number) => (
                        <Box
                          key={skill}
                          sx={{
                            opacity: 0,
                            animation: `fadeIn 0.5s ease forwards ${index * 0.1}s`,
                          }}
                        >
                          <Paper
                            elevation={2}
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: '20px',
                              backgroundColor: theme.palette.primary.main,
                              color: 'white',
                              fontWeight: 500,
                            }}
                          >
                            {skill}
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: 600, mb: 3 }}
                    >
                      Quick Links
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      {quickLinks.map((link: QuickLink, index: number) => (
                        <Box
                          key={link.text}
                          sx={{
                            opacity: 0,
                            animation: `fadeIn 0.5s ease forwards ${index * 0.1}s`,
                            '@keyframes fadeIn': {
                              '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)',
                              },
                              '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                              },
                            },
                          }}
                        >
                          <Button
                            component={link.href ? 'a' : Link}
                            to={link.to}
                            href={link.href}
                            target={link.href ? '_blank' : undefined}
                            rel={link.href ? 'noopener noreferrer' : undefined}
                            variant="outlined"
                            fullWidth
                            startIcon={link.icon}
                            sx={{
                              py: 1.5,
                              borderRadius: '10px',
                              textTransform: 'none',
                              fontSize: '1rem',
                              '&:hover': {
                                transform: 'translateX(8px)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {link.text}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default Home; 