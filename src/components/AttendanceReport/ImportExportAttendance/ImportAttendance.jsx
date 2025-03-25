

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
import Loading from '../../Loading/Loading';

const ImportAttendance = () => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setFile(null);
        setOpen(false);
    };


    const handleImport = async () => {
        if (!file) {
            toast.error('Please select an Excel file');
            return;
        }
        const selectedFile = file;
        handleClose();

        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(`${API_BASE_URL}/labours/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.message(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                const { message, invalidRows } = error.response.data;

                if (invalidRows && invalidRows.length > 0) {
                    console.error('Invalid rows:', invalidRows);

                    const errorMessage = invalidRows
                        .map((row) => `Row ${row.index + 1}: ${JSON.stringify(row.row)}`)
                        .join('\n');

                    console.log(`Error: ${message}\n\nInvalid Rows:\n${errorMessage}`);
                } else {
                    toast.message(`Error: ${message}`);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Loading />
                </Box>
            )}

            <Button
                onClick={handleOpen}
                sx={{
                    background: 'none',
                    color: 'rgb(43, 217, 144)',
                    fontSize: '14px',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    '&:hover': {
                        background: 'none',
                        textDecoration: 'underline',
                    },
                }}
            >
                <FileUploadOutlinedIcon />
                <Typography variant="body2">Import</Typography>
            </Button>

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
                    <Typography
                        id="import-attendance-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold', marginBottom: 1 }}
                    >
                        Import Attendance Data
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={3}>
                        <ToastContainer />

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

export default ImportAttendance;
