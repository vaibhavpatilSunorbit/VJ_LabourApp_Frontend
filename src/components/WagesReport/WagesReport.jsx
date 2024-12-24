
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    TextField,
    TablePagination,
    Select,
    MenuItem, Modal
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchBar';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext';

const AttendanceReport = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [labours, setLabours] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dailyWages, setDailyWages] = useState({});
    const [perDayWages, setPerDayWages] = useState({});
    const [monthlyWages, setMonthlyWages] = useState({});
    const [yearlyWages, setYearlyWages] = useState({});
    const [overtime, setOvertime] = useState({});
    const [totalOvertimeWages, setTotalOvertimeWages] = useState({});
    const [payStructure, setPayStructure] = useState({});
    const [weakelyOff, setWeakelyOff] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [weeklyOff, setWeeklyOff] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useUser();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        try {
            const response = await axios.get(`/api/labours/search?q=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours`);
            setLabours(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching labours:', error);
        }
    };

    useEffect(() => {
        fetchLabours();
    }, []);

    const handleWageChange = (labourId, value) => {
        const daysInMonth = getDaysInMonth(); // Check number of days in the current month
        const hoursPerShift = 8; // Assuming 8 hours per shift

        // Set daily wage
        setDailyWages(prev => ({ ...prev, [labourId]: value }));
        setPerDayWages(prev => ({ ...prev, [labourId]: value / hoursPerShift }));

        // Calculate monthly and yearly wages based on days in the current month
        const monthly = value * daysInMonth;
        const yearly = monthly * 12;

        setMonthlyWages(prev => ({ ...prev, [labourId]: monthly }));
        setYearlyWages(prev => ({ ...prev, [labourId]: yearly }));
    };

    const handleOvertimeChange = (labourId, value) => {
        const overtimeRate = perDayWages[labourId] || 0; // Calculate hourly overtime rate
        const overtimeWages = overtimeRate * value; // Total overtime pay

        setOvertime(prev => ({ ...prev, [labourId]: value }));
        setTotalOvertimeWages(prev => ({ ...prev, [labourId]: overtimeWages }));
    };

    const handlePayStructureChange = (labourId, structure) => {
        setPayStructure(prev => ({ ...prev, [labourId]: structure }));
    };

    const handleWeakelyOffChange = (labourId, value) => {
        setWeakelyOff(prev => ({ ...prev, [labourId]: value }));
    };

    const handleSubmit = async () => {
        const formData = displayLabours.map(labour => ({
            labourId: labour.LabourID,
            payStructure: payStructure[labour.LabourID],
            dailyWages: dailyWages[labour.LabourID],
            perDayWages: perDayWages[labour.LabourID],
            monthlyWages: monthlyWages[labour.LabourID],
            yearlyWages: yearlyWages[labour.LabourID],
            overtime: overtime[labour.LabourID],
            totalOvertimeWages: totalOvertimeWages[labour.LabourID],
            weakelyOff: weakelyOff[labour.LabourID],
        }));

        try {
            await axios.post(`${API_BASE_URL}/labours/submitWages`, formData);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data.");
        }
    };

    // Utility function to get the number of days in the current month
    const getDaysInMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    };
    // const handleEdit = (labour) => {
    //     setSelectedLabour(labour);
    //     setModalOpen(true);
    //     // Reset fields for the selected labour
    //     setPayStructure('');
    //     setDailyWages('');
    //     setOvertime('');
    //     setWeeklyOff('');
    //   };



    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
    };

    const displayLabours = searchResults.length > 0 ? searchResults : labours;

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

    // const fetchBusinessUnits = async () => {
    //     try {
    //         const response = await fetch(`https://api.vjerp.com/api/businessUnit`, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer 20a763e266308b35fc75feca4b053d5ce8ea540dbdaa77ee13b1a5e7ce8aadcf`,
    //             },
    // mode: 'no-cors',

    //         });
    
    //         console.log('Response:', response); // Log response to debug
    
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
    //         }
    
    //         const data = await response.json();
    //         console.log('Business Units fetched:', data);
    //         setBusinessUnits(data);
    //     } catch (error) {
    //         console.error('Error fetching business units:', error);
    //         toast.error('Error fetching business units.');
    //     }
    // };
    // useEffect(() => {
    //     fetchBusinessUnits();
    // }, []);


    
    
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
        if (!startDate || !endDate) {
            toast.error('Please select a Business Unit, Start Date, and End Date.');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/exportWagesExcel`, {
                params: { startDate, endDate },
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

    const handleSave = async () => {
        try {
            const onboardName = user.name || null;
            const wageData = {
                labourId: selectedLabour.LabourID,
                payStructure,
                dailyWages,
                monthlyWages,
                yearlyWages,
                overtime,
                totalOvertimeWages,
                weeklyOff: payStructure === 'Fixed Monthly Wages' ? weeklyOff : null,
                wagesEditedBy: onboardName, // Replace with logged-in user
            };
            await axios.post(`${API_BASE_URL}/labours/upsertLabourMonthlyWages`, wageData);
            toast.success('Wages updated successfully');
            fetchLabours();
            setModalOpen(false);
            setWeeklyOff(""); // Reset weeklyOff to initial state
        setMonthlyWages(0); 
        } catch (error) {
            console.error('Error saving wages:', error);
            toast.error('Failed to save wages');
        }
    };


    // Handle modal edit
    const handleEdit = (labour) => {
        setSelectedLabour(labour);
        setPayStructure('');
        setDailyWages(0);
        setMonthlyWages(0);
        setYearlyWages(0);
        setOvertime(0);
        setTotalOvertimeWages(0);
        setModalOpen(true);
    };

    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <ToastContainer />
            <Box ml={-1.5}>
                <SearchBar
                    handleSubmit={handleSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </Box>
            {loading && <Loading />}

            <Box
                sx={{
                    width: "auto",
                    height: "auto",
                    bgcolor: "white",
                    marginBottom: "15px",
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 3,
                    alignSelf: "flex-start",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >

                <Box display="flex" alignItems="flex-end" gap={2}>
                <Select
            value={selectedBusinessUnit}
            onChange={handleBusinessUnitChange}
            displayEmpty
            sx={{ width: '200px' }}
        >
            <MenuItem value="" disabled>
                Select Business Unit
            </MenuItem>
            {businessUnits.length > 0 ? (
                businessUnits.map((unit) => (
                    <MenuItem key={unit.BusinessUnit} value={unit.BusinessUnit}>
                        {unit.BusinessUnit}
                    </MenuItem>
                ))
            ) : (
                <MenuItem value="" disabled>
                    No Business Units Available
                </MenuItem>
            )}
        </Select>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            padding: '4px 4px 1px 4px',
                            '& .MuiInputBase-input': {
                                padding: '8px 8px',
                            },
                        }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            padding: '4px 4px 1px 4px',
                            '& .MuiInputBase-input': {
                                padding: '8px 8px',
                            },
                        }}
                    />
                    <Button variant="contained" onClick={handleExport} sx={{
                        fontSize: { xs: '10px', sm: '13px', md: '15px' },
                        height: { xs: '40px', sm: '38px', md: '38px', lg: '38px' },
                        width: { xs: '100%', sm: 'auto' },
                        backgroundColor: 'rgb(229, 255, 225)',
                        color: 'rgb(43, 217, 144)',
                        '&:hover': {
                            backgroundColor: 'rgb(229, 255, 225)',
                        },
                    }}>
                        Export
                    </Button>
                </Box>

                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
                    count={displayLabours.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                />
            </Box>

            <TableContainer component={Paper} sx={{ mb: isMobile ? 6 : 0, overflowX: 'auto', overflowY: 'auto', borderRadius: 2, boxShadow: 3 }}>
                <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Labour ID</TableCell>
                            <TableCell>Name of Labour</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(displayLabours.length > 0
                            ? displayLabours
                                .filter(labour => labour.status === 'Approved')
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : []
                        ).map((labour, index) => (
                            <TableRow key={labour.LabourID}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{labour.LabourID}</TableCell>
                                <TableCell>{labour.name}</TableCell>
                                <TableCell>{labour.location}</TableCell>
                                <TableCell>{labour.departmentName}</TableCell>
                                <TableCell>{labour.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'rgb(239,230,247)',
                                            color: 'rgb(130,54,188)',
                                            '&:hover': {
                                                backgroundColor: 'rgb(239,230,247)',
                                            },
                                        }}
                                        onClick={() => handleEdit(labour)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCancel}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 id="modal-title">Edit Pay Structure</h2>

                    {/* Pay Structure Dropdown */}
                    <Select
                        fullWidth
                        value={payStructure}
                        onChange={(e) => setPayStructure(e.target.value)}
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select Pay Structure
                        </MenuItem>
                        <MenuItem value="Daily Wages">Daily Wages</MenuItem>
                        <MenuItem value="Fixed Monthly Wages">Fixed Monthly Wages</MenuItem>
                    </Select>

                    {/* Dynamic Fields */}
                    {payStructure === 'Daily Wages' && (
                        <>
                             {/* Daily Wages Input */}
                            <TextField
                                label="Daily Wages"
                                type="number"
                                fullWidth
                                value={dailyWages}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    setDailyWages(value);
                                    setMonthlyWages(value * 30); // Assuming 30 days in a month
                                    setYearlyWages(value * 30 * 12); // Assuming 12 months in a year
                                }}
                                sx={{ mb: 2 }}
                            />

                            {/* Read-Only Fields */}
                            <TextField
                                label="Per Day Wages"
                                type="number"
                                fullWidth
                                value={dailyWages / 8 || 0} // Assuming 8 hours in a workday
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Monthly Wages"
                                type="number"
                                fullWidth
                                value={monthlyWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Yearly Wages"
                                type="number"
                                fullWidth
                                value={yearlyWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />

                            {/* Overtime (Hours) Input */}
                            {/* <TextField
                                label="Overtime (Hours)"
                                type="number"
                                fullWidth
                                value={overtime}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setOvertime(value);
                                    setTotalOvertimeWages(value * (dailyWages / 8)); // Assuming 8 hours in a workday
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Overtime Pay"
                                type="number"
                                fullWidth
                                value={totalOvertimeWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Total Wages (Including Overtime)"
                                type="number"
                                fullWidth
                                value={+monthlyWages + +totalOvertimeWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            /> */}
                        </>
                    )}

                    {payStructure === 'Fixed Monthly Wages' && (
                        <>
                            {/* Weekly Off Dropdown */}
                            <Select
                                label="Weekly Off"
                                fullWidth
                                value={weeklyOff || ""}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === "") {
                                        // Reset related state if needed
                                        setWeeklyOff("");
                                        setMonthlyWages(0); // Reset monthly wages or other dependent fields if required
                                    } else {
                                        setWeeklyOff(selectedValue);
                                    }
                                }}
                                displayEmpty
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="" disabled>
                                    Select Weekly Off
                                </MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                            </Select>

                            {/* Total Wages */}
                            <TextField
                                label="Total Wages (Without Overtime)"
                                type="number"
                                fullWidth
                                value={monthlyWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}

                    {/* Save and Cancel Buttons */}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" sx={{
                            backgroundColor: "#fce4ec",
                            color: "rgb(255, 100, 100)",
                            width: "100px",
                            "&:hover": {
                                backgroundColor: "#f8bbd0",
                            },
                        }} onClick={handleCancel}>
                            Close
                        </Button>
                        <Button variant="contained" sx={{
                            backgroundColor: "rgb(229, 255, 225)",
                            color: "rgb(43, 217, 144)",
                            width: "100px",
                            "&:hover": {
                                backgroundColor: "rgb(229, 255, 225)",
                            },
                        }} onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AttendanceReport;