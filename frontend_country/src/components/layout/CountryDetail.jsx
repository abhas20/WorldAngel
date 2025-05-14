import React, { useEffect, useState, useTransition } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getIndData } from '../../api/postApi';
import Loader from '../ui/Loader';

export default function CountryDetail() {
    const params=useParams();
    console.log(params.id);
    const [isPending,startTrasition]=useTransition();
      const [country,setCountry]=useState([])
      useEffect(()=>{
        startTrasition(async()=>{
          const res=await getIndData(params.id);
          console.log(res.data);
          if(res.status===200){
          setCountry(res.data)}
        })
      },[])
    
      if(isPending) return <Loader/>
      return (
          <section className='bg-black text-white'>
          {
            country.map((country,index)=>{
              return(
                <div className='flex flex-wrap justify-evenly size-200 gap-6 items-center m-auto 'key={index}>
                <div>
                <img className="w-60 h-40 p-2 mx-auto" src={country.flags.svg} alt={country.flags.alt} />
                </div>
                <div className='space-y-3 [&_p]:text-2xs'>
                <h1 className="text-4xl font-bold text-cyan-500 underline underline-offset-2 font-serif">{country.name.common}</h1>
                <h2 className="text-2xl font-sansl"><span className='font-bold text-gray-300'>Country Capital:</span> {country.capital}</h2>
                <p><span className='font-bold text-gray-300'>Population:</span>{country.population}</p>
                <p>(<span className='font-bold text-gray-300'>Region: </span>{country.region})</p>
                <p><span className='font-bold text-gray-300'>Car Side: </span>{country.car.side}</p>
                <p><span className='font-bold text-gray-300'>Area: </span>{country.area}</p>
                <p><span className='font-bold text-gray-300'>Continent: </span>{country.continents}</p>
                <p><span className='font-bold text-gray-300'>Subregion: </span>{country.subregion}</p>
                <p><span className='font-bold text-gray-300'>TimeZone: </span>{country.timezones}</p>
                <p><span className='font-bold text-gray-300'>Currency: </span>{Object.entries(country.currencies).map(([key, value]) => {
                  return (
                  <span key={key}>
                  {value.name} ({value.symbol})
                  </span>
                  );
                  })}</p>
                <p><span className='font-bold text-gray-300'>Languages: </span>{Object.keys(country.languages).map((key)=>country.languages[key]).join(" ,")}</p>
                <p><span className='font-bold text-gray-300'>Location: </span>{country.maps.googleMaps}</p>
                <NavLink to={"/country"}><button className='border-2 font-bold absolute right-10 text-black bg-white border-blue-600 p-1.5 rounded-2xl'>Go Back</button></NavLink>
                </div>
                </div>
              )
            })
          }
            
          </section>
      )
}
