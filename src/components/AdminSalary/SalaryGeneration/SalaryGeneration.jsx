
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
    DialogActions, FormControl, InputLabel, Tabs, Grid, Divider
} from '@mui/material';
import { modalStyle } from '../modalStyles.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../../SarchBar/SearchRegister';
import Loading from "../../Loading/Loading.jsx";
import { API_BASE_URL } from "../../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../../UserContext/UserContext';
import ExportVariablePay from '../../VariableInputs/ImportExportVariablePay/ExportVariablePay'
import ImportVariablePay from '../../VariableInputs/ImportExportVariablePay/ImportVariablePay'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import { parse } from "fast-xml-parser";
import "../salaryRegister.css";
import logo from "../../../images/vjlogo.png";

const SalaryGeneration = ({ departments, projectNames = [], labour }) => {
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
    const [modalOpenBonus, setModalOpenBonus] = useState(false);
    const [modalOpenDeduction, setModalOpenDeduction] = useState(false);
    const [modalOpenNetpay, setModalOpenNetpay] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const { user } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    // const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openDialogSite, setOpenDialogSite] = useState(false);
    const [statusesSite, setStatusesSite] = useState({});
    const [effectiveDate, setEffectiveDate] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    // Extract selectedMonth and selectedYear from navigation state
    const { selectedMonth, selectedYear } = location.state || {};

    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/eligibleLaboursForSalaryGeneration`, {
                params: { month: selectedMonth, year: selectedYear },
            });
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
        if (selectedMonth && selectedYear) {
            fetchLabours();
        }
    }, [selectedMonth, selectedYear]);

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



    const fetchSalaryGenerationForDateMonthAll = async () => {
        setLoading(true);
        if (!selectedMonth || !selectedYear) {
            toast.warning('Please select a valid month and year.');
            setLoading(false); 
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/salaryGenerationDataAllLabours`, {
                params: { month: selectedMonth, year: selectedYear },
            });
            const salaryData = response.data;
            if (!Array.isArray(salaryData)) {
                throw new Error('Unexpected data format received from the API.');
            }
            if (salaryData.length === 0) {
                setAttendanceData([]); 
                return;
            }

            const ShowSalaryGeneration = salaryData.map((labour, index) => {
                return {
                    srNo: index + 1,
                    LabourID: labour.labourId,
                    name: labour.name || "-",
                    projectName: labour.businessUnit || "-",
                    department: labour.departmentName || "-",
                    attendanceCount: labour.attendanceCount || 0,
                    presentDays: labour.presentDays || 0,
                    absentDays: labour.absentDays || 0,
                    halfDays: labour.halfDays || 0,
                    totalOvertimeHours: labour.cappedOvertime || 0,
                    basicSalary: labour.basicSalary || 0,
                    overtimePay: labour.overtimePay || 0,
                    weeklyOffPay: labour.weeklyOffPay || 0,
                    bonuses: labour.bonuses || 0,
                    totalDeductions: labour.totalDeductions || 0,
                    grossPay: labour.grossPay || 0,
                    netPay: labour.netPay || 0,
                    advancePay: labour.advance || 0,
                    advanceRemarks: labour.advanceRemarks || "-",
                    debit: labour.debit || 0,
                    debitRemarks: labour.debitRemarks || "-",
                    incentivePay: labour.incentive || 0,
                    incentiveRemarks: labour.incentiveRemarks || "-",
                    month: labour.month || "-",
                    year: labour.year || "-",
                    wageType: labour.wageType || "-",
                    dailyWageRate: labour.dailyWageRate || 0,
                    fixedMonthlyWage: labour.fixedMonthlyWage || 0,  
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


    // -------------------------------------   SHOW ATTENDACNE ----------------------
    const handleOpenModal = (labour) => {
        setSelectedLabour(labour);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedLabour(null);
        setModalOpen(false);
    };
    // ------------------------------------- SHOW BONUS ----------------------
    const handleOpenModalBonus = (labour) => {
        setSelectedLabour(labour);
        setModalOpenBonus(true);
    };

    const handleCloseModalBonus = () => {
        setSelectedLabour(null);
        setModalOpenBonus(false);
    };
    // -------------------------------------   SHOW DEDUCTION ----------------------
    const handleOpenModalDeduction = (labour) => {
        setSelectedLabour(labour);
        setModalOpenDeduction(true);
    };

    const handleCloseModalDeduction = () => {
        setSelectedLabour(null);
        setModalOpenDeduction(false);
    };
// -------------------------------------   NET PAY ----------------------
    const handleOpenModalNetpay = (labour) => {
        setSelectedLabour(labour);
        setModalOpenNetpay(true);
    };

    const handleCloseModalNetpay = () => {
        setSelectedLabour(null);
        setModalOpenNetpay(false);
    };
// -----------------------------------------------------------------------------

    const handleCancel = () => {
        setModalOpen(false); 
        setModalOpenBonus(false);
        setModalOpenDeduction(false);
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
        setModalOpenBonus(true);
        setModalOpenDeduction(true);
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

    const filteredLabours = getLatestLabourData(attendanceData);
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
        setModalOpen(false); 
        setModalOpenBonus(false);
        setModalOpenDeduction(false);
        setOpenDialogSite(true); 
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

                toast.info(`Labour ${selectedLabour.name} Variable Pay sent for Admin Approval`);
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


    // const [selectedLabour, setSelectedLabour] = useState(null);
    // const [isModalOpen, setModalOpen] = useState(false);

    // const handleOpenModal = (labour) => {
    //     setSelectedLabour(labour);
    //     setModalOpen(true);
    // };

    // const handleCloseModal = () => {
    //     setSelectedLabour(null);
    //     setModalOpen(false);
    // };



    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <ToastContainer />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
                    Reports | Salary Generation
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
                        {/* <Select
                            value={selectedMonth}
                            sx={{ width: "100%" }}
                            // onChange={(e) => setSelectedMonth(e.target.value)}
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
                            // onChange={(e) => setSelectedYear(e.target.value)}
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
                        </Select> */}

                        <Button
                            variant="contained"
                            sx={{
                                fontSize: { xs: "10px", sm: "13px" },
                                height: "40px",
                                width: "40%",
                                backgroundColor: "rgb(229, 255, 225)",
                                color: "rgb(43, 217, 144)",
                                "&:hover": {
                                    backgroundColor: "rgb(229, 255, 225)",
                                },
                            }}
                            onClick={fetchSalaryGenerationForDateMonthAll}
                            // disabled={loading}
                        >
                            PayRoll
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
                                <TableCell>Total OT Hours</TableCell>
                                <TableCell>Overtime Pay</TableCell>
                                <TableCell>Weekly Off Pay</TableCell>
                                <TableCell>Bonuse</TableCell>
                                <TableCell>Total Deductions</TableCell>
                                <TableCell>Basic Salary</TableCell>
                                <TableCell>Net Pay</TableCell>
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
                                    <TableCell>{labour.projectName || '-'}</TableCell>
                                    <TableCell>{labour.department || '-'}</TableCell>
                                    <TableCell
                                        onClick={() => handleOpenModal(labour)}
                                        sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                    >
                                        {labour.attendanceCount}
                                    </TableCell>
                                    <TableCell>{labour.totalOvertimeHours}</TableCell>
                                    <TableCell>{labour.overtimePay}</TableCell>
                                    <TableCell>{labour.weeklyOffPay}</TableCell>
                                    <TableCell
                                        onClick={() => handleOpenModalBonus(labour)}
                                        sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                    >
                                        {labour.bonuses}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => handleOpenModalDeduction(labour)}
                                        sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                    >
                                        {labour.totalDeductions}
                                    </TableCell>
                                    <TableCell>{labour.grossPay}</TableCell>
                                    {/* <TableCell>{labour.netPay}</TableCell> */}
                                    <TableCell
                                        onClick={() => handleOpenModalNetpay(labour)}
                                        sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                    >
                                        {labour.netPay}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </TableContainer>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="attendance-details-modal">
               <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                        Labour ID: {selectedLabour?.LabourID || "N/A"}
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                        <Typography><strong  style={{ marginRight:'25%'}}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                        <Typography><strong style={{ marginRight:'12%'}}>Present Days:</strong> {selectedLabour?.presentDays || 0}</Typography>
                        <Typography><strong style={{ marginRight:'13%'}}>Absent Days:</strong> {selectedLabour?.absentDays || 0}</Typography>
                        <Typography><strong style={{ marginRight:'18.5%'}}>Half Days:</strong> {selectedLabour?.halfDays || 0}</Typography>
                        <Typography><strong style={{ marginRight:'5%'}}>Miss Punch Days:</strong> {selectedLabour?.missPunchDays || 0}</Typography>
                    </Box>

                    <Button variant="contained"       sx={{ mt:3, float:'right',
                                backgroundColor: '#fce4ec',
                                color: 'rgb(255, 100, 100)',
                                width: '100px',
                                '&:hover': {
                                    backgroundColor: '#f8bbd0',
                                },
                            }} onClick={handleCloseModal}>
                        Close
                    </Button>
                </Box>
            </Modal>

{/* --------------------------------------------------------------------------- */}
<Modal open={modalOpenBonus} onClose={() => setModalOpenBonus(false)} aria-labelledby="attendance-details-modal">
               <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                        Labour ID: {selectedLabour?.LabourID || "N/A"}
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                        <Typography><strong  style={{ marginRight:'25%'}}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                        <Typography><strong style={{ marginRight:'12%'}}>Incentive:</strong> {selectedLabour?.incentivePay || 0}</Typography>
                        <Typography><strong style={{ marginRight:'13%'}}>Incentive Remarks:</strong> {selectedLabour?.incentiveRemarks || '-'}</Typography>
                    </Box>

                    <Button variant="contained"       sx={{mt:3, float:'right',
                                backgroundColor: '#fce4ec',
                                color: 'rgb(255, 100, 100)',
                                width: '100px',
                                '&:hover': {
                                    backgroundColor: '#f8bbd0',
                                },
                            }} onClick={handleCloseModalBonus}>
                        Close
                    </Button>
                </Box>
            </Modal>
{/* --------------------------------------------------------------------------- */}
<Modal open={modalOpenDeduction} onClose={() => setModalOpenDeduction(false)} aria-labelledby="attendance-details-modal">
               <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                        Labour ID: {selectedLabour?.LabourID || "N/A"}
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                        <Typography><strong  style={{ marginRight:'25%'}}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                        <Typography><strong style={{ marginRight:'19%'}}>Advance:</strong> {selectedLabour?.advancePay || 0}</Typography>
                        <Typography><strong style={{ marginRight:'2%'}}>Advance Remarks:</strong> {selectedLabour?.advanceRemarks || '-'}</Typography>
                        <Typography><strong style={{ marginRight:'25.5%'}}>Debit:</strong> {selectedLabour?.debit || 0}</Typography>
                        <Typography><strong style={{ marginRight:'5%'}}>Debit Remarks:</strong> {selectedLabour?.debitRemarks || '-'}</Typography>
                    </Box>

                    <Button variant="contained"       sx={{mt:3, float:'right',
                                backgroundColor: '#fce4ec',
                                color: 'rgb(255, 100, 100)',
                                width: '100px',
                                '&:hover': {
                                    backgroundColor: '#f8bbd0',
                                },
                            }} onClick={handleCloseModalDeduction}>
                        Close
                    </Button>
                </Box>
            </Modal>
{/* --------------------------------------------------------------------------- */}

<Modal open={modalOpenNetpay} onClose={handleCloseModalNetpay} aria-labelledby="attendance-details-modal">
      <Box sx={modalStyle} className="payslip-modal">
        <Box display="flex" justifyContent="space-between" alignItems="center" className="payslip-header">
          <img src={logo} alt="SunOrbit" className="payslip-logo" />
          <Typography variant="h6" fontWeight="bold">
            Payslip: {months.find(m => m.value === selectedLabour?.month)?.label || "N/A"}  {selectedLabour?.year|| 0}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box textAlign="center" className="payslip-summary">
  <Typography 
    variant="h4" 
    fontWeight="bold" 
    sx={{ color: selectedLabour?.netPay ? "#4CAF50" : "gray" }} // Green for Net Pay
  >
    Net Pay: {selectedLabour?.netPay || "N/A"}
  </Typography>
  <Typography variant="body1">
    Gross Pay (A): 
    <b style={{ color: "#1E88E5" }}> {selectedLabour?.grossPay || "N/A"} </b> | 
    Deductions (B): 
    <b style={{ color: "#D32F2F" }}> {selectedLabour?.totalDeductions || "N/A"} </b>
  </Typography>
</Box>


        <Grid container spacing={2} className="payslip-grid">
          <Grid item xs={6}>
            <Typography><b>Employee Code:</b> {selectedLabour?.LabourID || "N/A"}</Typography>
            <Typography><b>Name:</b> {selectedLabour?.name || "N/A"}</Typography>
            <Typography><b>Business Unit:</b> {selectedLabour?.projectName || "N/A"}</Typography>
            <Typography><b>Department:</b> {selectedLabour?.department || "N/A"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><b>Aadhar Number:</b> {selectedLabour?.pan || "N/A"}</Typography>
            <Typography><b>UAN:</b> {selectedLabour?.uan || "N/A"}</Typography>
            <Typography><b>Account No:</b> {selectedLabour?.accountNo || "N/A"}</Typography>
            <Typography><b>IFSC Code:</b> {selectedLabour?.ifscCode || "N/A"}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

<Typography variant="h6" fontWeight="bold">Attendance Count (A)</Typography>
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><b>Total Days</b></TableCell>
        <TableCell><b>Present Days</b></TableCell>
        <TableCell><b>Present Days</b></TableCell>
        <TableCell><b>Half Days</b></TableCell>
        <TableCell><b>Miss Punch Days</b></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
          <TableCell>{selectedLabour?.attendanceCount || 0}</TableCell>
          <TableCell>{selectedLabour?.presentDays || 0}</TableCell>
          <TableCell>{selectedLabour?.absentDays || 0}</TableCell>
          <TableCell>{selectedLabour?.halfDays || 0}</TableCell>
          <TableCell>{selectedLabour?.missPunchDays || 0}</TableCell>
      {/* )) || <TableRow><TableCell colSpan={3}>No earnings data available.</TableCell></TableRow> */}
    </TableBody>
  </Table>
</TableContainer>
{/* ----------------------------------------------------------------------------------- */}

<Divider sx={{ my: 2 }} />

<Typography variant="h6" fontWeight="bold">Wages Count (B)</Typography>
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><b>Wages Type</b></TableCell>
        <TableCell><b>Daily Wages</b></TableCell>
        <TableCell><b>Fix monthly wages</b></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
          <TableCell>{selectedLabour?.wageType || "N/A"}</TableCell>
          <TableCell>{selectedLabour?.dailyWageRate || 0}</TableCell>
          <TableCell>{selectedLabour?.fixedMonthlyWage || 0}</TableCell>
      {/* )) || <TableRow><TableCell colSpan={3}>No earnings data available.</TableCell></TableRow> */}
    </TableBody>
  </Table>
</TableContainer>


        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight="bold">Gross Pay (C)</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Earnings Pay</b></TableCell>
                <TableCell><b>Monthly Bonus</b></TableCell>
                <TableCell><b>Total</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                  <TableCell>{selectedLabour?.basicSalary || "N/A"}</TableCell>
                  <TableCell>{selectedLabour?.bonuses || "N/A"}</TableCell>
                  <TableCell>{selectedLabour?.netPay || "N/A"}</TableCell>
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight="bold">Deductions (D)</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Debit</b></TableCell>
                <TableCell><b>Debit Remark </b></TableCell>
                <TableCell><b>Advance</b></TableCell>
                <TableCell><b>Advance Remarks</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                  <TableCell>{selectedLabour?.debit || 0}</TableCell>
                  <TableCell>{selectedLabour?.debitRemarks || "N/A"}</TableCell>
                  <TableCell>{selectedLabour?.advance || 0}</TableCell>
                  <TableCell>{selectedLabour?.advanceRemarks || "N/A"}</TableCell>
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          className="modal-close-button"
          onClick={handleCloseModalNetpay}
          sx={{mt:2, float:'right'}}
        >
          Close
        </Button>
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
                         Labour ID: {selectedHistory[0]?.LabourID || "N/A"}
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

export default SalaryGeneration;   