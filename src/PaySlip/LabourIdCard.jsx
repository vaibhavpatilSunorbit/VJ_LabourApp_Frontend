import React, { useRef, useEffect, useState } from "react";
import {
    Modal,
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Box,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import vjLogo from "../images/VJlogo-1-removebg.png";

const LabourIdCard = ({ open, handleClose, labourData }) => {
    const cardRef = useRef();
    const [cardHeight, setCardHeight] = useState(500);

    // Ensure equal height for both cards
    useEffect(() => {       
        if (cardRef.current) {
            setCardHeight(cardRef.current.clientHeight);
        }
    }, [open]);

    // 📌 Handle PDF Download
    const handleDownloadPDF = async () => {
        try {
            const cardElement = cardRef.current;
            if (!cardElement) return console.error("Card component not found!");

            // Capture the component as an image
            const canvas = await html2canvas(cardElement, { scale: 1.5, useCORS: true });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const padding = 10; // Adjust padding as needed
            const imgWidth = 210 - padding * 2; // A4 width with padding
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add image with padding
            pdf.addImage(imgData, "PNG", padding, padding, imgWidth, imgHeight);

            pdf.save(`Labour_ID_${labourData.name}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    if (!labourData) {
        return null; // or render a loading state
    }

    return (
        <Modal open={open} onClose={handleClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: 3,
                    borderRadius: 2,
                    width: "90%",
                    maxWidth: 900,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    textAlign: "center",
                }}
            >
                {/* Modal Content */}
                <div ref={cardRef}>
                    <Grid container spacing={2} sx={{ width: '90%', alignItems: "stretch" , margin:'auto'}}>
                        {/* Front Side */}
                        <Grid item xs={6}>
                            <Card
                                sx={{
                                    border: "2px solid #001F54",
                                    borderRadius: 2,
                                    textAlign: "center",
                                    padding: 2,
                                    height: 500,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <img src={vjLogo} alt="Company Logo" style={{ width: "100%", maxWidth: "190px" }} />
                                </Box>

                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold" }}>
                                    We ❤️ What We Do!
                                </Typography>
                                <Box sx={{ textAlign: "center", width: "100%" }}>
                                    <Avatar
                                        src={labourData.photoSrc}
                                        alt="Profile"
                                        sx={{
                                            width: 160,
                                            height: 170,
                                            margin: "auto", // Centers the Avatar
                                            borderRadius: 2,
                                            display: "block",
                                            objectFit: "cover" // Ensures the image covers the entire avatar
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#fff",
                                        background: "#001F54",
                                        padding: "5px",
                                        borderRadius: "5px",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {labourData.name}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                                    {labourData.LabourID}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555" }}>
                                    📍 {labourData.location}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold", color: "#001F54" }}>
                                    Emergency No. {labourData.emergencyContact}
                                </Typography>
                            </Card>
                        </Grid>

                        {/* Back Side */}
                        <Grid item xs={6}>
                            <Card
                                sx={{
                                    border: "2px solid #001F54",
                                    borderRadius: 2,
                                    padding: 2,
                                    height: 500,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <CardContent>
                                    <Table sx={{ "& td": { borderBottom: "none", padding: "4px 8px" } }}>
                                        <TableBody>
                                            {[
                                                { label: "D.O.B.", value: new Date(labourData.dateOfBirth).toLocaleDateString() },
                                                { label: "D.O.J.", value: new Date(labourData.dateOfJoining).toLocaleDateString() },
                                                { label: "Dept.", value: labourData.departmentName },
                                                { label: "Designation", value: labourData.designation },
                                                { label: "Induction Date", value: new Date(labourData.Induction_Date).toLocaleDateString() },
                                                { label: "Induction By", value: labourData.Inducted_By },
                                                { label: "Aadhaar No.", value: labourData.aadhaarNumber },
                                                { label: "Valid Upto", value: new Date(labourData.ValidTill).toLocaleDateString() },
                                            ].map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ color: "#001F54", fontWeight: "bold" }}>{row.label}</TableCell>
                                                    <TableCell>: {row.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>

                                {/* Space for Signature */}
                                <Box sx={{ textAlign: "center", mt: 4, minHeight: "40px", backgroundColor: "#e2e7fd", width: "80%", margin: "0 auto" }} />

                                {/* Issuing Authority */}
                                <Box sx={{ textAlign: "center", backgroundColor: "#001F54", padding: "8px", borderRadius: "5px", color: "#fff", width: "80%", margin: "0 auto", marginTop:0 }}>
                                    Issuing Authority
                                </Box>  
                                {/* 001F54 */}
                                <Typography variant="caption" sx={{ mt: 1, display: "block", textAlign: "center" }}>
                                    If found, please return to the company
                                </Typography>

                                {/* Company Name */}
                                <Box sx={{ backgroundColor: "#001F54", padding: "8px", borderRadius: "5px", textAlign: "center", color: "#fff", mt: 1, width: "95%" }}>
                                    {labourData.companyName}
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </div>

                {/* Download Button */}
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button variant="contained" onClick={handleDownloadPDF} sx={{ backgroundColor: "#001F54", color: "#fff" }}>
                        Download ID Card
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ ml: 2 }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default LabourIdCard;
