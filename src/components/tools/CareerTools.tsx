import { useState } from 'react';
import { Copy, Check, Sparkles, Send, RefreshCw, Calculator, Briefcase, FileText, Upload } from 'lucide-react';

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

export default function CareerTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'ats-checker');
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
          { id: 'ats-checker', label: 'ATS Checker' },
          { id: 'bullet-gen', label: 'Bullet Point Gen' },
          { id: 'skill-suggest', label: 'Skill Suggestion' },
          { id: 'summary-gen', label: 'Summary Gen' },
          { id: 'headline-gen', label: 'LinkedIn Headline' },
          { id: 'about-gen', label: 'LinkedIn About' },
          { id: 'cover-letter', label: 'Cover Letter Gen' },
          { id: 'jd-analyzer', label: 'JD Analyzer' },
          { id: 'interview-questions', label: 'Interview Prep' },
          { id: 'salary-calc', label: 'Salary Calculator' }
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
        {activeTool === 'ats-checker' && <AtsCheckerTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'bullet-gen' && <BulletGeneratorTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'skill-suggest' && <SkillSuggestionTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'summary-gen' && <SummaryGeneratorTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'headline-gen' && <HeadlineGeneratorTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'about-gen' && <AboutGeneratorTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'cover-letter' && <CoverLetterTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'jd-analyzer' && <JdAnalyzerTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'interview-questions' && <InterviewPrepTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'salary-calc' && <SalaryCalculatorTool />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. ATS Checker Tool Component                                              */
/* ========================================================================== */
function AtsCheckerTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    setFileName(file.name);

    try {
      if (file.name.endsWith('.pdf')) {
        const reader = new FileReader();
        reader.onload = async function () {
          try {
            const typedarray = new Uint8Array(this.result as ArrayBuffer);
            const pdfjs = await loadPdfJs();
            const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map((item: any) => item.str);
              text += strings.join(' ') + '\n';
            }
            setResume(text);
          } catch (err) {
            console.error(err);
            alert('Failed to parse PDF file. Please paste text directly or try another file.');
          } finally {
            setIsParsing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          setResume(evt.target?.result as string || '');
          setIsParsing(false);
        };
        reader.readAsText(file);
      } else {
        alert('Unsupported file format. Please upload a PDF or TXT file.');
        setIsParsing(false);
      }
    } catch (err) {
      console.error(err);
      setIsParsing(false);
    }
  };

  const handleAnalyze = () => {
    if (!jd.trim() || !resume.trim()) return;
    
    // Extract keywords (longer words, ignoring numbers and common stopwords)
    const stopWords = new Set(['the', 'and', 'with', 'for', 'this', 'that', 'from', 'your', 'about', 'will', 'have', 'been', 'would', 'should', 'are', 'was', 'were', 'had', 'has', 'have']);
    const extractKeywords = (text: string) => {
      return text.toLowerCase()
        .replace(/[^a-zA-Z\s#+]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));
    };

    const jdWords = Array.from(new Set(extractKeywords(jd)));
    const resumeWords = new Set(extractKeywords(resume));
    
    // Check match intersection
    const matching = jdWords.filter(w => resumeWords.has(w));
    const missing = jdWords.filter(w => !resumeWords.has(w)).slice(0, 10);
    
    const score = Math.round((matching.length / (jdWords.length || 1)) * 100);
    
    setResult({
      score: Math.min(score + 35, 98), // Normalize to a realistic score range
      matching: matching.slice(0, 12),
      missing
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Resume ATS Checker
        </h3>
        <p className="text-xs text-white/50">Upload a PDF or TXT resume and paste a Job Description to verify ATS compatibility.</p>
      </div>

      {/* File Upload Zone */}
      <div className="border border-dashed border-white/10 hover:border-blue-500/50 rounded-xl bg-black/20 p-5 flex flex-col items-center justify-center text-center gap-2 transition-colors relative cursor-pointer group">
        <Upload size={24} className="text-white/30 group-hover:text-blue-400 transition-colors" />
        <div className="text-xs font-semibold text-white/70">
          {isParsing ? (
            <span className="text-blue-400 font-bold animate-pulse">Extracting text from PDF resume...</span>
          ) : fileName ? (
            <span className="text-green-400 font-bold">Successfully Loaded: {fileName}</span>
          ) : (
            <span>Drag & Drop or <span className="text-blue-450 text-blue-400 underline font-bold">Browse</span> PDF / TXT resume</span>
          )}
        </div>
        <p className="text-[10px] text-white/30">Processed client-side. Your files never leave your computer.</p>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Job Description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste target job description here..."
            className="w-full h-36 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none resize-none font-medium placeholder-white/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Resume Text</label>
            {resume && (
              <button
                onClick={() => setResume('')}
                className="text-[9px] uppercase font-bold text-red-400 hover:underline"
              >
                Clear Text
              </button>
            )}
          </div>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Parsed resume text will appear here automatically, or you can paste it directly..."
            className="w-full h-36 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none resize-none font-medium placeholder-white/20"
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!jd.trim() || !resume.trim() || isParsing}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Analyze Match Score
      </button>

      {result && (
        <div className="mt-4 border border-white/5 rounded-xl bg-black/30 p-4 space-y-4">
          <div className="flex items-center gap-4">
            {/* Score Ring */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full border-4 border-white/5 bg-black/50">
              <span className={`text-base font-black ${result.score > 75 ? 'text-green-400' : result.score > 55 ? 'text-yellow-400' : 'text-red-400'}`}>
                {result.score}%
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold">ATS Match Analysis</h4>
              <p className="text-xs text-white/50">
                {result.score > 75 ? 'Excellent alignment! Your resume has rich keyword density.' : 'Moderate match. We suggest adding some critical missing keywords.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <h5 className="font-bold text-green-400 mb-2">Matching Keywords ({result.matching.length})</h5>
              <div className="flex flex-wrap gap-1.5">
                {result.matching.length > 0 ? (
                  result.matching.map((w: string, idx: number) => (
                    <span key={idx} className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] text-green-300 font-semibold uppercase">
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-white/40">No matching keywords found.</span>
                )}
              </div>
            </div>
            <div>
              <h5 className="font-bold text-red-400 mb-2">Missing Key Keywords ({result.missing.length})</h5>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.length > 0 ? (
                  result.missing.map((w: string, idx: number) => (
                    <span key={idx} className="rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] text-red-300 font-semibold uppercase">
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-white/40">None! Perfect fit.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. Resume Bullet Point Generator                                           */
/* ========================================================================== */
function BulletGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [verb, setVerb] = useState('Analyzed');
  const [bullets, setBullets] = useState<string[]>([]);

  const handleGenerate = () => {
    const templates: any = {
      'Data Analyst': [
        `${verb} 10,000+ business records using SQL, Python, and Excel, enabling actionable insights and data-driven decision-making.`,
        `${verb} and maintained interactive Power BI dashboards to monitor KPIs, track performance, and support executive reporting.`,
        `${verb} customer churn data using python, uncovering key trends and reducing monthly churn rates by 12%.`
      ],
      'Business Intelligence Developer': [
        `${verb} and optimized complex ETL pipelines using SQL Server, reducing report refresh times by 45%.`,
        `${verb} cross-functional dashboards that integrated sales, finance, and product metrics into a unified view.`,
        `${verb} interactive data visualizations that saved business managers 10+ hours per week of manual reporting.`
      ]
    };
    
    const fallback = [
      `${verb} client metrics and developed automated reporting scripts, improving data collection efficiency by 25%.`,
      `${verb} key datasets to isolate inefficiencies, reporting insights directly to senior leadership for action.`,
      `${verb} predictive models and dashboards that supported business scalability and data alignment.`
    ];

    setBullets(templates[role] || fallback);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Briefcase size={16} /> Resume Bullet Point Generator
        </h3>
        <p className="text-xs text-white/50">Create impact-driven resume bullet points using action verbs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Job Title</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
          >
            <option value="Data Analyst">Data Analyst</option>
            <option value="Business Intelligence Developer">BI Developer</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Action Verb</label>
          <input
            type="text"
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
            placeholder="e.g. Developed, Led, Created"
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium placeholder-white/20"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Generate Bullet Points
      </button>

      {bullets.length > 0 && (
        <div className="space-y-3">
          {bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-3 border border-white/5 rounded-xl bg-black/20 text-xs">
              <p className="leading-relaxed flex-1">{bullet}</p>
              <button
                onClick={() => onCopy(bullet, `bullet-${idx}`)}
                className="text-[#D7E2EA]/40 hover:text-white shrink-0 p-1 rounded hover:bg-white/5 transition-all"
              >
                {copied === `bullet-${idx}` ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. Resume Skill Suggestion                                                 */
/* ========================================================================== */
function SkillSuggestionTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [skills, setSkills] = useState<string[]>([]);

  const handleSuggest = () => {
    const list: any = {
      'Data Analyst': ['SQL (Querying, Joins)', 'Python (Pandas, NumPy)', 'Power BI (DAX, Modeling)', 'Advanced Excel (VBA)', 'Tableau Desktop', 'Data Cleaning', 'ETL Processes', 'A/B Testing', 'Stakeholder Reporting'],
      'Data Scientist': ['Machine Learning (Scikit-Learn)', 'Statistical Analysis', 'A/B Testing', 'Python (SciPy, Statsmodels)', 'SQL Database Design', 'Data Wrangling', 'Deep Learning (TensorFlow)', 'Data Storytelling'],
      'BI Developer': ['SSIS / SSRS / SSAS', 'Power BI Dashboard Design', 'Data Warehouse Modeling', 'SQL Optimization', 'DAX Formulas', 'ETL Pipeline Design', 'Data Warehousing (Kimball Methodology)', 'KPI Dashboarding']
    };
    setSkills(list[role] || []);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Briefcase size={16} /> Resume Skill Suggestion
        </h3>
        <p className="text-xs text-white/50">Identify key skills that will help you pass ATS screening for target roles.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Target Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
        >
          <option value="Data Analyst">Data Analyst</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="BI Developer">BI Developer</option>
        </select>
      </div>

      <button
        onClick={handleSuggest}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Suggest Skills
      </button>

      {skills.length > 0 && (
        <div className="border border-white/5 rounded-xl bg-black/20 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-white/40">Suggested Stack</span>
            <button
              onClick={() => onCopy(skills.join(', '), 'skills-list')}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:underline"
            >
              {copied === 'skills-list' ? 'Copied' : 'Copy All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span key={idx} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Resume Summary Generator                                                */
/* ========================================================================== */
function SummaryGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [exp, setExp] = useState('2');
  const [skills, setSkills] = useState('SQL, Power BI, Python');
  const [summary, setSummary] = useState('');

  const handleGenerate = () => {
    const text = `Detail-oriented and results-driven ${role} with ${exp}+ years of experience in translating complex datasets into actionable business insights. Proficient in ${skills}. Skilled in ETL, dashboard design, KPI reporting, and data storytelling. Proven ability to collaborate with cross-functional teams to drive efficiency and optimize data workflows.`;
    setSummary(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <FileText size={16} /> Resume Summary Generator
        </h3>
        <p className="text-xs text-white/50">Draft a professional summary statement for the top of your resume.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Target Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Years of Experience</label>
          <input
            type="number"
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Core Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. SQL, Python, Power BI"
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium placeholder-white/20"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Generate Summary
      </button>

      {summary && (
        <div className="flex items-start justify-between gap-4 p-4 border border-white/5 rounded-xl bg-black/30 text-xs">
          <p className="leading-relaxed flex-1 font-medium">{summary}</p>
          <button
            onClick={() => onCopy(summary, 'summary')}
            className="text-[#D7E2EA]/40 hover:text-white shrink-0 p-1.5 rounded hover:bg-white/5 transition-all"
          >
            {copied === 'summary' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 5. LinkedIn Headline Generator                                             */
/* ========================================================================== */
function HeadlineGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [skills, setSkills] = useState('SQL | Power BI | Python');
  const [achievement, setAchievement] = useState('Automating business workflows');
  const [headlines, setHeadlines] = useState<string[]>([]);

  const handleGenerate = () => {
    const list = [
      `${role} | Specializing in ${skills} | Passionate about ${achievement}`,
      `${role} | Helping businesses make data-driven decisions using ${skills}`,
      `${role} @ Open to Opportunities | Certified in ${skills.split(' | ')[0] || 'Analytics'}`
    ];
    setHeadlines(list);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> LinkedIn Headline Generator
        </h3>
        <p className="text-xs text-white/50">Draft headlines that get noticed by recruiters.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Core Value</label>
          <input
            type="text"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Generate Headlines
      </button>

      {headlines.length > 0 && (
        <div className="space-y-3">
          {headlines.map((hl, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-3 border border-white/5 rounded-xl bg-black/20 text-xs font-semibold">
              <p className="flex-1">{hl}</p>
              <button
                onClick={() => onCopy(hl, `headline-${idx}`)}
                className="text-[#D7E2EA]/40 hover:text-white shrink-0 p-1 rounded hover:bg-white/5 transition-all"
              >
                {copied === `headline-${idx}` ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 6. LinkedIn About Generator                                                */
/* ========================================================================== */
function AboutGeneratorTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [skills, setSkills] = useState('Excel, SQL, Power BI, Python');
  const [focus, setFocus] = useState('translating raw data into meaningful business insights');
  const [about, setAbout] = useState('');

  const handleGenerate = () => {
    const text = `Hi, I'm a passionate ${role} specializing in ${skills}.\n\nI enjoy working with complex datasets, uncovering trends, and ${focus}. My core expertise is in building interactive dashboards, optimizing reporting workflows, and enabling stakeholders to make smarter decisions.\n\nLet's connect to talk about data, analytics, or business intelligence opportunities!`;
    setAbout(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <FileText size={16} /> LinkedIn About Section Generator
        </h3>
        <p className="text-xs text-white/50">Draft a clear and engaging profile summary for LinkedIn.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Your Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Core Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Core Focus / Mission</label>
        <input
          type="text"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Generate About Content
      </button>

      {about && (
        <div className="flex items-start justify-between gap-4 p-4 border border-white/5 rounded-xl bg-black/30 text-xs">
          <pre className="whitespace-pre-line leading-relaxed flex-1 font-medium font-sans">{about}</pre>
          <button
            onClick={() => onCopy(about, 'about-text')}
            className="text-[#D7E2EA]/40 hover:text-white shrink-0 p-1.5 rounded hover:bg-white/5 transition-all"
          >
            {copied === 'about-text' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 7. Cover Letter Generator                                                  */
/* ========================================================================== */
function CoverLetterTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [comp, setComp] = useState('Indo Era');
  const [skills, setSkills] = useState('SQL, Power BI, Excel, and Python');
  const [letter, setLetter] = useState('');

  const handleGenerate = () => {
    const text = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${role} position at ${comp}. With hands-on experience in data analytics, dashboard design, and ETL reporting, I am confident in my ability to contribute to your team.\n\nDuring my work, I have specialized in ${skills} to transform raw datasets into clean dashboards and actionable KPIs. I enjoy solving business bottlenecks and automating reporting workflows to save valuable administrative hours.\n\nThank you for your time and consideration. I look forward to discussing how my analytical skills align with your business goals.\n\nSincerely,\nAvinash Patil`;
    setLetter(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <FileText size={16} /> Cover Letter Generator
        </h3>
        <p className="text-xs text-white/50">Generate a clean, targeted cover letter for job applications.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Job Position</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Company Name</label>
          <input
            type="text"
            value={comp}
            onChange={(e) => setComp(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Core Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Generate Cover Letter
      </button>

      {letter && (
        <div className="flex items-start justify-between gap-4 p-4 border border-white/5 rounded-xl bg-black/30 text-xs">
          <pre className="whitespace-pre-line leading-relaxed flex-1 font-medium font-sans">{letter}</pre>
          <button
            onClick={() => onCopy(letter, 'cover-letter')}
            className="text-[#D7E2EA]/40 hover:text-white shrink-0 p-1.5 rounded hover:bg-white/5 transition-all"
          >
            {copied === 'cover-letter' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 8. Job Description Analyzer                                                */
/* ========================================================================== */
function JdAnalyzerTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [jd, setJd] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    
    // Core technical keywords we look for
    const techKeys = ['sql', 'python', 'power bi', 'excel', 'tableau', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'aws', 'spark', 'etl', 'dax', 'statistics', 'snowflake'];
    const softKeys = ['communication', 'teamwork', 'leadership', 'problem-solving', 'presentation', 'collaboration', 'critical thinking'];
    
    const words = jd.toLowerCase();
    const foundTech = techKeys.filter(k => words.includes(k));
    const foundSoft = softKeys.filter(k => words.includes(k));
    
    setAnalysis({
      tech: foundTech,
      soft: foundSoft,
      experience: words.includes('senior') || words.includes('5+') || words.includes('lead') ? 'Senior Level (5+ Years)' : words.includes('mid') || words.includes('3+') ? 'Mid Level (3-5 Years)' : 'Entry / Junior Level (0-2 Years)'
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Job Description Analyzer
        </h3>
        <p className="text-xs text-white/50">Identify hidden technical stack requirements and required experience levels.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Job Description text</label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste job description details..."
          className="w-full h-32 rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none resize-none font-medium text-white placeholder-white/20"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!jd.trim()}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-30 active:scale-[0.98]"
      >
        Analyze Job Description
      </button>

      {analysis && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Estimated Role Level</span>
            <span className="font-bold text-blue-400">{analysis.experience}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Required Hard Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.tech.length > 0 ? (
                  analysis.tech.map((t: string, idx: number) => (
                    <span key={idx} className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300 font-semibold uppercase">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-white/40">Generic skills requested.</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Key Soft Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.soft.length > 0 ? (
                  analysis.soft.map((s: string, idx: number) => (
                    <span key={idx} className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300 font-semibold capitalize">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-white/40">Standard professionalism.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 9. Interview Prep Tool                                                     */
/* ========================================================================== */
function InterviewPrepTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [questions, setQuestions] = useState<any[]>([]);

  const handleGenerate = () => {
    const list: any = {
      'Data Analyst': [
        { q: "What is the difference between SQL JOIN and UNION?", a: "JOIN merges columns from multiple tables horizontally based on matching keys. UNION concatenates rows vertically, stacking tables with the same schema." },
        { q: "How do you handle missing values in a dataset?", a: "Check missing counts. Fill using Mean/Median for numerical stats, Mode for categorical columns, or remove the row if missingness is critical/unavoidable." },
        { q: "What are visual best practices in dashboard design?", a: "Maintain clear visual hierarchies, keep color palettes simple (under 3 colors), use descriptive KPI cards on top, and avoid 3D charts or cluttered tables." }
      ],
      'BI Developer': [
        { q: "What is a Star Schema vs. Snowflake Schema?", a: "Star schema has dimension tables connected directly to a center Fact table (denormalized, fast query). Snowflake schema normalizes dimensions into sub-dimensions (less duplicate storage, complex joins)." },
        { q: "Explain the difference between calculated columns and measures in Power BI.", a: "Calculated columns are computed row-by-row during data load and consume RAM. Measures are evaluated dynamically at query time based on user filters (aggregate context)." }
      ]
    };
    setQuestions(list[role] || []);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Briefcase size={16} /> Interview Prep Assistant
        </h3>
        <p className="text-xs text-white/50">Get common technical questions and optimized answers for target roles.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Target Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
        >
          <option value="Data Analyst">Data Analyst</option>
          <option value="BI Developer">BI Developer</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Show Sample Interview Questions
      </button>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div key={idx} className="p-4 border border-white/5 rounded-xl bg-black/30 space-y-2 text-xs">
              <h5 className="font-bold text-white flex gap-1"><span className="text-blue-400">Q:</span> {item.q}</h5>
              <p className="text-white/70 leading-relaxed font-medium"><span className="font-bold text-green-400 mr-1">Best Answer:</span>{item.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 10. Salary Hike Calculator Tool                                            */
/* ========================================================================== */
function SalaryCalculatorTool() {
  const [current, setCurrent] = useState('500000');
  const [hike, setHike] = useState('20');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const curVal = parseFloat(current);
    const hikePct = parseFloat(hike);
    if (isNaN(curVal) || isNaN(hikePct)) return;

    const hikeAmt = curVal * (hikePct / 100);
    const newSal = curVal + hikeAmt;
    const monthlyNew = newSal / 12;

    setResult({
      hikeAmt: hikeAmt.toFixed(0),
      newSal: newSal.toFixed(0),
      monthly: monthlyNew.toFixed(0)
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> Salary Hike Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate annual package increases and estimated monthly salaries.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Current CTC (Annual, ₹ / $)</label>
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-white/40">Expected Hike (%)</label>
          <input
            type="number"
            value={hike}
            onChange={(e) => setHike(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs focus:border-blue-500 outline-none text-white font-medium"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
      >
        Calculate Salary details
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Hike Amount</span>
            <span className="text-base font-black text-green-400">₹{parseFloat(result.hikeAmt).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">New Annual CTC</span>
            <span className="text-base font-black text-blue-400">₹{parseFloat(result.newSal).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-white/40 uppercase font-semibold">Estimated Monthly Gross</span>
            <span className="text-base font-black text-purple-400">₹{parseFloat(result.monthly).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
