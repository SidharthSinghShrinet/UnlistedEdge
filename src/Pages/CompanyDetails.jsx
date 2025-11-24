import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TabOption from "@/components/TabOption";

export default function CompanyDetailsPage() {
  const shareholdingPatterns = {
    "API Holdings Limited": [
      { type: "Promoters", value: 58 },
      { type: "Private Equity", value: 32 },
      { type: "Employees (ESOP)", value: 5 },
      { type: "Others", value: 5 },
    ],

    "Apollo Green Energy Limited": [
      { type: "Promoters", value: 74 },
      { type: "Retail", value: 12 },
      { type: "Institutions", value: 9 },
      { type: "Others", value: 5 },
    ],

    "BILLIONBRAINS GARAGE VENTURES LIMITED (Groww)": [
      { type: "Founders", value: 35 },
      { type: "Tiger Global", value: 22 },
      { type: "Ribbit Capital", value: 16 },
      { type: "Sequoia Capital", value: 14 },
      { type: "Others", value: 13 },
    ],

    "CHENNAI SUPER KINGS CRICKET LIMITED": [
      { type: "India Cements", value: 59.9 },
      { type: "Public", value: 40.1 },
    ],

    "METROPOLITAN STOCK EXCHANGE OF INDIA LIMITED": [
      { type: "Promoters", value: 35 },
      { type: "Institutions", value: 28 },
      { type: "Banks", value: 20 },
      { type: "Public", value: 17 },
    ],

    "National Commodity & Derivatives Exchange Ltd. (NCDEX)": [
      { type: "LIC", value: 11.1 },
      { type: "NABARD", value: 17.4 },
      { type: "IEX", value: 5.6 },
      { type: "Others", value: 65.9 },
    ],

    "National Stock Exchange Ltd. (NSE)": [{ type: "Promoters", value: 100 }],

    "Oravel Stays Limited (OYO )": [
      { type: "Softbank", value: 46 },
      { type: "Founder (Ritesh Agarwal)", value: 33 },
      { type: "Lightspeed", value: 14 },
      { type: "Others", value: 7 },
    ],

    "SBI FUNDS MANAGEMENT LIMITED": [
      { type: "SBI Capital", value: 63 },
      { type: "AMUNDI", value: 37 },
    ],

    "Vivriti Capital": [
      { type: "Promoters", value: 51 },
      { type: "Private Equity", value: 32 },
      { type: "Institutions", value: 10 },
      { type: "Others", value: 7 },
    ],
  }; 
  const { slug } = useParams();

  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[().]/g, "")
      .replace(/--+/g, "-");
  }

  const allCompanies = useSelector((state) => state.company.allCompanies);
  const company = allCompanies.find((c) => slugify(c.Company) === slug);

  const shareholding = shareholdingPatterns[company.Company] || 0;
  // console.log(shareholding); 
  // console.log(company)
  return (
    <>
      <div className="w-fit mx-auto p-6">
        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6">
          <img
            src={company.Domain}
            className="w-16 h-16 rounded"
            onError={(e) => (e.target.src = "/fallback-logo.png")}
            alt={company.Company}
          />
          <div>
            <h1 className="text-3xl font-bold">{company.Company}</h1>
            <p className="text-gray-600">{company.Sector}</p>
          </div>
        </div>
        <div className="w-full">
          <TabOption shareholding={shareholding}/>
        </div>
      </div>
    </>
  );
}
