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


const ExportWages = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    const [month, setMonth] = useState('');

    const currentYear = new Date().getFullYear();
    const months = [
        { label: 'January', value: `${currentYear}-01` },
        { label: 'February', value: `${currentYear}-02` },
        { label: 'March', value: `${currentYear}-03` },
        { label: 'April', value: `${currentYear}-04` },
        { label: 'May', value: `${currentYear}-05` },
        { label: 'June', value: `${currentYear}-06` },
        { label: 'July', value: `${currentYear}-07` },
        { label: 'August', value: `${currentYear}-08` },
        { label: 'September', value: `${currentYear}-09` },
        { label: 'October', value: `${currentYear}-10` },
        { label: 'November', value: `${currentYear}-11` },
        { label: 'December', value: `${currentYear}-12` },
    ];

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

    const handleExport = async () => {
        if (!month) {
            toast.error('Please select a Month.');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/exportWagesExcel`, {
                params: { projectName, month },
                responseType: 'blob',
            });
    
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
    
            const fileName = projectName === "all"
                ? `Approved_Labours_${month}.xlsx`
                : `Wages_${projectName}_${month}.xlsx`;
    
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
    
            link.parentNode.removeChild(link);
    
            toast.success('Wages exported successfully!');
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

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="export-wages-title"
                aria-describedby="export-wages-description"
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
                        id="export-wages-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold', marginBottom: 2 }}
                    >
                        Export Wages Data
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
                                onChange={handleBusinessUnitChange}
                                displayEmpty
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    paddingTop: '4px',
                                    paddingBottom: '2px',
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select Business Unit
                                </MenuItem>
                                <MenuItem value="all">All Projects</MenuItem> {/* Add "All Projects" Option */}
                                {businessUnits.map((unit) => (
                                    <MenuItem key={unit.BusinessUnit} value={unit.BusinessUnit}>
                                        {unit.BusinessUnit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        {/* Month Selector */}
                        <Box>
                            <Typography
                                component="label"
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginBottom: 0.5 }}
                            >
                                Select Month
                            </Typography>
                            <Select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                displayEmpty
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    paddingTop: '4px',
                                    paddingBottom: '2px',
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select Month
                                </MenuItem>
                                {months.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>
                                        {m.label}
                                    </MenuItem>
                                ))}
                            </Select>
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
export default ExportWages;