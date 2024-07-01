
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button } from '@mui/material';
import Loading from "../Loading/Loading"; 
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ApproveLabour = ({ refresh }) => {
  const [approvedLabours, setApprovedLabours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchApprovedLabours();
  }, [refresh]); 

  const fetchApprovedLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/labours/approved');
      setApprovedLabours(response.data);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching approved labours:', error);
      setError(error.response ? error.response.data.message : 'Error fetching approved labours. Please try again.');
      setLoading(false); 
    }
  };

 
  return (
    <Box  py={2} px={2} sx={{ width: isMobile ? '90vw' : 'auto' }}>
      <Typography variant="h4" mb={3}>
        Approved Labours
      </Typography>

      {loading ? (
        <Loading /> 
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}  sx={{
          height: '77vh',
          overflowX: 'auto',
          backgroundColor: '#fff',
          color: 'rgba(0, 0, 0, 0.87)',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          borderRadius: 4,
          boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
          width: '100%',
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Name of Labour</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Labour Category</TableCell>
                <TableCell>Status</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedLabours.length > 0 ? (
                approvedLabours.map((labour, index) => (
                  <TableRow key={labour.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{labour.name}</TableCell>
                    <TableCell>{labour.projectName}</TableCell>
                    <TableCell>{labour.department}</TableCell>
                    <TableCell>{labour.labourCategory}</TableCell>
                    <TableCell>{labour.status}</TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No approved labours found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ApproveLabour;








