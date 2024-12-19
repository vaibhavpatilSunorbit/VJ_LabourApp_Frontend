
// // import React, { useState, useEffect } from 'react';
// // import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// // import axios from 'axios';
// // import { API_BASE_URL } from "../../Data"; // Ensure this URL is correct

// // const columns = [
// //   { field: 'id', headerName: 'ID', width: 100 },
// //   { field: 'labourOwnership', headerName: 'Labour Ownership', width: 200 },
// //   { field: 'aadhaarNumber', headerName: 'Aadhaar Number', width: 200 },
// //   { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
// //   { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
// //   { field: 'gender', headerName: 'Gender', width: 150 },
// //   { field: 'address', headerName: 'Address', width: 150 },
// //   { field: 'status', headerName: 'Status', width: 150 },
// //   { field: 'LabourID', headerName: 'Labour ID', width: 180 },
// //   { field: 'OnboardName', headerName: 'Onboard Name', width: 120 },
// // ];

// // export default function BasicExampleDataGridPro() {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   // Fetching the data from the API
// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/labours`);

// //       // Log the API response to check the structure
// //       console.log('API Response:', response);

// //       // Since the response is already an array of objects, no need to access response.data.data
// //       const fetchedData = response.data;

// //       // Ensure each row has a unique `id` field
// //       const mappedData = fetchedData.map((item, index) => ({
// //         ...item,
// //         id: item.LabourID || index, // Use LabourID as `id` or fallback to index if missing
// //       }));

// //       setData(mappedData);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ height: 658, width: '100%' }}>
// //       <DataGrid
// //         rows={data} // Passing your fetched and mapped data
// //         columns={columns} // The columns defined above
// //         loading={loading} // Shows a loading spinner while data is being fetched
// //         pageSize={10}
// //         rowsPerPageOptions={[10, 20, 50]}
// //         slots={{ toolbar: GridToolbar }}
// //       />
// //     </div>
// //   );
// // }









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Box,
//   TextField,
//   TablePagination,
//   Select,
//   MenuItem,
//   Tabs,
//   Tab
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import SearchBar from '../SarchBar/SearchBar';
// import Loading from "../Loading/Loading";
// import { API_BASE_URL } from "../../Data";

// const WagesReport = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [tabValue, setTabValue] = useState(0); // Tab value: 0 for Fixed Monthly, 1 for Daily Wages
//     const [labours, setLabours] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [dailyWages, setDailyWages] = useState({});
//     const [perDayWages, setPerDayWages] = useState({});
//     const [monthlyWages, setMonthlyWages] = useState({});
//     const [yearlyWages, setYearlyWages] = useState({});
//     const [overtime, setOvertime] = useState({});
//     const [totalOvertimeWages, setTotalOvertimeWages] = useState({});
//     const [payStructure, setPayStructure] = useState({});
//     const [weakelyOff, setWeakelyOff] = useState({});
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(25);

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

//     const fetchLabours = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/labours`);
//             const sortedLabours = response.data.sort((a, b) => a.LabourID - b.LabourID);// Sorting by LabourID DESC
//             setLabours(sortedLabours);
//             setLoading(false);
//         } catch (error) {
//             setLoading(false);
//             console.error('Error fetching labours:', error);
//         }
//     };

//     useEffect(() => {
//         fetchLabours();
//     }, []);

//     const handleTabChange = (event, newValue) => {
//         setTabValue(newValue); 
//     };

//     const handleWageChange = (labourId, value) => {
//         const labour = labours.find(l => l.LabourID === labourId); 

//         let hoursPerShift;
//         if (labour.workingHours === "FLEXI SHIFT - 8 HRS") {
//             hoursPerShift = 8;
//         } else if (labour.workingHours === "FLEXI SHIFT - 9 HRS") {
//             hoursPerShift = 9;
//         } else {
//             hoursPerShift = 8; 
//         }

//         const daysInMonth = getDaysInMonth();

//         setDailyWages(prev => ({ ...prev, [labourId]: value }));

//         const perDayWages = (value / hoursPerShift).toFixed(1);
//         setPerDayWages(prev => ({ ...prev, [labourId]: perDayWages }));

//         const monthlyWages = (perDayWages * hoursPerShift * daysInMonth).toFixed(1);
//         setMonthlyWages(prev => ({ ...prev, [labourId]: monthlyWages }));

//         const yearlyWages = (monthlyWages * 12).toFixed(1);
//         setYearlyWages(prev => ({ ...prev, [labourId]: yearlyWages }));
//     };

//     const handleOvertimeChange = (labourId, value) => {
//         const overtimeRate = perDayWages[labourId] || 0;
//         const overtimeWages = overtimeRate * value;

//         setOvertime(prev => ({ ...prev, [labourId]: value }));
//         setTotalOvertimeWages(prev => ({ ...prev, [labourId]: overtimeWages }));
//     };

//     const handlePayStructureChange = (labourId, structure) => {
//         setPayStructure(prev => ({ ...prev, [labourId]: structure }));
//     };

//     const handleWeakelyOffChange = (labourId, value) => {
//         setWeakelyOff(prev => ({ ...prev, [labourId]: value }));
//     };

//     const getDaysInMonth = () => {
//         const today = new Date();
//         return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
//     };

//     const displayLabours = searchResults.length > 0 ? searchResults : labours;
//     if (displayLabours.length === 0 && !loading) {
//         return <p>No labours found.</p>;
//       }
//     console.log('displayLabours-------',displayLabours)
//     const handleSubmit = async () => {
//         const formData = displayLabours.map(labour => ({
//             labourId: labour.LabourID,
//             payStructure: payStructure[labour.LabourID],
//             dailyWages: dailyWages[labour.LabourID],
//             perDayWages: perDayWages[labour.LabourID],
//             monthlyWages: monthlyWages[labour.LabourID],
//             yearlyWages: yearlyWages[labour.LabourID],
//             overtime: overtime[labour.LabourID],
//             totalOvertimeWages: totalOvertimeWages[labour.LabourID],
//             weakelyOff: weakelyOff[labour.LabourID],
//         }));

//         try {
//             await axios.post(`${API_BASE_URL}/labours/submitWages`, formData);
//             alert("Data submitted successfully!");
//         } catch (error) {
//             console.error("Error submitting data:", error);
//             alert("Failed to submit data.");
//         }
//     };


//     return (
//         <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
//             <Box ml={-1.5}>
//                 <SearchBar
//                     handleSubmit={handleSearch}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                 />
//             </Box>
//             {loading && <Loading />}

//             <Box
//                 sx={{
//                     width: "auto",
//                     height: "auto",
//                     bgcolor: "white",
//                     marginBottom: "15px",
//                     p: 1,
//                     borderRadius: 2,
//                     boxShadow: 3,
//                     alignSelf: "flex-start",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     flexWrap: "wrap",
//                 }}
//             >
//                 <Tabs
//                     value={tabValue}
//                     onChange={handleTabChange}
//                     aria-label="tabs example"
//                     sx={{
//                         ".MuiTabs-indicator": {
//                             display: "none",
//                         },
//                         minHeight: "auto",
//                     }}
//                 >
//                     <Tab
//                         label="Fixed Monthly Wages"
//                         style={{ color: tabValue === 0 ? "#8236BC" : "black" }}
//                         sx={{
//                             color: tabValue === 0 ? "white" : "black",
//                             bgcolor: tabValue === 0 ? "#EFE6F7" : "transparent",
//                             borderRadius: 1,
//                             textTransform: "none",
//                             fontWeight: "bold",
//                             mr: 1,
//                             minHeight: "auto",
//                             minWidth: "auto",
//                             "&:hover": {
//                                 bgcolor: tabValue === 0 ? "#EFE6F7" : "#EFE6F7",
//                             },
//                         }}
//                     />
//                     <Tab
//                         label="Daily Wages"
//                         style={{ color: tabValue === 1 ? "rgb(43, 217, 144)" : "black" }}
//                         sx={{
//                             color: tabValue === 1 ? "white" : "black",
//                             bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "transparent",
//                             borderRadius: 1,
//                             textTransform: "none",
//                             mr: 1,
//                             fontWeight: "bold",
//                             minHeight: "auto",
//                             minWidth: "auto",
//                             "&:hover": {
//                                 bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "rgb(229, 255, 225)",
//                             },
//                         }}
//                     />
//                 </Tabs>

// <TablePagination
//     className="custom-pagination"
//     rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
//     count={displayLabours.length}
//     rowsPerPage={rowsPerPage}
//     page={page}
//     onPageChange={(e, newPage) => setPage(newPage)}
//     onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
// />
//             </Box>

//             <TableContainer component={Paper} sx={{ mb: isMobile ? 6 : 0, overflowX: 'auto', overflowY: 'auto', borderRadius: 2, boxShadow: 3 }}>
//                 <Table stickyHeader sx={{ minWidth: 800 , padding: '-80px 20px'}}>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Sr No</TableCell>
//                             <TableCell>Labour ID</TableCell>
//                             <TableCell>Name of Labour</TableCell>
//                             <TableCell>Status</TableCell>
//                             <TableCell>Pay Structure</TableCell>
//                             {tabValue === 1 && <TableCell>Daily Wages</TableCell>}
//                             <TableCell>PerHour Wages</TableCell>
//                             <TableCell>Monthly Wages</TableCell>
//                             <TableCell>Yearly Wages</TableCell>
//                             {tabValue === 0 && <TableCell>Weakely Off</TableCell>}
//                             {tabValue === 1 && (
//                                 <>
//                                     <TableCell>Overtime (Hours)</TableCell>
//                                     <TableCell>Overtime Pay</TableCell>
//                                     <TableCell>Total Wages</TableCell>
//                                 </>
//                             )}
//                             {tabValue === 0 && <TableCell>Total Wages</TableCell>}
//                             <TableCell>Action</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {/* {(displayLabours.length > 0
//                             ? displayLabours
//                                 .filter(labour => {
//                                     if (labour.status === 'Approved' && tabValue === 0) {
//                                         return payStructure[labour.LabourID] === 'Fixed Monthly Wages'
//                                     }
//                                     return payStructure[labour.LabourID] === 'Daily Wages'
//                                 })
//                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             : [] */}
//                              {(displayLabours.length > 0
//                             ? displayLabours
//                                 .filter(labour => labour.status === 'Approved')
//                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             : []
//                             ).map((labour, index) => (
//                                 <TableRow key={labour.LabourID}>
//                                     <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                     <TableCell>{labour.LabourID}</TableCell>
//                                     <TableCell>{labour.name}</TableCell>
//                                     <TableCell>{labour.status}</TableCell>

//                                     {/* Pay Structure Selection */}
//                                     <TableCell>
//                                         <Select
//                                             value={payStructure[labour.LabourID] || 'Select Wages'}
//                                             onChange={(e) => handlePayStructureChange(labour.LabourID, e.target.value)}
//                                         >
//                                             {tabValue === 0 ? (
//                                                 <MenuItem value="Fixed Monthly Wages">Fixed Monthly Wages</MenuItem>
//                                             ) : (
//                                                 <MenuItem value="Daily Wages">Daily Wages</MenuItem>
//                                             )}
//                                         </Select>
//                                     </TableCell>
//                                     {/* Daily Wages Field, editable if Daily Wages is selected */}
//                                     {tabValue === 1 && (
//                                         <TableCell>
//                                             <TextField
//                                                 type="number"
//                                                 value={dailyWages[labour.LabourID] || ''}
//                                                 onChange={(e) => handleWageChange(labour.LabourID, e.target.value)}
//                                                 sx={{ width: '100px' }} 
//                                             />
//                                         </TableCell>
//                                     )}

//                                     {/* Per Day Wages Column */}
//                                     <TableCell>{perDayWages[labour.LabourID] || ''}</TableCell> 

//                                     {/* Monthly Wages Column */}
//                                     <TableCell>{monthlyWages[labour.LabourID] || ''}</TableCell>

//                                     {/* Yearly Wages Column */}
//                                     <TableCell>{yearlyWages[labour.LabourID] || ''}</TableCell>


//                                     {/* Weakely Off Field, editable if Fixed Monthly Wages is selected */}
//                                     {tabValue === 0 && (
//                                         <TableCell>
//                                             <TextField
//                                                 type="text"
//                                                 value={weakelyOff[labour.LabourID] || ''}
//                                                 onChange={(e) => handleWeakelyOffChange(labour.LabourID, e.target.value)}
//                                                 sx={{ width: '100px' }} 
//                                             />
//                                         </TableCell>
//                                     )}

//                                     {/* Overtime (Hours), Overtime Pay, and Total Wages (Including Overtime) for Daily Wages */}
//                                     {tabValue === 1 && (
//                                         <>
//                                             <TableCell>
//                                                 <TextField
//                                                     type="number"
//                                                     value={overtime[labour.LabourID] || ''}
//                                                     onChange={(e) => handleOvertimeChange(labour.LabourID, e.target.value)}
//                                                     sx={{ width: '100px' }} 
//                                                 />
//                                             </TableCell>
//                                             <TableCell>{totalOvertimeWages[labour.LabourID] || ''}</TableCell>
//                                             <TableCell>{(monthlyWages[labour.LabourID] || 0) + (totalOvertimeWages[labour.LabourID] || 0)}</TableCell>
//                                         </>
//                                     )}

//                                     {/* Total Wages (Without Overtime) for Fixed Monthly Wages */}
//                                     {tabValue === 0 && <TableCell>{monthlyWages[labour.LabourID] || ''}</TableCell>}

//                                     {/* Action Button */}
//                                     <TableCell>
//                                         <Button variant="contained"
//                                             sx={{
//                                                 backgroundColor: 'rgb(239,230,247)',
//                                                 color: 'rgb(130,54,188)',
//                                                 '&:hover': {
//                                                     backgroundColor: 'rgb(239,230,247)',
//                                                 },
//                                             }}>Edit</Button>
//                                     </TableCell> <TableCell>
//                                         <Button variant="contained"
//                                             sx={{
//                                                 backgroundColor: 'rgb(229, 255, 225)',
//                                                 color: 'rgb(43, 217, 144)',
//                                                 '&:hover': {
//                                                     backgroundColor: 'rgb(229, 255, 225)',
//                                                 },
//                                             }} onClick={handleSubmit}>Submit</Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// export default WagesReport;














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

    const handleSave = () => {
        console.log({
            LabourID: selectedLabour?.LabourID || 'Unknown',
            payStructure,
            dailyWages,
            overtime,
            totalOvertimeWages,
            monthlyWages,
            yearlyWages,
            weeklyOff,
        });
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
    };
    const handleEdit = (labour) => {
        setSelectedLabour(labour);
        setModalOpen(true);
        setPayStructure('');
        setDailyWages('');
        setOvertime('');
        setTotalOvertimeWages('');
        setMonthlyWages('');
        setYearlyWages('');
        setWeeklyOff('');
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
                            {businessUnits.map((unit) => (
                                <MenuItem key={unit.BusinessUnit} value={unit.BusinessUnit}>
                                    {unit.BusinessUnit}
                                </MenuItem>
                            ))}
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
                                    const value = parseFloat(e.target.value) || 0;
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
                            <TextField
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
                            />
                        </>
                    )}

                    {payStructure === 'Fixed Monthly Wages' && (
                        <>
                            {/* Weekly Off Dropdown */}
                            <Select
                                label="Weekly Off"
                                fullWidth
                                value={weeklyOff}
                                onChange={(e) => setWeeklyOff(e.target.value)}
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