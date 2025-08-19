

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  MenuItem,
  Select,
  Paper,
  TableContainer,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { API_BASE_URL } from "../../Data";
import { useUser } from "../../UserContext/UserContext";

const DailyAttendance = ({ labourId, month, year }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user } = useUser();

  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [subProjects, setSubProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const statusOptions = ["P", "HD", "H", "A", "MP"];
  const remarkOptions = [
    "Valid Punch",
    "Missed Punch",
    "System Error",
    "Manual Entry",
    "Leave",
  ];

useEffect(() => {
  const fetchSubProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/subprojects`);
      console.log("🔹 Full API Response:", res.data);

      let arr = [];

      // adjust extraction after seeing structure
      if (Array.isArray(res.data)) {
        arr = res.data;
      } else if (res.data?.subProjects) {
        arr = res.data.subProjects;
      } else if (res.data?.items) {
        arr = res.data.items;
      } else {
        // fallback: wrap single object
        arr = [res.data];
      }

      console.log("✅ Extracted SubProjects:", arr);
      setSubProjects(arr);
    } catch (err) {
      console.error("❌ Error fetching subprojects:", err);
      setSubProjects([]);
    }
  };
  fetchSubProjects();
}, []);

  // 🔹 Fetch attendance + project names
  useEffect(() => {
    if (!labourId) return;

    const fetchAttendanceAndProjects = async () => {
      try {
        const attendanceRes = await axios.get(
          `${API_BASE_URL}/api/labours/attendancelaboursforsinglelabour/${labourId}?month=${month}&year=${year}`
        );
        const attendanceData = Array.isArray(attendanceRes.data)
          ? attendanceRes.data
          : [];

        attendanceData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

        const projectsRes = await axios.get(`${API_BASE_URL}/api/project-names`);
        const allProjects = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : Array.isArray(projectsRes.data?.data)
            ? projectsRes.data.data
            : [];

        // 🔹 Match projects with attendance
        const matchedAttendance = attendanceData.map((att) => {
          const matchedProject = allProjects.find(
            (proj) =>
              String(proj.Id) === String(att.projectName) ||
              String(proj.Id) === String(att.Id)
          );

          return {
            ...att,
            projectFullInfo: matchedProject || null,
          };
        });

        // 🔹 Save unique projects for lookup
        const uniqueMatchedProjects = Array.from(
          new Map(
            matchedAttendance
              .filter((p) => p.projectFullInfo)
              .map((p) => [p.projectFullInfo.Id, p.projectFullInfo])
          ).values()
        );

        setProjects(uniqueMatchedProjects);
        setDailyAttendance(matchedAttendance);
      } catch (err) {
        console.error("Error fetching attendance or projects:", err);
        setDailyAttendance([]);
      }
    };

    fetchAttendanceAndProjects();
  }, [labourId, month, year]);

  const handleFieldChange = (index, field, value) => {
    const updated = [...dailyAttendance];

    if (field === "Status" && value === "A") {
      updated[index] = {
        ...updated[index],
        Status: "A",
        FirstPunch: null,
        LastPunch: null,
        TotalHours: 0,
        Overtime: 0,
        OvertimeManually: 0,
        RemarkManually: "Leave",
      };
    } else {
      updated[index][field] = value;
    }

    setDailyAttendance(updated);
  };

  // 🔹 Save row
  const handleSaveRow = async (index) => {
    const rowData = dailyAttendance[index];

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/labours/upsertAttendance`,
        {
          labourId: labourId,
          date: rowData.Date,
          AttendanceId: rowData.AttendanceId || null,
          firstPunchManually: rowData.FirstPunch || null,
          lastPunchManually: rowData.LastPunch || null,
          overtimeManually: rowData.OvertimeManually || 0,
          remarkManually: rowData.RemarkManually || "",
          workingHours: rowData.TotalHours || 0,
          onboardName: rowData.onboardName || "",
          AttendanceStatus: rowData.Status || "P",
          markWeeklyOff: rowData.markWeeklyOff || false,
          updatedFields: {
            projectId: rowData.projectName,
            subprojectId: rowData.subprojectId,
            workType: rowData.workType,
          },
          userType: user?.userType || "user",
          updatedBy: user?.name || "Unknown",
        }
      );

      console.log("Row saved response:", res.data);

      setEditingRowIndex(null);
      setToast({
        open: true,
        message: "Row saved successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error saving row:", err);
      setToast({
        open: true,
        message: "Error saving row",
        severity: "error",
      });
    }
  };

  const getSubProjectName = (id) => {
    const sp = subProjects.find((s) => String(s.id) === String(id));
    return sp ? sp.name : "-";
  };

  // 🔹 Return Business_Unit instead of raw ID
  const getProjectName = (idOrNumber) => {
    if (!idOrNumber) return "-";

    const proj = projects.find(
      (p) =>
        String(p.Id) === String(idOrNumber) ||
        String(p.projectName) === String(idOrNumber)
    );

    return proj ? proj.Business_Unit : "-";
  };

  const getSubProjectsByProject = (idOrNumber) => {
  if (!idOrNumber) return [];

  // First get the Business Unit for that project
  const businessUnit = getProjectName(idOrNumber);

  if (!businessUnit || businessUnit === "-") return [];

  // Now filter subprojects that belong to this Business Unit
  const matchedSubs = subProjects.filter(
    (sub) =>
      String(sub.Business_Unit) === String(businessUnit) ||
      String(sub.SubDescription) === String(businessUnit)
  );
  
  return matchedSubs;
};
  const getRowColor = (status) => {
    switch (status) {
      case "P":
        return "#e0f7e9";
      case "HD":
        return "#ffebee";
      case "H":
        return "#f3e5f5";
      case "A":
        return "#fff3e0";
      case "MP":
        return "#e3f2fd";
      default:
        return "transparent";
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#f9fbfd" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Attendance for {labourId}
      </Typography>

      {/* 🔹 Legend */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {[
          { color: "#4caf50", label: "Present (P)" },
          { color: "#f44336", label: "Half Day (HD)" },
          { color: "#9c27b0", label: "Holiday (H)" },
          { color: "#ff9800", label: "Absent (A)" },
          { color: "#2196f3", label: "MissPunch (MP)" },
        ].map((item, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <Typography variant="body2">{item.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* 🔹 Attendance Table */}
      <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 500 }}>
        <Table
          size={isMobile ? "small" : "medium"}
          stickyHeader
          sx={{
            minWidth: 1200,
            "& th, & td": {
              padding: isMobile ? "4px" : "8px",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              whiteSpace: "nowrap",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "Sr. No",
                "Date",
                "Status",
                "Punch In",
                "Punch Out",
                "Total Hours",
                "System OT",
                "Manual OT",
                "Remark",
                "Project Name",
                "Subproject",
                "Work Type",
                "Actions",
              ].map((header, i) => (
                <TableCell key={i}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {dailyAttendance.length > 0 ? (
              dailyAttendance.map((day, index) => {
                const isEditing = editingRowIndex === index;
                return (
                  <TableRow
                    key={index}
                    sx={{ backgroundColor: getRowColor(day.Status) }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(day.Date).toLocaleDateString()}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {isEditing ? (
                        <Select
                          size="small"
                          value={day.Status || ""}
                          onChange={(e) =>
                            handleFieldChange(index, "Status", e.target.value)
                          }
                          sx={{ minWidth: 80 }}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        day.Status || "-"
                      )}
                    </TableCell>

                    {/* Punch In */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={day.FirstPunch || ""}
                          size="small"
                          type="time"
                          step="1"
                          onChange={(e) =>
                            handleFieldChange(index, "FirstPunch", e.target.value)
                          }
                        />
                      ) : day.FirstPunch && !isNaN(new Date(`1970-01-01T${day.FirstPunch}`).getTime()) ? (
                        new Date(`1970-01-01T${day.FirstPunch}`).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Punch Out */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={day.LastPunch || ""}
                          size="small"
                          type="time"
                          step="1"
                          onChange={(e) =>
                            handleFieldChange(index, "LastPunch", e.target.value)
                          }
                        />
                      ) : day.LastPunch && !isNaN(new Date(`1970-01-01T${day.LastPunch}`).getTime()) ? (
                        new Date(`1970-01-01T${day.LastPunch}`).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{day.TotalHours || "-"}</TableCell>
                    <TableCell>{day.Overtime || "-"}</TableCell>

                    {/* Manual OT */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={day.OvertimeManually || ""}
                          size="small"
                          type="number"
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "OvertimeManually",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        day.OvertimeManually || "-"
                      )}
                    </TableCell>

                    {/* Remark */}
                    <TableCell>
                      {isEditing ? (
                        <Select
                          size="small"
                          value={day.RemarkManually || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "RemarkManually",
                              e.target.value
                            )
                          }
                          sx={{ minWidth: 150 }}
                        >
                          {remarkOptions.map((remark) => (
                            <MenuItem key={remark} value={remark}>
                              {remark}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        day.RemarkManually || "-"
                      )}
                    </TableCell>

                    {/* Project → Business_Unit */}
                    <TableCell>{getProjectName(day.projectName || day.Id)}</TableCell>

                    {/* Subproject */}
                    <TableCell>
                      {isEditing ? (
                        <Select
                          size="small"
                          value={day.subprojectId || ""}
                          onChange={(e) =>
                            handleFieldChange(index, "subprojectId", e.target.value)
                          }
                          sx={{ minWidth: 150 }}
                        >
                          {subProjects.map((sp) => (
                            <MenuItem key={sp.id} value={sp.id}>
                              {sp.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        getSubProjectName(day.subprojectId)
                      )}
                    </TableCell>

                    <TableCell>{day.workType || "-"}</TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Button
                        variant={isEditing ? "contained" : "outlined"}
                        size="small"
                        onClick={() =>
                          isEditing
                            ? handleSaveRow(index)
                            : setEditingRowIndex(index)
                        }
                      >
                        {isEditing ? "Save" : "Edit"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No attendance data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DailyAttendance;
