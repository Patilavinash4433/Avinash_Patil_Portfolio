import { useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp } from 'lucide-react';

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
    setResult({
      absolute: absolute.toFixed(2),
      pct: pct.toFixed(1)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <DollarSign size={16} /> Return on Investment (ROI) Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate percentage gains and absolute returns on capital investments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Cost of Investment</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Total Gain / Revenue</label>
          <input type="number" value={gain} onChange={(e) => setGain(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Calculate ROI
      </button>

      {result && (
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
      markup: markup.toFixed(1)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Percent size={16} /> Profit Margin Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate gross profit margin and retail markup rates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Cost of Good Sold (COGS)</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Retail Selling Price</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Calculate Margins
      </button>

      {result && (
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
  const [type, setType] = useState('exclusive');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const amt = parseFloat(amount);
    const r = parseFloat(rate);
    if (isNaN(amt) || isNaN(r)) return;

    let gst = 0;
    let net = 0;
    let gross = 0;

    if (type === 'exclusive') {
      gst = amt * (r / 100);
      net = amt;
      gross = amt + gst;
    } else {
      gross = amt;
      gst = amt - (amt * (100 / (100 + r)));
      net = amt - gst;
    }

    setResult({
      net: net.toFixed(2),
      gst: gst.toFixed(2),
      gross: gross.toFixed(2),
      halfGst: (gst / 2).toFixed(2)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Percent size={16} /> GST Tax Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate inclusive/exclusive GST bills, SGST, and CGST splits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Base Amount (₹)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">GST Rate (%)</label>
          <select value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white">
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">GST Mode</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white">
            <option value="exclusive">GST Exclusive (+Tax)</option>
            <option value="inclusive">GST Inclusive (Tax included)</option>
          </select>
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Calculate GST Tax
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Net (Base) Price</span>
            <span className="text-base font-black text-white">₹{parseFloat(result.net).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">CGST (50% Split)</span>
            <span className="text-base font-black text-yellow-400">₹{parseFloat(result.halfGst).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">SGST (50% Split)</span>
            <span className="text-base font-black text-yellow-400">₹{parseFloat(result.halfGst).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Gross (Total) Price</span>
            <span className="text-base font-black text-green-400">₹{parseFloat(result.gross).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Break-even Calculator                                                 */
/* ========================================================================== */
function BreakevenCalculatorTool() {
  const [fixed, setFixed] = useState('50000');
  const [price, setPrice] = useState('150');
  const [variable, setVariable] = useState('50');
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    const f = parseFloat(fixed);
    const p = parseFloat(price);
    const v = parseFloat(variable);
    if (isNaN(f) || isNaN(p) || isNaN(v) || p - v <= 0) return;

    const units = f / (p - v);
    setResult(units.toFixed(0));
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> Break-even Calculator
        </h3>
        <p className="text-xs text-white/50">Determine the minimum sales volume required to recover fixed operational overhead costs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Fixed Costs (Overhead)</label>
          <input type="number" value={fixed} onChange={(e) => setFixed(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Sale Price per Unit</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Variable Cost per Unit</label>
          <input type="number" value={variable} onChange={(e) => setVariable(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Calculate Break-even Units
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 text-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Required Sales Volume to Break-even</span>
          <span className="text-2xl font-black text-green-400">{parseFloat(result).toLocaleString()} Units</span>
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
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
    const totalPayment = emi * t;
    const totalInterest = totalPayment - p;

    setResult({
      emi: emi.toFixed(0),
      interest: totalInterest.toFixed(0),
      total: totalPayment.toFixed(0)
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> EMI Loan Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate loan installments, total payable interest, and repayment totals.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Principal Loan Amount</label>
          <input type="number" value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Interest Rate (% Annual)</label>
          <input type="number" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Tenure (Months)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Calculate Loan EMI
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Monthly EMI Installment</span>
            <span className="text-base font-black text-blue-400">₹{parseFloat(result.emi).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Total Payable Interest</span>
            <span className="text-base font-black text-yellow-400">₹{parseFloat(result.interest).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Total Payback Amount</span>
            <span className="text-base font-black text-green-400">₹{parseFloat(result.total).toLocaleString('en-IN')}</span>
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
        <p className="text-xs text-white/50">Forecast 5-year growth values based on baseline revenue and CAGR percentage projections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Baseline Revenue (₹)</label>
          <input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Compound Annual Growth Rate (CAGR, %)</label>
          <input type="number" value={cagr} onChange={(e) => setCagr(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleForecast} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Forecast Growth
      </button>

      {forecast.length > 0 && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-2">
          <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">5-Year Growth Projections</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {forecast.map((f, idx) => (
              <div key={idx} className="p-2 bg-white/5 rounded-xl border border-white/5 text-center">
                <span className="block text-[9px] text-white/40 uppercase font-semibold">{f.year}</span>
                <span className="text-xs font-bold text-green-400">₹{parseFloat(f.revenue).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
