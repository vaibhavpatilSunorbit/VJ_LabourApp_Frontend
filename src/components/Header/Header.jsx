
import React from 'react'
import {BsFillBellFill,BsIconName , BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs';
 import { GrLogout } from "react-icons/gr";
//  import VJLogo from "../../images/VJlogo-1-removebg.png";
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

function Header({OpenSidebar}) {
  const navigate = useNavigate();

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
        <div className='header-right headericon' >
            <BsFillBellFill className='icon'/>
               <Tooltip title="Logout" arrow>
      <GrLogout className='icon' onClick={handleLogout} />
    </Tooltip>
            <BsPersonCircle className='icon'/>
        </div>
    </header>
  )
}

export default Header;










