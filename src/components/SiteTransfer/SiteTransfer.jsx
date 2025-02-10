
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
import SearchBar from '../SarchBar/SearchWages';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext';
import ExportWagesReport from '../WagesReport/ImportExportWages/ExportWages'
import ImportWagesReport from '../WagesReport/ImportExportWages/ImportWages'
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import { parse } from "fast-xml-parser";

const SiteTransfer = ({ departments, projectNames = [], labour }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [filteredIconLabours, setFilteredIconLabours] = useState([]);
    const [labours, setLabours] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dailyWages, setDailyWages] = useState({});
    const [perDayWages, setPerDayWages] = useState({});
    const [monthlyWages, setMonthlyWages] = useState({});
    const [yearlyWages, setYearlyWages] = useState({});
    const [overtime, setOvertime] = useState({});
    const [tabValue, setTabValue] = useState(0);
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
    const [newSite, setNewSite] = useState(null);
    const [openDialogSite, setOpenDialogSite] = useState(false);
    const [selectedSite, setSelectedSite] = useState({});
    const [statusesSite, setStatusesSite] = useState({});
    const [previousTabValue, setPreviousTabValue] = useState(tabValue);
    const [transferDate, setTransferDate] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPayStructure, setSelectedPayStructure] = useState('');
    const [employeeToggle, setEmployeeToggle] = useState('all'); // 'all' or 'single'
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedLabourIds, setSelectedLabourIds] = useState([]);

    const getProjectDescription = (projectId) => {
        if (!Array.isArray(projectNames) || projectNames.length === 0) {
            console.error('Projects array is empty or invalid:', projectNames);
            return 'Unknown';
        }
        if (projectId === undefined || projectId === null) {
            console.error('Project ID is undefined or null:', projectId);
            return 'Unknown';
        }
        const project = projectNames.find(
            (proj) => proj.id === Number(projectId)
        );
        return project ? project.Business_Unit : 'Unknown';
    };

    // Helper function to get the Department description
    const getDepartmentDescription = (departmentId) => {
        if (!Array.isArray(departments) || departments.length === 0) {
            return 'Unknown';
        }
        const department = departments.find(
            (dept) => dept.Id === Number(departmentId)
        );
        return department ? department.Description : 'Unknown';
    };


    const fetchLabours = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/getAllLabours`,
                {
                    params: filters, // e.g., { ProjectID: selectedBusinessUnit, DepartmentID: selectedDepartment }
                }
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
        fetchLabours(filters);
        setFilterModalOpen(false);
    };

    const handleSubmit = async () => {
        const formData = paginatedLabours.map(labour => ({
            labourId: labour.LabourID,
            payStructure: payStructure[labour.LabourID],
            dailyWages: dailyWages[labour.LabourID],
            perDayWages: perDayWages[labour.LabourID],
            monthlyWages: monthlyWages[labour.LabourID],
            yearlyWages: yearlyWages[labour.LabourID],
            overtime: overtime[labour.LabourID],
            totalOvertimeWages: totalOvertimeWages[labour.LabourID],
            weakelyOff: weakelyOff[labour.LabourID],
        }));

        try {
            await axios.post(`${API_BASE_URL}/labours/submitWages`, formData);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data.");
        }
    };

    const handleCancel = () => {
        setModalOpen(false); // Close the modal without saving
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

    const handleTransfer = async () => {
        if (!newSite) {
            toast.error('Please select a new site.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/transfer`, {
                labourId: selectedLabour.id,
                newSite,
            });
            toast.success('Labour transferred successfully!');
            setModalOpen(false);
            fetchLabours();
        } catch (error) {
            console.error('Error transferring labour:', error);
            toast.error('Failed to transfer labour.');
        } finally {
            setLoading(false);
        }
    };

    // Checkbox handling: select/deselect individual row
    const handleSelectRow = (event, labourID) => {
        if (event.target.checked) {
          setSelectedLabourIds((prev) => [...prev, labourID]);
        } else {
          setSelectedLabourIds((prev) => prev.filter((id) => id !== labourID));
        }
      };
    
      const handleSelectAllRows = (event) => {
        if (event.target.checked) {
          // Select all on current paginated page
          const allPageIds = paginatedLabours.map((labour) => labour.LabourID);
          // Merge them without duplication
          setSelectedLabourIds((prev) => Array.from(new Set([...prev, ...allPageIds])));
        } else {
          // Unselect all on current paginated page
          setSelectedLabourIds((prev) =>
            prev.filter((id) => !paginatedLabours.some((labour) => labour.LabourID === id))
          );
        }
      };

    // Handle modal edit
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
        } else if (type === 'error') {
            toast.error(message);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            fetchLabours();
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours/searchLaboursFromWages?q=${searchQuery}`);
            setLabours(response.data);
        } catch (error) {
            console.error('Error searching:', error);
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (e, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = parseInt(e.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to the first page
    };
    const handleSelectLabour = (selectedLabour) => {
        setSelectedLabour(selectedLabour);
    };

    // Data to display on the current page
    // const paginatedLabours = labours.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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

    const handleViewHistory = (labourID) => {
        const history = labours.filter((labour) => labour.LabourID === labourID);
        setSelectedHistory(history);
        setOpenModal(true);
    };

    const filteredLabours = getLatestLabourData(labours).filter(
        (labour) => labour.status === 'Approved'
    );
    const paginatedLabours = filteredLabours.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );
    console.log("Filtered Labours _+_+_+:", filteredLabours);
    console.log("Paginated Labours:{{{{{", paginatedLabours);
    const isAllSelected =
    paginatedLabours.length > 0 &&
    paginatedLabours.every((labour) => selectedLabourIds.includes(labour.LabourID));

    const handleSiteChange = (labour, siteId) => {
        setSelectedLabour(labour);
        setNewSite(siteId);
        setOpenDialogSite(true); // Open the confirmation dialog
    };


    const openTransferModal = (labour) => {
        setSelectedLabour(labour);
        setModalOpen(true);
    };
    const handleOpenModal = () => {
        if (selectedLabourIds.length === 0) {
          toast.error("No labours selected!");
          return;
        }
        setModalOpen(true);
      };

    // Handle transfer within the modal
    const handleModalTransfer = () => {
        if (!newSite) {
            toast.error("Please select a new transfer site.");
            return;
        }
        setModalOpen(false); // Close the modal
        setOpenDialogSite(true); // Open the confirmation dialog
    };

    const confirmTransfer = async () => {
        setOpenDialogSite(false);
        if (!selectedLabourIds || selectedLabourIds.length === 0) {
          toast.error("No labour(s) selected to transfer.");
          return;
        }
    
        try {
          // Build payload for each selected labour
          const selectedLaboursData = labours
            .filter((labour) => selectedLabourIds.includes(labour.LabourID))
            .map((labour) => {
              const currentSiteName =
                projectNames.find((p) => p.id === labour.projectName)?.Business_Unit ||
                "Unknown";
              const transferSiteName =
                projectNames.find((p) => p.id === Number(newSite))
                  ?.Business_Unit || "Unknown";
    
              return {
                userId: labour.id, // if needed
                LabourID: labour.LabourID,
                name: labour.name,
                currentSite: labour.projectName,
                transferSite: newSite,
                currentSiteName,
                transferSiteName,
                transferDate,
                siteTransferBy: user.name || null,
              };
            });
    
          // Send them all in one request (adapt as needed for your API)
          const response = await axios.post(
            `${API_BASE_URL}/api/admin/sitetransfertoadmin`,
            {
              labours: selectedLaboursData,
            }
          );
    
          if (response.status === 201) {
            // Update local state for all selected labours
            const transferSiteName =
              projectNames.find((p) => p.id === Number(newSite))?.Business_Unit ||
              "Unknown";
    
            setLabours((prev) =>
              prev.map((labour) => {
                if (selectedLabourIds.includes(labour.LabourID)) {
                  return {
                    ...labour,
                    projectName: newSite,
                    Business_Unit: transferSiteName,
                  };
                }
                return labour;
              })
            );
    
            toast.success(
              `Site transfer initiated for ${selectedLabourIds.length} labour(s).`
            );
            setSelectedLabourIds([]); // clear the selection
          } else {
            toast.error(
              `Failed to transfer labour(s). ${
                response.data.message || "Unexpected error occurred."
              }`
            );
            setSelectedLabourIds([]);
          }
        } catch (error) {
          console.error("Error during site transfer:", error);
          toast.error("Failed to transfer labour(s).");
        }
      };
      const selectedLabours = labours.filter((l) =>
        selectedLabourIds.includes(l.LabourID)
      );
      const selectedNames = selectedLabours.map((l) => l.LabourID).join(", ");

    // const confirmTransfer = async () => {
    //     setOpenDialogSite(false); // Close the dialog
    //     if (!selectedLabourIds || selectedLabourIds.length === 0) {
    //         toast.error("No labour(s) selected to transfer.");
    //         return;
    //       }

    //     try {
    //         console.log(`Changing site for labour ID: ${selectedLabour.LabourID} to site ID: ${newSite}`);

    //         // Fetch current and new site names for transfer
    //         const currentSiteName = projectNames.find((p) => p.id === selectedLabour.projectName)?.Business_Unit || "Unknown";
    //         const transferSiteName = projectNames.find((p) => p.id === newSite)?.Business_Unit || "Unknown";

    //         console.log(`Current Site Name: ${currentSiteName}, Transfer Site Name: ${transferSiteName}`);
    //         const onboardName = user.name || null;
    //         // Send data to the backend to handle DeleteUser, AddEmployee, and save transfer data
    //         const transferDataPayload = {
    //             userId: selectedLabour.id,
    //             LabourID: selectedLabour.LabourID,
    //             name: selectedLabour.name,
    //             currentSite: selectedLabour.projectName,
    //             transferSite: newSite,
    //             currentSiteName,
    //             transferSiteName,
    //             transferDate: transferDate,
    //             siteTransferBy: onboardName,
    //         };

    //         const response = await axios.post(`${API_BASE_URL}/api/admin/sitetransfertoadmin`, transferDataPayload);

    //         if (response.status === 200) {
    //             // Update UI
    //             setLabours((prevLabours) =>
    //                 prevLabours.map((labour) =>
    //                     labour.LabourID === selectedLabour.LabourID
    //                         ? { ...labour, projectName: newSite, Business_Unit: transferSiteName }
    //                         : labour
    //                 )
    //             );

    //             toast.success(`Labour ${selectedLabour.name} Site Transfer Send Admin Approval successfully!`);
    //         } else {
    //             toast.error(`Failed to transfer labour. ${response.data.message || "Unexpected error occurred."}`);
    //         }
    //     } catch (error) {
    //         console.error("Error during site transfer:", error);
    //         toast.error("Failed to transfer labour.");
    //     }
    // };


    const fetchTransferSiteNames = async (labourIds) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/allTransferSite`, { labourIds });
            console.log('API Response:', response.data); // Debug response
            return response.data.map((item) => ({
                LabourID: item.LabourID,
                transferSiteName: item.transferSiteName,
                currentSiteName: item.currentSiteName,
                createdAt: item.createdAt,
            }));
        } catch (error) {
            console.error('Error fetching transfer site names:', error);
            return [];
        }
    };


    // Fetch and map transfer site names
    useEffect(() => {
        const fetchStatuses = async () => {
            setLoading(true);

            const labourIds = labours.map((labour) => labour.LabourID);
            if (labourIds.length > 0) {
                const statusesData = await fetchTransferSiteNames(labourIds);
                const mappedStatuses = statusesData.reduce((acc, status) => {
                    acc[status.LabourID] = {
                        transferSiteName: status.transferSiteName || '-',
                        currentSiteName: status.currentSiteName || '-',
                        createdAt: status.createdAt || '-',
                    };
                    return acc;
                }, {});
                setStatusesSite(mappedStatuses);
                console.log('Mapped Statuses with Dates:', mappedStatuses); // Debug statuses
            }

            setLoading(false);
        };

        if (labours.length > 0) fetchStatuses();
    }, [labours]);

    const today = new Date().toISOString().split('T')[0];

    return (
        <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', overflowY: 'auto' }}>
            <ToastContainer />
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
                <ExportWagesReport />
                <ImportWagesReport handleToast={handleToast} onboardName={user.name || null} />
                <Button variant="outlined" color="secondary" startIcon={<FilterListIcon />} onClick={() => setFilterModalOpen(true)}>
                    Filter
                </Button>
                {selectedLabourIds.length > 0 && (
                    <Button variant="outlined" color="secondary" startIcon={<EditIcon />}  onClick={handleOpenModal}>
                        Edit ({selectedLabourIds.length})
                    </Button>
                )}


                <TablePagination
                    className="custom-pagination"
                    rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
                    count={labours.length}
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
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onChange={handleSelectAllRows}
                                        inputProps={{ 'aria-label': 'select all labours' }}
                                    /></TableCell>
                                <TableCell>Sr No</TableCell>
                                <TableCell>Labour ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Project</TableCell>
                                <TableCell>Previous Site</TableCell>
                                <TableCell>New Site</TableCell>
                                <TableCell>Transfer Date</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Site History</TableCell>
                                <TableCell>Action</TableCell>
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
                                ? paginatedLabours // Use the paginatedLabours directly for pagination
                                : filteredLabours // Fallback to filteredLabours if no pagination is applied
                            ).map((labour, index) => (
                                <TableRow key={labour.LabourID}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedLabourIds.includes(labour.LabourID)}
                                            onChange={(e) => handleSelectRow(e, labour.LabourID)}
                                            inputProps={{ 'aria-label': `select labour ${labour.LabourID}` }}
                                        />
                                    </TableCell>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{labour.LabourID}</TableCell>
                                    <TableCell>{labour.name || '-'}</TableCell>
                                    <TableCell>{getProjectDescription(labour.projectName)}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            return statusesSite[labour.LabourID]?.currentSiteName || '-';
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {(() => {
                                            return statusesSite[labour.LabourID]?.transferSiteName || '-';
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {statusesSite[labour.LabourID]?.createdAt
                                            ? new Date(statusesSite[labour.LabourID].createdAt).toLocaleDateString('en-GB')
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {statusesSite[labour.LabourID]?.createdAt
                                            ? new Date(statusesSite[labour.LabourID].createdAt).toLocaleDateString('en-GB')
                                            : '-'}
                                    </TableCell>

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
                                                '&:hover': {
                                                    backgroundColor: 'rgb(239,230,247)',
                                                },
                                            }}
                                            // onClick={() => handleEdit(labour)}
                                            onClick={() => {
                                                // If single-labour edit is also wanted:
                                                if (!selectedLabourIds.includes(labour.LabourID)) {
                                                  setSelectedLabourIds((prev) => [
                                                    ...prev,
                                                    labour.LabourID,
                                                  ]);
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

            {/* Modal for Site Transfer */}
            <Modal
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
                        Transfer Labour
                    </Typography>
                    {selectedLabourIds.length > 1 ? (
            <Typography id="modal-description" gutterBottom>
              Selected Labours: {selectedNames}
            </Typography>
          ) : selectedLabourIds.length === 1 ? (
            <Typography id="modal-description" gutterBottom>
              Selected Labour: {selectedNames}
            </Typography>
          ) : (
            <Typography>No labour selected</Typography>
          )}
                    <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
                        <InputLabel id="new-site-select-label">Select New Site</InputLabel>
                        <Select
                            labelId="new-site-select-label"
                            value={newSite}
                            onChange={(e) => setNewSite(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select New Site
                            </MenuItem>
                            {Array.isArray(projectNames) && projectNames.length > 0 ? (
                                projectNames.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.Business_Unit}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="Unknown" disabled>
                                    No Projects Available
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="date"
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                        label="Transfer Date"
                        InputLabelProps={{ shrink: true }}
                        // variant="standard"  
                        inputProps={{
                            min: today
                        }}
                        sx={{ mb: 2 }}
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
                            onClick={handleModalTransfer}
                            sx={{ width: "45%" }}
                        >
                            Transfer
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Dialog for Confirmation */}
            <Dialog open={openDialogSite} onClose={() => setOpenDialogSite(false)}>
        <DialogTitle>Confirm Transfer</DialogTitle>
        <DialogContent>
          {selectedLabourIds.length > 1 ? (
            <DialogContentText>
              Are you sure you want to transfer these&nbsp;
              <b>{selectedLabourIds.length}</b> labours to the new site?
              <br />
              <small>({selectedNames})</small>
            </DialogContentText>
          ) : selectedLabourIds.length === 1 ? (
            <DialogContentText>
              Are you sure you want to transfer Labour&nbsp;
              <b>{selectedNames}</b> to the new site?
            </DialogContentText>
          ) : (
            <DialogContentText>No labour selected</DialogContentText>
          )}
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
              width: "130px",
              marginRight: "10px",
              marginBottom: "3px",
              "&:hover": {
                backgroundColor: "rgb(229, 255, 225)",
              },
            }}
            autoFocus
          >
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>
            {/* ------------------------------------------------------------------------------------------- */}
            {/* ===== FILTER MODAL ===== */}
            <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Modal Header with Title and Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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

          {/* Business Unit Filter */}
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
                  <MenuItem key={project.id} value={project.id}>
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

          {/* Department Filter */}
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

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleResetFilter}>
              Reset
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgb(229, 255, 225)",
                color: "rgb(43, 217, 144)",
                "&:hover": {
                  backgroundColor: "rgb(229, 255, 225)",
                },
              }}
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>
            {/* ------------------------------------------------------------------------------------------- */}

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
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Modal>

        </Box>
    );
};

export default SiteTransfer;


