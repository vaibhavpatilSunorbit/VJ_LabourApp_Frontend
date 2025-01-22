
import React from 'react'
import {BsFillBellFill,BsIconName , BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs';
 import { GrLogout } from "react-icons/gr";
//  import VJLogo from "../../images/VJlogo-1-removebg.png";
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useUser }    from '../../UserContext/UserContext';
// import './Header.css'

function Header({OpenSidebar}) {
  const navigate = useNavigate();
  const { user } = useUser();
  // console.log("User in Header:", user);
  const isMobile = window.innerWidth <= 768;
  const spanStyle = {
    marginTop: '2px',
    fontSize: isMobile ? '14px' : '14px', // Adjust the font size for mobile devices
    color: '#000',
    // marginLeft: isMobile ? '9vw' : '7vw'
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate('/');
  };

  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            {/* <img src={VJLogo} className="vjlogo" alt="logo"/> */}
            
        </div>
        <div className='header-right headericon' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent:'flex-end' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BsFillBellFill className='icon' style={{ margin: '0 10px', cursor: 'pointer' }} />
        <Tooltip title="Logout" arrow>
          <GrLogout
            className='icon'
            onClick={handleLogout}
            style={{ margin: '0 10px', cursor: 'pointer' }}
          />
        </Tooltip>
        <BsPersonCircle className='icon' style={{ margin: '0 12px', cursor: 'pointer' }} />
      </div>
      <span style={spanStyle}>
        {user ? user.name : "Guest"}
      </span>
    </div>

    </header>
  )
}

export default Header;















// src/components/Header/Header.jsx

// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from '../../UserContext/UserContext';

// // MUI Components
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';
// import Badge from '@mui/material/Badge';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import InputBase from '@mui/material/InputBase';
// import CircularProgress from '@mui/material/CircularProgress';
// import { styled, alpha } from '@mui/material/styles';

// // MUI Icons
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import LogoutIcon from '@mui/icons-material/Logout';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import SearchIcon from '@mui/icons-material/Search';

// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: theme.spacing(3),
//   marginRight: theme.spacing(3),
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(6),
//     marginRight: theme.spacing(6),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   width: '100%',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1.2, 1, 1.2, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     paddingRight: theme.spacing(4),
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '30ch',
//     },
//   },
// }));

// const Header = ({
//   OpenSidebar,
//   searchQuery,
//   setSearchQuery,
//   handleSearch,
//   searchResults,
//   setSearchResults,
//   handleSelectLabour,
//   showResults,
// }) => {
//   const navigate = useNavigate();
//   const { user } = useUser();

//   // State for user menu
//   const [anchorEl, setAnchorEl] = useState(null);
//   const isMenuOpen = Boolean(anchorEl);

//   // State for loading indicator in search
//   const [isLoading, setIsLoading] = useState(false);
//   const [debounceTimer, setDebounceTimer] = useState(null);

//   // Handlers for user menu
//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // Handler for logout
//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Clear token from localStorage
//     navigate('/'); // Redirect to home or login page
//   };

//   // Auto-search with debouncing
//   useEffect(() => {
//     if (typeof searchQuery !== 'string' || searchQuery.trim() === '') {
//       // setSearchResults([]);
//       return;
//     }

//     setIsLoading(true);

//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }

//     const timer = setTimeout(() => {
//       handleSearch(searchQuery)
//         .then((results) => {
//           setSearchResults(results);
//         })
//         .catch((error) => {
//           console.error('Search error:', error);
//           setSearchResults([]);
//         })
//         .finally(() => setIsLoading(false));
//     }, 500); // 500ms debounce

//     setDebounceTimer(timer);

//     // Cleanup on unmount or when searchQuery changes
//     return () => clearTimeout(timer);
//   }, [searchQuery, handleSearch, setSearchResults, debounceTimer]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }
//     setIsLoading(true);
//     handleSearch(searchQuery)
//       .then((results) => {
//         setSearchResults(results);
//       })
//       .catch((error) => {
//         console.error('Search error:', error);
//         setSearchResults([]);
//       })
//       .finally(() => setIsLoading(false));
//   };

//   // Menu ID
//   const menuId = 'primary-search-account-menu';

//   // Render Menu
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       {/* You can add more menu items here */}
//       <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleLogout}>
//         <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
//         Logout
//       </MenuItem>
//     </Menu>
//   );

//   return (
//     <Box sx={{ flexGrow: 1, position: 'relative' }}>
//       <AppBar position="static">
//         <Toolbar>
//           {/* Left Side: Menu Icon and Optional Logo */}
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="open sidebar"
//               onClick={OpenSidebar}
//               sx={{ mr: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//             {/* Optional Logo */}
//             {/* <Box component="img" src={VJLogo} alt="Logo" sx={{ height: 40 }} /> */}
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               sx={{ display: { xs: 'none', sm: 'block' } }}
//             >
//               VJ App
//             </Typography>
//           </Box>

//           {/* Search Bar */}
//           <Box sx={{ flexGrow: 1 }}>
//             <form onSubmit={handleSubmit}>
//               <Search>
//                 <SearchIconWrapper>
//                   <SearchIcon />
//                 </SearchIconWrapper>
//                 <StyledInputBase
//                   placeholder="Search by Name, Labour ID, Department, Pay Structure, or Added By"
//                   inputProps={{ 'aria-label': 'search' }}
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     if (e.target.value.trim() === '') {
//                       setSearchResults([]);
//                     }
//                   }}
//                 />
//                 {isLoading && (
//                   <CircularProgress
//                     size={24}
//                     sx={{
//                       position: 'absolute',
//                       right: (theme) => theme.spacing(1),
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       color: 'inherit',
//                     }}
//                   />
//                 )}
//               </Search>
//             </form>
//           </Box>

//           {/* Right Side: Notifications, Logout, User Icon, and Username */}
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* Notifications */}
//             <IconButton size="large" aria-label="show new notifications" color="inherit">
//               <Badge badgeContent={4} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>

//             {/* Logout */}
//             <Tooltip title="Logout" arrow>
//               <IconButton
//                 size="large"
//                 color="inherit"
//                 onClick={handleLogout}
//                 sx={{ ml: 1 }}
//               >
//                 <LogoutIcon />
//               </IconButton>
//             </Tooltip>

//             {/* User Account */}
//             <Tooltip title="Account settings" arrow>
//               <IconButton
//                 size="large"
//                 edge="end"
//                 aria-label="account of current user"
//                 aria-controls={menuId}
//                 aria-haspopup="true"
//                 onClick={handleProfileMenuOpen}
//                 color="inherit"
//                 sx={{ ml: 1 }}
//               >
//                 <AccountCircle />
//               </IconButton>
//             </Tooltip>

//             {/* Username */}
//             <Typography variant="body1" sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
//               {user ? user.name : 'Guest'}
//             </Typography>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       {renderMenu}

//       {/* Search Results Dropdown */}
//       {showResults && searchResults.length > 0 && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '64px', // Height of AppBar
//             left: '50%',
//             transform: 'translateX(-50%)',
//             width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
//             bgcolor: 'background.paper',
//             boxShadow: 3,
//             borderRadius: 1,
//             zIndex: 10,
//             maxHeight: '400px',
//             overflowY: 'auto',
//           }}
//         >
//           <Box sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Search Results
//             </Typography>
//             <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
//               {searchResults.map((result) => (
//                 <Box
//                   key={result.id}
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     p: 1,
//                     borderBottom: '1px solid #e0e0e0',
//                     '&:hover': {
//                       backgroundColor: '#f5f5f5',
//                       cursor: 'pointer',
//                     },
//                   }}
//                   onClick={() => handleSelectLabour(result)}
//                 >
//                   <Box>
//                     <Typography variant="subtitle1">
//                       {result.LabourID} - {result.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Company: {result.companyName} | Department: {result.departmentName}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Pay Structure: {result.PayStructure} | Added By: {result.payAddedBy}
//                     </Typography>
//                   </Box>
//                   {/* Optional: Add an icon or button if needed */}
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </Box>
//       )}

//       {/* No Results Found */}
//       {showResults && searchResults.length === 0 && !isLoading && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '64px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
//             bgcolor: 'background.paper',
//             boxShadow: 3,
//             borderRadius: 1,
//             zIndex: 10,
//             p: 2,
//             textAlign: 'center',
//           }}
//         >
//           <Typography variant="body1" color="text.secondary">
//             No results found.
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// // Define PropTypes
// Header.propTypes = {
//   OpenSidebar: PropTypes.func.isRequired,
//   searchQuery: PropTypes.string.isRequired,
//   setSearchQuery: PropTypes.func.isRequired,
//   handleSearch: PropTypes.func.isRequired,
//   searchResults: PropTypes.array.isRequired,
//   setSearchResults: PropTypes.func.isRequired,
//   handleSelectLabour: PropTypes.func.isRequired,
//   showResults: PropTypes.bool.isRequired,
// };

// // Define Default Props
// Header.defaultProps = {
//   searchResults: [],
// };

// export default Header;
