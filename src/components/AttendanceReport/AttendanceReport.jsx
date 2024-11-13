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
    InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchBar';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import "./attendanceReport.css";
import SearchIcon from '@mui/icons-material/Search';

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
            const response = await axios.get(`/labours/search?q=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching:', error);
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
            setLoading(false);
            console.error('Error fetching labours:', error);
        }
    };

    useEffect(() => {
        fetchLabours();
        fetchCachedAttendance();
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
            setAttendanceData(monthlyAttendance);
            setTotalDays(totalDays);
            setPresentDays(presentDays);
            setTotalOvertime(totalOvertimeHours);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
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
    
            // Process attendance to only include times for first and last punches
            const processedAttendance = attendanceList.map(att => ({
                ...att,
                firstPunch: att.firstPunch ? new Date(att.firstPunch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                lastPunch: att.lastPunch ? new Date(att.lastPunch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '-',
                totalOvertimeHours: att.totalOvertimeHours ? Math.floor(att.totalOvertimeHours * 10) / 10 : '-'
            }));
            setAttendanceData(processedAttendance);
        } catch (error) {
            console.error('Error fetching cached attendance data:', error);
        }
        setLoading(false);
    };



    const fetchAttendanceForMonthAll = async () => {
        if (!selectedMonth) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/attendance`, {
                params: { month: selectedMonth, year: selectedYear }
            });
    
            const attendanceList = response.data;
    
            const processedAttendance = attendanceList.map(att => ({
                ...att,
                firstPunch: att.firstPunch ? new Date(att.firstPunch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
                lastPunch: att.lastPunch ? new Date(att.lastPunch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
                totalOvertimeHours: att.totalOvertimeHours ? Math.floor(att.totalOvertimeHours * 10) / 10 : '-'
            }));

            setAttendanceData(processedAttendance);
    
            const totalDaysSum = processedAttendance.reduce((acc, labor) => acc + labor.totalDays, 0);
            const presentDaysSum = processedAttendance.reduce((acc, labor) => acc + labor.presentDays, 0);
            const totalOvertimeSum = processedAttendance.reduce((acc, labor) => acc + (typeof labor.totalOvertimeHours === 'number' ? labor.totalOvertimeHours : 0), 0);
    
            setTotalDays(totalDaysSum);
            setPresentDays(presentDaysSum);
            setTotalOvertime(totalOvertimeSum);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        if (selectedMonth) {
            fetchAttendanceForMonth();
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
        const punchIn = new Date(`1970-01-01T${attendanceEntry.punch_in}Z`);  // Assuming punch_in is a time string
        const punchOut = new Date(`1970-01-01T${attendanceEntry.punch_out}Z`);  // Assuming punch_out is a time string
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
    const displayLabours = labours;
    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Search Labour ID */}
                    <TextField
                        variant="outlined"
                        placeholder="Search Labour ID"
                        onChange={handleSearchLabour}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />

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
                        color="primary"
                        onClick={fetchAttendanceForMonthAll}
                        disabled={loading}
                    >
                        Search
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
                        <TableCell>Total Days</TableCell>
                        <TableCell>Present Days</TableCell>
                        <TableCell>Overtime (Hours)</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                {/* <TableBody>
                        {labours
                            .filter(labour => labour.LabourID && labour.status === 'Approved')
                            .map((labour, index) => (
                                <TableRow key={labour.LabourID}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{labour.LabourID}</TableCell>
                                <TableCell>{labour.name}</TableCell>
                                <TableCell>{totalDays || '-'}</TableCell>
                                <TableCell>{presentDays || '-'}</TableCell>
                                <TableCell>{labour.overtime || '-'}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleModalOpen(labour)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                    ))}
                </TableBody> */}
                  <TableBody>
                        {/* {labours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => { */}
                        {labours.filter(labour => labour.status === 'Approved').slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => {
                            const labourAttendance = attendanceData.find(att => att.labourId === labour.LabourID);
                            return (
                                <TableRow key={labour.LabourID}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{labour.LabourID}</TableCell>
                                    <TableCell>{labour.name}</TableCell>
                                    <TableCell>{labourAttendance ? labourAttendance.totalDays : '-'}</TableCell>
                                    <TableCell>{labourAttendance ? labourAttendance.presentDays : '-'}</TableCell>
                                    <TableCell>{labourAttendance ? labourAttendance.totalOvertimeHours : '-'}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleModalOpen(labour)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
            </Table>
        </TableContainer>

        {/* Modal to view attendance for the selected month */}
        <Box className='modalAttendance' sx={{Width:'1200px'}}>
        <Dialog open={modalOpen} onClose={handleModalClose} >
            <DialogTitle>Attendance for {selectedLabour?.name} and LabourID {selectedLabour?.LabourID}</DialogTitle>
            <DialogContent>
                <Box sx={{display:'flex', flexDirection:'row', gap:'20px'}}>
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
                    {/* Allowing selection of previous or current year */}
                    {[selectedYear, selectedYear - 1].map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
                </Box>
                <Button onClick={fetchAttendanceForMonth} variant="contained" color="primary" sx={{display:'flex',float:'right',marginTop:'12px'}}>Fetch Attendance</Button>

                {/* Table to display attendance for the selected month */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>First Punch In</TableCell>
                            <TableCell>Last Punch Out</TableCell>
                            <TableCell>Total Hours</TableCell>
                            <TableCell>Overtime (Hours)</TableCell>
                            <TableCell>Shift</TableCell>
                            <TableCell>First Punch In(Manually)</TableCell>
                            <TableCell>Last Punch Our(Manually)</TableCell>
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
                    placeholder="First Punch"
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
                    placeholder="Last Punch"
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
        </Box>
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

