
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
        <BsPersonCircle className='icon' style={{ margin: '0 20px', cursor: 'pointer' }} />
      </div>
      <span style={spanStyle}>
        {user ? user.name : "Guest"}
      </span>
    </div>

    </header>
  )
}

export default Header;










