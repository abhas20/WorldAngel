import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi';
import useAuth from '../auth/hooks/useAuth';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';

export default function Login() {

    const formRef=useRef(null);

    const [isLoading,setLoading]=useState(false);
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
      setLoading(true)
  
     
      if (response.status === 200) {
        const {user,refreshToken ,accessToken}=response.data.message
        // console.log(response.data)
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
    finally{
      setLoading(false);
    }
  };

 return (
  <form onSubmit={formSubmit} ref={formRef}>
    {isLoading?<Loader/>: <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-gray-800 flex flex-col justify-center items-center w-full max-w-sm sm:max-w-md py-12 px-6 sm:py-16 sm:px-12 gap-y-6 border rounded-2xl border-amber-300 shadow-lg">
        <h1 className="text-3xl font-bold">Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
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
          Login
        </button>

        <div className="flex justify-center items-center mt-6 text-sm">
          <p>Don't have an account?</p>
          <NavLink
            to="/signup"
            className="text-blue-500 ml-2 hover:text-orange-300 font-medium"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>}
  </form>
);

}
