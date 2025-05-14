import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import { toast } from 'react-toastify';



export default function Signup() {

  const registerUser= async (data)=>{
    try {
      const response = await register(data);
      return response;
    } catch (error) {
      console.log("Error in sign up",error)
    }
  }

  const navigate=useNavigate()

  const formSubmit=async (formData)=>{
    try {
      console.log(formData.entries())
      const filled =Object.fromEntries(formData.entries())
      const data=await registerUser(filled);
      if(data.status==201){navigate("/login");
      toast.success("Signed Up Successfully")
      if(data.status==409){
        toast.error("User already exist")
      }
      }
      console.log(data.message,data.data)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
      <form action={formSubmit}>
        <div className='flex h-screen bg-black text-white'>
          <div className='bg-gray-800 flex flex-col justify-center p-20 items-center m-auto gap-3 border rounded-2xl border-amber-300'>
          <h1 className='text-3xl font-bold'>Sign Up</h1>
          <input type="text" placeholder='Username' name='username' className='border border-gray-300 p-2 rounded-md mt-4' required/>
          <input type="text" placeholder='Email' name='email' className='border border-gray-300 p-2 rounded-md mt-4' required/>
          <input type="password" name='password' placeholder='Password' className='border border-gray-300 p-2 rounded-md mt-4' required autoComplete='off' />
          <button type="submit" className='bg-sky-500 text-white p-2 rounded-md mt-4'>Sign Up</button>
        <div className='flex justify-center items-center mt-4'>
          <p>Already have an account?</p>
          <NavLink to="/login" className='text-blue-500 ml-2 hover:text-orange-300'>Login</NavLink>
          </div>
          </div>
        </div>
      </form>
  )
}
