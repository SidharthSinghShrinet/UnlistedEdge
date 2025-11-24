import React, { useEffect, useState } from "react";
import { SelectDemo } from "./SelectDemo";
import { useDispatch, useSelector } from "react-redux";
function SearchBar() {
  const [input, setInput] = useState("");
  let allCompanies = useSelector((state) => state.company.allCompanies);
  let [selectedCompanies,setSelectedCompanies] = useState([]);
  useEffect(() => {
    if (input.trim() === "") {
      if (selectedCompanies.length !== allCompanies.length) {
        setSelectedCompanies(allCompanies);
      }
      return;
    }
    let filteredCompany = allCompanies.filter(
      (ele) =>
        ele.Company.toLowerCase().includes(input.toLowerCase())
    );
    setSelectedCompanies(filteredCompany);
  }, [input]);
  return (
    <form className="w-full flex justify-center items-center py-3 lg:py-6 gap-2 lg:gap-2 bg-gray-200">
      <input
        type="search"
        name="search"
        placeholder="Search Companies..."
        id="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-1/2 h-[38px] rounded-4xl text-md text-gray-500 bg-white  shadow-2xl tracking-wider font-semibold px-3 border-[0.5px] border-gray-300 outline-0"
      />
      <SelectDemo />
    </form>
  );
}

export default SearchBar;
