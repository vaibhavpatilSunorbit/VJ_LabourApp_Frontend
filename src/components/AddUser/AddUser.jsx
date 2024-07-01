import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import TableComponent from "./TableComponent";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const accessPages = ["Application", "Labour Details", "Add User", "Apprved Labours"];

const AddUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    emailID: "",
    contactNo: "",
    pasword: "",
    userType: "user",
    isApproved: false,
    accessPages: [],
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsers();
  }, []); 

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/users/getAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data.data); 
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "contactNo":
        if (value.length === 10) {
          setErrors((prevErrors) => ({ ...prevErrors, contactNo: "" }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactNo: "Mobile number must be 10 digits",
          }));
        }
        break;
      case "emailID":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(value)) {
          setErrors((prevErrors) => ({ ...prevErrors, emailID: "" }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            emailID: "Invalid email format",
          }));
        }
        break;
      case "name":
        setErrors((prevErrors) =>
          value.trim() === "" ? { ...prevErrors, name: "Name is required" } : { ...prevErrors, name: "" }
        );
        break;
      case "pasword":
        setErrors((prevErrors) =>
          value.trim() === "" ? { ...prevErrors, pasword: "Password is required" } : { ...prevErrors, pasword: "" }
        );
        break;
      case "userType":
        setErrors((prevErrors) =>
          value.trim() === "" ? { ...prevErrors, userType: "User type is required" } : { ...prevErrors, userType: "" }
        );
        break;
      default:
        break;
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSelectAll = (event) => {
    setSelectedValues(event.target.checked ? accessPages : []);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedValues([]);
    setUserData({
      id: null,
      name: "",
      emailID: "",
      contactNo: "",
      pasword: "",
      userType: "user",
      isApproved: false,
      accessPages: [],
    });
  };

  const handleShowModal = (edit = false, user = null) => {
    setShowModal(true);
    if (edit && user) {
      setUserData(user);
      setSelectedValues(Array.isArray(user.accessPages) ? user.accessPages : []);
    }
  };

  const handleFormSubmit = async () => {
    const newErrors = {};
    if (!userData.name) newErrors.name = "Name is required";
    if (!userData.emailID) newErrors.emailID = "Email is required";
    if (!userData.contactNo) newErrors.contactNo = "Contact number is required";
    if (userData.contactNo && userData.contactNo.length !== 10)
        newErrors.contactNo = "Contact number must be 10 digits";
    if (!userData.pasword && !userData.id) newErrors.pasword = "Password is required"; 
    if (!userData.userType) newErrors.userType = "User type is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
        try {
            const token = localStorage.getItem("token");
            const endpoint = userData.id ? "updateUser" : "registerUser";
            const method = userData.id ? "put" : "post";
            const url = `http://localhost:5000/users/${endpoint}`;

            const payload = {
                ...userData,
                id: userData.id ? parseInt(userData.id, 10) : undefined, 
                accessPages: selectedValues,
                isApproved: userData.isApproved,
            };

            if (userData.id) {
                delete payload.pasword;
            } else {
                payload.CreatedAt = new Date().toISOString();
                payload.userToken = "someRandomToken";
            }

            const response = await axios({
                method,
                url,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const updatedUser = {
                    ...userData,
                    id: userData.id || uuidv4(),
                    accessPages: selectedValues,
                };

                setUsers((prevUsers) => {
                    if (userData.id) {
                        return prevUsers.map((user) => (user.id === userData.id ? updatedUser : user));
                    } else {
                        return [updatedUser, ...prevUsers];
                    }
                });

                handleCloseModal(); 
            } else {
                setErrors({ form: response.data.message });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({ form: "Error submitting form" });
        }
    }
};
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (user) => {
    handleShowModal(true, user);
  };

  return (
    <Box py={2} px={2} sx={{ width: isMobile ? '90vw' : 'auto' }}>
      <div className="MainDash">
        <Typography variant="h4" mb={3}>
          Add User
        </Typography>
        <div className="Main-div">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#EFE6F7',
              color: '#8236BC',
              marginRight: '10px',
              '&:hover': {
                backgroundColor: '#bfa7d7',
              },
            }}
            onClick={() => handleShowModal(false)}
            // style={{ marginBottom: 20 }}
          >
            Add User
          </Button>
          <TableComponent
            users={users}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleEdit={handleEdit}
          />

          <Dialog open={showModal} onClose={handleCloseModal}>
            <DialogTitle sx={{ backgroundColor: "#E6E1EB" }}>
              {userData.id ? "Edit User" : "Add User"}
            </DialogTitle>
            <IconButton
  aria-label="close"
  onClick={handleCloseModal}
  sx={{
    position: "absolute",
    right: 8,
    top: 8,
    color: (theme) => theme.palette.grey[500],
    backgroundColor: '',  
    '&:hover': {
      backgroundColor: 'red', 
    },
  }}
>
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <TextField
                name="name"
                label="Full Name"
                value={userData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                name="emailID"
                label="Email"
                value={userData.emailID}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors.emailID}
                helperText={errors.emailID}
              />
              <TextField
                name="contactNo"
                label="Contact No."
                type="number"
                value={userData.contactNo}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors.contactNo}
                helperText={errors.contactNo}
              />
              <TextField
                name="pasword"
                label="Password"
                type="password"
                value={userData.pasword}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors.pasword}
                helperText={errors.pasword}
              />
              <TextField
                select
                name="userType"
                label="Select User Type"
                value={userData.userType}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.userType}
                helperText={errors.userType}
                sx={{ margin: '20px 0' }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>

              <Autocomplete
                multiple
                options={accessPages}
                value={selectedValues}
                onChange={(event, newValue) => {
                  if (Array.isArray(newValue)) {
                    setSelectedValues(newValue);
                  }
                }}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} style={{ marginRight: 8 }} />
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Access Pages" fullWidth />
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedValues.length === accessPages.length}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                }
                label="Select All"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                onClick={handleFormSubmit}
                variant="contained"
                 sx={{
                          backgroundColor: '#EFE6F7',
                          color: '#8236BC',
                          marginRight: '10px',
                          '&:hover': {
                            backgroundColor: '#bfa7d7',
                          },
                        }}
              >
                {userData.id ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Box>
  );
};

export default AddUser;
