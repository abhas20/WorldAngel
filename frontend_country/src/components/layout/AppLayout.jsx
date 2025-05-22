import React from 'react'
import Headers from '../ui/Headers'
import Footers from '../ui/Footers'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
   <div className='bg-black'>
    <Headers/>
    <Outlet/>
    <Footers/>
   </div>
  )
}
