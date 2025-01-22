




// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import './sidebar.css';
// import profileIcon2 from '../../images/curriculum-vitae.png';
// import profileIcon3 from '../../images/icons8-add-user-50 (1).png';
// import profileIcon4 from '../../images/labor.png';
// import profileIcon5 from '../../images/approval.png';
// import profileIcon6 from '../../images/approval.png';
// import VJLogo from "../../images/VJlogo-1-removebg.png";
// import { SidebarData } from '../../Data';
// import { useUser } from '../../UserContext/UserContext';
// import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

// function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar }) {
//   const { user } = useUser();
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [activeSection, setActiveSection] = useState(null);
//   const sidebarRef = useRef(null);
//   const location = useLocation();
//   const [activeSubSection, setActiveSubSection] = useState(null);

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleSubLinkClick = (subItem) => {
//     setActiveSubSection(subItem.path);
//     setActiveSection(null);
//   };

//   const handleMainSectionClick = (section) => {
//     setActiveSection(section);
//     setActiveSubSection(null);
//   };

//   const getBulletColor = (isCompleted) => {
//     return isCompleted ? '#20C305' : '#FFBF00';
//   };

//   const handleClickOutside = (event) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target) && openSidebarToggle) {
//       OpenSidebar();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [openSidebarToggle]);

//   const handleSectionClick = (section) => {
//     setActiveSection(section);
//   };

//   return (
//     <aside ref={sidebarRef} id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
//       <div className='sidebar-title'>
//         <img src={VJLogo} className="vjlogo" alt="logo" />
//         <span className='icon close_icon' onClick={OpenSidebar} style={{ marginLeft: '50px', marginRight: '30px' }}><ArrowCircleLeftIcon /></span>
//       </div>
//       <div className="menu">
//       <div className="application-section">
//         <div className="application-header" onClick={toggleCollapse}>
//           <img src={profileIcon2} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//           <span className="bullet" style={{ color: getBulletColor(
//             formStatus.kyc && formStatus.personal && formStatus.bankDetails && formStatus.project
//           ) }}>&#8226;</span>
//           <span className="mains">Application</span>
//           {isCollapsed ? <ExpandMoreIcon sx={{ color: "white", paddingLeft: '20px' }} /> : <ExpandLessIcon sx={{ color: 'white', paddingLeft: '20px' }} />}
//         </div>
//         {isCollapsed && (
//           <ul className="application-list">
//             {SidebarData.find(item => item.heading === "Application").subLinks.map((subItem, index) => (
//               <Link key={index} to={`/${subItem.path}`} className={`sidebar-link ${location.pathname === `/${subItem.path}` ? 'active-subsection' : ''}`}
//                 onClick={() => handleSubLinkClick(subItem)}>
//                 <li>
//                   <span className="bullet" style={{ color: getBulletColor(formStatus[subItem.path]) }}>&#8226;</span> {subItem.heading}
//                 </li>
//               </Link>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="other-sections">
//         {SidebarData.filter(item => (!user?.accessPages || user?.accessPages?.includes(item.heading) || item.heading === "Attendance Report" || item.heading === "Wages Report" || item.heading === "People" || item.heading === "Admin Approval" || item.heading === "Site Transfer") && item.heading !== "Application").map((item, index) => (
//           <div
//             key={index}
//             className={`profile-icon1 ${activeSection === item.heading ? 'active-section' : ''}`}
//             onClick={() => handleMainSectionClick(item.heading)}
//           >
//             <img src={
//               item.heading === "Add User" ? profileIcon3 :
//                 item.heading === "Labour Details" ? profileIcon4 :
//                   item.heading === "Project Machine" ? profileIcon5 :
//                   item.heading === "Attendance Report" ? profileIcon6 :
//                     profileIcon6
//             } alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//             <Link to={`/${item.path}`} className={`sidebar-link ${location.pathname === `/${item.path}` ? 'active-subsection' : ''}`}>
//               <span className="bullet" style={{ color: getBulletColor(formStatus[item.path]) }}>&#8226;</span>
//               <span className="mains">{item.heading}</span>
//             </Link>
//           </div>
//         ))}
//       </div>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;







import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './sidebar.css';
import profileIcon2 from '../../images/curriculum-vitae.png';
import profileIcon3 from '../../images/icons8-add-user-50 (1).png';
import profileIcon4 from '../../images/labor.png';
import profileIcon5 from '../../images/approval.png';
import profileIcon6 from '../../images/approval.png';
import VJLogo from '../../images/VJlogo-1-removebg.png';
import { SidebarData } from '../../Data';
import { useUser } from '../../UserContext/UserContext';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar }) {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [activeSubSection, setActiveSubSection] = useState(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubLinkClick = (subItem) => {
    setActiveSubSection(subItem.path);
    setActiveSection(null);
  };

  const handleMainSectionClick = (section) => {
    setActiveSection(section);
    setActiveSubSection(null);
  };

  const getBulletColor = (isCompleted) => {
    return isCompleted ? '#20C305' : '#FFBF00';
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target) && openSidebarToggle) {
      OpenSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openSidebarToggle]);

  const isSuperAdminOnly = (item) => {
    const superAdminPages = ["Attendance Report", "Wages Report", "People", "Admin Approval", "Site Transfer", "Variable Input", "Salary Register"];
    return superAdminPages.includes(item.heading) && user?.userType !== 'superadmin';
  };

  return (
    <aside ref={sidebarRef} id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <img src={VJLogo} className="vjlogo" alt="logo" />
        <span className='icon close_icon' onClick={OpenSidebar} style={{ marginLeft: '50px', marginRight: '30px' }}>
          <ArrowCircleLeftIcon />
        </span>
      </div>
      <div className="menu">
        {/* Application Section */}
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
                <Link
                  key={index}
                  to={`/${subItem.path}`}
                  className={`sidebar-link ${location.pathname === `/${subItem.path}` ? 'active-subsection' : ''}`}
                  onClick={() => handleSubLinkClick(subItem)}
                >
                  <li>
                    <span className="bullet" style={{ color: getBulletColor(formStatus[subItem.path]) }}>&#8226;</span> {subItem.heading}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>

        {/* Other Sections */}
        <div className="other-sections">
          {SidebarData.filter(item => (
            (!user?.accessPages || user?.accessPages.includes(item.heading)) &&
            item.heading !== "Application" &&
           !isSuperAdminOnly(item)
          )).map((item, index) => (
            <div
              key={index}
              className={`profile-icon1 ${activeSection === item.heading ? 'active-section' : ''}`}
              onClick={() => handleMainSectionClick(item.heading)}
            >
              <img src={
                item.heading === "Add User" ? profileIcon3 :
                item.heading === "Labour Details" ? profileIcon4 :
                item.heading === "Project Machine" ? profileIcon5 :
                item.heading === "Attendance Report" ? profileIcon6 :
                item.heading === "Wages Report" ? profileIcon6 :
                item.heading === "People" ? profileIcon6 :
                item.heading === "Admin Approval" ? profileIcon6 :
                item.heading === "Site Transfer" ? profileIcon6 :
                item.heading === "Variable Input" ? profileIcon6 :
                item.heading === "Salary Register" ? profileIcon6 :
                profileIcon6
              } alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
              <Link
                to={`/${item.path}`}
                className={`sidebar-link ${location.pathname === `/${item.path}` ? 'active-subsection' : ''}`}
              >
                <span className="bullet" style={{ color: getBulletColor(formStatus[item.path]) }}>&#8226;</span>
                <span className="mains">{item.heading}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;








// imp running this and changes in 25-07-2024

// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation  } from 'react-router-dom';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import './sidebar.css';
// import profileIcon2 from '../../images/curriculum-vitae.png';
// import profileIcon3 from '../../images/icons8-add-user-50 (1).png';
// import profileIcon4 from '../../images/labor.png';
// import profileIcon5 from '../../images/approval.png';
// import VJLogo from "../../images/VJlogo-1-removebg.png";
// import { SidebarData } from '../../Data';
// import { useUser } from '../../UserContext/UserContext';
// import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
// // import CancelIcon from '@mui/icons-material/Cancel';

// function Sidebar({ formStatus = {}, openSidebarToggle, OpenSidebar }) {
//   const { user } = useUser();
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [activeSection, setActiveSection] = useState(null);
//   const sidebarRef = useRef(null);
//   const location = useLocation();
//   const [activeSubSection, setActiveSubSection] = useState(null);
  
// // console.log('userAccessPages',user.accessPages)

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };


//   const handleSubLinkClick = (subItem) => {
//     setActiveSubSection(subItem.path);
//     setActiveSection(null); // Deactivate main section when a sublink is clicked
//   };

//   const handleMainSectionClick = (section) => {
//     setActiveSection(section);
//     setActiveSubSection(null); // Deactivate sublink when a main section is clicked
//   };

//   const getBulletColor = (isCompleted) => {
//     return isCompleted ? '#20C305' : '#FFBF00';
//   };

//   const handleClickOutside = (event) => {
//     if (sidebarRef.current && !sidebarRef.current.contains(event.target) && openSidebarToggle) {
//       OpenSidebar();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [openSidebarToggle]);

//   const handleSectionClick = (section) => {
//     setActiveSection(section);
//   };


//   return (
//     <aside ref={sidebarRef} id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
//       <div className='sidebar-title'>
//         <img src={VJLogo} className="vjlogo" alt="logo" />
//         <span className='icon close_icon' onClick={OpenSidebar} style={{ marginLeft: '50px', marginRight: '30px' }}><ArrowCircleLeftIcon/></span>
//       </div>
//       <div className="application-section">
//         <div className="application-header" onClick={toggleCollapse}>
//           <img src={profileIcon2} alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//           <span className="bullet" style={{ color: getBulletColor(
//             formStatus.kyc && formStatus.personal && formStatus.bankDetails && formStatus.project
//           ) }}>&#8226;</span>
//           <span className="mains">Application</span>
//           {isCollapsed ? <ExpandMoreIcon sx={{ color: "white", paddingLeft: '20px' }} /> : <ExpandLessIcon sx={{ color: 'white', paddingLeft: '20px' }} />}
//         </div>
//         {isCollapsed && (
//           <ul className="application-list">
//             {SidebarData.find(item => item.heading === "Application").subLinks.map((subItem, index) => (
//               <Link key={index} to={`/${subItem.path}`}   className={`sidebar-link ${location.pathname === `/${subItem.path}` ? 'active-subsection' : ''}`}
//               onClick={() => handleSubLinkClick(subItem)} >
//                 <li>
//                   <span className="bullet" style={{ color: getBulletColor(formStatus[subItem.path]) }}>&#8226;</span> {subItem.heading}
//                 </li>
//               </Link>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="other-sections">
//       {SidebarData.filter(item => (!user?.accessPages || user?.accessPages?.includes(item.heading))&& item.heading !== "Application").map((item, index) => (
//           // <div className="profile-icon1" key={index}>
//           <div
//           key={index}
//           className={`profile-icon1 ${activeSection === item.heading ? 'active-section' : ''}`}
//           onClick={() => handleMainSectionClick(item.heading)}
//         >
//             <img src={
//               item.heading === "Add User" ? profileIcon3 :
//               item.heading === "Labour Details" ? profileIcon4 :
//               item.heading === "Project Machine" ? profileIcon5 :
//               profileIcon5
//             } alt="Profile Icon" className="img-white-fill" style={{ height: "30px" }} />
//             <Link to={`/${item.path}`} className={`sidebar-link ${location.pathname === `/${item.path}` ? 'active-subsection' : ''}`}>
//               <span className="bullet" style={{ color: getBulletColor(formStatus[item.path]) }}>&#8226;</span>
//               <span className="mains">{item.heading}</span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;


