

import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../../../Data";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {
    Button,
    Box,
    Typography,
    Modal,
    Grid,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const ImportVariablePay = ({ handleToast, onboardName  }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setFile(null); // Reset the file input on modal close
        setOpen(false);
    };

  
    const handleImport = async () => {
        if (!file) {
            alert('Please select an Excel file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/insentive/importVariablePay`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            handleToast(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                const { message, invalidRows } = error.response.data;

                if (invalidRows && invalidRows.length > 0) {
                    console.error('Invalid rows:', invalidRows);

                    const errorMessage = invalidRows
                        .map((row) => `Row ${row.index + 1}: ${JSON.stringify(row.row)}`)
                        .join('\n');

                        handleToast(`Error: ${message}\n\nInvalid Rows:\n${errorMessage}`);
                } else {
                    handleToast(`Error: ${message}`);
                }
            } else {
                handleToast('Unexpected error:', error);
            }
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <Button
            onClick={handleOpen}
            sx={{
                background: 'none',
                color: 'rgb(43, 217, 144)',
                fontSize: '14px',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px', // Space between the icon and text
                '&:hover': {
                    background: 'none',
                    textDecoration: 'underline', // Optional hover effect
                },
            }}
        >
            <FileUploadOutlinedIcon /> {/* Import Icon */}
            <Typography variant="body2">Import</Typography>
        </Button>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="import-attendance-title"
                aria-describedby="import-attendance-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '12px',
                        p: 4,
                        width: { xs: '90%', sm: '400px' },
                        outline: 'none',
                    }}
                >
                    {/* Modal Title */}
                    <Typography
                        id="import-attendance-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold', marginBottom: 1 }}
                    >
                        Import Variable Pay
                    </Typography>

                    {/* Modal Content */}
                    <Box display="flex" flexDirection="column" gap={3}>
                        <ToastContainer />

                        {/* File Input */}
                        <Box>
                            <Typography
                                component="label"
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginBottom: 2 }}
                            >
                                Select Excel File
                            </Typography>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{
                                    padding: '10px 4px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>

                        {/* Buttons */}
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                    sx={{
                                        color: '#6c757d',
                                        borderColor: '#6c757d',
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa',
                                            borderColor: '#6c757d',
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleImport}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#45a049',
                                        },
                                    }}
                                >
                                    Import
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
ImportVariablePay.propTypes = {
    handleToast: PropTypes.func.isRequired,
    onboardName: PropTypes.string,
};


export default ImportVariablePay;
