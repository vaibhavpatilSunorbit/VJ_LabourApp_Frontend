
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { InputLabel, Box } from '@mui/material';
// import "./OnBoardingForm.css";
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import CameraAltIcon from '@mui/icons-material/CameraAlt';
// import { FaArrowLeft, FaEye, FaCheck } from 'react-icons/fa';
// import SearchBar from "../SarchBar/SearchBar";
// import Loading from "../Loading/Loading";
// import { API_BASE_URL } from "../../Data"
// import LabourDetails from "../LabourDetails/LabourDetails";
// import ViewDetails from "../ViewDetails/ViewDetails";

// const OnboardingForm = ({ formType, onFormSubmit, onPhotoCapture }) => {
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [aadhaarImage, setAadhaarImage] = useState(null);
//   const [isKYCCollapsed, setIsKYCCollapsed] = useState(true);
//   const [isPersonalCollapsed, setIsPersonalCollapsed] = useState(true);
//   const [isBankDetailsCollapsed, setIsBankDetailsCollapsed] = useState(true);
//   const [isProjectCollapsed, setIsProjectCollapsed] = useState(true);
//   const [kycCompleted, setKycCompleted] = useState(false);
//   const [projectCompleted, setProjectCompleted] = useState(false);
//   const [personalCompleted, setPersonalCompleted] = useState(false);
//   const [bankDetailsCompleted, setBankDetailsCompleted] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState('');
//   const [newError, setNewError] = useState('');
//   const [hover, setHover] = useState(false);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [uploadAadhaarFront, setuploadAadhaarFront] = useState('');
//   const [uploadAadhaarBack, setuploadAadhaarBack] = useState('');
//   const [uploadIdProof, setuploadIdProof] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [popupMessage, setPopupMessage] = useState('');
//   const [popupType, setPopupType] = useState('');
//   const [isAddUserCollapsed, setIsAddUserCollapsed] = useState(true);
//   const [isLabourDetailsCollapsed, setIsLabourDetailsCollapsed] = useState(true);
//   // New Chages for dorpdown
//   const [projectNames, setProjectNames] = useState([]);
//   const [labourCategories, setLabourCategories] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [workingHours, setWorkingHours] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [companyNames, setCompanyNames] = useState([]);
//   const [nextID, setNextID] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [selectedLabour, setSelectedLabour] = useState(null);
//   const [aadhaarFront, setAadhaarFront] = useState(null);
//   const [aadhaarBack, setAadhaarBack] = useState(null);
//   const [aadhaarFrontData, setAadhaarFrontData] = useState({});
//   const [formData, setFormData] = useState({
//     uploadAadhaarFront: '',
//     uploadAadhaarBack: '',
//     uploadIdProof: '',
//     name: '',
//     aadhaarNumber: '',
//     dateOfBirth: '',
//     contactNumber: '',
//     gender: '',
//     dateOfJoining: '',
//     address: '',
//     pincode: '',
//     taluka: '',
//     district: '',
//     village: '',
//     state: '',
//     emergencyContact: '',
//     photoSrc: '',
//     labourOwnership: 'VJ',
//     bankName: '',
//     branch: '',
//     accountNumber: '',
//     ifscCode: '',
//     contractorName: '',
//     contractorNumber: '',
//     projectName: '',
//     labourCategory: '',
//     department: '',
//     workingHours: '',
//     designation: '',
//     title: 'Mr',
//     companyName: '',
//     // Marital_Status: 'MARRIED',
//     // nationality: 'Indian',
//     // Payment_Mode: 'NEFT',
//     // Employee_Type: 'PERMANENT',
//     // Current_Status: 'WORKING',
//     // Seating_Office: 'SITE LABOUR',
//     projectDescription: '',
//     departmentDescription: '',
//   });

//   const [formStatus, setFormStatus] = useState({
//     kyc: false,
//     personal: false,
//     bankDetails: false,
//     project: false
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);


//   const collapseAll = () => {
//     setIsKYCCollapsed(true);
//     setIsPersonalCollapsed(true);
//     setIsBankDetailsCollapsed(true);
//     setIsProjectCollapsed(true);
//   };

//   const handleNext = (route) => {
//     collapseAll();
//     switch (route) {
//       case '/personal':
//         setIsPersonalCollapsed(false);
//         break;
//       case '/bankDetails':
//         setIsBankDetailsCollapsed(false);
//         break;
//       case '/project':
//         setIsProjectCollapsed(false);
//         break;
//       default:
//         break;
//     }
//     navigate(route);
//   };

//   const handlePrevious = (route) => {
//     collapseAll();
//     switch (route) {
//       case '/kyc':
//         setIsKYCCollapsed(false);
//         break;
//       case '/personal':
//         setIsPersonalCollapsed(false);
//         break;
//       case '/bankDetails':
//         setIsBankDetailsCollapsed(false);
//         break;
//       default:
//         break;
//     }
//     navigate(route);
//   };

  

//   const handleFileChange = async (event) => {
//     const { name, files } = event.target;
//     const file = files[0];

//     if (!file) return;

//     const fileStateSetter = {
//       uploadAadhaarFront: setuploadAadhaarFront,
//       uploadAadhaarBack: setuploadAadhaarBack,
//       photoSrc: setPhotoSrc,
//       uploadIdProof: setuploadIdProof,
//     };

//     const setStateFunction = fileStateSetter[name];
//     if (setStateFunction) {
//       setStateFunction(file);
//     } else {
//       console.error(`Unknown file input name: ${name}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const ocrData = await uploadAadhaarImageToSurepass(file);

//       // if (name === 'uploadAadhaarFront') {
//       //   setAadhaarFrontData(ocrData);
//       //   setFormData((prev) => ({
//       //     ...prev,
//       //     ...ocrData
//       //   }));
//       // } else if (name === 'uploadAadhaarBack') {
//       //   setFormData((prev) => ({
//       //     ...prev,
//       //     ...aadhaarFrontData,
//       //     ...ocrData
//       //   }));
//       // }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//     setLoading(false);
//   };



//   const uploadAadhaarImageToSurepass = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A'
//         }
//       });

//       const { data } = response;
//       // console.log("aadhar ocr",data); 
//       if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
//         const ocrFields = data.data.ocr_fields[0];

//         // Check if Aadhaar number already exists
//         const existingAadhaarCheck = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber: ocrFields.aadhaar_number.value });

//         if (existingAadhaarCheck.data.exists) {
//           setMessageType('error');
//           setNewError('User has already filled the form with this Aadhaar number.');
//         } else {
//           // console.log("zip", ocrFields.address?.zip);

//           setNewError('');

//           const removePrefixes = (address) => {
//             const regex = /\b(C\/O:|D\/O:|S\/O:|W\/O:|H\/O:)\s*[^,]*,\s*/gi;
//             const cleanedAddress = address.replace(regex, '').trim();
//             return cleanedAddress;
//           };
  
//           const cleanedAddress = ocrFields.address?.value ? removePrefixes(ocrFields.address?.value) : '';


//           if(ocrFields.document_type === 'aadhaar_front_bottom'){
//             setFormData((prev) => {
//               return {
//                 ...prev,
//                 aadhaarNumber: ocrFields.aadhaar_number?.value,
//                 name: ocrFields.full_name?.value,
//                 dateOfBirth: ocrFields.dob?.value,
//                 gender: ocrFields.gender?.value               
//               }
//             });
//           }else{
//             setFormData((prev) => {
//               return {
//                 ...prev,
//                 village: ocrFields.address?.city,
//                 address: cleanedAddress,
//                 taluka: formData.taluka,
//                 district: ocrFields.address?.district,
//                 state: ocrFields.address?.state,
//                 pincode: ocrFields.address?.zip
//               }
//             });
//           }

       
//           if(ocrFields.address?.zip){
//             handlePincodeChange(ocrFields.address?.zip);
//           }
//           setMessageType('success');
//           setMessage('Congratulations! New Aadhaar number registered.');
//         }
//       } else {
//         setNewError('Error reading Aadhaar details from image.');
//       }
//     } catch (error) {
//       console.error('Error uploading Aadhaar image to Surepass:', error);
//       setNewError('Error uploading Aadhaar image. Please try again.');
//     }
//   };

//   const handleAadhaarNumberChange = async (e) => {
//     const { value } = e.target;
//     setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value }));
//     validateAadhaarNumber(value);

//     if (value.length === 12 && /^\d{12}$/.test(value)) {
//       try {
//         const exists = await checkAadhaarExistence(value);
//         if (exists) {
//           setMessageType('error');
//           setMessage('User has already filled the form with this Aadhaar number.');
//           setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear the field
//         } else {
//           setMessageType('success');
//           setMessage('Congratulations! New Aadhaar number registered.');
//         }
//       } catch (error) {
//         console.error('Error checking Aadhaar number:', error);
//         setMessageType('error');
//         setMessage('Error checking Aadhaar number. Please try again.');
//       }
//     }
//   };


//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage('');
//       }, 5000); // Clear message after 5 seconds

//       return () => clearTimeout(timer); // Cleanup timer
//     }
//   }, [message]);

//   const checkAadhaarExistence = async (aadhaarNumber) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber });
//       return response.data.exists;
//     } catch (error) {
//       console.error('Error checking Aadhaar number existence:', error);
//       return false;
//     }
//   };


//   const fetchPincodeData = async (pincode) => {
//     try {
//       const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching pincode data:', error);
//       return null;
//     }
//   };
//   const suggestionsRef = useRef(null);

//   const handlePincodeChange = async (pincode) => {
//     console.log("handlePincodeChange called")

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       pincode,
//     }));

//     if (pincode.length === 6) {
//       setLoading(true);
//       const response = await fetchPincodeData(pincode);

//       if (response && response[0] && response[0].Status === "Success") {
//         setSuggestions(response[0].PostOffice);
//         setShowSuggestions(true);
//       } else {
//         setShowSuggestions(false);
//         // const nearbyPincode = pincode.substring(0, 4);
//         // const nearbyResponse = await fetchPincodeData(nearbyPincode);

//         // if (nearbyResponse && nearbyResponse[0] && nearbyResponse[0].Status === "Success") {
//         //   setSuggestions(nearbyResponse[0].PostOffice);
//         //   setShowSuggestions(true);
//         // } else {
//         //   console.error('Location data not found');
//         //   setShowSuggestions(false);
//         // }
//       }
//       setLoading(false);
//       // setShowSuggestions(false);
//     } else {
//       setShowSuggestions(false);
//     }
//   };
//   const handleSuggestionClick = (suggestion) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       village: suggestion.Name,
//       taluka: suggestion.Block,
//       district: suggestion.District,
//       state: suggestion.State,
//       pincode: suggestion.Pincode
//     }));
//     setShowSuggestions(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // New changes start here ---------------------------------------------

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectNamesRes = await axios.get(API_BASE_URL + `/api/project-names`);
//         const labourCategoriesRes = await axios.get(API_BASE_URL + `/api/labour-categories`);
//         const departmentsRes = await axios.get(API_BASE_URL + `/api/departments`);
//         const workingHoursRes = await axios.get(API_BASE_URL + `/api/working-hours`);
//         setProjectNames(projectNamesRes.data);
//         setLabourCategories(labourCategoriesRes.data);
//         setDepartments(departmentsRes.data);
//         setWorkingHours(workingHoursRes.data);


//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [setDepartments, setProjectNames]);

//   useEffect(() => {
//     const fetchDesignations = async () => {
//       if (formData.department) {
//         try {
//           const designationsRes = await axios.get(API_BASE_URL + `/api/designations/${formData.department}`);
//           setDesignations(designationsRes.data);

//           if (designationsRes.data.length > 0 && !formData.designation) {
//             setFormData(prevFormData => ({
//               ...prevFormData,
//               designation: designationsRes.data[0].Description
//             }));
//           }

//         } catch (err) {
//           console.error(err);
//         }
//       }
//     };

//     fetchDesignations();
//   }, [formData.department]);

//   useEffect(() => {
//     const fetchCompanyNames = async () => {
//       if (formData.projectName) {
//         try {
//           const companyNamesRes = await axios.get(API_BASE_URL + `/api/company-names/${formData.projectName}`);
//           setCompanyNames(companyNamesRes.data);

//           if (companyNamesRes.data.length > 0 && !formData.companyName) {
//             setFormData(prevFormData => ({
//               ...prevFormData,
//               companyName: companyNamesRes.data[0].Company_Name
//             }));
//           }

//         } catch (err) {
//           console.error(err);
//         }
//       }
//     };

//     fetchCompanyNames();
//   }, [formData.projectName]);

//   // New changes end here ----------------------------------

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }
//     try {
//       const response = await axios.get(API_BASE_URL + `/labours/search?q=${searchQuery}`);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Error searching:', error);
//       toast.error('Error searching. Please try again.');
//     }

//   };

//   // const CameraCapture = () => {
//   const [stream, setStream] = useState(null);
//   const [photoSrc, setPhotoSrc] = useState('');
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   // const startCamera = async () => {
//   //   try {
//   //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   //     videoRef.current.srcObject = stream;
//   //     setStream(stream);
//   //   } catch (err) {
//   //     console.error("Error accessing camera: ", err);
//   //   }
//   // };
//   const startCamera = async () => {
//     try {
//       // Define video constraints for better compatibility
//       const constraints = {
//         video: {
//           facingMode: 'user' // Use 'environment' for the rear camera
//         }
//       };

//       // Check if the browser supports getUserMedia
//       if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         videoRef.current.srcObject = stream;
//         setStream(stream);
//       } else {
//         console.error("getUserMedia is not supported by this browser.");
//       }
//     } catch (err) {
//       console.error("Error accessing camera: ", err);
//       // Log detailed error information for troubleshooting
//       if (err.name === 'NotAllowedError') {
//         console.error("Permission denied. Please allow camera access in your browser settings.");
//       } else if (err.name === 'NotFoundError') {
//         console.error("No camera found on the device.");
//       } else if (err.name === 'NotReadableError') {
//         console.error("Unable to access the camera. It might be in use by another application.");
//       } else {
//         console.error("Unknown error: ", err);
//       }
//     }
//   };


//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const photo = canvas.toDataURL('image/png');
//     setPhotoSrc(photo);
//     stopCamera();
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   };

//   const repeatPhoto = () => {
//     setPhotoSrc('');
//     startCamera();
//   };

//   const handleSelectLabour = (labour) => {
//     const {
//       labourOwnership,
//       name,
//       aadhaarNumber,
//       dateOfBirth,
//       contactNumber,
//       gender,
//       dateOfJoining,
//       address,
//       pincode,
//       taluka,
//       district,
//       village,
//       state,
//       emergencyContact,
//       photoSrc,
//       bankName,
//       branch,
//       accountNumber,
//       ifscCode,
//       projectName,
//       labourCategory,
//       department,
//       designation,
//       workingHours,
//       contractorName,
//       contractorNumber,
//       title,
//       Marital_Status,
//       companyName,
//     } = labour;

//     setFormData({
//       labourOwnership,
//       name,
//       aadhaarNumber,
//       dateOfBirth,
//       contactNumber,
//       gender,
//       dateOfJoining,
//       address,
//       pincode,
//       taluka,
//       district,
//       village,
//       state,
//       emergencyContact,
//       photoSrc,
//       bankName,
//       branch,
//       accountNumber,
//       ifscCode,
//       projectName,
//       labourCategory,
//       department,
//       workingHours,
//       designation,
//       contractorName,
//       contractorNumber,
//       title,
//       Marital_Status,
//       companyName,
//       // Nationality: 'Indian',
//       // Payment_Mode: 'NEFT',
//       // Employee_Type: 'PERMANENT',
//       // Current_Status: 'WORKING',
//       // Seating_Office: 'SITE LABOUR',
//     });

//     setSearchQuery('');
//     setSearchResults([]);

//     // console.log('Selected Labour:', labour);
//   };


//   // const renderPreviewModal = () => {
//   //   if (!isModalOpen) return null;
//   //   return (
//   //     <div className="overlay">
//   //       <div className="preview-modal">
//   //         <button id="close-button" onClick={closeModal}></button>
//   //         <ul>
//   //           {Object.entries(formData).map(([key, value]) => (
//   //             <li key={key}>
//   //               <strong>{capitalizeFirstLetter(key)}:</strong> {value}
//   //             </li>
//   //           ))}
//   //         </ul>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   const toggleAddUserCollapse = () => {
//     setIsAddUserCollapsed(!isAddUserCollapsed);
//   };

//   const toggleLabourDetailsCollapse = () => {
//     setIsLabourDetailsCollapsed(!isLabourDetailsCollapsed);
//   };

//   const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   };

//   const toggleKYCCollapse = () => {
//     setIsKYCCollapsed(!isKYCCollapsed);
//   };

//   const togglePersonalCollapse = () => {
//     setIsPersonalCollapsed(!isPersonalCollapsed);
//   };

//   const toggleBankDetailsCollapse = () => {
//     setIsBankDetailsCollapsed(!isBankDetailsCollapsed);
//   };

//   const toggleProjectCollapse = () => {
//     setIsProjectCollapsed(!isProjectCollapsed);
//   };
//   const renderRequiredAsterisk = (isRequired) => {
//     return isRequired ? <span style={{ color: "red" }}> *</span> : null;
//   };

//   const kycRequiredFields = ['labourOwnership', 'uploadAadhaarFront', 'uploadAadhaarBack', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber', 'uploadIdProof',];
//   const personalRequiredFields = ['dateOfJoining', 'address', 'pincode', 'taluka', 'district', 'village', 'state', 'emergencyContact', 'photoSrc'];
//   const bankDetailsRequiredFields = ['bankName', 'branch', 'accountNumber', 'ifscCode'];
//   const projectRequiredFields = ['contractorName', 'contractorNumber', 'projectName', 'labourCategory', 'department', 'workingHours', 'designation'];

//   // Check if all required fields are filled
//   const isFormComplete = (form, requiredFields) => {
//     return requiredFields.every(field => form[field] !== '');
//   };

//   const checkKycFormCompletion = () => isFormComplete(formData, kycRequiredFields);
//   const checkPersonalFormCompletion = () => isFormComplete(formData, personalRequiredFields);
//   const checkBankDetailsFormCompletion = () => isFormComplete(formData, bankDetailsRequiredFields);
//   const checkProjectFormCompletion = () => isFormComplete(formData, projectRequiredFields);

//   useEffect(() => {
//     setKycCompleted(checkKycFormCompletion());
//     setPersonalCompleted(checkPersonalFormCompletion());
//     setBankDetailsCompleted(checkBankDetailsFormCompletion());
//     setProjectCompleted(checkProjectFormCompletion());
//   }, [formData]);

//   const getBulletColor = (isCompleted) => {
//     return isCompleted ? '#20C305' : '#FFBF00';
//   };
//   // const getBulletColor = () => {
//   //   if (formType === "kyc") {
//   //     return kycCompleted ? '#20C305' : '#FFBF00';
//   //   } else if (formType === "project") {
//   //     return projectCompleted ? '#20C305' : '#FFBF00';
//   //   } else {
//   //     return '#FFBF00';
//   //   }
//   // };

//   const handleDateChange = (e) => {
//     const selectedDate = new Date(e.target.value);
//     const today = new Date();
//     let age = today.getFullYear() - selectedDate.getFullYear();
//     const birthdayThisYear = new Date(today.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
//     if (today < birthdayThisYear) {
//       age--;
//     }
//     if (age < 18) {
//       setErrorMessage('Age must be 18 or older.');
//     } else {
//       setErrorMessage('');
//     }
//     setFormData({ ...formData, dateOfBirth: e.target.value });
//   };


//   const validateForm = () => {
//     const requiredFields = [
//       // 'labourOwnership', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber',
//       // 'dateOfJoining', 'address', 'pincode', 'taluka', 'district', 'village', 'state', 'emergencyContact',
//       // 'projectName', 'labourCategory', 'department', 'workingHours', 'designation'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field]) {
//         toast.error(`Please fill in the ${field} field.`);
//         return false;
//       }
//     }

//     // if (!formData.village) {
//     //   toast.warn("Village field is empty. Please consider filling it.");
//     // }

//     return true;
//   };


//   const base64ToBlob = (base64String, mimeType = 'application/octet-stream') => {
//     const byteCharacters = atob(base64String.split(',')[1]);
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);
//       const byteNumbers = new Array(slice.length);

//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     const blob = new Blob(byteArrays, { type: mimeType });
//     return blob;
//   };


//   // const base64ToBlob = (base64, mimeType) => {
//   //   const byteString = atob(base64.split(',')[1]);
//   //   const arrayBuffer = new ArrayBuffer(byteString.length);
//   //   const intArray = new Uint8Array(arrayBuffer);

//   //   for (let i = 0; i < byteString.length; i++) {
//   //     intArray[i] = byteString.charCodeAt(i);
//   //   }

//   //   return new Blob([intArray], { type: mimeType });
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const { data: { nextID } } = await axios.get(API_BASE_URL + `/labours/next-id`);
//       setNextID(nextID);

//       const formDataToSend = new FormData();

//       // console.log(formData);

//       Object.keys(formData).forEach(key => {
//         formDataToSend.append(key, formData[key]);
//       });

//       if (uploadAadhaarFront && uploadAadhaarFront instanceof File) {
//         formDataToSend.append('uploadAadhaarFront', uploadAadhaarFront, uploadAadhaarFront.name);
//       } else {
//         console.error('uploadAadhaarFront is not a file object');
//       }

//       if (uploadAadhaarBack && uploadAadhaarBack instanceof File) {
//         formDataToSend.append('uploadAadhaarBack', uploadAadhaarBack, uploadAadhaarBack.name);
//       } else {
//         console.error('uploadAadhaarBack is not a file object');
//       }

//       if (uploadIdProof && uploadIdProof instanceof File) {
//         formDataToSend.append('uploadIdProof', uploadIdProof, uploadIdProof.name);
//       } else {
//         console.error('uploadIdProof is not a file object');
//       }

//       // if (uploadIdProof) {
//       //   const photoBlob = base64ToBlob(uploadIdProof, 'image/jpeg');
//       //   formDataToSend.append('uploadIdProof', photoBlob, 'id_photo.jpg');
//       // }

//       if (photoSrc) {
//         const photoBlob = base64ToBlob(photoSrc, 'image/jpeg');
//         formDataToSend.append('photoSrc', photoBlob, 'captured_photo.jpg');
//       }

//       formDataToSend.append('labourID', nextID);

//       const response = await axios.post(API_BASE_URL + `/labours`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status !== 201) {
//         throw new Error('Form submission failed');
//       }

//       // console.log('Form submission response:', response.data);
//       // setPopupMessage(`Your details have been successfully submitted. Your Labour ID is ${nextID}. Thanks!`);
//       setPopupMessage(
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-evenly',
//             alignItems: 'center',
//             textAlign: 'center',
//             lineHeight: '1.5',
//             padding: '20px',
//             backgroundColor: '#f8f9fa',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//           }}
//         >
//           <p style={{ fontSize: '1.2em', color: '#343a40' }}>Your details have been successfully submitted.</p>
//           <p style={{ fontSize: '1.2em', color: '#343a40' }}>
//             Your Labour ID is <span style={{ fontSize: '1.5em', color: '#007bff', fontWeight: 700 }}>{nextID}</span>.
//           </p>
//           <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
//         </div>
//       );
//       setPopupType('success');
//       setSaved(true);
//       // toast.success('Form submitted successfully!');

//       setFormData({});
//       setuploadAadhaarFront(null);
//       setuploadAadhaarBack(null);
//       setuploadIdProof(null);
//       setPhotoSrc(null);

//     } catch (error) {
//       console.error('Form submission error:', error);
//       setPopupMessage('Error submitting form. Please try again later.');
//       setPopupType('error');
//       setSaved(true);
//     } finally {
//       setLoading(false);
//     }
//     setTimeout(() => {
//       setSaved(false);
//     }, 12000);
//     // console.log(userData);
//   };





//   const handleFileChanges = async (event) => {
//     const { name, files } = event.target;
//     const file = files[0];

//     if (!file) return;

//     // console.log("Selected file:", file);

//     const fileStateSetter = {

//       uploadIdProof: setuploadIdProof,
//     };
//     const setStateFunction = fileStateSetter[name];
//     if (setStateFunction) {
//       setStateFunction(file);
//     } else {
//       console.error(`Unknown file input name: ${name}`);
//       return;
//     }
//   }




//   // const uploadAadhaarImageToSurepass = async (file) => {
//   //   const formData = new FormData();
//   //   formData.append('file', file);

//   //   try {
//   //     const response = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //         'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A'
//   //       }
//   //     });

//   //     const { data } = response;
//   //     console.log(data)
//   //     if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
//   //       const ocrFields = data.data.ocr_fields[0];

//   //       setFormData({
//   //         aadhaarNumber: ocrFields.aadhaar_number.value,
//   //         name: ocrFields.full_name.value,
//   //         dateOfBirth: ocrFields.dob.value,
//   //         gender: ocrFields.gender.value,
//   //         village: formData.village,
//   //         taluka: formData.taluka,
//   //         district: formData.district,
//   //         state: formData.state,
//   //         pincode: formData.pincode
//   //       });
//   //       setDateOfBirth(ocrFields.dob.value);
//   //     } else {
//   //       console.error('Error uploading Aadhaar image to Surepass: OCR fields not found in response');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error uploading Aadhaar image to Surepass:', error);
//   //   }
//   // };




//   const validateContactNumber = (number) => {
//     const isValid = /^\d{10}$/.test(number);
//     if (!isValid) {
//       setError('Contact 10-digit number.');
//     } else {
//       setError('');
//     }
//   };

//   const validateAadhaarNumber = (number) => {
//     const isValid = /^\d{12}$/.test(number);
//     if (!isValid) {
//       setNewError('Aadhaar 12-digit number.');
//     } else {
//       setNewError('');
//     }
//   };

//   const handleContactNumberChange = (e) => {
//     const { value } = e.target;
//     setFormData({ ...formData, contactNumber: value });
//     validateContactNumber(value);
//   };

//   const handleContractorNumberChange = (e) => {
//     const { value } = e.target;
//     setFormData({ ...formData, contractorNumber: value });
//     validateContactNumber(value);
//   };

//   const handleemergencyContactChange = (e) => {
//     const { value } = e.target;
//     setFormData({ ...formData, emergencyContact: value });
//     validateContactNumber(value);
//   };

//   const handleAccountNumberChange = (e) => {
//     const cleanedValue = e.target.value.replace(/\D/g, '');
//     if (cleanedValue.length > 16) {
//       cleanedValue = cleanedValue.slice(0, 16);
//     }
//     setFormData({ ...formData, accountNumber: cleanedValue });

//   };


//   // const openModal = () => {
//   //   setIsModalOpen(true);
//   // };

//   // const closeModal = () => {
//   //   setIsModalOpen(false);
//   // };

//   const handlePreview = () => {
//     openPreviewModal(formData);
//   };

//   const handleChanges = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value
//     }));
//   };

//   const getProjectDescription = (projectId) => {
//     const project = projectNames.find(proj => proj.id === projectId);
//     return project ? project.name : projectId;
//   };

//   const getDepartmentDescription = (departmentId) => {
//     const department = departments.find(dept => dept.id === departmentId);
//     return department ? department.name : departmentId;
//   };

//   const transformDataForPreview = (data) => {
//     return {
//       ...data,
//       projectDescription: getProjectDescription(data.projectName),
//       departmentDescription: getDepartmentDescription(data.department),
//     };
//   };

//   const openPreviewModal = () => {
//     const transformedData = transformDataForPreview(formData);
//     setSelectedLabour(transformedData);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedLabour(null);
//     setIsModalOpen(false);
//   };

//   const renderPreviewModal = () => {
//     if (!isModalOpen || !selectedLabour) return null;
//     return (
//       <ViewDetails
//         selectedLabour={selectedLabour}
//         onClose={closeModal}
//       />
//     );
//   };


//   const getInputStyle = (field) => {
//     return formData[field]
//       ? {
//           borderColor: '#28a745',
//           boxShadow: '0 0 5px rgba(40, 167, 69, 0.54)', 
//         }
//       : {
//           borderColor: 'rgb(255 99 99)',
//           boxShadow: '0 0 5px rgba(138, 147, 235, 0.54)',
//         };
//   };


//   const uploadAadhaarImageToOCRSpace = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('apikey', 'YOUR_OCR_API_KEY');
//     formData.append('language', 'eng');

//     try {
//       const response = await axios.post('https://api.ocr.space/parse/image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       const { ParsedResults } = response.data;
//       if (ParsedResults && ParsedResults.length > 0) {
//         const parsedData = ParsedResults[0];
//         setFormData({
//           aadhaarNumber: parsedData.ParsedText.match(/\d{4}\s\d{4}\s\d{4}/)[0],
//           name: parsedData.ParsedText.match(/(Name)(.*?)(Father|Mother|Spouse)/)[2].trim(),
//           dateOfBirth: parsedData.ParsedText.match(/\d{2}\/\d{2}\/\d{4}/)[0],
//         });
//       }
//     } catch (error) {
//       console.error('Error uploading Aadhaar image to OCR.space:', error);
//     }
//   };



//   const handleAddressSelect = (selectedAddress) => {
//     const addressComponents = selectedAddress.display_name.split(', ');
//     const city = addressComponents[1];
//     const taluka = addressComponents[1];
//     const district = addressComponents[2];
//     const state = addressComponents[3];
//     const pincode = addressComponents[7];

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       address: selectedAddress.display_name,
//       village: city,
//       taluka: taluka || '',
//       district: district || '',
//       state: state || '',
//       pincode: pincode || '',
//     }));

//     setSuggestions([]);
//   };


//   // const handleAadhaarNumberChange = (e) => {
//   //   const { value } = e.target;
//   //   setFormData({ ...formData, aadhaarNumber: value });
//   //   validateAadhaarNumber(value);
//   // };


//   // const handleAadhaarNumberChange = async (e) => {
//   //   const { value } = e.target;
//   //   setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value }));
//   //   validateAadhaarNumber(value);

//   //   if (value.length === 12 && /^\d{12}$/.test(value)) {
//   //     try {
//   //       const exists = await checkAadhaarExistence(value);
//   //       if (exists) {
//   //         setNewError('User has already filled the form with this Aadhaar number.');
//   //         // toast.error('User has already filled the form with this Aadhaar number.');
//   //         setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear the field
//   //       }
//   //     } catch (error) {
//   //       console.error('Error checking Aadhaar number:', error);
//   //        setNewError('Error checking Aadhaar number. Please try again.');
//   //     }
//   //   }
//   // };



//   function handlePhotoChange(event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         const imageData = e.target.result;
//         // console.log("Image data:", imageData);
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     setSearchQuery(value);
//   };

//   // const handleTitleChange = (e) => {
//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };

//  return (
//     <Box p={{ paddingRight: 3 }}>
//       <div className="onboarding-form-container">
//         <ToastContainer />
//         <SearchBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           handleSearch={handleSearch}
//           searchResults={searchResults}
//           handleSelectLabour={handleSelectLabour}
//         />

//         <form className="onboarding-form" onSubmit={handleSubmit}>
//           <ul style={{ marginLeft: "-20px" }}>
//             <li>
//               <div className="title" onClick={toggleKYCCollapse}>
//                 <PersonOutlineIcon />
//                 <span className="bullet" style={{ color: getBulletColor(kycCompleted) }}>&#8226;</span>
//                 <Link to="/kyc" className="sidebar-link">
//                   <span className="mainsName">Kyc</span>
//                   <div className="detail-icons1">
//                     {isKYCCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
//                   </div>
//                 </Link>
//               </div>
//               <div className={`collapsible-content ${isKYCCollapsed ? 'collapsed' : ''}`}>
//                 <h2>{formType === "kyc" ? "KYC Form" : "Labour Onboarding Form"}</h2>
//                 <hr />
//                 <div className="form-body">
//                   {formType === "kyc" && (
//                     <>
//                       <div className="labour-adhaar">


//                         {loading && <Loading />}
//                         <div className="project-field">
//                           <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
//                             Upload Aadhaar Front {renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div className="input-with-icon">
//                             <input
//                               type="text"
//                               value={uploadAadhaarFront}
//                               placeholder="Choose file"
//                               readOnly
//                               style={{ cursor: 'pointer', backgroundColor: '#fff' }}
//                               onClick={() => document.getElementById('uploadAadhaarFront').click()}
//                             />
//                             <input
//                               type="file"
//                               id="uploadAadhaarFront"
//                               name="uploadAadhaarFront"
//                               onChange={handleFileChange}
//                               accept="image/*"
//                               style={{ display: 'none' }}
//                             />
//                             <DocumentScannerIcon className="input-icon" />
//                           </div>
//                         </div>
//                         <div className="project-field">
//                           <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
//                             Upload Aadhaar Back
//                           </InputLabel>
//                           <div className="input-with-icon">
//                             <input
//                               type="text"
//                               value={uploadAadhaarBack}
//                               placeholder="Choose file"
//                               readOnly
//                               style={{ cursor: 'pointer', backgroundColor: '#fff'}}
//                               onClick={() => document.getElementById('uploadAadhaarBack').click()}
//                             />
//                             <input
//                               type="file"
//                               id="uploadAadhaarBack"
//                               name="uploadAadhaarBack"
//                               onChange={handleFileChange}
//                               accept="image/*"
//                               style={{ display: 'none' }}
//                             />
//                             <DocumentScannerIcon className="input-icon" />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="name-contact">
//                         <div className="labour-ownership">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Labour Ownership {renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div id="select-container">
//                             <select
//                               id="labourOwnership"
//                               className="select-wrapper"
//                               name="labourOwnership"
//                               required
//                               value={formData.labourOwnership || ''}
//                               onChange={(e) => setFormData({ ...formData, labourOwnership: e.target.value })}
//                               style={getInputStyle('labourOwnership')} >
//                               <option value="">Select Labour Ownership</option>
//                               <option value="VJ" style={{ width: 'calc(100% - 20px)' }}>VJ</option>
//                               <option value="Contractor" style={{ width: 'calc(100% - 20px)' }}>Contractor</option>
//                             </select>
//                           </div>
//                         </div>

//                         <div className="gender">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Title {renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div className="gender-input">
//                             <select
//                               id="title"
//                               name="title"
//                               required
//                               value={formData.title}
//                               //  onChange={handleChange}
//                               onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
//                               style={getInputStyle('title')}
//                             >
//                               <option value="">Select Title</option>
//                               <option value="Mr">MR.</option>
//                               <option value="Mrs">MRS.</option>
//                               <option value="Miss">MISS.</option>
//                               <option value="Ms">MS.</option>
//                             </select>
//                           </div>
//                         </div>
//                       </div>


//                       <div className="birth-aadhaar">
//                         <div className="name">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Full Name{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             type="text"
//                             name="name"
//                             value={formData.name || ''}
//                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             style={getInputStyle('name')}
//                             required
//                           />
//                         </div>

//                         <div className="adharNumber">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Aadhaar Number {renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div id="adhaar-input">
//                             <input
//                               type="text"
//                               name="aadhaarNumber"
//                               value={formData.aadhaarNumber || ''}
//                               onChange={handleAadhaarNumberChange}
//                               style={getInputStyle('aadhaarNumber')}
//                               required
//                             />
//                             {newError && <div style={{ color: 'red' }}>{newError}</div>}
//                           </div>
//                           {message && <div className={`popup-message ${messageType}`}>{message}</div>}
//                         </div>
//                       </div>


//                       <div className="birth-aadhaar">
//                         <div className="date">
//                           <div className="birth-date">
//                             <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                               Date of Birth{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <input
//                               className="date-input"
//                               type="date"
//                               value={formData.dateOfBirth}
//                               onChange={handleDateChange}
//                               style={getInputStyle('dateOfBirth')}
//                               max="2006-01-01"
//                               required />
//                             {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
//                           </div>
//                         </div>




//                         <div className="contact">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Contact Number{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             value={formData.contactNumber || ''}
//                             onChange={handleContactNumberChange}
//                             style={getInputStyle('contactNumber')}
//                             required
//                           />
//                           {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
//                         </div>
//                       </div>

//                       <div className="birth-aadhaar">
//                         <div className="gender">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Gender{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div className="gender-input">
//                             <select
//                               id="gender"
//                               name="gender"
//                               required
//                               value={formData.gender}
//                               onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//                               style={getInputStyle('gender')}>
//                               {/* <option value="">Select Gender</option> */}
//                               <option value="Male">Male</option>
//                               <option value="Female">Female</option>
//                             </select>
//                           </div>
//                         </div>

//                         <div className="project-field">
//                           <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
//                             Upload ID Proof {renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div className="input-with-icon">
//                             <input
//                               type="text"
//                               value={uploadIdProof}
//                               placeholder="Choose file"
//                               readOnly
//                               style={{ cursor: 'pointer', backgroundColor: '#fff' }}
//                               onClick={() => document.getElementById('uploadIdProof').click()}
//                             />
//                             <input
//                               type="file"
//                               id="uploadIdProof"
//                               name="uploadIdProof"
//                               onChange={handleFileChanges}
//                               accept="image/*"
//                               style={{ display: 'none' }}
//                             />
//                             <DocumentScannerIcon className="input-icon" />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="navigationBut">
//                         <button onClick={() => handleNext('/personal')}>Next</button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </li>

//             <li>
//               <div className="title" onClick={togglePersonalCollapse}>
//                 <EditNoteIcon />
//                 <span className="bullet" style={{ color: getBulletColor(personalCompleted) }}>&#8226;</span>

//                 <Link to="/personal" className="sidebar-link">

//                   <span className="mainsName">Personal</span>
//                   <div className="detail-icons2">
//                     {isPersonalCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
//                   </div>
//                 </Link>
//               </div>
//               <div className={`collapsible-content ${isPersonalCollapsed ? 'collapsed' : ''}`}>

//                 <div className="form-body">

//                   {formType === "personal" && (
//                     <>
//                       <div className="locations">
//                         <div className="joining-date">
//                           <InputLabel
//                             id="demo-simple-select-label"
//                             sx={{ color: "black" }}
//                           >
//                             Date of joining{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             className="date-input"
//                             type="date"
//                             id="dateOfJoining"
//                             name="dateOfJoining"
//                             required
//                             onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
//                             value={formData.dateOfJoining || ''}
//                             style={getInputStyle('dateOfJoining')}
//                           />
//                         </div>

//                         <div className="location-address-label">
//                           <InputLabel
//                             id="demo-simple-select-label"
//                             sx={{ color: "black" }}
//                           >
//                             Address{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             className="address"
//                             type="text"
//                             id="address"
//                             name="address"
//                             required
//                             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                             value={formData.address || ''}
//                             style={getInputStyle('address')}
//                           />

//                         </div>
//                       </div>


//                       {loading && <Loading />}
//                       <div className="locations">
//                       <div className="location-Village-label">
//                           <InputLabel
//                             id="demo-simple-select-label"
//                             sx={{ color: "black" }}
//                           >
//                             Village/City{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             className="village"
//                             type="text"
//                             id="village" p
//                             name="village"
//                             required
//                             value={formData.village || ''}
//                             onChange={(e) => setFormData({ ...formData, village: e.target.value })}
//                             style={getInputStyle('village')}
//                           />
//                         </div>

//                         <div className="personal-pincode-field">
//                           <InputLabel
//                             id="personal-pincode-label"
//                             sx={{ color: "black" }}
//                             value={formData.pincode || " "}
//                           >
//                             Pincode{renderRequiredAsterisk(true)}
//                           </InputLabel>

//                           <input
//                             type="text"
//                             id="personal-pincode"
//                             name="personal-pincode"
//                             required
//                             value={formData.pincode || ''}
//                             onChange={(e)=>handlePincodeChange(e.target.value)}
//                             style={getInputStyle('pincode')}
//                           />
//                          {showSuggestions && suggestions.length > 0 && (
//         <ul className="suggestions-dropdown" ref={suggestionsRef}>
//           {suggestions.map((suggestion, index) => (
//             <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
//               {suggestion.Name}, {suggestion.Block}, {suggestion.District}, {suggestion.State}
//             </li>
//           ))}
//         </ul>
//       )}
//                         </div>
//                       </div>

//                       <div className="state-block">
//                         <div className="location-district-label">
//                           <InputLabel
//                             id="demo-simple-select-label"
//                             sx={{ color: "black" }}
//                           >
//                             District{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             className="district"
//                             type="text"
//                             id="district"
//                             name="district"
//                             required
//                             value={formData.district || ''}
//                             onChange={(e) => setFormData({ ...formData, district: e.target.value })}
//                             style={getInputStyle('district')}
//                           />
//                         </div>



//                         <div className="location-taluka-label">
//                           <InputLabel
//                             id="demo-simple-select-label"
//                             sx={{ color: "black" }}
//                           >
//                             Taluka{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             className="taluka"
//                             type="text"
//                             id="taluka"
//                             name="taluka"
//                             required
//                             value={formData.taluka || ''}
//                             onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
//                             style={getInputStyle('taluka')}
//                           />
//                         </div>
//                       </div>

//                       <div className="em-contact-block">
//                         <div className="location-state-label">
//                           <InputLabel
//                             id="demo-simple-select-label"
//                             sx={{ color: "black" }}
//                           >
//                             State{renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <input
//                             className="state"
//                             type="text"
//                             id="state"
//                             name="state"
//                             required
//                             value={formData.state || ''}
//                             onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                             style={getInputStyle('state')}
//                           />
//                         </div>


//                         <div className="personal-emcontact-field">
//                           <InputLabel
//                             id="personal-emcontact-label"
//                             sx={{ color: "black" }}
//                           >
//                             Emergency Contact{renderRequiredAsterisk(true)}
//                           </InputLabel>

//                           <input
//                             type="text"
//                             id="personal-emcontact"
//                             name="personal-emcontact"
//                             required
//                             value={formData.emergencyContact || ''}
//                             onChange={handleemergencyContactChange}
//                             style={getInputStyle('emergencyContact')}
//                           />
//                           {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
//                         </div>
//                       </div>

//                       <div className="em-contact-block">
                      
//                         <div className="gender">
//                           <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                             Marital Status {renderRequiredAsterisk(true)}
//                           </InputLabel>
//                           <div className="gender-input">
//                             <select
//                               id="Marital_Status"
//                               name="Marital_Status"
//                               required
//                               value={formData.Marital_Status}
//                               onChange={(e) => setFormData({ ...formData, Marital_Status: e.target.value })}
//                               style={getInputStyle('Marital_Status')}
//                             >
//                               <option value="">Select Marital Status</option>
//                               <option value="MARRIED">MARRIED</option>
//                               <option value="UNMARRIED">UNMARRIED</option>
//                               <option value="DIVORCE">DIVORCE</option>
//                               <option value="WIDOWED">WIDOWED</option>
//                             </select>
//                           </div>
//                         </div>
//                       </div>



//                       <div className="location-photo-label">
//                         <InputLabel
//                           id="personal-emcontact-label"
//                           sx={{ color: "black" }}
//                         >
//                           Capture Photo{renderRequiredAsterisk(true)}
//                         </InputLabel>
//                         <div className="camera-container">
//                           <div className="video-container" style={{ position: 'relative' }}>
//                             <video ref={videoRef} className="video" autoPlay style={{ display: stream ? 'block' : 'none', width: '100%' }}></video>
//                             <canvas ref={canvasRef} className="canvas" style={{ display: 'none' }}></canvas>
//                             {photoSrc && <img src={photoSrc} alt="Captured" className="photo" style={{ width: '96%', position: 'absolute', top: 0, left: 0 }} />}
//                           </div>
//                           <div className="button-container" style={{ marginTop: '10px' }}>
//                             {!stream && !photoSrc && (
//                               <button type="button" onClick={startCamera} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px' }}>
//                                 Start Camera<CameraAltIcon />
//                               </button>
//                             )}
//                             {stream && !photoSrc && (
//                               <button type="button" onClick={capturePhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px', backgroundColor: 'rgb(93 210 120 / 89%)', color: 'white', }}>
//                                 Capture Photo<CameraAltIcon />
//                               </button>
//                             )}
//                             {!stream && photoSrc && (
//                               <button type="button" onClick={repeatPhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px', backgroundColor: 'rgb(214 94 105 / 78%)', color: 'white', }}>
//                                 Repeat Photo<CameraAltIcon />
//                               </button>
//                             )}
//                             {/* <input type="file" name="" accept="image/*" capture="user" id=""/> */}
//                           </div>
//                         </div>
//                         <input
//                           type="hidden"
//                           id="photoInput"
//                           name="photoInput"
//                           value={photoSrc || ''}
//                           required
//                           onChange={(e) => setFormData((prevFormData) => {
//                             // console.log("photoInput", e.target.value)
//                             return { ...prevFormData, photoInput: e.target.value }
//                           })}
//                         />

//                       </div>
//                       <div className="navigation-buttons">
//                         <button onClick={() => handlePrevious('/kyc')}>Previous</button>
//                         <button onClick={() => handleNext('/bankDetails')} style={{ marginLeft: "10px" }}>Next</button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </li>

//             <li>
//               <div className="title" onClick={toggleBankDetailsCollapse}>

//                 <AccountBalanceIcon />
//                 <span className="bullet" style={{ color: getBulletColor(bankDetailsCompleted) }}>&#8226;</span>
//                 <Link to="/bankDetails" className="sidebar-link">
//                   <span className="mainsName">Bank Details</span>
//                   <div className="detail-icons">
//                     {isBankDetailsCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
//                   </div>
//                 </Link>
//               </div>
//               <div className={`collapsible-content ${isBankDetailsCollapsed ? 'collapsed' : ''}`}>
//                 <div className="form-body">
//                   {formType === "bankDetails" && (
//                     <>
//                       <div className="locations">
//                         <div className="bankDetails-field">
//                           <InputLabel id="bank-name-label" sx={{ color: "black" }}>
//                             Bank Name
//                           </InputLabel>
//                           <input
//                             type="text"
//                             id="bankName"
//                             name="bankName"
//                             required
//                             value={formData.bankName || ''}
//                             onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
//                             style={getInputStyle('bankName')}
//                           />
//                         </div>

//                         <div className="bankDetails-field">
//                           <InputLabel id="branch-label" sx={{ color: "black" }}>
//                             Branch
//                           </InputLabel>
//                           <input
//                             type="text"
//                             id="branch"
//                             name="branch"
//                             required
//                             value={formData.branch || ''}
//                             onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
//                             style={getInputStyle('branch')}

//                           />
//                         </div>
//                       </div>

//                       <div className="locations">
//                         <div className="bankDetails-field">
//                           <InputLabel id="account-number-label" sx={{ color: "black" }}>
//                             Account Number
//                           </InputLabel>
//                           <input
//                             type="text"
//                             id="accountNumber"
//                             name="accountNumber"
//                             required
//                             value={formData.accountNumber || ''}
//                             onChange={handleAccountNumberChange}
//                             style={getInputStyle('accountNumber')}
//                             maxLength={16}
//                             onKeyDown={(e) => {
                             
//                               if (
//                                 !(
//                                   (e.key >= '0' && e.key <= '9') || // Allow numbers
//                                   e.key === 'Backspace' ||
//                                   e.key === 'Delete' ||
//                                   e.key === 'ArrowLeft' ||
//                                   e.key === 'ArrowRight' ||
//                                   e.key === 'Tab'
//                                 )
//                               ) {
//                                 e.preventDefault();
//                               }
//                             }}
//                           />
//                         </div>

//                         <div className="bankDetails-field">
//                           <InputLabel id="ifsc-label" sx={{ color: "black" }}>
//                             IFSC code
//                           </InputLabel>
//                           <input
//                             type="text"
//                             id="ifsc"
//                             name="ifsc"
//                             required
//                             value={formData.ifscCode || ''}
//                             onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
//                             style={getInputStyle('ifscCode')}
//                           />
//                         </div>
//                       </div>

//                       {/* <div className="locations">
//                         <div className="bankDetails-field">
//                           <InputLabel id="branch-label" sx={{ color: "black" }}>
//                             Payment Mode
//                           </InputLabel>
//                           <input
//                             type="text"
//                             id="Payment_Mode"
//                             name="Payment_Mode"
//                             required
//                             value={formData.Payment_Mode || 'NEFT'}
//                             onChange={handleChanges}
//                             style={getInputStyle('Payment_Mode')}
//                           />
//                         </div>
//                       </div> */}

//                       {/* <div className="bankDetails-field">
//                         <InputLabel id="id-card-label" sx={{ color: "black" }}>
//                           Id Proof{renderRequiredAsterisk(true)}
//                         </InputLabel>
//                         <input type="file" onChange={() => { }} required />
//                       </div> */}
//                       <div className="navigationBut">
//                         <button onClick={() => handlePrevious('/personal')}>Previous</button>
//                         <button onClick={() => handleNext('/project')} style={{ marginLeft: "10px" }}>Next</button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </li>

//             <li>
//               <div className="title" onClick={toggleProjectCollapse}>
//                 <AssignmentIcon />
//                 <span className="bullet" style={{ color: getBulletColor(projectCompleted) }}>&#8226;</span>

//                 <Link to="/project" className="sidebar-link">
//                   <span className="mainsName">Project</span>
//                   <div className="detail-icons3">
//                     {isProjectCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
//                   </div>
//                 </Link>

//               </div>
//               <div className={`collapsible-content ${isProjectCollapsed ? 'collapsed' : ''}`}>
//                 <div className="form-body">
//                   {formType === "project" && (
//                     <>
//                       <div>
//                         <div className="locations">
//                           {formData.labourOwnership === "Contractor" && (
//                             <div className="locations">
//                               <div className="name">
//                                 <InputLabel id="contractor-name-label" sx={{ color: "black" }}>
//                                   Contractor Name{renderRequiredAsterisk(true)}
//                                 </InputLabel>
//                                 <input
//                                   value={formData.contractorName || ''}
//                                   onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
//                                   style={getInputStyle('contractorName')}
//                                   required
//                                 />
//                               </div>
//                               <div className="contact">
//                                 <InputLabel id="contractor-number-label" sx={{ color: "black" }}>
//                                   Contractor Number{renderRequiredAsterisk(true)}
//                                 </InputLabel>
//                                 <input
//                                   value={formData.contractorNumber || ''}
//                                   onChange={handleContractorNumberChange}
//                                   style={getInputStyle('contractorNumber')}
//                                   required
//                                 />
//                                 {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                         <div className="locations">
//                           <div className="project-field">
//                             <InputLabel id="project-name-label" sx={{ color: 'black' }}>
//                               Project Name{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <div className="gender-input">
//                               <select
//                                 id="projectName"
//                                 name="projectName"
//                                 value={formData.projectName}
//                                 // onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
//                                 onChange={handleInputChange}
//                                 style={getInputStyle('projectName')}
//                                 required
//                               >
//                                 <option value="" >Select a project</option>
//                                 {projectNames.map(project => (
//                                   // <option key={project.id} value={project.Business_Unit}>{project.Business_Unit}</option>
//                                   <option key={project.id} value={project.id}>{project.Business_Unit}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>

//                           <div className="gender">
//                             <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
//                               Company Name{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <div className="gender-input">
//                               <select
//                                 id="companyName"
//                                 name="companyName"
//                                 required
//                                 value={formData.companyName}
//                                 onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                                 style={getInputStyle('companyName')}
//                               >
//                                 {/* <option value="" >Select Company Name</option> */}
//                                 {companyNames.map(company => (
//                                   <option key={company.id} value={company.Company_Name}>{company.Company_Name}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>



                         
//                         </div>
//                         <div className="locations">
//                           <div className="project-field">
//                             <InputLabel id="department-label" sx={{ color: 'black' }}>
//                               Department{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <div className="gender-input">
//                               <select
//                                 id="department"
//                                 name="department"
//                                 value={formData.department}
//                                 // onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//                                 onChange={handleInputChange}
//                                 style={getInputStyle('department')}
//                                 required
//                               >
//                                 <option value="" >Select a Department</option>
//                                 {departments.map(department => (
//                                   <option key={department.Id} value={department.Id}>{department.Description}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
//                           <div className="project-field">
//                             <InputLabel id="designation-label" sx={{ color: 'black' }}>
//                               Designation{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <div className="gender-input">
//                               <select
//                                 id="designation"
//                                 name="designation"
//                                 value={formData.designation}
//                                 onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
//                                 style={getInputStyle('designation')}
//                                 required
//                               >
//                                 {/* <option value="" >Select a Designation</option> */}
//                                 {designations.map(designation => (
//                                   <option key={designation.id} value={designation.Description}>{designation.Description}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="locations">

//                         <div className="project-field">
//                             <InputLabel id="labour-category-label" sx={{ color: 'black' }}>
//                               Labour Category{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <div className="gender-input">
//                               <select
//                                 id="labourCategory"
//                                 name="labourCategory"
//                                 value={formData.labourCategory}
//                                 onChange={(e) => setFormData({ ...formData, labourCategory: e.target.value })}
//                                 style={getInputStyle('labourCategory')}
//                                 required
//                               >
//                                 <option value="" >Select a Labour Category</option>
//                                 {labourCategories.map(category => (
//                                   <option key={category.Id} value={category.Description}>{category.Description}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
//                           <div className="project-field">
//                             <InputLabel id="working-hours-label" sx={{ color: 'black' }}>
//                               Working Hours{renderRequiredAsterisk(true)}
//                             </InputLabel>
//                             <div className="gender-input">
//                               <select
//                                 id="workingHours"
//                                 name="workingHours"
//                                 value={formData.workingHours}
//                                 onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
//                                 style={getInputStyle('workingHours')}
//                                 required
//                               >
//                                 <option value="" >Select Working Hours</option>
//                                 {workingHours.map(hours => (
//                                   <option key={hours.Id} value={hours.Shift_Name}>{hours.Shift_Name}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           </div>
                         
//                         </div>


//                         <div className="buttons-container">
//                           <div className="navigation-buttons">
//                             {/* <button onClick={() => handleNext('/project')} style={{marginLeft: '10px'}}>Next</button> */}
//                           </div>
//                           <div className="save-btn">
//                             <button
//                               onClick={() => handlePrevious('/bankDetails')}
//                               style={{ marginRight: '10px' }}
//                               className="btn btn-previous"
//                             > Previous
//                             </button>
//                             <button
//                               variant="contained"
//                               type="button"
//                               // onClick={openModal}
//                               onClick={handlePreview}
//                               className="btn btn-preview"
//                             > Preview
//                             </button>
//                             <button
//                               type="submit"
//                               id="save"
//                               className={`btn btn-save save-button ${saved ? 'saved' : ''}`}
//                               onClick={handleSubmit}
//                             >
//                               {saved ? <FaCheck className="icon" /> : 'Submit'}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </li>
//             {renderPreviewModal()}
//           </ul>

//         </form>

//         {saved && (
//           <>
//             <div className="overlay"></div>
//             <div className={`popup ${popupType}`}>
//               <h2>{popupType === 'success' ? 'Thank You!' : 'Error'}</h2>
//               <p>{popupMessage}</p>
//               <button className={`ok-button ${popupType}`} onClick={() => setSaved(false)}>
//                 <span className={`icon ${popupType}`}>
//                   {popupType === 'success' ? '✔' : '✘'}
//                 </span> Ok
//               </button>
//             </div>
//           </>
//         )}

//         <style jsx>{`
//         body {
//           font-family: 'Roboto', sans-serif;
//           background-color: #f8f9fa;
//         }

//         .input-container {
//           margin: 20px 0;
//           position: relative;
//         }

//         .input-field {
//           width: 100%;
//           padding: 10px 15px;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           font-size: 16px;
//           outline: none;
//           transition: border-color 0.3s, box-shadow 0.3s;
//         }

//         .input-field:focus {
//           border-color: #007bff;
//           box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
//         }

//         .input-field:hover {
//           border-color: #0056b3;
//         }

//         .error-message {
//           color: red;
//           font-size: 14px;
//           margin-top: 5px;
//           display: block;
//         }

//         .popup {
//           position: fixed;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           padding: 20px;
//           background: white;
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           z-index: 1000;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .popup.success {
//           background-color: #d4edda;
//           border-color: #c3e6cb;
//         }

//         .popup.error {
//           background-color: #f8d7da;
//           border-color: #f5c6cb;
//         }

//         .popup h2 {
//           margin: 0 0 10px;
//         }

//         .popup p {
//           margin: 0 0 20px;
//         }

//         .popup .ok-button {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 10px 20px;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//         }

//         .popup .ok-button.success {
//           background-color: #28a745;
//           color: white;
//         }

//         .popup .ok-button.error {
//           background-color: #dc3545;
//           color: white;
//         }

//         .popup .ok-button:hover.success {
//           background-color: #218838;
//         }

//         .popup .ok-button:hover.error {
//           background-color: #c82333;
//         }

//         .popup .icon {
//           margin-right: 10px;
//         }

//         .overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           z-index: 999;
//         }
//         @media (min-width: 468px) {
//           .popup {
//             width: 300px; 
//           }
//         }
      
//         @media (min-width: 1024px) {
//           .popup {
//             width: 300px; 
//           }
//         }
      
//         @media (min-width: 1280px) {
//           .popup {
//             width: 300px; 
//           }
//         }
//       `}</style>
//       </div>
//     </Box>
//   );
// };


// export default OnboardingForm;
















import React, { useState, useRef, useEffect, useCallback } from "react";
import { InputLabel, Box } from '@mui/material';
import "./OnBoardingForm.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { FaArrowLeft, FaEye, FaCheck } from 'react-icons/fa';
import SearchBar from "../SarchBar/SearchBar";
import Loading from "../Loading/Loading";
import { API_BASE_URL, INDUCTED_BY_OPTIONS } from "../../Data"
import LabourDetails from "../LabourDetails/LabourDetails";
import ViewDetails from "../ViewDetails/ViewDetails";
import { useUser } from '../../UserContext/UserContext';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';
import { IconButton } from '@mui/material';

const OnboardingForm = ({ formType, onFormSubmit, onPhotoCapture, availableProjectNames = [], availableDepartments = []}) => {
  const { user } = useUser();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [isKYCCollapsed, setIsKYCCollapsed] = useState(true);
  const [isPersonalCollapsed, setIsPersonalCollapsed] = useState(true);
  const [isBankDetailsCollapsed, setIsBankDetailsCollapsed] = useState(true);
  const [isProjectCollapsed, setIsProjectCollapsed] = useState(true);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [projectCompleted, setProjectCompleted] = useState(false);
  const [personalCompleted, setPersonalCompleted] = useState(false);
  const [bankDetailsCompleted, setBankDetailsCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [newError, setNewError] = useState('');
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadAadhaarFront, setuploadAadhaarFront] = useState('');
  const [uploadAadhaarBack, setuploadAadhaarBack] = useState('');
  const [uploadIdProof, setuploadIdProof] = useState('');
  const [uploadInductionDoc, setuploadInductionDoc] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saved, setSaved] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [isAddUserCollapsed, setIsAddUserCollapsed] = useState(true);
  const [isLabourDetailsCollapsed, setIsLabourDetailsCollapsed] = useState(true);
  // New Chages for dorpdown
  const [projectNames, setProjectNames] = useState([]);
  const [labourCategories, setLabourCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [nextID, setNextID] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [aadhaarFrontData, setAadhaarFrontData] = useState({});
  const [formData, setFormData] = useState({
    uploadAadhaarFront: '',
    uploadAadhaarBack: '',
    uploadIdProof: '',
    name: '',
    aadhaarNumber: '',
    dateOfBirth: '',
    contactNumber: '',
    gender: '',
    dateOfJoining: '',
    address: '',
    pincode: '',
    taluka: '',
    district: '',
    village: '',
    state: '',
    emergencyContact: '',
    photoSrc: '',
    labourOwnership: 'VJ',
    bankName: '',
    branch: '',
    accountNumber: '',
    ifscCode: '',
    contractorName: '',
    contractorNumber: '',
    projectName: '',
    labourCategory: '',
    department: '',
    workingHours: '',
    designation: '',
    title: 'Mr',
    companyName: '',
    // Marital_Status: 'MARRIED',
    // nationality: 'Indian',
    Payment_Mode: 'NEFT',
    // Employee_Type: 'PERMANENT',
    // Current_Status: 'WORKING',
    // Seating_Office: 'SITE LABOUR',
    projectDescription: '',
    departmentDescription: '',
    OnboardName: user.name ,
    Induction_Date: '',
    Inducted_By: '',
    uploadInductionDoc: '',
    expiryDate: '',
  });

  const [formStatus, setFormStatus] = useState({
    kyc: false,
    personal: false,
    bankDetails: false,
    project: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);


  const collapseAll = () => {
    setIsKYCCollapsed(true);
    setIsPersonalCollapsed(true);
    setIsBankDetailsCollapsed(true);
    setIsProjectCollapsed(true);
  };

  const handleNext = (route) => {
    collapseAll();
    switch (route) {
      case '/personal':
        setIsPersonalCollapsed(false);
        break;
      case '/bankDetails':
        setIsBankDetailsCollapsed(false);
        break;
      case '/project':
        setIsProjectCollapsed(false);
        break;
      default:
        break;
    }
    navigate(route);
  };

  const handlePrevious = (route) => {
    collapseAll();
    switch (route) {
      case '/kyc':
        setIsKYCCollapsed(false);
        break;
      case '/personal':
        setIsPersonalCollapsed(false);
        break;
      case '/bankDetails':
        setIsBankDetailsCollapsed(false);
        break;
      default:
        break;
    }
    navigate(route);
  };

  

  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    const file = files[0];

    if (!file) return;

    const fileStateSetter = {
      uploadAadhaarFront: setuploadAadhaarFront,
      uploadAadhaarBack: setuploadAadhaarBack,
      photoSrc: setPhotoSrc,
      uploadIdProof: setuploadIdProof,
      uploadInductionDoc: setuploadInductionDoc,
    };

    const setStateFunction = fileStateSetter[name];
    if (setStateFunction) {
      // setStateFunction(file);
      setStateFunction(file.name); 
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file, 
      }));
    } else {
      console.error(`Unknown file input name: ${name}`);
      return;
    }

    setLoading(true);
    try {
      const ocrData = await uploadAadhaarImageToSurepass(file);

      // if (name === 'uploadAadhaarFront') {
      //   setAadhaarFrontData(ocrData);
      //   setFormData((prev) => ({
      //     ...prev,
      //     ...ocrData
      //   }));
      // } else if (name === 'uploadAadhaarBack') {
      //   setFormData((prev) => ({
      //     ...prev,
      //     ...aadhaarFrontData,
      //     ...ocrData
      //   }));
      // }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };



  const uploadAadhaarImageToSurepass = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A'
        }
      });

      const { data } = response;
      // console.log("aadhar ocr",data); 
      if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
        const ocrFields = data.data.ocr_fields[0];

        // Check if Aadhaar number already exists
        const existingAadhaarCheck = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber: ocrFields.aadhaar_number.value });

        if (existingAadhaarCheck.data.exists) {
          setMessageType('error');
          setNewError('User has already filled the form with this Aadhaar number.');
        } else {
          // console.log("zip", ocrFields.address?.zip);

          setNewError('');

          const removePrefixes = (address) => {
            const regex =  /\b(C\/O|D\/O|S\/O|W\/O|H\/O)\s*[^,]*,?\s*/gi;
            const cleanedAddress = address.replace(regex, '').trim();
            return cleanedAddress;
          };
  
          const cleanedAddress = ocrFields.address?.value ? removePrefixes(ocrFields.address?.value) : '';
        

          if(ocrFields.document_type === 'aadhaar_front_bottom'){
            setFormData((prev) => {
              return {
                ...prev,
                name: ocrFields.full_name?.value,
                dateOfBirth: ocrFields.dob?.value,
                gender: ocrFields.gender?.value ,
                aadhaarNumber: ocrFields.aadhaar_number.value,              
              }
            });
          }else{
            setFormData((prev) => {
              return {
                ...prev,
                village: ocrFields.address?.city,
                address: cleanedAddress,
                taluka: formData.taluka,
                district: ocrFields.address?.district,
                state: ocrFields.address?.state,
                pincode: ocrFields.address?.zip
              }
            });
          }

       
          if(ocrFields.address?.zip){
            handlePincodeChange(ocrFields.address?.zip);
          }
          setMessageType('success');
          setMessage('Congratulations! New Aadhaar number registered.');
        }
      } else {
        setNewError('Error reading Aadhaar details from image.');
      }
    } catch (error) {
      console.error('Error uploading Aadhaar image to Surepass:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      setNewError('Error uploading Aadhaar image. Please try again.');
    }
  };

  const handleAadhaarNumberChange = async (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value }));
    validateAadhaarNumber(value);

    if (value.length === 12 && /^\d{12}$/.test(value)) {
      try {
        const exists = await checkAadhaarExistence(value);
        if (exists) {
          setMessageType('error');
          setMessage('User has already filled the form with this Aadhaar number.');
          setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear the field
        } else {
          setMessageType('success');
          setMessage('Congratulations! New Aadhaar number registered.');
        }
      } catch (error) {
        console.error('Error checking Aadhaar number:', error);
        setMessageType('error');
        setMessage('Error checking Aadhaar number. Please try again.');
      }
    }
  };


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // Clear message after 5 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [message]);

  const checkAadhaarExistence = async (aadhaarNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking Aadhaar number existence:', error);
      return false;
    }
  };


  const fetchPincodeData = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      return null;
    }
  };
  const suggestionsRef = useRef(null);

  const handlePincodeChange = async (pincode) => {
    console.log("handlePincodeChange called")

    setFormData((prevFormData) => ({
      ...prevFormData,
      pincode,
    }));

    if (pincode.length === 6) {
      setLoading(true);
      const response = await fetchPincodeData(pincode);

      if (response && response[0] && response[0].Status === "Success") {
        setSuggestions(response[0].PostOffice);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        // const nearbyPincode = pincode.substring(0, 4);
        // const nearbyResponse = await fetchPincodeData(nearbyPincode);

        // if (nearbyResponse && nearbyResponse[0] && nearbyResponse[0].Status === "Success") {
        //   setSuggestions(nearbyResponse[0].PostOffice);
        //   setShowSuggestions(true);
        // } else {
        //   console.error('Location data not found');
        //   setShowSuggestions(false);
        // }
      }
      setLoading(false);
      // setShowSuggestions(false);
    } else {
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      village: suggestion.Name,
      taluka: suggestion.Block,
      district: suggestion.District,
      state: suggestion.State,
      pincode: suggestion.Pincode
    }));
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // New changes start here ---------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNamesRes = await axios.get(API_BASE_URL + `/api/project-names`);
        const labourCategoriesRes = await axios.get(API_BASE_URL + `/api/labour-categories`);
        const departmentsRes = await axios.get(API_BASE_URL + `/api/departments`);
        const workingHoursRes = await axios.get(API_BASE_URL + `/api/working-hours`);
        setProjectNames(projectNamesRes.data);
        setLabourCategories(labourCategoriesRes.data);
        setDepartments(departmentsRes.data);
        setWorkingHours(workingHoursRes.data);


      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [setDepartments, setProjectNames]);

  useEffect(() => {
    const fetchDesignations = async () => {
      if (formData.department) {
        try {
          const designationsRes = await axios.get(API_BASE_URL + `/api/designations/${formData.department}`);
          setDesignations(designationsRes.data);

          if (designationsRes.data.length > 0 && !formData.designation) {
            setFormData(prevFormData => ({
              ...prevFormData,
              designation: designationsRes.data[0].Description
            }));
          }

        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchDesignations();
  }, [formData.department]);

  useEffect(() => {
    const fetchCompanyNames = async () => {
      if (formData.projectName) {
        try {
          const companyNamesRes = await axios.get(API_BASE_URL + `/api/company-names/${formData.projectName}`);
          setCompanyNames(companyNamesRes.data);

          if (companyNamesRes.data.length > 0 && !formData.companyName) {
            setFormData(prevFormData => ({
              ...prevFormData,
              companyName: companyNamesRes.data[0].Company_Name
            }));
          }

        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchCompanyNames();
  }, [formData.projectName]);

  // New changes end here ----------------------------------

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(API_BASE_URL + `/labours/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error searching. Please try again.');
    }

  };

  // const CameraCapture = () => {
  const [stream, setStream] = useState(null);
  const [photoSrc, setPhotoSrc] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     videoRef.current.srcObject = stream;
  //     setStream(stream);
  //   } catch (err) {
  //     console.error("Error accessing camera: ", err);
  //   }
  // };
  const startCamera = async () => {
    try {
      // Define video constraints for better compatibility
      const constraints = {
        video: {
          // facingMode: 'user' 
          facingMode: facingMode
        }
      };

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setStream(stream);
      } else {
        console.error("getUserMedia is not supported by this browser.");
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      if (err.name === 'NotAllowedError') {
        console.error("Permission denied. Please allow camera access in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        console.error("No camera found on the device.");
      } else if (err.name === 'NotReadableError') {
        console.error("Unable to access the camera. It might be in use by another application.");
      } else {
        console.error("Unknown error: ", err);
      }
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/png');
    setPhotoSrc(photo);
    stopCamera();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const repeatPhoto = () => {
    setPhotoSrc('');
    startCamera();
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
    stopCamera();
    startCamera();
  };

  const handleSelectLabour = (labour) => {
    const {
      labourOwnership,
      name,
      aadhaarNumber,
      dateOfBirth,
      contactNumber,
      gender,
      dateOfJoining,
      address,
      pincode,
      taluka,
      district,
      village,
      state,
      emergencyContact,
      photoSrc,
      bankName,
      branch,
      accountNumber,
      ifscCode,
      projectName,
      labourCategory,
      department,
      designation,
      workingHours,
      contractorName,
      contractorNumber,
      title,
      Marital_Status,
      companyName,
      
    } = labour;

    setFormData({
      labourOwnership,
      name,
      aadhaarNumber,
      dateOfBirth,
      contactNumber,
      gender,
      dateOfJoining,
      address,
      pincode,
      taluka,
      district,
      village,
      state,
      emergencyContact,
      photoSrc,
      bankName,
      branch,
      accountNumber,
      ifscCode,
      projectName,
      labourCategory,
      department,
      workingHours,
      designation,
      contractorName,
      contractorNumber,
      title,
      Marital_Status,
      companyName,
      OnboardName: user.name ,
      // Nationality: 'Indian',
      // Payment_Mode: 'NEFT',
      // Employee_Type: 'PERMANENT',
      // Current_Status: 'WORKING',
      // Seating_Office: 'SITE LABOUR',
    });

    setSearchQuery('');
    setSearchResults([]);

    // console.log('Selected Labour:', labour);
  };


  // const renderPreviewModal = () => {
  //   if (!isModalOpen) return null;
  //   return (
  //     <div className="overlay">
  //       <div className="preview-modal">
  //         <button id="close-button" onClick={closeModal}></button>
  //         <ul>
  //           {Object.entries(formData).map(([key, value]) => (
  //             <li key={key}>
  //               <strong>{capitalizeFirstLetter(key)}:</strong> {value}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   );
  // };

  const toggleAddUserCollapse = () => {
    setIsAddUserCollapsed(!isAddUserCollapsed);
  };

  const toggleLabourDetailsCollapse = () => {
    setIsLabourDetailsCollapsed(!isLabourDetailsCollapsed);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleKYCCollapse = () => {
    setIsKYCCollapsed(!isKYCCollapsed);
  };

  const togglePersonalCollapse = () => {
    setIsPersonalCollapsed(!isPersonalCollapsed);
  };

  const toggleBankDetailsCollapse = () => {
    setIsBankDetailsCollapsed(!isBankDetailsCollapsed);
  };

  const toggleProjectCollapse = () => {
    setIsProjectCollapsed(!isProjectCollapsed);
  };
  const renderRequiredAsterisk = (isRequired) => {
    return isRequired ? <span style={{ color: "red" }}> *</span> : null;
  };

  const kycRequiredFields = ['labourOwnership', 'uploadAadhaarFront', 'uploadAadhaarBack', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber', 'uploadIdProof',];
  const personalRequiredFields = ['dateOfJoining', 'address', 'pincode', 'taluka', 'district', 'village', 'state', 'emergencyContact', 'photoSrc'];
  const bankDetailsRequiredFields = ['bankName', 'branch', 'accountNumber', 'ifscCode'];
  const projectRequiredFields = ['contractorName', 'contractorNumber', 'projectName', 'labourCategory', 'department', 'workingHours', 'designation'];

  // Check if all required fields are filled
  const isFormComplete = (form, requiredFields) => {
    return requiredFields.every(field => form[field] !== '');
  };

  const checkKycFormCompletion = () => isFormComplete(formData, kycRequiredFields);
  const checkPersonalFormCompletion = () => isFormComplete(formData, personalRequiredFields);
  const checkBankDetailsFormCompletion = () => isFormComplete(formData, bankDetailsRequiredFields);
  const checkProjectFormCompletion = () => isFormComplete(formData, projectRequiredFields);

  useEffect(() => {
    setKycCompleted(checkKycFormCompletion());
    setPersonalCompleted(checkPersonalFormCompletion());
    setBankDetailsCompleted(checkBankDetailsFormCompletion());
    setProjectCompleted(checkProjectFormCompletion());
  }, [formData]);

  const getBulletColor = (isCompleted) => {
    return isCompleted ? '#20C305' : '#FFBF00';
  };
  // const getBulletColor = () => {
  //   if (formType === "kyc") {
  //     return kycCompleted ? '#20C305' : '#FFBF00';
  //   } else if (formType === "project") {
  //     return projectCompleted ? '#20C305' : '#FFBF00';
  //   } else {
  //     return '#FFBF00';
  //   }
  // };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    if (today < birthdayThisYear) {
      age--;
    }
    if (age < 18) {
      setErrorMessage('Age must be 18 or older.');
    } else {
      setErrorMessage('');
    }
    setFormData({ ...formData, dateOfBirth: e.target.value });
  };


  const validateForm = () => {
    const requiredFields = [
      'labourOwnership', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber',
      'dateOfJoining', 'address', 'pincode', 'taluka', 'district', 'village', 'state', 'emergencyContact',
      'projectName', 'labourCategory', 'department', 'workingHours', 'designation'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field.`);
        return false;
      }
    }

    // if (!formData.village) {
    //   toast.warn("Village field is empty. Please consider filling it.");
    // }

    return true;
  };


  const base64ToBlob = (base64String, mimeType = 'application/octet-stream') => {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    return blob;
  };


  // const base64ToBlob = (base64, mimeType) => {
  //   const byteString = atob(base64.split(',')[1]);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const intArray = new Uint8Array(arrayBuffer);

  //   for (let i = 0; i < byteString.length; i++) {
  //     intArray[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([intArray], { type: mimeType });
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    // if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (uploadAadhaarFront && uploadAadhaarFront instanceof File) {
        formDataToSend.append('uploadAadhaarFront', uploadAadhaarFront, uploadAadhaarFront.name);
      } else {
        console.error('uploadAadhaarFront is not a file object');
      }

      if (uploadAadhaarBack && uploadAadhaarBack instanceof File) {
        formDataToSend.append('uploadAadhaarBack', uploadAadhaarBack, uploadAadhaarBack.name);
      } else {
        console.error('uploadAadhaarBack is not a file object');
      }

      if (uploadIdProof && uploadIdProof instanceof File) {
        formDataToSend.append('uploadIdProof', uploadIdProof, uploadIdProof.name);
      } else {
        console.error('uploadIdProof is not a file object');
      }

      if (uploadInductionDoc && uploadInductionDoc instanceof File) {
        formDataToSend.append('uploadInductionDoc', uploadInductionDoc, uploadInductionDoc.name);
      } else {
        console.error('uploadInductionDoc is not a file object');
      }

      if (photoSrc) {
        const photoBlob = base64ToBlob(photoSrc, 'image/jpeg');
        formDataToSend.append('photoSrc', photoBlob, 'captured_photo.jpg');
      }

      const response = await axios.post(API_BASE_URL + `/labours`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 201) {
        throw new Error('Form submission failed');
      }

      setPopupMessage(
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            textAlign: 'center',
            lineHeight: '1.5',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ fontSize: '1.2em', color: '#343a40' }}>Your details have been successfully submitted.</p>
          <p style={{ fontSize: '1.2em', color: 'rgb(22 152 61)' }}>
            Your Labour ID is in the approval stage.
          </p>
          <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
        </div>
      );
      setPopupType('success');
      setSaved(true);

      setFormData({});
      setuploadAadhaarFront(null);
      setuploadAadhaarBack(null);
      setuploadIdProof(null);
      setuploadInductionDoc(null);
      setPhotoSrc(null);

    } catch (error) {
      console.error('Form submission error:', error);
      setPopupMessage('Error submitting form. Please try again later.');
      setPopupType('error');
      setSaved(true);
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setSaved(false);
      // navigate('/labourDetails'); 
    }, 12000);
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setLoading(true);

  //   try {
  //     const { data: { nextID } } = await axios.get(API_BASE_URL + `/labours/next-id`);
  //     setNextID(nextID);

  //     const formDataToSend = new FormData();

  //     // console.log(formData);

  //     Object.keys(formData).forEach(key => {
  //       formDataToSend.append(key, formData[key]);
  //     });

  //     if (uploadAadhaarFront && uploadAadhaarFront instanceof File) {
  //       formDataToSend.append('uploadAadhaarFront', uploadAadhaarFront, uploadAadhaarFront.name);
  //     } else {
  //       console.error('uploadAadhaarFront is not a file object');
  //     }

  //     if (uploadAadhaarBack && uploadAadhaarBack instanceof File) {
  //       formDataToSend.append('uploadAadhaarBack', uploadAadhaarBack, uploadAadhaarBack.name);
  //     } else {
  //       console.error('uploadAadhaarBack is not a file object');
  //     }

  //     if (uploadIdProof && uploadIdProof instanceof File) {
  //       formDataToSend.append('uploadIdProof', uploadIdProof, uploadIdProof.name);
  //     } else {
  //       console.error('uploadIdProof is not a file object');
  //     }

  //     // if (uploadIdProof) {
  //     //   const photoBlob = base64ToBlob(uploadIdProof, 'image/jpeg');
  //     //   formDataToSend.append('uploadIdProof', photoBlob, 'id_photo.jpg');
  //     // }

  //     if (photoSrc) {
  //       const photoBlob = base64ToBlob(photoSrc, 'image/jpeg');
  //       formDataToSend.append('photoSrc', photoBlob, 'captured_photo.jpg');
  //     }

  //     // formDataToSend.append('labourID', nextID);

  //     const response = await axios.post(API_BASE_URL + `/labours`, formDataToSend, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (response.status !== 201) {
  //       throw new Error('Form submission failed');
  //     }

  //     // console.log('Form submission response:', response.data);
  //     // setPopupMessage(`Your details have been successfully submitted. Your Labour ID is ${nextID}. Thanks!`);
  //     setPopupMessage(
  //       <div
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'column',
  //           justifyContent: 'space-evenly',
  //           alignItems: 'center',
  //           textAlign: 'center',
  //           lineHeight: '1.5',
  //           padding: '20px',
  //           backgroundColor: '#f8f9fa',
  //           borderRadius: '10px',
  //           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  //         }}
  //       >
  //         <p style={{ fontSize: '1.2em', color: '#343a40' }}>Your details have been successfully submitted.</p>
  //         <p style={{ fontSize: '1.2em', color: '#343a40' }}>
  //           Your Labour ID is Approval Stage
  //            {/* <span style={{ fontSize: '1.5em', color: '#007bff', fontWeight: 700 }}>{nextID}</span>. */}
  //         </p>
  //         <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
  //       </div>
  //     );
  //     setPopupType('success');
  //     setSaved(true);
  //     // toast.success('Form submitted successfully!');

  //     setFormData({});
  //     setuploadAadhaarFront(null);
  //     setuploadAadhaarBack(null);
  //     setuploadIdProof(null);
  //     setPhotoSrc(null);

  //   } catch (error) {
  //     console.error('Form submission error:', error);
  //     setPopupMessage('Error submitting form. Please try again later.');
  //     setPopupType('error');
  //     setSaved(true);
  //   } finally {
  //     setLoading(false);
  //   }
  //   setTimeout(() => {
  //     setSaved(false);
  //   }, 12000);
  //   // console.log(userData);
  // };





  const handleFileChanges = async (event) => {
    const { name, files } = event.target;
    const file = files[0];

    if (!file) return;

    // console.log("Selected file:", file);

    const fileStateSetter = {

      uploadIdProof: setuploadIdProof,
    };
    const setStateFunction = fileStateSetter[name];
    if (setStateFunction) {
      // setStateFunction(file);
      setStateFunction(file.name); 
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file, 
      }));
    } else {
      console.error(`Unknown file input name: ${name}`);
      return;
    }
  }

  const handleFileChangesInduction = async (event) => {
    const { name, files } = event.target;
    const file = files[0];

    if (!file) return;

    // console.log("Selected file:", file);

    const fileStateSetter = {

      uploadInductionDoc: setuploadInductionDoc,
    };
    const setStateFunction = fileStateSetter[name];
    if (setStateFunction) {
      // setStateFunction(file);
      setStateFunction(file.name); // Set the file name for display
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file, // Set the file object for form submission
      }));
    } else {
      console.error(`Unknown file input name: ${name}`);
      return;
    }
  }




  // const uploadAadhaarImageToSurepass = async (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A'
  //       }
  //     });

  //     const { data } = response;
  //     console.log(data)
  //     if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
  //       const ocrFields = data.data.ocr_fields[0];

  //       setFormData({
  //         aadhaarNumber: ocrFields.aadhaar_number.value,
  //         name: ocrFields.full_name.value,
  //         dateOfBirth: ocrFields.dob.value,
  //         gender: ocrFields.gender.value,
  //         village: formData.village,
  //         taluka: formData.taluka,
  //         district: formData.district,
  //         state: formData.state,
  //         pincode: formData.pincode
  //       });
  //       setDateOfBirth(ocrFields.dob.value);
  //     } else {
  //       console.error('Error uploading Aadhaar image to Surepass: OCR fields not found in response');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading Aadhaar image to Surepass:', error);
  //   }
  // };




  const validateContactNumber = (number) => {
    const isValid = /^\d{10}$/.test(number);
    if (!isValid) {
      setError('Contact 10-digit number.');
    } else {
      setError('');
    }
  };

  const validateAadhaarNumber = (number) => {
    const isValid = /^\d{12}$/.test(number);
    if (!isValid) {
      setNewError('Aadhaar 12-digit number.');
    } else {
      setNewError('');
    }
  };

  const handleContactNumberChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, contactNumber: value });
    validateContactNumber(value);
  };

  const handleContractorNumberChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, contractorNumber: value });
    validateContactNumber(value);
  };

  const handleemergencyContactChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, emergencyContact: value });
    validateContactNumber(value);
  };

  const handleAccountNumberChange = (e) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    if (cleanedValue.length > 16) {
      cleanedValue = cleanedValue.slice(0, 16);
    }
    setFormData({ ...formData, accountNumber: cleanedValue });

  };


  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };


  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreview = () => {
    setSelectedLabour(formData);
    setIsModalOpen(true);
  };

  const openPreviewModal = () => {
    // Process formData to ensure no File objects are directly passed to selectedLabour
    const processedData = Object.keys(formData).reduce((acc, key) => {
      const value = formData[key];
      if (value instanceof File) {
        acc[key] = value.name; // or handle it in another appropriate way
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('Processed Form Data:', processedData); // Debugging
    setSelectedLabour(processedData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLabour(null);
    setIsModalOpen(false);
  };

  const renderPreviewModal = () => {
    if (!isModalOpen || !selectedLabour) return null;
    return (
      <ViewDetails
        selectedLabour={selectedLabour}
        onClose={closeModal}
        availableProjectNames={availableProjectNames}
        availableDepartments={availableDepartments}
      />
    );
  };
console.log('availableProjectNames',availableProjectNames)
console.log('availableDepartments',availableDepartments)

  const getInputStyle = (field) => {
    return formData[field]
      ? {
          borderColor: '#28a745',
          boxShadow: '0 0 5px rgba(40, 167, 69, 0.54)', 
        }
      : {
          borderColor: 'rgb(255 99 99)',
          boxShadow: '0 0 5px rgba(138, 147, 235, 0.54)',
        };
  };


  const uploadAadhaarImageToOCRSpace = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', 'YOUR_OCR_API_KEY');
    formData.append('language', 'eng');

    try {
      const response = await axios.post('https://api.ocr.space/parse/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { ParsedResults } = response.data;
      if (ParsedResults && ParsedResults.length > 0) {
        const parsedData = ParsedResults[0];
        setFormData({
          aadhaarNumber: parsedData.ParsedText.match(/\d{4}\s\d{4}\s\d{4}/)[0],
          name: parsedData.ParsedText.match(/(Name)(.*?)(Father|Mother|Spouse)/)[2].trim(),
          dateOfBirth: parsedData.ParsedText.match(/\d{2}\/\d{2}\/\d{4}/)[0],
        });
      }
    } catch (error) {
      console.error('Error uploading Aadhaar image to OCR.space:', error);
    }
  };



  const handleAddressSelect = (selectedAddress) => {
    const addressComponents = selectedAddress.display_name.split(', ');
    const city = addressComponents[1];
    const taluka = addressComponents[1];
    const district = addressComponents[2];
    const state = addressComponents[3];
    const pincode = addressComponents[7];

    setFormData((prevFormData) => ({
      ...prevFormData,
      address: selectedAddress.display_name,
      village: city,
      taluka: taluka || '',
      district: district || '',
      state: state || '',
      pincode: pincode || '',
    }));

    setSuggestions([]);
  };


  // const handleAadhaarNumberChange = (e) => {
  //   const { value } = e.target;
  //   setFormData({ ...formData, aadhaarNumber: value });
  //   validateAadhaarNumber(value);
  // };


  // const handleAadhaarNumberChange = async (e) => {
  //   const { value } = e.target;
  //   setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value }));
  //   validateAadhaarNumber(value);

  //   if (value.length === 12 && /^\d{12}$/.test(value)) {
  //     try {
  //       const exists = await checkAadhaarExistence(value);
  //       if (exists) {
  //         setNewError('User has already filled the form with this Aadhaar number.');
  //         // toast.error('User has already filled the form with this Aadhaar number.');
  //         setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear the field
  //       }
  //     } catch (error) {
  //       console.error('Error checking Aadhaar number:', error);
  //        setNewError('Error checking Aadhaar number. Please try again.');
  //     }
  //   }
  // };



  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        // console.log("Image data:", imageData);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSearchQuery(value);
  };

  // const handleTitleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  return (
    <Box p={{ paddingRight: 3 }}>
      <div className="onboarding-form-container">
        <ToastContainer />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          handleSelectLabour={handleSelectLabour}
        />

        <form className="onboarding-form" onSubmit={handleSubmit}>
          <ul style={{ marginLeft: "-20px" }}>
            <li>
              <div className="title" onClick={toggleKYCCollapse}>
                <PersonOutlineIcon />
                <span className="bullet" style={{ color: getBulletColor(kycCompleted) }}>&#8226;</span>
                <Link to="/kyc" className="sidebar-link">
                  <span className="mainsName">Kyc</span>
                  <div className="detail-icons1">
                    {isKYCCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </div>
                </Link>
              </div>
              <div className={`collapsible-content ${isKYCCollapsed ? 'collapsed' : ''}`}>
                <h2>{formType === "kyc" ? "KYC Form" : "Labour Onboarding Form"}</h2>
                <hr />
                <div className="form-body">
                  {formType === "kyc" && (
                    <>
                      <div className="labour-adhaar">


                        {loading && <Loading />}
                        <div className="project-field">
                          <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
                            Upload Aadhaar Front {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div className="input-with-icon">
                            <input
                              type="text"
                              value={uploadAadhaarFront}
                              placeholder="Choose file"
                              readOnly
                              style={{ cursor: 'pointer', backgroundColor: '#fff', ...getInputStyle('uploadAadhaarFront') }}
                              onClick={() => document.getElementById('uploadAadhaarFront').click()}
                            />
                            <input
                              type="file"
                              id="uploadAadhaarFront"
                              name="uploadAadhaarFront"
                              onChange={handleFileChange}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                            <DocumentScannerIcon className="input-icon" />
                          </div>
                        </div>
                        <div className="project-field">
                          <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
                            Upload Aadhaar Back
                          </InputLabel>
                          <div className="input-with-icon">
                            <input
                              type="text"
                              value={uploadAadhaarBack}
                              placeholder="Choose file"
                              readOnly
                              style={{ cursor: 'pointer', backgroundColor: '#fff', ...getInputStyle('uploadAadhaarBack')}}
                              onClick={() => document.getElementById('uploadAadhaarBack').click()}
                            />
                            <input
                              type="file"
                              id="uploadAadhaarBack"
                              name="uploadAadhaarBack"
                              onChange={handleFileChange}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                            <DocumentScannerIcon className="input-icon" />
                          </div>
                        </div>
                      </div>

                      <div className="name-contact">
                        <div className="labour-ownership">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Labour Ownership {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div id="select-container">
                            <select
                              id="labourOwnership"
                              className="select-wrapper"
                              name="labourOwnership"
                              required
                              value={formData.labourOwnership || ''}
                              onChange={(e) => setFormData({ ...formData, labourOwnership: e.target.value })}
                              style={getInputStyle('labourOwnership')} >
                              <option value="">Select Labour Ownership</option>
                              <option value="VJ" style={{ width: 'calc(100% - 20px)' }}>VJ</option>
                              <option value="Contractor" style={{ width: 'calc(100% - 20px)' }}>Contractor</option>
                            </select>
                          </div>
                        </div>

                        <div className="gender">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Title {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div className="gender-input">
                            <select
                              id="title"
                              name="title"
                              required
                              value={formData.title}
                              //  onChange={handleChange}
                              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                              style={getInputStyle('title')}
                            >
                              <option value="">Select Title</option>
                              <option value="Mr">MR.</option>
                              <option value="Mrs">MRS.</option>
                              <option value="Miss">MISS.</option>
                              <option value="Ms">MS.</option>
                            </select>
                          </div>
                        </div>
                      </div>


                      <div className="birth-aadhaar">
                        <div className="name">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Full Name{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={getInputStyle('name')}
                            required
                          />
                        </div>

                        <div className="adharNumber">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Aadhaar Number {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div id="adhaar-input">
                            <input
                              type="text"
                              name="aadhaarNumber"
                              value={formData.aadhaarNumber || ''}
                              onChange={handleAadhaarNumberChange}
                              style={getInputStyle('aadhaarNumber')}
                              required
                            />
                            {newError && <div style={{ color: 'red' }}>{newError}</div>}
                          </div>
                          {message && <div className={`popup-message ${messageType}`}>{message}</div>}
                        </div>
                      </div>


                      <div className="birth-aadhaar">
                        <div className="date">
                          <div className="birth-date">
                            <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                              Date of Birth{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <input
                              className="date-input"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={handleDateChange}
                              style={getInputStyle('dateOfBirth')}
                              max="2006-01-01"
                              required />
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                          </div>
                        </div>




                        <div className="contact">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Contact Number{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            value={formData.contactNumber || ''}
                            onChange={handleContactNumberChange}
                            style={getInputStyle('contactNumber')}
                            required
                          />
                          {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
                        </div>
                      </div>

                      <div className="birth-aadhaar">
                        <div className="gender">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Gender{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div className="gender-input">
                            <select
                              id="gender"
                              name="gender"
                              required
                              value={formData.gender}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              style={getInputStyle('gender')}>
                              {/* <option value="">Select Gender</option> */}
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>

                        <div className="project-field">
                          <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
                            Upload ID Proof {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div className="input-with-icon">
                            <input
                              type="text"
                              value={uploadIdProof}
                              placeholder="Choose file"
                              readOnly
                              style={{ cursor: 'pointer', backgroundColor: '#fff', ...getInputStyle('uploadIdProof') }}
                              onClick={() => document.getElementById('uploadIdProof').click()}
                            />
                            <input
                              type="file"
                              id="uploadIdProof"
                              name="uploadIdProof"
                              onChange={handleFileChanges}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                            <DocumentScannerIcon className="input-icon" />
                          </div>
                        </div>
                      </div>
                      <div className="navigationBut">
                        <button onClick={() => handleNext('/personal')}>Next</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>

            <li>
              <div className="title" onClick={togglePersonalCollapse}>
                <EditNoteIcon />
                <span className="bullet" style={{ color: getBulletColor(personalCompleted) }}>&#8226;</span>

                <Link to="/personal" className="sidebar-link">

                  <span className="mainsName">Personal</span>
                  <div className="detail-icons2">
                    {isPersonalCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </div>
                </Link>
              </div>
              <div className={`collapsible-content ${isPersonalCollapsed ? 'collapsed' : ''}`}>

                <div className="form-body">

                  {formType === "personal" && (
                    <>
                      <div className="locations">
                        <div className="joining-date">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            Date of joining{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="date-input"
                            type="date"
                            id="dateOfJoining"
                            name="dateOfJoining"
                            required
                            onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                            value={formData.dateOfJoining || ''}
                            style={getInputStyle('dateOfJoining')}
                          />
                        </div>

                        <div className="location-address-label">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            Address{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="address"
                            type="text"
                            id="address"
                            name="address"
                            required
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            value={formData.address || ''}
                            style={getInputStyle('address')}
                          />

                        </div>
                      </div>


                      {loading && <Loading />}
                      <div className="locations">
                      <div className="location-Village-label">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            Village/City{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="village"
                            type="text"
                            id="village" p
                            name="village"
                            required
                            value={formData.village || ''}
                            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                            style={getInputStyle('village')}
                          />
                        </div>

                        <div className="personal-pincode-field">
                          <InputLabel
                            id="personal-pincode-label"
                            sx={{ color: "black" }}
                            value={formData.pincode || " "}
                          >
                            Pincode{renderRequiredAsterisk(true)}
                          </InputLabel>

                          <input
                            type="text"
                            id="personal-pincode"
                            name="personal-pincode"
                            required
                            value={formData.pincode || ''}
                            onChange={(e)=>handlePincodeChange(e.target.value)}
                            style={getInputStyle('pincode')}
                          />
                         {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.Name}, {suggestion.Block}, {suggestion.District}, {suggestion.State}
            </li>
          ))}
        </ul>
      )}
                        </div>
                      </div>

                      <div className="state-block">
                        <div className="location-district-label">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            District{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="district"
                            type="text"
                            id="district"
                            name="district"
                            required
                            value={formData.district || ''}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            style={getInputStyle('district')}
                          />
                        </div>



                        <div className="location-taluka-label">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            Taluka{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="taluka"
                            type="text"
                            id="taluka"
                            name="taluka"
                            required
                            value={formData.taluka || ''}
                            onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                            style={getInputStyle('taluka')}
                          />
                        </div>
                      </div>

                      <div className="em-contact-block">
                        <div className="location-state-label">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            State{renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="state"
                            type="text"
                            id="state"
                            name="state"
                            required
                            value={formData.state || ''}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            style={getInputStyle('state')}
                          />
                        </div>


                        <div className="personal-emcontact-field">
                          <InputLabel
                            id="personal-emcontact-label"
                            sx={{ color: "black" }}
                          >
                            Emergency Contact{renderRequiredAsterisk(true)}
                          </InputLabel>

                          <input
                            type="text"
                            id="personal-emcontact"
                            name="personal-emcontact"
                            required
                            value={formData.emergencyContact || ''}
                            onChange={handleemergencyContactChange}
                            style={getInputStyle('emergencyContact')}
                          />
                          {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
                        </div>
                      </div>

                      <div className="em-contact-block">
                      
                        <div className="gender">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Marital Status {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div className="gender-input">
                            <select
                              id="Marital_Status"
                              name="Marital_Status"
                              required
                              value={formData.Marital_Status}
                              onChange={(e) => setFormData({ ...formData, Marital_Status: e.target.value })}
                              style={getInputStyle('Marital_Status')}
                            >
                              <option value="">Select Marital Status</option>
                              <option value="MARRIED">MARRIED</option>
                              <option value="UNMARRIED">UNMARRIED</option>
                              <option value="DIVORCE">DIVORCE</option>
                              <option value="WIDOWED">WIDOWED</option>
                            </select>
                          </div>
                        </div>
                      </div>



                      {/* <div className="location-photo-label">
                        <InputLabel
                          id="personal-emcontact-label"
                          sx={{ color: "black" }}
                        >
                          Capture Photo{renderRequiredAsterisk(true)}
                        </InputLabel>
                        <div className="camera-container">
                          <div className="video-container" style={{ position: 'relative' }}>
                            <video ref={videoRef} className="video" autoPlay style={{ display: stream ? 'block' : 'none', width: '100%' }}></video>
                            <canvas ref={canvasRef} className="canvas" style={{ display: 'none' }}></canvas>
                            {photoSrc && <img src={photoSrc} alt="Captured" className="photo" style={{ width: '96%', position: 'absolute', top: 0, left: 0 }} />}
                          </div>
                          <div className="button-container" style={{ marginTop: '10px' }}>
                            {!stream && !photoSrc && (
                              <button type="button" onClick={startCamera} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px' }}>
                                Start Camera<CameraAltIcon />
                              </button>
                            )}
                            {stream && !photoSrc && (
                              <button type="button" onClick={capturePhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px', backgroundColor: 'rgb(93 210 120 / 89%)', color: 'white', }}>
                                Capture Photo<CameraAltIcon />
                              </button>
                            )}
                            {!stream && photoSrc && (
                              <button type="button" onClick={repeatPhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px', backgroundColor: 'rgb(214 94 105 / 78%)', color: 'white', }}>
                                Repeat Photo<CameraAltIcon />
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="hidden"
                          id="photoInput"
                          name="photoInput"
                          value={photoSrc || ''}
                          required
                          onChange={(e) => setFormData((prevFormData) => {
                            return { ...prevFormData, photoInput: e.target.value }
                          })}
                        />

                      </div> */}

<div className="location-photo-label">
      <InputLabel
        id="personal-emcontact-label"
        sx={{ color: "black" }}
      >
        Capture Photo
      </InputLabel>
      <div className="camera-container">
        <div className="video-container" style={{ position: 'relative' }}>
          <video ref={videoRef} className="video" autoPlay style={{ display: stream ? 'block' : 'none', width: '100%' }}></video>
          <canvas ref={canvasRef} className="canvas" style={{ display: 'none' }}></canvas>
          {photoSrc && <img src={photoSrc} alt="Captured" className="photo" style={{ width: '96%', position: 'absolute', top: 0, left: 0 }} />}
          {stream && (
            <IconButton 
              onClick={toggleCamera} 
              style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#f66300', color: 'white', width:'20px' }}>
              <SwitchCameraIcon />
            </IconButton>
          )}
        </div>
        <div className="button-container" style={{ marginTop: '10px' }}>
          {!stream && !photoSrc && (
            <button type="button" onClick={startCamera} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px' }}>
              Start Camera <CameraAltIcon />
            </button>
          )}
          {stream && !photoSrc && (
            <button type="button" onClick={capturePhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px', backgroundColor: 'rgb(93 210 120 / 89%)', color: 'white', }}>
              Capture Photo <CameraAltIcon />
            </button>
          )}
          {!stream && photoSrc && (
            <button type="button" onClick={repeatPhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px', backgroundColor: 'rgb(214 94 105 / 78%)', color: 'white', }}>
              Repeat Photo <CameraAltIcon />
            </button>
          )}
        </div>
      </div>
      <input
        type="hidden"
        id="photoInput"
        name="photoInput"
        value={photoSrc || ''}
        required
        onChange={(e) => setFormData((prevFormData) => {
          return { ...prevFormData, photoInput: e.target.value }
        })}
      />
    </div>
                      <div className="navigation-buttons">
                        <button onClick={() => handlePrevious('/kyc')}>Previous</button>
                        <button onClick={() => handleNext('/bankDetails')} style={{ marginLeft: "10px" }}>Next</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>

            <li>
              <div className="title" onClick={toggleBankDetailsCollapse}>

                <AccountBalanceIcon />
                <span className="bullet" style={{ color: getBulletColor(bankDetailsCompleted) }}>&#8226;</span>
                <Link to="/bankDetails" className="sidebar-link">
                  <span className="mainsName">Bank Details</span>
                  <div className="detail-icons">
                    {isBankDetailsCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </div>
                </Link>
              </div>
              <div className={`collapsible-content ${isBankDetailsCollapsed ? 'collapsed' : ''}`}>
                <div className="form-body">
                  {formType === "bankDetails" && (
                    <>
                      <div className="locations">
                        <div className="bankDetails-field">
                          <InputLabel id="bank-name-label" sx={{ color: "black" }}>
                            Bank Name
                          </InputLabel>
                          <input
                            type="text"
                            id="bankName"
                            name="bankName"
                            required
                            value={formData.bankName || ''}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            style={getInputStyle('bankName')}
                          />
                        </div>

                        <div className="bankDetails-field">
                          <InputLabel id="branch-label" sx={{ color: "black" }}>
                            Branch
                          </InputLabel>
                          <input
                            type="text"
                            id="branch"
                            name="branch"
                            required
                            value={formData.branch || ''}
                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                            style={getInputStyle('branch')}

                          />
                        </div>
                      </div>

                      <div className="locations">
                        <div className="bankDetails-field">
                          <InputLabel id="account-number-label" sx={{ color: "black" }}>
                            Account Number
                          </InputLabel>
                          <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            required
                            value={formData.accountNumber || ''}
                            onChange={handleAccountNumberChange}
                            style={getInputStyle('accountNumber')}
                            maxLength={16}
                            onKeyDown={(e) => {
                             
                              if (
                                !(
                                  (e.key >= '0' && e.key <= '9') || // Allow numbers
                                  e.key === 'Backspace' ||
                                  e.key === 'Delete' ||
                                  e.key === 'ArrowLeft' ||
                                  e.key === 'ArrowRight' ||
                                  e.key === 'Tab'
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>

                        <div className="bankDetails-field">
                          <InputLabel id="ifsc-label" sx={{ color: "black" }}>
                            IFSC code
                          </InputLabel>
                          <input
                            type="text"
                            id="ifsc"
                            name="ifsc"
                            required
                            value={formData.ifscCode || ''}
                            onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                            style={getInputStyle('ifscCode')}
                          />
                        </div>
                      </div>

                      {/* <div className="locations">
                        <div className="bankDetails-field">
                          <InputLabel id="branch-label" sx={{ color: "black" }}>
                            Payment Mode
                          </InputLabel>
                          <input
                            type="text"
                            id="Payment_Mode"
                            name="Payment_Mode"
                            required
                            value={formData.Payment_Mode || 'NEFT'}
                            onChange={handleChanges}
                            style={getInputStyle('Payment_Mode')}
                          />
                        </div>
                      </div> */}

                      {/* <div className="bankDetails-field">
                        <InputLabel id="id-card-label" sx={{ color: "black" }}>
                          Id Proof{renderRequiredAsterisk(true)}
                        </InputLabel>
                        <input type="file" onChange={() => { }} required />
                      </div> */}
                      <div className="navigationBut">
                        <button onClick={() => handlePrevious('/personal')}>Previous</button>
                        <button onClick={() => handleNext('/project')} style={{ marginLeft: "10px" }}>Next</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>

            <li>
              <div className="title" onClick={toggleProjectCollapse}>
                <AssignmentIcon />
                <span className="bullet" style={{ color: getBulletColor(projectCompleted) }}>&#8226;</span>

                <Link to="/project" className="sidebar-link">
                  <span className="mainsName">Project</span>
                  <div className="detail-icons3">
                    {isProjectCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </div>
                </Link>

              </div>
              <div className={`collapsible-content ${isProjectCollapsed ? 'collapsed' : ''}`}>
                <div className="form-body">
                  {formType === "project" && (
                    <>
                      <div>
                        <div className="locations">
                          {formData.labourOwnership === "Contractor" && (
                            <div className="locations">
                              <div className="name">
                                <InputLabel id="contractor-name-label" sx={{ color: "black" }}>
                                  Contractor Name{renderRequiredAsterisk(true)}
                                </InputLabel>
                                <input
                                  value={formData.contractorName || ''}
                                  onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                                  style={getInputStyle('contractorName')}
                                  required
                                />
                              </div>
                              <div className="contact">
                                <InputLabel id="contractor-number-label" sx={{ color: "black" }}>
                                  Contractor Number{renderRequiredAsterisk(true)}
                                </InputLabel>
                                <input
                                  value={formData.contractorNumber || ''}
                                  onChange={handleContractorNumberChange}
                                  style={getInputStyle('contractorNumber')}
                                  required
                                />
                                {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="locations">
                          <div className="project-field">
                            <InputLabel id="project-name-label" sx={{ color: 'black' }}>
                              Project Name{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="projectName"
                                name="projectName"
                                value={formData.projectName}
                                // onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                onChange={handleInputChange}
                                style={getInputStyle('projectName')}
                                required
                              >
                                <option value="" >Select a project</option>
                                {projectNames.map(project => (
                                  // <option key={project.id} value={project.Business_Unit}>{project.Business_Unit}</option>
                                  <option key={project.id} value={project.id}>{project.Business_Unit}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="gender">
                            <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                              Company Name{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="companyName"
                                name="companyName"
                                required
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                style={getInputStyle('companyName')}
                              >
                                {/* <option value="" >Select Company Name</option> */}
                                {companyNames.map(company => (
                                  <option key={company.id} value={company.Company_Name}>{company.Company_Name}</option>
                                ))}
                              </select>
                            </div>
                          </div>



                         
                        </div>
                        <div className="locations">
                          <div className="project-field">
                            <InputLabel id="department-label" sx={{ color: 'black' }}>
                              Department{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="department"
                                name="department"
                                value={formData.department}
                                // onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                onChange={handleInputChange}
                                style={getInputStyle('department')}
                                required
                              >
                                <option value="" >Select a Department</option>
                                {departments.map(department => (
                                  <option key={department.Id} value={department.Id}>{department.Description}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="project-field">
                            <InputLabel id="designation-label" sx={{ color: 'black' }}>
                              Designation{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                style={getInputStyle('designation')}
                                required
                              >
                                {/* <option value="" >Select a Designation</option> */}
                                {designations.map(designation => (
                                  <option key={designation.id} value={designation.Description}>{designation.Description}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="locations">
                        <div className="project-field">
                            <InputLabel id="labour-category-label" sx={{ color: 'black' }}>
                              Labour Category{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="labourCategory"
                                name="labourCategory"
                                value={formData.labourCategory}
                                onChange={(e) => setFormData({ ...formData, labourCategory: e.target.value })}
                                style={getInputStyle('labourCategory')}
                                required
                              >
                                <option value="" >Select a Labour Category</option>
                                {labourCategories.map(category => (
                                  <option key={category.Id} value={category.Description}>{category.Description}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="project-field">
                            <InputLabel id="working-hours-label" sx={{ color: 'black' }}>
                              Working Hours{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="workingHours"
                                name="workingHours"
                                value={formData.workingHours}
                                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                style={getInputStyle('workingHours')}
                                required
                              >
                                <option value="" >Select Working Hours</option>
                                {workingHours.map(hours => (
                                  <option key={hours.Id} value={hours.Shift_Name}>{hours.Shift_Name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>


                        <div className="locations">
                        <div className="joining-date">
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{ color: "black" }}
                          >
                            Induction Date {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="date-input"
                            type="date"
                            id="Induction_Date"
                            name="Induction_Date"
                            required
                            onChange={(e) => setFormData({ ...formData, Induction_Date: e.target.value })}
                            value={formData.Induction_Date || ''}
                            style={getInputStyle('Induction_Date')}
                          />
                        </div>
                          <div className="project-field">
                            <InputLabel id="working-hours-label" sx={{ color: 'black' }}>
                              Induction By{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="Inducted_By"
                                name="Inducted_By"
                                value={formData.Inducted_By}
                                onChange={(e) => setFormData({ ...formData, Inducted_By: e.target.value })}
                                style={getInputStyle('Inducted_By')}
                                required
                              >
                                <option value="" >Select Inducted By</option>
                                {INDUCTED_BY_OPTIONS.map((name, index) => (
                                  <option key={index} value={name}>{name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>


                        <div className="locations">
                        <div className="project-field">
                          <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
                            Upload Induction Document {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <div className="input-with-icon">
                            <input
                              type="text"
                              value={uploadInductionDoc}
                              placeholder="Choose file"
                              readOnly
                              style={{ cursor: 'pointer', backgroundColor: '#fff', ...getInputStyle('uploadInductionDoc') }}
                              onClick={() => document.getElementById('uploadInductionDoc').click()}
                            />
                            <input
                              type="file"
                              id="uploadInductionDoc"
                              name="uploadInductionDoc"
                              onChange={handleFileChangesInduction}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                            <DocumentScannerIcon className="input-icon" />
                          </div>
                        </div>
                          </div>


                        <div className="buttons-container">
                          <div className="navigation-buttons">
                            {/* <button onClick={() => handleNext('/project')} style={{marginLeft: '10px'}}>Next</button> */}
                          </div>
                          <div className="save-btn">
                            <button
                              onClick={() => handlePrevious('/bankDetails')}
                              style={{ marginRight: '10px' }}
                              className="btn btn-previous"
                            > Previous
                            </button>
                            <button
                              variant="contained"
                              type="button"
                              // onClick={openModal}
                              onClick={openPreviewModal}
                              className="btn btn-preview"
                            > Preview
                            </button>
                            <button
                              type="submit"
                              id="save"
                              className={`btn btn-save save-button ${saved ? 'saved' : ''}`}
                              // onClick={handleSubmit}
                            >
                              {saved ? <FaCheck className="icon" /> : 'Submit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>
            {renderPreviewModal()}
          </ul>

        </form>

        {saved && (
          <>
            <div className="overlay"></div>
            <div className={`popup ${popupType}`}>
              <h2>{popupType === 'success' ? 'Thank You!' : 'Error'}</h2>
              <p>{popupMessage}</p>
              <button className={`ok-button ${popupType}`} onClick={() => setSaved(false)}>
                <span className={`icon ${popupType}`}>
                  {popupType === 'success' ? '✔' : '✘'}
                </span> Ok
              </button>
            </div>
          </>
        )}

        <style jsx>{`
        body {
          font-family: 'Roboto', sans-serif;
          background-color: #f8f9fa;
        }

        .input-container {
          margin: 20px 0;
          position: relative;
        }

        .input-field {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .input-field:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .input-field:hover {
          border-color: #0056b3;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }

        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .popup.success {
          background-color: #d4edda;
          border-color: #c3e6cb;
        }

        .popup.error {
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        .popup h2 {
          margin: 0 0 10px;
        }

        .popup p {
          margin: 0 0 20px;
        }

        .popup .ok-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .popup .ok-button.success {
          background-color: #28a745;
          color: white;
        }

        .popup .ok-button.error {
          background-color: #dc3545;
          color: white;
        }

        .popup .ok-button:hover.success {
          background-color: #218838;
        }

        .popup .ok-button:hover.error {
          background-color: #c82333;
        }

        .popup .icon {
          margin-right: 10px;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        @media (min-width: 468px) {
          .popup {
            width: 300px; 
          }
        }
      
        @media (min-width: 1024px) {
          .popup {
            width: 300px; 
          }
        }
      
        @media (min-width: 1280px) {
          .popup {
            width: 300px; 
          }
        }
      `}</style>
      </div>
    </Box>
  );
};


export default OnboardingForm;


