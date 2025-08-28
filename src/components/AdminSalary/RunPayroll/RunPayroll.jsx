import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField,
    TablePagination, Select, MenuItem, Modal, Typography, IconButton, Dialog, DialogTitle, DialogContent,
    DialogContentText, Checkbox, ListItemText, DialogActions, FormControlLabel, Switch, Tooltip, Grid, Divider, Fade
} from '@mui/material';
import { modalStyle, StyleForPayslip, StyleEmpInfo } from '../modalStyles.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../../SarchBar/SearchRegister.jsx';
import * as XLSX from 'xlsx';
import TableSkeletonLoading from "../../Loading/TableSkeletonLoading.jsx";
import { API_BASE_URL } from "../../../Data.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../../UserContext/UserContext.js';
import ViewDetails from '../../ViewDetails/ViewDetails.jsx';
import CloseIcon from "@mui/icons-material/Close";
import { ArrowBack } from '@mui/icons-material';
import logo from "../../../images/VJlogo-1-removebg.png";
import NoData from "../../../images/NoData.jpg";
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';

const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

function searchLabourData(data, searchQuery) {
    if (!searchQuery) return data;
    searchQuery = searchQuery.toLowerCase();
    return data.filter(item =>
        item.name?.toLowerCase().includes(searchQuery) ||
        item.LabourID?.toLowerCase().includes(searchQuery) ||
        item.projectName?.toLowerCase().includes(searchQuery) ||
        item.department?.toLowerCase().includes(searchQuery)
    );
}

const RunPayroll = ({ departments, projectNames, labourlist }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useUser();
    const navigate = useNavigate();

    // State
    const [labours, setLabours] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openDialogSite, setOpenDialogSite] = useState(false);
    const [navigating, setNavigating] = useState(false);
    const [fetchForAll, setFetchForAll] = useState(true);
    const [labourId, setLabourId] = useState('');
    const [salaryData, setSalaryData] = useState([]);
    const [noDataAvailable, setNoDataAvailable] = useState(false);
    const [isFinalizeEnabled, setIsFinalizeEnabled] = useState(false);
    const [isFinalizeClicked, setIsFinalizeClicked] = useState(false);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
    const [selectedLabourIds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);

    // Memoized computed flags
    const hasMonthYear = useMemo(() => Boolean(selectedMonth) && Boolean(selectedYear), [selectedMonth, selectedYear]);
    const hasBU = useMemo(() => Array.isArray(selectedBusinessUnit) && selectedBusinessUnit.length > 0, [selectedBusinessUnit]);
    const hasLabourId = useMemo(() => !fetchForAll && String(labourId ?? "").trim().length > 0, [fetchForAll, labourId]);
    const canClickPayroll = useMemo(() => hasLabourId || (fetchForAll && hasMonthYear && hasBU), [hasLabourId, fetchForAll, hasMonthYear, hasBU]);
    const isDisabled = !canClickPayroll;

    // Tooltip for Payroll button
    const tooltipTitle = useMemo(() => {
        if (!isDisabled) return "";
        if (!fetchForAll) return "Enter a Labour ID or switch to All to use Month/Year/BU.";
        const missing = [];
        if (!hasMonthYear) missing.push("month & year");
        if (!hasBU) missing.push("business unit");
        return `Select ${missing.join(" and ")}.`;
    }, [isDisabled, fetchForAll, hasMonthYear, hasBU]);

    // Fetch business units on mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/projectDeviceStatus`)
            .then(res => setBusinessUnits(res.data))
            .catch(() => toast.error('Error fetching business units.'));
    }, []);

    // Fetch salary data
    const fetchSalaryGenerationForDateMonthAll = useCallback(async () => {
        if (!selectedMonth || !selectedYear) {
            toast.warning('Please select a valid month and year.');
            return;
        }
        setLoading(true);
        const params = { month: selectedMonth, year: selectedYear };
        if (!fetchForAll) params.labourIds = labourId;
        if (selectedBusinessUnit.length > 0) params.projectId = selectedBusinessUnit.join(',');
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/salaryGenerationDataAllLabours`, { params });
            const fetchedData = response.data;
            if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
                setLabours([]); setSalaryData([]); setNoDataAvailable(true); return;
            }
            setNoDataAvailable(false);

            const ShowSalaryGeneration = fetchedData.map((labour, index) => {
                return {
                    srNo: index + 1,
                    id: labour.id || 0,
                    LabourID: labour.labourId,
                    name: labour.name || "-",
                    projectId: labour.projectName || "-",
                    departmentId: labour.department || "-",
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
                    totalHolidaysConsider: labour.attendance?.totalHolidaysConsider || 0,
                    sundayPayment: labour.attendance?.sundayPayment || 0,
                    additionalPresent: labour.attendance?.additionalPresent || 0,
                    additionalHalf: labour.attendance?.additionalHalf || 0,
                    // additionalAbsent: labour.attendance?.additionalAbsent || 0,
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
            console.log('ShowSalaryGeneration for month', JSON.stringify(ShowSalaryGeneration))
            setLabours(ShowSalaryGeneration);
            setSalaryData(ShowSalaryGeneration);
        } catch (error) {
            setNoDataAvailable(true);
            toast.error(error.response?.data?.message || 'Error fetching salary generation data.');
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear, fetchForAll, labourId, selectedBusinessUnit]);

    // Fetch salary data on filter change
    useEffect(() => {
        if (selectedMonth && selectedYear) fetchSalaryGenerationForDateMonthAll();
    }, [selectedMonth, selectedYear, selectedBusinessUnit, fetchSalaryGenerationForDateMonthAll]);

    // Filter helpers
    const isAllSelected = useMemo(() => projectNames.length > 0 && selectedBusinessUnit.length === projectNames.length, [projectNames, selectedBusinessUnit]);
    const isAllSelectedDep = useMemo(() => departments.length > 0 && selectedDepartment.length === departments.length, [departments, selectedDepartment]);

    const handleBusinessUnitChange = (event) => {
        const value = event.target.value;
        if (value.includes('ALL')) {
            setSelectedBusinessUnit(isAllSelected ? [] : projectNames.map(p => p.Id));
        } else {
            setSelectedBusinessUnit(value);
        }
    };
    const handleDepartmentChange = (event) => {
        const value = event.target.value;
        if (value.includes('ALL')) {
            setSelectedDepartment(isAllSelectedDep ? [] : departments.map(d => d.Id));
        } else {
            setSelectedDepartment(value);
        }
    };
    const handleResetFilter = () => {
        setSelectedBusinessUnit([]);
        setSelectedDepartment([]);
        setLabours(salaryData);
        setFilterModalOpen(false);
        setFilteredData([]);
    };
    const handleApplyFilters = () => {
        const projectFilter = selectedBusinessUnit.map(Number);
        const departmentFilter = selectedDepartment.map(Number);
        const filtered = labours.filter(item =>
            (projectFilter.length === 0 || projectFilter.includes(Number(item.projectId))) &&
            (departmentFilter.length === 0 || departmentFilter.includes(Number(item.departmentId)))
        );
        setFilteredData(filtered);
        setFilterModalOpen(false);
    };

    // Search
    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setSearchResults(searchLabourData(labours, searchQuery));
            setPage(0);
            setLoading(false);
        }, 200);
    }, [searchQuery, labours]);

    // Table pagination
    const handlePageChange = (e, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    // Filter data to only include the latest entry per LabourID
    const filteredLabours = useMemo(() => {
        const latestEntries = {};
        (searchResults.length > 0 ? searchResults : labours).forEach((labour) => {
            if (!latestEntries[labour.LabourID] ||
                new Date(labour.CreatedAt) > new Date(latestEntries[labour.LabourID].CreatedAt)) {
                latestEntries[labour.LabourID] = labour;
            }
        });
        return Object.values(latestEntries);
    }, [searchResults, labours]);

    const paginatedLabours = useMemo(() => {
        const data = filteredData.length > 0 ? filteredData : filteredLabours;
        return data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }, [filteredData, filteredLabours, page, rowsPerPage]);

    // Export Payroll
    const exportPayrollData = async (data) => {
        setLoading(true);
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
                presentDays: item.wageType === 'FIXED MONTHLY WAGES'
                    ? (item.presentDays + item.additionalPresent + item.additionalHalf)
                    : (item.presentDays + item.totalHolidaysInMonth + item.additionalPresent + item.additionalHalf),
                Wage_Type: item.wageType,
                DailyWage_Rate: item.dailyWageRate,
                FixedMonthly_Rate: item.fixedMonthlyWage,
                TotalOvertimeHours: item.totalOvertimeHours,
                Overtime_Pay: item.overtimePay,
                WeeklyOff_Pay: item.weeklyOffPay,
                Gross_Pay: item.fullResponse.grossPay,
                Insentive: item.bonuses,
                Advance: item.advancePay,
                Debit: item.debit,
                Total_Deduction: item.totalDeductions,
                Net_Pay: item.netPay,
            }));
            const worksheet = XLSX.utils.json_to_sheet(selectiveData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "PayrollData");
            const workbookOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([workbookOutput], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const fileName = `Export_Provisional_PayRoll_${selectedMonth}_${selectedYear}.xlsx`;
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success(`Salary Data Exported successfully`);
        } catch (error) {
            toast.error(error.message || "Error Salary Data Exported. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Finalize Payroll
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
            toast.error(error.response?.data?.message || "Error generating payroll. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Modal handlers
    const handleOpenModal = (labour) => { setSelectedLabour(labour); setModalOpen(true); };
    const handleCloseModal = () => { setSelectedLabour(null); setModalOpen(false); };
    const handleOpenModalBonus = (labour) => { setSelectedLabour(labour); setModalOpenBonus(true); };
    const handleCloseModalBonus = () => { setSelectedLabour(null); setModalOpenBonus(false); };
    const handleOpenModalDeduction = (labour) => { setSelectedLabour(labour); setModalOpenDeduction(true); };
    const handleCloseModalDeduction = () => { setSelectedLabour(null); setModalOpenDeduction(false); };
    const handleOpenModalNetpay = (labour) => { setSelectedLabour(labour); setModalOpenNetpay(true); };
    const handleCloseModalNetpay = () => { setSelectedLabour(null); setModalOpenNetpay(false); };

    // Popup for ViewDetails
    const closePopup = () => { setSelectedLabour(null); setIsPopupOpen(false); };
    const openPopup = async (labour) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/labours/${labour.id}`);
            setSelectedLabour({ ...response.data });
            setIsPopupOpen(true);
        } catch {
            toast.error('Error fetching labour details. Please try again.');
        }
    };

    // Navigation
    const navigateToSalaryGeneration = () => {
        setNavigating(true);
        navigate('/SalaryRejester', { state: { selectedMonth, selectedYear } });
    };

    // Approve confirm dialog
    const handleApproveConfirmOpen = () => setIsApproveConfirmOpen(true);
    const handleApproveConfirmClose = () => setIsApproveConfirmOpen(false);

    // Render
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <ToastContainer />
            {/* Main Content */}
            <Box sx={{
                flex: 3, overflowY: "auto", padding: "0px 24px", bgcolor: "#f9f9f9",
                borderRight: "1px solid #ddd", height: "90vh", scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" }
            }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton sx={{ marginRight: 2 }} onClick={navigateToSalaryGeneration} disabled={navigating}>
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
                        handleSelectLabour={setSelectedLabour}
                        showResults={false}
                        className="search-bar"
                    />
                </Box>


             {/* === Top: Filters / Selects === */}
<Box
  sx={{
    display: "flex",
    alignItems: "flex-end",
    gap: 2,
    // force ONE row on sm+ (no wrapping); allow wrap only on xs
    flexWrap: { xs: "wrap", sm: "nowrap" },
    overflowX: { xs: "visible", sm: "auto" }, // scroll horizontally instead of creating a 3rd line
    pb: 1,
  }}
>
  <Select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
    displayEmpty
    sx={{ minWidth: 140, "& .MuiSelect-select": { py: 1.25 } }}
  >
    <MenuItem value="" disabled>Select Month</MenuItem>
    {months.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
  </Select>

  <Select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    displayEmpty
    sx={{ minWidth: 140, "& .MuiSelect-select": { py: 1.25 } }}
  >
    <MenuItem value="" disabled>Select Year</MenuItem>
    {[2024, 2025].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
  </Select>

  <FormControl sx={{ minWidth: 200 }}>
    <InputLabel id="business-unit-label">Business Unit</InputLabel>
    <Select
      labelId="business-unit-label"
      label="Business Unit"
      multiple
      value={selectedBusinessUnit}
      onChange={handleBusinessUnitChange}
      displayEmpty
      renderValue={(selected) => {
        if (!selected || selected.length === 0) return <em>All</em>;
        const selectedLabels = projectNames
          .filter(p => selected.includes(p.Id))
          .map(p => p.Business_Unit);
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 32, overflowY: "auto" }}>
            {selectedLabels.map((label) => <Chip key={label} label={label} size="small" />)}
          </Box>
        );
      }}
      MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
      sx={{ "& .MuiSelect-select": { py: 1.25 } }}
    >
      <MenuItem value="ALL">
        <Checkbox
          checked={isAllSelected}
          indeterminate={selectedBusinessUnit.length > 0 && !isAllSelected}
        />
        <ListItemText primary="Select All" />
      </MenuItem>
      {Array.isArray(projectNames) && projectNames.length > 0 ? (
        projectNames.map((project) => (
          <MenuItem key={project.Id} value={project.Id}>
            <Checkbox checked={selectedBusinessUnit.includes(project.Id)} />
            <ListItemText primary={project.Business_Unit} />
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Projects Available</MenuItem>
      )}
    </Select>
  </FormControl>

  <FormControlLabel
    sx={{ ml: 1 }}
    control={
      <Switch
        checked={fetchForAll}
        onChange={(e) => setFetchForAll(e.target.checked)}
        color="primary"
      />
    }
  />

  {!fetchForAll && (
    <TextField
      label="Labour ID"
      variant="outlined"
      size="small"
      value={labourId}
      onChange={(e) => setLabourId(e.target.value)}
      sx={{ minWidth: 150, "& .MuiInputBase-input": { py: 1.25, fontWeight: 500 } }}
    />
  )}

  <Tooltip title={tooltipTitle} arrow disableHoverListener={canClickPayroll} sx={{ ml: "auto" }}>
    <span>
      <Button
        variant="contained"
        onClick={fetchSalaryGenerationForDateMonthAll}
        disabled={isDisabled}
        disableElevation
        sx={{
          height: 44,
          px: 3,
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 2,
          letterSpacing: 0.2,
          transition: "transform 120ms ease",
          background: isDisabled
            ? "linear-gradient(0deg, #e0e0e0, #e0e0e0)"
            : "linear-gradient(90deg, #1db954, #00c896)",
          color: isDisabled ? "#9e9e9e" : "#ffffff",
          boxShadow: isDisabled ? "none" : "0 6px 16px rgba(0,0,0,0.15)",
          "&:hover": {
            transform: isDisabled ? "none" : "translateY(-1px)",
            background: isDisabled
              ? "linear-gradient(0deg, #e0e0e0, #e0e0e0)"
              : "linear-gradient(90deg, #19a64c, #00b785)",
          },
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        aria-disabled={isDisabled}
      >
        PayRoll
      </Button>
    </span>
  </Tooltip>
</Box>

{/* === Bottom: Filter / Edit / Pagination row === */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: { xs: "space-between", sm: "flex-end" },
    gap: 1.5,
    // force ONE row here too
    flexWrap: { xs: "wrap", sm: "nowrap" },
    pt: 0.5,
  }}
>
  <Button
    variant="outlined"
    color="secondary"
    startIcon={<FilterListIcon />}
    onClick={() => setFilterModalOpen(true)}
    sx={{ height: 40, px: 2 }}
  >
    Filter
  </Button>

  {selectedLabourIds.length > 0 && (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<EditIcon />}
      onClick={() => setModalOpen(true)}
      sx={{ height: 40, px: 2 }}
    >
      Edit ({selectedLabourIds.length})
    </Button>
  )}

  <TablePagination
    component="div"
    rowsPerPageOptions={[25, 100, 200, { label: "All", value: -1 }]}
    count={filteredData.length > 0 ? filteredData.length : labours.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handlePageChange}
    onRowsPerPageChange={handleRowsPerPageChange}
    sx={{
      ml: "auto",
      height: 40,
      "& .MuiTablePagination-toolbar": {
        minHeight: 40,
        px: 0,
        gap: 1,
        flexWrap: "nowrap",
      },
      "& .MuiTablePagination-selectLabel": {
        mr: 1,
        display: { xs: "none", sm: "inline-flex" },
      },
      "& .MuiTablePagination-displayedRows": {
        ml: 1,
        minWidth: 120,
      },
      "& .MuiTablePagination-select": { py: 0.5 },
      "& .MuiInputBase-root": { height: 34, mt: "-2px" },
      "& .MuiTablePagination-actions": { ml: 0.5 },
    }}
  />
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
                                <TableRow sx={{
                                    '& th': {
                                        padding: '12px', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 1,
                                    }
                                }}>
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
                                    <TableCell>Insentive</TableCell>
                                    <TableCell>Advance</TableCell>
                                    <TableCell>Debit</TableCell>
                                    <TableCell>Gross Salary</TableCell>
                                    <TableCell>Net Salary</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={16} align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <TableSkeletonLoading rows={9} columns={13} sx={{ maxWidth: '300px' }} />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : noDataAvailable ? (
                                    <TableRow>
                                        <TableCell colSpan={16} align="center">
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <img src={NoData} alt="No Data Available" style={{ width: "250px", opacity: 0.7 }} />
                                                <Typography variant="h6" sx={{ mt: 2, color: "#777" }}>
                                                    No labour salary available for this month.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (paginatedLabours.map((labour, index) => (
                                    <TableRow key={labour.LabourID}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell onClick={() => openPopup(labour)} sx={{ cursor: "pointer", color: "blue" }}>
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
                                        <TableCell onClick={() => handleOpenModal(labour)} sx={{ cursor: "pointer", color: "blue" }}>
                                            {labour.totalHolidaysConsider > 0
                                                ? ((labour.presentDays || 0) + (labour.totalHolidaysInMonth || 0) + (labour.additionalPresent || 0) + (labour.additionalHalf || 0))
                                                : ((labour.presentDays || 0) + (labour.additionalPresent || 0) + (labour.additionalHalf || 0))}
                                        </TableCell>
                                        <TableCell>{labour.totalOvertimeHours}</TableCell>
                                        <TableCell>{labour.overtimePay}</TableCell>
                                        <TableCell>{labour.weeklyOffPay}</TableCell>
                                        <TableCell onClick={() => handleOpenModalBonus(labour)} sx={{ cursor: "pointer", color: "blue" }}>
                                            {labour.bonuses}
                                        </TableCell>
                                        <TableCell onClick={() => handleOpenModalDeduction(labour)} sx={{ cursor: "pointer", color: "blue" }}>
                                            {labour.advancePay}
                                        </TableCell>
                                        <TableCell onClick={() => handleOpenModalDeduction(labour)} sx={{ cursor: "pointer", color: "blue" }}>
                                            {labour.debit}
                                        </TableCell>
                                        <TableCell>{labour.fullResponse.grossPay}</TableCell>
                                        <TableCell onClick={() => handleOpenModalNetpay(labour)} sx={{ cursor: "pointer", color: "blue" }}>
                                            {labour.netPay}
                                        </TableCell>
                                    </TableRow>
                                )))}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
                {/* Modals */}
                <Modal open={modalOpen} onClose={handleCloseModal}>
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

<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 1,
  }}
>
  <Typography>
    <strong style={{ marginRight: "25%" }}>Name:</strong>{" "}
    {selectedLabour?.name || "N/A"}
  </Typography>

  <Typography>
    <strong style={{ marginRight: "12%" }}>Present Days:</strong>{" "}
    {(selectedLabour?.presentDays || 0) +
      (selectedLabour?.additionalPresent || 0)}
  </Typography>

  <Typography>
    <strong style={{ marginRight: "13%" }}>Absent Days:</strong>{" "}
    {selectedLabour?.absentDays || 0}
  </Typography>

  <Typography>
    <strong style={{ marginRight: "18.5%" }}>Half Days:</strong>{" "}
    {(selectedLabour?.halfDays || 0) +
      (selectedLabour?.additionalHalf || 0)}
  </Typography>

  <Typography>
    <strong style={{ marginRight: "5%" }}>Miss Punch Days:</strong>{" "}
    {selectedLabour?.missPunchDays || 0}
  </Typography>

  <Typography>
    <strong style={{ marginRight: "12.5%" }}>Holiday Days:</strong>{" "}
    {selectedLabour?.totalHolidaysInMonth || 0}
  </Typography>

  <Typography>
    <strong style={{ marginRight: "13.5%" }}>Total Days:</strong>{" "}
    {(selectedLabour?.presentDays || 0) +
      (selectedLabour?.additionalPresent || 0) +
      (selectedLabour?.absentDays || 0) +
      (selectedLabour?.halfDays || 0) +
      (selectedLabour?.additionalHalf || 0) +
      (selectedLabour?.missPunchDays || 0) + (selectedLabour?.totalHolidaysInMonth || 0)}
  </Typography>
</Box>




                        {/* <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}>
                            <Typography><strong style={{ marginRight: '25%' }}>Name:</strong> {selectedLabour?.name || "N/A"}</Typography>
                            <Typography><strong style={{ marginRight: '12%' }}>Present Days:</strong> {(selectedLabour?.presentDays || 0) + (selectedLabour?.additionalPresent || 0) - (selectedLabour?.totalHolidaysConsider || 0)}</Typography>
                            <Typography><strong style={{ marginRight: '13%' }}>Absent Days:</strong> {selectedLabour?.absentDays || 0}</Typography>
                            <Typography><strong style={{ marginRight: '18.5%' }}>Half Days:</strong> {(selectedLabour?.halfDays || 0) - (selectedLabour?.additionalHalf || 0)}</Typography>
                            <Typography><strong style={{ marginRight: '5%' }}>Miss Punch Days:</strong> {selectedLabour?.missPunchDays || 0}</Typography>
                            <Typography><strong style={{ marginRight: '12.5%' }}>Holiday Days:</strong> {selectedLabour?.totalHolidaysInMonth || 0}</Typography>
                            <Typography><strong style={{ marginRight: '13.5%' }}>Total Days:</strong> {(selectedLabour?.presentDays || 0) + (selectedLabour?.additionalPresent || 0) - (selectedLabour?.totalHolidaysConsider || 0) + (selectedLabour?.absentDays || 0) + (selectedLabour?.halfDays || 0) + (selectedLabour?.missPunchDays || 0) + (selectedLabour?.totalHolidaysInMonth || 0)}</Typography>
                        </Box> */}

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
                <Modal open={modalOpenBonus} onClose={handleCloseModalBonus}>
                    <Box sx={{
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                        width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{ mb: 4, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
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
                <Modal open={modalOpenDeduction} onClose={handleCloseModalDeduction}>
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
                <Modal open={modalOpenNetpay} onClose={handleCloseModalNetpay}>
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
                                <Typography variant="h6" fontWeight="bold">Net Salary: ₹{selectedLabour?.netPay || "-"}</Typography>
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
                                            <TableCell><b>Overtime Pay</b></TableCell>
                                            <TableCell><b>Monthly Bonus</b></TableCell>
                                            <TableCell><b>Monthly Deduction</b></TableCell>
                                            <TableCell><b>Total</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.basicSalary || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.overtimePay || "0.00"}</TableCell>
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
                            <Button variant="contained" className="modal-close-button" onClick={handleCloseModalNetpay}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
                {/* ViewDetails Modal */}
                <Modal open={isPopupOpen} onClose={closePopup} closeAfterTransition>
                    <Fade in={isPopupOpen}>
                        <div className="modal">
                            {selectedLabour && (
                                <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
                            )}
                        </div>
                    </Fade>
                </Modal>
                {/* Filter Modal */}
                <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" gutterBottom>Filter Options</Typography>
                            <Button onClick={() => setFilterModalOpen(false)}><CloseIcon /></Button>
                        </Box>
                        {/* Business Unit */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1">Business Unit</Typography>
                            <Select
                                fullWidth multiple value={selectedBusinessUnit} onChange={handleBusinessUnitChange} displayEmpty
                                renderValue={selected => {
                                    if (selected.length === 0) return <em>All</em>;
                                    const selectedLabels = projectNames.filter(project => selected.includes(project.Id)).map(project => project.Business_Unit);
                                    return selectedLabels.join(', ');
                                }} sx={{ mt: 1 }}
                            >
                                <MenuItem value="ALL">
                                    <Checkbox checked={isAllSelected} indeterminate={selectedBusinessUnit.length > 0 && !isAllSelected} />
                                    <ListItemText primary="Select All" />
                                </MenuItem>
                                {projectNames.map((project) => (
                                    <MenuItem key={project.Id} value={project.Id}>
                                        <Checkbox checked={selectedBusinessUnit.includes(project.Id)} />
                                        <ListItemText primary={project.Business_Unit} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        {/* Department */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1">Department</Typography>
                            <Select
                                fullWidth multiple value={selectedDepartment} onChange={handleDepartmentChange} displayEmpty
                                renderValue={selected => {
                                    if (selected.length === 0) return <em>All</em>;
                                    const selectedLabels = departments.filter(dept => selected.includes(dept.Id)).map(dept => dept.Description);
                                    return selectedLabels.join(', ');
                                }} sx={{ mt: 1 }}
                            >
                                <MenuItem value="ALL">
                                    <Checkbox checked={isAllSelectedDep} indeterminate={selectedDepartment.length > 0 && !isAllSelectedDep} />
                                    <ListItemText primary="Select All" />
                                </MenuItem>
                                {departments.map((department) => (
                                    <MenuItem key={department.Id} value={department.Id}>
                                        <Checkbox checked={selectedDepartment.includes(department.Id)} />
                                        <ListItemText primary={department.Description} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" color="secondary" onClick={handleResetFilter}>
                                Reset
                            </Button>
                            <Button variant="contained" sx={{
                                backgroundColor: "rgb(229, 255, 225)", color: "rgb(43, 217, 144)", width: "100px",
                                marginRight: "10px", marginBottom: "3px", "&:hover": { backgroundColor: "rgb(229, 255, 225)" },
                            }} onClick={handleApplyFilters}>
                                Apply
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            {/* Sidebar */}
            <Box sx={{
                flex: 1, paddingTop: 3, bgcolor: "#f5f6fa", boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
                overflowY: "auto", maxWidth: "260px", height: "90vh", display: "flex", padding: "0px 10px",
                flexDirection: "column", alignItems: "center", scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
            }}>
                <Box display="flex" justifyContent="center" sx={{ margin: "70px 0px 20px 0px" }}>
                    <Box sx={{
                        width: "100%", gap: "20px", display: "flex", flexDirection: { xs: "column", sm: "column" },
                        alignItems: "center", justifyContent: "flex-start", padding: "20px",
                    }}>
                        <Select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} displayEmpty sx={{ width: "100%", marginBottom: { xs: "20px", sm: "0" } }}>
                            <MenuItem value="" disabled>
                                Select Month
                            </MenuItem>
                            {months.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} displayEmpty sx={{ width: "100%", marginBottom: { xs: "20px", sm: "0" } }}>
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
                                setIsFinalizeEnabled(prev => !prev);
                            }}
                            sx={{
                                fontSize: { xs: "0.8rem", sm: "1rem" }, height: "40px", width: "100%",
                                backgroundColor: "#EFE6F7", color: "#8236BC", '&:hover': { backgroundColor: "#EFE6F7" },
                                marginBottom: { xs: "20px", sm: "0" }
                            }}
                        >
                            Export PayRoll
                        </Button>
                        {(user.userType === 'admin' || user.userType === 'superadmin') && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleApproveConfirmOpen();
                                    setIsFinalizeClicked(true);
                                }}
                                disabled={!isFinalizeEnabled || isFinalizeClicked}
                                sx={{
                                    fontSize: { xs: "0.8rem", sm: "1rem" }, height: "40px", width: "100%",
                                    backgroundColor: "rgb(229, 255, 225)", color: "rgb(43, 217, 144)",
                                    '&:hover': { backgroundColor: "rgb(229, 255, 225)" },
                                    marginBottom: { xs: "20px", sm: "0" },
                                    opacity: (!isFinalizeEnabled || isFinalizeClicked) ? 0.5 : 1,
                                    cursor: (!isFinalizeEnabled || isFinalizeClicked) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Finalize PayRoll
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
            {/* Approve Confirm Dialog */}
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
            {/* History Modal */}
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
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}>
                    {/* Modal Header with Title and Close Button */}
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

                    {/* Business Unit Filter using projectNames from props */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">Business Unit</Typography>
                        <Select
                            fullWidth
                            multiple
                            value={selectedBusinessUnit}
                            onChange={handleBusinessUnitChange}
                            displayEmpty
                            renderValue={(selected) => {
                                if (selected.length === 0) return <em>All</em>;
                                const selectedLabels = projectNames
                                    .filter(project => selected.includes(project.Id))
                                    .map(project => project.Business_Unit);
                                return selectedLabels.join(', ');
                            }}
                            sx={{ mt: 1 }}
                        >
                            <MenuItem value="ALL">
                                <Checkbox checked={isAllSelected} indeterminate={selectedBusinessUnit.length > 0 && !isAllSelected} />
                                <ListItemText primary="Select All" />
                            </MenuItem>
                            {projectNames.map((project) => (
                                <MenuItem key={project.Id} value={project.Id}>
                                    <Checkbox checked={selectedBusinessUnit.includes(project.Id)} />
                                    <ListItemText primary={project.Business_Unit} />
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">Department</Typography>
                        <Select
                            fullWidth
                            multiple
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                            displayEmpty
                            renderValue={(selected) => {
                                if (selected.length === 0) return <em>All</em>;
                                const selectedLabels = departments
                                    .filter(dept => selected.includes(dept.Id))
                                    .map(dept => dept.Description);
                                return selectedLabels.join(', ');
                            }}
                            sx={{ mt: 1 }}
                        >
                            <MenuItem value="ALL">
                                <Checkbox checked={isAllSelectedDep} indeterminate={selectedDepartment.length > 0 && !isAllSelectedDep} />
                                <ListItemText primary="Select All" />
                            </MenuItem>
                            {departments.map((department) => (
                                <MenuItem key={department.Id} value={department.Id}>
                                    <Checkbox checked={selectedDepartment.includes(department.Id)} />
                                    <ListItemText primary={department.Description} />
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Modal Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" color="secondary" onClick={handleResetFilter}>
                            Reset
                        </Button>
                        <Button variant="contained" sx={{
                            backgroundColor: "rgb(229, 255, 225)", color: "rgb(43, 217, 144)", width: "100px",
                            marginRight: "10px", marginBottom: "3px", "&:hover": { backgroundColor: "rgb(229, 255, 225)" },
                        }} onClick={handleApplyFilters}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default RunPayroll;

