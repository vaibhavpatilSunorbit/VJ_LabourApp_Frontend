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
  FormControl,
  ListItemText,
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
    deviceIds: [], // Changed from deviceId to deviceIds array
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
    if (name === 'deviceIds') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: typeof value === 'string' ? value.split(',') : value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }
    
    if (formData.deviceIds.length === 0) {
      toast.error('Please select at least one device');
      return;
    }

    try {
      // Use the multiple devices API if more than one device is selected
      if (formData.deviceIds.length > 1) {
        const response = await axios.post(`${API_BASE_URL}/api/addMultipleDevices`, {
          projectId: formData.projectId,
          deviceIds: formData.deviceIds
        });
        
        if (response.status === 200) {
          toast.success('Multiple devices added successfully');
          const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
          setProjectDeviceStatus(updatedStatus.data);
          setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
          setFormData({ projectId: '', deviceIds: [] });
        } else {
          console.error('Failed to submit data:', response.status);
          toast.error('Failed to submit data');
        }
      } else {
        // Use the single device API for single device
        const response = await axios.post(`${API_BASE_URL}/api/approveLabour`, {
          projectId: formData.projectId,
          deviceId: formData.deviceIds[0]
        });
        
        if (response.status === 200) {
          toast.success('Device added successfully');
          const updatedStatus = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
          setProjectDeviceStatus(updatedStatus.data);
          setSelectedProjects(updatedStatus.data.map(item => item.ProjectID));
          setFormData({ projectId: '', deviceIds: [] });
        } else {
          console.error('Failed to submit data:', response.status);
          toast.error('Failed to submit data');
        }
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

  // Get assigned device IDs to filter them out from available devices
  const assignedDeviceIds = projectDeviceStatus.map(item => item.DeviceID);
  const availableDevices = devices.filter(device => !assignedDeviceIds.includes(device.DeviceId));

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
              Device Names{renderRequiredAsterisk(true)}
            </InputLabel>
            <FormControl sx={{ width: window.innerWidth < 768 ? '37vw' : '17vw' }}>
              <Select
                labelId="device-name-label"
                id="deviceIds"
                multiple
                value={formData.deviceIds}
                onChange={handleInputChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const device = availableDevices.find(d => d.DeviceId === value);
                      return (
                        <Chip 
                          key={value} 
                          label={device ? device.DeviceSName : value}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
                name="deviceIds"
                required
              >
                {availableDevices.map((device) => (
                  <MenuItem key={device.DeviceId} value={device.DeviceId}>
                    <Checkbox checked={formData.deviceIds.indexOf(device.DeviceId) > -1} />
                    <ListItemText primary={device.DeviceSName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{
            backgroundColor: 'rgb(229, 255, 225)',
            color: 'rgb(43, 217, 144)',
            '&:hover': {
              backgroundColor: 'rgb(229, 255, 225)',
            },
            mt: isMobile ? 0 : 3
          }} 
          className="submit-button"
        >
          Submit ({formData.deviceIds.length} device{formData.deviceIds.length !== 1 ? 's' : ''})
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

      {/* Update Modal */}
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
              paddingBottom: { xs: "0px", sm: "0px", md: "18px"},
              paddingLeft: { xs: "0px", sm: "0px", md: "0px"},
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

