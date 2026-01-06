import React from "react";

export default function SearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
  country,
  setCountry,
}) {
  const handleChange = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  const handleSelectionChange = (e) => {
    e.preventDefault();
    setFilter(e.target.value);
  };

  const sort = (order) => (e) => {
    e.preventDefault();
    const sortCountry = [...country].sort((a, b) => {
      return order === "asec"
        ? a.name.common.localeCompare(b.name.common)
        : b.name.common.localeCompare(a.name.common);
    });
    setCountry(sortCountry);
  };

  return (
    <section className="bg-black text-white flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between px-5 py-4 md:h-20">
      <div className="flex items-center w-full md:w-auto">
        <label
          htmlFor="search"
          className="hidden md:inline p-2 font-bold italic whitespace-nowrap">
          SEARCH:
        </label>
        <input
          type="text"
          className="w-full md:w-64 px-3 py-1 border border-white rounded-2xl bg-[#1f1f1f]"
          placeholder="Search any country..."
          value={search}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full md:w-auto justify-center">
        <select
          className="bg-black text-white px-3 py-1 border border-white rounded-2xl w-full sm:w-auto"
          value={filter}
          onChange={handleSelectionChange}>
          <option value="all">All</option>
          <option value="europe">Europe</option>
          <option value="america">America</option>
          <option value="asia">Asia</option>
          <option value="australia">Australia</option>
          <option value="oceania">Oceania</option>
        </select>

        <button
          className="border border-white px-4 py-1 rounded-2xl bg-[#1f1f1f] w-full sm:w-auto"
          onClick={sort("asec")}>
          Asc
        </button>

        <button
          className="border border-white px-4 py-1 rounded-2xl bg-[#1f1f1f] w-full sm:w-auto"
          onClick={sort("desc")}>
          Desc
        </button>
      </div>
    </section>
  );
}
