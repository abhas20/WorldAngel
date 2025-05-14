import React, { createContext, useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'



const AuthContext=createContext({})

export function AuthProvider({children}) {
    const [auth,setAuth]=useState({ accessToken: null, user: null,refreshToken: null})
    const axiosPrivate=useAxiosPrivate();

     const fetchUser = async () => {
    try {
      const res = await axiosPrivate.get("/current-user");
      if (res.status === 200 && res.data?.message) {
        setAuth(prev => ({
          ...prev,
          user: res.data.message
        }));
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  return (
    <AuthContext.Provider value={{auth,setAuth,fetchUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;