import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Divider,
    CircularProgress,
    Avatar,
    Grid,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Data";

const PeopleEditDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [labourDetails, setLabourDetails] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const labourId = location.state?.labourId;

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
    }

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Main Content */}
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
                    <Divider/>
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
                    <Divider/>
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
                    <Divider/>
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
                    <Divider/>
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
                    <Divider/>
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
                            width: 180,
                            height: 180,
                            borderRadius: 2, // Square avatar
                            "& img": {
                                objectFit: "unset !important", // Remove 'object-fit: cover'
                            },
                        }}
                    />
                </Box>


                {/* Sidebar Links */}
                {[
                    { label: "Generate Document", description: "Generate necessary employee-related documents.", path: "#" },
                    { label: "View Attendance", description: "View attendance records and approvals.", path: "#" },
                    { label: "View Payslips", description: "View past payslips.", path: "#" },
                    { label: "View Reimbursements", description: "Check the status of past reimbursements.", path: "#" },
                    { label: "View Documents", description: "View uploaded documents for this employee.", path: "#" },
                    { label: "View Journey", description: "Track the employee's progress, promotions, and history.", path: "#" },
                ].map((item, index) => (
                    <Box
                        key={index}
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
                    // ))}

                ))}
            </Box>

        </Box>
    );
};

export default PeopleEditDetails;


