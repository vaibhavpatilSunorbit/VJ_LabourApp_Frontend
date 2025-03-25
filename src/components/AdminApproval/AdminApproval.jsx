import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_BASE_URL } from '../../Data';

const AdminApproval = ({ onFormSubmit }) => {
  const location = useLocation();
  const [pendingSiteTransfer, setPendingSiteTransfer] = useState(0);
  const [approvedSiteTransfer, setApprovedSiteTransfer] = useState(0);
  const [rejectedSiteTransfer, setRejectedSiteTransfer] = useState(0);

  const [pendingAttendance, setPendingAttendance] = useState(0);
  const [approvedAttendance, setApprovedAttendance] = useState(0);
  const [rejectedAttendance, setRejectedAttendance] = useState(0);

  const [pendingVariablePay, setPendingVariablePay] = useState(0);
  const [approvedVariablePay, setApprovedVariablePay] = useState(0);
  const [rejectedVariablePay, setRejectedVariablePay] = useState(0);

  const [pendingWagesCount, setPendingWagesCount] = useState(0);
  const [approvedWagesCount, setApprovedWagesCount] = useState(0);
  const [rejectedWagesCount, setRejectedWagesCount] = useState(0);

  const [error, setError] = useState('');
   // Fetch Attendance Approval counts
   const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/LabourAttendanceApproval`);
      const pending = response.data.filter(labour => labour.ApprovalStatus === "Pending").length;
      const approved = response.data.filter(labour => labour.ApprovalStatus === "Approved").length;
      const rejected = response.data.filter(labour => labour.ApprovalStatus === "Rejected").length;
      setPendingAttendance(pending);
      setApprovedAttendance(approved);
      setRejectedAttendance(rejected);
    } catch (err) {
      setError('Error fetching attendance approvals.');
    }
  };

  // Fetch Wages Approval counts
  const fetchWages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/wages/adminApprovals`);
      const pending = response.data.filter(labour => labour.ApprovalStatus === "Pending").length;
      const approved = response.data.filter(labour => labour.ApprovalStatus === "Approved").length;
      const rejected = response.data.filter(labour => labour.ApprovalStatus === "Rejected").length;
      setPendingWagesCount(pending);
      setApprovedWagesCount(approved);
      setRejectedWagesCount(rejected);
    } catch (err) {
      setError('Error fetching wages approvals.');
    }
  };

  // Fetch Variable Pay Approval counts
  const fetchVariablePay = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/insentive/admin/getVariablePayAdminApprovals`);
      const pending = response.data.filter(labour => labour.ApprovalStatusPay === "AdminPending").length;
      const approved = response.data.filter(labour => labour.ApprovalStatusPay === "Approved").length;
      const rejected = response.data.filter(labour => labour.ApprovalStatusPay === "Rejected").length;
      setPendingVariablePay(pending);
      setApprovedVariablePay(approved);
      setRejectedVariablePay(rejected);
    } catch (err) {
      setError('Error fetching variable pay approvals.');
    }
  };

  // Fetch Site Transfer Approval counts
  const fetchSiteTransfer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getAdminSiteTransferApproval`);
      const pending = response.data.filter(labour => labour.adminStatus === "Pending").length;
      const approved = response.data.filter(labour => labour.adminStatus === "Approved").length;
      const rejected = response.data.filter(labour => labour.adminStatus === "Rejected").length;
      setPendingSiteTransfer(pending);
      setApprovedSiteTransfer(approved);
      setRejectedSiteTransfer(rejected);
    } catch (err) {
      setError('Error fetching site transfer approvals.');
    }
  };

  // Use a single useEffect to fetch all data when component mounts
  useEffect(() => {
    fetchAttendance();
    fetchWages();
    fetchVariablePay();
    fetchSiteTransfer();
  }, []);

  // useEffect(() => {
  //   // Get counts from localStorage
  //   const pending = localStorage.getItem('pendingSiteTransfer');
  //   const approved = localStorage.getItem('approvedSiteTransfer');
  //   const rejected = localStorage.getItem('rejectedSiteTransfer');

  //   // Update state with the retrieved values
  //   setPendingSiteTransfer(pending || 0);
  //   setApprovedSiteTransfer(approved || 0);
  //   setRejectedSiteTransfer(rejected || 0);
  // }, []);

  // useEffect(() => {
  //   // Get counts from localStorage
  //   const pending = localStorage.getItem('pendingAttendance');
  //   const approved = localStorage.getItem('approvedAttendance');
  //   const rejected = localStorage.getItem('rejectedAttendance');

  //   // Update state with the retrieved values
  //   setPendingAttendance(pending || 0);
  //   setApprovedAttendance(approved || 0);
  //   setRejectedAttendance(rejected || 0);
  // }, []);




  return (
    <Grid container spacing={8} sx={{ mt: 0, px: 8 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Link to={'/adminApproval/adminAttendanceApproval'} style={{ textDecoration: 'none' }}>
          <Card
            sx={{
              backgroundColor: '#e6eefa',
              boxShadow: 'none',
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                transform: 'scale(1.03)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                Attendance Approval
              </Typography>
              <Box
                variant="body2"
                sx={{
                  fontSize: { xs: '25px', md: '45px' },
                  color: '#10294c',
                  fontWeight: "600"
                }}
              >
                <Typography>Pending: {pendingAttendance}</Typography>
                <Typography>Approved: {approvedAttendance}</Typography>
                <Typography>Rejected: {rejectedAttendance}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Link>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Link to={'/adminApproval/siteTransferApproval'} style={{ textDecoration: 'none' }}>
          <Card
            sx={{
              backgroundColor: '#e6eefa',
              boxShadow: 'none',
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                transform: 'scale(1.03)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                Site Transfer Approval
              </Typography>
              <Box
                variant="body2"
                sx={{
                  fontSize: { xs: '25px', md: '45px' },
                  color: '#10294c',
                  fontWeight: "600"
                }}
              >
                <Typography>Pending: {pendingSiteTransfer}</Typography>
                <Typography>Approved: {approvedSiteTransfer}</Typography>
                <Typography>Rejected: {rejectedSiteTransfer}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Link>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Link to={'/adminApproval/wagesApproval'} style={{ textDecoration: 'none' }}>
          <Card
            sx={{
              backgroundColor: '#e6eefa',
              boxShadow: 'none',
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                transform: 'scale(1.03)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                Wages Approval
              </Typography>
              <Box
                variant="body2"
                sx={{
                  fontSize: { xs: '25px', md: '45px' },
                  color: '#10294c',
                  fontWeight: "600"
                }}
              >
                <Typography>Pending: {pendingWagesCount}</Typography>
                <Typography>Approved: {approvedWagesCount}</Typography>
                <Typography>Rejected: {rejectedWagesCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Link>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Link to={'/adminApproval/variableInputApproval'} style={{ textDecoration: 'none' }}>
          <Card
            sx={{
              backgroundColor: '#e6eefa',
              boxShadow: 'none',
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                transform: 'scale(1.03)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                Variable Pay Approval
              </Typography>
              <Box
                variant="body2"
                sx={{
                  fontSize: { xs: '25px', md: '45px' },
                  color: '#10294c',
                  fontWeight: "600"
                }}
              >
                <Typography>Pending: {pendingVariablePay}</Typography>
                <Typography>Approved: {approvedVariablePay}</Typography>
                <Typography>Rejected: {rejectedVariablePay}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      
    </Grid>
  );
};

export default AdminApproval;
