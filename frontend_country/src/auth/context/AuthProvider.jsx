import React, { createContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { refreshToken } from "../../api/authApi";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    accessToken: null,
    user: null,
    refreshToken: null,
  });
  const [authLoading, setAuthLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const fetchUser = async () => {
    try {
      const res = await axiosPrivate.get("/current-user");
      if (res.status === 200 && res.data?.message) {
        setAuth((prev) => ({
          ...prev,
          user: res.data.message,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(()=>{
    const refreshAuth = async () => {
      try {
        const res = await refreshToken();
        console.log("Auth refreshed:", res.data);
        if (res.status === 200) {
          setAuth((prev) => ({
            ...prev,
            accessToken: res.data.message.accessToken,
            refreshToken: res.data.message.refreshToken,
          }));
          await fetchUser();
        }
      } catch (err) {
        console.error("Failed to refresh auth:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    refreshAuth();
  },
  []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, fetchUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
