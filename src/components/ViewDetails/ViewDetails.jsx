
import React, { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Paper, Grid, Tabs, Tab, Divider,
  Table, TableBody, TableCell, TableContainer, TableRow
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import './ViewDetails.css';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { API_BASE_URL } from '../../Data';

const trimUrl = (url) => {
  // const baseUrl = "http://localhost:4000/uploads/";
  const baseUrl = "https://laboursandbox.vjerp.com/uploads/";
  // const baseUrl = "https://vjlabour.vjerp.com/uploads/";
  return typeof url === 'string' ? url.replace(baseUrl, '') : '';
};

const ViewDetails = ({ selectedLabour, onClose, hideAadhaarButton, onLabourUpdate }) => {
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [currentDocumentType, setCurrentDocumentType] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleStartCrop = () => setIsCropping(true);

  // Function to determine document type based on URL
  const getDocumentType = (url) => {
    if (selectedLabour.uploadInductionDoc === url) return 'induction';
    if (selectedLabour.uploadAadhaarFront === url) return 'aadhaar_front';
    if (selectedLabour.uploadAadhaarBack === url) return 'aadhaar_back';
    if (selectedLabour.uploadIdProof === url) return 'id_proof';
    return 'unknown';
  };

  const getCroppedImg = (imageSrc, pixelCrop, rotation = 0) => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate bounding box of the rotated image
        const radians = rotation * Math.PI / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        const width = image.width;
        const height = image.height;
        const bboxWidth = Math.ceil(width * cos + height * sin);
        const bboxHeight = Math.ceil(width * sin + height * cos);
        
        // Draw rotated image to temp canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = bboxWidth;
        tempCanvas.height = bboxHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.save();
        tempCtx.translate(bboxWidth / 2, bboxHeight / 2);
        tempCtx.rotate(radians);
        tempCtx.drawImage(image, -width / 2, -height / 2);
        tempCtx.restore();
        
        // Now crop from the rotated image
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(
          tempCanvas,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('canvas is empty'));
            return;
          }
          resolve(blob);
        }, 'image/jpeg', 0.95);
      };
      image.onerror = reject;
    });
  };

  const handleSaveCroppedImageToDatabase = async () => {
    if (!croppedAreaPixels || !modalImageSrc) {
      toast.error('Please crop the image first');
      return;
    }

    setIsSaving(true);
    try {
      // Get the cropped image blob
      const croppedImageBlob = await getCroppedImg(modalImageSrc, croppedAreaPixels, rotation);
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('croppedImage', croppedImageBlob, 'cropped_document.jpg');
      formData.append('labourId', selectedLabour.id);
      formData.append('documentType', currentDocumentType);

      // Upload to server
      const response = await axios.post(`${API_BASE_URL}/api/labour/update-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Update the labour data with new image URL
        const updatedLabour = { ...selectedLabour };
        const fieldMap = {
          'induction': 'uploadInductionDoc',
          'aadhaar_front': 'uploadAadhaarFront',
          'aadhaar_back': 'uploadAadhaarBack',
          'id_proof': 'uploadIdProof'
        };

        const fieldName = fieldMap[currentDocumentType];
        if (fieldName) {
          updatedLabour[fieldName] = response.data.updatedImageUrl;
        }

        // Call the update callback if provided
        if (onLabourUpdate) {
          onLabourUpdate(updatedLabour);
        }

        // Update the modal image source to show the new image
        setModalImageSrc(response.data.updatedImageUrl);
        
        toast.success('Document updated successfully in database');
        setIsCropping(false);
        
        // Reset crop states
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
      } else {
        toast.error(response.data.message || 'Failed to update document');
      }
    } catch (error) {
      console.error('Error saving cropped image:', error);
      toast.error('Failed to save cropped image to database');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(modalImageSrc, croppedAreaPixels, rotation);
      const fileUrl = window.URL.createObjectURL(croppedImageBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `cropped_${currentDocumentType}_${selectedLabour.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileUrl);
      toast.success('Cropped image downloaded successfully');
    } catch (error) {
      console.error('Error downloading cropped image:', error);
      toast.error('Failed to download cropped image');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = (url) => {
    setModalImageSrc(url);
    setCurrentDocumentType(getDocumentType(url));
    setOpenModal(true);
    // Reset cropping states
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalImageSrc('');
    setCurrentDocumentType('');
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  const downloadFullForm = async () => {
    if (!selectedLabour) {
      console.error('Selected labour data is missing.');
      return;
    }

    const formData = {
      "Labour ID": selectedLabour.LabourID || "",
      "Labour Ownership": selectedLabour.labourOwnership || "",
      "Title": selectedLabour.title || "",
      "Name": selectedLabour.name || "",
      "Aadhaar No": selectedLabour.aadhaarNumber || "",
      "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy'),
      "Contact No": selectedLabour.contactNumber || "",
      "Emergency Contact": selectedLabour?.emergencyContact || "",
      "Gender": selectedLabour.gender || "",
      "Date of Joining": selectedLabour.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy'),
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
      "Project Name": selectedLabour?.projectName || "",
      "Company Name": selectedLabour?.companyName || "",
      "Department": selectedLabour?.department || "",
      "Designation": selectedLabour?.designation || "",
      "Labour Category": selectedLabour?.labourCategory || "",
      "Working Hours": selectedLabour?.workingHours || "",
      "Induction Date": selectedLabour.Induction_Date ? format(new Date(selectedLabour.Induction_Date), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy'),
      "Induction By": selectedLabour?.Inducted_By || "",
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
      } catch (error) {
        console.error('Error fetching image:', error);
        toast.error('Error fetching image. Please try again.');
      }
    }

    const tableColumns = ["Field", "Value"];
    const tableRows = Object.entries(formData).map(([field, value]) => [
      field.toUpperCase(),
      (value || 'N/A').toString().toUpperCase(),
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
      const { uploadAadhaarFront, uploadAadhaarBack, uploadIdProof, uploadInductionDoc } = selectedLabour;

      if (!uploadAadhaarFront && !uploadIdProof && !uploadAadhaarBack && !uploadInductionDoc) {
        console.error("All document URLs are missing.");
        toast.error("No documents are available for download.");
        return;
      }

      const downloadFile = async (fileUrl, fileName) => {
        try {
          const response = await axios.get(`${baseUrl}${fileUrl}`, { responseType: 'blob' });
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error(`Error downloading ${fileName}:`, error);
          toast.error(`Error downloading ${fileName}.`);
        }
      };
      if (uploadAadhaarFront) {
        await downloadFile(uploadAadhaarFront, `Labour_${selectedLabour.id}_Aadhaar_Front.jpg`);
      } else {
        console.warn("Aadhaar Front not uploaded.");
      }

      if (uploadAadhaarBack) {
        await downloadFile(uploadAadhaarBack, `Labour_${selectedLabour.id}_Aadhaar_Back.jpg`);
      } else {
        console.warn("Aadhaar Back not uploaded.");
      }

      if (uploadIdProof) {
        await downloadFile(uploadIdProof, `Labour_${selectedLabour.id}_ID_Proof.jpg`);
      } else {
        console.warn("ID Proof not uploaded.");
      }

      if (uploadInductionDoc) {
        await downloadFile(uploadInductionDoc, `Labour_${selectedLabour.id}_Induction_Doc.jpg`);
      } else {
        console.warn("Induction Document not uploaded.");
      }

      toast.success('Uploaded documents have been downloaded successfully.');
    } catch (error) {
      console.error('Error during document download process:', error);
      toast.error('An error occurred while downloading documents. Please try again.');
    }
  };

  // Organize data into sections
  const personalDetails = {
    "Labour ID": selectedLabour?.LabourID || "",
    "Labour Ownership": selectedLabour.labourOwnership || "",
    "Title": selectedLabour.title || "",
    "Name": selectedLabour.name || "",
    "Aadhaar No": selectedLabour.aadhaarNumber || "",
    "Date of Birth": selectedLabour.dateOfBirth ? format(new Date(selectedLabour.dateOfBirth), 'dd-MM-yyyy') : "",
    "Contact No": selectedLabour.contactNumber || "",
    "Emergency Contact": selectedLabour?.emergencyContact || "",
    "Gender": selectedLabour.gender || "",
    "Date of Joining": selectedLabour.dateOfJoining ? format(new Date(selectedLabour.dateOfJoining), 'dd-MM-yyyy') : "",
    "Marital Status": selectedLabour?.Marital_Status || "",
  };

  if (selectedLabour?.labourOwnership === "Contractor") {
    personalDetails["Contractor Name"] = selectedLabour?.contractorName || "";
    personalDetails["Contractor Number"] = selectedLabour?.contractorNumber || "";
  }

  const addressDetails = {
    "Address": selectedLabour.address || "",
    "Village": selectedLabour?.village || "",
    "Pincode": selectedLabour.pincode || "",
    "District": selectedLabour?.district || "",
    "Taluka": selectedLabour.taluka || "",
    "State": selectedLabour?.state || "",
  };

  const workDetails = {
    "Project Name": selectedLabour?.projectName || "",
    "Company Name": selectedLabour?.companyName || "",
    "Department": selectedLabour?.department || "",
    "Designation": selectedLabour?.designation || "",
    "Labour Category": selectedLabour?.labourCategory || "",
    "Working Hours": selectedLabour?.workingHours || "",
    "Induction Date": selectedLabour?.Induction_Date ? format(new Date(selectedLabour.Induction_Date), 'dd-MM-yyyy') : "",
    "Induction By": selectedLabour?.Inducted_By || "",
  };

  const bankDetails = {
    "Bank Name": selectedLabour?.bankName || "",
    "Account Number": selectedLabour?.accountNumber || "",
    "IFSC Code": selectedLabour?.ifscCode || "",
  };

  const documentDetails = {
    "Induction Document": selectedLabour.uploadInductionDoc ? (
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={() => handleOpenModal(selectedLabour.uploadInductionDoc)}
        startIcon={<DescriptionIcon />}
      >
        View
      </Button>
    ) : "N/A",
    "Aadhaar Front": selectedLabour.uploadAadhaarFront ? (
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={() => handleOpenModal(selectedLabour.uploadAadhaarFront)}
        startIcon={<DescriptionIcon />}
      >
        View
      </Button>
    ) : "N/A",
    "ID Proof": selectedLabour.uploadIdProof ? (
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={() => handleOpenModal(selectedLabour.uploadIdProof)}
        startIcon={<DescriptionIcon />}
      >
        View
      </Button>
    ) : "N/A",
    "Aadhaar Back": selectedLabour.uploadAadhaarBack ? (
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={() => handleOpenModal(selectedLabour.uploadAadhaarBack)}
        startIcon={<DescriptionIcon />}
      >
        View
      </Button>
    ) : "N/A",
  };

  const renderTableSection = (details) => (
    <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
      <Table size="small">
        <TableBody>
          {Object.entries(details).map(([key, value]) => (
            <TableRow key={key} sx={{
              '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
              '&:hover': { backgroundColor: '#f0f7ff' }
            }}>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  fontWeight: 'bold',
                  width: '40%',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                {key}
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                {value || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Dialog
        open={!!selectedLabour}
        onClose={onClose}
        PaperProps={{
          className: 'custom-dialog',
          sx: { borderRadius: 2, maxWidth: '800px', width: '100%' }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#13315c',
            color: 'white',
            p: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Labour Details
          </Typography>
          <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white', backgroundColor: '#082d52' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {selectedLabour && (
          <>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5' }}>
              <Box sx={{ mr: 3 }}>
                {selectedLabour.photoSrc ? (
                  <img
                    src={selectedLabour.photoSrc}
                    alt={`${selectedLabour.name}'s Photo`}
                    style={{
                      width: '153px',
                      height: '148px',
                      borderRadius: '10px',
                      border: '3px solid rgb(117, 119, 121)'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '10px',
                      bgcolor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid rgb(120, 115, 115)'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60, color: '#757575' }} />
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'column' },
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <Box component="span" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Name:</Box> {selectedLabour.name || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <Box component="span" sx={{ fontWeight: 'bold' }}>ID:</Box> {selectedLabour.LabourID || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Designation:</Box> {selectedLabour.designation || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Contact:</Box> {selectedLabour.contactNumber || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minWidth: 'auto',
                    px: 3,
                    py: 1,
                    fontWeight: 'bold',
                  },
                  '& .Mui-selected': {
                    color: '#1976d2 !important',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1976d2',
                    height: 3,
                  }
                }}
              >
                <Tab icon={<PersonIcon />} label="Personal" iconPosition="start" />
                <Tab icon={<HomeIcon />} label="Address" iconPosition="start" />
                <Tab icon={<WorkIcon />} label="Work" iconPosition="start" />
                <Tab icon={<AccountBalanceIcon />} label="Bank" iconPosition="start" />
                <Tab icon={<DescriptionIcon />} label="Documents" iconPosition="start" />
              </Tabs>
            </Box>

            <DialogContent
              dividers
              className="modal-content"
              sx={{
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                p: 2,
                bgcolor: '#ffffff'
              }}
            >
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
                {renderTableSection(personalDetails)}
              </Box>

              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Address Information
                </Typography>
                {renderTableSection(addressDetails)}
              </Box>

              <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Work Information
                </Typography>
                {renderTableSection(workDetails)}
              </Box>

              <Box sx={{ display: tabValue === 3 ? 'block' : 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Bank Information
                </Typography>
                {renderTableSection(bankDetails)}
              </Box>

              <Box sx={{ display: tabValue === 4 ? 'block' : 'none' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Documents
                </Typography>
                {renderTableSection(documentDetails)}
              </Box>
            </DialogContent>
          </>
        )}

        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              bgcolor: '#4caf50',
              color: 'white',
              '&:hover': { bgcolor: '#388e3c' },
              mr: 2,
              px: 3,
              py: 1
            }}
            onClick={downloadFullForm}
          >
            Download Form
          </Button>
          {!hideAadhaarButton && (
            <Button
              variant="contained"
              startIcon={<DocumentScannerIcon />}
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                '&:hover': { bgcolor: '#f57c00' },
                px: 3,
                py: 1
              }}
              onClick={downloadAadhaarCard}
            >
              Download Documents
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Image Modal with Cropping Functionality */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          bgcolor: '#1976d2',
          color: 'white'
        }}>
          <Typography variant="h6">
            Document Viewer {currentDocumentType && `- ${currentDocumentType.replace('_', ' ').toUpperCase()}`}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, textAlign: 'center', minHeight: 400 }}>
          {modalImageSrc && !isCropping && (
            <>
              <img
                src={modalImageSrc}
                alt="Document"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
            </>
          )}

          {modalImageSrc && isCropping && (
            <Box sx={{ position: 'relative', width: '100%', height: 400, bgcolor: '#222' }}>
             
              <Cropper
                image={modalImageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <Box sx={{ width: 200, mx: 'auto', mb: 2 }}>
                <Typography gutterBottom color="white">Zoom</Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e, z) => setZoom(z)}
                />
                <Typography gutterBottom color="white">Rotation</Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e, value) => setRotation(value)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
          {!isCropping ? (
            <Button 
              variant="contained" 
              onClick={handleStartCrop}
              sx={{ bgcolor: '#1976d2' }}
            >
              Crop Image
            </Button>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleSaveCroppedImageToDatabase}
                startIcon={<SaveIcon />}
                disabled={isSaving}
                sx={{ minWidth: 150 }}
              >
                {isSaving ? 'Saving...' : 'Replace Original'}
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleSaveCroppedImage}
                startIcon={<DownloadIcon />}
              >
                Download Cropped
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => setIsCropping(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

ViewDetails.propTypes = {
  selectedLabour: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  hideAadhaarButton: PropTypes.bool,
  onLabourUpdate: PropTypes.func,
};

export default ViewDetails;

    
