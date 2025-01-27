
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    IconButton,
    Menu,
    MenuItem, Select, Avatar
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./peoplereport.css";
import { useNavigate, useLocation } from 'react-router-dom';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CircleIcon from '@mui/icons-material/Circle';


const PeopleReport = ({ departments, projectNames, labour }) => {
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
    const [labourDetails, setLabourDetails] = useState(null);

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

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            setError('Error searching. Please try again.');
        }
    };




    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours`);
            // console.log('API Response:', response.data);
            setLabours(response.data);
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
            return labour.status === 'Approved';
        } else if (tabValue === 1) {
            return labour.status === 'Approved';
        } else if (tabValue === 3) {
            return labour.status === 'Approved';
        } else {
            return labour.status === 'Rejected' || labour.status === 'Resubmitted' || labour.status === 'Disable';
        }
    });

    const getDepartmentDescription = (departmentId) => {
        if (!departments || departments.length === 0) {
            return 'Unknown';
        }
        const department = departments.find(dept => dept.Id === Number(departmentId));
        return department ? department.Description : 'Unknown';
    };




    const getProjectDescription = (projectId) => {

        if (!projectNames || projectNames.length === 0) {
            // console.log('Projects array is empty or undefined');
            return 'Unknown';
        }

        if (projectId === undefined || projectId === null) {
            // console.log('Project ID is undefined or null');
            return 'Unknown';
        }

        const project = projectNames.find(proj => {
            // console.log(`Checking project: ${proj.id} === ${Number(projectId)} (Type: ${typeof proj.id})`);
            return proj.id === Number(projectId);
        });

        // console.log('Found Project:', project);
        return project ? project.Business_Unit : 'Unknown';
    };


    const handleDownload = async () => {
        setLoadingExcel(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/download-excel`, {
                responseType: 'blob', // Important for handling binary data
            });

            // Create a blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const today = new Date();
            const date = today.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
            link.href = url;
            link.setAttribute('download', `labourOnboarding_data_${date}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Excel downloaded successfully!');
        } catch (error) {
            console.error('Error downloading the Excel file:', error);
            toast.error('Failed to download Excel file.');
        } finally {
            setLoadingExcel(false); // Hide loader after download completes or fails
        }
    };

    // Show here to status of Employee master api and Essl api..............................
    useEffect(() => {
        const fetchStatuses = async (labourIds) => {
            try {
                const response = await axios.post(`${API_BASE_URL}/labours/getCombinedStatuses`, { labourIds });
                return response.data;  // Return the entire list of statuses
            } catch (error) {
                console.error('Error fetching statuses:', error);
                return [];
            }
        };

        const updateStatuses = async () => {
            const labourList = searchResults.length > 0 ? searchResults : (filteredIconLabours.length > 0 ? filteredIconLabours : labours);
            const labourIds = labourList.map(labour => labour.LabourID || labour.id); // Collect all labour IDs

            if (labourIds.length > 0) {
                const statuses = await fetchStatuses(labourIds);

                const updatedStatuses = {};
                statuses.forEach(status => {
                    updatedStatuses[status.LabourID] = {
                        esslStatus: status.esslStatus === 'success',
                        employeeMasterStatus: status.employeeMasterStatus === 'true'
                    };
                });

                setStatuses(updatedStatuses); // Update state with the mapped statuses
            }
        };

        if (!hasFetchedStatuses.current && labours.length > 0) {
            updateStatuses();
            hasFetchedStatuses.current = true;  // Set to true after the first call
        }
    }, [searchResults, filteredIconLabours, labours]);

    // Filter icon with filter the labours for tha icon.....................
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget); // Set the anchor element to open the menu
    };

    // Function to handle closing the filter menu
    const handleCloseBtn = () => {
        setAnchorEl(null); // Close the menu
    };

    // Function to handle fetching labours and applying the filter based on the dropdown selection
    const handleFilterSelect = async (filterType, page = 1, limit = 50) => {
        setLoading(true);
        setError(null); // Reset error state before fetching

        try {
            const response = await axios.get(`${API_BASE_URL}/labours`, {
                params: {
                    page: page,
                    limit: limit
                }
            });
            const labours = response.data;

            let filtered;
            if (filterType === "OnboardingForm") {
                // Fetch labours with uploadAadhaarFront present
                filtered = labours.filter(
                    (labour) =>
                        labour.uploadAadhaarFront && labour.uploadAadhaarFront.trim() !== ""
                );
            } else if (filterType === "Farvision") {
                // Fetch labours where uploadAadhaarFront is null, empty, or undefined
                filtered = labours.filter(
                    (labour) =>
                        !labour.uploadAadhaarFront || labour.uploadAadhaarFront.trim() === ""
                );
            } else if (filterType === "All") {
                filtered = labours;
            }

            setSelectedFilter(filterType);
            setFilteredIconLabours(filtered); // Update the filtered labours state
            setLabours(labours); // Update the full labours state
            setPage(0);
            console.log(`Filtered ${filterType} Labours:`, filtered);
            setLoading(false);
        } catch (error) {
            setError("Error fetching labours. Please try again.");
            setLoading(false);
        }

        setAnchorEl(null); // Close dropdown
    };

    // const getFilteredLaboursForTab = () => {
    //     if (tabValue === 0) {
    //         // Pending tab: Filter labours with "Pending" status
    //         return filteredIconLabours.length > 0
    //             ? filteredIconLabours.filter(labour => labour.status === 'Pending')
    //             : labours.filter(labour => labour.status === 'Pending');
    //     } else if (tabValue === 1) {
    //         // Approved tab: Filter labours with "Approved" status
    //         return filteredIconLabours.length > 0
    //             ? filteredIconLabours.filter(labour => labour.status === 'Approved')
    //             : labours.filter(labour => labour.status === 'Approved');
    //     } else if (tabValue === 3) {
    //         // Rejected tab: Filter labours with "Rejected" or "Resubmitted" status
    //         return filteredIconLabours.length > 0
    //             ? filteredIconLabours.filter(
    //                 labour => labour.status === 'Rejected' || labour.status === 'Resubmitted' || labour.status === 'Disable'
    //             )
    //             : labours.filter(
    //                 labour => labour.status === 'Rejected' || labour.status === 'Resubmitted' || labour.status === 'Disable'
    //             );
    //     }
    //     // return filteredIconLabours.length > 0 ? filteredIconLabours : labours;
    //     return filteredLabours.length > 0 ? filteredLabours : labours;
    // };


    //////////////////////////  Site Transfer Code for labour  ////////////////////////////////////////////
    const getFilteredLaboursForTab = () => {
        if (tabValue === 0) {
            // All tab: Show all labours with "Approved" status
            return filteredIconLabours.length > 0
                ? filteredIconLabours.filter(labour => labour.status === 'Approved')
                : labours.filter(labour => labour.status === 'Approved');
        } else if (tabValue === 1) {
            // Employees tab: Filter labours with "labourOwnership = VJ"
            return filteredIconLabours.length > 0
                ? filteredIconLabours.filter(labour => labour.labourOwnership === 'VJ' && labour.status === 'Approved')
                : labours.filter(labour => labour.labourOwnership === 'VJ' && labour.status === 'Approved');
        } else if (tabValue === 2) {
            // Contractors tab: Filter labours with "labourOwnership = CONTRACTOR"
            return filteredIconLabours.length > 0
                ? filteredIconLabours.filter(labour => labour.labourOwnership === 'CONTRACTOR' && labour.status === 'Approved')
                : labours.filter(labour => labour.labourOwnership === 'CONTRACTOR' && labour.status === 'Approved');
        } else if (tabValue === 3) {
            // Rejected tab: Filter labours with status in ["Rejected", "Resubmit", "Disable"]
            return filteredIconLabours.length > 0
                ? filteredIconLabours.filter(labour =>
                    ['Rejected', 'Resubmit', 'Disable'].includes(labour.status)
                )
                : labours.filter(labour =>
                    ['Rejected', 'Resubmit', 'Disable'].includes(labour.status)
                );
        }
        // Default: Return all labours if no specific tab matches
        // return filteredIconLabours.length > 0 ? filteredIconLabours : labours;
        return filteredLabours.length > 0 ? filteredLabours : labours;
    };



    const confirmTransfer = async () => {
        setOpenDialogSite(false); // Close the dialog


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

    const labourCounts = useMemo(() => {
        return {
            all: labours.filter(labour => labour.status === 'Approved').length,
            employees: labours.filter(labour => labour.labourOwnership === 'VJ' && labour.status === 'Approved').length,
            contractors: labours.filter(labour => labour.labourOwnership === 'CONTRACTOR' && labour.status === 'Approved').length,
            rejected: labours.filter(labour =>
                ['Rejected', 'Resubmit', 'Disable'].includes(labour.status)
            ).length,
        };
    }, [labours]);
    ///////////////////////////  Fetch Transfer labour from db Table  //////////////////////////////////////


    const openPopup = async (labour) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/${labour.id}`);
            const labourDetails = response.data;
            const projectName = getProjectDescription(labourDetails.projectName);
            const department = getDepartmentDescription(labourDetails.department);

            setSelectedLabour({
                ...labourDetails,
                projectName,
                department,
            });
            setIsPopupOpen(true);
        } catch (error) {
            console.error('Error fetching labour details:', error);
            toast.error('Error fetching labour details. Please try again.');
        }
    };

    const handleEditPeople = (labour) => {
        navigate(`/peopleEditDetails`, { state: { labourId: labour.id } }); // Pass labour.id in the state
    };
    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: isMobile ? 'auto' : 'auto', }}>
            {/* <Typography variant="h6" sx={{marginLeft:'8px'}} >
        People
      </Typography> */}

            <Box ml={-1.5}>
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
                        label={`All (${labourCounts.all})`}
                        style={{ color: tabValue === 0 ? "rgb(43, 217, 144)" : "black" }}
                        sx={{
                            color: tabValue === 0 ? "white" : "black",
                            bgcolor: tabValue === 0 ? "rgb(229, 255, 225)" : "transparent",
                            borderRadius: 1,
                            textTransform: "none",
                            mr: 1,
                            fontWeight: "bold",
                            minHeight: "auto",
                            minWidth: "auto",
                            // padding: "6px 12px",
                            "&:hover": {
                                bgcolor: tabValue === 0 ? "rgb(229, 255, 225)" : "rgb(229, 255, 225)",
                            },
                        }}
                    />
                    <Tab
                        label={`Employees (${labourCounts.employees})`}
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
                        label={`Contractors (${labourCounts.contractors})`}
                        style={{ color: tabValue === 2 ? "rgb(43, 217, 144)" : "black" }}
                        sx={{
                            color: tabValue === 2 ? "white" : "black",
                            bgcolor: tabValue === 2 ? "rgb(229, 255, 225)" : "transparent",
                            borderRadius: 1,
                            textTransform: "none",
                            mr: 1,
                            fontWeight: "bold",
                            minHeight: "auto",
                            minWidth: "auto",
                            // padding: "6px 12px",
                            "&:hover": {
                                bgcolor: tabValue === 2 ? "rgb(229, 255, 225)" : "rgb(229, 255, 225)",
                            },
                        }}
                    />

                    <Tab
                        label={`Rejected (${labourCounts.rejected})`}
                        style={{ color: tabValue === 3 ? "rgb(255, 100, 100)" : "black" }}
                        sx={{
                            color: tabValue === 3 ? "white" : "black",
                            bgcolor: tabValue === 3 ? "rgb(255, 229, 229)" : "transparent",
                            borderRadius: 1,
                            textTransform: "none",
                            fontWeight: "bold",
                            minHeight: "auto",
                            minWidth: "auto",
                            // padding: "6px 12px",
                            "&:hover": {
                                bgcolor: tabValue === 3 ? "rgb(255, 229, 229)" : "rgb(255, 229, 229)",
                            },
                        }}
                    />
                </Tabs>

                <Button
                    onClick={handleDownload}
                    style={{ color: tabValue === 6 ? "#54c668" : "#54c668" }}
                    sx={{
                        color: tabValue === 6 ? "white" : "black",
                        bgcolor: tabValue === 6 ? "rgb(53 202 79 / 89%)" : "#ecf9ee",
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: "bold",
                        minHeight: "auto",
                        minWidth: "auto",
                        px: 2,
                        py: 1.2,
                        // padding: "6px 12px",
                        "&:hover": {
                            bgcolor: tabValue === 3 ? "rgb(204 255 213 / 89%)" : "rgb(204 255 213 / 89%)",
                        },
                    }}
                    disabled={loadingExcel}
                >
                    {loadingExcel && (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
                            <ClipLoader size={20} color={"rgb(14 198 46)"} loadingExcel={loadingExcel} />
                        </Box>
                    )}
                    {' Import Excel'}
                </Button>



                {/* Filter Icon */}
                {/* <Box display="flex" alignItems="center">
                    <IconButton
                        onClick={handleFilterClick}
                        sx={{ marginLeft: "auto", color: "rgb(84, 198, 104)", background: "rgb(204 255 213 / 89%)", '&:hover': { color: "rgb(84, 198, 104)", backgroundColor: "rgb(162 241 176 / 89%)" } }}
                    >
                        <FilterAltIcon />
                    </IconButton>
                    {selectedFilter && (
                        <Typography sx={{ marginLeft: 1, color: "black" }}>
                            {selectedFilter}
                        </Typography>
                    )}
                    <Menu
                        anchorEl={anchorEl} // Menu opens anchored to the icon button
                        open={Boolean(anchorEl)} // If anchorEl has a value, the menu is open
                        onClose={handleCloseBtn} // Close the menu when clicking outside
                    >
                        <MenuItem onClick={() => handleFilterSelect("OnboardingForm")}>
                            OnboardingForm
                        </MenuItem>
                        <MenuItem onClick={() => handleFilterSelect("Farvision")}>
                            Farvision
                        </MenuItem>
                        <MenuItem onClick={() => handleFilterSelect("All")}>
                            All
                        </MenuItem>
                    </Menu>
                </Box> */}


                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
                    count={getFilteredLaboursForTab().length}
                    //  count={filteredLabours.length > 0 ? filteredLabours.length : labours.length}
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
                                <TableCell>Sr No</TableCell>
                                {tabValue !== 3 && <TableCell>Labour ID</TableCell>}
                                <TableCell>Name of Labour</TableCell>
                                <TableCell>Status</TableCell>
                                {((user.userType === 'admin') || (tabValue !== 6 && user.userType === 'user')) && <TableCell>Action</TableCell>}
                                <TableCell>Action</TableCell>
                                <TableCell>Details</TableCell>
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
                                        if (tabValue === 0) return labour.status === 'Approved';
                                        if (tabValue === 1) return labour.status === 'Approved' && labour.labourOwnership === 'VJ';
                                        if (tabValue === 2) return labour.status === 'Approved' && labour.labourOwnership === 'CONTRACTOR';
                                        if (tabValue === 3) return labour.status === 'Rejected' || labour.status === 'Resubmitted' || labour.status === 'Disable';
                                        return true; // fallback if no condition matches
                                    })
                                    .sort((a, b) => b.labourID - a.labourID) // Sort in descending order by id
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : (filteredIconLabours.length > 0 ? filteredIconLabours : [...labours])
                                    .filter(labour => {
                                        if (tabValue === 0) return labour.status === 'Approved';
                                        if (tabValue === 1) return labour.status === 'Approved' && labour.labourOwnership === 'VJ';
                                        if (tabValue === 2) return labour.status === 'Approved' && labour.labourOwnership === 'CONTRACTOR';
                                        if (tabValue === 3) return labour.status === 'Rejected' || labour.status === 'Resubmitted' || labour.status === 'Disable';
                                        return true; // fallback if no condition matches
                                    })
                                    .sort((a, b) => b.labourID - a.labourID)
                            ).map((labour, index) => (
                                <TableRow key={labour.id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    {tabValue !== 3 && <TableCell>{labour.LabourID}</TableCell>}
                                    <TableCell>{labour.name}</TableCell>
                                    <TableCell>{labour.status}</TableCell>
                                    <TableCell sx={{ position: 'relative' }}>
                                        <Box

                                        >
                                            {/* {labour.status} */}

                                            {/* Display the indicator based on conditions */}
                                            {labour.status === 'Approved' && labour.LabourID && (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: 'rgb(229, 255, 225)',
                                                        color: 'rgb(43, 217, 144)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgb(229, 255, 225)',
                                                        },
                                                    }}
                                                    onClick={() => handleEditPeople(labour)}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{ cursor: 'pointer' }} />
                                    </TableCell>

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
        </Box>

    );
};

export default PeopleReport;