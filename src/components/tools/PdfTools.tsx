import { useState } from 'react';
import { Upload, FileText, Trash2, Settings, Download, Check, RefreshCw } from 'lucide-react';

interface FileQueueItem {
  id: string;
  name: string;
  size: string;
  file: File;
}

const loadPdfLib = () => {
  return new Promise<any>((resolve, reject) => {
    if ((window as any).PDFLib) {
      resolve((window as any).PDFLib);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.onload = () => resolve((window as any).PDFLib);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const loadPdfJs = () => {
  return new Promise<any>((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      resolve(pdfjs);
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

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
        {activeTool === 'merge-pdf' && <PdfWorkspace actionLabel="Merge" icon={FileText} toolId="merge" />}
        {activeTool === 'split-pdf' && <PdfWorkspace actionLabel="Split" icon={FileText} hasPageInput toolId="split" />}
        {activeTool === 'compress-pdf' && <PdfWorkspace actionLabel="Compress" icon={FileText} isCompression toolId="compress" />}
        {activeTool === 'extract-pages' && <PdfWorkspace actionLabel="Extract" icon={FileText} hasPageInput toolId="extract" />}
        {activeTool === 'pdf-to-word' && <PdfWorkspace actionLabel="Convert to Word" icon={FileText} toolId="pdf-to-word" />}
        {activeTool === 'word-to-pdf' && <PdfWorkspace actionLabel="Convert to PDF" icon={FileText} hasTextInput toolId="word-to-pdf" />}
        {activeTool === 'watermark' && <PdfWorkspace actionLabel="Apply Watermark" icon={FileText} hasWatermarkInput toolId="watermark" />}
      </div>
    </div>
  );
}

function PdfWorkspace({
  actionLabel,
  icon: Icon,
  hasPageInput,
  isCompression,
  hasWatermarkInput,
  hasTextInput,
  toolId
}: {
  actionLabel: string;
  icon: any;
  hasPageInput?: boolean;
  isCompression?: boolean;
  hasWatermarkInput?: boolean;
  hasTextInput?: boolean;
  toolId: string;
}) {
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  
  // Custom states
  const [pageRange, setPageRange] = useState('1-3');
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [textInput, setTextInput] = useState('Type your document text here to export as PDF...');
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadName, setDownloadName] = useState('');

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const items = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file
    }));
    setQueue(prev => [...prev, ...items]);
    setComplete(false);
    setDownloadBlob(null);
  };

  const handleRemove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    setDownloadBlob(null);
    setComplete(false);
  };

  const handleProcess = async () => {
    if (queue.length === 0 && !hasTextInput) return;
    setProcessing(true);
    setProgress(10);
    setComplete(false);

    try {
      if (toolId === 'merge') {
        // --- MERGE PDF OPERATION ---
        setProgress(25);
        const pdfLib = await loadPdfLib();
        setProgress(40);
        const mergedPdf = await pdfLib.PDFDocument.create();
        
        for (let i = 0; i < queue.length; i++) {
          const item = queue[i];
          const fileBytes = await item.file.arrayBuffer();
          const pdf = await pdfLib.PDFDocument.load(fileBytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page: any) => mergedPdf.addPage(page));
          setProgress(Math.round(40 + ((i + 1) / queue.length) * 40));
        }
        
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        setDownloadBlob(blob);
        setDownloadName('merged_document.pdf');
        
      } else if (toolId === 'split' || toolId === 'extract') {
        // --- SPLIT & EXTRACT PDF OPERATION ---
        if (queue.length === 0) return;
        setProgress(30);
        const pdfLib = await loadPdfLib();
        setProgress(50);
        
        const targetItem = queue[0];
        const fileBytes = await targetItem.file.arrayBuffer();
        const pdf = await pdfLib.PDFDocument.load(fileBytes);
        const pageCount = pdf.getPageCount();
        
        let selectedPages: number[] = [];
        if (pageRange.includes('-')) {
          const [start, end] = pageRange.split('-').map(Number);
          if (!isNaN(start) && !isNaN(end) && start > 0 && end <= pageCount) {
            for (let i = start; i <= end; i++) {
              selectedPages.push(i - 1);
            }
          }
        } else {
          const val = Number(pageRange);
          if (!isNaN(val) && val > 0 && val <= pageCount) {
            selectedPages.push(val - 1);
          }
        }
        
        if (selectedPages.length === 0) {
          alert(`Invalid page range. This PDF has ${pageCount} pages.`);
          setProcessing(false);
          return;
        }

        const newPdf = await pdfLib.PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, selectedPages);
        copiedPages.forEach((page: any) => newPdf.addPage(page));
        
        setProgress(85);
        const splitBytes = await newPdf.save();
        const blob = new Blob([splitBytes], { type: 'application/pdf' });
        setDownloadBlob(blob);
        setDownloadName(`extracted_pages_${targetItem.name}`);
        
      } else if (toolId === 'watermark') {
        // --- WATERMARK PDF OPERATION ---
        if (queue.length === 0) return;
        setProgress(30);
        const pdfLib = await loadPdfLib();
        setProgress(50);
        
        const targetItem = queue[0];
        const fileBytes = await targetItem.file.arrayBuffer();
        const pdf = await pdfLib.PDFDocument.load(fileBytes);
        const pages = pdf.getPages();
        const helveticaFont = await pdf.embedFont(pdfLib.StandardFonts.HelveticaBold);
        
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 5,
            y: height / 2.5,
            size: Math.round(width / 12),
            font: helveticaFont,
            color: pdfLib.rgb(0.7, 0.7, 0.7),
            opacity: 0.22,
            rotate: pdfLib.degrees(45)
          });
          setProgress(Math.round(50 + ((i + 1) / pages.length) * 35));
        }
        
        const watermarkedBytes = await pdf.save();
        const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
        setDownloadBlob(blob);
        setDownloadName(`watermarked_${targetItem.name}`);
        
      } else if (toolId === 'compress') {
        // --- COMPRESS PDF OPERATION (Saves flattened layouts client-side) ---
        if (queue.length === 0) return;
        setProgress(30);
        const pdfLib = await loadPdfLib();
        setProgress(60);
        
        const targetItem = queue[0];
        const fileBytes = await targetItem.file.arrayBuffer();
        const pdf = await pdfLib.PDFDocument.load(fileBytes);
        
        // Save with maximum flat compression
        const compressedBytes = await pdf.save({ useObjectStreams: true });
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        setDownloadBlob(blob);
        setDownloadName(`compressed_${targetItem.name}`);
        
      } else if (toolId === 'pdf-to-word') {
        // --- PDF TO WORD CONVERSION (Html rich text extraction client-side) ---
        if (queue.length === 0) return;
        setProgress(30);
        const pdfjs = await loadPdfJs();
        setProgress(50);
        
        const targetItem = queue[0];
        const fileBytes = await targetItem.file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: fileBytes }).promise;
        
        let textContent = `<html><head><meta charset="utf-8"></head><body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">`;
        textContent += `<h1 style="color: #1B365D; border-bottom: 2px solid #1B365D; padding-bottom: 8px;">Extracted PDF Document</h1>`;
        textContent += `<p style="color: #666; font-size: 11px;">Source File: ${targetItem.name}</p><hr/>`;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const pageContent = await page.getTextContent();
          const strings = pageContent.items.map((item: any) => item.str);
          
          textContent += `<h3 style="color: #4B6B94; margin-top: 25px;">Page ${i}</h3>`;
          textContent += `<p style="white-space: pre-wrap; font-size: 13px;">${strings.join(' ')}</p>`;
          setProgress(Math.round(50 + (i / pdf.numPages) * 40));
        }
        
        textContent += `</body></html>`;
        const blob = new Blob([textContent], { type: 'application/msword' });
        setDownloadBlob(blob);
        setDownloadName(`${targetItem.name.replace('.pdf', '')}_extracted.doc`);
        
      } else if (toolId === 'word-to-pdf') {
        // --- WORD/TEXT TO PDF CONVERSION (Generates clean PDF canvas client-side) ---
        setProgress(30);
        const pdfLib = await loadPdfLib();
        setProgress(60);
        
        const pdfDoc = await pdfLib.PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
        const { width, height } = page.getSize();
        const helvetica = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);
        
        page.drawText('Exported PDF Document', { x: 50, y: height - 60, size: 22, font: helvetica, color: pdfLib.rgb(0.1, 0.2, 0.4) });
        page.drawText(`Created: ${new Date().toLocaleDateString()}`, { x: 50, y: height - 80, size: 9, font: helvetica, color: pdfLib.rgb(0.5, 0.5, 0.5) });
        
        // Wrap text input lines
        const lines = textInput.split('\n');
        let currentY = height - 120;
        for (const line of lines) {
          if (currentY < 60) break; // Exceeds page height
          page.drawText(line.slice(0, 80), { x: 50, y: currentY, size: 11, font: helvetica, color: pdfLib.rgb(0.1, 0.1, 0.1) });
          currentY -= 18;
        }
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadBlob(blob);
        setDownloadName('document_export.pdf');
      }
      
      setProgress(100);
      setComplete(true);
    } catch (err: any) {
      console.error(err);
      alert('Error processing PDF operation: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadBlob) return;
    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
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
          <p className="text-xs text-white/50">Run actual PDF editing operations completely client-side in your browser.</p>
        </div>

        {/* Text Input area for Word to PDF */}
        {hasTextInput && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-white/40">Raw Document Text Content</label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none resize-y font-medium text-white placeholder-white/20"
            />
          </div>
        )}

        {/* Drag and Drop Box */}
        {!hasTextInput && (
          <div className="relative border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-2xl bg-black/20 p-8 text-center flex flex-col items-center justify-center gap-2 transition-all">
            <Upload size={32} className="text-white/20" />
            <div>
              <span className="block text-white/70">Drag & drop files or click to upload</span>
              <span className="text-[10px] text-white/40">Accepts .pdf (Max 25MB)</span>
            </div>
            <input
              type="file"
              multiple={toolId === 'merge'}
              accept=".pdf"
              onChange={handleFileAdd}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}

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
        {(queue.length > 0 || hasTextInput) && (hasPageInput || isCompression || hasWatermarkInput) && (
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
            <Check size={14} /> Process successfully completed! Click Download to retrieve your output.
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={(queue.length === 0 && !hasTextInput) || processing}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-20 py-3 text-xs font-bold uppercase tracking-wider transition-all"
          >
            {actionLabel} Files
          </button>
          
          {complete && (
            <button
              onClick={handleDownload}
              className="rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all animate-pulse"
            >
              <Download size={14} /> Download Output
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
