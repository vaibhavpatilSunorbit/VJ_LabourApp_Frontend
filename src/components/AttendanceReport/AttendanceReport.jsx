import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Typography,
    Select,
    MenuItem,
    IconButton,
    TextField,
    Button,
    Pagination,
    CircularProgress,
    InputAdornment,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
} from "@mui/material";
import {
    Search,
    CalendarToday,
    Refresh,
    Visibility,
    VisibilityOff,
    FilterList,
} from "@mui/icons-material";

import DailyAttendance from "./Dailyattandace";
import CalendarModal from "./CalendarModal";
import ExportAttendance from "./ImportExportAttendance/ExportAttendance";
import ImportAttendance from "./ImportExportAttendance/ImportAttendance";
import { API_BASE_URL } from "../../Data";
// 📌 Constants
const COLUMNS = [
    "#",
    "Details",
    "Labour ID",
    "Name",
    "Shift",
    "Total Days",
    "Present",
    "Half Days",
    "Absent",
    "MissPunch",
    "OT",
    "RoundOff OT",
    "Actions",
];

const YEARS = ["2023", "2024", "2025"];
const ROWS_PER_PAGE = 25;

const AttendanceReport = () => {
    const [month, setMonth] = useState("7");
    const [year, setYear] = useState("2025");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [expandedLabourId, setExpandedLabourId] = useState(null);
    const [openCalendar, setOpenCalendar] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Filter dialog states
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    // 🔹 Dynamic Data
    const [departments, setDepartments] = useState([]);
    const [projects, setProjects] = useState([]);

    // 🔹 Fetch attendance
    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const projectParams = selectedProjects.map(p => `projects[]=${encodeURIComponent(p)}`).join("&");
            const departmentParams = selectedDepartments.map(d => `departments[]=${encodeURIComponent(d)}`).join("&");

            const res = await fetch(
                `${API_BASE_URL}/api/labours/attendancelabours?month=${month}&year=${year}&${projectParams}&${departmentParams}`
            );
            if (!res.ok) throw new Error("Failed to fetch attendance data");

            const result = await res.json();
            const dataArray = Array.isArray(result) ? result : result.data || [];

            setAttendanceData(
                dataArray.map((item) => ({
                    ...item,
                    name: item.LabourName || item.name || "-",
                }))
            );
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    }, [month, year, selectedProjects, selectedDepartments]);

    // 🔹 Initial load
    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    // 🔹 Fetch departments once
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/departments`);
                if (!res.ok) throw new Error("Failed to fetch departments");

                const data = await res.json();
                setDepartments(Array.isArray(data) ? data : data.data || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setDepartments([]);
            }
        })();
    }, []);

    // 🔹 Fetch projects once
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/project-names`);
                if (!res.ok) throw new Error("Failed to fetch projects");

                const data = await res.json();

                // ✅ normalize with Business_Unit only
                const normalized = (Array.isArray(data) ? data : data.data || []).map(p => ({
                    id: p.Id, // keep Id internally
                    name: p.Business_Unit, // show only Business_Unit
                }));

                setProjects(normalized);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
            }
        })();
    }, []);


    // 🔹 Derived data with useMemo
    const filteredData = useMemo(
        () =>
            attendanceData.filter(
                (row) =>
                    row.name?.toLowerCase().includes(search.toLowerCase()) ||
                    row.LabourId?.toLowerCase().includes(search.toLowerCase())
            ),
        [attendanceData, search]
    );

    const paginatedData = useMemo(
        () =>
            filteredData.slice(
                (page - 1) * ROWS_PER_PAGE,
                page * ROWS_PER_PAGE
            ),
        [filteredData, page]
    );

    const toggleRow = (labourId) =>
        setExpandedLabourId((prev) => (prev === labourId ? null : labourId));

    return (
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                    User | Attendance Report
                </Typography>
                <TextField
                    placeholder="Search by Name or ID..."
                    size="small"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 220 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search sx={{ color: "action.active" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Filters */}
            <Paper
                elevation={2}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                }}
            >
                {/* Month & Year + Refresh */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Select value={month} onChange={(e) => setMonth(e.target.value)} size="small" sx={{ minWidth: 140 }}>
                        {Array.from({ length: 12 }, (_, idx) => (
                            <MenuItem key={idx + 1} value={String(idx + 1)}>
                                {new Date(0, idx).toLocaleString("default", { month: "long" })}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select value={year} onChange={(e) => setYear(e.target.value)} size="small" sx={{ minWidth: 100 }}>
                        {YEARS.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>

                    <Tooltip title="Refresh Data">
                        <IconButton color="primary" onClick={fetchAttendance}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Filter Button */}
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FilterList />}
                    onClick={() => setFilterOpen(true)}
                >
                    Filter
                </Button>

                {/* Import/Export */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <ExportAttendance />
                    <Button><ImportAttendance /></Button>
                </Box>
            </Paper>

            {/* Attendance Table */}
            <TableContainer component={Paper} sx={{ maxHeight: "60vh", borderRadius: 2 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {COLUMNS.map((col, idx) => (
                                    <TableCell key={col} align={idx > 4 ? "center" : "left"}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, idx) => (
                                <React.Fragment key={row.LabourId || idx}>
                                    <TableRow hover>
                                        <TableCell>{idx + 1 + (page - 1) * ROWS_PER_PAGE}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View Calendar">
                                                <IconButton size="small" onClick={() => setOpenCalendar(row.LabourId)}>
                                                    <CalendarToday fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{row.LabourId || "-"}</TableCell>
                                        <TableCell>{row.name || "-"}</TableCell>
                                        <TableCell>{row.Shift || "-"}</TableCell>
                                        <TableCell align="center">{row.TotalDays ?? "-"}</TableCell>
                                        <TableCell align="center">{row.PresentDays ?? "-"}</TableCell>
                                        <TableCell align="center">{row.HalfDays ?? "-"}</TableCell>
                                        <TableCell align="center">{row.AbsentDays ?? "-"}</TableCell>
                                        <TableCell align="center">{row.MissPunchDays ?? "-"}</TableCell>
                                        <TableCell align="center">{row.TotalOvertimeHours != null ? Math.floor(row.TotalOvertimeHours) : "-"}</TableCell>
                                        <TableCell align="center">{row.RoundOffTotalOvertime != null ? Math.floor(row.RoundOffTotalOvertime) : "-"}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title={expandedLabourId === row.LabourId ? "Hide Details" : "View Details"}>
                                                <IconButton size="small" onClick={() => toggleRow(row.LabourId)}>
                                                    {expandedLabourId === row.LabourId ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>

                                    {expandedLabourId === row.LabourId && (
                                        <TableRow>
                                            <TableCell colSpan={13} sx={{ p: 0, backgroundColor: "#fafafa" }}>
                                                <DailyAttendance labourId={row.LabourId} month={month} year={year} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                            {paginatedData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={13} align="center" sx={{ p: 3 }}>
                                        No records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Sticky Pagination Bar */}
            <Paper
                elevation={2}
                sx={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    background: "#fff",
                    mt: 0,
                    borderRadius: 0,
                    borderTop: "1px solid #eee",
                    px: 2,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Showing {paginatedData.length} of {filteredData.length} records
                </Typography>
                <Pagination
                    count={Math.ceil(filteredData.length / ROWS_PER_PAGE)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    size="small"
                />
            </Paper>

            {/* Calendar Modal */}
            {openCalendar && (
                <CalendarModal
                    open={Boolean(openCalendar)}
                    labourId={openCalendar}
                    month={month}
                    year={year}
                    onClose={() => setOpenCalendar(null)}
                />
            )}

            {/* Filter Dialog */}
            <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Apply Filters</DialogTitle>
                <DialogContent dividers>
                    {/* 🔹 Project Multi-Select (fetched from API) */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Select Projects</Typography>
                        <Select
                            multiple
                            value={selectedProjects}
                            onChange={(e) => setSelectedProjects(e.target.value)}
                            size="small"
                            fullWidth
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {projects.map((proj) => (
                                <MenuItem key={proj.id} value={proj.name}>
                                    <Checkbox checked={selectedProjects.includes(proj.name)} />
                                    <Typography>{proj.name}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Department Multi-Select */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Select Departments</Typography>
                        <Select
                            multiple
                            value={selectedDepartments}
                            onChange={(e) => setSelectedDepartments(e.target.value)}
                            size="small"
                            fullWidth
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {departments.map((dept) => (
                                <MenuItem
                                    key={dept._id || dept.id || dept.Description}
                                    value={dept.Description || dept.name}
                                >
                                    <Checkbox
                                        checked={selectedDepartments.includes(dept.Description || dept.name)}
                                    />
                                    <Typography>{dept.Description || dept.name}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setFilterOpen(false)} color="inherit">Cancel</Button>
                    <Button
                        onClick={() => {
                            fetchAttendance();
                            setFilterOpen(false);
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AttendanceReport;
