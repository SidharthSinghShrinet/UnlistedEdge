export function calculateCAGR(data) {
  if (!data || data.length < 2) return null;

  const start = data[0].value;
  const end = data[data.length - 1].value;
  const years = data.length - 1;

  if (!start || !end || start === 0) return null;

  const cagr = (end / start) ** (1 / years) - 1;

  return (cagr * 100).toFixed(2); // percentage
}
    