// import React, { useState, useEffect } from "react";
// import { Container, Grid, Paper, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useUser } from '../../UserContext/UserContext'; // Adjust the path to UserContext
// import axios from "axios";
// import CustomPopup from "../CustomPopup/CustomPopup";
// import Loading from "../Loading/Loading";
// import "./Login.css"; // Import your CSS file for styles
// import { v4 as uuidv4 } from "uuid";
// import LogoImage from '../../images/VJlogo-1-removebg.png';

// const Login = () => {
//   const { updateUser } = useUser();
//   const [name, setName] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [contactNumber, setContactNumber] = useState(""); // Added state for contact number
//   const [userType, setUserType] = useState(""); // Update initial state for userType
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [openPopup, setOpenPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [popupSeverity, setPopupSeverity] = useState("success");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Logic to hide header and sidebar when accessed via "/"
//     if (location.pathname === "/") {
//       // Hide header and sidebar here (optional)
//     }
//   }, [location.pathname]);

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   const loginUser = () => {
//     setIsLoading(true);

//     const loginData = {
//       emailID: userEmail,
//       pasword: password
//     };

//     axios
//       .post('http://localhost:5000/users/loginUser', loginData)
//       .then((response) => {
//         console.log(response.data);
//         updateUser(response.data.data); // Assuming response.data.data contains user info
//         setOpenPopup(true);
//         setPopupMessage("Login successful!");
//         setPopupSeverity("success");
//         const token = response.data.token; // Assuming the server sends a token upon login
//         localStorage.setItem("token", token); // Store token in localStorage
//         navigate('/kyc'); 
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setOpenPopup(true);
//         setPopupMessage("Please Enter Correct Email and Password");
//         setPopupSeverity("error");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const signUpUser = () => {
//     setIsLoading(true);

//     const signUpData = {
//       name,
//       emailID: userEmail,
//       pasword: password,
//       contactNo : contactNumber, // Added contact number
//       userType,
//       CreatedAt: new Date().toISOString(),
//       userToken: uuidv4(), // assuming uuidv4 is imported
//       accessPages: [], // Adjust this field as per your requirement
//       isApproved: false // Adjust this field as per your requirement
//     };

//     axios
//       .post('http://localhost:5000/users/registerUser', signUpData)
//       .then((response) => {
//         console.log(response.data);
//         setOpenPopup(true);
//         setPopupMessage("Sign Up successful! Please log in.");
//         setPopupSeverity("success");
//         setIsSignUp(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setOpenPopup(true);
//         setPopupMessage("Sign Up failed!");
//         setPopupSeverity("error");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Clear token from localStorage
//     navigate('/');
//   };

//   return (
//     <div className="login-container">
//       {isLoading && <Loading />} {/* Display loading indicator */}
//       <Container maxWidth="sm">
//       <Paper className="login-paper">
//           <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
//             <Grid item>
//               {/* Logo image */}
//               <img src={LogoImage} alt="Logo" style={{ width: '250px', height: 'auto', marginBottom: '20px' }} />
//             </Grid>
//             <Grid item>
//               <Typography variant="h5" component="h1" gutterBottom>
//                 Labour Onboarding
//               </Typography>
//             </Grid>
//             {isSignUp && (
//               <Grid item xs={12} className="input-field">
//                 <TextField
//                   fullWidth
//                   label="Enter Name"
//                   variant="outlined"
//                   onChange={(e) => setName(e.target.value)}
//                   sx={{width: '270px'}}
//                 />
//               </Grid>
//             )}
//             <Grid item xs={12} className="input-field">
//               <TextField
//                 fullWidth
//                 label="Enter Email"
//                 variant="outlined"
//                 onChange={(e) => setUserEmail(e.target.value)}
//                 sx={{width: '270px'}}
//               />
//             </Grid>
//             <Grid item xs={12} className="input-field">
//               <TextField
//                 fullWidth
//                 label="Enter Password"
//                 type="password"
//                 variant="outlined"
//                 onChange={(e) => setPassword(e.target.value)}
//                 sx={{width: '270px'}}
//               />
//             </Grid>
//             {isSignUp && (
//               <Grid item xs={12} className="input-field">
//                 <TextField
//                   fullWidth
//                   label="Contact Number"
//                   variant="outlined"
//                   onChange={(e) => setContactNumber(e.target.value)}
//                   sx={{width: '270px'}}
//                 />
//               </Grid>
//             )}
//             {isSignUp && (
//               <Grid item xs={12} className="input-field">
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel>User Type</InputLabel>
//                   <Select
//                     value={userType}
//                     onChange={(e) => setUserType(e.target.value)}
//                     label="User Type"
//                     sx={{width: '270px'}}
//                   >
//                     <MenuItem value="admin">Admin</MenuItem>
//                     <MenuItem value="user">User</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             )}
//             <Grid item xs={12} className="button-container">
//               <Button onClick={isSignUp ? signUpUser : loginUser} variant="contained" color="primary" fullWidth>
//                 {isSignUp ? 'Sign Up' : 'Login'}
//               </Button>
//             </Grid>
//             <Grid item xs={12} className="switch-button-container">
//               {/* <Button onClick={() => setIsSignUp(!isSignUp)} color="primary">
//                 {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
//               </Button> */}
//             </Grid>
//             <Grid item xs={12} className="logout-button-container">
//               {/* <Button onClick={handleLogout} variant="outlined" color="secondary" fullWidth>
//                 Logout
//               </Button> */}
//             </Grid>
//           </Grid>
//         </Paper>
//         <CustomPopup
//           open={openPopup}
//           onClose={handleClosePopup}
//           message={popupMessage}
//           severity={popupSeverity}
//         />
//       </Container>
//     </div>
//   );
// };

// export default Login;












import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../UserContext/UserContext';
import axios from "axios";
import CustomPopup from "../CustomPopup/CustomPopup";
import Loading from "../Loading/Loading";
import "./Login.css";
import { v4 as uuidv4 } from "uuid";
import LogoImage from '../../images/VJlogo-1-removebg.png';
import Sidebar from '../Sidebar/Sidebar';
import { SidebarData } from '../../Data';

const Login = () => {
  const { updateUser, userRole, setUserAccessPages ,userAccessPages } = useUser();
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [formStatus, setFormStatus] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      // Hide header and sidebar here (optional)
    }
  }, [location.pathname]);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const loginUser = () => {
    setIsLoading(true);

    const loginData = {
      emailID: userEmail,
      pasword: password
    };

    axios
      .post('http://localhost:5000/users/loginUser', loginData)
      .then((response) => {
        const userData = response.data.data;
        updateUser(userData); // Update user context with user data
        setUserAccessPages(userData.accessPages); // Set user access pages in context
        setOpenPopup(true);
        setPopupMessage("Login successful!");
        setPopupSeverity("success");
        const token = response.data.token; 
        localStorage.setItem("token", token); 
        navigate('/kyc'); 
      })
      .catch((error) => {
        console.error("Error:", error);
        setOpenPopup(true);
        setPopupMessage("Please Enter Correct Email and Password");
        setPopupSeverity("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signUpUser = () => {
    setIsLoading(true);

    const signUpData = {
      name,
      emailID: userEmail,
      pasword: password,
      contactNo: contactNumber,
      userType,
      CreatedAt: new Date().toISOString(),
      userToken: uuidv4(),
      accessPages: [], 
      isApproved: false 
    };

    axios
      .post('http://localhost:5000/users/registerUser', signUpData)
      .then((response) => {
        setOpenPopup(true);
        setPopupMessage("Sign Up successful! Please log in.");
        setPopupSeverity("success");
        setIsSignUp(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setOpenPopup(true);
        setPopupMessage("Sign Up failed!");
        setPopupSeverity("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    <div className="login-container">
      {isLoading && <Loading />}
      <Container maxWidth="sm">
        <Paper className="login-paper">
          <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
            <Grid item>
              <img src={LogoImage} alt="Logo" style={{ width: '250px', height: 'auto', marginBottom: '20px' }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" component="h1" gutterBottom>
                Labour Onboarding
              </Typography>
            </Grid>
            {isSignUp && (
              <Grid item xs={12} className="input-field">
                <TextField label="Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{width: '270px'}}/>
              </Grid>
            )}
            <Grid item xs={12} className="input-field">
              <TextField label="Email" variant="outlined" fullWidth value={userEmail} onChange={(e) => setUserEmail(e.target.value)} sx={{width: '270px'}} />
            </Grid>
            <Grid item xs={12} className="input-field">
              <TextField label="Password" variant="outlined" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{width: '270px'}} />
            </Grid>
            {isSignUp && (
              <>
                <Grid item xs={12} className="input-field">
                  <TextField label="Contact Number" variant="outlined" fullWidth value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} sx={{width: '270px'}}/>
                </Grid>
                <Grid item xs={12} className="input-field">
                  <FormControl fullWidth>
                    <InputLabel>User Type</InputLabel>
                    <Select value={userType} onChange={(e) => setUserType(e.target.value)} label="User Type"  sx={{width: '270px'}}>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item>
              <Button variant="contained" color="primary" onClick={isSignUp ? signUpUser : loginUser}>
                {isSignUp ? "Sign Up" : "Login"}
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <Button color="secondary" onClick={() => setIsSignUp(false)}>
                      Login
                    </Button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <Button color="secondary" onClick={() => setIsSignUp(true)}>
                      Sign Up
                    </Button>
                  </span>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {/* <Sidebar 
        formStatus={formStatus} 
        openSidebarToggle={openSidebarToggle} 
        OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} 
        userAccessPages={userAccessPages} 
      /> */}
      <CustomPopup open={openPopup} message={popupMessage} severity={popupSeverity} handleClose={handleClosePopup} />
    </div>
  );
};

export default Login;























// import React, { useState, useEffect } from "react";
// import { Container, Grid, Paper, Typography, TextField, Button } from "@mui/material";
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useUser } from '../../UserContext/UserContext'; // Adjust the path to UserContext
// import axios from "axios";
// import CustomPopup from "../CustomPopup/CustomPopup";
// import Loading from "../Loading/Loading";
// import "./Login.css"; // Import your CSS file for styles
// import LogoImage from '../../images/VJlogo-1-removebg.png';

// const Login = () => {
//   const { updateUser } = useUser();
//   const [userEmail, setUserEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [openPopup, setOpenPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [popupSeverity, setPopupSeverity] = useState("success");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Logic to hide header and sidebar when accessed via "/"
//     if (location.pathname === "/") {
//       // Hide header and sidebar here (optional)
//     }
//   }, [location.pathname]);

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   const loginUser = () => {
//     setIsLoading(true);

//     const loginData = {
//       emailID: userEmail,
//       password: password // Corrected key name for password
//     };

//     axios
//       .post('http://localhost:5000/users/loginUser', loginData)
//       .then((response) => {
//         console.log(response.data);
//         updateUser(response.data.data); // Assuming response.data.data contains user info
//         setOpenPopup(true);
//         setPopupMessage("Login successful!");
//         setPopupSeverity("success");
//         const token = response.data.token; // Assuming the server sends a token upon login
//         localStorage.setItem("token", token); // Store token in localStorage
//         navigate('/kyc'); 
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setOpenPopup(true);
//         setPopupMessage("Please Enter Correct Email and Password");
//         setPopupSeverity("error");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Clear token from localStorage
//     navigate('/');
//   };

//   return (
//     <div className="login-container">
//       {isLoading && <Loading />} {/* Display loading indicator */}
//       <Container maxWidth="sm">
//         <Paper className="login-paper">
//           <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
//             <Grid item>
//               {/* Logo image */}
//               <img src={LogoImage} alt="Logo" style={{ width: '300px', height: 'auto', marginBottom: '20px' }} />
//             </Grid>
//             <Grid item>
//               <Typography variant="h5" component="h1" gutterBottom>
//                 Labour Onboarding
//               </Typography>
//             </Grid>
//             <Grid item xs={12} className="input-field">
//               <TextField
//                 fullWidth
//                 label="Enter Email"
//                 variant="outlined"
//                 onChange={(e) => setUserEmail(e.target.value)}
//                 sx={{width: '270px'}}
//               />
//             </Grid>
//             <Grid item xs={12} className="input-field">
//               <TextField
//                 fullWidth
//                 label="Enter Password"
//                 type="password"
//                 variant="outlined"
//                 onChange={(e) => setPassword(e.target.value)}
//                 sx={{width: '270px'}}
//               />
//             </Grid>
//             <Grid item xs={12} className="button-container">
//               <Button onClick={loginUser} variant="contained" color="primary" fullWidth>
//                 Login
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
//         <CustomPopup
//           open={openPopup}
//           onClose={handleClosePopup}
//           message={popupMessage}
//           severity={popupSeverity}
//         />
//       </Container>
//     </div>
//   );
// };

// export default Login;
