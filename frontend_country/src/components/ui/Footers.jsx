import React from 'react'
import footerCont from '../../api/footer.json'
import { IoCallSharp } from "react-icons/io5";
import { FaLocationDot,FaInstagram } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaFacebook,FaLinkedin,FaGithub } from "react-icons/fa";

export default function Footers() {

  const footerIcon={
        "Call":<IoCallSharp/>,
        "Mail":<IoIosMail/>,
        "Location":<FaLocationDot/>
  }


   return (
    <>
      <footer className='bg-black text-white border-t-2 border-amber-100 rounded-t-2xl p-5'>
        <div className='flex flex-col sm:flex-row sm:justify-around items-center gap-6'>
          {footerCont.map((foot, index) => (
            <div key={index} className='text-center sm:text-left space-y-3'>
              <h2 className='text-3xl flex justify-center sm:justify-start'>{footerIcon[foot.icon]}</h2>
              <p className='text-xl font-bold'>{foot.title}</p>
              <p className='text-gray-400'>{foot.Detail}</p>
            </div>
          ))}
        </div>
      </footer>

      <div className='flex flex-wrap justify-center sm:justify-evenly items-center gap-4 bg-gradient-to-b from-black to-blue-800 text-white p-5'>
        <p className='flex items-center gap-2'><FaFacebook /> Facebook</p>
        <p className='flex items-center gap-2'><FaInstagram /> Instagram</p>
        <p className='flex items-center gap-2'><FaGithub /> GitHub</p>
        <p className='flex items-center gap-2'><FaLinkedin /> LinkedIn</p>
      </div>
    </>
  );
}