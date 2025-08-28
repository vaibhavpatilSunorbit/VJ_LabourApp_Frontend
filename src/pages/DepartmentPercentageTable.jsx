import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../Data';

// Function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const DepartmentPercentageTable = ({ staticMachineData = [] }) => {
  // State for tab selection
  const [tabValue, setTabValue] = useState(0);

  // Department Wage data states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Machine data states
  const [machineData, setMachineData] = useState([]);
  const [machineLoading, setMachineLoading] = useState(false);
  const [machineError, setMachineError] = useState(null);

  // Common states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('wageMonth');
  const [order, setOrder] = useState('desc');

  // Filter states for wage data
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Filter states for machine data
  const [filterMachineStatus, setFilterMachineStatus] = useState('');
  const [filterMachineName, setFilterMachineName] = useState('');

  // Get unique values for filters - Fixed to use correct field names
  const uniqueMonths = [...new Set(data.map(item => item.wageMonth))].sort().reverse();
  const uniqueDepartments = [...new Set(data.map(item => item.departmentName))].sort();
  
  // Fixed: Use correct field names for machine data
  const uniqueMachineNames = [...new Set(machineData.map(item => item.DeviceSName))].sort();
  const uniqueMachineStatuses = [...new Set(machineData.map(item => item.Status))].sort();

  // Fetch wage data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/deptPercentageCount`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch machine data when tab switches to machine view
  useEffect(() => {
    if (tabValue === 1) {
      const fetchMachineData = async () => {
        try {
          setMachineLoading(true);
          // Replace this URL with your actual machine data endpoint
          const response = await axios.get(`${API_BASE_URL}/api/getDevices`);
          if (response.data) {
            setMachineData(response.data);
          } else {
            setMachineError('Failed to fetch machine data');
          }
        } catch (err) {
          setMachineError('Error fetching machine data: ' + err.message);
        } finally {
          setMachineLoading(false);
        }
      };

      fetchMachineData();
    }
  }, [tabValue]);

  // Reset page when changing tabs
  useEffect(() => {
    setPage(0);
    if (tabValue === 0) {
      setOrderBy('wageMonth');
    } else {
      setOrderBy('DeviceSName');
    }
  }, [tabValue]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fixed: Filter data based on active tab with correct field names
  const filteredData = tabValue === 0
    ? data.filter(item => {
        return (
          (filterMonth === '' || item.wageMonth === filterMonth) &&
          (filterDepartment === '' || item.departmentName === filterDepartment)
        );
      })
    : machineData.filter(item => {
        console.log('Filtering item:', item); // Debug log
        console.log('Filter status:', filterMachineStatus, 'Item status:', item.Status); // Debug log
        console.log('Filter name:', filterMachineName, 'Item name:', item.DeviceSName); // Debug log
        
        return (
          (filterMachineStatus === '' || item.Status === filterMachineStatus) &&
          (filterMachineName === '' || item.DeviceSName === filterMachineName)
        );
      });

  // Sort data based on active tab
  const sortedData = filteredData.sort((a, b) => {
    const isAsc = order === 'asc';
    if (tabValue === 0) {
      // Sorting for wage data
      if (orderBy === 'WagePayPercentage' || orderBy === 'totalWages') {
        return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
      } else {
        return isAsc
          ? String(a[orderBy] || '').localeCompare(String(b[orderBy] || ''))
          : String(b[orderBy] || '').localeCompare(String(a[orderBy] || ''));
      }
    } else {
      // Sorting for machine data
      if (orderBy === 'LastPing') {
        return isAsc
          ? new Date(a.LastPing) - new Date(b.LastPing)
          : new Date(b.LastPing) - new Date(a.LastPing);
      } else if (orderBy === 'DeviceId') {
        return isAsc ? a.DeviceId - b.DeviceId : b.DeviceId - a.DeviceId;
      } else {
        return isAsc
          ? String(a[orderBy] || '').localeCompare(String(b[orderBy] || ''))
          : String(b[orderBy] || '').localeCompare(String(a[orderBy] || ''));
      }
    }
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get color based on percentage
  const getPercentageColor = (percentage) => {
    if (percentage >= 70) return '#4caf50'; // Green
    if (percentage >= 40) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Get color based on machine status
  const getStatusColor = (status) => {
    return status === 'Online' ? '#4caf50' : '#f44336';
  };

  // Format last ping time
  const formatLastPing = (lastPing) => {
    const date = new Date(lastPing);
    // Check if it's the default "1900-01-01" date
    if (date.getFullYear() === 1900) {
      return 'Never';
    }
    return date.toLocaleString();
  };

  // Loading state
  if ((tabValue === 0 && loading) || (tabValue === 1 && machineLoading)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if ((tabValue === 0 && error) || (tabValue === 1 && machineError)) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{tabValue === 0 ? error : machineError}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs for switching between data types */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
        variant="fullWidth"
      >
        <Tab label="Department Wage Distribution" />
        <Tab label="ESSL Machine Status" />
      </Tabs>

      {tabValue === 0 ? (
        // Department Wage Data View
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            Department-wise Wage Pay Percentage
          </Typography>

          {/* Filters for Wage Data */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Filter by Month</InputLabel>
                <Select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  label="Filter by Month"
                >
                  <MenuItem value="">All Months</MenuItem>
                  {uniqueMonths.map((month) => (
                    <MenuItem key={month} value={month}>
                      {new Date(month + '-01').toLocaleString('default', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Filter by Department</InputLabel>
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  label="Filter by Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {uniqueDepartments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Wage Data Table */}
          <Paper sx={{ width: '100%', mb: 2, alignContent: 'center' }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'wageMonth'}
                        direction={orderBy === 'wageMonth' ? order : 'asc'}
                        onClick={() => handleRequestSort('wageMonth')}
                      >
                        Month
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'departmentName'}
                        direction={orderBy === 'departmentName' ? order : 'asc'}
                        onClick={() => handleRequestSort('departmentName')}
                      >
                        Department
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'totalWages'}
                        direction={orderBy === 'totalWages' ? order : 'asc'}
                        onClick={() => handleRequestSort('totalWages')}
                      >
                        Total Wages
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'WagePayPercentage'}
                        direction={orderBy === 'WagePayPercentage' ? order : 'asc'}
                        onClick={() => handleRequestSort('WagePayPercentage')}
                      >
                        Percentage
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">Visualization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <TableRow key={`${row.wageMonth}-${row.departmentName}-${index}`} hover>
                        <TableCell>
                          {new Date(row.wageMonth + '-01').toLocaleString('default', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.departmentName}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.totalWages)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: getPercentageColor(row.WagePayPercentage)
                            }}
                          >
                            {row.WagePayPercentage.toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress
                              variant="determinate"
                              value={Math.min(row.WagePayPercentage, 100)}
                              size={40}
                              thickness={4}
                              sx={{
                                color: getPercentageColor(row.WagePayPercentage),
                                '& .MuiCircularProgress-circle': {
                                  strokeLinecap: 'round',
                                }
                              }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" component="div" color="text.secondary">
                                {Math.round(row.WagePayPercentage)}%
                                </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      ) : (
        // ESSL Machine Status View
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            ESSL Machine Status
          </Typography>

          {/* Debug info - Remove this in production */}
          <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption">
              Debug: Total machines: {machineData.length}, Filtered: {filteredData.length}
            </Typography>
          </Box>

          {/* Filters for Machine Data - Fixed */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterMachineStatus}
                  onChange={(e) => {
                    console.log('Status filter changed to:', e.target.value); // Debug log
                    setFilterMachineStatus(e.target.value);
                    setPage(0); // Reset page when filter changes
                  }}
                  label="Filter by Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {uniqueMachineStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status} ({machineData.filter(item => item.Status === status).length})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Filter by Machine</InputLabel>
                <Select
                  value={filterMachineName}
                  onChange={(e) => {
                    console.log('Machine filter changed to:', e.target.value); // Debug log
                    setFilterMachineName(e.target.value);
                    setPage(0); // Reset page when filter changes
                  }}
                  label="Filter by Machine"
                >
                  <MenuItem value="">All Machines</MenuItem>
                  {uniqueMachineNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={`Online: ${machineData.filter(item => item.Status === 'Online').length}`}
                  color="success"
                  size="small"
                />
                <Chip 
                  label={`Offline: ${machineData.filter(item => item.Status === 'Offline').length}`}
                  color="error"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Machine Status Table */}
          <Paper sx={{ width: '100%', mb: 2, alignContent: 'center' }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'DeviceId'}
                        direction={orderBy === 'DeviceId' ? order : 'asc'}
                        onClick={() => handleRequestSort('DeviceId')}
                      >
                        Device ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'DeviceSName'}
                        direction={orderBy === 'DeviceSName' ? order : 'asc'}
                        onClick={() => handleRequestSort('DeviceSName')}
                      >
                        Device Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'DeviceLocation'}
                        direction={orderBy === 'DeviceLocation' ? order : 'asc'}
                        onClick={() => handleRequestSort('DeviceLocation')}
                      >
                        Location
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'Status'}
                        direction={orderBy === 'Status' ? order : 'asc'}
                        onClick={() => handleRequestSort('Status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'LastPing'}
                        direction={orderBy === 'LastPing' ? order : 'asc'}
                        onClick={() => handleRequestSort('LastPing')}
                      >
                        Last Ping
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'SerialNumber'}
                        direction={orderBy === 'SerialNumber' ? order : 'asc'}
                        onClick={() => handleRequestSort('SerialNumber')}
                      >
                        Serial Number
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <TableRow key={`${row.DeviceId}-${index}`} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {row.DeviceId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.DeviceSName}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.DeviceLocation || 'Not specified'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.Status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(row.Status),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            sx={{
                              color: row.Status === 'Online' ? 'success.main' : 'error.main'
                            }}
                          >
                            {formatLastPing(row.LastPing)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {row.SerialNumber || 'N/A'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1" color="text.secondary">
                          {machineData.length === 0 ? 'No machine data available' : 'No machines match the current filters'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DepartmentPercentageTable;
