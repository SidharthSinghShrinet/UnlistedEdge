export default function MetricCard({ label, value, prefix = "", suffix = "" }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow flex flex-col">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold">
        {prefix}{value}{suffix}
      </p>
    </div>
  );
}
