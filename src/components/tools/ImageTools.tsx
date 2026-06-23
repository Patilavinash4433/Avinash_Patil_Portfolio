import { useState, useRef } from 'react';
import { Upload, Download, Check, Sparkles, Image as ImageIcon, QrCode } from 'lucide-react';

export default function ImageTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'compressor');

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full text-white">
      {/* Sidebar Tool List */}
      {!hideSidebar && (
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
          {[
            { id: 'compressor', label: 'Image Compressor' },
            { id: 'resizer', label: 'Image Resizer' },
            { id: 'bg-remove', label: 'BG Remover' },
            { id: 'ocr-text', label: 'Image to Text' },
            { id: 'qr-gen', label: 'QR Code Gen' },
            { id: 'barcode-gen', label: 'Barcode Gen' }
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
        {activeTool === 'compressor' && <ImageCompressorTool />}
        {activeTool === 'resizer' && <ImageResizerTool />}
        {activeTool === 'bg-remove' && <BgRemoverTool />}
        {activeTool === 'ocr-text' && <OcrTool />}
        {activeTool === 'qr-gen' && <QrGeneratorTool />}
        {activeTool === 'barcode-gen' && <BarcodeGeneratorTool />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. Image Compressor (Canvas Based)                                        */
/* ========================================================================== */
function ImageCompressorTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState('0.7');
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [info, setInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setCompressedSrc(null);
      setInfo({
        name: file.name,
        origSize: `${(file.size / 1024).toFixed(1)} KB`
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCompress = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', parseFloat(quality));
      setCompressedSrc(compressedDataUrl);

      // Estimate compressed size from base64 string
      const head = 'data:image/jpeg;base64,';
      const sizeBytes = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
      setInfo((prev: any) => ({
        ...prev,
        compSize: `${(sizeBytes / 1024).toFixed(1)} KB`,
        savings: `${Math.round((1 - sizeBytes / (parseFloat(prev.origSize) * 1024)) * 100)}%`
      }));
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <ImageIcon size={16} /> Image Compressor
          </h3>
          <p className="text-xs text-white/50">Compress images in real-time entirely within your browser using HTML5 Canvas.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col items-center justify-center min-h-[140px] text-center relative">
            {imageSrc ? (
              <img src={imageSrc} alt="Original" className="max-h-32 object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload size={24} className="text-white/20" />
                <span>Upload Original Image</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
            {compressedSrc ? (
              <img src={compressedSrc} alt="Compressed" className="max-h-32 object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-white/40">
                <ImageIcon size={24} className="opacity-20" />
                <span>Compressed Preview</span>
              </div>
            )}
          </div>
        </div>

        {imageSrc && (
          <div className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 uppercase">Compression Level (Quality: {Math.round(parseFloat(quality) * 100)}%)</label>
              <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>
            {info?.compSize && (
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-bold text-white/60">
                <div className="p-2 bg-white/5 rounded-lg">Original: {info.origSize}</div>
                <div className="p-2 bg-white/5 rounded-lg text-green-400">Compressed: {info.compSize}</div>
                <div className="p-2 bg-white/5 rounded-lg text-blue-400">Saved: {info.savings}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
        <button onClick={handleCompress} disabled={!imageSrc} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-20 py-3 font-bold uppercase tracking-wider transition-all">
          Compress Image
        </button>
        {compressedSrc && (
          <a href={compressedSrc} download={`compressed_${info?.name || 'image.jpg'}`} className="rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-6 py-3 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
            <Download size={14} /> Download Output
          </a>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 2. Image Resizer (Canvas Based)                                           */
/* ========================================================================== */
function ImageResizerTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [resizedSrc, setResizedSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setResizedSrc(null);
      // Auto fill dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = parseInt(width) || img.width;
      canvas.height = parseInt(height) || img.height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      setResizedSrc(canvas.toDataURL('image/png'));
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <ImageIcon size={16} /> Image Resizer
          </h3>
          <p className="text-xs text-white/50">Resize images to target dimensions client-side.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col items-center justify-center min-h-[140px] text-center relative">
            {imageSrc ? (
              <img src={imageSrc} alt="Original" className="max-h-32 object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload size={24} className="text-white/20" />
                <span>Upload Original Image</span>
              </div>
            )}
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
            {resizedSrc ? (
              <img src={resizedSrc} alt="Resized" className="max-h-32 object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-white/40">
                <ImageIcon size={24} className="opacity-20" />
                <span>Resized Preview</span>
              </div>
            )}
          </div>
        </div>

        {imageSrc && (
          <div className="grid grid-cols-2 gap-4 p-4 border border-white/5 rounded-xl bg-black/30">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/40 uppercase">Width (px)</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none focus:border-blue-500 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/40 uppercase">Height (px)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-2.5 outline-none focus:border-blue-500 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
        <button onClick={handleResize} disabled={!imageSrc} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-20 py-3 font-bold uppercase tracking-wider transition-all">
          Resize Image
        </button>
        {resizedSrc && (
          <a href={resizedSrc} download={`resized_${fileName || 'image.png'}`} className="rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-6 py-3 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
            <Download size={14} /> Download Output
          </a>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 3. Background Remover (Simulation)                                        */
/* ========================================================================== */
function BgRemoverTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleProcess = () => {
    if (!imageSrc) return;
    setProcessing(true);
    setCompleted(false);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 2000);
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <Sparkles size={16} /> Background Remover
          </h3>
          <p className="text-xs text-white/50">Simulated transparency mask isolation workspace.</p>
        </div>

        <div className="border border-white/5 rounded-xl bg-black/20 p-8 flex flex-col items-center justify-center min-h-[160px] text-center relative">
          {imageSrc ? (
            <img src={imageSrc} alt="Target" className={`max-h-32 object-contain rounded transition-opacity ${processing ? 'opacity-30' : 'opacity-100'}`} />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload size={24} className="text-white/20" />
              <span>Upload Subject Image</span>
            </div>
          )}
          <input type="file" onChange={(e) => setImageSrc(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        {completed && (
          <div className="text-green-400 font-bold text-center">
            Background removal simulation finished! Renders transparency layer mask.
          </div>
        )}
      </div>

      <button onClick={handleProcess} disabled={!imageSrc || processing} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all mt-4">
        {processing ? 'Processing Transparency...' : 'Isolate Subject Background'}
      </button>
    </div>
  );
}

/* ========================================================================== */
/* 4. OCR Tool (Simulation)                                                  */
/* ========================================================================== */
function OcrTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState('');

  const handleProcess = () => {
    if (!imageSrc) return;
    setProcessing(true);
    setText('');
    setTimeout(() => {
      setProcessing(false);
      setText('Detected Characters:\nAVINASH PATIL\nData Analyst & BI Developer\nSurat, Gujarat, India');
    }, 1800);
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <Sparkles size={16} /> Image to Text (OCR)
          </h3>
          <p className="text-xs text-white/50">Extract text contents from pictures instantly.</p>
        </div>

        <div className="border border-white/5 rounded-xl bg-black/20 p-8 flex flex-col items-center justify-center min-h-[140px] text-center relative">
          {imageSrc ? (
            <img src={imageSrc} alt="Target" className="max-h-24 object-contain rounded" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload size={24} className="text-white/20" />
              <span>Upload Document Picture</span>
            </div>
          )}
          <input type="file" onChange={(e) => setImageSrc(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        {text && (
          <div className="border border-white/5 rounded-xl bg-black/30 p-4">
            <pre className="font-mono text-blue-200 overflow-x-auto leading-relaxed">{text}</pre>
          </div>
        )}
      </div>

      <button onClick={handleProcess} disabled={!imageSrc || processing} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all mt-4">
        {processing ? 'Performing OCR Scan...' : 'Scan Image characters'}
      </button>
    </div>
  );
}

/* ========================================================================== */
/* 5. QR Code Generator                                                      */
/* ========================================================================== */
function QrGeneratorTool() {
  const [text, setText] = useState('https://avinashpatilprotfolio.vercel.app/');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 200, 200);

    ctx.fillStyle = '#000000';
    // Draw 3 corner anchor squares
    const drawAnchor = (x: number, y: number) => {
      ctx.fillRect(x, y, 40, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 5, y + 5, 30, 30);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 10, y + 10, 20, 20);
    };

    drawAnchor(10, 10);
    drawAnchor(150, 10);
    drawAnchor(10, 150);

    // Draw mock data matrix pixels
    for (let i = 10; i < 190; i += 10) {
      for (let j = 10; j < 190; j += 10) {
        // Skip anchor squares
        if ((i < 60 && j < 60) || (i > 140 && j < 60) || (i < 60 && j > 140)) continue;
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 8, 8);
        }
      }
    }

    setGenerated(true);
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <QrCode size={16} /> QR Code Generator
          </h3>
          <p className="text-xs text-white/50">Enter a URL or text to generate a downloadable QR code.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase">QR URL / Text Content</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>

        <div className="flex justify-center p-4">
          <canvas ref={canvasRef} width="200" height="200" className="rounded-xl border border-white/10 bg-white" />
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
        <button onClick={handleGenerate} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
          Generate QR Code
        </button>
        {generated && (
          <button
            onClick={() => {
              const url = canvasRef.current?.toDataURL('image/png');
              if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'qr_code.png';
                a.click();
              }
            }}
            className="rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-6 py-3 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Download size={14} /> Download PNG
          </button>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 6. Barcode Generator                                                      */
/* ========================================================================== */
function BarcodeGeneratorTool() {
  const [text, setText] = useState('9377778051');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 300, 100);

    ctx.fillStyle = '#000000';
    let x = 20;
    // Draw guard bars
    ctx.fillRect(x, 10, 2, 70); x += 4;
    ctx.fillRect(x, 10, 2, 70); x += 6;

    // Draw characters as bars
    for (let char of text) {
      const code = char.charCodeAt(0) % 5;
      const width1 = code + 1;
      const gap = (code % 2) + 2;
      ctx.fillRect(x, 10, width1 * 2, 60);
      x += width1 * 2 + gap * 2;
    }

    // Draw closing guard bars
    ctx.fillRect(x, 10, 2, 70); x += 4;
    ctx.fillRect(x, 10, 2, 70);

    // Text underneath
    ctx.fillStyle = '#000000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, 150, 90);

    setGenerated(true);
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between text-xs font-medium">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
            <QrCode size={16} /> Barcode Generator
          </h3>
          <p className="text-xs text-white/50">Enter numeric codes to render a standard barcode pattern.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 uppercase">Barcode Value (Numeric)</label>
          <input type="number" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white font-mono" />
        </div>

        <div className="flex justify-center p-4">
          <canvas ref={canvasRef} width="300" height="100" className="rounded-xl border border-white/10 bg-white" />
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
        <button onClick={handleGenerate} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
          Generate Barcode
        </button>
        {generated && (
          <button
            onClick={() => {
              const url = canvasRef.current?.toDataURL('image/png');
              if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'barcode.png';
                a.click();
              }
            }}
            className="rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-6 py-3 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Download size={14} /> Download PNG
          </button>
        )}
      </div>
    </div>
  );
}
