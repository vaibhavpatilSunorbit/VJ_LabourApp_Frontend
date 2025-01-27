
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
    MenuItem, Modal, Typography, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchWages';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext';
import ExportWagesReport from './ImportExportWages/ExportWages'
import ImportWagesReport from './ImportExportWages/ImportWages'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";

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
    const [fixedMonthlyWages, setFixedMonthlyWages] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [effectiveDate, setEffectiveDate] = useState("");

    const convertToIndianTime = (isoString) => {
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        return formatter.format(new Date(isoString));
    };

    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/getWagesAndLabourOnboardingJoin`);
            setLabours(response.data);
        } catch (error) {
            console.error('Error fetching labours:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
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
        const formData = paginatedLabours.map(labour => ({
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
    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
    };
    // const displayLabours = searchResults.length > 0 ? searchResults : labours;

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

    // const handleSave = async () => {
    //     try {
    //         const onboardName = user.name || null;
    //         const wageData = {
    //             labourId: selectedLabour.LabourID,
    //             payStructure,
    // effectiveDate,
    //             dailyWages,
    //             monthlyWages,
    //             yearlyWages,
    //             overtime,
    //             totalOvertimeWages,
    //             fixedMonthlyWages: payStructure === 'Fixed Monthly Wages' ? fixedMonthlyWages : null,
    //             weeklyOff: payStructure === 'Fixed Monthly Wages' ? weeklyOff : null,
    //             wagesEditedBy: onboardName, // Replace with logged-in user
    //         };
    //         await axios.post(`${API_BASE_URL}/labours/upsertLabourMonthlyWages`, wageData);
    //         toast.success('Wages updated successfully');
    //         fetchLabours();
    //         setModalOpen(false);
    //         setWeeklyOff(""); // Reset weeklyOff to initial state
    // setEffectiveDate("");
    //         setFixedMonthlyWages(0)
    //         setMonthlyWages(0);
    //         setDailyWages(0);
    //     } catch (error) {
    //         console.error('Error saving wages:', error);
    //         toast.error('Failed to save wages');
    //     }
    // };


    // Handle modal edit

    const handleSave = async () => {
        try {
            const onboardName = user.name || null;
            if (!payStructure || !effectiveDate) {
                toast.error("Please fill in all required fields.");
                return;
            }
            const wageData = {
                labourId: selectedLabour.LabourID,
                payStructure,
                effectiveDate,
                dailyWages,
                monthlyWages,
                yearlyWages,
                overtime,
                totalOvertimeWages,
                fixedMonthlyWages: payStructure === 'Fixed Monthly Wages' ? fixedMonthlyWages : null,
                weeklyOff: payStructure === 'Fixed Monthly Wages' ? weeklyOff : null,
                wagesEditedBy: onboardName,
            };

            const { data: existingWagesResponse } = await axios.get(`${API_BASE_URL}/labours/checkExistingWages`, {
                params: { labourId: selectedLabour.LabourID },
            });

            const { exists, approved, data } = existingWagesResponse;

            if (!exists) {
                await axios.post(`${API_BASE_URL}/labours/upsertLabourMonthlyWages`, wageData);
                toast.success("Wages added successfully.");
            } else if (exists && !approved) {
                wageData.wageId = data.WageID;
                console.log('wageData.wageId .. ', wageData.wageId)
                console.log('wageData.wageId .. ', wageData)
                await axios.post(`${API_BASE_URL}/labours/sendWagesForApproval`, wageData);
                toast.info("Wages sent for admin approval.");
            } else if (exists && approved) {
                wageData.wageId = data.WageID;
                await axios.post(`${API_BASE_URL}/labours/sendWagesForApproval`, wageData);
                toast.info("Wages changes sent for admin approval.");
            }

            fetchLabours();
            setModalOpen(false);
            setWeeklyOff("");
            setEffectiveDate("");
            setFixedMonthlyWages(0);
            setMonthlyWages(0);
            setDailyWages(0);
        } catch (error) {
            console.error("Error saving wages:", error);
            toast.error("Failed to save wages.");
        }
    };



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

    const handleToast = (type, message) => {
        if (type === 'success') {
            toast.success(message);
        } else if (type === 'error') {
            toast.error(message);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            fetchLabours();
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/searchLaboursFromWages?q=${searchQuery}`);
            setLabours(response.data);
        } catch (error) {
            console.error('Error searching:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (e, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = parseInt(e.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to the first page
    };
    const handleSelectLabour = (selectedLabour) => {
        setSelectedLabour(selectedLabour);
    };

    // Data to display on the current page
    // const paginatedLabours = labours.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Filter data to only include the latest entry per LabourID
    const getLatestLabourData = (labours) => {
        const latestEntries = {};
        labours.forEach((labour) => {
            if (
                !latestEntries[labour.LabourID] ||
                new Date(labour.CreatedAt) > new Date(latestEntries[labour.LabourID].CreatedAt)
            ) {
                latestEntries[labour.LabourID] = labour;
            }
        });
        return Object.values(latestEntries);
    };

    const handleViewHistory = (labourID) => {
        const history = labours.filter((labour) => labour.LabourID === labourID);
        setSelectedHistory(history);
        setOpenModal(true);
    };

    const filteredLabours = getLatestLabourData(labours);
    const paginatedLabours = filteredLabours.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <ToastContainer />
            <Box ml={-1.5}>
                <SearchBar
                    handleSubmit={handleSubmit}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    // handleSearch={() => {}}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    handleSelectLabour={handleSelectLabour}
                    showResults={false}
                    className="search-bar"
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
                <ExportWagesReport />
                <ImportWagesReport handleToast={handleToast} onboardName={user.name || null} />

                {/* <Box display="flex" alignItems="flex-end" gap={2}>
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
                </Box> */}

                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
                    count={labours.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Box>

            <TableContainer component={Paper} sx={{
                mb: isMobile ? 6 : 0,
                overflowX: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                maxHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(75vh - 64px)',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '4px',
                },
            }}>
                <Box sx={{ width: '100%' }}>
                    <Table stickyHeader sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    '& th': {
                                        padding: '12px',
                                        '@media (max-width: 600px)': {
                                            padding: '10px',
                                        },
                                        backgroundColor: 'white', // Ensure the background color is set
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                    },
                                    '& td': {
                                        padding: '16px 9px', // Applying padding to all td elements
                                        '@media (max-width: 600px)': {
                                            padding: '14px 8px', // Adjust padding for smaller screens if needed
                                        },
                                    },
                                }}
                            >
                                <TableCell>Sr No</TableCell>
                                <TableCell>Labour ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Business Unit</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>Pay Structure</TableCell>
                                <TableCell>Daily Wages</TableCell>
                                <TableCell>Fixed Monthly Wages</TableCell>
                                <TableCell>Weekly Off</TableCell>
                                <TableCell>Wages Edited By</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Wages History</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedLabours.map((labour, index) => (
                                <TableRow key={labour.LabourID}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{labour.LabourID}</TableCell>
                                    <TableCell>{labour.name || '-'}</TableCell>
                                    <TableCell>{labour.businessUnit || '-'}</TableCell>
                                    <TableCell>{labour.departmentName || '-'}</TableCell>
                                    <TableCell>{labour.From_Date ? new Date(labour.From_Date).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>{labour.PayStructure || '-'}</TableCell>
                                    <TableCell>{labour.DailyWages || '-'}</TableCell>
                                    <TableCell>{labour.FixedMonthlyWages || '-'}</TableCell>
                                    <TableCell>{labour.WeeklyOff || '-'}</TableCell>
                                    <TableCell>{labour.WagesEditedBy || '-'}</TableCell>
                                    <TableCell>{labour.CreatedAt ? new Date(labour.CreatedAt).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color='rgb(239,230,247)'
                                            onClick={() => handleViewHistory(labour.LabourID)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
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
                </Box>
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

                    {/* Effective Date Picker */}
                    <TextField
                        label="Effective Date"
                        type="date"
                        fullWidth
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2 }}
                        required
                    />

                    {/* Dynamic Fields */}
                    {payStructure === 'Daily Wages' && (
                        <>
                            {/* Daily Wages Input */}
                            <TextField
                                label="Daily Wages"
                                type="number"
                                fullWidth
                                value={dailyWages || ""} // Display an empty string if the value is 0 or null
                                onChange={(e) => {
                                    const value = e.target.value === "" ? null : parseFloat(e.target.value); // Set null for empty input, otherwise parse the number
                                    setDailyWages(value);
                                    if (value !== null) {
                                        setMonthlyWages(value * 30); // Assuming 30 days in a month
                                        setYearlyWages(value * 30 * 12); // Assuming 12 months in a year
                                    } else {
                                        setMonthlyWages(null); // Reset Monthly Wages if Daily Wages is null
                                        setYearlyWages(null); // Reset Yearly Wages if Daily Wages is null
                                    }
                                }}
                                sx={{ mb: 2 }}
                            />

                            {/* Read-Only Fields */}
                            <TextField
                                label="Per Hours Wages"
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

                            {/* Fixed Monthly Wages TextField */}
                            <TextField
                                label="Fixed Monthly Wages"
                                type="number"
                                fullWidth
                                value={fixedMonthlyWages || ""} // Display an empty string if the value is 0 or null
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFixedMonthlyWages(value === "" ? null : parseFloat(value)); // Set null for empty input, otherwise parse the number
                                }}
                                sx={{ mb: 2 }}
                            />
                            {/* Total Wages */}
                            {/* <TextField
                                label="Total Wages (Without Overtime)"
                                type="number"
                                fullWidth
                                value={monthlyWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            /> */}
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
                        }} onClick={handleSave} disabled={!payStructure || !effectiveDate}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>


            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: {
                            xs: "90%", // Mobile screens
                            sm: "80%", // Tablet screens
                            md: "70%", // Laptop screens
                            lg: "60%", // Large screens
                        },
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: { xs: 2, sm: 3, md: 4 }, // Adjust padding for different devices
                        maxHeight: "85vh",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f1f1f1",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#888",
                            borderRadius: "4px",
                        },
                    }}
                >
                    {/* Close Icon */}
                    <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "gray",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Modal Header */}
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            textAlign: "center",
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}
                    >
                        Wages History Labour ID: {selectedHistory[0]?.LabourID || "N/A"}
                    </Typography>

                    {/* Modal Content */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            position: "relative",
                            alignItems: "center",
                        }}
                    >
                        {selectedHistory.map((record, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 4,
                                    position: "relative",
                                    width: { xs: "100%", md: "70%" }, // Adjust width for responsiveness
                                }}
                            >
                                {/* Vertical Line */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: { xs: "27%", md: "27.5%" }, // Adjust line position
                                        top: 0,
                                        bottom: index !== selectedHistory.length - 0 ? 0 : "auto",
                                        width: 4,
                                        bgcolor: "green",
                                        zIndex: -1,
                                    }}
                                />

                                {/* Dot for Edited On */}
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        bgcolor: "darkgreen",
                                        borderRadius: "50%",
                                        position: "absolute",
                                        left: { xs: "calc(28% - 9px)", md: "calc(28% - 9px)" }, // Adjust dot position
                                    }}
                                ></Box>

                                {/* Left Side - Edited On */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        textAlign: "right",
                                        pr: 2,
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Adjust font size
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        Edited On:
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(record.CreatedAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(record.CreatedAt).toLocaleTimeString()}
                                    </Typography>
                                </Box>

                                {/* Right Side - Details */}
                                <Box
                                    sx={{
                                        flex: 3,
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Adjust font size
                                    }}
                                >
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Name:</strong> {record.name || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" >
                                        <strong>Edited By:</strong> {record.WagesEditedBy || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>From Date:</strong>{" "}
                                        {record.From_Date
                                            ? new Date(record.From_Date).toLocaleDateString()
                                            : "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Pay Structure:</strong> {record.PayStructure || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Daily Wages:</strong> ₹{record.DailyWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Per Hour Wages:</strong> ₹{record.PerHourWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Monthly Wages:</strong> ₹{record.MonthlyWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Yearly Wages:</strong> ₹{record.YearlyWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Weekly Off:</strong> {record.WeeklyOff || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Fixed Monthly Wages:</strong> ₹
                                        {record.FixedMonthlyWages || "0"}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Modal>

        </Box>
    );
};

export default AttendanceReport;