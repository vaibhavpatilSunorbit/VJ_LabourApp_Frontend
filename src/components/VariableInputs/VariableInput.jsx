
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
  TextField,
  TablePagination,
  Select,
  MenuItem, Modal, Typography, IconButton, Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, FormControl, Tabs, Tab, Checkbox, ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchRegister';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext';
import ExportVariablePay from '../VariableInputs/ImportExportVariablePay/ExportVariablePay'
import ImportVariablePay from '../VariableInputs/ImportExportVariablePay/ImportVariablePay'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from '@mui/icons-material/FilterList';

const VariableInput = ({ departments, projectNames, labour, labourlist }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const { user } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [openDialogSite, setOpenDialogSite] = useState(false);
  const [statusesSite, setStatusesSite] = useState({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedPayStructure, setSelectedPayStructure] = useState('');
  const [employeeToggle, setEmployeeToggle] = useState('all'); // 'all' or 'single'
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedLabourIds, setSelectedLabourIds] = useState([]);
  const [modalPayData, setModalPayData] = useState({
    payStructure: "",
    variablePay: "",
    variablePayRemark: "",
    incentiveRemark: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });
  const [tabValue, setTabValue] = useState(0);
  // const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([]);

  const fetchLabours = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/insentive/getVariablePayAndLabourOnboardingJoin`,
        { params: filters }
      );
      setLabours(response.data);
    } catch (error) {
      console.error('Error fetching labours:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  const allowedProjectIds =
    user && user.projectIds ? JSON.parse(user.projectIds) : [];
  const allowedDepartmentIds =
    user && user.departmentIds ? JSON.parse(user.departmentIds) : [];
  const laboursSource =
    labourlist && labourlist.length > 0 ? labourlist : labours;



  const handleResetFilter = () => {
    setSelectedBusinessUnit([]);
    setSelectedDepartment([]);
    setSelectedPayStructure('');
    setEmployeeToggle('all');
    setSelectedEmployee('');
    // setSelectedBusinessUnit([]);
    fetchLabours();
    setFilterModalOpen(false);
  };

  // const handleApplyFilters = () => {
  //   const filters = {};
  //   if (selectedBusinessUnit) {
  //     // filters.ProjectID = selectedBusinessUnit;
  //     filters.ProjectID = selectedBusinessUnit.join(',');
  //   }
  //   if (selectedDepartment) {
  //     filters.DepartmentID = selectedDepartment;
  //   }
  //   if (selectedPayStructure) {
  //     filters.PayStructure = selectedPayStructure;
  //   }
  //   if (employeeToggle === 'single' && selectedEmployee) {
  //     filters.employee = selectedEmployee;
  //   }
  //   fetchLabours(filters);
  //   setFilterModalOpen(false);
  // };

  const handleApplyFilters = () => {
    const filters = {};

    if (Array.isArray(selectedBusinessUnit) && selectedBusinessUnit.length > 0) {
      filters.ProjectID = selectedBusinessUnit.join(','); // Pass as comma-separated string
    }

    if (Array.isArray(selectedDepartment) && selectedDepartment.length > 0) {
      filters.DepartmentID = selectedDepartment.join(',');
    }
    if (selectedPayStructure) {
      filters.PayStructure = selectedPayStructure;
    }
    if (employeeToggle === 'single' && selectedEmployee) {
      filters.EmployeeID = selectedEmployee; // or filters.employee = ...
    }

    fetchLabours(filters);
    setFilterModalOpen(false);
  };

  const fetchBusinessUnits = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/projectDeviceStatus`);
      setBusinessUnits(response.data);
    } catch (error) {
      console.error('Error fetching business units:', error);
      toast.error('Error fetching business units.');
    }
  };
  useEffect(() => {
    fetchBusinessUnits();
  }, []);

  const handleEdit = (labour) => {
    setSelectedLabour(labour);  // Preserves all current details of the labour
    setModalOpen(true);
  };

  const handleApproved = (labour) => {
    setModalOpen(true);
    setSelectedLabour(labour);
    setSelectedLabourIds([labour.LabourID]);
    setModalPayData({
      payStructure: "",
      variablePay: "",
      variablePayRemark: "",
      incentiveRemark: "",
      effectiveDate: new Date().toISOString().split("T")[0],
    });
  };

  const isAllSelected = projectNames.length > 0 && selectedBusinessUnit.length === projectNames.length;
  const isAllSelectedDep = departments.length > 0 && selectedDepartment.length === departments.length;

  const handleBusinessUnitChange = (event) => {
    const value = event.target.value;

    if (value.includes('ALL')) {
      if (isAllSelected) {
        setSelectedBusinessUnit([]); // Deselect all
      } else {
        const allIds = projectNames.map(p => p.Id);
        setSelectedBusinessUnit(allIds); // Select all
      }
    } else {
      setSelectedBusinessUnit(value);
    }
  };

  const handleToast = (type, message) => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      // const response = await axios.get(`${API_BASE_URL}/insentive/searchLaboursFromVariablePay?q=${searchQuery}`);
      const response = await axios.get(`${API_BASE_URL}/labours/searchLaboursFromVariableInput?q=${searchQuery}`);
      setSearchResults(response.data);
      setPage(0);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };


  const handleSelectLabour = (selectedLabour) => {
    setSelectedLabour(selectedLabour);
  };

  const closeVariablePayModal = () => {
    setModalOpen(false);
  };

  const handleModalConfirm = async () => {
    if (!modalPayData.payStructure || !modalPayData.variablePay) {
      toast.error("Please fill in all required fields in the modal.");
      return;
    }

    if (modalPayData.payStructure === "Incentive" && !modalPayData.incentiveRemark.trim()) {
      toast.error("Please enter a remark for Incentive.");
      return;
    }

    if (!selectedLabourIds || selectedLabourIds.length === 0) {
      toast.error("No labour selected.");
      return;
    }

    let labourIDforWages = selectedLabourIds[0];

    if (!labourIDforWages) {
      toast.error("Labour ID is missing.");
      return;
    }

    try {
      const wagesResponse = await axios.get(
        `${API_BASE_URL}/api/getWagesforInsentiveAdd?LabourID=${labourIDforWages}`
      );

      if (wagesResponse.status === 200 && wagesResponse.data.length > 0) {
        const { MonthlyWages, FixedMonthlyWages } = wagesResponse.data[0];
        if (
          modalPayData.payStructure === "Incentive" &&
          ((MonthlyWages > 0 && Number(modalPayData.variablePay) > 0.1 * MonthlyWages) || (FixedMonthlyWages > 0 && Number(modalPayData.variablePay) > 0.1 * FixedMonthlyWages))
        ) {
          toast.error("Variable Pay cannot be greater than 10% of Monthly Wages.");
          return;
        }
        setModalOpen(false);
        setOpenDialogSite(true);
      } else {
        // toast.error("Failed to fetch Monthly Wages. Try again.");
        setModalOpen(false);
        setOpenDialogSite(true);
      }
    } catch (error) {
      console.error("Error fetching Monthly Wages:", error);
      toast.error("Error fetching Monthly Wages.");
    }
  };


  const confirmTransfer = async () => {
    setOpenDialogSite(false);

    if (selectedLabourIds.length === 0) {
      toast.error("No labour(s) selected.");
      return;
    }

    try {
      const onboardName = user.name || null;

      for (const labourId of selectedLabourIds) {
        const foundLabour = labours.find((lab) => lab.LabourID === labourId);
        if (!foundLabour) continue; // or handle error

        const payload = {
          userId: foundLabour.id, // if you have an `id` field
          LabourID: foundLabour.LabourID,
          name: foundLabour.name,
          month: foundLabour.month,
          fullDate: foundLabour.fullDate,
          payStructure: modalPayData.payStructure,
          variablePay: modalPayData.variablePay,
          variablePayRemark: modalPayData.variablePayRemark,
          effectiveDate: modalPayData.effectiveDate,
          payAddedBy: onboardName,
          incentiveRemark: modalPayData.incentiveRemark,
        };

        const response = await axios.post(
          `${API_BASE_URL}/insentive/upsertVariablePay`,
          payload
        );

        if (response.status === 200) {
          setLabours((prev) =>
            prev.map((lab) => {
              if (lab.LabourID === foundLabour.LabourID) {
                return {
                  ...lab,
                  payStructure: modalPayData.payStructure,
                  variablePay: modalPayData.variablePay,
                  variablePayRemark: modalPayData.variablePayRemark,
                  incentiveRemark: modalPayData.incentiveRemark,
                  effectiveDate: modalPayData.effectiveDate,
                };
              }
              return lab;
            })
          );
        } else {
          toast.error(
            `Failed for LabourID=${foundLabour.LabourID}. ${response.data.message || "Unexpected error"
            }`
          );
        }
      }

      toast.info(
        `Variable Pay submitted for ${selectedLabourIds.length} labour(s) For Admin Approval.`
      );
      setSelectedLabourIds([]);
    } catch (error) {
      console.error("Error during variable pay submission:", error);
      const backendMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to send for Admin Approval.";
      toast.error(backendMessage);
    }
  };


  const fetchs = async (labourIds) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/allTransferSite`, { labourIds });
      // console.log('API Response:', response.data); // Debug response
      return response.data.map((item) => ({
        LabourID: item.LabourID,
        projectNames: item.projectNames,
        createdAt: item.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching transfer site names:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      setLoading(true);

      const labourIds = labours.map((labour) => labour.LabourID);
      if (labourIds.length > 0) {
        const statusesData = await fetchs(labourIds);
        const mappedStatuses = statusesData.reduce((acc, status) => {
          acc[status.LabourID] = {
            projectNames: status.projectNames || '-',
            createdAt: status.createdAt || '-',
          };
          return acc;
        }, {});
        setStatusesSite(mappedStatuses);
      }

      setLoading(false);
    };

  }, [labours]);



  const getRemarksOptions = (payStructure) => {
    switch (payStructure) {
      case "Advance":
        return ["New Joinee", "Payment Delay"];
      case "Debit":
        return ["Gadget Mishandling", "Performance Issue"];
      case "Incentive":
        return ["Payment Arrears", "Outstanding Performance"];
      default:
        return [];
    }
  };

  laboursSource.forEach((labour) => {
    const labourProjectId = Number(labour.ProjectID);
    const labourDepartmentId = Number(labour.DepartmentID);
    const projectMatch =
      allowedProjectIds.length > 0
        ? allowedProjectIds.includes(labourProjectId)
        : true;
    const departmentMatch =
      allowedDepartmentIds.length > 0
        ? allowedDepartmentIds.includes(labourDepartmentId)
        : true;
    if (!projectMatch && !departmentMatch) {
    }
  });

  const getLatestUniqueLabours = (labours) => {
    const uniqueLabours = [];
    const seen = new Set();
    for (let i = labours.length - 1; i >= 0; i--) {
      if (!seen.has(labours[i].LabourID)) {
        uniqueLabours.unshift(labours[i]);
        seen.add(labours[i].LabourID);
      }
    }
    return uniqueLabours;
  };

  const getFilteredLaboursForTable = () => {
    // let baseLabours = [...laboursSource];
    let baseLabours = getLatestUniqueLabours(searchResults.length > 0 ? searchResults : laboursSource);
    baseLabours = baseLabours.filter((labour) => {
      const labourProjectId = Number(labour.ProjectID);
      const labourDepartmentId = Number(labour.DepartmentID);
      const projectMatch =
        allowedProjectIds.length > 0
          ? allowedProjectIds.includes(labourProjectId)
          : true;
      const departmentMatch =
        allowedDepartmentIds.length > 0
          ? allowedDepartmentIds.includes(labourDepartmentId)
          : true;
      return projectMatch || departmentMatch;
    });
    return baseLabours;
  };

  const getProjectDescription = (ProjectID) => {
    if (!Array.isArray(projectNames) || projectNames.length === 0) return 'Unknown';
    if (ProjectID === undefined || ProjectID === null || ProjectID === '') return 'Unknown';
    const project = projectNames.find((proj) => proj.Id === Number(ProjectID));
    return project ? project.Business_Unit : 'Unknown';
  };

  const getDepartmentDescription = (departmentId) => {
    if (!Array.isArray(departments) || departments.length === 0) return 'Unknown';
    const department = departments.find((dept) => dept.Id === Number(departmentId));
    return department ? department.Description : 'Unknown';
  };

  const filteredLaboursForTable = getFilteredLaboursForTable();

  const displayedLabours = filteredLaboursForTable.filter((labour) => {
    return (
      getProjectDescription(labour.ProjectID) !== 'Unknown' &&
      getDepartmentDescription(labour.DepartmentID) !== 'Unknown'
    );
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const pendingCount = displayedLabours.filter(labour =>
    labour?.ApprovalStatusPay === 'AdminPending' ||
    labour?.ApprovalStatusPay === null ||
    labour?.ApprovalStatusPay === ""
  ).length;

  const approvedCount = displayedLabours.filter(labour =>
    labour?.ApprovalStatusPay === 'Approved'
  ).length;

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    if (value.includes('ALL')) {
        if (isAllSelectedDep) {
            setSelectedDepartment([]);
        } else {
            const allDeptIds = departments.map(d => d.Id);
            setSelectedDepartment(allDeptIds);
        }
    } else {
        // setSelectedDepartment(typeof value === 'string' ? value.split(',') : value);
        setSelectedDepartment(value);
    }
};


  const handleViewHistory = (labourID) => {
    const history = labours.filter((labour) => labour.LabourID === labourID);
    setSelectedHistory(history);
    setOpenModal(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(0);
  };

  return (
    <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
      <ToastContainer />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
          User | Variable Inputs
        </Typography>
        <SearchBar
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
          /> </Tabs>

        <ExportVariablePay />
        <ImportVariablePay handleToast={handleToast} onboardName={user?.name || null} />

        <Button variant="outlined" color="secondary" startIcon={<FilterListIcon />} onClick={() => setFilterModalOpen(true)}>
          Filter
        </Button>
        {/* {selectedLabourIds.length > 0 && (
  <Button variant="outlined"  color="secondary" startIcon={<EditIcon />}  onClick={openVariablePayModal}>
Edit ({selectedLabourIds.length})
  </Button>
)} */}

        <TablePagination
          className="custom-pagination"
          rowsPerPageOptions={[25, 100, 900, { label: 'All', value: displayedLabours.length }]}
          // count={labours.length}
          // count={displayedLabours.length}
          count={tabValue === 0 ? pendingCount : approvedCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mb: isMobile ? 6 : 0,
          overflowX: 'auto',
          borderRadius: 2,
          boxShadow: 3,
          maxHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(75vh - 64px)',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
        }}
      >
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
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAllRows}
                    inputProps={{ 'aria-label': 'select all labours' }}
                  /></TableCell> */}
                <TableCell>Sr No</TableCell>
                <TableCell>Labour ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Department</TableCell>
                {/* <TableCell>Select Variable</TableCell>
                                <TableCell>Select Remark</TableCell>
                                <TableCell>Add Amount</TableCell>
                                <TableCell>Date</TableCell> */}
                <TableCell>History</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& td': {
                  padding: '16px 9px',
                  '@media (max-width: 600px)': { padding: '14px 8px' },
                },
              }}
            >
              {displayedLabours
                .filter(labour =>
                  (tabValue === 0 &&
                    (labour?.ApprovalStatusPay === 'AdminPending' ||
                      labour?.ApprovalStatusPay === null ||
                      labour?.ApprovalStatusPay === "" || labour?.ApprovalStatusPay === "Rejected")) ||
                  (tabValue === 1 && labour?.ApprovalStatusPay === 'Approved')
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((labour, index) => (
                  <TableRow key={labour.LabourID}
                    sx={{
                      backgroundColor:
                        labour?.ApprovalStatusPay === 'AdminPending'
                          ? '#ffe6e6' // Light red for Pending
                          : labour?.ApprovalStatusPay === 'Approved'
                            ? '#dcfff0' // Light green for Approved
                            : 'inherit',
                    }}
                  >
                    {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLabourIds.includes(labour.LabourID)}
                      onChange={(e) => handleSelectRow(e, labour.LabourID)}
                      inputProps={{ 'aria-label': `select labour ${labour.LabourID}` }}
                    />
                  </TableCell> */}
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{labour.LabourID}</TableCell>
                    <TableCell>{labour.name || '-'}</TableCell>
                    {/* <TableCell>{getProjectDescription(labour.ProjectID) || '-'}</TableCell> */}
                    <TableCell>{labour.businessUnit || '-'}</TableCell>
                    <TableCell>{getDepartmentDescription(labour.DepartmentID) || '-'}</TableCell>





                    <TableCell>
                      <IconButton
                        color="rgb(239,230,247)"
                        onClick={() => handleViewHistory(labour.LabourID)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: 'rgb(229, 255, 225)',
                          color: 'rgb(43, 217, 144)',
                          width: '60px',
                          marginRight: '10px',
                          marginBottom: '3px',
                          '&:hover': {
                            backgroundColor: 'rgb(229, 255, 225)',
                          },
                        }}
                        onClick={() => handleApproved(labour)}
                      >
                        Add
                      </Button>
                      {/* <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(239,230,247)',
                                                color: 'rgb(130,54,188)',
                                                '&:hover': { backgroundColor: 'rgb(239,230,247)' },
                                            }}
                                            onClick={() => handleEdit(labour)}
                                        >
                                            Add
                                        </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={closeVariablePayModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" gutterBottom>
            Add Variable Pay
          </Typography>

          {/* Show how many labours are selected */}
          <Typography id="modal-description" gutterBottom>
            Selected Labours: {selectedLabourIds.length}
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            {/* <InputLabel>Select Variable Pay</InputLabel> */}
            <Select
              value={modalPayData.payStructure}
              onChange={(e) =>
                setModalPayData((prev) => ({
                  ...prev,
                  payStructure: e.target.value,
                  variablePayRemark: "",
                }))
              }
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Variable Pay
              </MenuItem>
              <MenuItem value="Advance">Advance</MenuItem>
              <MenuItem value="Debit">Debit</MenuItem>
              <MenuItem value="Incentive">Incentive</MenuItem>
            </Select>
          </FormControl>

          {/* If payStructure is set, show remark options */}
          {modalPayData.payStructure && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              {/* <InputLabel>Select Remark</InputLabel> */}
              <Select
                value={modalPayData.variablePayRemark}
                onChange={(e) =>
                  setModalPayData((prev) => ({
                    ...prev,
                    variablePayRemark: e.target.value,
                  }))
                }
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Remark
                </MenuItem>
                {getRemarksOptions(modalPayData.payStructure).map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {modalPayData.payStructure === "Incentive" && (
            <TextField
              label="Remark For Incentive"
              fullWidth
              value={modalPayData.incentiveRemark}
              onChange={(e) =>
                setModalPayData((prev) => ({
                  ...prev,
                  incentiveRemark: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
              required
            />
          )}

          <TextField
            label="Variable Pay"
            type="number"
            fullWidth
            value={modalPayData.variablePay}
            onChange={(e) => {
              const val = e.target.value;
              if (!isNaN(val) && !val.includes("e") && val.length <= 5) {
                setModalPayData((prev) => ({ ...prev, variablePay: val }));
              }
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Effective Date"
            type="date"
            fullWidth
            value={modalPayData.effectiveDate}
            onChange={(e) =>
              setModalPayData((prev) => ({
                ...prev,
                effectiveDate: e.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            required
          />

          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={closeVariablePayModal} sx={{ width: "auto" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalConfirm}
              sx={{
                backgroundColor: 'rgb(229, 255, 225)',
                color: 'rgb(43, 217, 144)',
                width: '60px',
                marginRight: '10px',
                marginBottom: '3px',
                '&:hover': {
                  backgroundColor: 'rgb(229, 255, 225)',
                },
                width: "auto"
              }}
            >
              Add Pay
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Dialog for Confirmation */}
      <Dialog open={openDialogSite} onClose={() => setOpenDialogSite(false)}>
        <DialogTitle>Confirm Variable Pay</DialogTitle>
        <DialogContent>
          <DialogContentText id="EditLabour-dialog-description">
            Are you sure you want Variable Pay of Labour{" "}
            <span style={{ fontWeight: "bold" }}>{selectedLabour?.name} </span>
            with JCcode{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialogSite(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmTransfer}
            sx={{
              backgroundColor: "rgb(229, 255, 225)",
              color: "rgb(43, 217, 144)",
              width: "100px",
              marginRight: "10px",
              marginBottom: "3px",
              "&:hover": {
                backgroundColor: "rgb(229, 255, 225)",
              },
            }}
            autoFocus
          >
            Add Pay
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------------------------------------------------------------------------------ */}
      {/* ===== FILTER MODAL ===== */}
      <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Modal Header with Title and Close Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Filter Options
            </Typography>
            <Button onClick={() => setFilterModalOpen(false)}>
              <CloseIcon />
            </Button>
          </Box>

          {/* Business Unit Filter using projectNames from props */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Business Unit</Typography>
            {/* <Select
              fullWidth
              value={selectedBusinessUnit}
              onChange={(e) => setSelectedBusinessUnit(e.target.value)}
              displayEmpty
              sx={{ mt: 1 }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {Array.isArray(projectNames) && projectNames.length > 0 ? (
                projectNames.map((project) => (
                  <MenuItem key={project.Id} value={project.Id}>
                    {project.Business_Unit}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="Unknown" disabled>
                  No Projects Available
                </MenuItem>
              )}
            </Select> */}

            <Select
              fullWidth
              multiple
              value={selectedBusinessUnit}
              onChange={handleBusinessUnitChange}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) return <em>All</em>;
                const selectedLabels = projectNames
                  .filter(project => selected.includes(project.Id))
                  .map(project => project.Business_Unit);
                return selectedLabels.join(', ');
              }}
              sx={{ mt: 1 }}
            >
              <MenuItem value="ALL">
                <Checkbox checked={isAllSelected} indeterminate={selectedBusinessUnit.length > 0 && !isAllSelected} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {Array.isArray(projectNames) && projectNames.length > 0 ? (
                projectNames.map((project) => (
                  <MenuItem key={project.Id} value={project.Id}>
                    <Checkbox checked={selectedBusinessUnit.includes(project.Id)} />
                    <ListItemText primary={project.Business_Unit} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="Unknown" disabled>
                  No Projects Available
                </MenuItem>
              )}
            </Select>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Department</Typography>
            <Select
              fullWidth
              multiple
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) return <em>All</em>;
                const selectedLabels = departments
                  .filter(dept => selected.includes(dept.Id))
                  .map(dept => dept.Description);
                return selectedLabels.join(', ');
              }}
              sx={{ mt: 1 }}
            >
              <MenuItem value="ALL">
                <Checkbox
                  checked={isAllSelectedDep}
                  indeterminate={selectedDepartment.length > 0 && !isAllSelectedDep}
                />
                <ListItemText primary="Select All" />
              </MenuItem>

              {Array.isArray(departments) && departments.length > 0 ? (
                departments.map((department) => (
                  <MenuItem key={department.Id} value={department.Id}>
                    <Checkbox checked={selectedDepartment.includes(department.Id)} />
                    <ListItemText primary={department.Description} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="Unknown" disabled>
                  No Department Available
                </MenuItem>
              )}
            </Select>
          </Box>

          {/* Modal Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleResetFilter}>
              Reset
            </Button>
            <Button variant="contained" sx={{
              backgroundColor: "rgb(229, 255, 225)",
              color: "rgb(43, 217, 144)",
              width: "100px",
              marginRight: "10px",
              marginBottom: "3px",
              "&:hover": {
                backgroundColor: "rgb(229, 255, 225)",
              },
            }} onClick={handleApplyFilters}>
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>


      {/* ------------------------------------------------------------------------------------------ */}



      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%", // Mobile screens
              sm: "80%", // Tablet screens
              md: "70%", // Laptop screens
              lg: "60%", // Large screens
            },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 }, // Adjust padding for different devices
            maxHeight: "85vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Header */}
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Variable Pay History Labour ID: {selectedHistory[0]?.LabourID || "N/A"}
          </Typography>

          {/* Modal Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              position: "relative",
              alignItems: "center",
            }}
          >
            {selectedHistory.map((record, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 4,
                  position: "relative",
                  width: { xs: "100%", md: "70%" }, // Adjust width for responsiveness
                }}
              >
                {/* Vertical Line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: "27%", md: "27.5%" }, // Adjust line position
                    top: 0,
                    bottom: index !== selectedHistory.length - 0 ? 0 : "auto",
                    width: 4,
                    bgcolor: "green",
                    zIndex: -1,
                  }}
                />

                {/* Dot for Edited On */}
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "darkgreen",
                    borderRadius: "50%",
                    position: "absolute",
                    left: { xs: "calc(28% - 9px)", md: "calc(28% - 9px)" }, // Adjust dot position
                  }}
                ></Box>

                {/* Left Side - Edited On */}
                <Box
                  sx={{
                    flex: 1,
                    textAlign: "right",
                    pr: 2,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Adjust font size
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Edited On:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(record.CreatedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(record.CreatedAt).toLocaleTimeString()}
                  </Typography>
                </Box>
                {/* Right Side - Details */}
                <Box
                  sx={{
                    flex: 3,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Adjust font size
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {record.name || "N/A"}
                  </Typography>
                  <Typography variant="body2" >
                    <strong>Edited By:</strong> {record.payAddedBy || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Effective Date:</strong>{" "}
                    {record.EffectiveDate
                      ? new Date(record.EffectiveDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pay Structure:</strong> {record.PayStructure || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Variable pay Amount:</strong> {record.VariablepayAmount || "0"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Variable Pay Remark:</strong> {record.variablePayRemark || "0"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Approval Status:</strong> {record.ApprovalStatusPay || "0"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

export default VariableInput;   