import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Add as AddIcon,
  GitHub as GitHubIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

const AddUserModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platforms: [{ platformName: 'GitHub', accountId: '' }]
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      platforms: [{ platformName: 'GitHub', accountId: '' }]
    });
    setErrors({});
    setSubmitError('');
    setIsSubmitting(false);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

      if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    
    formData.platforms.forEach((platform, index) => {
      if (!platform.accountId.trim()) {
        newErrors[`platform${index}`] = 'Account ID is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formattedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        platforms: formData.platforms.map(p => ({
          ...p,
          accountId: p.accountId.trim(),
          status: 'active'
        }))
      };

      await onAdd(formattedData);
      handleClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to add user. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePlatformChange = useCallback((index, value) => {
    setFormData(prev => {
      const newPlatforms = [...prev.platforms];
      newPlatforms[index] = {
        ...newPlatforms[index],
        accountId: value
      };
      return {
        ...prev,
        platforms: newPlatforms
      };
    });

    setErrors(prev => ({
      ...prev,
      [`platform${index}`]: ''
    }));
  }, []);

  const addPlatform = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { platformName: 'GitHub', accountId: '' }]
    }));
  }, []);

  const removePlatform = useCallback((index) => {
    if (formData.platforms.length > 1) {
      setFormData(prev => ({
        ...prev,
        platforms: prev.platforms.filter((_, i) => i !== index)
      }));
      
    
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`platform${index}`];
        return newErrors;
      });
    }
  }, [formData.platforms.length]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          maxWidth: 500
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        bgcolor: 'background.paper' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Add New User</Typography>
        </Box>
        <IconButton 
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {submitError && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setSubmitError('')}
            >
              {submitError}
            </Alert>
          )}
          
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Platform Accounts
              </Typography>
              <Stack spacing={2}>
                {formData.platforms.map((platform, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Chip
                      icon={<GitHubIcon />}
                      label="GitHub"
                      size="small"
                      sx={{ minWidth: 100 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter GitHub username"
                      value={platform.accountId}
                      onChange={(e) => handlePlatformChange(index, e.target.value)}
                      error={!!errors[`platform${index}`]}
                      helperText={errors[`platform${index}`]}
                      disabled={isSubmitting}
                    />
                    {formData.platforms.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removePlatform(index)}
                        disabled={isSubmitting}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
              
              <Button
                startIcon={<AddIcon />}
                onClick={addPlatform}
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                Add Platform
              </Button>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Add User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;