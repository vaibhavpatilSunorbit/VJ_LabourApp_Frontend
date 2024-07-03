
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















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, TablePagination, Modal, Fade, Backdrop, Button } from '@mui/material';
import Loading from "../Loading/Loading"; 
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewDetails from '../ViewDetails/ViewDetails';
import {API_BASE_URL} from "../../Data"
import SearchBar from '../SarchBar/SearchBar';

const ApproveLabour = ({ refresh }) => {
  const [approvedLabours, setApprovedLabours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchApprovedLabours();
  }, [refresh]); 

  const fetchApprovedLabours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL +`/labours/approved`);
      setApprovedLabours(response.data);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching approved labours:', error);
      setError(error.response ? error.response.data.message : 'Error fetching approved labours. Please try again.');
      setLoading(false); 
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      const response = await axios.get( API_BASE_URL + `/labours/${labour.id}`);
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

  
  return (
    <Box py={2} px={1} sx={{ width: isMobile ? '96vw' : 'auto' }}>
      <Typography variant="h5" mb={1}>
        Approved Labours
      </Typography>
      <Box ml={-1.6}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          className="search-bar"
        />
      </Box>



      <ToastContainer />

      {loading ? (
        <Loading /> 
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={approvedLabours.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <TableContainer component={Paper} sx={{
            height: '70vh',
            overflowX: 'auto',
            backgroundColor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            borderRadius: 4,
            boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
            width: '100%',
          }}>
            <Table>
              <TableHead>
                <TableRow>
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
                {approvedLabours.length > 0 ? (
                  approvedLabours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((labour, index) => (
                    <TableRow key={labour.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{labour.name}</TableCell>
                      <TableCell>{labour.projectName}</TableCell>
                      <TableCell>{labour.department}</TableCell>
                      <TableCell>{labour.labourCategory}</TableCell>
                      <TableCell>{labour.status}</TableCell>
                      <TableCell>
                        <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{ cursor: 'pointer' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>No approved labours found.</TableCell>
                  </TableRow>
                )}
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
        </>
      )}
    </Box>
  );
};

export default ApproveLabour;







