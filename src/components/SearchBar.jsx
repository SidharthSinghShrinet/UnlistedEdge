import React, { useEffect, useState } from "react";
import { SelectDemo } from "./SelectDemo";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedCompanies } from "@/redux/companySlice";
function SearchBar() {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  let searchedCompanies = useSelector(
    (state) => state.company.searchedCompanies
  );
  let allCompanies = useSelector((state) => state.company.allCompanies);
  useEffect(() => {
    if (input.trim() === "" && allCompanies.length) {
      if(searchedCompanies.length!==allCompanies.length){
        dispatch(setSearchedCompanies(allCompanies));
      }
      return;
    }
    let filteredCompany = allCompanies.filter((ele) => {
      return ele.Company.toLowerCase().includes(input.toLowerCase());
    });
    dispatch(setSearchedCompanies(filteredCompany));
  }, [input,allCompanies]);
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
