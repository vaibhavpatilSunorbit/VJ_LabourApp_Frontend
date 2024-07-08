
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
// import Loading from "../Loading/Loading"; 
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';

// const ApproveLabour = ({ refresh }) => {
//   const [approvedLabours, setApprovedLabours] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     fetchApprovedLabours();
//   }, [refresh]); 

//   const fetchApprovedLabours = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/labours/approved');
//       setApprovedLabours(response.data);
//       setLoading(false); 
//     } catch (error) {
//       console.error('Error fetching approved labours:', error);
//       setError(error.response ? error.response.data.message : 'Error fetching approved labours. Please try again.');
//       setLoading(false); 
//     }
//   };


//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };


//   return (
//     <Box  py={2} px={2} sx={{ width: isMobile ? '90vw' : 'auto' }}>
//       <Typography variant="h4" mb={3}>
//         Approved Labours
//       </Typography>

//       {loading ? (
//         <Loading /> 
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         <>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={approvedLabours.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         <TableContainer component={Paper}  sx={{
//           height: '77vh',
//           overflowX: 'auto',
//           backgroundColor: '#fff',
//           color: 'rgba(0, 0, 0, 0.87)',
//           transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
//           borderRadius: 4,
//           boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
//           width: '100%',
//         }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Sr No</TableCell>
//                 <TableCell>Name of Labour</TableCell>
//                 <TableCell>Project</TableCell>
//                 <TableCell>Department</TableCell>
//                 <TableCell>Labour Category</TableCell>
//                 <TableCell>Status</TableCell>
//                 {/* <TableCell>Action</TableCell> */}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {approvedLabours.length > 0 ? (
//                 approvedLabours.map((labour, index) => (
//                   <TableRow key={labour.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{labour.name}</TableCell>
//                     <TableCell>{labour.projectName}</TableCell>
//                     <TableCell>{labour.department}</TableCell>
//                     <TableCell>{labour.labourCategory}</TableCell>
//                     <TableCell>{labour.status}</TableCell>

//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={7}>No approved labours found.</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         </>
//       )}
//     </Box>
//   );
// };

// export default ApproveLabour;















// This is new code change 05-07-2024



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, TablePagination, Modal, Fade, Backdrop, Button } from '@mui/material';
// import Loading from "../Loading/Loading"; 
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ViewDetails from '../ViewDetails/ViewDetails';
// import {API_BASE_URL} from "../../Data"
// import SearchBar from '../SarchBar/SearchBar';

// const ApproveLabour = ({ refresh }) => {
//   const [approvedLabours, setApprovedLabours] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedLabour, setSelectedLabour] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     fetchApprovedLabours();
//   }, [refresh]); 

//   const fetchApprovedLabours = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(API_BASE_URL +`/labours/approved`);
//       setApprovedLabours(response.data);
//       setLoading(false); 
//     } catch (error) {
//       console.error('Error fetching approved labours:', error);
//       setError(error.response ? error.response.data.message : 'Error fetching approved labours. Please try again.');
//       setLoading(false); 
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

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
//       setError('Error searching. Please try again.');
//     }
//   };

//   const openPopup = async (labour) => {
//     try {
//       const response = await axios.get( API_BASE_URL + `/labours/${labour.id}`);
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


//   return (
//     <Box py={2} px={1} sx={{ width: isMobile ? '96vw' : 'auto' }}>
//       <Typography variant="h5" mb={1}>
//         Approved Labours
//       </Typography>
//       <Box ml={-1.6}>
//         <SearchBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           handleSearch={handleSearch}
//           searchResults={searchResults}
//           setSearchResults={setSearchResults}
//           className="search-bar"
//         />
//       </Box>



//       <ToastContainer />

//       {loading ? (
//         <Loading /> 
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         <>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={approvedLabours.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//           <TableContainer component={Paper} sx={{
//             height: '70vh',
//             overflowX: 'auto',
//             backgroundColor: '#fff',
//             color: 'rgba(0, 0, 0, 0.87)',
//             transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
//             borderRadius: 4,
//             boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
//             width: '100%',
//           }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Sr No</TableCell>
//                   <TableCell>Name of Labour</TableCell>
//                   <TableCell>Project</TableCell>
//                   <TableCell>Department</TableCell>
//                   <TableCell>Labour Category</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Details</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {approvedLabours.length > 0 ? (
//                   approvedLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => (
//                     <TableRow key={labour.id}>
//                       <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                       <TableCell>{labour.name}</TableCell>
//                       <TableCell>{labour.projectName}</TableCell>
//                       <TableCell>{labour.department}</TableCell>
//                       <TableCell>{labour.labourCategory}</TableCell>
//                       <TableCell>{labour.status}</TableCell>
//                       <TableCell>
//                         <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{ cursor: 'pointer' }} />
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7}>No approved labours found.</TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <Modal
//             open={isPopupOpen}
//             onClose={closePopup}
//             closeAfterTransition
//             BackdropComponent={Backdrop}
//             BackdropProps={{ timeout: 500 }}
//           >
//             <Fade in={isPopupOpen}>
//               <div className="modal">
//                 {selectedLabour && (
//                   <ViewDetails selectedLabour={selectedLabour} onClose={closePopup} />
//                 )}
//               </div>
//             </Fade>
//           </Modal>
//         </>
//       )}
//     </Box>
//   );
// };

// export default ApproveLabour;










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
import "./ApproveLabours.css";
import SearchBar from '../SarchBar/SearchBar';
import ViewDetails from '../ViewDetails/ViewDetails';
import Loading from "../Loading/Loading";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { API_BASE_URL } from "../../Data"

const ApproveLabours = ({ onApprove, departments, projectNames }) => {
  const [labours, setLabours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  // const isMobile = useMediaQuery('(max-width: 600px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchLabours();
  }, []);

  const fetchLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/labours`);
      console.log('API Response:', response.data);
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
      const response = await axios.get(API_BASE_URL + `/labours/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Error searching. Please try again.');
    }
  };



  const openPopup = async (labour) => {
    try {
      const response = await axios.get(API_BASE_URL + `/labours/${labour.id}`);
      const labourDetails = response.data;
      const projectDescription = getProjectDescription(labourDetails.projectName);
      const departmentDescription = getDepartmentDescription(labourDetails.department);

      setSelectedLabour({
        ...labourDetails,
        projectDescription,
        departmentDescription,
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

  const getDepartmentDescription = (departmentId) => {
    if (!departments || departments.length === 0) {
      return 'Unknown';
    }
    const department = departments.find(dept => dept.Id === Number(departmentId));
    return department ? department.Description : 'Unknown';
  };

  const getProjectDescription = (projectId) => {
    console.log('Projects Array:', projectNames);
    console.log('Project ID:', projectId, 'Type:', typeof projectId);

    if (!projectNames || projectNames.length === 0) {
      console.log('Projects array is empty or undefined');
      return 'Unknown';
    }

    if (projectId === undefined || projectId === null) {
      console.log('Project ID is undefined or null');
      return 'Unknown';
    }

    const project = projectNames.find(proj => {
      console.log(`Checking project: ${proj.id} === ${Number(projectId)} (Type: ${typeof proj.id})`);
      return proj.id === Number(projectId);
    });

    console.log('Found Project:', project);
    return project ? project.Business_Unit : 'Unknown';
  };



  return (
    <Box mb={1} py={0} px={1} sx={{ width: isMobile ? '95vw' : 'auto', overflowX: isMobile ? 'auto' : 'visible', }}>
      {/* <Typography variant="h5" >
        Labour Details
      </Typography> */}

      <Box ml={-1.5}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSelectLabour={handleSelectLabour}
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
          className="custom-pagination"
          rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
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
        <Table sx={{ minWidth: 800 }} >
          <TableHead >
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
              <TableCell>Name of Labour</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Labour Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredLabours
            ).map((labour, index) => (
              console.log('Labour Object:', labour),
              console.log('Labour Project ID:', labour.project_id),
              <TableRow
                key={labour.id}
                sx={{
                  '& td': {
                    padding: '12px',
                    '@media (max-width: 600px)': {
                      padding: '10px',
                    },
                  },
                }}
              >
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{labour.name}</TableCell>
                <TableCell>{getProjectDescription(labour.projectName)}</TableCell>
                <TableCell>{getDepartmentDescription(labour.department)}</TableCell>
                <TableCell>{labour.labourCategory}</TableCell>
                <TableCell>{labour.status}</TableCell>

                <TableCell>

                  < RemoveRedEyeIcon onClick={() => openPopup(labour)} />

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

export default ApproveLabours;
