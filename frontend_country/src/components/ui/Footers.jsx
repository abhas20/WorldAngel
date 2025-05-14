import React from 'react'
import footerCont from '../../api/footer.json'
import { IoCallSharp } from "react-icons/io5";
import { FaLocationDot,FaInstagram } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaFacebook,FaLinkedin,FaGithub } from "react-icons/fa";

export default function Footers() {

  const footerIcon={
        "Abhas":<IoCallSharp/>,
        "Blast":<IoIosMail/>,
        "Ghost":<FaLocationDot/>
  }


  return (
    <>
    <footer className='bg-black m-auto p-5 flex justify-center text-white border-t-2 rounded-t-2xl border-amber-100'>

      {footerCont.map((foot,index)=>{
          return(
            <div className='m-auto p-4 space-y-3.5 align-middle items-center' key={index}>
            <h2 className='text-2xl'>{footerIcon[foot.icon]}</h2>
            <p className='text-2xl font-bold'>{foot.title}</p>
            <p className='text-gray-400'>{foot.Detail}</p>
            </div>
          )
      })}
      
</footer>
<div className='flex bg-gradient-to-b from-black to-blue-800 p-5 border-black text-white flex-wrap justify-evenly'>
        <p><FaFacebook/>Facebook</p>
        <p><FaInstagram/>Instagram</p>
        <p><FaGithub/>GitHub</p>
        <p><FaLinkedin/>LinkedIn</p>
      </div>
</>
  )
}
