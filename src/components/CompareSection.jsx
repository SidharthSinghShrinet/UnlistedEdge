import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function CompareSection({ selected, allCompanies }) {
  const [selectedCompanies, setSelectedCompanies] = useState([
    selected.Company,
  ]);

  function toggleCompany(companyName) {
    setSelectedCompanies((prev) =>
      prev.includes(companyName)
        ? prev.filter((name) => name !== companyName)
        : [...prev, companyName]
    );
  }

  const compareData = allCompanies
    .filter((c) => selectedCompanies.includes(c.Company))
    .map((c) => ({
      name: c.Company,
      marketCap: Number(c.Market_Cap_Cr),
      ltp: Number(c.LTP),
      pe: Number(c.PE_Ratio || 0),
      pb: Number(c.PB_Ratio || 0),
      ps: Number(c.PS_Ratio || 0),
    }));

  return (
    <div className="p-4">
      {/* Company Selector */}
      <h2 className="text-xl font-semibold mb-3">Compare Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {allCompanies.map((c, i) => (
          <label key={i} className="flex gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCompanies.includes(c.Company)}
              onChange={() => toggleCompany(c.Company)}
            />
            <span>{c.Company}</span>
          </label>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-auto mb-8">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Market Cap (Cr)</th>
              <th className="p-2 border">LTP</th>
              <th className="p-2 border">PE</th>
              <th className="p-2 border">PB</th>
              <th className="p-2 border">PS</th>
            </tr>
          </thead>
          <tbody>
            {compareData.map((c, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.marketCap}</td>
                <td className="p-2 border">{c.ltp}</td>
                <td className="p-2 border">{c.pe}</td>
                <td className="p-2 border">{c.pb}</td>
                <td className="p-2 border">{c.ps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Cap Comparison Chart */}
      <h2 className="text-lg font-semibold mb-2">Market Cap Comparison</h2>
      <BarChart width={600} height={300} data={compareData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="marketCap" fill="#4f46e5" />
      </BarChart>
    </div>
  );
}
