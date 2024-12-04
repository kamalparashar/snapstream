import React from 'react'
import logo from '../assets/logo.png';
import icon from '../assets/icon.png';
function Logo({width = '', className=''}) {
  return (
    <div className={`${className}`}>
      <img src={logo} className=' block sm:hidden'/>
      <img src={icon} className=' w-[5vmax] hidden sm:block'/>
    </div>
  )
}

export default Logo