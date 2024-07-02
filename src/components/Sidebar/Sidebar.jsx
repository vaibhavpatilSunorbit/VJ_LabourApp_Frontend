

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import './sidebar.css';
// import profileIcon from '../../images/icons8-kyc-64.png';
// import profileIcon2 from '../../images/curriculum-vitae.png';
// import profileIcon3 from '../../images/icons8-add-user-50 (1).png';
// import profileIcon4 from '../../images/labor.png';
// import profileIcon5 from '../../images/approval.png';
// import Avatar from '@mui/material/Avatar';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import VJLogo from "../../images/VJlogo-1-removebg.png";
// import CloseIcon from '@mui/icons-material/Close';
// import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

// function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar, userRole }) {
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const getBulletColor = (isCompleted) => {
//     return isCompleted ? '#20C305' : '#FFBF00';
//   };

 

//   return (
//     <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
//       <div className='sidebar-title'>
//         {/* <div className='sidebar-brand'> */}
//           <img src={VJLogo} className="vjlogo" alt="logo" />
//           <span className='icon close_icon' onClick={OpenSidebar} style={{marginLeft:'55px',marginRight:'30px'}}><ArrowCircleLeftIcon/></span>
//         {/* </div> */}
//         {/* <span className='icon close_icon' onClick={OpenSidebar}>X</span> */}
//       </div>


//       <div className="application-section ">
//         <div className="application-header" onClick={toggleCollapse}>
//           <img src={profileIcon2} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//           <span className="bullet" style={{ color: getBulletColor(formStatus.kyc && formStatus.personal && formStatus.bankDetails && formStatus.project) }}>&#8226;</span>
//           <span className="mains">Application</span>
//           {isCollapsed ? <ExpandMoreIcon sx={{ color: "white", paddingLeft: '20px' }} /> : <ExpandLessIcon sx={{ color: 'white', paddingLeft: '20px' }} />}
//         </div>
//         {isCollapsed && (
//           <ul className="application-list">
//             <Link to="/kyc" className="sidebar-link">
//               <li>
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span> Kyc
//           {/* <span className="mains">KYC</span> */}
//               </li>
//             </Link>
//             <Link to="/personal" className="sidebar-link" >
//               <li>
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.personal) }}>&#8226;</span> Personal
//             </li>
//             </Link>
//             <Link to="/bankDetails" className="sidebar-link">
//               <li>
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.bankDetails) }}>&#8226;</span> Bank Details
//             </li>
//             </Link>

//             <Link to="/project" className="sidebar-link">
//               <li>
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.project) }}>&#8226;</span> Project
//             </li>
//             </Link>
//           </ul>
//         )}
//       </div>

//       <div className="profile-icon1">
//         <img src={profileIcon3} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//         <Link to="/addUser" className="sidebar-link">
//           <span className="bullet" ></span>
//           <span className="mains">Add User</span>
//         </Link>
//       </div>

//       <div className="profile-icon1">
//         <img src={profileIcon4} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//         <Link to="/labourDetails" className="sidebar-link">
//           <span className="bullet" ></span>
//           <span className="mains">Labour Details</span>
//         </Link>
//       </div>

//       <div className="profile-icon1">
//         <img src={profileIcon5} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//         <Link to="/approveLabours" className="sidebar-link">
//           <span className="bullet" ></span>
//           <span className="mains">Approve Labours</span>
//         </Link>
//       </div>


//     </aside>
//   );
// }

// export default Sidebar;































// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import './sidebar.css';
// import profileIcon from '../../images/icons8-kyc-64.png';
// import profileIcon2 from '../../images/curriculum-vitae.png';
// import profileIcon3 from '../../images/icons8-add-user-50 (1).png';
// import profileIcon4 from '../../images/labor.png';
// import profileIcon5 from '../../images/approval.png';
// import Avatar from '@mui/material/Avatar';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import VJLogo from "../../images/VJlogo-1-removebg.png";
// import CloseIcon from '@mui/icons-material/Close';

// function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar, userRole }) {
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const location = useLocation(); // Get the current location

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const getBulletColor = (path, isCompleted) => {
//     const isSelected = location.pathname === path; // Check if the path matches the current location
//     return isSelected ? '#0000FF' : isCompleted ? '#20C305' : '#FFBF00'; // Change to blue if selected
//   };

//   return (
//     <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
//       <div className='sidebar-title'>
//         <img src={VJLogo} className="vjlogo" alt="logo" />
//         <span className='icon close_icon' onClick={OpenSidebar} style={{marginLeft:'55px',marginRight:'30px'}}>X</span>
//       </div>

//       <div className="application-section ">
//         <div className="application-header" onClick={toggleCollapse}>
//           <img src={profileIcon2} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//           <span className="bullet" style={{ color: getBulletColor('/application', formStatus.kyc && formStatus.personal && formStatus.bankDetails && formStatus.project) }}>&#8226;</span>
//           <span className="mains">Application</span>
//           {isCollapsed ? <ExpandMoreIcon sx={{ color: "white", paddingLeft: '20px' }} /> : <ExpandLessIcon sx={{ color: 'white', paddingLeft: '20px' }} />}
//         </div>
//         {isCollapsed && (
          // <ul className="application-list">
          //   <Link to="/kyc" className="sidebar-link">
          //     <li>
          //       <span className="bullet" style={{ color: getBulletColor('/kyc', formStatus.kyc) }}>&#8226;</span> Kyc
          //     </li>
          //   </Link>
          //   <Link to="/personal" className="sidebar-link">
          //     <li>
          //       <span className="bullet" style={{ color: getBulletColor('/personal', formStatus.personal) }}>&#8226;</span> Personal
          //     </li>
          //   </Link>
          //   <Link to="/bankDetails" className="sidebar-link">
          //     <li>
          //       <span className="bullet" style={{ color: getBulletColor('/bankDetails', formStatus.bankDetails) }}>&#8226;</span> Bank Details
          //     </li>
          //   </Link>
          //   <Link to="/project" className="sidebar-link">
          //     <li>
          //       <span className="bullet" style={{ color: getBulletColor('/project', formStatus.project) }}>&#8226;</span> Project
          //     </li>
          //   </Link>
          // </ul>
//         )}
//       </div>

//       <div className="profile-icon1">
//         <img src={profileIcon3} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//         <Link to="/addUser" className="sidebar-link">
//           <span className="bullet" style={{ color: getBulletColor('/addUser', formStatus.kyc) }}>&#8226;</span>
//           <span className="mains">Add User</span>
//         </Link>
//       </div>

//       <div className="profile-icon1">
//         <img src={profileIcon4} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//         <Link to="/labourDetails" className="sidebar-link">
//           <span className="bullet" style={{ color: getBulletColor('/labourDetails', formStatus.kyc) }}>&#8226;</span>
//           <span className="mains">Labour Details</span>
//         </Link>
//       </div>

//       <div className="profile-icon1">
//         <img src={profileIcon5} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//         <Link to="/approveLabours" className="sidebar-link">
//           <span className="bullet" style={{ color: getBulletColor('/approveLabours', formStatus.kyc) }}>&#8226;</span>
//           <span className="mains">Approve Labours</span>
//         </Link>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;


























import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './sidebar.css';
import profileIcon2 from '../../images/curriculum-vitae.png';
import profileIcon3 from '../../images/icons8-add-user-50 (1).png';
import profileIcon4 from '../../images/labor.png';
import profileIcon5 from '../../images/approval.png';
import VJLogo from "../../images/VJlogo-1-removebg.png";
import { SidebarData } from '../../Data';
import { useUser } from '../../UserContext/UserContext';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
// import CancelIcon from '@mui/icons-material/Cancel';

function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar }) {
  const { userAccessPages } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getBulletColor = (isCompleted) => {
    return isCompleted ? '#20C305' : '#FFBF00';
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <img src={VJLogo} className="vjlogo" alt="logo" />
        <span className='icon close_icon' onClick={OpenSidebar} style={{ marginLeft: '55px', marginRight: '30px' }}><ArrowCircleLeftIcon/></span>
      </div>
      <div className="application-section">
        <div className="application-header" onClick={toggleCollapse}>
          <img src={profileIcon2} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
          <span className="bullet" style={{ color: getBulletColor(
            formStatus.kyc && formStatus.personal && formStatus.bankDetails && formStatus.project
          ) }}>&#8226;</span>
          <span className="mains">Application</span>
          {isCollapsed ? <ExpandMoreIcon sx={{ color: "white", paddingLeft: '20px' }} /> : <ExpandLessIcon sx={{ color: 'white', paddingLeft: '20px' }} />}
        </div>
        {isCollapsed && (
          <ul className="application-list">
            {SidebarData.find(item => item.heading === "Application").subLinks.map((subItem, index) => (
              <Link key={index} to={`/${subItem.path}`} className="sidebar-link">
                <li>
                  <span className="bullet" style={{ color: getBulletColor(formStatus[subItem.path]) }}>&#8226;</span> {subItem.heading}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>

      <div className="other-sections">
        {SidebarData.filter(item => userAccessPages.includes(item.heading) && item.heading !== "Application").map((item, index) => (
          <div className="profile-icon1" key={index}>
            <img src={
              item.heading === "Add User" ? profileIcon3 :
              item.heading === "Labour Details" ? profileIcon4 :
              item.heading === "Approve Labours" ? profileIcon5 :
              profileIcon5
            } alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
            <Link to={`/${item.path}`} className="sidebar-link">
              <span className="bullet" style={{ color: getBulletColor(formStatus[item.path]) }}>&#8226;</span>
              <span className="mains">{item.heading}</span>
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

































// import React, { useState } from 'react';
// import { Link, matchRoutes } from 'react-router-dom';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import './sidebar.css';

// function Sidebar({ formStatus }) {
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const getBulletColor = (isCompleted) => {
//     return isCompleted ? '#20C305' : '#FFBF00';
//   };

//   return (
//     <div className="sidebar">
//       <div className="stages">
//         <label>STAGES</label>
//       </div>
//       <div className="profile-section">
//         <div className="profile-icon">
//           <PersonOutlineIcon />
//           <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span>
//         </div>
//         <Link to="/kyc" className="sidebar-link">
//           <span className="mains">KYC</span>
//         </Link>
//       </div>
//       <div className="application-section">
//         <div className="application-header" onClick={toggleCollapse}>
//           <EditNoteIcon />         
//           <span className="bullet" style={{ marginRight:"21px", color: getBulletColor(formStatus.personal && formStatus.bankDetails && formStatus.project) }}>&#8226;</span>
//           <span className="mains" >Application</span>
//           {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
//         </div>
//         {!isCollapsed && (
//           <ul className="application-list">
//             <li>
//               <Link to="/personal" className="sidebar-link">
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.personal) }}>&#8226;</span> Personal
//               </Link>
//             </li>
//             <li>
//               <Link to="/bankDetails" className="sidebar-link">
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.bankDetails) }}>&#8226;</span> Bank Details
//               </Link>
//             </li>
//             <li>
//               <Link to="/project" className="sidebar-link">
//                 <span className="bullet" style={{ color: getBulletColor(formStatus.project) }}>&#8226;</span> Project
//               </Link>
//             </li>
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;






