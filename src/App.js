import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import OnboardingForm from './components/OnboardingForm/OnboardingForm';
import AddUser from "./components/AddUser/AddUser";
import LabourDetails from "./components/LabourDetails/LabourDetails";
import ApproveLabours from "./components/ApproveLabours/ApproveLabours";
import Dashboard from "./components/Dashboard/Dashboard"
import Login from "./components/Login/Login"
import './App.css';

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
          
          {/* Routes with Header and Sidebar */}
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
                  <Route path="/labourDetails" element={<LabourDetails onFormSubmit={handleFormSubmit} onApprove={handleApprove} />} />
                  <Route path="/approveLabours" element={<ApproveLabours refresh={refresh} />} />
                  <Route path="/addUser" element={<AddUser onFormSubmit={handleFormSubmit} />} />
                </Routes>
              </>
            }
          />
          
          {/* Redirect to Login if route doesn't match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

















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








