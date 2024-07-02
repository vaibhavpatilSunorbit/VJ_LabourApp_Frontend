
import React, { useState, useRef, useEffect } from "react";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { FaArrowLeft, FaEye, FaCheck } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";
import SearchBar from "../SarchBar/SearchBar";
import Loading from "../Loading/Loading";
import Sidebar from "../Sidebar/Sidebar";


const OnboardingForm = ({ formType, onFormSubmit, onPhotoCapture }) => {
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadAadhaarFront, setuploadAadhaarFront] = useState('');
  const [uploadAadhaarBack, setuploadAadhaarBack] = useState('');
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
  const [nextID, setNextID] = useState(null);

  const [formData, setFormData] = useState({
    uploadAadhaarFront: '',
    uploadAadhaarBack: '',
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
    labourOwnership: '',
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
    nationality: 'INDIAN',
    maritalStatus: '',
    paymentMode: 'NEFT',
    companyName: '',
    employeeType: 'PERMANENT',
    currentStatus: 'WORKING',
    seatingOffice: 'SITE LABOUR',
  });

  const [formStatus, setFormStatus] = useState({
    kyc: false,
    personal: false,
    bankDetails: false,
    project: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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


  // useEffect(() => {
  //   navigate('/kyc');
  // }, []);

  // New changes start here ---------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNamesRes = await axios.get('http://localhost:5000/api/project-names');
        const labourCategoriesRes = await axios.get('http://localhost:5000/api/labour-categories');
        const departmentsRes = await axios.get('http://localhost:5000/api/departments');
        const workingHoursRes = await axios.get('http://localhost:5000/api/working-hours');
        setProjectNames(projectNamesRes.data);
        setLabourCategories(labourCategoriesRes.data);
        setDepartments(departmentsRes.data);
        setWorkingHours(workingHoursRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      if (formData.department) {
        try {
          const designationsRes = await axios.get(`http://localhost:5000/api/designations/${formData.department}`);
          setDesignations(designationsRes.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchDesignations();
  }, [formData.department]);

  // New changes end here ----------------------------------

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/labours/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error searching. Please try again.');
    }

  };

  // const CameraCapture = () => {
  const [stream, setStream] = useState(null);
  const [photoSrc, setPhotoSrc] = useState('');
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
          facingMode: 'user' // Use 'environment' for the rear camera
        }
      };

      // Check if the browser supports getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setStream(stream);
      } else {
        console.error("getUserMedia is not supported by this browser.");
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      // Log detailed error information for troubleshooting
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
      title: '',
      nationality: 'INDIAN',
      maritalStatus: '',
      paymentMode: 'NEFT',
      companyName: '',
      employeeType: 'PERMANENT',
      currentStatus: 'WORKING',
      seatingOffice: 'SITE LABOUR',
    });

    setSearchQuery('');
    setSearchResults([]);

    console.log('Selected Labour:', labour);
  };


  const renderPreviewModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="overlay">
        <div className="preview-modal">
          <button id="close-button" onClick={closeModal}></button>
          <ul>
            {Object.entries(formData).map(([key, value]) => (
              <li key={key}>
                <strong>{capitalizeFirstLetter(key)}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

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

  const kycRequiredFields = ['labourOwnership', 'uploadAadhaarFront', 'uploadAadhaarBack', 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber',];
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
    setDateOfBirth({ ...formData, dateOfBirth: e.target.value });
  };


  const validateForm = () => {
    const requiredFields = [
      // 'name', 'aadhaarNumber', 'dateOfBirth', 'contactNumber', 'gender', 'dateOfJoining',
      // 'address', 'pincode', 'taluka', 'district', 'village', 'state',
      // 'emergencyContact', 'bankName', 'branch', 'accountNumber', 'ifscCode',
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
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data: { nextID } } = await axios.get('http://localhost:5000/labours/next-id');
      setNextID(nextID);

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

      if (photoSrc) {
        const photoBlob = base64ToBlob(photoSrc, 'image/jpeg');
        formDataToSend.append('photoSrc', photoBlob, 'captured_photo.jpg');
      }

      formDataToSend.append('labourID', nextID);

      const response = await axios.post('http://localhost:5000/labours', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 201) {
        throw new Error('Form submission failed');
      }

      console.log('Form submission response:', response.data);
      // setPopupMessage(`Your details have been successfully submitted. Your Labour ID is ${nextID}. Thanks!`);
      setPopupMessage(
        <div style={{ lineHeight: '1' }}>
          <p>Your details have been successfully submitted.</p>
          <p>
            Your Labour ID is <span style={{ fontSize: '1.5em', color: '#007bff', fontWeight: 700 }}>{nextID}</span>.
          </p>
          <p>Thanks!</p>
        </div>
      );

      setPopupType('success');
      setSaved(true);
      // toast.success('Form submitted successfully!');

      setFormData({});
      setuploadAadhaarFront(null);
      setuploadAadhaarBack(null);
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
    }, 12000);
    // console.log(userData);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSearchQuery(value);
  };


  const handleFileChange = async (event) => {
    const { name, files } = event.target;
    const file = files[0];

    if (!file) return;

    console.log("Selected file:", file);

    const fileStateSetter = {
      uploadAadhaarFront: setuploadAadhaarFront,
      uploadAadhaarBack: setuploadAadhaarBack,
      photoSrc: setPhotoSrc,
    };

    const setStateFunction = fileStateSetter[name];
    if (setStateFunction) {
      setStateFunction(file);
    } else {
      console.error(`Unknown file input name: ${name}`);
      return;
    }
    setLoading(true);
    try {
      await uploadAadhaarImageToSurepass(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
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


  const fetchPincodeData = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      return null;
    }
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      pincode,
      village: "",
      taluka: "",
      district: "",
      state: ""
    }));

    if (pincode.length === 6) {
      setLoading(true);
      const response = await fetchPincodeData(pincode);

      if (response && response[0] && response[0].Status === "Success") {
        setSuggestions(response[0].PostOffice);
        setShowSuggestions(true);
      } else {
        const nearbyPincode = pincode.substring(0, 4);
        const nearbyResponse = await fetchPincodeData(nearbyPincode);

        if (nearbyResponse && nearbyResponse[0] && nearbyResponse[0].Status === "Success") {
          setSuggestions(nearbyResponse[0].PostOffice);
          setShowSuggestions(true);
        } else {
          console.error('Location data not found');
          setShowSuggestions(false);
        }
      }
      setLoading(false);
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
      console.log(data)
      if (data && data.success && data.data && data.data.ocr_fields && data.data.ocr_fields.length > 0) {
        const ocrFields = data.data.ocr_fields[0];

        setFormData({
          aadhaarNumber: ocrFields.aadhaar_number.value,
          name: ocrFields.full_name.value,
          dateOfBirth: ocrFields.dob.value,
          gender: ocrFields.gender.value,
          village: formData.village,
          taluka: formData.taluka,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
        });
        setDateOfBirth(ocrFields.dob.value);
      } else {
        console.error('Error uploading Aadhaar image to Surepass: OCR fields not found in response');
      }
    } catch (error) {
      console.error('Error uploading Aadhaar image to Surepass:', error);
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

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        console.log("Image data:", imageData);
      };
      reader.readAsDataURL(file);
    }
  }

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
  const handleAadhaarNumberChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, aadhaarNumber: value });
    validateAadhaarNumber(value);
  };


  const handleAccountNumberChange = (e) => {
    // Remove non-numeric characters from input
    const cleanedValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, accountNumber: cleanedValue });
  };

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
          <ul>
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
                            Upload Aadhaar Front
                        </InputLabel>
                          <div className="input-with-icon">
                            <input type="file" name="uploadAadhaarFront" onChange={handleFileChange} accept="image/*" required />
                            <DocumentScannerIcon className="input-icon" />
                          </div>
                        </div>
                        <div className="project-field">
                          <InputLabel id="aadhaar-label" sx={{ color: "black" }}>
                            Upload Aadhaar Back
                        </InputLabel>
                          <div className="input-with-icon">
                            <input type="file" name="uploadAadhaarBack" onChange={handleFileChange} accept="image/*" required />
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
                              onChange={(e) => setFormData({ ...formData, labourOwnership: e.target.value })} >
                              <option value="VJ" style={{ width: 'calc(100% - 20px)' }}>VJ</option>
                              <option value="Contractor" style={{ width: 'calc(100% - 20px)' }}>Contractor</option>
                            </select>
                          </div>
                        </div>

                        <div className="gender">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Title
                          </InputLabel>
                          <div className="gender-input">
                            <select
                              id="title"
                              name="title"
                              required
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            >
                              <option value="">Select Title</option>
                              <option value="mr">MR.</option>
                              <option value="mrs">MRS.</option>
                              <option value="miss">MISS.</option>
                              <option value="ms">MS.</option>
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
                              required />
                            {newError && <span style={{ color: 'red', display: 'flex' }}>{newError}</span>}
                          </div>
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
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
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
                          />

                        </div>
                      </div>


                      {loading && <Loading />}
                      <div className="locations">
                        <div className="personal-pincode-field">
                          <InputLabel
                            id="personal-pincode-label"
                            sx={{ color: "black" }}
                          >
                            Pincode{renderRequiredAsterisk(true)}
                          </InputLabel>

                          <input
                            type="text"
                            id="personal-pincode"
                            name="personal-pincode"
                            required
                            value={formData.pincode || ''}
                            onChange={handlePincodeChange}
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <ul className="suggestions-dropdown">
                              {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                  {suggestion.Name}, {suggestion.Block}, {suggestion.District}, {suggestion.State}
                                </li>
                              ))}
                            </ul>
                          )}
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
                          />
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
                          />
                        </div>



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
                          />
                          {error && <span style={{ color: 'red', display: 'flex' }}>{error}</span>}
                        </div>
                      </div>

                      <div className="em-contact-block">
                        <div className="bankDetails-field">
                          <InputLabel id="branch-label" sx={{ color: "black" }}>
                            Nationality
                           </InputLabel>
                          <input
                            type="text"
                            id="nationality"
                            name="nationality"
                            required
                            value={formData.nationality || 'INDIAN'}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          />
                        </div>
                        <div className="gender">
                          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                            Marital Status
                         </InputLabel>
                          <div className="gender-input">
                            <select
                              id="maritalStatus"
                              name="maritalStatus"
                              required
                              value={formData.maritalStatus}
                              onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                            >
                              <option value="">Select Marital Status</option>
                              <option value="married">MARRIED</option>
                              <option value="unmarried">UNMARRIED</option>
                              <option value="divorce">DIVORCE</option>
                              <option value="widowed">WIDOWED</option>
                            </select>
                          </div>
                        </div>
                      </div>



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
                          </div>
                          <div className="button-container" style={{ marginTop: '10px' }}>
                            {!stream && !photoSrc && (
                              <button type="button" onClick={startCamera} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px' }}>
                                Start Camera<CameraAltIcon />
                              </button>
                            )}
                            {stream && !photoSrc && (
                              <button type="button" onClick={capturePhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px' }}>
                                Capture Photo<CameraAltIcon />
                              </button>
                            )}
                            {!stream && photoSrc && (
                              <button type="button" onClick={repeatPhoto} className="camerabutton" style={{ width: "278px", border: '2px solid #dfdfdf', borderRadius: '5px', height: '45px' }}>
                                Repeat Photo<CameraAltIcon />
                              </button>
                            )}
                            {/* <input type="file" name="" accept="image/*" capture="user" id=""/> */}
                          </div>
                        </div>
                        <input
                          type="hidden"
                          id="photoInput"
                          name="photoInput"
                          value={photoSrc || ''}
                          required
                          onChange={(e) => setFormData((prevFormData) => {
                            console.log("photoInput", e.target.value)
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
                            onKeyDown={(e) => {
                              // Allow only numeric inputs and specific control keys (e.g., Backspace, Delete)
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
                          />
                        </div>
                      </div>

                      <div className="locations">
                        <div className="bankDetails-field">
                          <InputLabel id="branch-label" sx={{ color: "black" }}>
                            Payment Mode
                           </InputLabel>
                          <input
                            type="text"
                            id="paymentMode"
                            name="paymentMode"
                            required
                            value={formData.paymentMode || 'NEFT'}
                            onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                          />
                        </div>
                      </div>

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
                                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                required
                              >
                                <option value="" disabled>Select a project</option>
                                {projectNames.map(project => (
                                  <option key={project.id} value={project.Business_Unit}>{project.Business_Unit}</option>
                                ))}
                              </select>
                            </div>
                          </div>
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
                                required
                              >
                                <option value="" disabled>Select a Labour Category</option>
                                {labourCategories.map(category => (
                                  <option key={category.Id} value={category.Description}>{category.Description}</option>
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
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                              >
                                <option value="" disabled>Select a Department</option>
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
                                required
                              >
                                <option value="" disabled>Select a Designation</option>
                                {designations.map(designation => (
                                  <option key={designation.id} value={designation.Description}>{designation.Description}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="locations">
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
                                required
                              >
                                <option value="" disabled>Select Working Hours</option>
                                {workingHours.map(hours => (
                                  <option key={hours.Id} value={hours.Shift_Name}>{hours.Shift_Name}</option>
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
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}>
                                <option value="">Select Company Name</option>
                                <option value="sakalpContractsPvtLtd">SANKALP CONTRACTS PRIVATE LIMITED</option>
                                <option value="vilasJavdekarEcoShelterPvtLtd">VILAS JAVDEKAR ECO SHELTERS PRIVATE LIMITED</option>
                                <option value="vilasJavdekarGreenscapsDevloperLLP">VILAS JAVDEKAR GREENSCAPE DEVELOPERS LLP</option>
                                <option value="vilasJavdekarInfiniteeDeveloperPvtLtd">VILAS JAVDEKARS INFINITEE DEVELOPERS PVT.LTD.</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="locations">
                          <div className="gender">
                            <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
                              Employee Type{renderRequiredAsterisk(true)}
                            </InputLabel>
                            <div className="gender-input">
                              <select
                                id="employeeType"
                                name="employeeType"
                                required
                                value={formData.employeeType || 'PERMANENT'}
                                onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}>
                                <option value="PERMANENT">Permanent</option>
                              </select>
                            </div>
                          </div>
                          <div className="bankDetails-field">
                            <InputLabel id="branch-label" sx={{ color: "black" }}>
                              Current Status
                           </InputLabel>
                            <input
                              type="text"
                              id="currentStatus"
                              name="currentStatus"
                              required
                              value={formData.currentStatus || 'WORKING'}
                              onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="locations">
                          <div className="bankDetails-field">
                            <InputLabel id="branch-label" sx={{ color: "black" }}>
                              Seating Office
                           </InputLabel>
                            <input
                              type="text"
                              id="seatingOffice"
                              name="seatingOffice"
                              required
                              value={formData.seatingOffice || 'SITE LABOUR'}
                              onChange={(e) => setFormData({ ...formData, seatingOffice: e.target.value })}
                            />
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
                              type="button"
                              onClick={openModal}
                              className="btn btn-preview"
                            > Preview
                          </button>
                            <button
                              type="submit"
                              id="save"
                              className={`btn btn-save save-button ${saved ? 'saved' : ''}`}
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


