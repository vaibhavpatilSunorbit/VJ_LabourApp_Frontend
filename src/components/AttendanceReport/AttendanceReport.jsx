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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Typography,
    InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchBar';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import "./attendanceReport.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
// toast.configure();

const AttendanceReport = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [searchResults, setSearchResults] = useState([]);
    const [totalDays, setTotalDays] = useState(0);
    const [presentDays, setPresentDays] = useState(0);
    const [totalOvertime, setTotalOvertime] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [selectedLabourId, setSelectedLabourId] = useState('');
    const [editManualDialogOpen, setEditManualDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [manualEditData, setManualEditData] = useState({
        punchIn: "",
        punchOut: "",
        overtime: "",
        remark: "",
    });
    const [error, setError] = useState(null);
    const [filteredIconLabours, setFilteredIconLabours] = useState([]);
    const [isLoading, setIsLoading] = useState(false);




 const handleManualEditDialogOpen = (day) => {
        setSelectedDay(day);
        setManualEditData({
            punchIn: day.firstPunch || "",
            punchOut: day.lastPunch || "",
            overtime: day.overtime || "",
            remark: day.remark || "",
        });
        setEditManualDialogOpen(true);
    };

    const handleManualEditDialogClose = () => {
        setEditManualDialogOpen(false);
    };

    const handleSaveManualEdit = () => {
        // Update the selected day's attendance data
        const updatedAttendanceData = attendanceData.map((day) =>
            day.date === selectedDay.date
                ? {
                      ...day,
                      firstPunch: manualEditData.punchIn,
                      lastPunch: manualEditData.punchOut,
                      overtime: manualEditData.overtime,
                      remark: manualEditData.remark,
                  }
                : day
        );
        setAttendanceData(updatedAttendanceData);
        handleManualEditDialogClose();
    };


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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
          setSearchResults([]);
          return;
        }
        try {
          const response = await axios.get(`${API_BASE_URL}/labours/search?q=${searchQuery}`);
          setSearchResults(response.data);
        } catch (error) {
          setError('Error searching. Please try again.');
        }
      };

    // Fetch labours and sort by LabourID
    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours`);
            const sortedLabours = response.data.sort((a, b) => a.LabourID - b.LabourID); // Sorting by LabourID DESC
            setLabours(sortedLabours);
            setLoading(false);
        } catch (error) {
            setError('Error fetching labours. Please try again.');
            setLoading(false);
            console.error('Error fetching labours:', error);
        }
    };

    useEffect(() => {
        fetchLabours();
        fetchAttendanceForMonthAll();
    }, []);

    const handleModalOpen = (labour) => {
        if (labour && labour.LabourID) {
            setSelectedLabour(labour);
            setSelectedLabourId(labour.LabourID);
            // fetchAttendanceData(labour.LabourID, startDate, endDate);
            setModalOpen(true);
        } else {
            console.error('LabourID is null or undefined for the selected labour.');
        }
    };

    const fetchAttendanceForMonth = async () => {
        if (!selectedLabourId || !selectedMonth) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/attendance/${selectedLabourId}`, {
                params: { month: selectedMonth, year: selectedYear }
            });
            
            const { monthlyAttendance, totalDays, presentDays, totalOvertimeHours } = response.data;
    
            // Add isHoliday and isWeeklyOff properties to each attendance day
            const updatedAttendance = monthlyAttendance.map(day => ({
                ...day,
                isHoliday: day.status === 'H',
            }));
    
            setAttendanceData(updatedAttendance);
            setTotalDays(totalDays);
            setPresentDays(presentDays);
            setTotalOvertime(totalOvertimeHours);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
    
            // Check for response message and show toast
            if (error.response || error.response.data || error.response.data.message) {
                console.log('error.response.data.message',error.response.data.message)
                toast.error(error.response.data.message); // Show the exact message from the API
            } else {
                toast.error('Error fetching attendance data. Please try again later.');
            }
        }
        setLoading(false);
    };
    
    useEffect(() => {
        if (selectedLabourId && selectedMonth) {
            fetchAttendanceForMonth();
        }
    }, [selectedLabourId, selectedMonth]);


    const fetchCachedAttendance = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/cachedattendance`);
            const attendanceList = response.data;

            const processedAttendance = attendanceList.map(att => ({
                ...att,
                firstPunch: att.firstPunch ? new Date(att.firstPunch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                lastPunch: att.lastPunch ? new Date(att.lastPunch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                totalOvertimeHours: att.totalOvertimeHours ? parseFloat(att.totalOvertimeHours.toFixed(1)) : '-'
            }));

            setAttendanceData(processedAttendance);
        } catch (error) {
            console.error('Error fetching cached attendance data:', error);
            toast.error('Failed to fetch cached attendance data. Please try again later.');
        }
        setLoading(false);
    };



    const fetchAttendanceForMonthAll = async () => {
        if (!selectedMonth || !selectedYear) {
            toast.warning('Please select a valid month and year.');
            return;
        }
        setLoading(true);
        try {
            // Fetch data for all labours from the API
            const response = await axios.get(`${API_BASE_URL}/labours/attendance`, {
                params: { month: selectedMonth, year: selectedYear }
            });
    
            const attendanceList = response.data;
    
            // Process the attendance data for all labours
            const processedAttendance = attendanceList.map(labour => ({
                labourId: labour.labourId,
                totalDays: labour.totalDays,
                presentDays: labour.presentDays,
                halfDays: labour.halfDays,
                absentDays: labour.absentDays,
                holidayDays: labour.holidayDays,
                shift: labour.shift,
                totalOvertimeHours: labour.totalOvertimeHours,
                // Add isHoliday or any other properties to each day in monthlyAttendance
                monthlyAttendance: labour.monthlyAttendance.map(day => ({
                    ...day,
                    isHoliday: day.status === 'H',
                    isWeeklyOff: day.status === 'WO', // Example: Add a weekly off status if needed
                }))
            }));
    
            setAttendanceData(processedAttendance);
    
            // Calculate summary metrics
            const totalDaysSum = processedAttendance.reduce((acc, labour) => acc + labour.totalDays, 0);
            const presentDaysSum = processedAttendance.reduce((acc, labour) => acc + labour.presentDays, 0);
            const totalOvertimeSum = processedAttendance.reduce(
                (acc, labour) => acc + (typeof labour.totalOvertimeHours === 'number' ? labour.totalOvertimeHours : 0),
                0
            );
    
            setTotalDays(totalDaysSum);
            setPresentDays(presentDaysSum);
            setTotalOvertime(totalOvertimeSum);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
    
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error fetching attendance data. Please try again later.');
            }
        }
        setLoading(false);
    };
    

    useEffect(() => {
        if (selectedMonth) {
            fetchAttendanceForMonthAll();
        }
    }, [selectedMonth, selectedYear]);



    // Function to display attendance for each day of the selected month
    const renderAttendanceForMonth = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get days in the selected month
        const result = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDay = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Check if there's attendance data for the current day
            const attendanceForDay = attendanceData.find(a => a.punch_date === formattedDay);

            if (selectedLabour && selectedLabour.workingHours) {
                const shiftHours = selectedLabour.workingHours.includes('9') ? 9 : 8;

                if (attendanceForDay) {
                    const totalHours = calculateTotalHours(attendanceForDay);
                    const overtime = totalHours > shiftHours ? totalHours - shiftHours : 0;

                    result.push({
                        date: formattedDay,
                        status: 'P',
                        firstPunch: attendanceForDay.punch_in || '-',
                        lastPunch: attendanceForDay.punch_out || '-',
                        totalHours,
                        overtime,
                        shift: selectedLabour.workingHours
                    });
                } else {
                    result.push({
                        date: formattedDay,
                        status: 'A', // Absent if no attendance data for the day
                        firstPunch: '-',
                        lastPunch: '-',
                        totalHours: '-',
                        overtime: '-',
                        shift: selectedLabour.workingHours
                    });
                }
            }
        }

        return result; // Return the calculated attendance data
    };

    // Fetch and set attendance data for the selected month and labor
    // const fetchAttendanceForMonth = async () => {
    //     if (!selectedLabourId || !selectedMonth) return;
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/labours/attendance/${selectedLabourId}`, {
    //             params: { month: selectedMonth, year: selectedYear }
    //         });
    //         const { monthlyAttendance, totalDays, presentDays, totalOvertimeHours } = response.data;

    //         // Update the attendanceData state with the processed data
    //         const attendanceForMonth = renderAttendanceForMonth(); // Call the function here
    //         setAttendanceData(attendanceForMonth);

    //         setTotalDays(totalDays);
    //         setPresentDays(presentDays);
    //         setTotalOvertime(totalOvertimeHours);
    //     } catch (error) {
    //         console.error('Error fetching attendance data:', error);
    //     }
    //     setLoading(false);
    // };

    const handleOverTime = (labourId) => {
        const labour = labours.find((l) => l.LabourID === labourId);
        if (!labour || !attendanceData.length) return 0;

        let totalOvertime = 0;
        attendanceData.forEach((entry) => {
            const punchTime = new Date(`1970-01-01T${entry.punch_time}Z`);
            const hoursWorked = punchTime.getHours() + punchTime.getMinutes() / 60;
            if (hoursWorked > 8) {
                totalOvertime += hoursWorked - 8;
            }
        });
        return totalOvertime;
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setAttendanceData([]);
    };

    const handleSearchLabour = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredLabours = labours.filter((labour) =>
            labour.LabourID && labour.LabourID.toLowerCase().includes(searchQuery)
        );
        setLabours(filteredLabours);
    };

    const calculateTotalHours = (attendanceEntry) => {
        const punchIn = new Date(`${attendanceEntry.punch_in}Z`);  // Assuming punch_in is a time string
        const punchOut = new Date(`${attendanceEntry.punch_out}Z`);  // Assuming punch_out is a time string
        const totalHours = (punchOut - punchIn) / (1000 * 60 * 60);  // Convert milliseconds to hours
        return totalHours.toFixed(2);  // Returning the total hours as a fixed decimal value (e.g., 8.25 hours)
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

     // Save full month's attendance to the database
  const saveFullMonthAttendance = async () => {
    try {
      const payload = {
        labourId: selectedLabour.LabourID,
        month: selectedMonth,
        year: selectedYear,
        attendance: attendanceData,
      };
      await axios.post(`${API_BASE_URL}/labours/attendance/save`, payload);
      alert("Attendance saved successfully!");
      handleModalClose();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };
  const handleSelectLabour = (selectedLabour) => {
    setSelectedLabour(selectedLabour);
  };

  const fetchAttendanceWithLoading = async () => {
    setIsLoading(true);
    try {
      await fetchAttendanceForMonth(); // Fetch data
    } finally {
      setIsLoading(false);
    }
  };

  const StatusLegend = () => (
    <Box display="flex" flexDirection="row" alignItems="baseline" ml={2} mt={2}>
      <Box display="flex" alignItems="center" mb={1} mr={2}>
        <CircleIcon sx={{ color: "#4CAF50", fontSize: "13px", marginRight: "4px" }} />
        <Typography sx={{ fontSize: "0.875rem", color: "#5e636e" }}>Present (P)</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1} mr={2}>
        <CircleIcon sx={{ color: "#F44336", fontSize: "13px", marginRight: "4px" }} />
        <Typography sx={{ fontSize: "0.875rem", color: "#5e636e" }}>Half Day (HD)</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1} mr={2}>
        <CircleIcon sx={{ color: "#8236BC", fontSize: "13px", marginRight: "4px" }} />
        <Typography sx={{ fontSize: "0.875rem", color: "#5e636e" }}>Holiday (H)</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <CircleIcon sx={{ color: "#FF6F00", fontSize: "13px", marginRight: "4px" }} />
        <Typography sx={{ fontSize: "0.875rem", color: "#5e636e" }}>Absent (A)</Typography>
      </Box>
    </Box>
  );
  
    const displayLabours = labours;
    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <Box ml={-1.5}>
                <SearchBar
                    //  handleSubmit={handleSubmit}
                     searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery}
                     handleSearch={handleSearch}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    handleSelectLabour={handleSelectLabour}
                    showResults={false}
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
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="tabs example"
                    sx={{
                        ".MuiTabs-indicator": {
                            display: "none",
                        },
                        minHeight: "auto",
                    }}
                >

                </Tabs>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingRight: 5, alignItems:'flex-end', width:'60%'}}>
                    {/* Search Labour ID */}
                    {/* <SearchIcon />
    <input
        type="text"
        placeholder="Search Labour ID"
        onChange={handleSearchLabour}
        style={{
            display:'flex',
            justifyContent:'center',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            padding: '4px 0',
            backgroundColor: 'transparent',
            width: '100%'
        }}
    /> */}

                    {/* Labour ID Dropdown */}
                    {/* <Select
                        value={selectedLabourId}
                        onChange={(e) => setSelectedLabourId(e.target.value)}
                        fullWidth
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Labour ID</MenuItem>
                        {labours.map((labour) => (
                            <MenuItem key={labour.LabourID} value={labour.LabourID}>
                                {labour.LabourID} - {labour.name}
                            </MenuItem>
                        ))}
                    </Select> */}

                    {/* Month Selector */}
                    <Select
                        value={selectedMonth}
                        sx={{width:'20%'}}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Month</MenuItem>
                        {months.map((month) => (
                            <MenuItem key={month.value} value={month.value}>
                                {month.label}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Year Selector */}
                    <Select
                        value={selectedYear}
                        sx={{width:'20%'}}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        displayEmpty
                    >
                        {[selectedYear, selectedYear - 1].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Fetch Attendance Button */}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'rgb(229, 255, 225)',
                            color: 'rgb(43, 217, 144)',
                            '&:hover': {
                              backgroundColor: 'rgb(229, 255, 225)',
                            },
                          }}
                        onClick={fetchAttendanceForMonthAll}
                        disabled={loading}
                    >
                        Featch Attendance
                    </Button>
                </Box>
                {/* </Box> */}
                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
                    //  count={filteredLabours.length > 0 ? filteredLabours.length : labours.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Labour ID</TableCell>
                            <TableCell>Name of Labour</TableCell>
                            <TableCell>Labour Shift</TableCell>
                            <TableCell>Total Days</TableCell>
                            <TableCell>Present Days</TableCell>
                            <TableCell>Overtime (Hours)</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                   
                    <TableBody>
                        {/* {labours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => { */}
                        {(
        rowsPerPage > 0
            ? (searchResults.length > 0 
                ? searchResults 
                : (filteredIconLabours.length > 0 
                    ? filteredIconLabours 
                    : [...labours]))
            : []
    )
                        .filter(labour => labour.status === 'Approved').slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => {
                            const labourAttendance = attendanceData.find(att => att.labourId === labour.LabourID);
                            return (
                                <TableRow key={labour.LabourID}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{labour.LabourID}</TableCell>
                                    <TableCell>{labour.name}</TableCell>
                                    <TableCell>{labour.workingHours}</TableCell>
                                    <TableCell>{labourAttendance ? labourAttendance.totalDays : '-'}</TableCell>
                                    <TableCell>{labourAttendance ? labourAttendance.presentDays : '-'}</TableCell>
                                    <TableCell>{labourAttendance ? labourAttendance.totalOvertimeHours : '-'}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleModalOpen(labour)}
                                             sx={{
                                                backgroundColor: 'rgb(229, 255, 225)',
                                                color: 'rgb(43, 217, 144)',
                                                '&:hover': {
                                                  backgroundColor: 'rgb(229, 255, 225)',
                                                },
                                              }}
                                            >Edit</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal to view attendance for the selected month */}
            {/* <Box className='modalAttendance' sx={{ maxWidth: '1200px' }}>
                <Dialog open={modalOpen} onClose={handleModalClose} >
                    <DialogTitle>Attendance for {selectedLabour?.name} and LabourID {selectedLabour?.LabourID}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                            <Select
                                value={selectedLabourId}
                                onChange={(e) => setSelectedLabourId(e.target.value)}
                                fullWidth
                                label="Select Labour ID"
                            >
                                {labours.map((labour) => (
                                    <MenuItem key={labour.LabourID} value={labour.LabourID}>
                                        {labour.LabourID} - {labour.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                fullWidth
                                label="Select Month"
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                fullWidth
                                label="Select Year"
                            >
                                {[selectedYear, selectedYear - 1].map((year) => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Button onClick={fetchAttendanceForMonth} variant="contained" color="primary" sx={{ display: 'flex', float: 'right', marginTop: '12px' }}>Fetch Attendance</Button>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Punch In</TableCell>
                                    <TableCell>Punch Out</TableCell>
                                    <TableCell>Total Hours</TableCell>
                                    <TableCell>Overtime (Hours)</TableCell>
                                    <TableCell>Shift</TableCell>
                                    <TableCell>Holiday</TableCell>
                                    <TableCell>Weekly Off</TableCell>
                                    <TableCell>Punch In(Manually)</TableCell>
                                    <TableCell>Punch Our(Manually)</TableCell>
                                    <TableCell>Overtime (Manually)</TableCell>
                                   
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceData.map((day, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{day.date}</TableCell>
                                        <TableCell>{day.status}</TableCell>
                                        <TableCell>{day.firstPunch}</TableCell>
                                        <TableCell>{day.lastPunch}</TableCell>
                                        <TableCell>{day.totalHours}</TableCell>
                                        <TableCell>{day.overtime}</TableCell>
                                        <TableCell>{day.shift}</TableCell>
                                        <TableCell>{day.isHoliday ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>{day.isWeeklyOff ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <TextField
                                                value={day.firstPunch || ''}
                                                onChange={(e) => {
                                                    const newData = [...attendanceData];
                                                    newData[index].firstPunch = e.target.value;
                                                    setAttendanceData(newData);
                                                }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Punch In"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={day.lastPunch || ''}
                                                onChange={(e) => {
                                                    const newData = [...attendanceData];
                                                    newData[index].lastPunch = e.target.value;
                                                    setAttendanceData(newData);
                                                }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Punch Out"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={day.overtime || ''}
                                                onChange={(e) => {
                                                    const newData = [...attendanceData];
                                                    newData[index].overtime = e.target.value;
                                                    setAttendanceData(newData);
                                                }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Overtime (Hours)"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box> */}

             {/* Main Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleModalClose}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    Attendance for {selectedLabour?.name} (LabourID: {selectedLabour?.LabourID})
                </DialogTitle>
                <DialogContent
                    sx={{
                        height: "500px", // Fixed height for dialog content
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ display: "flex", gap: "30px", mb: 2 }}>
                        <Select
                            value={selectedMonth}
                            sx={{ width: "14%" }}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            displayEmpty
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
                            sx={{ width: "14%" }}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value={selectedYear}>{selectedYear}</MenuItem>
                            <MenuItem value={selectedYear - 1}>{selectedYear - 1}</MenuItem>
                        </Select>
                        <Button
                            onClick={fetchAttendanceWithLoading}
                            sx={{
                                backgroundColor: "rgb(229, 255, 225)",
                                color: "rgb(43, 217, 144)",
                                width: "10%",
                                marginTop: "6px",
                                "&:hover": {
                                    backgroundColor: "rgb(229, 255, 225)",
                                },
                            }}
                        >
                            Fetch
                        </Button>

                        <StatusLegend />
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            display: "flex",
                            justifyContent: isLoading ? "center" : "flex-start",
                            alignItems: isLoading ? "center" : "stretch",
                            position: "relative",
                        }}
                    >
                        {isLoading ? (
                            <Loading /> // Display Loading component centered in the table area
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Punch In</TableCell>
                                        <TableCell>Punch Out</TableCell>
                                        <TableCell>Total Hours</TableCell>
                                        <TableCell>Overtime</TableCell>
                                        <TableCell>Holiday</TableCell>
                                        <TableCell>Remark</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceData.map((day, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{day.date}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        padding: "7px 16px",
                                                        borderRadius: "4px",
                                                        display: "inline-block",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        fontSize: "0.875rem",
                                                        ...(day.status === "H" && {
                                                            backgroundColor: "#EFE6F7",
                                                            color: "#8236BC",
                                                        }),
                                                        ...(day.status === "P" && {
                                                            backgroundColor: "#E5FFE1",
                                                            color: "#4CAF50",
                                                        }),
                                                        ...(day.status === "HD" && {
                                                            backgroundColor: "rgba(255, 105, 97, 0.3)",
                                                            color: "#F44336",
                                                        }),
                                                        ...(day.status === "A" && {
                                                            backgroundColor: "rgba(255, 223, 186, 0.3)",
                                                            color: "#FF6F00",
                                                        }),
                                                    }}
                                                >
                                                    {day.status}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{day.firstPunch || "-"}</TableCell>
                                            <TableCell>{day.lastPunch || "-"}</TableCell>
                                            <TableCell>{day.totalHours || "0.00"}</TableCell>
                                            {/* <TableCell>{day.overtime || "0.0"}</TableCell> */}
                                            <TableCell>{day.overtime ? parseFloat(day.overtime).toFixed(1) : "0.0"}</TableCell>
                                            <TableCell>{day.isHoliday ? "Yes" : "No"}</TableCell>
                                            <TableCell>{day.remark || "-"}</TableCell>
                                            <TableCell>
                                                <Button
                                                    sx={{
                                                        backgroundColor: "rgb(229, 255, 225)",
                                                        color: "rgb(43, 217, 144)",
                                                        "&:hover": {
                                                            backgroundColor: "rgb(229, 255, 225)",
                                                        },
                                                    }}
                                                    onClick={() => handleManualEditDialogOpen(day)}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleModalClose}
                        sx={{
                            backgroundColor: "#fce4ec",
                            color: "rgb(255, 100, 100)",
                            width: "100px",
                            "&:hover": {
                                backgroundColor: "#f8bbd0",
                            },
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "rgb(229, 255, 225)",
                            color: "rgb(43, 217, 144)",
                            width: "100px",
                            "&:hover": {
                                backgroundColor: "rgb(229, 255, 225)",
                            },
                        }}
                        onClick={saveFullMonthAttendance}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            

      {/* Manual Edit Dialog */}
            <Dialog
                open={editManualDialogOpen}
                onClose={handleManualEditDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Edit Attendance</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <TextField
                        label="Punch In (Manually)"
                        type="time"
                        variant="outlined"
                        fullWidth
                        value={manualEditData.punchIn}
                        onChange={(e) =>
                            setManualEditData({ ...manualEditData, punchIn: e.target.value })
                        }
                        sx={{ marginTop: '14px' }}
                    />
                    <TextField
                        label="Punch Out (Manually)"
                        type="time"
                        variant="outlined"
                        fullWidth
                        value={manualEditData.punchOut}
                        onChange={(e) =>
                            setManualEditData({ ...manualEditData, punchOut: e.target.value })
                        }
                    />
                    <TextField
                        label="Overtime (Manually)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={manualEditData.overtime}
                        onChange={(e) =>
                            setManualEditData({ ...manualEditData, overtime: e.target.value })
                        }
                    />
                    <TextField
                        label="Remark"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={manualEditData.remark}
                        onChange={(e) =>
                            setManualEditData({ ...manualEditData, remark: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, px: 2, gap: 0 }}>
                    <Button
                        onClick={handleManualEditDialogClose}
                        sx={{
                            backgroundColor: '#fce4ec',
                            color: 'rgb(255, 100, 100)',
                            width: '100px',
                            '&:hover': {
                                backgroundColor: '#f8bbd0',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveManualEdit}
                        sx={{
                            backgroundColor: 'rgb(229, 255, 225)',
                            color: 'rgb(43, 217, 144)',
                            width: '100px',
                            '&:hover': {
                                backgroundColor: 'rgb(229, 255, 225)',
                            },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AttendanceReport;



































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     Box,
//     TextField,
//     TablePagination,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Select,
//     MenuItem,
//     Tabs,
//     Tab,
//     InputAdornment
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import SearchBar from '../SarchBar/SearchBar';
// import Loading from "../Loading/Loading";
// import { API_BASE_URL } from "../../Data";
// import "./attendanceReport.css";
// import SearchIcon from '@mui/icons-material/Search';

// const AttendanceReport = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [labours, setLabours] = useState([]);
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [selectedLabour, setSelectedLabour] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(25);
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [searchResults, setSearchResults] = useState([]);
//     const [totalDays, setTotalDays] = useState(0);
//     const [presentDays, setPresentDays] = useState(0);
//     const [totalOvertime, setTotalOvertime] = useState(0);
//     const [tabValue, setTabValue] = useState(0);
//     const [selectedLabourId, setSelectedLabourId] = useState('');


//     const months = [
//         { value: 1, label: 'January' },
//         { value: 2, label: 'February' },
//         { value: 3, label: 'March' },
//         { value: 4, label: 'April' },
//         { value: 5, label: 'May' },
//         { value: 6, label: 'June' },
//         { value: 7, label: 'July' },
//         { value: 8, label: 'August' },
//         { value: 9, label: 'September' },
//         { value: 10, label: 'October' },
//         { value: 11, label: 'November' },
//         { value: 12, label: 'December' }
//     ];

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (searchQuery.trim() === '') {
//             setSearchResults([]);
//             return;
//         }
//         try {
//             const response = await axios.get(`/labours/search?q=${searchQuery}`);
//             setSearchResults(response.data);
//         } catch (error) {
//             console.error('Error searching:', error);
//         }
//     };

//     // Fetch labours and sort by LabourID
//     const fetchLabours = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/labours`);
//             const sortedLabours = response.data.sort((a, b) => a.LabourID - b.LabourID); // Sorting by LabourID DESC
//             setLabours(sortedLabours);
//             setLoading(false);
//         } catch (error) {
//             setLoading(false);
//             console.error('Error fetching labours:', error);
//         }
//     };

//     useEffect(() => {
//         fetchLabours();
//         fetchCachedAttendance();
//     }, []);

//     const handleModalOpen = (labour) => {
//         if (labour && labour.LabourID) {
//             setSelectedLabour(labour);
//             setSelectedLabourId(labour.LabourID);
//             // fetchAttendanceData(labour.LabourID, startDate, endDate);
//             setModalOpen(true);
//         } else {
//             console.error('LabourID is null or undefined for the selected labour.');
//         }
//     };
    
//     const fetchAttendanceForMonth = async () => {
//         if (!selectedLabourId || !selectedMonth) return;
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/labours/attendance/${selectedLabourId}`, {
//                 params: { month: selectedMonth, year: selectedYear }
//             });
//             const { monthlyAttendance, totalDays, presentDays, totalOvertimeHours } = response.data;
//             setAttendanceData(monthlyAttendance);
//             setTotalDays(totalDays);
//             setPresentDays(presentDays);
//             setTotalOvertime(totalOvertimeHours);
//         } catch (error) {
//             console.error('Error fetching attendance data:', error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         if (selectedLabourId && selectedMonth) {
//             fetchAttendanceForMonth();
//         }
//     }, [selectedLabourId, selectedMonth]);


//     const fetchCachedAttendance = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/labours/cachedattendance`);
//             const attendanceList = response.data;
//             setAttendanceData(attendanceList);
//         } catch (error) {
//             console.error('Error fetching cached attendance data:', error);
//         }
//         setLoading(false);
//     };




    
//     const fetchAttendanceForMonthAll = async () => {
//         if (!selectedMonth) return;
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/labours/attendance`, {
//                 params: { month: selectedMonth, year: selectedYear }
//             });
    
//             const attendanceList = response.data;
    
//             setAttendanceData(attendanceList);
    
//             const totalDaysSum = attendanceList.reduce((acc, labor) => acc + labor.totalDays, 0);
//             const presentDaysSum = attendanceList.reduce((acc, labor) => acc + labor.presentDays, 0);
//             const totalOvertimeSum = attendanceList.reduce((acc, labor) => acc + labor.totalOvertimeHours, 0);
    
//             setTotalDays(totalDaysSum);
//             setPresentDays(presentDaysSum);
//             setTotalOvertime(totalOvertimeSum);
//         } catch (error) {
//             console.error('Error fetching attendance data:', error);
//         }
//         setLoading(false);
//     };
    
//     useEffect(() => {
//         if (selectedMonth) {
//             fetchAttendanceForMonth();
//         }
//     }, [selectedMonth, selectedYear]);
    


//     // Function to display attendance for each day of the selected month
//     const renderAttendanceForMonth = () => {
//         const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get days in the selected month
//         const result = [];
    
//         for (let day = 1; day <= daysInMonth; day++) {
//             const formattedDay = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
//             // Check if there's attendance data for the current day
//             const attendanceForDay = attendanceData.find(a => a.punch_date === formattedDay);
    
//             if (selectedLabour && selectedLabour.workingHours) {
//                 const shiftHours = selectedLabour.workingHours.includes('9') ? 9 : 8;
    
//                 if (attendanceForDay) {
//                     const totalHours = calculateTotalHours(attendanceForDay);
//                     const overtime = totalHours > shiftHours ? totalHours - shiftHours : 0;
    
//                     result.push({
//                         date: formattedDay,
//                         status: 'P',
//                         firstPunch: attendanceForDay.punch_in || '-',
//                         lastPunch: attendanceForDay.punch_out || '-',
//                         totalHours,
//                         overtime,
//                         shift: selectedLabour.workingHours
//                     });
//                 } else {
//                     result.push({
//                         date: formattedDay,
//                         status: 'A', // Absent if no attendance data for the day
//                         firstPunch: '-',
//                         lastPunch: '-',
//                         totalHours: '-',
//                         overtime: '-',
//                         shift: selectedLabour.workingHours
//                     });
//                 }
//             }
//         }
    
//         return result; // Return the calculated attendance data
//     };
    
//     // Fetch and set attendance data for the selected month and labor
//     // const fetchAttendanceForMonth = async () => {
//     //     if (!selectedLabourId || !selectedMonth) return;
//     //     setLoading(true);
//     //     try {
//     //         const response = await axios.get(`${API_BASE_URL}/labours/attendance/${selectedLabourId}`, {
//     //             params: { month: selectedMonth, year: selectedYear }
//     //         });
//     //         const { monthlyAttendance, totalDays, presentDays, totalOvertimeHours } = response.data;
    
//     //         // Update the attendanceData state with the processed data
//     //         const attendanceForMonth = renderAttendanceForMonth(); // Call the function here
//     //         setAttendanceData(attendanceForMonth);
    
//     //         setTotalDays(totalDays);
//     //         setPresentDays(presentDays);
//     //         setTotalOvertime(totalOvertimeHours);
//     //     } catch (error) {
//     //         console.error('Error fetching attendance data:', error);
//     //     }
//     //     setLoading(false);
//     // };

//     const handleOverTime = (labourId) => {
//         const labour = labours.find((l) => l.LabourID === labourId);
//         if (!labour || !attendanceData.length) return 0;

//         let totalOvertime = 0;
//         attendanceData.forEach((entry) => {
//             const punchTime = new Date(`1970-01-01T${entry.punch_time}Z`);
//             const hoursWorked = punchTime.getHours() + punchTime.getMinutes() / 60;
//             if (hoursWorked > 8) {
//                 totalOvertime += hoursWorked - 8;
//             }
//         });
//         return totalOvertime;
//     };

//     const handleModalClose = () => {
//         setModalOpen(false);
//         setAttendanceData([]);
//     };

//     const handleSearchLabour = (event) => {
//         const searchQuery = event.target.value.toLowerCase();
//         const filteredLabours = labours.filter((labour) =>
//             labour.LabourID && labour.LabourID.toLowerCase().includes(searchQuery)
//         );
//         setLabours(filteredLabours);
//     };

//     const calculateTotalHours = (attendanceEntry) => {
//         const punchIn = new Date(`1970-01-01T${attendanceEntry.punch_in}Z`);  // Assuming punch_in is a time string
//         const punchOut = new Date(`1970-01-01T${attendanceEntry.punch_out}Z`);  // Assuming punch_out is a time string
//         const totalHours = (punchOut - punchIn) / (1000 * 60 * 60);  // Convert milliseconds to hours
//         return totalHours.toFixed(2);  // Returning the total hours as a fixed decimal value (e.g., 8.25 hours)
//     };
    
//     const handleTabChange = (event, newValue) => {
//         setTabValue(newValue);
//         setPage(0);
//       };

      
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//     const displayLabours = labours;
//     return (
//         <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
//         <Box ml={-1.5}>
//             <SearchBar
//                 handleSubmit={handleSearch}
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//             />
//         </Box>
//         {loading && <Loading />}

        
//       <Box
//         sx={{
//           width: "auto",
//           height: "auto",
//           bgcolor: "white",
//           marginBottom: "15px",
//           p: 1,
//           borderRadius: 2,
//           boxShadow: 3,
//           alignSelf: "flex-start",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//         }}
//       >
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           aria-label="tabs example"
//           sx={{
//             ".MuiTabs-indicator": {
//               display: "none",
//             },
//             minHeight: "auto",
//           }}
//         >
        
//         </Tabs>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     {/* Search Labour ID */}
//                     <TextField
//                         variant="outlined"
//                         placeholder="Search Labour ID"
//                         onChange={handleSearchLabour}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon />
//                                 </InputAdornment>
//                             )
//                         }}
//                     />

//                     {/* Labour ID Dropdown */}
//                     {/* <Select
//                         value={selectedLabourId}
//                         onChange={(e) => setSelectedLabourId(e.target.value)}
//                         fullWidth
//                         displayEmpty
//                     >
//                         <MenuItem value="" disabled>Select Labour ID</MenuItem>
//                         {labours.map((labour) => (
//                             <MenuItem key={labour.LabourID} value={labour.LabourID}>
//                                 {labour.LabourID} - {labour.name}
//                             </MenuItem>
//                         ))}
//                     </Select> */}

//                     {/* Month Selector */}
//                     <Select
//                         value={selectedMonth}
//                         onChange={(e) => setSelectedMonth(e.target.value)}
//                         displayEmpty
//                     >
//                         <MenuItem value="" disabled>Select Month</MenuItem>
//                         {months.map((month) => (
//                             <MenuItem key={month.value} value={month.value}>
//                                 {month.label}
//                             </MenuItem>
//                         ))}
//                     </Select>

//                     {/* Year Selector */}
//                     <Select
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(e.target.value)}
//                         displayEmpty
//                     >
//                         {[selectedYear, selectedYear - 1].map((year) => (
//                             <MenuItem key={year} value={year}>
//                                 {year}
//                             </MenuItem>
//                         ))}
//                     </Select>

//                     {/* Fetch Attendance Button */}
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={fetchAttendanceForMonthAll}
//                         disabled={loading}
//                     >
//                         Search
//                     </Button>
//                 </Box>
//             {/* </Box> */}
//         <TablePagination
//           className="custom-pagination"
//           rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
//         //  count={filteredLabours.length > 0 ? filteredLabours.length : labours.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Box>

//         <TableContainer component={Paper}>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Sr No</TableCell>
//                         <TableCell>Labour ID</TableCell>
//                         <TableCell>Name of Labour</TableCell>
//                         <TableCell>Total Days</TableCell>
//                         <TableCell>Present Days</TableCell>
//                         <TableCell>Overtime (Hours)</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 {/* <TableBody>
//                         {labours
//                             .filter(labour => labour.LabourID && labour.status === 'Approved')
//                             .map((labour, index) => (
//                                 <TableRow key={labour.LabourID}>
//                                 <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                 <TableCell>{labour.LabourID}</TableCell>
//                                 <TableCell>{labour.name}</TableCell>
//                                 <TableCell>{totalDays || '-'}</TableCell>
//                                 <TableCell>{presentDays || '-'}</TableCell>
//                                 <TableCell>{labour.overtime || '-'}</TableCell>
//                                 <TableCell>
//                                     <Button onClick={() => handleModalOpen(labour)}>Edit</Button>
//                                 </TableCell>
//                             </TableRow>
//                     ))}
//                 </TableBody> */}
//                   <TableBody>
//                         {/* {labours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => { */}
//                         {labours.filter(labour => labour.status === 'Approved').slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => {
//                             const labourAttendance = attendanceData.find(att => att.labourId === labour.LabourID);
//                             return (
//                                 <TableRow key={labour.LabourID}>
//                                     <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                     <TableCell>{labour.LabourID}</TableCell>
//                                     <TableCell>{labour.name}</TableCell>
//                                     <TableCell>{labourAttendance ? labourAttendance.totalDays : '-'}</TableCell>
//                                     <TableCell>{labourAttendance ? labourAttendance.presentDays : '-'}</TableCell>
//                                     <TableCell>{labourAttendance ? labourAttendance.totalOvertimeHours : '-'}</TableCell>
//                                     <TableCell>
//                                         <Button onClick={() => handleModalOpen(labour)}>Edit</Button>
//                                     </TableCell>
//                                 </TableRow>
//                             );
//                         })}
//                     </TableBody>
//             </Table>
//         </TableContainer>

//         {/* Modal to view attendance for the selected month */}
//         <Dialog open={modalOpen} onClose={handleModalClose} className='moduleForAttendance'>
//             <DialogTitle>Attendance for {selectedLabour?.name} and LabourID {selectedLabour?.LabourID}</DialogTitle>
//             <DialogContent>
//                 <Box sx={{display:'flex', flexDirection:'row', gap:'20px'}}>
//                 <Select
//                     value={selectedLabourId} 
//                     onChange={(e) => setSelectedLabourId(e.target.value)} 
//                     fullWidth
//                     label="Select Labour ID" 
//                 >
//                    {labours.map((labour) => (
//                        <MenuItem key={labour.LabourID} value={labour.LabourID}>
//                        {labour.LabourID} - {labour.name}
//                    </MenuItem>
//                     ))}
//                 </Select>
//                 <Select
//                     value={selectedMonth}
//                     onChange={(e) => setSelectedMonth(e.target.value)}
//                     fullWidth
//                     label="Select Month"
//                 >
//                     {months.map((month) => (
//                         <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
//                     ))}
//                 </Select>
//                 <Select
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                     fullWidth
//                     label="Select Year"
//                 >
//                     {/* Allowing selection of previous or current year */}
//                     {[selectedYear, selectedYear - 1].map((year) => (
//                         <MenuItem key={year} value={year}>{year}</MenuItem>
//                     ))}
//                 </Select>
//                 </Box>
//                 <Button onClick={fetchAttendanceForMonth} variant="contained" color="primary" sx={{display:'flex',float:'right',marginTop:'12px'}}>Fetch Attendance</Button>

//                 {/* Table to display attendance for the selected month */}
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Date</TableCell>
//                             <TableCell>Status</TableCell>
//                             <TableCell>First Punch In</TableCell>
//                             <TableCell>Last Punch Out</TableCell>
//                             <TableCell>Total Hours</TableCell>
//                             <TableCell>Overtime (Hours)</TableCell>
//                             <TableCell>Shift</TableCell>
//                             <TableCell>First Punch In(Manually)</TableCell>
//                             <TableCell>Last Punch Our(Manually)</TableCell>
//                             <TableCell>Overtime (Manually)</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                     {attendanceData.map((day, index) => (
//                         <TableRow key={index}>
//                             <TableCell>{day.date}</TableCell>
//                             <TableCell>{day.status}</TableCell>
//                             <TableCell>{day.firstPunch}</TableCell>
//                             <TableCell>{day.lastPunch}</TableCell>
//                             <TableCell>{day.totalHours}</TableCell>
//                             <TableCell>{day.overtime}</TableCell>
//                             <TableCell>{day.shift}</TableCell>
//                             <TableCell>
//                 <TextField
//                     value={day.firstPunch || ''}
//                     onChange={(e) => {
//                         const newData = [...attendanceData];
//                         newData[index].firstPunch = e.target.value;
//                         setAttendanceData(newData);
//                     }}
//                     variant="outlined"
//                     size="small"
//                     placeholder="First Punch"
//                 />
//             </TableCell>
//             <TableCell>
//                 <TextField
//                     value={day.lastPunch || ''}
//                     onChange={(e) => {
//                         const newData = [...attendanceData];
//                         newData[index].lastPunch = e.target.value;
//                         setAttendanceData(newData);
//                     }}
//                     variant="outlined"
//                     size="small"
//                     placeholder="Last Punch"
//                 />
//             </TableCell>
//             <TableCell>
//                 <TextField
//                     value={day.overtime || ''}
//                     onChange={(e) => {
//                         const newData = [...attendanceData];
//                         newData[index].overtime = e.target.value;
//                         setAttendanceData(newData);
//                     }}
//                     variant="outlined"
//                     size="small"
//                     placeholder="Overtime (Hours)"
//                 />
//             </TableCell>
//                         </TableRow>
//                     ))}
//                     </TableBody>
//                 </Table>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleModalClose}>Close</Button>
//             </DialogActions>
//         </Dialog>
//     </Box>
// );
// };

// export default AttendanceReport;

