import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Tabs, Tab, Typography,
    InputAdornment, IconButton, Modal, Grid
} from '@mui/material';
import { API_BASE_URL } from "../../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';


const ExportVariablePay = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);

    const fetchBusinessUnits = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
            setBusinessUnits(response.data);
        } catch (error) {
            console.error('Error fetching business units:', error);
            toast.error('Error fetching business units.');
        }
    };
    useEffect(() => {
        fetchBusinessUnits();
    }, []);

    const handleBusinessUnitChange = async (event) => {
        const selectedUnit = event.target.value;
        setSelectedBusinessUnit(selectedUnit);

        const selectedProject = businessUnits.find((unit) => unit.BusinessUnit === selectedUnit);
        if (selectedProject) {
            setProjectName(selectedProject.ProjectID);

            try {
                const response = await axios.get(`${API_BASE_URL}/labours`, {
                    params: { projectName: selectedProject.ProjectID },
                });
                setLabours(response.data);
            } catch (error) {
                console.error('Error fetching labours for project:', error);
                toast.error('Error fetching labours for the selected project.');
            }
        }
    };

    const handleExportSelectBU = async () => {
        if (!projectName || !startDate) {
            toast.error('Please select a Business Unit and Start Date.');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/exportVariablePayexcelSheetWithBU`, {
                params: { projectName, startDate },
                responseType: 'blob', // Important for handling binary data
            });

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Extract month and year from startDate for the file name
            const dateObj = new Date(startDate);
            const month = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

            // Define the file name based on 'projectName' and 'month'
            const fileName = projectName === "all"
                ? `Approved_Labours_${month}.xlsx`
                : `VariablePay_${selectedBusinessUnit}_${month}.xlsx`;

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Clean up the link element
            link.parentNode.removeChild(link);

            toast.success('Variable Pay exported successfully!');
        } catch (error) {
            if (
                error.response &&
                error.response.status === 404 &&
                error.response.data instanceof Blob
              ) {
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const errorData = JSON.parse(reader.result);
                    toast.error(errorData.message); // Show in UI
                  } catch (e) {
                    console.error('Failed to parse blob error message');
                  }
                };
                reader.readAsText(error.response.data);
              } else {
                toast.error('Unexpected error:', error.message);
              }
        }
    };


    const handleExport = async () => {
        try {
            // Send GET request to the export endpoint
            const response = await axios.get(`${API_BASE_URL}/insentive/exportVariablePayExcel`, {
                responseType: 'blob', // Important for handling binary data
            });

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Generate a filename with the current date
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const fileName = `VariablePay_${currentDate}.xlsx`;

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Clean up the link element
            link.parentNode.removeChild(link);

            // Show success toast notification
            toast.success('Variable Pay exported successfully!');
        } catch (error) {
            console.error('Error exporting Variable Pay:', error);

            // Determine the error message to display
            let errorMessage = 'Error exporting Variable Pay data. Please try again later.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = `Export Error: ${error.response.data.message}`;
            }

            // Show error toast notification
            toast.error(errorMessage);
        }
    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                padding: 0, // Remove padding for text-only appearance
            }}
        >
            <FileDownloadOutlinedIcon /> {/* Export Icon */}
            <Typography variant="body2">Export</Typography>
        </Button>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="export-attendance-title"
                aria-describedby="export-attendance-description"
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
                        width: { xs: '90%', sm: '400px' }, // Responsive width
                        outline: 'none',
                    }}
                >
                    {/* Modal Title */}
                    <Typography
                        id="export-attendance-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold', marginBottom: 2 }}
                    >
                        Export Variable Pay
                    </Typography>

                    {/* Form Fields */}
                    <Box component="form" display="flex" flexDirection="column" gap={2}>
                        {/* Business Unit Dropdown */}
                        <Box>
                            <Typography
                                component="label"
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginBottom: 0.5 }}
                            >
                                Select Business Unit
                            </Typography>
                            <Select
                                value={selectedBusinessUnit}
                                onChange={(e) => {
                                    setSelectedBusinessUnit(e.target.value);
                                    const selectedProject = businessUnits.find(
                                        (unit) => unit.BusinessUnit === e.target.value
                                    );
                                    setProjectName(selectedProject?.ProjectID || '');
                                }}
                                displayEmpty
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    paddingTop: '4px',
                                    paddingBottom: '2px'
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select Business Unit
                                </MenuItem>
                                {businessUnits.map((unit) => (
                                    <MenuItem
                                        key={unit.BusinessUnit}
                                        value={unit.BusinessUnit}
                                    >
                                        {unit.BusinessUnit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        {/* Start Date */}
                        <Box>
                            <Typography
                                component="label"
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginBottom: 0.5 }}
                            >
                                Start Date
                            </Typography>
                            <TextField
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        paddingBottom: '12px', // Adjust the padding inside the input
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>

                        {/* <Box>
                            <Typography
                                component="label"
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginBottom: 0.5 }}
                            >
                                End date
                            </Typography>
                            <TextField
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        paddingBottom: '12px', // Adjust the padding inside the input
                                    },
                                }}
                            />
                        </Box> */}


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
                                    onClick={handleExportSelectBU}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#45a049',
                                        },
                                    }}
                                >
                                    Export With BU
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleExport}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#45a049',
                                        },
                                    }}
                                >
                                    Export
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </>
    )

};
export default ExportVariablePay;