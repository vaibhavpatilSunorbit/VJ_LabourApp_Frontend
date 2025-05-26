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

// Function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

  // Get unique values for filters
  const uniqueMonths = [...new Set(data.map(item => item.wageMonth))].sort().reverse();
  const uniqueDepartments = [...new Set(data.map(item => item.departmentName))].sort();
  const uniqueMachineNames = [...new Set(staticMachineData.map(item => item.machineName))].sort();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/dashboard/deptPercentageCount');
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

  // Reset page when changing tabs
  useEffect(() => {
    setPage(0);
    if (tabValue === 0) {
      setOrderBy('wageMonth');
    } else {
      setOrderBy('machineName');
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

  // Filter data based on active tab
  const filteredData = tabValue === 0 
    ? data.filter(item => {
        return (
          (filterMonth === '' || item.wageMonth === filterMonth) &&
          (filterDepartment === '' || item.departmentName === filterDepartment)
        );
      })
    : staticMachineData.filter(item => {
        return (
          (filterMachineStatus === '' || item.status === filterMachineStatus) &&
          (filterMachineName === '' || item.machineName === filterMachineName)
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
      if (orderBy === 'lastPingTime') {
        return isAsc 
          ? new Date(a.lastPingTime) - new Date(b.lastPingTime) 
          : new Date(b.lastPingTime) - new Date(a.lastPingTime);
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

  // Loading state for wage data
  if (tabValue === 0 && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state for wage data
  if (tabValue === 0 && error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
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
                      {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
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
                          {new Date(row.wageMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
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
                      <TableCell colSpan={5} align="center">No data found</TableCell>
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
          
          {/* Filters for Machine Data */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterMachineStatus}
                  onChange={(e) => setFilterMachineStatus(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Filter by Machine</InputLabel>
                <Select
                  value={filterMachineName}
                  onChange={(e) => setFilterMachineName(e.target.value)}
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
          </Grid>

          {/* Machine Status Table */}
          <Paper sx={{ width: '100%', mb: 2, alignContent: 'center' }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'machineName'}
                        direction={orderBy === 'machineName' ? order : 'asc'}
                        onClick={() => handleRequestSort('machineName')}
                      >
                        Machine Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'location'}
                        direction={orderBy === 'location' ? order : 'asc'}
                        onClick={() => handleRequestSort('location')}
                      >
                        Location
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'status'}
                        direction={orderBy === 'status' ? order : 'asc'}
                        onClick={() => handleRequestSort('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'lastPingTime'}
                        direction={orderBy === 'lastPingTime' ? order : 'asc'}
                        onClick={() => handleRequestSort('lastPingTime')}
                      >
                        Last Ping
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'ipAddress'}
                        direction={orderBy === 'ipAddress' ? order : 'asc'}
                        onClick={() => handleRequestSort('ipAddress')}
                      >
                        IP Address
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <TableRow key={`${row.machineName}-${index}`} hover>
                        <TableCell>
                          <Chip
                            label={row.machineName}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(row.status),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(row.lastPingTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{row.ipAddress}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No data found</TableCell>
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
