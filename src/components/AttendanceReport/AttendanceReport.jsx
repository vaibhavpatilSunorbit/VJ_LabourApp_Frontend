import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Tabs, Typography, TableFooter, Modal,
    Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchRegister';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import "./attendanceReport.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircleIcon from '@mui/icons-material/Circle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useUser } from '../../UserContext/UserContext';
import dayjs from 'dayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ImportAttendance from './ImportExportAttendance/ImportAttendance';
import ExportAttendance from './ImportExportAttendance/ExportAttendance';
import CloseIcon from '@mui/icons-material/Close'
import SyncIcon from '@mui/icons-material/Sync';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';

const AttendanceReport = ({ departments, labour, labourlist }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState(labourlist || []);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [searchResults, setSearchResults] = useState([]);
    const [totalOvertimehours, setTotalOvertimehours] = useState(0);
    const [totalOvertimeminute, setTotalOvertimeminute] = useState(0);
    const [projectNames, setProjectNames] = useState([]);
    const [totalOvertimehoursManually, setTotalOvertimehoursManually] = useState(0);
    const [totalOvertimeminuteManually, setTotalOvertimeminuteManually] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [selectedLabourId, setSelectedLabourId] = useState('');
    const [editManualDialogOpen, setEditManualDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [manualEditData, setManualEditData] = useState({
        status: "",
        punchIn: "",
        punchOut: "",
        overtime: "",
        remark: "",
        shift: ""
    });
    const [error, setError] = useState(null);
    const [filteredIconLabours, setFilteredIconLabours] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [projectName, setProjectName] = useState('');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isOvertimeDisable, setIsOvertimeDisable] = useState(false);
    const [isOvertimeError, setIsOvertimeError] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedLabourIds, setSelectedLabourIds] = useState([]);
  const [employeeToggle, setEmployeeToggle] = useState('all');
 const [selectedEmployee, setSelectedEmployee] = useState('');
 const [filters, setFilters] = useState({});
 const [laboursAttenadance, setLaboursAttenadance] = useState([]);

// -----------------------------------------------------  FILTER START ------------------

    // const allowedProjectIds = user && user.projectIds ? JSON.parse(user.projectIds) : [];
    // const allowedDepartmentIds = user && user.departmentIds ? JSON.parse(user.departmentIds) : [];

    const allowedProjectIds =
    user && user.projectIds ? JSON.parse(user.projectIds) : [];
const allowedDepartmentIds =
    user && user.departmentIds ? JSON.parse(user.departmentIds) : [];
const laboursSource =
    labourlist && labourlist.length > 0 ? labourlist : labours;

    const fetchLaboursAttenadance = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/labours/getAttendanceReportAndLabourOnboardingJoin`,
                { params: filters }
            );
    
            console.log("Filtered Attendance Response", response.data);
    
            const uniqueLaboursMap = new Map();
    console.log("uniqueLaboursMap", uniqueLaboursMap);
            response.data.forEach(item => {
                if (!uniqueLaboursMap.has(item.LabourID)) {
                    uniqueLaboursMap.set(item.LabourID, {
                        LabourID: item.LabourID,
                        name: item.name,
                        projectName: item.projectName,
                        department: item.department,
                        workingHours: item.workingHours || item.Shift,
                        businessUnit: item.businessUnit,
                        departmentName: item.departmentName,
                        status: 'Approved', 
                        PresentDays: item.PresentDays,
                        AbsentDays: item.AbsentDays,
                        HalfDays: item.HalfDays,
                        Overtime: item.RoundOffTotalOvertime
                    });
                }
            });
    
            const uniqueLabours = Array.from(uniqueLaboursMap.values());
    console.log("uniqueLabours", uniqueLabours);
            setLaboursAttenadance(response.data);
            setLabours(uniqueLabours);
    
        } catch (error) {
            console.error('Error fetching labours:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };
    


            // setAttendanceData(response.data);
            // setLabours(uniqueLabours); 
    //     } catch (error) {
    //         console.error('Error fetching labours:', error);
    //         toast.error('Failed to fetch data');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    

useEffect(() => {
    // fetchLaboursAttenadance();
    fetchProjectNames();
}, []);

// const handleApplyFilter = async () => {
//     const params = {};
//     if (selectedBusinessUnit) params.businessUnit = selectedBusinessUnit;
//     if (selectedDepartment) params.department = selectedDepartment;
//     if (employeeToggle === 'single' && selectedEmployee) {
//         params.employee = selectedEmployee;
//     }
// }
const handleResetFilter = () => {
    setSelectedBusinessUnit('');
    setSelectedDepartment('');
    fetchLaboursAttenadance();
    setFilterModalOpen(false);
};

const handleApplyFilters = () => {
    const filters = {};
    if (selectedBusinessUnit) {
      filters.projectName = selectedBusinessUnit;
    }
    if (selectedDepartment) {
      filters.department = selectedDepartment;
    }
    if (employeeToggle === 'single' && selectedEmployee) {
      filters.employee = selectedEmployee;
    }
    fetchLaboursAttenadance(filters);
    setFilterModalOpen(false);
  };

// ----------------------------------------------     FILTER END ------------------

    const laboursToDisplay = (
        labours
    )
        .filter((labour) => {
            if (tabValue === 0) return labour.status === 'Pending';
            if (tabValue === 1) return labour.status === 'Approved';
            if (tabValue === 2)
                return (
                    labour.status === 'Rejected' ||
                    labour.status === 'Resubmitted' ||
                    labour.status === 'Disable'
                );
            return true;
        })
        .filter((labour) => {
            const labourProjectId = Number(labour.projectName);
            const labourDepartmentId = Number(labour.department);
            return (
                allowedProjectIds.includes(labourProjectId) &&
                allowedDepartmentIds.includes(labourDepartmentId)
            );
        })
        .sort((a, b) => b.labourID - a.labourID);

    function formatOvertime(Overtime) {
        Overtime = Overtime ?? 0;
        let hours = Math.floor(Overtime);
        let minutes = Math.floor((Overtime - hours) * 60);

        if (minutes < 15) {
            minutes = 0;
        } else if (minutes < 45) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }
        return { hours, minutes };
    }

    function formatConvertedOverTime(Overtime) {
        Overtime = Overtime ?? 0;
        let hours = Math.floor(Overtime);
        let minutes = Math.round((Overtime - hours) * 60);

        return { hours, minutes };
    }

    function formatConvertedOvertimemanually(Overtimemanually) {
        Overtimemanually = Overtimemanually ?? 0;
        let hours = Math.floor(Overtimemanually);
        let minutes = Math.round((Overtimemanually - hours) * 60);

        return { hours, minutes };
    }



    function formatTotalHours(TotalHours) {
        TotalHours = TotalHours ?? 0;
        let hours = Math.floor(TotalHours);
        let minutes = Math.floor((TotalHours - hours) * 60);

        if (minutes < 15) {
            minutes = 0;
        } else if (minutes < 45) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }

        return { hours, minutes };
    }

    function formatOvertimeManually(Overtimemanually) {
        Overtimemanually = Overtimemanually ?? 0;
        let hours = Math.floor(Overtimemanually);
        let minutes = Math.floor((Overtimemanually - hours) * 60);

        if (minutes < 15) {
            minutes = 0;
        } else if (minutes < 45) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }
        return { hours, minutes };
    }


    function formatTotalOvertime(TotalOvertimeHours) {
        let hours = Math.floor(TotalOvertimeHours);
        let minutes = Math.floor((TotalOvertimeHours - hours) * 60);

        if (minutes < 15) {
            minutes = 0;
        } else if (minutes < 45) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }

        return { hours, minutes };
    };

    function formatRoundOffTotalOvertime(TotalOvertimeHoursManually) {
        let hours = Math.floor(TotalOvertimeHoursManually);
        let minutes = Math.floor((TotalOvertimeHoursManually - hours) * 60);

        if (minutes < 15) {
            minutes = 0;
        } else if (minutes < 45) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }

        return { hours, minutes };
    };

    function formatovertimemanually(overtimemanually) {
        overtimemanually = overtimemanually ?? 0;
        let hours = Math.floor(overtimemanually);
        let minutes = Math.floor((overtimemanually - hours) * 60);

        if (minutes < 15) {
            minutes = 0;
        } else if (minutes < 45) {
            minutes = 30;
        } else {
            minutes = 0;
            hours += 1;
        }

        return hours + (minutes / 60);
    };

    useEffect(() => {
        if (manualEditData) {
            const shiftHours =
                manualEditData.shift === "FLEXI SHIFT - 9 HRS" ? 9 : 8;

            const commonDate = manualEditData.date;

            const getPunchTime = (punch, dateStr) => {
                let timeString = "";
                if (typeof punch === "string") {
                    timeString = punch;
                } else if (typeof punch === "object" && punch.$d) {
                    const d = new Date(punch.$d);
                    const hours = d.getHours().toString().padStart(2, "0");
                    const minutes = d.getMinutes().toString().padStart(2, "0");
                    const seconds = d.getSeconds().toString().padStart(2, "0");
                    timeString = `${hours}:${minutes}:${seconds}`;
                }
                return new Date(`${dateStr}T${timeString}`);
            };

            const firstPunchTime = getPunchTime(manualEditData.punchIn, commonDate);
            const lastPunchTime = getPunchTime(manualEditData.punchOut, commonDate);


            const todaysHrs =
                (lastPunchTime.getTime() - firstPunchTime.getTime()) /
                (1000 * 60 * 60);

            setIsOvertimeDisable(todaysHrs < shiftHours);
            const totalGetOvertime = todaysHrs - shiftHours;
            setIsOvertimeError(totalGetOvertime > manualEditData.overtimemanually);
        }
    }, [manualEditData]);


    const handleManualEditDialogOpen = (day) => {
        setSelectedDay(day);
        setManualEditData({
            AttendanceId: day.attendanceId || "",
            date: day.date,
            punchIn: day.firstPunch || "",
            punchOut: day.lastPunch || "",
            overtime: day.overtime || "",
            overtimemanually: day.overtimemanually || "",
            remark: day.remark || "",
            attendanceStatus: day.status || "",
            isFinalPayAvailable: day.isFinalPayAvailable || "",
            shift: day.Shift || ""
        });
        setEditManualDialogOpen(true);
    };

    const handleManualEditDialogClose = () => {
        setEditManualDialogOpen(false);
    };


    const handleSaveManualEdit = async () => {
        try {
            if (manualEditData.status === 'weeklyOff') {
                const wagesResponse = await axios.get(`${API_BASE_URL}/users/monthlyWages`, {
                    params: { labourId: selectedDay.labourId }
                });
                const wagesData = wagesResponse.data;
                // console.log("wagesData", wagesData);

                if (!wagesData || wagesData.length === 0) {
                    toast.error("Add the wages for that labour then add mark as weeklyOff");
                    return;
                }
                const latestLabourWageRecord = wagesData
                    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                [0];

                if (!latestLabourWageRecord) {
                    toast.error("Add the wages for that labour then add mark as weeklyOff");
                    return;
                }

                if (latestLabourWageRecord.PayStructure === "DAILY WAGES") {
                    toast.error("The selected labour is DAILY WAGES it cannot add weeklyOff");
                    return;
                }
            }


            if (manualEditData.overtimeManually > manualEditData.overtime || Number(manualEditData.overtimeManually) > 4) {
                toast.error("Overtime manually cannot greater than system overtime or exceed 4 hours.");
                return;
            }
            const defaultTime = (manualEditData.status === 'absent' || manualEditData.status === 'weeklyOff') ? '00:00:00' : null;

            const formattedPunchInDayFormat = dayjs(manualEditData.punchIn, 'HH:mm:ss');
            const formattedPunchOutDayFormat = dayjs(manualEditData.punchOut, 'HH:mm:ss');

            const formattedPunchIn = defaultTime ? defaultTime : manualEditData.punchIn !== "" && formattedPunchInDayFormat.isValid()
                ? formattedPunchInDayFormat.format('HH:mm:ss')
                : defaultTime;

            const formattedPunchOut = defaultTime ? defaultTime : manualEditData.punchOut !== "" && formattedPunchOutDayFormat.isValid()
                ? formattedPunchOutDayFormat.format('HH:mm:ss')
                : defaultTime;

            const overtime = manualEditData.overtime ? String(manualEditData.overtime).trim() : '';
            const hasOvertime = overtime !== '';
            const hasPunchInOrOut = formattedPunchIn || formattedPunchOut;

            if (!hasOvertime && !hasPunchInOrOut) {
                toast.error('At least provide Overtime or Punch In/Out details to save.');
                return;
            }

            const onboardName = user.name || null;
            const workingHours = manualEditData.workingHours || selectedDay.workingHours;
            const AttendanceStatus = manualEditData.attendanceStatus || null;
            const payload = {
                labourId: selectedDay.labourId,
                date: selectedDay.date,
                AttendanceId: manualEditData.AttendanceId || "",
                ...(formattedPunchIn && { firstPunchManually: formattedPunchIn }),
                ...(formattedPunchOut && { lastPunchManually: formattedPunchOut }),
                ...(hasOvertime && { overtimeManually: manualEditData.overtimeManually }),
                ...(manualEditData.remark && { remarkManually: manualEditData.remark }),
                workingHours,
                ...(onboardName && { onboardName }), AttendanceStatus,
                markWeeklyOff: manualEditData.status === 'weeklyOff',
            };


            const response = await axios.post(`${API_BASE_URL}/labours/upsertAttendance`, payload);

            const updatedAttendanceData = attendanceData.map((day) =>
                day.date === selectedDay.date
                    ? {
                        ...day,
                        ...(formattedPunchIn && { firstPunch: formattedPunchIn }),
                        ...(formattedPunchOut && { lastPunch: formattedPunchOut }),
                        ...(hasOvertime && { overtimeManually: manualEditData.overtimeManually || 0 }),
                        ...(manualEditData.remark && { remark: manualEditData.remark }),
                        workingHours, AttendanceStatus,
                        markWeeklyOff: manualEditData.status === 'weeklyOff',
                    }
                    : day
            );

            setAttendanceData(updatedAttendanceData);

            toast.success(response.data.message || 'Attendance updated successfully!');
            handleManualEditDialogClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error updating attendance. Please try again later.';
            console.error('Error saving attendance:', errorMessage);

            if (errorMessage === 'The date is a holiday. You cannot modify punch times or overtime.') {
                toast.info('The date is a holiday. You cannot modify punch times or overtime.');
            } else {
                toast.error(errorMessage);
            }
        }
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
            setPage(0);
        } catch (error) {
            setError('Error searching. Please try again.');
        }
    };
    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours`);
            const sortedLabours = response.data.sort((a, b) => a.LabourID - b.LabourID);
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
    }, []);

    useEffect(() => {
        if (modalOpen) {
            fetchProjectNames();
            fetchAttendanceForMonth();
        }
    }, [modalOpen]);

    const handleModalOpen = (labour, totalOvertimeHours, TotalOvertimeHoursManually) => {
        if (labour && labour.LabourID) {
            setSelectedLabour(labour);
            setSelectedLabourId(labour.LabourID);
            setTotalOvertimehours(totalOvertimeHours.hours)
            setTotalOvertimeminute(totalOvertimeHours.minutes)
            setTotalOvertimehoursManually(TotalOvertimeHoursManually.hours)
            setTotalOvertimeminuteManually(TotalOvertimeHoursManually.minutes)
            setModalOpen(true);
            fetchAttendanceForMonth();
        } else {
            console.error('LabourID is null or undefined for the selected labour.');
        }
    };

    const handleModalOpenCalenderAttendance = (labour) => {
        if (labour && labour.LabourID) {
            setSelectedLabour(labour);
            setSelectedLabourId(labour.LabourID);
            setOpen(true);
            fetchAttendance();
        } else {
            console.error('LabourID is null or undefined for the selected labour.');
        }
    };



    const fetchAttendanceForMonth = async () => {
        if (!selectedLabourId || !selectedMonth) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/attendancelaboursforsinglelabour/${selectedLabourId}`, {
                params: { month: selectedMonth, year: selectedYear }
            });

            const attendanceList = response.data;

            const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
            const fullMonthAttendance = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(selectedYear, selectedMonth - 1, i + 1);
                const attendanceRecord = attendanceList.find(
                    (record) => new Date(record.Date).toDateString() === date.toDateString()
                );

                return {
                    date: attendanceRecord?.Date.split('T')[0] || date.toISOString().split('T')[0],
                    status: attendanceRecord ? attendanceRecord.Status : 'NA',
                    firstPunch: attendanceRecord?.FirstPunch || '-',
                    lastPunch: attendanceRecord?.LastPunch || '-',
                    overtime: attendanceRecord?.Overtime || '0.0',
                    totalHours: formatTotalHours(attendanceRecord?.TotalHours ?? 0),
                    isHoliday: attendanceRecord?.Status === 'H',
                    labourId: attendanceRecord?.LabourId || 'NA',
                    overtimemanually: formatovertimemanually(attendanceRecord?.OvertimeManually ?? 0),
                    remark: attendanceRecord?.RemarkManually || '-',
                    attendanceId: attendanceRecord?.AttendanceId || '-',
                    ApprovalStatus: attendanceRecord?.ApprovalStatus || '-',
                    TotalOvertimeHoursManually: attendanceRecord?.TotalOvertimeHoursManually || '-',
                    isFinalPayAvailable: attendanceRecord?.isFinalPayAvailable,
                    Shift: attendanceRecord?.Shift,
                    projectName: attendanceRecord?.projectName,
                };
            });
            setAttendanceData(fullMonthAttendance);

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
        if (selectedMonth && selectedYear) {
            fetchAttendanceForMonth();
        }
    }, [selectedMonth, selectedYear]);


    const fetchAttendance = async () => {
        if (!selectedLabourId || !selectedMonth) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/labours/showAttendanceCalenderSingleLabour/${selectedLabourId}`,
                { params: { month: selectedMonth, year: selectedYear } }
            );

            const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

            const fullMonthAttendance = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(Date.UTC(selectedYear, selectedMonth - 1, i + 1))
                    .toISOString()
                    .split('T')[0];
                const record = response.data.find((att) => att.Date.split('T')[0] === date);
                return {
                    date,
                    status: record ? record.Status : 'NA',
                };
            });
            setAttendanceData(fullMonthAttendance);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    useEffect(() => {
        if (open) fetchAttendance();
    }, [open]);

    const renderStatusBox = (status) => {
        const statusColors = {
            P: '#4CAF50',
            A: '#FF6F00',
            HD: '#F44336',
            H: '#8236BC',
            MP: '#005cff',
            NA: '#ccc',
        };
        return {
            backgroundColor: statusColors[status],
            color: '#fff',
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            margin: 4,
            fontSize: '12px',
        };
    };


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
            const response = await axios.get(`${API_BASE_URL}/labours/attendancelabours`, {
                params: { month: selectedMonth, year: selectedYear },
            });

            const attendanceList = response.data;

            const processedAttendance = attendanceList.map((labour, index) => {
                const totalOvertime = labour.TotalOvertimeHours ?? 0;

                return {
                    srNo: index + 1,
                    labourId: labour.LabourId,
                    name: labour.Name,
                    totalDays: labour.TotalDays,
                    presentDays: labour.PresentDays,
                    halfDays: labour.HalfDays,
                    absentDays: labour.AbsentDays,
                    misspunchDays: labour.MissPunchDays,
                    // totalOvertimeHours: parseFloat(totalOvertime.toFixed(1)),
                    totalOvertimeHours: formatTotalOvertime(labour.TotalOvertimeHours || 0),
                    roundOffTotalOvertime: formatRoundOffTotalOvertime(labour.TotalOvertimeHoursManually || 0),
                    TotalOvertimeHoursManually: formatRoundOffTotalOvertime(labour.TotalOvertimeHoursManually || 0),
                    shift: labour.Shift,
                    InApprovalStatus: labour.InApprovalStatus,
                };
            });

            setAttendanceData(processedAttendance);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            toast.error(error.response?.data?.message || 'Error fetching attendance data. Please try again later.');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchAttendanceForMonthAll();
        }
    }, [selectedMonth, selectedYear]);

    
    // const getFilteredLaboursForTable = () => {
    //     let baseLabours = rowsPerPage > 0
    //         ? (searchResults.length > 0
    //             ? searchResults
    //             : (filteredIconLabours.length > 0
    //                 ? filteredIconLabours
    //                 : [...labours]))
    //         : [];
    
    //     baseLabours = baseLabours.filter((labour) => {
    //         const labourProjectId = Number(labour.projectId);
    //         const labourDepartmentId = Number(labour.departmentId);
    //         return (
    //             allowedProjectIds.includes(labourProjectId) &&
    //             allowedDepartmentIds.includes(labourDepartmentId)
    //         );
    //     });
    //     baseLabours = baseLabours.filter((labour) => labour.status === 'Approved');
    //     return baseLabours;
    // };
    

    const getFilteredLaboursForTable = () => {
        let baseLabours = rowsPerPage > 0
            ? (searchResults.length > 0
                ? searchResults
                : (filteredIconLabours.length > 0
                    ? filteredIconLabours
                    : [...labours]))
            : [];

        baseLabours = baseLabours.filter((labour) => {
            const labourProjectId = Number(labour.projectName);
            const labourDepartmentId = Number(labour.department);
            return (
                allowedProjectIds.includes(labourProjectId) &&
                allowedDepartmentIds.includes(labourDepartmentId)
            );
        });

        baseLabours = baseLabours.filter((labour) => labour.status === 'Approved');
        return baseLabours;
    };

    const handleModalClose = () => {
        setModalOpen(false);
        fetchAttendanceForMonthAll()
    };

    const handleModalCloseCalender = () => {
        setOpen(false)
        fetchAttendanceForMonthAll()
        // setAttendanceData([]);
    };

    const calculateTotalHours = (attendanceEntry) => {
        const punchIn = new Date(`${attendanceEntry.punch_in}Z`);
        const punchOut = new Date(`${attendanceEntry.punch_out}Z`);
        const totalHours = (punchOut - punchIn) / (1000 * 60 * 60);
        return totalHours.toFixed(2);
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

    const saveFullMonthAttendance = async () => {
        try {
            const payload = {
                labourId: selectedLabour.LabourID,
                month: selectedMonth,
                year: selectedYear,
                attendance: attendanceData,
            };
            await axios.post(`${API_BASE_URL}/labours/saveattendancemonthly`, payload);
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
    const LegendItem = ({ color, text }) => {
        return (
            <Box display="flex" alignItems="center" mx={1} mb={1}>
                <Box
                    sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '4px',
                        backgroundColor: color,
                        marginRight: '8px',
                    }}
                ></Box>
                <Typography variant="body2">{text}</Typography>
            </Box>
        );
    };

    const StatusLegend = () => (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="baseline"
            ml={2}
            mt={2}
            sx={{
                fontSize: { xs: "12px", sm: "13px", md: "14px", lg: "15px" },
            }}
        >
            <Box display="flex" alignItems="center" mb={1} mr={2}>
                <CircleIcon
                    sx={{
                        color: "#4CAF50",
                        fontSize: { xs: "10px", sm: "12px", md: "13px", lg: "14px" },
                        marginRight: "4px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9rem", lg: "1rem" },
                        color: "#5e636e",
                    }}
                >
                    Present (P)
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1} mr={2}>
                <CircleIcon
                    sx={{
                        color: "#F44336",
                        fontSize: { xs: "10px", sm: "12px", md: "13px", lg: "14px" },
                        marginRight: "4px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9rem", lg: "1rem" },
                        color: "#5e636e",
                    }}
                >
                    Half Day (HD)
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1} mr={2}>
                <CircleIcon
                    sx={{
                        color: "#8236BC",
                        fontSize: { xs: "10px", sm: "12px", md: "13px", lg: "14px" },
                        marginRight: "4px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9rem", lg: "1rem" },
                        color: "#5e636e",
                    }}
                >
                    Holiday (H)
                </Typography>
            </Box>

            <Box display="flex" alignItems="center">
                <CircleIcon
                    sx={{
                        color: "#FF6F00",
                        fontSize: { xs: "10px", sm: "12px", md: "13px", lg: "14px" },
                        marginRight: "4px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9rem", lg: "1rem" },
                        color: "#5e636e",
                    }}
                >
                    Absent (A)
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1} ml={2}>
                <CircleIcon
                    sx={{
                        color: "#005cff",
                        fontSize: { xs: "10px", sm: "12px", md: "13px", lg: "14px" },
                        marginRight: "4px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9rem", lg: "1rem" },
                        color: "#5e636e",
                    }}
                >
                    MissPunch (MP)
                </Typography>
            </Box>

        </Box>
    );

  
    const fetchProjectNames = async () => {
        try {
          const response = await axios.get(API_BASE_URL + "/api/project-names");
          // Expecting response.data to be an array of projects with properties "Id" and "Business_Unit"
          setProjectNames(response.data);
        } catch (error) {
          console.error('Error fetching project names:', error);
          toast.error('Error fetching project names.');
        }
      };
    
      // Lookup function to get Business_Unit name based on project id
      const getProjectDescription = (projectId) => {
        if (!Array.isArray(projectNames) || projectNames.length === 0) {
          return 'Unknown';
        }
        if (projectId === undefined || projectId === null || projectId === '') {
          return 'Unknown';
        }
        // Convert projectId to a number if necessary and find the matching project
        const project = projectNames.find(proj => proj.Id === Number(projectId));
        return project ? project.Business_Unit : 'Unknown';
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

    const CalendarBox = ({ day, status, margin = '8px', padding = '4px' }) => (
        <Box
            sx={{
                backgroundColor: statusColors[status] || '#E0E0E0',
                color: status ? '#fff' : '#000',
                margin: '6px',
                padding: padding,
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxSizing: 'border-box',
            }}
        >
            {day || ''}
        </Box>
    );
    const statusColors = {
        P: '#4CAF50',
        A: '#FF6F00',
        H: '#8236BC',
        HD: '#F44336',
        MP: '#005cff',
        NA: '#E0E0E0',
    };

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const generateCalendar = (attendanceData, year, month) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

        const calendar = [];
        let dayCounter = 1;

        for (let row = 0; row < 6; row++) {
            const week = [];
            for (let col = 0; col < 7; col++) {
                if (row === 0 && col < firstDayOfWeek) {
                    week.push({ day: null, status: null });
                } else if (dayCounter > daysInMonth) {
                    week.push({ day: null, status: null });
                } else {
                    const currentDay = attendanceData.find(
                        (data) => new Date(data.date).getDate() === dayCounter
                    );
                    week.push({ day: dayCounter, status: currentDay ? currentDay.status : 'NA' });
                    dayCounter++;
                }
            }
            calendar.push(week);
            if (dayCounter >= daysInMonth) break;
        }
        return calendar;
    };

    const calendar = generateCalendar(attendanceData, selectedYear, selectedMonth);

    function convertToHoursMinutes(total) {
        const hours = Math.floor(total);
        const minutes = Math.round((total - hours) * 60);
        return { hours, minutes };
    }


    const aggregateTotals = attendanceData.reduce((acc, day) => {

        const dayTotal =
            (day.totalHours ? day.totalHours.hours : 0) +
            (day.totalHours ? day.totalHours.minutes / 60 : 0);
        const dayOvertime =
            (day.overtime ? day.overtime.hours : 0) +
            (day.overtime ? day.overtime.minutes / 60 : 0);
        const dayManualOvertime =
            day.overtimemanually?.hours || day.overtimemanually?.minutes
                ? (day.overtimemanually.hours + (day.overtimemanually.minutes / 60))
                : (day.overtime?.hours + (day.overtime?.minutes / 60) || 0);


        return {
            totalHours: acc.totalHours + dayTotal,
            overtime: acc.overtime + dayOvertime,
            manualOvertime: acc.manualOvertime + dayManualOvertime
        };
    }, { totalHours: 0, overtime: 0, manualOvertime: 0 });

    const formattedTotalHours = convertToHoursMinutes(aggregateTotals.totalHours);
    const formattedOvertime = convertToHoursMinutes(aggregateTotals.overtime);
    const formattedManualOvertime = convertToHoursMinutes(aggregateTotals.manualOvertime);

    // useEffect(() => {
    //     fetchLaboursAttenadance(filters);
    //   }, [filters]);
    
     
    
      // Example filter change handler. When filters are updated,
      // update the state so useEffect calls fetchLaboursAttenadance.
      const handleApplyFilter = (newFilters) => {
        setFilters(newFilters);
      };
    
    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible' }}>
            <ToastContainer />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
                    User | Attendance Report
                </Typography>
                <SearchBar
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

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 2,
                    height: 'auto',
                    width: '100%',
                    justifyContent: { xs: 'flex-start', sm: 'space-between' },
                }}>
                    <Box sx={{
                        width: { xs: '100%', sm: '33%' },
                        gap: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}>
                        <Select
                            value={selectedMonth}
                            sx={{ width: '100%' }}
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

                        <Select
                            value={selectedYear}
                            sx={{ width: '100%' }}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Year</MenuItem>
                            {[2024, 2025].map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>

                        <Button
                            variant="contained"
                            sx={{
                                fontSize: { xs: '10px', sm: '13px' },
                                height: '45px',
                                width: '20%',
                                borderRadius: '10%',
                                backgroundColor: 'rgb(229, 255, 225)',
                                color: 'rgb(43, 217, 144)',
                                '&:hover': {
                                    backgroundColor: 'rgb(229, 255, 225)',
                                },
                            }}
                            onClick={fetchAttendanceForMonthAll}
                            disabled={loading}
                        >
                            <SyncIcon />
                        </Button>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        width: '42vw',
                        marginRight: '20px',
                        flexDirection: { xs: 'row', sm: 'row' }
                    }}>
                        <Box sx={{
                            width: { xs: '100%', sm: 'auto' },
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'row' },
                            gap: '20px',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            marginRight: '3vw'
                        }}>
  <Button variant="outlined" color="secondary" startIcon={<FilterListIcon />} onClick={() => setFilterModalOpen(true)}>
                    Filter
                </Button>
                {selectedLabourIds.length > 0 && (
                    <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={() => setModalOpen(true)}>
                        Edit ({selectedLabourIds.length})
                    </Button>
                )}

                            <ExportAttendance />
                            <ImportAttendance /></Box>

                        <TablePagination
                            className="custom-pagination"
                            rowsPerPageOptions={[25, 100, 200, { label: 'All', value: getFilteredLaboursForTable().length }]}
                            count={getFilteredLaboursForTable().length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>

                </Box>


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
                                        backgroundColor: 'white',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1,
                                    },
                                    '& td': {
                                        padding: '16px 9px',
                                        '@media (max-width: 600px)': {
                                            padding: '14px 8px',
                                        },
                                    },
                                }}
                            >
                                <TableCell>Sr No</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Labour ID</TableCell>
                                <TableCell>Name of Labour</TableCell>
                                <TableCell>Labour Shift</TableCell>
                                <TableCell>Total Days</TableCell>
                                <TableCell>Present Days</TableCell>
                                <TableCell>Half Days</TableCell>
                                <TableCell>Absent Days</TableCell>
                                <TableCell>MissPunch Days</TableCell>
                                <TableCell>Overtime (Hours)</TableCell>
                                <TableCell>RoundOffTotalOvertime (Hours)</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {getFilteredLaboursForTable()
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((labour, index) => {
                                    const labourAttendance = attendanceData.find((att) => att.labourId === labour.LabourID);

                                    return (
                                        <TableRow key={labour.LabourID}
                                        // sx={{
                                        //     backgroundColor: labourAttendance?.InApprovalStatus === true
                                        //       ? '#ffe6e6'
                                        //       : labourAttendance?.InApprovalStatus === false
                                        //       ? 'inherit'
                                        //       : 'inherit',
                                        //   }}
                                        >
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell><CalendarTodayIcon onClick={() => handleModalOpenCalenderAttendance(labour)} style={{ cursor: 'pointer' }} /> </TableCell>
                                            <TableCell>{labour.LabourID}</TableCell>
                                            <TableCell>{labour.name || '-'}</TableCell>
                                            <TableCell>{labour.workingHours || '-'}</TableCell>
                                            <TableCell>{labourAttendance ? labourAttendance.totalDays : '-'}</TableCell>
                                            <TableCell>{labourAttendance ? labourAttendance.presentDays : '-'}</TableCell>
                                            <TableCell>{labourAttendance ? labourAttendance.halfDays : '-'}</TableCell>
                                            <TableCell>{labourAttendance ? labourAttendance.absentDays : '-'}</TableCell>
                                            <TableCell>{labourAttendance ? labourAttendance.misspunchDays : '-'}</TableCell>
                                            {/* <TableCell>{labourAttendance ? labourAttendance.totalOvertimeHours : '-'}</TableCell> */}
                                            <TableCell>
                                                {labourAttendance && labourAttendance.totalOvertimeHours ? (
                                                    <Tooltip title={`${labourAttendance.totalOvertimeHours.hours} hours ${labourAttendance.totalOvertimeHours.minutes} minutes`}>
                                                        <span>{`${labourAttendance.totalOvertimeHours.hours}h ${labourAttendance.totalOvertimeHours.minutes ? labourAttendance.totalOvertimeHours.minutes + 'm' : ''}`}</span>
                                                    </Tooltip>
                                                ) : "0h"}
                                            </TableCell>
                                            <TableCell>
                                                {labourAttendance && labourAttendance.roundOffTotalOvertime ? (
                                                    <Tooltip title={`${labourAttendance.roundOffTotalOvertime.hours} hours ${labourAttendance.roundOffTotalOvertime.minutes} minutes`}>
                                                        <span>{`${labourAttendance.roundOffTotalOvertime.hours}h ${labourAttendance.roundOffTotalOvertime.minutes ? labourAttendance.roundOffTotalOvertime.minutes + 'm' : ''}`}</span>
                                                    </Tooltip>
                                                ) : "0h"}
                                            </TableCell>
                                            <TableCell>

                                                <Badge
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                                    overlap="rectangular"
                                                    color="error"
                                                    variant="dot"
                                                    invisible={!labourAttendance?.InApprovalStatus}
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            handleModalOpen(
                                                                labour,
                                                                labourAttendance.totalOvertimeHours,
                                                                labourAttendance.TotalOvertimeHoursManually
                                                            )
                                                        }
                                                        sx={{
                                                            backgroundColor: 'rgb(229, 255, 225)',
                                                            color: 'rgb(43, 217, 144)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgb(229, 255, 225)',
                                                            },
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>

                    </Table>
                </Box>
            </TableContainer>




            <Dialog
                open={modalOpen}
                onClose={handleModalClose}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle
                    sx={{
                        fontSize: { xs: "14px", sm: "16px", md: "18px" },
                        paddingBottom: { xs: "0px", sm: "0px", md: "18px" },
                    }}
                >
                    Attendance for {selectedLabour?.name} (LabourID: {selectedLabour?.LabourID})
                </DialogTitle>
                <DialogContent
                    sx={{
                        height: "500px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        fontSize: { xs: "14px", sm: "16px" },
                    }}
                >

                    <Box sx={{
                        display: "flex",
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        gap: { xs: 0.5, sm: "10px" },
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexWrap: { xs: "nowrap", sm: "nowrap" },
                            gap: { xs: 0.5, sm: "10px" },
                        }}>
                            <Select
                                value={selectedMonth}
                                sx={{
                                    width: { xs: "100%", sm: "54%" },
                                }}
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
                                sx={{
                                    width: { xs: "100%", sm: "54%" },
                                }}
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
                                    height: { xs: "88%", sm: "90%", lg: "90%" },
                                    width: { xs: "100%", sm: "80%", lg: "80%" },
                                    marginTop: { xs: 0.8, sm: "6px" },
                                    "&:hover": {
                                        backgroundColor: "rgb(229, 255, 225)",
                                    },
                                }}
                            >
                                <SyncIcon />
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                width: { xs: "100%", sm: "auto" },
                                marginTop: { xs: 0, sm: 0 },
                            }}
                        >
                            <StatusLegend />
                        </Box>
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
                            <Loading />
                        ) : (
                            <Table stickyHeader sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sr. No</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Punch In</TableCell>
                                        <TableCell>Punch Out</TableCell>
                                        <TableCell>Total Hours <br></br>  ( {formattedTotalHours.hours}h {formattedTotalHours.minutes}m )</TableCell>
                                        <TableCell>System Overtime <br></br> ( {totalOvertimehours}h {totalOvertimeminute}m )</TableCell>
                                        {/* <TableCell>Manual Overtime <br></br> ( {totalOvertimehoursManually}h {totalOvertimeminuteManually}m )</TableCell> */}
                                        <TableCell>
                                            Manual Overtime <br />
                                            (
                                            {
                                                ((!totalOvertimehoursManually && totalOvertimehoursManually !== 0) ||
                                                    (totalOvertimehoursManually === 0 && !totalOvertimeminuteManually))
                                                    ? `${totalOvertimehours}h ${totalOvertimeminute}m`
                                                    : `${totalOvertimehoursManually}h ${totalOvertimeminuteManually}m`
                                            }
                                            )
                                        </TableCell>

                                        {/* <TableCell>Manual Overtime <br></br> ({isNaN(formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).hours)? 0: formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).hours}h  
  {isNaN(formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).minutes)? 0: formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).minutes}m)</TableCell> */}
                                        {/* <TableCell>Holiday</TableCell> */}
                                        <TableCell>Remark</TableCell>
                                        <TableCell>Project Name</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((day, index) => (
                                            <TableRow key={index}
                                                sx={{
                                                    backgroundColor:
                                                        new Date(day.date).getDay() === 0
                                                            ? '#e6e6fa'
                                                            : day?.ApprovalStatus === 'Pending'
                                                                ? '#ffe6e6'
                                                                : day?.ApprovalStatus === 'Approved'
                                                                    ? '#dcfff0'
                                                                    : day?.ApprovalStatus === 'Rejected'
                                                                        ? '#ffcccc'
                                                                        : 'inherit',
                                                    outline:
                                                        new Date(day.date).getDay() === 0
                                                            ? '1px solid red'
                                                            : !day.remark
                                                                ? '1px solid purple'
                                                                : 'none',
                                                }}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{day.date ? new Date(day.date).toLocaleDateString('en-GB') : '-'}</TableCell>

                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            padding: '7px 16px',
                                                            borderRadius: '4px',
                                                            display: 'inline-block',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.875rem',
                                                            ...(day.status === 'H' && {
                                                                backgroundColor: '#EFE6F7',
                                                                color: '#8236BC',
                                                            }),
                                                            ...(day.status === 'P' && {
                                                                backgroundColor: '#E5FFE1',
                                                                color: '#4CAF50',
                                                            }),
                                                            ...(day.status === 'HD' && {
                                                                backgroundColor: 'rgba(255, 105, 97, 0.3)',
                                                                color: '#F44336',
                                                            }),
                                                            ...(day.status === 'A' && {
                                                                backgroundColor: 'rgba(255, 223, 186, 0.3)',
                                                                color: '#FF6F00',
                                                            }),
                                                            ...(day.status === 'MP' && {
                                                                backgroundColor: 'rgb(197 186 255 / 30%)',
                                                                color: '#005cff',
                                                            }),
                                                            ...(day.status === 'NA' && {
                                                                backgroundColor: '#f0f0f0',
                                                                color: '#b0b0b0',
                                                            }),
                                                        }}
                                                    >
                                                        {day.status}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{day.firstPunch || "-"}</TableCell>
                                                <TableCell>{day.lastPunch || "-"}</TableCell>
                                                {/* <TableCell>{day.totalHours || "0.00"}</TableCell> */}
                                                <TableCell>
                                                    {day.totalHours && (day.totalHours.hours > 0 || day.totalHours.minutes > 0) ? (
                                                        <Tooltip title={`${day.totalHours.hours} hours ${day.totalHours.minutes} minutes`}>
                                                            <span>{`${day.totalHours.hours}h ${day.totalHours.minutes}m`}</span>
                                                        </Tooltip>
                                                    ) : "0h"}
                                                </TableCell>
                                                {/* <TableCell>{day.overtime ? parseFloat(day.overtime).toFixed(1) : "0.0"}</TableCell> */}
                                                <TableCell>
                                                    {day.overtime && (day.overtime) ? (
                                                        <Tooltip title={`${formatConvertedOverTime(day.overtime).hours}hours ${formatConvertedOverTime(day.overtime).minutes}minutes`}>
                                                            <span>{`${formatOvertime(day.overtime).hours}h ${formatOvertime(day.overtime).minutes}m`}</span>
                                                        </Tooltip>
                                                    ) : "0h"}
                                                </TableCell>
                                                {/* <TableCell>{day.overtimemanually || "-"}</TableCell> */}
                                                <TableCell>
                                                    {day.overtimemanually && (day.overtimemanually) ? (
                                                        <Tooltip title={`${formatConvertedOvertimemanually(day.overtimemanually).hours}hours ${formatConvertedOvertimemanually(day.overtimemanually).minutes}minutes`}>
                                                            <span>{`${formatOvertimeManually(day.overtimemanually).hours}h ${formatOvertimeManually(day.overtimemanually).minutes}m`}</span>
                                                        </Tooltip>
                                                    ) : "0h"}
                                                </TableCell>
                                                {/* <TableCell>{day.isHoliday ? "Yes" : "No"}</TableCell> */}
                                                <TableCell>{day.remark || "-"}</TableCell>
                                                <TableCell>{getProjectDescription(day.projectName)}</TableCell>
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
                                                        disabled={day.isFinalPayAvailable}
                                                    >

                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : null}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={5} align="right">
                                            <strong>Totals:</strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {formattedTotalHours.hours}h {formattedTotalHours.minutes}m
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {totalOvertimehours}h {totalOvertimeminute}m
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {totalOvertimehoursManually}h {totalOvertimeminuteManually}m
                                                {/* {isNaN(formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).hours)? 0: formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).hours}h
                                            {isNaN(formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).minutes)? 0: formatConvertedOverTime(attendanceData[0]?.TotalOvertimeHoursManually).minutes}m */}
                                            </strong>
                                        </TableCell>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleModalClose();
                            // fetchAttendanceForMonthAll();
                        }}
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
                </DialogActions>
            </Dialog>


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


            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog
                    open={editManualDialogOpen}
                    onClose={handleManualEditDialogClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                        Edit Attendance for {manualEditData.date}
                    </DialogTitle>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, paddingTop: 1 }}
                    >
                        <Box>
                            <TextField
                                select
                                label="Mark Attendance As"
                                value={manualEditData.status}
                                onChange={(e) =>
                                    setManualEditData({ ...manualEditData, status: e.target.value })
                                }
                                fullWidth
                            >
                                <MenuItem value="present">Mark As Present</MenuItem>
                                <MenuItem value="absent">Mark As Absent</MenuItem>
                                <MenuItem value="weeklyOff">Mark As WeeklyOff</MenuItem>
                            </TextField>
                        </Box>

                        {(manualEditData.status === 'present') && (
                            <>
                                <Box>
                                    <TimePicker
                                        label="Punch In (Manually)"
                                        value={
                                            manualEditData?.punchIn !== ""
                                                ? dayjs(manualEditData.punchIn, 'HH:mm:ss') : null
                                        }
                                        onChange={(newValue) =>
                                            setManualEditData({ ...manualEditData, punchIn: newValue })
                                        }
                                        views={['hours', 'minutes', 'seconds']}
                                        ampm={false}
                                        inputFormat="HH:mm:ss"
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Box>

                                <Box>
                                    <TimePicker
                                        label="Punch Out (Manually)"
                                        value={
                                            manualEditData?.punchOut !== ""
                                                ? dayjs(manualEditData.punchOut, 'HH:mm:ss') : null
                                        }
                                        onChange={(newValue) =>
                                            setManualEditData({ ...manualEditData, punchOut: newValue })
                                        }
                                        views={['hours', 'minutes', 'seconds']}
                                        ampm={false}
                                        inputFormat="HH:mm:ss"
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Box>
                                {!isOvertimeDisable && <TextField
                                    label="Overtime (Manually)"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    value={manualEditData.overtimeManually}
                                    error={isOvertimeError}
                                    helperText={isOvertimeError ? `Add Overtime Upto ${formatConvertedOverTime(manualEditData.overtime).hours} hours and ${formatConvertedOverTime(manualEditData.overtime).minutes} minutes` : ""}
                                    onChange={(e) =>
                                        setManualEditData({ ...manualEditData, overtimeManually: e.target.value })
                                    }
                                />}
                            </>
                        )}

                        {(manualEditData.status === 'absent' || manualEditData.status === 'weeklyOff' || manualEditData.status === 'present') && (
                            <TextField
                                select
                                label="Remark"
                                variant="outlined"
                                fullWidth
                                value={manualEditData.remark || ""}
                                onChange={(e) =>
                                    setManualEditData({ ...manualEditData, remark: e.target.value })
                                }
                            >
                                <MenuItem value="Technical Error">Technical Error</MenuItem>
                                <MenuItem value="Miss Punch">Miss Punch</MenuItem>
                                <MenuItem value="Forge Punch">Forge Punch</MenuItem>
                                <MenuItem value="Wrong Punch">Wrong Punch</MenuItem>
                                <MenuItem value="Forgot To Punch">Forgot To Punch</MenuItem>
                                <MenuItem value="Weekly Off">Weekly Off</MenuItem>
                            </TextField>
                        )}
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            px: 2,
                            gap: 0,
                        }}
                    >
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
                            disabled={manualEditData.remark === "" || manualEditData.remark === null || manualEditData.remark === undefined || manualEditData.remark === "-"}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>

            <Modal open={open} onClose={handleModalCloseCalender}>
                <Box
                    sx={{
                        width: 500,
                        margin: '5% auto',
                        padding: 3,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleModalCloseCalender}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#FFF',
                            backgroundColor: '#ff0000b5',
                            borderRadius: '20%',
                            padding: '5px',
                            '&:hover': {
                                backgroundColor: '#ff0000de',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" mb={0} fontWeight="bold">
                        Attendance for Labour ID: {selectedLabourId}
                    </Typography>

                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                        </Typography>

                        <Grid container justifyContent="center" spacing={0} mb={1}>
                            {weekdays.map((day, index) => (
                                <CalendarBox key={index} day={day} status={null} margin="4px" padding="0" />
                            ))}
                        </Grid>
                        <Grid container justifyContent="center">
                            {calendar.map((week, rowIndex) => (
                                <Grid container justifyContent="center" key={rowIndex}>
                                    {week.map((day, colIndex) => (
                                        <CalendarBox key={colIndex} day={day.day} status={day.status || 'NA'} />
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                            Legend:
                        </Typography>
                        <Grid container justifyContent="center" spacing={1}>
                            <LegendItem color="#4CAF50" text="P - Present" />
                            <LegendItem color="#FF6F00" text="A - Absent" />
                            <LegendItem color="#8236BC" text="H - Holiday" />
                            <LegendItem color="#F44336" text="HD - Half Day" />
                            <LegendItem color="#005cff" text="MP - Miss Punch" />
                            <LegendItem color="#E0E0E0" text="NA - No Data" />
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AttendanceReport;










