import React from 'react'
import {FaBars} from "react-icons/fa"
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <div className='w-full h-[85px] flex bg-gray-200 opacity-85 justify-between px-5 lg:px-20 items-center text-black border-b-[1.5px] sticky top-0'>
        <img width={90} src='/logo.webp'/>
        <FaBars fontSize="large" className='text-2xl lg:hidden'/>
        <ul className='hidden lg:flex gap-10 text-lg'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/learn">Learn</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
    </div>
  )
}

export default Navbar