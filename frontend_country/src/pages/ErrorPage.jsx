import React from 'react'
import { NavLink, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    const error=useRouteError();
    console.log(error)
  return (
    <>
    <div className='h-screen bg-green-200 pt-2'>
    <h1 className='text-4xl font-bold m-2 text-center'>Page Not Found</h1>
    <p className='text-center'>{error && error.data}</p>
    <NavLink to='/'><button className='border-amber-400 mx-auto my-20 block p-2 border-2 m-2 rounded-2xl bg-amber-200'>Go Back</button></NavLink>
    </div>
    </>
  )
}
