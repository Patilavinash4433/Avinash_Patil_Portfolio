import { useState } from 'react';
import { Copy, Check, Sparkles, Send, FileText } from 'lucide-react';

export default function AITools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'prompt-gen');
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
            { id: 'prompt-gen', label: 'Prompt Generator' },
            { id: 'prompt-improve', label: 'Prompt Improver' },
            { id: 'email-writer', label: 'AI Email Writer' },
            { id: 'report-writer', label: 'Report Writer' },
            { id: 'meeting-notes', label: 'Meeting Notes' },
            { id: 'storytelling', label: 'Data Storytelling' }
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
        {activeTool === 'prompt-gen' && <PromptGenTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'prompt-improve' && <PromptImproveTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'email-writer' && <EmailWriterTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'report-writer' && <ReportWriterTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'meeting-notes' && <MeetingNotesTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'storytelling' && <StorytellingTool onCopy={handleCopy} copied={copied} />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. Prompt Generator                                                       */
/* ========================================================================== */
function PromptGenTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [task, setTask] = useState('write SQL queries for revenue cohorts');
  const [generated, setGenerated] = useState('');

  const handleGenerate = () => {
    const text = `Act as an expert ${role} with deep technical knowledge. Your task is to: ${task}.\n\nWhen writing the solution, please provide:\n1. Step-by-step logical explanations.\n2. Best practices regarding performance and edge cases.\n3. Complete, well-formatted code blocks.\n\nTake a deep breath and let's work on this step-by-step.`;
    setGenerated(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> structured Prompt Generator
        </h3>
        <p className="text-xs text-white/50">Build expert persona prompts for ChatGPT, Gemini, or Claude.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Persona Role</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Task Details</label>
          <input type="text" value={task} onChange={(e) => setTask(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Generate AI Prompt
      </button>

      {generated && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{generated}</pre>
          <button
            onClick={() => onCopy(generated, 'prompt-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {copied === 'prompt-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. Prompt Improver                                                        */
/* ========================================================================== */
function PromptImproveTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [basic, setBasic] = useState('write an email asking for a raise');
  const [improved, setImproved] = useState('');

  const handleImprove = () => {
    const text = `Context: I am writing to my manager requesting a compensation review after successfully completing my Data Analyst internship and transitioning to a full-time role.\nObjective: Draft a formal, professional email request.\nKey Details to include: Mention completion of projects on time, positive feedback, and value addition to the team.\nTone: Respectful, confident, and professional.\n\nRaw draft request:\n"${basic}"`;
    setImproved(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Prompt Improver
        </h3>
        <p className="text-xs text-white/50">Translate basic prompts into highly structured contextual prompts.</p>
      </div>

      <textarea
        value={basic}
        onChange={(e) => setBasic(e.target.value)}
        className="w-full h-24 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none"
      />

      <button onClick={handleImprove} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Improve Prompt Structure
      </button>

      {improved && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{improved}</pre>
          <button
            onClick={() => onCopy(improved, 'improve-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {copied === 'improve-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. AI Email Writer                                                        */
/* ========================================================================== */
function EmailWriterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [recipient, setRecipient] = useState('Manager');
  const [topic, setTopic] = useState('project delivery delay');
  const [email, setEmail] = useState('');

  const handleGenerate = () => {
    const text = `Subject: Project Update: Rescheduled Timeline\n\nHi ${recipient},\n\nI am writing to provide a quick update regarding the delivery schedule. Due to unforeseen data inconsistencies during the cleaning stage, we need to adjust our final delivery date.\n\nI am actively working on resolving this and expect the final dashboards to be ready by tomorrow. Thank you for your understanding.\n\nBest regards,\nAvinash Patil`;
    setEmail(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Send size={16} /> AI Email Writer
        </h3>
        <p className="text-xs text-white/50">Draft clean professional emails instantly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Recipient</label>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Email Topic</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Draft Email
      </button>

      {email && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{email}</pre>
          <button
            onClick={() => onCopy(email, 'email-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'email-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Report Writer                                                          */
/* ========================================================================== */
function ReportWriterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [topic, setTopic] = useState('Monthly Sales Analysis');
  const [bullets, setBullets] = useState('Revenue grew 10%, Marketing cost down 5%');
  const [report, setReport] = useState('');

  const handleGenerate = () => {
    const text = `## Executive Summary: ${topic}\n\n1. **Core Findings**:\n   - ${bullets.split(',')[0] || bullets}\n   - ${bullets.split(',')[1] || 'Operational tasks optimized'}\n\n2. **Operational Impacts**:\n   - Reduced data processing cycles, saving hours of manual workload.\n   - Improved resource allocation across campaigns.\n\n3. **Recommended Actions**:\n   - Double down on campaigns yielding high margins.\n   - Continue automation of standard KPI dashboards.`;
    setReport(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <FileText size={16} /> Executive Report Outliner
        </h3>
        <p className="text-xs text-white/50">Draft clean markdown structures for professional reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Report Title</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Key Findings (Comma-separated)</label>
          <input type="text" value={bullets} onChange={(e) => setBullets(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Draft Report Outline
      </button>

      {report && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{report}</pre>
          <button
            onClick={() => onCopy(report, 'report-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'report-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 5. Meeting Notes Formatter                                                */
/* ========================================================================== */
function MeetingNotesTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [raw, setRaw] = useState('Uday suggested SQL database shift. Avinash approved. Timeline set to next week.');
  const [notes, setNotes] = useState('');

  const handleFormat = () => {
    const text = `### Meeting Notes & Action Items\n\n**Discussion Summary**:\n- ${raw}\n\n**Action Items**:\n- [ ] SQL Database Migration Shift (Assignee: Uday)\n- [ ] Code Alignment & Approval (Assignee: Avinash)\n\n**Next Steps**:\n- Complete implementation by next week.`;
    setNotes(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <FileText size={16} /> Meeting Notes Formatter
        </h3>
        <p className="text-xs text-white/50">Convert raw transcripts into structured action items.</p>
      </div>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="w-full h-24 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none"
      />

      <button onClick={handleFormat} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Format Meeting Notes
      </button>

      {notes && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{notes}</pre>
          <button
            onClick={() => onCopy(notes, 'notes-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {copied === 'notes-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 6. Data Storytelling Hook                                                  */
/* ========================================================================== */
function StorytellingTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [datapoint, setDatapoint] = useState('We lost 15% active customers');
  const [hook, setHook] = useState('');

  const handleGenerate = () => {
    const text = `While the charts show a clean line, the core story is that ${datapoint.toLowerCase()}. This highlights a critical user retention bottleneck, demanding an immediate review of our user onboarding experience to plug the leak before scaling campaigns.`;
    setHook(text);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Data Storytelling Generator
        </h3>
        <p className="text-xs text-white/50">Turn dry metric declarations into powerful narrative business insights.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest">Key Data Point / Metric</label>
        <input type="text" value={datapoint} onChange={(e) => setDatapoint(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 outline-none" />
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Build Story Hook
      </button>

      {hook && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4 leading-relaxed">
          <p>{hook}</p>
          <button
            onClick={() => onCopy(hook, 'hook-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5"
          >
            {copied === 'hook-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
