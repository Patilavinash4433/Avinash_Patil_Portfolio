import { useState, useRef } from 'react';
import { 
  Calculator, DollarSign, Percent, TrendingUp, Landmark, LandmarkIcon, Plus, Trash2, Download, Printer, ArrowRight, BookOpen, BarChart3, HelpCircle 
} from 'lucide-react';

export default function BusinessTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'roi-calc');

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full text-white">
      {/* Sidebar Tool List */}
      {!hideSidebar && (
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
          {[
            { id: 'roi-calc', label: 'ROI Calculator' },
            { id: 'margin-calc', label: 'Profit Margin' },
            { id: 'gst-calc', label: 'GST Calculator' },
            { id: 'breakeven', label: 'Break-even Calc' },
            { id: 'emi-calc', label: 'EMI Calculator' },
            { id: 'revenue-forecast', label: 'Revenue Forecast' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold text-left whitespace-nowrap cursor-pointer transition-all border ${
                activeTool === t.id
                  ? 'border-teal-500 bg-teal-500/10 text-white shadow-md'
                  : 'border-transparent text-white/55 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Tool Workspace Canvas */}
      <div className="flex-1 bg-[#141418]/30 backdrop-blur-md rounded-2xl border border-white/5 p-6 min-h-[500px]">
        {activeTool === 'roi-calc' && <RoiCalculatorTool />}
        {activeTool === 'margin-calc' && <MarginCalculatorTool />}
        {activeTool === 'gst-calc' && <GstCalculatorTool />}
        {activeTool === 'breakeven' && <BreakevenCalculatorTool />}
        {activeTool === 'emi-calc' && <EmiCalculatorTool />}
        {activeTool === 'revenue-forecast' && <RevenueForecastTool />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(",")].concat(rows.map(e => e.join(","))).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ========================================================================== */
/* 1. ROI Calculator with SVG Chart                                           */
/* ========================================================================== */
function RoiCalculatorTool() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [horizon, setHorizon] = useState(15);
  const [rateOfReturn, setRateOfReturn] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [showSchedule, setShowSchedule] = useState(false);

  // Growth Calculations
  const r = rateOfReturn / 100;
  const inf = inflationRate / 100;
  const monthlyRate = r / 12;
  const numMonths = horizon * 12;

  let totalInvested = initialInvestment;
  let futureValue = initialInvestment;
  let inflationAdjustedValue = initialInvestment;

  const annualProjections: any[] = [];

  for (let yr = 1; yr <= horizon; yr++) {
    const monthsThisYear = 12;
    for (let m = 1; m <= monthsThisYear; m++) {
      // Nominal Future Value calculation
      futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;

      // Real value (inflation adjusted) calculation
      // Discount factor for this specific month
      const totalMonthsElapsed = (yr - 1) * 12 + m;
      const inflationDiscount = Math.pow(1 + inf / 12, totalMonthsElapsed);
      inflationAdjustedValue = futureValue / inflationDiscount;
    }

    annualProjections.push({
      year: yr,
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      inflationAdjustedValue: Math.round(inflationAdjustedValue),
      profit: Math.round(futureValue - totalInvested)
    });
  }

  const finalValue = futureValue;
  const finalRealValue = inflationAdjustedValue;
  const finalProfit = finalValue - totalInvested;
  const absoluteRoi = totalInvested > 0 ? (finalProfit / totalInvested) * 100 : 0;

  // Chart data normalization for SVG Area plotting
  const maxChartValue = Math.max(...annualProjections.map(p => p.futureValue), 10000);
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = 500;
  const chartHeight = 200;
  const widthPerYear = (chartWidth - paddingX * 2) / Math.max(1, horizon - 1);

  // Generate points for SVG paths
  const getSvgPoints = (key: 'totalInvested' | 'futureValue' | 'inflationAdjustedValue') => {
    return annualProjections.map((proj, idx) => {
      const x = paddingX + idx * widthPerYear;
      const y = chartHeight - paddingY - (proj[key] / maxChartValue) * (chartHeight - paddingY * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  const investedPoints = getSvgPoints('totalInvested');
  const nominalPoints = getSvgPoints('futureValue');
  const realPoints = getSvgPoints('inflationAdjustedValue');

  const exportCSVReport = () => {
    const headers = ["Year", "Total Contributions (INR)", "Nominal Future Value (INR)", "Inflation Adjusted Real Value (INR)", "Net Gain (INR)"];
    const rows = annualProjections.map(p => [
      `Year ${p.year}`,
      p.totalInvested.toString(),
      p.futureValue.toString(),
      p.inflationAdjustedValue.toString(),
      p.profit.toString()
    ]);
    downloadCSV(headers, rows, "roi_investment_forecast.csv");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-wider">
            <DollarSign size={20} /> ROI & Wealth Forecaster
          </h3>
          <p className="text-xs text-white/50">Simulate periodic compounding, calculate inflation impacts, and visualize long-term wealth curves.</p>
        </div>
        <button
          onClick={exportCSVReport}
          className="flex items-center gap-2 self-start sm:self-center px-4 py-2 text-xs font-bold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 rounded-xl transition-all cursor-pointer"
        >
          <Download size={14} /> Export Report (CSV)
        </button>
      </div>

      {/* Sliders Input Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        {/* Row 1 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Initial Capital</span>
            <span className="font-bold text-white">{formatCurrency(initialInvestment)}</span>
          </div>
          <input 
            type="range" min="0" max="1000000" step="10000" value={initialInvestment} 
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
          />
          <div className="relative">
            <span className="absolute left-3 top-2 text-white/30 text-xs">₹</span>
            <input 
              type="number" value={initialInvestment} 
              onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-white outline-none focus:border-teal-500" 
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Monthly Contribution</span>
            <span className="font-bold text-white">{formatCurrency(monthlyContribution)}</span>
          </div>
          <input 
            type="range" min="0" max="100000" step="1000" value={monthlyContribution} 
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
          />
          <div className="relative">
            <span className="absolute left-3 top-2 text-white/30 text-xs">₹</span>
            <input 
              type="number" value={monthlyContribution} 
              onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-white outline-none focus:border-teal-500" 
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Investment Period</span>
            <span className="font-bold text-white">{horizon} Years</span>
          </div>
          <input 
            type="range" min="1" max="40" step="1" value={horizon} 
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
          />
          <input 
            type="number" value={horizon} 
            onChange={(e) => setHorizon(Math.max(1, Math.min(40, Number(e.target.value))))}
            className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500" 
          />
        </div>

        {/* Row 2 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Expected Annual Return</span>
            <span className="font-bold text-teal-400">{rateOfReturn}% CAGR</span>
          </div>
          <input 
            type="range" min="1" max="30" step="0.5" value={rateOfReturn} 
            onChange={(e) => setRateOfReturn(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
          />
          <input 
            type="number" step="0.1" value={rateOfReturn} 
            onChange={(e) => setRateOfReturn(Math.max(0, Number(e.target.value)))}
            className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500" 
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Expected Inflation Rate</span>
            <span className="font-bold text-amber-500">{inflationRate}% / Year</span>
          </div>
          <input 
            type="range" min="0" max="15" step="0.5" value={inflationRate} 
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
          />
          <input 
            type="number" step="0.1" value={inflationRate} 
            onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
            className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500" 
          />
        </div>

        <div className="bg-teal-950/20 border border-teal-500/10 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-teal-400 uppercase font-black tracking-widest mb-1">Inflation Adjuster</span>
          <p className="text-[11px] text-white/50 leading-relaxed font-normal">
            Calculates what your money will actually be worth in future terms by discounting at a {inflationRate}% inflation factor.
          </p>
        </div>
      </div>

      {/* Analytics KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Total Invested</span>
          <span className="text-sm md:text-base font-black text-white">{formatCurrency(totalInvested)}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Future Portfolio Value</span>
          <span className="text-sm md:text-base font-black text-green-400">{formatCurrency(finalValue)}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Est. Profit (Gain)</span>
          <span className="text-sm md:text-base font-black text-teal-400">+{formatCurrency(finalProfit)}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center col-span-2 md:col-span-1">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Real Value (Inflation Adj)</span>
          <span className="text-sm md:text-base font-black text-amber-500">{formatCurrency(finalRealValue)}</span>
        </div>
      </div>

      {/* SVG Growth Chart */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">Portfolio Valuation Curve</span>
          <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-wider font-extrabold">
            <span className="flex items-center gap-1.5 text-white/40"><span className="h-2 w-2 rounded bg-white/30"></span> Invested</span>
            <span className="flex items-center gap-1.5 text-teal-400"><span className="h-2 w-2 rounded bg-teal-500"></span> Nom. Value</span>
            <span className="flex items-center gap-1.5 text-amber-500"><span className="h-2 w-2 rounded bg-amber-500"></span> Real Value</span>
          </div>
        </div>
        
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              return (
                <line 
                  key={idx} 
                  x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} 
                  stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4"
                />
              );
            })}
            
            {/* Shaded Area Paths */}
            {nominalPoints && (
              <path 
                d={`M ${paddingX},${chartHeight - paddingY} L ${nominalPoints} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`} 
                fill="url(#teal-grad)" opacity="0.1" 
              />
            )}
            {realPoints && (
              <path 
                d={`M ${paddingX},${chartHeight - paddingY} L ${realPoints} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`} 
                fill="url(#amber-grad)" opacity="0.05" 
              />
            )}

            {/* Line Plots */}
            <polyline fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" points={investedPoints} />
            <polyline fill="none" stroke="#0D9488" strokeWidth="2.5" points={nominalPoints} />
            <polyline fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3" points={realPoints} />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="teal-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="amber-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Labels */}
            <text x={paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">Yr 0</text>
            <text x={chartWidth - paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">Yr {horizon}</text>
          </svg>
        </div>
      </div>

      {/* Projection Breakdown Table */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
        <button 
          onClick={() => setShowSchedule(!showSchedule)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white hover:text-teal-400 transition-colors cursor-pointer"
        >
          <span>View Year-by-Year Growth Table</span>
          <span>{showSchedule ? 'Collapse [-]' : 'Expand [+]'}</span>
        </button>

        {showSchedule && (
          <div className="overflow-x-auto max-h-72 mt-4 scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[9px] uppercase tracking-wider">
                  <th className="py-2">Year</th>
                  <th className="py-2 text-right">Contributions</th>
                  <th className="py-2 text-right">Future Value (Nominal)</th>
                  <th className="py-2 text-right">Real Value (Inflation Adj)</th>
                  <th className="py-2 text-right">Cumulative Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {annualProjections.map((p, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-white/60 font-semibold">Year {p.year}</td>
                    <td className="py-2 text-right text-white/80">{formatCurrency(p.totalInvested)}</td>
                    <td className="py-2 text-right text-green-400 font-bold">{formatCurrency(p.futureValue)}</td>
                    <td className="py-2 text-right text-amber-500 font-semibold">{formatCurrency(p.inflationAdjustedValue)}</td>
                    <td className="py-2 text-right text-teal-400 font-semibold">+{formatCurrency(p.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 2. Profit Margin & Pricing Strategy Generator                             */
/* ========================================================================== */
function MarginCalculatorTool() {
  const [cogs, setCogs] = useState(250);
  const [price, setPrice] = useState(400);
  const [fixedOverhead, setFixedOverhead] = useState(40000);
  const [salesVolume, setSalesVolume] = useState(300);

  // Sync pricing values
  const handleMarginChange = (marginPct: number) => {
    const val = marginPct / 100;
    if (val >= 1) return;
    const computedPrice = cogs / (1 - val);
    setPrice(Math.round(computedPrice));
  };

  const profit = Math.max(0, price - cogs);
  const marginRatio = price > 0 ? profit / price : 0;
  const margin = marginRatio * 100;
  const markup = cogs > 0 ? (profit / cogs) * 100 : 0;

  // Monthly Business Analysis
  const monthlyRevenue = price * salesVolume;
  const totalVariableCost = cogs * salesVolume;
  const monthlyEbitda = Math.max(-fixedOverhead, monthlyRevenue - totalVariableCost - fixedOverhead);
  const operatingMargin = monthlyRevenue > 0 ? (monthlyEbitda / monthlyRevenue) * 100 : 0;

  // Visual Splits for stacked bar representation
  const revenueVal = Math.max(1, monthlyRevenue);
  const cogsShare = (totalVariableCost / revenueVal) * 100;
  const opexShare = (fixedOverhead / revenueVal) * 100;
  const profitShare = Math.max(0, 100 - cogsShare - opexShare);

  // Pricing Benchmarks
  const benchmarks = [
    { label: 'Low-Margin Tier (15%)', pct: 15 },
    { label: 'Standard Retail (25%)', pct: 25 },
    { label: 'High Value Brand (35%)', pct: 35 },
    { label: 'Premium Luxury (50%)', pct: 50 },
    { label: 'Super-Premium (75%)', pct: 75 }
  ].map((tier) => {
    const suggestedPrice = cogs / (1 - tier.pct / 100);
    const unitProfit = suggestedPrice - cogs;
    const estMonthlyProfit = (unitProfit * salesVolume) - fixedOverhead;
    return {
      ...tier,
      price: Math.round(suggestedPrice),
      monthlyProfit: Math.round(estMonthlyProfit)
    };
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-wider">
          <Percent size={20} /> Profit Margin & Pricing Architect
        </h3>
        <p className="text-xs text-white/50">Analyze gross margins vs unit markup rates, calculate operating profit margins, and model Pricing tiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="space-y-4">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Unit Economics Sliders</span>

          {/* Unit Cost */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Cost of Goods Sold (COGS)</span>
              <span className="font-bold text-white">{formatCurrency(cogs)}</span>
            </div>
            <input 
              type="range" min="10" max="5000" step="10" value={cogs} 
              onChange={(e) => setCogs(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
            <input 
              type="number" value={cogs} 
              onChange={(e) => setCogs(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Retail Selling Price</span>
              <span className="font-bold text-white">{formatCurrency(price)}</span>
            </div>
            <input 
              type="range" min={cogs} max={cogs * 10} step="10" value={price} 
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
            <input 
              type="number" value={price} 
              onChange={(e) => setPrice(Math.max(cogs, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
            />
          </div>

          {/* Target Margin Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Adjust Price by Target Margin %</span>
              <span className="font-bold text-teal-400">{margin.toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="1" max="95" step="1" value={margin} 
              onChange={(e) => handleMarginChange(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Operational Volumes</span>

          {/* Monthly Overhead */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Fixed Monthly Overheads</span>
              <span className="font-bold text-white">{formatCurrency(fixedOverhead)}</span>
            </div>
            <input 
              type="range" min="1000" max="500000" step="5000" value={fixedOverhead} 
              onChange={(e) => setFixedOverhead(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
            <input 
              type="number" value={fixedOverhead} 
              onChange={(e) => setFixedOverhead(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
            />
          </div>

          {/* Monthly Sales Volume */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Expected Sales Volume (Units)</span>
              <span className="font-bold text-white">{salesVolume.toLocaleString()} Units</span>
            </div>
            <input 
              type="range" min="1" max="10000" step="50" value={salesVolume} 
              onChange={(e) => setSalesVolume(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
            <input 
              type="number" value={salesVolume} 
              onChange={(e) => setSalesVolume(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Gross vs Operating Margin Output Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Gross Profit / Unit</span>
          <span className="text-base font-black text-green-400">{formatCurrency(profit)}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Gross profit margin</span>
          <span className="text-base font-black text-teal-400">{margin.toFixed(1)}%</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Gross Markup Rate</span>
          <span className="text-base font-black text-purple-400">{markup.toFixed(1)}%</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Operating Profit (EBITDA)</span>
          <span className={`text-base font-black ${monthlyEbitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {monthlyEbitda >= 0 ? '+' : ''}{formatCurrency(monthlyEbitda)}
          </span>
        </div>
      </div>

      {/* Stacked Revenue Breakdown Bar */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-white/60 block">Monthly Revenue Split Breakdown</span>
        <div className="h-6 w-full rounded-full bg-white/5 flex overflow-hidden border border-white/10 text-[9px] uppercase font-extrabold">
          {cogsShare > 0 && (
            <div className="h-full bg-red-500/20 text-red-300 flex items-center justify-center border-r border-white/10" style={{ width: `${cogsShare}%` }}>
              COGS ({cogsShare.toFixed(0)}%)
            </div>
          )}
          {opexShare > 0 && (
            <div className="h-full bg-orange-500/20 text-orange-300 flex items-center justify-center border-r border-white/10" style={{ width: `${Math.min(100 - cogsShare, opexShare)}%` }}>
              OpEx ({opexShare.toFixed(0)}%)
            </div>
          )}
          {profitShare > 0 && (
            <div className="h-full bg-green-500/20 text-green-300 flex items-center justify-center" style={{ width: `${profitShare}%` }}>
              Operating Profit ({profitShare.toFixed(0)}%)
            </div>
          )}
        </div>
      </div>

      {/* Pricing Recommendations Matrix */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-white/60 block">Target Margin Pricing Benchmarks</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[9px] uppercase tracking-wider">
                <th className="py-2">Margin Tier</th>
                <th className="py-2 text-right">Target Margin</th>
                <th className="py-2 text-right">Suggested Retail Price</th>
                <th className="py-2 text-right">Est. Monthly Profit (at {salesVolume} Vol)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold">
              {benchmarks.map((tier, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-2 text-white/80">{tier.label}</td>
                  <td className="py-2 text-right text-teal-400 font-bold">{tier.pct}%</td>
                  <td className="py-2 text-right text-white font-bold">{formatCurrency(tier.price)}</td>
                  <td className={`py-2 text-right font-black ${tier.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tier.monthlyProfit >= 0 ? '+' : ''}{formatCurrency(tier.monthlyProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 3. GST Tax & Billing Invoice Generator                                     */
/* ========================================================================== */
interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  gstRate: number;
}

function GstCalculatorTool() {
  const [calcMode, setCalcMode] = useState<'calculator' | 'invoice'>('invoice');
  const [simpleAmount, setSimpleAmount] = useState(10000);
  const [simpleGstRate, setSimpleGstRate] = useState(18);

  // Billing Invoice States
  const [companyName, setCompanyName] = useState('Avinash Analytics & BI Services');
  const [clientName, setClientName] = useState('Acme Corporate Ltd');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', name: 'Power BI Dashboard Design', price: 15000, qty: 1, gstRate: 18 },
    { id: '2', name: 'SQL Query Performance Optimization', price: 8500, qty: 2, gstRate: 18 },
    { id: '3', name: 'Advanced Excel Team Training Session', price: 12000, qty: 1, gstRate: 12 }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(5000);
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemGstRate, setNewItemGstRate] = useState(18);

  const printAreaRef = useRef<HTMLDivElement>(null);

  // Simple Mode Calculations
  const simpleGstAdded = simpleAmount * (simpleGstRate / 100);
  const simpleTotalAdded = simpleAmount + simpleGstAdded;
  const simpleBaseRemoved = simpleAmount * (100 / (100 + simpleGstRate));
  const simpleGstRemoved = simpleAmount - simpleBaseRemoved;

  // Invoice Mode Calculations
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: newItemPrice,
      qty: newItemQty,
      gstRate: newItemGstRate
    };
    setInvoiceItems([...invoiceItems, newItem]);
    setNewItemName('');
  };

  const handleDeleteItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  // Calculate invoice sums
  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let invoiceGstTotal = 0;

  invoiceItems.forEach(item => {
    const itemSub = item.price * item.qty;
    const itemGst = itemSub * (item.gstRate / 100);
    subtotal += itemSub;
    invoiceGstTotal += itemGst;
    cgstTotal += itemGst / 2;
    sgstTotal += itemGst / 2;
  });

  const grandTotal = subtotal + invoiceGstTotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-wider">
            <Calculator size={20} /> GST Calculator & Invoice Generator
          </h3>
          <p className="text-xs text-white/50">Run standard tax slab conversions or compile client invoices with localized GST tax splits.</p>
        </div>
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/5 shrink-0">
          <button
            onClick={() => setCalcMode('calculator')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg cursor-pointer transition-all ${calcMode === 'calculator' ? 'bg-teal-500 text-white shadow' : 'text-white/60 hover:text-white'}`}
          >
            Simple Calc
          </button>
          <button
            onClick={() => setCalcMode('invoice')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg cursor-pointer transition-all ${calcMode === 'invoice' ? 'bg-teal-500 text-white shadow' : 'text-white/60 hover:text-white'}`}
          >
            Invoice Builder
          </button>
        </div>
      </div>

      {calcMode === 'calculator' ? (
        // Calculator Sub-Panel
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
            <div className="space-y-4">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Tax Calculator Inputs</span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Base / Transaction Amount</span>
                  <span className="font-bold text-white">{formatCurrency(simpleAmount)}</span>
                </div>
                <input 
                  type="range" min="100" max="1000000" step="500" value={simpleAmount} 
                  onChange={(e) => setSimpleAmount(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                />
                <input 
                  type="number" value={simpleAmount} 
                  onChange={(e) => setSimpleAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <span className="text-xs text-white/60 font-bold block mb-1">Select GST Slab Rate</span>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 12, 18, 28].map(r => (
                    <button
                      key={r}
                      onClick={() => setSimpleGstRate(r)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        simpleGstRate === r
                          ? 'border-teal-500 bg-teal-500/10 text-white'
                          : 'border-white/5 bg-black/30 text-white/60 hover:text-white'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                  <div className="relative">
                    <input 
                      type="number" placeholder="Custom" value={simpleGstRate} 
                      onChange={(e) => setSimpleGstRate(Math.max(0, Number(e.target.value)))}
                      className="w-full text-center text-xs rounded-xl border border-white/10 bg-black/40 py-2.5 text-white outline-none focus:border-teal-500 placeholder-white/20 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-950/10 border border-teal-500/10 rounded-2xl p-5 flex flex-col justify-center">
              <span className="text-[10px] text-teal-400 uppercase font-black tracking-widest mb-1.5">CGST & SGST Rules</span>
              <p className="text-xs text-white/50 leading-relaxed font-normal">
                GST is split 50/50 between CGST (Central Goods and Services Tax) and SGST (State Goods and Services Tax) for intra-state sales.
              </p>
            </div>
          </div>

          {/* Double Outcome panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block border-b border-white/5 pb-2">
                1. GST Exclusive (Tax added over base)
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">CGST ({(simpleGstRate/2)}%):</span>
                  <span className="font-semibold">{formatCurrency(simpleGstAdded / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">SGST ({(simpleGstRate/2)}%):</span>
                  <span className="font-semibold">{formatCurrency(simpleGstAdded / 2)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-400 pt-2 border-t border-white/5">
                  <span>Grand Total (Inc Tax):</span>
                  <span>{formatCurrency(simpleTotalAdded)}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block border-b border-white/5 pb-2">
                2. GST Inclusive (Tax extracted from base)
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Net Base Price:</span>
                  <span className="font-semibold">{formatCurrency(simpleBaseRemoved)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">CGST ({(simpleGstRate/2)}%):</span>
                  <span className="font-semibold">{formatCurrency(simpleGstRemoved / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">SGST ({(simpleGstRate/2)}%):</span>
                  <span className="font-semibold">{formatCurrency(simpleGstRemoved / 2)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-400 pt-2 border-t border-white/5">
                  <span>Gross Paid Amount:</span>
                  <span>{formatCurrency(simpleAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Invoice Builder Sub-Panel
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Builder Form */}
          <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4">
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Invoice Details</span>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-white/50 uppercase font-semibold">Service Provider (Your Name)</label>
                <input 
                  type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs mt-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
                />
              </div>
              
              <div>
                <label className="text-[10px] text-white/50 uppercase font-semibold">Billed To (Client)</label>
                <input 
                  type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs mt-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Add Invoice Item</span>
              
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Line item description (e.g. Consulting)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500 placeholder-white/20"
                />
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] text-white/40 block mb-1">Price (₹)</label>
                    <input 
                      type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/40 block mb-1">Qty</label>
                    <input 
                      type="number" min="1" value={newItemQty} onChange={(e) => setNewItemQty(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/40 block mb-1">GST Slab</label>
                    <select 
                      value={newItemGstRate} onChange={(e) => setNewItemGstRate(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-2 py-2.5 text-white outline-none focus:border-teal-500 cursor-pointer"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add Line Item
                </button>
              </div>
            </div>
          </div>

          {/* Styled Printable Invoice Sheet */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-white/50 uppercase font-semibold">Tax Invoice Sheet Preview</span>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20 rounded-xl transition-all cursor-pointer no-print"
              >
                <Printer size={12} /> Print / Save PDF
              </button>
            </div>

            {/* Print area */}
            <div 
              ref={printAreaRef}
              className="bg-white text-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl border border-gray-200 print-area text-xs font-sans"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-[#1B365D] uppercase tracking-wide">{companyName}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">GST Tax Invoice</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-green-100 text-green-700 font-black uppercase tracking-wider text-[8px]">Paid</span>
                  <p className="text-[10px] text-gray-400 font-medium">Inv ID: #{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              {/* Bill Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-3 text-[10px]">
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[8px] block mb-1">Billed To:</span>
                  <p className="font-bold text-gray-700">{clientName}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 font-semibold uppercase text-[8px] block mb-1">Invoice Date:</span>
                  <p className="font-bold text-gray-700">{new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[8px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">GST Rate</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {invoiceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 text-gray-700 font-bold">{item.name}</td>
                      <td className="py-2 text-right text-gray-600">₹{item.price.toLocaleString()}</td>
                      <td className="py-2 text-center text-gray-600">{item.qty}</td>
                      <td className="py-2 text-right text-gray-500 font-bold">{item.gstRate}%</td>
                      <td className="py-2 text-right text-gray-800 font-extrabold">₹{(item.price * item.qty).toLocaleString()}</td>
                      <td className="py-2 text-right no-print">
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 px-1 cursor-pointer">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tax Splits Summary */}
              <div className="border-t border-gray-200 pt-3 flex flex-col items-end gap-1.5 text-[10px]">
                <div className="flex justify-between w-48 text-gray-500 font-medium">
                  <span>Subtotal:</span>
                  <span className="text-gray-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-48 text-gray-500 font-medium">
                  <span>CGST (half):</span>
                  <span className="text-gray-800">₹{cgstTotal.toFixed(1)}</span>
                </div>
                <div className="flex justify-between w-48 text-gray-500 font-medium">
                  <span>SGST (half):</span>
                  <span className="text-gray-800">₹{sgstTotal.toFixed(1)}</span>
                </div>
                <div className="flex justify-between w-48 text-gray-500 font-medium border-b border-gray-100 pb-1.5">
                  <span>Total GST:</span>
                  <span className="text-gray-800">₹{invoiceGstTotal.toFixed(1)}</span>
                </div>
                <div className="flex justify-between w-48 text-[#1B365D] font-black text-xs pt-1.5">
                  <span>Total Bill Amount:</span>
                  <span>₹{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Break-even & Profit Goal Analyzer                                       */
/* ========================================================================== */
function BreakevenCalculatorTool() {
  const [rent, setRent] = useState(25000);
  const [salaries, setSalaries] = useState(30000);
  const [otherOverheads, setOtherOverheads] = useState(15000);
  const [pricePerUnit, setPricePerUnit] = useState(200);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(80);
  const [profitGoal, setProfitGoal] = useState(50000);

  const totalFixedCosts = rent + salaries + otherOverheads;
  const contributionMargin = Math.max(1, pricePerUnit - variableCostPerUnit);
  const contributionMarginRatio = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0;

  // Break-even targets
  const breakEvenUnits = contributionMargin > 0 ? totalFixedCosts / contributionMargin : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  // Profit goal targets
  const targetUnits = contributionMargin > 0 ? (totalFixedCosts + profitGoal) / contributionMargin : 0;
  const targetRevenue = targetUnits * pricePerUnit;

  // Plot SVG chart values
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 20;

  const maxVolumeScale = Math.ceil(targetUnits * 1.5);
  const maxVolume = Math.max(500, isFinite(maxVolumeScale) ? maxVolumeScale : 1000);
  const maxCostRevenue = Math.max(breakEvenRevenue, targetRevenue) * 1.4;
  const scaleY = maxCostRevenue > 0 ? maxCostRevenue : 100000;

  const getSvgCoordinates = (units: number, dollars: number) => {
    const x = paddingX + (units / maxVolume) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (dollars / scaleY) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Coordinates for lines
  const fixedCostStart = getSvgCoordinates(0, totalFixedCosts);
  const fixedCostEnd = getSvgCoordinates(maxVolume, totalFixedCosts);

  const totalCostStart = getSvgCoordinates(0, totalFixedCosts);
  const totalCostEnd = getSvgCoordinates(maxVolume, totalFixedCosts + variableCostPerUnit * maxVolume);

  const revenueStart = getSvgCoordinates(0, 0);
  const revenueEnd = getSvgCoordinates(maxVolume, pricePerUnit * maxVolume);

  // Focus nodes
  const breakEvenNode = getSvgCoordinates(breakEvenUnits, breakEvenRevenue);
  const targetNode = getSvgCoordinates(targetUnits, targetRevenue);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-wider">
          <Landmark size={20} /> Break-Even & Profit Goal Analyzer
        </h3>
        <p className="text-xs text-white/50">Determine overhead cost coverage volumes, calculate margins of safety, and simulate profit goal checkpoints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        {/* Fixed overheads split */}
        <div className="space-y-3">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Monthly Overheads (Fixed)</span>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Office Rent</span>
              <span className="text-white font-bold">{formatCurrency(rent)}</span>
            </div>
            <input type="range" min="0" max="100000" step="5000" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Staff Salaries</span>
              <span className="text-white font-bold">{formatCurrency(salaries)}</span>
            </div>
            <input type="range" min="0" max="200000" step="5000" value={salaries} onChange={(e) => setSalaries(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Marketing & Admin</span>
              <span className="text-white font-bold">{formatCurrency(otherOverheads)}</span>
            </div>
            <input type="range" min="0" max="50000" step="2000" value={otherOverheads} onChange={(e) => setOtherOverheads(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>
        </div>

        {/* Unit Economics */}
        <div className="space-y-3">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Unit Costs & Prices</span>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Unit Selling Price</span>
              <span className="text-white font-bold">{formatCurrency(pricePerUnit)}</span>
            </div>
            <input type="range" min={variableCostPerUnit + 5} max={variableCostPerUnit * 5 + 10} step="5" value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Unit Variable Cost</span>
              <span className="text-white font-bold">{formatCurrency(variableCostPerUnit)}</span>
            </div>
            <input type="range" min="5" max="500" step="5" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>
        </div>

        {/* Profit target */}
        <div className="space-y-3">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Target Profit Milestone</span>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/60">Target Profit Goal</span>
              <span className="text-amber-400 font-bold">{formatCurrency(profitGoal)}</span>
            </div>
            <input type="range" min="0" max="200000" step="5000" value={profitGoal} onChange={(e) => setProfitGoal(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
            <input 
              type="number" value={profitGoal} 
              onChange={(e) => setProfitGoal(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Fixed Overheads Total</span>
          <span className="text-sm font-black text-white">{formatCurrency(totalFixedCosts)}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Break-even volume</span>
          <span className="text-sm font-black text-green-400">{Math.ceil(breakEvenUnits).toLocaleString()} Units</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Target volume (Goal)</span>
          <span className="text-sm font-black text-amber-500">{Math.ceil(targetUnits).toLocaleString()} Units</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Unit Contribution</span>
          <span className="text-sm font-black text-teal-400">{formatCurrency(contributionMargin)} ({contributionMarginRatio.toFixed(0)}%)</span>
        </div>
      </div>

      {/* SVG Break-even Graph */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">Cost-Volume-Profit (CVP) Chart</span>
          <div className="flex flex-wrap gap-4 text-[9px] uppercase tracking-wider font-extrabold">
            <span className="flex items-center gap-1.5 text-white/40"><span className="h-2 w-2 rounded bg-white/20"></span> Fixed Cost</span>
            <span className="flex items-center gap-1.5 text-orange-400"><span className="h-2 w-2 rounded bg-orange-500"></span> Total Cost</span>
            <span className="flex items-center gap-1.5 text-teal-400"><span className="h-2 w-2 rounded bg-teal-500"></span> Revenue</span>
          </div>
        </div>

        <div className="w-full">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
            {/* Gridlines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              return <line key={idx} x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3" />;
            })}

            {/* Line Plots */}
            {/* Fixed Cost Line */}
            <line x1={fixedCostStart.x} y1={fixedCostStart.y} x2={fixedCostEnd.x} y2={fixedCostEnd.y} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4" />
            
            {/* Total Cost Line */}
            <line x1={totalCostStart.x} y1={totalCostStart.y} x2={totalCostEnd.x} y2={totalCostEnd.y} stroke="#F97316" strokeWidth="2.5" />
            
            {/* Revenue Line */}
            <line x1={revenueStart.x} y1={revenueStart.y} x2={revenueEnd.x} y2={revenueEnd.y} stroke="#0D9488" strokeWidth="2.5" />

            {/* Break-even Point Bubble */}
            {isFinite(breakEvenNode.x) && isFinite(breakEvenNode.y) && (
              <>
                <circle cx={breakEvenNode.x} cy={breakEvenNode.y} r="6" fill="#0D9488" stroke="rgba(255,255,255,0.6)" strokeWidth="2" className="animate-pulse" />
                <text x={breakEvenNode.x + 8} y={breakEvenNode.y - 8} fill="#2DD4BF" fontSize="8" fontWeight="bold">BEP: {Math.ceil(breakEvenUnits)} Units</text>
              </>
            )}

            {/* Target Goal Point Bubble */}
            {isFinite(targetNode.x) && isFinite(targetNode.y) && profitGoal > 0 && (
              <>
                <circle cx={targetNode.x} cy={targetNode.y} r="6" fill="#F59E0B" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                <text x={targetNode.x + 8} y={targetNode.y + 4} fill="#FBBF24" fontSize="8" fontWeight="bold">Goal: {Math.ceil(targetUnits)} Units</text>
              </>
            )}

            {/* Axis labels */}
            <text x={paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">0 Units</text>
            <text x={chartWidth - paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">{maxVolume.toLocaleString()} Units</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 5. EMI Loan & Prepayment Planner                                           */
/* ========================================================================== */
function EmiCalculatorTool() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);
  const [monthlyPrepay, setMonthlyPrepay] = useState(3000);
  const [annualPrepay, setAnnualPrepay] = useState(25000);
  const [showAmortization, setShowAmortization] = useState(false);

  // EMI Base Math
  const p = loanAmount;
  const r = (interestRate / 12) / 100;
  const n = tenureYears * 12;

  const baseEmi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalBasePayment = baseEmi * n;
  const totalBaseInterest = totalBasePayment - p;

  // Running Amortization Schedule with prepayments
  const schedule: any[] = [];
  let balance = p;
  let prepayBalance = p;
  let totalPrepayInterest = 0;
  let monthsElapsed = 0;

  const amortPlotBase: any[] = [];
  const amortPlotPrepay: any[] = [];

  for (let m = 1; m <= n; m++) {
    // 1. Base Schedule calculation
    const baseInterestPaid = balance * r;
    const basePrincipalPaid = baseEmi - baseInterestPaid;
    balance = Math.max(0, balance - basePrincipalPaid);
    if (m % 12 === 0 || m === n) {
      amortPlotBase.push({ month: m, balance });
    }

    // 2. Prepayment Schedule calculation
    if (prepayBalance > 0) {
      monthsElapsed = m;
      const prepayInterestPaid = prepayBalance * r;
      let prepayPrincipalPaid = baseEmi - prepayInterestPaid;
      
      // Add extra monthly prepayment
      let actualPrepay = monthlyPrepay;
      // Add extra annual one-time prepayment (occurs at month 12, 24, 36...)
      if (m % 12 === 0) {
        actualPrepay += annualPrepay;
      }

      const totalPrincipalApplied = prepayPrincipalPaid + actualPrepay;
      prepayBalance = Math.max(0, prepayBalance - totalPrincipalApplied);
      totalPrepayInterest += prepayInterestPaid;

      if (m % 12 === 0 || prepayBalance === 0) {
        amortPlotPrepay.push({ month: m, balance: prepayBalance });
      }

      // Record detailed year splits
      if (m % 12 === 0 || prepayBalance === 0) {
        schedule.push({
          year: Math.ceil(m / 12),
          principalRepaid: Math.round(p - prepayBalance),
          interestPaid: Math.round(totalPrepayInterest),
          balance: Math.round(prepayBalance)
        });
      }
    }
  }

  const prepaymentGrandTotal = p + totalPrepayInterest;
  const interestSaved = Math.max(0, totalBaseInterest - totalPrepayInterest);
  const tenureSavedMonths = n - monthsElapsed;
  const tenureSavedYears = (tenureSavedMonths / 12).toFixed(1);

  // SVG parameters for Outstanding balance comparison
  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 20;
  const widthPerMonth = (chartWidth - paddingX * 2) / n;

  const getAmortPoints = (curveData: { month: number; balance: number }[]) => {
    if (curveData.length === 0) return '';
    return curveData.map(c => {
      const x = paddingX + c.month * widthPerMonth;
      const y = chartHeight - paddingY - (c.balance / p) * (chartHeight - paddingY * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  const baseCurvePoints = `40,${paddingY} ` + getAmortPoints(amortPlotBase);
  const prepayCurvePoints = `40,${paddingY} ` + getAmortPoints(amortPlotPrepay);

  // Donut chart calculations
  const totalInterestRatio = totalBasePayment > 0 ? totalBaseInterest / totalBasePayment : 0;
  const totalPrincipalRatio = totalBasePayment > 0 ? p / totalBasePayment : 0;

  const exportLoanReport = () => {
    const headers = ["Year", "Cumulative Principal Repaid (INR)", "Cumulative Interest Paid (INR)", "Outstanding Balance (INR)"];
    const rows = schedule.map(row => [
      `Year ${row.year}`,
      row.principalRepaid.toString(),
      row.interestPaid.toString(),
      row.balance.toString()
    ]);
    downloadCSV(headers, rows, "loan_prepayment_amortization.csv");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-wider">
            <LandmarkIcon size={20} /> EMI & Loan Prepayment Architect
          </h3>
          <p className="text-xs text-white/50">Plan loan repayments, visualize amortization curves, and simulate prepayment savings.</p>
        </div>
        <button
          onClick={exportLoanReport}
          className="flex items-center gap-2 self-start sm:self-center px-4 py-2 text-xs font-bold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 rounded-xl transition-all cursor-pointer"
        >
          <Download size={14} /> Export Plan (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        {/* Core Loan Parameters */}
        <div className="space-y-4">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Core Loan Parameters</span>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Loan Amount (Principal)</span>
              <span className="font-bold text-white">{formatCurrency(loanAmount)}</span>
            </div>
            <input 
              type="range" min="50000" max="5000000" step="50000" value={loanAmount} 
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))} className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-white/60">Interest (% p.a.)</span>
              </div>
              <input type="number" step="0.05" value={interestRate} onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))} className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-white/60">Tenure (Years)</span>
              </div>
              <input type="number" value={tenureYears} onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))} className="w-full text-xs rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-teal-500" />
            </div>
          </div>
        </div>

        {/* Prepayment settings */}
        <div className="space-y-4">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Prepayment Scheduler (Optional)</span>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Extra Monthly Prepayment</span>
              <span className="font-bold text-teal-400">+{formatCurrency(monthlyPrepay)} / mo</span>
            </div>
            <input 
              type="range" min="0" max="50000" step="1000" value={monthlyPrepay} 
              onChange={(e) => setMonthlyPrepay(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Annual One-time Prepayment</span>
              <span className="font-bold text-teal-400">+{formatCurrency(annualPrepay)} / yr</span>
            </div>
            <input 
              type="range" min="0" max="200000" step="5000" value={annualPrepay} 
              onChange={(e) => setAnnualPrepay(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
          </div>
        </div>
      </div>

      {/* KPI outputs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Base Monthly EMI</span>
          <span className="text-sm font-black text-white">{formatCurrency(baseEmi)}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Prepaid tenure</span>
          <span className="text-sm font-black text-green-400">{(monthsElapsed / 12).toFixed(1)} Years</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Interest Saved</span>
          <span className="text-sm font-black text-teal-400">₹{Math.round(interestSaved).toLocaleString()}</span>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Time Saved</span>
          <span className="text-sm font-black text-amber-500">{tenureSavedYears} Years early</span>
        </div>
      </div>

      {/* Donut Chart & Balance comparison area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Principal vs Interest Donut */}
        <div className="md:col-span-4 bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-4">
          <span className="text-[10px] text-white/40 uppercase font-bold self-start">Base Principal vs. Interest</span>
          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" className="rotate-[-90deg]">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              {/* Principal portion */}
              <circle 
                cx="50" cy="50" r="38" fill="transparent" stroke="#0D9488" strokeWidth="10"
                strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - totalPrincipalRatio)}
              />
              {/* Interest portion */}
              <circle 
                cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="10"
                strokeDasharray="238.7" strokeDashoffset={238.7 * totalPrincipalRatio}
                style={{ transform: `rotate(${totalPrincipalRatio * 360}deg)`, transformOrigin: '50px 50px' }}
              />
            </svg>
            <div className="absolute text-[10px] font-black text-center text-white/80">
              ₹{(loanAmount / 1000).toFixed(0)}k<br/><span className="text-[8px] text-white/40 uppercase">Principal</span>
            </div>
          </div>
          <div className="w-full space-y-1.5 text-[9px] font-extrabold uppercase tracking-wider">
            <div className="flex justify-between items-center text-teal-400">
              <span>Principal Amount:</span>
              <span>{(totalPrincipalRatio * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center text-yellow-500">
              <span>Total Interest:</span>
              <span>{(totalInterestRatio * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Amortization Line Curves */}
        <div className="md:col-span-8 bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Outstanding Balance Amortization Curves</span>
            <div className="flex gap-4 text-[9px] uppercase tracking-wider font-extrabold">
              <span className="flex items-center gap-1.5 text-yellow-500"><span className="h-1.5 w-1.5 rounded bg-yellow-500"></span> Base Plan</span>
              <span className="flex items-center gap-1.5 text-teal-400"><span className="h-1.5 w-1.5 rounded bg-teal-500"></span> Prepayment</span>
            </div>
          </div>

          <div className="w-full">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36 overflow-visible">
              {/* Lines */}
              <line x1={paddingX} y1={paddingY} x2={paddingX} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Curve plots */}
              {baseCurvePoints && <polyline fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3" points={baseCurvePoints} />}
              {prepayCurvePoints && <polyline fill="none" stroke="#0D9488" strokeWidth="2.5" points={prepayCurvePoints} />}

              {/* Axis labels */}
              <text x={paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">Mo 0</text>
              <text x={chartWidth - paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">Mo {n}</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 6. Revenue Forecast & Valuation Estimator                                  */
/* ========================================================================== */
function RevenueForecastTool() {
  const [currentRev, setCurrentRev] = useState(1000000);
  const [baseGrowth, setBaseGrowth] = useState(15);
  const [bullGrowth, setBullGrowth] = useState(25);
  const [bearGrowth, setBearGrowth] = useState(5);
  const [valuationMultiple, setValuationMultiple] = useState(5);
  const [years, setYears] = useState(5);

  const forecastData: any[] = [];
  let baseVal = currentRev;
  let bullVal = currentRev;
  let bearVal = currentRev;

  for (let yr = 1; yr <= years; yr++) {
    baseVal = baseVal * (1 + baseGrowth / 100);
    bullVal = bullVal * (1 + bullGrowth / 100);
    bearVal = bearVal * (1 + bearGrowth / 100);

    forecastData.push({
      year: yr,
      baseRev: Math.round(baseVal),
      bullRev: Math.round(bullVal),
      bearRev: Math.round(bearVal),
      baseValuation: Math.round(baseVal * valuationMultiple),
      bullValuation: Math.round(bullVal * valuationMultiple),
      bearValuation: Math.round(bearVal * valuationMultiple)
    });
  }

  // Chart plotting normalization
  const maxForecastVal = Math.max(...forecastData.map(f => f.bullRev), 10000);
  const chartWidth = 500;
  const chartHeight = 200;
  const paddingX = 40;
  const paddingY = 20;
  const widthPerYear = (chartWidth - paddingX * 2) / Math.max(1, years - 1);

  const getPoints = (key: 'baseRev' | 'bullRev' | 'bearRev') => {
    return forecastData.map((f, idx) => {
      const x = paddingX + idx * widthPerYear;
      const y = chartHeight - paddingY - (f[key] / maxForecastVal) * (chartHeight - paddingY * 2);
      return `${x},${y}`;
    }).join(' ');
  };

  const basePoints = getPoints('baseRev');
  const bullPoints = getPoints('bullRev');
  const bearPoints = getPoints('bearRev');

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-black flex items-center gap-2 text-teal-400 uppercase tracking-wider">
          <TrendingUp size={20} /> Revenue Forecast & Valuation Modeler
        </h3>
        <p className="text-xs text-white/50">Run multi-scenario growth forecasts (Bear/Base/Bull case CAGR) and estimate business multiples valuations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        {/* Baseline & Multiple */}
        <div className="space-y-4">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Baseline & Multiple</span>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Current Annual Revenue</span>
              <span className="font-bold text-white">{formatCurrency(currentRev)}</span>
            </div>
            <input 
              type="range" min="50000" max="5000000" step="50000" value={currentRev} 
              onChange={(e) => setCurrentRev(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Valuation Multiple (Rev x)</span>
              <span className="font-bold text-white">{valuationMultiple}x Multiple</span>
            </div>
            <input 
              type="range" min="1" max="25" step="0.5" value={valuationMultiple} 
              onChange={(e) => setValuationMultiple(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500" 
            />
          </div>
        </div>

        {/* Growth Scenarios */}
        <div className="space-y-3">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">Growth CAGR Rates (%)</span>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Bull Case (High)</span>
              <span className="text-green-400 font-bold">{bullGrowth}%</span>
            </div>
            <input type="range" min={baseGrowth} max="100" step="1" value={bullGrowth} onChange={(e) => setBullGrowth(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Base Case (Expected)</span>
              <span className="text-teal-400 font-bold">{baseGrowth}%</span>
            </div>
            <input type="range" min={bearGrowth} max={bullGrowth} step="1" value={baseGrowth} onChange={(e) => setBaseGrowth(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Bear Case (Low)</span>
              <span className="text-red-400 font-bold">{bearGrowth}%</span>
            </div>
            <input type="range" min="0" max={baseGrowth} step="1" value={bearGrowth} onChange={(e) => setBearGrowth(Number(e.target.value))} className="w-full h-1 bg-white/10 accent-teal-500 rounded" />
          </div>
        </div>

        {/* Forecast Period */}
        <div className="space-y-3 flex flex-col justify-between">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Forecast Horizon</span>
          <div className="grid grid-cols-2 gap-2">
            {[5, 10].map(y => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`py-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  years === y
                    ? 'border-teal-500 bg-teal-500/10 text-white'
                    : 'border-white/5 bg-black/30 text-white/55 hover:text-white'
                }`}
              >
                {y} Years
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-line forecast chart */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">Future Valuation Trajectories</span>
          <div className="flex gap-4 text-[9px] uppercase tracking-wider font-extrabold">
            <span className="flex items-center gap-1.5 text-green-400"><span className="h-1.5 w-1.5 rounded bg-green-500"></span> Bull Case</span>
            <span className="flex items-center gap-1.5 text-teal-400"><span className="h-1.5 w-1.5 rounded bg-teal-500"></span> Base Case</span>
            <span className="flex items-center gap-1.5 text-red-400"><span className="h-1.5 w-1.5 rounded bg-red-500"></span> Bear Case</span>
          </div>
        </div>

        <div className="w-full">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40 overflow-visible">
            {/* Gridlines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              return <line key={idx} x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3" />;
            })}

            {/* Line Plots */}
            {bearPoints && <polyline fill="none" stroke="#EF4444" strokeWidth="2" points={bearPoints} />}
            {basePoints && <polyline fill="none" stroke="#0D9488" strokeWidth="2.5" points={basePoints} />}
            {bullPoints && <polyline fill="none" stroke="#22C55E" strokeWidth="2" points={bullPoints} />}

            {/* X-axis labels */}
            <text x={paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">Yr 0</text>
            <text x={chartWidth - paddingX} y={chartHeight - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">Yr {years}</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
