import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Card, CardContent, Divider,
  useTheme, alpha, Avatar, LinearProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import {
  CalendarMonth, People, AccessTime, Cancel, Schedule, CheckCircle,
  EventAvailable, TrendingUp, Pending
} from '@mui/icons-material';
import AttendanceLineGraph from '../../pages/LaborAttendancePage';
import TodayAttendanceBarChart from '../../pages/TodayAttendanceBarChart';
import axios from 'axios';
import { API_BASE_URL } from '../../Data';

const MetricCard = ({ icon: Icon, title, count, color, bgColor, borderColor, description }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        bgcolor: bgColor,
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -15,
          right: -15,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: alpha(color, 0.15),
          zIndex: 0
        }}
      />
      <Box display="flex" alignItems="center" mb={1.5} zIndex={1}>
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.2),
            color: color,
            width: 40,
            height: 40,
            mr: 1.5
          }}
        >
          <Icon fontSize="small" />
        </Avatar>
        <Typography
          variant="body1"
          fontWeight={600}
          color="text.primary"
        >
          {title}
        </Typography>
      </Box>
      {title === 'Wages' || title === 'Site Transfer' || title === 'Variable Pay' ? (
        // For Wages, Site Transfer, and Variable Pay, show description more prominently
        <>
          <Typography
            variant="h6"
            fontWeight={700}
            color={color}
            mb={0.5}
            zIndex={1}
          >
            {count}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
            zIndex={1}
          >
            {description}
          </Typography>
        </>
      ) : (
        // For other cards, show count prominently
        <>
          <Typography
            variant="h4"
            fontWeight={700}
            color={color}
            mb={0.5}
            zIndex={1}
          >
            {count !== undefined ? count : 0}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 'auto' }}
              zIndex={1}
            >
              {description}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [labourCount, setLabourCount] = useState({ Approved: 0, Pending: 0, Rejected: 0 });
  const [wagesData, setWagesData] = useState({ Approved: 0, Pending: 0, Rejected: 0 });
  const [siteTransferData, setSiteTransferData] = useState({ Approved: 0, Pending: 0, Rejected: 0 });
  const [variablePayData, setVariablePayData] = useState({ Approved: 0, AdminPending: 0, Pending: 0, Rejected: 0 });

  // Updated project data with Online/Offline statuses
  const [projects, setProjects] = useState([
    { name: 'Residential Complex Phase 1', status: 'Online' },
    { name: 'Commercial Tower B', status: 'Offline' },
    { name: 'Highway Extension Project', status: 'Online' },
    { name: 'Shopping Mall Renovation', status: 'Offline' },
    { name: 'Airport Terminal Expansion', status: 'Online' },
    { name: 'Hospital Wing Construction', status: 'Offline' },
    { name: 'School Building Renovation', status: 'Online' },
    { name: 'Bridge Repair Project', status: 'Online' },
    { name: 'Municipal Park Development', status: 'Offline' },
    { name: 'Office Tower C', status: 'Online' },
    { name: 'Residential Apartments Block D', status: 'Online' },
    { name: 'Water Treatment Plant', status: 'Offline' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch the Labour Count
  useEffect(() => {
    const fetchLabourCounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/dashboard/getAllLaboursCount`);
        if (response.data.success) {
          setLabourCount({
            Approved: response.data.data.Approved || 0,
            Pending: response.data.data.Pending || 0,
            Rejected: response.data.data.Rejected || 0
          });
        }
      } catch (error) {
        console.error('Error fetching labour counts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabourCounts();
  }, []);

  // Fetch the Wages, Site Transfer, and Variable Pay data
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [wagesRes, siteTransferRes, variablePayRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/dashboard/getWagesCount`),
          axios.get(`${API_BASE_URL}/dashboard/getAllSiteTransferCount`),
          axios.get(`${API_BASE_URL}/dashboard/getAllVariableCount`)
        ]);
        if (wagesRes.data.success) {
          setWagesData(wagesRes.data.data);
        }
        if (siteTransferRes.data.success) {
          setSiteTransferData(siteTransferRes.data.data);
        }
        if (variablePayRes.data.success) {
          console.log("Variable Pay Data:", variablePayRes.data.data);
          setVariablePayData(variablePayRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  // Uncomment and adapt this to fetch project data from your API
  /*
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/dashboard/getProjects`);
        if (response.data.success) {
          // Map the API response to include Online/Offline status
          const projectsWithStatus = response.data.data.map(project => ({
            ...project,
            status: project.isActive ? 'Online' : 'Offline'
          }));
          setProjects(projectsWithStatus);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  */

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Update the metrics array in the Dashboard component
  const metrics = [
    {
      title: 'Approved',
      count: labourCount.Approved,
      icon: People,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.04),
      borderColor: theme.palette.success.light
    },
    {
      title: 'Pending',
      count: labourCount.Pending,
      icon: AccessTime,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.04),
      borderColor: theme.palette.warning.light
    },
    {
      title: 'Rejected',
      count: labourCount.Rejected,
      icon: Cancel,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.04),
      borderColor: theme.palette.error.light
    },
    {
      title: 'Wages',
      count: "Total: " + (parseInt(wagesData.Approved || 0) + parseInt(wagesData.Pending || 0) + parseInt(wagesData.Rejected || 0)),
      icon: Schedule,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.04),
      borderColor: theme.palette.primary.light,
      description: `Approved: ${wagesData.Approved || 0}, Pending: ${wagesData.Pending || 0}, Rejected: ${wagesData.Rejected || 0}`
    },
    {
      title: 'Site Transfer',
      count: "Total: " + (parseInt(siteTransferData.Approved || 0) + parseInt(siteTransferData.Pending || 0) + parseInt(siteTransferData.Rejected || 0)),
      icon: CheckCircle,
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.04),
      borderColor: theme.palette.secondary.light,
      description: `Approved: ${siteTransferData.Approved || 0}, Pending: ${siteTransferData.Pending || 0}, Rejected: ${siteTransferData.Rejected || 0}`
    },
    {
      title: 'Variable Pay',
      count: "Total: " + (parseInt(variablePayData.Approved || 0) + parseInt(variablePayData.AdminPending || 0) + parseInt(variablePayData.Pending || 0) + parseInt(variablePayData.Rejected || 0)),
      icon: EventAvailable,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.04),
      borderColor: theme.palette.info.light,
      description: `Approved: ${variablePayData.Approved || 0}, Admin Pending: ${variablePayData.AdminPending || 0}, Rejected: ${variablePayData.Rejected || 0}`
    }
  ];

  // Sample attendance data for the line graph
  const attendanceData = [
    { date: '2023-05-01', present: 15, absent: 5, onLeave: 2 },
    { date: '2023-05-02', present: 48, absent: 3, onLeave: 1 },
    { date: '2023-05-03', present: 42, absent: 7, onLeave: 3 },
    { date: '2023-05-04', present: 26, absent: 4, onLeave: 2 },
    { date: '2023-05-05', present: 44, absent: 6, onLeave: 2 },
    { date: '2023-05-06', present: 90, absent: 8, onLeave: 4 },
    { date: '2023-05-07', present: 38, absent: 10, onLeave: 4 },
    { date: '2023-05-08', present: 47, absent: 3, onLeave: 2 },
    { date: '2023-05-09', present: 49, absent: 2, onLeave: 1 },
    { date: '2023-05-10', present: 40, absent: 20, onLeave: 30 },
    { date: '2023-05-11', present: 48, absent: 3, onLeave: 1 },
    { date: '2023-05-12', present: 47, absent: 4, onLeave: 1 },
    { date: '2023-05-13', present: 45, absent: 5, onLeave: 2 },
    { date: '2023-05-14', present: 43, absent: 6, onLeave: 3 },
    { date: '2023-05-15', present: 46, absent: 4, onLeave: 2 },
    { date: '2023-05-16', present: 47, absent: 3, onLeave: 2 },
    { date: '2023-05-17', present: 49, absent: 2, onLeave: 1 },
    { date: '2023-05-18', present: 48, absent: 3, onLeave: 1 },
    { date: '2023-05-19', present: 47, absent: 4, onLeave: 1 },
    { date: '2023-05-20', present: 42, absent: 7, onLeave: 3 },
  ];

  // Calculate attendance summary for today
  const todayAttendance = {
    present: 47,
    absent: 34,
    missPunch: 15
  };

  const totalEmployees = todayAttendance.present + todayAttendance.absent + todayAttendance.missPunch;
  const attendanceRate = Math.round((todayAttendance.present / totalEmployees) * 100);

  // Updated function to get status color for Online/Offline statuses
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return {
          bg: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main
        };
      case 'offline':
        return {
          bg: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[700]
        };
    }
  };
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: alpha(theme.palette.primary.light, 0.05),
      }}
    >
      {/* Scrollable content area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Date & Time Card */}
            <Grid item xs={12} md={3}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: { xs: 'auto', md: '180px' },
                  minHeight: '150px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }}
                />
                <CardContent sx={{ height: '100%', p: 3, position: 'relative', zIndex: 1 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    height="100%"
                  >
                    <Box display="flex" alignItems="center" mb={1.5}>
                      <CalendarMonth sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="h6" fontWeight={600} color="white">Current Date & Time</Typography>
                    </Box>
                    <Divider sx={{ width: '100%', mb: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                    <Typography
                      variant="h5"
                      fontWeight={500}
                      align=" center"
                      sx={{ mb: 1 }}
                    >
                      {formattedDate}
                    </Typography>
                    {/* <Typography
                      variant="h6"
                      fontWeight={500}
                      align="center"
                    >
                      {formattedTime}
                    </Typography> */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Metrics Grid */}
            <Grid item xs={12} md={9}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="text.primary">My Labour Requests</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.dark,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  {loading && <Typography variant="body2">Loading...</Typography>}
                </Box>
              </Box>
              <Grid container spacing={4}>
                {metrics.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ height: '70%', width: '90%' }}>
                      <MetricCard {...metric} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Project Status Table - Updated with Online/Offline statuses */}
          <Grid container spacing={3} sx={{ mt: 3, mb: 4 }}>
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: 350, // Fixed height for the entire box
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }}>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Project Status
                  </Typography>
                </Box>
                <TableContainer sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                          }}
                        >
                          Project Name
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                          }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projects.map((project, index) => {
                        const statusStyle = getStatusColor(project.status);
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              '&:nth-of-type(odd)': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.02)
                              },
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                              },
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>
                              {project.name}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={project.status}
                                sx={{
                                  backgroundColor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 600,
                                  minWidth: 90
                                }}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3, mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '90%',
                }}
              >
                <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">Labour Attendance Trends</Typography>
                <Divider sx={{ mb: 3 }} />
                <AttendanceLineGraph attendanceData={attendanceData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">Today's Attendance Summary</Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Attendance Rate</Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">{attendanceRate}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={attendanceRate}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
                <TodayAttendanceBarChart data={todayAttendance} />
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="success.main">{todayAttendance.present}</Typography>
                        <Typography variant="body2" color="text.secondary">Present</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="error.main">{todayAttendance.absent}</Typography>
                        <Typography variant="body2" color="text.secondary">Absent</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700} color="warning.main">{todayAttendance.missPunch}</Typography>
                        <Typography variant="body2" color="text.secondary">Miss Punch</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Performance Summary Section */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    zIndex: 0
                  }}
                />
                <Typography variant="h5" fontWeight={700} mb={2} color="text.primary" sx={{ position: 'relative' }}>Performance Summary</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        borderRadius: 2,
                        textAlign: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h3" fontWeight={700} color="success.main" mb={1}>92%</Typography>
                      <Typography variant="body1" fontWeight={600} mb={0.5}>Attendance Rate</Typography>
                      <Typography variant="body2" color="text.secondary">Average for the last 30 days</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        textAlign: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h3" fontWeight={700} color="primary.main" mb={1}>43</Typography>
                      <Typography variant="body1" fontWeight={600} mb={0.5}>Active Workers</Typography>
                      <Typography variant="body2" color="text.secondary">Currently assigned to projects</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        borderRadius: 2,
                        textAlign: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h3" fontWeight={700} color="info.main" mb={1}>8</Typography>
                      <Typography variant="body1" fontWeight={600} mb={0.5}>Active Projects</Typography>
                      <Typography variant="body2" color="text.secondary">With labour assignments</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
