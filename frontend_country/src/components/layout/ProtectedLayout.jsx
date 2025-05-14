import React, { useEffect, useState } from 'react'
import useAuth from '../../auth/hooks/useAuth'
import { Navigate, Outlet, replace, useLocation } from 'react-router-dom';
import Headers from '../ui/Headers';

export default function ProtectedLayout() {
    const location=useLocation();
    const {auth} = useAuth();


  return auth.accessToken?
  <>
  <Outlet/> 
  </>
  : <Navigate to="/login" state={{from: location}} replace/>
}
