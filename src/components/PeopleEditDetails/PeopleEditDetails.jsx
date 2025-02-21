import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Divider,
    CircularProgress,
    Avatar,
    Grid, Modal,
    Backdrop,
    Fade, Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,IconButton, Select,MenuItem
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns"
import CloseIcon from '@mui/icons-material/Close'
import ViewPaySlip from '../Payslip/ViewPaySlip'

const PeopleEditDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [labours, setLabours] = useState([]);
    const [labourDetails, setLabourDetails] = useState(null);
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 0).toString();
    const [selectedLabourId, setSelectedLabourId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [open, setOpen] = useState(false);
    const [onClosed, setonClosed] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const location = useLocation();
    const labourId = location.state?.labourId;
    // const [openModal, setOpenModal] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
    const [showDocuments, setShowDocuments] = useState(false);
    const [modalOpenNetpay, setModalOpenNetpay] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState("");
    const [showMonthYearModal, setShowMonthYearModal] = useState(false);

    const statusColors = {
        P: '#4CAF50',
        A: '#FF6F00',
        H: '#8236BC',
        HD: '#F44336',
        MP: '#005cff',
        NA: '#E0E0E0',
    };

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];


    useEffect(() => {
        if (!labourId) {
            setError("Labour ID is missing.");
            setLoading(false);
            return;
        }

        const fetchLabourDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/labours/${labourId}`);
                setLabourDetails(response.data);
                setSelectedLabourId(response.data.LabourID);
                console.log('response.data attendance', response.data.LabourID)
                setLoading(false);
            } catch (error) {
                console.error("Error fetching labour details:", error);
                setError("Error fetching labour details.");
                setLoading(false);
            }
        };

        fetchLabourDetails();
    }, [labourId]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const handleEdit = (section) => {
        navigate(`${labourId}/edit?section=${section}`);
    };

    const handleAction = () => {
        console.log('run this code')
    };



    const handleOpenModal = (url) => {
      setModalImageSrc(url);
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
      setModalImageSrc('');
    };
  
    const formData = {
        "Upload Induction Document": labourDetails.uploadInductionDoc ? (
          <Button color="primary" onClick={() => handleOpenModal(labourDetails.uploadInductionDoc)}>View Induction Photo</Button>
        ) : "N/A",
        "Upload AadhaarFront Document": labourDetails.uploadAadhaarFront ? (
          <Button color="primary" onClick={() => handleOpenModal(labourDetails.uploadAadhaarFront)}>View Aadhaar Photo</Button>
        ) : "N/A",
        "Upload IdProof Document": labourDetails.uploadIdProof ? (
          <Button color="primary" onClick={() => handleOpenModal(labourDetails.uploadIdProof)}>View Id Proof Photo</Button>
        ) : "N/A",
        "Upload AadhaarBack Document": labourDetails.uploadAadhaarBack ? (
          <Button color="primary" onClick={() => handleOpenModal(labourDetails.uploadAadhaarBack)}>View Aadhaar Photo</Button>
        ) : "N/A",
    };


    // Modal component for generating documents

    const dialogContent = (
        <DialogContent>
            <DialogContentText>
                Are you sure you want to download the documents for this labour.
            </DialogContentText>
        </DialogContent>
    );

    // Handle dialog close
    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    // Handle document generation on confirm
    const handleGenerateDocuments = () => {
        downloadAadhaarCard();
        setIsDialogOpen(false);  // Close dialog after document generation
    };

    if (loading) return <CircularProgress />;


    const downloadAadhaarCard = async () => {
        try {
            const baseUrl = "";  // Ensure this base URL is correctly set
            const { uploadAadhaarFront, uploadAadhaarBack, uploadIdProof, uploadInductionDoc } = labourDetails;

            // Check for missing Aadhaar URLs and log them
            if (!uploadAadhaarFront && !uploadIdProof && !uploadAadhaarBack && !uploadInductionDoc) {
                console.error("All document URLs are missing.");
                toast.error("No documents are available for download.");
                return;
            }

            // Define an async function to handle downloading of a single file
            const downloadFile = async (fileUrl, fileName) => {
                try {
                    const response = await axios.get(`${baseUrl}${fileUrl}`, { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error(`Error downloading ${fileName}:`, error);
                    toast.error(`Error downloading ${fileName}.`);
                }
            };

            // Check and download each document if it exists
            if (uploadAadhaarFront) {
                await downloadFile(uploadAadhaarFront, `Labour_${labourDetails.id}_Aadhaar_Front.jpg`);
            } else {
                console.warn("Aadhaar Front not uploaded.");
            }

            if (uploadAadhaarBack) {
                await downloadFile(uploadAadhaarBack, `Labour_${labourDetails.id}_Aadhaar_Back.jpg`);
            } else {
                console.warn("Aadhaar Back not uploaded.");
            }

            if (uploadIdProof) {
                await downloadFile(uploadIdProof, `Labour_${labourDetails.id}_ID_Proof.jpg`);
            } else {
                console.warn("ID Proof not uploaded.");
            }

            if (uploadInductionDoc) {
                await downloadFile(uploadInductionDoc, `Labour_${labourDetails.id}_Induction_Doc.jpg`);
            } else {
                console.warn("Induction Document not uploaded.");
            }

            // Provide feedback to the user that download is complete
            toast.success('Uploaded documents have been downloaded successfully.');
        } catch (error) {
            console.error('Error during document download process:', error);
            toast.error('An error occurred while downloading documents. Please try again.');
        }
    };


 


     // Fetch attendance data based on selected labour, month, and year
     const fetchAttendance = async () => {
        // if (!selectedLabourId || !selectedMonth || !selectedYear) return;
    
        setLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/labours/showAttendanceCalenderSingleLabour/${selectedLabourId}`,
            { params: { month: selectedMonth, year: selectedYear } }
          );
    
          const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
          const fullMonthAttendance = Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(selectedYear, selectedMonth - 1, i + 1)
              .toISOString()
              .split("T")[0];
            const record = response.data.find(
              (att) => att.Date.split("T")[0] === date
            );
            return {
              date,
              status: record ? record.Status : "NA",
            };
          });
    
          setAttendanceData(fullMonthAttendance);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching attendance:", error);
          setLoading(false);
        }
      };


    const generateCalendar = (attendanceData, year, month) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    
        const calendar = [];
        let dayCounter = 1;
    
        for (let row = 0; row < 6; row++) {
          const week = [];
          for (let col = 0; col < 7; col++) {
            if (row === 0 && col < firstDayOfWeek) {
              week.push({ day: null, status: null });
            } else if (dayCounter > daysInMonth) {
              week.push({ day: null, status: null });
            } else {
              const currentDay = attendanceData.find(
                (data) => new Date(data.date).getDate() === dayCounter
              );
              week.push({ day: dayCounter, status: currentDay ? currentDay.status : "NA" });
              dayCounter++;
            }
          }
          calendar.push(week);
          if (dayCounter > daysInMonth) break;
        }
        return calendar;
      };

    const calendar = generateCalendar(attendanceData, selectedYear, selectedMonth);
      const handleModalClose = () => setOpen(false);

    const handleModalCloseCalender = () => {
        setOpen(false)
        setAttendanceData([]);
    };

    
    const handleModalOpenCalenderAttendance = (selectedLabourId) => {
        if (selectedLabourId && selectedLabourId) {
          setSelectedLabourId(selectedLabourId);
          setOpen(true);
          fetchAttendance();
        } else {
          console.error("LabourID is null or undefined for the selected labour.");
        }
      };

    //   const [modalOpenNetpay, setModalOpenNetpay] = useState(false);
      const handleModalOpenPayslip = (labourID) => {
        if (labourID) {
          setSelectedLabourId(labourID);
          setShowMonthYearModal(true);
        } else {
          console.error("LabourID is null or undefined for the selected labour.");
        }
      };

      const handleProceedToPayslip = () => {
        setShowMonthYearModal(false); // Close selection modal
        setModalOpenNetpay(true); 
        
    };

      const handleSidebarClick = (label) => {
        switch (label) {
            case "Generate Document":
                setIsDialogOpen(true); // Open the modal when the "Generate Document" button is clicked
                setSelectedComponent("Generate Document Component");
                break;
            case "View Attendance":
                handleModalOpenCalenderAttendance(selectedLabourId);
                setSelectedComponent("View Attendance Component");
                break;
            case "View Payslips":
                handleModalOpenPayslip(labourDetails?.LabourID);
                setSelectedComponent("View Payslips Component");
                break;
            case "View Documents":
                setShowDocuments(true);
                setSelectedComponent("View Documents Component");
                break;
            case "View Journey":
                setSelectedComponent("View Journey Component");
                break;
            case "View Reimbursements":
                setSelectedComponent("View Reimbursements Component");
                break;
            default:
                setSelectedComponent(null);
        }
    };
    const handleClosePaySlip = () => {
        setSelectedLabourId(null);
        setOpen(false)
      };
    const LegendItem = ({ color, text }) => {
        return (
            <Box display="flex" alignItems="center" mx={1} mb={1}>
                <Box
                    sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '4px',
                        backgroundColor: color,
                        marginRight: '8px',
                    }}
                ></Box>
                <Typography variant="body2">{text}</Typography>
            </Box>
        );
    };

    const CalendarBox = ({ day, status, margin = '8px', padding = '4px' }) => (
        <Box
            sx={{
                backgroundColor: statusColors[status] || '#E0E0E0',
                color: status ? '#fff' : '#000',
                margin: '6px',
                padding: padding,
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxSizing: 'border-box',
            }}
        >
            {day || ''}
        </Box>
    );
 

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <ToastContainer />
            <Box
                sx={{
                    flex: 3,
                    overflowY: "auto", // Enable scrolling
                    padding: 3,
                    bgcolor: "#f9f9f9", // Light background
                    borderRight: "1px solid #ddd", // Border for separation
                    height: "84vh", // Full-height scrolling container
                    scrollbarWidth: "none", // Hide scrollbar (Firefox)
                    "&::-webkit-scrollbar": {
                        display: "none", // Hide scrollbar (Chrome, Safari, Edge)
                    },
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: 3,
                    }}
                >
                    People | {labourDetails?.name || "N/A"}
                </Typography>

                {/* Basic Information Section */}

                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: 2,
                        marginBottom: 3,
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#003B73" }}>
                            Basic Information
                        </Typography>
                        <Button
                            onClick={() => handleEdit("basic")}
                            variant="text"
                            sx={{ color: "#007BFF", fontWeight: "bold" }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Divider />
                    <Box>
                        {[
                            { label: "Type", value: labourDetails?.labourOwnership || "N/A" },
                            { label: "Name", value: labourDetails?.name || "N/A" },
                            { label: "Contact", value: labourDetails?.contactNumber || "N/A" },
                            {
                                label: "Date of Hiring",
                                value: labourDetails?.dateOfJoining
                                    ? new Date(labourDetails.dateOfJoining).toLocaleDateString()
                                    : "N/A",
                            },
                            { label: "Title", value: labourDetails?.title || "N/A" },
                            { label: "Employee ID", value: labourDetails?.LabourID || "N/A" },
                            { label: "Department", value: labourDetails?.departmentName || "N/A" },
                            { label: "Manager", value: labourDetails?.OnboardName || "N/A" },
                            { label: "Location", value: labourDetails?.location || "N/A" },
                        ].map((item, index) => (
                            <Grid
                                container
                                key={index}
                                sx={{
                                    paddingY: 1,
                                    alignItems: "center",
                                    borderBottom: index !== 8 ? "1px solid #ccc" : "none", backgroundColor: "#f5f5f5"
                                }}
                            >
                                <Grid item xs={6} gap={3} sx={{ padding: '7px 0px' }}>
                                    <Typography sx={{ color: '#9e9e9e', textAlign: "right", mr: 5 }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ textAlign: "left" }}>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                </Box>

                {/* Compensation & Perquisites Section */}
                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: 2,
                        marginBottom: 3,
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#003B73" }}>
                            Compensation & Perquisites
                        </Typography>
                        <Button
                            onClick={() => handleEdit("compensation")}
                            variant="text"
                            sx={{ color: "#007BFF", fontWeight: "bold" }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Divider />
                    <Box>
                        {[
                            { label: "Annual Salary", value: `₹${labourDetails?.advance || "0"}` },
                            { label: "Number of Bonuses", value: `₹${labourDetails?.emi || "0"}` },
                        ].map((item, index) => (
                            <Grid
                                container
                                key={index}
                                sx={{
                                    paddingY: 1,
                                    alignItems: "center",
                                    borderBottom: index !== 1 ? "1px solid #ccc" : "none", backgroundColor: "#f5f5f5"
                                }}
                            >
                                <Grid item xs={6} gap={3} sx={{ padding: '7px 0px' }}>
                                    <Typography sx={{ color: '#9e9e9e', textAlign: "right", mr: 5 }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ textAlign: "left" }}>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                </Box>

                {/* Advance Salary Section */}
                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: 2,
                        marginBottom: 3,
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#003B73" }}>
                            Advance Salary
                        </Typography>
                        <Button
                            onClick={() => handleEdit("advance")}
                            variant="text"
                            sx={{ color: "#007BFF", fontWeight: "bold" }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Divider />
                    <Box>
                        {[
                            { label: "Current Advance Salary", value: `₹${labourDetails?.advance || "0"}` },
                            { label: "Advance Salary EMI", value: `₹${labourDetails?.emi || "0"}` },
                        ].map((item, index) => (
                            <Grid
                                container
                                key={index}
                                sx={{
                                    paddingY: 1,
                                    alignItems: "center",
                                    borderBottom: index !== 1 ? "1px solid #ccc" : "none", backgroundColor: "#f5f5f5"
                                }}
                            >
                                <Grid item xs={6} gap={3} sx={{ padding: '7px 0px' }}>
                                    <Typography sx={{ color: '#9e9e9e', textAlign: "right", mr: 5 }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ textAlign: "left" }}>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                </Box>

                {/* Leaves & Attendance Section */}
                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: 2,
                        marginBottom: 3,
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#003B73" }}>
                            Leaves & Attendance
                        </Typography>
                        <Button
                            onClick={() => handleEdit("attendance")}
                            variant="text"
                            sx={{ color: "#007BFF", fontWeight: "bold" }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Divider />
                    <Box>
                        {[
                            {
                                label: "Medical Leaves (Balance)",
                                value: `${labourDetails?.medicalLeave || "0"} / 12`
                            },
                            {
                                label: "Casual Leaves (Balance)",
                                value: `${labourDetails?.casualLeave || "0"} / 9`
                            },
                        ].map((item, index) => (
                            <Grid
                                container
                                key={index}
                                sx={{
                                    paddingY: 1,
                                    alignItems: "center",
                                    borderBottom: index !== 1 ? "1px solid #ccc" : "none", backgroundColor: "#f5f5f5"
                                }}
                            >
                                <Grid item xs={6} gap={3} sx={{ padding: '7px 0px' }}>
                                    <Typography sx={{ color: '#9e9e9e', textAlign: "right", mr: 5 }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ textAlign: "left" }}>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                </Box>

                {/* Payment Information Section */}
                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: 2,
                        marginBottom: 3,
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#003B73" }}>
                            Payment Information
                        </Typography>
                        <Button
                            onClick={() => handleEdit("payment")}
                            variant="text"
                            sx={{ color: "#007BFF", fontWeight: "bold" }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Divider />
                    <Box>
                        {[
                            { label: "PAN", value: labourDetails?.PAN || "N/A" },
                            { label: "IFSC Code", value: labourDetails?.ifscCode || "N/A" },
                            { label: "Bank Account", value: labourDetails?.accountNumber || "N/A" },
                            { label: "Bank Name", value: labourDetails?.bankName || "N/A" },
                            { label: "Beneficiary Name", value: labourDetails?.name || "N/A" },
                        ].map((item, index) => (
                            <Grid
                                container
                                key={index}
                                sx={{
                                    paddingY: 1,
                                    alignItems: "center",
                                    borderBottom: index !== 4 ? "1px solid #ccc" : "none", backgroundColor: "#f5f5f5"
                                }}
                            >
                                <Grid item xs={6} gap={3} sx={{ padding: '7px 0px' }}>
                                    <Typography sx={{ color: '#9e9e9e', textAlign: "right", mr: 5 }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ textAlign: "left" }}>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                </Box>

                {/* Other Information Section */}
                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: "4px",
                        padding: 2,
                        marginBottom: 3,
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#003B73" }}>
                            Other Information
                        </Typography>
                        <Button
                            onClick={() => handleEdit("other")}
                            variant="text"
                            sx={{ color: "#007BFF", fontWeight: "bold" }}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Divider />
                    <Box>
                        {[
                            { label: "Phone Number", value: labourDetails?.contactNumber || "N/A" },
                            { label: "Gender", value: labourDetails?.gender || "N/A" },
                            {
                                label: "Date of Birth",
                                value: labourDetails?.dateOfBirth
                                    ? new Date(labourDetails.dateOfBirth).toLocaleDateString()
                                    : "N/A",
                            },
                            { label: "Native City", value: labourDetails?.village || "N/A" },
                        ].map((item, index) => (
                            <Grid
                                container
                                key={index}
                                sx={{
                                    paddingY: 1,
                                    alignItems: "center",
                                    borderBottom: index !== 3 ? "1px solid #ccc" : "none", backgroundColor: "#f5f5f5"
                                }}
                            >
                                <Grid item xs={6} gap={3} sx={{ padding: '7px 0px' }}>
                                    <Typography sx={{ color: '#9e9e9e', textAlign: "right", mr: 5 }}>
                                        {item.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ textAlign: "left" }}>{item.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                </Box>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-start" gap="20px" mt={3}>
                    <Button variant="contained" sx={{
                        backgroundColor: '#fce4ec',
                        color: 'rgb(255, 100, 100)',
                        '&:hover': {
                            backgroundColor: '#f8bbd0',
                        },
                    }} onClick={() => handleAction("dismiss")}>
                        Dismiss Employee
                    </Button>
                    <Button variant="contained" sx={{
                        backgroundColor: '#fce4ec',
                        color: 'rgb(255, 100, 100)',
                        '&:hover': {
                            backgroundColor: '#f8bbd0',
                        },
                    }} onClick={() => handleAction("delete")}>
                        Delete Employee
                    </Button>
                    <Button variant="contained" sx={{
                        backgroundColor: '#fce4ec',
                        color: 'rgb(255, 100, 100)',
                        '&:hover': {
                            backgroundColor: '#f8bbd0',
                        },
                    }} onClick={() => handleAction("stopSalary")}>
                        Stop Salary
                    </Button>
                </Box>
            </Box>


            {/* Sidebar */}
            <Box
                sx={{
                    flex: 1,
                    paddingTop: 3,
                    bgcolor: "#f5f6fa", // Light background color for sidebar
                    boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
                    overflowY: "auto", // Enable vertical scrolling
                    maxWidth: "260px",
                    height: "90vh",
                    display: "flex",
                    padding: "0px 10px",
                    flexDirection: "column",
                    alignItems: "center",
                    scrollbarWidth: "none", // Firefox hides scrollbar
                    "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, and Edge hide scrollbar
                    },
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ margin: "70px 0px 20px 0px" }}
                >
                    <Avatar
                        src={labourDetails?.photoSrc || ""}
                        alt={labourDetails?.name || "Employee Photo"}
                        sx={{
                            width: 200,
                            height: 200,
                            borderRadius: 2, // Square avatar
                            "& img": {
                                objectFit: "unset !important", // Remove 'object-fit: cover'
                            },
                        }}
                    />
                </Box>


                {[
                    { label: "Generate Document", description: "Generate necessary employee-related documents.", path: "#" },
                    { label: "View Attendance", description: "View attendance records and approvals.", path: "#" },
                    { label: "View Payslips", description: "View past payslips.", path: "#" },
                    { label: "View Documents", description: "View uploaded documents for this employee.", path: "#" },
                    { label: "View Journey", description: "Track the employee's progress, promotions, and history.", path: "#" },
                    { label: "View Reimbursements", description: "Check the status of past reimbursements.", path: "#" },
                ].map((item, index) => (
                    <Box
                        key={index}
                        onClick={() => handleSidebarClick(item.label)}  // Add onClick handler here
                        sx={{
                            width: "90%",
                            bgcolor: "#13315c", // Sidebar button background color
                            borderRadius: 2,
                            padding: "13px",
                            marginBottom: 2,
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            "&:hover": {
                                bgcolor: "#1e3450", // Darker shade on hover
                            },
                        }}
                    >
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: "bold",
                                    marginBottom: "8px",
                                    color: "white",
                                }}
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "white",
                                }}
                            >
                                {item.description}
                            </Typography>
                        </Box>
                        <Box>
                            {/* Inline SVG Icon */}
                            <svg
                                width="19"
                                height="16"
                                viewBox="0 0 19 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 16V0L19 8L0 16ZM2 13L13.85 8L2 3V6.5L8 8L2 9.5V13Z"
                                    fill="white"
                                />
                            </svg>
                        </Box>
                    </Box>
                ))}
                {/* Conditional rendering of the selected component */}
                {selectedComponent && (
                    <Box sx={{ flexGrow: 1, padding: 4 }}>
                        <Typography variant="h6">{selectedComponent}</Typography>
                    </Box>
                )}

                {/* Dialog for Generate Document */}
                <Dialog
                    open={isDialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="generate-document-dialog-title"
                    aria-describedby="generate-document-dialog-description"
                >
                    <DialogTitle id="generate-document-dialog-title">
                        Generate Document
                    </DialogTitle>
                    {dialogContent}
                    <DialogActions>
                        <Button
                            onClick={handleDialogClose}
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleGenerateDocuments}
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
                        >
                            Download
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* <Box sx={{ display: "flex", height: "100vh" }}>
      <ToastContainer />
      <Box
        sx={{
          flex: 3,
          overflowY: "auto", // Enable scrolling
          padding: 3,
          bgcolor: "#f9f9f9", // Light background
          borderRight: "1px solid #ddd", // Border for separation
          height: "84vh", // Full-height scrolling container
        }}
      >
        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Month"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <MenuItem key={index} value={index + 1}>
                {new Date(0, index).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            label="Year"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <MenuItem key={index} value={new Date().getFullYear() - index}>
                {new Date().getFullYear() - index}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleModalOpenCalenderAttendance}>View Attendance</Button>

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container justifyContent="center" spacing={1}>
                {calendar.map((week, rowIndex) => (
                  <Grid container justifyContent="center" key={rowIndex}>
                    {week.map((day, colIndex) => (
                      <Box
                        key={colIndex}
                        sx={{
                          backgroundColor: statusColors[day.status] || "#E0E0E0",
                          color: day.status ? "#fff" : "#000",
                          margin: "6px",
                          padding: "4px",
                          width: 40,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "8px",
                          fontWeight: "bold",
                          boxSizing: "border-box",
                        }}
                      >
                        {day.day || ""}
                      </Box>
                    ))}
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box> */}

                <Box sx={{ flex: 3, overflowY: "auto", padding: 3, bgcolor: "#f9f9f9", borderRight: "1px solid #ddd", height: "84vh" }}>
                <Modal open={open} onClose={handleModalCloseCalender}>
                <Box
                    sx={{
                        width: 500,
                        margin: '5% auto',
                        padding: 3,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleModalCloseCalender}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#FFF',
                            backgroundColor: '#ff0000b5',
                            borderRadius: '20%',
                            padding: '5px',
                            '&:hover': {
                                backgroundColor: '#ff0000de',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" mb={0} fontWeight="bold">
                        Attendance for Labour ID: {selectedLabourId}
                    </Typography>

                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                        </Typography>

                        <Grid container justifyContent="center" spacing={0} mb={1}>
                            {weekdays.map((day, index) => (
                                <CalendarBox key={index} day={day} status={null} margin="4px" padding="0" />
                            ))}
                        </Grid>
                        <Grid container justifyContent="center">
                            {calendar.map((week, rowIndex) => (
                                <Grid container justifyContent="center" key={rowIndex}>
                                    {week.map((day, colIndex) => (
                                        <CalendarBox key={colIndex} day={day.day} status={day.status || 'NA'} />
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                            Legend:
                        </Typography>
                        <Grid container justifyContent="center" spacing={1}>
                            <LegendItem color="#4CAF50" text="P - Present" />
                            <LegendItem color="#FF6F00" text="A - Absent" />
                            <LegendItem color="#8236BC" text="H - Holiday" />
                            <LegendItem color="#F44336" text="HD - Half Day" />
                            <LegendItem color="#005cff" text="MP - Miss Punch" />
                            <LegendItem color="#E0E0E0" text="NA - No Data" />
                        </Grid>
                    </Box>
                </Box>
            </Modal>
            </Box>
            </Box>


            <Box>
      {/* Sidebar */}
      {/* <Button onClick={() => handleSidebarClick("View Documents")}>View Documents</Button> */}


 {/* Month & Year Selection Modal */}
 <Modal open={showMonthYearModal} onClose={() => setShowMonthYearModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        width: 300,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6">Select Month & Year</Typography>

                    <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select Month
                        </MenuItem>
                        {[...Array(12)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select Year
                        </MenuItem>
                        {[2023, 2024, 2025].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button variant="contained" onClick={handleProceedToPayslip}>
                        Proceed to Payslip
                    </Button>
                </Box>
            </Modal>
        {modalOpenNetpay && (
          <ViewPaySlip
          open={modalOpenNetpay}
          labourID={selectedLabourId}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onClose={handleClosePaySlip}
          />
        )}

      <Modal
        modalOpenNetpay={showDocuments}
        onClose={() => setShowDocuments(false)}
        aria-labelledby="view-documents-modal"
      >
        <Box
           sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
                xs: "90%", // Mobile screens
                sm: "60%", // Tablet screens
                md: "60%", // Laptop screens
                lg: "50%", // Large screens
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
            onClick={() => setShowDocuments(false)}
            sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "gray",
            }}
        >
            <CloseIcon />
        </IconButton>
          <Typography variant="h6">Documents</Typography>
          {Object.keys(formData).map((key) => (
            <Box key={key} mb={1.5} sx={{
                display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
              <Typography variant="body1">{key}:</Typography>
              <Box>{formData[key]}</Box>
            </Box>
          ))}
        </Box>
      </Modal>

      {/* Dialog to show the clicked document */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {modalImageSrc && (
            <Box display="flex" justifyContent="center">
              <img
                src={modalImageSrc}
                alt="Document"
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>



        </Box>
    );
};

export default PeopleEditDetails;


