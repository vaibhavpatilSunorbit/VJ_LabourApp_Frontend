import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import './ViewDetails.css';

const ViewDetails = ({ selectedLabour, onClose }) => {
  const downloadFullForm = () => {
    const doc = new jsPDF();
    const formData = {
      "Labour Ownership": selectedLabour.labourOwnership,
      "Aadhaar Front": selectedLabour.uploadAadhaarFront,
      "Aadhaar Back": selectedLabour.uploadAadhaarBack,
      "Name": selectedLabour.name,
      "Aadhaar No": selectedLabour.aadhaarNumber,
      "Date of Birth": selectedLabour.dateOfBirth,
      "Contact No": selectedLabour.contactNumber,
      "Gender": selectedLabour.gender,
      "Date of Joining": selectedLabour.dateOfJoining,
      "Address": selectedLabour.address,
      "Pincode": selectedLabour.pincode,
      "Taluka": selectedLabour.taluka,
      "District": selectedLabour.district,
      "Village": selectedLabour.village,
      "State": selectedLabour.state,
      "Emergency Contact": selectedLabour.emergencyContact,
      "Photo": selectedLabour.photoSrc,
      "Bank Name": selectedLabour.bankName,
      "Account Number": selectedLabour.accountNumber,
      "IFSC Code": selectedLabour.ifscCode,
      "Project Name": selectedLabour.projectName,
      "Labour Category": selectedLabour.labourCategory,
      "Department": selectedLabour.department,
      "Working Hours": selectedLabour.workingHours,
      "Contractor Name": selectedLabour.contractorName,
      "Contractor Number": selectedLabour.contractorNumber,
    };

    let y = 10; // Y-axis position
    doc.setFontSize(12);
    for (const [label, value] of Object.entries(formData)) {
      doc.text(`${label}: ${value}`, 10, y);
      y += 10;
    }
    
    doc.save(`Labour_${selectedLabour.id}_FullForm.pdf`);
  };

  const downloadAadhaarCard = async () => {
    try {
      const baseUrl = "";

      const responseFront = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarFront}`, { responseType: 'blob' });
      const responseBack = await axios.get(`${baseUrl}${selectedLabour.uploadAadhaarBack}`, { responseType: 'blob' });

      // Download Aadhaar Front
      const urlFront = window.URL.createObjectURL(new Blob([responseFront.data], { type: 'image/jpeg' }));
      const linkFront = document.createElement('a');
      linkFront.href = urlFront;
      linkFront.setAttribute('download', `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      // Download Aadhaar Back
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

  return (
    <Box className="modal-content">
      <Box className="modal-header">
        <Typography variant="h5" mb={2}>Labour Details</Typography>
        <Button className="close-button" onClick={onClose}>
          <CloseIcon />
        </Button>
      </Box>
      {selectedLabour ? (
        <div className="modal-body">
      <Typography variant="body1" className="label"><strong>Labour Ownership:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.labourOwnership}</Typography>

          <Typography variant="body1" className="label"><strong>Name:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.name}</Typography>

          <Typography variant="body1" className="label"><strong>Aadhaar No:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.aadhaarNumber}</Typography>

          <Typography variant="body1" className="label"><strong>Date of Birth:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.dateOfBirth}</Typography>

          <Typography variant="body1" className="label"><strong>Contact No:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.contactNumber}</Typography>

          <Typography variant="body1" className="label"><strong>Gender:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.gender}</Typography>

          <Typography variant="body1" className="label"><strong>Date of Joining:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.dateOfJoining}</Typography>

          <Typography variant="body1" className="label"><strong>Address:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.address}</Typography>

          <Typography variant="body1" className="label"><strong>Pincode:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.pincode}</Typography>

          <Typography variant="body1" className="label"><strong>Taluka:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.taluka}</Typography>

          <Typography variant="body1" className="label"><strong>District:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.district}</Typography>

          <Typography variant="body1" className="label"><strong>Village:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.village}</Typography>

          <Typography variant="body1" className="label"><strong>State:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.state}</Typography>

          <Typography variant="body1" className="label"><strong>Emergency Contact:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.emergencyContact}</Typography>

          <Typography variant="body1" className="label"><strong>Bank Name:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.bankName}</Typography>

          <Typography variant="body1" className="label"><strong>Account Number:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.accountNumber}</Typography>

          <Typography variant="body1" className="label"><strong>IFSC Code:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.ifscCode}</Typography>

          <Typography variant="body1" className="label"><strong>Project Name:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.projectName}</Typography>

          <Typography variant="body1" className="label"><strong>Labour Category:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.labourCategory}</Typography>

          <Typography variant="body1" className="label"><strong>Department:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.department}</Typography>

          <Typography variant="body1" className="label"><strong>Working Hours:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.workingHours}</Typography>

          <Typography variant="body1" className="label"><strong>Contractor Name:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.contractorName}</Typography>

          <Typography variant="body1" className="label"><strong>Contractor Number:</strong></Typography>
          <Typography variant="body1" className="value">{selectedLabour.contractorNumber}</Typography>
          
      
          
          <Box mt={3} className="modal-buttons">
            <Button variant="contained" color="primary" onClick={downloadFullForm} style={{ marginRight: '10px' }}>
              Download Full Form
            </Button>
            <Button variant="contained" color="primary" onClick={downloadAadhaarCard}>
              Download Aadhaar Card
            </Button>
          </Box>
        </div>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Box>
  );
};

export default ViewDetails;





















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
//     <Box p={4} className="modal-content">
//       <Typography variant="h5" className="modal-header">Labour Details</Typography>
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
//       <Box mt={3}>
//         <Button variant="contained" onClick={onClose}>Close</Button>
//       </Box>
//     </Box>
//   );
// };

// export default ViewDetails;
