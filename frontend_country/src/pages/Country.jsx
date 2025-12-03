import React, { useEffect, useState, useTransition } from 'react'
import { getData } from '../api/postApi';
import Loader from '../components/ui/Loader'
import { Countrycard } from '../components/layout/CountryCard';
import SearchFilter from '../components/ui/SearchFilter';

export default function Country() {
  const [isPending,startTrasition]=useTransition();
  const [countries,setCountry]=useState([]);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  
  useEffect(()=>{
    startTrasition(async()=>{
      const res=await getData();
      // console.log(res.data)
      setCountry(res.data)
    })
  },[])
  if(isPending) return <Loader/>
  
  const filterCountries=countries.filter((country)=>{
      if(search==="" && filter==="all")return true
      else if(search==="" && filter!=="all")return country.region.toLowerCase().includes(filter)
      else if(search!=="" && filter==="all")return country.name.common.toLowerCase().includes(search.toLowerCase())
      else return country.name.common.toLowerCase().includes(search.toLowerCase())&&country.region.toLowerCase().includes(filter)
      
  })
  return (
    <section>
      <SearchFilter 
      search={search}
      setSearch={setSearch}
      filter={filter}
      setFilter={setFilter}
      country={countries}
      setCountry={setCountry}
      />
      <ul className='flex flex-wrap justify-evenly bg-black p-2 pt-5 gap-2'>
        {filterCountries.map((currCountry,index)=>{
              return (
              <li className='lg:w-1/4 ml-1.5 md:w:1/3 sm:w:1/2 w-full' key={index}>
                <Countrycard country={currCountry} />
                </li>
              )
        })}
      </ul>
    </section>
  )
}
