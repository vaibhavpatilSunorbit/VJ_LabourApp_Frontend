import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from "../../Data";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {
    Button,
    Box,
    Typography,
    Modal,
    Grid,
} from '@mui/material';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const ImportSiteTransfer = ({ handleToast = (type, message) => console[type]?.(message), onboardName, modalOpens, setModalOpens  }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    // const handleClosed = () => setModalOpen(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setFile(null); // Reset the file input on modal close
        setModalOpens(false);
        setOpen(false);
    };

    const handleFilePreview = async (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                console.log('Excel Data:', jsonData); // Log data to console
            };
            reader.readAsArrayBuffer(file);
        }
    };
    
    const handleImport = async () => {
        if (!file) {
            handleToast('error','Please select an Excel file');
            return;
        }
    
        // Preview the file data in the console before uploading
        await handleFilePreview(file);
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('wagesEditedBy', onboardName);
    
        try {
            const response = await axios.post(`${API_BASE_URL}/labours/importWagesExcel`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob', // Handle file or JSON response
            });
    
            const contentType = response.headers['content-type'];
            if (contentType.includes('application/json')) {
                // Handle JSON response
                const text = await new Response(response.data).text(); // Convert blob to text
                const jsonResponse = JSON.parse(text);
                if (jsonResponse.message) {
                    handleToast('success', jsonResponse.message);
                    setModalOpens(false);
                    setOpen(false);
                }
            } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                // Handle Excel file download for error rows
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', 'Error_Rows.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
    
                handleToast('error','Errors occurred during import. Downloaded error file.');
            } else {
                handleToast('error','Unexpected response from the server.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const responseData = JSON.parse(reader.result);
                        if (responseData.message) {
                            handleToast('error',`Error: ${responseData.message}`);
                        }
                    } catch (parseError) {
                        handleToast('error','Unexpected error from server response.');
                    }
                };
                reader.readAsText(error.response.data);
            } else {
                handleToast('error','Error uploading the file. Please try again.');
            }
            handleToast('error','Error uploading the file:', error);
        }
        ImportSiteTransfer.propTypes = {
            handleToast: PropTypes.func,
            onboardName: PropTypes.string,
            modalOpens: PropTypes.bool,
            setModalOpens: PropTypes.func,
        };
    };
 
    return (
        <>
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
                        Import Wages
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={3}>
                        {/* <ToastContainer /> */}

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
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    handleFilePreview(e.target.files[0]);
                                }}
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

export default ImportSiteTransfer;