
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Badge,
  Alert,
  Snackbar,
  Container,
  Paper,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../Data';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentsIcon from '@mui/icons-material/Payments';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const AdminApproval = () => {
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
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/labours/LabourAttendanceApproval`);
      setPendingAttendance(res.data.filter(l => l.ApprovalStatus === "Pending").length);
      setApprovedAttendance(res.data.filter(l => l.ApprovalStatus === "Approved").length);
      setRejectedAttendance(res.data.filter(l => l.ApprovalStatus === "Rejected").length);
    } catch (err) {
      setError('Error fetching attendance approvals.');
      setOpenSnackbar(true);
    }
  };

  const fetchWages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/labours/wages/adminApprovals`);
      setPendingWagesCount(res.data.filter(l => l.ApprovalStatus === "Pending").length);
      setApprovedWagesCount(res.data.filter(l => l.ApprovalStatus === "Approved").length);
      setRejectedWagesCount(res.data.filter(l => l.ApprovalStatus === "Rejected").length);
    } catch (err) {
      setError('Error fetching wages approvals.');
      setOpenSnackbar(true);
    }
  };

  const fetchVariablePay = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/insentive/admin/getVariablePayAdminApprovals`);
      setPendingVariablePay(res.data.filter(l => l.ApprovalStatusPay === "AdminPending").length);
      setApprovedVariablePay(res.data.filter(l => l.ApprovalStatusPay === "Approved").length);
      setRejectedVariablePay(res.data.filter(l => l.ApprovalStatusPay === "Rejected").length);
    } catch (err) {
      setError('Error fetching variable pay approvals.');
      setOpenSnackbar(true);
    }
  };

  const fetchSiteTransfer = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/getAdminSiteTransferApproval`);
      setPendingSiteTransfer(res.data.filter(l => l.adminStatus === "Pending").length);
      setApprovedSiteTransfer(res.data.filter(l => l.adminStatus === "Approved").length);
      setRejectedSiteTransfer(res.data.filter(l => l.adminStatus === "Rejected").length);
    } catch (err) {
      setError('Error fetching site transfer approvals.');
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAttendance(),
        fetchWages(),
        fetchVariablePay(),
        fetchSiteTransfer()
      ]);
      setLoading(false);
    };
    
    fetchAllData();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const approvals = [
    {
      title: "Attendance Approval",
      link: "/adminApproval/adminAttendanceApproval",
      pending: pendingAttendance,
      approved: approvedAttendance,
      rejected: rejectedAttendance,
      icon: <EventNoteIcon sx={{ fontSize: 40 }} />,
      color: "#4361ee",
      bgGradient: "linear-gradient(135deg, #4361ee15 0%, #4361ee05 100%)"
    },
    {
      title: "Site Transfer Approval",
      link: "/adminApproval/siteTransferApproval",
      pending: pendingSiteTransfer,
      approved: approvedSiteTransfer,
      rejected: rejectedSiteTransfer,
      icon: <TransferWithinAStationIcon sx={{ fontSize: 40 }} />,
      color: "#3a0ca3",
      bgGradient: "linear-gradient(135deg, #3a0ca315 0%, #3a0ca305 100%)"
    },
    {
      title: "Wages Approval",
      link: "/adminApproval/wagesApproval",
      pending: pendingWagesCount,
      approved: approvedWagesCount,
      rejected: rejectedWagesCount,
      icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
      color: "#7209b7",
      bgGradient: "linear-gradient(135deg, #7209b715 0%, #7209b705 100%)"
    },
    {
      title: "Variable Pay Approval",
      link: "/adminApproval/variableInputApproval",
      pending: pendingVariablePay,
      approved: approvedVariablePay,
      rejected: rejectedVariablePay,
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      color: "#f72585",
      bgGradient: "linear-gradient(135deg, #f7258515 0%, #f7258505 100%)"
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: 'transparent' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600, color: '#1a237e' }}>
          Admin Approval Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#546e7a' }}>
          Monitor and manage all approval requests across different departments
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {approvals.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link to={item.link} style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  background: item.bgGradient,
                  border: `1px solid ${item.color}20`,
                  overflow: 'visible',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Badge 
                  badgeContent={item.pending} 
                  color="error" 
                  sx={{ 
                    position: 'absolute', 
                    top: -8, 
                    right: 16,
                    '& .MuiBadge-badge': {
                      fontSize: '0.9rem',
                      height: 24,
                      minWidth: 24,
                      borderRadius: 12,
                    }
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      mr: 2
                    }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: item.color }}>
                      {item.title}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <PendingActionsIcon sx={{ color: '#ff9800', mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Pending: <span style={{ fontWeight: 700 }}>{item.pending}</span>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Approved: <span style={{ fontWeight: 700 }}>{item.approved}</span>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon sx={{ color: '#f44336', mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Rejected: <span style={{ fontWeight: 700 }}>{item.rejected}</span>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip 
                      label="View Details" 
                      size="small" 
                      sx={{ 
                        backgroundColor: item.color, 
                        color: 'white',
                        '&:hover': {
                          backgroundColor: `${item.color}dd`,
                        }
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminApproval;

