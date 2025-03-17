
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
    TextField,
    TablePagination,
    Select,
    MenuItem, Modal, Typography, IconButton, Dialog, Checkbox,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, FormControl, InputLabel
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
import EditIcon from '@mui/icons-material/Edit';
import { parse } from "fast-xml-parser";

const VariableInput = ({ departments, projectNames, labour, labourlist }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dailyWages, setDailyWages] = useState({});
    const [perDayWages, setPerDayWages] = useState({});
    const [monthlyWages, setMonthlyWages] = useState(0);
    const [yearlyWages, setYearlyWages] = useState({});
    const [overtime, setOvertime] = useState({});
    const [variablePay, setvariablePay] = useState({});
    const [payStructure, setPayStructure] = useState({});
    const [weakelyOff, setWeakelyOff] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [projectName, setProjectName] = useState('');
    const { user } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [newSite, setNewSite] = useState(null);
    const [openDialogSite, setOpenDialogSite] = useState(false);
    const [statusesSite, setStatusesSite] = useState({});
    const [effectiveDate, setEffectiveDate] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPayStructure, setSelectedPayStructure] = useState('');
    const [employeeToggle, setEmployeeToggle] = useState('all'); // 'all' or 'single'
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedLabourIds, setSelectedLabourIds] = useState([]);
    const [modalPayData, setModalPayData] = useState({
        payStructure: "",
        variablePay: "",
        variablePayRemark: "",
        effectiveDate: new Date().toISOString().split("T")[0],
      });
      const [filteredIconLabours, setFilteredIconLabours] = useState([]);

    
    // const getProjectDescription = (projectId) => {
    //     if (!Array.isArray(projectNames) || projectNames.length === 0) {
    //       console.error('Projects array is empty or invalid:', projectNames);
    //       return 'Unknown';
    //     }
    //     if (projectId === undefined || projectId === null) {
    //       console.error('Project ID is undefined or null:', projectId);
    //       return 'Unknown';
    //     }
    //     const project = projectNames.find(
    //       (proj) => proj.id === Number(projectId)
    //     );
    //     return project ? project.Business_Unit : 'Unknown';
    //   };

    // const getProjectDescription = (projectId) => {
    //   if (!Array.isArray(projectNames) || projectNames.length === 0) {
    //     return 'Unknown';
    //   }
    
    //   if (projectId === undefined || projectId === null || projectId === '') {
    //     return 'Unknown';
    //   }
    
    //   const project = projectNames.find(proj => proj.Id === Number(projectId));
    
    //   console.log('Project Names variablPay:', projectNames);
    //   console.log('Searching for Project ID variablPay:', projectId);
    //   console.log('Found Project: variablPay', project);
    
    //   return project ? project.projectName : 'Unknown';
    // };
    
    //   // Helper function to get the Department description
    //   const getDepartmentDescription = (departmentId) => {
    //     if (!Array.isArray(departments) || departments.length === 0) {
    //       return 'Unknown';
    //     }
    //     const department = departments.find(
    //       (dept) => dept.Id === Number(departmentId)
    //     );
    //     return department ? department.Description : 'Unknown';
    //   };
    
    const fetchLabours = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/getVariablePayAndLabourOnboardingJoin`,
                { params: filters}
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
    // console.log('allowedProjectIds:', allowedProjectIds);
    // console.log('allowedDepartmentIds:', allowedDepartmentIds);
  // Use labourlist prop if available, otherwise use state labours
  const laboursSource =
    labourlist && labourlist.length > 0 ? labourlist : labours;
  

    const handleApplyFilter = () => {
        const params = {};
        if (selectedBusinessUnit) params.businessUnit = selectedBusinessUnit;
        if (selectedDepartment) params.department = selectedDepartment;
        if (selectedPayStructure) params.payStructure = selectedPayStructure;
        if (employeeToggle === "single" && selectedEmployee) {
          params.employee = selectedEmployee;
        }
        // fetchLabours(params) if needed
      };
    const handleResetFilter = () => {
        setSelectedBusinessUnit('');
        setSelectedDepartment('');
        setSelectedPayStructure('');
        setEmployeeToggle('all');
        setSelectedEmployee('');
        fetchLabours();
        setFilterModalOpen(false);
      };

      const handleApplyFilters = () => {
        const filters = {};
        if (selectedBusinessUnit) {
          filters.ProjectID = selectedBusinessUnit;
        }
        if (selectedDepartment) {
          filters.DepartmentID = selectedDepartment;
        }
        if (selectedPayStructure) {
          filters.PayStructure = selectedPayStructure;
        }
        if (employeeToggle === 'single' && selectedEmployee) {
          filters.employee = selectedEmployee;
        }
        fetchLabours(filters);
        setFilterModalOpen(false);
      };

    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
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
      // openVariablePayModal();
      setModalOpen(true);
        setSelectedLabour(labour);  
        setSelectedLabourIds([labour.LabourID]);
        setModalPayData({
          payStructure: "",
          variablePay: "",
          variablePayRemark: "",
          effectiveDate: new Date().toISOString().split("T")[0],
        });
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
            const response = await axios.get(`${API_BASE_URL}/labours/searchAttendance?q=${searchQuery}`);
            setSearchResults(response.data);
            setPage(0);
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    // const handlePageChange = (e, newPage) => {
    //     setPage(newPage);
    // };

    // const handleRowsPerPageChange = (e) => {
    //     const newRowsPerPage = parseInt(e.target.value, 10);
    //     setRowsPerPage(newRowsPerPage);
    //     setPage(0); // Reset to the first page
    // };
    const handleSelectLabour = (selectedLabour) => {
        setSelectedLabour(selectedLabour);
    };

    // Filter data to only include the latest entry per LabourID
    const getLatestLabourData = (labours) => {
        const latestEntries = {};
        labours.forEach((labour) => {
            if (
                !latestEntries[labour.LabourID] ||
                new Date(labour.CreatedAt) > new Date(latestEntries[labour.LabourID].CreatedAt)
            ) {
                latestEntries[labour.LabourID] = labour;
            }
        });
        return Object.values(latestEntries);
    };

      // Checkbox handling: select/deselect individual row
    //   const handleSelectRow = (event, labourId) => {
    //     if (event.target.checked) {
    //       setSelectedLabourIds((prev) => [...prev, labourId]);
    //     } else {
    //       setSelectedLabourIds((prev) => prev.filter((id) => id !== labourId));
    //     }
    //   };
    
    //   const handleSelectAllRows = (event) => {
    //     if (event.target.checked) {
    //       // Select all on current page
    //       const newSelected = paginatedLabours.map((lab) => lab.LabourID);
    //       setSelectedLabourIds((prev) => [
    //         ...prev,
    //         ...newSelected.filter((id) => !prev.includes(id)),
    //       ]);
    //     } else {
    //       // Unselect all on current page
    //       const newSelected = paginatedLabours.map((lab) => lab.LabourID);
    //       setSelectedLabourIds((prev) => prev.filter((id) => !newSelected.includes(id)));
    //     }
    //   };

    // const handleViewHistory = (labourID) => {
    //     const history = labours.filter((labour) => labour.LabourID === labourID);
    //     setSelectedHistory(history);
    //     setOpenModal(true);
    // };

    // const filteredLabours = getLatestLabourData(labours);
    // const paginatedLabours = rowsPerPage > 0
    // ? filteredLabours.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    // : filteredLabours;

    // const isAllSelected =
    // paginatedLabours.length > 0 &&
    // paginatedLabours.every(labour => selectedLabourIds.includes(labour.LabourID));

    // const getProjectDescription = (projectId) => {
    //     if (!Array.isArray(projectNames) || projectNames.length === 0) {
    //         console.error('Projects array is empty or invalid:', projectNames);
    //         return 'Unknown';
    //     }

    //     if (projectId === undefined || projectId === null) {
    //         console.error('Project ID is undefined or null:', projectId);
    //         return 'Unknown';
    //     }

    //     const project = projectNames.find(
    //         (proj) => proj.id === Number(projectId)
    //     );

    //     return project ? project.Business_Unit : 'Unknown';
    // };


    // const getDepartmentDescription = (departmentId) => {
    //     if (!departments || departments.length === 0) {
    //         return 'Unknown';
    //     }
    //     const department = departments.find(dept => dept.Id === Number(departmentId));
    //     return department ? department.Description : 'Unknown';
    // };

    const openVariablePayModal = () => {
        if (selectedLabourIds.length === 0) {
          // toast.error("No labours selected!");
          console.log('No labours selected!')
          return;
        }
        // Reset or set any default values
        setModalPayData({
          payStructure: "",
          variablePay: "",
          variablePayRemark: "",
          effectiveDate: new Date().toISOString().split("T")[0],
        });
        setModalOpen(true);
      };
    
      const closeVariablePayModal = () => {
        setModalOpen(false);
      };

    const handleModalTransfer = () => {
        setSelectedLabour(labour);
        confirmTransfer();
        setModalOpen(false); // Close the modal
        setOpenDialogSite(true); // Open the confirmation dialog
    };

    const   handleModalConfirm = async () => {
      if (!modalPayData.payStructure || !modalPayData.variablePay) {
        toast.error("Please fill in all required fields in the modal.");
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
    console.log("MonthlyWages", MonthlyWages)
    console.log("FixedMonthlyWages", FixedMonthlyWages)
    
          if (
            modalPayData.payStructure === "Incentive" &&
           (MonthlyWages !== 0 && modalPayData.variablePay > 0.1 * MonthlyWages || FixedMonthlyWages !== 0 && modalPayData.variablePay > 0.1 * FixedMonthlyWages)
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

      // For each selected labour, gather data & send
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
        };

        const response = await axios.post(
          `${API_BASE_URL}/insentive/upsertVariablePay`,
          payload
        );

        if (response.status === 200) {
          // Update local state
          setLabours((prev) =>
            prev.map((lab) => {
              if (lab.LabourID === foundLabour.LabourID) {
                return {
                  ...lab,
                  payStructure: modalPayData.payStructure,
                  variablePay: modalPayData.variablePay,
                  variablePayRemark: modalPayData.variablePayRemark,
                  effectiveDate: modalPayData.effectiveDate,
                };
              }
              return lab;
            })
          );
        } else {
          toast.error(
            `Failed for LabourID=${foundLabour.LabourID}. ${
              response.data.message || "Unexpected error"
            }`
          );
        }
      }

      toast.info(
        `Variable Pay submitted for ${selectedLabourIds.length} labour(s) For Admin Approval.`
      );
      // Clear selection
      setSelectedLabourIds([]);
    } catch (error) {
      console.error("Error during variable pay submission:", error);
      // Check if the backend sent an error message and show that instead
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
                // console.log('Mapped Statuses with Dates:', mappedStatuses); // Debug statuses
            }

            setLoading(false);
        };

        // if (labours.length > 0) fetchStatuses();
    }, [labours]);


    // const handlePayStructureChange = (e, labourID) => {
    //     const newPayStructure = e.target.value;
    //     const updatedLabours = labours.map(labour => {
    //         if (labour.LabourID === labourID) {
    //             return {
    //                 ...labour,
    //                 payStructure: newPayStructure,
    //                 variablePayRemark: ''  // Reset remarks when pay structure changes
    //             };
    //         }
    //         return labour;
    //     });
    //     setLabours(updatedLabours);
    // };

    // const handleRemarkChange = (e, labourID) => {
    //     const newVariablePayRemark = e.target.value;
    //     const updatedLabours = labours.map(labour => {
    //         if (labour.LabourID === labourID) {
    //             return {
    //                 ...labour,
    //                 variablePayRemark: newVariablePayRemark
    //             };
    //         }
    //         return labour;
    //     });
    //     setLabours(updatedLabours);
    // };

    const handlePayStructureChange = (e, labourID) => {
        const value = e.target.value;
        setLabours((prev) =>
          prev.map((lab) =>
            lab.LabourID === labourID ? { ...lab, payStructure: value } : lab
          )
        );
      };
    
      const handleRemarkChange = (e, labourID) => {
        const value = e.target.value;
        setLabours((prev) =>
          prev.map((lab) =>
            lab.LabourID === labourID ? { ...lab, variablePayRemark: value } : lab
          )
        );
      };
    

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

    // const handleVariablePayChange = (e, labourID) => {
    //     const input = e.target.value;
    //     // Parse the input as a float only if it is not empty and has 5 or fewer digits
    //     const value = (input === '' || input.length > 5) ? null : parseFloat(input);

    //     // Update labours state only if the input is valid (5 digits or fewer)
    //     if (input === '' || input.length <= 5) {
    //         const updatedLabours = labours.map(labour => {
    //             if (labour.LabourID === labourID) {
    //                 return { ...labour, variablePay: value };
    //             }
    //             return labour;
    //         });
    //         setLabours(updatedLabours);
    //     }
    // };


    // const handleEffectiveDateChange = (e, labourID) => {
    //     const updatedLabours = labours.map(labour => {
    //         if (labour.LabourID === labourID) {
    //             return { ...labour, effectiveDate: e.target.value };
    //         }
    //         return labour;
    //     });
    //     setLabours(updatedLabours);
    // };

    const handleVariablePayChange = (e, labourID) => {
        const input = e.target.value;
        // Restrict input length and parse as float
        if (input === "" || input.length <= 5) {
          const numericVal = input === "" ? "" : parseFloat(input);
          setLabours((prev) =>
            prev.map((lab) =>
              lab.LabourID === labourID ? { ...lab, variablePay: numericVal } : lab
            )
          );
        }
      };
    
      const handleEffectiveDateChange = (e, labourID) => {
        const value = e.target.value;
        setLabours((prev) =>
          prev.map((lab) =>
            lab.LabourID === labourID ? { ...lab, effectiveDate: value } : lab
          )
        );
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
        // For strict logging (both must match), you could use:
        if (!projectMatch && !departmentMatch) {
        //   console.log(`Record ${labour.LabourID} filtered out: ProjectID ${labourProjectId}, DepartmentID ${labourDepartmentId}`);
        }
      });
    
      const getLatestUniqueLabours = (labours) => {
        const uniqueLabours = [];
        const seen = new Set();
        // Iterate backwards so that the first encountered record is the latest one
        for (let i = labours.length - 1; i >= 0; i--) {
          if (!seen.has(labours[i].LabourID)) {
            uniqueLabours.unshift(labours[i]);
            seen.add(labours[i].LabourID);
          }
        }
        return uniqueLabours;
      };

      // Strict filtering: record must match allowed project and department IDs, and status "Approved"
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
        //   console.log('projectMatch', projectMatch, 'departmentMatch', departmentMatch);
          // Return true if either matches
          return projectMatch || departmentMatch;
        });
        // Ensure that only records with status "Approved" are included.
        // baseLabours = baseLabours.filter((labour) => labour.status === 'Approved');
        // console.log('Filtered Labours For Table:', baseLabours);
        return baseLabours;
      };
    
      // Helper: Get project description
      const getProjectDescription = (ProjectID) => {
        if (!Array.isArray(projectNames) || projectNames.length === 0) return 'Unknown';
        if (ProjectID === undefined || ProjectID === null || ProjectID === '') return 'Unknown';
        const project = projectNames.find((proj) => proj.Id === Number(ProjectID));
        return project ? project.Business_Unit : 'Unknown';
      };
    
      // Helper: Get department description
      const getDepartmentDescription = (departmentId) => {
        if (!Array.isArray(departments) || departments.length === 0) return 'Unknown';
        const department = departments.find((dept) => dept.Id === Number(departmentId));
        return department ? department.Description : 'Unknown';
      };
    
      const filteredLaboursForTable = getFilteredLaboursForTable();
// console.log('filteredLaboursForTable}}',filteredLaboursForTable)
      // Reset page if current page is out of range after filtering
      // useEffect(() => {
      //   if (page * rowsPerPage >= filteredLaboursForTable.length) {
      //     setPage(0);
      //   }
      // }, [filteredLaboursForTable, page, rowsPerPage]);
    
      // const paginatedLabours = filteredLaboursForTable.slice(
      //   page * rowsPerPage,
      //   rowsPerPage === -1
      //     ? filteredLaboursForTable.length
      //     : (page + 1) * rowsPerPage
      // );
    //   console.log('Paginated Labours:', paginatedLabours);
    
      const displayedLabours = filteredLaboursForTable.filter((labour) => {
        return (
          getProjectDescription(labour.ProjectID) !== 'Unknown' &&
          getDepartmentDescription(labour.DepartmentID) !== 'Unknown'
        );
      });
      // console.log('Displayed Labours:', displayedLabours);
    
      // const isAllSelected =
      //   paginatedLabours.length > 0 &&
      //   paginatedLabours.every((labour) => selectedLabourIds.includes(labour.LabourID));
    
     
    
    
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
                <ExportVariablePay />
                <ImportVariablePay handleToast={handleToast} onboardName={user?.name || null} />

                <Button variant="outlined"  color="secondary" startIcon={<FilterListIcon />} onClick={() => setFilterModalOpen(true)}>
 Filter
</Button>
{/* {selectedLabourIds.length > 0 && (
  <Button variant="outlined"  color="secondary" startIcon={<EditIcon />}  onClick={openVariablePayModal}>
Edit ({selectedLabourIds.length})
  </Button>
)} */}

                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 900, { label: 'All', value: displayedLabours.length}]}
                    // count={labours.length}
                    count={displayedLabours.length}
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
                            {/* {(rowsPerPage > 0 ? paginatedLabours : filteredLabours).map((labour, index) => ( */}
                            {/* {paginatedLabours.map((labour, index) => ( */}
                            {displayedLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((labour, index) => (
                                <TableRow key={labour.LabourID}>
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
                                    <TableCell>{getProjectDescription(labour.ProjectID) || '-'}</TableCell>
                                    <TableCell>{getDepartmentDescription(labour.DepartmentID) || '-'}</TableCell>

                                    {/* <TableCell>
                                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                                            <Select
                                                labelId="pay-structure-label"
                                                value={labour.payStructure || ''}
                                                onChange={(e) => handlePayStructureChange(e, labour.LabourID)}
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
                                    </TableCell>

                                    <TableCell>
                                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }} disabled={!labour.payStructure}>
                                            <Select
                                                labelId="remark-label"
                                                value={labour.variablePayRemark || ''}
                                                onChange={(e) => handleRemarkChange(e, labour.LabourID)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Remark</MenuItem>
                                                {labour.payStructure ? getRemarksOptions(labour.payStructure).map(variablePayRemark => (
                                                    <MenuItem key={variablePayRemark} value={variablePayRemark}>{variablePayRemark}</MenuItem>
                                                )) : null}
                                            </Select>
                                        </FormControl>
                                    </TableCell>


                                    <TableCell sx={{ mr: 5 }}>
                                        <TextField
                                            id="standard-number"
                                            label="Variable Pay"
                                            type="number"
                                            variant="standard"
                                            fullWidth
                                            value={labour.variablePay || ''}
                                            onChange={(e) => handleVariablePayChange(e, labour.LabourID)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                maxLength: 5  
                                            }}
                                            error={labour.variablePay && labour.variablePay.length > 5}
                                            sx={{ mb: 2 }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            id="effective-date"
                                            label="Effective Date"
                                            type="date"
                                            variant="standard"
                                            fullWidth
                                            value={labour.effectiveDate || new Date().toISOString().split('T')[0]} 
                                            onChange={(e) => handleEffectiveDateChange(e, labour.LabourID)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                readOnly: true, 
                                            }}
                                            sx={{ mb: 2 }}
                                            required
                                        />
                                    </TableCell> */}



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
                                            // onClick={() => openVariablePayModal(labour)}
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


            {/* Modal for Add Variable Pay */}
            {/* <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
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
                    <Typography id="modal-description" gutterBottom>
                        Selected Labour: {selectedLabour?.name || 'Not Selected'}
                    </Typography>
                    <Select
                        fullWidth
                        value={selectedLabour?.payStructure || ''}
                        onChange={(e) => handlePayStructureChange(e, selectedLabour?.LabourID)}
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select Variable Pay
                        </MenuItem>
                        <MenuItem value="Advance">Advance</MenuItem>
                        <MenuItem value="Debit">Debit</MenuItem>
                        <MenuItem value="Incentive">Incentive</MenuItem>
                    </Select>
                    <TextField
                        label="Variable Pay"
                        type="number"
                        fullWidth
                        value={selectedLabour?.variablePay}
                        onChange={(e) => {
                            // Allow only numbers and prevent 'e' or other non-numeric characters
                            const value = e.target.value;
                            if (!isNaN(value) && !value.includes('e')) {
                                handleVariablePayChange(e, selectedLabour.LabourID);
                            }
                        }}
                        sx={{ mb: 2 }}
                    />


                    <TextField
                        label="Effective Date"
                        type="date"
                        fullWidth
                        value={new Date().toISOString().split('T')[0]} // Sets the date to today's date
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            readOnly: true, // Makes the date picker read-only
                        }}
                        sx={{ mb: 2 }}
                        required
                    />

                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={() => setModalOpen(false)}
                            sx={{ width: "45%" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // If single-labour edit is also wanted:
                                if (!selectedLabourIds.includes(labour.LabourID)) {
                                  setSelectedLabourIds((prev) => [
                                    ...prev,
                                    labour.LabourID,
                                  ]);
                                }
                                handleModalTransfer(selectedLabour);
                              }}
                            sx={{ width: "45%" }}
                        >
                            Add Pay 
                        </Button>
                    </Box>
                </Box>
            </Modal> */}

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
                width:"auto"
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
              <Select
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
              </Select>
            </Box>

            {/* Department Filter using departments from props */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Department</Typography>
              <Select
                fullWidth
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                displayEmpty
                sx={{ mt: 1 }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {Array.isArray(departments) && departments.length > 0 ? (
                  departments.map((department) => (
                    <MenuItem key={department.Id} value={department.Id}>
                      {department.Description}
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
            <Button variant="outlined"  color="secondary" onClick={handleResetFilter}>
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