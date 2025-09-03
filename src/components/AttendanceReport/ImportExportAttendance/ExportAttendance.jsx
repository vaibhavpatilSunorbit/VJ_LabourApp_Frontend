import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Button, Box, TextField, Select, MenuItem, Typography, Modal, Grid, Chip
} from '@mui/material';
import { API_BASE_URL } from "../../../Data";
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const ExportAttendance = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Memoized lists for select-all logic
    const allBusinessUnits = useMemo(() => businessUnits.map(unit => unit.BusinessUnit), [businessUnits]);
    const allDepartmentIds = useMemo(() => departments.map(dept => dept.Id), [departments]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/departments`)
            .then(res => setDepartments(res.data))
            .catch(() => toast.error('Error fetching departments.'));
        axios.get(`${API_BASE_URL}/api/projectDeviceStatus`)
            .then(res => setBusinessUnits(res.data))
            .catch(() => toast.error('Error fetching business units.'));
    }, []);

    // Unified export handler
    const handleExport = async (type = "excel") => {
        if (!selectedBusinessUnit.length || !startDate || !endDate) {
            toast.error('Please select a Business Unit, Start Date, and End Date.');
            return;
        }
        const selectedProjectIds = selectedBusinessUnit
            .map(bu => {
                const project = businessUnits.find(unit => unit.BusinessUnit === bu);
                return project?.ProjectID;
            })
            .filter(Boolean);

        const url = type === "excel"
            ? `${API_BASE_URL}/api/labours/export`
            : `${API_BASE_URL}/api/labours/exportAttendanceExcel`;
        const fileType = type === "excel"
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf';
        const fileExt = type === "excel" ? 'xlsx' : 'pdf';

        try {
            const response = await axios.get(url, {
                params: {
                    projectName: selectedProjectIds.join(','),
                    department: selectedDepartments.join(','),
                    startDate,
                    endDate,
                    maxAbsentDays: 30
                },
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: fileType });
            const fileName = `Attendance_${startDate}_${endDate}.${fileExt}`;
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success(`Attendance ${type === "excel" ? "Excel" : "PDF"} exported successfully!`);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error exporting data. Please try again later.');
        }
    };

    // Select handlers
    const handleBusinessUnitChange = (e) => {
        const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
        if (value.includes("All")) {
            setSelectedBusinessUnit(selectedBusinessUnit.length === allBusinessUnits.length ? [] : allBusinessUnits);
        } else {
            setSelectedBusinessUnit(value);
        }
    };

    const handleDepartmentChange = (e) => {
        const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
        if (value.includes("All")) {
            setSelectedDepartments(selectedDepartments.length === allDepartmentIds.length ? [] : allDepartmentIds);
        } else {
            setSelectedDepartments(value);
        }
    };

    // Chip rendering helper
    const renderChips = (selected, allItems, labelKey = null) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: '100px', overflowY: 'auto' }}>
            {selected.map((val) => {
                const label = labelKey
                    ? (allItems.find(item => item[labelKey] === val)?.Description || val)
                    : val;
                return (
                    <Chip
                        key={val}
                        label={label}
                        onMouseDown={e => e.stopPropagation()}
                        onDelete={() => {
                            if (labelKey) {
                                setSelectedDepartments(selected.filter(item => item !== val));
                            } else {
                                setSelectedBusinessUnit(selected.filter(item => item !== val));
                            }
                        }}
                    />
                );
            })}
        </Box>
    );

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                sx={{
                    background: 'none',
                    color: 'rgb(43, 217, 144)',
                    fontSize: '14px',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    '&:hover': { background: 'none', textDecoration: 'underline' },
                    p: 0,
                }}
            >
                <FileDownloadOutlinedIcon />
                <Typography variant="body2">Export</Typography>
            </Button>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="export-attendance-title"
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
                        sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                        Export Attendance Data
                    </Typography>

                    <Box component="form" display="flex" flexDirection="column" gap={2}>
                        {/* Business Unit Select */}
                        <Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                Select Business Unit
                            </Typography>
                            <Select
                                multiple
                                value={selectedBusinessUnit}
                                onChange={handleBusinessUnitChange}
                                fullWidth
                                variant="outlined"
                                displayEmpty
                                renderValue={selected =>
                                    selected.length === 0
                                        ? "Select Business Unit(s)"
                                        : renderChips(selected, businessUnits)
                                }
                                sx={{ pt: '4px', pb: '2px' }}
                            >
                                <MenuItem value="All"><em>Select All</em></MenuItem>
                                {businessUnits.map(unit => (
                                    <MenuItem key={unit.BusinessUnit} value={unit.BusinessUnit}>
                                        {unit.BusinessUnit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        {/* Department Select */}
                        <Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                Select Department(s)
                            </Typography>
                            <Select
                                multiple
                                fullWidth
                                variant="outlined"
                                value={selectedDepartments}
                                onChange={handleDepartmentChange}
                                renderValue={selected =>
                                    selected.length === 0
                                        ? "Select Department(s)"
                                        : renderChips(selected, departments, "Id")
                                }
                                sx={{ pt: '4px', pb: '2px' }}
                            >
                                <MenuItem value="All"><em>Select All</em></MenuItem>
                                {departments.map(dept => (
                                    <MenuItem key={dept.Id} value={dept.Id}>
                                        {dept.Description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        {/* Date Pickers */}
                        <Box>
                            <Typography variant="body2" color="textSecondary">
                                Start Date
                            </Typography>
                            <TextField
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{ '& .MuiInputBase-input': { pb: '12px' } }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="textSecondary">
                                End Date
                            </Typography>
                            <TextField
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{ '& .MuiInputBase-input': { pb: '12px' } }}
                            />
                        </Box>

                        {/* Action Buttons */}
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    onClick={() => setOpen(false)}
                                    variant="outlined"
                                    sx={{
                                        color: '#6c757d',
                                        borderColor: '#6c757d',
                                        '&:hover': { backgroundColor: '#f8f9fa', borderColor: '#6c757d' },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => handleExport("excel")}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#115293' },
                                        mr: 1
                                    }}
                                >
                                    Export Excel
                                </Button>
                                <Button
                                    onClick={() => handleExport("pdf")}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#388e3c' },
                                    }}
                                >
                                    Export PDF
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};


export default ExportAttendance;