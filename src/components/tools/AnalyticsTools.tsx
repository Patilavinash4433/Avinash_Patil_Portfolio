import { useState } from 'react';
import { Copy, Check, Code, Database, BarChart, Download, Sparkles } from 'lucide-react';

export default function AnalyticsTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'sql-formatter');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full text-white">
      {/* Sidebar Tool List */}
      {!hideSidebar && (
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
          {[
            { id: 'sql-formatter', label: 'SQL Formatter' },
            { id: 'dax-formatter', label: 'DAX Formatter' },
            { id: 'dax-gen', label: 'DAX Measure Gen' },
            { id: 'kpi-gen', label: 'KPI Catalog' },
            { id: 'dashboard-gen', label: 'Dashboard Layouts' },
            { id: 'insight-gen', label: 'Insight Generator' },
            { id: 'dataset-analyzer', label: 'Dataset Analyzer' },
            { id: 'csv-cleaner', label: 'CSV Cleaner' },
            { id: 'dup-finder', label: 'Duplicate Finder' },
            { id: 'missing-checker', label: 'Missing Values' },
            { id: 'pbi-theme', label: 'PBI Theme Gen' }
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
        {activeTool === 'sql-formatter' && <SqlFormatterTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'dax-formatter' && <DaxFormatterTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'dax-gen' && <DaxGeneratorTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'kpi-gen' && <KpiCatalogTool />}
        {activeTool === 'dashboard-gen' && <DashboardLayoutTool />}
        {activeTool === 'insight-gen' && <InsightGeneratorTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'dataset-analyzer' && <DatasetAnalyzerTool />}
        {activeTool === 'csv-cleaner' && <CsvCleanerTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'dup-finder' && <DuplicateFinderTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'missing-checker' && <MissingCheckerTool />}
        {activeTool === 'pbi-theme' && <PbiThemeGeneratorTool />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. SQL Formatter                                                          */
/* ========================================================================== */
function SqlFormatterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [code, setCode] = useState('select id, name, sales_amount from orders where sales_amount > 500 order by sales_amount desc');
  const [formatted, setFormatted] = useState('');

  const handleFormat = () => {
    let clean = code.trim();
    // Uppercase key SQL keywords
    const keywords = ['select', 'from', 'where', 'and', 'or', 'join', 'left join', 'inner join', 'on', 'group by', 'order by', 'having', 'desc', 'asc', 'insert', 'into', 'values', 'create', 'table'];
    
    // Quick regex capitalize
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, kw.toUpperCase());
    });

    // Formatting indentations and breaks
    clean = clean
      .replace(/SELECT\s+/g, 'SELECT\n  ')
      .replace(/,\s*/g, ',\n  ')
      .replace(/\s+FROM\s+/g, '\nFROM\n  ')
      .replace(/\s+WHERE\s+/g, '\nWHERE\n  ')
      .replace(/\s+ORDER BY\s+/g, '\nORDER BY\n  ')
      .replace(/\s+GROUP BY\s+/g, '\nGROUP BY\n  ')
      .replace(/\s+AND\s+/g, '\n  AND ')
      .replace(/\s+OR\s+/g, '\n  OR ');

    setFormatted(clean);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Database size={16} /> SQL Query Formatter
        </h3>
        <p className="text-xs text-white/50">Tidy up raw SQL queries with proper indents and capitalized statements.</p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleFormat} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Format SQL Query
      </button>

      {formatted && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-blue-200 overflow-x-auto leading-relaxed">{formatted}</pre>
          <button
            onClick={() => onCopy(formatted, 'sql-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'sql-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. DAX Formatter                                                          */
/* ========================================================================== */
function DaxFormatterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [code, setCode] = useState('total sales = calculate(sum(sales[amount]), filter(all(sales), sales[year] = 2026))');
  const [formatted, setFormatted] = useState('');

  const handleFormat = () => {
    let clean = code.trim();
    const keywords = ['calculate', 'sum', 'filter', 'all', 'average', 'count', 'related', 'values', 'divide', 'calculateTable', 'keepFilters', 'sumX', 'averageX'];
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, kw.toUpperCase());
    });

    // Formatting indentations and breaks
    clean = clean
      .replace(/SUM\(/g, 'SUM( ')
      .replace(/CALCULATE\(/g, 'CALCULATE(\n  ')
      .replace(/,\s*FILTER\(/g, ',\n  FILTER(\n    ')
      .replace(/,\s*/g, ',\n  ');

    setFormatted(clean);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Code size={16} /> DAX Formula Formatter
        </h3>
        <p className="text-xs text-white/50">Clean up messy Power BI DAX calculations.</p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleFormat} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Format DAX Formula
      </button>

      {formatted && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-purple-200 overflow-x-auto leading-relaxed">{formatted}</pre>
          <button
            onClick={() => onCopy(formatted, 'dax-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'dax-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. DAX Measure Generator                                                  */
/* ========================================================================== */
function DaxGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [metricName, setMetricName] = useState('YTD Revenue');
  const [tbl, setTbl] = useState('Sales');
  const [col, setCol] = useState('Revenue');
  const [type, setType] = useState('YTD');
  const [generated, setGenerated] = useState('');

  const handleGenerate = () => {
    let dax = '';
    if (type === 'YTD') {
      dax = `${metricName} = \nTOTALYTD(\n  SUM('${tbl}'[${col}]),\n  'Calendar'[Date]\n)`;
    } else if (type === 'YoY') {
      dax = `${metricName} = \nVAR CurrentSales = SUM('${tbl}'[${col}])\nVAR PriorSales = CALCULATE(SUM('${tbl}'[${col}]), SAMEPERIODLASTYEAR('Calendar'[Date]))\nRETURN\nDIVIDE(CurrentSales - PriorSales, PriorSales, 0)`;
    } else {
      dax = `${metricName} = \nCALCULATE(\n  SUM('${tbl}'[${col}]),\n  ALL('${tbl}')\n)`;
    }
    setGenerated(dax);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Code size={16} /> DAX Measure Generator
        </h3>
        <p className="text-xs text-white/50">Build common time-intelligence DAX measures visually.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Measure Name</label>
          <input type="text" value={metricName} onChange={(e) => setMetricName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-blue-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Calculation Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-blue-500 text-white">
            <option value="YTD">Year-to-Date (YTD)</option>
            <option value="YoY">Year-over-Year Change (YoY%)</option>
            <option value="ALL">Total Contribution (ALL Filter)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Table Name</label>
          <input type="text" value={tbl} onChange={(e) => setTbl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Target Column</label>
          <input type="text" value={col} onChange={(e) => setCol(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Generate DAX Measure
      </button>

      {generated && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-purple-200 overflow-x-auto leading-relaxed">{generated}</pre>
          <button
            onClick={() => onCopy(generated, 'dax-gen-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'dax-gen-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. KPI Catalog                                                            */
/* ========================================================================== */
function KpiCatalogTool() {
  const [vertical, setVertical] = useState('SaaS');

  const kpis: any = {
    SaaS: [
      { name: 'MRR (Monthly Recurring Revenue)', formula: 'Sum of monthly subscription charges', desc: 'Core metric tracking recurring revenue streams.' },
      { name: 'CAC (Customer Acquisition Cost)', formula: 'Marketing Cost / New Customers Acquired', desc: 'Tracks investment efficiency for new sales.' },
      { name: 'LTV:CAC Ratio', formula: 'Lifetime Value / CAC', desc: 'Indicates unit economics health. Good benchmark is > 3.0.' }
    ],
    ECommerce: [
      { name: 'AOV (Average Order Value)', formula: 'Total Revenue / Total Orders', desc: 'Measures spend scale per transaction.' },
      { name: 'Cart Abandonment Rate', formula: '(1 - Orders / Created Carts) * 100', desc: 'Measures check-out flow bottlenecks.' },
      { name: 'ROAS (Return on Ad Spend)', formula: 'Campaign Revenue / Ad Spend', desc: 'Tracks digital marketing returns.' }
    ]
  };

  return (
    <div className="space-y-4 text-xs">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <BarChart size={16} /> Business KPI Catalog
        </h3>
        <p className="text-xs text-white/50">Lookup standard metrics, calculations, and explanations by business vertical.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest">Vertical</label>
        <select value={vertical} onChange={(e) => setVertical(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-blue-500 text-white">
          <option value="SaaS">SaaS & Subscriptions</option>
          <option value="ECommerce">E-Commerce & Retail</option>
        </select>
      </div>

      <div className="space-y-4">
        {(kpis[vertical] || []).map((k: any, idx: number) => (
          <div key={idx} className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-1.5">
            <h4 className="font-bold text-sm text-blue-300">{k.name}</h4>
            <p className="text-white/80 font-medium">{k.desc}</p>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
              Formula: <span className="font-mono text-purple-400 lowercase font-medium">{k.formula}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 5. Dashboard Layouts                                                      */
/* ========================================================================== */
function DashboardLayoutTool() {
  const [audience, setAudience] = useState('Executive');

  const layouts: any = {
    Executive: {
      type: 'Strategic Dashboard (C-Suite)',
      layout: '1. Top row: 4 large KPI cards (Revenue, Expenses, Profit Margin, Active Users).\n2. Middle row: 1 full-width Revenue Trend line chart (past 12 months).\n3. Bottom row: 2 column side-by-side charts: Product Category Revenue (bar) and Regional Breakdown (map).',
      tip: 'Keep it clean. Restrict filter options. Avoid tables or detailed spreadsheets.'
    },
    Analyst: {
      type: 'Analytical / Exploratory Dashboard',
      layout: '1. Top row: Full width filters & date ranges.\n2. Middle row: 2 charts: Correlation plot (scatter) and distribution curves.\n3. Bottom row: Large detailed data table with search, sorting, and export capabilities.',
      tip: 'Allow full drill-through and details extraction. Include rich tooltips.'
    }
  };

  const curr = layouts[audience] || layouts.Executive;

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <BarChart size={16} /> BI Dashboard Layout Generator
        </h3>
        <p className="text-xs text-white/50">Get optimized dashboard layouts and wireframes based on your target audience.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest">Target Audience</label>
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none text-white">
          <option value="Executive">Executive / CEO (High-level KPIs)</option>
          <option value="Analyst">Operational / Analyst (Detailed Exploration)</option>
        </select>
      </div>

      <div className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-3">
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest block">Dashboard Type</span>
          <span className="font-bold text-sm text-blue-400">{curr.type}</span>
        </div>
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Wireframe Recommendation</span>
          <pre className="whitespace-pre-line leading-relaxed font-sans font-medium text-white/80">{curr.layout}</pre>
        </div>
        <div className="text-[10px] border-t border-white/5 pt-2 text-purple-400 uppercase tracking-widest">
          Design Tip: <span className="text-white/60 font-sans capitalize font-medium">{curr.tip}</span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 6. Insight Generator                                                      */
/* ========================================================================== */
function InsightGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [metric, setMetric] = useState('Revenue');
  const [val, setVal] = useState('15%');
  const [reason, setReason] = useState('increased marketing campaign conversion');
  const [insight, setInsight] = useState('');

  const handleGenerate = () => {
    const text = `${metric} increased by ${val} quarter-over-quarter, primarily driven by ${reason}. This growth signals positive customer response and improved campaign yield, recommending further scale in similar verticals next quarter.`;
    setInsight(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Business Insight Builder
        </h3>
        <p className="text-xs text-white/50">Translate raw numbers and operational variables into professional data stories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Metric</label>
          <input type="text" value={metric} onChange={(e) => setMetric(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Change Value</label>
          <input type="text" value={val} onChange={(e) => setVal(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Core Driver</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Build Insight Bullet
      </button>

      {insight && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4 text-xs font-medium leading-relaxed">
          <p>{insight}</p>
          <button
            onClick={() => onCopy(insight, 'insight-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'insight-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 7. Dataset Analyzer                                                      */
/* ========================================================================== */
function DatasetAnalyzerTool() {
  const [csv, setCsv] = useState('ID,Name,Revenue,Active\n1,Alpha,500,True\n2,Beta,,True\n3,Gamma,1200,False');
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    const lines = csv.trim().split('\n');
    if (lines.length === 0 || !lines[0]) return;
    
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    
    // Count missing cells
    let missing = 0;
    rows.forEach(r => {
      r.forEach(c => {
        if (!c.trim()) missing++;
      });
    });

    setResult({
      cols: headers.length,
      rows: rows.length,
      headers,
      missing
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Database size={16} /> Dataset Analyzer
        </h3>
        <p className="text-xs text-white/50">Analyze pasted CSV datasets to inspect columns, headers, and rows instantly.</p>
      </div>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleAnalyze} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Analyze CSV Data
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Columns</span>
            <span className="text-base font-black text-blue-400">{result.cols}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Rows</span>
            <span className="text-base font-black text-purple-400">{result.rows}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Missing Cells</span>
            <span className={`text-base font-black ${result.missing > 0 ? 'text-yellow-400' : 'text-green-400'}`}>{result.missing}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 8. CSV Cleaner                                                            */
/* ========================================================================== */
function CsvCleanerTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [csv, setCsv] = useState('ID,Name,Name\n1,Uday,Uday\n2,Avinash,Avinash\n1,Uday,Uday');
  const [cleaned, setCleaned] = useState('');

  const handleClean = () => {
    const lines = csv.trim().split('\n');
    const set = new Set(lines);
    setCleaned(Array.from(set).join('\n'));
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Database size={16} /> CSV Deduplicator / Cleaner
        </h3>
        <p className="text-xs text-white/50">Clean raw datasets by eliminating duplicate rows instantly.</p>
      </div>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleClean} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Remove Duplicate Rows
      </button>

      {cleaned && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-green-200 overflow-x-auto leading-relaxed">{cleaned}</pre>
          <button
            onClick={() => onCopy(cleaned, 'csv-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'csv-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 9. Duplicate Finder                                                      */
/* ========================================================================== */
function DuplicateFinderTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [list, setList] = useState('Apple\nOrange\nApple\nBanana\nOrange');
  const [dups, setDups] = useState<string[]>([]);

  const handleFind = () => {
    const items = list.split('\n').map(i => i.trim()).filter(Boolean);
    const seen = new Set();
    const duplicates = new Set<string>();
    items.forEach(i => {
      if (seen.has(i)) {
        duplicates.add(i);
      } else {
        seen.add(i);
      }
    });
    setDups(Array.from(duplicates));
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Database size={16} /> Duplicate Finder
        </h3>
        <p className="text-xs text-white/50">Find duplicate values in a list (one item per line).</p>
      </div>

      <textarea
        value={list}
        onChange={(e) => setList(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none"
      />

      <button onClick={handleFind} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Find Duplicates
      </button>

      {dups.length > 0 && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4">
          <span className="text-[10px] text-white/40 uppercase font-bold block mb-2">Duplicate Items Found</span>
          <div className="flex flex-wrap gap-1.5">
            {dups.map((d, idx) => (
              <span key={idx} className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-red-300">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 10. Missing Values Checker                                                */
/* ========================================================================== */
function MissingCheckerTool() {
  const [csv, setCsv] = useState('Col1,Col2,Col3\nVal1,,Val3\n,Val5,Val6');
  const [reports, setReports] = useState<any[]>([]);

  const handleCheck = () => {
    const lines = csv.trim().split('\n');
    if (lines.length === 0) return;
    const headers = lines[0].split(',');
    const missingCounts = new Array(headers.length).fill(0);
    
    lines.slice(1).forEach(line => {
      const cols = line.split(',');
      cols.forEach((col, idx) => {
        if (idx < headers.length && !col.trim()) {
          missingCounts[idx]++;
        }
      });
    });

    const reportList = headers.map((h, idx) => ({
      column: h,
      missing: missingCounts[idx]
    }));

    setReports(reportList);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Database size={16} /> Missing Value Checker
        </h3>
        <p className="text-xs text-white/50">Identify and count empty values in each column of your CSV dataset.</p>
      </div>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleCheck} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Check Missing Values
      </button>

      {reports.length > 0 && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-2">
          <span className="text-[10px] text-white/40 uppercase font-bold block">Column Health Report</span>
          <div className="space-y-1.5">
            {reports.map((r, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-1">
                <span>{r.column}</span>
                <span className={`font-bold ${r.missing > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {r.missing} empty cells
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 11. Power BI Theme Generator                                              */
/* ========================================================================== */
function PbiThemeGeneratorTool() {
  const [themeName, setThemeName] = useState('Avinash Custom Theme');
  const [primary, setPrimary] = useState('#007AFF');
  const [secondary, setSecondary] = useState('#00C6FF');

  const handleDownload = () => {
    const themeJson = {
      name: themeName,
      dataColors: [primary, secondary, '#5856D6', '#FF2D55', '#FF9500', '#4CD964', '#FFCC00', '#8E8E93'],
      background: '#FFFFFF',
      foreground: '#111111',
      tableAccent: primary
    };

    const str = JSON.stringify(themeJson, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName.replace(/\s+/g, '_')}_theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Power BI Custom Theme Generator
        </h3>
        <p className="text-xs text-white/50">Pick accent colors to generate a downloadable theme JSON file for Power BI Desktop.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Theme Name</label>
          <input type="text" value={themeName} onChange={(e) => setThemeName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Primary Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-8 h-8 rounded border-0 outline-none cursor-pointer" />
            <input type="text" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none font-mono" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Secondary Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-8 h-8 rounded border-0 outline-none cursor-pointer" />
            <input type="text" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none font-mono" />
          </div>
        </div>
      </div>

      <button onClick={handleDownload} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
        <Download size={14} /> Download Power BI Theme JSON
      </button>
    </div>
  );
}
