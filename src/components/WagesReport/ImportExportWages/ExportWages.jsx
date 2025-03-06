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


const ExportWages = ({departments, projectNames}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    const [month, setMonth] = useState('');
    const [payStructure, setPayStructure] = useState('');

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

    useEffect(() => {
        if (projectNames && projectNames.length > 0) {
          const units = projectNames.map((p) => ({
            BusinessUnit: p.Business_Unit,
            ProjectID: p.Id,
          }));
          setBusinessUnits(units);
        }
      console.log('Unit for bu',projectNames)

      }, [projectNames]);


    const handleBusinessUnitsChange = async (event) => {
        const { value } = event.target;
        // Ensure value is always an array
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        setSelectedBusinessUnit(selectedValues);
    
        // If only one business unit is selected, fetch its labours.
        if (selectedValues.length === 1) {
            const selectedProject = businessUnits.find(
                (unit) => unit.BusinessUnit === selectedValues[0]
            );
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
        } else {
            // If multiple business units are selected, you can decide how to handle labours.
            // For example, you might clear the labours state:
            setProjectName('');
            setLabours([]);
        }
    };

    // const handleBusinessUnitChange = async (event) => {
    //     const selectedUnit = event.target.value;
    //     setSelectedBusinessUnit(selectedUnit);

    //     const selectedProject = businessUnits.find((unit) => unit.BusinessUnit === selectedUnit);
    //     if (selectedProject) {
    //         setProjectName(selectedProject.ProjectID);

    //         try {
    //             const response = await axios.get(`${API_BASE_URL}/labours`, {
    //                 params: { projectName: selectedProject.ProjectID },
    //             });
    //             setLabours(response.data);
    //         } catch (error) {
    //             console.error('Error fetching labours for project:', error);
    //             toast.error('Error fetching labours for the selected project.');
    //         }
    //     }
    // };

    
  const handleExport = async () => {
    if (!month) {
      toast.error('Please select a Month.');
      return;
    }
    if (!payStructure) {
      toast.error('Please select a Pay Structure.');
      return;
    }
    if (selectedBusinessUnit.length === 0) {
      toast.error('Please select at least one Business Unit.');
      return;
    }

    // Map selected business unit names to their corresponding project IDs.
    // (Assuming each business unit object has BusinessUnit and ProjectID fields.)
    const selectedProjectIds = selectedBusinessUnit
      .map((bu) => {
        const project = businessUnits.find((unit) => unit.BusinessUnit === bu);
        return project ? project.ProjectID : null;
      })
      .filter(Boolean); // Remove any null values

    console.log("Exporting for project IDs:", selectedProjectIds);

    try {
      const response = await axios.get(`${API_BASE_URL}/insentive/exportWagesExcel`, {
        // Send projectName as a comma-separated list of project IDs.
        params: { projectName: selectedProjectIds.join(','), month, payStructure },
        responseType: 'blob',
      });
console.log('response for export',response.data)
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Build file name using the project IDs and month.
      const fileName = selectedProjectIds.length === 0 || selectedProjectIds.includes("all")
        ? `Approved_Labours_${month}.xlsx`
        : `Wages_${selectedProjectIds.join('_')}_${month}.xlsx`;

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
                        {/* Multi-select Business Unit Dropdown */}
                        <Box>
                            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 0.5 }}>
                                Select Business Unit(s)
                            </Typography>
                            <Select
                                multiple
                                value={selectedBusinessUnit}
                                onChange={handleBusinessUnitsChange}
                                fullWidth
                                variant="outlined"
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return "Select Business Unit(s)";
                                    }
                                    return selected.join(', ');
                                }}
                                sx={{
                                    borderRadius: '8px',
                                    paddingTop: '4px',
                                    paddingBottom: '2px',
                                }}
                            >
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
                        <Box>
                            <Typography variant="body2">Select Pay Structure</Typography>
                            <Select
                                value={payStructure}
                                onChange={(e) => setPayStructure(e.target.value)}
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Pay Structure</MenuItem>
                                <MenuItem value="Daily Wages">Daily Wages</MenuItem>
                                <MenuItem value="Fix Monthly Wages">Fixed Monthly Wages</MenuItem>
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