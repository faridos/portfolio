import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import { Project } from '../services/api';
import ImageUpload from './ImageUpload';
import { uploadImage } from '../services/api';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image_urls: [],
    technologies: [],
    github_url: '',
    live_url: '',
    featured: false,
    ...initialData,
  });

  const [currentTech, setCurrentTech] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'featured' ? checked : value,
    }));
  };

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTech.trim()) {
      e.preventDefault();
      if (!formData.technologies?.includes(currentTech.trim())) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...(prev.technologies || []), currentTech.trim()],
        }));
      }
      setCurrentTech('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((tech) => tech !== techToRemove) || [],
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImage(file, formData.id);
      setFormData((prev) => ({
        ...prev,
        image_urls: [...(prev.image_urls || []), result.url],
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ImageUpload
              currentImageUrls={formData.image_urls}
              onImageUpload={handleImageUpload}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Technology"
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              onKeyPress={handleTechKeyPress}
              helperText="Press Enter to add a technology"
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              {formData.technologies?.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  onDelete={() => handleRemoveTech(tech)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GitHub URL"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Live Demo URL"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featured}
                  onChange={handleChange}
                  name="featured"
                />
              }
              label="Featured Project"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {initialData ? 'Update Project' : 'Create Project'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProjectForm; 