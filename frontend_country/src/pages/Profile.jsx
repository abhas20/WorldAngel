import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../auth/hooks/useAxiosPrivate';
import { NavLink } from 'react-router-dom';
import { FaPencil } from "react-icons/fa6";
import UpdateImage from '../components/ui/UpdateImage';
import useAuth from '../auth/hooks/useAuth';

export default function Profile() {

  const [isModalOpen,setIsModalOpen]=useState(false);
  const [error,setError]=useState(null);


  const {auth}=useAuth();
  const user=auth?.user;

  if(!user) return (<p className='flex text-2xl text-center text-red-500'>{error+"!!!"}</p>)

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-700">
  <div className=" shadow-cyan-500/50 rounded-2xl grid self-center text-center border-amber-200 bg-gradient-to-r from-blue-900 to-black p-6 w-full max-w-md  relative">
    <h2 className="text-2xl font-semibold mb-4 text-white">My Profile</h2>

    <div className="relative w-24 h-24 mx-auto mb-4">
      <img
        src={user.avatar || '/default-avatar.png'}
        alt="User avatar"
        className="w-24 h-24 rounded-full object-cover border border-gray-300"
      />
        <button onClick={()=>setIsModalOpen(true)} className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-blue-700 transition">
          <FaPencil />
        </button>

    </div>

    <p className="text-gray-100 mb-2">
      <span className="font-semibold">Username:</span> {user.username}
    </p>
    <p className="text-gray-100 mb-4">
      <span className="font-semibold">Email:</span> {user.email}
    </p>

    <NavLink to="/change-password">
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Change Password
      </button>
    </NavLink>
  </div>
 {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
      <UpdateImage setIsModalOpen={setIsModalOpen}/>
     
    </div>
  </div>
)}
</div>

  )
}
