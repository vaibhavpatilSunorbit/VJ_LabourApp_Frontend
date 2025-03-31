import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import WagesApproval from './components/AdminApproval/WagesApproval/WagesApproval';
import VariableInput from './components/VariableInputs/VariableInput';
import VariableInputApproval from './components/AdminApproval/VariableInputApproval/VariableInputApproval';
import SalaryRegister from './components/AdminSalary/SalaryRegister';
import SalaryGeneration from './components/AdminSalary/SalaryGeneration/SalaryGeneration';
import PaySlipPage from './PaySlip/PaySlipPage';
import RunPayroll from './components/AdminSalary/RunPayroll/RunPayroll';
import ViewMonthlyPayroll from './components/AdminSalary/ViewMonthlyPayroll/ViewMonthlyPayroll';
import { useUser } from './UserContext/UserContext';
import LabourIdCard from './PaySlip/LabourIdCard';
import CompanyTransferApproval from './components/AdminApproval/CompanyTransferApproval/CompanyTransferApproval';
import { initGA, logPageView } from './utils/analytics.js';

const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [approvedLabours, setApprovedLabours] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user } = useUser();
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
        const departmentsRes = await axios.get(API_BASE_URL + "/api/departments");
        const projectsRes = await axios.get(API_BASE_URL + "/api/project-names");
        console.log('projectsRes', projectsRes.data)
        setDepartments(departmentsRes.data);
        setProjectNames(projectsRes.data);

        // **Ensure the API user data exists before filtering**
        if (user && user.departmentIds && user.projectIds) {
          // **Parse department & project IDs from string to array**
          const departmentIdsArray = JSON.parse(user.departmentIds);
          const projectIdsArray = JSON.parse(user.projectIds);

          console.log("Parsed Department IDs:", departmentIdsArray);
          console.log("Parsed Project IDs:", projectIdsArray);

          // **Filter departments and projects based on parsed IDs**
          const filteredDepartments = departmentsRes.data.filter((dept) =>
            departmentIdsArray.includes(dept.Id)
          );

          const filteredProjects = projectsRes.data.filter((proj) =>
            projectIdsArray.includes(proj.Id)
          );

          console.log("Filtered Departments:", filteredDepartments);
          console.log("Filtered Projects:", filteredProjects);

          setDepartments(filteredDepartments);
          setProjectNames(filteredProjects);
        }
      } catch (err) {
        console.error("Error fetching departments or projects:", err);
      }
    };

    fetchDepartmentsAndProjects();
  }, [user]);

  useEffect(() => {
    initGA(); // ✅ Initialize GA once on app load
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
      <GAListener />
      <div className='grid-container'>
        <Routes>
          {/* Route for Login */}
          <Route path="/" element={<Login />} />
          {/* <Route path="/SalaryRejester" element={<SalaryRegister />} />
          <Route path="/SalaryGeneration" element={<SalaryGeneration />} /> */}

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
                    <Route path="/approveLabours" element={<ApproveLabours refresh={refresh} departments={departments} projectNames={projectNames} />} />
                    <Route path="/addUser" element={<AddUser onFormSubmit={handleFormSubmit} />} />
                    <Route path="/edit-labour" element={<EditLabour />} />
                    <Route path="/attendanceReport" element={<AttendanceReport onFormSubmit={handleFormSubmit} departments={departments} projectNames={projectNames}/>} />
                    <Route path="/wagesReport" element={<WagesReport onFormSubmit={handleFormSubmit} departments={departments} projectNames={projectNames} />} />
                    <Route path="/peopleReport" element={<PeopleReport onFormSubmit={handleFormSubmit} />} />
                    <Route path="/peopleEditDetails" element={<PeopleEditDetails onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval" element={<AdminApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval/adminAttendanceApproval" element={<AdminAttendanceApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/siteTransferLabour" element={<SiteTransfer departments={departments} projectNames={projectNames} onFormSubmit={handleFormSubmit} onApprove={handleApprove} />} />
                    <Route path="/adminApproval/siteTransferApproval" element={<SiteTransferApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval/wagesApproval" element={<WagesApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/variableInput" element={<VariableInput departments={departments} projectNames={projectNames} onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval/variableInputApproval" element={<VariableInputApproval onFormSubmit={handleFormSubmit} />} />
                    <Route path="/SalaryRejester" element={<SalaryRegister onFormSubmit={handleFormSubmit} />} />
                    <Route path="/SalaryGeneration" element={<SalaryGeneration onFormSubmit={handleFormSubmit} />} />
                    <Route path="/RunPayroll" element={<RunPayroll onFormSubmit={handleFormSubmit} />} />
                    <Route path="/ViewMonthlyPayroll" element={<ViewMonthlyPayroll onFormSubmit={handleFormSubmit} />} />
                    <Route path="/adminApproval/CompanyTransferApproval" element={<CompanyTransferApproval departments={departments} projectNames={projectNames} onFormSubmit={handleFormSubmit} />} />


                    <Route path="/Payslip" element={<PaySlipPage onFormSubmit={handleFormSubmit} />} />
                    <Route path="/LabourIdCard" element={<LabourIdCard />} />
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



