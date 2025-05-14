import React from 'react'
import countryData from '../api/countrydata.json'

export default function About() {
  return (
    <section className=' bg-black m-auto text-white p-5'>
      <h2 className='m-auto text-3xl text-center pb-3 font-[rog] font-bold mb-10'>Explore Some facts in the world</h2>
      <div className='container flex justify-between flex-wrap lg:[&_div]:w-1/4 md:[&_div]:1/3 [&_div]:1/2 gap-8  m-auto mb-40'>
        {
          countryData.map((country)=>{
              return(
                <div key={country.id} className='border-2xl hover:shadow-yellow-200 hover:-translate-y-1 shadow-lg shadow-cyan-500/50 rounded-2xl h-120 grid self-center text-center border-amber-200 bg-gradient-to-r from-blue-900 to-black p-3 m-auto space-y-2 [&_span]:font-bold'>
                <h3 className='text-2xl font-bold underline underline-offset-4 my-2 '>{country.name}</h3>
                <p><span>Capital:</span>{country.capital}</p>
                <p><span>Population:</span>{country.population}</p>
                <p><span>Interesting facts:<br/></span>{country.interesting_facts}</p>
              </div>
              )
          })
        }
       
      </div>
    </section>
  )
}
