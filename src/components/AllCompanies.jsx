import { setSelectedCompany } from "@/redux/companySlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[().]/g, "")
    .replace(/--+/g, "-");
}

function AllCompanies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allCompanies = useSelector((state) => state.company.allCompanies);
  function handleCompany(company) {
    const slug = slugify(company.Company);
    dispatch(setSelectedCompany(company));
    navigate(`/marketplace/${slug}`);
  }
  return (
    <div className="lg:w-[62%] w-[90%] h-fit shadow-2xl py-5 flex flex-col lg:gap-2 items-center rounded-3xl my-5 ">
      {allCompanies.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        allCompanies.map((company, idx) => (
          <div
            onClick={() => handleCompany(company)}
            key={idx}
            className="flex gap-3 w-full px-5 py-3.5 lg:px-10 items-center hover:bg-gray-200 cursor-pointer rounded-2xl"
          >
            <img
              className="w-[30px] lg:w-[45px]"
              src={company.Domain}
            />
            <p className="text-sm lg:text-xl font-semibold">
              {company.Company}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllCompanies;
