import React from 'react'
import { toast } from 'react-toastify';

export default function Contact() {
  const formSubmit=(formData)=>{
        console.log(formData.entries());
       const ans= Object.fromEntries(formData.entries());
       console.log(ans);
       toast.info("Message sent successfully")
  }
  return (
    <section className='bg-black text-white p-10 m-auto space-y-2.5  flex flex-col justify-center items-center h-screen '>
      <form action={formSubmit} className=' m-auto [&_input]:border border-white space-y-6 p-3 [&_input]:p-2 '>
      <h2 className='text-5xl text-blue-400 pb-10 font-bold text-center'>Countact Us</h2>
        <input type='text' className='block rounded-2xl w-80' required autoComplete='off' autoCapitalize='on'placeholder='Enter your name' name='username'/>
        <input type='email' className='block rounded-2xl w-80' required autoComplete='off' autoCapitalize='on'placeholder='Enter your email' name='email'/>
        <input type='text' className='block rounded-2xl w-80' required autoComplete='off' autoCapitalize='on'placeholder='Enter your contact no.' name='contact'/>
        <textarea name="message" className='block border p-3 border-white h-40 w-80 rounded-2xl' placeholder='Enter your message'></textarea>
        <button type='submit' className='rounded-2xl text-black hover:bg-gray-400 bg-blue-300 left-1/2 w-80 p-2 border-2 border-white text-center' >Send</button>
      </form>
      
    </section>
  )
}
