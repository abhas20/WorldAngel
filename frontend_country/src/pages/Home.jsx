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
      <main className='bg-black p-3 font-serif text-white flex flex-col-reverse md:flex-row justify-evenly items-center'>
        <div className='p-5 mt-8 md:mb-8'>
          <h1 className='text-3xl pb-8 font-bold text-center md:text-left md:mb-4'>Explore Everything Available</h1>
          <p className='pb-5 hidden md:block'>
            The beauty of this world is fascinating and wonderful,<br />
            Discover everything in this and make this world a heaven<br />
            where gods may come to visit.... <br /><br />
            Beneath the sky, the earth spins round,<br />
            With oceans deep and hills unbound.<br />
            In every breeze and rustling tree,<br />
            She whispers life, wild and free.
          </p>
          <NavLink to={"/country"}>
          <button className='border-white border-2 flex items-center bg-[#1f1f1f] rounded-2xl p-3 mt-4 mx-auto md:mx-0'>
            Start Exploring <FaArrowRight className='ml-2' />
          </button>
        </NavLink>
        </div>

        <div className='p-4'>
          <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrqp8H7gz1-fYwGfCpHRD-BCk-_m0ZTaEHeg&s'
            alt='earth'
            className='rounded-2xl h-60 w-auto mx-auto'
          />
        </div>
      </main>

      <div className='bg-black flex justify-center'>
        <button
          className='border-2 flex items-center bg-black rounded-2xl p-3 md:my-5  text-start'
          onClick={moveDown}
        >
          <FaAngleDoubleDown className='text-white md:hover:text-amber-400' />
        </button>
      </div>

      <About />
    </>
  );
}
