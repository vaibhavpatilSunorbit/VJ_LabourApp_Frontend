
import React, { useState, useEffect, useRef } from 'react';
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
    MenuItem, Modal, Typography, IconButton, Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, FormControl, InputLabel, Tabs
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchRegister';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext';
import ExportVariablePay from '../VariableInputs/ImportExportVariablePay/ExportVariablePay'
import ImportVariablePay from '../VariableInputs/ImportExportVariablePay/ImportVariablePay'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import { parse } from "fast-xml-parser";

const SalaryRegister = ({ departments, projectNames = [], labour }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [variablePay, setvariablePay] = useState({});
    const [payStructure, setPayStructure] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const { user } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openDialogSite, setOpenDialogSite] = useState(false);
    const [statusesSite, setStatusesSite] = useState({});
    const [effectiveDate, setEffectiveDate] = useState("");

    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/eligibleLaboursForSalaryGeneration`);
            setLabours(response.data);
            console.log("response.data .", response.data)
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


    // const fetchAttendanceForMonthAll = async () => {
    //     if (!selectedMonth || !selectedYear) {
    //         toast.warning('Please select a valid month and year.');
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/insentive/payroll/eligibleLaboursForSalaryGeneration`, {
    //             params: { month: selectedMonth, year: selectedYear },
    //         });

    //         const attendanceList = response.data;

    //         const processedAttendance = attendanceList.map((labour, index) => {
    //             const totalOvertime = labour.TotalOvertimeHours ?? 0;  
    
    //             return {
    //                 srNo: index + 1,
    //                 labourId: labour.LabourId,
    //                 name: labour.Name,
    //                 attendanceCount: labour.attendanceCount,
    //                 presentDays: labour.PresentDays,
    //                 halfDays: labour.HalfDays,
    //                 absentDays: labour.AbsentDays,
    //                 misspunchDays: labour.MissPunchDays,
    //                 totalOvertimeHours: parseFloat(totalOvertime.toFixed(1)),
    //                 shift: labour.Shift,
    //             };
    //         });

    //         setAttendanceData(processedAttendance);
    //     } catch (error) {
    //         console.error('Error fetching attendance data:', error);
    //         toast.error(error.response?.data?.message || 'Error fetching attendance data. Please try again later.');
    //     }
    //     setLoading(false);
    // };

    // useEffect(() => {
    //     if (selectedMonth && selectedYear) {
    //         fetchAttendanceForMonthAll();
    //     }
    // }, [selectedMonth, selectedYear]);



    const fetchSalaryGenerationForDateMonthAll = async () => {
        if (!selectedMonth || !selectedYear) {
            toast.warning('Please select a valid month and year.');
            return;
        }
        setLoading(true);
    
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/salaryGenerationData`, {
                params: { month: selectedMonth, year: selectedYear },
            });
    
            const salaryData = response.data;
    
            const ShowSalaryGeneration = salaryData.map((labour, index) => {
                const { attendance, wages, variablePay, totalOvertime } = labour;
    
                return {
                    srNo: index + 1,
                    labourId: labour.labourId,
                    name: labour.name,
                    project: labour.project,
                    department: labour.department,
                    attendanceCount: attendance.presentDays + attendance.halfDays + attendance.missPunchDays,
                    presentDays: attendance.presentDays,
                    halfDays: attendance.halfDays,
                    absentDays: attendance.absentDays,
                    missPunchDays: attendance.missPunchDays,
                    totalOvertimeHours: parseFloat(totalOvertime.toFixed(1)),
                    wagesAmount: wages ? wages.calculatedWages.dailyWages : 0,
                    advancePay: variablePay ? variablePay.advance : 0,
                    incentivePay: variablePay ? variablePay.incentive : 0,
                };
            });
    
            setAttendanceData(ShowSalaryGeneration);
        } catch (error) {
            console.error('Error fetching salary generation data:', error);
            toast.error(error.response?.data?.message || 'Error fetching salary generation data. Please try again later.');
        }
        setLoading(false);
    };
    
    
    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchSalaryGenerationForDateMonthAll();
        }
    }, [selectedMonth, selectedYear]);
    


    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
    };
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

    const handleEdit = (labour) => {
        setSelectedLabour(labour);  // Preserves all current details of the labour
        setModalOpen(true);
    };

    const handleApproved = (labour) => {
        setSelectedLabour(labour);  // Preserves all current details of the labour
        setOpenDialogSite(true);
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
            const response = await axios.get(`${API_BASE_URL}/insentive/searchLaboursFromVariablePay?q=${searchQuery}`);
            setLabours(response.data);
        } catch (error) {
            console.error('Error searching:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0);
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

    const getProjectDescription = (projectId) => {
        if (!Array.isArray(projectNames) || projectNames.length === 0) {
            console.error('Projects array is empty or invalid:', projectNames);
            return 'Unknown';
        }

        if (projectId === undefined || projectId === null) {
            console.error('Project ID is undefined or null:', projectId);
            return 'Unknown';
        }

        const project = projectNames.find(
            (proj) => proj.id === Number(projectId)
        );

        return project ? project.Business_Unit : 'Unknown';
    };


    const getDepartmentDescription = (departmentId) => {
        if (!departments || departments.length === 0) {
            return 'Unknown';
        }
        const department = departments.find(dept => dept.Id === Number(departmentId));
        return department ? department.Description : 'Unknown';
    };

    const handleModalTransfer = () => {
        setSelectedLabour(labour);
        confirmTransfer();
        setModalOpen(false); // Close the modal
        setOpenDialogSite(true); // Open the confirmation dialog
    };


    const confirmTransfer = async () => {
        setOpenDialogSite(false); // Close the dialog

        try {
            // Fetch current and new site names for transfer
            // const projectName = projectNames.find((p) => p.id === selectedLabour.projectName)?.Business_Unit || "Unknown";

            if (!payStructure || !variablePay) {
                toast.error("Please fill in all required fields.");
                return;
            }
            const onboardName = user.name || null;
            const transferDataPayload = {
                userId: selectedLabour.id,
                LabourID: selectedLabour.LabourID,
                name: selectedLabour.name,
                month: selectedLabour.month,
                fullDate: selectedLabour.fullDate,
                payStructure: selectedLabour.payStructure,
                variablePay: selectedLabour.variablePay,
                variablePayRemark: selectedLabour.variablePayRemark,
                effectiveDate: selectedLabour.effectiveDate || new Date().toISOString().split('T')[0],
                payAddedBy: onboardName,
            };


            const response = await axios.post(`${API_BASE_URL}/insentive/upsertVariablePay`, transferDataPayload);

            if (response.status === 200) {
                // Update UI
                setLabours((prevLabours) =>
                    prevLabours.map((labour) =>
                        labour.LabourID === selectedLabour.LabourID
                            ? { ...labour, ...selectedLabour }
                            : labour
                    )
                );

                toast.success(`Labour ${selectedLabour.name} Variable Pay sent for Admin Approval`);
            } else {
                toast.error(`Failed to transfer labour. ${response.data.message || "Unexpected error occurred."}`);
            }
        } catch (error) {
            console.error("Error during site transfer:", error);
            toast.error("Failed to sent for Admin Approval.");
        }
    };

    const fetchs = async (labourIds) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/allTransferSite`, { labourIds });
            console.log('API Response:', response.data); // Debug response
            return response.data.map((item) => ({
                LabourID: item.LabourID,
                projectNames: item.projectNames,
                createdAt: item.createdAt,
            }));
        } catch (error) {
            console.error('Error fetching transfer site names:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            setLoading(true);

            const labourIds = labours.map((labour) => labour.LabourID);
            if (labourIds.length > 0) {
                const statusesData = await fetchs(labourIds);
                const mappedStatuses = statusesData.reduce((acc, status) => {
                    acc[status.LabourID] = {
                        projectNames: status.projectNames || '-',
                        createdAt: status.createdAt || '-',
                    };
                    return acc;
                }, {});
                setStatusesSite(mappedStatuses);
                console.log('Mapped Statuses with Dates:', mappedStatuses); // Debug statuses
            }

            setLoading(false);
        };

        // if (labours.length > 0) fetchStatuses();
    }, [labours]);


    const handlePayStructureChange = (e, labourID) => {
        const newPayStructure = e.target.value;
        const updatedLabours = labours.map(labour => {
            if (labour.LabourID === labourID) {
                return {
                    ...labour,
                    payStructure: newPayStructure,
                    variablePayRemark: ''  // Reset remarks when pay structure changes
                };
            }
            return labour;
        });
        setLabours(updatedLabours);
    };

    const handleRemarkChange = (e, labourID) => {
        const newVariablePayRemark = e.target.value;
        const updatedLabours = labours.map(labour => {
            if (labour.LabourID === labourID) {
                return {
                    ...labour,
                    variablePayRemark: newVariablePayRemark
                };
            }
            return labour;
        });
        setLabours(updatedLabours);
    };

    const getRemarksOptions = (payStructure) => {
        switch (payStructure) {
            case "Advance":
                return ["New Joinee", "Payment Delay"];
            case "Debit":
                return ["Gadget Mishandling", "Performance Issue"];
            case "Incentive":
                return ["Payment Arrears", "Outstanding Performance"];
            default:
                return [];
        }
    };

    const handleVariablePayChange = (e, labourID) => {
        const input = e.target.value;
        // Parse the input as a float only if it is not empty and has 5 or fewer digits
        const value = (input === '' || input.length > 5) ? null : parseFloat(input);

        // Update labours state only if the input is valid (5 digits or fewer)
        if (input === '' || input.length <= 5) {
            const updatedLabours = labours.map(labour => {
                if (labour.LabourID === labourID) {
                    return { ...labour, variablePay: value };
                }
                return labour;
            });
            setLabours(updatedLabours);
        }
    };


    const handleEffectiveDateChange = (e, labourID) => {
        const updatedLabours = labours.map(labour => {
            if (labour.LabourID === labourID) {
                return { ...labour, effectiveDate: e.target.value };
            }
            return labour;
        });
        setLabours(updatedLabours);
    };



    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <ToastContainer />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
                    Reports | Salary Register
                </Typography>
                <SearchBar
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
    flexWrap: { xs: "wrap", sm: "nowrap" }, // Allows items to wrap on extra small devices
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
    {/* Add Tab components here if needed */}
  </Tabs>

  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" }, // Stacks items vertically on small screens
      alignItems: { xs: "stretch", sm: "center" },
      gap: 2,
      height: "auto",
      width: "100%",
      justifyContent: { xs: "flex-start", sm: "space-between" },
    }}
  >
    <Box
      sx={{
        width: { xs: "100%", sm: "40%" },
        gap: "20px",
        display: "flex",
        flexDirection: "row", // Stack selectors vertically on all sizes
        alignItems: "flex-start",
      }}
    >
      <Select
        value={selectedMonth}
        sx={{ width: "100%" }}
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
        sx={{ width: "100%" }}
        onChange={(e) => setSelectedYear(e.target.value)}
        displayEmpty
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

      <Button
        variant="contained"
        sx={{
          fontSize: { xs: "10px", sm: "13px" },
          height: "40px",
          width: "100%",
          backgroundColor: "rgb(229, 255, 225)",
          color: "rgb(43, 217, 144)",
          "&:hover": {
            backgroundColor: "rgb(229, 255, 225)",
          },
        }}
        onClick={fetchSalaryGenerationForDateMonthAll}
        disabled={loading}
      >
        Fetch Attendance
      </Button>
    </Box>
    <Box
      sx={{
        display: "flex",
        marginRight: "20px",
        flexDirection: { xs: "row", sm: "row" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "auto" },
          display: "flex",
          flexDirection: { xs: "row", sm: "row" },
          gap: "20px",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <ExportVariablePay />
        <ImportVariablePay
          handleToast={handleToast}
          onboardName={user?.name || null}
        />

        <TablePagination
          className="custom-pagination"
          rowsPerPageOptions={[25, 100, 200, { label: "All", value: -1 }]}
          count={labours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  </Box>
</Box>


            <TableContainer
                component={Paper}
                sx={{
                    mb: isMobile ? 6 : 0,
                    overflowX: 'auto',
                    // overflowY: 'auto',
                    borderRadius: 2,
                    boxShadow: 3,
                    maxHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(75vh - 64px)',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
                }}
            >
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
                                <TableCell>Project</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Attendance Count</TableCell>
                                <TableCell>Present Days</TableCell>
                                <TableCell>Total OT Hours</TableCell>
                                <TableCell>Wages Amount</TableCell>
                                <TableCell>Advance Pay</TableCell>
                                <TableCell>Incentive Pay</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>History</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody
                            sx={{
                                '& td': {
                                    padding: '16px 9px',
                                    '@media (max-width: 600px)': { padding: '14px 8px' },
                                },
                            }}
                        >
                            {/* {(rowsPerPage > 0 ? paginatedLabours : filteredLabours).map((labour, index) => ( */}
                            {paginatedLabours.map((labour, index) => (
                                <TableRow key={labour.LabourID}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{labour.LabourID}</TableCell>
                                    <TableCell>{labour.name || '-'}</TableCell>
                                    <TableCell>{labour.businessUnit || '-'}</TableCell>
                                    <TableCell>{labour.departmentName || '-'}</TableCell>
                                    <TableCell>
                                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="pay-structure-label">Select Variable Pay</InputLabel>
                                            <Select
                                                labelId="pay-structure-label"
                                                value={labour.payStructure || ''}
                                                onChange={(e) => handlePayStructureChange(e, labour.LabourID)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Variable Pay
                                                </MenuItem>
                                                <MenuItem value="Advance">Advance</MenuItem>
                                                <MenuItem value="Debit">Debit</MenuItem>
                                                <MenuItem value="Incentive">Incentive</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>

                                    <TableCell>
                                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }} disabled={!labour.payStructure}>
                                            <InputLabel id="remark-label">Select Remark</InputLabel>
                                            <Select
                                                labelId="remark-label"
                                                value={labour.variablePayRemark || ''}
                                                onChange={(e) => handleRemarkChange(e, labour.LabourID)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Remark</MenuItem>
                                                {labour.payStructure ? getRemarksOptions(labour.payStructure).map(variablePayRemark => (
                                                    <MenuItem key={variablePayRemark} value={variablePayRemark}>{variablePayRemark}</MenuItem>
                                                )) : null}
                                            </Select>
                                        </FormControl>
                                    </TableCell>


                                    <TableCell sx={{ mr: 5 }}>
                                        <TextField
                                            id="standard-number"
                                            label="Variable Pay"
                                            type="number"
                                            variant="standard"
                                            fullWidth
                                            value={labour.variablePay || ''}
                                            onChange={(e) => handleVariablePayChange(e, labour.LabourID)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                maxLength: 5  // Restrict max length of input
                                            }}
                                            error={labour.variablePay && labour.variablePay.length > 5}
                                            sx={{ mb: 2 }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            id="effective-date"
                                            label="Effective Date"
                                            type="date"
                                            variant="standard"
                                            fullWidth
                                            value={labour.effectiveDate || new Date().toISOString().split('T')[0]} // Default to today's date if no effective date set
                                            onChange={(e) => handleEffectiveDateChange(e, labour.LabourID)}
                                            InputLabelProps={{
                                                shrink: true, // Ensures the label doesn't overlap with the input value
                                            }}
                                            inputProps={{
                                                readOnly: true, // Makes the date picker read-only
                                            }}
                                            sx={{ mb: 2 }}
                                            required
                                        />
                                    </TableCell>


                                    <TableCell>
                                        <IconButton
                                            color="rgb(239,230,247)"
                                            onClick={() => handleViewHistory(labour.LabourID)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(229, 255, 225)',
                                                color: 'rgb(43, 217, 144)',
                                                width: '100px',
                                                marginRight: '10px',
                                                marginBottom: '3px',
                                                '&:hover': {
                                                    backgroundColor: 'rgb(229, 255, 225)',
                                                },
                                            }}
                                            onClick={() => handleApproved(labour)}
                                            disabled={!labour.payStructure || !labour.variablePayRemark || !labour.variablePay} // Button is disabled if either payStructure or variablePayRemark is not selected
                                        >
                                            Approve
                                        </Button>
                                        {/* <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(239,230,247)',
                                                color: 'rgb(130,54,188)',
                                                '&:hover': { backgroundColor: 'rgb(239,230,247)' },
                                            }}
                                            onClick={() => handleEdit(labour)}
                                        >
                                            Add
                                        </Button> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </TableContainer>


            {/* Modal for Add Variable Pay */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" gutterBottom>
                        Add Variable Pay
                    </Typography>
                    <Typography id="modal-description" gutterBottom>
                        Selected Labour: {selectedLabour?.name || 'Not Selected'}
                    </Typography>
                    <Select
                        fullWidth
                        value={selectedLabour?.payStructure || ''}
                        onChange={(e) => handlePayStructureChange(e, selectedLabour?.LabourID)}
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select Variable Pay
                        </MenuItem>
                        <MenuItem value="Advance">Advance</MenuItem>
                        <MenuItem value="Debit">Debit</MenuItem>
                        <MenuItem value="Incentive">Incentive</MenuItem>
                    </Select>
                    <TextField
                        label="Variable Pay"
                        type="number"
                        fullWidth
                        value={selectedLabour?.variablePay}
                        onChange={(e) => {
                            // Allow only numbers and prevent 'e' or other non-numeric characters
                            const value = e.target.value;
                            if (!isNaN(value) && !value.includes('e')) {
                                handleVariablePayChange(e, selectedLabour.LabourID);
                            }
                        }}
                        sx={{ mb: 2 }}
                    />


                    <TextField
                        label="Effective Date"
                        type="date"
                        fullWidth
                        value={new Date().toISOString().split('T')[0]} // Sets the date to today's date
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            readOnly: true, // Makes the date picker read-only
                        }}
                        sx={{ mb: 2 }}
                        required
                    />

                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={() => setModalOpen(false)}
                            sx={{ width: "45%" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleModalTransfer(selectedLabour)}
                            sx={{ width: "45%" }}
                        >
                            Add Pay
                        </Button>
                    </Box>
                </Box>
            </Modal>


            {/* Dialog for Confirmation */}
            <Dialog open={openDialogSite} onClose={() => setOpenDialogSite(false)}>
                <DialogTitle>Confirm Variable Pay</DialogTitle>
                <DialogContent>
                    <DialogContentText id="EditLabour-dialog-description">
                        Are you sure you want Variable Pay Labour{" "}
                        <span style={{ fontWeight: "bold" }}>{selectedLabour?.name} </span>
                        with JCcode{" "}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDialogSite(false)}
                        variant="outlined"
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmTransfer}
                        sx={{
                            backgroundColor: "rgb(229, 255, 225)",
                            color: "rgb(43, 217, 144)",
                            width: "100px",
                            marginRight: "10px",
                            marginBottom: "3px",
                            "&:hover": {
                                backgroundColor: "rgb(229, 255, 225)",
                            },
                        }}
                        autoFocus
                    >
                        Add Pay
                    </Button>
                </DialogActions>
            </Dialog>


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
                        Variable Pay History Labour ID: {selectedHistory[0]?.LabourID || "N/A"}
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
                                        <strong>Edited By:</strong> {record.payAddedBy || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Effective Date:</strong>{" "}
                                        {record.EffectiveDate
                                            ? new Date(record.EffectiveDate).toLocaleDateString()
                                            : "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Pay Structure:</strong> {record.PayStructure || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Variable pay Amount:</strong> {record.VariablepayAmount || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Variable Pay Remark:</strong> {record.variablePayRemark || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Approval Status:</strong> {record.ApprovalStatusPay || "0"}
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

export default SalaryRegister;   