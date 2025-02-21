
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
import { FaRegTimesCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';


const departmentWorkingHoursMapping = {
  'CIVIL': 'FLEXI SHIFT - 8 HRS',
  'FIRE FIGHTING': 'FLEXI SHIFT - 9 HRS',
  'PLUMBING': 'FLEXI SHIFT - 9 HRS',
  'E & C Civil': 'FLEXI SHIFT - 8 HRS',
  'CCA': 'FLEXI SHIFT - 8 HRS',
  'EHCS': 'FLEXI SHIFT - 8 HRS',
  'ELECTRICAL': 'FLEXI SHIFT - 9 HRS',
  'FEP-R': 'FLEXI SHIFT - 9 HRS',
  'MQC': 'FLEXI SHIFT - 8 HRS',
};

const OnboardingForm = ({ formType, onFormSubmit, onPhotoCapture, projectList = [], departmentList = [] }) => {
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
  const location = useLocation();
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
  const [contactError, setContactError] = useState('');
  const [emergencyError, setEmergencyError] = useState('');
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [isAadhaarValid, setIsAadhaarValid] = useState(false);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const { labourId, onFormSubmitSuccess } = location.state || {};
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
    title: '',
    companyName: '',
    Marital_Status: '',
    projectDescription: '',
    departmentDescription: '',
    OnboardName: user.name,
    Induction_Date: '',
    Inducted_By: '',
    uploadInductionDoc: '',
    expiryDate: ''
  });

  const [formStatus, setFormStatus] = useState({
    kyc: false,
    personal: false,
    bankDetails: false,
    project: false
  });
  const [isApproved, setIsApproved] = useState(0);
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


    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const uploadAadhaarImageToSurepass = async (file, formStatus, isApproved) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Step 1: OCR API to extract Aadhaar number
      const ocrResponse = await axios.post('https://kyc-api.aadhaarkyc.io/api/v1/ocr/aadhaar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A',
        },
      });

      const { data: ocrData } = ocrResponse;
      if (!ocrData.success || !ocrData.data.ocr_fields || ocrData.data.ocr_fields.length === 0) {
        toast.error('Failed to extract Aadhaar details from the uploaded image. Please try again.');
        return;
      }

      const ocrFields = ocrData.data.ocr_fields[0];
      const aadhaarNumber = ocrFields.aadhaar_number.value;

      if (!aadhaarNumber) {
        toast.error('Aadhaar number not found in the uploaded image. Please upload a valid Aadhaar card image.');
        return;
      }
      // toast.success('Aadhaar details extracted successfully. Validating Aadhaar number...');

      // Step 2: Aadhaar Validation API
      const validationResponse = await axios.post(
        'https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-validation/aadhaar-validation',
        { id_number: aadhaarNumber },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A',
          },
        }
      );

      if (!validationResponse.data.success) {
        toast.error('Aadhaar number not valide. Please check the Aadhaar number and try again.');
        return;
      }

      toast.success('Aadhaar number validated successfully. Proceeding to backend checks...');

      // Step 3: Backend Aadhaar Check
      const checkAadhaarResponse = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber });

      // Skip Aadhaar check if LabourID is present
      if (checkAadhaarResponse.data.LabourID) {
        toast.success('Labour ID found. Proceeding without duplicate checks.');
        processAadhaarData(ocrFields);
        return; // Exit the function to avoid further checks
      }

      // Skip Aadhaar check if formStatus is 'Resubmitted' and isApproved === 3
      if (formStatus === 'Resubmitted' && isApproved === 3) {
        toast.success('Resubmitted form detected. Processing Aadhaar details...');
        processAadhaarData(ocrFields);
        return; // Exit the function to avoid further checks
      }

      // Proceed with Aadhaar check if the above conditions are not met
      if (checkAadhaarResponse.data.exists) {
        toast.error('This Aadhaar number is already in use. User has already filled the form.');
      } else {
        toast.success('Aadhaar number is unique. Processing details...');
        processAadhaarData(ocrFields);
      }
    } catch (error) {
      console.error('Error in Aadhaar upload process:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      toast.error('Aadhaar Number Verification Failed. Aadhaar upload Not successfully.');
    }
  };



  // const uploadAadhaarImageToSurepass = async (file, formStatus, isApproved) => {
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
  //     if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
  //       const ocrFields = data.data.ocr_fields[0];

  //       // Check Aadhaar details with backend
  //       const checkAadhaarResponse = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber: ocrFields.aadhaar_number.value });

  //       // Skip Aadhaar check if LabourID is present
  //       if (checkAadhaarResponse.data.LabourID) {
  //         processAadhaarData(ocrFields); // Process the Aadhaar data without checking for duplicates
  //         return; // Exit the function to avoid further checks
  //       }

  //       // Skip Aadhaar check if formStatus is 'Resubmitted' and isApproved === 3
  //       if (formStatus === 'Resubmitted' && isApproved === 3) {
  //         processAadhaarData(ocrFields); // Process the Aadhaar data for Resubmitted case
  //         return; // Exit the function to avoid further checks
  //       }

  //       // Proceed with Aadhaar check if the above conditions are not met
  //       if (checkAadhaarResponse.data.exists) {
  //         setMessageType('error');
  //         toast.error('User has already filled the form with this Aadhaar Number.');
  //       } else {
  //         processAadhaarData(ocrFields);
  //       }
  //     } else {
  //       setNewError('Error reading Aadhaar details from Image.');
  //     }
  //   } catch (error) {
  //     console.error('Error Uploading Aadhaar image to surepass:', error);
  //     if (error.response) {
  //       console.error('Error response data:', error.response.data);
  //     }
  //     setNewError('Error uploading Aadhaar image. Please try again.');
  //   }
  // };

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
  //     if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
  //       const ocrFields = data.data.ocr_fields[0];

  //       if (formStatus !== 'Resubmitted' || isApproved !== 3) {
  //         const existingAadhaarCheck = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber: ocrFields.aadhaar_number.value });

  //         if (existingAadhaarCheck.data.exists) {
  //           setMessageType('error');
  //           toast.error('User has Already filled the form with this Aadhaar Number.');
  //         } else {
  //           processAadhaarData(ocrFields);
  //         }
  //       } else {
  //         processAadhaarData(ocrFields);
  //       }
  //     } else {
  //       setNewError('Error reading Aadhaar details from Image.');
  //     }
  //   } catch (error) {
  //     console.error('Error Uploading Aadhaar image to surepass:', error);
  //     if (error.response) {
  //       console.error('Error response data:', error.response.data);
  //     }
  //     setNewError('Error uploading Aadhaar image. please try again.');
  //   }
  // };


  const processAadhaarData = (ocrFields) => {
    let localError = '';

    const removePrefixes = (address) => {
      const regex = /\b(C\/O|D\/O|S\/O|W\/O|H\/O)\s*[^,]*,?\s*/gi;
      return address.replace(regex, '').trim();
    };

    const cleanedAddress = ocrFields.address?.value ? removePrefixes(ocrFields.address?.value) : '';

    const genderMap = {
      'M': 'MALE',
      'F': 'FEMALE'
    };

    const gender = genderMap[ocrFields.gender?.value] || ocrFields.gender?.value;

    // Function to check if the age is under 18
    const checkAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (today < birthdayThisYear) {
        age--;
      }
      // return age < 18 || age > 60;
      if (age < 18) return 'underage';    // Labour is under 18
      if (age > 60) return 'overage';     // Labour exceeds 60
      return 'valid';
    };

    if (ocrFields.document_type === 'aadhaar_front_bottom') {

      const dob = ocrFields.dob?.value;

      const ageStatus = dob && checkAge(dob);
      if (ageStatus === 'underage') {
        localError = 'Labour is underage. Age must be 18 or older.';
        toast.error(localError);
        return; // Exit the function, don't fill the form fields
      }

      if (ageStatus === 'overage') {
        localError = 'Labour exceeds the age limit. Age must be 60 or younger.';
        toast.error(localError);
        return; // Exit the function, don't fill the form fields
      }

      setFormData((prev) => ({
        ...prev,
        name: ocrFields.full_name?.value,
        dateOfBirth: dob,
        // dateOfBirth: ocrFields.dob?.value,
        // gender: ocrFields.gender?.value,
        gender: gender,
        aadhaarNumber: ocrFields.aadhaar_number.value,
      }));
    } else {
      setFormData((prev) => {
        if (prev.aadhaarNumber && prev.aadhaarNumber !== ocrFields.aadhaar_number.value) {
          localError = 'The same Aadhaar card number and back photo should be uploaded.';
          toast.error(localError);
          return prev;
        }
        return {
          ...prev,
          village: ocrFields.address?.city,
          address: cleanedAddress,
          taluka: prev.taluka,
          district: ocrFields.address?.district,
          state: ocrFields.address?.state,
          pincode: ocrFields.address?.zip,
        };
      });
    }

    if (!localError) {
      if (ocrFields.address?.zip) {
        handlePincodeChange(ocrFields.address?.zip);
      }
      setMessageType('success');
      setMessage('Congratulations! New Aadhaar number registered.');
    }
  };




  const handleAadhaarNumberChange = async (e) => {
    const { value } = e.target;

    // Update form data with the Aadhaar number
    setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value }));
    setNewError('');
    // Validate Aadhaar number format
    if (value.length === 12) {
      // Validate Aadhaar number format
      if (/^\d{12}$/.test(value)) {
        try {
          // Step 1: Aadhaar Validation API
          const validationResponse = await axios.post(
            'https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-validation/aadhaar-validation',
            { id_number: value },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY0NzEwNDcxNCwianRpIjoiOWNhMDViZTAtZTMwYS00NTc5LTk5MzEtYWY3MmVmYzg1ZGFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmphdmRla2Fyc0BhYWRoYWFyYXBpLmlvIiwibmJmIjoxNjQ3MTA0NzE0LCJleHAiOjE5NjI0NjQ3MTQsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJyZWFkIl19fQ.cGYIaxfNm0BDCol5_7I1DaJFZE-jXSel2E63EHl2A4A',
              },
            }
          );

          // If Aadhaar Validation API fails
          if (!validationResponse.data.success) {
            toast.error('Aadhaar validation failed. Please check the Aadhaar number and try again.');
            setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' }));// Clear invalid Aadhaar number
            return;
          }

          // Step 2: Backend Check API
          const response = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber: value });
          const { exists, skipCheck } = response.data;

          if (skipCheck) {
            // If Aadhaar resubmission is detected
            setMessageType('success');
            setMessage('Congratulations! Aadhaar resubmission detected, proceeding with the form.');
            toast.success('Aadhaar resubmission detected, proceeding with the form.');
          } else {
            if (exists) {
              // If Aadhaar already exists in the backend
              setMessageType('error');
              toast.error('User has already filled the form with this Aadhaar number.');
              setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear the field
            } else {
              // If Aadhaar is unique
              setMessageType('success');
              setMessage('Congratulations! New Aadhaar number registered.');
              toast.success('New Aadhaar number registered successfully!');
            }
          }
        } catch (error) {
          console.error('Error checking Aadhaar number:', error);
          setMessageType('error');
          toast.error('Error checking Aadhaar number. Please try again.');
        }
      } else {
        // Invalid Aadhaar format
        toast.error('Invalid Aadhaar number. It must be a 12-digit numeric value.');
        setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear invalid Aadhaar number
      }
    }
    // Optionally, you can handle cases where the input exceeds 12 digits
    else if (value.length > 12) {
      toast.error('Aadhaar number cannot exceed 12 digits.');
      setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value.slice(0, 12) }));
    }
  };


  // const handleAadhaarNumberChange = async (e) => {
  //   const { value } = e.target;
  //   setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: value }));
  //   validateAadhaarNumber(value);

  //   if (value.length === 12 && /^\d{12}$/.test(value)) {
  //     try {
  //       const response = await axios.post(`${API_BASE_URL}/labours/check-aadhaar`, { aadhaarNumber: value });
  //       const { exists, skipCheck } = response.data;

  //       if (skipCheck) {
  //         // Skip the check and proceed
  //         setMessageType('success');
  //         setMessage('Congratulations! Aadhaar resubmission detected, proceeding with the form.');
  //         toast.success('Aadhaar resubmission detected, proceeding with the form.'); // Add a success toast
  //       } else {
  //         if (exists) {
  //           setMessageType('error');
  //           toast.error('User has already filled the form with this Aadhaar number.');
  //           // setMessage('User has already filled the form with this Aadhaar number.');
  //           setFormData((prevFormData) => ({ ...prevFormData, aadhaarNumber: '' })); // Clear the field
  //         } else {
  //           if (newError === '') {
  //             setMessageType('success');
  //             setMessage('Congratulations! New Aadhaar number registered.');
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error checking Aadhaar number:', error);
  //       setMessageType('error');
  //       setMessage('Error checking Aadhaar number. Please try again.');
  //     }
  //   }
  // };






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
        console.log('dprojectNamesRes.data',projectNamesRes.data)
        setLabourCategories(labourCategoriesRes.data);
        setDepartments(departmentsRes.data);
        console.log('departmentsRes.data',departmentsRes.data)
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
        console.log('formData.department',formData.department)
        try {
          const designationsRes = await axios.get(API_BASE_URL + `/api/designations/${formData.department}`);
          setDesignations(designationsRes.data);

          // if (designationsRes.data.length > 0 && !formData.designation) {
          //   setFormData(prevFormData => ({
          //     ...prevFormData,
          //     designation: designationsRes.data[0].Description
          //   }));
          // }

        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchDesignations();
  }, [formData.department]);

  // useEffect(() => {
  //   const fetchCompanyNames = async () => {
  //     if (formData.projectName) {
  //       console.log('formData.projectName',formData.projectName)
  //       try {
  //         const companyNamesRes = await axios.get(API_BASE_URL + `/api/company-names/${formData.projectName}`);
  //         console.log("companyNamesRes.data{{",companyNamesRes.data)
  //         setCompanyNames(companyNamesRes.data);

  //         if (companyNamesRes.data.length > 0 && !formData.companyName) {
  //           setFormData(prevFormData => ({
  //             ...prevFormData,
  //             companyName: companyNamesRes.data[0].Company_Name
  //           }));
  //         }

  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   };

  //   fetchCompanyNames();
  // }, [formData.projectName]);

  useEffect(() => {
  const fetchCompanyNames = async () => {
    if (formData.projectName) {
      console.log("Fetching company names for:", formData.projectName);

      try {
        const companyNamesRes = await axios.get(API_BASE_URL + `/api/company-names/${formData.projectName}`);
        
        console.log("API Response:", companyNamesRes.data);  // Debugging line

        // Ensure `companyNames` is always an array
        const companyData = Array.isArray(companyNamesRes.data) ? companyNamesRes.data : [companyNamesRes.data];

        setCompanyNames(companyData);

        if (companyData.length > 0 && !formData.companyName) {
          setFormData(prevFormData => ({
            ...prevFormData,
            companyName: companyData[0].Description
          }));
        }
      } catch (err) {
        console.error("Error fetching company names:", err);
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
      LabourID,
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
      Induction_Date,
      Inducted_By,
      uploadAadhaarFront,
      uploadIdProof,
      uploadAadhaarBack,
      uploadInductionDoc
    } = labour;

    setFormData({
      LabourID,
      labourOwnership,
      name,
      aadhaarNumber,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '',
      contactNumber,
      gender,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining).toISOString().split('T')[0] : '',
      address,
      pincode,
      taluka,
      district,
      village,
      state,
      emergencyContact: emergencyContact || '',
      photoSrc: photoSrc || '',
      bankName,
      branch,
      accountNumber,
      ifscCode,
      projectName,
      labourCategory,
      department: department || '',
      workingHours,
      designation: designation || '',
      contractorName,
      contractorNumber,
      title,
      Marital_Status,
      companyName,
      OnboardName: user.name,
      Induction_Date: Induction_Date ? new Date(Induction_Date).toISOString().split('T')[0] : '',
      Inducted_By: Inducted_By || '',
      uploadAadhaarFront: uploadAadhaarFront || '',
      uploadIdProof: uploadIdProof || '',
      uploadAadhaarBack: uploadAadhaarBack || '',
      uploadInductionDoc: uploadInductionDoc || ''
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  useEffect(() => {
    const fetchLabourDetails = async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/labours/${id}`);
        const labour = response.data;
        handleSelectLabour(labour);
      } catch (error) {
        console.error('Error fetching labour details:', error);
      }
    };

    if (location.state && location.state.labourId) {
      fetchLabourDetails(location.state.labourId);
    }
  }, [location, user.name]);



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

  const kycRequiredFields = ['uploadAadhaarFront', 'labourOwnership', 'title', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber', 'gender', 'uploadIdProof'];
  const personalRequiredFields = ['dateOfJoining', 'address', 'village', 'pincode', 'district', 'taluka', 'state', 'emergencyContact', 'Marital_Status'];
  const bankDetailsRequiredFields = ['bankName', 'branch', 'accountNumber', 'ifscCode'];
  const projectRequiredFields = ['projectName', 'companyName', 'department', 'designation', 'labourCategory', 'workingHours', 'Induction_Date', 'Inducted_By', 'uploadInductionDoc'];

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
    if (age < 18 || age > 60) {
      setErrorMessage('Age must be between 18 and 60.');
    } else {
      setErrorMessage('');
    }
    setFormData({ ...formData, dateOfBirth: e.target.value });
  };


  const validateForm = () => {
    const requiredFields = [
      'labourOwnership', 'title', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber', 'gender', 'uploadIdProof',
      'dateOfJoining', 'address', 'village', 'pincode', 'district', 'taluka', 'state', 'emergencyContact', 'Marital_Status',
      'projectName', 'department', 'designation', 'labourCategory', 'workingHours', 'Induction_Date', 'Inducted_By', 'uploadInductionDoc',
    ];

    // for (const field of requiredFields) {
    //   if (!formData[field]) {
    //     toast.error(`Please fill in the ${field} field.`);
    //     return false;
    //   }
    // }
    const missingFields = [];

    for (const field of requiredFields) {
      if (!formData[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return false;
    }


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


  useEffect(() => {
    if (labourId) {
      // Fetch the existing labour data
      fetchLabourData(labourId);
    }
  }, [labourId]);

  const fetchLabourData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/${id}`);
      setFormData(response.data); // Populate the form with the fetched data
    } catch (error) {
      console.error('Error fetching labour data:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateOfBirth = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
    if (today < birthdayThisYear) {
      age--;
    }

    if (age < 18 || age > 60) {
      setErrorMessage('Age must be between 18 and 60.');
      toast.error('Age must be between 18 and 60.');
      return;
    } else {
      setErrorMessage('');
    }

    if (!validateForm()) return;
    setLoading(true);
    setSaved(false);

    // const { user } = useUser();

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

      // if (uploadAadhaarBack && uploadAadhaarBack instanceof File) {
      //   formDataToSend.append('uploadAadhaarBack', uploadAadhaarBack, uploadAadhaarBack.name);
      // } else {
      //   console.error('uploadAadhaarBack is not a file object');
      // }
      if (uploadAadhaarBack && uploadAadhaarBack instanceof File) {
        formDataToSend.append('uploadAadhaarBack', uploadAadhaarBack, uploadAadhaarBack.name);
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

      if (photoSrc && typeof photoSrc === 'string' && photoSrc.startsWith('data:image')) {
        const photoBlob = base64ToBlob(photoSrc, 'image/jpeg');
        formDataToSend.append('photoSrc', photoBlob, 'captured_photo.jpg');
      } else if (photoSrc && typeof photoSrc === 'string') {
        formDataToSend.append('photoSrc', photoSrc); // Use existing URL
      }

      if (user.name) {
        formDataToSend.append('OnboardName', user.name);
      } else {
        console.error('OnboardName is not available in user context');
      }

      let response;
      const labourId = formData.id;
      const labourIdCode = formData.LabourID;
      const labourStatus = formData.status || '';

      try {
        if (labourStatus === 'Disable' && labourId) {
          response = await axios.put(`${API_BASE_URL}/labours/updatelabourDisableStatus/${labourId}`, formDataToSend, {
            headers: {
              // 'Content-Type': 'application/json',
            },
          });
        } else if (labourId && labourIdCode) {
          response = await axios.put(`${API_BASE_URL}/labours/updatelabour/${labourId}`, formDataToSend, {
            headers: {
              // 'Content-Type': 'application/json',
            },
          });
        } else if (labourId) {
          response = await axios.post(`${API_BASE_URL}/labours/${labourId}/updateRecord`, formDataToSend, {
            headers: {
              // 'Content-Type': 'application/json',
            },
          });
        } else {
          response = await axios.post(`${API_BASE_URL}/labours`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        if (response.data.status === 'Disable') {
          response.data.status = 'Resubmitted';
        }


        if ((labourStatus === 'Approved') && (response.status === 200 || response.status === 201)) {
        }

        if (['Rejected', 'Resubmitted', 'Disable'].includes(labourStatus) && (response.status === 200 || response.status === 201)) {
          // Call API to update hideResubmit field
          await axios.put(`${API_BASE_URL}/labours/updateHideResubmit/${labourId}`, { hideResubmit: true });

          // Notify LabourDetails that the resubmit was successful for the selected statuses
          if (onFormSubmitSuccess) {
            onFormSubmitSuccess({ labourId, hideResubmit: true });
          }
        }

        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Form submission failed');
        }

      } catch (error) {
        console.error('API request failed:', error.response ? error.response.data : error.message);
        throw error;
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
    }, 9000);
  };



  const handleFileChanges = async (event) => {
    const { name, files } = event.target;
    const file = files[0];

    if (!file) return;


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

    const fileStateSetter = {

      uploadInductionDoc: setuploadInductionDoc,
    };
    const setStateFunction = fileStateSetter[name];
    if (setStateFunction) {
      // setStateFunction(file);
      setStateFunction(file.name); // Set the file name for display
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
    } else {
      console.error(`Unknown file input name: ${name}`);
      return;
    }
  }






  const [hasContactErrorShown, setHasContactErrorShown] = useState(false);
  const [hasEmergencyErrorShown, setHasEmergencyErrorShown] = useState(false);

  const validateContactNumber = (number) => {
    const isValid = /^\d{10}$/.test(number);
    if (!isValid && number.length !== 10) {
      setContactError('Contact number must be exactly 10 digits.');
      if (!hasContactErrorShown) {
        toast.error('Contact number must be exactly 10 digits.');
        setHasContactErrorShown(true);
      }
    } else {
      setContactError('');
      setHasContactErrorShown(false);
    }
  };


  const validateEmergencyNumber = (number) => {
    const isValid = /^\d{10}$/.test(number);
    if (!isValid && number.length !== 10) {
      setEmergencyError('Emergency number must be exactly 10 digits.');
      if (!hasEmergencyErrorShown) {
        toast.error('Emergency number must be exactly 10 digits.');
        setHasEmergencyErrorShown(true);
      }
    } else {
      setEmergencyError('');
      setHasEmergencyErrorShown(false);
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
    if (/^\d*$/.test(value)) {  // Only allow digits
      setFormData({ ...formData, contactNumber: value });
      validateContactNumber(value);
    }
  };

  const handleContractorNumberChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, contractorNumber: value });
    validateContactNumber(value);
  };

  const handleEmergencyContactChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {  // Only allow digits
      setFormData({ ...formData, emergencyContact: value });
      validateEmergencyNumber(value);
    }
  };

  const handleAccountNumberChange = (e) => {
    const cleanedValue = e.target.value.replace(/\D/g, '');
    if (cleanedValue.length > 16) {
      cleanedValue = cleanedValue.slice(0, 16);
    }
    setFormData({ ...formData, accountNumber: cleanedValue });

  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "projectName") {
      const projectId = parseInt(value, 10); // Get the selected project's ID
      const selectedProject = projectNames.find(project => project.Id === projectId);

      if (selectedProject) {
        const companyName = selectedProject.Description; // Get the corresponding company name

        setFormData((prevFormData) => ({
          ...prevFormData,
          projectName: value, // Update projectName
          projectId,          // Store the project ID
          companyName,        // Automatically update companyName
        }));
      } else {
        console.error(`Project with ID ${projectId} not found.`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          projectName: '',
          projectId: null,
          companyName: '',
        }));
      }
    } else if (name === "department") {
      const departmentId = parseInt(value, 10);
      const selectedDepartment = departments.find(dep => dep.Id === departmentId);

      if (selectedDepartment) {
        const departmentName = selectedDepartment.Description;
        const workingHours = departmentWorkingHoursMapping[departmentName] || '';

        setFormData((prevFormData) => ({
          ...prevFormData,
          department: value,
          departmentId,
          workingHours,
        }));
      } else {
        console.error(`Department with ID ${departmentId} not found.`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          department: '',
          departmentId: '',
          workingHours: '',
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };


  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedOption = e.target.options[e.target.selectedIndex];
    const id = selectedOption.getAttribute('data-id');

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Set the description
      [`${name}Id`]: id || null // Set the ID or null if not found
    }));
  };





  const openPreviewModal = () => {
    const project = projectNames.find(project => project.Id === parseInt(formData.projectName));
    const department = departments.find(dept => dept.Id === parseInt(formData.department));

    const processedData = {
      ...formData,
      projectName: project ? project.Description : formData.projectName,
      department: department ? department.Description : formData.department
    };

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
        hideAadhaarButton={true}
      />
    );
  };

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




  const clearFile = (name) => {
    const fileStateSetter = {
      uploadAadhaarFront: setuploadAadhaarFront,
      uploadAadhaarBack: setuploadAadhaarBack,
      photoSrc: setPhotoSrc,
      uploadIdProof: setuploadIdProof,
      uploadInductionDoc: setuploadInductionDoc,
    };

    const setStateFunction = fileStateSetter[name];
    if (setStateFunction) {
      setStateFunction('');
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: null,
      }));
      document.getElementById(name).value = '';
    } else {
      console.error(`Unknown file input name: ${name}`);
    }
  };


  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  const getFormattedDate = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split("T")[0];
  };

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
  const styles = {
    list: {
      marginLeft: '-22px',
      width: 'auto',
      '@media (min-width: 501px) and (max-width: 800px)': {
        marginLeft: '-120px',
        width: '80vw',
      },
    },
  };
  return (
    <Box p={{ paddingRight: 3 }}>
      <div className="onboarding-form-container">
        <ToastContainer />
        <SearchBar
          handleSubmit={handleSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectLabour={handleSelectLabour}
          showResults={true}
        />

        <form className="onboarding-form">
          <ul style={styles.list}>
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
                          <div className="input-with-icon" >
                            <input
                              type="text"
                              value={uploadAadhaarBack}
                              placeholder="Choose file"
                              readOnly
                              style={{ cursor: 'pointer', backgroundColor: '#fff', ...getInputStyle('uploadAadhaarBack') }}
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
                          {uploadAadhaarBack && (
                            <FaRegTimesCircle className="input-icon" onClick={() => clearFile('uploadAadhaarBack')} sx={{ fontSize: "20px" }} />
                          )}
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
                              <option value="CONTRACTOR" style={{ width: 'calc(100% - 20px)' }}>CONTRACTOR</option>
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
                              <option value="MR.">MR.</option>
                              <option value="MRS.">MRS.</option>
                              <option value="MISS.">MISS.</option>
                              <option value="MS.">MS.</option>
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
                            // value={formData.name || ''}
                            value={formData.name ? formData.name.toUpperCase() : ''}
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
                              maxLength={12}
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
                          {contactError && <span style={{ color: 'red', display: 'flex' }}>{contactError}</span>}
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
                              <option value="MALE">MALE</option>
                              <option value="FEMALE">FEMALE</option>
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
                            Date of joining {renderRequiredAsterisk(true)}
                          </InputLabel>
                          <input
                            className="date-input"
                            type="date"
                            id="dateOfJoining"
                            name="dateOfJoining"
                            required
                            max={getFormattedDate(2)} // Two days from today
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
                            // value={formData.address || ''}
                            value={formData.address ? formData.address.toUpperCase() : ''}
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
                            id="village"
                            name="village"
                            required
                            value={formData.village ? formData.village.toUpperCase() : ''}// value={formData.village || ''}
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
                            onChange={(e) => handlePincodeChange(e.target.value)}
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
                            value={formData.district ? formData.district.toUpperCase() : ''} // value={formData.district || ''}
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
                            value={formData.taluka ? formData.taluka.toUpperCase() : ''} // value={formData.taluka || ''}
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
                            value={formData.state ? formData.state.toUpperCase() : ''} // value={formData.state || ''}
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
                            onChange={handleEmergencyContactChange}
                            style={getInputStyle('emergencyContact')}
                          />
                          {emergencyError && <span style={{ color: 'red', display: 'flex' }}>{emergencyError}</span>}
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
                          Capture Photo{renderRequiredAsterisk(true)}
                        </InputLabel>
                        <div className="camera-container">
                          <div className="video-container" style={{ position: 'relative' }}>
                            <video ref={videoRef} className="video" autoPlay style={{ display: stream ? 'block' : 'none', width: '100%' }}></video>
                            <canvas ref={canvasRef} className="canvas" style={{ display: 'none' }}></canvas>
                            {photoSrc && <img src={photoSrc} alt="Captured" className="photo" style={{ width: '96%', position: 'absolute', top: 0, left: 0 }} />}
                            {stream && (
                              <IconButton
                                onClick={toggleCamera}
                                style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#f66300', color: 'white', width: '20px' }}>
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
                            value={formData.bankName ? formData.bankName.toUpperCase() : ''}// value={formData.bankName || ''}
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
                            value={formData.branch ? formData.branch.toUpperCase() : ''} // value={formData.branch || ''}
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
                            value={formData.ifscCode ? formData.ifscCode.toUpperCase() : ''} // value={formData.ifscCode || ''}
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
                      <div className="projectTab">
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
                                // required
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
                              // required
                              >
                                <option value="" >Select a project</option>
                                {projectNames.map(project => (
                                  // <option key={project.id} value={project.Business_Unit}>{project.Business_Unit}</option>
                                  <option key={project.Id} value={project.Id}>{project.Description}</option>
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
                                // required
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                style={getInputStyle('companyName')}
                              >
                                {/* <option value="" >Select Company Name</option> */}
                                {/* {companyNames.map(company => (
                                  <option key={company.id} value={company.Company_Name}>{company.Company_Name}</option>
                                ))} */}
                                {Array.isArray(companyNames) ? companyNames.map((company) => (
    <option key={company.Company_Name} value={company.Company_Name}>
      {company.Company_Name}
    </option>
  )) : null}
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
                                Id="department"
                                name="department"
                                value={formData.department}
                                // onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                onChange={handleInputChange}
                                style={getInputStyle('department')}
                              // required
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
                              Trade{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                // onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                onChange={handleSelectChange}
                                style={getInputStyle('designation')}
                              // required
                              >
                                <option value="" >Select a Trade</option>
                                {designations.map(designation => (
                                  <option key={designation.id} value={designation.farvision_description} data-id={designation.id}>
                                    {designation.farvision_description}
                                  </option>
                                ))}
                                {/* {designations.map(designation => (
                                  <option key={designation.id} value={designation.Description}>{designation.Description}</option>
                                ))} */}
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
                                // onChange={(e) => setFormData({ ...formData, labourCategory: e.target.value })}
                                onChange={handleSelectChange}
                                style={getInputStyle('labourCategory')}
                              // required
                              >
                                <option value="" >Select a Labour Category</option>
                                {labourCategories.map(category => (
                                  <option key={category.Id} value={category.Description} data-id={category.Id}>
                                    {category.Description}
                                  </option>
                                ))}
                                {/* {labourCategories.map(category => (
                                  <option key={category.Id} value={category.Description}>{category.Description}</option>
                                ))} */}
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
                                // onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                onChange={handleInputChange}
                                style={getInputStyle('workingHours')}
                                // required
                                disabled
                              >
                                <option value="" >Select Working Hours</option>
                                {Object.values(departmentWorkingHoursMapping).map((hours, index) => (
                                  <option key={index} value={hours}>{hours}</option>
                                ))}
                                {/* {workingHours.map(hours => (
                                  <option key={hours.Id} value={hours.Shift_Name}>{hours.Shift_Name}</option>
                                ))} */}
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
                              // required
                              onChange={(e) => setFormData({ ...formData, Induction_Date: e.target.value })}
                              value={formData.Induction_Date || ''}
                              style={getInputStyle('Induction_Date')}
                            />
                          </div>
                          <div className="project-field">
                            <InputLabel id="working-hours-label" sx={{ color: 'black' }}>
                              Safety Induction By{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="Inducted_By"
                                name="Inducted_By"
                                value={formData.Inducted_By}
                                onChange={(e) => setFormData({ ...formData, Inducted_By: e.target.value })}
                                style={getInputStyle('Inducted_By')}
                              // required
                              >
                                <option value="" >Select Safety Inducted By</option>
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
                                multiple
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
                              disabled={loading}
                              onClick={handleSubmit}
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
              <button
                className={`ok-button ${popupType}`}
                onClick={() => {
                  setSaved(false);
                  // window.location.reload(); 
                }}
              >
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


