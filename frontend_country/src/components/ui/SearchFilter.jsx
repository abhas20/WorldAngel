import React from 'react'

export default function SearchFilter({search,setSearch,filter,setFilter,country,setCountry}) {
  const handleChange=(event)=>{
    event.preventDefault();
      setSearch(event.target.value);
  }
  const handleSelectionChange=(e)=>{
    e.preventDefault();
    setFilter(e.target.value);
}
  const sort=(order)=>(e)=>{
    e.preventDefault();
    const sortCountry=[...country].sort((a,b)=>{
      return (order==='asec'?a.name.common.localeCompare(b.name.common):b.name.common.localeCompare(a.name.common))
    })
    setCountry(sortCountry)
  }

  return (
    <section className='bg-black text-white flex align-middle justify-evenly items-center px-5 p-3 h-20'> 
    <div>
      <label htmlFor="search" className='p-2 font-bold italic'>SEARCH:  </label>
      <input type="text" className='px-3 border border-white rounded-2xl bg-[#1f1f1f]' placeholder='search' value={search} onChange={handleChange} />
    </div>
      <div className='flex justify-evenly space-x-5 '>
        <select className="bg-black text-white px-2 border border-white rounded-2xl" value={filter} onChange={handleSelectionChange} >
          <option value="all">All</option>
          <option value="europe">Europe</option>
          <option value="america">America</option>
          <option value="asia">Asia</option>
          <option value="australia">Australia</option>
          <option value="oceania">Oceania</option>
        </select>
        <button className='border border-white px-2 rounded-2xl bg-[#1f1f1f]' onClick={sort('asec')}>Aesc</button>
      <button className='border border-white px-2 rounded-2xl bg-[#1f1f1f]' onClick={sort('desc')}>Desc</button>
      </div>
      
    </section>
  )
}
