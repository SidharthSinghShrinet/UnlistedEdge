import { TrendingUp, TrendingDown, Info } from "lucide-react";

export default function RatioCard({ label, value, desc }) {
  const numeric = parseFloat(value);

  // Auto-color logic
  const isGood = numeric && numeric > 0;
  const isBad = numeric && numeric < 0;

  const color = isGood ? "text-green-600" : isBad ? "text-red-600" : "text-gray-700";
  const icon = isGood ? <TrendingUp className="text-green-600" /> : isBad ? <TrendingDown className="text-red-600" /> : null;

  return (
    <div className="p-5 bg-white rounded-xl shadow hover:shadow-xl transition-all border border-gray-200 relative">

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm font-medium">{label}</p>

        <div className="group relative">
          <Info size={16} className="text-gray-400 cursor-pointer" />
          <span className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded-lg w-44 right-0 z-30">
            {desc}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {icon}
        <p className={`text-2xl font-bold ${color}`}>
          {value || "—"}
        </p>
      </div>

    </div>
  );
}
