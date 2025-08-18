// CalendarModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const statusColors = {
  P: "#4caf50", // Present
  A: "#f57c00", // Absent
  H: "#9c27b0", // Holiday
  HD: "#d32f2f", // Half Day
  MP: "#1976d2", // Miss Punch
  NA: "#9e9e9e", // No Data (neutral gray)
  WO: "#9e9e9e", // Optional key if your API uses WO; same as NA
};

const statusLabels = {
  P: "Present",
  A: "Absent",
  H: "Holiday",
  HD: "Half Day",
  MP: "Miss Punch",
  NA: "No Data",
  WO: "No Data",
};

const CalendarModal = ({ open, onClose, labourId, month, year }) => {
  const [daysData, setDaysData] = useState([]);

  // Safe day extraction from API dates (avoids timezone shifts)
  const safeDayFromDate = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      // handle "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ssZ"
      const m = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) return parseInt(m[3], 10);
    }
    // fallback
    try {
      return new Date(val).getDate();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (open && labourId && month && year) {
      fetch(
        `http://localhost:4000/api/labours/attendancelaboursforsinglelabour/${labourId}?month=${month}&year=${year}`
      )
        .then((res) => res.json())
        .then((data) => {
          const raw = Array.isArray(data) ? data : data?.data || [];
          const apiData = raw
            .map((item) => ({
              day: safeDayFromDate(item.Date),
              status: item.Status || "NA",
            }))
            .filter((x) => Number.isInteger(x.day) && x.day >= 1);

          // Compute days in month using UTC to avoid TZ bumps.
          const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();

          const fullMonthData = Array.from({ length: totalDays }, (_, i) => {
            const dayNum = i + 1;
            const match = apiData.find((d) => d.day === dayNum);
            const status = match ? match.status : "NA";
            return { day: dayNum, status };
          });

          setDaysData(fullMonthData);
        })
        .catch((err) => {
          console.error("Error fetching daily attendance:", err);
          setDaysData([]);
        });
    }
  }, [open, labourId, month, year]);

  const getStatusColor = (day) => {
    const record = daysData.find((d) => d.day === day);
    return statusColors[record?.status] || statusColors.NA;
  };

  // Build a linear array with leading blanks for the month's first weekday (UTC-safe)
  const getCalendarCells = () => {
    // month prop is 1-based; Date.UTC uses 0-based month
    const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0=Sun...6=Sat
    const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const cells = [];

    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    return cells;
  };

  const cells = getCalendarCells();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Attendance for Labour ID: {labourId}
        <Typography variant="subtitle2">
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {/* Weekdays Header (CSS grid ensures perfect 7-column alignment) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            mb: 1,
            px: 0.5,
          }}
        >
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => (
            <Box
              key={w}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#666",
                py: 0.5,
              }}
            >
              {w}
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            px: 0.5,
          }}
        >
          {cells.map((day, idx) => (
            <Box
              key={idx}
              sx={{
                height: 36,
                borderRadius: 2,
                backgroundColor: day ? getStatusColor(day) : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: day ? "#fff" : "transparent",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              {day || ""}
            </Box>
          ))}
        </Box>

        {/* Legend */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Legend:
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
              gap: 1,
              mt: 1,
            }}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "4px",
                    backgroundColor: statusColors[key] || statusColors.NA,
                  }}
                />
                <Typography variant="body2">{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Date-wise Detailed View */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Date-wise Attendance
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {daysData.map((d) => (
                  <TableRow key={d.day}>
                    <TableCell>
                      {String(d.day).padStart(2, "0")}/
                      {String(month).padStart(2, "0")}/{year}
                    </TableCell>
                    <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "3px",
                          backgroundColor: statusColors[d.status] || statusColors.NA,
                        }}
                      />
                      {statusLabels[d.status] || "No Data"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
