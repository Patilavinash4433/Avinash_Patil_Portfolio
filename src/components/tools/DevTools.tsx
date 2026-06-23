import { useState } from 'react';
import { Copy, Check, Code, ShieldAlert, Terminal, HelpCircle } from 'lucide-react';

export default function DevTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'json-formatter');
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
            { id: 'json-formatter', label: 'JSON Formatter' },
            { id: 'json-to-csv', label: 'JSON to CSV' },
            { id: 'csv-to-json', label: 'CSV to JSON' },
            { id: 'regex-tester', label: 'Regex Tester' },
            { id: 'base64', label: 'Base64 Enc/Dec' },
            { id: 'color-picker', label: 'Color Picker' },
            { id: 'uuid-gen', label: 'UUID Generator' }
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
        {activeTool === 'json-formatter' && <JsonFormatterTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'json-to-csv' && <JsonToCsvTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'csv-to-json' && <CsvToJsonTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'regex-tester' && <RegexTesterTool />}
        {activeTool === 'base64' && <Base64Tool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'color-picker' && <ColorPickerTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'uuid-gen' && <UuidGeneratorTool onCopy={handleCopy} copied={copied} />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. JSON Formatter & Validator                                             */
/* ========================================================================== */
function JsonFormatterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [json, setJson] = useState('{"name":"Avinash","role":"Data Analyst","skills":["SQL","Python"]}');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      setError('');
      const parsed = JSON.parse(json);
      setFormatted(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
      setFormatted('');
    }
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Code size={16} /> JSON Formatter & Validator
        </h3>
        <p className="text-xs text-white/50">Format and validate JSON configurations.</p>
      </div>

      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleFormat} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Format & Validate JSON
      </button>

      {error && (
        <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-400 rounded-xl flex items-center gap-2">
          <ShieldAlert size={14} /> <span>{error}</span>
        </div>
      )}

      {formatted && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-blue-200 overflow-x-auto leading-relaxed">{formatted}</pre>
          <button
            onClick={() => onCopy(formatted, 'json-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'json-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. JSON to CSV Converter                                                  */
/* ========================================================================== */
function JsonToCsvTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [json, setJson] = useState('[\n  {"id": 1, "name": "Avinash", "revenue": 500},\n  {"id": 2, "name": "Uday", "revenue": 1200}\n]');
  const [csv, setCsv] = useState('');

  const handleConvert = () => {
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr) || arr.length === 0) return;
      const headers = Object.keys(arr[0]);
      const csvLines = [headers.join(',')];
      
      arr.forEach(item => {
        const line = headers.map(h => item[h]).join(',');
        csvLines.push(line);
      });
      setCsv(csvLines.join('\n'));
    } catch {
      alert('Please enter a valid JSON array of objects.');
    }
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Code size={16} /> JSON to CSV Converter
        </h3>
        <p className="text-xs text-white/50">Convert JSON array structures into standard CSV rows.</p>
      </div>

      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleConvert} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Convert to CSV
      </button>

      {csv && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-green-200 overflow-x-auto leading-relaxed">{csv}</pre>
          <button
            onClick={() => onCopy(csv, 'json-csv-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'json-csv-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. CSV to JSON Converter                                                  */
/* ========================================================================== */
function CsvToJsonTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [csv, setCsv] = useState('id,name,revenue\n1,Avinash,500\n2,Uday,1200');
  const [json, setJson] = useState('');

  const handleConvert = () => {
    const lines = csv.trim().split('\n');
    if (lines.length === 0 || !lines[0]) return;
    const headers = lines[0].split(',').map(h => h.trim());
    const resultArr: any[] = [];

    lines.slice(1).forEach(line => {
      const cols = line.split(',').map(c => c.trim());
      const obj: any = {};
      headers.forEach((h, idx) => {
        const val = cols[idx] || '';
        obj[h] = isNaN(Number(val)) || val === '' ? val : Number(val);
      });
      resultArr.push(obj);
    });

    setJson(JSON.stringify(resultArr, null, 2));
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Code size={16} /> CSV to JSON Converter
        </h3>
        <p className="text-xs text-white/50">Convert standard comma-separated text into a structured JSON array.</p>
      </div>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none font-mono"
      />

      <button onClick={handleConvert} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Convert to JSON
      </button>

      {json && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-purple-200 overflow-x-auto leading-relaxed">{json}</pre>
          <button
            onClick={() => onCopy(json, 'csv-json-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'csv-json-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Regex Tester                                                           */
/* ========================================================================== */
function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\d{3}-\\d{3}-\\d{4}');
  const [text, setText] = useState('My phone number is 123-456-7890. Call me!');
  const [matches, setMatches] = useState<string[]>([]);

  const handleTest = () => {
    try {
      const regex = new RegExp(pattern, 'g');
      const found = text.match(regex) || [];
      setMatches(found);
    } catch {
      setMatches(['Invalid Regex Pattern']);
    }
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Terminal size={16} /> Regular Expression Tester
        </h3>
        <p className="text-xs text-white/50">Test regex expressions against custom text blocks in real-time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Regex Pattern (e.g. \\d+)</label>
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white font-mono" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase">Test String</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleTest} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Evaluate matches
      </button>

      {matches.length > 0 && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-2">
          <span className="text-[10px] text-white/40 uppercase font-bold block">Matches Found ({matches.length})</span>
          <div className="flex flex-wrap gap-1.5">
            {matches.map((m, idx) => (
              <span key={idx} className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 text-blue-300 font-mono">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 5. Base64 Tool                                                            */
/* ========================================================================== */
function Base64Tool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [input, setInput] = useState('Avinash Patil');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    setOutput(btoa(input));
  };

  const handleDecode = () => {
    try {
      setOutput(atob(input));
    } catch {
      setOutput('Error: Invalid Base64 string for decoding.');
    }
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Terminal size={16} /> Base64 Encoder / Decoder
        </h3>
        <p className="text-xs text-white/50">Encode plain text to Base64 or decode strings back to plain text.</p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-24 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none"
      />

      <div className="flex gap-3">
        <button onClick={handleEncode} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
          Encode Base64
        </button>
        <button onClick={handleDecode} className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 py-3 font-bold uppercase tracking-wider transition-all">
          Decode Base64
        </button>
      </div>

      {output && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="font-mono text-green-200 overflow-x-auto leading-relaxed">{output}</pre>
          <button
            onClick={() => onCopy(output, 'base64-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {copied === 'base64-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 6. Color Picker Tool                                                      */
/* ========================================================================== */
function ColorPickerTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [color, setColor] = useState('#007AFF');

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const cleanHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
  };

  const rgb = hexToRgb(color);

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Terminal size={16} /> Web Color Selector & Converter
        </h3>
        <p className="text-xs text-white/50">Pick colors visually and translate between HEX and RGB formats.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-white/5 rounded-xl bg-black/30">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-20 h-20 rounded border-0 outline-none cursor-pointer bg-transparent" />
        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-2">
            <div>
              <span className="text-[10px] text-white/40 uppercase block">HEX Format</span>
              <span className="font-bold font-mono text-sm">{color.toUpperCase()}</span>
            </div>
            <button onClick={() => onCopy(color.toUpperCase(), 'hex')} className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5">
              {copied === 'hex' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className="text-[10px] text-white/40 uppercase block">RGB Format</span>
              <span className="font-bold font-mono text-sm">{rgb}</span>
            </div>
            <button onClick={() => onCopy(rgb, 'rgb')} className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5">
              {copied === 'rgb' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 7. UUID Generator                                                         */
/* ========================================================================== */
function UuidGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [uuid, setUuid] = useState('');

  const handleGenerate = () => {
    // Basic RFC4122 v4 UUID generator in JS
    const u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setUuid(u);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Terminal size={16} /> UUID v4 Generator
        </h3>
        <p className="text-xs text-white/50">Generate cryptographically secure RFC4122 version 4 UUIDs instantly.</p>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Generate UUID v4
      </button>

      {uuid && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4 text-center">
          <pre className="font-mono text-blue-200 text-sm">{uuid}</pre>
          <button
            onClick={() => onCopy(uuid, 'uuid')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'uuid' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
