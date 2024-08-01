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
import {API_BASE_URL} from '../../Data'


const trimUrl = (url) => {
  const baseUrl = "http://localhost:4000/uploads/";
  // return url ? url.replace(baseUrl, '') : '';
  return typeof url === 'string' ? url.replace(baseUrl, '') : '';
};


const ViewDetails = ({ selectedLabour, onClose, hideAadhaarButton  }) => {
  const downloadFullForm = async () => {
    if (!selectedLabour) {
      console.error('Selected labour data is missing.');
      return;
    }


    const formData = {
      "Labour ID": selectedLabour.LabourID || "",
      "Labour Ownership": selectedLabour.labourOwnership || "",
      "Title": selectedLabour?.title || "",
      "Name": selectedLabour.name || "",
      "Aadhaar No": selectedLabour.aadhaarNumber || "",
      "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'dd-MM-yyyy') : "",
      "Contact No": selectedLabour.contactNumber || "",
      "Emergency Contact": selectedLabour?.emergencyContact || "", 
      "Gender": selectedLabour.gender || "",
      "Date of Joining": selectedLabour.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'dd-MM-yyyy') : "",
      "Address": selectedLabour.address || "",
      "Village": selectedLabour?.village || "",
      "Pincode": selectedLabour.pincode || "",
      "District": selectedLabour?.district || "",
      "Taluka": selectedLabour.taluka || "",
      "State": selectedLabour?.state || "",
      "Marital Status": selectedLabour?.Marital_Status || "",
      "Bank Name": selectedLabour?.bankName || "",
      "Account Number": selectedLabour?.accountNumber || "",
      "IFSC Code": selectedLabour?.ifscCode || "",
      "Project Name": selectedLabour?.projectName  || "",
      "Company Name": selectedLabour?.companyName || "",
      "Department": selectedLabour?.department  || "",
      "Designation": selectedLabour?.designation || "",
      "Labour Category": selectedLabour?.labourCategory || "",    
      "Working Hours": selectedLabour?.workingHours || "",
      "Induction Date": selectedLabour?.Induction_Date ? format(new Date(selectedLabour.Induction_Date), 'dd-MM-yyyy') : "",
      "Induction By": selectedLabour?.Inducted_By || "",
      // "Upload Induction Document": selectedLabour?.uploadInductionDoc || "",
      "Upload Induction Document": trimUrl(selectedLabour.uploadInductionDoc) || "",
      "Upload AadhaarFront Document": trimUrl(selectedLabour.uploadAadhaarFront) || "",
      "Upload IdProof Document": trimUrl(selectedLabour.uploadIdProof) || "",
      "Upload AadhaarBack Document": trimUrl(selectedLabour.uploadAadhaarBack) || "",
    };

    if (selectedLabour.labourOwnership === "Contractor") {
      formData["Contractor Name"] = selectedLabour.contractorName || "";
      formData["Contractor Number"] = selectedLabour.contractorNumber || "";
    }

    const doc = new jsPDF();
    // doc.setFontSize(20);
    // doc.text("Labour Details", 14, 15);
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Labour Details";
    const titleX = (pageWidth - doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
  
    doc.setFontSize(20);
    doc.text(title, titleX, 15);

    if (selectedLabour.photoSrc) {
      try {
        const response = await axios.get(selectedLabour.photoSrc, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        const imageWidth = 50;
        const imageHeight = 50;
        const imageX = (pageWidth - imageWidth) / 2;
  
        doc.addImage(imageUrl, 'JPEG', imageX, 20, imageWidth, imageHeight);
        // doc.addImage(imageUrl, 'JPEG', 10, 20, 50, 50);
      } catch (error) {
        console.error('Error fetching image:', error);
        toast.error('Error fetching image. Please try again.');
      }
    }

    const tableColumns = ["Field", "Value"];
    const tableRows = Object.entries(formData).map(([field, value]) => [
      field.toUpperCase(),
      (value || 'N/A').toString().toUpperCase(),
      // field,
      // value.toString(),
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
        // 0: { fontStyle: 'bold' },
        0: { cellWidth: 60, fontStyle: 'bold' }, 
        1: { cellWidth: 130 }, 
      },
      margin: { top: 10 },
    });

    doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
  };

  const downloadAadhaarCard = async () => {
    try {
      const baseUrl = "";
      console.log("Selected Labour:", selectedLabour);

      if (!selectedLabour.uploadAadhaarFront  || !selectedLabour.uploadIdProof) {
        console.error("Aadhaar URLs are missing:", {
          uploadAadhaarFront: selectedLabour.uploadAadhaarFront,
          uploadIdProof: selectedLabour.uploadIdProof,
          // uploadAadhaarBack: selectedLabour.uploadAadhaarBack,          
        });
        toast.error("Aadhaar card URLs are missing. Please check the labour details.");
        return;
      }

      const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
      const urlFront = window.URL.createObjectURL(new Blob([responseFront.data], { type: 'image/jpeg' }));
      const linkFront = document.createElement('a');
      linkFront.href = urlFront;
      linkFront.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      // const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });
      // const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
      // const linkBack = document.createElement('a');
      // linkBack.href = urlBack;
      // linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
      // document.body.appendChild(linkBack);
      // linkBack.click();
      // document.body.removeChild(linkBack);
      
      if (selectedLabour.uploadAadhaarBack) {
        const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });
        const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
        const linkBack = document.createElement('a');
        linkBack.href = urlBack;
        linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
        document.body.appendChild(linkBack);
        linkBack.click();
        document.body.removeChild(linkBack);
      }
      const responseId = await axios.get(`${baseUrl}${selectedLabour.uploadIdProof}`, { responseType: 'blob' });
      const urlId = window.URL.createObjectURL(new Blob([responseId.data], { type: 'image/jpeg' }));
      const linkId = document.createElement('a');
      linkId.href = urlId;
      linkId.setAttribute('download', `Labour_${selectedLabour.id}_ID_Proof.jpg`);
      document.body.appendChild(linkId);
      linkId.click();
      document.body.removeChild(linkId);
      toast.success('Aadhaar card downloaded successfully.');
    } catch (error) {
      console.error('Error downloading Aadhaar card:', error);
      toast.error('Error downloading Aadhaar card. Please try again.');
    }
  };

  const formData = {
    "Labour ID": selectedLabour?.LabourID || "",
    "Labour Ownership": selectedLabour.labourOwnership || "",
      "Title": selectedLabour?.title || "",
      "Name": selectedLabour.name || "",
      "Aadhaar No": selectedLabour.aadhaarNumber || "",
      "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'dd-MM-yyyy') : "",
      "Contact No": selectedLabour.contactNumber || "",
      "Emergency Contact": selectedLabour?.emergencyContact || "", 
      "Gender": selectedLabour.gender || "",
      "Date of Joining": selectedLabour.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'dd-MM-yyyy') : "",
      "Address": selectedLabour.address || "",
      "Village": selectedLabour?.village || "",
      "Pincode": selectedLabour.pincode || "",
      "District": selectedLabour?.district || "",
      "Taluka": selectedLabour.taluka || "",
      "State": selectedLabour?.state || "",
      "Marital Status": selectedLabour?.Marital_Status || "",
      "Bank Name": selectedLabour?.bankName || "",
      "Account Number": selectedLabour?.accountNumber || "",
      "IFSC Code": selectedLabour?.ifscCode || "",
      "Project Name": selectedLabour?.projectName  || "",
      "Company Name": selectedLabour?.companyName || "",
      "Department": selectedLabour?.department  || "",
      "Designation": selectedLabour?.designation || "",
      "Labour Category": selectedLabour?.labourCategory || "",    
      "Working Hours": selectedLabour?.workingHours || "",
      "Induction Date": selectedLabour?.Induction_Date? format(new Date(selectedLabour.Induction_Date), 'dd-MM-yyyy') : "",
      "Induction By": selectedLabour?.Inducted_By || "",
      "Upload Induction Document": trimUrl(selectedLabour.uploadInductionDoc) || "",
      "Upload AadhaarFront Document": trimUrl(selectedLabour.uploadAadhaarFront) || "",
      "Upload IdProof Document": trimUrl(selectedLabour.uploadIdProof) || "",
      "Upload AadhaarBack Document": trimUrl(selectedLabour.uploadAadhaarBack) || "",
  };

  if (selectedLabour?.labourOwnership === "Contractor") {
    formData["Contractor Name"] = selectedLabour?.contractorName || "";
    formData["Contractor Number"] = selectedLabour?.contractorNumber || "";
  }

  const formatLabel = (label) => {
    if (label === "IFSC Code" || label === "Labour ID") {
      return label.split("").join(""); // This will remove spaces
    }
    return label.replace(/([A-Z])/g, ' $1').trim(); 
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
                      <Typography variant="body2" className="label">{formatLabel(key)}:</Typography>
                  {/* <Typography variant="body2" className="label">{key.replace(/([A-Z])/g, ' $1').trim()}:</Typography> */}
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
        {/* <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
          Download Aadhaar
        </Button> */}
          {!hideAadhaarButton && (
          <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
            Download Aadhaar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ViewDetails.propTypes = {
  selectedLabour: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  hideAadhaarButton: PropTypes.bool,
};

export default ViewDetails;

















// import React from 'react';
// import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import CloseIcon from '@mui/icons-material/Close';
// import PropTypes from 'prop-types';
// import { format } from 'date-fns';
// import './ViewDetails.css';
// import {API_BASE_URL} from '../../Data'

// const ViewDetails = ({ selectedLabour, onClose }) => {
//   const downloadFullForm = async () => {
//     if (!selectedLabour) {
//       console.error('Selected labour data is missing.');
//       return;
//     }


//     const formData = {
//       "Labour ID": selectedLabour.LabourID || "",
//       "Labour Ownership": selectedLabour.labourOwnership || "",
//       "Title": selectedLabour?.title || "",
//       "Name": selectedLabour.name || "",
//       "Aadhaar No": selectedLabour.aadhaarNumber || "",
//       "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'yyyy-MM-dd') : "",
//       "Contact No": selectedLabour.contactNumber || "",
//       "Emergency Contact": selectedLabour?.emergencyContact || "", 
//       "Gender": selectedLabour.gender || "",
//       "Date of Joining": selectedLabour.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'yyyy-MM-dd') : "",
//       "Address": selectedLabour.address || "",
//       "Village": selectedLabour?.village || "",
//       "Pincode": selectedLabour.pincode || "",
//       "District": selectedLabour?.district || "",
//       "Taluka": selectedLabour.taluka || "",
//       "State": selectedLabour?.state || "",
//       "Marital Status": selectedLabour?.Marital_Status || "",
//       "Bank Name": selectedLabour?.bankName || "",
//       "Account Number": selectedLabour?.accountNumber || "",
//       "IFSC Code": selectedLabour?.ifscCode || "",
//       "Project Name": selectedLabour?.projectName  || "",
//       "Company Name": selectedLabour?.companyName || "",
//       "Department": selectedLabour?.department  || "",
//       "Designation": selectedLabour?.designation || "",
//       "Labour Category": selectedLabour?.labourCategory || "",    
//       "Working Hours": selectedLabour?.workingHours || "",
//       "Induction Date": selectedLabour?.Induction_Date ? format(new Date(selectedLabour.Induction_Date), 'yyyy-MM-dd') : "",
//       "Induction By": selectedLabour?.Inducted_By || "",
//       // "Upload Induction Document": selectedLabour?.uploadInductionDoc || "",
//     };

//     if (selectedLabour.labourOwnership === "Contractor") {
//       formData["Contractor Name"] = selectedLabour.contractorName || "";
//       formData["Contractor Number"] = selectedLabour.contractorNumber || "";
//     }

//     const doc = new jsPDF();
//     doc.setFontSize(20);
//     doc.text("Labour Details", 14, 15);

//     if (selectedLabour.photoSrc) {
//       try {
//         const response = await axios.get(selectedLabour.photoSrc, { responseType: 'blob' });
//         const imageUrl = URL.createObjectURL(response.data);
//         doc.addImage(imageUrl, 'JPEG', 10, 20, 50, 50);
//       } catch (error) {
//         console.error('Error fetching image:', error);
//         toast.error('Error fetching image. Please try again.');
//       }
//     }

//     const tableColumns = ["Field", "Value"];
//     const tableRows = Object.entries(formData).map(([field, value]) => [
//       field.toUpperCase(),
//       (value || 'N/A').toString().toUpperCase(),
//       // field,
//       // value.toString(),
//     ]);

//     doc.autoTable({
//       head: [tableColumns],
//       body: tableRows,
//       startY: selectedLabour.photoSrc ? 80 : 30,
//       styles: {
//         overflow: 'linebreak',
//         fontSize: 9,
//         cellPadding: 2,
//         textColor: [0, 0, 0],
//       },
//       columnStyles: {
//         // 0: { fontStyle: 'bold' },
//         0: { cellWidth: 60, fontStyle: 'bold' }, 
//         1: { cellWidth: 130 }, 
//       },
//       margin: { top: 10 },
//     });

//     doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
//   };

//   const downloadAadhaarCard = async () => {
//     try {
//       const baseUrl = "";
//       console.log("Selected Labour:", selectedLabour);

//       if (!selectedLabour.uploadAadhaarFront  || !selectedLabour.uploadIdProof) {
//         console.error("Aadhaar URLs are missing:", {
//           uploadAadhaarFront: selectedLabour.uploadAadhaarFront,
//           uploadIdProof: selectedLabour.uploadIdProof,
//           // uploadAadhaarBack: selectedLabour.uploadAadhaarBack,          
//         });
//         toast.error("Aadhaar card URLs are missing. Please check the labour details.");
//         return;
//       }

//       const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
//       const urlFront = window.URL.createObjectURL(new Blob([responseFront.data], { type: 'image/jpeg' }));
//       const linkFront = document.createElement('a');
//       linkFront.href = urlFront;
//       linkFront.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
//       document.body.appendChild(linkFront);
//       linkFront.click();
//       document.body.removeChild(linkFront);

//       // const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });
//       // const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
//       // const linkBack = document.createElement('a');
//       // linkBack.href = urlBack;
//       // linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
//       // document.body.appendChild(linkBack);
//       // linkBack.click();
//       // document.body.removeChild(linkBack);
      
//       if (selectedLabour.uploadAadhaarBack) {
//         const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });
//         const urlBack = window.URL.createObjectURL(new Blob([responseBack.data], { type: 'image/jpeg' }));
//         const linkBack = document.createElement('a');
//         linkBack.href = urlBack;
//         linkBack.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
//         document.body.appendChild(linkBack);
//         linkBack.click();
//         document.body.removeChild(linkBack);
//       }
//       const responseId = await axios.get(`${baseUrl}${selectedLabour.uploadIdProof}`, { responseType: 'blob' });
//       const urlId = window.URL.createObjectURL(new Blob([responseId.data], { type: 'image/jpeg' }));
//       const linkId = document.createElement('a');
//       linkId.href = urlId;
//       linkId.setAttribute('download', `Labour_${selectedLabour.id}_ID_Proof.jpg`);
//       document.body.appendChild(linkId);
//       linkId.click();
//       document.body.removeChild(linkId);
//       toast.success('Aadhaar card downloaded successfully.');
//     } catch (error) {
//       console.error('Error downloading Aadhaar card:', error);
//       toast.error('Error downloading Aadhaar card. Please try again.');
//     }
//   };

//   const formData = {
//     "Labour ID": selectedLabour?.LabourID || "",
//     "Labour Ownership": selectedLabour.labourOwnership || "",
//       "Title": selectedLabour?.title || "",
//       "Name": selectedLabour.name || "",
//       "Aadhaar No": selectedLabour.aadhaarNumber || "",
//       "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'yyyy-MM-dd') : "",
//       "Contact No": selectedLabour.contactNumber || "",
//       "Emergency Contact": selectedLabour?.emergencyContact || "", 
//       "Gender": selectedLabour.gender || "",
//       "Date of Joining": selectedLabour.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'yyyy-MM-dd') : "",
//       "Address": selectedLabour.address || "",
//       "Village": selectedLabour?.village || "",
//       "Pincode": selectedLabour.pincode || "",
//       "District": selectedLabour?.district || "",
//       "Taluka": selectedLabour.taluka || "",
//       "State": selectedLabour?.state || "",
//       "Marital Status": selectedLabour?.Marital_Status || "",
//       "Bank Name": selectedLabour?.bankName || "",
//       "Account Number": selectedLabour?.accountNumber || "",
//       "IFSC Code": selectedLabour?.ifscCode || "",
//       "Project Name": selectedLabour?.projectName  || "",
//       "Company Name": selectedLabour?.companyName || "",
//       "Department": selectedLabour?.department  || "",
//       "Designation": selectedLabour?.designation || "",
//       "Labour Category": selectedLabour?.labourCategory || "",    
//       "Working Hours": selectedLabour?.workingHours || "",
//       "Induction Date": selectedLabour?.Induction_Date? format(new Date(selectedLabour.Induction_Date), 'yyyy-MM-dd') : "",
//       "Induction By": selectedLabour?.Inducted_By || "",
//       // "Upload Induction Document": selectedLabour?.uploadInductionDoc || "",
//       "Upload AadharFront Document": selectedLabour?.uploadAadhaarFront|| "",
//       "Upload idProof Document": selectedLabour?.uploadIdProof || "",
//   };

//   if (selectedLabour?.labourOwnership === "Contractor") {
//     formData["Contractor Name"] = selectedLabour?.contractorName || "";
//     formData["Contractor Number"] = selectedLabour?.contractorNumber || "";
//   }

//   const formatLabel = (label) => {
//     if (label === "IFSC Code" || label === "Labour ID") {
//       return label.split("").join(""); // This will remove spaces
//     }
//     return label.replace(/([A-Z])/g, ' $1').trim(); 
//   };
  
//   return (
//     <Dialog open={!!selectedLabour} onClose={onClose} PaperProps={{ className: 'custom-dialog' }}>
//       <DialogTitle  style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
//         Labour Details
//         <IconButton aria-label="close" onClick={onClose} >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers className="modal-content">
//         {selectedLabour ? (
//           <>
//             {selectedLabour.photoSrc && (
//               <Box mb={2} textAlign="center">
//                 <img src={selectedLabour.photoSrc} alt={`${selectedLabour.name}'s Photo`} height="200" width="200" />
//               </Box>
//             )}
//             <div className="details-table">
//               {Object.entries(formData).map(([key, value]) => (
//                 <div key={key} className="details-row">
//                       <Typography variant="body2" className="label">{formatLabel(key)}:</Typography>
//                   {/* <Typography variant="body2" className="label">{key.replace(/([A-Z])/g, ' $1').trim()}:</Typography> */}
//                   <Typography variant="body2" className="value">{value}</Typography>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <Typography variant="body1">Loading...</Typography>
//         )}
//       </DialogContent>
//       <DialogActions  style={{ display: 'flex', justifyContent: 'center' }}>
//         <Button variant="contained" color="primary" onClick={downloadFullForm}>
//           Download Form
//         </Button>
//         <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
//           Download Aadhaar
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// ViewDetails.propTypes = {
//   selectedLabour: PropTypes.object,
//   onClose: PropTypes.func.isRequired,
// };

// export default ViewDetails;





















