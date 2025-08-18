import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { Search, CalendarToday, Refresh, Visibility, VisibilityOff } from "@mui/icons-material";
import DailyAttendance from "./Dailyattandace";
import CalendarModal from "./CalendarModal";
import ExportAttendance from './ImportExportAttendance/ExportAttendance';
import ImportAttendance from './ImportExportAttendance/ImportAttendance';

const AttendanceReport = () => {
    const [month, setMonth] = useState("7");
    const [year, setYear] = useState("2025");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [expandedLabourId, setExpandedLabourId] = useState(null);
    const [openCalendar, setOpenCalendar] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    const rowsPerPage = 25;

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:4000/api/labours/attendancelabours?month=${month}&year=${year}`
            );
            if (!res.ok) throw new Error("Failed to fetch attendance data");
            const result = await res.json();
            const dataArray = Array.isArray(result) ? result : result.data || [];

            // 🔹 Normalize LabourName -> name
            const normalizedData = dataArray.map((item) => ({
                ...item,
                name: item.LabourName || item.name || "-",
            }));

            setAttendanceData(normalizedData);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setAttendanceData([]);
        }
        setLoading(false);
    }, [month, year]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const handleChangePage = (_, value) => setPage(value);

    const toggleRow = (labourId) => {
        setExpandedLabourId((prev) => (prev === labourId ? null : labourId));
    };

    const filteredData = attendanceData.filter(
        (row) =>
            (row.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (row.LabourId?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Attendance Report
            </Typography>

            {/* Filters */}
            <Paper
                elevation={2}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                }}
            >
                {/* Month & Year Select */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Select value={month} onChange={(e) => setMonth(e.target.value)} size="small" sx={{ minWidth: 140 }}>
                        {Array.from({ length: 12 }, (_, idx) => (
                            <MenuItem key={idx + 1} value={String(idx + 1)}>
                                {new Date(0, idx).toLocaleString("default", { month: "long" })}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select value={year} onChange={(e) => setYear(e.target.value)} size="small" sx={{ minWidth: 100 }}>
                        {["2023", "2024", "2025"].map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Refresh Button */}
                <Tooltip title="Refresh Data">
                    <IconButton color="primary" onClick={fetchAttendance}>
                        <Refresh />
                    </IconButton>
                </Tooltip>

                {/* Search Input */}
                <TextField
                    placeholder="Search by Name or ID..."
                    size="small"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 250 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search sx={{ color: "action.active" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                    <ExportAttendance />
                    <Button variant="outlined" color="secondary">
                        <ImportAttendance />
                    </Button>
                </Box>
            </Paper>

            {/* Attendance Table */}
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: "65vh",
                    overflow: "auto",
                    borderRadius: 2,
                }}
            >
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table
                        stickyHeader
                        sx={{
                            borderCollapse: "collapse",
                            "& th, & td": {
                                border: "1px solid rgba(224, 224, 224, 1)",
                                padding: "6px 8px",
                                fontSize: "0.85rem",
                            },
                            "& th": {
                                fontWeight: "bold",
                                backgroundColor: "#fff",
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {[
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
                                ].map((col, idx) => (
                                    <TableCell key={idx} align={idx > 4 ? "center" : "left"}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, idx) => (
                                <React.Fragment key={row.LabourId || idx}>
                                    <TableRow hover>
                                        <TableCell>{idx + 1 + (page - 1) * rowsPerPage}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View Calendar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setOpenCalendar(row.LabourId)}
                                                >
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
                                        {/* ✅ Show TotalOvertimeHours */}
                                        <TableCell align="center">
                                            {row.TotalOvertimeHours != null ? Math.floor(row.TotalOvertimeHours) : "-"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.RoundOffTotalOvertime != null ? Math.floor(row.RoundOffTotalOvertime) : "-"}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Tooltip title={expandedLabourId === row.LabourId ? "Hide Details" : "View Details"}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleRow(row.LabourId)}
                                                >
                                                    {expandedLabourId === row.LabourId ? (
                                                        <VisibilityOff fontSize="small" />
                                                    ) : (
                                                        <Visibility fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>

                                    {expandedLabourId === row.LabourId && (
                                        <TableRow>
                                            <TableCell colSpan={13} sx={{ p: 0, backgroundColor: "#fafafa" }}>
                                                <DailyAttendance
                                                    labourId={row.LabourId}
                                                    month={month}
                                                    year={year}
                                                />
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

            {/* Pagination & Info */}
            <Box
                sx={{
                    mt: 2,
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
                    count={Math.ceil(filteredData.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size="small"
                />
            </Box>

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
        </Box>
    );
};

export default AttendanceReport;
