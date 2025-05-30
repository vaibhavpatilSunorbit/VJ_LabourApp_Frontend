
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
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { API_BASE_URL } from "../../Data";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const accessPages = [
//   "Dashboard",
//   "Application",
//   "Labour Details",
//   "Add User",
//   "Project Machine",
//   "Attendance Report",
//   "Wages Report",
//   "Admin Approval",
//   "Site Transfer",
//   "Variable Input",
//   "Salary Register",
//   "Run PayRoll",
//   "View Payroll",
 
//   // "Salary Generation",
//   // "People",
// ];

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
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [searchQuery, setSearchQuery] = useState("");
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const [departments, setDepartments] = useState([]);
//   const [projectNames, setProjectNames] = useState([]);
//   const [accessPagesAdd, setAccessPagesAdd] = useState([]);
//   const [selectedDeparmentsIds, setSelectedDeparmentsIds] = useState([]);
//   const [selectedProjectIds, setSelectedProjectIds] = useState([]);
//   let fetchDepartmentsAndProjects;

//   if (projectNames) {
//     console.log("projectNames", projectNames);
//     console.log("departments", departments);
//   }

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [searchQuery, users, page, rowsPerPage]);

//   useEffect(() => {
//     fetchDepartmentsAndProjects = async () => {
//       try {
//         const departmentsRes = await axios.get(
//           API_BASE_URL + "/api/departments"
//         );
//         setDepartments(departmentsRes.data);

//         const projectsRes = await axios.get(
//           API_BASE_URL + "/api/project-names"
//         );
//         setProjectNames(projectsRes.data);
//       } catch (err) {
//         console.error("Error fetching departments or projects:", err);
//       }
//     };

//     fetchDepartmentsAndProjects();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(API_BASE_URL + `/users/getAllUsers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setUsers(response.data.data);
//         setAccessPagesAdd(JSON.parse(response.data.data.accessPages));
//       } else {
//         console.error("Failed to fetch users:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const filterUsers = () => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = users.filter(
//       (user) =>
//         user.name.toLowerCase().includes(lowercasedQuery) ||
//         user.emailID.toLowerCase().includes(lowercasedQuery) ||
//         user.contactNo.includes(lowercasedQuery)
//     );
//     setFilteredUsers(
//       filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//     );
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     setPage(0); // Reset to the first page on new search
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
//           value.trim() === ""
//             ? { ...prevErrors, name: "Name is required" }
//             : { ...prevErrors, name: "" }
//         );
//         break;
//       case "pasword":
//         setErrors((prevErrors) =>
//           value.trim() === ""
//             ? { ...prevErrors, pasword: "Password is required" }
//             : { ...prevErrors, pasword: "" }
//         );
//         setUserData((prevUserData) => ({
//           ...prevUserData,
//           plainPassword: value,
//         }));
//         break;
//       case "userType":
//         setErrors((prevErrors) =>
//           value.trim() === ""
//             ? { ...prevErrors, userType: "User type is required" }
//             : { ...prevErrors, userType: "" }
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
//       console.log("user : ", user)
//       setUserData(user);
//       setSelectedValues(
//         user.accessPages ? JSON.parse(user.accessPages) : []
//       );

//       const assignedDepts = user.assigned_departments ? JSON.parse(user.assigned_departments) : [];
//       const assignedProjs = user.assigned_projects ? JSON.parse(user.assigned_projects) : [];
//       // const assignedAccessPages = user.accessPages ? JSON.parse(user.accessPages) : [];

//       const selectedDeptObjects = departments.filter((dept) => assignedDepts.includes(dept.Id));
//       const selectedProjObjects = projectNames.filter((proj) => assignedProjs.includes(proj.Id));
//       // const selectedAcessPages = accessPagesAdd.filter((acc) => assignedAccessPages.includes([]));

//       setSelectedDeparmentsIds(assignedDepts);
//       setSelectedProjectIds(assignedProjs);

//       console.log("Selected Departments (IDs):", assignedDepts);
//       console.log("Selected Projects (IDs):", assignedProjs);
//       console.log("Matching Department Names:", selectedDeptObjects);
//       console.log("Matching Project Names:", selectedProjObjects);
//     }
//   };


//   const handleFormSubmit = async () => {
//     const newErrors = {};
//     if (!userData.name) newErrors.name = "Name is required";
//     if (!userData.emailID) newErrors.emailID = "Email is required";
//     if (!userData.contactNo) newErrors.contactNo = "Contact number is required";
//     if (userData.contactNo && userData.contactNo.length !== 10)
//       newErrors.contactNo = "Contact number must be 10 digits";
//     if (!userData.pasword && !userData.id)
//       newErrors.pasword = "Password is required";
//     if (!userData.userType) newErrors.userType = "User type is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       try {
//         const token = localStorage.getItem("token");
//         const endpoint = userData.id ? "updateUser" : "registerUser";
//         const method = userData.id ? "put" : "post";
//         const url = API_BASE_URL + `/users/${endpoint}`;

//         const payload = {
//           ...userData,
//           id: userData.id ? parseInt(userData.id, 10) : undefined,
//           accessPages: selectedValues, // Existing access pages
//           selectedDeparmentsIds, // Send selected department IDs
//           selectedProjectIds, // Send selected project IDs
//           isApproved: userData.isApproved,
//         };

//         if (!userData.id) {
//           payload.CreatedAt = new Date().toISOString();
//           payload.userToken = uuidv4();
//         }

//         const response = await axios({
//           method,
//           url,
//           data: payload,
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 200 || response.status === 201) {
//           const updatedUser = {
//             ...userData,
//             id: userData.id || uuidv4(),
//             accessPages: selectedValues,
//             selectedDeparmentsIds, // Ensure state consistency
//             selectedProjectIds,
//           };

//           setUsers((prevUsers) => {
//             if (userData.id) {
//               return prevUsers.map((user) =>
//                 user.id === userData.id ? updatedUser : user
//               );
//             } else {
//               return [updatedUser, ...prevUsers];
//             }
//           });
//           setSelectedDeparmentsIds([]);
//           setSelectedProjectIds([]);
//           handleCloseModal();
//           fetchUsers();
//           toast.success(
//             userData.pasword
//               ? "User and Password successfully saved"
//               : "User successfully saved"
//           );
//         } else {
//           setErrors({ form: response.data.message });
//           toast.error("Failed to save user");
//         }
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setErrors({ form: "Error submitting form" });
//         toast.error("Error submitting form");
//       }
//     }
//   };


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
//     <Box py={2} px={1} sx={{ width: isMobile ? "96vw" : "auto" }}>
//       <ToastContainer />
//       <div className="MainDash">
//         <Typography variant="h5" mb={1}>
//           Add User
//         </Typography>
//         <div className="Main-div">
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Button
//               variant="contained"
//               sx={{
//                 width: isMobile ? "30%" : "12%",
//                 height: "45px",
//                 mt: 1,
//                 backgroundColor: "#EFE6F7",
//                 color: "#8236BC",
//                 marginRight: "10px",
//                 "&:hover": {
//                   backgroundColor: "#bfa7d7",
//                 },
//               }}
//               onClick={() => handleShowModal(false)}
//             >
//               Add User
//             </Button>
//             <TextField
//               sx={{ ml: 5, width: isMobile ? "50%" : "40%" }}
//               label="Search"
//               variant="outlined"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               fullWidth
//               margin="normal"
//             />
//           </Box>
//           <TableComponent
//             users={filteredUsers}
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
//                 backgroundColor: "",
//                 "&:hover": {
//                   backgroundColor: "red",
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

//               <Autocomplete
//                 multiple
//                 style={{ margin: '25px 0px' }}
//                 options={departments}
//                 getOptionLabel={(option) => option.Description} // Display department names
//                 value={departments.filter((dept) => selectedDeparmentsIds.includes(dept.Id))} // Prefill selected IDs
//                 onChange={(event, newValue) => {
//                   const selectedIdsOnly = newValue.map((dept) => dept.Id);
//                   setSelectedDeparmentsIds(selectedIdsOnly);
//                 }}
//                 disableCloseOnSelect
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} style={{ marginRight: 8 }} />
//                     {option.Description} {/* Show Name */}
//                   </li>
//                 )}
//                 renderInput={(params) => (
//                   <TextField {...params} variant="outlined" label="Departments" fullWidth />
//                 )}
//               />

//               <Autocomplete
//                 multiple
//                 options={projectNames}
//                 getOptionLabel={(option) => option.Business_Unit} // Display project names
//                 value={projectNames.filter((proj) => selectedProjectIds.includes(proj.Id))} // Prefill selected IDs
//                 onChange={(event, newValue) => {
//                   const selectedIdsOnly = newValue.map((proj) => proj.Id);
//                   setSelectedProjectIds(selectedIdsOnly);
//                 }}
//                 disableCloseOnSelect
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props}>
//                     <Checkbox checked={selected} style={{ marginRight: 8 }} />
//                     {option.Business_Unit} {/* Show Name */}
//                   </li>
//                 )}
//                 renderInput={(params) => (
//                   <TextField {...params} variant="outlined" label="Project Names" fullWidth />
//                 )}
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
//                 sx={{ margin: "20px 0" }}
//               >
//                 <MenuItem value="superadmin">Super Admin</MenuItem>
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="user">User</MenuItem>
//               </TextField>

//               <Autocomplete
//                 multiple
//                 options={accessPages}
//                 value={selectedValues}
//                 // value={accessPagesAdd.filter((acc) => selectedProjectIds.includes(proj.Id))} 
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
//                   <TextField
//                     {...params}
//                     variant="outlined"
//                     label="Access Pages"
//                     fullWidth
//                   />
//                 )}
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedValues.length === accessPages.length}
//                     onChange={handleSelectAll}
//                     color="primary"
//                     indeterminate={
//                       selectedValues.length > 0 && selectedValues.length < accessPages.length
//                     }
//                   />
//                 }
//                 label="Select All"
//               />
//             </DialogContent>
//             <DialogActions>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   justifyContent: "space-around",
//                   gap: 2,
//                   mt: 2,
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
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Stack,
  Paper,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SecurityIcon from "@mui/icons-material/Security";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import TableComponent from "./TableComponent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { API_BASE_URL } from "../../Data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const accessPages = [
  "Dashboard",
  "Application",
  "Labour Details",
  "Add User",
  "Project Machine",
  "Attendance Report",
  "Wages Report",
  "Admin Approval",
  "Site Transfer",
  "Variable Input",
  "Salary Register",
  "Run PayRoll",
  "View Payroll",
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [departments, setDepartments] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [accessPagesAdd, setAccessPagesAdd] = useState([]);
  const [selectedDeparmentsIds, setSelectedDeparmentsIds] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);

  let fetchDepartmentsAndProjects;

  if (projectNames) {
    console.log("projectNames", projectNames);
    console.log("departments", departments);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, page, rowsPerPage]);

  useEffect(() => {
    fetchDepartmentsAndProjects = async () => {
      try {
        const departmentsRes = await axios.get(
          API_BASE_URL + "/api/departments"
        );
        setDepartments(departmentsRes.data);
        const projectsRes = await axios.get(
          API_BASE_URL + "/api/project-names"
        );
        setProjectNames(projectsRes.data);
      } catch (err) {
        console.error("Error fetching departments or projects:", err);
      }
    };
    fetchDepartmentsAndProjects();
  }, []);

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
        setAccessPagesAdd(JSON.parse(response.data.data.accessPages));
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterUsers = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.emailID.toLowerCase().includes(lowercasedQuery) ||
        user.contactNo.includes(lowercasedQuery)
    );
    setFilteredUsers(
      filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
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
          value.trim() === ""
            ? { ...prevErrors, name: "Name is required" }
            : { ...prevErrors, name: "" }
        );
        break;
      case "pasword":
        setErrors((prevErrors) =>
          value.trim() === ""
            ? { ...prevErrors, pasword: "Password is required" }
            : { ...prevErrors, pasword: "" }
        );
        setUserData((prevUserData) => ({
          ...prevUserData,
          plainPassword: value,
        }));
        break;
      case "userType":
        setErrors((prevErrors) =>
          value.trim() === ""
            ? { ...prevErrors, userType: "User type is required" }
            : { ...prevErrors, userType: "" }
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
      console.log("user : ", user);
      setUserData(user);
      setSelectedValues(
        user.accessPages ? JSON.parse(user.accessPages) : []
      );
      const assignedDepts = user.assigned_departments
        ? JSON.parse(user.assigned_departments)
        : [];
      const assignedProjs = user.assigned_projects
        ? JSON.parse(user.assigned_projects)
        : [];

      const selectedDeptObjects = departments.filter((dept) =>
        assignedDepts.includes(dept.Id)
      );
      const selectedProjObjects = projectNames.filter((proj) =>
        assignedProjs.includes(proj.Id)
      );

      setSelectedDeparmentsIds(assignedDepts);
      setSelectedProjectIds(assignedProjs);
      console.log("Selected Departments (IDs):", assignedDepts);
      console.log("Selected Projects (IDs):", assignedProjs);
      console.log("Matching Department Names:", selectedDeptObjects);
      console.log("Matching Project Names:", selectedProjObjects);
    }
  };

  const handleFormSubmit = async () => {
    const newErrors = {};
    if (!userData.name) newErrors.name = "Name is required";
    if (!userData.emailID) newErrors.emailID = "Email is required";
    if (!userData.contactNo) newErrors.contactNo = "Contact number is required";
    if (userData.contactNo && userData.contactNo.length !== 10)
      newErrors.contactNo = "Contact number must be 10 digits";
    if (!userData.pasword && !userData.id)
      newErrors.pasword = "Password is required";
    if (!userData.userType) newErrors.userType = "User type is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const token = localStorage.getItem("token");
        const endpoint = userData.id ? "updateUser" : "registerUser";
        const method = userData.id ? "put" : "post";
        const url = API_BASE_URL + `/users/${endpoint}`;
        const payload = {
          ...userData,
          id: userData.id ? parseInt(userData.id, 10) : undefined,
          accessPages: selectedValues,
          selectedDeparmentsIds,
          selectedProjectIds,
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
            selectedDeparmentsIds,
            selectedProjectIds,
          };

          setUsers((prevUsers) => {
            if (userData.id) {
              return prevUsers.map((user) =>
                user.id === userData.id ? updatedUser : user
              );
            } else {
              return [updatedUser, ...prevUsers];
            }
          });

          setSelectedDeparmentsIds([]);
          setSelectedProjectIds([]);
          handleCloseModal();
          fetchUsers();
          toast.success(
            userData.pasword
              ? "User and Password successfully saved"
              : "User successfully saved"
          );
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
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <ToastContainer position="top-right" />
      
      {/* Header Section with Title, Add User Button, and Search in Single Row */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ fontSize: 32, color: "#8236BC", mr: 2 }} />
              <Box>
                <Typography variant="h5" fontWeight="600" color="#2c3e50">
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage users, assign roles, and control access permissions
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Add User Button */}
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => handleShowModal(false)}
              fullWidth={isMobile}
              sx={{
                backgroundColor: "#8236BC",
                color: "white",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(130, 54, 188, 0.3)",
                "&:hover": {
                  backgroundColor: "#6d2d99",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(130, 54, 188, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Add New User
            </Button>
          </Grid>

          {/* Search Bar */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or contact number..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <TableComponent
          users={filteredUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleEdit={handleEdit}
        />
      </Card>

      {/* Add/Edit User Modal */}
      <Dialog 
        open={showModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: "linear-gradient(135deg, #8236BC 0%, #9c4dcc 100%)",
            color: "white",
            py: 3,
            position: "relative"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonAddIcon sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="600">
              {userData.id ? "Edit User" : "Add New User"}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Personal Information
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Full Name"
                value={userData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="emailID"
                label="Email Address"
                value={userData.emailID}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.emailID}
                helperText={errors.emailID}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="contactNo"
                label="Contact Number"
                type="number"
                value={userData.contactNo}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.contactNo}
                helperText={errors.contactNo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="pasword"
                label="Password"
                type="password"
                value={userData.pasword}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.pasword}
                helperText={errors.pasword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Department and Project Assignment */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3, mt: 2 }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  Department & Project Assignment
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={departments}
                getOptionLabel={(option) => option.Description}
                value={departments.filter((dept) => selectedDeparmentsIds.includes(dept.Id))}
                onChange={(event, newValue) => {
                  const selectedIdsOnly = newValue.map((dept) => dept.Id);
                  setSelectedDeparmentsIds(selectedIdsOnly);
                }}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox 
                      checked={selected} 
                      style={{ marginRight: 8 }}
                      color="primary"
                    />
                    {option.Description}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    variant="outlined" 
                    label="Select Departments" 
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.Description}
                      {...getTagProps({ index })}
                      color="primary"
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={projectNames}
                getOptionLabel={(option) => option.Business_Unit}
                value={projectNames.filter((proj) => selectedProjectIds.includes(proj.Id))}
                onChange={(event, newValue) => {
                  const selectedIdsOnly = newValue.map((proj) => proj.Id);
                  setSelectedProjectIds(selectedIdsOnly);
                }}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox 
                      checked={selected} 
                      style={{ marginRight: 8 }}
                      color="primary"
                    />
                    {option.Business_Unit}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    variant="outlined" 
                    label="Select Projects" 
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.Business_Unit}
                      {...getTagProps({ index })}
                      color="secondary"
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            {/* User Role and Permissions */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3, mt: 2 }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  Role & Permissions
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                name="userType"
                label="User Role"
                value={userData.userType}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.userType}
                helperText={errors.userType}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="superadmin">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip 
                      label="Super Admin" 
                      size="small" 
                      sx={{ 
                        backgroundColor: "#f44336", 
                        color: "white",
                        mr: 1,
                        minWidth: 80
                      }} 
                    />
                    Full system access
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip 
                      label="Admin" 
                      size="small" 
                      sx={{ 
                        backgroundColor: "#ff9800", 
                        color: "white",
                        mr: 1,
                        minWidth: 80
                      }} 
                    />
                    Administrative access
                  </Box>
                </MenuItem>
                <MenuItem value="user">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip 
                      label="User" 
                      size="small" 
                      sx={{ 
                        backgroundColor: "#4caf50", 
                        color: "white",
                        mr: 1,
                        minWidth: 80
                      }} 
                    />
                    Standard user access
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedValues.length === accessPages.length}
                      onChange={handleSelectAll}
                      color="primary"
                      indeterminate={
                        selectedValues.length > 0 && selectedValues.length < accessPages.length
                      }
                    />
                  }
                  label={
                    <Typography variant="body1" fontWeight="500">
                      Select All Access Pages
                    </Typography>
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
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
                    <Checkbox 
                      checked={selected} 
                      style={{ marginRight: 8 }}
                      color="primary"
                    />
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Access Pages"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      color="info"
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            {/* Selected Access Pages Display */}
            {selectedValues.length > 0 && (
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: 2,
                    border: "1px solid #e9ecef"
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected Access Pages ({selectedValues.length})
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedValues.map((page, index) => (
                      <Chip
                        key={index}
                        label={page}
                        variant="filled"
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
          <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#8236BC",
                color: "#8236BC",
                "&:hover": {
                  borderColor: "#6d2d99",
                  backgroundColor: "rgba(130, 54, 188, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#8236BC",
                boxShadow: "0 4px 12px rgba(130, 54, 188, 0.3)",
                "&:hover": {
                  backgroundColor: "#6d2d99",
                  boxShadow: "0 6px 16px rgba(130, 54, 188, 0.4)",
                },
              }}
            >
              {userData.id ? "Update User" : "Create User"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddUser;





