import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchBar';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useUser } from '../../UserContext/UserContext';
import dayjs from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// toast.configure();

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

  useEffect(() => {
    // Get counts from localStorage
    const pending = localStorage.getItem('pendingSiteTransfer');
    const approved = localStorage.getItem('approvedSiteTransfer');
    const rejected = localStorage.getItem('rejectedSiteTransfer');

    // Update state with the retrieved values
    setPendingSiteTransfer(pending || 0);
    setApprovedSiteTransfer(approved || 0);
    setRejectedSiteTransfer(rejected || 0);
  }, []);

  useEffect(() => {
    // Get counts from localStorage
    const pending = localStorage.getItem('pendingAttendance');
    const approved = localStorage.getItem('approvedAttendance');
    const rejected = localStorage.getItem('rejectedAttendance');

    // Update state with the retrieved values
    setPendingAttendance(pending || 0);
    setApprovedAttendance(approved || 0);
    setRejectedAttendance(rejected || 0);
  }, []);

  useEffect(() => {
    // Get counts from localStorage
    const pending = localStorage.getItem('pendingVariablePay');
    const approved = localStorage.getItem('approvedVariablePay');
    const rejected = localStorage.getItem('rejectedVariablePay');

    // Update state with the retrieved values
    setPendingVariablePay(pending || 0);
    setApprovedVariablePay(approved || 0);
    setRejectedVariablePay(rejected || 0);
  }, []);


  useEffect(() => {
    // Get counts from localStorage
    const pending = localStorage.getItem('pendingWagesCount');
    const approved = localStorage.getItem('approvedWagesCount');
    const rejected = localStorage.getItem('rejectedWagesCount');

    // Update state with the retrieved values
    setPendingWagesCount(pending || 0);
    setApprovedWagesCount(approved || 0);
    setRejectedWagesCount(rejected || 0);
  }, []);

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



      <Grid item xs={12} sm={6} md={4}>
  <Link to={'/adminApproval/variableInputApproval'} style={{ textDecoration: 'none' }}>
    <Card
      sx={{
        background: 'linear-gradient(135deg, #eef5ff 0%, #d1e3ff 100%)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ color: '#0a2c65', fontWeight: 'bold', mb: 1 }}>
          Company Transfer Approval
        </Typography>

        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.6)',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: '18px', color: '#10294c', fontWeight: 500 }}>
            Pending: <span style={{ fontWeight: 600 }}>{pendingVariablePay}</span>
          </Typography>
          <Typography sx={{ fontSize: '18px', color: '#10294c', fontWeight: 500 }}>
            Approved: <span style={{ fontWeight: 600 }}>{approvedVariablePay}</span>
          </Typography>
          <Typography sx={{ fontSize: '18px', color: '#10294c', fontWeight: 500 }}>
            Rejected: <span style={{ fontWeight: 600 }}>{rejectedVariablePay}</span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Link>
</Grid>

    </Grid>
  );
};

export default AdminApproval;
