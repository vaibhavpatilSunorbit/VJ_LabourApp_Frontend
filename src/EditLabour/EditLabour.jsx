import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { API_BASE_URL } from "../Data";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditLabour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { labour } = location.state;
  const [formData, setFormData] = useState(labour);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAccountNumberChange = (e) => {
    let cleanedValue = e.target.value.replace(/\D/g, '');
    if (cleanedValue.length > 16) {
      cleanedValue = cleanedValue.slice(0, 16);
    }
    setFormData({ ...formData, accountNumber: cleanedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/update/${labour.id}`, formData);
      if (response.data.success) {
        toast.success('Labour details updated successfully.');
        setOpen(false);
        navigate('/labour-details');
      } else {
        toast.error('Failed to update labour details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating labour details:', error);
      toast.error('Error updating labour details. Please try again.');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit Labour Details
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Labour Details</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '400px' }}
          >
            <TextField
              label="Labour Name"
              name="labourName"
              value={formData.name}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: '100%' }}
            />
            <div className="bankDetails-field">
              <InputLabel id="account-number-label" sx={{ color: "black" }}>
                Account Number
              </InputLabel>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                required
                value={formData.accountNumber || ''}
                onChange={handleAccountNumberChange}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                maxLength={16}
                onKeyDown={(e) => {
                  if (
                    !(
                      (e.key >= '0' && e.key <= '9') || // Allow numbers
                      e.key === 'Backspace' ||
                      e.key === 'Delete' ||
                      e.key === 'ArrowLeft' ||
                      e.key === 'ArrowRight' ||
                      e.key === 'Tab'
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <TextField
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              sx={{ width: '100%' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default EditLabour;


