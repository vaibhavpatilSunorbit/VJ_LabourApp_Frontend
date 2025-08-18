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

const DailyAttendance = ({ labourId, month, year }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [subProjects, setSubProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const statusOptions = ["P", "A", "WO", "MP"];

  // Fetch subprojects
  useEffect(() => {
    const fetchSubProjects = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/subprojects");
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setSubProjects(arr);
      } catch (err) {
        console.error("Error fetching subprojects:", err);
        setSubProjects([]);
      }
    };
    fetchSubProjects();
  }, []);

  // Fetch attendance data
useEffect(() => {
  if (!labourId) return;

  const fetchAttendanceAndProjects = async () => {
    try {
      // 1️⃣ Fetch attendance for single labour
      const attendanceRes = await axios.get(
        `http://localhost:4000/api/labours/attendancelaboursforsinglelabour/${labourId}?month=${month}&year=${year}`
      );
      const attendanceData = Array.isArray(attendanceRes.data) ? attendanceRes.data : [];

      // Sort by Date
      attendanceData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

      setDailyAttendance(attendanceData);

      // 2️⃣ Fetch all project names (with business unit info)
      const projectsRes = await axios.get("http://localhost:4000/api/project-names");
      const allProjects = Array.isArray(projectsRes.data)
        ? projectsRes.data
        : Array.isArray(projectsRes.data?.data)
        ? projectsRes.data.data
        : [];

      // 3️⃣ Map attendance project names/IDs to actual project objects
      const matchedProjects = attendanceData.map(att => {
        // Check if attendance row has Project object
        let projectIdOrName = att.Project?._id || att.projectName || att.Project?.name;

        const matchedProject = allProjects.find(
          proj =>
            proj._id === projectIdOrName ||
            proj.name?.trim().toLowerCase() === (projectIdOrName || "").toString().trim().toLowerCase()
        );

        return {
          ...att,
          businessUnit: matchedProject?.Business_Unit || null, // attach Business Unit if matched
          projectFullInfo: matchedProject || null, // optional: full project info
        };
      });

      console.log("Attendance with matched Business Unit:", matchedProjects);

      // Optional: if you want unique projects for dropdown
      const uniqueMatchedProjects = Array.from(
        new Map(
          matchedProjects
            .filter(p => p.projectFullInfo)
            .map(p => [p.projectFullInfo._id, p.projectFullInfo])
        ).values()
      );
      console.log("Unique Matched Projects for dropdown:", uniqueMatchedProjects);

    } catch (err) {
      console.error("Error fetching attendance or projects:", err);
      setDailyAttendance([]);
    }
  };

  fetchAttendanceAndProjects();
}, [labourId, month, year]);





  // Fetch only relevant projects
  // const fetchFilteredProjects = async (ids) => {
  //   try {
  //     const res = await axios.get("http://localhost:4000/api/project-names");
  //     let arr = Array.isArray(res.data)
  //       ? res.data
  //       : Array.isArray(res.data?.data)
  //         ? res.data.data
  //         : [];

  //     arr = arr.filter((proj) => ids.includes(proj.Id));
  //     setProjects(arr);
  //   } catch (err) {
  //     console.error("Error fetching filtered projects:", err);
  //     setProjects([]);
  //   }
  // };

  const handleFieldChange = (index, field, value) => {
    const updated = [...dailyAttendance];
    updated[index][field] = value;
    setDailyAttendance(updated);
  };

  const handleSaveRow = (index) => {
    // Here you could also call an API to save the updated row
    setEditingRowIndex(null);
    setToast({
      open: true,
      message: "Row updated successfully!",
      severity: "success",
    });
  };

  const getSubProjectName = (id) => {
    const sp = subProjects.find((s) => String(s.id) === String(id));
    return sp ? sp.name : "-";
  };

  const getProjectName = (id) => {
    const proj = projects.find((p) => String(p.Id) === String(id));
    console.log(proj,'ProjectNamr');
    
    return proj ? proj.Business_Unit : "-";
  };


  const getRowColor = (status) => {
    switch (status) {
      case "P":
        return "#e0f7e9";
      case "A":
        return "#fdecea";
      case "WO":
        return "#e8f4fd";
      case "MP":
        return "#fff7e6";
      default:
        return "transparent";
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#f9fbfd" }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
        Attendance for {labourId}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxHeight: 500,
          overflowX: "auto",
        }}
      >
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

                    {/* Editable Status */}
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

                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={day.FirstPunch || ""}
                          size="small"
                          type="time"
                          step="1"
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "FirstPunch",
                              e.target.value
                            )
                          }
                        />
                      ) : day.FirstPunch ? (
                        new Date(`1970-01-01T${day.FirstPunch}`).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )
                      ) : (
                        "-"
                      )}
                    </TableCell>

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
                      ) : day.LastPunch ? (
                        new Date(`1970-01-01T${day.LastPunch}`).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell>{day.TotalHours || "-"}</TableCell>
                    <TableCell>{day.Overtime || "-"}</TableCell>

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

                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={day.RemarkManually || ""}
                          size="small"
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "RemarkManually",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        day.RemarkManually || "-"
                      )}
                    </TableCell>

                    <TableCell>
                      {getProjectName(day.projectName)}
                    </TableCell>


                    {/* Subproject */}
                    <TableCell>
                      {isEditing ? (
                        <Select
                          size="small"
                          value={day.subprojectId || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "subprojectId",
                              e.target.value
                            )
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
