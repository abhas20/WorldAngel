import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';



export default function Signup() {
  const [isLoading,setLoading]=useState(false);

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
      setLoading(true);
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
    finally{
      setLoading(false);
    }
  }

 return (
  <form action={formSubmit}>
    {isLoading?<Loader/>: <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-gray-800 flex flex-col justify-center items-center w-full max-w-sm sm:max-w-md py-12 px-6 sm:py-16 sm:px-12 gap-y-6 border rounded-2xl border-amber-300 shadow-lg">
        <h1 className="text-3xl font-bold">Sign Up</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border border-gray-300 p-3 rounded-md"
          required
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-md"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-md"
          required
          autoComplete="off"
        />

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-md font-semibold transition duration-300"
        >
          Sign Up
        </button>

        <div className="flex justify-center items-center mt-6 text-sm">
          <p>Already have an account?</p>
          <NavLink
            to="/login"
            className="text-blue-500 ml-2 hover:text-orange-300 font-medium"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>}
  </form>
);
}
