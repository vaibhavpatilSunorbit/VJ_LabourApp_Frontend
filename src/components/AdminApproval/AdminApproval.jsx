// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import { API_BASE_URL } from '../../Data';

// const AdminApproval = ({ onFormSubmit }) => {
//   const location = useLocation();
//   const [pendingSiteTransfer, setPendingSiteTransfer] = useState(0);
//   const [approvedSiteTransfer, setApprovedSiteTransfer] = useState(0);
//   const [rejectedSiteTransfer, setRejectedSiteTransfer] = useState(0);

//   const [pendingAttendance, setPendingAttendance] = useState(0);
//   const [approvedAttendance, setApprovedAttendance] = useState(0);
//   const [rejectedAttendance, setRejectedAttendance] = useState(0);

//   const [pendingVariablePay, setPendingVariablePay] = useState(0);
//   const [approvedVariablePay, setApprovedVariablePay] = useState(0);
//   const [rejectedVariablePay, setRejectedVariablePay] = useState(0);

//   const [pendingWagesCount, setPendingWagesCount] = useState(0);
//   const [approvedWagesCount, setApprovedWagesCount] = useState(0);
//   const [rejectedWagesCount, setRejectedWagesCount] = useState(0);

//   const [error, setError] = useState('');
//    // Fetch Attendance Approval counts
//    const fetchAttendance = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/labours/LabourAttendanceApproval`);
//       const pending = response.data.filter(labour => labour.ApprovalStatus === "Pending").length;
//       const approved = response.data.filter(labour => labour.ApprovalStatus === "Approved").length;
//       const rejected = response.data.filter(labour => labour.ApprovalStatus === "Rejected").length;
//       setPendingAttendance(pending);
//       setApprovedAttendance(approved);
//       setRejectedAttendance(rejected);
//     } catch (err) {
//       setError('Error fetching attendance approvals.');
//     }
//   };

//   // Fetch Wages Approval counts
//   const fetchWages = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/labours/wages/adminApprovals`);
//       const pending = response.data.filter(labour => labour.ApprovalStatus === "Pending").length;
//       const approved = response.data.filter(labour => labour.ApprovalStatus === "Approved").length;
//       const rejected = response.data.filter(labour => labour.ApprovalStatus === "Rejected").length;
//       setPendingWagesCount(pending);
//       setApprovedWagesCount(approved);
//       setRejectedWagesCount(rejected);
//     } catch (err) {
//       setError('Error fetching wages approvals.');
//     }
//   };

//   // Fetch Variable Pay Approval counts
//   const fetchVariablePay = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/insentive/admin/getVariablePayAdminApprovals`);
//       const pending = response.data.filter(labour => labour.ApprovalStatusPay === "AdminPending").length;
//       const approved = response.data.filter(labour => labour.ApprovalStatusPay === "Approved").length;
//       const rejected = response.data.filter(labour => labour.ApprovalStatusPay === "Rejected").length;
//       setPendingVariablePay(pending);
//       setApprovedVariablePay(approved);
//       setRejectedVariablePay(rejected);
//     } catch (err) {
//       setError('Error fetching variable pay approvals.');
//     }
//   };

//   // Fetch Site Transfer Approval counts
//   const fetchSiteTransfer = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/getAdminSiteTransferApproval`);
//       const pending = response.data.filter(labour => labour.adminStatus === "Pending").length;
//       const approved = response.data.filter(labour => labour.adminStatus === "Approved").length;
//       const rejected = response.data.filter(labour => labour.adminStatus === "Rejected").length;
//       setPendingSiteTransfer(pending);
//       setApprovedSiteTransfer(approved);
//       setRejectedSiteTransfer(rejected);
//     } catch (err) {
//       setError('Error fetching site transfer approvals.');
//     }
//   };

//   // Use a single useEffect to fetch all data when component mounts
//   useEffect(() => {
//     fetchAttendance();
//     fetchWages();
//     fetchVariablePay();
//     fetchSiteTransfer();
//   }, []);

//   // useEffect(() => {
//   //   // Get counts from localStorage
//   //   const pending = localStorage.getItem('pendingSiteTransfer');
//   //   const approved = localStorage.getItem('approvedSiteTransfer');
//   //   const rejected = localStorage.getItem('rejectedSiteTransfer');

//   //   // Update state with the retrieved values
//   //   setPendingSiteTransfer(pending || 0);
//   //   setApprovedSiteTransfer(approved || 0);
//   //   setRejectedSiteTransfer(rejected || 0);
//   // }, []);

//   // useEffect(() => {
//   //   // Get counts from localStorage
//   //   const pending = localStorage.getItem('pendingAttendance');
//   //   const approved = localStorage.getItem('approvedAttendance');
//   //   const rejected = localStorage.getItem('rejectedAttendance');

//   //   // Update state with the retrieved values
//   //   setPendingAttendance(pending || 0);
//   //   setApprovedAttendance(approved || 0);
//   //   setRejectedAttendance(rejected || 0);
//   // }, []);




//   return (
//     <Grid container spacing={8} sx={{ mt: 0, px: 8 }}>
//       <Grid item xs={12} sm={6} md={4}>
//         <Link to={'/adminApproval/adminAttendanceApproval'} style={{ textDecoration: 'none' }}>
//           <Card
//             sx={{
//               backgroundColor: '#e6eefa',
//               boxShadow: 'none',
//               minHeight: '220px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               '&:hover': {
//                 transform: 'scale(1.03)',
//                 transition: 'transform 0.3s, box-shadow 0.3s',
//               },
//             }}
//           >
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
//                 Attendance Approval
//               </Typography>
//               <Box
//                 variant="body2"
//                 sx={{
//                   fontSize: { xs: '25px', md: '45px' },
//                   color: '#10294c',
//                   fontWeight: "600"
//                 }}
//               >
//                 <Typography>Pending: {pendingAttendance}</Typography>
//                 <Typography>Approved: {approvedAttendance}</Typography>
//                 <Typography>Rejected: {rejectedAttendance}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Link>
//       </Grid>

//       <Grid item xs={12} sm={6} md={4}>
//         <Link to={'/adminApproval/siteTransferApproval'} style={{ textDecoration: 'none' }}>
//           <Card
//             sx={{
//               backgroundColor: '#e6eefa',
//               boxShadow: 'none',
//               minHeight: '220px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               '&:hover': {
//                 transform: 'scale(1.03)',
//                 transition: 'transform 0.3s, box-shadow 0.3s',
//               },
//             }}
//           >
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
//                 Site Transfer Approval
//               </Typography>
//               <Box
//                 variant="body2"
//                 sx={{
//                   fontSize: { xs: '25px', md: '45px' },
//                   color: '#10294c',
//                   fontWeight: "600"
//                 }}
//               >
//                 <Typography>Pending: {pendingSiteTransfer}</Typography>
//                 <Typography>Approved: {approvedSiteTransfer}</Typography>
//                 <Typography>Rejected: {rejectedSiteTransfer}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Link>
//       </Grid>

//       <Grid item xs={12} sm={6} md={4}>
//         <Link to={'/adminApproval/wagesApproval'} style={{ textDecoration: 'none' }}>
//           <Card
//             sx={{
//               backgroundColor: '#e6eefa',
//               boxShadow: 'none',
//               minHeight: '220px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               '&:hover': {
//                 transform: 'scale(1.03)',
//                 transition: 'transform 0.3s, box-shadow 0.3s',
//               },
//             }}
//           >
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
//                 Wages Approval
//               </Typography>
//               <Box
//                 variant="body2"
//                 sx={{
//                   fontSize: { xs: '25px', md: '45px' },
//                   color: '#10294c',
//                   fontWeight: "600"
//                 }}
//               >
//                 <Typography>Pending: {pendingWagesCount}</Typography>
//                 <Typography>Approved: {approvedWagesCount}</Typography>
//                 <Typography>Rejected: {rejectedWagesCount}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Link>
//       </Grid>

//       <Grid item xs={12} sm={6} md={4}>
//         <Link to={'/adminApproval/variableInputApproval'} style={{ textDecoration: 'none' }}>
//           <Card
//             sx={{
//               backgroundColor: '#e6eefa',
//               boxShadow: 'none',
//               minHeight: '220px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               '&:hover': {
//                 transform: 'scale(1.03)',
//                 transition: 'transform 0.3s, box-shadow 0.3s',
//               },
//             }}
//           >
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
//                 Variable Pay Approval
//               </Typography>
//               <Box
//                 variant="body2"
//                 sx={{
//                   fontSize: { xs: '25px', md: '45px' },
//                   color: '#10294c',
//                   fontWeight: "600"
//                 }}
//               >
//                 <Typography>Pending: {pendingVariablePay}</Typography>
//                 <Typography>Approved: {approvedVariablePay}</Typography>
//                 <Typography>Rejected: {rejectedVariablePay}</Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Link>
//       </Grid>
      
//     </Grid>
//   );
// };

// export default AdminApproval;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { API_BASE_URL } from '../../Data';

// const AdminApproval = () => {
//   const [pendingSiteTransfer, setPendingSiteTransfer] = useState(0);
//   const [approvedSiteTransfer, setApprovedSiteTransfer] = useState(0);
//   const [rejectedSiteTransfer, setRejectedSiteTransfer] = useState(0);

//   const [pendingAttendance, setPendingAttendance] = useState(0);
//   const [approvedAttendance, setApprovedAttendance] = useState(0);
//   const [rejectedAttendance, setRejectedAttendance] = useState(0);

//   const [pendingVariablePay, setPendingVariablePay] = useState(0);
//   const [approvedVariablePay, setApprovedVariablePay] = useState(0);
//   const [rejectedVariablePay, setRejectedVariablePay] = useState(0);

//   const [pendingWagesCount, setPendingWagesCount] = useState(0);
//   const [approvedWagesCount, setApprovedWagesCount] = useState(0);
//   const [rejectedWagesCount, setRejectedWagesCount] = useState(0);

//   const [error, setError] = useState('');

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/labours/LabourAttendanceApproval`);
//       setPendingAttendance(res.data.filter(l => l.ApprovalStatus === "Pending").length);
//       setApprovedAttendance(res.data.filter(l => l.ApprovalStatus === "Approved").length);
//       setRejectedAttendance(res.data.filter(l => l.ApprovalStatus === "Rejected").length);
//     } catch {
//       setError('Error fetching attendance approvals.');
//     }
//   };

//   const fetchWages = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/labours/wages/adminApprovals`);
//       setPendingWagesCount(res.data.filter(l => l.ApprovalStatus === "Pending").length);
//       setApprovedWagesCount(res.data.filter(l => l.ApprovalStatus === "Approved").length);
//       setRejectedWagesCount(res.data.filter(l => l.ApprovalStatus === "Rejected").length);
//     } catch {
//       setError('Error fetching wages approvals.');
//     }
//   };

//   const fetchVariablePay = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/insentive/admin/getVariablePayAdminApprovals`);
//       setPendingVariablePay(res.data.filter(l => l.ApprovalStatusPay === "AdminPending").length);
//       setApprovedVariablePay(res.data.filter(l => l.ApprovalStatusPay === "Approved").length);
//       setRejectedVariablePay(res.data.filter(l => l.ApprovalStatusPay === "Rejected").length);
//     } catch {
//       setError('Error fetching variable pay approvals.');
//     }
//   };

//   const fetchSiteTransfer = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/getAdminSiteTransferApproval`);
//       setPendingSiteTransfer(res.data.filter(l => l.adminStatus === "Pending").length);
//       setApprovedSiteTransfer(res.data.filter(l => l.adminStatus === "Approved").length);
//       setRejectedSiteTransfer(res.data.filter(l => l.adminStatus === "Rejected").length);
//     } catch {
//       setError('Error fetching site transfer approvals.');
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//     fetchWages();
//     fetchVariablePay();
//     fetchSiteTransfer();
//   }, []);

//   const cardStyle = {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     minHeight: '200px',
//     padding: '20px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//     cursor: 'pointer',
//     '&:hover': {
//       transform: 'translateY(-8px) scale(1.03)',
//       boxShadow: '0 15px 25px rgba(0,0,0,0.2)',
//     },
//   };

//   const titleStyle = {
//     fontWeight: '700',
//     fontSize: '20px',
//     marginBottom: '16px',
//     color: '#222',
//   };

//   const countStyle = {
//     fontSize: '16px',
//     color: '#555',
//     margin: '6px 0',
//   };

//   const approvals = [
//     {
//       title: "Attendance Approval",
//       link: "/adminApproval/adminAttendanceApproval",
//       pending: pendingAttendance,
//       approved: approvedAttendance,
//       rejected: rejectedAttendance,
//     },
//     {
//       title: "Site Transfer Approval",
//       link: "/adminApproval/siteTransferApproval",
//       pending: pendingSiteTransfer,
//       approved: approvedSiteTransfer,
//       rejected: rejectedSiteTransfer,
//     },
//     {
//       title: "Wages Approval",
//       link: "/adminApproval/wagesApproval",
//       pending: pendingWagesCount,
//       approved: approvedWagesCount,
//       rejected: rejectedWagesCount,
//     },
//     {
//       title: "Variable Pay Approval",
//       link: "/adminApproval/variableInputApproval",
//       pending: pendingVariablePay,
//       approved: approvedVariablePay,
//       rejected: rejectedVariablePay,
//     },
//   ];

//   return (
//     <Grid container spacing={4} sx={{ mt: 3, px: 5 }}>
//       {approvals.map((item, index) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//           <Link to={item.link} style={{ textDecoration: 'none' }}>
//             <Card sx={cardStyle}>
//               <CardContent>
//                 <Typography sx={titleStyle}>{item.title}</Typography>
//                 <Box>
//                   <Typography sx={countStyle}>Pending: {item.pending}</Typography>
//                   <Typography sx={countStyle}>Approved: {item.approved}</Typography>
//                   <Typography sx={countStyle}>Rejected: {item.rejected}</Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Link>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default AdminApproval;
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

