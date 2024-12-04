import React from 'react'
import Logout from "../../assets/Logout.png"
import authService from '../../firebase/auth'
import { logout } from '../../store/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutHandler = () => {
      authService.logout()
      .then(() => dispatch(logout()))
      .then(()=> navigate("/"))
  }
  return (
    <button onClick={logoutHandler}>
        <img src={Logout} alt='Logout' height={25} width={25}/>
    </button>
  )
}

export default LogoutBtn