import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
  onImageDelete?: () => Promise<void>;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUpload,
  onImageDelete,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setIsUploading(true);
      await onImageUpload(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!onImageDelete) return;
    
    try {
      setIsUploading(true);
      await onImageDelete();
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
        position: 'relative',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        disabled={disabled || isUploading}
      />

      {previewUrl ? (
        <>
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              maxWidth: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              mb: 2,
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              startIcon={<UploadIcon />}
            >
              Change Image
            </Button>
            {onImageDelete && (
              <IconButton
                color="error"
                onClick={handleDelete}
                disabled={disabled || isUploading}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </>
      ) : (
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          startIcon={<UploadIcon />}
        >
          Upload Image
        </Button>
      )}

      {isUploading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Supported formats: JPG, PNG, GIF (max 5MB)
      </Typography>
    </Box>
  );
};

export default ImageUpload; 