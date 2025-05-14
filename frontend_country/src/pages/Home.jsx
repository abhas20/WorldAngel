import React from 'react'
import { FaArrowRight,FaAngleDoubleDown } from "react-icons/fa";
import About from './About';
import { NavLink } from 'react-router-dom';

export default function Home() {
  const moveDown=()=>{
    window.scrollBy(0,window.innerHeight);
  }

  return (
    <>
    <main className='bg-black p-3 h-150 font-serif text-white flex justify-evenly'>
      <div className='m-auto p-2'>
        <h1 className='m-auto text-3xl pb-3 font-bold'>Explore Evething Avaibable</h1>
        <p className='pb-5 hidden md:block'>The beauty of this world is Fascinating and wonderfull,<br/>
          Discover Everthing in this and Make this world a heaven<br/> 
          where gods may come to visit.... <br/><br/>
          Beneath the sky, the earth spins round,<br/>
          With oceans deep and hills unbound.<br/>
          In every breeze and rustling tree,<br/>
          She whispers life, wild and free.
        </p><br/>
        <NavLink to={"/country"}><button className='border-white border-2 flex items-center bg-[#1f1f1f] rounded-2xl p-3 text-start'>Start-Exploring<FaArrowRight className='ml-2'/></button></NavLink>
      </div>
      <div className='m-auto p-2'>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrqp8H7gz1-fYwGfCpHRD-BCk-_m0ZTaEHeg&s'className='rounded-2xl h-60' alt='earth'/>
      </div>
    </main>
    <div className='bg-black flex justify-center'>
    <button className=' border-2 flex items-center bg-black rounded-2xl p-3 my-5 text-start' onClick={moveDown}><FaAngleDoubleDown className='text-white'/></button>
    </div>
    <About/>
    </>
  )
}
