import React, { useState, useRef, useEffect } from "react";
import { Container, Grid, Paper, Typography, TextField, Button } from "@mui/material";
import VJLogo from "../../images/VJLogo.png";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext/UserContext';
import axios from "axios";
import CustomPopup from "../CustomPopup/CustomPopup";
import { useLoader } from '../Context/LoaderContext/LoaderContext';
import { API_BASE_URL, accessPages } from "../../Data/Data";
import './Login.css'; // Add your custom styles here
import Loading from "../Loading/Loading";

const Login = () => {
  const { updateUser, logoutUser } = useUser();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("success");
  const { setIsLoading, isLoading } = useLoader();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        buttonRef.current.click();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const navigate = useNavigate();

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  function getOrderedAccessPages(userAccessPages) {
    return accessPages?.filter(page => userAccessPages?.includes(page));
  }

  const handleAccessPage = (page) => {
    switch (page) {
      case "Labour Application":
        navigate('/kyc');
        break;
      case "Add User":
        navigate('/adduser');
        break;
      case "Labour Details":
        navigate('/labourDetails');
        break;
      case "Approve Labours":
        navigate('/approveLabours');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  }

  const loginUser = () => {
    setIsLoading(true);

    const loginData = {
      emailId: userEmail,
      password: password
    };

    axios
      .post(API_BASE_URL + `/loginUser`, loginData)
      .then((response) => {
        console.log(response.data);
        updateUser(response.data.data);
        setOpenPopup(true);
        setPopupMessage("Login successful!");
        setPopupSeverity("success");
        const accessPages = getOrderedAccessPages(response?.data?.data?.accessPages);
        const isVendorPayment = response?.data?.data?.Is_Virtual_Dashboard;
        const isBankDashboard = response?.data?.data?.Is_Bank_Dashboard;

        if (isVendorPayment && isBankDashboard) {
          if (accessPages?.length !== 0 || accessPages !== null) {
            handleAccessPage(accessPages[0]);
          } else if (response?.data?.data?.userType === 'admin') {
            navigate('/dashboard');
          }
        } else if (isVendorPayment) {
          const redirectUrl = `https://vendorpayment.vjerp.com:8443/`;
          window.location.href = redirectUrl;
        } else {
          if (accessPages?.length !== 0 || accessPages !== null) {
            handleAccessPage(accessPages[0]);
          } else if (response?.data?.data?.userType === 'admin') {
            navigate('/dashboard');
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setOpenPopup(true);
        setPopupMessage("Login failed!");
        setPopupSeverity("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signUpUser = () => {
    setIsLoading(true);

    const signUpData = {
      emailId: userEmail,
      password: password
    };

    axios
      .post(API_BASE_URL + `/signUpUser`, signUpData)
      .then((response) => {
        console.log(response.data);
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
    logoutUser();
    navigate('/');
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Container maxWidth="sm">
        <Paper sx={{ padding: 4, marginTop: 8 }}>
          <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
            <Grid item>
              <img src={VJLogo} alt="VJ Logo" style={{ width: 200, height: 100 }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" component="h1" gutterBottom>
                Bank Dashboard
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <TextField fullWidth label="Enter Email" variant="outlined" onChange={(e) => setUserEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <TextField fullWidth label="Enter Password" type="password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Button ref={buttonRef} onClick={isSignUp ? signUpUser : loginUser} variant="contained" color="primary" fullWidth>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Button onClick={() => setIsSignUp(!isSignUp)} color="primary">
                {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Button onClick={handleLogout} variant="outlined" color="secondary" fullWidth>
                Logout
              </Button>
            </Grid>
          </Grid>
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

export default Login;
