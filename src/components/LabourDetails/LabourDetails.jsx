import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  TablePagination,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./LabourDetails.css";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SarchBar/SearchBar';
import ViewDetails from '../ViewDetails/ViewDetails';
import Loading from "../Loading/Loading";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { API_BASE_URL } from "../../Data";
import InfoIcon from '@mui/icons-material/Info';
import jsPDF from 'jspdf';
import { useUser } from '../../UserContext/UserContext';
// import logoImage from '../../images/Labour_ID_Card.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners'; 


const LabourDetails = ({ onApprove, departments, projectNames , labour   }) => {
  const { user } = useUser();
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [tabValue, setTabValue] = useState(0);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isRejectReasonPopupOpen, setIsRejectReasonPopupOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false); // New state for confirmation dialog
  const [labourToApprove, setLabourToApprove] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState(new Set());
  const theme = useTheme();
  const [resubmittedLabours, setResubmittedLabours] = useState(new Set());
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [ledgerId, setLedgerId] = useState(null);
  const [isEditLabourOpen, setIsEditLabourOpen] = useState(false);
  // const { labourId } = location.state || {};

  // const isMobile = useMediaQuery('(max-width: 600px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // const history = useHistory();
  
// console.log("setSelectedLaour",setSelectedLabour)


  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      // console.error('Error searching:', error);
      setError('Error searching. Please try again.');
    }
  };

  const handleApproveConfirmOpen = (labour) => {
    setLabourToApprove(labour);
    setIsApproveConfirmOpen(true);
  };

  const handleApproveConfirmClose = () => {
    setLabourToApprove(null);
    setIsApproveConfirmOpen(false);
  };

//   const handleApprove = async (id) => {
//     // console.log('Approving labour ID:', id);
//     // console.log('Logged-in user:', user);
//     handleApproveConfirmClose();

//     try {
//         // Step 1: Get the next ID
//         const { data: { nextID } } = await axios.get(`${API_BASE_URL}/labours/next-id`);
//         // console.log('Next ID:', nextID);

//         // Step 2: Approve the labour and get labour details
//         const approveResponse = await axios.put(`${API_BASE_URL}/labours/approve/${id}`, { LabourID: nextID });
//         // console.log('Approve response data:', approveResponse.data.data);

//         const labour = approveResponse.data.data; // Assuming this contains labour details
//         // console.log('Approved labour details:', labour);

//         // Step 3: Fetch the SerialNumber from the backend
//         const response = await axios.get(`${API_BASE_URL}/projectDeviceStatus/${labour.projectName}`);
//         const serialNumber = response.data.serialNumber;
//         // console.log('Fetched SerialNumber:', serialNumber);

//         // Step 4: Construct the SOAP envelope
//         const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
//         <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//           <soap:Body>
//             <AddEmployee xmlns="http://tempuri.org/">
//               <APIKey>11</APIKey>
//               <EmployeeCode>${nextID}</EmployeeCode>
//               <EmployeeName>${labour.name}</EmployeeName>
//               <CardNumber>${nextID}</CardNumber>
//               <SerialNumber>${serialNumber}</SerialNumber>
//               <UserName>test</UserName>
//               <UserPassword>Test@123</UserPassword>
//               <CommandId>25</CommandId>
//             </AddEmployee>
//           </soap:Body>
//         </soap:Envelope>`;
//         console.log('SOAP Envelope:', soapEnvelope);

//         // const soapResponse = await axios.post(
//         //   'https://essl.vjerp.com:8530/iclock/webapiservice.asmx?op=AddEmployee',
//         //   soapEnvelope,
//         //   {
//         //     headers: {
//         //       'Content-Type': 'text/xml'
//         //     }
//         //   }
//         // )

//         const soapResponse = await axios.post(
//          `${API_BASE_URL}/labours/essl/addEmployee`,
//           soapEnvelope,
//           {
//             headers: {
//               'Content-Type': 'text/xml'
//             }
//           }
//         );

//         if (soapResponse.status === 200) {
//           toast.success('ESSL API run successfully.');
//       }
      
//         console.log('SOAP response:', soapResponse);

//         // Update labour status in the frontend
//         setLabours(prevLabours =>
//           prevLabours.map(labour =>
//             labour.id === id ? { ...labour, status: 'Approved', isApproved: 1, LabourID: nextID } : labour
//           )
//         );

//         toast.success('Labour approved successfully.');
//         onApprove();
//         setPopupMessage(
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-evenly',
//               alignItems: 'center',
//               textAlign: 'center',
//               lineHeight: '1.5',
//               padding: '20px',
//               backgroundColor: '#f8f9fa',
//               borderRadius: '10px',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             <p style={{ fontSize: '1.2em', color: '#343a40' }}>Your details have been successfully submitted.</p>
//             <p style={{ fontSize: '1.2em', color: '#343a40' }}>
//               Your Labour ID is <span style={{ fontSize: '1.5em', color: '#007bff', fontWeight: 700 }}>{nextID}</span>.
//             </p>
//             <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
//           </div>
//         );
//         setPopupType('success');
//         setSaved(true);
//     } catch (error) {
//         // console.error('Error approving labour:', error);
//         toast.error('Error approving labour. Please try again.');
//     }
// };

  
  
  
const handleApprove = async (id) => {
  handleApproveConfirmClose();

  try {
    // Step 1: Get the next ID and store LabourID in state
    const { data: { nextID } } = await axios.get(`${API_BASE_URL}/labours/next-id`);
    const labourID = nextID; // Store LabourID to use in payloads

    // Step 2: Approve the labour and get labour details
    const approveResponse = await axios.put(`${API_BASE_URL}/labours/approve/${id}`, { LabourID: labourID });
    const labour = approveResponse.data.data; // Assuming this contains labour details

    // Step 3: Fetch the SerialNumber from the backend
    const response = await axios.get(`${API_BASE_URL}/projectDeviceStatus/${labour.projectName}`);
    const serialNumber = response.data.serialNumber;

    // Step 4: Construct the SOAP envelope
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <AddEmployee xmlns="http://tempuri.org/">
            <APIKey>11</APIKey>
            <EmployeeCode>${labourID}</EmployeeCode>
            <EmployeeName>${labour.name}</EmployeeName>
            <CardNumber>${labour.id}</CardNumber>
            <SerialNumber>${serialNumber}</SerialNumber>
            <UserName>test</UserName>
            <UserPassword>Test@123</UserPassword>
            <CommandId>25</CommandId>
          </AddEmployee>
        </soap:Body>
      </soap:Envelope>`;
    console.log('SOAP Envelope:', soapEnvelope);

    const soapResponse = await axios.post(
      `${API_BASE_URL}/labours/essl/addEmployee`,
      soapEnvelope,
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );
    if (soapResponse.status === 200) {
      toast.success('ESSL API run successfully.');

      // Fetch dynamic data for employeeMasterPayload
      const dynamicDataResponse = await axios.get(`${API_BASE_URL}/fetchDynamicData`, {
        params: {
          businessUnitDesc: labour.companyName,
          workingHours: labour.workingHours
        }
      });
      const dynamicData = dynamicDataResponse.data;

      // Construct employeeMasterPayload with dynamic LabourID
      const employeeMasterPayload = {
        companyName: labour.companyName,
        company: {
          level: 3,
          type: 'C',
          businessSegment: {
            id: 3,
            objectId: '000000000000000000000000',
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'Segment',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false
          },
          zone: {
            id: 0,
            objectId: '000000000000000000000000',
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'BusinessUnitZone',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false
          },
          fiscalYear: {
            yearStartDate: '2022-04-01T00:00:00.000Z',
            yearEndDate: '2023-03-31T00:00:00.000Z',
            fiscalYearTemplateId: 0,
            startPeriodId: 0,
            endPeriodId: 0,
            yearType: 0,
            isMidTermYear: false,
            midTermYearStartDate: null,
            id: 15,
            objectId: '000000000000000000000000',
            description: '01-04-2022-31-03-2023',
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'FiscalYear',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false
          },
          localCurrency: {
            subUnitFactor: 0,
            printOrder: 0,
            id: 12,
            objectId: '000000000000000000000000',
            description: 'RUPEES',
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'Currency',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false
          },
          reportingCurrency1: {
            subUnitFactor: 0,
            printOrder: 0,
            id: 12,
            objectId: '000000000000000000000000',
            description: 'RUPEES',
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'Currency',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false
          },
          reportingCurrency2: {
            subUnitFactor: 0,
            printOrder: 0,
            id: 0,
            objectId: '000000000000000000000000',
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'Currency',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false
          },
          templateGroupId: 0,
          timeZoneId: 0,
          ...dynamicData 
        },
        code: labour.LabourID,
        title: labour.title,
        firstName: labour.name,
        lastName: labour.name.split(' ')[1] || '',
        userName: labour.LabourID,
        gender: labour.gender,
        maritalStatus: labour.Marital_Status,
        dob: labour.dateOfBirth,
        retirementDate: labour.retirementDate,
        nationality: labour.Nationality,
        calenderType: 1,
        groupJoinDate: labour.Group_Join_Date,
        confirmDate: labour.ConfirmDate,
        doj: labour.dateOfJoining,
        employeeName: labour.name,
        BiometricNo: labour.LabourID,
        employeeAddress: [
          {
            city: {
              id: 0,
              objectId: '000000000000000000000000',
              code: '0000039',
              description: labour.village,
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'City',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            state: {
              gstStateId: '27',
              isUnionTeritory: 0,
              id: 299,
              objectId: '000000000000000000000000',
              code: '19',
              description: labour.state,
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'State',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            country: {
              id: 122,
              objectId: '000000000000000000000000',
              code: 'IND',
              description: 'INDIA',
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'Country',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            countryName: 'INDIA',
            countryId: 122,
            stateName: labour.state,
            stateId: 299,
            cityName: labour.district,
            cityId: 0,
            type: 'P'
          },
          {
            city: {
              id: 0,
              objectId: '000000000000000000000000',
              code: '0000039',
              description: labour.district,
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'City',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            state: {
              gstStateId: '27',
              isUnionTeritory: 0,
              id: 299,
              objectId: '000000000000000000000000',
              code: '19',
              description: labour.state,
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'State',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            country: {
              id: 122,
              objectId: '000000000000000000000000',
              code: 'IND',
              description: 'INDIA',
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'Country',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            countryName: 'INDIA',
            countryId: 122,
            stateName: 'MAHARASHTRA',
            stateId: 299,
            cityName: 'PUNE',
            cityId: 0,
            type: 'C'
          }
        ],
        contactInfo: [
          {
            serialNo: 1,
            type: 'Phone',
            id: 0,
            value: labour.contactNumber,
            mode: 'I'
          },
          {
            serialNo: 1,
            type: 'Mobile',
            id: 0,
            value: labour.contactNumber,
            mode: 'I'
          },
          {
            serialNo: 1,
            type: 'Email',
            id: 0,
            value: '',
            mode: 'I'
          }
        ],
        shiftId: dynamicData.shiftId,
        shiftName: dynamicData.shiftName,
        extraInfo: {
          aadharNo: labour.aadhaarNumber,
          isHandicap: false
        },
        paymentBank: {
          paymentMode: {
            id: 4
          },
          bank: {
            id: 2
          },
          employee: {},
          bankAccountNo: labour.accountNumber,            
          companyNEFTNo: 'SBIN0004523'
        },
        personalBank: {
          employee: {}
        },
        pf: {
          companyPf: {}
        },
        Esi: {
          companyEsi: {}
        },
        passport: {
          companyPf: {}
        },
        visa: {},
        leaveOpening: [
          {
            employeeId: 0,
            isResignEmployee: false,
            empRetirementDate: null,
            empJoinDate: null,
            leave: {
              type: 0,
              id: 1,
              objectId: '000000000000000000000000',
              description: 'PRIVLIAGE LEAVE',
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: '',
              entityName: 'Leave',
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: '00000000-0000-0000-0000-000000000000',
              isInApproval: false
            },
            openingBalance: 0,
            currentBalance: 0,
            isLeaveEntryDone: false,
            serialNo: 0,
            isApplicable: true,
            isEmployeeMaster: false,
            amount: 0,
            id: 0,
            objectId: '000000000000000000000000',
            entryTypeId: 0,
            fiscalYearId: 0,
            taggedTaskId: 0,
            yearType: 0,
            refObjectId: '000000000000000000000000',
            documentClassificationId: 0,
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            lastModifiedOn: null,
            mode: '',
            entityName: 'EmployeeLeave',
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: '00000000-0000-0000-0000-000000000000',
            isInApproval: false,
            financialYear: {
              id: 24,
              description: '01-01-2024-31-12-2024',
              fiscalYearTemplate: 2,
              yearStartDate: '2024-01-01T00:00:00.000Z',
              yearEndDate: '2024-12-31T00:00:00.000Z',
              startPeriodId: 51,
              endPeriodId: 63,
              yearType: 2
            }
          }
        ],
        entryTypeId: 275,
        uiid: 18,
        isDraft: false,
        documentDate: '2024-07-18T18:30:00.000Z',
        machineAddress: '103.186.18.36',
        approvalBaseUrl: 'https://vjerp.farvisioncloud.com',
        approvalToken: '0APSJtXkF041rvjnErcFMe_g_lb8tX67jFFodma1_I4YXWZ-roHOiiQTd1mAXzD77W65n8N2iuLvxShYsJwxffLZ4Nl6JvvMOyd1k0Irl2ERiQEnXYnz5Dmw6YBfO_yHUQ_S0lxYRQCAWWpEWy6DdCyfhEFUAp2ltxXlrkvIeSiOOMCgW4Yhwc6IrTvaninwNRaLfGp3XGUFkTz6GdCkPWPZ9oNb66FGkAJ2pSbYnXnTmmRj4OS1n3MW2e2vw09WC-_9dPXzobyus0GJpW4gui_xcQNYpYvPLE4knuuSHocDs4vrGosQy5Q_W97ml0xaZ1g49aCh5m2peNiDw6VMWGcrLYxD1TSaSoPWlGWv4hXjN7uX-TGq9J9IOW2ehhXDxn8j_mo5uO9b1KRjkQQtcNZKHrLC2GCZ2SvabDvo0LNjJSmwhYxGQuOBS2t5Lub0XwtaCaP5LMx1AZ6oIp39124du1QXLRyqSOQDrXqUxTEXYIBURW19mhnGtXQ5SfjZDKRqG-_QEcri4WCn0_bKD4t95s2KweVXsGy8otLaqy2wdumHiRjCs0vdbi6pmGHx-mp280yW8k1XNFXWmquoB-XUUeoPFsDCTDB8D8e-R9hzwI4MQ_K5uqEwicGY7MOQzS29BbZB74DnpXd6R1oLdH62k2GWy9ugQGphoDiqYtLRexRPFUHb9xx6RJnkSeApxbLETekXoqCjREROjHRMxP_MO5N9WA4K8YmBKqabLmgWh-ga5GggRFR0gfm70yJ_oml0I_Lsgp23-Gv1PD6NGbfzAIw'
      };

      const employeeMasterResponse = await axios.post('https://vjerp.farvisioncloud.com/Payroll/odata/Employees', employeeMasterPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'apikey 8d1588e79eb31ed7cb57ff57325510572baa1008d575537615e295d3bbd7d558',
        }
      });

      if (employeeMasterResponse.data.status) {
        toast.success('Employee master details updated successfully.');

        const empData = {
          empId: employeeMasterResponse.data.outputList.id
        };

        const employeeDetails = await axios.put(`${API_BASE_URL}/addFvEmpId/${labour.id}`, empData);
        console.log(employeeDetails.status);

        // Fetch dynamic data for organizationMasterPayload
        const dynamicDataResponse2 = await axios.get(`${API_BASE_URL}/fetchOrgDynamicData`, {
          params: {
            employeeId: employeeMasterResponse.data.outputList.id,
            monthdesc: labour.Period,
            gradeId: labour.labourCategoryId,
            salarybudescription: labour.SalaryBu,
            workbudesc: labour.WorkingBu,
            ledgerId: employeeMasterResponse.data.outputList.ledgerId,
            departmentId: labour.departmentId,
            designationId: labour.designationId
          }
        });
        const dynamicData2 = dynamicDataResponse2.data;

        // Construct organizationMasterPayload with dynamic LabourID
        const organizationMasterPayload = {
          locationName: dynamicData2.description,
          workLocationName: dynamicData2.payrollUnit.WorkingBu,
          approvar1: "",
          approvar2: "",
          approvar3: "",
          division: {
            Index: -1,
            customObject: {}
          },
          noticePeriod: 0,
          employee: {
            totalRecordNo: 2,
            id: dynamicData2.payrollUnit.empId,
            code: dynamicData2.payrollUnit.LabourID,
            employeeName: dynamicData2.payrollUnit.name,
            companyName: dynamicData2.payrollUnit.companyName,
            dojLocal: dynamicData2.payrollUnit.dateOfJoining,
            companyId: dynamicData2.parentId
          },
          monthPeriod: dynamicData2.monthPeriod,
          // monthPeriod: {
          //   id: dynamicData2.monthPeriod.id,
          //   description: dynamicData2.monthPeriod.description, 
          //   periodFrom: dynamicData2.monthPeriod.periodFrom,
          //   periodTo: dynamicData2.monthPeriod.periodTo,
          //   actualPeriod: dynamicData2.monthPeriod.actualPeriod,
          //   startDate: dynamicData2.monthPeriod.startDate, 
          //   endDate: dynamicData2.monthPeriod.endDate,
          //   cutOffPeriodFrom: dynamicData2.monthPeriod.cutOffPeriodFrom,
          //   cutOffPeriodTo: dynamicData2.monthPeriod.cutOffPeriodTo
          // },
        
          fromDate: dynamicData2.payrollUnit.dateOfJoining,
          fromDateLocal: dynamicData2.payrollUnit.dateOfJoining,
          employeeType: {
            offDay: true,
            holiDay: true,
            periodCategory: 1,
            employmentNature: 1,
            attendanceType: 1,
            id: 1,
            objectId: "000000000000000000000000",
            code: "Perm",
            description: "Permanent",
            workflowId: "00000000-0000-0000-0000-000000000000",
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 2,
            createdOn: dynamicData2.payrollUnit.CreationDate,
            lastModifiedBy: 2,
            lastModifiedOn: "2007-05-03T15:16:48.187Z",
            mode: "",
            entityName: "EmployeeCategory",
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: "00000000-0000-0000-0000-000000000000",
            isInApproval: false,
            Index: 0,
            customObject: {}
          },
          currentStatus: {
            ignore: false,
            left: false,
            isChangable: true,
            reasonCode: "W",
            id: 1,
            objectId: "000000000000000000000000",
            code: "WORKING",
            description: "WORKING",
            workflowId: "00000000-0000-0000-0000-000000000000",
            isFinalApproval: false,
            tenantId: 1,
            dbId: 0,
            createdBy: 2,
            createdOn: "2007-05-03T15:16:48.187Z",
            lastModifiedBy: 2,
            lastModifiedOn: "2007-05-03T15:16:48.187Z",
            mode: "",
            entityName:  "CurrentStatus",
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: "00000000-0000-0000-0000-000000000000",
            isInApproval: false,
            Index: 0,
            customObject: {}
          },
          grade: dynamicData2.grade,
          // grade: {
          //   belongsTo: 0,
          //   id: 1,
          //   objectId: "000000000000000000000000",
          //   code: "SK",
          //   description: formData.labourCategory,
          //   workflowId: "00000000-0000-0000-0000-000000000000",
          //   isFinalApproval: false,
          //   tenantId: 1,
          //   dbId: 0,
          //   uiid: 28,
          //   createdBy: 1914,
          //   createdOn: formData.CreationDate,
          //   lastModifiedBy: 1914,
          //   lastModifiedOn: "2024-05-07T12:11:49.719Z",
          //   mode: "",
          //   entityName: "Grade",
          //   isDraft: false,
          //   isChildEntity: false,
          //   appId: 0,
          //   masterEntryTypeId: 0,
          //   masterDocumentTypeId: 0,
          //   importSrlNo: 0,
          //   isUserAdmin: false,
          //   isDataBeingImportFromExcel: false,
          //   isDataBeingValidateOnly: false,
          //   attachmentId: "00000000-0000-0000-0000-000000000000",
          //   isInApproval: false,
          //   Index: 0,
          //   customObject: {}
          // },
          location: {
            level: 5,
            type: "B",
            businessSegment: {
              // id: dynamicData2.id,
              id: 3,
              objectId: "000000000000000000000000",
              // description: dynamicData2.description,
              description: "DEPARTMENT LABOUR",                
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Segment",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            zone: {
              id: 0,
              objectId: "000000000000000000000000",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "BusinessUnitZone",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            fiscalYear: {
              yearStartDate: "2022-04-01T00:00:00.000Z",
              yearEndDate: "2023-03-31T00:00:00.000Z",
              fiscalYearTemplateId: 0,
              startPeriodId: 0,
              endPeriodId: 0,
              yearType: 0,
              isMidTermYear: false,
              midTermYearStartDate: null,
              id: 15,
              objectId: "000000000000000000000000",
              description: "01-04-2022-31-03-2023",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "FiscalYear",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            localCurrency: {
              subUnitFactor: 0,
              printOrder: 0,
              id: 12,
              objectId: "000000000000000000000000",
              description: "RUPEES",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Currency",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            reportingCurrency1: {
              subUnitFactor: 0,
              printOrder: 0,
              id: 12,
              objectId: "000000000000000000000000",
              description: "RUPEES",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Currency",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            reportingCurrency2: {
              subUnitFactor: 0,
              printOrder: 0,
              id: 0,
              objectId: "000000000000000000000000",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Currency",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            templateGroupId: 0,
            timeZoneId: 0,
            phone1: "+91-",
            email1: dynamicData2.email1,
            natureId: dynamicData2.natureId,
            interUnitLedgerId: dynamicData2.interUnitLedgerId,
            interUnitParentId: dynamicData2.interUnitParentId,
            interUnitLedger: {
              ledgerGroupId: dynamicData2.interUnitLedger.ledgerGroupId
            },
            startDate: "2022-04-01T00:00:00.000Z",
            countryCode: "IND",
            stateCode: "19",
            countryDesc: "INDIA",
            stateDesc: "MAHARASHTRA",
            cityDesc: "PUNE",
            countryId: 122,
            stateId: 299,
            cityId: 0,
            isDiscontinueBU: false,
            isDiscontinuedStatusChanged: false,
            isParentDiscontinued: false,
            mollakCode: 0,
            mollakDescription: "",
            oracleBUCode: 0,
            inpcrd: "Not Applicable",
            id: dynamicData2.id,
            objectId: "000000000000000000000000",
            code: dynamicData2.code,
            description: dynamicData2.description,
            parentId: dynamicData2.parentId,
            parentDesc: dynamicData2.payrollUnit.companyName,
            isFinalApproval: false,
            tenantId: 278,
            dbId: 0,
            uiid: 79,
            createdBy: 1914,
            createdOn: dynamicData2.payrollUnit.CreationDate,
            lastModifiedBy: 1914,
            lastModifiedOn: "2024-06-24T01:41:06.389Z",
            mode: "",
            isImported: false,
            entityName: "BusinessUnit",
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: "00000000-0000-0000-0000-000000000000",
            isInApproval: false
          },
          workLocation: {
            level: 0,
            type: "B",
            businessSegment: {
              // id: dynamicData2.payrollUnit.projectName,
              id: 3,
              objectId: "000000000000000000000000",
              // description: dynamicData2.payrollUnit.WorkingBu,
              description: "DEPARTMENT LABOUR",                  
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Segment",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            zone: {
              id: 0,
              objectId: "000000000000000000000000",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "BusinessUnitZone",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            fiscalYear: {
              yearStartDate: "2022-04-01T00:00:00.000Z",
              yearEndDate: "2023-03-31T00:00:00.000Z",
              fiscalYearTemplateId: 0,
              startPeriodId: 0,
              endPeriodId: 0,
              yearType: 0,
              isMidTermYear: false,
              midTermYearStartDate: null,
              id: 15,
              objectId: "000000000000000000000000",
              description: "01-04-2022-31-03-2023",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "FiscalYear",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            localCurrency: {
              subUnitFactor: 0,
              printOrder: 0,
              id: 12,
              objectId: "000000000000000000000000",
              description: "RUPEES",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Currency",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            reportingCurrency1: {
              subUnitFactor: 0,
              printOrder: 0,
              id: 12,
              objectId: "000000000000000000000000",
              description: "RUPEES",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Currency",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            reportingCurrency2: {
              subUnitFactor: 0,
              printOrder: 0,
              id: 0,
              objectId: "000000000000000000000000",
              isFinalApproval: false,
              tenantId: 1,
              dbId: 0,
              createdBy: 0,
              createdOn: null,
              lastModifiedBy: 0,
              lastModifiedOn: null,
              mode: "",
              entityName: "Currency",
              isDraft: false,
              isChildEntity: false,
              appId: 0,
              masterEntryTypeId: 0,
              masterDocumentTypeId: 0,
              importSrlNo: 0,
              isUserAdmin: false,
              isDataBeingImportFromExcel: false,
              isDataBeingValidateOnly: false,
              attachmentId: "00000000-0000-0000-0000-000000000000",
              isInApproval: false
            },
            templateGroupId: 0,
            timeZoneId: 0,
            phone1: "+91-...",
            email1: "abc@gmail.com",
            natureId: 0,
            interUnitLedgerId: 6560,
            interUnitParentId: 170,
            interUnitLedger: {
              ledgerGroupId: 53
            },
            startDate: "2022-04-01T00:00:00.000Z",
            countryCode: "IND",
            stateCode: "19",
            countryDesc: "INDIA",
            stateDesc: dynamicData2.payrollUnit.state,
            cityDesc: dynamicData2.payrollUnit.district,
            countryId: 122,
            stateId: 299,
            cityId: 0,
            isDiscontinueBU: false,
            isDiscontinuedStatusChanged: false,
            isParentDiscontinued: false,
            mollakCode: 0,
            mollakDescription: "",
            oracleBUCode: 0,
            inpcrd: "Not Applicable",
            id: dynamicData2.payrollUnit.projectName,
            objectId: "000000000000000000000000",
            code: dynamicData2.workbu.code,
            description: dynamicData2.payrollUnit.WorkingBu,
            parentId: dynamicData2.parentId,
            parentDesc: dynamicData2.payrollUnit.companyName,
            isFinalApproval: false,
            tenantId: 278,
            dbId: 0,
            uiid: 79,
            createdBy:  108,
            createdOn: "2024-05-02T06:17:37.555Z",
            lastModifiedBy: 1914,
            lastModifiedOn: "2024-06-24T01:38:42.075Z",
            mode: "",
            isImported: false,
            entityName: "BusinessUnit",
            isDraft: false,
            isChildEntity: false,
            appId: 0,
            masterEntryTypeId: 0,
            masterDocumentTypeId: 0,
            importSrlNo: 0,
            isUserAdmin: false,
            isDataBeingImportFromExcel: false,
            isDataBeingValidateOnly: false,
            attachmentId: "00000000-0000-0000-0000-000000000000",
            isInApproval: false
          },
          department: {
            id: dynamicData2.department.Id,
            code: dynamicData2.department.Code,
            description: dynamicData2.department.Description,
            parentDesc: null,
            parentId: 0,
            isHidden: null,
            uiid: 0,
            isEditable: null,
            isDeleted: null,
            activeTill: null,
            createdOn: "2021-06-11T11:27:41.990Z",
            createdBy: 0,
            lastModifiedOn: "2021-06-11T11:27:41.990Z",
            lastModifiedBy: 0
          },
          designation: {
            id: dynamicData2.designation.Id,
            code: dynamicData2.designation.Code,
            description: dynamicData2.designation.Description,
            parentDesc: null,
            parentId: null,
            isHidden: null,
            uiid: null,
            isEditable: true,
            isDeleted: null,
            activeTill: null,
            createdOn: "2024-06-26T05:26:48.004Z",
            createdBy: 1914,
            lastModifiedOn: "2024-06-26T05:26:48.004Z",
            lastModifiedBy: 1914
          },
          office: {
            rnum: 2,
            id: 3,
            code: "SL",
            description: "SITE LABOUR"
          },
          uiid: 32,
          IsImported: false,
          machineAddress: "103.186.18.36",
          approvalBaseUrl: "https://vjerp.farvisioncloud.com",
          approvalToken: "0APSJtXkF041rvjnErcFMe_g_lb8tX67jFFodma1_I4YXWZ-roHOiiQTd1mAXzD77W65n8N2iuLvxShYsJwxffLZ4Nl6JvvMOyd1k0Irl2ERiQEnXYnz5Dmw6YBfO_yHUQ_S0lxYRQCAWWpEWy6DdCyfhEFUAp2ltxXlrkvIeSiOOMCgW4Yhwc6IrTvaninwNRaLfGp3XGUFkTz6GdCkPWPZ9oNb66FGkAJ2pSbYnXnTmmRj4OS1n3MW2e2vw09WC-_9dPXzobyus0GJpW4gui_xcQNYpYvPLE4knuuSHocDs4vrGosQy5Q_W97ml0xaZ1g49aCh5m2peNiDw6VMWGcrLYxD1TSaSoPWlGWv4hXjN7uX-TGq9J9IOW2ehhXDxn8j_mo5uO9b1KRjkQQtcNZKHrLC2GCZ2SvabDvo0LNjJSmwhYxGQuOBS2t5Lub0XwtaCaP5LMx1AZ6oIp39124du1QXLRyqSOQDrXqUxTEXYIBURW19mhnGtXQ5SfjZDKRqG-_QEcri4WCn0_bKD4t95s2KweVXsGy8otLaqy2wdumHiRjCs0vdbi6pmGHx-mp280yW8k1XNFXWmquoB-XUUeoPFsDCTDB8D8e-R9hzwI4MQ_K5uqEwicGY7MOQzS29BbZB74DnpXd6R1oLdH62k2GWy9ugQGphoDiqYtLRexRPFUHb9xx6RJnkSeApxbLETekXoqCjREROjHRMxP_MO5N9WA4K8YmBKqabLmgWh-ga5GggRFR0gfm70yJ_oml0I_Lsgp23-Gv1PD6NGbfzAIw"
        };

        const orgMasterResponse = await axios.post('https://vjerp.farvisioncloud.com/Payroll/odata/Organisations', organizationMasterPayload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'apikey 8d1588e79eb31ed7cb57ff57325510572baa1008d575537615e295d3bbd7d558',
          }
        });

        if (orgMasterResponse.data.status) {
          toast.success('Org master details updated successfully.');
        }

        // API call to save employeeMasterPayload and organizationMasterPayload
        await axios.post(`${API_BASE_URL}/saveApiResponsePayload`, {
          userId: labour.id,
          LabourID: labourID,  // Use dynamic LabourID here
          name: labour.name,
          aadharNumber: labour.aadhaarNumber,
          employeeMasterPayload: employeeMasterPayload,
          employeeMasterResponseId: employeeMasterResponse.data.outputList.id,
          employeeMasterLedgerId: employeeMasterResponse.data.outputList.ledgerId,
          employeeMasterUserId: employeeMasterResponse.data.outputList.userId,
          employeeCompanyID: employeeMasterResponse.data.outputList.employeeCompanyID,
          employeeExtraInfoId: employeeMasterResponse.data.outputList.employeeExtraInfoId,
          employeeMasterFullResponse: employeeMasterResponse.data,
          organizationMasterPayload: organizationMasterPayload,
          organizationMasterResponseId: orgMasterResponse.data.outputList.id,
          organizationMasterOrgId: orgMasterResponse.data.outputList.orgId,
          organizationMasterStatus: orgMasterResponse.data.status,
          organizationMasterFullResponse: orgMasterResponse.data,
        });

        toast.success('Employee and Org master details updated and saved successfully.');

      } else {
        toast.error('Failed to update ESSL details.');
      }
    }

    // Update labour status in the frontend
    setLabours(prevLabours =>
      prevLabours.map(labour =>
        labour.id === id ? { ...labour, status: 'Approved', isApproved: 1, LabourID: labourID } : labour
      )
    );

    toast.success('Labour approved successfully.');
    onApprove();
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
        <p style={{ fontSize: '1.2em', color: '#343a40' }}>
          Your Labour ID is <span style={{ fontSize: '1.5em', color: '#007bff', fontWeight: 700 }}>{labourID}</span>.
        </p>
        <p style={{ fontSize: '1.2em', color: '#343a40' }}>Thanks!</p>
      </div>
    );
    setPopupType('success');
    setSaved(true);
  } catch (error) {
    console.error('Error approving labour:', error);
    toast.error('Error approving labour. Please try again.');
  }
};

   

  
  const handleResubmit = async (labour) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/labours/resubmit/${labour.id}`);
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(l =>
            l.id === labour.id ? { ...l, status: 'Resubmitted', isApproved: 3 } : l
          )
        );
        navigate('/kyc', { state: { labourId: labour.id } });
      } else {
        toast.error('Failed to resubmit labour. Please try again.');
      }
      console.log('labourIdResponse',response )
    } catch (error) {
      console.error('Error resubmitting labour:', error);
      toast.error('Error resubmitting labour. Please try again.');
    }
    
  };

  console.log("resubmittedLabluasd:",resubmittedLabours)


  const handleReject = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/labours/reject/${id}`, { Reject_Reason: rejectReason });
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, status: 'Rejected', isApproved: 2, Reject_Reason: rejectReason } : labour
          )
        );
        toast.success('Labour rejected successfully.');
        setIsRejectPopupOpen(false);
      } else {
        toast.error('Failed to reject labour. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting labour:', error);
      toast.error('Error rejecting labour. Please try again.');
    }
  };



  const handleEditLabour = async (labour) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/labours/resubmit/${labour.id}`);
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(l =>
            l.id === labour.id ? { ...l, uploadAadhaarFront: null, contactNumber: null, isApproved: 1 } : l
          )
        );
        navigate('/kyc', { state: { labourId: labour.id } });
      } else {
        toast.error('Failed to Edit labour. Please try again.');
      }
      console.log('labourIdResponse', response)
    } catch (error) {
      console.error('Error Edit labour:', error);
      toast.error('Error Edit labour. Please try again.');
    }
  };


  const handleEditLabourOpen = (labour) => {
    setSelectedLabour(labour);
    setIsEditLabourOpen(true);
  };

  const handleEditLabourClose = () => {
    setIsEditLabourOpen(false);
    setSelectedLabour(null);
  };

  const handleEditLabourConfirm = async () => {
    if (selectedLabour) {
      await handleEditLabour(selectedLabour);
      handleEditLabourClose();
    }
  };

  const openRejectPopup = (labour) => {
    setSelectedLabour(labour);
    setIsRejectPopupOpen(true);
  };

  const closeRejectPopup = () => {
    setSelectedLabour(null);
    setIsRejectPopupOpen(false);
  };

  const openRejectReasonPopup = (labour) => {
    setSelectedLabour(labour);
    setIsRejectReasonPopupOpen(true);
  };

  const closeRejectReasonPopup = () => {
    setSelectedLabour(null);
    setIsRejectReasonPopupOpen(false);
  };



  const openPopup = async (labour) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/${labour.id}`);
      const labourDetails = response.data;
      const projectName  = getProjectDescription(labourDetails.projectName);
      const department  = getDepartmentDescription(labourDetails.department);

      setSelectedLabour({
        ...labourDetails,
        projectName ,
        department ,
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error fetching labour details:', error);
      toast.error('Error fetching labour details. Please try again.');
    }
  };

  const closePopup = () => {
    setSelectedLabour(null);
    setIsPopupOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleSelectLabour = (selectedLabour) => {
    setSelectedLabour(selectedLabour);
  };

  // const handleEdit = (labour) => {
  //   navigate('/edit-labour', { state: { labour } });
  // };

  const handleEdit = (labour) => {
    setFormData(labour);
    setOpen(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  const fetchLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/labours`);
      // console.log('API Response:', response.data);
      setLabours(response.data);
      setLoading(false);
    } catch (error) {
      // console.error('Error fetching labours:', error);
      setError('Error fetching labours. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndSortLabours = async () => {
      await fetchLabours();
      setLabours((prevLabours) => {
        const sorted = [...prevLabours].sort((a, b) => b.id - a.id);
        console.log('Sorted Labours:', sorted);
        return sorted;
      });
    };
  
    fetchAndSortLabours();
  }, [tabValue]);
  
  

  // useEffect(() => {
  //   fetchLabours();
  // }, []);

  
  const handleAccountNumberChange = (e) => {
    let cleanedValue = e.target.value.replace(/\D/g, '');
    if (cleanedValue.length > 16) {
      cleanedValue = cleanedValue.slice(0, 16);
    }
    setFormData({ ...formData, accountNumber: cleanedValue });
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    if (value.length >= 2) {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (e.nativeEvent.inputType === 'deleteContentBackward' && value.length <= 3) {
      value = value.slice(0, 2);
    }
    setFormData({ ...formData, expiryDate: value });
  };


  const handleClose = () => {
    setOpen(false);
  };


  // const API_BASE_URL = 'http://localhost:4000'; 
  // const API_BASE_URL = "https://laboursandbox.vjerp.com"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate expiry date format
    if (!/^\d{2}-\d{4}$/.test(formData.expiryDate)) {
      toast.error('Invalid expiry date format. Please use MM-YYYY.');
      return;
    }
  
    // Format the expiry date for sending to the backend
    const formattedExpiryDate = formData.expiryDate ? `${formData.expiryDate}` : null;
  
    // Create the formatted data object to send to the backend
    const formattedFormData = {
      ...formData,
      expiryDate: formattedExpiryDate,
    };
  
    try {
      // Directly send the PUT request to update the data in the table
      const updateResponse = await axios.put(`${API_BASE_URL}/labours/update/${formData.id}`, formattedFormData);
  
      if (updateResponse.status === 200) {
        toast.success('Labour details updated successfully.');
      } else {
        toast.error('Failed to update labour details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating labour details:', error);
      toast.error('Error updating labour details. Please try again.');
    }
  };

//   const handleSubmit = async (e) => {
//     // console.log(formData);
//     e.preventDefault();

// //     if (!/^\d{2}-\d{4}$/.test(formData.expiryDate)) {
// //       toast.error('Invalid expiry date format. Please use MM-YYYY.');
// //       return;
// //     }

// //     const formattedExpiryDate = formData.expiryDate ? `${formData.expiryDate}` : null;
// //     const formattedFormData = {
// //       ...formData,
// //       expiryDate: formattedExpiryDate,
// //     };

// //     try {

// //       const dynamicDataResponse = await axios.get(`${API_BASE_URL}/fetchDynamicData`, {
// //         params : {
// //           businessUnitDesc: formData.companyName,
// //           workingHours: formData.workingHours
// //         }
// //       });
      
// //       const dynamicData = dynamicDataResponse.data;  

// //       const response = await axios.put(`${API_BASE_URL}/labours/update/${formData.id}`, formattedFormData, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //         }
// //       });
  
// //       if (response.data.message === "Record updated successfully") {
// //         toast.success('Labour details updated successfully.');
// //         setOpen(false);
// //         fetchLabours();

// //         const employeeMasterPayload = {
// //           companyName: formData.companyName,
// //           company: {
// //             level: 3,
// //             type: 'C',
// //             businessSegment: {
// //               id: 3,
// //               objectId: '000000000000000000000000',
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'Segment',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false
// //             },
// //             zone: {
// //               id: 0,
// //               objectId: '000000000000000000000000',
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'BusinessUnitZone',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false
// //             },
// //             fiscalYear: {
// //               yearStartDate: '2022-04-01T00:00:00.000Z',
// //               yearEndDate: '2023-03-31T00:00:00.000Z',
// //               fiscalYearTemplateId: 0,
// //               startPeriodId: 0,
// //               endPeriodId: 0,
// //               yearType: 0,
// //               isMidTermYear: false,
// //               midTermYearStartDate: null,
// //               id: 15,
// //               objectId: '000000000000000000000000',
// //               description: '01-04-2022-31-03-2023',
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'FiscalYear',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false
// //             },
// //             localCurrency: {
// //               subUnitFactor: 0,
// //               printOrder: 0,
// //               id: 12,
// //               objectId: '000000000000000000000000',
// //               description: 'RUPEES',
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'Currency',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false
// //             },
// //             reportingCurrency1: {
// //               subUnitFactor: 0,
// //               printOrder: 0,
// //               id: 12,
// //               objectId: '000000000000000000000000',
// //               description: 'RUPEES',
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'Currency',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false
// //             },
// //             reportingCurrency2: {
// //               subUnitFactor: 0,
// //               printOrder: 0,
// //               id: 0,
// //               objectId: '000000000000000000000000',
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'Currency',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false
// //             },
// //             templateGroupId: 0,
// //             timeZoneId: 0,
// //             ...dynamicData 
// //           },
// //           code: formData.LabourID,
// //           title: formData.title,
// //           firstName: formData.name,
// //           lastName: formData.name.split(' ')[1] || '',
// //           userName: formData.LabourID,
// //           gender: formData.gender,
// //           maritalStatus: formData.Marital_Status,
// //           dob: formData.dateOfBirth,
// //           retirementDate: formData.retirementDate,
// //           nationality: formData.Nationality,
// //           calenderType: 1,
// //           groupJoinDate: formData.Group_Join_Date,
// //           confirmDate: formData.ConfirmDate,
// //           doj: formData.dateOfJoining,
// //           employeeName: formData.name,
// //           BiometricNo: formData.LabourID,
// //           employeeAddress: [
// //             {
// //               city: {
// //                 id: 0,
// //                 objectId: '000000000000000000000000',
// //                 code: '0000039',
// //                 description: formData.village,
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'City',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               state: {
// //                 gstStateId: '27',
// //                 isUnionTeritory: 0,
// //                 id: 299,
// //                 objectId: '000000000000000000000000',
// //                 code: '19',
// //                 description: formData.state,
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'State',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               country: {
// //                 id: 122,
// //                 objectId: '000000000000000000000000',
// //                 code: 'IND',
// //                 description: 'INDIA',
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'Country',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               countryName: 'INDIA',
// //               countryId: 122,
// //               stateName: formData.state,
// //               stateId: 299,
// //               cityName: formData.district,
// //               cityId: 0,
// //               type: 'P'
// //             },
// //             {
// //               city: {
// //                 id: 0,
// //                 objectId: '000000000000000000000000',
// //                 code: '0000039',
// //                 description: formData.district,
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'City',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               state: {
// //                 gstStateId: '27',
// //                 isUnionTeritory: 0,
// //                 id: 299,
// //                 objectId: '000000000000000000000000',
// //                 code: '19',
// //                 description: formData.state,
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'State',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               country: {
// //                 id: 122,
// //                 objectId: '000000000000000000000000',
// //                 code: 'IND',
// //                 description: 'INDIA',
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'Country',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               countryName: 'INDIA',
// //               countryId: 122,
// //               stateName: 'MAHARASHTRA',
// //               stateId: 299,
// //               cityName: 'PUNE',
// //               cityId: 0,
// //               type: 'C'
// //             }
// //           ],
// //           contactInfo: [
// //             {
// //               serialNo: 1,
// //               type: 'Phone',
// //               id: 0,
// //               value: formData.contactNumber,
// //               mode: 'I'
// //             },
// //             {
// //               serialNo: 1,
// //               type: 'Mobile',
// //               id: 0,
// //               value: formData.contactNumber,
// //               mode: 'I'
// //             },
// //             {
// //               serialNo: 1,
// //               type: 'Email',
// //               id: 0,
// //               value: '',
// //               mode: 'I'
// //             }
// //           ],
// //           shiftId: dynamicData.shiftId,
// //           shiftName: dynamicData.shiftName,
// //           extraInfo: {
// //             aadharNo: formData.aadhaarNumber,
// //             isHandicap: false
// //           },
// //           paymentBank: {
// //             paymentMode: {
// //               id: 4
// //             },
// //             bank: {
// //               id: 2
// //             },
// //             employee: {},
// //             bankAccountNo: formData.accountNumber,            
// //             companyNEFTNo: 'SBIN0004523'
// //           },
// //           personalBank: {
// //             employee: {}
// //           },
// //           pf: {
// //             companyPf: {}
// //           },
// //           Esi: {
// //             companyEsi: {}
// //           },
// //           passport: {
// //             companyPf: {}
// //           },
// //           visa: {},
// //           leaveOpening: [
// //             {
// //               employeeId: 0,
// //               isResignEmployee: false,
// //               empRetirementDate: null,
// //               empJoinDate: null,
// //               leave: {
// //                 type: 0,
// //                 id: 1,
// //                 objectId: '000000000000000000000000',
// //                 description: 'PRIVLIAGE LEAVE',
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 0,
// //                 createdOn: null,
// //                 lastModifiedBy: 0,
// //                 lastModifiedOn: null,
// //                 mode: '',
// //                 entityName: 'Leave',
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: '00000000-0000-0000-0000-000000000000',
// //                 isInApproval: false
// //               },
// //               openingBalance: 0,
// //               currentBalance: 0,
// //               isLeaveEntryDone: false,
// //               serialNo: 0,
// //               isApplicable: true,
// //               isEmployeeMaster: false,
// //               amount: 0,
// //               id: 0,
// //               objectId: '000000000000000000000000',
// //               entryTypeId: 0,
// //               fiscalYearId: 0,
// //               taggedTaskId: 0,
// //               yearType: 0,
// //               refObjectId: '000000000000000000000000',
// //               documentClassificationId: 0,
// //               isFinalApproval: false,
// //               tenantId: 1,
// //               dbId: 0,
// //               createdBy: 0,
// //               createdOn: null,
// //               lastModifiedBy: 0,
// //               lastModifiedOn: null,
// //               mode: '',
// //               entityName: 'EmployeeLeave',
// //               isDraft: false,
// //               isChildEntity: false,
// //               appId: 0,
// //               masterEntryTypeId: 0,
// //               masterDocumentTypeId: 0,
// //               importSrlNo: 0,
// //               isUserAdmin: false,
// //               isDataBeingImportFromExcel: false,
// //               isDataBeingValidateOnly: false,
// //               attachmentId: '00000000-0000-0000-0000-000000000000',
// //               isInApproval: false,
// //               financialYear: {
// //                 id: 24,
// //                 description: '01-01-2024-31-12-2024',
// //                 fiscalYearTemplate: 2,
// //                 yearStartDate: '2024-01-01T00:00:00.000Z',
// //                 yearEndDate: '2024-12-31T00:00:00.000Z',
// //                 startPeriodId: 51,
// //                 endPeriodId: 63,
// //                 yearType: 2
// //               }
// //             }
// //           ],
// //           entryTypeId: 275,
// //           uiid: 18,
// //           isDraft: false,
// //           documentDate: '2024-07-18T18:30:00.000Z',
// //           machineAddress: '103.186.18.36',
// //           approvalBaseUrl: 'https://vjerp.farvisioncloud.com',
// //           approvalToken: '0APSJtXkF041rvjnErcFMe_g_lb8tX67jFFodma1_I4YXWZ-roHOiiQTd1mAXzD77W65n8N2iuLvxShYsJwxffLZ4Nl6JvvMOyd1k0Irl2ERiQEnXYnz5Dmw6YBfO_yHUQ_S0lxYRQCAWWpEWy6DdCyfhEFUAp2ltxXlrkvIeSiOOMCgW4Yhwc6IrTvaninwNRaLfGp3XGUFkTz6GdCkPWPZ9oNb66FGkAJ2pSbYnXnTmmRj4OS1n3MW2e2vw09WC-_9dPXzobyus0GJpW4gui_xcQNYpYvPLE4knuuSHocDs4vrGosQy5Q_W97ml0xaZ1g49aCh5m2peNiDw6VMWGcrLYxD1TSaSoPWlGWv4hXjN7uX-TGq9J9IOW2ehhXDxn8j_mo5uO9b1KRjkQQtcNZKHrLC2GCZ2SvabDvo0LNjJSmwhYxGQuOBS2t5Lub0XwtaCaP5LMx1AZ6oIp39124du1QXLRyqSOQDrXqUxTEXYIBURW19mhnGtXQ5SfjZDKRqG-_QEcri4WCn0_bKD4t95s2KweVXsGy8otLaqy2wdumHiRjCs0vdbi6pmGHx-mp280yW8k1XNFXWmquoB-XUUeoPFsDCTDB8D8e-R9hzwI4MQ_K5uqEwicGY7MOQzS29BbZB74DnpXd6R1oLdH62k2GWy9ugQGphoDiqYtLRexRPFUHb9xx6RJnkSeApxbLETekXoqCjREROjHRMxP_MO5N9WA4K8YmBKqabLmgWh-ga5GggRFR0gfm70yJ_oml0I_Lsgp23-Gv1PD6NGbfzAIw'
// //         };

// //         // const fileData = JSON.stringify(employeeMasterPayload, null, 2);
// //         // const blob = new Blob([fileData], { type: 'application/json' });
// //         // const url = URL.createObjectURL(blob);
// //         // const a = document.createElement('a');
// //         // a.href = url;
// //         // a.download = 'employeeMasterPayload.json';
// //         // a.click();

// //         // console.log('Employee Master Payload:', employeeMasterPayload);

// //         // try {
// //           const employeeMasterResponse = await axios.post('https://vjerp.farvisioncloud.com/Payroll/odata/Employees', employeeMasterPayload, {
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'Accept': 'application/json',
// //               'Authorization': 'apikey 8d1588e79eb31ed7cb57ff57325510572baa1008d575537615e295d3bbd7d558',
// //             }
// //           });

// //           if (employeeMasterResponse.data.status) {
// //             toast.success('Employee master details updated successfully.');

// //             const empData = {
// //               empId : employeeMasterResponse.data.outputList.id
// //             }

// //             const employeeDetails = await axios.put(`${API_BASE_URL}/addFvEmpId/${formData.id}`, empData);
// // console.log(employeeDetails.status);
    
// //     const dynamicDataResponse2 = await axios.get(`${API_BASE_URL}/fetchOrgDynamicData`, {
// //       params: {
// //         employeeId: employeeMasterResponse.data.outputList.id,
// //         monthdesc: formData.Period,
// //         gradeId: formData.labourCategoryId,
// //         salarybudescription: formData.SalaryBu,
// //         workbudesc: formData.WorkingBu,
// //         ledgerId:employeeMasterResponse.data.outputList.ledgerId,
// //         departmentId:formData.departmentId,
// //         designationId:formData.designationId
// //       },
// //     });
// //     const dynamicData2 = dynamicDataResponse2.data;
// // // console.log('dynamicData2',JSON.stringify(dynamicData2));


// //             const orgMasterPayload = {
// //               locationName: dynamicData2.description,
// //               workLocationName: dynamicData2.payrollUnit.WorkingBu,
// //               approvar1: "",
// //               approvar2: "",
// //               approvar3: "",
// //               division: {
// //                 Index: -1,
// //                 customObject: {}
// //               },
// //               noticePeriod: 0,
// //               employee: {
// //                 totalRecordNo: 2,
// //                 id: dynamicData2.payrollUnit.empId,
// //                 code: dynamicData2.payrollUnit.LabourID,
// //                 employeeName: dynamicData2.payrollUnit.name,
// //                 companyName: dynamicData2.payrollUnit.companyName,
// //                 dojLocal: dynamicData2.payrollUnit.dateOfJoining,
// //                 companyId: dynamicData2.parentId
// //               },
// //               monthPeriod: dynamicData2.monthPeriod,
// //               // monthPeriod: {
// //               //   id: dynamicData2.monthPeriod.id,
// //               //   description: dynamicData2.monthPeriod.description, 
// //               //   periodFrom: dynamicData2.monthPeriod.periodFrom,
// //               //   periodTo: dynamicData2.monthPeriod.periodTo,
// //               //   actualPeriod: dynamicData2.monthPeriod.actualPeriod,
// //               //   startDate: dynamicData2.monthPeriod.startDate, 
// //               //   endDate: dynamicData2.monthPeriod.endDate,
// //               //   cutOffPeriodFrom: dynamicData2.monthPeriod.cutOffPeriodFrom,
// //               //   cutOffPeriodTo: dynamicData2.monthPeriod.cutOffPeriodTo
// //               // },
            
// //               fromDate: dynamicData2.payrollUnit.dateOfJoining,
// //               fromDateLocal: dynamicData2.payrollUnit.dateOfJoining,
// //               employeeType: {
// //                 offDay: true,
// //                 holiDay: true,
// //                 periodCategory: 1,
// //                 employmentNature: 1,
// //                 attendanceType: 1,
// //                 id: 1,
// //                 objectId: "000000000000000000000000",
// //                 code: "Perm",
// //                 description: "Permanent",
// //                 workflowId: "00000000-0000-0000-0000-000000000000",
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 2,
// //                 createdOn: dynamicData2.payrollUnit.CreationDate,
// //                 lastModifiedBy: 2,
// //                 lastModifiedOn: "2007-05-03T15:16:48.187Z",
// //                 mode: "",
// //                 entityName: "EmployeeCategory",
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: "00000000-0000-0000-0000-000000000000",
// //                 isInApproval: false,
// //                 Index: 0,
// //                 customObject: {}
// //               },
// //               currentStatus: {
// //                 ignore: false,
// //                 left: false,
// //                 isChangable: true,
// //                 reasonCode: "W",
// //                 id: 1,
// //                 objectId: "000000000000000000000000",
// //                 code: "WORKING",
// //                 description: "WORKING",
// //                 workflowId: "00000000-0000-0000-0000-000000000000",
// //                 isFinalApproval: false,
// //                 tenantId: 1,
// //                 dbId: 0,
// //                 createdBy: 2,
// //                 createdOn: "2007-05-03T15:16:48.187Z",
// //                 lastModifiedBy: 2,
// //                 lastModifiedOn: "2007-05-03T15:16:48.187Z",
// //                 mode: "",
// //                 entityName:  "CurrentStatus",
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: "00000000-0000-0000-0000-000000000000",
// //                 isInApproval: false,
// //                 Index: 0,
// //                 customObject: {}
// //               },
// //               grade: dynamicData2.grade,
// //               // grade: {
// //               //   belongsTo: 0,
// //               //   id: 1,
// //               //   objectId: "000000000000000000000000",
// //               //   code: "SK",
// //               //   description: formData.labourCategory,
// //               //   workflowId: "00000000-0000-0000-0000-000000000000",
// //               //   isFinalApproval: false,
// //               //   tenantId: 1,
// //               //   dbId: 0,
// //               //   uiid: 28,
// //               //   createdBy: 1914,
// //               //   createdOn: formData.CreationDate,
// //               //   lastModifiedBy: 1914,
// //               //   lastModifiedOn: "2024-05-07T12:11:49.719Z",
// //               //   mode: "",
// //               //   entityName: "Grade",
// //               //   isDraft: false,
// //               //   isChildEntity: false,
// //               //   appId: 0,
// //               //   masterEntryTypeId: 0,
// //               //   masterDocumentTypeId: 0,
// //               //   importSrlNo: 0,
// //               //   isUserAdmin: false,
// //               //   isDataBeingImportFromExcel: false,
// //               //   isDataBeingValidateOnly: false,
// //               //   attachmentId: "00000000-0000-0000-0000-000000000000",
// //               //   isInApproval: false,
// //               //   Index: 0,
// //               //   customObject: {}
// //               // },
// //               location: {
// //                 level: 5,
// //                 type: "B",
// //                 businessSegment: {
// //                   // id: dynamicData2.id,
// //                   id: 3,
// //                   objectId: "000000000000000000000000",
// //                   // description: dynamicData2.description,
// //                   description: "DEPARTMENT LABOUR",                
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Segment",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 zone: {
// //                   id: 0,
// //                   objectId: "000000000000000000000000",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "BusinessUnitZone",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 fiscalYear: {
// //                   yearStartDate: "2022-04-01T00:00:00.000Z",
// //                   yearEndDate: "2023-03-31T00:00:00.000Z",
// //                   fiscalYearTemplateId: 0,
// //                   startPeriodId: 0,
// //                   endPeriodId: 0,
// //                   yearType: 0,
// //                   isMidTermYear: false,
// //                   midTermYearStartDate: null,
// //                   id: 15,
// //                   objectId: "000000000000000000000000",
// //                   description: "01-04-2022-31-03-2023",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "FiscalYear",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 localCurrency: {
// //                   subUnitFactor: 0,
// //                   printOrder: 0,
// //                   id: 12,
// //                   objectId: "000000000000000000000000",
// //                   description: "RUPEES",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Currency",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 reportingCurrency1: {
// //                   subUnitFactor: 0,
// //                   printOrder: 0,
// //                   id: 12,
// //                   objectId: "000000000000000000000000",
// //                   description: "RUPEES",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Currency",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 reportingCurrency2: {
// //                   subUnitFactor: 0,
// //                   printOrder: 0,
// //                   id: 0,
// //                   objectId: "000000000000000000000000",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Currency",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 templateGroupId: 0,
// //                 timeZoneId: 0,
// //                 phone1: "+91-",
// //                 email1: dynamicData2.email1,
// //                 natureId: dynamicData2.natureId,
// //                 interUnitLedgerId: dynamicData2.interUnitLedgerId,
// //                 interUnitParentId: dynamicData2.interUnitParentId,
// //                 interUnitLedger: {
// //                   ledgerGroupId: dynamicData2.interUnitLedger.ledgerGroupId
// //                 },
// //                 startDate: "2022-04-01T00:00:00.000Z",
// //                 countryCode: "IND",
// //                 stateCode: "19",
// //                 countryDesc: "INDIA",
// //                 stateDesc: "MAHARASHTRA",
// //                 cityDesc: "PUNE",
// //                 countryId: 122,
// //                 stateId: 299,
// //                 cityId: 0,
// //                 isDiscontinueBU: false,
// //                 isDiscontinuedStatusChanged: false,
// //                 isParentDiscontinued: false,
// //                 mollakCode: 0,
// //                 mollakDescription: "",
// //                 oracleBUCode: 0,
// //                 inpcrd: "Not Applicable",
// //                 id: dynamicData2.id,
// //                 objectId: "000000000000000000000000",
// //                 code: dynamicData2.code,
// //                 description: dynamicData2.description,
// //                 parentId: dynamicData2.parentId,
// //                 parentDesc: dynamicData2.payrollUnit.companyName,
// //                 isFinalApproval: false,
// //                 tenantId: 278,
// //                 dbId: 0,
// //                 uiid: 79,
// //                 createdBy: 1914,
// //                 createdOn: dynamicData2.payrollUnit.CreationDate,
// //                 lastModifiedBy: 1914,
// //                 lastModifiedOn: "2024-06-24T01:41:06.389Z",
// //                 mode: "",
// //                 isImported: false,
// //                 entityName: "BusinessUnit",
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: "00000000-0000-0000-0000-000000000000",
// //                 isInApproval: false
// //               },
// //               workLocation: {
// //                 level: 0,
// //                 type: "B",
// //                 businessSegment: {
// //                   // id: dynamicData2.payrollUnit.projectName,
// //                   id: 3,
// //                   objectId: "000000000000000000000000",
// //                   // description: dynamicData2.payrollUnit.WorkingBu,
// //                   description: "DEPARTMENT LABOUR",                  
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Segment",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 zone: {
// //                   id: 0,
// //                   objectId: "000000000000000000000000",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "BusinessUnitZone",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 fiscalYear: {
// //                   yearStartDate: "2022-04-01T00:00:00.000Z",
// //                   yearEndDate: "2023-03-31T00:00:00.000Z",
// //                   fiscalYearTemplateId: 0,
// //                   startPeriodId: 0,
// //                   endPeriodId: 0,
// //                   yearType: 0,
// //                   isMidTermYear: false,
// //                   midTermYearStartDate: null,
// //                   id: 15,
// //                   objectId: "000000000000000000000000",
// //                   description: "01-04-2022-31-03-2023",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "FiscalYear",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 localCurrency: {
// //                   subUnitFactor: 0,
// //                   printOrder: 0,
// //                   id: 12,
// //                   objectId: "000000000000000000000000",
// //                   description: "RUPEES",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Currency",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 reportingCurrency1: {
// //                   subUnitFactor: 0,
// //                   printOrder: 0,
// //                   id: 12,
// //                   objectId: "000000000000000000000000",
// //                   description: "RUPEES",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Currency",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 reportingCurrency2: {
// //                   subUnitFactor: 0,
// //                   printOrder: 0,
// //                   id: 0,
// //                   objectId: "000000000000000000000000",
// //                   isFinalApproval: false,
// //                   tenantId: 1,
// //                   dbId: 0,
// //                   createdBy: 0,
// //                   createdOn: null,
// //                   lastModifiedBy: 0,
// //                   lastModifiedOn: null,
// //                   mode: "",
// //                   entityName: "Currency",
// //                   isDraft: false,
// //                   isChildEntity: false,
// //                   appId: 0,
// //                   masterEntryTypeId: 0,
// //                   masterDocumentTypeId: 0,
// //                   importSrlNo: 0,
// //                   isUserAdmin: false,
// //                   isDataBeingImportFromExcel: false,
// //                   isDataBeingValidateOnly: false,
// //                   attachmentId: "00000000-0000-0000-0000-000000000000",
// //                   isInApproval: false
// //                 },
// //                 templateGroupId: 0,
// //                 timeZoneId: 0,
// //                 phone1: "+91-...",
// //                 email1: "abc@gmail.com",
// //                 natureId: 0,
// //                 interUnitLedgerId: 6560,
// //                 interUnitParentId: 170,
// //                 interUnitLedger: {
// //                   ledgerGroupId: 53
// //                 },
// //                 startDate: "2022-04-01T00:00:00.000Z",
// //                 countryCode: "IND",
// //                 stateCode: "19",
// //                 countryDesc: "INDIA",
// //                 stateDesc: dynamicData2.payrollUnit.state,
// //                 cityDesc: dynamicData2.payrollUnit.district,
// //                 countryId: 122,
// //                 stateId: 299,
// //                 cityId: 0,
// //                 isDiscontinueBU: false,
// //                 isDiscontinuedStatusChanged: false,
// //                 isParentDiscontinued: false,
// //                 mollakCode: 0,
// //                 mollakDescription: "",
// //                 oracleBUCode: 0,
// //                 inpcrd: "Not Applicable",
// //                 id: dynamicData2.payrollUnit.projectName,
// //                 objectId: "000000000000000000000000",
// //                 code: dynamicData2.workbu.code,
// //                 description: dynamicData2.payrollUnit.WorkingBu,
// //                 parentId: dynamicData2.parentId,
// //                 parentDesc: dynamicData2.payrollUnit.companyName,
// //                 isFinalApproval: false,
// //                 tenantId: 278,
// //                 dbId: 0,
// //                 uiid: 79,
// //                 createdBy:  108,
// //                 createdOn: "2024-05-02T06:17:37.555Z",
// //                 lastModifiedBy: 1914,
// //                 lastModifiedOn: "2024-06-24T01:38:42.075Z",
// //                 mode: "",
// //                 isImported: false,
// //                 entityName: "BusinessUnit",
// //                 isDraft: false,
// //                 isChildEntity: false,
// //                 appId: 0,
// //                 masterEntryTypeId: 0,
// //                 masterDocumentTypeId: 0,
// //                 importSrlNo: 0,
// //                 isUserAdmin: false,
// //                 isDataBeingImportFromExcel: false,
// //                 isDataBeingValidateOnly: false,
// //                 attachmentId: "00000000-0000-0000-0000-000000000000",
// //                 isInApproval: false
// //               },
// //               department: {
// //                 id: dynamicData2.department.Id,
// //                 code: dynamicData2.department.Code,
// //                 description: dynamicData2.department.Description,
// //                 parentDesc: null,
// //                 parentId: 0,
// //                 isHidden: null,
// //                 uiid: 0,
// //                 isEditable: null,
// //                 isDeleted: null,
// //                 activeTill: null,
// //                 createdOn: "2021-06-11T11:27:41.990Z",
// //                 createdBy: 0,
// //                 lastModifiedOn: "2021-06-11T11:27:41.990Z",
// //                 lastModifiedBy: 0
// //               },
// //               designation: {
// //                 id: dynamicData2.designation.Id,
// //                 code: dynamicData2.designation.Code,
// //                 description: dynamicData2.designation.Description,
// //                 parentDesc: null,
// //                 parentId: null,
// //                 isHidden: null,
// //                 uiid: null,
// //                 isEditable: true,
// //                 isDeleted: null,
// //                 activeTill: null,
// //                 createdOn: "2024-06-26T05:26:48.004Z",
// //                 createdBy: 1914,
// //                 lastModifiedOn: "2024-06-26T05:26:48.004Z",
// //                 lastModifiedBy: 1914
// //               },
// //               office: {
// //                 rnum: 2,
// //                 id: 3,
// //                 code: "SL",
// //                 description: "SITE LABOUR"
// //               },
// //               uiid: 32,
// //               IsImported: false,
// //               machineAddress: "103.186.18.36",
// //               approvalBaseUrl: "https://vjerp.farvisioncloud.com",
// //               approvalToken: "0APSJtXkF041rvjnErcFMe_g_lb8tX67jFFodma1_I4YXWZ-roHOiiQTd1mAXzD77W65n8N2iuLvxShYsJwxffLZ4Nl6JvvMOyd1k0Irl2ERiQEnXYnz5Dmw6YBfO_yHUQ_S0lxYRQCAWWpEWy6DdCyfhEFUAp2ltxXlrkvIeSiOOMCgW4Yhwc6IrTvaninwNRaLfGp3XGUFkTz6GdCkPWPZ9oNb66FGkAJ2pSbYnXnTmmRj4OS1n3MW2e2vw09WC-_9dPXzobyus0GJpW4gui_xcQNYpYvPLE4knuuSHocDs4vrGosQy5Q_W97ml0xaZ1g49aCh5m2peNiDw6VMWGcrLYxD1TSaSoPWlGWv4hXjN7uX-TGq9J9IOW2ehhXDxn8j_mo5uO9b1KRjkQQtcNZKHrLC2GCZ2SvabDvo0LNjJSmwhYxGQuOBS2t5Lub0XwtaCaP5LMx1AZ6oIp39124du1QXLRyqSOQDrXqUxTEXYIBURW19mhnGtXQ5SfjZDKRqG-_QEcri4WCn0_bKD4t95s2KweVXsGy8otLaqy2wdumHiRjCs0vdbi6pmGHx-mp280yW8k1XNFXWmquoB-XUUeoPFsDCTDB8D8e-R9hzwI4MQ_K5uqEwicGY7MOQzS29BbZB74DnpXd6R1oLdH62k2GWy9ugQGphoDiqYtLRexRPFUHb9xx6RJnkSeApxbLETekXoqCjREROjHRMxP_MO5N9WA4K8YmBKqabLmgWh-ga5GggRFR0gfm70yJ_oml0I_Lsgp23-Gv1PD6NGbfzAIw"
// //             };

// //             // const fileData = JSON.stringify(orgMasterPayload, null, 2);
// //             // const blob = new Blob([fileData], { type: 'application/json' });
// //             // const url = URL.createObjectURL(blob);
// //             // const a = document.createElement('a');
// //             // a.href = url;
// //             // a.download = 'orgMasterPayload.json';
// //             // a.click();
    
// //             // console.log('Org Master Payload:', orgMasterPayload);
    
// //             const orgMasterResponse = await axios.post('https://vjerp.farvisioncloud.com/Payroll/odata/Organisations', orgMasterPayload, {
// //               headers: {
// //                 'Content-Type': 'application/json',
// //                 'Accept': 'application/json',
// //                 'Authorization': 'apikey 8d1588e79eb31ed7cb57ff57325510572baa1008d575537615e295d3bbd7d558',
// //               }
// //             });
    
// //             if (orgMasterResponse.data.status) {
// //               toast.success('Org master details updated successfully.');

// //               await axios.post(`${API_BASE_URL}/saveApiResponsePayload`, {
// //                 userId: formData.id,
// //                 LabourID: formData.LabourID,
// //                 name: formData.name,
// //                 aadharNumber: formData.aadhaarNumber,
// //                 esslResponse: {}, // Assuming you get this response earlier
// //                 employeeMasterPayload: employeeMasterPayload,
// //                 organizationMasterPayload: orgMasterPayload,
// //               });
// //             } else {
// //               toast.error('Failed to update org master details.');
// //             }
// //           } else {
// //             toast.error('Failed to update employee master details.');
// //           }
// //         } else {
// //           toast.error('Failed to update labour details. Please try again.');
// //         }
// //       } catch (error) {
// //         console.error('Error updating labour details:', error);
// //         toast.error('Error updating labour details. Please try again.');
// //       }
//   };


  const handleDownloadPDF = async (labourId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labours/${labourId}`);
      const labour = response.data;
      const doc = new jsPDF();
      const logoUrl = `${process.env.PUBLIC_URL}/images/vjlogo.png`; // Use the public URL
  
      // Verify that the logoUrl is correctly defined
      if (!logoUrl) {
        throw new Error('Logo URL is undefined');
      }
  
      // Load the logo image
      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => resolve(img);
          img.onerror = (error) => {
            console.error(`Failed to load image: ${url}`, error);
            reject(new Error(`Failed to load image: ${url}`));
          };
          img.src = url;
          console.log(`Attempting to load image from URL: ${url}`);
        });
      };
  
      // Function to convert an image element to a data URL
      const getDataUrl = (img) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png');
      };
  
      const logoImg = await loadImage(logoUrl);
      const logoDataUrl = getDataUrl(logoImg);
  
      // Add logo to PDF
      doc.addImage(logoDataUrl, 'PNG', 10, 10, 50, 15);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text('LABOUR ID CARD', 70, 20);
  
      // Check if labour photo is available
      let labourPhotoDataUrl = null;
      if (labour.photoSrc) {
        try {
          const labourPhoto = await loadImage(labour.photoSrc);
          labourPhotoDataUrl = getDataUrl(labourPhoto);
        } catch (error) {
          console.warn('Labour photo could not be loaded:', error);
        }
      } else {
        console.warn('Labour photo URL is undefined or missing');
      }
  
      // If labour photo is available, add to PDF
      if (labourPhotoDataUrl) {
        doc.addImage(labourPhotoDataUrl, 'PNG', 10, 30, 50, 70);
        doc.setLineWidth(1); // Set line width for darker border
        doc.setDrawColor(0, 0, 0); // Set border color to black
        doc.rect(10, 30, 50, 70); // Add border around image
      }
  
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const lineHeight = 7;
      const startX = 70;
      const valueStartX = 120;
      let startY = 32;
  
      const addDetail = (label, value) => {
        doc.text(`${label.toUpperCase()}`, startX, startY);
        doc.text(`: ${value ? value.toUpperCase() : 'N/A'}`, valueStartX, startY);
        startY += lineHeight;
      };
  
      const departmentDescription = getDepartmentDescription(labour.department);
  
      addDetail('Name', labour.name);
      addDetail('Location', labour.location);
      addDetail('Date of Birth', formatDate(labour.dateOfBirth));
      addDetail('Aadhaar No.', labour.aadhaarNumber);
      addDetail('Department', departmentDescription);
      addDetail('Designation', labour.designation);
      addDetail('Emergency No.', labour.emergencyContact);
      addDetail('Inducted by', labour.Inducted_By);
      addDetail('Induction date', formatDate(labour.Induction_Date));
      addDetail('Date Of joining', formatDate(labour.dateOfJoining));
      addDetail('Valid till', formatDate(labour.ValidTill));
  
      const cardX = 5;
      const cardY = 3;
      const cardWidth = 200;
      const cardHeight = startY + 2;
  
      doc.setLineWidth(1); // Set line width for the outer border
      doc.setDrawColor(0, 0, 0); // Set outer border color to black
      doc.rect(cardX, cardY, cardWidth, cardHeight);
  
      doc.save(`LabourID_${labour.LabourID || labourId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
    }
  };

 
  // const handleDownloadPDF = async (labourId) => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/labours/${labourId}`);
  //     const labour = response.data;
  
  //     const doc = new jsPDF();
  
  //     const logoUrl = `${process.env.PUBLIC_URL}/images/vjlogo.png`; // Use the public URL
      
  
  //     // Verify that the logoUrl is correctly defined
  //     if (!logoUrl) {
  //       throw new Error('Logo URL is undefined');
  //     }
  
  //     // Load the logo image
  //     const loadImage = (url) => {
  //       return new Promise((resolve, reject) => {
  //         const img = new Image();
  //         img.crossOrigin = 'Anonymous';
  //         img.onload = () => resolve(img);
  //         img.onerror = (error) => {
  //           console.error(`Failed to load image: ${url}`, error);
  //           reject(new Error(`Failed to load image: ${url}`));
  //         };
  //         img.src = url;
  //         console.log(`Attempting to load image from URL: ${url}`);
  //       });
  //     };
  
  //     // console.log('Loading logo image from URL:', logoUrl);
  //     const logoImg = await loadImage(logoUrl);
  //     // console.log('Logo image loaded:', logoImg);
  
  //     if (!labour.photoSrc) {
  //       throw new Error('Labour photo URL is undefined');
  //     }
  
  //     // console.log('Loading labour photo from URL:', labour.photoSrc);
  //     const labourPhoto = await loadImage(labour.photoSrc);
  //     // console.log('Labour photo loaded:', labourPhoto);
  
  //     // Convert image to data URI
  //     const getDataUrl = (img) => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext('2d');
  //       ctx.drawImage(img, 0, 0);
  //       return canvas.toDataURL('image/png');
  //     };
  
  //     const logoDataUrl = getDataUrl(logoImg);
  //     const labourPhotoDataUrl = getDataUrl(labourPhoto);
  
  //     // Add logo
  //     doc.addImage(logoDataUrl, 'PNG', 10, 10, 50, 15); 
  //     doc.setFontSize(20);
  //     doc.setFont("helvetica", "bold");
  //     doc.text('LABOUR ID CARD', 70, 20 );
  
  //     // Add image
  //     doc.addImage(labourPhotoDataUrl, 'PNG', 10, 30, 50, 70); 
  //     doc.setLineWidth(1); // Set line width for darker border
  //   doc.setDrawColor(0, 0, 0); // Set border color to black
  //   doc.rect(10, 30, 50, 70); // Add border around image

  //   // const formatDate = (dateString) => {
  //   //   if (!dateString) return 'N/A';
  //   //   const date = new Date(dateString);
  //   //   return date.toISOString().split('T')[0]; 
  //   // };

  //   const formatDate = (dateString) => {
  //     if (!dateString) return 'N/A';
  //     const date = new Date(dateString);
  //     const day = String(date.getDate()).padStart(2, '0');
  //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  //     const year = date.getFullYear();
  //     return `${day}-${month}-${year}`;
  //   };

  //     doc.setFontSize(12);
  //     doc.setFont("helvetica", "normal");
  //     const lineHeight = 7;
  //     const startX = 70;
  //     const valueStartX = 120; 
  //     let startY = 32;
      

  //     const addDetail = (label, value) => {
  //       doc.text(`${label.toUpperCase()}`, startX, startY);
  //     doc.text(`: ${value ? value.toUpperCase() : 'N/A'}`, valueStartX, startY);
  //       startY += lineHeight;
  //     };

  //     const departmentDescription = getDepartmentDescription(labour.department);
  
  //     addDetail('Name', labour.name);
  //   addDetail('Location', labour.location);
  //   addDetail('Date of Birth', formatDate(labour.dateOfBirth));
  //   addDetail('Aadhaar No.', labour.aadhaarNumber);
  //   addDetail('Department', departmentDescription);
  //   addDetail('Designation', labour.designation);
  //   addDetail('Emergency No.', labour.emergencyContact);
  //   addDetail('Inducted by', labour.Inducted_By);
  //   addDetail('Induction date', formatDate(labour.Induction_Date));
  //   addDetail('Date Of joining', formatDate(labour.dateOfJoining));
  //   addDetail('Valid till', formatDate(labour.ValidTill));

  //   const cardX = 5;
  //   const cardY = 3;
  //   const cardWidth = 200;
  //   const cardHeight = startY + 2;

  //   doc.setLineWidth(1); // Set line width for the outer border
  //   doc.setDrawColor(0, 0, 0); // Set outer border color to black
  //   doc.rect(cardX, cardY, cardWidth, cardHeight);
  
  //     doc.save(`LabourID_${labour.LabourID || labourId}.pdf`);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     toast.error('Error generating PDF. Please try again.');
  //   }
  // };



  const displayLabours = searchResults.length > 0 ? searchResults : labours;

  const filteredLabours = displayLabours.filter(labour => {
    if (tabValue === 0) {
      return labour.status === 'Pending';
    } else if (tabValue === 1) {
      return labour.status === 'Approved';
    } else {
      return labour.status === 'Rejected' || labour.status === 'Resubmitted';
    }
  });

  // Function to get department description from ID
  // const getDepartmentDescription = (departmentId) => {
  //   if (!departments || departments.length === 0) {
  //     return 'Unknown';
  //   }
  //   const department = departments.find(dept => dept.Id === Number(departmentId));
  //   return department ? department.Description : 'Unknown';
  // };

  // const sortedLabours = tabValue === 1 
  // ? filteredLabours.sort((a, b) => a.LabourID.localeCompare(b.LabourID))
  // : filteredLabours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getDepartmentDescription = (departmentId) => {
    if (!departments || departments.length === 0) {
      return 'Unknown';
    }
    const department = departments.find(dept => dept.Id === Number(departmentId));
    return department ? department.Description : 'Unknown';
  };




  const getProjectDescription = (projectId) => {
    // console.log('Projects Array:', projectNames);
    // console.log('Project ID:', projectId, 'Type:', typeof projectId);

    if (!projectNames || projectNames.length === 0) {
      // console.log('Projects array is empty or undefined');
      return 'Unknown';
    }

    if (projectId === undefined || projectId === null) {
      // console.log('Project ID is undefined or null');
      return 'Unknown';
    }

    const project = projectNames.find(proj => {
      // console.log(`Checking project: ${proj.id} === ${Number(projectId)} (Type: ${typeof proj.id})`);
      return proj.id === Number(projectId);
    });

    // console.log('Found Project:', project);
    return project ? project.Business_Unit : 'Unknown';
  };


  const handleDownload = async () => {
    setLoadingExcel(true); 
    try {
      const response = await axios.get(`${API_BASE_URL}/download-excel`, {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const today = new Date();
      const date = today.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
      link.href = url;
      link.setAttribute('download', `labourOnboarding_data_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    
      toast.success('Excel downloaded successfully!');
    } catch (error) {
      console.error('Error downloading the Excel file:', error);
      toast.error('Failed to download Excel file.');
    }finally {
      setLoadingExcel(false); // Hide loader after download completes or fails
    }
  };



  return (
    <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', }}>
      {/* <Typography variant="h5" >
        Labour Details
      </Typography> */}

      <Box ml={-1.5}>
        <SearchBar
         handleSubmit={handleSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          // handleSearch={() => {}}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectLabour={handleSelectLabour}
          showResults={false}
          className="search-bar"
        />
      </Box>
      {loading && <Loading />}


      <Box
        sx={{
          width: "auto",
          height: "auto",
          bgcolor: "white",
          marginBottom: "15px",
          p: 1,
          borderRadius: 2,
          boxShadow: 3,
          alignSelf: "flex-start",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="tabs example"
          sx={{
            ".MuiTabs-indicator": {
              display: "none",
            },
            minHeight: "auto",
          }}
        >
          <Tab
            label="Pending"
            style={{ color: tabValue === 0 ? "#8236BC" : "black" }}
            sx={{
              color: tabValue === 0 ? "white" : "black",
              bgcolor: tabValue === 0 ? "#EFE6F7" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "bold",
              mr: 1,
              minHeight: "auto",
              minWidth: "auto",
              // padding: "6px 12px",
              "&:hover": {
                bgcolor: tabValue === 0 ? "#EFE6F7" : "#EFE6F7",
              },
            }}
          />
          <Tab
            label="Approved"
            style={{ color: tabValue === 1 ? "rgb(43, 217, 144)" : "black" }}
            sx={{
              color: tabValue === 1 ? "white" : "black",
              bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              mr: 1,
              fontWeight: "bold",
              minHeight: "auto",
              minWidth: "auto",
              // padding: "6px 12px",
              "&:hover": {
                bgcolor: tabValue === 1 ? "rgb(229, 255, 225)" : "rgb(229, 255, 225)",
              },
            }}
          />
          <Tab
            label="Rejected"
            style={{ color: tabValue === 2 ? "rgb(255, 100, 100)" : "black" }}
            sx={{
              color: tabValue === 2 ? "white" : "black",
              bgcolor: tabValue === 2 ? "rgb(255, 229, 229)" : "transparent",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "bold",
              minHeight: "auto",
              minWidth: "auto",
              // padding: "6px 12px",
              "&:hover": {
                bgcolor: tabValue === 2 ? "rgb(255, 229, 229)" : "rgb(255, 229, 229)",
              },
            }}
          />
        </Tabs>

        <Button
          onClick={handleDownload}
          style={{ color: tabValue === 6 ? "#54c668" : "#54c668" }}
            sx={{
              color: tabValue === 6 ? "white" : "black",
              bgcolor: tabValue === 6 ? "rgb(53 202 79 / 89%)" : "#ecf9ee",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: "bold",
              minHeight: "auto",
              minWidth: "auto",
              px:2,
              py:1.2,
              // padding: "6px 12px",
              "&:hover": {
                bgcolor: tabValue === 2 ? "rgb(204 255 213 / 89%)" : "rgb(204 255 213 / 89%)",
              },
            }}
            disabled={loadingExcel}
        >
        {loadingExcel && (
           <Box component="span" sx={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
    <ClipLoader size={20} color={"rgb(14 198 46)"}  loadingExcel={loadingExcel} /> 
    </Box>
  )}
  {' Download Excel'}
        </Button>

        <TablePagination
          className="custom-pagination"
          rowsPerPageOptions={[25, 100, 200, { label: 'All', value: -1 }]}
          count={filteredLabours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>



      <TableContainer component={Paper} sx={{
  mb: 6,
  overflowX: 'auto',
  borderRadius: 2,
  boxShadow: 3,
  maxHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(75vh - 64px)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '4px',
  },
}}>
  <Table sx={{ minWidth: 800 }}>
    <TableHead>
      <TableRow
        sx={{
          '& th': {
            padding: '12px',
            '@media (max-width: 600px)': {
              padding: '10px',
            },
          },
        }}
      >
        <TableCell>Sr No</TableCell>
        {tabValue !== 0 && tabValue !== 2 && <TableCell>Labour ID</TableCell>}
        <TableCell>Name of Labour</TableCell>
        <TableCell>Project</TableCell>
        <TableCell>Department</TableCell>
        {(tabValue === 0 || tabValue === 1 || tabValue === 1 || tabValue === 2) && <TableCell>Onboarded By</TableCell>}
        <TableCell>Status</TableCell>
        {tabValue === 2 && <TableCell>Reject Reason</TableCell>}
        {tabValue === 1 && <TableCell>LabourID Card</TableCell>}
        {tabValue === 1 && <TableCell>Edit Labour</TableCell>}
        {((user.userType === 'admin') || (tabValue === 2 && user.userType === 'user')) && <TableCell>Action</TableCell>}
        <TableCell>Details</TableCell>
   
      </TableRow>
    </TableHead>
    <TableBody>
      {(rowsPerPage > 0
      ? (searchResults.length > 0 ? searchResults : [...labours])
       .filter(labour => {
         if (tabValue === 0) return labour.status === 'Pending';
         if (tabValue === 1) return labour.status === 'Approved';
         if (tabValue === 2) return labour.status === 'Rejected' || labour.status === 'Resubmitted';
         return true; // fallback if no condition matches
       })
       .sort((a, b) => b.LabourID - a.LabourID) // Sort in descending order by id
       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
   : [...labours]
       .filter(labour => {
         if (tabValue === 0) return labour.status === 'Pending';
         if (tabValue === 1) return labour.status === 'Approved';
         if (tabValue === 2) return labour.status === 'Rejected' || labour.status === 'Resubmitted';
         return true; // fallback if no condition matches
       })
       .sort((a, b) => b.LabourID - a.LabourID)
      ).map((labour, index) => (
        <TableRow key={labour.id}>
          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
          {tabValue !== 0 && tabValue !== 2 && <TableCell>{labour.LabourID}</TableCell>}
          <TableCell>{labour.name}</TableCell>
          <TableCell>{getProjectDescription(labour.projectName)}</TableCell>
          <TableCell>{getDepartmentDescription(labour.department)}</TableCell>
          {(tabValue === 0 || tabValue === 1 || tabValue === 2) && (
            <TableCell>{labour.OnboardName}</TableCell>
          )}
          <TableCell>{labour.status}</TableCell>
          {tabValue === 2 && (
            <TableCell>
               <Box display="flex" justifyContent="center" alignItems="center">
              <InfoIcon onClick={() => {
                setSelectedLabour(labour);
                setIsRejectReasonPopupOpen(true);
              }} style={{cursor: 'pointer', }}/>
              </Box>
            </TableCell>
          )}
          {tabValue === 1 && (
            <TableCell>
                 <Box display="flex" justifyContent="center" alignItems="center">
              <PictureAsPdfIcon onClick={() => handleDownloadPDF(labour.id)} style={{cursor: 'pointer'}}/>
              </Box>
            </TableCell>
          )}

{tabValue === 1 && (
            <TableCell>
              {(user.userType === 'user' && labour.status === 'Approved' && !labour.address) && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleEditLabourOpen(labour)}
                >
                  Edit
                </Button>
              )}
              {(user.userType === 'admin' && labour.status === 'Approved' && !labour.address) && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleEditLabourOpen(labour)}
                >
                  Edit
                </Button>
              )}
            </TableCell>
          )}
          {user.userType === 'user' && (
            <TableCell>
               <div key={labour.id}>
          {((labour.status === 'Rejected' && labour.isApproved !== 1) || labour.status === 'Resubmitted') && (
            <Box display="flex" alignItems="center">
              {labour.status !== 'Pending' && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleResubmit(labour)}
                >
                  Resubmit
                </Button>
              )}
              {/* {labour.status === 'Resubmitted' && (
                <CheckCircleIcon style={{ color: 'green', marginLeft: '10px' }} />
              )} */}
            </Box>
          )}
        </div>
              {labour.status === 'Approved' && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleEdit(labour)}
                >
                  Update
                </Button>
              )}
            </TableCell>
          )}

          {user.userType === 'admin' && (
            <TableCell>
              {labour.status === 'Pending' && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'rgb(229, 255, 225)',
                      color: 'rgb(43, 217, 144)',
                      width: '100px',
                      marginRight: '10px',
                      marginBottom: '3px',
                      '&:hover': {
                        backgroundColor: 'rgb(229, 255, 225)',
                      },
                    }}
                    onClick={() => handleApproveConfirmOpen(labour)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#fce4ec',
                      color: 'rgb(255, 100, 100)',
                      width: '100px',
                      '&:hover': {
                        backgroundColor: '#f8bbd0',
                      },
                    }}
                    onClick={() => {
                      setSelectedLabour(labour);
                      setIsRejectPopupOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              {labour.status === 'Approved' && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleEdit(labour)}
                >
                  Update
                </Button>
              )}

{/* {labours.map(labour => ( */}
        <div key={labour.id}>
          {((labour.status === 'Rejected' && labour.isApproved !== 1) || labour.status === 'Resubmitted') && (
            <Box display="flex" alignItems="center">
              {labour.status !== 'Pending' && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleResubmit(labour)}
                >
                  Resubmit
                </Button>
              )}
              {/* {labour.status === 'Resubmitted' && (
                <CheckCircleIcon style={{ color: 'green', marginLeft: '10px' }} />
              )} */}
            </Box>
          )}
        </div>
      {/* ))} */}

              
              {/* {labour.status === 'Rejected' && (
                <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}
                  onClick={() => handleResubmit(labour)}
                >
                  Resubmit
                </Button>
                {labour.status === 'Resubmitted' && (
                          <CheckCircleIcon style={{ color: 'green', marginLeft: '10px' }} />
                        )}

                        

              </Box>
              )} */}
            </TableCell>
          )}

          <TableCell>
            <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{cursor: 'pointer'}}/>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>



      <Modal
        open={isPopupOpen}
        onClose={closePopup}
        closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isPopupOpen}>
          <div className="modal">
            {selectedLabour && (
              <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
            )}
          </div>
        </Fade>
      </Modal>

      
      <Modal
        open={isRejectPopupOpen}
        onClose={closeRejectPopup}
        closeAfterTransition
      >
        <Fade in={isRejectPopupOpen}>
          <div className="modal">
            <Typography variant="h6" component="h2">
              Reject Labour
            </Typography>
            <TextField
              label="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
            />
            <Box mt={2} style={{display:'flex', justifyContent:'flex-end'}}>
            <Button variant="outlined" color="secondary" onClick={closeRejectPopup} >
                Cancel
              </Button>
              {/* <Button variant="contained" color="primary" onClick={() => handleReject(selectedLabour.id)}> */}
              <Button variant="contained" color="primary"  onClick={() => {
           if (!rejectReason.trim()) {
            toast.error("Please add a reason for rejection.");
          } else {
            handleReject(selectedLabour.id);
          }
        }}sx={{
          ml: 2,
          backgroundColor: '#fce4ec',
          color: 'rgb(255, 100, 100)',
          width: '100px',
          '&:hover': {
            backgroundColor: '#f8bbd0',
          },
        }}
        >
                Reject
              </Button>
             
            </Box>
          </div>
        </Fade>
      </Modal>

      <Modal
        open={isRejectReasonPopupOpen}
        onClose={closeRejectReasonPopup}
        closeAfterTransition
      >
        <Fade in={isRejectReasonPopupOpen}>
          <div className="modal">
            <Typography variant="h6" component="h2" mb={2}>
              Rejection Reason
            </Typography>
            {selectedLabour && (
              <Typography variant="body1" component="p">
                {selectedLabour.Reject_Reason}
              </Typography>
            )}
            <Box mt={2} sx={{display:'flex', justifyContent:'flex-end'}}>
              <Button variant="outlined" color="secondary" onClick={closeRejectReasonPopup} >
                Close
              </Button>
            </Box>
          </div>
        </Fade>
      </Modal>


      <Dialog
        open={isApproveConfirmOpen}
        onClose={handleApproveConfirmClose}
        aria-labelledby="approve-confirm-dialog-title"
        aria-describedby="approve-confirm-dialog-description"
      >
        <DialogTitle id="approve-confirm-dialog-title">
          Approve Labour
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="approve-confirm-dialog-description">
            Are you sure you want to approve this labour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveConfirmClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleApprove(labourToApprove.id)}  sx={{
                      backgroundColor: 'rgb(229, 255, 225)',
                      color: 'rgb(43, 217, 144)',
                      width: '100px',
                      marginRight: '10px',
                      marginBottom: '3px',
                      '&:hover': {
                        backgroundColor: 'rgb(229, 255, 225)',
                      },
                    }} autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

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

<Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Labour Details</DialogTitle>
        <DialogContent >
          {formData && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: isMobile ? '220px' : '400px', padding: 2 }}
            >
              <TextField
                label="Labour Name"
                name="labourName"
                value={formData.name}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: '100%' }}
              />
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
                  style={{ padding: '18px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '95%', fontSize:'17px' }}
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
              <div className="expiryDate-field">
                <InputLabel id="expiry-date-label" sx={{ color: "black" }}>
                  Expiry Date
                </InputLabel>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  required
                  value={formData.expiryDate || ''}
                  onChange={handleExpiryDateChange}
                  placeholder="MM-YYYY"
                  style={{ padding: '18px 10px', borderRadius: '4px', border: '1px solid #ccc', width: '95%', fontSize:'17px' }}
                  maxLength={7}
                />
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{
                    backgroundColor: 'rgb(229, 255, 225)',
                    color: 'rgb(43, 217, 144)',
                    '&:hover': {
                      backgroundColor: 'rgb(229, 255, 225)',
                    },
                  }}>Update</Button>
        </DialogActions>
      </Dialog>
      

      <Dialog
        open={isEditLabourOpen}
        onClose={handleEditLabourClose}
        aria-labelledby="EditLabour-dialog-title"
        aria-describedby="EditLabour-description"
      >
        <DialogTitle id="EditLabour-title">
          Edit Labour
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="EditLabour-dialog-description">
            Are you sure you want to Edit this labour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditLabourClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditLabourConfirm} sx={{
            backgroundColor: 'rgb(229, 255, 225)',
            color: 'rgb(43, 217, 144)',
            width: '100px',
            marginRight: '10px',
            marginBottom: '3px',
            '&:hover': {
              backgroundColor: 'rgb(229, 255, 225)',
            },
          }} autoFocus>
            Edit
          </Button>
        </DialogActions>
      </Dialog>


      <ToastContainer />

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
          width:70vw;
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
    </Box>

  );
};

export default LabourDetails;

















