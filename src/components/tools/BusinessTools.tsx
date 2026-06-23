import { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, BarChart3, LineChart, Landmark, ArrowRight } from 'lucide-react';

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
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                  : 'border-transparent text-white/55 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Tool Workspace Canvas */}
      <div className="flex-1 bg-[#141418]/30 backdrop-blur-md rounded-2xl border border-white/5 p-6 min-h-[450px]">
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
/* 1. ROI Calculator                                                        */
/* ========================================================================== */
function RoiCalculatorTool() {
  const [cost, setCost] = useState('10000');
  const [gain, setGain] = useState('15000');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const c = parseFloat(cost);
    const g = parseFloat(gain);
    if (isNaN(c) || isNaN(g) || c === 0) return;

    const absolute = g - c;
    const pct = (absolute / c) * 100;

    // Generate 10 year growth projections compounding by ROI rate
    const projections = [];
    let currentVal = g;
    const roiRate = pct / 100;
    for (let yr = 1; yr <= 10; yr++) {
      currentVal = currentVal * (1 + roiRate);
      projections.push({
        year: `Year ${yr}`,
        value: currentVal.toFixed(0),
        netProfit: (currentVal - c).toFixed(0)
      });
    }

    setResult({
      absolute: absolute.toFixed(2),
      pct: pct.toFixed(1),
      projections
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <DollarSign size={16} /> Return on Investment (ROI) Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate percentage gains, absolute returns, and compound growth over 10 years.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Cost of Investment (₹)</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Total Gain / Revenue (₹)</label>
          <input type="number" value={gain} onChange={(e) => setGain(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
        Calculate ROI & Projections
      </button>

      {result && (
        <div className="space-y-5">
          <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Net Profit / Gain</span>
              <span className="text-base font-black text-green-400">₹{parseFloat(result.absolute).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-white/40 uppercase font-semibold">ROI Percentage</span>
              <span className="text-base font-black text-blue-400">{result.pct}%</span>
            </div>
          </div>

          <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3">
            <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">10-Year Compounded Projections (Compounding at {result.pct}%)</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[9px] uppercase tracking-wider">
                    <th className="py-2">Year</th>
                    <th className="py-2 text-right">Projected Value</th>
                    <th className="py-2 text-right">Estimated Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result.projections.map((p: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2 font-semibold text-white/60">{p.year}</td>
                      <td className="py-2 text-right font-black text-green-400">₹{parseFloat(p.value).toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right text-blue-400 font-bold">₹{parseFloat(p.netProfit).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. Profit Margin Calculator                                               */
/* ========================================================================== */
function MarginCalculatorTool() {
  const [cost, setCost] = useState('80');
  const [revenue, setRevenue] = useState('120');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const c = parseFloat(cost);
    const r = parseFloat(revenue);
    if (isNaN(c) || isNaN(r) || r === 0) return;

    const profit = r - c;
    const margin = (profit / r) * 100;
    const markup = (profit / c) * 100;

    setResult({
      profit: profit.toFixed(2),
      margin: margin.toFixed(1),
      markup: markup.toFixed(1),
      costPct: ((c / r) * 100).toFixed(0),
      marginPct: ((profit / r) * 100).toFixed(0)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Percent size={16} /> Profit Margin Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate gross profit margin, markup rate, and cost-to-revenue ratio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Cost of Good Sold (COGS, ₹)</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Retail Selling Price (₹)</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
        Calculate Margins
      </button>

      {result && (
        <div className="space-y-4">
          <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Gross Profit</span>
              <span className="text-base font-black text-green-400">₹{parseFloat(result.profit).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Profit Margin</span>
              <span className="text-base font-black text-blue-400">{result.margin}%</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[10px] text-white/40 uppercase font-semibold">Markup Rate</span>
              <span className="text-base font-black text-purple-400">{result.markup}%</span>
            </div>
          </div>

          {/* Visual Percentage splits */}
          <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3">
            <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Cost vs. Profit Split of Revenue</span>
            <div className="h-6 w-full rounded-full bg-white/5 flex overflow-hidden border border-white/10">
              <div className="h-full bg-red-500/20 text-red-300 flex items-center justify-center font-bold text-[10px] border-r border-white/10" style={{ width: `${result.costPct}%` }}>
                COGS ({result.costPct}%)
              </div>
              <div className="h-full bg-green-500/20 text-green-300 flex items-center justify-center font-bold text-[10px]" style={{ width: `${result.marginPct}%` }}>
                Profit ({result.marginPct}%)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. GST Calculator                                                         */
/* ========================================================================== */
function GstCalculatorTool() {
  const [amount, setAmount] = useState('1000');
  const [rate, setRate] = useState('18');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (type: 'exclusive' | 'inclusive') => {
    const amt = parseFloat(amount);
    const r = parseFloat(rate);
    if (isNaN(amt) || isNaN(r)) return;

    if (type === 'exclusive') {
      const gst = amt * (r / 100);
      const total = amt + gst;
      setResult({
        base: amt.toFixed(2),
        cgst: (gst / 2).toFixed(2),
        sgst: (gst / 2).toFixed(2),
        gst: gst.toFixed(2),
        total: total.toFixed(2),
        type: 'Exclusive (GST Added)'
      });
    } else {
      // Inclusive formula: GST = Amount - (Amount * (100 / (100 + rate)))
      const base = amt * (100 / (100 + r));
      const gst = amt - base;
      setResult({
        base: base.toFixed(2),
        cgst: (gst / 2).toFixed(2),
        sgst: (gst / 2).toFixed(2),
        gst: gst.toFixed(2),
        total: amt.toFixed(2),
        type: 'Inclusive (GST Contained)'
      });
    }
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> GST Tax Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate GST splits (CGST & SGST) for both Inclusive and Exclusive price brackets.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Gross Amount (₹)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">GST Rate (%)</label>
          <select value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none">
            <option value="5">5% (Essentials)</option>
            <option value="12">12% (Standard)</option>
            <option value="18">18% (Standard Plus)</option>
            <option value="28">28% (Luxury)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => handleCalculate('exclusive')} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
          Add GST (+Tax)
        </button>
        <button onClick={() => handleCalculate('inclusive')} className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
          Remove GST (Tax Inc)
        </button>
      </div>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{result.type} Results</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[9px] text-white/40 uppercase font-semibold">Net Base Price</span>
              <span className="text-sm font-bold text-white">₹{parseFloat(result.base).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[9px] text-white/40 uppercase font-semibold">CGST paid (50%)</span>
              <span className="text-sm font-bold text-yellow-400">₹{parseFloat(result.cgst).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[9px] text-white/40 uppercase font-semibold">SGST paid (50%)</span>
              <span className="text-sm font-bold text-yellow-400">₹{parseFloat(result.sgst).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="block text-[9px] text-white/40 uppercase font-semibold">Total Bill Price</span>
              <span className="text-sm font-black text-green-400">₹{parseFloat(result.total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Break-even Calculator                                                  */
/* ========================================================================== */
function BreakevenCalculatorTool() {
  const [fixed, setFixed] = useState('100000');
  const [price, setPrice] = useState('50');
  const [variable, setVariable] = useState('20');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const f = parseFloat(fixed);
    const p = parseFloat(price);
    const v = parseFloat(variable);
    if (isNaN(f) || isNaN(p) || isNaN(v) || p <= v) {
      alert("Sales price must be higher than the variable cost per unit.");
      return;
    }

    const contribution = p - v;
    const units = f / contribution;
    const revenue = units * p;

    setResult({
      units: units.toFixed(0),
      revenue: revenue.toFixed(0),
      contribution: contribution.toFixed(2)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Landmark size={16} /> Break-even Business Volume Calculator
        </h3>
        <p className="text-xs text-white/50">Determine units needed and total revenue volume to cover all fixed expenses.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Fixed Costs (Overhead, ₹)</label>
          <input type="number" value={fixed} onChange={(e) => setFixed(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Sale Price per Unit (₹)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Variable Cost per Unit (₹)</label>
          <input type="number" value={variable} onChange={(e) => setVariable(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
        Calculate Break-even Points
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[9px] text-white/40 uppercase font-semibold">Break-even Units</span>
            <span className="text-base font-black text-green-400">{parseFloat(result.units).toLocaleString()} Units</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[9px] text-white/40 uppercase font-semibold">Required Sales Value</span>
            <span className="text-base font-black text-blue-400">₹{parseFloat(result.revenue).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[9px] text-white/40 uppercase font-semibold">Unit Margin contribution</span>
            <span className="text-base font-black text-yellow-400">₹{parseFloat(result.contribution).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 5. EMI Calculator                                                         */
/* ========================================================================== */
function EmiCalculatorTool() {
  const [loan, setLoan] = useState('100000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('24');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const p = parseFloat(loan);
    const annualRate = parseFloat(rate);
    const t = parseFloat(tenure);
    if (isNaN(p) || isNaN(annualRate) || isNaN(t) || t === 0) return;

    const r = (annualRate / 12) / 100;
    const emi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
    const totalPayment = emi * t;
    const totalInterest = totalPayment - p;

    // Calculate Amortisation yearly split
    const schedule = [];
    let balance = p;
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;
    
    for (let m = 1; m <= t; m++) {
      const interestPaid = balance * r;
      const principalPaid = emi - interestPaid;
      balance -= principalPaid;
      yearlyInterest += interestPaid;
      yearlyPrincipal += principalPaid;
      
      if (m % 12 === 0 || m === t) {
        schedule.push({
          year: `Year ${Math.ceil(m / 12)}`,
          principal: yearlyPrincipal.toFixed(0),
          interest: yearlyInterest.toFixed(0),
          balance: Math.max(0, balance).toFixed(0)
        });
        yearlyInterest = 0;
        yearlyPrincipal = 0;
      }
    }

    // Donut chart parameters
    const interestRatio = totalInterest / totalPayment;
    const principalRatio = p / totalPayment;
    
    setResult({
      emi: emi.toFixed(0),
      interest: totalInterest.toFixed(0),
      total: totalPayment.toFixed(0),
      schedule,
      interestPct: (interestRatio * 100).toFixed(0),
      principalPct: (principalRatio * 100).toFixed(0)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> EMI Loan Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate monthly loan installments, interest percentages, and inspect the amortization table.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Principal Loan Amount (₹)</label>
          <input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Interest Rate (% Annual)</label>
          <input type="number" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Tenure (Months)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
        Calculate EMI & Amortization
      </button>

      {result && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Numeric Outputs */}
            <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-white/50">Monthly EMI</span>
                <span className="font-black text-blue-400">₹{parseFloat(result.emi).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-white/50">Principal Amount</span>
                <span className="font-bold text-white">₹{parseFloat(loan).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-white/50">Interest Payable</span>
                <span className="font-bold text-yellow-400">₹{parseFloat(result.interest).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-white/50">Total Payment</span>
                <span className="font-black text-green-400">₹{parseFloat(result.total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Repayment Pie Chart representation */}
            <div className="border border-white/5 rounded-xl bg-black/30 p-4 flex flex-col items-center justify-center gap-3">
              <span className="text-[10px] text-white/40 uppercase font-bold self-start">Principal vs. Interest Ratio</span>
              <div className="flex items-center gap-6">
                {/* SVG Donut */}
                <svg width="80" height="80" className="rotate-[-90deg]">
                  <circle cx="40" cy="40" r="30" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="30" 
                    fill="transparent" 
                    stroke="#007AFF" 
                    strokeWidth="8" 
                    strokeDasharray="188.4" 
                    strokeDashoffset={188.4 * (parseFloat(result.interestPct) / 100)} 
                  />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="30" 
                    fill="transparent" 
                    stroke="#EAB308" 
                    strokeWidth="8" 
                    strokeDasharray="188.4" 
                    strokeDashoffset="0"
                    style={{ strokeDashoffset: 188.4 - (188.4 * (parseFloat(result.interestPct) / 100)) }}
                  />
                </svg>
                <div className="space-y-1.5 text-[10px] font-bold">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Principal: {result.principalPct}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Interest: {result.interestPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortisation Table */}
          <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3">
            <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Yearly Repayment Schedule</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[9px] uppercase tracking-wider">
                    <th className="py-2">Year</th>
                    <th className="py-2 text-right">Principal Repaid</th>
                    <th className="py-2 text-right">Interest Paid</th>
                    <th className="py-2 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result.schedule.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2 font-semibold text-white/60">{row.year}</td>
                      <td className="py-2 text-right text-blue-400 font-bold">₹{parseFloat(row.principal).toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right text-yellow-400">₹{parseFloat(row.interest).toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right text-green-400 font-bold">₹{parseFloat(row.balance).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 6. Revenue Forecast Calculator                                            */
/* ========================================================================== */
function RevenueForecastTool() {
  const [base, setBase] = useState('500000');
  const [cagr, setCagr] = useState('12');
  const [forecast, setForecast] = useState<any[]>([]);

  const handleForecast = () => {
    const b = parseFloat(base);
    const r = parseFloat(cagr);
    if (isNaN(b) || isNaN(r)) return;

    const list = [];
    let current = b;
    for (let yr = 1; yr <= 5; yr++) {
      current = current * (1 + r / 100);
      list.push({
        year: `Year ${yr}`,
        revenue: current.toFixed(0)
      });
    }
    setForecast(list);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <TrendingUp size={16} /> Revenue Growth Forecast
        </h3>
        <p className="text-xs text-white/50">Project 5-year growth rates with progressive graphical bar charts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Baseline Revenue (₹)</label>
          <input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Compound Growth Rate (CAGR %)</label>
          <input type="number" value={cagr} onChange={(e) => setCagr(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-blue-500 outline-none" />
        </div>
      </div>

      <button onClick={handleForecast} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer">
        Forecast Growth
      </button>

      {forecast.length > 0 && (
        <div className="space-y-4">
          {/* Progression chart */}
          <div className="border border-white/5 rounded-xl bg-black/30 p-5 space-y-4">
            <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Growth Projections Progress</span>
            <div className="space-y-3.5">
              {forecast.map((f, idx) => {
                const maxVal = parseFloat(forecast[forecast.length - 1].revenue);
                const pct = (parseFloat(f.revenue) / maxVal) * 100;
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-semibold text-xs">
                    <span className="w-14 text-white/50">{f.year}</span>
                    <div className="flex-1 h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <span className="w-28 text-left sm:text-right text-green-400 font-black">₹{parseFloat(f.revenue).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
