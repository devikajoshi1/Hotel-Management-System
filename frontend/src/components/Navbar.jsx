import React from 'react'
import "./Navbar.css";
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link to='/' className='logo'>
         LUXORA
      </Link>

      <div className='nav-links'>
        <Link to='/'>Home</Link>
        <Link to='/rooms'>Rooms</Link>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>

      </div>
    </nav>
  )
}

export default Navbar
