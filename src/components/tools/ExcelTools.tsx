import { useState } from 'react';
import { Copy, Check, FileSpreadsheet, Sparkles, Database, TableProperties, HelpCircle } from 'lucide-react';

export default function ExcelTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'formula-builder');
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
            { id: 'formula-builder', label: 'Formula Builder' },
            { id: 'xlookup', label: 'XLOOKUP Gen' },
            { id: 'index-match', label: 'INDEX MATCH Builder' },
            { id: 'cond-format', label: 'Conditional Format' },
            { id: 'pivot-suggest', label: 'Pivot Suggestions' },
            { id: 'data-cleaning', label: 'Cleaning Assistant' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold text-left whitespace-nowrap cursor-pointer transition-all border ${
                activeTool === t.id
                  ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md'
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
        {activeTool === 'formula-builder' && <FormulaBuilderTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'xlookup' && <XlookupTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'index-match' && <IndexMatchTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'cond-format' && <CondFormatTool />}
        {activeTool === 'pivot-suggest' && <PivotSuggestTool />}
        {activeTool === 'data-cleaning' && <DataCleaningTool onCopy={handleCopy} copied={copied} />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. Formula Builder                                                        */
/* ========================================================================== */
function FormulaBuilderTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [type, setType] = useState('SUMIFS');
  const [range, setRange] = useState('Sales[Revenue]');
  const [critRange, setCritRange] = useState('Sales[Region]');
  const [crit, setCrit] = useState('"India"');
  const [formula, setFormula] = useState('');

  const handleBuild = () => {
    let f = '';
    if (type === 'SUMIFS') {
      f = `=SUMIFS(${range}, ${critRange}, ${crit})`;
    } else if (type === 'AVERAGEIFS') {
      f = `=AVERAGEIFS(${range}, ${critRange}, ${crit})`;
    } else {
      f = `=COUNTIFS(${critRange}, ${crit})`;
    }
    setFormula(f);
  };

  return (
    <div className="space-y-6 text-xs font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
          <FileSpreadsheet size={20} /> Excel Formula Builder
        </h3>
        <p className="text-xs text-white/50">Build SUMIFS, COUNTIFS, and other conditional operations visually without typing complex syntax.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Formula Operations</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white cursor-pointer focus:border-emerald-500">
            <option value="SUMIFS">SUMIFS (Sum matching criteria)</option>
            <option value="AVERAGEIFS">AVERAGEIFS (Average matching criteria)</option>
            <option value="COUNTIFS">COUNTIFS (Count matching criteria)</option>
          </select>
        </div>
        {type !== 'COUNTIFS' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Sum Range</label>
            <input type="text" value={range} onChange={(e) => setRange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Criteria Range 1</label>
          <input type="text" value={critRange} onChange={(e) => setCritRange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Criteria 1 (Value/Text)</label>
          <input type="text" value={crit} onChange={(e) => setCrit(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
      </div>

      <button onClick={handleBuild} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
        Assemble Excel Formula
      </button>

      {formula && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-emerald-300 text-xs overflow-x-auto leading-relaxed">{formula}</pre>
          <button
            onClick={() => onCopy(formula, 'formula-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
          >
            {copied === 'formula-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. XLOOKUP Generator                                                      */
/* ========================================================================== */
function XlookupTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [val, setVal] = useState('A2');
  const [lookArr, setLookArr] = useState('Sheet2!A:A');
  const [retArr, setRetArr] = useState('Sheet2!B:B');
  const [errVal, setErrVal] = useState('"Not Found"');
  const [formula, setFormula] = useState('');

  const handleBuild = () => {
    const f = `=XLOOKUP(${val}, ${lookArr}, ${retArr}, ${errVal})`;
    setFormula(f);
  };

  return (
    <div className="space-y-6 text-xs font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
          <Database size={20} /> XLOOKUP Formula Builder
        </h3>
        <p className="text-xs text-white/50">Build modern lookup formulas for flexible search directions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Lookup Value Cell</label>
          <input type="text" value={val} onChange={(e) => setVal(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Lookup Array Range</label>
          <input type="text" value={lookArr} onChange={(e) => setLookArr(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Return Array Range</label>
          <input type="text" value={retArr} onChange={(e) => setRetArr(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">If Not Found (Fallback)</label>
          <input type="text" value={errVal} onChange={(e) => setErrVal(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
      </div>

      <button onClick={handleBuild} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
        Build XLOOKUP Formula
      </button>

      {formula && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-emerald-300 text-xs overflow-x-auto leading-relaxed">{formula}</pre>
          <button
            onClick={() => onCopy(formula, 'xlookup-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
          >
            {copied === 'xlookup-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. INDEX MATCH Builder                                                     */
/* ========================================================================== */
function IndexMatchTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [ret, setRet] = useState('Sheet2!B:B');
  const [val, setVal] = useState('A2');
  const [look, setLook] = useState('Sheet2!A:A');
  const [formula, setFormula] = useState('');

  const handleBuild = () => {
    const f = `=INDEX(${ret}, MATCH(${val}, ${look}, 0))`;
    setFormula(f);
  };

  return (
    <div className="space-y-6 text-xs font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
          <TableProperties size={20} /> INDEX MATCH Builder
        </h3>
        <p className="text-xs text-white/50">Build powerful lookup combinations compatible with older Excel versions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Return Range</label>
          <input type="text" value={ret} onChange={(e) => setRet(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Lookup Value</label>
          <input type="text" value={val} onChange={(e) => setVal(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Lookup Range</label>
          <input type="text" value={look} onChange={(e) => setLook(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
        </div>
      </div>

      <button onClick={handleBuild} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
        Build INDEX MATCH Formula
      </button>

      {formula && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-emerald-300 text-xs overflow-x-auto leading-relaxed">{formula}</pre>
          <button
            onClick={() => onCopy(formula, 'index-match-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
          >
            {copied === 'index-match-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Conditional Formatting Rules                                            */
/* ========================================================================== */
function CondFormatTool() {
  const [valType, setValType] = useState('dups');

  const guides: any = {
    dups: '1. Select the target range of cells.\n2. Go to Home -> Conditional Formatting -> Highlight Cells Rules -> Duplicate Values.\n3. Choose formatting color (e.g. Light Red Fill) and click OK.',
    gt: '1. Select target cells.\n2. Home -> Conditional Formatting -> Highlight Cells Rules -> Greater Than.\n3. Enter the value and select green/yellow formatting.'
  };

  const activeGuide = guides[valType] || guides.dups;

  return (
    <div className="space-y-6 text-xs font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
          <Sparkles size={20} /> Conditional Formatting Rules
        </h3>
        <p className="text-xs text-white/50">Follow quick step guides to configure visual cell highlights in Microsoft Excel.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Formatting Goal</label>
        <select value={valType} onChange={(e) => setValType(e.target.value)} className="w-full rounded-xl border border-white/5 bg-black/40 px-3 py-3 outline-none text-white cursor-pointer focus:border-emerald-500">
          <option value="dups">Highlight Duplicate Values</option>
          <option value="gt">Highlight Cells Greater Than Value</option>
        </select>
      </div>

      <div className="p-5 border border-white/5 rounded-2xl bg-black/30">
        <pre className="whitespace-pre-line leading-relaxed font-sans text-xs text-white/80">{activeGuide}</pre>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 5. Pivot Table Suggestions                                                 */
/* ========================================================================== */
function PivotSuggestTool() {
  const [cols, setCols] = useState('Date, Product, Region, Revenue, Units');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSuggest = () => {
    const list = cols.toLowerCase();
    const suggestionsList = [];
    
    if (list.includes('revenue') || list.includes('sales')) {
      suggestionsList.push('1. Revenue Trend: Put Date in Rows (grouped by Year/Month), and Revenue in Values (SUM). Use a Line Chart.');
    }
    if (list.includes('product') && (list.includes('revenue') || list.includes('sales'))) {
      suggestionsList.push('2. Top Products: Put Product in Rows, Revenue in Values (SUM), and sort Descending. Use a Bar Chart.');
    }
    if (list.includes('region') && (list.includes('revenue') || list.includes('sales'))) {
      suggestionsList.push('3. Regional Share: Put Region in Rows, Revenue in Values (Show Values As % of Grand Total). Use a Pie/Donut Chart.');
    }
    
    if (suggestionsList.length === 0) {
      suggestionsList.push('1. Standard Layout: Put any Categorical column in Rows and Numeric column in Values (SUM/AVERAGE).');
    }

    setSuggestions(suggestionsList);
  };

  return (
    <div className="space-y-6 text-xs font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
          <FileSpreadsheet size={20} /> Pivot Table Layout Suggestions
        </h3>
        <p className="text-xs text-white/50">Input your column headers; we suggest the best Pivot Table configurations.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Column Headers (Comma separated)</label>
        <input type="text" value={cols} onChange={(e) => setCols(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none focus:border-emerald-500" />
      </div>

      <button onClick={handleSuggest} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
        Analyze Headers
      </button>

      {suggestions.length > 0 && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3">
          <span className="text-[10px] text-white/40 uppercase font-bold block">Recommended Reports</span>
          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <p key={idx} className="leading-relaxed text-xs text-white/80">{s}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 6. Data Cleaning Assistant                                                 */
/* ========================================================================== */
function DataCleaningTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [caseType, setCaseType] = useState('trim');

  const formulas: any = {
    trim: {
      code: '=TRIM(A2)',
      desc: 'Removes all leading, trailing, and duplicate spaces from string values.'
    },
    proper: {
      code: '=PROPER(A2)',
      desc: 'Converts first character of each word to uppercase, and all remaining to lowercase.'
    },
    clean: {
      code: '=CLEAN(A2)',
      desc: 'Removes all non-printable characters from text strings.'
    }
  };

  const curr = formulas[caseType] || formulas.trim;

  return (
    <div className="space-y-6 text-xs font-medium">
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
          <FileSpreadsheet size={20} /> Excel Data Cleaning Assistant
        </h3>
        <p className="text-xs text-white/50">Lookup formulas to tidy up messy text columns in Excel.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Cleaning Task</label>
        <select value={caseType} onChange={(e) => setCaseType(e.target.value)} className="w-full rounded-xl border border-white/5 bg-black/40 px-3 py-3 outline-none text-white cursor-pointer focus:border-emerald-500">
          <option value="trim">Remove Extra Spaces (TRIM)</option>
          <option value="proper">Fix Text Capitalization (PROPER)</option>
          <option value="clean">Remove Non-Printable Chars (CLEAN)</option>
        </select>
      </div>

      <div className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-2 relative">
        <pre className="font-mono text-emerald-300 text-xs">{curr.code}</pre>
        <p className="text-white/60 leading-relaxed">{curr.desc}</p>
        <button
          onClick={() => onCopy(curr.code, 'clean-copy')}
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
        >
          {copied === 'clean-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
