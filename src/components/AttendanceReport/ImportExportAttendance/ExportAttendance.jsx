import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, Box, TextField, Select, MenuItem, Typography, Modal, Grid
} from '@mui/material';
import { API_BASE_URL } from "../../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';


const ExportAttendance = () => {
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
    const handleExport = async () => {
        if (!selectedBusinessUnit || !projectName || !startDate || !endDate) {
            toast.error('Please select a Business Unit, Start Date, and End Date.');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/export`, {
                params: { projectName, startDate, endDate },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const fileName = `Attendance_${selectedBusinessUnit}_${startDate}_${endDate}.xlsx`;

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);

            toast.success('Attendance exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Export Error: ${error.response.data.message}`);
            } else {
                toast.error('Error exporting data. Please try again later.');
            }
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                    padding: 0,
                }}
            >
                <FileDownloadOutlinedIcon />
                <Typography variant="body2">Export</Typography>
            </Button>

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
                        width: { xs: '90%', sm: '400px' },
                        outline: 'none',
                    }}
                >
                    <Typography
                        id="export-attendance-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold', marginBottom: 2 }}
                    >
                        Export Attendance Data
                    </Typography>

                    <Box component="form" display="flex" flexDirection="column" gap={2}>
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

                        <Box>
                            <Typography
                                component="label"
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginBottom: 0.5 }}
                            >
                                Start date
                            </Typography>
                            <TextField
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '& .MuiInputBase-input': {
                                        paddingBottom: '12px',
                                    },
                                }}
                            />
                        </Box>

                        <Box>
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
                                        paddingBottom: '12px',
                                    },
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
export default ExportAttendance;