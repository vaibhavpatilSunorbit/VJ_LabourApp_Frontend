
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
    MenuItem, Modal, Typography, IconButton
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

    const fetchLabours = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/labours`);
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



    const handleSiteChange = (labour, siteId) => {
        setSelectedLabour(labour);
        setNewSite(siteId);
        setOpenDialogSite(true); // Open the confirmation dialog
    };

    // const confirmTransfer = async () => {
    //     setOpenDialogSite(false); // Close the dialog

    //     try {
    //         console.log(`Changing site for labour ID: ${selectedLabour.LabourID} to site ID: ${newSite}`);
    //         setSelectedSite((prev) => ({ ...prev, [selectedLabour.LabourID]: newSite }));

    //         // Fetch SerialNumber from selected site ID
    //         const siteResponse = await axios.get(`${API_BASE_URL}/projectDeviceStatus/${newSite}`);
    //         console.log('Fetched site details:', siteResponse.data);
    //         // Check if SerialNumber exists in the response
    //         const SerialNumber = siteResponse.data.serialNumber || 'Unknown'; // Access the correct key
    //         console.log(`Using SerialNumber: ${SerialNumber}`);


    //         const soapEnvelope = `
    //         <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    //           <soap:Body>
    //             <AddEmployee xmlns="http://tempuri.org/">
    //               <APIKey>11</APIKey>
    //               <EmployeeCode>${selectedLabour.LabourID}</EmployeeCode>
    //               <EmployeeName>${selectedLabour.name}</EmployeeName>
    //               <CardNumber>${selectedLabour.id}</CardNumber>
    //               <SerialNumber>${SerialNumber}</SerialNumber>
    //               <UserName>test</UserName>
    //               <UserPassword>Test@123</UserPassword>
    //               <CommandId>25</CommandId>
    //             </AddEmployee>
    //           </soap:Body>
    //         </soap:Envelope>`;

    //         const soapResponse = await axios.post(
    //             `${API_BASE_URL}/labours/essl/addEmployee`,
    //             soapEnvelope,
    //             { headers: { 'Content-Type': 'text/xml' } }
    //         );

    //         if (soapResponse.status === 200) {
    //             const commandId = soapResponse.data.CommandId;

    //             await axios.post(`${API_BASE_URL}/api/transfer`, {
    //                 userId: selectedLabour.id,
    //                 LabourID: selectedLabour.LabourID,
    //                 name: selectedLabour.name,
    //                 currentSite: selectedLabour.projectName,
    //                 currentSiteName: projectNames.find((p) => p.id === selectedLabour.projectName)?.Business_Unit, // Send Business_Unit name
    //                 transferSite: newSite,
    //                 transferSiteName: projectNames.find((p) => p.id === newSite)?.Business_Unit, // Send new Business_Unit name
    //                 esslStatus: 'Transferred',
    //                 esslCommandId: commandId,
    //                 esslPayload: soapEnvelope,
    //                 esslApiResponse: JSON.stringify(soapResponse.data),
    //             });

    //             setLabours((prevLabours) =>
    //                 prevLabours.map((labour) =>
    //                     labour.LabourID === selectedLabour.LabourID
    //                         ? { ...labour, projectName: projectNames.find((p) => p.id === newSite).Business_Unit }
    //                         : labour
    //                 )
    //             );
    //             toast.success(`Labour ${selectedLabour.name} Transferred Site Successfully.`);
    //         }
    //     } catch (error) {
    //         console.error('Error during site transfer:', error);
    //     }
    // };



    ///////////////////////////  Fetch Transfer labour from db Table  //////////////////////////////////////


    
    // const confirmTransfer = async () => {
    //     setOpenDialogSite(false); // Close the dialog

    //     try {
    //       console.log(`Changing site for labour ID: ${selectedLabour.LabourID} to site ID: ${newSite}`);
      
    //       // Fetch SerialNumber for current and new site
    //       const currentSiteResponse = await axios.get(`${API_BASE_URL}/projectDeviceStatus/${selectedLabour.projectName}`);
    //       const currentSerialNumber = currentSiteResponse.data?.serialNumber || "Unknown";
      
    //       const newSiteResponse = await axios.get(`${API_BASE_URL}/projectDeviceStatus/${newSite}`);
    //       const newSerialNumber = newSiteResponse.data?.serialNumber || "Unknown";
      
    //       console.log(`Current SerialNumber: ${currentSerialNumber}, New SerialNumber: ${newSerialNumber}`);
      
    //       // 1. Delete User from Current Site
    //       const deleteUserEnvelope = `
    //         <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    //           <soap:Body>
    //             <DeleteUser xmlns="http://tempuri.org/">
    //               <APIKey>11</APIKey>
    //               <EmployeeCode>${selectedLabour.LabourID}</EmployeeCode>
    //               <SerialNumber>${currentSerialNumber}</SerialNumber>
    //               <UserName>test</UserName>
    //               <UserPassword>Test@123</UserPassword>
    //               <CommandId>25</CommandId>
    //             </DeleteUser>
    //           </soap:Body>
    //         </soap:Envelope>`;
      
    //       console.log(`Sending DeleteUser request for LabourID: ${selectedLabour.LabourID}`);
    //       const deleteResponse = await axios.post(
    //         "https://essl.vjerp.com:8530/iclock/WebAPIService.asmx?op=DeleteUser",
    //         deleteUserEnvelope,
    //         {
    //           headers: {
    //             "Content-Type": "text/xml; charset=utf-8",
    //             SOAPAction: "http://tempuri.org/DeleteUser",
    //           },
    //         }
    //       );
      
    //       const deleteResponseParsed = parse(deleteResponse.data);
    //       const deleteStatus =
    //         deleteResponseParsed["soap:Envelope"]["soap:Body"]["DeleteUserResponse"]["DeleteUserResult"] === "success"
    //           ? "success"
    //           : "failure";
      
    //       console.log(`DeleteUser response for LabourID: ${selectedLabour.LabourID}`, deleteResponseParsed);
      
    //       if (deleteStatus !== "success") {
    //         toast.error(`Failed to delete user from current site: ${selectedLabour.projectName}`);
    //         return;
    //       }
      
    //       // 2. Add User to New Site
    //       const addUserEnvelope = `
    //         <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    //           <soap:Body>
    //             <AddEmployee xmlns="http://tempuri.org/">
    //               <APIKey>11</APIKey>
    //               <EmployeeCode>${selectedLabour.LabourID}</EmployeeCode>
    //               <EmployeeName>${selectedLabour.name}</EmployeeName>
    //               <CardNumber>${selectedLabour.id}</CardNumber>
    //               <SerialNumber>${newSerialNumber}</SerialNumber>
    //               <UserName>test</UserName>
    //               <UserPassword>Test@123</UserPassword>
    //               <CommandId>25</CommandId>
    //             </AddEmployee>
    //           </soap:Body>
    //         </soap:Envelope>`;
      
    //       console.log(`Sending AddEmployee request for LabourID: ${selectedLabour.LabourID}`);
    //       const addResponse = await axios.post(
    //         "https://essl.vjerp.com:8530/iclock/WebAPIService.asmx?op=AddEmployee",
    //         addUserEnvelope,
    //         {
    //           headers: {
    //             "Content-Type": "text/xml; charset=utf-8",
    //             SOAPAction: "http://tempuri.org/AddEmployee",
    //           },
    //         }
    //       );
      
    //       const addResponseParsed = parse(addResponse.data);
    //       const addStatus =
    //         addResponseParsed["soap:Envelope"]["soap:Body"]["AddEmployeeResponse"]["AddEmployeeResult"] === "success"
    //           ? "success"
    //           : "failure";
      
    //       console.log(`AddEmployee response for LabourID: ${selectedLabour.LabourID}`, addResponseParsed);
      
    //       if (addStatus !== "success") {
    //         toast.error(`Failed to add user to new site: ${newSite}`);
    //         return;
    //       }
      
    //       // 3. Save Transfer Record in Backend
    //       const transferDataPayload = {
    //         userId: selectedLabour.id,
    //         LabourID: selectedLabour.LabourID,
    //         name: selectedLabour.name,
    //         currentSite: selectedLabour.projectName,
    //         currentSiteName: projectNames.find((p) => p.id === selectedLabour.projectName)?.Business_Unit,
    //         transferSite: newSite,
    //         transferSiteName: projectNames.find((p) => p.id === newSite)?.Business_Unit,
    //         esslStatus: "Transferred",
    //         esslCommandId: 25,
    //         esslPayload: addUserEnvelope,
    //         esslApiResponse: JSON.stringify(addResponseParsed),
    //         deleteEsslPayload: deleteUserEnvelope,
    //         deleteEsslResponse: JSON.stringify(deleteResponseParsed),
    //       };
      
    //       await axios.post(`${API_BASE_URL}/api/transfer`, transferDataPayload);
      
    //       // Update UI
    //       setLabours((prevLabours) =>
    //         prevLabours.map((labour) =>
    //           labour.LabourID === selectedLabour.LabourID
    //             ? { ...labour, projectName: projectNames.find((p) => p.id === newSite).Business_Unit }
    //             : labour
    //         )
    //       );
      
    //       toast.success(`Labour ${selectedLabour.name} transferred successfully!`);
    //     } catch (error) {
    //       console.error("Error during site transfer:", error);
    //       toast.error("Failed to transfer labour.");
    //     }
    //   };


    const confirmTransfer = async () => {
        setOpenDialogSite(false); // Close the dialog
      
        try {
          console.log(`Changing site for labour ID: ${selectedLabour.LabourID} to site ID: ${newSite}`);
      
          // Fetch current and new site names for transfer
          const currentSiteName = projectNames.find((p) => p.id === selectedLabour.projectName)?.Business_Unit || "Unknown";
          const transferSiteName = projectNames.find((p) => p.id === newSite)?.Business_Unit || "Unknown";
      
          console.log(`Current Site Name: ${currentSiteName}, Transfer Site Name: ${transferSiteName}`);
      
          // Send data to the backend to handle DeleteUser, AddEmployee, and save transfer data
          const transferDataPayload = {
            userId: selectedLabour.id,
            LabourID: selectedLabour.LabourID,
            name: selectedLabour.name,
            currentSite: selectedLabour.projectName,
            transferSite: newSite,
            currentSiteName,
            transferSiteName,
          };
      
          const response = await axios.post(`${API_BASE_URL}/api/transfer`, transferDataPayload);
      
          if (response.status === 201) {
            // Update UI
            setLabours((prevLabours) =>
              prevLabours.map((labour) =>
                labour.LabourID === selectedLabour.LabourID
                  ? { ...labour, projectName: newSite, Business_Unit: transferSiteName }
                  : labour
              )
            );
      
            toast.success(`Labour ${selectedLabour.name} transferred successfully!`);
          } else {
            toast.error(`Failed to transfer labour. ${response.data.message || "Unexpected error occurred."}`);
          }
        } catch (error) {
          console.error("Error during site transfer:", error);
          toast.error("Failed to transfer labour.");
        }
      };


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
                overflowY: 'auto',
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
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table stickyHeader sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow>
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
                                        {labour.CreatedAt ? new Date(labour.CreatedAt).toLocaleDateString('en-GB') : '-'}
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
                                            onClick={() => handleEdit(labour)}
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
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" gutterBottom>
                        Transfer Labour
                    </Typography>
                    <Typography id="modal-description" gutterBottom>
                        Selected Labour: {selectedLabour?.name}
                    </Typography>
                    <Select
                        fullWidth
                        value={newSite}
                        onChange={(e) => setNewSite(e.target.value)}
                        displayEmpty
                        sx={{ mb: 2 }}
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
                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={() => setModalOpen(false)}
                            sx={{ width: '45%' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={confirmTransfer}
                            sx={{ width: '45%' }}
                        >
                            Transfer
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
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Modal>

        </Box>
    );
};

export default SiteTransfer;



























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CloseIcon from "@mui/icons-material/Close";
// import { API_BASE_URL } from "../../Data";
// import { useUser } from "../../UserContext/UserContext";

// const SiteTransfer = () => {
//   const [labours, setLabours] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedHistory, setSelectedHistory] = useState([]);
//   const { user } = useUser();

//   // Fetch labours
//   const fetchLabours = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/labours/getWagesAndLabourOnboardingJoin`
//       );
//       setLabours(response.data);
//     } catch (error) {
//       console.error("Error fetching labours:", error);
//       toast.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLabours();
//   }, []);

//   // View history handler
//   const handleViewHistory = (labourID) => {
//     if (!labourID) return;
//     const history = labours.filter((labour) => labour.LabourID === labourID);
//     setSelectedHistory(history);
//     setModalOpen(true);
//   };
//   // DataGrid Columns
//   const columns = [
//     { field: "id", headerName: "Sr No", width: 90 },
//     { field: "LabourID", headerName: "Labour ID", width: 150 },
//     { field: "name", headerName: "Name", width: 150 },
//     { field: "businessUnit", headerName: "Business Unit", width: 150 },
//     { field: "departmentName", headerName: "Department", width: 150 },
//     {
//       field: "From_Date",
//       headerName: "From Date",
//       width: 150,
//       valueGetter: (params) => {
//         if (!params?.row) return "-"; // Check if params or params.row is null
//         return params.row.From_Date
//           ? new Date(params.row.From_Date).toLocaleDateString()
//           : "-";
//       },
//     },
//     { field: "PayStructure", headerName: "Pay Structure", width: 150 },
//     { field: "DailyWages", headerName: "Daily Wages", width: 150 },
//     { field: "FixedMonthlyWages", headerName: "Fixed Monthly Wages", width: 150 },
//     { field: "WeeklyOff", headerName: "Weekly Off", width: 150 },
//     { field: "WagesEditedBy", headerName: "Wages Edited By", width: 150 },
//     {
//       field: "CreatedAt",
//       headerName: "Created At",
//       width: 150,
//       valueGetter: (params) => {
//         if (!params?.row) return "-"; // Check if params or params.row is null
//         return params.row.From_Date
//           ? new Date(params.row.From_Date).toLocaleDateString()
//           : "-";
//       },
//     },
//     {
//       field: "Action",
//       headerName: "Action",
//       width: 150,
//       renderCell: (params) => {
//         if (!params?.row) return "-"; // Check if params or params.row is null
//         return (
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: "rgb(239,230,247)",
//               color: "rgb(130,54,188)",
//               "&:hover": {
//                 backgroundColor: "rgb(239,230,247)",
//               },
//             }}
//             onClick={() => handleViewHistory(params.row.LabourID)}
//           >
//             View History
//           </Button>
//         );
//       },
//     },
//   ];
  

//   const rows = labours.map((labour, index) => ({
//     id: index + 1,
//     LabourID: labour?.LabourID || "N/A",
//     name: labour?.name || "N/A",
//     businessUnit: labour?.businessUnit || "N/A",
//     departmentName: labour?.departmentName || "N/A",
//     From_Date: labour?.From_Date || null,
//     PayStructure: labour?.PayStructure || "N/A",
//     DailyWages: labour?.DailyWages || 0,
//     FixedMonthlyWages: labour?.FixedMonthlyWages || 0,
//     WeeklyOff: labour?.WeeklyOff || "N/A",
//     WagesEditedBy: labour?.WagesEditedBy || "N/A",
//     CreatedAt: labour?.CreatedAt || null,
//   }));
  
  
  
  

//   return (
//     <Box mb={1} py={2} px={2}>
//       <ToastContainer />
//       <Box sx={{ height: "88vh", width: "82vw" }}>
//       <DataGrid
//   rows={rows}
//   columns={columns}
//   pageSize={10}
//   rowsPerPageOptions={[10, 25, 50]}
//   loading={loading}
// />

//       </Box>

//       {/* Modal */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "80%",
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//             maxHeight: "80vh",
//             overflowY: "auto",
//           }}
//         >
//           <IconButton
//             onClick={() => setModalOpen(false)}
//             sx={{
//               position: "absolute",
//               top: 8,
//               right: 8,
//               color: "gray",
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Typography variant="h6" mb={3}>
//             Wages History for Labour ID:{" "}
//             {selectedHistory[0]?.LabourID || "N/A"}
//           </Typography>
//           {selectedHistory.map((record, index) => (
//             <Typography key={index} mb={2}>
//               {new Date(record.CreatedAt).toLocaleString()} - Edited By:{" "}
//               {record.WagesEditedBy || "N/A"}
//             </Typography>
//           ))}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default SiteTransfer;
