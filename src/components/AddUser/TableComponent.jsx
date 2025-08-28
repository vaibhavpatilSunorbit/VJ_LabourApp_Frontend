// import React from "react";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Paper,
//   Box,
// } from "@mui/material";
// import EditIcon from '@mui/icons-material/Edit';

// const TableComponent = ({
//   users,
//   page,
//   rowsPerPage,
//   handleChangePage,
//   handleChangeRowsPerPage,
//   handleEdit,
// }) => {
//   return (
//     <Box py={1} >
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 40]}
//         component="div"
//         count={users.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//       <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3, }}>

//         <TableContainer sx={{ height: '62vh' }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Sr No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Contact No.</TableCell>
//                 <TableCell>User Type</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {users
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((user, index) => (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
//                     <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                     <TableCell>{user.name}</TableCell>
//                     <TableCell>{user.emailID}</TableCell>
//                     <TableCell>{user.contactNo}</TableCell>
//                     <TableCell>{user.userType}</TableCell>
//                     <TableCell>
//                       {/* <Button
//                         variant="contained"
//                         sx={{
//                           backgroundColor: '#EFE6F7', 
//                           color: '#8236BC',
//                           marginRight: '10px',
//                           '&:hover': {
//                             backgroundColor: '#bfa7d7', 
//                           },
//                         }}
//                         onClick={() => handleEdit(user)}
                        
//                       >
//                       {<EditIcon />}
//                       </Button> */}
//                       <EditIcon onClick={() => handleEdit(user)} />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//       </Paper>
//     </Box>
//   );
// };

// export default TableComponent;


import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Checkbox,
  Collapse,
  Card,
  CardContent,
  Grid,
  Fade,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useTheme } from '@mui/material/styles';

// Custom Pagination Actions Component
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        size="small"
        sx={{
          backgroundColor: page === 0 ? 'transparent' : '#f1f5f9',
          '&:hover': { backgroundColor: '#e2e8f0' },
          mr: 0.5,
        }}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="small"
        sx={{
          backgroundColor: page === 0 ? 'transparent' : '#f1f5f9',
          '&:hover': { backgroundColor: '#e2e8f0' },
          mr: 0.5,
        }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        size="small"
        sx={{
          backgroundColor: page >= Math.ceil(count / rowsPerPage) - 1 ? 'transparent' : '#f1f5f9',
          '&:hover': { backgroundColor: '#e2e8f0' },
          mr: 0.5,
        }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        size="small"
        sx={{
          backgroundColor: page >= Math.ceil(count / rowsPerPage) - 1 ? 'transparent' : '#f1f5f9',
          '&:hover': { backgroundColor: '#e2e8f0' },
        }}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

// User Detail View Component
const UserDetailView = ({ user, onClose }) => {
  const getUserTypeColor = (userType) => {
    switch (userType?.toLowerCase()) {
      case 'admin':
        return { backgroundColor: '#ff6b6b', color: 'white' };
      case 'user':
        return { backgroundColor: '#4ecdc4', color: 'white' };
      case 'moderator':
        return { backgroundColor: '#45b7d1', color: 'white' };
      default:
        return { backgroundColor: '#95a5a6', color: 'white' };
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Fade in={true} timeout={300}>
      <Card 
        elevation={3}
        sx={{ 
          mb: 3,
          borderRadius: 3,
          border: '2px solid #e3f2fd',
          backgroundColor: '#fafffe',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="600" color="primary">
              User Details
            </Typography>
            <IconButton 
              onClick={onClose}
              size="small"
              sx={{
                backgroundColor: '#ffebee',
                color: '#d32f2f',
                '&:hover': { backgroundColor: '#ffcdd2' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* User Info Grid */}
          <Grid container spacing={3}>
            {/* Avatar and Basic Info */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#6366f1',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {user.name}
                </Typography>
                <Chip
                  label={user.userType}
                  sx={{
                    ...getUserTypeColor(user.userType),
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
            </Grid>

            {/* Contact Details */}
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="subtitle1" fontWeight="600" color="text.primary" mb={2}>
                  Contact Information
                </Typography>
                
                {/* Email */}
                <Box display="flex" alignItems="center" mb={2}>
                  <EmailIcon sx={{ color: '#64748b', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {user.emailID}
                    </Typography>
                  </Box>
                </Box>

                {/* Phone */}
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon sx={{ color: '#64748b', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {user.contactNo}
                    </Typography>
                  </Box>
                </Box>

                {/* User ID */}
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ color: '#64748b', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      #{user.id}
                    </Typography>
                  </Box>
                </Box>

                {/* Role */}
                <Box display="flex" alignItems="center">
                  <AdminPanelSettingsIcon sx={{ color: '#64748b', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Role & Permissions
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {user.userType} User
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

const TableComponent = ({
  users,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  const getUserTypeColor = (userType) => {
    switch (userType?.toLowerCase()) {
      case 'admin':
        return { backgroundColor: '#ff6b6b', color: 'white' };
      case 'user':
        return { backgroundColor: '#4ecdc4', color: 'white' };
      case 'moderator':
        return { backgroundColor: '#45b7d1', color: 'white' };
      default:
        return { backgroundColor: '#95a5a6', color: 'white' };
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  // Handle row selection
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => user.id);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleRowSelect = (event, userId) => {
    event.stopPropagation();
    const selectedIndex = selectedRows.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }
    setSelectedRows(newSelected);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleCloseUserDetail = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  const isSelected = (userId) => selectedRows.indexOf(userId) !== -1;

  // Calculate pagination info
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, users.length);
  const currentPageUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const numSelected = selectedRows.length;
  const rowCount = currentPageUsers.length;

  return (
    <Box py={2}>
     

      {/* User Detail View */}
      <Collapse in={showUserDetail}>
        {selectedUser && (
          <UserDetailView 
            user={selectedUser} 
            onClose={handleCloseUserDetail}
          />
        )}
      </Collapse>

      {/* Enhanced Paper Container */}
      <Paper 
        elevation={0}
        sx={{ 
          width: "100%", 
          overflow: "hidden",
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        {/* Scrollable Table Container */}
        <TableContainer 
          sx={{ 
            height: showUserDetail ? '45vh' : '65vh',
            maxHeight: showUserDetail ? '45vh' : '65vh',
            overflowY: 'auto',
            overflowX: 'auto',
            transition: 'height 0.3s ease-in-out',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#a8a8a8',
              },
            },
          }}
        >
          <Table stickyHeader aria-label="users table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell 
                  padding="checkbox"
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all users',
                    }}
                  />
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    minWidth: 60,
                  }}
                >
                  #
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    minWidth: 250,
                  }}
                >
                  User
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    minWidth: 150,
                  }}
                >
                  Contact
                </TableCell>
                <TableCell 
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    minWidth: 120,
                  }}
                >
                  Role
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    minWidth: 120,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageUsers.map((user, index) => {
                const isItemSelected = isSelected(user.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow 
                    hover 
                    onClick={() => handleViewUser(user)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={user.id}
                    selected={isItemSelected}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                      },
                      '&:last-child td': {
                        borderBottom: 0,
                      },
                      cursor: 'pointer',
                      ...(isItemSelected && {
                        backgroundColor: '#e3f2fd',
                        '&:hover': {
                          backgroundColor: '#bbdefb',
                        },
                      }),
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={(event) => handleRowSelect(event, user.id)}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    {/* Serial Number */}
                    <TableCell sx={{ fontWeight: 500, color: '#64748b' }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    {/* User Info with Avatar */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#6366f1',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500} color="text.primary">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.emailID}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell>
                      <Typography variant="body2" color="text.primary">
                        {user.contactNo}
                      </Typography>
                    </TableCell>

                    {/* User Type with Chip */}
                    <TableCell>
                      <Chip
                        label={user.userType}
                        size="small"
                        sx={{
                          ...getUserTypeColor(user.userType),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewUser(user);
                          }}
                          sx={{
                            backgroundColor: '#f0f9ff',
                            color: '#0ea5e9',
                            '&:hover': {
                              backgroundColor: '#e0f2fe',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(user);
                          }}
                          sx={{
                            backgroundColor: '#f0fdf4',
                            color: '#16a34a',
                            '&:hover': {
                              backgroundColor: '#dcfce7',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        {/* Enhanced Pagination Footer */}
        <Box 
          sx={{ 
            backgroundColor: '#fafbfc',
            padding: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Left side - Selection info and rows per page */}
          <Box display="flex" alignItems="center" gap={3}>
            {selectedRows.length > 0 && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="primary" fontWeight={500}>
                  {selectedRows.length} row(s) selected
                </Typography>
                <Button
                  size="small"
                  onClick={() => setSelectedRows([])}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Clear
                </Button>
              </Box>
            )}
            
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <Box>
                {[10, 25, 40].map((option) => (
                  <Button
                    key={option}
                    size="small"
                    variant={rowsPerPage === option ? "contained" : "outlined"}
                    onClick={(e) => handleChangeRowsPerPage({ target: { value: option } })}
                    sx={{
                      minWidth: 40,
                      height: 32,
                      mr: 1,
                      fontSize: '0.75rem',
                      ...(rowsPerPage === option && {
                        backgroundColor: '#6366f1',
                        '&:hover': { backgroundColor: '#5b5bd6' },
                      }),
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Center - Page info */}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {startIndex}-{endIndex} of {users.length} users
          </Typography>

          {/* Right side - Navigation */}
          <Box display="flex" alignItems="center">
            <TablePaginationActions
              count={users.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TableComponent;
