import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { toast } from "react-toastify";
import Loader from "../components/ui/Loader";

export default function Signup() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (data) => {
    try {
      return await register(data);
    } catch (error) {
      console.log("Error in sign up", error);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const filled = Object.fromEntries(formData.entries());

      if (filled.password !== filled.confirm_password) {
        toast.error("Confirm password and password must be same");
        return;
      }

      const response = await registerUser({
        username: filled.username,
        email: filled.email,
        password: filled.password,
      });

      if (response?.status === 201) {
        toast.success("Signed Up Successfully");
        navigate("/login");
      } else if (response?.status === 409) {
        toast.error("User already exists");
      } else {
        toast.error(response?.data?.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={formSubmit} className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <Loader />
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
        <div className="bg-gray-800 flex flex-col items-center w-full max-w-sm sm:max-w-md py-12 px-6 gap-y-6 border rounded-2xl border-amber-300 shadow-lg">
          <h1 className="text-3xl font-bold">Sign Up</h1>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border border-gray-300 p-3 rounded-md"
            required
          />

          <input
            type="email"
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

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 p-3 rounded-md"
            required
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-md font-semibold transition
              ${
                isLoading
                  ? "bg-sky-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600"
              }
            `}>
            Sign Up
          </button>

          <div className="flex justify-center items-center mt-6 text-sm">
            <p>Already have an account?</p>
            <NavLink
              to="/login"
              className="text-blue-500 ml-2 hover:text-orange-300 font-medium">
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </form>
  );
}
