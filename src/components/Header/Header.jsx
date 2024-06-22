
import React from 'react'
import {BsFillBellFill,BsIconName , BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs';
 import { BiLogOut } from 'react-icons/bi';
 import VJLogo from "../../images/VJlogo-1-removebg.png";

function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            <img src={VJLogo} className="vjlogo" alt="logo"/>
            
        </div>
        <div className='header-right' className="headericon">
            <BsFillBellFill className='icon'/>
            <BiLogOut className='icon'/>
            <BsPersonCircle className='icon'/>
        </div>
    </header>
  )
}

export default Header;










