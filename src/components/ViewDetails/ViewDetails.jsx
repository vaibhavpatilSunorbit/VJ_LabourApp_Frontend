// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import CloseIcon from '@mui/icons-material/Close';
// import './ViewDetails.css';

// const ViewDetails = ({ selectedLabour, onClose }) => {

//   const downloadFullForm = async () => {
//     // Ensure selectedLabour is defined and populated
//     if (!selectedLabour) {
//       console.error('Selected labour data is missing.');
//       return;
//     }
  
//     // Data for the table
//     const formData = {
//       "Labour ID": selectedLabour.LabourID || "",
//       "Labour Ownership": selectedLabour.labourOwnership || "",
//       "Name": selectedLabour.name || "",
//       "Aadhaar No": selectedLabour.aadhaarNumber || "",
//       "Date of Birth": selectedLabour.dateOfBirth || "",
//       "Contact No": selectedLabour.contactNumber || "",
//       "Gender": selectedLabour.gender || "",
//       "Date of Joining": selectedLabour.dateOfJoining || "",
//       "Address": selectedLabour.address || "",
//       "Pincode": selectedLabour.pincode || "",
//       "Taluka": selectedLabour.taluka || "",
//       "District": selectedLabour.district || "",
//       "Village": selectedLabour.village || "",
//       "State": selectedLabour.state || "",
//       "Emergency Contact": selectedLabour.emergencyContact || "",
//       "Bank Name": selectedLabour.bankName || "",
//       "Account Number": selectedLabour.accountNumber || "",
//       "IFSC Code": selectedLabour.ifscCode || "",
//       "Project Name": selectedLabour.projectName || "",
//       "Labour Category": selectedLabour.labourCategory || "",
//       "Department": selectedLabour.department || "",
//       "Designation": selectedLabour.designation || "",
//       "Working Hours": selectedLabour.workingHours || "",
//       "Contractor Name": selectedLabour.contractorName || "",
//       "Contractor Number": selectedLabour.contractorNumber || "",
//     };

//     // Check if any critical fields are empty
//     const criticalFields = Object.entries(formData).filter(([field, value]) => !value);
  
//     // Log critical fields
//     // if (criticalFields.length > 0) {
//     //   console.error('Some critical fields are empty:', criticalFields.map(([field, value]) => field));
//     //   return; // Exit if critical fields are empty
//     // } else {
//     //   console.log('All critical fields have data.');
//     // }
  
//     // Create a new jsPDF instance
//     const doc = new jsPDF();
  
//     // Add a title to the PDF
//     doc.setFontSize(20);
//     doc.setTextColor("#000000")
//     doc.text("Labour Details", 14, 15);
  
//     // Adding Labour Photo to the PDF
//     if (selectedLabour.photoSrc) {
//       try {
//         const response = await axios.get(selectedLabour.photoSrc, { responseType: 'blob' });
//         const imageUrl = URL.createObjectURL(response.data);
//         doc.addImage(imageUrl, 'JPEG', 10, 20, 50, 50); // Adjust coordinates as needed
//       } catch (error) {
//         console.error('Error fetching image:', error);
//         toast.error('Error fetching image. Please try again.');
//       }
//     }
  
//     // Prepare table data
//     // const tableColumns = [
//     //   { title: 'Field', dataKey: 'field' },
//     //   { title: 'Value', dataKey: 'value' },
//     // ];

//     const tableColumns = ["Field", "Value"];
  
//     const tableRows = Object.entries(formData).map(([field, value]) => ([
//       field,
//      value.toString(), // Ensure value is converted to string
//     ]));
//   console.log(tableRows)
//     // Add the table to the PDF
//     doc.autoTable({
//       head: [tableColumns],
//       body: tableRows,
//       startY: selectedLabour.photoSrc ? 80 : 30, // Adjust startY based on image presence
//       styles: {
//         overflow: 'linebreak',
//         fontSize: 9,
//         cellPadding: 2,
//         textColor: [0, 0, 0], // Set text color to black
//       },
//       columnStyles: {
//         0: { fontStyle: 'bold' }, // Apply bold style to the first column
//       },
//       margin: { top: 10 },
//     });
  
//     // Save the PDF with a filename
//     doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
//   };

  


//   const downloadAadhaarCard = async () => {
//     try {
//       const baseUrl = ""; // Add your base URL if required

//       // Download Aadhaar Front
//       const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
//       const urlFront = window.URL.createObjectURL(new Blob([responseFront.data], { type: 'image/jpeg' }));
//       const linkFront = document.createElement('a');
//       linkFront.href = urlFront;
//       linkFront.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
//       document.body.appendChild(linkFront);
//       linkFront.click();
//       document.body.removeChild(linkFront);

//       // Download Aadhaar Back
//       const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });
//       const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
//       const linkBack = document.createElement('a');
//       linkBack.href = urlBack;
//       linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
//       document.body.appendChild(linkBack);
//       linkBack.click();
//       document.body.removeChild(linkBack);

//       toast.success('Aadhaar card downloaded successfully.');
//     } catch (error) {
//       console.error('Error downloading Aadhaar card:', error);
//       toast.error('Error downloading Aadhaar card. Please try again.');
//     }
//   };

//   return (
//     <Box
//       className="modal-content"
//       sx={{
//         overflowX: 'auto',
//         boxShadow: 3,
//         '&::-webkit-scrollbar': {
//           width: '8px',
//         },
//         '&::-webkit-scrollbar-track': {
//           backgroundColor: '#f1f1f1',
//         },
//         '&::-webkit-scrollbar-thumb': {
//           backgroundColor: '#888',
//           borderRadius: '4px',
//         },
//       }}
//     >
//       <Box className="modal-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h5">Labour Details</Typography>
//         <Button className="close-button" onClick={onClose}>
//           <CloseIcon />
//         </Button>
//       </Box>
//       {selectedLabour ? (
//         <div className="modal-body">
//           <Typography variant="body1" className="label">
//             <strong>Labour Photo:</strong>
//           </Typography>
//           <img
//             src={selectedLabour.photoSrc}
//             alt={`${selectedLabour.name}'s Photo`}
//             height="200"
//             width="200"
//             style={{ display: 'block', marginBottom: '10px' }}
//           />

//           {/* Render details in a table */}
//           <div className="details-table">
//             {Object.entries(selectedLabour).map(([key, value]) => (
//               <Box
//                 key={key}
//                 className="details-row"
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   padding: '8px 0',
//                   borderBottom: '1px solid #ddd',
//                   '@media (max-width: 600px)': {
//                     flexDirection: 'column',
//                     alignItems: 'flex-start',
//                   },
//                 }}
//               >
//                 <Typography
//                   variant="body2"
//                   className="label"
//                   sx={{
//                     fontWeight: 'bold',
//                     flex: 1,
//                     '@media (max-width: 600px)': {
//                       marginBottom: '4px',
//                     },
//                   }}
//                 >
//                   {key.replace(/([A-Z])/g, ' $1').trim() + ':'}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   className="value"
//                   sx={{
//                     flex: 2,
//                     textAlign: 'right',
//                     wordWrap: 'break-word',
//                     '@media (max-width: 600px)': {
//                       textAlign: 'left',
//                     },
//                   }}
//                 >
//                   {value}
//                 </Typography>
//               </Box>
//             ))}
//           </div>

//           <Box mt={3} className="modal-buttons">
//             <Button variant="contained" color="primary" onClick={downloadFullForm} sx={{ marginRight: '10px' }}>
//               Download Form
//             </Button>
//             <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
//               Download Aadhaar
//             </Button>
//           </Box>
//         </div>
//       ) : (
//         <Typography variant="body1">Loading...</Typography>
//       )}
//     </Box>
//   );
// };

// export default ViewDetails;









import React from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import './ViewDetails.css';

const ViewDetails = ({ selectedLabour, onClose }) => {
  const downloadFullForm = async () => {
    if (!selectedLabour) {
      console.error('Selected labour data is missing.');
      return;
    }

    const formData = {
      "Labour ID": selectedLabour.LabourID || "",
      "Labour Ownership": selectedLabour.labourOwnership || "",
      "Name": selectedLabour.name || "",
      "Aadhaar No": selectedLabour.aadhaarNumber || "",
      "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'yyyy-MM-dd') : "",
      "Contact No": selectedLabour.contactNumber || "",
      "Gender": selectedLabour.gender || "",
      "Date of Joining": selectedLabour.dateOfJoining || "",
      "Address": selectedLabour.address || "",
      "Pincode": selectedLabour.pincode || "",
      "Taluka": selectedLabour.taluka || "",
      "District": selectedLabour?.district || "",
      "Village": selectedLabour?.village || "",
      "State": selectedLabour?.state || "",
      "Emergency Contact": selectedLabour?.emergencyContact || "",
      "Title": selectedLabour?.title || "",
      "Marital Status": selectedLabour?.maritalStatus || "",
      "Nationality": selectedLabour?.nationality || "",
      "Payment Mode": selectedLabour?.paymentMode || "",
      "Employee Type": selectedLabour?.employeeType || "",
      "Current Status": selectedLabour?.currentStatus || "",
      "Seacting Office": selectedLabour?.seatingOffice || "",
      "Company Name": selectedLabour?.companyName || "",
      "Bank Name": selectedLabour?.bankName || "",
      "Account Number": selectedLabour?.accountNumber || "",
      "IFSC Code": selectedLabour?.ifscCode || "",
      "Project Name": selectedLabour?.projectName || "",
      "Labour Category": selectedLabour?.labourCategory || "",
      "Department": selectedLabour?.department || "",
      "Designation": selectedLabour?.designation || "",
      "Working Hours": selectedLabour?.workingHours || "",
      "Contractor Name": selectedLabour?.contractorName || "",
      "Contractor Number": selectedLabour?.contractorNumber || "",
    };

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Labour Details", 14, 15);

    if (selectedLabour.photoSrc) {
      try {
        const response = await axios.get(selectedLabour.photoSrc, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        doc.addImage(imageUrl, 'JPEG', 10, 20, 50, 50);
      } catch (error) {
        console.error('Error fetching image:', error);
        toast.error('Error fetching image. Please try again.');
      }
    }

    const tableColumns = ["Field", "Value"];
    const tableRows = Object.entries(formData).map(([field, value]) => [
      field,
      value.toString(),
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: selectedLabour.photoSrc ? 80 : 30,
      styles: {
        overflow: 'linebreak',
        fontSize: 9,
        cellPadding: 2,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
      margin: { top: 10 },
    });

    doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
  };

  const downloadAadhaarCard = async () => {
    try {
      const baseUrl = "";

      const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
      const urlFront = window.URL.createObjectURL(new Blob([responseFront.data], { type: 'image/jpeg' }));
      const linkFront = document.createElement('a');
      linkFront.href = urlFront;
      linkFront.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });
      const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
      const linkBack = document.createElement('a');
      linkBack.href = urlBack;
      linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
      document.body.appendChild(linkBack);
      linkBack.click();
      document.body.removeChild(linkBack);

      toast.success('Aadhaar card downloaded successfully.');
    } catch (error) {
      console.error('Error downloading Aadhaar card:', error);
      toast.error('Error downloading Aadhaar card. Please try again.');
    }
  };

  const formData = {
    "Labour ID": selectedLabour?.LabourID || "",
    "Labour Ownership": selectedLabour?.labourOwnership || "",
    "Name": selectedLabour?.name || "",
    "Aadhaar No": selectedLabour?.aadhaarNumber || "",
    "Date of Birth": selectedLabour?.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'yyyy-MM-dd') : "",
    "Contact No": selectedLabour?.contactNumber || "",
    "Gender": selectedLabour?.gender || "",
    "Date of Joining": selectedLabour?.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'yyyy-MM-dd') : "",
    "Address": selectedLabour?.address || "",
    "Pincode": selectedLabour?.pincode || "",
    "Taluka": selectedLabour?.taluka || "",
    "District": selectedLabour?.district || "",
    "Village": selectedLabour?.village || "",
    "State": selectedLabour?.state || "",
    "Emergency Contact": selectedLabour?.emergencyContact || "",
    "Title": selectedLabour?.title || "",
    "Marital Status": selectedLabour?.maritalStatus || "",
    "Nationality": selectedLabour?.nationality || "",
    "Payment Mode": selectedLabour?.paymentMode || "",
    "Employee Type": selectedLabour?.employeeType || "",
    "Current Status": selectedLabour?.currentStatus || "",
    "Seacting Office": selectedLabour?.seatingOffice || "",
    "Company Name": selectedLabour?.companyName || "",
    "Bank Name": selectedLabour?.bankName || "",
    "Account Number": selectedLabour?.accountNumber || "",
    "IFSC Code": selectedLabour?.ifscCode || "",
    "Project Name": selectedLabour?.projectName || "",
    "Labour Category": selectedLabour?.labourCategory || "",
    "Department": selectedLabour?.department || "",
    "Designation": selectedLabour?.designation || "",
    "Working Hours": selectedLabour?.workingHours || "",
    "Contractor Name": selectedLabour?.contractorName || "",
    "Contractor Number": selectedLabour?.contractorNumber || "",
  };

  return (
    <Dialog open={!!selectedLabour} onClose={onClose} PaperProps={{ className: 'custom-dialog' }}>
      <DialogTitle  style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
        Labour Details
        <IconButton aria-label="close" onClick={onClose} >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="modal-content">
        {selectedLabour ? (
          <>
            {selectedLabour.photoSrc && (
              <Box mb={2} textAlign="center">
                <img src={selectedLabour.photoSrc} alt={`${selectedLabour.name}'s Photo`} height="200" width="200" />
              </Box>
            )}
            <div className="details-table">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="details-row">
                  <Typography variant="body2" className="label">{key.replace(/([A-Z])/g, ' $1').trim()}:</Typography>
                  <Typography variant="body2" className="value">{value}</Typography>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions  style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={downloadFullForm}>
          Download Form
        </Button>
        <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
          Download Aadhaar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewDetails.propTypes = {
  selectedLabour: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewDetails;























// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import { jsPDF } from 'jspdf';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import CloseIcon from '@mui/icons-material/Close';
// import './ViewDetails.css';

// const ViewDetails = ({ selectedLabour, onClose }) => {
//   const downloadFullForm = async () => {
//     const doc = new jsPDF();

//     const formData = {
//       "Labour Ownership": selectedLabour.labourOwnership,
//       "Name": selectedLabour.name,
//       "Aadhaar No": selectedLabour.aadhaarNumber,
//       "Date of Birth": selectedLabour.dateOfBirth,
//       "Contact No": selectedLabour.contactNumber,
//       "Gender": selectedLabour.gender,
//       "Date of Joining": selectedLabour.dateOfJoining,
//       "Address": selectedLabour.address,
//       "Pincode": selectedLabour.pincode,
//       "Taluka": selectedLabour.taluka,
//       "District": selectedLabour.district,
//       "Village": selectedLabour.village,
//       "State": selectedLabour.state,
//       "Emergency Contact": selectedLabour.emergencyContact,
//       "Bank Name": selectedLabour.bankName,
//       "Account Number": selectedLabour.accountNumber,
//       "IFSC Code": selectedLabour.ifscCode,
//       "Project Name": selectedLabour.projectName,
//       "Labour Category": selectedLabour.labourCategory,
//       "Department": selectedLabour.department,
//       "Working Hours": selectedLabour.workingHours,
//       "Contractor Name": selectedLabour.contractorName,
//       "Contractor Number": selectedLabour.contractorNumber,
//     };

//     let y = 10; // Y-axis position
//     doc.setFontSize(12);
//     for (const [label, value] of Object.entries(formData)) {
//       doc.text(`${label}: ${value}`, 10, y);
//       y += 10;
//     }

//     // Add photos to PDF
//     const addImageToPDF = async (doc, imageUrl, x, y, width, height) => {
//       const response = await axios.get(imageUrl, { responseType: 'blob' });
//       const reader = new FileReader();
//       reader.readAsDataURL(response.data);
//       return new Promise((resolve) => {
//         reader.onloadend = () => {
//           const base64data = reader.result;
//           doc.addImage(base64data, 'JPEG', x, y, width, height);
//           resolve();
//         };
//       });
//     };

//     // Adding Labour Photo
//     if (selectedLabour.photoSrc) {
//       await addImageToPDF(doc, selectedLabour.photoSrc, 10, y, 50, 50);
//       y += 60; // adjust y position for next text
//     }

//     // Adding Aadhaar Front and Back Photos
//     if (selectedLabour.uploadAadhaarFront) {
//       await addImageToPDF(doc, selectedLabour.uploadAadhaarFront, 10, y, 50, 30);
//       y += 40; // adjust y position for next image or text
//     }
//     if (selectedLabour.uploadAadhaarBack) {
//       await addImageToPDF(doc, selectedLabour.uploadAadhaarBack, 10, y, 50, 30);
//       y += 40; // adjust y position for next image or text
//     }

//     doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
//   };

//   const downloadAadhaarCard = async () => {
//     try {
//       const baseUrl = "";

//       const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
//       const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });

//       // Download Aadhaar Front
//       const urlFront = window.URL.createObjectURL(new Blob([responseFront.data], { type: 'image/jpeg' }));
//       const linkFront = document.createElement('a');
//       linkFront.href = urlFront;
//       linkFront.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
//       document.body.appendChild(linkFront);
//       linkFront.click();
//       document.body.removeChild(linkFront);

//       // Download Aadhaar Back
//       const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
//       const linkBack = document.createElement('a');
//       linkBack.href = urlBack;
//       linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
//       document.body.appendChild(linkBack);
//       linkBack.click();
//       document.body.removeChild(linkBack);

//       toast.success('Aadhaar card downloaded successfully.');
//     } catch (error) {
//       console.error('Error downloading Aadhaar card:', error);
//       toast.error('Error downloading Aadhaar card. Please try again.');
//     }
//   };

//   return (
//     <Box className="modal-content">
//       <Box className="modal-header">
//         <Typography variant="h5" mb={2}>Labour Details</Typography>
//         <Button className="close-button" onClick={onClose}>
//           <CloseIcon />
//         </Button>
//       </Box>
//       {selectedLabour ? (
//         <div className="modal-body">
//           <Typography variant="body1" className="label"><strong>Labour Photo:</strong></Typography>
//           <img 
//             src={selectedLabour.photoSrc} 
//             alt={`${selectedLabour.name}'s Photo`} 
//             height="200" 
//             width="200" 
//             style={{ display: 'block', marginBottom: '10px' }}
//           />

//           <Typography variant="body1" className="label"><strong>Labour Ownership:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.labourOwnership}</Typography>

//           <Typography variant="body1" className="label"><strong>Name:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.name}</Typography>

//           <Typography variant="body1" className="label"><strong>Aadhaar No:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.aadhaarNumber}</Typography>

//           <Typography variant="body1" className="label"><strong>Date of Birth:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.dateOfBirth}</Typography>

//           <Typography variant="body1" className="label"><strong>Contact No:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.contactNumber}</Typography>

//           <Typography variant="body1" className="label"><strong>Gender:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.gender}</Typography>

//           <Typography variant="body1" className="label"><strong>Date of Joining:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.dateOfJoining}</Typography>

//           <Typography variant="body1" className="label"><strong>Address:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.address}</Typography>

//           <Typography variant="body1" className="label"><strong>Pincode:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.pincode}</Typography>

//           <Typography variant="body1" className="label"><strong>Taluka:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.taluka}</Typography>

//           <Typography variant="body1" className="label"><strong>District:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.district}</Typography>

//           <Typography variant="body1" className="label"><strong>Village:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.village}</Typography>

//           <Typography variant="body1" className="label"><strong>State:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.state}</Typography>

//           <Typography variant="body1" className="label"><strong>Emergency Contact:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.emergencyContact}</Typography>

//           <Typography variant="body1" className="label"><strong>Bank Name:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.bankName}</Typography>

//           <Typography variant="body1" className="label"><strong>Account Number:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.accountNumber}</Typography>

//           <Typography variant="body1" className="label"><strong>IFSC Code:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.ifscCode}</Typography>

//           <Typography variant="body1" className="label"><strong>Project Name:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.projectName}</Typography>

//           <Typography variant="body1" className="label"><strong>Labour Category:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.labourCategory}</Typography>

//           <Typography variant="body1" className="label"><strong>Department:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.department}</Typography>

//           <Typography variant="body1" className="label"><strong>Working Hours:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.workingHours}</Typography>

//           <Typography variant="body1" className="label"><strong>Contractor Name:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.contractorName}</Typography>

//           <Typography variant="body1" className="label"><strong>Contractor Number:</strong></Typography>
//           <Typography variant="body1" className="value">{selectedLabour.contractorNumber}</Typography>

//           <Box mt={3} className="modal-buttons">
//             <Button variant="contained" color="primary" onClick={downloadFullForm} style={{ marginRight: '10px' }}>
//               Download Full Form
//             </Button>
//             <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
//               Download Aadhaar Card
//             </Button>
//           </Box>
//         </div>
//       ) : (
//         <Typography variant="body1">Loading...</Typography>
//       )}
//     </Box>
//   );
// };

// export default ViewDetails;




















// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import { jsPDF } from 'jspdf';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './ViewDetails.css'; // Import the CSS file for styling

// const ViewDetails = ({ selectedLabour, onClose }) => {
//   const downloadFullForm = () => {
//     const doc = new jsPDF();
//     const formData = [
//       { label: 'Labour Ownership', value: selectedLabour.labourOwnership },
//       { label: 'Name', value: selectedLabour.name },
//       { label: 'Aadhaar No', value: selectedLabour.aadhaarNumber },
//       { label: 'Date of Birth', value: selectedLabour.dateOfBirth },
//       { label: 'Contact No', value: selectedLabour.contactNumber },
//       { label: 'Gender', value: selectedLabour.gender },
//       { label: 'Date of Joining', value: selectedLabour.dateOfJoining },
//       { label: 'Address', value: selectedLabour.address },
//       { label: 'Pincode', value: selectedLabour.pincode },
//       { label: 'Taluka', value: selectedLabour.taluka },
//       { label: 'District', value: selectedLabour.district },
//       { label: 'Village', value: selectedLabour.village },
//       { label: 'State', value: selectedLabour.state },
//       { label: 'Emergency Contact', value: selectedLabour.emergencyContact },
//       { label: 'Bank Name', value: selectedLabour.bankName },
//       { label: 'Account Number', value: selectedLabour.accountNumber },
//       { label: 'IFSC Code', value: selectedLabour.ifscCode },
//       { label: 'Project Name', value: selectedLabour.projectName },
//       { label: 'Labour Category', value: selectedLabour.labourCategory },
//       { label: 'Department', value: selectedLabour.department },
//       { label: 'Working Hours', value: selectedLabour.workingHours },
//       { label: 'Contractor Name', value: selectedLabour.contractorName },
//       { label: 'Contractor Number', value: selectedLabour.contractorNumber },
//     ];

//     let y = 10; // Y-axis position
//     formData.forEach(({ label, value }) => {
//       doc.text(`${label}: ${value}`, 10, y);
//       y += 10;
//     });
    
//     doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
//   };

//   const downloadAadhaarCard = async () => {
//     try {
//       const baseUrl = "";

//       const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
//       const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });

//       const downloadImage = async (response, fileName) => {
//         const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', fileName);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       };

//       await downloadImage(responseFront, `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
//       await downloadImage(responseBack, `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);

//       toast.success('Aadhaar card downloaded successfully.');
//     } catch (error) {
//       console.error('Error downloading Aadhaar card:', error);
//       toast.error('Error downloading Aadhaar card. Please try again.');
//     }
//   };

//   const detailsList = [
//     { label: 'Labour Ownership', value: selectedLabour.labourOwnership },
//     { label: 'Name', value: selectedLabour.name },
//     { label: 'Aadhaar No', value: selectedLabour.aadhaarNumber },
//     { label: 'Date of Birth', value: selectedLabour.dateOfBirth },
//     { label: 'Contact No', value: selectedLabour.contactNumber },
//     { label: 'Gender', value: selectedLabour.gender },
//     { label: 'Date of Joining', value: selectedLabour.dateOfJoining },
//     { label: 'Address', value: selectedLabour.address },
//     { label: 'Pincode', value: selectedLabour.pincode },
//     { label: 'Taluka', value: selectedLabour.taluka },
//     { label: 'District', value: selectedLabour.district },
//     { label: 'Village', value: selectedLabour.village },
//     { label: 'State', value: selectedLabour.state },
//     { label: 'Emergency Contact', value: selectedLabour.emergencyContact },
//     { label: 'Bank Name', value: selectedLabour.bankName },
//     { label: 'Account Number', value: selectedLabour.accountNumber },
//     { label: 'IFSC Code', value: selectedLabour.ifscCode },
//     { label: 'Project Name', value: selectedLabour.projectName },
//     { label: 'Labour Category', value: selectedLabour.labourCategory },
//     { label: 'Department', value: selectedLabour.department },
//     { label: 'Working Hours', value: selectedLabour.workingHours },
//     { label: 'Contractor Name', value: selectedLabour.contractorName },
//     { label: 'Contractor Number', value: selectedLabour.contractorNumber },
//   ];

//   return (
//     <Box className="modal-content">
//       <Box className="modal-header">
//         <Typography variant="h5">Labour Details</Typography>
//         <Button className="close-button" onClick={onClose}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
//           </svg>
//         </Button>
//       </Box>
//       {selectedLabour ? (
//         <div className="modal-body">
//           {detailsList.map(({ label, value }) => (
//             <div key={label} className="details-item">
//               <Typography variant="body1" className="label"><strong>{label}:</strong></Typography>
//               <Typography variant="body1" className="value">{value}</Typography>
//             </div>
//           ))}
//           <Box mt={3} className="modal-buttons">
//             <Button variant="contained" color="primary" onClick={downloadFullForm}>Download Full Form</Button>
//             <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>Download Aadhaar Card</Button>
//           </Box>
//         </div>
//       ) : (
//         <Typography variant="body1">Loading...</Typography>
//       )}
//     </Box>
//   );
// };

// export default ViewDetails;
