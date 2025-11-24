import Papa from "papaparse";

export function loadBalanceSheet(slug, companyName) {
  return new Promise((resolve, reject) => {
    Papa.parse("/data/balance_sheet_company_year.csv", {
      download: true,
      header: true,
      complete: (res) => {
        const rows = res.data;

        // Match company
        const clean = rows.filter(
          r =>
            r.Company &&
            r.Company.trim().toLowerCase() === companyName.trim().toLowerCase()
        );

        if (!clean.length) return resolve([]);

        // Convert to clean year rows
        const output = clean.map(r => ({
          year: r.Year,
          totalAssets: Number(r.Total_Assets || 0),
          totalLiabilities: Number(r.Total_Liabilities || 0),
          netWorth: Number(r.Net_Worth || 0),
          borrowings: Number(r.Borrowings || 0),
          cash: Number(r.Cash || 0)
        }));

        resolve(output);
      },
      error: (err) => reject(err)
    });
  });
}
