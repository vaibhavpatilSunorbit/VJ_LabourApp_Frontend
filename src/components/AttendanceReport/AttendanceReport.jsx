
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import CustomPopup from "../CustomPopup/CustomPopup";
import Loading from "../Loading/Loading";
// import "./Users.css";

const AttendanceReport = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("success");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/users/getAllUsers");
      setUsers(response.data.data); // Assuming response.data.data is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
      setPopupMessage("Failed to fetch users");
      setPopupSeverity("error");
      setOpenPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/updateUser/${userId}`, {
        isActive: true,
      });
      if (response.data.success) {
        setPopupMessage(`User ${userId} activated successfully`);
        setPopupSeverity("success");
        setOpenPopup(true);
        fetchUsers(); // Refresh users after update
      } else {
        setPopupMessage("Failed to activate user");
        setPopupSeverity("error");
        setOpenPopup(true);
      }
    } catch (error) {
      console.error("Error activating user:", error);
      setPopupMessage("Failed to activate user");
      setPopupSeverity("error");
      setOpenPopup(true);
    }
  };

  const handleSetDiscontinue = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/updateUser/${userId}`, {
        isActive: false,
      });
      if (response.data.success) {
        setPopupMessage(`User ${userId} discontinued successfully`);
        setPopupSeverity("success");
        setOpenPopup(true);
        fetchUsers(); // Refresh users after update
      } else {
        setPopupMessage("Failed to discontinue user");
        setPopupSeverity("error");
        setOpenPopup(true);
      }
    } catch (error) {
      console.error("Error discontinuing user:", error);
      setPopupMessage("Failed to discontinue user");
      setPopupSeverity("error");
      setOpenPopup(true);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <div className="users-container">
      {isLoading && <Loading />} {/* Display loading indicator */}
      <Container maxWidth="lg">
        <Paper className="users-paper">
          <Typography variant="h5" component="h1" gutterBottom>
            Users List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>User Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.emailID}</TableCell>
                    <TableCell>{user.contactNo}</TableCell>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell>{user.isActive ? "Active" : "Discontinued"}</TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleSetDiscontinue(user.id)}
                        >
                          Discontinue
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSetActive(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <CustomPopup
          open={openPopup}
          onClose={handleClosePopup}
          message={popupMessage}
          severity={popupSeverity}
        />
      </Container>
    </div>
  );
};

export default AttendanceReport;

