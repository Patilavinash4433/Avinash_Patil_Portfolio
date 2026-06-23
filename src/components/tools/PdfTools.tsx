import { useState } from 'react';
import { Upload, FileText, Trash2, Settings, Download, Check, RefreshCw } from 'lucide-react';

interface FileQueueItem {
  id: string;
  name: string;
  size: string;
}

export default function PdfTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'merge-pdf');

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full text-white">
      {/* Sidebar Tool List */}
      {!hideSidebar && (
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
          {[
            { id: 'merge-pdf', label: 'Merge PDF' },
            { id: 'split-pdf', label: 'Split PDF' },
            { id: 'compress-pdf', label: 'Compress PDF' },
            { id: 'extract-pages', label: 'Extract Pages' },
            { id: 'pdf-to-word', label: 'PDF to Word' },
            { id: 'word-to-pdf', label: 'Word to PDF' },
            { id: 'watermark', label: 'PDF Watermark' }
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
      <div className="flex-1 bg-[#141418]/30 backdrop-blur-md rounded-2xl border border-white/5 p-6 min-h-[450px] flex flex-col justify-between">
        {activeTool === 'merge-pdf' && <PdfWorkspace actionLabel="Merge" icon={FileText} />}
        {activeTool === 'split-pdf' && <PdfWorkspace actionLabel="Split" icon={FileText} hasPageInput />}
        {activeTool === 'compress-pdf' && <PdfWorkspace actionLabel="Compress" icon={FileText} isCompression />}
        {activeTool === 'extract-pages' && <PdfWorkspace actionLabel="Extract" icon={FileText} hasPageInput />}
        {activeTool === 'pdf-to-word' && <PdfWorkspace actionLabel="Convert to Word" icon={FileText} />}
        {activeTool === 'word-to-pdf' && <PdfWorkspace actionLabel="Convert to PDF" icon={FileText} />}
        {activeTool === 'watermark' && <PdfWorkspace actionLabel="Apply Watermark" icon={FileText} hasWatermarkInput />}
      </div>
    </div>
  );
}

function PdfWorkspace({
  actionLabel,
  icon: Icon,
  hasPageInput,
  isCompression,
  hasWatermarkInput
}: {
  actionLabel: string;
  icon: any;
  hasPageInput?: boolean;
  isCompression?: boolean;
  hasWatermarkInput?: boolean;
}) {
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  
  // Custom states
  const [pageRange, setPageRange] = useState('1-3');
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const items = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }));
    setQueue(prev => [...prev, ...items]);
    setComplete(false);
  };

  const handleRemove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleProcess = () => {
    if (queue.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setComplete(false);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setComplete(true);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  const handleDownload = () => {
    // Simulated PDF Download
    const dummyContent = `%PDF-1.4\n%${actionLabel} Applied\n/Title (${queue[0]?.name || 'document'})\n%%EOF`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${queue[0]?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <Icon size={16} /> PDF {actionLabel} Tool
          </h3>
          <p className="text-xs text-white/50">Simulated file processor to execute operations completely client-side.</p>
        </div>

        {/* Drag and Drop Box */}
        <div className="relative border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-2xl bg-black/20 p-8 text-center flex flex-col items-center justify-center gap-2 transition-all">
          <Upload size={32} className="text-white/20" />
          <div>
            <span className="block text-white/70">Drag & drop files or click to upload</span>
            <span className="text-[10px] text-white/40">Accepts .pdf, .docx, .png, .jpg (Max 25MB)</span>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileAdd}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* File Queue List */}
        {queue.length > 0 && (
          <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-2">
            <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Queue ({queue.length})</span>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {queue.map((file) => (
                <div key={file.id} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={14} className="text-blue-400 shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-[10px] text-white/30 shrink-0 font-bold">({file.size})</span>
                  </div>
                  <button onClick={() => handleRemove(file.id)} className="text-white/40 hover:text-red-400 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuration settings options */}
        {queue.length > 0 && (hasPageInput || isCompression || hasWatermarkInput) && (
          <div className="p-4 border border-white/5 rounded-xl bg-black/40 space-y-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Settings size={12} /> Options</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hasPageInput && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/40 uppercase">Page Range (e.g. 1-3, 5)</label>
                  <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none focus:border-blue-500 text-white" />
                </div>
              )}
              {isCompression && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/40 uppercase">Compression Level</label>
                  <select value={compressionLevel} onChange={(e) => setCompressionLevel(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none text-white">
                    <option value="low">Low Compression (High Quality)</option>
                    <option value="medium">Medium Compression (Balanced)</option>
                    <option value="high">High Compression (Minimum Size)</option>
                  </select>
                </div>
              )}
              {hasWatermarkInput && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/40 uppercase">Watermark Text</label>
                  <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none focus:border-blue-500 text-white" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        {processing && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-white/50 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><RefreshCw size={12} className="animate-spin" /> Processing Documents...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {complete && (
          <div className="flex items-center gap-2 text-green-400 font-bold text-[10px] uppercase tracking-wider mb-2">
            <Check size={14} /> Process successfully completed!
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={queue.length === 0 || processing}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-20 py-3 text-xs font-bold uppercase tracking-wider transition-all"
          >
            {actionLabel} Files
          </button>
          
          {complete && (
            <button
              onClick={handleDownload}
              className="rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Download size={14} /> Download Output
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
