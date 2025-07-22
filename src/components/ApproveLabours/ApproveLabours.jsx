
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  InputLabel,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Select,
  MenuItem,
  TablePagination,
  DialogTitle,
  Checkbox,
  ListItemText,
  FormControl,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from "../../Data";
import './projectMachine.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ApproveLabours = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    projectId: '',
    deviceIds: [], // Changed to array for multiple selection
  });
  const [projectDeviceStatus, setProjectDeviceStatus] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    projectId: '',
    deviceId: '',
    newProjectId: '',
    newDeviceId: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNamesRes = await axios.get(`${API_BASE_URL}/api/project-names`);
        const devicesRes = await axios.get(`${API_BASE_URL}/api/devices`);
        const projectDeviceStatusRes = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);

        if (projectNamesRes.status === 200) {
          setProjectNames(projectNamesRes.data);
        } else {
          console.error('Failed to fetch project names:', projectNamesRes.status);
        }

        if (devicesRes.status === 200) {
          setDevices(devicesRes.data);
        } else {
          console.error('Failed to fetch devices:', devicesRes.status);
        }

        if (projectDeviceStatusRes.status === 200) {
          setProjectDeviceStatus(projectDeviceStatusRes.data);
          setSelectedProjects(projectDeviceStatusRes.data.map(item => item.ProjectID));
        } else {
          console.error('Failed to fetch project device status:', projectDeviceStatusRes.status);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDeviceChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prevFormData) => ({
      ...prevFormData,
      deviceIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.deviceIds.length === 0) {
      toast.error('Please select at least one device');
      return;
    }

    try {
      // Submit each device separately
      const promises = formData.deviceIds.map(deviceId =>
        axios.post(`${API_BASE_URL}/api/approveLabour`, {
          projectId: formData.projectId,
          deviceId: deviceId
        })
      );

      const responses = await Promise.all(promises);

      if (responses.every(response => response.status === 200)) {
        toast.success('Data submitted successfully for all selected devices');
        const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
        setProjectDeviceStatus(updatedStatus.data);
        setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));

        // Reset form
        setFormData({
          projectId: '',
          deviceIds: [],
        });
      } else {
        console.error('Failed to submit data for some devices');
        toast.error('Failed to submit data for some devices');
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      toast.error('Error submitting data');
    }
  };

  const handleUpdate = (item) => {
    setModalData({
      projectId: item.ProjectID,
      deviceId: item.DeviceID,
      newProjectId: item.ProjectID,
      newDeviceId: item.DeviceID
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId, deviceId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/projectDeviceStatus`, {
        data: { projectId, deviceId },
      });
      if (response.status === 200) {
        toast.success('Data deleted successfully');
        const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
        setProjectDeviceStatus(updatedStatus.data);
        setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
      } else {
        console.error('Failed to delete data:', response.status);
        toast.error('Failed to delete data');
      }
    } catch (err) {
      console.error('Error deleting data:', err);
      toast.error('Error deleting data');
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevModalData) => ({
      ...prevModalData,
      [name]: value,
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/api/projectDeviceStatus`, modalData);
      if (response.status === 200) {
        toast.success('Data updated successfully');
        const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
        setProjectDeviceStatus(updatedStatus.data);
        setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
        setIsModalOpen(false);
      } else {
        console.error('Failed to update data:', response.status);
        toast.error('Failed to update data');
      }
    } catch (err) {
      console.error('Error updating data:', err);
      toast.error('Error updating data');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInputStyle = () => {
    return {
      fontWeight: 400,
      fontSize: '16px',
      marginBottom: '8px',
      width: window.innerWidth < 768 ? '37vw' : '17vw',
    };
  };

  const renderRequiredAsterisk = (isRequired) => {
    return isRequired ? <span style={{ color: "red" }}> *</span> : null;
  };

  const inputLabelStyle = {
    color: 'black',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.4375em',
    letterSpacing: '0.00938em',
    padding: 0,
    position: 'relative',
    display: 'block',
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    color: 'rgba(0, 0, 0, 0.6)'
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const availableProjectNames = projectNames.filter(
    project => !selectedProjects.includes(project.Id)
  );

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-column">
          <div className="form-field">
            <InputLabel id="project-name-label" style={inputLabelStyle}>
              Project Name{renderRequiredAsterisk(true)}
            </InputLabel>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              style={getInputStyle()}
              required
            >
              <option value="">Select a project</option>
              {availableProjectNames.map((project) => (
                <option key={project.Id} value={project.Id}>{project.Business_Unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-column">
          <div className="form-field">
            <InputLabel id="device-name-label" style={inputLabelStyle}>
              Device Name{renderRequiredAsterisk(true)}
            </InputLabel>
            <FormControl sx={{ width: window.innerWidth < 768 ? '37vw' : '17vw' }}>
              <Select
                labelId="device-name-label"
                id="deviceIds"
                multiple
                value={formData.deviceIds}
                onChange={handleDeviceChange}
                input={<OutlinedInput />}
                displayEmpty
                renderValue={(selected) =>
                  selected.length === 0 ? (
                    <span>Select a Device</span>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const device = devices.find((d) => d.DeviceId === value);
                        return (
                          <Chip
                            key={value}
                            label={device ? device.DeviceSName : value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )
                }
                MenuProps={MenuProps}
                required
              >
                {devices.map((device) => (
                  <MenuItem key={device.DeviceId} value={device.DeviceId}>
                    <Checkbox checked={formData.deviceIds.indexOf(device.DeviceId) > -1} />
                    <ListItemText primary={device.DeviceSName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <Button type="submit" variant="contained" sx={{
          backgroundColor: 'rgb(229, 255, 225)',
          color: 'rgb(43, 217, 144)',
          '&:hover': {
            backgroundColor: 'rgb(229, 255, 225)',
          },
          mt: isMobile ? 0 : 3
        }} className="submit-button" >
          Submit
        </Button>
      </form>

      <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible' }}>
        <TableContainer component={Paper} sx={{ height: '72vh', overflow: 'auto' }}>
          <TablePagination
            rowsPerPageOptions={[15, 50, { label: 'All', value: -1 }]}
            component="div"
            count={projectDeviceStatus.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Business Unit</TableCell>
                <TableCell>Device Name</TableCell>
                <TableCell>Device Location</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectDeviceStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  key={row.DeviceID}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {(page * rowsPerPage) + index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.BusinessUnit}
                  </TableCell>
                  <TableCell>{row.DeviceSName}</TableCell>
                  <TableCell>{row.DeviceLocation}</TableCell>
                  <TableCell>{row.SerialNumber}</TableCell>
                  <TableCell>{row.Status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleUpdate(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.ProjectID, row.DeviceID)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...modalStyle, position: 'relative' }}>
          <DialogTitle
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              paddingBottom: { xs: "0px", sm: "0px", md: "18px" },
              paddingLeft: { xs: "0px", sm: "0px", md: "0px" },
            }}
          >Update Device
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <form onSubmit={handleModalSubmit}>
            <InputLabel id="new-project-name-label" style={inputLabelStyle}>
              Project Name
            </InputLabel>
            <Select
              id="newProjectId"
              name="newProjectId"
              value={modalData.newProjectId}
              onChange={handleModalInputChange}
              fullWidth
              required
            >
              {projectNames.map((project) => (
                <MenuItem key={project.Id} value={project.Id}>{project.Business_Unit}</MenuItem>
              ))}
            </Select>
            <InputLabel id="new-device-name-label" style={inputLabelStyle}>
              Device Name{renderRequiredAsterisk(true)}
            </InputLabel>
            <Select
              id="newDeviceId"
              name="newDeviceId"
              placeholder='Device Name'
              value={modalData.newDeviceId}
              onChange={handleModalInputChange}
              fullWidth
              required
            >
              {devices.map((device) => (
                <MenuItem key={device.DeviceId} value={device.DeviceId}>{device.DeviceSName}</MenuItem>
              ))}
            </Select>
            <Button type="submit" variant="contained" color="primary" className="submit-button" sx={{
              backgroundColor: 'rgb(229, 255, 225)',
              color: 'rgb(43, 217, 144)',
              width: '100px',
              marginRight: '10px',
              marginBottom: '3px',
              '&:hover': {
                backgroundColor: 'rgb(229, 255, 225)',
              },
            }}>
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ApproveLabours;
































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   InputLabel,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Modal,
//   Box,
//   Select,
//   MenuItem,
//   TablePagination,
//   DialogTitle,
//   Checkbox,
//   ListItemText,
//   FormControl,
//   OutlinedInput,
//   Chip,
//   Typography,
//   Card,
//   CardContent,
//   Divider,
//   Tooltip,
//   Badge,
//   Stack,
//   Container,
//   Grid,
//   TextField,
//   Fade,
//   Backdrop,
// } from '@mui/material';
// import { 
//   Edit, 
//   Delete, 
//   Add as AddIcon,
//   Business as BusinessIcon,
//   DeviceHub as DeviceIcon,
//   CheckCircle as CheckIcon,
//   Search as SearchIcon,
// } from '@mui/icons-material';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { API_BASE_URL } from "../../Data";
// import './projectMachine.css';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import CloseIcon from '@mui/icons-material/Close';
// import {
//   // ... existing imports
//   Refresh as RefreshIcon,
//   Download as DownloadIcon,
// } from '@mui/icons-material';

// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '90%', sm: '500px', md: '600px' },
//   bgcolor: 'background.paper',
//   borderRadius: '16px',
//   boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//   p: 0,
//   maxHeight: '90vh',
//   overflow: 'auto',
// };

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 280,
//       borderRadius: '12px',
//       boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
//     },
//   },
// };

// const ApproveLabours = () => {
//   const [projectNames, setProjectNames] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [formData, setFormData] = useState({
//     projectId: '',
//     deviceIds: [],
//   });
//   const [projectDeviceStatus, setProjectDeviceStatus] = useState([]);
//   const [selectedProjects, setSelectedProjects] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({
//     projectId: '',
//     deviceId: '',
//     newProjectId: '',
//     newDeviceId: ''
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(15);
//   const [searchTerm, setSearchTerm] = useState('');

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectNamesRes = await axios.get(`${API_BASE_URL}/api/project-names`);
//         const devicesRes = await axios.get(`${API_BASE_URL}/api/devices`);
//         const projectDeviceStatusRes = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);

//         if (projectNamesRes.status === 200) {
//           setProjectNames(projectNamesRes.data);
//         } else {
//           console.error('Failed to fetch project names:', projectNamesRes.status);
//         }

//         if (devicesRes.status === 200) {
//           setDevices(devicesRes.data);
//         } else {
//           console.error('Failed to fetch devices:', devicesRes.status);
//         }

//         if (projectDeviceStatusRes.status === 200) {
//           setProjectDeviceStatus(projectDeviceStatusRes.data);
//           setSelectedProjects(projectDeviceStatusRes.data.map(item => item.ProjectID));
//         } else {
//           console.error('Failed to fetch project device status:', projectDeviceStatusRes.status);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Error fetching data');
//       }
//     };

//     fetchData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleDeviceChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       deviceIds: typeof value === 'string' ? value.split(',') : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.deviceIds.length === 0) {
//       toast.error('Please select at least one device');
//       return;
//     }

//     try {
//       const promises = formData.deviceIds.map(deviceId =>
//         axios.post(`${API_BASE_URL}/api/approveLabour`, {
//           projectId: formData.projectId,
//           deviceId: deviceId
//         })
//       );

//       const responses = await Promise.all(promises);

//       if (responses.every(response => response.status === 200)) {
//         toast.success('Data submitted successfully for all selected devices');
//         const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
//         setProjectDeviceStatus(updatedStatus.data);
//         setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
//         setFormData({
//           projectId: '',
//           deviceIds: [],
//         });
//       } else {
//         console.error('Failed to submit data for some devices');
//         toast.error('Failed to submit data for some devices');
//       }
//     } catch (err) {
//       console.error('Error submitting data:', err);
//       toast.error('Error submitting data');
//     }
//   };

//   const handleUpdate = (item) => {
//     setModalData({
//       projectId: item.ProjectID,
//       deviceId: item.DeviceID,
//       newProjectId: item.ProjectID,
//       newDeviceId: item.DeviceID
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (projectId, deviceId) => {
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/api/projectDeviceStatus`, {
//         data: { projectId, deviceId },
//       });

//       if (response.status === 200) {
//         toast.success('Data deleted successfully');
//         const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
//         setProjectDeviceStatus(updatedStatus.data);
//         setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
//       } else {
//         console.error('Failed to delete data:', response.status);
//         toast.error('Failed to delete data');
//       }
//     } catch (err) {
//       console.error('Error deleting data:', err);
//       toast.error('Error deleting data');
//     }
//   };

//   const handleModalInputChange = (e) => {
//     const { name, value } = e.target;
//     setModalData((prevModalData) => ({
//       ...prevModalData,
//       [name]: value,
//     }));
//   };

//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(`${API_BASE_URL}/api/projectDeviceStatus`, modalData);

//       if (response.status === 200) {
//         toast.success('Data updated successfully');
//         const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
//         setProjectDeviceStatus(updatedStatus.data);
//         setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
//         setIsModalOpen(false);
//       } else {
//         console.error('Failed to update data:', response.status);
//         toast.error('Failed to update data');
//       }
//     } catch (err) {
//       console.error('Error updating data:', err);
//       toast.error('Error updating data');
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const availableProjectNames = projectNames.filter(
//     project => !selectedProjects.includes(project.Id)
//   );

//   const filteredData = projectDeviceStatus.filter(item =>
//     item.BusinessUnit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.DeviceSName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.DeviceLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.SerialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'active':
//         return '#4caf50';
//       case 'inactive':
//         return '#f44336';
//       case 'pending':
//         return '#ff9800';
//       default:
//         return '#2196f3';
//     }
//   };

//   return (

//     <Container maxWidth="xl" sx={{ py: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
//   <ToastContainer
//     position="top-right"
//     autoClose={3000}
//     hideProgressBar={false}
//     newestOnTop
//     closeOnClick
//     rtl={false}
//     pauseOnFocusLoss
//     draggable
//     pauseOnHover
//     theme="light"
//     toastStyle={{
//       borderRadius: '12px',
//       boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
//     }}
//   />

//   {/* Form Section - Fixed Height */}
//   <Card
//     elevation={0}
//     sx={{
//       mb: 2,
//       borderRadius: '16px',
//       border: '1px solid',
//       borderColor: 'divider',
//       background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
//       flexShrink: 0, // Prevent shrinking
//     }}
//   >
//     <CardContent sx={{ pb: 2 }}>
//       <Box display="flex" alignItems="center" mb={2}>
//         <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
//         <Typography variant="h6" fontWeight={600}>
//           Add New Assignment
//         </Typography>
//       </Box>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <FormControl fullWidth size="small">
//               <InputLabel
//                 sx={{
//                   color: '#374151',
//                   fontWeight: 500,
//                   '&.Mui-focused': { color: 'primary.main' }
//                 }}
//               >
//                 <BusinessIcon sx={{ mr: 1, fontSize: '1rem' }} />
//                 Project Name *
//               </InputLabel>
//               <Select
//                 name="projectId"
//                 value={formData.projectId}
//                 onChange={handleInputChange}
//                 required
//                 sx={{
//                   borderRadius: '12px',
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#e5e7eb',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#d1d5db',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'primary.main',
//                   },
//                 }}
//               >
//                 <MenuItem value="">
//                   <em>Select a project</em>
//                 </MenuItem>
//                 {availableProjectNames.map((project) => (
//                   <MenuItem key={project.Id} value={project.Id}>
//                     {project.Business_Unit}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <FormControl fullWidth size="small">
//               <InputLabel
//                 sx={{
//                   color: '#374151',
//                   fontWeight: 500,
//                   '&.Mui-focused': { color: 'primary.main' }
//                 }}
//               >
//                 <DeviceIcon sx={{ mr: 1, fontSize: '1rem' }} />
//                 Device Names *
//               </InputLabel>
//               <Select
//                 multiple
//                 value={formData.deviceIds}
//                 onChange={handleDeviceChange}
//                 input={<OutlinedInput />}
//                 displayEmpty
//                 renderValue={(selected) =>
//                   selected.length === 0 ? (
//                     <span style={{ color: '#9ca3af' }}></span>
//                   ) : (
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                       {selected.slice(0, 2).map((value) => {
//                         const device = devices.find((d) => d.DeviceId === value);
//                         return (
//                           <Chip
//                             key={value}
//                             label={device ? device.DeviceSName : value}
//                             size="small"
//                             sx={{
//                               backgroundColor: 'primary.light',
//                               color: 'primary.contrastText',
//                               fontWeight: 500,
//                               maxWidth: '120px',
//                             }}
//                           />
//                         );
//                       })}
//                       {selected.length > 2 && (
//                         <Chip
//                           label={`+${selected.length - 2} more`}
//                           size="small"
//                           sx={{
//                             backgroundColor: '#e5e7eb',
//                             color: '#374151',
//                             fontWeight: 500,
//                           }}
//                         />
//                       )}
//                     </Box>
//                   )
//                 }
//                 MenuProps={MenuProps}
//                 required
//                 sx={{
//                   borderRadius: '12px',
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#e5e7eb',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#d1d5db',
//                   },
//                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'primary.main',
//                   },
//                 }}
//               >
//                 {devices.map((device) => (
//                   <MenuItem key={device.DeviceId} value={device.DeviceId}>
//                     <Checkbox
//                       checked={formData.deviceIds.indexOf(device.DeviceId) > -1}
//                       sx={{
//                         color: 'primary.main',
//                         '&.Mui-checked': {
//                           color: 'primary.main',
//                         },
//                       }}
//                     />
//                     <ListItemText
//                       primary={device.DeviceSName}
//                       sx={{ ml: 1 }}
//                     />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Box display="flex" alignItems="center" height="100%">
//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="medium"
//                 startIcon={<CheckIcon />}
//                 sx={{
//                   borderRadius: '12px',
//                   textTransform: 'none',
//                   fontWeight: 600,
//                   fontSize: '0.9rem',
//                   px: 3,
//                   py: 1,
//                   background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                   boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
//                   '&:hover': {
//                     background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
//                     boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
//                     transform: 'translateY(-1px)',
//                   },
//                   transition: 'all 0.2s ease-in-out',
//                 }}
//               >
//                 Submit Assignment
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </form>
//     </CardContent>
//   </Card>

//   {/* Data Table Section - Flexible Height */}
//   <Card
//     elevation={0}
//     sx={{
//       borderRadius: '16px',
//       border: '1px solid',
//       borderColor: 'divider',
//       overflow: 'hidden',
//       flex: 1, // Take remaining space
//       display: 'flex',
//       flexDirection: 'column',
//       minHeight: 0, // Important for flex child
//     }}
//   >
//     <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
//       {/* Table Header - Fixed */}
//       <Box
//         sx={{
//           p: { xs: 2, md: 3 },
//           borderBottom: '1px solid',
//           borderColor: 'divider',
//           background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
//           position: 'relative',
//           overflow: 'hidden',
//           flexShrink: 0,
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '3px',
//             background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #8b5cf6 100%)',
//           },
//         }}
//       >
//         <Stack
//           direction={{ xs: 'column', md: 'row' }}
//           justifyContent="space-between"
//           alignItems={{ xs: 'flex-start', md: 'center' }}
//           spacing={2}
//         >
//           {/* Left Section - Title and Stats */}
//           <Box sx={{ flex: 1 }}>
//             <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
//               <Box
//                 sx={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: '10px',
//                   background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
//                 }}
//               >
//                 <BusinessIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
//               </Box>
//               <Box>
//                 <Typography
//                   variant="h6"
//                   fontWeight={700}
//                   sx={{
//                     color: '#1a202c',
//                     fontSize: { xs: '1rem', md: '1.1rem' },
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   Project Assignments
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: '#64748b',
//                     fontSize: '0.8rem',
//                     fontWeight: 500,
//                   }}
//                 >
//                   Manage device assignments and approvals
//                 </Typography>
//               </Box>
//             </Stack>

//             {/* Stats Row */}
//             <Stack
//               direction="row"
//               spacing={2}
//               sx={{
//                 mt: 1.5,
//                 flexWrap: 'wrap',
//                 gap: { xs: 1, md: 2 },
//               }}
//             >
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                   px: 1.5,
//                   py: 0.5,
//                   borderRadius: '6px',
//                   backgroundColor: '#eff6ff',
//                   border: '1px solid #dbeafe',
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 6,
//                     height: 6,
//                     borderRadius: '50%',
//                     backgroundColor: '#3b82f6',
//                   }}
//                 />
//                 <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af', fontSize: '0.75rem' }}>
//                   {filteredData.length} Total
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                   px: 1.5,
//                   py: 0.5,
//                   borderRadius: '6px',
//                   backgroundColor: '#f0fdf4',
//                   border: '1px solid #dcfce7',
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 6,
//                     height: 6,
//                     borderRadius: '50%',
//                     backgroundColor: '#10b981',
//                   }}
//                 />
//                 <Typography variant="body2" sx={{ fontWeight: 600, color: '#047857', fontSize: '0.75rem' }}>
//                   {projectDeviceStatus.filter(item => item.Status?.toLowerCase() === 'active').length} Active
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                   px: 1.5,
//                   py: 0.5,
//                   borderRadius: '6px',
//                   backgroundColor: '#fef3c7',
//                   border: '1px solid #fde68a',
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 6,
//                     height: 6,
//                     borderRadius: '50%',
//                     backgroundColor: '#f59e0b',
//                   }}
//                 />
//                 <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e', fontSize: '0.75rem' }}>
//                   {projectDeviceStatus.filter(item => item.Status?.toLowerCase() === 'pending').length} Pending
//                 </Typography>
//               </Box>
//             </Stack>
//           </Box>

//           {/* Right Section - Search and Actions */}
//           <Box sx={{ minWidth: { xs: '100%', md: '280px' } }}>
//             <Stack spacing={1.5}>
//               {/* Enhanced Search Bar */}
//               <Box sx={{ position: 'relative' }}>
//                 <TextField
//                   placeholder="Search assignments..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   size="small"
//                   fullWidth
//                   InputProps={{
//                     startAdornment: (
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           pl: 0.5,
//                           pr: 0.5,
//                         }}
//                       >
//                         <SearchIcon
//                           sx={{
//                             color: searchTerm ? '#3b82f6' : '#9ca3af',
//                             fontSize: '1.1rem',
//                             transition: 'color 0.2s ease-in-out',
//                           }}
//                         />
//                       </Box>
//                     ),
//                     endAdornment: searchTerm && (
//                       <IconButton
//                         size="small"
//                         onClick={() => setSearchTerm('')}
//                         sx={{
//                           mr: 0.5,
//                           color: '#6b7280',
//                           '&:hover': {
//                             backgroundColor: '#f3f4f6',
//                             color: '#374151',
//                           },
//                         }}
//                       >
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     ),
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '12px',
//                       backgroundColor: '#ffffff',
//                       border: '1px solid transparent',
//                       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                       transition: 'all 0.2s ease-in-out',
//                       '& fieldset': {
//                         border: 'none',
//                       },
//                       '&:hover': {
//                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
//                         transform: 'translateY(-1px)',
//                       },
//                       '&.Mui-focused': {
//                         boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
//                         borderColor: '#3b82f6',
//                         transform: 'translateY(-1px)',
//                       },
//                     },
//                     '& .MuiInputBase-input': {
//                       padding: '10px 8px',
//                       fontSize: '0.9rem',
//                       fontWeight: 500,
//                       color: '#374151',
//                       '&::placeholder': {
//                         color: '#9ca3af',
//                         opacity: 1,
//                         fontWeight: 400,
//                       },
//                     },
//                   }}
//                 />

//                 {/* Search Results Indicator */}
//                 {searchTerm && (
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: '100%',
//                       left: 0,
//                       right: 0,
//                       mt: 0.5,
//                       p: 1,
//                       backgroundColor: '#f8fafc',
//                       border: '1px solid #e2e8f0',
//                       borderRadius: '8px',
//                       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                       zIndex: 10,
//                     }}
//                   >
//                     <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.75rem' }}>
//                       {filteredData.length === 0 ? (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Box
//                             sx={{
//                               width: 4,
//                               height: 4,
//                               borderRadius: '50%',
//                               backgroundColor: '#ef4444',
//                             }}
//                           />
//                           No results found
//                         </Box>
//                       ) : (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Box
//                             sx={{
//                               width: 4,
//                               height: 4,
//                               borderRadius: '50%',
//                               backgroundColor: '#10b981',
//                             }}
//                           />
//                           {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
//                         </Box>
//                       )}
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>

//               {/* Quick Action Buttons */}
//               <Stack direction="row" spacing={1} justifyContent="flex-end">
//                 <Tooltip title="Refresh Data">
//                   <IconButton
//                     onClick={() => window.location.reload()}
//                     sx={{
//                       backgroundColor: '#f1f5f9',
//                       color: '#475569',
//                       borderRadius: '10px',
//                       width: 32,
//                       height: 32,
//                       '&:hover': {
//                         backgroundColor: '#e2e8f0',
//                         color: '#334155',
//                         transform: 'scale(1.05)',
//                       },
//                       transition: 'all 0.2s ease-in-out',
//                     }}
//                   >
//                     <RefreshIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>

//                 <Tooltip title="Export Data">
//                   <IconButton
//                     sx={{
//                       backgroundColor: '#f1f5f9',
//                       color: '#475569',
//                       borderRadius: '10px',
//                       width: 32,
//                       height: 32,
//                       '&:hover': {
//                         backgroundColor: '#e2e8f0',
//                         color: '#334155',
//                         transform: 'scale(1.05)',
//                       },
//                       transition: 'all 0.2s ease-in-out',
//                     }}
//                   >
//                     <DownloadIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               </Stack>
//             </Stack>
//           </Box>
//         </Stack>
//       </Box>

//       {/* Table Container - Scrollable */}
//       <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
//         <TableContainer 
//           sx={{ 
//             flex: 1,
//             '&::-webkit-scrollbar': {
//               width: '8px',
//               height: '8px',
//             },
//             '&::-webkit-scrollbar-track': {
//               background: '#f1f5f9',
//               borderRadius: '4px',
//             },
//             '&::-webkit-scrollbar-thumb': {
//               background: '#cbd5e1',
//               borderRadius: '4px',
//               '&:hover': {
//                 background: '#94a3b8',
//               },
//             },
//           }}
//         >
//           <Table stickyHeader size="small">
//             <TableHead>
//               <TableRow>
//                 {[
//                   'Sr. No.',
//                   'Business Unit',
//                   'Device Name',
//                   'Device Location',
//                   'Serial Number',
//                   'Status',
//                   'Actions'
//                 ].map((header) => (
//                   <TableCell
//                     key={header}
//                     sx={{
//                       fontWeight: 600,
//                       fontSize: '0.8rem',
//                       color: '#374151',
//                       backgroundColor: '#f9fafb',
//                       borderBottom: '2px solid #e5e7eb',
//                       py: 1.5,
//                       whiteSpace: 'nowrap',
//                     }}
//                   >
//                     {header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredData
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, index) => (
//                   <TableRow
//                     key={row.DeviceID}
//                     sx={{
//                       '&:hover': {
//                         backgroundColor: '#f8fafc',
//                       },
//                       '&:last-child td': {
//                         border: 0,
//                       },
//                     }}
//                   >
//                     <TableCell sx={{ fontWeight: 500, fontSize: '0.85rem', py: 1.5 }}>
//                       {(page * rowsPerPage) + index + 1}
//                     </TableCell>
//                     <TableCell sx={{ py: 1.5 }}>
//                       <Box display="flex" alignItems="center">
//                         <BusinessIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1rem' }} />
//                         <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.85rem' }}>
//                           {row.BusinessUnit}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ py: 1.5 }}>
//                       <Box display="flex" alignItems="center">
//                         <DeviceIcon sx={{ mr: 1, color: 'secondary.main', fontSize: '1rem' }} />
//                         <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
//                           {row.DeviceSName}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ py: 1.5 }}>
//                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
//                         {row.DeviceLocation}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ py: 1.5 }}>
//                       <Chip
//                         label={row.SerialNumber}
//                         size="small"
//                         variant="outlined"
//                         sx={{
//                           borderRadius: '6px',
//                           fontFamily: 'monospace',
//                           fontSize: '0.7rem',
//                           height: '24px',
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 1.5 }}>
//                       <Chip
//                         label={row.Status}
//                         size="small"
//                         sx={{
//                           backgroundColor: getStatusColor(row.Status),
//                           color: 'white',
//                           fontWeight: 500,
//                           borderRadius: '6px',
//                           fontSize: '0.7rem',
//                           height: '24px',
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 1.5 }}>
//                       <Stack direction="row" spacing={0.5}>
//                         <Tooltip title="Edit Assignment">
//                           <IconButton
//                             onClick={() => handleUpdate(row)}
//                             size="small"
//                             sx={{
//                               color: 'primary.main',
//                               backgroundColor: 'primary.light',
//                               width: '28px',
//                               height: '28px',
//                               '&:hover': {
//                                 backgroundColor: 'primary.main',
//                                 color: 'white',
//                               },
//                               transition: 'all 0.2s ease-in-out',
//                             }}
//                           >
//                             <Edit sx={{ fontSize: '0.9rem' }} />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Delete Assignment">
//                           <IconButton
//                             onClick={() => handleDelete(row.ProjectID, row.DeviceID)}
//                             size="small"
//                             sx={{
//                               color: 'error.main',
//                               backgroundColor: 'error.light',
//                               width: '28px',
//                               height: '28px',
//                               '&:hover': {
//                                 backgroundColor: 'error.main',
//                                 color: 'white',
//                               },
//                               transition: 'all 0.2s ease-in-out',
//                             }}
//                           >
//                             <Delete sx={{ fontSize: '0.9rem' }} />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination - Fixed at Bottom */}
//         <Box 
//           sx={{ 
//             borderTop: '1px solid', 
//             borderColor: 'divider',
//             backgroundColor: '#f9fafb',
//             flexShrink: 0,
//           }}
//         >
//           <TablePagination
//             rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
//             component="div"
//             count={filteredData.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             sx={{
//               '& .MuiTablePagination-toolbar': {
//                 px: 2,
//                 py: 1,
//                 minHeight: '52px',
//               },
//               '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//                 fontWeight: 500,
//                 fontSize: '0.85rem',
//                 color: '#374151',
//               },
//               '& .MuiTablePagination-select': {
//                 fontSize: '0.85rem',
//               },
//               '& .MuiTablePagination-actions': {
//                 '& .MuiIconButton-root': {
//                   padding: '4px',
//                   '&:hover': {
//                     backgroundColor: '#e5e7eb',
//                   },
//                 },
//               },
//             }}
//           />
//         </Box>
//       </Box>
//     </CardContent>
//   </Card>

//   {/* Update Modal */}
//   <Modal
//     open={isModalOpen}
//     onClose={handleCloseModal}
//     closeAfterTransition
//     BackdropComponent={Backdrop}
//     BackdropProps={{
//       timeout: 500,
//       sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
//     }}
//   >
//     <Fade in={isModalOpen}>
//       <Box sx={modalStyle}>
//         {/* Modal Header */}
//         <Box
//           sx={{
//             p: 3,
//             borderBottom: '1px solid',
//             borderColor: 'divider',
//             background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
//             borderRadius: '16px 16px 0 0',
//           }}
//         >
//           <Stack direction="row" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography variant="h6" fontWeight={600}>
//                 Update Device Assignment
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Modify the project and device assignment
//               </Typography>
//             </Box>
//             <IconButton
//               onClick={handleCloseModal}
//               sx={{
//                 color: 'text.secondary',
//                 '&:hover': {
//                   backgroundColor: 'error.light',
//                   color: 'error.main',
//                 },
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Stack>
//         </Box>
//         {/* Modal Content */}
//         <Box sx={{ p: 3 }}>
//           <form onSubmit={handleModalSubmit}>
//             <Stack spacing={3}>
//               <FormControl fullWidth>
//                 <InputLabel
//                   sx={{
//                     color: '#374151',
//                     fontWeight: 500,
//                     '&.Mui-focused': { color: 'primary.main' }
//                   }}
//                 >
//                   <BusinessIcon sx={{ mr: 1, fontSize: '1rem' }} />
//                   Project Name *
//                 </InputLabel>
//                 <Select
//                   name="newProjectId"
//                   value={modalData.newProjectId}
//                   onChange={handleModalInputChange}
//                   required
//                   sx={{
//                     borderRadius: '12px',
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#e5e7eb',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#d1d5db',
//                     },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'primary.main',
//                     },
//                   }}
//                 >
//                   {projectNames.map((project) => (
//                     <MenuItem key={project.Id} value={project.Id}>
//                       {project.Business_Unit}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <FormControl fullWidth>
//                 <InputLabel
//                   sx={{
//                     color: '#374151',
//                     fontWeight: 500,
//                     '&.Mui-focused': { color: 'primary.main' }
//                   }}
//                 >
//                   <DeviceIcon sx={{ mr: 1, fontSize: '1rem' }} />
//                   Device Name *
//                 </InputLabel>
//                 <Select
//                   name="newDeviceId"
//                   value={modalData.newDeviceId}
//                   onChange={handleModalInputChange}
//                   required
//                   sx={{
//                     borderRadius: '12px',
//                        '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#e5e7eb',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: '#d1d5db',
//                     },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'primary.main',
//                     },
//                   }}
//                 >
//                   {devices.map((device) => (
//                     <MenuItem key={device.DeviceId} value={device.DeviceId}>
//                       {device.DeviceSName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Divider />
//               <Stack direction="row" spacing={2} justifyContent="flex-end">
//                 <Button
//                   onClick={handleCloseModal}
//                   variant="outlined"
//                   sx={{
//                     borderRadius: '12px',
//                     textTransform: 'none',
//                     fontWeight: 500,
//                     px: 3,
//                     borderColor: '#e5e7eb',
//                     color: '#6b7280',
//                     '&:hover': {
//                       borderColor: '#d1d5db',
//                       backgroundColor: '#f9fafb',
//                     },
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   startIcon={<CheckIcon />}
//                   sx={{
//                     borderRadius: '12px',
//                     textTransform: 'none',
//                     fontWeight: 600,
//                     px: 3,
//                     background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//                     boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
//                     '&:hover': {
//                       background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
//                       boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
//                       transform: 'translateY(-1px)',
//                     },
//                     transition: 'all 0.2s ease-in-out',
//                   }}
//                 >
//                   Update Assignment
//                 </Button>
//               </Stack>
//             </Stack>
//           </form>
//         </Box>
//       </Box>
//     </Fade>
//   </Modal>
// </Container>

//   );
// };

// export default ApproveLabours;
