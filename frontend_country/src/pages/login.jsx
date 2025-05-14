import React, { useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi';
import useAuth from '../auth/hooks/useAuth';
import { toast } from 'react-toastify';

export default function Login() {

    const formRef=useRef(null);
    const errRef=useRef();


    const {setAuth,fetchUser}=useAuth();

    const loginUser= async (data)=>{
      try {
        const response = await login(data);
        return response;
      } catch (error) {
        console.log("Error in login",error)
      }
    }
  const navigate=useNavigate();

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const filled = Object.fromEntries(formData.entries());
      const response = await loginUser(filled);
  
     
      if (response.status === 200) {
        const {user,refreshToken ,accessToken}=response.data.message
        console.log(response.data)
        setAuth({accessToken,refreshToken,user})
        await fetchUser();
        navigate("/");
        toast("Login successful");
        formRef.current.reset(); 
      }
      else {
        toast(response.data?.message || "Login failed");
      }
  
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
      <form onSubmit={formSubmit} ref ={formRef}>
        <div className='flex h-screen bg-black text-white'>
          <div className='bg-gray-800 flex flex-col justify-center p-20 items-center m-auto gap-3 border rounded-2xl border-amber-300'>
          <h1 className='text-3xl font-bold'>Login</h1>
          <input  type="text" placeholder='Username' name='username' className='border border-gray-300 p-2 rounded-md mt-4' required/>
          <input type="password" name='password' placeholder='Password' className='border border-gray-300 p-2 rounded-md mt-4' required autoComplete='off' />
          <button type="submit" className='bg-sky-500 text-white p-2 rounded-md mt-4'>Login</button>
        <div className='flex justify-center items-center mt-4'>
          <p>Don't have an account?</p>
          <NavLink to="/signup" className='text-blue-500 ml-2 hover:text-orange-300'>Sign Up</NavLink>
          </div>
          </div>
        </div>
      </form>
  )
}
