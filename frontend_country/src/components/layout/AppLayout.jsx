import React from 'react'
import Headers from '../ui/Headers'
import Footers from '../ui/Footers'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
   <>
    <Headers/>
    <Outlet/>
    <Footers/>
   </>
  )
}
