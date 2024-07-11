// EditLabour.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { API_BASE_URL } from "../../Data";
import { toast } from 'react-toastify';

const EditLabour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { labour } = location.state;
  const [formData, setFormData] = useState(labour);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/labours/${labour.id}`, formData);
      if (response.data.success) {
        toast.success('Labour details updated successfully.');
        navigate('/labour-details');
      } else {
        toast.error('Failed to update labour details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating labour details:', error);
      toast.error('Error updating labour details. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: 'auto' }}
    >
      <Typography variant="h5" mb={2}>Edit Labour Details</Typography>
      <TextField
        label="Account Number"
        name="accountNumber"
        value={formData.accountNumber}
        onChange={handleInputChange}
      />
      <TextField
        label="Expiry Date"
        name="expiryDate"
        value={formData.expiryDate}
        onChange={handleInputChange}
      />
      <Button type="submit" variant="contained" color="primary">Update</Button>
    </Box>
  );
};

export default EditLabour;
