import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';

const departments = ['Support', 'Engineering', 'Sales'];
const categories = ['Login Issue', 'Bug Report', 'Feature Request'];
const subcategories = ['UI Bug', 'Performance', 'Crash'];
const priorityLevels = ['Low', 'Medium', 'High'];

const priorityColors = {
  Low: 'success',
  Medium: 'warning', 
  High: 'error'
};

const SupportTicketForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    category: '',
    subcategory: '',
    priority: 'Low',
    description: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // TODO: API call logic
  };

  const handleCreateTicket = () => {
    console.log('Creating new ticket...');
    // Reset form or navigate to new ticket creation
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      category: '',
      subcategory: '',
      priority: 'Low',
      description: '',
      file: null
    });
  };

  return (
    <Box 
      sx={{ 
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fafafa'
      }}
    >
      {/* Fixed Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3,
          borderRadius: 0,
          bgcolor: 'white',
          borderBottom: '2px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ textAlign: 'left' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <SupportAgentIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                <Box>
                  <Typography variant="h5" fontWeight="600" color="text.primary">
                    Support Ticket System
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Submit and manage your support requests
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTicket}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: '#1976d2',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#1565c0',
                  boxShadow: 3
                }
              }}
            >
              Create Ticket
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Scrollable Form Content */}
      <Box 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f5f5f5',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: '4px',
            '&:hover': {
              background: '#9e9e9e',
            },
          },
        }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              bgcolor: 'white',
              border: '1px solid #e0e0e0',
              mb: 3
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                New Support Ticket
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please fill out all required fields to submit your support request
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Information Section */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      color="text.primary" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        borderLeft: '4px solid #1976d2',
                        pl: 2,
                        bgcolor: '#f8f9ff',
                        py: 1,
                        borderRadius: '0 4px 4px 0'
                      }}
                    >
                      Contact Information
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }
                    }}
                  />
                </Grid>

                {/* Ticket Details Section */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      color="text.primary" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        borderLeft: '4px solid #1976d2',
                        pl: 2,
                        bgcolor: '#f8f9ff',
                        py: 1,
                        borderRadius: '0 4px 4px 0'
                      }}
                    >
                      Ticket Details
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      label="Department"
                      sx={{ 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                      sx={{ 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      label="Subcategory"
                      sx={{ 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }}
                    >
                      {subcategories.map((sub) => (
                        <MenuItem key={sub} value={sub}>
                          {sub}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority Level</InputLabel>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      label="Priority Level"
                      sx={{ 
                        borderRadius: 1,
                        bgcolor: 'white'
                      }}
                    >
                      {priorityLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip 
                              label={level} 
                              size="small" 
                              color={priorityColors[level]}
                              variant="outlined"
                            />
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Description Section */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      color="text.primary" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        borderLeft: '4px solid #1976d2',
                        pl: 2,
                        bgcolor: '#f8f9ff',
                        py: 1,
                        borderRadius: '0 4px 4px 0'
                      }}
                    >
                      Issue Description
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Describe your issue"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    fullWidth
                    placeholder="Please provide a detailed description of your issue. Include any error messages, steps to reproduce, and what you expected to happen..."
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1,
                        bgcolor: 'white',
                        '& textarea': {
                          fontSize: '0.95rem',
                          lineHeight: 1.6
                        }
                      }
                    }}
                  />
                </Grid>

                {/* File Upload Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      color="text.primary" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        borderLeft: '4px solid #1976d2',
                        pl: 2,
                        bgcolor: '#f8f9ff',
                        py: 1,
                        borderRadius: '0 4px 4px 0'
                      }}
                    >
                      Attachments
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ 
                      py: 3,
                      borderRadius: 1,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: '#bdbdbd',
                      bgcolor: '#fafafa',
                      color: 'text.secondary',
                      '&:hover': {
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: '#1976d2',
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    Upload Screenshot or Document (JPG/PNG up to 5MB)
                    <input
                      type="file"
                      hidden
                      accept="image/png, image/jpeg"
                      name="file"
                      onChange={handleChange}
                    />
                  </Button>
                  {formData.file && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: '#e8f5e8', 
                      borderRadius: 1,
                      border: '1px solid #c8e6c9'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AttachFileIcon sx={{ color: '#2e7d32' }} />
                        <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                          <strong>File attached:</strong> {formData.file.name}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Grid>

                {/* Extra spacing for better scrolling */}
                <Grid item xs={12} sx={{ height: '20px' }} />
              </Grid>
            </form>
          </Paper>
        </Box>
      </Box>
      {/* Fixed Footer with Action Buttons */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          borderRadius: 0,
          bgcolor: 'white',
          borderTop: '2px solid #e0e0e0',
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}
      >
    
      </Paper>
    </Box>
  );
};

export default SupportTicketForm;
