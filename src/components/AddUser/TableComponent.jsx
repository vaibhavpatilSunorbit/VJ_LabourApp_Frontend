import React from "react";
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
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const TableComponent = ({
  users,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
}) => {
  return (
    <Box py={1} >
   <TablePagination
          rowsPerPageOptions={[ 10, 25, 40]}
          component="div"
          count={users.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3, }}>
     
        <TableContainer sx={{ height: '62vh' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact No.</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.emailID}</TableCell>
                    <TableCell>{user.contactNo}</TableCell>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell>
                      {/* <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#EFE6F7', 
                          color: '#8236BC',
                          marginRight: '10px',
                          '&:hover': {
                            backgroundColor: '#bfa7d7', 
                          },
                        }}
                        onClick={() => handleEdit(user)}
                        
                      >
                      {<EditIcon />}
                      </Button> */}
                      <EditIcon onClick={() => handleEdit(user)}/>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      
      </Paper>
    </Box>
  );
};

export default TableComponent;


