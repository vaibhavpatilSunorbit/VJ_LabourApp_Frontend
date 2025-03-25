

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../UserContext/UserContext';
import axios from "axios";
import CustomPopup from "../CustomPopup/CustomPopup";
import "./Login.css"; // Import your CSS file for styles
import { v4 as uuidv4 } from "uuid";
import LogoImage from '../../images/VJlogo-1-removebg.png';
import { API_BASE_URL } from '../../Data';

const Login = () => {
  const { updateUser } = useUser();
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

  useEffect(() => {
    if (location.pathname === "/") {
    }
  }, [location.pathname]);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const loginUser = () => {
    setIsLoading(true);

    if (!userEmail && !password) {
      setOpenPopup(true);
      setPopupMessage("Please Enter Correct Email and Password");
      setPopupSeverity("error");
      setIsLoading(false);
      return;
    }

    if (!userEmail) {
      setOpenPopup(true);
      setPopupMessage("Please Enter Correct Email");
      setPopupSeverity("error");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setOpenPopup(true);
      setPopupMessage("Please Enter Correct Password");
      setPopupSeverity("error");
      setIsLoading(false);
      return;
    }

    const loginData = {
      emailID: userEmail,
      pasword: password
    };

    axios
      .post(`${API_BASE_URL}/users/loginUser`, loginData)
      .then((response) => {
        const userData = response.data.data;
        updateUser(userData);
        setOpenPopup(true);
        setPopupMessage("Login successful!");
        setPopupSeverity("success");
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate('/kyc');
      })
      .catch((error) => {
        console.error("Error:", error);
        const errorMessage = error?.response?.data?.message;

        if (errorMessage) {
          if (errorMessage.includes("password")) {
            setOpenPopup(true);
            setPopupMessage("Please Enter Correct Password");
          } else if (errorMessage.includes("email")) {
            setOpenPopup(true);
            setPopupMessage("Please Enter Correct Email");
          } else {
            setOpenPopup(true);
            setPopupMessage("Please Enter Correct Email and Password");
          }
        } else {
          setOpenPopup(true);
          setPopupMessage("Enter Correct Email and Password. Please try again.");
        }

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
      .post(`${API_BASE_URL}/users/registerUser`, signUpData)
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
    <div style={{ minHeight: '100vh', display: 'inline' }}>
      <div className="loginbackground box-background--white padding-top--64">
        <div className="loginbackground-gridContainer">
          <div className="box-root flex-flex" style={{ gridArea: 'top / start / 8 / end' }}>
            <div className="box-root" style={{ backgroundImage: 'linear-gradient(white 0%, rgb(247, 250, 252) 33%)', flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '4 / 2 / auto / 5' }}>
            <div className="box-root box-divider--light-all-2 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '6 / start / auto / 2' }}>
            <div className="box-root box-background--blue800" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '7 / start / auto / 4' }}>
            <div className="box-root box-background--blue animationLeftRight" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '8 / 4 / auto / 6' }}>
            <div className="box-root box-background--gray100 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '2 / 15 / auto / end' }}>
            <div className="box-root box-background--cyan200 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '3 / 14 / auto / end' }}>
            <div className="box-root box-background--blue animationRightLeft" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '4 / 17 / auto / 20' }}>
            <div className="box-root box-background--gray100 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
          </div>
          <div className="box-root flex-flex" style={{ gridArea: '5 / 14 / auto / 17' }}>
            <div className="box-root box-divider--light-all-2 animationRightLeft tans3s" style={{ flexGrow: 1 }}></div>
          </div>
        </div>
        {/* </div> */}

        <div className="box-root flex-flex flex-direction--column" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative', top: '-650px', flexDirection: 'column' }}>
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <img src={LogoImage} alt="Logo" style={{ width: '250px', height: 'auto' }} />
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <span className="padding-bottom--15 headingLabour">Labour App</span>
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15 heading">Sign in to your account</span>
                <form id="login-form">
                  <div className="field padding-bottom--24">
                    <label htmlFor="email" className="emailCss">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      style={{ width: '270px' }}
                      required
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <label htmlFor="password" className="emailCss">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '270px' }}
                      required
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <button type="button" onClick={loginUser} className="login-button">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <CustomPopup
              open={openPopup}
              onClose={handleClosePopup}
              message={popupMessage}
              severity={popupSeverity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

