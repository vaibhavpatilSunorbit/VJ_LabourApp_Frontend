// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { InputLabel } from '@mui/material';
// import { API_BASE_URL } from "../../Data";

// const ApproveLabours = () => {
//   const [projectNames, setProjectNames] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [formData, setFormData] = useState({
//     projectName: '',
//     deviceName: '',
//     deviceLocation: '',
//   });

//   const renderRequiredAsterisk = (isRequired) => {
//     return isRequired ? <span style={{ color: "red" }}> *</span> : null;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectNamesRes = await axios.get(`${API_BASE_URL}/api/project-names`);
//         const devicesRes = await axios.get(`${API_BASE_URL}/api/devices`);

//         if (projectNamesRes.status === 200) {
//           setProjectNames(projectNamesRes.data);
//           console.log('Fetched Project Names:', projectNamesRes.data);
//         } else {
//           console.error('Failed to fetch project names:', projectNamesRes.status);
//         }

//         if (devicesRes.status === 200) {
//           setDevices(devicesRes.data);
//           console.log('Fetched Devices:', devicesRes.data);
//         } else {
//           console.error('Failed to fetch devices:', devicesRes.status);
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const getInputStyle = (fieldName) => {
//     return { 
//       fontWeight: 400,
//       fontSize: '16px',
//       marginBottom: '8px',
//       width: '17vw',
//     };
//   };

//   const inputLabelStyle = {
//     color: 'black',
//     fontFamily: "Roboto, Helvetica, Arial, sans-serif",
//     fontWeight: 400,
//     fontSize: '1rem',
//     lineHeight: '1.4375em',
//     letterSpacing: '0.00938em',
//     padding: 0,
//     position: 'relative',
//     display: 'block',
//     transformOrigin: 'top left',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     maxWidth: '100%',
//     transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
//     color: 'rgba(0, 0, 0, 0.6)'
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '30px', gap: '50px' }}>
//       <div className="project-field">
//         <InputLabel id="project-name-label" style={inputLabelStyle}>
//           Project Name{renderRequiredAsterisk(true)}
//         </InputLabel>
//         <div className="gender-input">
//           <select
//             id="projectName"
//             name="projectName"
//             value={formData.projectName}
//             onChange={handleInputChange}
//             style={getInputStyle('projectName')}
//             required
//           >
//             <option value="">Select a project</option>
//             {projectNames.map((project) => (
//               <option key={project.id} value={project.id}>{project.Business_Unit}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="device-field">
//         <InputLabel id="device-name-label" style={inputLabelStyle}>
//           Device Name{renderRequiredAsterisk(true)}
//         </InputLabel>
//         <div className="gender-input">
//           <select
//             id="deviceName"
//             name="deviceName"
//             value={formData.deviceName}
//             onChange={handleInputChange}
//             style={getInputStyle('deviceName')}
//             required
//           >
//             <option value="">Select a device</option>
//             {devices.map((device) => (
//               <option key={device.DeviceID} value={device.DeviceID}>{device.DeviceSName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="device-location-field">
//         <InputLabel id="device-location-label" style={inputLabelStyle}>
//           Device Location{renderRequiredAsterisk(true)}
//         </InputLabel>
//         <div className="gender-input">
//           <select
//             id="deviceLocation"
//             name="deviceLocation"
//             value={formData.deviceLocation}
//             onChange={handleInputChange}
//             style={getInputStyle('deviceLocation')}
//             required
//           >
//             <option value="">Select a location</option>
//             {devices.map((device) => (
//               <option key={device.DeviceID} value={device.DeviceID}>{device.DeviceLocation}</option>
//             ))}
//           </select>
//         </div>
//       </div>



//       <div className="device-location-field">
//         <InputLabel id="device-location-label" style={inputLabelStyle}>
//           Serial Number{renderRequiredAsterisk(true)}
//         </InputLabel>
//         <div className="gender-input">
//           <select
//             id="SerialNumber"
//             name="SerialNumber"
//             value={formData.SerialNumber}
//             onChange={handleInputChange}
//             style={getInputStyle('SerialNumber')}
//             required
//           >
//             <option value="">Select a location</option>
//             {devices.map((device) => (
//               <option key={device.DeviceID} value={device.DeviceID}>{device.SerialNumber}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproveLabours;













import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputLabel, Button } from '@mui/material';
import { API_BASE_URL } from "../../Data";
import './projectMachine.css'; // Assuming you are importing a CSS file for styling

const ApproveLabours = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    projectName: '',
    deviceName: '',
    deviceLocation: '',
    SerialNumber: '',
  });

  const renderRequiredAsterisk = (isRequired) => {
    return isRequired ? <span style={{ color: "red" }}> *</span> : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNamesRes = await axios.get(`${API_BASE_URL}/api/project-names`);
        const devicesRes = await axios.get(`${API_BASE_URL}/api/devices`);

        if (projectNamesRes.status === 200) {
          setProjectNames(projectNamesRes.data);
          console.log('Fetched Project Names:', projectNamesRes.data);
        } else {
          console.error('Failed to fetch project names:', projectNamesRes.status);
        }

        if (devicesRes.status === 200) {
          setDevices(devicesRes.data);
          console.log('Fetched Devices:', devicesRes.data);
        } else {
          console.error('Failed to fetch devices:', devicesRes.status);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/api/approve-labour`, formData);
  //     if (response.status === 200) {
  //       console.log('Data submitted successfully:', response.data);
  //       // You can add more logic here, like showing a success message
  //     } else {
  //       console.error('Failed to submit data:', response.status);
  //     }
  //   } catch (err) {
  //     console.error('Error submitting data:', err);
  //   }
  // };

  const getInputStyle = () => {
    return { 
      fontWeight: 400,
      fontSize: '16px',
      marginBottom: '8px',
      width: '17vw',
    };
  };

  const inputLabelStyle = {
    color: 'black',
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.4375em',
    letterSpacing: '0.00938em',
    padding: 0,
    position: 'relative',
    display: 'block',
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    transition: 'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    color: 'rgba(0, 0, 0, 0.6)'
  };

  return (
    <form className="form-container">
    {/* <form onSubmit={handleSubmit} className="form-container"> */}
      <div className="form-column">
        <div className="form-field">
          <InputLabel id="project-name-label" style={inputLabelStyle}>
            Project Name{renderRequiredAsterisk(true)}
          </InputLabel>
          <select
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            style={getInputStyle()}
            required
          >
            <option value="">Select a project</option>
            {projectNames.map((project) => (
              <option key={project.id} value={project.id}>{project.Business_Unit}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <InputLabel id="device-name-label" style={inputLabelStyle}>
            Device Name{renderRequiredAsterisk(true)}
          </InputLabel>
          <select
            id="deviceName"
            name="deviceName"
            value={formData.deviceName}
            onChange={handleInputChange}
            style={getInputStyle()}
            required
          >
            <option value="">Select a device</option>
            {devices.map((device) => (
              <option key={device.DeviceID} value={device.DeviceID}>{device.DeviceSName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-column">
        <div className="form-field">
          <InputLabel id="device-location-label" style={inputLabelStyle}>
            Device Location{renderRequiredAsterisk(true)}
          </InputLabel>
          <select
            id="deviceLocation"
            name="deviceLocation"
            value={formData.deviceLocation}
            onChange={handleInputChange}
            style={getInputStyle()}
            required
          >
            <option value="">Select a location</option>
            {devices.map((device) => (
              <option key={device.DeviceID} value={device.DeviceID}>{device.DeviceLocation}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <InputLabel id="serial-number-label" style={inputLabelStyle}>
            Serial Number{renderRequiredAsterisk(true)}
          </InputLabel>
          <select
            id="SerialNumber"
            name="SerialNumber"
            value={formData.SerialNumber}
            onChange={handleInputChange}
            style={getInputStyle()}
            required
          >
            <option value="">Select a serial number</option>
            {devices.map((device) => (
              <option key={device.DeviceID} value={device.DeviceID}>{device.SerialNumber}</option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" variant="contained" color="primary" className="submit-button">
        Submit
      </Button>
    </form>
  );
};

export default ApproveLabours;
