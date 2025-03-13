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

const ApproveLabours = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    projectId: '',
    deviceId: '',
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
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
          // Set selected projects based on fetched data
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log('FormData before sending:', formData);
      const response = await axios.post(`${API_BASE_URL}/api/approveLabour`, formData);
      if (response.status === 200) {
        toast.success('Data submitted successfully');
        const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
        setProjectDeviceStatus(updatedStatus.data);
        setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
      } else {
        console.error('Failed to submit data:', response.status);
        toast.error('Failed to submit data');
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

  // Filter out already selected projects
  const availableProjectNames = projectNames.filter(
    project => !selectedProjects.includes(project.id)
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
            <select
              id="deviceId"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleInputChange}
              style={getInputStyle()}
              required
            >
              <option value="">Select a device</option>
              {devices.map((device) => (
                <option key={device.DeviceId} value={device.DeviceId}>{device.DeviceSName}</option>
              ))}
            </select>
          </div>
        </div>
        <Button type="submit" variant="contained"  sx={{
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
            rowsPerPageOptions={[5, 10, 25]}
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
    {/* Close Button */}
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
              Project Name{renderRequiredAsterisk(true)}
            </InputLabel>
            <Select
              id="newProjectId"
              name="newProjectId"
              value={modalData.newProjectId}
              onChange={handleModalInputChange}
              fullWidth
              required
            >
              {availableProjectNames.map((project) => (
                <MenuItem key={project.id} value={project.id}>{project.Business_Unit}</MenuItem>
              ))}
            </Select>
            <InputLabel id="new-device-name-label" style={inputLabelStyle}>
              Device Name{renderRequiredAsterisk(true)}
            </InputLabel>
            <Select
              id="newDeviceId"
              name="newDeviceId"
              value={modalData.newDeviceId}
              onChange={handleModalInputChange}
              fullWidth
              required
            >
              {devices.map((device) => (
                <MenuItem key={device.DeviceId} value={device.DeviceId}>{device.DeviceSName}</MenuItem>
              ))}
            </Select>
            <Button type="submit" variant="contained" color="primary" className="submit-button" sx={{mt:3}}>
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ApproveLabours;





























// This is running code without any changes changes in 01-08-2024



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
//   Autocomplete,
//   TextField 
// } from '@mui/material';
// import { Edit, Delete } from '@mui/icons-material';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { API_BASE_URL } from "../../Data";
// import './projectMachine.css';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';


// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
// };

// const ApproveLabours = () => {
//   const [projectNames, setProjectNames] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [formData, setFormData] = useState({
//     projectId: '',
//     deviceId: '',
//   });
//   const [projectDeviceStatus, setProjectDeviceStatus] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({
//     projectId: '',
//     deviceId: '',
//     newProjectId: '',
//     newDeviceId: ''
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('FormData before sending:', formData);
//       const response = await axios.post(`${API_BASE_URL}/api/approveLabour`, formData);
//       if (response.status === 200) {
//         toast.success('Data submitted successfully');
//         const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
//         setProjectDeviceStatus(updatedStatus.data);
//       } else {
//         console.error('Failed to submit data:', response.status);
//         toast.error('Failed to submit data');
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

//   const getInputStyle = () => {
//     return { 
//       fontWeight: 400,
//       fontSize: '16px',
//       marginBottom: '8px',
//       width: '17vw',
//     };
//   };

//   const renderRequiredAsterisk = (isRequired) => {
//     return isRequired ? <span style={{ color: "red" }}> *</span> : null;
//   };

//   const inputLabelStyle = {
//     color: 'black',
//     fontFamily: "Roboto, Helvetica, Arial, sans-serif",
//     fontWeight: 400,
//     fontSize: '1rem',
//     lineHeight: '1.4375em',
//     letterSpacing: '0.00938em',
//     padding: 0,
//     position: 'relative',
//     display: 'block',
//     transformOrigin: 'top left',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     maxWidth: '100%',
//     transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
//     color: 'rgba(0, 0, 0, 0.6)'
//   };
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   return (
//     <div>
//       <ToastContainer />
//       <form onSubmit={handleSubmit} className="form-container">
//   <div className="form-column">
//     <div className="form-field">
//       <InputLabel id="project-name-label" style={inputLabelStyle}>
//         Project Name{renderRequiredAsterisk(true)}
//       </InputLabel>
//       <select
//         id="projectId"
//         name="projectId"
//         value={formData.projectId}
//         onChange={handleInputChange}
//         style={getInputStyle()}
//         required
//       >
//         <option value="">Select a project</option>
//         {projectNames.map((project) => (
//           <option key={project.id} value={project.id}>{project.Business_Unit}</option>
//         ))}
//       </select>
//     </div>
//   </div>
//   <div className="form-column">
//     <div className="form-field">
//       <InputLabel id="device-name-label" style={inputLabelStyle}>
//         Device Name{renderRequiredAsterisk(true)}
//       </InputLabel>
//       <select
//         id="deviceId"
//         name="deviceId"
//         value={formData.deviceId}
//         onChange={handleInputChange}
//         style={getInputStyle()}
//         required
//       >
//         <option value="">Select a device</option>
//         {devices.map((device) => (
//           <option key={device.DeviceId} value={device.DeviceId}>{device.DeviceSName}</option>
//         ))}
//       </select>
//     </div>
//   </div>
//   <Button type="submit" variant="contained" color="primary" className="submit-button" sx={{mt:3}}>
//     Submit
//   </Button>
// </form>
//       <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', }}>
//       <TableContainer component={Paper}>
//       <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={projectDeviceStatus.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Business Unit</TableCell>
//               <TableCell>Device Name</TableCell>
//               <TableCell>Device Location</TableCell>
//               <TableCell>Serial Number</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {projectDeviceStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//               <TableRow
//                 key={row.DeviceID}
//                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//               >
//                 <TableCell component="th" scope="row">
//                   {row.BusinessUnit}
//                 </TableCell>
//                 <TableCell>{row.DeviceSName}</TableCell>
//                 <TableCell>{row.DeviceLocation}</TableCell>
//                 <TableCell>{row.SerialNumber}</TableCell>
//                 <TableCell>{row.Status}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleUpdate(row)}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(row.ProjectID, row.DeviceID)}>
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
       
//       </TableContainer>
//       </Box>
//       <Modal
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={modalStyle}>
//           <form onSubmit={handleModalSubmit}>
//             <InputLabel id="new-project-name-label" style={inputLabelStyle}>
//               Project Name{renderRequiredAsterisk(true)}
//             </InputLabel>
//             <Select
//               id="newProjectId"
//               name="newProjectId"
//               value={modalData.newProjectId}
//               onChange={handleModalInputChange}
//               fullWidth
//               required
//             >
//               {projectNames.map((project) => (
//                 <MenuItem key={project.id} value={project.id}>{project.Business_Unit}</MenuItem>
//               ))}
//             </Select>
//             <InputLabel id="new-device-name-label" style={inputLabelStyle}>
//               Device Name{renderRequiredAsterisk(true)}
//             </InputLabel>
//             <Select
//               id="newDeviceId"
//               name="newDeviceId"
//               value={modalData.newDeviceId}
//               onChange={handleModalInputChange}
//               fullWidth
//               required
//             >
//               {devices.map((device) => (
//                 <MenuItem key={device.DeviceId} value={device.DeviceId}>{device.DeviceSName}</MenuItem>
//               ))}
//             </Select>
//             <Button type="submit" variant="contained" color="primary" className="submit-button" sx={{mt:3}}>
//               Update
//             </Button>
//           </form>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default ApproveLabours;















// Code is run in 19-07-2024


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { InputLabel, Button } from '@mui/material';
// import { API_BASE_URL } from "../../Data";
// import './projectMachine.css'; // Assuming you are importing a CSS file for styling

// const ApproveLabours = () => {
//   const [projectNames, setProjectNames] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [formData, setFormData] = useState({
//     projectName: '',
//     deviceName: '',
//     // deviceLocation: '',
//     // SerialNumber: '',
//   });

//   const renderRequiredAsterisk = (isRequired) => {
//     return isRequired ? <span style={{ color: "red" }}> *</span> : null;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectNamesRes = await axios.get(`${API_BASE_URL}/api/project-names`);
//         const devicesRes = await axios.get(`${API_BASE_URL}/api/devices`);

//         if (projectNamesRes.status === 200) {
//           setProjectNames(projectNamesRes.data);
//           console.log('Fetched Project Names:', projectNamesRes.data);
//         } else {
//           console.error('Failed to fetch project names:', projectNamesRes.status);
//         }

//         if (devicesRes.status === 200) {
//           setDevices(devicesRes.data);
//           console.log('Fetched Devices:', devicesRes.data);
//         } else {
//           console.error('Failed to fetch devices:', devicesRes.status);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/approveLabour`, formData);
//       if (response.status === 200) {
//         console.log('Data submitted successfully:', response.data);
//         // You can add more logic here, like showing a success message
//       } else {
//         console.error('Failed to submit data:', response.status);
//       }
//     } catch (err) {
//       console.error('Error submitting data:', err);
//     }
//   };

//   const getInputStyle = () => {
//     return { 
//       fontWeight: 400,
//       fontSize: '16px',
//       marginBottom: '8px',
//       width: '17vw',
//     };
//   };

//   const inputLabelStyle = {
//     color: 'black',
//     fontFamily: "Roboto, Helvetica, Arial, sans-serif",
//     fontWeight: 400,
//     fontSize: '1rem',
//     lineHeight: '1.4375em',
//     letterSpacing: '0.00938em',
//     padding: 0,
//     position: 'relative',
//     display: 'block',
//     transformOrigin: 'top left',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     maxWidth: '100%',
//     transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
//     color: 'rgba(0, 0, 0, 0.6)'
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       <div className="form-column">
//         <div className="form-field">
//           <InputLabel id="project-name-label" style={inputLabelStyle}>
//             Project Name{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="projectName"
//             name="projectName"
//             value={formData.projectName}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a project</option>
//             {projectNames.map((project) => (
//               <option key={project.id} value={project.id}>{project.Business_Unit}</option>
//             ))}
//           </select>
//         </div>
//         </div>
//         <div className="form-column">
//         <div className="form-field">
//           <InputLabel id="device-name-label" style={inputLabelStyle}>
//             Device Name{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="deviceName"
//             name="deviceName"
//             value={formData.deviceName}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a device</option>
//             {devices.map((device) => (
//               <option key={device.DeviceId} value={device.DeviceId}>{device.DeviceSName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* <div className="form-column">
//         <div className="form-field">
//           <InputLabel id="device-location-label" style={inputLabelStyle}>
//             Device Location{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="deviceLocation"
//             name="deviceLocation"
//             value={formData.deviceLocation}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a location</option>
//             {devices.map((device) => (
//               <option key={device.DeviceId} value={device.DeviceLocation}>{device.DeviceLocation}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-field">
//           <InputLabel id="serial-number-label" style={inputLabelStyle}>
//             Serial Number{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="SerialNumber"
//             name="SerialNumber"
//             value={formData.SerialNumber}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a serial number</option>
//             {devices.map((device) => (
//               <option key={device.DeviceId} value={device.SerialNumber}>{device.SerialNumber}</option>
//             ))}
//           </select>
//         </div>
//       </div> */}

//       <Button type="submit" variant="contained" color="primary" className="submit-button" sx={{mt:3}}>
//         Submit
//       </Button>
//     </form>
//   );
// };

// export default ApproveLabours;














// Imp code with the essl logic  19-07-2024



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { InputLabel, Button } from '@mui/material';
// import { API_BASE_URL } from "../../Data";
// import './projectMachine.css'; // Assuming you are importing a CSS file for styling

// const ApproveLabours = () => {
//   const [projectNames, setProjectNames] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [formData, setFormData] = useState({
//     projectName: '',
//     deviceName: '',
//     deviceLocation: '',
//     SerialNumber: '',
//     startDate: '',
//     endDate: '',
//   });

//   const renderRequiredAsterisk = (isRequired) => {
//     return isRequired ? <span style={{ color: "red" }}> *</span> : null;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectNamesRes = await axios.get(`${API_BASE_URL}/api/project-names`);
//         const devicesRes = await axios.get(`${API_BASE_URL}/api/devices`);

//         if (projectNamesRes.status === 200) {
//           setProjectNames(projectNamesRes.data);
//           console.log('Fetched Project Names:', projectNamesRes.data);
//         } else {
//           console.error('Failed to fetch project names:', projectNamesRes.status);
//         }

//         if (devicesRes.status === 200) {
//           setDevices(devicesRes.data);
//           console.log('Fetched Devices:', devicesRes.data);
//         } else {
//           console.error('Failed to fetch devices:', devicesRes.status);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/attendance-logs`, {
//         params: {
//           AppKey: 'your_app_key', // Replace with your actual AppKey
//           StartDate: formData.startDate,
//           EndDate: formData.endDate,
//         },
//       });
//       if (response.status === 200) {
//         setAttendanceData(response.data);
//         console.log('Attendance Data:', response.data);
//       } else {
//         console.error('Failed to fetch attendance data:', response.status);
//       }
//     } catch (err) {
//       console.error('Error fetching attendance data:', err);
//     }
//   };

//   const getInputStyle = () => {
//     return { 
//       fontWeight: 400,
//       fontSize: '16px',
//       marginBottom: '8px',
//       width: '17vw',
//     };
//   };

//   const inputLabelStyle = {
//     color: 'black',
//     fontFamily: "Roboto, Helvetica, Arial, sans-serif",
//     fontWeight: 400,
//     fontSize: '1rem',
//     lineHeight: '1.4375em',
//     letterSpacing: '0.00938em',
//     padding: 0,
//     position: 'relative',
//     display: 'block',
//     transformOrigin: 'top left',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     maxWidth: '100%',
//     transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
//     color: 'rgba(0, 0, 0, 0.6)'
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       <div className="form-column">
//         <div className="form-field">
//           <InputLabel id="project-name-label" style={inputLabelStyle}>
//             Project Name{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="projectName"
//             name="projectName"
//             value={formData.projectName}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a project</option>
//             {projectNames.map((project) => (
//               <option key={project.id} value={project.id}>{project.Business_Unit}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-field">
//           <InputLabel id="device-name-label" style={inputLabelStyle}>
//             Device Name{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="deviceName"
//             name="deviceName"
//             value={formData.deviceName}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a device</option>
//             {devices.map((device) => (
//               <option key={device.DeviceID} value={device.DeviceID}>{device.DeviceSName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="form-column">
//         <div className="form-field">
//           <InputLabel id="device-location-label" style={inputLabelStyle}>
//             Device Location{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="deviceLocation"
//             name="deviceLocation"
//             value={formData.deviceLocation}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a location</option>
//             {devices.map((device) => (
//               <option key={device.DeviceID} value={device.DeviceID}>{device.DeviceLocation}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-field">
//           <InputLabel id="serial-number-label" style={inputLabelStyle}>
//             Serial Number{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <select
//             id="SerialNumber"
//             name="SerialNumber"
//             value={formData.SerialNumber}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           >
//             <option value="">Select a serial number</option>
//             {devices.map((device) => (
//               <option key={device.DeviceID} value={device.DeviceID}>{device.SerialNumber}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-field">
//           <InputLabel id="start-date-label" style={inputLabelStyle}>
//             Start Date{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <input
//             type="datetime-local"
//             id="startDate"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           />
//         </div>

//         <div className="form-field">
//           <InputLabel id="end-date-label" style={inputLabelStyle}>
//             End Date{renderRequiredAsterisk(true)}
//           </InputLabel>
//           <input
//             type="datetime-local"
//             id="endDate"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleInputChange}
//             style={getInputStyle()}
//             required
//           />
//         </div>
//       </div>

//       <Button type="submit" variant="contained" color="primary" className="submit-button">
//         Submit
//       </Button>
//     </form>
//   );
// };

// export default ApproveLabours;
