import {NavLink} from 'react-router-dom'
export const Countrycard=(({country})=>{
    return (

        <div className="bg-gradient-to-bl flex flex-col from-blue-600 items-center to-emerald-400 text-white p-2 my-1.5 size-100 space-y-1.5 rounded-2xl border-2 border-red-700 shadow-2xs text-center shadow-yellow-500">
            <img className="w-50 h-30 p-2 mx-auto" src={country.flags.svg} alt={country.name.official} />
            <h1 className="text-3xl font-bold text-black underline underline-offset-2 font-serif">{country.name.common.length>=15?country.name.common.slice(0,14)+'...':country.name.common}</h1>
            <h2 className=" font-sansl">Country Capital: {country.capital}</h2>
            <p>Population:{country.population}</p>
            <p>(Region:{country.region})</p>
            <p>Car Side: {country.car.side}</p>
            <p>Area: {country.area}</p>
            <div className="flex justify-end w-full mt-3">
            <NavLink to={`/country/${country.name.common}`}><button className='border-2 font-bold text-black bg-white border-blue-600 p-1.5 rounded-2xl'>Read More</button></NavLink>
            </div>
        </div>
 
    )}
)