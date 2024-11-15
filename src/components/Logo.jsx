import React from 'react'
import logo from '../assets/logo.png';
import icon from '../assets/icon.png';
function Logo({width = '', className=''}) {
  return (
    <div className={`h-[70px] w-[250px] ${className}`}>
      <img src={logo} className=' block md:hidden'/>
      <img src={icon} className='h-[30px] hidden md:block'/>
    </div>
  )
}

export default Logo