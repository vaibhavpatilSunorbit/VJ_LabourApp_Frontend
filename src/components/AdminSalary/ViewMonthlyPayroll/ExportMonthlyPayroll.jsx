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


const ExportMonthlyPayroll = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    // const [selectedMonth, setMonth] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const currentYear = new Date().getFullYear();
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
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
        if (!selectedMonth && !selectedYear) {
            toast.error('Please select a Month.');
            return;
        }
        
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/exportMonthlyPayrollExcel`, {
                params: { projectName, month: selectedMonth, year: selectedYear  },
                responseType: 'blob',
            });
    
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
    
            const fileName = projectName === "all"
                ? `Approved_Labours_${selectedMonth}_${selectedYear}.xlsx`
                : `MonthlyPayroll_${projectName}_${selectedMonth}_${selectedYear}.xlsx`;
    
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
    
            link.parentNode.removeChild(link);
    
            toast.success('Monthly Payroll exported successfully!');
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
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
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
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Select
                                 value={selectedYear}
                                 onChange={(e) => setSelectedYear(e.target.value)}
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
                                    Select Year
                                </MenuItem>
                                {[2024, 2025].map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
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
export default ExportMonthlyPayroll;