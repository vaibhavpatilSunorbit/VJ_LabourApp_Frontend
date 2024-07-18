

import React, { useState, useEffect } from 'react';
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
  InputLabel
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./LabourDetails.css";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SarchBar/SearchBar';
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
// import logoImage from '../../images/Labour_ID_Card.png';

const LabourDetails = ({ onApprove, departments, projectNames , labour   }) => {
  const { user } = useUser();
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const [formData, setFormData] = useState(null);
  const [open, setOpen] = useState(false);

  // const isMobile = useMediaQuery('(max-width: 600px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // const history = useHistory();
  
console.log("setSelectedLaour",setSelectedLabour)
  useEffect(() => {
    fetchLabours();
  }, []);

  const fetchLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/labours`);
      console.log('API Response:', response.data);
      setLabours(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching labours:', error);
      setError('Error fetching labours. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
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

  const handleApprove = async (id) => {
    console.log('Approving labour ID:', id);
    console.log('Logged-in user:', user);
    handleApproveConfirmClose(); 
    try {
      const { data: { nextID } } = await axios.get(`${API_BASE_URL}/labours/next-id`);
      // const response = await axios.put(`${API_BASE_URL}/labours/approve/${id}`, { LabourID: nextID, onboardName: loggedInUser});
      // const response = await axios.put(`${API_BASE_URL}/labours/approve/${id}`, { LabourID: nextID, onboardName: user.name }); // Include OnboardName
      const response = await axios.put(`${API_BASE_URL}/labours/approve/${id}`, { LabourID: nextID}); // Include OnboardName
      console.log('API response:', response.data);
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, status: 'Approved', isApproved: 1, LabourID: nextID } : labour
          )
        );
        toast.success('Labour approved successfully.');
        onApprove();
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
            <p style={{ fontSize: '1.2em', color: '#343a40' }}>Your details have been successfully submitted.</p>
            <p style={{ fontSize: '1.2em', color: '#343a40' }}>
              Your Labour ID is <span style={{ fontSize: '1.5em', color: '#007bff', fontWeight: 700 }}>{nextID}</span>.
            </p>
            <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
          </div>
        );
        setPopupType('success');
        setSaved(true);
      } else {
        toast.error('Failed to approve labour. Please try again.');
      }
    } catch (error) {
      console.error('Error approving labour:', error);
      toast.error('Error approving labour. Please try again.');
    }
  };
  
  // const handleResubmit = async (id) => {
  //   try {
  //     const response = await axios.put(`${API_BASE_URL}/labours/resubmit/${id}`);
  //     if (response.data.success) {
  //       setLabours(prevLabours =>
  //         prevLabours.map(labour =>
  //           labour.id === id ? { ...labour, status: 'Pending', isApproved: 0 } : labour
  //         )
  //       );
  //       toast.success('Labour resubmitted successfully.');
  //       window.location.reload();
  //     } else {
  //       toast.error('Failed to resubmit labour. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error resubmitting labour:', error);
  //     toast.error('Error resubmitting labour. Please try again.');
  //   }
  // };

  // const handleResubmit = (labour) => {
  //   setResubmittedLabours(prev => new Set([...prev, labour.id]));
  //   navigate('/kyc', { state: { labour } });
  // };  
  const handleResubmit = async(labour) => {
    setResubmittedLabours((prev) => new Set(prev).add(labour.id));
try {
  const response = await axios.put(`${API_BASE_URL}/labours/resubmit/${labour.id}`, );
  if (response.data.success) {
    navigate('/kyc', { state: { labour } });

    setLabours(prevLabours =>
      prevLabours.map(labour =>
        labour.id === labour.id ? { ...labour, status: 'Resubmitted', isApproved: 3,} : labour
      )
    );
  } else {
    toast.error('Failed to resumbit labour. Please try again.');
  }
} catch (error) {
  console.error('Error rejecting labour:', error);
  toast.error('Error rejecting labour. Please try again.');
}
  };


  console.log("resubmittedLabluasd:",resubmittedLabours)


  const handleReject = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/labours/reject/${id}`, { Reject_Reason: rejectReason });
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, status: 'Rejected', isApproved: 2, Reject_Reason: rejectReason } : labour
          )
        );
        toast.success('Labour rejected successfully.');
        setIsRejectPopupOpen(false);
      } else {
        toast.error('Failed to reject labour. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting labour:', error);
      toast.error('Error rejecting labour. Please try again.');
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



  const openPopup = async (labour) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/${labour.id}`);
      const labourDetails = response.data;
      const projectName  = getProjectDescription(labourDetails.projectName);
      const department  = getDepartmentDescription(labourDetails.department);

      setSelectedLabour({
        ...labourDetails,
        projectName ,
        department ,
      });
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{2}-\d{4}$/.test(formData.expiryDate)) {
      toast.error('Invalid expiry date format. Please use MM-YYYY.');
      return;
    }

    const formattedExpiryDate = formData.expiryDate ? `01-${formData.expiryDate}` : null;
  const formattedFormData = {
    ...formData,
    expiryDate: formattedExpiryDate,
  };

    try {
      const response = await axios.put(`${API_BASE_URL}/labours/update/${formData.id}`, formattedFormData);
      if (response.data.message === "Record updated successfully") {
        toast.success('Labour details updated successfully.');
        setOpen(false);
        fetchLabours(); // Refresh the data to reflect changes
      } else {
        toast.error('Failed to update labour details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating labour details:', error);
      toast.error('Error updating labour details. Please try again.');
    }
  };

 
  const handleDownloadPDF = async (labourId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/${labourId}`);
      const labour = response.data;
  
      const doc = new jsPDF();
  
      const logoUrl = `${process.env.PUBLIC_URL}/images/vjlogo.png`; // Use the public URL
      
  
      // Verify that the logoUrl is correctly defined
      if (!logoUrl) {
        throw new Error('Logo URL is undefined');
      }
  
      // Load the logo image
      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => resolve(img);
          img.onerror = (error) => {
            console.error(`Failed to load image: ${url}`, error);
            reject(new Error(`Failed to load image: ${url}`));
          };
          img.src = url;
          console.log(`Attempting to load image from URL: ${url}`);
        });
      };
  
      console.log('Loading logo image from URL:', logoUrl);
      const logoImg = await loadImage(logoUrl);
      console.log('Logo image loaded:', logoImg);
  
      if (!labour.photoSrc) {
        throw new Error('Labour photo URL is undefined');
      }
  
      console.log('Loading labour photo from URL:', labour.photoSrc);
      const labourPhoto = await loadImage(labour.photoSrc);
      console.log('Labour photo loaded:', labourPhoto);
  
      // Convert image to data URI
      const getDataUrl = (img) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png');
      };
  
      const logoDataUrl = getDataUrl(logoImg);
      const labourPhotoDataUrl = getDataUrl(labourPhoto);
  
      // Add logo
      doc.addImage(logoDataUrl, 'PNG', 10, 10, 50, 15); 
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text('LABOUR ID CARD', 70, 20 );
  
      // Add image
      doc.addImage(labourPhotoDataUrl, 'PNG', 10, 30, 50, 70); 
      doc.setLineWidth(1); // Set line width for darker border
    doc.setDrawColor(0, 0, 0); // Set border color to black
    doc.rect(10, 30, 50, 70); // Add border around image

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Extract the date part only
    };

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const lineHeight = 7;
      const startX = 70;
      const valueStartX = 120; 
      let startY = 32;

      const addDetail = (label, value) => {
        doc.text(`${label.toUpperCase()}`, startX, startY);
      doc.text(`: ${value ? value.toUpperCase() : 'N/A'}`, valueStartX, startY);
        startY += lineHeight;
      };

      const departmentDescription = getDepartmentDescription(labour.department);
  
      addDetail('Name', labour.name);
    addDetail('Location', labour.location);
    addDetail('Date of Birth', formatDate(labour.dateOfBirth));
    addDetail('Aadhaar No.', labour.aadhaarNumber);
    addDetail('Department', departmentDescription);
    addDetail('Designation', labour.designation);
    addDetail('Emergency No.', labour.emergencyContact);
    addDetail('Inducted by', labour.Inducted_By);
    addDetail('Induction date', formatDate(labour.Induction_Date));
    addDetail('Date Of joining', formatDate(labour.dateOfJoining));
    addDetail('Valid till', formatDate(labour.ValidTill));

    const cardX = 5;
    const cardY = 3;
    const cardWidth = 200;
    const cardHeight = startY + 2;

    doc.setLineWidth(1); // Set line width for the outer border
    doc.setDrawColor(0, 0, 0); // Set outer border color to black
    doc.rect(cardX, cardY, cardWidth, cardHeight);
  
      doc.save(`LabourID_${labour.LabourID || labourId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
    }
  };



  const displayLabours = searchResults.length > 0 ? searchResults : labours;

  const filteredLabours = displayLabours.filter(labour => {
    if (tabValue === 0) {
      return labour.status === 'Pending';
    } else if (tabValue === 1) {
      return labour.status === 'Approved';
    } else {
      return labour.status === 'Rejected' || labour.status === 'Resubmitted';
    }
  });

  // Function to get department description from ID
  // const getDepartmentDescription = (departmentId) => {
  //   if (!departments || departments.length === 0) {
  //     return 'Unknown';
  //   }
  //   const department = departments.find(dept => dept.Id === Number(departmentId));
  //   return department ? department.Description : 'Unknown';
  // };

  const sortedLabours = tabValue === 1 
  ? filteredLabours.sort((a, b) => a.LabourID.localeCompare(b.LabourID))
  : filteredLabours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getDepartmentDescription = (departmentId) => {
    if (!departments || departments.length === 0) {
      return 'Unknown';
    }
    const department = departments.find(dept => dept.Id === Number(departmentId));
    return department ? department.Description : 'Unknown';
  };




  const getProjectDescription = (projectId) => {
    console.log('Projects Array:', projectNames);
    console.log('Project ID:', projectId, 'Type:', typeof projectId);

    if (!projectNames || projectNames.length === 0) {
      console.log('Projects array is empty or undefined');
      return 'Unknown';
    }

    if (projectId === undefined || projectId === null) {
      console.log('Project ID is undefined or null');
      return 'Unknown';
    }

    const project = projectNames.find(proj => {
      console.log(`Checking project: ${proj.id} === ${Number(projectId)} (Type: ${typeof proj.id})`);
      return proj.id === Number(projectId);
    });

    console.log('Found Project:', project);
    return project ? project.Business_Unit : 'Unknown';
  };



  return (
    <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', }}>
      {/* <Typography variant="h5" >
        Labour Details
      </Typography> */}

      <Box ml={-1.5}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          // handleSearch={() => {}}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectLabour={handleSelectLabour}
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
            label="Pending"
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
            label="Approved"
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
            label="Rejected"
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
        <TablePagination
          className="custom-pagination"
          rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
          count={filteredLabours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>



      <TableContainer component={Paper} sx={{
  mb: 6,
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
  <Table sx={{ minWidth: 800 }}>
    <TableHead>
      <TableRow
        sx={{
          '& th': {
            padding: '12px',
            '@media (max-width: 600px)': {
              padding: '10px',
            },
          },
        }}
      >
        <TableCell>Sr No</TableCell>
        {tabValue !== 0 && tabValue !== 2 && <TableCell>Labour ID</TableCell>}
        <TableCell>Name of Labour</TableCell>
        <TableCell>Project</TableCell>
        <TableCell>Department</TableCell>
        {(tabValue === 0 || tabValue === 1) && <TableCell>Onboarded By</TableCell>}
        <TableCell>Status</TableCell>
        {tabValue === 2 && <TableCell>Reject Reason</TableCell>}
        {tabValue === 1 && <TableCell>LabourID Card</TableCell>}
        {((user.userType === 'admin') || (tabValue === 2 && user.userType === 'user')) && <TableCell>Action</TableCell>}
        <TableCell>Details</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {(rowsPerPage > 0
        ? sortedLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedLabours
      ).map((labour, index) => (
        <TableRow key={labour.id}>
          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
          {tabValue !== 0 && tabValue !== 2 && <TableCell>{labour.LabourID}</TableCell>}
          <TableCell>{labour.name}</TableCell>
          <TableCell>{getProjectDescription(labour.projectName)}</TableCell>
          <TableCell>{getDepartmentDescription(labour.department)}</TableCell>
          {(tabValue === 0 || tabValue === 1) && (
            <TableCell>{labour.OnboardName}</TableCell>
          )}
          <TableCell>{labour.status}</TableCell>
          {tabValue === 2 && (
            <TableCell>
               <Box display="flex" justifyContent="center" alignItems="center">
              <InfoIcon onClick={() => {
                setSelectedLabour(labour);
                setIsRejectReasonPopupOpen(true);
              }} style={{cursor: 'pointer', }}/>
              </Box>
            </TableCell>
          )}
          {tabValue === 1 && (
            <TableCell>
                 <Box display="flex" justifyContent="center" alignItems="center">
              <PictureAsPdfIcon onClick={() => handleDownloadPDF(labour.id)} style={{cursor: 'pointer'}}/>
              </Box>
            </TableCell>
          )}

          {user.userType === 'user' && (
            <TableCell>
              {labour.status === 'Rejected' && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleResubmit(labour)}
                >
                  Resubmit
                </Button>
              )}
              {labour.status === 'Approved' && (
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
          )}

          {user.userType === 'admin' && (
            <TableCell>
              {labour.status === 'Pending' && (
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
              {labour.status === 'Approved' && (
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
              {labour.status === 'Rejected' && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleResubmit(labour)}
                >
                  Resubmit
                </Button>
              )}
            </TableCell>
          )}

          <TableCell>
            <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{cursor: 'pointer'}}/>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
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
            <Box mt={2} style={{display:'flex', justifyContent:'flex-end'}}>
            <Button variant="outlined" color="secondary" onClick={closeRejectPopup} >
                Cancel
              </Button>
              {/* <Button variant="contained" color="primary" onClick={() => handleReject(selectedLabour.id)}> */}
              <Button variant="contained" color="primary"  onClick={() => {
           if (!rejectReason.trim()) {
            toast.error("Please add a reason for rejection.");
          } else {
            handleReject(selectedLabour.id);
          }
        }}sx={{
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
                {selectedLabour.Reject_Reason}
              </Typography>
            )}
            <Box mt={2} sx={{display:'flex', justifyContent:'flex-end'}}>
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
            Are you sure you want to approve this labour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveConfirmClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleApprove(labourToApprove.id)}  sx={{
                      backgroundColor: 'rgb(229, 255, 225)',
                      color: 'rgb(43, 217, 144)',
                      width: '100px',
                      marginRight: '10px',
                      marginBottom: '3px',
                      '&:hover': {
                        backgroundColor: 'rgb(229, 255, 225)',
                      },
                    }} autoFocus>
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
                  style={{ padding: '18px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '95%', fontSize:'17px' }}
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
                  style={{ padding: '18px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '95%', fontSize:'17px' }}
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
      
      <ToastContainer />

        <style jsx>{`
        body {
          font-family: 'Roboto', sans-serif;
          background-color: #f8f9fa;
        }

        .input-container {
          margin: 20px 0;
          position: relative;
        }

        .input-field {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .input-field:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .input-field:hover {
          border-color: #0056b3;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }

        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px;
          width:70vw;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .popup.success {
          background-color: #d4edda;
          border-color: #c3e6cb;
        }

        .popup.error {
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        .popup h2 {
          margin: 0 0 10px;
        }

        .popup p {
          margin: 0 0 20px;
        }

        .popup .ok-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .popup .ok-button.success {
          background-color: #28a745;
          color: white;
        }

        .popup .ok-button.error {
          background-color: #dc3545;
          color: white;
        }

        .popup .ok-button:hover.success {
          background-color: #218838;
        }

        .popup .ok-button:hover.error {
          background-color: #c82333;
        }

        .popup .icon {
          margin-right: 10px;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        @media (min-width: 468px) {
          .popup {
            width: 300px; 
          }
        }
      
        @media (min-width: 1024px) {
          .popup {
            width: 300px; 
          }
        }
      
        @media (min-width: 1280px) {
          .popup {
            width: 300px; 
          }
        }
      `}</style>
    </Box>

  );
};

export default LabourDetails;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Box,
//   Typography,
//   Modal,
//   Backdrop,
//   Fade,
//   TablePagination
// } from '@mui/material';
// import { toast } from 'react-toastify';
// import "./LabourDetails.css";
// import SearchBar from '../SarchBar/SearchBar';
// import ViewDetails from '../ViewDetails/ViewDetails';
// import Loading from "../Loading/Loading";

// const LabourDetails = ({ onApprove }) => {
//   const [labours, setLabours] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedLabour, setSelectedLabour] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5); 

//   useEffect(() => {
//     fetchLabours();
//   }, []);

//   const fetchLabours = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/labours');
//       setLabours(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching labours:', error);
//       setError('Error fetching labours. Please try again.');
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }
//     try {
//       const response = await axios.get(`http://localhost:5000/labours/search?q=${searchQuery}`);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Error searching:', error);
//       setError('Error searching. Please try again.');
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/labours/approve/${id}`);
//       if (response.data.success) {
//         // Update the local state to reflect the approval
//         setLabours(prevLabours =>
//           prevLabours.map(labour =>
//             labour.id === id ? { ...labour, status: 'Approved', isApproved: 1 } : labour
//           )
//         );
//         toast.success('Labour approved successfully.');
//         onApprove(); 
//       } else {
//         toast.error('Failed to approve labour. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error approving labour:', error);
//       toast.error('Error approving labour. Please try again.');
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/labours/reject/${id}`);
//       if (response.data.success) {
//         // Update the local state to reflect the rejection
//         setLabours(prevLabours =>
//           prevLabours.map(labour =>
//             labour.id === id ? { ...labour, status: 'Rejected', isApproved: 2 } : labour
//           )
//         );
//         toast.success('Labour rejected successfully.');
//       } else {
//         toast.error('Failed to reject labour. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error rejecting labour:', error);
//       toast.error('Error rejecting labour. Please try again.');
//     }
//   };

//   const openPopup = async (labour) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/labours/${labour.id}`);
//       setSelectedLabour(response.data);
//       setIsPopupOpen(true);
//     } catch (error) {
//       console.error('Error fetching labour details:', error);
//       toast.error('Error fetching labour details. Please try again.');
//     }
//   };

//   const closePopup = () => {
//     setSelectedLabour(null);
//     setIsPopupOpen(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); 
//   };

//   const displayLabours = searchResults.length > 0 ? searchResults : labours;

//   return (
//     <Box px={5} py={2}>
//       <Typography variant="h4" mb={3}>
//         Labour Details
//       </Typography>

//       <SearchBar
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         handleSearch={handleSearch}
//       />
//       {loading && <Loading />}
//       <TableContainer component={Paper} mt={3}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr No</TableCell>
//               <TableCell>Name of Labour</TableCell>
//               <TableCell>Project</TableCell>
//               <TableCell>Department</TableCell>
//               <TableCell>Labour Category</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Action</TableCell>
//               <TableCell>Details</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(rowsPerPage > 0
//               ? displayLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               : displayLabours
//             ).map((labour, index) => (
//               <TableRow key={labour.id}>
//                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                 <TableCell>{labour.name}</TableCell>
//                 <TableCell>{labour.projectName}</TableCell>
//                 <TableCell>{labour.department}</TableCell>
//                 <TableCell>{labour.labourCategory}</TableCell>
//                 <TableCell>{labour.status}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: '#EFE6F7', 
//                       color: '#8236BC',
//                       marginRight: '10px',
//                       '&:hover': {
//                         backgroundColor: '#bfa7d7',
//                       },
//                     }}
//                     onClick={() => handleApprove(labour.id)}
//                     style={{ marginRight: '10px' }}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: '#fce4ec',
//                       color: 'black', 
//                       '&:hover': {
//                         backgroundColor: '#f8bbd0', 
//                       },
//                     }}
//                     onClick={() => handleReject(labour.id)}
//                   >
//                     Reject
//                   </Button>
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{
//                       borderColor: '#2196f3', 
//                       color: '#2196f3',
//                       '&:hover': {
//                         borderColor: '#1976d2', 
//                         backgroundColor: 'rgba(33, 150, 243, 0.04)', 
//                       },
//                     }}
//                     onClick={() => openPopup(labour)}
//                   >
//                     View Details
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
//         component="div"
//         count={displayLabours.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Modal
//         open={isPopupOpen}
//         onClose={closePopup}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{ timeout: 500 }}
//       >
//         <Fade in={isPopupOpen}>
//           <div className="modal">
//             {selectedLabour && (
//               <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
//             )}
//           </div>
//         </Fade>
//       </Modal>
//     </Box>
//   );
// };

// export default LabourDetails;










