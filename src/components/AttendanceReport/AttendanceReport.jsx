import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Tabs, Tab, Typography,
    InputAdornment,
    Modal,
    Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchBar';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import "./attendanceReport.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useUser } from '../../UserContext/UserContext';
import dayjs from 'dayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// toast.configure();
import ImportAttendance from './ImportExportAttendance/ImportAttendance';
import ExportAttendance from './ImportExportAttendance/ExportAttendance';

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
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [manualEditData, setManualEditData] = useState({
        punchIn: "",
        punchOut: "",
        overtime: "",
        remark: "",
    });
    const [error, setError] = useState(null);
    const [filteredIconLabours, setFilteredIconLabours] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [file, setFile] = useState(null);
    const { user } = useUser();
    const [isAttendanceFetched, setIsAttendanceFetched] = useState(false);
    const [businessUnits, setBusinessUnits] = useState([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [projectName, setProjectName] = useState('');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);



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
        });
        setEditManualDialogOpen(true);
    };

    const handleManualEditDialogClose = () => {
        setEditManualDialogOpen(false);
    };


    const handleSaveManualEdit = async () => {
        try {
            const formattedPunchIn = manualEditData.punchIn && dayjs.isDayjs(manualEditData.punchIn)
                ? manualEditData.punchIn.format('HH:mm:ss')
                : null;

            const formattedPunchOut = manualEditData.punchOut && dayjs.isDayjs(manualEditData.punchOut)
                ? manualEditData.punchOut.format('HH:mm:ss')
                : null;

            const overtime = manualEditData.overtime ? String(manualEditData.overtime).trim() : '';

            const hasOvertime = overtime !== '';
            const hasPunchInOrOut = formattedPunchIn || formattedPunchOut;

            if (!hasOvertime && !hasPunchInOrOut) {
                toast.error('At least provide Overtime or Punch In/Out details to save.');
                return;
            }

            const onboardName = user.name || null;
            const workingHours = manualEditData.workingHours || selectedDay.workingHours;

            const payload = {
                labourId: selectedDay.labourId,
                date: selectedDay.date,
                AttendanceId: manualEditData.AttendanceId || "",
                ...(formattedPunchIn && { firstPunchManually: formattedPunchIn }),
                ...(formattedPunchOut && { lastPunchManually: formattedPunchOut }),
                ...(hasOvertime && { overtimeManually: manualEditData.overtime }),
                ...(manualEditData.remark && { remarkManually: manualEditData.remark }),
                workingHours,
                ...(onboardName && { onboardName }),
            };

            console.log('Request payload +++++:', payload);

            await axios.post(`${API_BASE_URL}/labours/upsertAttendance`, payload);

            const updatedAttendanceData = attendanceData.map((day) =>
                day.date === selectedDay.date
                    ? {
                        ...day,
                        ...(formattedPunchIn && { firstPunch: formattedPunchIn }),
                        ...(formattedPunchOut && { lastPunch: formattedPunchOut }),
                        ...(hasOvertime && { overtime: manualEditData.overtime }),
                        ...(manualEditData.remark && { remark: manualEditData.remark }),
                        workingHours,
                    }
                    : day
            );

            setAttendanceData(updatedAttendanceData);

            toast.success('Attendance updated successfully!');
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
            fetchAttendanceForMonth();
        }
    }, [modalOpen]);

    const handleModalOpen = (labour) => {
        if (labour && labour.LabourID) {
            setSelectedLabour(labour);
            setSelectedLabourId(labour.LabourID);
            setModalOpen(true);
            fetchAttendanceForMonth();
            // fetchAttendanceData(labour.LabourID, startDate, endDate);
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
            // handleOpen
            // fetchAttendanceData(labour.LabourID, startDate, endDate);
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
            console.log('response.data for the labour 16-12-24', response.data)

            const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
            const fullMonthAttendance = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(selectedYear, selectedMonth - 1, i + 1);
                const attendanceRecord = attendanceList.find(
                    (record) => new Date(record.Date).toDateString() === date.toDateString()
                );

                return {
                    // date: date.toISOString().split('T')[0], // Format: yyyy-mm-dd
                    date: attendanceRecord?.Date.split('T')[0] || date.toISOString().split('T')[0],
                    status: attendanceRecord ? attendanceRecord.Status : 'NA',
                    firstPunch: attendanceRecord?.FirstPunch || '-',
                    lastPunch: attendanceRecord?.LastPunch || '-',
                    totalHours: attendanceRecord?.TotalHours || '0.00',
                    overtime: attendanceRecord?.Overtime || '0.0',
                    isHoliday: attendanceRecord?.Status === 'H',
                    labourId: attendanceRecord?.LabourId || 'NA',
                    overtimemanually: attendanceRecord?.OvertimeManually || '0.0',
                    remark: attendanceRecord?.RemarkManually || '-',
                    attendanceId: attendanceRecord?.AttendanceId || '-',
                };
            });
            console.log('attendanceRecord+++', fullMonthAttendance)
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
                const date = new Date(selectedYear, selectedMonth - 1, i + 1)
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

            const processedAttendance = attendanceList.map((labour, index) => ({
                srNo: index + 1,
                labourId: labour.LabourId,
                name: labour.Name,
                totalDays: labour.TotalDays,
                presentDays: labour.PresentDays,
                halfDays: labour.HalfDays,
                absentDays: labour.AbsentDays,
                misspunchDays: labour.MissPunchDays,
                totalOvertimeHours: parseFloat(labour.TotalOvertimeHours.toFixed(1)),
                shift: labour.Shift,
            }));

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


    const renderAttendanceForMonth = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const result = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDay = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

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
                        status: 'A',
                        firstPunch: '-',
                        lastPunch: '-',
                        totalHours: '-',
                        overtime: '-',
                        shift: selectedLabour.workingHours
                    });
                }
            }
        }

        return result;
    };


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
        fetchAttendanceForMonthAll()
        // setAttendanceData([]);
    };

    const handleModalCloseCalender = () => {
        setOpen(false)
        fetchAttendanceForMonthAll()
        // setAttendanceData([]);
    };

    const handleSearchLabour = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredLabours = labours.filter((labour) =>
            labour.LabourID && labour.LabourID.toLowerCase().includes(searchQuery)
        );
        setLabours(filteredLabours);
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

    const handleImport = async () => {
        if (!file) {
            alert('Please select an Excel file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/labours/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.message(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                const { message, invalidRows } = error.response.data;

                if (invalidRows && invalidRows.length > 0) {
                    console.error('Invalid rows:', invalidRows);

                    const errorMessage = invalidRows
                        .map((row) => `Row ${row.index + 1}: ${JSON.stringify(row.row)}`)
                        .join('\n');

                    console.log(`Error: ${message}\n\nInvalid Rows:\n${errorMessage}`);
                } else {
                    toast.message(`Error: ${message}`);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const renderInput = (params) => <TextField {...params} fullWidth />;

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
            if (dayCounter > daysInMonth) break;
        }
        return calendar;
    };

    const calendar = generateCalendar(attendanceData, selectedYear, selectedMonth);

    const displayLabours = labours;
    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible' }}>
            <ToastContainer />
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

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 2,
                    height: { xs: '50px', sm: '50px', md: '50px' },
                    // paddingRight: { xs: 2, sm: 5 },
                    width: { xs: '100%', sm: '80%', md: '100%' },
                    justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                }}>
                    <Box sx={{ width: '40%', gap: '20px', display: 'flex', alignItems: 'flex-end' }}>
                        <Select
                            value={selectedMonth}
                            sx={{ width: { xs: '100%', sm: '20%' }, }}
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
                            sx={{ width: { xs: '100%', sm: '20%' }, }}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            displayEmpty
                        >
                            {[selectedYear, selectedYear - 1].map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>

                        <Button
                            variant="contained"
                            sx={{
                                fontSize: { xs: '10px', sm: '13px', md: '15px' },
                                height: { xs: '40px', sm: '38px', md: '38px', lg: '38px' },
                                width: { xs: '100%', sm: 'auto' },
                                backgroundColor: 'rgb(229, 255, 225)',
                                color: 'rgb(43, 217, 144)',
                                '&:hover': {
                                    backgroundColor: 'rgb(229, 255, 225)',
                                },
                            }}
                            onClick={fetchAttendanceForMonthAll}
                            disabled={loading}
                        >
                            Fetch Attendance
                        </Button>
                    </Box>
                    <Box sx={{ width: '80%', gap: '20px', display: 'flex', alignItems: 'flex-end',justifyContent:'space-evenly', alignItems:'center' }}>
                        <ExportAttendance />
                        <ImportAttendance />
                            <TablePagination
                                className="custom-pagination"
                                rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
                                //  count={filteredLabours.length > 0 ? filteredLabours.length : labours.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            /> </Box>
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
                    </Box> */}
                </Box>

               
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
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
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(
                            rowsPerPage > 0
                                ? (searchResults.length > 0
                                    ? searchResults
                                    : (filteredIconLabours.length > 0
                                        ? filteredIconLabours
                                        : [...labours]))
                                : []
                        )
                            .filter((labour) => labour.status === 'Approved')
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((labour, index) => {
                                const labourAttendance = attendanceData.find((att) => att.labourId === labour.LabourID);

                                return (
                                    <TableRow key={labour.LabourID}>
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
                                        <TableCell>{labourAttendance ? labourAttendance.totalOvertimeHours : '-'}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleModalOpen(labour)}
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
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>

                </Table>
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
                                Fetch
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
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sr. No</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Punch In</TableCell>
                                        <TableCell>Punch Out</TableCell>
                                        <TableCell>Total Hours</TableCell>
                                        <TableCell>System Overtime</TableCell>
                                        <TableCell>Manual Overtime</TableCell>
                                        {/* <TableCell>Holiday</TableCell> */}
                                        <TableCell>Remark</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceData.length > 0 ? (
                                        attendanceData.map((day, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{day.date}</TableCell>
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
                                                <TableCell>{day.totalHours || "0.00"}</TableCell>
                                                <TableCell>{day.overtime ? parseFloat(day.overtime).toFixed(1) : "0.0"}</TableCell>
                                                <TableCell>{day.overtimemanually || "-"}</TableCell>
                                                {/* <TableCell>{day.isHoliday ? "Yes" : "No"}</TableCell> */}
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
                                        ))
                                    ) : null}
                                </TableBody>
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}
                    >
                        <Box>
                            <TimePicker
                                label="Punch In (Manually)"
                                // value={manualEditData.punchIn}
                                value={
                                    manualEditData?.punchIn
                                        ? dayjs(manualEditData.punchIn, 'HH:mm:ss')
                                        : selectedDay?.firstPunch
                                            ? dayjs(selectedDay.firstPunch, 'HH:mm:ss')
                                            : null
                                }
                                onChange={(newValue) =>
                                    setManualEditData({ ...manualEditData, punchIn: newValue })
                                }
                                views={['hours', 'minutes', 'seconds']} // Enable hours, minutes, and seconds
                                ampm={false} // 24-hour format
                                inputFormat="HH:mm:ss" // Format displayed in the input field
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Box>

                        <Box>
                            <TimePicker
                                label="Punch Out (Manually)"
                                // value={manualEditData.punchOut}
                                value={
                                    manualEditData?.punchOut
                                        ? dayjs(manualEditData.punchOut, 'HH:mm:ss')
                                        : selectedDay?.lastPunch
                                            ? dayjs(selectedDay.lastPunch, 'HH:mm:ss')
                                            : null
                                }
                                onChange={(newValue) =>
                                    setManualEditData({ ...manualEditData, punchOut: newValue })
                                }
                                views={['hours', 'minutes', 'seconds']} // Enable hours, minutes, and seconds
                                ampm={false} // 24-hour format
                                inputFormat="HH:mm:ss" // Format displayed in the input field
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Box>
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
                    }}
                >
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










