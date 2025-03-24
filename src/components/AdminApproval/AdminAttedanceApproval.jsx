
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  TablePagination,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  IconButton, Checkbox,
  Menu,
  MenuItem, Select, Badge
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SarchBar/SearchRegister';
import ViewDetails from '../ViewDetails/ViewDetails';
import Loading from "../Loading/Loading";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { API_BASE_URL } from "../../Data";
import InfoIcon from '@mui/icons-material/Info';
import jsPDF from 'jspdf';
import { useUser } from '../../UserContext/UserContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CircleIcon from '@mui/icons-material/Circle';

const AdminAttedanceApproval = ({ onApprove, departments, projectNames, labour, labourlist }) => {
  const { user } = useUser();
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [tabValue, setTabValue] = useState(0);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isRejectReasonPopupOpen, setIsRejectReasonPopupOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false); // New state for confirmation dialog
  const [labourToApprove, setLabourToApprove] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState(new Set());
  const theme = useTheme();
  const [resubmittedLabours, setResubmittedLabours] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [ledgerId, setLedgerId] = useState(null);
  const [isEditLabourOpen, setIsEditLabourOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [IsApproved, setIsApproved] = useState(false);
  // const [labourIds, setLabourIds] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [esslStatuses, setEsslStatuses] = useState({});
  const [employeeMasterStatuses, setEmployeeMasterStatuses] = useState({});
  // const { labourId } = location.state || {};
  const { hideResubmit, labourId } = location.state || {};
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For the dropdown menu
  const [filter, setFilter] = useState(""); // To store selected filter
  const [filteredIconLabours, setFilteredIconLabours] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [statuses, setStatuses] = useState({});
  const hasFetchedStatuses = useRef(false);
  const [submittedLabourIds, setSubmittedLabourIds] = useState([]);
  const [approvingLabours, setApprovingLabours] = useState(() => JSON.parse(localStorage.getItem('approvingLabours')) || []);
  const [approvedLabours, setApprovedLabours] = useState(() => JSON.parse(localStorage.getItem('approvedLabours')) || []);
  const [labourIds, setLabourIds] = useState(() => JSON.parse(localStorage.getItem('labourIds')) || []);
  const [processingLabours, setProcessingLabours] = useState(new Set());
  const [selectedSite, setSelectedSite] = useState({});
  const [newSite, setNewSite] = useState(null);
  const [openDialogSite, setOpenDialogSite] = useState(false);
  const [statusesSite, setStatusesSite] = useState({});
  const [previousTabValue, setPreviousTabValue] = useState(tabValue);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [selectedLabourIds, setSelectedLabourIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMassModalOpen, setIsMassModalOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/insentive/searchLaboursFromAttendanceApproval?q=${searchQuery}`);
      setSearchResults(response.data);
      setPage(0);
    } catch (error) {
      setError('Error searching. Please try again.');
    }
  };

  const handleApproveConfirmOpen = (labour) => {
    setLabourToApprove(labour); // Set selected labour
    setIsApproveConfirmOpen(true);
  };

  const handleApproveConfirmClose = () => {
    setLabourToApprove(null); // Clear selected labour
    setIsApproveConfirmOpen(false);
  };







  //   useEffect(() => {
  //     fetchAttendanceLabours(); // Start fetching cached labours
  //   }, []);

  //   const fetchAttendanceLabours = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`${API_BASE_URL}/labours`);

  //       if (response.data.labours.length > 0) {
  //         setLabours(response.data.labours);  // Set labours directly from the cached result
  //         console.log('response.data.labours Attendance admin Approval........///......[[[[[', response.data.labours)
  //       } else {
  //         console.log('Fetch labour Attendance Approval.');
  //         setHasMore(false);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching labours:", error);
  //       setLoading(false);
  //     }
  //   };



  useEffect(() => {
    if (hideResubmit && labourId) {
      setSubmittedLabourIds(prevIds => [...prevIds, labourId]);
    }
  }, [hideResubmit, labourId]);

  //   const handleReject = async (id, rejectReason) => {
  //     if (!id || !rejectReason) {
  //         toast.error('Labour ID and rejection reason are required.');
  //         return;
  //     }

  //     try {
  //         const response = await axios.put(
  //             `${API_BASE_URL}/labours/attendance/reject/${id}`,
  //             { rejectReason }, // Include rejectReason in the request body
  //             {
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                 },
  //             }
  //         );

  //         if (response.data.success) {
  //             setLabours(prevLabours =>
  //                 prevLabours.map(labour =>
  //                     labour.id === id
  //                         ? { ...labour, ApprovalStatus: 'Rejected', rejectReason }
  //                         : labour
  //                 )
  //             );
  //             toast.success('Attendance rejected successfully.');
  //             setIsRejectPopupOpen(false); // Close modal
  //         } else {
  //             toast.error('Failed to reject attendance. Please try again.');
  //         }
  //     } catch (error) {
  //         console.error('Error rejecting attendance:', error);
  //         toast.error('Error rejecting attendance. Please try again.');
  //     }
  // };

  const handleReject = async (AttendanceId) => {
    if (!AttendanceId) {
      toast.error('Attendance ID is missing.');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/labours/attendance/rejectFromAdmin`, null, {
        params: { AttendanceId, rejectReason },
      });

      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.AttendanceId === AttendanceId ? { ...labour, ApprovalStatus: 'Rejected', rejectReason } : labour
          )
        );
        toast.success('Attendance Rejected successfully.');
        setIsApproveConfirmOpen(false);
        handleApproveConfirmClose()
      } else {
        toast.error('Failed to Reject attendance. Please try again.');
      }
    } catch (error) {
      console.error('Error Rejected attendance:', error);
      toast.error('Error Rejected attendance. Please try again.');
    }
  };



  const approveLabour = async (AttendanceId) => {
    if (!AttendanceId) {
      toast.error('Attendance ID is missing.');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/labours/attendance/approve`, null, {
        params: { AttendanceId },
      });

      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.AttendanceId === AttendanceId ? { ...labour, ApprovalStatus: 'Approved' } : labour
          )
        );
        toast.success('Attendance approved successfully.');
        setIsApproveConfirmOpen(false);
      } else {
        toast.error('Failed to approve attendance. Please try again.');
      }
    } catch (error) {
      console.error('Error approving attendance:', error);
      toast.error('Error approving attendance. Please try again.');
    }
  };


  const openMassApproveRejectModal = () => {
    if (selectedLabourIds.length === 0) {
      toast.error('No labours selected!');
      return;
    }
    setRejectReason('');  // Clear any old reason
    setIsMassModalOpen(true); 
  };

  const closeMassApproveRejectModal = () => {
    setIsMassModalOpen(false);
    setRejectReason('');
  };

  const handleMassApprove = async () => {
    if (selectedLabourIds.length === 0) {
      toast.error('No labours selected!');
      return;
    }
    console.log('selectedLabourIds atendance',selectedLabourIds)
    try {
      // For each selected "labourID", find the labour object in state
      for (const labourID of selectedLabourIds) {
        console.log('labourID atendance',labourID)
        const labourObj = labours.find((labour) => labour.AttendanceId === labourID);
        if (!labourObj) {
          console.warn(`No labour found with labourID=${labourID}`);
          continue;
        }
        if (!labourObj.AttendanceId) {
          console.warn(`No id found for labourID=${labourID}`);
          continue;
        }
        // Call your existing endpoint with the labour's id
        const response = await axios.put(`${API_BASE_URL}/labours/attendance/approve`, null, {
          params: { AttendanceId: labourObj.AttendanceId },
        });
  
        if (!response.data.success) {
          // Optionally handle partial failures
          toast.error(`Failed to approve labour with id ${labourObj.AttendanceId}`);
        }
      }
  
      // After all requests are done: update local state
      setLabours((prevLabours) =>
        prevLabours.map((labour) =>
          selectedLabourIds.includes(labour.labourID)
            ? { ...labour, ApprovalStatus: 'Approved' }
            : labour
        )
      );
  
      toast.success(`${selectedLabourIds.length} labour(s) approved successfully.`);
    } catch (error) {
      console.error('Error approving labours:', error);
      toast.error('Error approving selected labours. Please try again.');
    } finally {
      // Clean up
      setSelectedLabourIds([]);
      setIsMassModalOpen(false);
    }
  };
  
  const handleMassReject = async () => {
    if (selectedLabourIds.length === 0) {
      toast.error('No labours selected!');
      return;
    }
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
  
    try {
      // For each selected "labourID", find the labour object in state
      for (const labourID of selectedLabourIds) {
        const labourObj = labours.find((labour) => labour.labourID === labourID);
        if (!labourObj) {
          console.log(`No labour found with labourID=${labourID}`);
          continue;
        }
        if (!labourObj.id) {
          console.log(`No id found for labourID=${labourID}`);
          continue;
        }
  
        // Reject the labour
        const response = await axios.put(`${API_BASE_URL}/labours/attendance/rejectFromAdmin`, {
          params: { 
            id: labourObj.id, 
            rejectReason: rejectReason 
          },
        });
  
        if (!response.data.success) {
          toast.error(`Failed to reject labour with id ${labourObj.id}`);
        }
      }
  
      // Update local state to mark them as Rejected
      setLabours((prev) =>
        prev.map((labour) =>
          selectedLabourIds.includes(labour.labourID)
            ? { ...labour, ApprovalStatusPay: 'Rejected', rejectReason: rejectReason }
            : labour
        )
      );
  
      toast.success(`${selectedLabourIds.length} labour(s) rejected successfully.`);
    } catch (error) {
      console.error('Error rejecting labours:', error);
      toast.error('Error rejecting selected labours. Please try again.');
    } finally {
      setSelectedLabourIds([]);
      setIsMassModalOpen(false);
    }
  };

  const handleEditLabourOpen = (labour) => {
    setSelectedLabour(labour);
    setIsEditLabourOpen(true);
  };

  const handleEditLabourClose = () => {
    setIsEditLabourOpen(false);
    setSelectedLabour(null);
  };

  const handleEditLabourConfirm = async () => {
    if (selectedLabour) {
      //   await handleEditLabour(selectedLabour);
      handleEditLabourClose();
    }
  };

  const openRejectPopup = (labour) => {
    setSelectedLabour(labour);
    setIsRejectPopupOpen(true);
  };

  const closeRejectPopup = () => {
    setSelectedLabour(null);
    setIsRejectPopupOpen(false);
  };

  const openRejectReasonPopup = (labour) => {
    setSelectedLabour(labour);
    setIsRejectReasonPopupOpen(true);
  };

  const closeRejectReasonPopup = () => {
    setSelectedLabour(null);
    setIsRejectReasonPopupOpen(false);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleSelectLabour = (selectedLabour) => {
    setSelectedLabour(selectedLabour);
  };

  // const handleEdit = (labour) => {
  //   navigate('/edit-labour', { state: { labour } });
  // };

  const handleEdit = (labour) => {
    setFormData(labour);
    setOpen(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  const fetchLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/LabourAttendanceApproval`);
      // console.log('API Response:', response.data);
      setLabours(response.data.map(labour => ({
        ...labour
      })));
      const pendingAttendance = response.data.filter((labour) => labour.ApprovalStatus === "Pending").length;
      const approvedAttendance = response.data.filter((labour) => labour.ApprovalStatus === "Approved").length;
      const rejectedAttendance = response.data.filter((labour) => labour.ApprovalStatus === "Rejected").length;

      // Update counts
      setPendingCount(pendingAttendance);
      setApprovedCount(approvedAttendance);
      setRejectedCount(rejectedAttendance);
      // console.log('Counts before navigating:', { pendingAttendance, approvedAttendance, rejectedAttendance });
      localStorage.setItem('pendingAttendance', pendingAttendance);
      localStorage.setItem('approvedAttendance', approvedAttendance);
      localStorage.setItem('rejectedAttendance', rejectedAttendance);
      setLoading(false);
    } catch (error) {
      // console.error('Error fetching labours:', error);
      setError('Error fetching labours. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSortLabours = async () => {
      await fetchLabours();
      setLabours((prevLabours) => {
        const sorted = [...prevLabours].sort((a, b) => b.id - a.id);
        // console.log('Sorted Labours:', sorted);
        return sorted;
      });
    };

    fetchAndSortLabours();
  }, [tabValue]);



  // useEffect(() => {
  //   fetchLabours();
  // }, []);


  const handleAccountNumberChange = (e) => {
    let cleanedValue = e.target.value.replace(/\D/g, '');
    if (cleanedValue.length > 16) {
      cleanedValue = cleanedValue.slice(0, 16);
    }
    setFormData({ ...formData, accountNumber: cleanedValue });
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    if (value.length >= 2) {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (e.nativeEvent.inputType === 'deleteContentBackward' && value.length <= 3) {
      value = value.slice(0, 2);
    }
    setFormData({ ...formData, expiryDate: value });
  };


  const handleClose = () => {
    setOpen(false);
  };


  // const API_BASE_URL = 'http://localhost:4000'; 
  // const API_BASE_URL = "https://laboursandbox.vjerp.com"; 
  // const API_BASE_URL = "https://vjlabour.vjerp.com"; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate expiry date format
    if (!/^\d{2}-\d{4}$/.test(formData.expiryDate)) {
      toast.error('Invalid expiry date format. Please use MM-YYYY.');
      return;
    }

    // Format the expiry date for sending to the backend
    const formattedExpiryDate = formData.expiryDate ? `${formData.expiryDate}` : null;

    // Create the formatted data object to send to the backend
    const formattedFormData = {
      ...formData,
      expiryDate: formattedExpiryDate,
    };

    try {
      // Directly send the PUT request to update the data in the table
      const updateResponse = await axios.put(`${API_BASE_URL}/labours/update/${formData.id}`, formattedFormData);

      if (updateResponse.status === 200) {
        toast.success('Labour details updated successfully.');
      } else {
        toast.error('Failed to update labour details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating labour details:', error);
      toast.error('Error updating labour details. Please try again.');
    }
  };


  const displayLabours = searchResults.length > 0 ? searchResults : labours;

  const filteredLabours = displayLabours.filter(labour => {
    if (tabValue === 0) {
      return labour.status === 'Pending';
    } else if (tabValue === 1) {
      return labour.status === 'Approved';
    } else {
      return labour.status === 'Rejected' || labour.status === 'Resubmitted' || labour.status === 'Disable';
    }
  });
  // const isAllSelected =  
  // filteredLabours.length > 0 &&
  // filteredLabours.every(labour => selectedLabourIds.includes(labour.labourID));

  const openPopup = async (labour) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/${labour.id}`);
      const labourDetails = response.data;

      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error fetching labour details:', error);
      toast.error('Error fetching labour details. Please try again.');
    }
  };

  const closePopup = () => {
    setSelectedLabour(null);
    setIsPopupOpen(false);
  };

  const handleApprove = async (id) => {

    handleApproveConfirmClose();
    if (!Array.isArray(id)) {
      id = [id];
    }
    setApprovingLabours((prev) => [...prev, ...id]);

    setLabourIds((prev) => [...prev, ...id]);
    // approve();

    setPopupMessage(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          textAlign: 'center',
          lineHeight: '1.5',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <p style={{ fontSize: '1.2em', color: '#343a40' }}>Your approval process has been started in the background.</p>
        <p style={{ fontSize: '1.2em', color: '#343a40' }}>You will be notified once each labour is approved sequentially.</p>
        <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
      </div>
    );
    setPopupType('success');
    setSaved(true);
    // await approveLabourQueue(id);
  };

  const getFilteredLaboursForTab = () => {
    if (tabValue === 0) {
      // Pending tab: Filter labours with "Pending" status
      return filteredIconLabours.length > 0
        ? filteredIconLabours.filter(labour => labour.ApprovalStatus === 'Pending')
        : labours.filter(labour => labour.ApprovalStatus === 'Pending');
    } else if (tabValue === 1) {
      // Approved tab: Filter labours with "Approved" status
      return filteredIconLabours.length > 0
        ? filteredIconLabours.filter(labour => labour.ApprovalStatus === 'Approved')
        : labours.filter(labour => labour.ApprovalStatus === 'Approved');
    } else if (tabValue === 2) {
      // Rejected tab: Filter labours with "Rejected" or "Resubmitted" status
      return filteredIconLabours.length > 0
        ? filteredIconLabours.filter(
          labour => labour.ApprovalStatus === 'Rejected' || labour.ApprovalStatus === 'Resubmitted' || labour.ApprovalStatus === 'Disable'
        )
        : labours.filter(
          labour => labour.ApprovalStatus === 'Rejected' || labour.ApprovalStatus === 'Resubmitted' || labour.ApprovalStatus === 'Disable'
        );
    }
    // return filteredIconLabours.length > 0 ? filteredIconLabours : labours;
    return filteredLabours.length > 0 ? filteredLabours : labours;
  };

    // Checkbox handling: select/deselect individual row
    const handleSelectRow = (event, labourId) => {
      if (event.target.checked) {
        setSelectedLabourIds(prev => [...prev, labourId]);
      } else {
        setSelectedLabourIds(prev => prev.filter(id => id !== labourId));
      }
    };
    
    const handleSelectAllRows = (event) => {
      if (event.target.checked) {
        const newSelected = labours
        ?.filter(labour => labour.ApprovalStatus === "Pending")
        .map(labour => labour.AttendanceId);
        setSelectedLabourIds(prev => [
          ...prev,
          ...newSelected.filter(id => !prev.includes(id)),
        ]);
        setIsAllSelected(true);
      } else {
        const newSelected = labours
        ?.filter(labour => labour.ApprovalStatus === "Pending")
        .map(labour => labour.AttendanceId);
        setSelectedLabourIds(prev => prev.filter(id => !newSelected.includes(id)));
        setIsAllSelected(false);
      }
    };
    

const openVariablePayModal = () => {
  if (selectedLabourIds.length === 0) {
    toast.error("No labours selected!");
    return;
  }
  setModalOpen(true);
};

const closeVariablePayModal = () => {
  setModalOpen(false);
};

  return (
    <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: isMobile ? 'auto' : 'auto', }}>
           <ToastContainer />
           {loading && <Loading />}
           <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
                    Admin | Attendance Approval
                </Typography>
        <SearchBar
          handleSubmit={handleSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          // handleSearch={() => {}}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectLabour={handleSelectLabour}
          showResults={false}
          className="search-bar"
        />
      </Box>
  


      <Box
        sx={{
          width: "auto",
          height: "auto",
          bgcolor: "white",
          marginBottom: "15px",
          p: 1,
          borderRadius: 2,
          boxShadow: 3,
          alignSelf: "flex-start",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="tabs example"
          sx={{
            ".MuiTabs-indicator": {
              display: "none",
            },
            minHeight: "auto",
          }}
        >
          <Tab
            label={`Pending (${pendingCount})`}
            //    label={
            //     <Box sx={{display:'flex'}}>
            //    <Box sx={{alignContent:'center'}}>Pending</Box>
            //    <Box sx={{p:'2px', borderRadius:'50%', fontSize:'15px', p:'5px'}}>{pendingCount}</Box>
            //    </Box>
            //   }
            style={{ color: tabValue === 0 ? "#8236BC" : "black" }}
            sx={{
              color: tabValue === 0 ? "white" : "black",
              bgcolor: tabValue === 0 ? "#EFE6F7" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "bold",
              mr: 1,
              minHeight: "auto",
              minWidth: "auto",
              // padding: "6px 12px",
              "&:hover": {
                bgcolor: tabValue === 0 ? "#EFE6F7" : "#EFE6F7",
              },
            }}
          />
          <Tab
            label={`Approved (${approvedCount})`}
            //   label={
            //     <Box sx={{display:'flex'}}>
            //    <Box sx={{alignContent:'center'}}>Approved</Box>
            //    <Box sx={{p:'2px', borderRadius:'50%', fontSize:'15px', p:'5px'}}>{approvedCount}</Box>
            //    </Box>
            //   }
            style={{ color: tabValue === 1 ? "rgb(43, 217, 144)" : "black" }}
            sx={{
              color: tabValue === 1 ? "white" : "black",
              bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              mr: 1,
              fontWeight: "bold",
              minHeight: "auto",
              minWidth: "auto",
              // padding: "6px 12px",
              "&:hover": {
                bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "rgb(229, 255, 225)",
              },
            }}
          />
          <Tab
            label={`Rejected (${rejectedCount})`}
            //   label={
            //     <Box sx={{display:'flex'}}>
            //    <Box sx={{alignContent:'center'}}>Rejected</Box>
            //    <Box sx={{p:'2px', borderRadius:'50%', fontSize:'15px', p:'5px'}}>{rejectedCount}</Box>
            //    </Box>
            //   }
            style={{ color: tabValue === 2 ? "rgb(255, 100, 100)" : "black" }}
            sx={{
              color: tabValue === 2 ? "white" : "black",
              bgcolor: tabValue === 2 ? "rgb(255, 229, 229)" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "bold",
              minHeight: "auto",
              minWidth: "auto",
              // padding: "6px 12px",   
              "&:hover": {
                bgcolor: tabValue === 2 ? "rgb(255, 229, 229)" : "rgb(255, 229, 229)",
              },
            }}
          />
        </Tabs>
        {selectedLabourIds.length > 0 && (
  <Button variant="outlined"  color="secondary" startIcon={<EditIcon />}  onClick={openMassApproveRejectModal}>
Approve/Reject ({selectedLabourIds.length})
  </Button>
)}

        <TablePagination
          className="custom-pagination"
          rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
          count={getFilteredLaboursForTab().length}
          //  count={filteredIconLabours.length > 0 ? filteredIconLabours.length : labours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>



      <TableContainer component={Paper} sx={{
        mb: isMobile ? 6 : 0,
        overflowX: 'auto',
        borderRadius: 2,
        boxShadow: 3,
        maxHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(75vh - 64px)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
        },
      }}>
        <Box sx={{ width: '100%' }}>
          <Table stickyHeader sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    padding: '12px',
                    '@media (max-width: 600px)': {
                      padding: '10px',
                    },
                    backgroundColor: 'white', // Ensure the background color is set
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  },
                  '& td': {
                    padding: '16px 9px', // Applying padding to all td elements
                    '@media (max-width: 600px)': {
                      padding: '14px 8px', // Adjust padding for smaller screens if needed
                    },
                  },
                }}
              >
                 {tabValue === 0 && <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAllRows}
                    inputProps={{ 'aria-label': 'select all labours' }}
                  /></TableCell>}
                <TableCell>Sr No</TableCell>
                <TableCell>Labour ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>First Punch</TableCell>
                <TableCell>Last Punch</TableCell>
                <TableCell>Overtime Manually</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Attendance Edit By</TableCell>
                {/* <TableCell>Status</TableCell> */}
                {tabValue !== 2 && <TableCell>Send Approval Date</TableCell>}
                {/* {tabValue !== 1 && tabValue !== 2 && <TableCell>Edit</TableCell>} */}
                {tabValue !== 1 && tabValue !== 2 && <TableCell>Action</TableCell>}
                {tabValue === 1 && <TableCell>Approve Date</TableCell>}
                {tabValue !== 0 && tabValue !== 1 && <TableCell>Rejected Date</TableCell>}
                {tabValue !== 0 && tabValue !== 1 && <TableCell>Reject Reason</TableCell>}
                {tabValue === 1 && <TableCell>Edit Date</TableCell>}

              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& td': {
                  padding: '16px 9px', // Applying padding to all td elements
                  '@media (max-width: 600px)': {
                    padding: '14px 8px', // Adjust padding for smaller screens if needed
                  },
                },
              }}
            >
              {(rowsPerPage > 0
                ? (searchResults.length > 0 ? searchResults : (filteredIconLabours.length > 0 ? filteredIconLabours : [...labours]))
                  .filter(labour => {
                    if (tabValue === 0) return labour.ApprovalStatus === 'Pending';
                    if (tabValue === 1) return labour.ApprovalStatus === 'Approved';
                    if (tabValue === 2) return labour.ApprovalStatus === 'Rejected';
                    return true; // fallback if no condition matches
                  })
                  .sort((a, b) => b.labourID - a.labourID) // Sort in descending order by id
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : (filteredIconLabours.length > 0 ? filteredIconLabours : [...labours])
                  .filter(labour => {
                    if (tabValue === 0) return labour.ApprovalStatus === 'Pending';
                    if (tabValue === 1) return labour.ApprovalStatus === 'Approved';
                    if (tabValue === 2) return labour.ApprovalStatus === 'Rejected';
                    return true; // fallback if no condition matches
                  })
                  .sort((a, b) => b.labourID - a.labourID)
              ).map((labour, index) => (
                <TableRow key={labour.id}>
                   {tabValue === 0 && (
                    <><TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLabourIds.includes(labour.AttendanceId)}
                      onChange={(e) => handleSelectRow(e, labour.AttendanceId)}
                      inputProps={{ 'aria-label': `select labour ${labour.AttendanceId}` }}
                    />
                  </TableCell> </>
                  )}
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{labour.LabourId}</TableCell>
                  <TableCell>{labour.Date ? new Date(labour.Date).toLocaleDateString('en-GB') : '-'}</TableCell>
                  <TableCell>{labour.FirstPunchManually}</TableCell>
                  <TableCell>{labour.LastPunchManually}</TableCell>
                  <TableCell>{labour.OvertimeManually}</TableCell>
                  <TableCell>{labour.RemarkManually}</TableCell>
                  <TableCell>{labour.OnboardName}</TableCell>
                  {/* <TableCell>{labour.status}</TableCell> */}
                  {/* <TableCell sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        padding: '7px 16px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        ...(labour.ApprovalStatus === 'Pending' && {
                          backgroundColor: '#EFE6F7',
                          color: '#8236BC',
                        }),
                        ...(labour.ApprovalStatus === 'Approved' && {
                          backgroundColor: '#E5FFE1',
                          color: '#54a36d',
                        }),
                        ...(labour.ApprovalStatus === 'Rejected' && {
                          backgroundColor: 'rgba(255, 105, 97, 0.3)',
                          color: '#F44336',
                        }),
                      }}
                    >
                      {labour.ApprovalStatus}

                    </Box>
                  </TableCell> */}
                  {tabValue === 0 && (
                    <>
                      <TableCell>{labour.LastUpdatedDate ? new Date(labour.LastUpdatedDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                    </>
                  )}
                  {tabValue === 1 && (
                    <>
                      <TableCell>{labour.ApprovalDate ? new Date(labour.ApprovalDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                    </>
                  )}

                  {tabValue === 2 && (
                    <>
                      <TableCell>{labour.RejectedDate ? new Date(labour.RejectedDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                    </>
                  )}
                  {tabValue === 2 && (
                    <TableCell>
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <InfoIcon onClick={() => {
                          setSelectedLabour(labour);
                          setIsRejectReasonPopupOpen(true);
                        }} style={{ cursor: 'pointer', }} />
                      </Box>
                    </TableCell>
                  )}

                  {/* {tabValue === 0 && (
                    <TableCell>
                      {(user.userType === 'user' && labour.ApprovalStatus === 'Pending') && (
                        <IconButton
                          onClick={() => handleEditLabourOpen(labour)} // Add your function here
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {(user.userType === 'admin' || user.userType === 'superadmin' && labour.ApprovalStatus === 'Pending') && (
                        <IconButton
                          onClick={() => handleEditLabourOpen(labour)} // Add your function here
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  )} */}
                  {/* {user.userType === 'user' && (
                    <TableCell>
                     
                      {labour.ApprovalStatus === 'Approved' && (
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: 'rgb(229, 255, 225)',
                            color: 'rgb(43, 217, 144)',
                            '&:hover': {
                              backgroundColor: 'rgb(229, 255, 225)',
                            },
                          }}
                          onClick={() => handleEdit(labour)}
                        >
                          Update
                        </Button>
                      )}
                    </TableCell>
                  )} */}

                  {user.userType === 'admin' || user.userType === 'superadmin' && (
                    <TableCell>
                      {labour.ApprovalStatus === 'Pending' && !approvedLabours.includes(labour.id) && !approvingLabours.includes(labour.id) && (
                        <>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: 'rgb(229, 255, 225)',
                              color: 'rgb(43, 217, 144)',
                              width: '100px',
                              marginRight: '10px',
                              marginBottom: '3px',
                              '&:hover': {
                                backgroundColor: 'rgb(229, 255, 225)',
                              },
                            }}
                            onClick={() => handleApproveConfirmOpen(labour)}
                            disabled={labour.IsApproveDisable === "true"}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: '#fce4ec',
                              color: 'rgb(255, 100, 100)',
                              width: '100px',
                              '&:hover': {
                                backgroundColor: '#f8bbd0',
                              },
                            }}
                            onClick={() => {
                              setSelectedLabour(labour);
                              setIsRejectPopupOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {/* {labour.ApprovalStatus === 'Approved' && (
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: 'rgb(229, 255, 225)',
                            color: 'rgb(43, 217, 144)',
                            '&:hover': {
                              backgroundColor: 'rgb(229, 255, 225)',
                            },
                          }}
                          onClick={() => handleEdit(labour)}
                        >
                          Update
                        </Button>
                      )} */}


                    </TableCell>
                  )}
                  {/* 
                  <TableCell>
                    <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{ cursor: 'pointer' }} />
                  </TableCell> */}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>



      <Modal
        open={isPopupOpen}
        onClose={closePopup}
        closeAfterTransition
      // BackdropComponent={Backdrop}
      // BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isPopupOpen}>
          <div className="modal">
            {selectedLabour && (
              <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
            )}
          </div>
        </Fade>
      </Modal>

      <Modal
        open={isRejectPopupOpen}
        onClose={closeRejectPopup}
        closeAfterTransition
      >
        <Fade in={isRejectPopupOpen}>
          <div className="modal">
            <Typography variant="h6" component="h2">
              Reject Labour
            </Typography>
            <TextField
              label="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
            />
            <Box mt={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="secondary" onClick={closeRejectPopup}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!rejectReason.trim()) {
                    toast.error('Please add a reason for rejection.');
                  } else {
                    handleReject(selectedLabour.AttendanceId, rejectReason);
                    closeRejectPopup();
                  }
                }}
                sx={{
                  ml: 2,
                  backgroundColor: '#fce4ec',
                  color: 'rgb(255, 100, 100)',
                  width: '100px',
                  '&:hover': {
                    backgroundColor: '#f8bbd0',
                  },
                }}
              >
                Reject
              </Button>
            </Box>
          </div>
        </Fade>
      </Modal>

      <Modal
        open={isRejectReasonPopupOpen}
        onClose={closeRejectReasonPopup}
        closeAfterTransition
      >
        <Fade in={isRejectReasonPopupOpen}>
          <div className="modal">
            <Typography variant="h6" component="h2" mb={2}>
              Rejection Reason
            </Typography>
            {selectedLabour && (
              <Typography variant="body1" component="p">
                {selectedLabour.RejectAttendanceReason}
              </Typography>
            )}
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="secondary" onClick={closeRejectReasonPopup} >
                Close
              </Button>
            </Box>
          </div>
        </Fade>
      </Modal>


      <Dialog
        open={isApproveConfirmOpen}
        onClose={handleApproveConfirmClose}
        aria-labelledby="approve-confirm-dialog-title"
        aria-describedby="approve-confirm-dialog-description"
      >
        <DialogTitle id="approve-confirm-dialog-title">
          Approve Labour
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="approve-confirm-dialog-description">
            Are you sure you want to approve attendance for this labour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleApproveConfirmClose}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
      onClick={async () => {
        if (!labourToApprove || !labourToApprove.AttendanceId) {
          toast.error('Labour data or ID is missing.');
          return;
        }
        handleApproveConfirmClose(); 
        setLoading(true);  // Start loading
        try {
          await approveLabour(labourToApprove.AttendanceId);
        } catch (error) {
          console.error(error);
          toast.error('Approval failed.');
        } finally {
          setLoading(false); // End loading
          
        }
      }}
      sx={{
        backgroundColor: 'rgb(229, 255, 225)',
        color: 'rgb(43, 217, 144)',
        width: '100px',
        marginRight: '10px',
        marginBottom: '3px',
        '&:hover': {
          backgroundColor: 'rgb(229, 255, 225)',
        },
      }}
      autoFocus
    >
      Approve
    </Button>
        </DialogActions>
      </Dialog>

      {saved && (
        <>
          <div className="overlay"></div>
          <div className={`popup ${popupType}`}>
            <h2>{popupType === 'success' ? 'Thank You!' : 'Error'}</h2>
            <p>{popupMessage}</p>
            <button className={`ok-button ${popupType}`} onClick={() => setSaved(false)}>
              <span className={`icon ${popupType}`}>
                {popupType === 'success' ? '✔' : '✘'}
              </span> Ok
            </button>
          </div>
        </>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Labour Details</DialogTitle>
        <DialogContent >
          {formData && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: isMobile ? '220px' : '400px', padding: 2 }}
            >
              <TextField
                label="Labour Name"
                name="labourName"
                value={formData.name}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: '100%' }}
              />
              <div className="bankDetails-field">
                <InputLabel id="account-number-label" sx={{ color: "black" }}>
                  Account Number
                </InputLabel>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  required
                  value={formData.accountNumber || ''}
                  onChange={handleAccountNumberChange}
                  style={{ padding: '18px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '95%', fontSize: '17px' }}
                  maxLength={16}
                  onKeyDown={(e) => {
                    if (
                      !(
                        (e.key >= '0' && e.key <= '9') || // Allow numbers
                        e.key === 'Backspace' ||
                        e.key === 'Delete' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight' ||
                        e.key === 'Tab'
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="expiryDate-field">
                <InputLabel id="expiry-date-label" sx={{ color: "black" }}>
                  Expiry Date
                </InputLabel>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  required
                  value={formData.expiryDate || ''}
                  onChange={handleExpiryDateChange}
                  placeholder="MM-YYYY"
                  style={{ padding: '18px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '95%', fontSize: '17px' }}
                  maxLength={7}
                />
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{
            backgroundColor: 'rgb(229, 255, 225)',
            color: 'rgb(43, 217, 144)',
            '&:hover': {
              backgroundColor: 'rgb(229, 255, 225)',
            },
          }}>Update</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={isEditLabourOpen}
        onClose={handleEditLabourClose}
        aria-labelledby="EditLabour-dialog-title"
        aria-describedby="EditLabour-description"
      >
        <DialogTitle id="EditLabour-title">
          Edit Labour
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="EditLabour-dialog-description">
            Are you sure you want to Edit this labour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditLabourClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditLabourConfirm} sx={{
            backgroundColor: 'rgb(229, 255, 225)',
            color: 'rgb(43, 217, 144)',
            width: '100px',
            marginRight: '10px',
            marginBottom: '3px',
            '&:hover': {
              backgroundColor: 'rgb(229, 255, 225)',
            },
          }} autoFocus>
            Edit
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={isMassModalOpen}
        onClose={closeMassApproveRejectModal}
      >
        <DialogTitle>Approve/Reject No. {selectedLabourIds.length} labours</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to approve or reject these selected labours? <br />
            If Reject, please provide a reason below:
          </DialogContentText>

          <TextField
            label="Reason for Rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            margin="normal"
            placeholder="If rejecting, please provide a reason."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeMassApproveRejectModal}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>

          {/* Reject Button */}
          <Button
            onClick={handleMassReject}
            sx={{
              backgroundColor: '#fce4ec',
              color: 'rgb(255, 100, 100)',
              '&:hover': {
                backgroundColor: '#f8bbd0',
              },
            }}
          >
            Reject
          </Button>

          {/* Approve Button */}
          <Button
            onClick={handleMassApprove}
            sx={{
              backgroundColor: 'rgb(229, 255, 225)',
              color: 'rgb(43, 217, 144)',
              '&:hover': {
                backgroundColor: 'rgb(229, 255, 225)',
              },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

    </Box>

  );
};

export default AdminAttedanceApproval;