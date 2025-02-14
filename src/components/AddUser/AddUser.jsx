// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   IconButton,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import TableComponent from "./TableComponent";
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { API_BASE_URL } from "../../Data";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const accessPages = ["Application", "Labour Details", "Add User", "Approved Labours"];

// const AddUser = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [userData, setUserData] = useState({
//     id: null,
//     name: "",
//     emailID: "",
//     contactNo: "",
//     pasword: "",
//     plainPassword: "",
//     userType: "user",
//     isApproved: false,
//     accessPages: [],
//   });
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     fetchUsers();
//   }, []); 

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(API_BASE_URL +`/users/getAllUsers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setUsers(response.data.data); 
//       } else {
//         console.error("Failed to fetch users:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     switch (name) {
//       case "contactNo":
//         if (value.length === 10) {
//           setErrors((prevErrors) => ({ ...prevErrors, contactNo: "" }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             contactNo: "Mobile number must be 10 digits",
//           }));
//         }
//         break;
//       case "emailID":
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (emailPattern.test(value)) {
//           setErrors((prevErrors) => ({ ...prevErrors, emailID: "" }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             emailID: "Invalid email format",
//           }));
//         }
//         break;
//       case "name":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, name: "Name is required" } : { ...prevErrors, name: "" }
//         );
//         break;
//       case "pasword":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, pasword: "Password is required" } : { ...prevErrors, pasword: "" }
//         );
//         setUserData((prevUserData) => ({
//           ...prevUserData,
//           plainPassword: value,
//         }));
//         break;
//       case "userType":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, userType: "User type is required" } : { ...prevErrors, userType: "" }
//         );
//         break;
//       default:
//         break;
//     }

//     setUserData((prevUserData) => ({
//       ...prevUserData,
//       [name]: value,
//     }));
//   };

//   const handleSelectAll = (event) => {
//     setSelectedValues(event.target.checked ? accessPages : []);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedValues([]);
//     setUserData({
//       id: null,
//       name: "",
//       emailID: "",
//       contactNo: "",
//       pasword: "",
//       plainPassword: "",
//       userType: "user",
//       isApproved: false,
//       accessPages: [],
//     });
//   };

//   const handleShowModal = (edit = false, user = null) => {
//     setShowModal(true);
//     if (edit && user) {
//       setUserData(user);
//       setSelectedValues(Array.isArray(user.accessPages) ? user.accessPages : []);
//     }
//   };

//   const handleFormSubmit = async () => {
//     const newErrors = {};
//     if (!userData.name) newErrors.name = "Name is required";
//     if (!userData.emailID) newErrors.emailID = "Email is required";
//     if (!userData.contactNo) newErrors.contactNo = "Contact number is required";
//     if (userData.contactNo && userData.contactNo.length !== 10)
//         newErrors.contactNo = "Contact number must be 10 digits";
//     if (!userData.pasword && !userData.id) newErrors.pasword = "Password is required"; 
//     if (!userData.userType) newErrors.userType = "User type is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//         try {
//             const token = localStorage.getItem("token");
//             const endpoint = userData.id ? "updateUser" : "registerUser";
//             const method = userData.id ? "put" : "post";
//             const url = API_BASE_URL +`/users/${endpoint}`;

//             const payload = {
//                 ...userData,
//                 id: userData.id ? parseInt(userData.id, 10) : undefined, 
//                 accessPages: selectedValues,
//                 isApproved: userData.isApproved,
//             };

//             if (!userData.id) {
//               payload.CreatedAt = new Date().toISOString();
//               payload.userToken = uuidv4();
//           }

//             const response = await axios({
//                 method,
//                 url,
//                 data: payload,
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 200 || response.status === 201) {
//                 const updatedUser = {
//                     ...userData,
//                     id: userData.id || uuidv4(),
//                     accessPages: selectedValues,
//                 };

//                 setUsers((prevUsers) => {
//                     if (userData.id) {
//                         return prevUsers.map((user) => (user.id === userData.id ? updatedUser : user));
//                     } else {
//                         return [updatedUser, ...prevUsers];
//                     }
//                 });

//                 handleCloseModal();
//                 toast.success(userData.pasword ? "User and Password successfully saved" : "User successfully saved");
//             } else {
//                 setErrors({ form: response.data.message });
//                 toast.error("Failed to save user");
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             setErrors({ form: "Error submitting form" });
//             toast.error("Error submitting form");
//         }
//     }
// };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleEdit = (user) => {
//     handleShowModal(true, user);
//   };

//   return (
//     <Box py={2} px={1} sx={{ width: isMobile ? '96vw' : 'auto' }}>
//       <ToastContainer />
//       <div className="MainDash">
//         <Typography variant="h5" mb={1}>
//           Add User
//         </Typography>
//         <div className="Main-div">
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#EFE6F7',
//               color: '#8236BC',
//               marginRight: '10px',
//               '&:hover': {
//                 backgroundColor: '#bfa7d7',
//               },
//             }}
//             onClick={() => handleShowModal(false)}
//           >
//             Add User
//           </Button>
//           <TableComponent
//             users={users}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             handleChangePage={handleChangePage}
//             handleChangeRowsPerPage={handleChangeRowsPerPage}
//             handleEdit={handleEdit}
//           />

//           <Dialog open={showModal} onClose={handleCloseModal}>
//             <DialogTitle sx={{ backgroundColor: "#E6E1EB" }}>
//               {userData.id ? "Edit User" : "Add User"}
//             </DialogTitle>
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseModal}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//                 backgroundColor: '',  
//                 '&:hover': {
//                   backgroundColor: 'red', 
//                 },
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//             <DialogContent>
//               <TextField
//                 name="name"
//                 label="Full Name"
//                 value={userData.name}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.name}
//                 helperText={errors.name}
//               />
//               <TextField
//                 name="emailID"
//                 label="Email"
//                 value={userData.emailID}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.emailID}
//                 helperText={errors.emailID}
//               />
//               <TextField
//                 name="contactNo"
//                 label="Contact No."
//                 type="number"
//                 value={userData.contactNo}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.contactNo}
//                 helperText={errors.contactNo}
//               />
//               <TextField
//                 name="pasword"
//                 label="Password"
//                 type="password"
//                 value={userData.pasword}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.pasword}
//                 helperText={errors.pasword}
//               />
//               <TextField
//                 select
//                 name="userType"
//                 label="Select User Type"
//                 value={userData.userType}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 error={!!errors.userType}
//                 helperText={errors.userType}
//                 sx={{ margin: '20px 0' }}
//               >
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="user">User</MenuItem>
//               </TextField>

//               <Autocomplete
//                 multiple
//                 options={accessPages}
//                 value={selectedValues}
//                 onChange={(event, newValue) => {
//                   if (Array.isArray(newValue)) {
//                     setSelectedValues(newValue);
//                   }
//                 }}
//                 disableCloseOnSelect
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} style={{ marginRight: 8 }} />
//                     {option}
//                   </li>
//                 )}
//                 renderInput={(params) => (
//                   <TextField {...params} variant="outlined" label="Access Pages" fullWidth />
//                 )}
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedValues.length === accessPages.length}
//                     onChange={handleSelectAll}
//                     color="primary"
//                   />
//                 }
//                 label="Select All"
//               />
//             </DialogContent>
//             <DialogActions>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   justifyContent: 'space-around',
//                   gap: 2, 
//                   mt: 2 
//                 }}
//               >
//                 <Button onClick={handleCloseModal}>Cancel</Button>
//                 <Button onClick={handleFormSubmit}>
//                   {userData.id ? "Update" : "Add"}
//                 </Button>
//               </Box>
//             </DialogActions>
//           </Dialog>
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default AddUser;











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
import { API_BASE_URL } from "../../Data";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const accessPages = ["Application", "Labour Details", "Add User", "Project Machine", "Attendance Report", "Wages Report", "People", "Admin Approval", "Site Transfer", "Variable Input", "Salary Register", "Salary Generation", "Run PayRoll", "View Payroll"];

const AddUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    emailID: "",
    contactNo: "",
    pasword: "",
    plainPassword: "",
    userType: "user",
    isApproved: false,
    accessPages: [],
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchUsers();
  }, []); 

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE_URL + `/users/getAllUsers`, {
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

  const filterUsers = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(lowercasedQuery) || 
      user.emailID.toLowerCase().includes(lowercasedQuery) || 
      user.contactNo.includes(lowercasedQuery)
    );
    setFilteredUsers(filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to the first page on new search
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
        setUserData((prevUserData) => ({
          ...prevUserData,
          plainPassword: value,
        }));
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
      plainPassword: "",
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
            const url = API_BASE_URL +`/users/${endpoint}`;

            const payload = {
                ...userData,
                id: userData.id ? parseInt(userData.id, 10) : undefined, 
                accessPages: selectedValues,
                isApproved: userData.isApproved,
            };

            if (!userData.id) {
              payload.CreatedAt = new Date().toISOString();
              payload.userToken = uuidv4();
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
                toast.success(userData.pasword ? "User and Password successfully saved" : "User successfully saved");
            } else {
                setErrors({ form: response.data.message });
                toast.error("Failed to save user");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({ form: "Error submitting form" });
            toast.error("Error submitting form");
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
    <Box py={2} px={1} sx={{ width: isMobile ? '96vw' : 'auto' }}>
      <ToastContainer />
      <div className="MainDash">
        <Typography variant="h5" mb={1}>
          Add User
        </Typography>
        <div className="Main-div">
          <Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
          <Button
            variant="contained"
            sx={{
              width: isMobile ? '30%' : '12%', height:'45px', mt:1,
              backgroundColor: '#EFE6F7',
              color: '#8236BC',
              marginRight: '10px',
              '&:hover': {
                backgroundColor: '#bfa7d7',
              },
            }}
            onClick={() => handleShowModal(false)}
          >
            Add User
          </Button>
          <TextField
          sx={{ml:5, width: isMobile ? '50%' : '40%',}}
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
          </Box>
          <TableComponent
            users={filteredUsers}
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
                <MenuItem value="superadmin">Super Admin</MenuItem>
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  justifyContent: 'space-around',
                  gap: 2, 
                  mt: 2 
                }}
              >
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleFormSubmit}>
                  {userData.id ? "Update" : "Add"}
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Box>
  );
};

export default AddUser;











// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   IconButton,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import TableComponent from "./TableComponent";
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { API_BASE_URL } from "../../Data";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const accessPages = ["Application", "Labour Details", "Add User", "Approved Labours"];

// const AddUser = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [userData, setUserData] = useState({
//     id: null,
//     name: "",
//     emailID: "",
//     contactNo: "",
//     pasword: "",
//     plainPassword: "",
//     userType: "user",
//     isApproved: false,
//     accessPages: [],
//   });
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     fetchUsers();
//   }, []); 

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(API_BASE_URL +`/users/getAllUsers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setUsers(response.data.data); 
//       } else {
//         console.error("Failed to fetch users:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     switch (name) {
//       case "contactNo":
//         if (value.length === 10) {
//           setErrors((prevErrors) => ({ ...prevErrors, contactNo: "" }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             contactNo: "Mobile number must be 10 digits",
//           }));
//         }
//         break;
//       case "emailID":
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (emailPattern.test(value)) {
//           setErrors((prevErrors) => ({ ...prevErrors, emailID: "" }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             emailID: "Invalid email format",
//           }));
//         }
//         break;
//       case "name":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, name: "Name is required" } : { ...prevErrors, name: "" }
//         );
//         break;
//       case "pasword":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, pasword: "Password is required" } : { ...prevErrors, pasword: "" }
//         );
//         setUserData((prevUserData) => ({
//           ...prevUserData,
//           plainPassword: value,
//         }));
//         break;
//       case "userType":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, userType: "User type is required" } : { ...prevErrors, userType: "" }
//         );
//         break;
//       default:
//         break;
//     }

//     setUserData((prevUserData) => ({
//       ...prevUserData,
//       [name]: value,
//     }));
//   };

//   const handleSelectAll = (event) => {
//     setSelectedValues(event.target.checked ? accessPages : []);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedValues([]);
//     setUserData({
//       id: null,
//       name: "",
//       emailID: "",
//       contactNo: "",
//       pasword: "",
//       plainPassword: "",
//       userType: "user",
//       isApproved: false,
//       accessPages: [],
//     });
//   };

//   const handleShowModal = (edit = false, user = null) => {
//     setShowModal(true);
//     if (edit && user) {
//       setUserData(user);
//       setSelectedValues(Array.isArray(user.accessPages) ? user.accessPages : []);
//     }
//   };

//   const handleFormSubmit = async () => {
//     const newErrors = {};
//     if (!userData.name) newErrors.name = "Name is required";
//     if (!userData.emailID) newErrors.emailID = "Email is required";
//     if (!userData.contactNo) newErrors.contactNo = "Contact number is required";
//     if (userData.contactNo && userData.contactNo.length !== 10)
//         newErrors.contactNo = "Contact number must be 10 digits";
//     if (!userData.pasword && !userData.id) newErrors.pasword = "Password is required"; 
//     if (!userData.userType) newErrors.userType = "User type is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//         try {
//             const token = localStorage.getItem("token");
//             const endpoint = userData.id ? "updateUser" : "registerUser";
//             const method = userData.id ? "put" : "post";
//             const url = API_BASE_URL +`/users/${endpoint}`;

//             const payload = {
//                 ...userData,
//                 id: userData.id ? parseInt(userData.id, 10) : undefined, 
//                 accessPages: selectedValues,
//                 isApproved: userData.isApproved,
//             };

//             if (!userData.id) {
//               payload.CreatedAt = new Date().toISOString();
//               payload.userToken = uuidv4();
//           }

//             const response = await axios({
//                 method,
//                 url,
//                 data: payload,
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 200 || response.status === 201) {
//                 const updatedUser = {
//                     ...userData,
//                     id: userData.id || uuidv4(),
//                     accessPages: selectedValues,
//                 };

//                 setUsers((prevUsers) => {
//                     if (userData.id) {
//                         return prevUsers.map((user) => (user.id === userData.id ? updatedUser : user));
//                     } else {
//                         return [updatedUser, ...prevUsers];
//                     }
//                 });

//                 handleCloseModal();
//                 toast.success(userData.pasword ? "User and Password successfully saved" : "User successfully saved");
//             } else {
//                 setErrors({ form: response.data.message });
//                 toast.error("Failed to save user");
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             setErrors({ form: "Error submitting form" });
//             toast.error("Error submitting form");
//         }
//     }
// };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleEdit = (user) => {
//     handleShowModal(true, user);
//   };

//   return (
//     <Box py={2} px={1} sx={{ width: isMobile ? '96vw' : 'auto' }}>
//       <ToastContainer />
//       <div className="MainDash">
//         <Typography variant="h5" mb={1}>
//           Add User
//         </Typography>
//         <div className="Main-div">
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#EFE6F7',
//               color: '#8236BC',
//               marginRight: '10px',
//               '&:hover': {
//                 backgroundColor: '#bfa7d7',
//               },
//             }}
//             onClick={() => handleShowModal(false)}
//           >
//             Add User
//           </Button>
//           <TableComponent
//             users={users}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             handleChangePage={handleChangePage}
//             handleChangeRowsPerPage={handleChangeRowsPerPage}
//             handleEdit={handleEdit}
//           />

//           <Dialog open={showModal} onClose={handleCloseModal}>
//             <DialogTitle sx={{ backgroundColor: "#E6E1EB" }}>
//               {userData.id ? "Edit User" : "Add User"}
//             </DialogTitle>
//             <IconButton
//               aria-label="close"
//               onClick={handleCloseModal}
//               sx={{
//                 position: "absolute",
//                 right: 8,
//                 top: 8,
//                 color: (theme) => theme.palette.grey[500],
//                 backgroundColor: '',  
//                 '&:hover': {
//                   backgroundColor: 'red', 
//                 },
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//             <DialogContent>
//               <TextField
//                 name="name"
//                 label="Full Name"
//                 value={userData.name}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.name}
//                 helperText={errors.name}
//               />
//               <TextField
//                 name="emailID"
//                 label="Email"
//                 value={userData.emailID}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.emailID}
//                 helperText={errors.emailID}
//               />
//               <TextField
//                 name="contactNo"
//                 label="Contact No."
//                 type="number"
//                 value={userData.contactNo}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.contactNo}
//                 helperText={errors.contactNo}
//               />
//               <TextField
//                 name="pasword"
//                 label="Password"
//                 type="password"
//                 value={userData.pasword}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.pasword}
//                 helperText={errors.pasword}
//               />
//               <TextField
//                 select
//                 name="userType"
//                 label="Select User Type"
//                 value={userData.userType}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 error={!!errors.userType}
//                 helperText={errors.userType}
//                 sx={{ margin: '20px 0' }}
//               >
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="user">User</MenuItem>
//               </TextField>

//               <Autocomplete
//                 multiple
//                 options={accessPages}
//                 value={selectedValues}
//                 onChange={(event, newValue) => {
//                   if (Array.isArray(newValue)) {
//                     setSelectedValues(newValue);
//                   }
//                 }}
//                 disableCloseOnSelect
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} style={{ marginRight: 8 }} />
//                     {option}
//                   </li>
//                 )}
//                 renderInput={(params) => (
//                   <TextField {...params} variant="outlined" label="Access Pages" fullWidth />
//                 )}
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedValues.length === accessPages.length}
//                     onChange={handleSelectAll}
//                     color="primary"
//                   />
//                 }
//                 label="Select All"
//               />
//             </DialogContent>
//             <DialogActions>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   justifyContent: 'space-around',
//                   gap: 2, 
//                   mt: 2 
//                 }}
//               >
//                 <Button onClick={handleCloseModal}>Cancel</Button>
//                 <Button onClick={handleFormSubmit}>
//                   {userData.id ? "Update" : "Add"}
//                 </Button>
//               </Box>
//             </DialogActions>
//           </Dialog>
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default AddUser;












// import React, { useState, useEffect } from "react";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   IconButton,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import TableComponent from "./TableComponent";
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import {API_BASE_URL} from "../../Data"

// const accessPages = ["Application", "Labour Details", "Add User", "Approved Labours"];

// const AddUser = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [userData, setUserData] = useState({
//     id: null,
//     name: "",
//     emailID: "",
//     contactNo: "",
//     pasword: "",
//     plainPassword: "",
//     userType: "user",
//     isApproved: false,
//     accessPages: [],
//   });
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     fetchUsers();
//   }, []); 

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(API_BASE_URL +`/users/getAllUsers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setUsers(response.data.data); 
//       } else {
//         console.error("Failed to fetch users:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     switch (name) {
//       case "contactNo":
//         if (value.length === 10) {
//           setErrors((prevErrors) => ({ ...prevErrors, contactNo: "" }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             contactNo: "Mobile number must be 10 digits",
//           }));
//         }
//         break;
//       case "emailID":
//         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (emailPattern.test(value)) {
//           setErrors((prevErrors) => ({ ...prevErrors, emailID: "" }));
//         } else {
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             emailID: "Invalid email format",
//           }));
//         }
//         break;
//       case "name":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, name: "Name is required" } : { ...prevErrors, name: "" }
//         );
//         break;
//       case "pasword":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, pasword: "Password is required" } : { ...prevErrors, pasword: "" }
//         );
//         setUserData((prevUserData) => ({
//           ...prevUserData,
//           plainPassword: value,
//         }));
//         break;
//       case "userType":
//         setErrors((prevErrors) =>
//           value.trim() === "" ? { ...prevErrors, userType: "User type is required" } : { ...prevErrors, userType: "" }
//         );
//         break;
//       default:
//         break;
//     }

//     setUserData((prevUserData) => ({
//       ...prevUserData,
//       [name]: value,
//     }));
//   };

//   const handleSelectAll = (event) => {
//     setSelectedValues(event.target.checked ? accessPages : []);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedValues([]);
//     setUserData({
//       id: null,
//       name: "",
//       emailID: "",
//       contactNo: "",
//       pasword: "",
//       plainPassword: "",
//       userType: "user",
//       isApproved: false,
//       accessPages: [],
//     });
//   };

//   const handleShowModal = (edit = false, user = null) => {
//     setShowModal(true);
//     if (edit && user) {
//       setUserData(user);
//       setSelectedValues(Array.isArray(user.accessPages) ? user.accessPages : []);
//     }
//   };

//   const handleFormSubmit = async () => {
//     const newErrors = {};
//     if (!userData.name) newErrors.name = "Name is required";
//     if (!userData.emailID) newErrors.emailID = "Email is required";
//     if (!userData.contactNo) newErrors.contactNo = "Contact number is required";
//     if (userData.contactNo && userData.contactNo.length !== 10)
//         newErrors.contactNo = "Contact number must be 10 digits";
//     if (!userData.pasword && !userData.id) newErrors.pasword = "Password is required"; 
//     if (!userData.userType) newErrors.userType = "User type is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//         try {
//             const token = localStorage.getItem("token");
//             const endpoint = userData.id ? "updateUser" : "registerUser";
//             const method = userData.id ? "put" : "post";
//             const url = API_BASE_URL +`/users/${endpoint}`;

//             const payload = {
//                 ...userData,
//                 id: userData.id ? parseInt(userData.id, 10) : undefined, 
//                 accessPages: selectedValues,
//                 isApproved: userData.isApproved,
//             };

//             // if (userData.id) {
//             //     delete payload.pasword;
//             // } else {
//             //     payload.CreatedAt = new Date().toISOString();
//             //     payload.userToken = "someRandomToken";
//             // }

//             if (!userData.id) {
//               payload.CreatedAt = new Date().toISOString();
//               payload.userToken = uuidv4();
//           }


//             const response = await axios({
//                 method,
//                 url,
//                 data: payload,
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 200 || response.status === 201) {
//                 const updatedUser = {
//                     ...userData,
//                     id: userData.id || uuidv4(),
//                     accessPages: selectedValues,
//                 };

//                 setUsers((prevUsers) => {
//                     if (userData.id) {
//                         return prevUsers.map((user) => (user.id === userData.id ? updatedUser : user));
//                     } else {
//                         return [updatedUser, ...prevUsers];
//                     }
//                 });

//                 handleCloseModal(); 
//             } else {
//                 setErrors({ form: response.data.message });
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             setErrors({ form: "Error submitting form" });
//         }
//     }
// };
  

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleEdit = (user) => {
//     handleShowModal(true, user);
//   };

//   return (
//     <Box py={2} px={1} sx={{ width: isMobile ? '96vw' : 'auto' }}>
//       <div className="MainDash">
//         <Typography variant="h5" mb={1}>
//           Add User
//         </Typography>
//         <div className="Main-div">
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#EFE6F7',
//               color: '#8236BC',
//               marginRight: '10px',
//               '&:hover': {
//                 backgroundColor: '#bfa7d7',
//               },
//             }}
//             onClick={() => handleShowModal(false)}
//             // style={{ marginBottom: 20 }}
//           >
//             Add User
//           </Button>
//           <TableComponent
//             users={users}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             handleChangePage={handleChangePage}
//             handleChangeRowsPerPage={handleChangeRowsPerPage}
//             handleEdit={handleEdit}
//           />

//           <Dialog open={showModal} onClose={handleCloseModal}>
//             <DialogTitle sx={{ backgroundColor: "#E6E1EB" }}>
//               {userData.id ? "Edit User" : "Add User"}
//             </DialogTitle>
//             <IconButton
//   aria-label="close"
//   onClick={handleCloseModal}
//   sx={{
//     position: "absolute",
//     right: 8,
//     top: 8,
//     color: (theme) => theme.palette.grey[500],
//     backgroundColor: '',  
//     '&:hover': {
//       backgroundColor: 'red', 
//     },
//   }}
// >
//               <CloseIcon />
//             </IconButton>
//             <DialogContent>
//               <TextField
//                 name="name"
//                 label="Full Name"
//                 value={userData.name}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.name}
//                 helperText={errors.name}
//               />
//               <TextField
//                 name="emailID"
//                 label="Email"
//                 value={userData.emailID}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.emailID}
//                 helperText={errors.emailID}
//               />
//               <TextField
//                 name="contactNo"
//                 label="Contact No."
//                 type="number"
//                 value={userData.contactNo}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.contactNo}
//                 helperText={errors.contactNo}
//               />
//               <TextField
//                 name="pasword"
//                 label="Password"
//                 type="password"
//                 value={userData.pasword}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.pasword}
//                 helperText={errors.pasword}
//               />
//               <TextField
//                 select
//                 name="userType"
//                 label="Select User Type"
//                 value={userData.userType}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 error={!!errors.userType}
//                 helperText={errors.userType}
//                 sx={{ margin: '20px 0' }}
//               >
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="user">User</MenuItem>
//               </TextField>

//               <Autocomplete
//                 multiple
//                 options={accessPages}
//                 value={selectedValues}
//                 onChange={(event, newValue) => {
//                   if (Array.isArray(newValue)) {
//                     setSelectedValues(newValue);
//                   }
//                 }}
//                 disableCloseOnSelect
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} style={{ marginRight: 8 }} />
//                     {option}
//                   </li>
//                 )}
//                 renderInput={(params) => (
//                   <TextField {...params} variant="outlined" label="Access Pages" fullWidth />
//                 )}
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedValues.length === accessPages.length}
//                     onChange={handleSelectAll}
//                     color="primary"
//                   />
//                 }
//                 label="Select All"
//               />
//             </DialogContent>
//             <DialogActions>
//             <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         justifyContent: 'space-around',
//         gap: 2, 
//         mt: 2 
//       }}
//     >
//               <Button onClick={handleCloseModal}>Cancel</Button>
//               <Button
//                 onClick={handleFormSubmit}
//                 // variant="contained"
//               >
//                 {userData.id ? "Update" : "Add"}
//               </Button>
//               </Box>
//             </DialogActions>
//           </Dialog>
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default AddUser;
