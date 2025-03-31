
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
    DialogActions, FormControl, InputLabel, Tabs, Grid, Divider, Fade, FormControlLabel, Switch
} from '@mui/material';
import { modalStyle } from '../modalStyles.js';
import { StyleForPayslip } from '../modalStyles.js';
import { StyleEmpInfo } from '../modalStyles.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../../SarchBar/SearchRegister.jsx';
import * as XLSX from 'xlsx';
// import Loading from "../../Loading/Loading.jsx";
import TableSkeletonLoading from "../../Loading/TableSkeletonLoading.jsx";
import { API_BASE_URL } from "../../../Data.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../../UserContext/UserContext.js';
import ExportVariablePay from '../../VariableInputs/ImportExportVariablePay/ExportVariablePay.jsx'
import ViewDetails from '../../ViewDetails/ViewDetails.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import { ArrowBack } from '@mui/icons-material';
import logo from "../../../images/VJlogo-1-removebg.png";
import NoData from "../../../images/NoData.jpg";
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';


const RunPayroll = ({ departments, projectNames, labour, labourlist }) => {
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
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const { user } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const currentDate = new Date();
    // const currentMonth = (currentDate.getMonth() + 1).toString();
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openDialogSite, setOpenDialogSite] = useState(false);
    const [statusesSite, setStatusesSite] = useState({});
    const [navigating, setNavigating] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [fetchForAll, setFetchForAll] = useState(true);
    const [labourId, setLabourId] = useState('');
    const [salaryData, setSalaryData] = useState([]);
    const [noDataAvailable, setNoDataAvailable] = useState(false);
    const [isFinalizeEnabled, setIsFinalizeEnabled] = useState(false);
    const [isFinalizeClicked, setIsFinalizeClicked] = useState(false);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPayStructure, setSelectedPayStructure] = useState('');
    const [employeeToggle, setEmployeeToggle] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [labourData, setLabourData] = useState([]);
    const [isTransferConfirmOpen, setIsTransferConfirmOpen] = useState(false);
    const [isTransferSuccess, setIsTransferSuccess] = useState(false);
    const [selectedLabourIds, setSelectedLabourIds] = useState([]);


    const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
    const handleApproveConfirmOpen = () => {
        setIsApproveConfirmOpen(true);
    };

    const handleApproveConfirmClose = () => {
        setIsApproveConfirmOpen(false);
    };


    const allowedProjectIds =
        user && user.projectNames ? JSON.parse(user.projectNames) : [];
    const allowedDepartmentIds =
        user && user.departments ? JSON.parse(user.departments) : [];
    const laboursSource =
        labourlist && labourlist.length > 0 ? labourlist : labours;

    const fetchLabours = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/labours/getWagesAndLabourOnboardingJoin`,
                {
                    params: filters,
                }
            );
            setLabours(response.data);

        } catch (error) {
            console.error('Error fetching labours:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchLabours();
    // }, []);

    const handleApplyFilter = async () => {
        const params = {};
        if (selectedBusinessUnit) params.businessUnit = selectedBusinessUnit;
        if (selectedDepartment) params.department = selectedDepartment;
        if (selectedPayStructure) params.payStructure = selectedPayStructure;
        if (employeeToggle === 'single' && selectedEmployee) {
            params.employee = selectedEmployee;
        }
    }
    const handleResetFilter = () => {
        setSelectedBusinessUnit('');
        setSelectedDepartment('');
        setSelectedPayStructure('');
        setEmployeeToggle('all');
        setSelectedEmployee('');
        fetchLabours();
        setFilterModalOpen(false);
    };

    const handleApplyFilters = () => {
        const filters = {};
        if (selectedBusinessUnit) {
            filters.ProjectID = selectedBusinessUnit;
        }
        if (selectedDepartment) {
            filters.DepartmentID = selectedDepartment;
        }
        if (selectedPayStructure) {
            filters.PayStructure = selectedPayStructure;
        }
        if (employeeToggle === 'single' && selectedEmployee) {
            filters.employee = selectedEmployee;
        }
        fetchLabours(filters);
        setFilterModalOpen(false);
    };


    //   const fetchProjectNames = async () => {
    //         try {
    //           const response = await axios.get(API_BASE_URL + "/api/project-names");
    //           // Expecting response.data to be an array of projects with properties "Id" and "Business_Unit"
    //           setProjectNames(response.data);
    //         } catch (error) {
    //           console.error('Error fetching project names:', error);
    //           toast.error('Error fetching project names.');
    //         }
    //       };

    // Lookup function to get Business_Unit name based on project id
    const getProjectDescription = (projectNames) => {
        if (!Array.isArray(projectNames) || projectNames.length === 0) {
            return 'Unknown';
        }
        if (projectNames === undefined || projectNames === null || projectNames === '') {
            return 'Unknown';
        }
        // Convert projectId to a number if necessary and find the matching project
        const project = projectNames.find(proj => proj.Id === Number(projectNames));
        return project ? project.Business_Unit : 'Unknown';
    };

    // Extract selectedMonth and selectedYear from navigation state
    // const { selectedMonth, selectedYear } = location.state || {};

    // const fetchLabours = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/insentive/payroll/eligibleLaboursForSalaryGeneration`, {
    //             params: { month: selectedMonth, year: selectedYear },
    //         });
    //         setLabours(response.data);
    //         console.log("response.data .", response.data)
    //     } catch (error) {
    //         console.error('Error fetching labours:', error);
    //         toast.error('Failed to fetch data');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (selectedMonth && selectedYear) {
    //         fetchLabours();
    //     }
    // }, [selectedMonth, selectedYear]);

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
        if (!selectedMonth || !selectedYear) {
            toast.warning('Please select a valid month and year.');
            return;
        }
        setLoading(true);

        const params = { month: selectedMonth, year: selectedYear };
        if (!fetchForAll) {
            params.labourIds = labourId;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/salaryGenerationDataAllLabours`, { params });
            const fetchedData = response.data;
            if (!Array.isArray(fetchedData)) {
                throw new Error('Unexpected data format received from the API.');
            }
            if (fetchedData.length === 0) {
                setLabours([]);
                setSalaryData([]);
                setNoDataAvailable(true);
                return;
            }
            setNoDataAvailable(false);

            const ShowSalaryGeneration = fetchedData.map((labour, index) => {
                return {
                    srNo: index + 1,
                    id: labour.id || 0,
                    LabourID: labour.labourId,
                    name: labour.name || "-",
                    projectName: labour.businessUnit || "-",
                    department: labour.departmentName || "-",
                    aadhaarNumber: labour.aadhaarNumber || "-",
                    accountNumber: labour.accountNumber || "-",
                    attendanceCount: labour.attendanceCount || 0,
                    presentDays: labour.attendance?.presentDays || 0,
                    absentDays: labour.attendance?.absentDays || 0,
                    halfDays: labour.attendance?.halfDays || 0,
                    missPunchDays: labour.attendance?.missPunchDays || 0,
                    normalOvertimeCount: labour.attendance?.normalOvertimeCount || 0,
                    holidayOvertimeCount: labour.attendance?.holidayOvertimeCount || 0,
                    totalHolidaysInMonth: labour.attendance?.totalHolidaysInMonth || 0,
                    holidayOvertimeHours: labour.attendance?.holidayOvertimeHours || 0,
                    holidayOvertimeWages: labour.attendance?.holidayOvertimeWages || 0,
                    totalOvertimeHours: labour.cappedOvertime || 0,
                    derivedPerHour: labour.derivedPerHour || 0,
                    basicSalary: labour.baseWage || 0,
                    overtimePay: labour.overtimePay || 0,
                    holidayOvertimePay: labour.holidayOvertimePay || 0,
                    weeklyOffPay: labour.weeklyOffPay || 0,
                    bonuses: labour.bonuses || 0,
                    previousWageAmount: labour.previousWageAmount || 0,
                    totalAttendanceDeductions: labour.totalAttendanceDeductions || 0,
                    totalDeductions: labour.totalDeductions || 0,
                    baseWage: labour.baseWage || 0,
                    netPay: labour.netPay || 0,
                    // Variable Pay
                    advancePay: labour.variablePay?.advance || 0,
                    advanceRemarks: labour.variablePay?.advanceRemarks || "-",
                    debit: labour.variablePay?.debit || 0,
                    debitRemarks: labour.variablePay?.debitRemarks || "-",
                    incentivePay: labour.variablePay?.incentive || 0,
                    incentiveRemarks: labour.variablePay?.incentiveRemarks || "-",
                    month: labour.month || "-",
                    year: labour.year || "-",
                    // Wages Info
                    wageType: labour.wageType || "-",
                    daysInSlice: labour.daysInSlice || "-",
                    dailyWageRate: labour.dailyWageRate || 0,
                    fixedMonthlyWage: labour.fixedMonthlyWage || 0,
                    totalWagesForMonth: labour.wagesInfo?.totalWagesForMonth || 0,
                    wageBreakdown: labour.wagesInfo?.wageBreakdown || [],
                    fullResponse: labour
                };
            });
            // console.log('ShowSalaryGeneration for month',JSON.stringify(ShowSalaryGeneration))
            setLabours(ShowSalaryGeneration);
            setSalaryData(ShowSalaryGeneration);
        } catch (error) {
            console.error('Error fetching salary generation data:', error);
            setNoDataAvailable(true);
            toast.error(error.response?.data?.message || 'Error fetching salary generation data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedMonth && !selectedYear) {
            fetchSalaryGenerationForDateMonthAll();
        }
    }, [selectedMonth, selectedYear]);
    // useEffect(() => {
    //         fetchSalaryGenerationForDateMonthAll();
    // },[]);


    const exportPayrollData = async (data) => {
        setLoading(true);
        console.log("data ", JSON.stringify(data));
        try {

            const selectiveData = data.map(item => ({
                Month: months.find(m => item.month === m.value)?.label || '',
                Year: item.year,
                Labour_ID: item.LabourID,
                Name: item.name,
                Project_Name: item.projectName,
                Department: item.department,
                AadhaarNumber: item.aadhaarNumber,
                AccountNumber: item.accountNumber,
                Attendance_Count: item.attendanceCount,
                Wage_Type: item.wageType,
                DailyWage_Rate: item.dailyWageRate,
                FixedMonthly_Rate: item.fixedMonthlyWage,
                TotalOvertimeHours: item.totalOvertimeHours,
                Overtime_Pay: item.overtimePay,
                WeeklyOff_Pay: item.weeklyOffPay,
                Gross_Pay: item.grossPay,
                Bonuses: item.bonuses,
                Total_Deductions: item.totalDeductions,
                Net_Pay: item.netPay,
            }));

            const worksheet = XLSX.utils.json_to_sheet(selectiveData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "PayrollData");

            // Generate Excel file as an array buffer
            const workbookOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            const blob = new Blob([workbookOutput], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const fileName = ` Export Provisional PayRoll_${selectedMonth}_${selectedYear}.xlsx`;

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success(`Salary Data Exported successfully`)
        } catch (error) {
            console.error('Error saving final payroll data:', error);
            toast.error(error.message || "Error Salary Data Exported. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    const saveFinalPayrollData = async () => {
        setLoading(true);
        try {
            if (salaryData.length === 0) {
                toast.warning("No salary data available to save.");
                setLoading(false);
                return;
            }
            const response = await axios.post(`${API_BASE_URL}/insentive/insentive/generateMonthlyPayroll`, salaryData);
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error saving final payroll data:', error);
            toast.error(error.response?.data?.message || "Error saving payroll data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    const saveFinalizePayrollData = async () => {
        setIsApproveConfirmOpen(false);
        if (!selectedMonth || !selectedYear) {
            toast.warning("Please select both Month and Year.");
            return;
        }

        setLoading(true);
        try {
            if (salaryData.length === 0) {
                toast.warning("No salary data available to save.");
                setLoading(false);
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/insentive/generateMonthlyPayroll`, {
                month: selectedMonth,
                year: selectedYear,
            });

            toast.success(response.data.message || "Payroll generated successfully.");
        } catch (error) {
            console.error('Error saving payroll data:', error);
            toast.error(error.response?.data?.message || "Error generating payroll. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


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


    function searchLabourData(data, searchQuery) {
        if (!searchQuery) return data; // Return original data if search query is empty

        searchQuery = searchQuery.toLowerCase(); // Convert query to lowercase for case-insensitive search

        return data.filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.LabourID.toLowerCase().includes(searchQuery) ||
            item.projectName.toLowerCase().includes(searchQuery) ||
            item.department.toLowerCase().includes(searchQuery)
        );
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            // const response = await axios.get(`${API_BASE_URL}/labours/searchAttendance?q=${searchQuery}`);
            const data = searchLabourData(labours, searchQuery);
            setSearchResults(data);
            setPage(0);
        } catch (error) {
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

    const filteredLabours = getLatestLabourData(searchResults.length > 0 ? searchResults : labours);
    const paginatedLabours = filteredLabours.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    // const getProjectDescription = (projectId) => {
    //     if (!Array.isArray(projectNames) || projectNames.length === 0) {
    //         return 'Unknown';
    //     }
    //     if (projectId === undefined || projectId === null || projectId === '') {
    //         return 'Unknown';
    //     }
    //     const project = projectNames.find(proj => proj.Id === Number(projectId));
    //     return project ? project.projectName : 'Unknown';
    // };


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
        setOpenDialogSite(false);

        try {

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

    }, [labours]);

    const navigateToSalaryGeneration = () => {
        setNavigating(true);
        navigate('/SalaryRejester', { state: { selectedMonth, selectedYear } });
        // setTimeout(() => {
        //     navigate('/SalaryRejester');
        // }, 1000);
    };

    const closePopup = () => {
        setSelectedLabour(null);
        setIsPopupOpen(false);
    };

    const openPopup = async (labour) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/${labour.id}`);
            const labourDetails = response.data;
            const projectName = getProjectDescription(labourDetails.projectName);
            const department = getDepartmentDescription(labourDetails.department);

            setSelectedLabour({
                ...labourDetails,
                projectName,
                department,
            });
            setIsPopupOpen(true);
        } catch (error) {
            console.error('Error fetching labour details:', error);
            toast.error('Error fetching labour details. Please try again.');
        }
    };


    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <ToastContainer />

            <Box
                sx={{
                    flex: 3,
                    overflowY: "auto",
                    padding: "0px 24px",
                    bgcolor: "#f9f9f9",
                    borderRight: "1px solid #ddd",
                    height: "90vh",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            sx={{ marginRight: 2 }}
                            onClick={navigateToSalaryGeneration} disabled={navigating}
                        >
                            <ArrowBack />
                        </IconButton>

                        <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
                            Reports | Run PayRoll
                        </Typography>
                    </Box>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                        searchResults={searchResults}
                        setSearchResults={setSearchResults}
                        handleSelectLabour={handleSelectLabour}
                        showResults={false}
                        className="search-bar"
                    />
                </Box>


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
                        flexWrap: { xs: "wrap", sm: "nowrap" },
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

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "column" },
                            alignItems: { xs: "stretch", sm: "flex-end" },
                            gap: 2,
                            height: "auto",
                            width: "100%",
                            justifyContent: { xs: "flex-start", sm: "space-between" },
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                gap: "20px",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: "flex-end",
                                justifyContent: "flex-start",
                                // padding: "20px",
                            }}
                        >
                            <Select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                // size="small"
                                displayEmpty
                                sx={{
                                    width: "25%",
                                    marginBottom: { xs: "20px", sm: "0" }
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
                                // size="small"
                                displayEmpty
                                sx={{
                                    // marginTop: '-5px',
                                    width: "25%", // Ensure this also takes full width
                                    marginBottom: { xs: "20px", sm: "0" } // Margin bottom on small screens
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

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={fetchForAll}
                                        onChange={(e) => setFetchForAll(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                sx={{
                                    marginBottom: { xs: "20px", sm: "0" },
                                }}
                            />
                            {!fetchForAll && (
                                <TextField
                                    label="Labour ID"
                                    variant="outlined"
                                    size="small"
                                    value={labourId}
                                    onChange={(e) => setLabourId(e.target.value)}
                                    sx={{
                                        width: "25%", // Full width
                                        marginBottom: { xs: "20px", sm: "0" },  
                                        marginTop: { xs: "0", sm: "5px" }
                                    }}
                                />
                            )}

                            <Button
                                variant="contained"
                                onClick={fetchSalaryGenerationForDateMonthAll}
                                sx={{
                                    fontSize: { xs: "0.8rem", sm: "1rem" }, // Responsive font size
                                    height: "40px",
                                    width: "20%", // Button width to match other inputs
                                    backgroundColor: "rgb(229, 255, 225)",
                                    color: "rgb(43, 217, 144)",
                                    '&:hover': {
                                        backgroundColor: "rgb(229, 255, 225)",
                                    },
                                    marginBottom: { xs: "20px", sm: "0" } // Margin bottom on small screens
                                }}
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
                                 <Button variant="outlined" color="secondary" startIcon={<FilterListIcon />} onClick={() => setFilterModalOpen(true)}>
                                Filter
                            </Button>
                            {selectedLabourIds.length > 0 && (
                                <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={() => setModalOpen(true)}>
                                    Edit ({selectedLabourIds.length})
                                </Button>
                            )}
                                
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
                                    <TableCell>Wages</TableCell>
                                    <TableCell>Total Days</TableCell>
                                    <TableCell>Present Days</TableCell>
                                    <TableCell>Total OT Hours</TableCell>
                                    <TableCell>Overtime Pay</TableCell>
                                    <TableCell>Weekly Off Pay</TableCell>
                                    <TableCell>Bonus</TableCell>
                                    <TableCell>Total Deductions</TableCell>
                                    {/* <TableCell>Basic Salary</TableCell> */}
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={13} align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <TableSkeletonLoading rows={9} columns={13} sx={{ maxWidth: '300px' }} />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : noDataAvailable ? (
                                    <TableRow>
                                        <TableCell colSpan={13} align="center">
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <img
                                                    src={NoData}
                                                    alt="No Data Available"
                                                    style={{ width: "250px", opacity: 0.7 }}
                                                />
                                                <Typography variant="h6" sx={{ mt: 2, color: "#777" }}>
                                                    No labour salary available for this month.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (paginatedLabours.map((labour, index) => (
                                    <TableRow key={labour.LabourID}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        {/* <TableCell>{labour.LabourID}</TableCell> */}
                                        <TableCell
                                            onClick={() => openPopup(labour)} // Open modal with selected labour details
                                            sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                        >
                                            {labour.LabourID}
                                        </TableCell>
                                        <TableCell>{labour.name || '-'}</TableCell>
                                        <TableCell>{labour.projectName || '-'}</TableCell>
                                        <TableCell>{labour.department || '-'}</TableCell>
                                        <TableCell>
                                            {labour.wageType === 'FIXED MONTHLY WAGES'
                                                ? labour.fixedMonthlyWage
                                                : labour.dailyWageRate}
                                        </TableCell>
                                        <TableCell>{labour.daysInSlice}</TableCell>
                                        <TableCell
                                            onClick={() => handleOpenModal(labour)}
                                            sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                        >
                                            {/* {labour.attendanceCount} */}
                                            {(labour.presentDays || 0) + (labour.totalHolidaysInMonth || 0)}
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
                                        {/* <TableCell>{labour.baseWage}</TableCell> */}
                                        {/* <TableCell>{labour.netPay}</TableCell> */}
                                        <TableCell
                                            onClick={() => handleOpenModalNetpay(labour)}
                                            sx={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                                        >
                                            {labour.netPay}
                                        </TableCell>

                                    </TableRow>
                                )))}
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
                            <Typography><strong style={{ marginRight: '25%' }}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                            <Typography><strong style={{ marginRight: '12%' }}>Present Days:</strong> {selectedLabour?.presentDays || 0}</Typography>
                            <Typography><strong style={{ marginRight: '13%' }}>Absent Days:</strong> {selectedLabour?.absentDays || 0}</Typography>
                            <Typography><strong style={{ marginRight: '18.5%' }}>Half Days:</strong> {selectedLabour?.halfDays || 0}</Typography>
                            <Typography><strong style={{ marginRight: '5%' }}>Miss Punch Days:</strong> {selectedLabour?.missPunchDays || 0}</Typography>
                            <Typography><strong style={{ marginRight: '12.5%' }}>Holiday Days:</strong> {selectedLabour?.totalHolidaysInMonth || 0}</Typography>
                        </Box>

                        <Button variant="contained" sx={{
                            mt: 3, float: 'right',
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
                            <Typography><strong style={{ marginRight: '25%' }}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                            <Typography><strong style={{ marginRight: '12%' }}>Incentive:</strong> {selectedLabour?.incentivePay || 0}</Typography>
                            <Typography><strong style={{ marginRight: '13%' }}>Incentive Remarks:</strong> {selectedLabour?.incentiveRemarks || '-'}</Typography>
                        </Box>

                        <Button variant="contained" sx={{
                            mt: 3, float: 'right',
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
                            <Typography><strong style={{ marginRight: '25%' }}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                            <Typography><strong style={{ marginRight: '19%' }}>Advance:</strong> {selectedLabour?.advancePay || 0}</Typography>
                            <Typography><strong style={{ marginRight: '2%' }}>Advance Remarks:</strong> {selectedLabour?.advanceRemarks || '-'}</Typography>
                            <Typography><strong style={{ marginRight: '25.5%' }}>Debit:</strong> {selectedLabour?.debit || 0}</Typography>
                            <Typography><strong style={{ marginRight: '5%' }}>Debit Remarks:</strong> {selectedLabour?.debitRemarks || '-'}</Typography>
                        </Box>

                        <Button variant="contained" sx={{
                            mt: 3, float: 'right',
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
                    <Box sx={modalStyle}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {/* Logo with right-side clipPath */}
                            <Box sx={{
                                width: '50%',
                                backgroundColor: "#E4D3B5",
                                padding: "10px",
                                clipPath: "polygon(0% 0%, 100% 0%, 78% 100%, 0% 100%)",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <img src={logo} alt="SunOrbit" className="payslip-logo" style={{ width: "160px" }} />
                            </Box>

                            {/* Payslip Text with left-top clipped style */}
                            <Box sx={{
                                backgroundColor: "#E4D3B5",
                                marginBottom: '20px',
                                padding: "12px 30px",
                                clipPath: "polygon(19% 0%, 100% 0%, 100% 100%, 0% 100%)",
                                // clipPath: "polygon(100% 0%, 0% 0%, 15% 100%, 100% 100%)",
                                borderRadius: "4px",
                                display: "inline-block"
                            }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Payslip: {months.find(m => m.value === selectedLabour?.month)?.label || "N/A"} {selectedLabour?.year || 0}
                                </Typography>
                            </Box>
                        </Box>


                        <Divider sx={{ my: 2 }} />

                        {/* Net Pay Summary */}
                        <Box textAlign="left" sx={{ display: 'flex', justifyContent: 'flex-end', mr: 3 }}>
                            <Box textAlign="left" sx={{ backgroundColor: "#FFECB3", padding: 2, borderRadius: 2, width: "30%" }}>
                                <Typography variant="h6" fontWeight="bold">Net Pay: ₹{selectedLabour?.netPay || "-"}</Typography>
                                <Typography variant="body2">
                                    Gross Pay (A): <b>₹{selectedLabour?.baseWage || "-"}</b>
                                </Typography>
                                <Typography>
                                    Deductions (B): <b>₹{selectedLabour?.totalDeductions || "0.00"}</b>
                                </Typography>
                            </Box>
                        </Box>

                        {/* Employee Details */}
                        <Box sx={StyleEmpInfo}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography><b>Employee Code:</b> {selectedLabour?.LabourID || "-"}</Typography>
                                    <Typography><b>Name:</b> {selectedLabour?.name || "-"}</Typography>
                                    <Typography><b>Business Unit:</b> {selectedLabour?.projectName || "-"}</Typography>
                                    <Typography><b>Department:</b> {selectedLabour?.department || "-"}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><b>Aadhar No:</b> {selectedLabour?.aadhaarNumber || "-"}</Typography>
                                    <Typography><b>Account No:</b> {selectedLabour?.accountNumber || "-"}</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Attendance Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Attendance Count (A)</Typography>
                        </Box>
                        <Box sx={{ mt: 0, padding: '10px 30px' }}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor: "#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Total Days</b></TableCell>
                                            <TableCell><b>Present Days</b></TableCell>
                                            <TableCell><b>Half Days</b></TableCell>
                                            <TableCell><b>Absent Days</b></TableCell>
                                            <TableCell><b>MissPunch Days</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.daysInSlice || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.presentDays || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.halfDays || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.absentDays || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.missPunchDays || "-"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Wages Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Wages Count (B)</Typography>
                        </Box>
                        <Box sx={{ mt: 0, padding: '10px 30px' }}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor: "#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Wages Type</b></TableCell>
                                            <TableCell><b>Daily Wages</b></TableCell>
                                            <TableCell><b>Fixed Monthly Wages</b></TableCell>
                                            <TableCell><b>Weekly Off</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.wageType || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.dailyWageRate || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.fixedMonthlyWage || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.fixedMonthlyWage || "0.00"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Gross Pay Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Gross Pay (C)</Typography>
                        </Box>
                        <Box sx={{ mt: 0, padding: '10px 30px' }}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor: "#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Earnings Pay</b></TableCell>
                                            <TableCell><b>Monthly Bonus</b></TableCell>
                                            <TableCell><b>Monthly Deduction</b></TableCell>
                                            <TableCell><b>Total</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.basicSalary || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.bonuses || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.totalDeductions || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.netPay || "0.00"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Deductions Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Deductions (D)</Typography>
                        </Box>
                        <Box sx={{ mt: 0, padding: '10px 30px' }}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor: "#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Debit</b></TableCell>
                                            <TableCell><b>Debit Remarks</b></TableCell>
                                            <TableCell><b>Advance</b></TableCell>
                                            <TableCell><b>Advance Remarks</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.debit || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.debitRemarks || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.advance || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.advanceRemarks || "-"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Action Buttons */}
                        <Box display="flex" justifyContent="center" gap={2} sx={{ m: "20px 0px" }}>
                            <Button variant="contained" color="primary">Download</Button>
                            {/* <Button variant="contained" color="secondary">View Details</Button> */}
                            <Button
                                variant="contained"
                                className="modal-close-button"
                                onClick={handleCloseModalNetpay}
                            >
                                Close
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

            </Box>

            <Box
                sx={{
                    flex: 1,
                    paddingTop: 3,
                    bgcolor: "#f5f6fa", // Light background color for sidebar
                    boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
                    overflowY: "auto", // Enable vertical scrolling
                    maxWidth: "260px",
                    height: "90vh",
                    display: "flex",
                    padding: "0px 10px",
                    flexDirection: "column",
                    alignItems: "center",
                    scrollbarWidth: "none", // Firefox hides scrollbar
                    "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, and Edge hide scrollbar
                    },
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ margin: "70px 0px 20px 0px" }}
                >


                    <Box
                        sx={{
                            width: "100%",
                            gap: "20px",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "column" }, // Stack selectors vertically on smaller screens, horizontally on larger
                            alignItems: "center", // Center align items for better visual alignment
                            justifyContent: "flex-start", // Align items to the start of the container
                            padding: "20px", // Add some padding around the controls for spacing
                        }}
                    >
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            displayEmpty
                            sx={{
                                width: "100%", // Full width to fill the container space
                                marginBottom: { xs: "20px", sm: "0" } // Add bottom margin on small screens
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
                            sx={{
                                width: "100%", // Ensure this also takes full width
                                marginBottom: { xs: "20px", sm: "0" } // Margin bottom on small screens
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
                        <Typography variant="h4" sx={{ fontSize: '15px', lineHeight: 1.435, background: '#d89d9d', padding: '15px' }}>
                            Finalize your payroll to view the required amount.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => {
                                exportPayrollData(salaryData);
                                setIsFinalizeEnabled(prev => !prev); // toggle finalize enabled/disabled
                            }}
                            sx={{
                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                height: "40px",
                                width: "100%",
                                backgroundColor: "#EFE6F7",
                                color: "#8236BC",
                                '&:hover': {
                                    backgroundColor: "#EFE6F7",
                                },
                                marginBottom: { xs: "20px", sm: "0" }
                            }}
                        >
                            Export PayRoll
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => {
                                handleApproveConfirmOpen();
                                setIsFinalizeClicked(true); // permanently disable after 1st click
                            }}
                            disabled={!isFinalizeEnabled || isFinalizeClicked}
                            sx={{
                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                height: "40px",
                                width: "100%",
                                backgroundColor: "rgb(229, 255, 225)",
                                color: "rgb(43, 217, 144)",
                                '&:hover': {
                                    backgroundColor: "rgb(229, 255, 225)",
                                },
                                marginBottom: { xs: "20px", sm: "0" },
                                opacity: (!isFinalizeEnabled || isFinalizeClicked) ? 0.5 : 1,
                                cursor: (!isFinalizeEnabled || isFinalizeClicked) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Finalize PayRoll
                        </Button>


                    </Box>



                </Box>
            </Box>

            <Dialog
                open={isApproveConfirmOpen}
                onClose={handleApproveConfirmClose}
                aria-labelledby="approve-confirm-dialog-title"
                aria-describedby="approve-confirm-dialog-description"
            >
                <DialogTitle id="approve-confirm-dialog-title">
                    Finalize PayRoll
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="approve-confirm-dialog-description">
                        Are you sure you want to Finalize PayRoll this labours?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleApproveConfirmClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={saveFinalizePayrollData}
                        sx={{
                            backgroundColor: 'rgb(229, 255, 225)',
                            color: 'rgb(43, 217, 144)',
                            width: 'auto',
                            marginRight: '10px',
                            marginBottom: '3px',
                            '&:hover': {
                                backgroundColor: 'rgb(229, 255, 225)',
                            },
                        }} autoFocus
                    >
                        Finalize PayRoll
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


            {/* ===== FILTER MODAL ===== */}
            <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Filter Options
                        </Typography>
                        <Button onClick={() => setFilterModalOpen(false)}>
                            <CloseIcon />
                        </Button>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">Business Unit</Typography>
                        <Select
                            fullWidth
                            value={selectedBusinessUnit}
                            onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                            displayEmpty
                            sx={{ mt: 1 }}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {Array.isArray(projectNames) && projectNames.length > 0 ? (
                                projectNames.map((project) => (
                                    <MenuItem key={project.Id} value={project.Id}>
                                        {project.Business_Unit}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="Unknown" disabled>
                                    No Projects Available
                                </MenuItem>
                            )}
                        </Select>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">Department</Typography>
                        <Select
                            fullWidth
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            displayEmpty
                            sx={{ mt: 1 }}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {Array.isArray(departments) && departments.length > 0 ? (
                                departments.map((department) => (
                                    <MenuItem key={department.Id} value={department.Id}>
                                        {department.Description}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="Unknown" disabled>
                                    No Department Available
                                </MenuItem>
                            )}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" color="secondary" onClick={handleResetFilter}>
                            Reset
                        </Button>
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
                            onClick={handleApplyFilters}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={isPopupOpen}
                onClose={closePopup}
                closeAfterTransition
            >
                <Fade in={isPopupOpen}>
                    <div className="modal">
                        {selectedLabour && (
                            <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
                        )}
                    </div>
                </Fade>
            </Modal>
        </Box>
    );
};

export default RunPayroll;

