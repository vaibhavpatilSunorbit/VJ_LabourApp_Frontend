

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './sidebar.css';
import profileIcon from '../../images/icons8-kyc-64.png';
import profileIcon2 from '../../images/icons8-fill-in-form-48.png';
import profileIcon3 from '../../images/icons8-voter-64.png';
import profileIcon4 from '../../images/icons8-form-64.png';
import profileIcon5 from '../../images/icons8-approved-50.png';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar }) {
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
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <div className="profile-icon">
        <img src={profileIcon} alt="Profile Icon" style={{ color: "white", height: "30px" }} />
        <Link to="/kyc" className="sidebar-link">
          <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span>
          <span className="mains">KYC</span>
        </Link>
      </div>

      <div className="application-section">
        <div className="application-header" onClick={toggleCollapse}>
          <img src={profileIcon2} alt="Profile Icon" style={{ color: "white", height: "30px" }} />
          <span className="bullet" style={{ color: getBulletColor(formStatus.personal && formStatus.bankDetails && formStatus.project) }}>&#8226;</span>
          <span className="mains">Application</span>
          {isCollapsed ? <ExpandMoreIcon sx={{ color: "white", paddingLeft: '20px' }} /> : <ExpandLessIcon sx={{ color: 'white', paddingLeft: '20px' }} />}
        </div>
        {!isCollapsed && (
          <ul className="application-list">
            <li>
              <Link to="/personal" className="sidebar-link">
                <span className="bullet" style={{ color: getBulletColor(formStatus.personal) }}>&#8226;</span> Personal
              </Link>
            </li>
            <li>
              <Link to="/bankDetails" className="sidebar-link">
                <span className="bullet" style={{ color: getBulletColor(formStatus.bankDetails) }}>&#8226;</span> Bank Details
              </Link>
            </li>
            <li>
              <Link to="/project" className="sidebar-link">
                <span className="bullet" style={{ color: getBulletColor(formStatus.project) }}>&#8226;</span> Project
              </Link>
            </li>
          </ul>
        )}
      </div>

      <div className="profile-icon1">
        <img src={profileIcon3} alt="Profile Icon" style={{ color: "white", height: "30px" }} />
        <Link to="/addUser" className="sidebar-link">
          <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span>
          <span className="mains">Add User</span>
        </Link>
      </div>

      <div className="profile-icon1">
        <img src={profileIcon4} alt="Profile Icon" style={{ color: "white", height: "30px" }} />
        <Link to="/labourDetails" className="sidebar-link">
          <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span>
          <span className="mains">Labour Details</span>
        </Link>
      </div>

      <div className="profile-icon1">
        <img src={profileIcon5} alt="Profile Icon" style={{ color: "white", height: "30px" }} />
        <Link to="/approveLabours" className="sidebar-link">
          <span className="bullet" style={{ color: getBulletColor(formStatus.kyc) }}>&#8226;</span>
          <span className="mains">Approve Labours</span>
        </Link>
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






