
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
    MenuItem, Modal, Typography, IconButton, Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText, Checkbox,
    DialogActions, FormControl, InputLabel, Tabs, Grid, Divider, Fade, FormControlLabel, Switch
} from '@mui/material';
import { modalStyle } from '../AdminSalary/modalStyles.js';
import { StyleForPayslip } from '../AdminSalary/modalStyles.js';
import { StyleEmpInfo } from '../AdminSalary/modalStyles.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableSkeletonLoading from "../Loading/TableSkeletonLoading.jsx";
import { API_BASE_URL } from "../../Data.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../UserContext/UserContext.js';
import { parse } from "fast-xml-parser";
import { ArrowBack } from '@mui/icons-material';
import logo from "../../images/VJlogo-1-removebg.png";

const ViewPaySlip = ({ open ,labourID, selectedMonth, setSelectedMonth, selectedYear,setSelectedYear, onClose}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [labours, setLabours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [modalOpenNetpay, setModalOpenNetpay] = useState(false);
    const [selectedLabour, setSelectedLabour] = useState(null);
    const [businessUnits, setBusinessUnits] = useState([]);
    const { user } = useUser();
    const currentDate = new Date();
    // const currentMonth = (currentDate.getMonth() + 1).toString();
    // const [selectedMonth, setSelectedMonth] = useState('');
    // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const location = useLocation();
    const navigate = useNavigate();
    const [fetchForAll, setFetchForAll] = useState(true);
    const [labourId, setLabourId] = useState('');
    const [salaryData, setSalaryData] = useState([]);
    const [noDataAvailable, setNoDataAvailable] = useState(false);


    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000); // Simulate API loading
    }, []);

    const fetchSalaryGenerationForDateMonthAll = async () => {
        setLoading(true);

        if (!selectedMonth || !selectedYear) {
            toast.warning('Please select a valid month and year.');
            setLoading(false);
            return;
        }

        const params = { month: selectedMonth, year: selectedYear, labourId: labourID };
       

        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/payroll/finalizedSalaryData`, { params });
            const fetchedData = response.data;

            console.log('Fetched Data from API:', fetchedData);

            // Check if data is in expected format
            if (!fetchedData || !Array.isArray(fetchedData.data)) {
                throw new Error('Unexpected data format received from the API.');
            }

            if (fetchedData.data.length === 0) {
                setLabours([]); // Clear previous data
                setSalaryData([]);
                setNoDataAvailable(true); // Set flag to show no data image
                return;
            }

            setNoDataAvailable(false); // Reset flag if data is available

            // Mapping API response fields to frontend expected structure
            const mappedSalaryData = fetchedData.data.map((labour, index) => {
                return {
                    srNo: index + 1,
                    id: labour.id || 0,
                    LabourID: labour.LabourID || labour.LabourId || "-",
                    name: labour.name || "-",
                    projectName: labour.businessUnit || "-",
                    department: labour.departmentName || "-",
                    attendanceCount: labour.attendanceCount || 0,
                    presentDays: labour.presentDays || 0,
                    absentDays: labour.absentDays || 0,
                    halfDays: labour.halfDays || 0,
                    totalOvertimeHours: labour.cappedOvertime || 0,
                    basicSalary: labour.basicSalary || 0,
                    overtimePay: labour.overtimePay || 0,
                    weeklyOffPay: labour.weeklyOffPay || 0,
                    bonuses: labour.bonuses || 0,
                    totalDeductions: labour.totalDeductions || 0,
                    grossPay: labour.grossPay || 0,
                    netPay: labour.netPay || 0,
                    advancePay: labour.advance || 0,
                    advanceRemarks: labour.advanceRemarks || "-",
                    debit: labour.debit || 0,
                    debitRemarks: labour.debitRemarks || "-",
                    incentivePay: labour.incentive || 0,
                    incentiveRemarks: labour.incentiveRemarks || "-",
                    month: labour.month || "-",
                    year: labour.year || "-",
                    wageType: labour.wageType || "-",
                    dailyWageRate: labour.dailyWageRate || 0,
                    fixedMonthlyWage: labour.fixedMonthlyWage || 0,

                    // Newly added fields mapped from API response
                    holidayOvertimeHours: labour.holidayOvertimeHours || 0,
                    holidayOvertimeWages: labour.holidayOvertimeWages || 0,
                    normalOvertimeCount: labour.normalOvertimeCount || 0,
                    holidayOvertimeCount: labour.holidayOvertimeCount || 0,
                    missPunchDays: labour.missPunchDays || 0,
                    previousWageAmount: labour.previousWageAmount || 0,
                    totalHolidaysInMonth: labour.totalHolidaysInMonth || 0,
                };
            });

            setLabours(mappedSalaryData);
            setSalaryData(mappedSalaryData);

        } catch (error) {
            console.error('Error fetching salary generation data:', error);
            setLabours([]); // Clear previous data
            setSalaryData([]);
            setNoDataAvailable(true); // Show no data image
            toast.error(error.response?.data?.message || 'Error fetching salary generation data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (selectedMonth && selectedYear && labourID) {
            fetchSalaryGenerationForDateMonthAll();
        }
    }, [selectedMonth, selectedYear, labourID]);



    const handleCloseModalNetpay = () => {
        setSelectedLabour(null);
        setModalOpenNetpay(false);
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

   

    const filteredLabours = getLatestLabourData(labours);
    const paginatedLabours = rowsPerPage > 0
        ? filteredLabours.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        : filteredLabours;

  

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <ToastContainer />

            

                {/* <Modal open={modalOpenNetpay} onClose={handleCloseModalNetpay} aria-labelledby="attendance-details-modal"> */}
                <Modal open={open} onClose={onClose} aria-labelledby="attendance-details-modal">
                    <Box sx={modalStyle}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {/* Logo with right-side clipPath */}
                            <Box sx={{
                                width: '50%',
                                backgroundColor: "#E4D3B5",
                                padding: "10px",
                                clipPath: "polygon(0% 0%, 100% 0%, 78% 100%, 0% 100%)",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <img src={logo} alt="SunOrbit" className="payslip-logo" style={{ width: "160px" }} />
                            </Box>

                            {/* Payslip Text with left-top clipped style */}
                            <Box sx={{
                                backgroundColor: "#E4D3B5",
                                marginBottom: '20px',
                                padding: "12px 30px",
                                clipPath: "polygon(19% 0%, 100% 0%, 100% 100%, 0% 100%)",
                                // clipPath: "polygon(100% 0%, 0% 0%, 15% 100%, 100% 100%)",
                                borderRadius: "4px",
                                display: "inline-block"
                            }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Payslip: {months.find(m => m.value === selectedLabour?.month)?.label || "N/A"} {selectedLabour?.year || 0}
                                </Typography>
                            </Box>
                        </Box>


                        <Divider sx={{ my: 2 }} />

                        {/* Net Pay Summary */}
                        <Box textAlign="left" sx={{ display: 'flex', justifyContent: 'flex-end', mr: 3 }}>
                            <Box textAlign="left" sx={{ backgroundColor: "#FFECB3", padding: 2, borderRadius: 2, width: "40%" }}>
                                <Typography variant="h6" fontWeight="bold">Net Pay: ₹{selectedLabour?.netPay || "N/A"}</Typography>
                                <Typography variant="body2">
                                    Gross Pay (A): <b>₹{selectedLabour?.grossPay || "N/A"}</b>
                                </Typography>
                                <Typography>
                                    Deductions (B): <b>₹{selectedLabour?.totalDeductions || "0.00"}</b>
                                </Typography>
                            </Box>
                        </Box>

                        {/* Employee Details */}
                        <Box sx={StyleEmpInfo}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography><b>Employee Code:</b> {selectedLabour?.LabourID || "N/A"}</Typography>
                                    <Typography><b>Name:</b> {selectedLabour?.name || "N/A"}</Typography>
                                    <Typography><b>Business Unit:</b> {selectedLabour?.projectName || "N/A"}</Typography>
                                    <Typography><b>Department:</b> {selectedLabour?.department || "N/A"}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><b>Aadhar No:</b> N/A</Typography>
                                    <Typography><b>Account No:</b> N/A</Typography>
                                    <Typography><b>IFSC Code:</b> N/A</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Attendance Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Attendance Count (A)</Typography>
                        </Box>
                        <Box sx={{ mt: 1, padding:'10px 30px'}}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor:"#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Total Days</b></TableCell>
                                            <TableCell><b>Present Days</b></TableCell>
                                            <TableCell><b>Half Days</b></TableCell>
                                            <TableCell><b>Miss Punch Days</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.attendanceCount || "N/A"}</TableCell>
                                            <TableCell>{selectedLabour?.presentDays || "N/A"}</TableCell>
                                            <TableCell>{selectedLabour?.halfDays || "N/A"}</TableCell>
                                            <TableCell>{selectedLabour?.missPunchDays || "N/A"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Wages Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Wages Count (B)</Typography>
                        </Box>
                        <Box sx={{ mt: 1, padding:'10px 30px'}}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor:"#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Wages Type</b></TableCell>
                                            <TableCell><b>Daily Wages</b></TableCell>
                                            <TableCell><b>Fixed Monthly Wages</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.wageType || "N/A"}</TableCell>
                                            <TableCell>{selectedLabour?.dailyWageRate || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.fixedMonthlyWage || "0.00"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Gross Pay Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Gross Pay (C)</Typography>
                        </Box>
                        <Box sx={{ mt: 1, padding:'10px 30px'}}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor:"#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Earnings Pay</b></TableCell>
                                            <TableCell><b>Monthly Bonus</b></TableCell>
                                            <TableCell><b>Total</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.basicSalary || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.bonuses || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.grossPay || "0.00"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Deductions Section */}
                        <Box sx={StyleForPayslip}>
                            <Typography fontWeight="bold">• Deductions (D)</Typography>
                        </Box>
                        <Box sx={{ mt: 1, padding:'10px 30px'}}>
                            <TableContainer component={Paper} sx={{ border: "2px solid green", borderRadius: 1, backgroundColor:"#fffae7" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Debit</b></TableCell>
                                            <TableCell><b>Debit Remarks</b></TableCell>
                                            <TableCell><b>Advance</b></TableCell>
                                            <TableCell><b>Advance Remarks</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{selectedLabour?.debit || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.debitRemarks || "-"}</TableCell>
                                            <TableCell>{selectedLabour?.advance || "0.00"}</TableCell>
                                            <TableCell>{selectedLabour?.advanceRemarks || "-"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Action Buttons */}
                        <Box display="flex" justifyContent="center" gap={2} sx={{ m: "20px 0px" }}>
                            <Button variant="contained" color="primary">Download</Button>
                            {/* <Button variant="contained" color="secondary">View Details</Button> */}
                            <Button
                            variant="contained"
                            className="modal-close-button"
                            // onClick={handleCloseModalNetpay}
                            onClick={handleCloseModalNetpay}
                        >
                            Close
                        </Button>
                        </Box>
                    </Box>
                </Modal>
</Box>
);
};

export default ViewPaySlip;

