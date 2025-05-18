import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useProjects } from '../hooks/useProjects';
import ProjectPreview from '../components/ProjectPreview';
import ProjectDetail from '../components/ProjectDetail';

const Projects: React.FC = () => {
  const { projects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Add default empty array if projects is undefined
  const safeProjects = projects || [];

  // Filter and sort projects
  const filteredProjects = safeProjects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFeatured = !showFeatured || project.featured;
      return matchesSearch && matchesFeatured;
    })
    .sort((a, b) => {
      const aValue = sortBy === 'title' ? a.title : new Date(a.created_at).getTime();
      const bValue = sortBy === 'title' ? b.title : new Date(b.created_at).getTime();
      return sortOrder === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  const handlePreviewClick = (projectId: number) => {
    setSelectedProject(projectId);
  };

  const selectedProjectData = selectedProject 
    ? safeProjects.find(p => p.id === selectedProject) || null
    : null;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>

      {/* Filters and Search */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search projects"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={showFeatured}
                  onChange={(e) => setShowFeatured(e.target.checked)}
                />
              }
              label="Featured only"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="date">Date Added</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort order</InputLabel>
              <Select
                value={sortOrder}
                label="Sort order"
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No projects found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredProjects.map((project) => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <ProjectPreview
                project={project}
                onPreviewClick={handlePreviewClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Project Detail Dialog */}
      <ProjectDetail
        project={selectedProjectData}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Container>
  );
};

export default Projects; 