
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button } from '@mui/material';
import Loading from "../Loading/Loading"; 

const ApproveLabour = ({ refresh }) => {
  const [approvedLabours, setApprovedLabours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <Box px={5} py={2}>
      <Typography variant="h4" mb={3}>
        Approved Labours
      </Typography>

      {loading ? (
        <Loading /> 
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
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








