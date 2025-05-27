import {NavLink} from 'react-router-dom'
export const Countrycard=(({country})=>{

return (
  <div className="bg-gradient-to-bl flex flex-col justify-between items-center text-white from-blue-600 to-emerald-400 p-2 my-1.5 rounded-2xl border-2 border-red-700 shadow-2xs shadow-yellow-500 text-center space-y-1.5 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl min-h-[430px]">
  <img
    className="w-full h-auto max-h-40 object-contain p-2 mx-auto"
    src={country.flags.svg}
    alt={country.name.official}
  />
  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black underline underline-offset-2 font-serif">
    {country.name.common.length >= 15 ? country.name.common.slice(0, 14) + '...' : country.name.common}
  </h1>
  <h2 className="font-sans text-sm sm:text-base truncate w-full">Country Capital: {country.capital}</h2>
  <p className="text-sm sm:text-base">Population: {country.population}</p>
  <p className="text-sm sm:text-base">(Region: {country.region})</p>
  <p className="text-sm sm:text-base">Car Side: {country.car.side}</p>
  <p className="text-sm sm:text-base">Area: {country.area}</p>

  <div className="flex justify-end w-full mt-auto pt-3">
    <NavLink to={`/country/${country.name.common}`}>
      <button className="border-2 font-bold text-black bg-white border-blue-600 p-1.5 rounded-2xl text-sm sm:text-base">
        Read More
      </button>
    </NavLink>
  </div>
</div>
);
}
)