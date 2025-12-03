import React, { useEffect, useState, useTransition } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getIndData } from "../../api/postApi";
import Loader from "../ui/Loader";

export default function CountryDetail() {
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = useState([]);

  useEffect(() => {
    startTransition(async () => {
      const res = await getIndData(params.id);
      if (res.status === 200) setCountry(res.data);
    });
  }, []);

  if (isPending) return <Loader />;

  return (
    <section className="bg-black text-white px-4 py-8">
      {country.map((country, index) => {
        return (
          <div
            key={index}
            className="
              flex flex-col lg:flex-row 
              items-center justify-center 
              gap-10 lg:gap-20 
              max-w-6xl mx-auto
            ">
            {/* Image */}
            <div className="flex justify-center">
              <img
                className="w-60 h-40 sm:w-72 sm:h-48 lg:w-96 lg:h-64 object-cover p-2 rounded-lg shadow-lg"
                src={country.flags.svg}
                alt={country.flags.alt}
              />
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm sm:text-base lg:text-lg max-w-[600px]">
              <h1 className="text-3xl sm:text-4xl font-bold text-cyan-500 underline underline-offset-4 font-serif">
                {country.name.common}
              </h1>

              <p>
                <span className="font-bold text-gray-300">Capital:</span>{" "}
                {country.capital}
              </p>
              <p>
                <span className="font-bold text-gray-300">Population:</span>{" "}
                {country.population}
              </p>
              <p>
                <span className="font-bold text-gray-300">Region:</span>{" "}
                {country.region}
              </p>
              <p>
                <span className="font-bold text-gray-300">Car Side:</span>{" "}
                {country.car.side}
              </p>
              <p>
                <span className="font-bold text-gray-300">Area:</span>{" "}
                {country.area}
              </p>
              <p>
                <span className="font-bold text-gray-300">Continent:</span>{" "}
                {country.continents}
              </p>
              <p>
                <span className="font-bold text-gray-300">Subregion:</span>{" "}
                {country.subregion}
              </p>
              <p>
                <span className="font-bold text-gray-300">TimeZones:</span>{" "}
                {country.timezones}
              </p>

              <p>
                <span className="font-bold text-gray-300">Currency:</span>{" "}
                {Object.entries(country.currencies).map(([key, value]) => (
                  <span key={key}>
                    {value.name} ({value.symbol})
                  </span>
                ))}
              </p>

              <p>
                <span className="font-bold text-gray-300">Languages:</span>{" "}
                {Object.values(country.languages).join(", ")}
              </p>

              <p className="break-all">
                <span className="font-bold text-gray-300">Location:</span>{" "}
                <NavLink
                  className="text-blue-400 underline"
                  to={country.maps.googleMaps}>
                  {country.maps.googleMaps}
                </NavLink>
              </p>

              {/* Go Back button */}
              <NavLink to={"/country"}>
                <button className="border-2 font-semibold mt-4 text-black bg-white border-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100">
                  Go Back
                </button>
              </NavLink>
            </div>
          </div>
        );
      })}
    </section>
  );
}
