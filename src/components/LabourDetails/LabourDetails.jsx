
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Box,
//   Typography,
//   Modal,
//   Backdrop,
//   Fade,
//   TablePagination
// } from '@mui/material';
// import { toast } from 'react-toastify';
// import "./LabourDetails.css";
// import SearchBar from '../SarchBar/SearchBar';
// import ViewDetails from '../ViewDetails/ViewDetails';
// import Loading from "../Loading/Loading";

// const LabourDetails = ({ onApprove }) => {
//   const [labours, setLabours] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedLabour, setSelectedLabour] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5); 

//   useEffect(() => {
//     fetchLabours();
//   }, []);

//   const fetchLabours = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/labours');
//       setLabours(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching labours:', error);
//       setError('Error fetching labours. Please try again.');
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }
//     try {
//       const response = await axios.get(`http://localhost:5000/labours/search?q=${searchQuery}`);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Error searching:', error);
//       setError('Error searching. Please try again.');
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/labours/approve/${id}`);
//       if (response.data.success) {
//         // Update the local state to reflect the approval
//         setLabours(prevLabours =>
//           prevLabours.map(labour =>
//             labour.id === id ? { ...labour, status: 'Approved', isApproved: 1 } : labour
//           )
//         );
//         toast.success('Labour approved successfully.');
//         onApprove(); 
//       } else {
//         toast.error('Failed to approve labour. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error approving labour:', error);
//       toast.error('Error approving labour. Please try again.');
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:5000/labours/reject/${id}`);
//       if (response.data.success) {
//         // Update the local state to reflect the rejection
//         setLabours(prevLabours =>
//           prevLabours.map(labour =>
//             labour.id === id ? { ...labour, status: 'Rejected', isApproved: 2 } : labour
//           )
//         );
//         toast.success('Labour rejected successfully.');
//       } else {
//         toast.error('Failed to reject labour. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error rejecting labour:', error);
//       toast.error('Error rejecting labour. Please try again.');
//     }
//   };

//   const openPopup = async (labour) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/labours/${labour.id}`);
//       setSelectedLabour(response.data);
//       setIsPopupOpen(true);
//     } catch (error) {
//       console.error('Error fetching labour details:', error);
//       toast.error('Error fetching labour details. Please try again.');
//     }
//   };

//   const closePopup = () => {
//     setSelectedLabour(null);
//     setIsPopupOpen(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); 
//   };

//   const displayLabours = searchResults.length > 0 ? searchResults : labours;

//   return (
//     <Box px={5} py={2}>
//       <Typography variant="h4" mb={3}>
//         Labour Details
//       </Typography>

//       <SearchBar
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         handleSearch={handleSearch}
//       />
//       {loading && <Loading />}
//       <TableContainer component={Paper} mt={3}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr No</TableCell>
//               <TableCell>Name of Labour</TableCell>
//               <TableCell>Project</TableCell>
//               <TableCell>Department</TableCell>
//               <TableCell>Labour Category</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Action</TableCell>
//               <TableCell>Details</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(rowsPerPage > 0
//               ? displayLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               : displayLabours
//             ).map((labour, index) => (
//               <TableRow key={labour.id}>
//                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                 <TableCell>{labour.name}</TableCell>
//                 <TableCell>{labour.projectName}</TableCell>
//                 <TableCell>{labour.department}</TableCell>
//                 <TableCell>{labour.labourCategory}</TableCell>
//                 <TableCell>{labour.status}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: '#EFE6F7', 
//                       color: '#8236BC',
//                       marginRight: '10px',
//                       '&:hover': {
//                         backgroundColor: '#bfa7d7',
//                       },
//                     }}
//                     onClick={() => handleApprove(labour.id)}
//                     style={{ marginRight: '10px' }}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: '#fce4ec',
//                       color: 'black', 
//                       '&:hover': {
//                         backgroundColor: '#f8bbd0', 
//                       },
//                     }}
//                     onClick={() => handleReject(labour.id)}
//                   >
//                     Reject
//                   </Button>
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{
//                       borderColor: '#2196f3', 
//                       color: '#2196f3',
//                       '&:hover': {
//                         borderColor: '#1976d2', 
//                         backgroundColor: 'rgba(33, 150, 243, 0.04)', 
//                       },
//                     }}
//                     onClick={() => openPopup(labour)}
//                   >
//                     View Details
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
//         component="div"
//         count={displayLabours.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Modal
//         open={isPopupOpen}
//         onClose={closePopup}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{ timeout: 500 }}
//       >
//         <Fade in={isPopupOpen}>
//           <div className="modal">
//             {selectedLabour && (
//               <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
//             )}
//           </div>
//         </Fade>
//       </Modal>
//     </Box>
//   );
// };

// export default LabourDetails;





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
  Tab
} from '@mui/material';
import { toast } from 'react-toastify';
import "./LabourDetails.css";
import SearchBar from '../SarchBar/SearchBar';
import ViewDetails from '../ViewDetails/ViewDetails';
import Loading from "../Loading/Loading";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const LabourDetails = ({ onApprove }) => {
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchLabours();
  }, []);

  const fetchLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/labours');
      setLabours(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching labours:', error);
      setError('Error fetching labours. Please try again.');
      setLoading(false);
    }
  };

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
      setError('Error searching. Please try again.');
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/labours/approve/${id}`);
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, status: 'Approved', isApproved: 1 } : labour
          )
        );
        toast.success('Labour approved successfully.');
        onApprove();
      } else {
        toast.error('Failed to approve labour. Please try again.');
      }
    } catch (error) {
      console.error('Error approving labour:', error);
      toast.error('Error approving labour. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/labours/reject/${id}`);
      if (response.data.success) {
        setLabours(prevLabours =>
          prevLabours.map(labour =>
            labour.id === id ? { ...labour, status: 'Rejected', isApproved: 2 } : labour
          )
        );
        toast.success('Labour rejected successfully.');
      } else {
        toast.error('Failed to reject labour. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting labour:', error);
      toast.error('Error rejecting labour. Please try again.');
    }
  };

  const openPopup = async (labour) => {
    try {
      const response = await axios.get(`http://localhost:5000/labours/${labour.id}`);
      setSelectedLabour(response.data);
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

  const displayLabours = searchResults.length > 0 ? searchResults : labours;

  const filteredLabours = displayLabours.filter(labour => {
    if (tabValue === 0) {
      return labour.status === 'Pending';
    } else if (tabValue === 1) {
      return labour.status === 'Approved';
    } else {
      return labour.status === 'Rejected';
    }
  });

  return (
    <Box py={2} pl={3} pr={1} sx={{ width: isMobile ? '87vw' : 'auto' }}>
      <Typography variant="h4" mb={3}>
        Labour Details
      </Typography>

      <Box ml={-4}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
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
  <TablePagination
    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
    count={filteredLabours.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
</Box>

    

      <TableContainer component={Paper} sx={{ mb: 3, overflowX: 'auto',  borderRadius: 2,
    boxShadow: 3,maxHeight: 'calc(62vh - 64px)', '&::-webkit-scrollbar': {
      width: '8px',},'&::-webkit-scrollbar-track': {backgroundColor: '#f1f1f1',
    },'&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px',},}}>
        <Table sx={{ minWidth: 800,}}>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Name of Labour</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Labour Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredLabours
            ).map((labour, index) => (
              <TableRow key={labour.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{labour.name}</TableCell>
                <TableCell>{labour.projectName}</TableCell>
                <TableCell>{labour.department}</TableCell>
                <TableCell>{labour.labourCategory}</TableCell>
                <TableCell>{labour.status}</TableCell>
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
                        onClick={() => handleApprove(labour.id)}
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
                        onClick={() => handleReject(labour.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {labour.status === 'Approved' && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: 'rgb(255, 229, 229)',
                        color: 'rgb(255, 100, 100)',
                        width: '100px',
                        '&:hover': {
                          backgroundColor: 'rgb(255, 229, 229)',
                        },
                      }}
                      onClick={() => handleReject(labour.id)}
                    >
                      Reject
                    </Button>
                  )}
                  {labour.status === 'Rejected' && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: 'rgb(229, 255, 225)',
                        color: 'rgb(43, 217, 144) ',
                        '&:hover': {
                          backgroundColor: 'rgb(229, 255, 225)',
                        },
                      }}
                      onClick={() => handleApprove(labour.id)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {/* <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#2196f3',
                      color: '#2196f3',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                      },
                    }}
                    onClick={() => openPopup(labour)}
                  > */}
                  < RemoveRedEyeIcon  onClick={() => openPopup(labour)}/>
                  {/* </Button> */}
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
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isPopupOpen}>
          <div className="modal">
            {selectedLabour && (
              <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
            )}
          </div>
        </Fade>
      </Modal>
    </Box>
  );
};

export default LabourDetails;
