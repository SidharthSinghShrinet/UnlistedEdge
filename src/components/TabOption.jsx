import { loadBalanceSheet } from "@/utils/balanceSheetParser";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { calculateCAGR } from "@/utils/cagr";
import CompareSection from "./CompareSection";
import {
  setProfitLossData,
  setRevenueData,
  setNetWorth,
} from "@/redux/companySlice";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#ef4444", "#0ea5e9"];
import MetricCard from "./MetricCard";
import RatioCard from "./RatioCard";
import PriceCharts from "./Pricecharts";
function TabOption({ shareholding }) {
  // console.log(shareholding);
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
  // console.log(company);
  const revenueData = useSelector((state) => state.company.revenueData);
  const profitLossData = useSelector((state) => state.company.profitLossData);
  const networth = useSelector((state) => state.company.networth);
  const dispatch = useDispatch();
  const revenueCAGR = calculateCAGR(revenueData);
  const profitCAGR = calculateCAGR(profitLossData);
  const netWorthCAGR = calculateCAGR(networth);
  let [data, setData] = useState([]);
  useEffect(() => {
    Papa.parse("/data/profit_loss_long_format.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const rows = result.data;
        const companyRows = rows.filter(
          (r) =>
            r.Company &&
            r.Company.trim().toLowerCase() ===
              company.Company.trim().toLowerCase()
        );

        // Extract rows
        const revenueRow = companyRows.find(
          (r) => r.Line_Item === "Total_Income"
        );
        const profitRow = companyRows.find((r) => r.Line_Item === "Net_Profit");

        if (!revenueRow || !profitRow) return;

        // Auto-detect fiscal year columns
        const yearKeys = Object.keys(revenueRow).filter((key) =>
          key.startsWith("FY")
        );

        // Build charts data
        const revenueData = yearKeys
          .filter((year) => revenueRow[year] !== "")
          .map((year) => ({
            year,
            value: Number(revenueRow[year]),
          }));

        const profitData = yearKeys
          .filter((year) => profitRow[year] !== "")
          .map((year) => ({
            year,
            value: Number(profitRow[year]),
          }));
        dispatch(setRevenueData(revenueData));
        dispatch(setProfitLossData(profitData));
      },
    });
  }, [company]);
  useEffect(() => {
    Papa.parse("/data/balance_sheet_company_year.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const rows = result.data;
        setData(rows);
        const companyRows = rows.filter(
          (r) =>
            r.Company &&
            r.Company.trim().toLowerCase() ===
              company.Company.trim().toLowerCase()
        );
        const formatted = companyRows
          .filter(
            (r) => r.Total_Equity_Calculated && r.Reserves_and_Equity !== ""
          )
          .map((r) => ({
            year: r.Fiscal_Year,
            value: Number(
              Number(r.Total_Equity_Calculated) + Number(r.Reserves_and_Equity)
            ).toFixed(2),
          }));
        dispatch(setNetWorth(formatted));
      },
    });
  }, [company]);

  const [balanceSheet, setBalanceSheet] = useState([]);

  useEffect(() => {
    if (!company) return;

    loadBalanceSheet(slug, company.Company)
      .then((data) => setBalanceSheet(data))
      .catch((err) => console.log(err));
  }, [company]);

  if (!company) {
    return <h1 className="text-center mt-10">Company Not Found</h1>;
  }
  const latestNetProfit = profitLossData.at(-1)?.value || 0;
  const latestRevenue = revenueData.at(-1)?.value || 0;
  const latestNetWorth = networth.at(-1)?.value || 0;

  // Balance sheet fields
  const bs = data; // we extract from CSV like revenue
  const debt = Number(bs.Total_Borrowings || 0);
  const cash = Number(bs.Cash_and_Cash_Equivalents || 0);
  const totalAssets = Number(bs.Total_Assets || 0);
  const currentAssets = Number(bs.Current_Assets || 0);
  const currentLiabilities = Number(bs.Current_Liabilities || 0);

  const EBIT = Number(bs.EBIT || 0);
  const EBITDA = Number(bs.EBITDA || 0);

  const EV = Number(company.Market_Cap_Cr) + debt - cash;

  const ratios = {
    ROE: latestNetWorth
      ? ((latestNetProfit / latestNetWorth) * 100).toFixed(2)
      : 0,
    ROCE: totalAssets
      ? ((EBIT / (totalAssets - currentLiabilities)) * 100).toFixed(2)
      : 0,
    NetProfitMargin: latestRevenue
      ? ((latestNetProfit / latestRevenue) * 100).toFixed(2)
      : 0,
    OPM: latestRevenue ? ((EBITDA / latestRevenue) * 100).toFixed(2) : 0,
    DebtToEquity: latestNetWorth ? (debt / latestNetWorth).toFixed(2) : 0,
    CurrentRatio: currentLiabilities
      ? (currentAssets / currentLiabilities).toFixed(2)
      : 0,
    EV_EBITDA: EBITDA ? (EV / EBITDA).toFixed(2) : 0,
  };
  return (
    <Tabs defaultValue="overview" className="w-full mt-6">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6 items-center justify-center w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="ratios">Ratios</TabsTrigger>
        <TabsTrigger value="shareholders">Shareholders</TabsTrigger>
        <TabsTrigger value="compare">Compare</TabsTrigger>
      </TabsList>

      {/* TAB 1: OVERVIEW */}
      <TabsContent value="overview">
        <div className="mt-6">
          {/* Put your metrics + about section here */}
          <div className="bg-white shadow p-5 rounded-xl my-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p>{company.Description || "No description available."}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <MetricCard
              label="Market Cap"
              value={company.Market_Cap_Cr}
              prefix="₹"
              suffix=" Cr"
            />
            <MetricCard label="LTP" value={company.LTP} prefix="₹" />
            <MetricCard
              label="Face Value"
              value={company.Face_Value}
              prefix="₹"
            />

            <MetricCard label="PE Ratio" value={company.PE_Ratio || "—"} />
            <MetricCard label="PB Ratio" value={company.PB_Ratio || "—"} />
            <MetricCard label="PS Ratio" value={company.PS_Ratio || "—"} />

            <MetricCard
              label="All Time High"
              value={company.All_Time_High}
              prefix="₹"
            />
            <MetricCard
              label="All Time Low"
              value={company.All_Time_Low}
              prefix="₹"
            />
            <MetricCard label="EPS" value={company.EPS || "—"} />

            <MetricCard
              label="Outstanding Shares"
              value={company.Outstanding_Shares_Cr}
              suffix=" Cr"
            />
          </div>
          <div className="bg-white shadow p-5 rounded-xl my-6">
            <h2 className="text-xl font-semibold mb-4">
              Growth Summary (CAGR)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                label="Revenue CAGR (5Y)"
                value={revenueCAGR ? revenueCAGR + "%" : "—"}
              />

              <MetricCard
                label="Profit CAGR (5Y)"
                value={profitCAGR ? profitCAGR + "%" : "—"}
              />

              <MetricCard
                label="Net Worth CAGR (5Y)"
                value={netWorthCAGR ? netWorthCAGR + "%" : "—"}
              />
            </div>
          </div>
          <div className="w-full p-1 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Quick Metrics</h2>
            <div className="grid grid-cols- md:grid-cols-3 gap-4 my-4">
              {balanceSheet.length > 0 && (
                <>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm">
                      Total Assets (Latest)
                    </p>
                    <p className="text-xl font-bold">
                      ₹{balanceSheet.at(-1).totalAssets} Cr
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm">Total Liabilities</p>
                    <p className="text-xl font-bold">
                      ₹{balanceSheet.at(-1).totalLiabilities} Cr
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm">Borrowings</p>
                    <p className="text-xl font-bold">
                      ₹{balanceSheet.at(-1).borrowings} Cr
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* TAB 2: FINANCIALS */}
      <TabsContent value="financials" className={`w-full grid grid-cols-3`}>
        <div className="bg-white shadow p-5 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Revenue Growth</h2>
          <LineChart width={600} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        <div className="bg-white shadow p-5 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Profit Trends</h2>
          <LineChart width={600} height={300} data={profitLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#16a34a"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        <div className="bg-white shadow p-5 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Net Worth</h2>
          <LineChart width={600} height={300} data={networth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#16a34a"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        <div className="bg-white shadow-2xl h-fit border-2 border-gray-200 p-5 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Price Movement</h2>
          <PriceCharts slug={slug} ltp={company.LTP} height={350} />
        </div>

        <div className="p-5 bg-white shadow rounded-xl flex h-fit w-[64.5vw] border-2">
          {/* QUICK METRICS */}
          {/* ASSETS vs LIABILITIES */}
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-2">
              Assets vs Liabilities
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={balanceSheet}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="totalAssets" fill="#2563eb" name="Assets" />
                <Bar
                  dataKey="totalLiabilities"
                  fill="#dc2626"
                  name="Liabilities"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* BORROWINGS */}
          <div className="mt-12 w-full">
            <h3 className="text-lg font-semibold mb-2">Borrowings Trend</h3>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={balanceSheet}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="borrowings"
                  stroke="#f97316"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </TabsContent>

      {/* TAB 3: RATIOS */}
      <TabsContent value="ratios">
        <h2 className="text-xl font-semibold mb-4">
          Valuation & Financial Ratios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <RatioCard
            label="PE Ratio"
            value={company.PE_Ratio}
            desc="Price to Earnings ratio — how expensive the stock is relative to earnings."
          />

          <RatioCard
            label="PB Ratio"
            value={company.PB_Ratio}
            desc="Price to Book ratio — compares market valuation with book value."
          />

          <RatioCard
            label="PS Ratio"
            value={company.PS_Ratio}
            desc="Price to Sales ratio — valuation relative to revenue per share."
          />

          <RatioCard
            label="ROE"
            value={ratios.ROE + "%"}
            desc="Return on Equity — how well the company generates profit from shareholder equity."
          />

          <RatioCard
            label="ROCE"
            value={ratios.ROCE + "%"}
            desc="Return on Capital Employed — profitability vs overall capital used."
          />

          <RatioCard
            label="Net Profit Margin"
            value={ratios.NetProfitMargin + "%"}
            desc="Percentage of revenue remaining as profit."
          />

          <RatioCard
            label="Operating Margin"
            value={ratios.OPM + "%"}
            desc="EBITDA margin — operational efficiency."
          />

          <RatioCard
            label="Debt to Equity"
            value={ratios.DebtToEquity}
            desc="Financial leverage — lower is safer."
          />

          <RatioCard
            label="Current Ratio"
            value={ratios.CurrentRatio}
            desc="Liquidity ratio — ability to pay short-term liabilities."
          />

          <RatioCard
            label="EV / EBITDA"
            value={ratios.EV_EBITDA}
            desc="Enterprise Value to EBITDA — key valuation metric."
          />
        </div>
      </TabsContent>

      {/* TAB 4: SHAREHOLDERS */}
      <TabsContent value="shareholders">
        <div className="bg-white shadow p-5 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Shareholding Pattern</h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Pie Chart */}
            <PieChart width={350} height={300}>
              <Pie
                data={shareholding}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {shareholding.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>

            {/* Shareholder Names */}
            <div className="flex-1">
              {shareholding.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 py-2 border-b"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></div>
                  <span className="font-medium">{s.type}</span>
                  <span className="ml-auto">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      {/*TAB 5: COMPARE*/}
      <TabsContent value="compare">
        <CompareSection selected={company} allCompanies={allCompanies} />
      </TabsContent>

      {/*TAB6: BALANCE SHEET*/}
    </Tabs>
  );
}

export default TabOption;
