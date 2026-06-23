import { useState, useRef } from 'react';
import { 
  Copy, Check, Code, Database, BarChart, Download, Sparkles, Upload, FileSpreadsheet, Trash2, CheckCircle2, AlertCircle 
} from 'lucide-react';

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
            { id: 'pbi-theme', label: 'PBI Theme Gen' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold text-left whitespace-nowrap cursor-pointer transition-all border ${
                activeTool === t.id
                  ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-md'
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
        {activeTool === 'csv-cleaner' && <CsvCleanerTool />}
        {activeTool === 'pbi-theme' && <PbiThemeGeneratorTool />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. SQL Formatter                                                          */
/* ========================================================================== */
function SqlFormatterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [code, setCode] = useState('select id, name, sales_amount, order_date from orders left join customers on orders.customer_id = customers.id where sales_amount > 500 order by sales_amount desc');
  const [formatted, setFormatted] = useState('');

  const handleFormat = () => {
    let clean = code.trim();
    const keywords = ['select', 'from', 'where', 'and', 'or', 'join', 'left join', 'inner join', 'on', 'group by', 'order by', 'having', 'desc', 'asc', 'insert', 'into', 'values', 'create', 'table', 'update', 'delete', 'set'];
    
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
      .replace(/\s+LEFT JOIN\s+/g, '\nLEFT JOIN\n  ')
      .replace(/\s+INNER JOIN\s+/g, '\nINNER JOIN\n  ')
      .replace(/\s+ON\s+/g, ' ON ')
      .replace(/\s+ORDER BY\s+/g, '\nORDER BY\n  ')
      .replace(/\s+GROUP BY\s+/g, '\nGROUP BY\n  ')
      .replace(/\s+AND\s+/g, '\n  AND ')
      .replace(/\s+OR\s+/g, '\n  OR ');

    setFormatted(clean);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Database size={20} /> SQL Query Formatter
        </h3>
        <p className="text-xs text-white/50">Beautify raw SQL queries with standard capitalization and readable layout indents.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-4 text-xs focus:border-cyan-500 outline-none font-mono leading-relaxed"
        />

        <button 
          onClick={handleFormat} 
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-455 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          Format SQL Query
        </button>

        {formatted && (
          <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
            <pre className="font-mono text-cyan-300 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">{formatted}</pre>
            <button
              onClick={() => onCopy(formatted, 'sql-copy')}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
            >
              {copied === 'sql-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
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
    const keywords = ['calculate', 'sum', 'filter', 'all', 'average', 'count', 'related', 'values', 'divide', 'calculatetable', 'keepfilters', 'sumx', 'averagex'];
    
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Code size={20} /> DAX Formula Formatter
        </h3>
        <p className="text-xs text-white/50">Format calculations according to standard Power BI conventions.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-4 text-xs focus:border-cyan-500 outline-none font-mono leading-relaxed"
        />

        <button 
          onClick={handleFormat} 
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          Format DAX Formula
        </button>

        {formatted && (
          <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
            <pre className="font-mono text-purple-300 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">{formatted}</pre>
            <button
              onClick={() => onCopy(formatted, 'dax-copy')}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
            >
              {copied === 'dax-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
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
    let codeStr = '';
    const dateCol = `'Calendar'[Date]`;
    const fullCol = `'${tbl}'[${col}]`;

    switch (type) {
      case 'YTD':
        codeStr = `${metricName} = \nTOTALYTD(\n  SUM(${fullCol}),\n  ${dateCol}\n)`;
        break;
      case 'QTD':
        codeStr = `${metricName} = \nTOTALQTD(\n  SUM(${fullCol}),\n  ${dateCol}\n)`;
        break;
      case 'YoY':
        codeStr = `${metricName} Growth = \nVAR _PrevYear = \n  CALCULATE(\n    SUM(${fullCol}),\n    SAMEPERIODLASTYEAR(${dateCol})\n  )\nRETURN\n  DIVIDE(\n    SUM(${fullCol}) - _PrevYear,\n    _PrevYear\n  )`;
        break;
      case 'Running':
        codeStr = `${metricName} Cumulative = \nCALCULATE(\n  SUM(${fullCol}),\n  FILTER(\n    ALL(${dateCol}),\n    ${dateCol} <= MAX(${dateCol})\n  )\n)`;
        break;
    }
    setGenerated(codeStr);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Code size={20} /> Time-Intelligence DAX Measure Builder
        </h3>
        <p className="text-xs text-white/50">Generate common Power BI calculations visually by choosing parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-white/50 uppercase font-semibold">Measure Name</label>
            <input type="text" value={metricName} onChange={(e) => setMetricName(e.target.value)} className="w-full text-xs mt-1.5 rounded-xl border border-white/5 bg-black/40 px-3 py-2 outline-none focus:border-cyan-500" />
          </div>
          
          <div>
            <label className="text-[10px] text-white/50 uppercase font-semibold">Fact Table</label>
            <input type="text" value={tbl} onChange={(e) => setTbl(e.target.value)} className="w-full text-xs mt-1.5 rounded-xl border border-white/5 bg-black/40 px-3 py-2 outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-white/50 uppercase font-semibold">Value Column</label>
            <input type="text" value={col} onChange={(e) => setCol(e.target.value)} className="w-full text-xs mt-1.5 rounded-xl border border-white/5 bg-black/40 px-3 py-2 outline-none focus:border-cyan-500" />
          </div>

          <div>
            <label className="text-[10px] text-white/50 uppercase font-semibold">Calculation Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full text-xs mt-1.5 rounded-xl border border-white/5 bg-black/40 px-3 py-2 outline-none focus:border-cyan-500 cursor-pointer">
              <option value="YTD">Year-to-Date (YTD)</option>
              <option value="QTD">Quarter-to-Date (QTD)</option>
              <option value="YoY">Year-over-Year Growth % (YoY)</option>
              <option value="Running">Running Total (Cumulative)</option>
            </select>
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
        Generate DAX Measure
      </button>

      {generated && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-purple-300 text-xs overflow-x-auto leading-relaxed">{generated}</pre>
          <button
            onClick={() => onCopy(generated, 'dax-gen-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
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
  const [vertical, setVertical] = useState('Finance');

  const kpis: any = {
    Finance: [
      { name: 'Gross Profit Margin', formula: '(Gross Profit / Revenue) * 100', desc: 'Indicates the percentage of revenue remaining after subtracting COGS.' },
      { name: 'Quick Ratio', formula: '(Cash & Equivalents + Marketable Securities + Accounts Receivable) / Current Liabilities', desc: 'Measures high liquidity capabilities to settle short obligations.' },
      { name: 'EBITDA Margin', formula: '(EBITDA / Revenue) * 100', desc: 'Operating profitability representation before interest, taxes, and asset write-downs.' }
    ],
    SaaS: [
      { name: 'Monthly Recurring Revenue (MRR)', formula: 'Sum(Active Subscribers * Monthly Plan Fee)', desc: 'Predictable total revenue stream calculated on monthly intervals.' },
      { name: 'LTV to CAC Ratio', formula: 'Customer Lifetime Value / Customer Acquisition Cost', desc: 'Core metric measuring customer value health compared to onboarding acquisition costs.' },
      { name: 'Net Revenue Churn', formula: '((Lost MRR - Expansion MRR) / Starting MRR) * 100', desc: 'Measures subscription revenue loss rate.' }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <BarChart size={20} /> Business KPI Catalog
        </h3>
        <p className="text-xs text-white/50">Look up standard formulas and operational definitions for key corporate verticals.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Select Vertical / Industry</label>
        <select value={vertical} onChange={(e) => setVertical(e.target.value)} className="w-full text-xs rounded-xl border border-white/5 bg-black/40 px-3 py-3 outline-none text-white cursor-pointer focus:border-cyan-500">
          <option value="Finance">Corporate Finance</option>
          <option value="SaaS">SaaS & Subscriptions</option>
        </select>
      </div>

      <div className="space-y-4">
        {(kpis[vertical] || []).map((k: any, idx: number) => (
          <div key={idx} className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-1.5">
            <h4 className="font-bold text-sm text-cyan-300">{k.name}</h4>
            <p className="text-white/80 text-xs font-normal leading-relaxed">{k.desc}</p>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <BarChart size={20} /> BI Dashboard Layout Generator
        </h3>
        <p className="text-xs text-white/50">Get wireframe guidelines optimized for specific user audiences.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Target Audience</label>
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full text-xs rounded-xl border border-white/5 bg-black/40 px-3 py-3 outline-none text-white cursor-pointer focus:border-cyan-500">
          <option value="Executive">Executive / CEO (High-level KPIs)</option>
          <option value="Analyst">Operational / Analyst (Detailed Exploration)</option>
        </select>
      </div>

      <div className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-3">
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Dashboard Type</span>
          <span className="font-bold text-sm text-cyan-400">{curr.type}</span>
        </div>
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1 font-bold">Wireframe Recommendation</span>
          <pre className="whitespace-pre-line leading-relaxed font-sans font-medium text-xs text-white/80">{curr.layout}</pre>
        </div>
        <div className="text-[10px] border-t border-white/5 pt-2 text-purple-400 uppercase tracking-widest font-bold">
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
  const [driver, setDriver] = useState('increased marketing campaign conversion');
  const [insight, setInsight] = useState('');

  const handleGenerate = () => {
    const text = `${metric} increased by ${val} quarter-over-quarter, primarily driven by ${driver}. This growth signals positive customer response and improved campaign yield, recommending further scale in similar verticals next quarter.`;
    setInsight(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Sparkles size={20} /> Business Insight Builder
        </h3>
        <p className="text-xs text-white/50">Translate raw numbers and operational variables into professional data stories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Metric</label>
          <input type="text" value={metric} onChange={(e) => setMetric(e.target.value)} className="w-full text-xs rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Change Value</label>
          <input type="text" value={val} onChange={(e) => setVal(e.target.value)} className="w-full text-xs rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Core Driver</label>
          <input type="text" value={driver} onChange={(e) => setDriver(e.target.value)} className="w-full text-xs rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
        Build Insight Bullet
      </button>

      {insight && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4 text-xs font-medium leading-relaxed">
          <p>{insight}</p>
          <button
            onClick={() => onCopy(insight, 'insight-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
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
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsvText = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Parse header and rows
    const hdrs = lines[0].split(',');
    const rows = lines.slice(1).map(l => l.split(','));

    setHeaders(hdrs);
    setCsvData(rows);

    // Calculate metadata
    let emptyCells = 0;
    rows.forEach(row => {
      row.forEach(cell => {
        if (!cell || cell.trim() === '') emptyCells++;
      });
    });

    setSummary({
      rowsCount: rows.length,
      colsCount: hdrs.length,
      nullCount: emptyCells
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      parseCsvText(text);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Database size={20} /> Dataset Analyzer
        </h3>
        <p className="text-xs text-white/50">Upload a CSV file client-side to inspect row/column shape and null layouts.</p>
      </div>

      {/* Drag & Drop File Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-2xl bg-black/20 p-8 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
      >
        <Upload size={32} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
        <div>
          <span className="block text-xs font-bold text-white/70">Drag & drop CSV files here or click to browse</span>
          <span className="text-[10px] text-white/40 font-semibold uppercase">Processed 100% locally</span>
        </div>
        <input 
          ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" 
        />
      </div>

      {isProcessing && <div className="text-center py-4 text-xs font-bold text-cyan-400 animate-pulse">Parsing CSV Records...</div>}

      {summary && (
        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Rows</span>
              <span className="text-base font-black text-white">{summary.rowsCount}</span>
            </div>
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Columns</span>
              <span className="text-base font-black text-cyan-400">{summary.colsCount}</span>
            </div>
            <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Null / Empty Cells</span>
              <span className={`text-base font-black ${summary.nullCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>{summary.nullCount}</span>
            </div>
          </div>

          {/* Interactive Data Table Preview */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 block">Tabular Grid Preview (First 8 Rows)</span>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-[9px] uppercase tracking-wider font-extrabold">
                    {headers.map((h, idx) => (
                      <th key={idx} className="py-2.5 px-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-white/70">
                  {csvData.slice(0, 8).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02]">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap">{cell || <span className="text-yellow-500 font-bold">NULL</span>}</td>
                      ))}
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
/* 8. CSV Cleaner & Deduplicator                                             */
/* ========================================================================== */
function CsvCleanerTool() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setStatus('Ready to clean');
    setCleanedBlob(null);
  };

  const handleClean = () => {
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const header = lines[0];
      const dataRows = lines.slice(1);
      
      // Deduplicate rows
      const uniqueRows = Array.from(new Set(dataRows));
      const cleanContent = [header, ...uniqueRows].join('\n');
      
      const blob = new Blob([cleanContent], { type: 'text/csv' });
      setCleanedBlob(blob);
      setStatus(`Cleaned! Removed ${dataRows.length - uniqueRows.length} duplicate rows.`);
    };
    reader.readAsText(csvFile);
  };

  const handleDownload = () => {
    if (!cleanedBlob || !csvFile) return;
    const url = URL.createObjectURL(cleanedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${csvFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Database size={20} /> CSV Deduplicator & Cleaner
        </h3>
        <p className="text-xs text-white/50">Upload large datasets to eliminate identical records client-side instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="space-y-4">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Cleaner Console</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Choose CSV File
            </button>
            <span className="text-xs text-white/60 truncate max-w-[200px]">{csvFile ? csvFile.name : 'No file chosen'}</span>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </div>

          <button 
            onClick={handleClean} 
            disabled={!csvFile}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-455 hover:bg-cyan-400 disabled:opacity-30 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            Remove Duplicate Rows
          </button>
        </div>

        <div className="bg-black/35 rounded-2xl p-5 border border-white/5 flex flex-col justify-center gap-3">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">Operations Output</span>
          {status ? (
            <div className="flex items-center gap-2 text-xs">
              {cleanedBlob ? <CheckCircle2 size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-yellow-400" />}
              <span className={cleanedBlob ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>{status}</span>
            </div>
          ) : (
            <span className="text-xs text-white/30">Upload a CSV file to execute data deduplication.</span>
          )}

          {cleanedBlob && (
            <button
              onClick={handleDownload}
              className="mt-2 w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-300 border border-green-500/20 text-xs font-bold uppercase transition-all cursor-pointer"
            >
              <Download size={14} /> Download Cleaned CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 9. Power BI Theme Generator                                              */
/* ========================================================================== */
function PbiThemeGeneratorTool() {
  const [themeName, setThemeName] = useState('Avinash Enterprise Theme');
  const [primary, setPrimary] = useState('#0EA5E9');
  const [secondary, setSecondary] = useState('#10B981');
  const [darkBackground, setDarkBackground] = useState(true);

  const handleDownload = () => {
    const themeJson = {
      name: themeName,
      dataColors: [primary, secondary, '#6366F1', '#EC4899', '#F59E0B', '#14B8A6', '#8B5CF6', '#64748B'],
      background: darkBackground ? '#0F172A' : '#FFFFFF',
      foreground: darkBackground ? '#F1F5F9' : '#0F172A',
      tableAccent: primary
    };

    const str = JSON.stringify(themeJson, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName.toLowerCase().replace(/\s+/g, '_')}_theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Sparkles size={20} /> Power BI Theme Architect
        </h3>
        <p className="text-xs text-white/50">Pick corporate palettes to compile custom JSON theme files for Power BI report desktops.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="space-y-4">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Palette Selection</span>
          
          <div>
            <label className="text-[9px] text-white/40 uppercase font-semibold">Theme Name</label>
            <input type="text" value={themeName} onChange={(e) => setThemeName(e.target.value)} className="w-full text-xs mt-1.5 rounded-xl border border-white/5 bg-black/40 px-3 py-2 outline-none focus:border-cyan-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-white/40 uppercase font-semibold block mb-1">Primary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-8 h-8 rounded border-0 outline-none cursor-pointer" />
                <input type="text" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-full text-[10px] rounded-xl border border-white/5 bg-black/40 p-2 outline-none font-mono" />
              </div>
            </div>

            <div>
              <label className="text-[9px] text-white/40 uppercase font-semibold block mb-1">Secondary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-8 h-8 rounded border-0 outline-none cursor-pointer" />
                <input type="text" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-full text-[10px] rounded-xl border border-white/5 bg-black/40 p-2 outline-none font-mono" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="dark-bg-check" checked={darkBackground} onChange={(e) => setDarkBackground(e.target.checked)} className="rounded text-cyan-500 focus:ring-0 cursor-pointer" />
            <label htmlFor="dark-bg-check" className="text-xs text-white/70 select-none cursor-pointer">Compile with Dark Mode Background</label>
          </div>
        </div>

        <div className="bg-black/35 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-2">Live JSON Output</span>
          <pre className="font-mono text-[10px] text-cyan-200 bg-black/50 p-3 rounded-xl max-h-36 overflow-y-auto leading-relaxed border border-white/5">
            {`{
  "name": "${themeName}",
  "dataColors": ["${primary}", "${secondary}", ...],
  "background": "${darkBackground ? '#0F172A' : '#FFFFFF'}"
}`}
          </pre>
          <button 
            onClick={handleDownload} 
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-4"
          >
            <Download size={14} /> Download Theme JSON
          </button>
        </div>
      </div>
    </div>
  );
}
