import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { TfiAngleDoubleDown } from "react-icons/tfi";
import useAuth from '../../auth/hooks/useAuth';
import { toast } from 'react-toastify';
import { logout, refreshToken } from '../../api/authApi';
import ImgDropdown from './ImgDropdown';
import { FaRegMessage } from 'react-icons/fa6';


export default function Headers() {
  const [show,setShow]=useState(false);
  

  const handleButtonToggle=()=>{
    setShow(!show);
    console.log("clicked")
  }
  const {auth,setAuth,authLoading}=useAuth()
  

  const logoutUser=async ()=>{
    try {
      const res=await logout();
      console.log("logged out Successfully")
      if(res.status==200){
      toast("Logged out successfully")
      setAuth({})
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Error in logging out");
    }
  }

  return (
    <div className='mx-2 rounded-2xl row-auto bg-[#1f1f1f] text-white'>
      <div className='container h-20 m-auto grid items-center grid-cols-3 '>
      <h1 className='text-3xl tracking-widest p-2 font-[Rog] col-span-3 text-center sm:text-left'>
  Explore <br className='block sm:hidden' />
  <span className='text-yellow-300'>The</span> WORLD
</h1>

      <ul className={' justify-evenly col-end-5 [&_li]:p-2.5 sm:flex hidden'}>
        <NavLink to="/"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Home</li></NavLink>
        <NavLink to="/about"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>About</li></NavLink>
        <NavLink to="/country"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Country</li></NavLink>
        <NavLink to="/contact"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Contact</li></NavLink>
        {authLoading?<li className='text-amber-500'>Loading...</li>:
        auth.accessToken?
        <ImgDropdown logoutUser={logoutUser}/>
        :<NavLink to="/login"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Login</li></NavLink>}
      </ul>
      <div className='absolute top-4 right-0 p-2 sm:hidden'>
        <button className='border border-white p-2 rounded-2xl' onClick={handleButtonToggle}>
        <TfiAngleDoubleDown />
        </button>
      </div>
      {show && <div className='absolute top-20 right-0 w-full text-center z-10  p-2 sm:hidden'>
        <ul className='bg-[#1f1f1f] text-white p-2.5 shadow shadow-amber-300 [&_li]:p-2.5' onClick={handleButtonToggle}>
        <NavLink to="/"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Home</li></NavLink>
        <NavLink to="/about"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>About</li></NavLink>
        <NavLink to="/country"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Country</li></NavLink>
        <NavLink to="/chat"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Global Chat</li></NavLink>
        <NavLink to="/contact"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Contact</li></NavLink>

        {authLoading?<li className='text-amber-500'>Loading...</li>:
        auth.accessToken?
        <>
        <NavLink to="/profile"><li className='hover:underline underline-offset-2 hover:text-amber-500'>Profile</li></NavLink>
        <button onClick={logoutUser}><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Logout</li></button>
        </>
        :
        <NavLink to="/login"><li className='hover:underline underline-offset-2 hover:text-amber-500 '>Login</li></NavLink>}
      </ul>
      </div>
        }
      </div>
      
    </div>
  )
}
