
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
    Select,CircularProgress,
    MenuItem, Modal, Typography, IconButton,Tabs, Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchRegister';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext';
import ExportWagesReport from './ImportExportWages/ExportWages'
import ImportWagesReport from './ImportExportWages/ImportWages'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import './wagesReport.css'

const AttendanceReport = ({ departments, projectNames, labourlist  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [labours, setLabours] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);
    const [dailyWages, setDailyWages] = useState({});
    const [perDayWages, setPerDayWages] = useState({});
    const [monthlyWages, setMonthlyWages] = useState({});
    const [yearlyWages, setYearlyWages] = useState({});
    const [overtime, setOvertime] = useState({});
    const [totalOvertimeWages, setTotalOvertimeWages] = useState({});
    const [payStructure, setPayStructure] = useState({});
    const [weakelyOff, setWeakelyOff] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [weeklyOff, setWeeklyOff] = useState('');
    const [fixedMonthlyWages, setFixedMonthlyWages] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [effectiveDate, setEffectiveDate] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPayStructure, setSelectedPayStructure] = useState('');
    const [employeeToggle, setEmployeeToggle] = useState('all'); // 'all' or 'single'
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedLabourIds, setSelectedLabourIds] = useState([]);
    const [selectedLabourWorkingHours, setSelectedLabourWorkingHours] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [filteredIconLabours, setFilteredIconLabours] = useState([]);
    const [modalOpens, setModalOpens] = useState(true);
    const [perHourWages, setPerHourWages] = useState(null); 

    const workingHoursString = labours?.workingHours || "FLEXI SHIFT - 9 HRS";
    const workingHours = parseInt(workingHoursString.match(/\d+/)?.[0], 10) || 8;


    const convertToIndianTime = (isoString) => {
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        return formatter.format(new Date(isoString));
    };

    const allowedProjectIds =
    user && user.projectIds ? JSON.parse(user.projectIds) : [];
  const allowedDepartmentIds =
    user && user.departmentIds ? JSON.parse(user.departmentIds) : [];
    console.log('allowedProjectIds:', allowedProjectIds);
    console.log('allowedDepartmentIds:', allowedDepartmentIds);
  // Use labourlist prop if available, otherwise use state labours
  const laboursSource =
    labourlist && labourlist.length > 0 ? labourlist : labours;

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

    // const getProjectDescription = (ProjectID) => {
    //     if (!Array.isArray(projectNames) || projectNames.length === 0) {
    //       console.log('projectNames empty');
    //       return 'Unknown';
    //     }
    //     if (ProjectID === undefined || ProjectID === null || ProjectID === '') {
    //       console.log('ProjectID invalid:', ProjectID);
    //       return 'Unknown';
    //     }
    //     const project = projectNames.find(
    //       (proj) => proj.Id === Number(ProjectID)
    //     );
    //     console.log(`For ProjectID ${ProjectID}, found project:`, project);
    //     return project ? project.Business_Unit : 'Unknown';
    //   };

    // // Helper function to get the Department description
    // const getDepartmentDescription = (departmentId) => {
    //     if (!Array.isArray(departments) || departments.length === 0) {
    //         return 'Unknown';
    //     }
    //     const department = departments.find(
    //         (dept) => dept.Id === Number(departmentId)
    //     );
    //     return department ? department.Description : 'Unknown';
    // };

    // Function to fetch labours from API with optional filters
    const fetchLabours = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/labours/getWagesAndLabourOnboardingJoin`,
                {
                    params: filters, // e.g., { ProjectID: selectedBusinessUnit, DepartmentID: selectedDepartment }
                }
            );
            setLabours(response.data);
            console.log('response.data wages r',response.data)

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

    const handleApplyFilter = async () => {
        // Build filter query parameters (only add filters with values)
        const params = {};
        if (selectedBusinessUnit) params.businessUnit = selectedBusinessUnit;
        if (selectedDepartment) params.department = selectedDepartment;
        if (selectedPayStructure) params.payStructure = selectedPayStructure;
        if (employeeToggle === 'single' && selectedEmployee) {
            params.employee = selectedEmployee;
        }
    }
    const handleResetFilter = () => {
        // Reset all filter fields and refetch the complete data set
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


    const handleWageChange = (labourId, value) => {
        const daysInMonth = getDaysInMonth(); // Check number of days in the current month
        const hoursPerShift = 8; // Assuming 8 hours per shift

        // Set daily wage
        setDailyWages(prev => ({ ...prev, [labourId]: value }));
        setPerDayWages(prev => ({ ...prev, [labourId]: value / hoursPerShift }));

        // Calculate monthly and yearly wages based on days in the current month
        const monthly = value * daysInMonth;
        const yearly = monthly * 12;

        setMonthlyWages(prev => ({ ...prev, [labourId]: monthly }));
        setYearlyWages(prev => ({ ...prev, [labourId]: yearly }));
    };

    const handleOvertimeChange = (labourId, value) => {
        const overtimeRate = perDayWages[labourId] || 0; // Calculate hourly overtime rate
        const overtimeWages = overtimeRate * value; // Total overtime pay

        setOvertime(prev => ({ ...prev, [labourId]: value }));
        setTotalOvertimeWages(prev => ({ ...prev, [labourId]: overtimeWages }));
    };

    const handlePayStructureChange = (labourId, structure) => {
        setPayStructure(prev => ({ ...prev, [labourId]: structure }));
    };

    const handleWeakelyOffChange = (labourId, value) => {
        setWeakelyOff(prev => ({ ...prev, [labourId]: value }));
    };

    // const handleSubmit = async () => {
    //     const formData = paginatedLabours.map(labour => ({
    //         labourId: labour.LabourID,
    //         payStructure: payStructure[labour.LabourID],
    //         dailyWages: dailyWages[labour.LabourID],
    //         perDayWages: perDayWages[labour.LabourID],
    //         monthlyWages: monthlyWages[labour.LabourID],
    //         yearlyWages: yearlyWages[labour.LabourID],
    //         overtime: overtime[labour.LabourID],
    //         totalOvertimeWages: totalOvertimeWages[labour.LabourID],
    //         weakelyOff: weakelyOff[labour.LabourID],
    //     }));

    //     try {
    //         await axios.post(`${API_BASE_URL}/labours/submitWages`, formData);
    //         alert("Data submitted successfully!");
    //     } catch (error) {
    //         console.error("Error submitting data:", error);
    //         alert("Failed to submit data.");
    //     }
    // };

    // Utility function to get the number of days in the current month
    const getDaysInMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    };
    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
        setPayStructure ({})
    };
    // const displayLabours = searchResults.length > 0 ? searchResults : labours;

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

    // const fetchBusinessUnits = async () => {
    //     try {
    //         const response = await fetch(`https://api.vjerp.com/api/businessUnit`, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer 20a763e266308b35fc75feca4b053d5ce8ea540dbdaa77ee13b1a5e7ce8aadcf`,
    //             },
    // mode: 'no-cors',

    //         });

    //         console.log('Response:', response); // Log response to debug

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
    //         }

    //         const data = await response.json();
    //         console.log('Business Units fetched:', data);
    //         setBusinessUnits(data);
    //     } catch (error) {
    //         console.error('Error fetching business units:', error);
    //         toast.error('Error fetching business units.');
    //     }
    // };
    // useEffect(() => {
    //     fetchBusinessUnits();
    // }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0);
      };


    const handleBusinessUnitChange = async (event) => {
        const selectedUnit = event.target.value;
        setSelectedBusinessUnit(selectedUnit);

        const selectedProject = businessUnits.find((unit) => unit.BusinessUnit === selectedUnit);
        if (selectedProject) {
            setProjectName(selectedProject.ProjectID);

            try {
                const response = await axios.get(`${API_BASE_URL}/labours`, {
                    params: { projectName: selectedProject.ProjectID },
                });
                setLabours(response.data);
            } catch (error) {
                console.error('Error fetching labours for project:', error);
                toast.error('Error fetching labours for the selected project.');
            }
        }
    };

    const handleExport = async () => {
        if (!startDate || !endDate) {
            toast.error('Please select a Business Unit, Start Date, and End Date.');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/exportWagesExcel`, {
                params: { startDate, endDate },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const fileName = `Attendance_${selectedBusinessUnit}_${startDate}_${endDate}.xlsx`;

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);

            toast.success('Attendance exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Export Error: ${error.response.data.message}`);
            } else {
                toast.error('Error exporting data. Please try again later.');
            }
        }
    };

    // const handleSave = async () => {
    //     try {
    //         const onboardName = user.name || null;
    //         if (!payStructure || !effectiveDate) {
    //             toast.error("Please fill in all required fields.");
    //             return;
    //         }
    //         // Loop through each selected labour ID
    //         for (const labourId of selectedLabourIds) {
    //             const wageData = {
    //                 labourId,
    //                 payStructure,
    //                 effectiveDate,
    //                 // Only pass wage values for Daily Wages; otherwise, set them to null.
    //                 dailyWages: payStructure === 'Daily Wages' ? (dailyWages || null) : null,
    //                 monthlyWages: payStructure === 'Daily Wages' ? (monthlyWages || null) : null,
    //                 yearlyWages: payStructure === 'Daily Wages' ? (yearlyWages || null) : null,
    //                 overtime: payStructure === 'Daily Wages' ? (overtime || null) : null,
    //                 totalOvertimeWages: payStructure === 'Daily Wages' ? (totalOvertimeWages || null) : null,
    //                 // For Fixed Monthly Wages, pass fixedMonthlyWages and weeklyOff; others set to null.
    //                 fixedMonthlyWages: payStructure === 'Fixed Monthly Wages' ? (fixedMonthlyWages || null) : null,
    //                 weeklyOff: payStructure === 'Fixed Monthly Wages' ? (weeklyOff || null) : null,
    //                 wagesEditedBy: onboardName,
    //             };

    //             // Check if wages already exist for the current labour
    //             const updateResponse =  await axios.post(`${API_BASE_URL}/labours/sendWagesForApproval`, wageData,
    //                 { params: { labourId } }
    //             );

    //             if (updateResponse.status === 200) {
    //                 toast.success('Labour details updated successfully.');
    //               } else {
    //                 toast.error('Failed to update labour details. Please try again.');
    //               }
    //             };
    //         // Refresh the data, close the modal, and reset fields & selections
    //         fetchLabours();
    //         setModalOpen(false);
    //         setWeeklyOff("");
    //         setEffectiveDate("");
    //         setFixedMonthlyWages(0);
    //         setMonthlyWages(0);
    //         setDailyWages(0);
    //         setSelectedLabourIds([]);
    //     } catch (error) {
    //         console.error("Error saving wages:", error);
    //         toast.error("Failed to save wages.");
    //     }
    // };

    const handleSave = async () => {
        setSaveLoader(true);
        try {
            const onboardName = user.name || null;
    
            if (!payStructure || !effectiveDate) {
                toast.error("Please fill in all required fields.");
                return;
            }
    
            // Store promises for API calls
            const apiPromises = [];
    
            // Loop through each selected labour ID
            for (const labourId of selectedLabourIds) {
                const wageData = {
                    labourId,
                    payStructure,
                    effectiveDate,
                    dailyWages: payStructure === 'DAILY WAGES' ? dailyWages || null : null,
                    monthlyWages: payStructure === 'DAILY WAGES' ? monthlyWages || null : null,
                    yearlyWages: payStructure === 'DAILY WAGES' ? yearlyWages || null : null,
                    overtime: payStructure === 'DAILY WAGES' ? overtime || null : null,
                    totalOvertimeWages: payStructure === 'DAILY WAGES' ? totalOvertimeWages || null : null,
                    fixedMonthlyWages: payStructure === 'FIXED MONTHLY WAGES' ? fixedMonthlyWages || null : null,
                    weeklyOff: payStructure === 'FIXED MONTHLY WAGES' ? weeklyOff || null : null,
                    wagesEditedBy: onboardName,
                };
    
                try {
                    // **Run upsertLabourMonthlyWages API and wait for WageID**
                    const upsertResponse = await axios.post(`${API_BASE_URL}/labours/upsertLabourMonthlyWages`, wageData);
                    
                    if (upsertResponse.data && upsertResponse.data.WageID) {
                        wageData.wageId = upsertResponse.data.WageID; // Assign WageID
    
                        // **Run sendWagesForApproval API using the received WageID**
                        apiPromises.push(axios.post(`${API_BASE_URL}/labours/sendWagesForApproval`, wageData));

                         // **Wait for all sendWagesForApproval API calls to complete**
                        await Promise.all(apiPromises);
    
                        // Show success message after all API calls complete
                        toast.info("Wages sent for admin approval.");
                    } else {
                        console.error(`Failed to get WageID for LabourID ${labourId}`);
                        toast.error(upsertResponse.data.message);
                    }
                } catch (error) {
                    console.error(`Error processing LabourID ${labourId}:`, error);
                }
            }
            setSaveLoader(false);
        handleCancel();
    
            fetchLabours();
            setModalOpen(false);
            setWeeklyOff("");
            setEffectiveDate("");
            setFixedMonthlyWages(0);
            setMonthlyWages(0);
            setDailyWages(0);
            setYearlyWages(0);
            setSelectedLabourIds([]);
            setSelectedLabourWorkingHours("");
        } catch (error) {
            console.error("Error saving wages:", error);
            toast.error("Failed to save wages.");
        }
    };
    
    const handleEdit = (labour) => {
        setSelectedLabour(labour);
        setPayStructure('');
        setDailyWages(0);
        setMonthlyWages(0);
        setYearlyWages(0);
        setOvertime(0);
        setTotalOvertimeWages(0);
        setModalOpen(true);
    };

    const handleToast = (type, message) => {
        if (type === 'success') {
            toast.success(message);
            setModalOpen(false);
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
            const response = await axios.get(`${API_BASE_URL}/labours/searchLaboursFromWages?q=${searchQuery}`);
            setSearchResults(response.data);
            setPage(0);
        } catch (error) {
            console.error('Error searching:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };
    const handleSelectLabour = (selectedLabour) => {
        setSelectedLabour(selectedLabour);
    };

    
//    laboursSource.forEach((labour) => {
//         const labourProjectId = Number(labour.ProjectID);
//         const labourDepartmentId = Number(labour.DepartmentID);
//         const projectMatch =
//           allowedProjectIds.length > 0
//             ? allowedProjectIds.includes(labourProjectId)
//             : true;
//         const departmentMatch =
//           allowedDepartmentIds.length > 0
//             ? allowedDepartmentIds.includes(labourDepartmentId)
//             : true;
//         // For strict logging (both must match), you could use:
//         if (!projectMatch && !departmentMatch) {
//         //   console.log(`Record ${labour.LabourID} filtered out: ProjectID ${labourProjectId}, DepartmentID ${labourDepartmentId}`);
//         }
//       });
    
      // Strict filtering: record must match allowed project and department IDs, and status "Approved"
      const getFilteredLaboursForTable = () => {
        let baseLabours = searchResults.length > 0 ? [...searchResults] : [...laboursSource];
        // console.log("baseLabours : ", JSON.stringify(baseLabours));
        // let baseLabours = rowsPerPage > 0
        //   ? (searchResults.length > 0
        //       ? searchResults
        //       : (filteredIconLabours.length > 0
        //           ? filteredIconLabours
        //           : [...labours]))
        //   : [];
       
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
        console.log('Filtered Labours For Table:', JSON.stringify(baseLabours));
        return baseLabours || [];
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

      // Reset page if current page is out of range after filtering
    //   useEffect(() => {
    //     if (page * rowsPerPage >= filteredLaboursForTable.length) {
    //       setPage(0);
    //     }
    //   }, [filteredLaboursForTable, page, rowsPerPage]);
    
    //   const paginatedLabours = filteredLaboursForTable.slice(
    //     page * rowsPerPage,
    //     rowsPerPage === -1
    //       ? filteredLaboursForTable.length
    //       : (page + 1) * rowsPerPage
    //   );
    //   console.log('Paginated Labours:', paginatedLabours);
    
      const displayedLabours = filteredLaboursForTable.filter((labour) => {
        return (
          getProjectDescription(labour.ProjectID) !== 'Unknown' &&
          getDepartmentDescription(labour.DepartmentID) !== 'Unknown'
        );
      });
      console.log('Displayed Labours:', displayedLabours);
    
      const isAllSelected =
        filteredLaboursForTable.length > 0 &&
        filteredLaboursForTable.every((labour) => selectedLabourIds.includes(labour.LabourID));
    
      // Handlers
      const handleSelectRow = (event, labourId, workingHours) => {
        if (event.target.checked) {
          setSelectedLabourIds((prev) => [...prev, labourId]);
          setSelectedLabourWorkingHours( workingHours);
        } else {
          setSelectedLabourIds((prev) => prev.filter((id) => id !== labourId));
        }
      };
    
      const handleSelectAllRows = (event) => {
        if (event.target.checked) {
          const newSelected = filteredLaboursForTable.map((labour) => labour.LabourID);
          setSelectedLabourIds((prev) => [
            ...prev,
            ...newSelected.filter((id) => !prev.includes(id)),
          ]);
        } else {
          const newSelected = filteredLaboursForTable.map((labour) => labour.LabourID);
          setSelectedLabourIds((prev) =>
            prev.filter((id) => !newSelected.includes(id))
          );
        }
      };
    
      const handleViewHistory = (labourID) => {
        const history = labours.filter((labour) => labour.LabourID === labourID);
        console.log('history',history)
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
        
      const pendingCount = displayedLabours.filter(labour => 
        labour?.ApprovalStatusWages === 'Pending' || 
        labour?.ApprovalStatusWages === null || 
        labour?.ApprovalStatusWages === ""
    ).length;
    
    const approvedCount = displayedLabours.filter(labour => 
        labour?.ApprovalStatusWages === 'Approved'
    ).length;

    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <ToastContainer />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Typography variant="h4" sx={{ fontSize: '18px', lineHeight: 3.435 }}>
                    User | Wages Report
                </Typography>
                <SearchBar
                    // handleSubmit={handleSubmit}
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

                <ExportWagesReport departments={departments} projectNames={projectNames}/>
                <ImportWagesReport handleToast={handleToast} onboardName={user.name || null}  modalOpens={modalOpens} setModalOpens={setModalOpens}/>

             

                <Button variant="outlined" color="secondary" startIcon={<FilterListIcon />} onClick={() => setFilterModalOpen(true)}>
                    Filter
                </Button>
                {selectedLabourIds.length > 0 && (
                    <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={() => setModalOpen(true)}>
                        Edit ({selectedLabourIds.length})
                    </Button>
                )}


                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 900, { label: 'All', value: displayedLabours.length }]}
                    count={tabValue === 0 ? pendingCount : approvedCount}
                    // rowsPerPageOptions={[25, 100, 900, { label: 'All', value: displayedLabours.length }]}
                    // // rowsPerPageOptions={[ 100, { label: 'All', value: -1 }]}
                    // // count={labours.length}
                    // count={displayedLabours.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
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
                                {/* <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onChange={handleSelectAllRows}
                                        inputProps={{ 'aria-label': 'select all labours' }}
                                    /></TableCell> */}
                                <TableCell>Sr No</TableCell>
                                <TableCell>Labour ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Business Unit</TableCell>
                                <TableCell>Department</TableCell>
                                {/* <TableCell>From Date</TableCell> */}
                                <TableCell>Effective From</TableCell>
                                <TableCell>Pay Structure</TableCell>
                                <TableCell>Daily Wages</TableCell>
                                <TableCell>Fixed Monthly Wages</TableCell>
                                <TableCell>Weekly Off</TableCell>
                                <TableCell>Wages Edited By</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Wages History</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedLabours
                                .filter(labour =>
                                    (tabValue === 0 && 
                                        (labour?.ApprovalStatusWages === 'Pending' || 
                                         labour?.ApprovalStatusWages === null || 
                                         labour?.ApprovalStatusWages === "" || labour?.ApprovalStatusWages === "Rejected")) ||
                                    (tabValue === 1 && labour?.ApprovalStatusWages === 'Approved')
                                )
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((labour, index) => (
                                    <TableRow key={labour.LabourID}
                                        sx={{
                                            backgroundColor:
                                                labour?.ApprovalStatusWages === 'Pending'
                                        ? '#ffe6e6' // Light red for Pending
                                        : labour?.ApprovalStatusWages === 'Approved'
                                        ? '#dcfff0' // Light green for Approved
                                        : 'inherit',
                                  }}
                                >
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{labour.LabourID}</TableCell>
                                    <TableCell>{labour.name || '-'}</TableCell>
                                    <TableCell>{getProjectDescription(labour.ProjectID) || '-'}</TableCell>
                                    <TableCell>{getDepartmentDescription(labour.DepartmentID) || '-'}</TableCell>
                                    {/* <TableCell>{labour.From_Date ? new Date(labour.From_Date).toLocaleDateString() : '-'}</TableCell> */}
                                    <TableCell>{labour.EffectiveDate ? new Date(labour.EffectiveDate).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>{labour.PayStructure || '-'}</TableCell>
                                    <TableCell>{labour.DailyWages || '-'}</TableCell>
                                    <TableCell>{labour.FixedMonthlyWages || '-'}</TableCell>
                                    <TableCell>{labour.WeeklyOff || '-'}</TableCell>
                                    <TableCell>{labour.WagesEditedBy || '-'}</TableCell>
                                    <TableCell>{labour.CreatedAt ? new Date(labour.CreatedAt).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color='rgb(239,230,247)'
                                            onClick={() => handleViewHistory(labour.LabourID)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                     <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'rgb(239,230,247)',
                                                color: 'rgb(130,54,188)',
                                                '&:hover': { backgroundColor: 'rgb(239,230,247)' },
                                            }}
                                            onClick={() => {
                                                // For individual edit, you can add this labour to the selection and open the modal.
                                                if (!selectedLabourIds.includes(labour.LabourID)) {
                                                    setSelectedLabourIds([...selectedLabourIds, labour.LabourID]);
                                                    setSelectedLabourWorkingHours(labour.workingHours);
                                                }
                                                setModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </TableContainer>

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

                    {/* Pay Structure Filter */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">Pay Structure</Typography>
                        <Select
                            fullWidth
                            value={selectedPayStructure}
                            onChange={(e) => setSelectedPayStructure(e.target.value)}
                            displayEmpty
                            sx={{ mt: 1 }}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            <MenuItem value="FIXED MONTHLY WAGES">Fixed Monthly Wages</MenuItem>
                            <MenuItem value="DAILY WAGES">Daily Wages</MenuItem>
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

            {/* Modal for Batch (or Individual) Wage Update */}
            <Modal
                open={modalOpen}
                onClose={handleCancel}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 550,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" mb={2}>
                        <Typography id="modal-title" variant="h6">
                            {selectedLabourIds.length > 1
                                ? 'Update Wages for Selected Labour'
                                : 'Edit Pay Structure'}
                        </Typography>
                        <Typography>Shift:  <strong>{selectedLabourWorkingHours}</strong></Typography>
                        </Box>
                        <IconButton onClick={handleCancel}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Pay Structure Dropdown */}
                    <Select
                        fullWidth
                        value={payStructure}
                        onChange={(e) => setPayStructure(e.target.value)}
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Select Pay Structure
                        </MenuItem>
                        <MenuItem value="DAILY WAGES">Daily Wages</MenuItem>
                        <MenuItem value="FIXED MONTHLY WAGES">Fixed Monthly Wages</MenuItem>
                    </Select>

                    {/* Effective Date Picker */}
                    <TextField
                        label="Effective Date"
                        type="date"
                        fullWidth
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        required
                    />

                    {/* Dynamic Fields based on Pay Structure */}
                    {payStructure === 'DAILY WAGES' && (
                        <>
                           <TextField
                            label="Daily Wages"
                            type="number"
                            fullWidth
                            value={dailyWages || ""}
                            onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                setDailyWages(value);

                                console.log("selectedLabourIds.workingHours",selectedLabourWorkingHours)
                                if (value !== null) {
                                    setMonthlyWages(value * 30); // Assuming 30 days/month
                                    setYearlyWages(value * 30 * 12); // Assuming 12 months/year
                                    if(selectedLabourWorkingHours=== 'FLEXI SHIFT - 8 HRS'){ setPerHourWages(8); } else { setPerHourWages(9); }

                                } else {
                                    setMonthlyWages(null);
                                    setYearlyWages(null);
                                    setPerHourWages(null);
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                            <TextField
                                label="Per Hours Wages"
                                type="number"
                                fullWidth
                                value={dailyWages ? (dailyWages / perHourWages).toFixed(2) : 0} // assuming 8 hours per day
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Monthly Wages"
                                type="number"
                                fullWidth
                                value={monthlyWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Yearly Wages"
                                type="number"
                                fullWidth
                                value={yearlyWages || 0}
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}

                    {payStructure === 'FIXED MONTHLY WAGES' && (
                        <>
                            <Select
                                label="Weekly Off"
                                fullWidth
                                value={weeklyOff || ""}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === "") {
                                        setWeeklyOff("");
                                        setMonthlyWages(0);
                                    } else {
                                        setWeeklyOff(selectedValue);
                                    }
                                }}
                                displayEmpty
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="" disabled>
                                    Select Weekly Off
                                </MenuItem>
                                <MenuItem value="0">0</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                            </Select>
                            <TextField
                                label="FIXED MONTHLY WAGES"
                                type="number"
                                fullWidth
                                value={fixedMonthlyWages || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFixedMonthlyWages(value === "" ? null : parseFloat(value));
                                }}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}

                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#fce4ec",
                                color: "rgb(255, 100, 100)",
                                width: "100px",
                                "&:hover": { backgroundColor: "#f8bbd0" },
                            }}
                            onClick={handleCancel}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "rgb(229, 255, 225)",
                                color: "rgb(43, 217, 144)",
                                width: "100px",
                                "&:hover": { backgroundColor: "rgb(229, 255, 225)" },
                            }}
                            onClick={handleSave}
                            disabled={!payStructure || !effectiveDate}
                            startIcon={saveLoader && <CircularProgress size={30} />}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                        Wages History Labour ID: {selectedHistory[0]?.LabourID || "N/A"}
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
                                        <strong>Edited By:</strong> {record.WagesEditedBy || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>From Date:</strong>{" "}
                                        {record.From_Date
                                            ? new Date(record.From_Date).toLocaleDateString()
                                            : "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Pay Structure:</strong> {record.PayStructure || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Daily Wages:</strong> ₹{record.DailyWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Per Hour Wages:</strong> ₹{record.PerHourWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Monthly Wages:</strong> ₹{record.MonthlyWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Yearly Wages:</strong> ₹{record.YearlyWages || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Weekly Off:</strong> {record.WeeklyOff || "0"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Fixed Monthly Wages:</strong> ₹
                                        {record.FixedMonthlyWages || "0"}
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

export default AttendanceReport;