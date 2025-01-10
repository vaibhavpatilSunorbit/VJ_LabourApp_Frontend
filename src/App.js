import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import OnboardingForm from './components/OnboardingForm/OnboardingForm';
import AddUser from "./components/AddUser/AddUser";
import LabourDetails from "./components/LabourDetails/LabourDetails";
import ApproveLabours from "./components/ApproveLabours/ApproveLabours";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import axios from 'axios';
import { API_BASE_URL } from "./Data";
import './App.css';
import EditLabour from './EditLabour/EditLabour';
import ProtectedRoute from './components/ProtectedRoutes';
import AttendanceReport from './components/AttendanceReport/AttendanceReport';
import WagesReport from './components/WagesReport/WagesReport';
import PeopleReport from './components/PeopleReport/PeopleReport';
import PeopleEditDetails from './components/PeopleEditDetails/PeopleEditDetails';
import AdminApproval from './components/AdminApproval/AdminApproval';
import AdminAttendanceApproval from './components/AdminApproval/AdminAttedanceApproval';
import SiteTransfer from './components/SiteTransfer/SiteTransfer';
import SiteTransferApproval from './components/AdminApproval/SiteTransferApproval/SiteTransferApproval';
import WagesApproval from './components/AdminApproval/WagesApproval/WagesApproval'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [approvedLabours, setApprovedLabours] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [formStatus, setFormStatus] = useState({
    kyc: false,
    personal: false,
    bankDetails: false,
    project: false
  });

  const [departments, setDepartments] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  useEffect(() => {
    const fetchDepartmentsAndProjects = async () => {
      try {
        const departmentsRes = await axios.get(API_BASE_URL + '/api/departments');
        setDepartments(departmentsRes.data);

        const projectsRes = await axios.get(API_BASE_URL + '/api/project-names');
        setProjectNames(projectsRes.data);
      } catch (err) {
        console.error('Error fetching departments or projects:', err);
      }
    };

    fetchDepartmentsAndProjects();
  }, []);

  const handleApprove = () => {
    setRefresh(prev => !prev);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleFormSubmit = (formType, data) => {
    if (formType === 'approveLabours') {
      setApprovedLabours([...approvedLabours, data]); 
    }
    setFormStatus((prevStatus) => ({
      ...prevStatus,
      [formType]: true
    }));
  };

  return (
    <Router>
      <div className='grid-container'>
        <Routes>
          {/* Route for Login */}
          <Route path="/" element={<Login />} />
          
          {/* Protected Routes with Header and Sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/*"
              element={
                <>
                  <Header OpenSidebar={OpenSidebar} />
                  <Sidebar formStatus={formStatus} openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/kyc" element={<OnboardingForm formType="kyc" onFormSubmit={handleFormSubmit} />} />
                    <Route path="/personal" element={<OnboardingForm formType="personal" onFormSubmit={handleFormSubmit} />} />
                    <Route path="/project" element={<OnboardingForm formType="project" onFormSubmit={handleFormSubmit} />} />
                    <Route path="/bankDetails" element={<OnboardingForm formType="bankDetails" onFormSubmit={handleFormSubmit} />} />
                    <Route path="/labourDetails" element={<LabourDetails departments={departments} projectNames={projectNames} onFormSubmit={handleFormSubmit} onApprove={handleApprove} />} />
                    <Route path="/approveLabours" element={<ApproveLabours refresh={refresh} departments={departments} projectNames={projectNames}/>} />
                    <Route path="/addUser" element={<AddUser onFormSubmit={handleFormSubmit} />} />
                    <Route path="/edit-labour" element={<EditLabour />} />
                    <Route path="/attendanceReport" element={<AttendanceReport onFormSubmit={handleFormSubmit} />} />
                    <Route path="/wagesReport" element={<WagesReport onFormSubmit={handleFormSubmit} />} />
                    <Route path="/peopleReport" element={<PeopleReport onFormSubmit={handleFormSubmit} />} />
                    <Route path="/peopleEditDetails" element={<PeopleEditDetails onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval" element={<AdminApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval/adminAttendanceApproval" element={<AdminAttendanceApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/siteTransferLabour" element={<SiteTransfer departments={departments} projectNames={projectNames} onFormSubmit={handleFormSubmit} onApprove={handleApprove}/>} />
                    <Route path="/adminApproval/siteTransferApproval" element={<SiteTransferApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval/wagesApproval" element={<WagesApproval onFormSubmit={handleFormSubmit} />} />
                  </Routes>
                </>
              }
            />
          </Route>
          
          {/* Redirect to Login if route doesn't match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;





// imp running this and changes in 25-07-2024

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/Header/Header';
// import Sidebar from './components/Sidebar/Sidebar';
// import OnboardingForm from './components/OnboardingForm/OnboardingForm';
// import AddUser from "./components/AddUser/AddUser";
// import LabourDetails from "./components/LabourDetails/LabourDetails";
// import ApproveLabours from "./components/ApproveLabours/ApproveLabours";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Login from "./components/Login/Login";
// import axios from 'axios';
// import { API_BASE_URL } from "./Data";
// import './App.css';
// import EditLabour from './EditLabour/EditLabour';
// import ProtectedRoute from './components/ProtectedRoutes';


// function App() {
//   const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
//   const [approvedLabours, setApprovedLabours] = useState([]);
//   const [refresh, setRefresh] = useState(false);
//   const [formStatus, setFormStatus] = useState({
//     kyc: false,
//     personal: false,
//     bankDetails: false,
//     project: false
//   });


//   const [departments, setDepartments] = useState([]);
//   const [projectNames, setProjectNames] = useState([]);

//   useEffect(() => {
//     const fetchDepartmentsAndProjects = async () => {
//       try {
//         const departmentsRes = await axios.get(API_BASE_URL + '/api/departments');
//         // console.log('Fetched Departments:', departmentsRes.data); 
//         setDepartments(departmentsRes.data);

//         const projectsRes = await axios.get(API_BASE_URL + '/api/project-names');
//         // console.log('Fetched Projects:', projectsRes.data); 
//         setProjectNames(projectsRes.data);
//       } catch (err) {
//         // console.error('Error fetching departments or projects:', err);
//       }
//     };

//     fetchDepartmentsAndProjects();
//   }, []);

//   const handleApprove = () => {
//     setRefresh(prev => !prev);
//   };

//   const OpenSidebar = () => {
//     setOpenSidebarToggle(!openSidebarToggle);
//   };

//   const handleFormSubmit = (formType, data) => {
//     if (formType === 'approveLabours') {
//       setApprovedLabours([...approvedLabours, data]); 
//     }
//     setFormStatus((prevStatus) => ({
//       ...prevStatus,
//       [formType]: true
//     }));
//   };

//   return (
//     <Router>
//       <div className='grid-container'>
//         <Routes>
//           {/* Route for Login */}
//           <Route path="/" element={<Login />} />
          
//           {/* Routes with Header and Sidebar */}
//           <Route
//             path="/*"
//             element={
//               <>
//                 <Header OpenSidebar={OpenSidebar} />
//                 <Sidebar formStatus={formStatus} openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
//                 <Routes>
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route path="/kyc" element={<OnboardingForm formType="kyc" onFormSubmit={handleFormSubmit} />} />
//                   <Route path="/personal" element={<OnboardingForm formType="personal" onFormSubmit={handleFormSubmit} />} />
//                   <Route path="/project" element={<OnboardingForm formType="project" onFormSubmit={handleFormSubmit} />} />
//                   <Route path="/bankDetails" element={<OnboardingForm formType="bankDetails" onFormSubmit={handleFormSubmit} />} />
//                   <Route path="/labourDetails" element={<LabourDetails departments={departments} projectNames={projectNames} onFormSubmit={handleFormSubmit} onApprove={handleApprove} />} />
//                   <Route path="/approveLabours" element={<ApproveLabours refresh={refresh} departments={departments} projectNames={projectNames}/>} />
//                   <Route path="/addUser" element={<AddUser onFormSubmit={handleFormSubmit} />} />
//                   <Route path="/edit-labour" element={<EditLabour />} />
//                 </Routes>
//               </>
//             }
//           />
          
//           {/* Redirect to Login if route doesn't match */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



















// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header/Header';
// import Sidebar from './components/Sidebar/Sidebar';
// import OnboardingForm from './components/OnboardingForm/OnboardingForm';
// import AddUser from "./components/AddUser/AddUser"
// import LabourDetails from "./components/LabourDetails/LabourDetails"
// import ApproveLabours from "./components/ApproveLabours/ApproveLabours"
// import PendingLabours from "./components/PendingLabours/PendingLabours"
// import './App.css';

// function App() {

//   const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
//   const [formStatus, setFormStatus] = useState({
//     kyc: false,
//     personal: false,
//     bankDetails: false,
//     project: false
//   });

//   const OpenSidebar = () => {
//     setOpenSidebarToggle(!openSidebarToggle)
//   }

 

//   const handleFormSubmit = (formType) => {
//     setFormStatus((prevStatus) => ({
//       ...prevStatus,
//       [formType]: true
//     }));
//   };

//   return (
//     <Router>
//       {/* <div className="app"> */}
//       <div className='grid-container'>
//         <Header OpenSidebar={OpenSidebar}/>
//         {/* <div className="main-content"> */}
//           <Sidebar formStatus={formStatus} openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
//           <Routes>
//           {/* <Route path="/onboarding" element={<OnboardingForm formType="kyc" formStatus={formStatus} onFormSubmit={handleFormSubmit} />} /> */}
//             <Route path="/kyc" element={<OnboardingForm formType="kyc" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/personal" element={<OnboardingForm formType="personal" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/project" element={<OnboardingForm formType="project" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/bankDetails" element={<OnboardingForm formType="bankDetails" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/addUser" element={<AddUser formType="addUser" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/labourDetails" element={<LabourDetails formType="labourDetails" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/approveLabours" element={<ApproveLabours formType="approveLabours" onFormSubmit={handleFormSubmit} />} />
//             <Route path="/pendingLabours" element={<PendingLabours formType="pendingLabours" onFormSubmit={handleFormSubmit} />} />
//           </Routes>
//         {/* </div> */}
//       </div>
//     </Router>
//   );
// }

// export default App;








