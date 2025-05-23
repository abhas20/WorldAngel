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
  <section className="bg-black text-white px-4 py-10 flex justify-center items-center min-h-screen">
    <form
      action={formSubmit}
      className="w-full max-w-md bg-black space-y-6 p-6 border border-yellow-400 rounded-lg"
    >
      <h2 className="text-4xl sm:text-5xl text-blue-400 font-bold text-center pb-6">
        Contact Us
      </h2>

      <input
        type="text"
        name="username"
        placeholder="Enter your name"
        autoComplete="off"
        autoCapitalize="on"
        required
        className="w-full p-3 rounded-xl border border-white bg-transparent"
      />

      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        autoComplete="off"
        autoCapitalize="on"
        required
        className="w-full p-3 rounded-xl border border-white bg-transparent"
      />

      <input
        type="text"
        name="contact"
        placeholder="Enter your contact no."
        autoComplete="off"
        autoCapitalize="on"
        required
        className="w-full p-3 rounded-xl border border-white bg-transparent"
      />

      <textarea
        name="message"
        placeholder="Enter your message"
        className="w-full p-3 h-40 rounded-xl border border-white bg-transparent"
      ></textarea>

      <button
        type="submit"
        className="w-full p-3 rounded-xl bg-blue-300 hover:bg-gray-400 text-black font-semibold border-2 border-white transition duration-300"
      >
        Send
      </button>
    </form>
  </section>
);
}
