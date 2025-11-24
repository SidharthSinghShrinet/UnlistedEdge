export function generateValuationSummary(company, ratios, cagr) {
  const { PE_Ratio, Industry_Median_PE } = company;

  let valuation = "";
  if (PE_Ratio < Industry_Median_PE * 0.7) valuation = "undervalued";
  else if (PE_Ratio > Industry_Median_PE * 1.2) valuation = "overvalued";
  else valuation = "fairly valued";

  return `
${company.Company} appears **${valuation}** with a PE ratio of **${PE_Ratio}**, compared to the industry median PE of **${Industry_Median_PE}**.

The company shows:
- **Revenue CAGR:** ${cagr.revenue}%  
- **Profit CAGR:** ${cagr.profit}%  
- **Net Worth CAGR:** ${cagr.networth}%  

Profitability ratios reflect:
- **ROE:** ${ratios.ROE}%  
- **ROCE:** ${ratios.ROCE}%  
- **Net Profit Margin:** ${ratios.NetProfitMargin}%  

Financial strength indicators:
- **Debt to Equity:** ${ratios.DebtToEquity}  
- **Current Ratio:** ${ratios.CurrentRatio}

Overall, the company demonstrates **${ratios.ROE > 15 ? "strong" : "moderate"} profitability**,  
${ratios.DebtToEquity < 0.5 ? "low leverage" : "moderate leverage"},  
and **${valuation} valuation** at current market price.
  `;
}
