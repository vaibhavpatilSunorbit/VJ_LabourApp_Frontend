
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
  DialogTitle, Checkbox,
  MenuItem, Select, Badge
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../../SarchBar/SearchRegister';
import ViewDetails from '../../ViewDetails/ViewDetails';
import Loading from "../../Loading/Loading";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';
import { API_BASE_URL } from "../../../Data";
import InfoIcon from '@mui/icons-material/Info';
import { useUser } from '../../../UserContext/UserContext';

const SiteTransferApproval = ({ onApprove, departments, projectNames, labour, labourlist }) => {
  const { user } = useUser();
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditLabourOpen, setIsEditLabourOpen] = useState(false);
  const { hideResubmit, labourId } = location.state || {};
  const [filteredIconLabours, setFilteredIconLabours] = useState([]);
  const hasFetchedStatuses = useRef(false);
  const [submittedLabourIds, setSubmittedLabourIds] = useState([]);
  const [approvingLabours, setApprovingLabours] = useState(() => JSON.parse(localStorage.getItem('approvingLabours')) || []);
  const [approvedLabours, setApprovedLabours] = useState(() => JSON.parse(localStorage.getItem('approvedLabours')) || []);
  const [labourIds, setLabourIds] = useState(() => JSON.parse(localStorage.getItem('labourIds')) || []);
  const [selectedSite, setSelectedSite] = useState({});
  const [statusesSite, setStatusesSite] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
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
      const response = await axios.get(`${API_BASE_URL}/insentive/searchFromSiteTransferApproval?q=${searchQuery}`);
      setSearchResults(response.data.map(labour => ({
        ...labour,
        IsApproveDisable: labour.IsApproveDisable === "true" || labour.IsApproveDisable === true,
      })));
      setPage(0);
    } catch (error) {
      setError('Error searching. Please try again.');
    }
  };

  const handleApproveConfirmOpen = (labour) => {
    setLabourToApprove(labour);
    setIsApproveConfirmOpen(true);
  };

  const handleApproveConfirmClose = () => {
    setLabourToApprove(null);
    setIsApproveConfirmOpen(false);
  };



  useEffect(() => {
    if (hideResubmit && labourId) {
      setSubmittedLabourIds(prevIds => [...prevIds, labourId]);
    }
  }, [hideResubmit, labourId]);


  const handleReject = async (id) => {
    if (!id) {
      toast.error('Attendance ID is missing.');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/rejectSiteTransferadmin`, { params: { id, rejectReason } });

      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, adminStatus: 'Rejected' } : labour
          )
        );
        toast.success(response.data.message || 'Attendance rejected successfully.');
        setIsApproveConfirmOpen(false);
        handleApproveConfirmClose();
      } else {
        toast.success(response.data.message || 'Failed to reject attendance. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting attendance:', error);
      toast.error('Error rejecting attendance. Please try again.');
    }
  };



  const approveLabour = async (id) => {
    if (!id) {
      toast.error('Attendance ID is missing.');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/approveSiteTransferadmin`, null, {
        params: { id },
      });

      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, adminStatus: 'Approved' } : labour
          )
        );
        toast.success(response.data.message || 'Attendance approved successfully.');
        setIsApproveConfirmOpen(false);
        handleApproveConfirmClose();
      } else {
        toast.success(response.data.message || 'Failed to approve attendance. Please try again.');
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

    try {
      for (const labourID of selectedLabourIds) {
        const labourObj = labours.find((labour) => labour.id === labourID);
        if (!labourObj) {
          console.warn(`No labour found with LabourID=${labourID}`);
          continue;
        }
        if (!labourObj.id) {
          console.warn(`No id found for LabourID=${labourID}`);
          continue;
        }

        const response = await axios.put(`${API_BASE_URL}/api/admin/approveSiteTransferadmin`, null, {
          params: { id: labourObj.id },
        });

        if (response.data.success) {
          toast.error(`Site transfer approved and processed successfully. ${labourObj.id}`);
        }
      }

      setLabours((prevLabours) =>
        prevLabours.map((labour) =>
          selectedLabourIds.includes(labour.LabourID)
            ? { ...labour, ApprovalStatus: 'Approved' }
            : labour
        )
      );

      toast.success(`${selectedLabourIds.length} labours approved successfully.`);
    } catch (error) {
      console.error('Error approving labours:', error);
      toast.error('Error approving selected labours. Please try again.');
    } finally {
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
      for (const labourID of selectedLabourIds) {
        const labourObj = labours.find((labour) => labour.id === labourID);
        if (!labourObj) {
          console.log(`No labour found with LabourID=${labourID}`);
          continue;
        }
        if (!labourObj.id) {
          console.log(`No id found for LabourID=${labourID}`);
          continue;
        }
        console.log(`No ithis kjfelkfjdk LabourID=${labourObj.id}`);
        console.log("hdcgjsdc ", labourID.id)
        const response = await axios.put(`${API_BASE_URL}/api/admin/rejectSiteTransferadmin`, {

          id: labourObj.id,
          rejectReason: rejectReason

        });

        if (!response.data.success) {
          toast.error(`Failed to reject labour with id ${labourObj}`);
        }
      }

      setLabours((prev) =>
        prev.map((labour) =>
          selectedLabourIds.includes(labour.LabourID)
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

  const handleEditLabour = async (labour) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/editSiteTransferadmin/${labour.id}`);
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(l =>
            l.id === labour.id ? { ...l, uploadAadhaarFront: null, contactNumber: null, isApproved: 1 } : l
          )
        );
        navigate('/kyc', { state: { labourId: labour.id } });
      } else {
        toast.error('Failed to Edit labour. Please try again.');
      }
    } catch (error) {
      console.error('Error Edit labour:', error);
      toast.error('Error Edit labour. Please try again.');
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

  const fetchLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getAdminSiteTransferApproval`);
      setLabours(response.data.map(labour => ({
        ...labour,
        IsApproveDisable: labour.IsApproveDisable === "true" || labour.IsApproveDisable === true,
      })));
      const pendingSiteTransfer = response.data.filter((labour) => labour.adminStatus === "Pending").length;
      const approvedSiteTransfer = response.data.filter((labour) => labour.adminStatus === "Approved").length;
      const rejectedSiteTransfer = response.data.filter((labour) => labour.adminStatus === "Rejected").length;

      setPendingCount(pendingSiteTransfer);
      setApprovedCount(approvedSiteTransfer);
      setRejectedCount(rejectedSiteTransfer);
      console.log('Counts before navigating:', { pendingSiteTransfer, approvedSiteTransfer, rejectedSiteTransfer });
      localStorage.setItem('pendingSiteTransfer', pendingSiteTransfer);
      localStorage.setItem('approvedSiteTransfer', approvedSiteTransfer);
      localStorage.setItem('rejectedSiteTransfer', rejectedSiteTransfer);
      setLoading(false);
    } catch (error) {
      setError('Error fetching labours. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSortLabours = async () => {
      await fetchLabours();
      setLabours((prevLabours) => {
        const sorted = [...prevLabours].sort((a, b) => b.id - a.id);
        return sorted;
      });
    };

    fetchAndSortLabours();
  }, [tabValue]);


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{2}-\d{4}$/.test(formData.expiryDate)) {
      toast.error('Invalid expiry date format. Please use MM-YYYY.');
      return;
    }

    const formattedExpiryDate = formData.expiryDate ? `${formData.expiryDate}` : null;

    const formattedFormData = {
      ...formData,
      expiryDate: formattedExpiryDate,
    };

    try {
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
  };

  const getFilteredLaboursForTab = () => {
    if (tabValue === 0) {
      return filteredIconLabours.length > 0
        ? filteredIconLabours.filter(labour => labour.adminStatus === 'Pending')
        : labours.filter(labour => labour.adminStatus === 'Pending');
    } else if (tabValue === 1) {
      return filteredIconLabours.length > 0
        ? filteredIconLabours.filter(labour => labour.adminStatus === 'Approved')
        : labours.filter(labour => labour.adminStatus === 'Approved');
    } else if (tabValue === 2) {
      return filteredIconLabours.length > 0
        ? filteredIconLabours.filter(
          labour => labour.adminStatus === 'Rejected' || labour.adminStatus === 'Resubmitted' || labour.adminStatus === 'Disable'
        )
        : labours.filter(
          labour => labour.adminStatus === 'Rejected' || labour.adminStatus === 'Resubmitted' || labour.adminStatus === 'Disable'
        );
    }
    return filteredLabours.length > 0 ? filteredLabours : labours;
  };


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
        ?.filter(labour => labour.adminStatus === "Pending")
        .map(labour => labour.LabourID);
      setSelectedLabourIds(prev => [
        ...prev,
        ...newSelected.filter(id => !prev.includes(id)),
      ]);
      setIsAllSelected(true);
    } else {
      const newSelected = labours
        ?.filter(labour => labour.adminStatus === "Pending")
        .map(labour => labour.LabourID);
      setSelectedLabourIds(prev => prev.filter(id => !newSelected.includes(id)));
      setIsAllSelected(false);
    }
  };




  return (
    <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: isMobile ? 'auto' : 'auto', }}>
      <ToastContainer />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
          Admin | Site Transfer Approval
        </Typography>
        <SearchBar
          handleSubmit={handleSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectLabour={handleSelectLabour}
          showResults={false}
          className="search-bar"
        />
      </Box>
      {loading && <Loading />}


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
              "&:hover": {
                bgcolor: tabValue === 0 ? "#EFE6F7" : "#EFE6F7",
              },
            }}
          />
          <Tab
            label={`Approved (${approvedCount})`}
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
              "&:hover": {
                bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "rgb(229, 255, 225)",
              },
            }}
          />
          <Tab
            label={`Rejected (${rejectedCount})`}
            style={{ color: tabValue === 2 ? "rgb(255, 100, 100)" : "black" }}
            sx={{
              color: tabValue === 2 ? "white" : "black",
              bgcolor: tabValue === 2 ? "rgb(255, 229, 229)" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "bold",
              minHeight: "auto",
              minWidth: "auto",
              "&:hover": {
                bgcolor: tabValue === 2 ? "rgb(255, 229, 229)" : "rgb(255, 229, 229)",
              },
            }}
          />
        </Tabs>
        {selectedLabourIds.length > 0 && (
          <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={openMassApproveRejectModal}>
            Approve/Reject ({selectedLabourIds.length})
          </Button>
        )}

        <TablePagination
          className="custom-pagination"
          rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
          count={getFilteredLaboursForTab().length}
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
                    backgroundColor: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  },
                  '& td': {
                    padding: '16px 9px',
                    '@media (max-width: 600px)': {
                      padding: '14px 8px',
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
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Current Site</TableCell>
                <TableCell>Transfer Site</TableCell>
                <TableCell>Transfer Date</TableCell>
                {tabValue === 2 && <TableCell>Remark</TableCell>}
                <TableCell>Site Transfer By</TableCell>
                {tabValue === 0 && <TableCell>Send Approval Date</TableCell>}
                {tabValue !== 1 && tabValue !== 2 && <TableCell>Action</TableCell>}
                {tabValue === 1 && <TableCell>Approve Date</TableCell>}
                {tabValue !== 0 && tabValue !== 1 && <TableCell>Rejected Date</TableCell>}
                {tabValue !== 0 && tabValue !== 1 && <TableCell>Reject Reason</TableCell>}
                {tabValue !== 0 && tabValue !== 1 && tabValue !== 2 && <TableCell>Edit Date</TableCell>}

              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& td': {
                  padding: '16px 9px',
                  '@media (max-width: 600px)': {
                    padding: '14px 8px',
                  },
                },
              }}
            >
              {(rowsPerPage > 0
                ? (searchResults.length > 0 ? searchResults : (filteredIconLabours.length > 0 ? filteredIconLabours : [...labours]))
                  .filter(labour => {
                    if (tabValue === 0) return labour.adminStatus === 'Pending';
                    if (tabValue === 1) return labour.adminStatus === 'Approved';
                    if (tabValue === 2) return labour.adminStatus === 'Rejected';
                    return true;
                  })
                  .sort((a, b) => b.labourID - a.labourID)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : (filteredIconLabours.length > 0 ? filteredIconLabours : [...labours])
                  .filter(labour => {
                    if (tabValue === 0) return labour.adminStatus === 'Pending';
                    if (tabValue === 1) return labour.adminStatus === 'Approved';
                    if (tabValue === 2) return labour.adminStatus === 'Rejected';
                    return true;
                  })
                  .sort((a, b) => b.labourID - a.labourID)
              ).map((labour, index) => (
                <TableRow key={labour.id}>
                  {tabValue === 0 && (
                    <><TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLabourIds.includes(labour.id)}
                        onChange={(e) => handleSelectRow(e, labour.id)}
                        inputProps={{ 'aria-label': `select labour ${labour.id}` }}
                      />
                    </TableCell> </>
                  )}
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{labour.LabourID}</TableCell>
                  <TableCell>{labour.name}</TableCell>
                  <TableCell>{labour.createdAt ? new Date(labour.createdAt).toLocaleDateString('en-GB') : '-'}</TableCell>
                  <TableCell>{labour.currentSiteName}</TableCell>
                  <TableCell>{labour.transferSiteName}</TableCell>
                  <TableCell>{labour.transferDate ? new Date(labour.transferDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                  {tabValue === 2 && <TableCell>{labour.rejectionReason}</TableCell>}
                  <TableCell>{labour.siteTransferBy}</TableCell>

                  {tabValue === 0 && (
                    <>
                      <TableCell>{labour.createdAt ? new Date(labour.createdAt).toLocaleDateString('en-GB') : '-'}</TableCell>
                    </>
                  )}
                  {tabValue === 1 && (
                    <>
                      <TableCell>{labour.siteTransferApproveDate ? new Date(labour.siteTransferApproveDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                    </>
                  )}

                  {tabValue === 2 && (
                    <>
                      <TableCell>{labour.siteTransferRejectDate ? new Date(labour.siteTransferRejectDate).toLocaleDateString('en-GB') : '-'}</TableCell>
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
                  {user.userType === 'admin' || user.userType === 'superadmin' && (
                    <TableCell>
                      {labour.adminStatus === 'Pending' && !approvedLabours.includes(labour.id) && !approvingLabours.includes(labour.id) && (
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
                            disabled={labour.IsApproveDisable}
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

                    </TableCell>
                  )}

                  {user.userType === 'admin' && tabValue !== 0 && tabValue !== 2 && tabValue !== 1 && <TableCell>
                    <Select
                      value={selectedSite[labour.LabourID] || ''}
                      displayEmpty
                      sx={{ minWidth: 150 }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            width: 280,
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>Select New Site</MenuItem>
                      {projectNames.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.Business_Unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>}

                  {user.userType === 'admin' && tabValue !== 0 && tabValue !== 2 && tabValue !== 1 && <TableCell>{statusesSite[labour.LabourID] || '-'}</TableCell>}
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
                    handleReject(selectedLabour.id, rejectReason);
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
                {selectedLabour.rejectionReason}
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
            onClick={() => {
              if (!labourToApprove || !labourToApprove.id) {
                toast.error('Labour data or ID is missing.');
                return;
              }
              approveLabour(labourToApprove.id);
              handleApproveConfirmClose();
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

      <Dialog
        open={isEditLabourOpen}
        onClose={handleEditLabourClose}
        aria-labelledby="EditLabour-dialog-title"
        aria-describedby="EditLabour-description"
      >
        <DialogTitle id="EditLabour-title">
          Edit Labour site transfer
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="EditLabour-dialog-description">
            Are you sure you want to Edit this labour site transfer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditLabourClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditLabour} sx={{
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


    </Box>

  );
};

export default SiteTransferApproval;