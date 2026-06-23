import { useState } from 'react';
import { Copy, Check, Calculator, Sparkles, Calendar } from 'lucide-react';

export default function StudentTools({ activeToolId, hideSidebar }: { activeToolId?: string; hideSidebar?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState<string>(activeToolId || 'cgpa-calc');
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
            { id: 'cgpa-calc', label: 'CGPA Calculator' },
            { id: 'pct-conv', label: 'Percentage Conv' },
            { id: 'attendance', label: 'Attendance Calc' },
            { id: 'study-plan', label: 'Study Planner' },
            { id: 'roadmap', label: 'Skill Roadmap' },
            { id: 'gpa-predict', label: 'GPA Predictor' }
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
        {activeTool === 'cgpa-calc' && <CgpaCalculatorTool />}
        {activeTool === 'pct-conv' && <PctConverterTool />}
        {activeTool === 'attendance' && <AttendanceCalculatorTool />}
        {activeTool === 'study-plan' && <StudyPlannerTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'roadmap' && <RoadmapTool onCopy={handleCopy} copied={copied} />}
        {activeTool === 'gpa-predict' && <GpaPredictorTool />}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 1. CGPA Calculator                                                        */
/* ========================================================================== */
function CgpaCalculatorTool() {
  const [courses, setCourses] = useState([
    { name: 'Course 1', grade: '10', credits: '4' },
    { name: 'Course 2', grade: '9', credits: '4' },
    { name: 'Course 3', grade: '8', credits: '3' }
  ]);
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      const g = parseFloat(c.grade);
      const cr = parseFloat(c.credits);
      if (!isNaN(g) && !isNaN(cr)) {
        totalGradePoints += g * cr;
        totalCredits += cr;
      }
    });

    const gpa = totalGradePoints / (totalCredits || 1);
    setResult(gpa.toFixed(2));
  };

  const handleUpdate = (idx: number, key: string, value: string) => {
    setCourses(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> SGPA / CGPA Calculator
        </h3>
        <p className="text-xs text-white/50">Enter course credits and grades to calculate cumulative GPA.</p>
      </div>

      <div className="space-y-3">
        {courses.map((c, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3">
            <input type="text" value={c.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white" />
            <input type="number" placeholder="Grade (0-10)" value={c.grade} onChange={(e) => handleUpdate(idx, 'grade', e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white" />
            <input type="number" placeholder="Credits" value={c.credits} onChange={(e) => handleUpdate(idx, 'credits', e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white" />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCourses(prev => [...prev, { name: `Course ${prev.length + 1}`, grade: '', credits: '' }])}
          className="rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2.5 font-bold uppercase tracking-wider transition-all"
        >
          Add Course Row
        </button>
        <button onClick={handleCalculate} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 font-bold uppercase tracking-wider transition-all">
          Calculate GPA
        </button>
      </div>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 text-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Calculated GPA</span>
          <span className="text-2xl font-black text-green-400">{result}</span>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 2. Percentage Converter                                                   */
/* ========================================================================== */
function PctConverterTool() {
  const [cgpa, setCgpa] = useState('8.5');
  const [formula, setFormula] = useState('gtu');
  const [pct, setPct] = useState<string | null>(null);

  const handleConvert = () => {
    const val = parseFloat(cgpa);
    if (isNaN(val)) return;
    
    let res = 0;
    if (formula === 'gtu') {
      // GTU conversion formula: (CGPA - 0.5) * 10
      res = (val - 0.5) * 10;
    } else {
      // Standard conversion formula: CGPA * 9.5
      res = val * 9.5;
    }
    setPct(res.toFixed(1));
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> CGPA to Percentage Converter
        </h3>
        <p className="text-xs text-white/50">Convert academic GPA to standard percentage representations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">CGPA / SGPA</label>
          <input type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Formula Reference</label>
          <select value={formula} onChange={(e) => setFormula(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white">
            <option value="gtu">Gujarat Technological University: (CGPA - 0.5) * 10</option>
            <option value="cbsce">CBSE / Standard: CGPA * 9.5</option>
          </select>
        </div>
      </div>

      <button onClick={handleConvert} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Convert to Percentage
      </button>

      {pct && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 text-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Equivalent Percentage</span>
          <span className="text-2xl font-black text-blue-400">{pct}%</span>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 3. Attendance Calculator                                                  */
/* ========================================================================== */
function AttendanceCalculatorTool() {
  const [total, setTotal] = useState('40');
  const [attended, setAttended] = useState('28');
  const [target, setTarget] = useState('75');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleCalculate = () => {
    const tot = parseInt(total);
    const att = parseInt(attended);
    const tgt = parseInt(target);
    if (isNaN(tot) || isNaN(att) || isNaN(tgt)) return;

    const currentPct = (att / tot) * 100;
    
    if (currentPct >= tgt) {
      // How many classes can be skipped?
      let tempTot = tot;
      let tempAtt = att;
      let skipCount = 0;
      while ((tempAtt / (tempTot + 1)) * 100 >= tgt) {
        tempTot++;
        skipCount++;
      }
      setAnalysis({
        status: 'safe',
        pct: currentPct.toFixed(1),
        count: skipCount
      });
    } else {
      // How many consecutive classes to attend?
      let tempTot = tot;
      let tempAtt = att;
      let attendCount = 0;
      while ((tempAtt / tempTot) * 100 < tgt) {
        tempTot++;
        tempAtt++;
        attendCount++;
      }
      setAnalysis({
        status: 'unsafe',
        pct: currentPct.toFixed(1),
        count: attendCount
      });
    }
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> Attendance target Calculator
        </h3>
        <p className="text-xs text-white/50">Calculate class targets to maintain safety benchmarks (e.g. 75%).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Total Lectures Conducted</label>
          <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Lectures Attended</label>
          <input type="number" value={attended} onChange={(e) => setAttended(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Target Percentage (%)</label>
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleCalculate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Analyze Attendance
      </button>

      {analysis && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 text-center space-y-2">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Current Attendance</span>
            <span className={`text-xl font-black ${analysis.status === 'safe' ? 'text-green-400' : 'text-red-400'}`}>{analysis.pct}%</span>
          </div>
          <p className="text-xs text-white/70">
            {analysis.status === 'safe'
              ? `You are safe! You can skip the next ${analysis.count} consecutive lectures and still remain above target.`
              : `Attention! You need to attend the next ${analysis.count} consecutive lectures to reach target.`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 4. Study Planner                                                          */
/* ========================================================================== */
function StudyPlannerTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [topic, setTopic] = useState('SQL cohort analysis');
  const [days, setDays] = useState('5');
  const [schedule, setSchedule] = useState('');

  const handleGenerate = () => {
    const plan = `### Study Schedule: ${topic} (${days} Days Plan)\n\n- **Day 1**: Core concepts read-through, glossary building & basic syntax rules review.\n- **Day 2**: Hands-on sandbox exercises, simple scripting & execution.\n- **Day 3**: Solving intermediate logical problems, checking corner cases & bug fixing.\n- **Day 4**: Building a miniature end-to-end sandbox project.\n- **Day 5**: final recap, refactoring & review.`;
    setSchedule(plan);
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calendar size={16} /> Exam & Subject Study Planner
        </h3>
        <p className="text-xs text-white/50">Generate a modular day-by-day study roadmap for exams or tasks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Topic / Subject</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Duration (Days)</label>
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Assemble Study Plan
      </button>

      {schedule && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{schedule}</pre>
          <button
            onClick={() => onCopy(schedule, 'plan-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {copied === 'plan-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 5. Skill Roadmaps                                                         */
/* ========================================================================== */
function RoadmapTool({ onCopy, copied }: { onCopy: any; copied: any }) {
  const [role, setRole] = useState('Data Analyst');
  const [roadmap, setRoadmap] = useState('');

  const handleGenerate = () => {
    const roadmaps: any = {
      'Data Analyst': `### Skill Roadmap: Data Analyst\n\n1. **Phase 1: Microsoft Excel (Days 1-15)**\n   - Master Pivot Tables, lookup operations (XLOOKUP, INDEX MATCH) & KPI aggregations.\n2. **Phase 2: Relational Databases & SQL (Days 16-45)**\n   - Write robust queries: JOINs, GROUP BY, aggregations & common CTE architectures.\n3. **Phase 3: BI Visualizations (Days 46-60)**\n   - Dashboard design best practices & DAX metrics modeling in Power BI or Tableau.\n4. **Phase 4: Python Foundations (Days 61-80)**\n   - Scripting data analysis pipelines using Pandas, NumPy, and Matplotlib.`,
      'Data Scientist': `### Skill Roadmap: Data Scientist\n\n1. **Phase 1: Math & Stats Foundations (Days 1-20)**\n   - Linear algebra, calculus, descriptive statistics, and probability distributions.\n2. **Phase 2: Advanced Python & Wrangling (Days 21-45)**\n   - Structured scripting in NumPy, Pandas, Scipy & exploratory data visualization.\n3. **Phase 3: Machine Learning Frameworks (Days 46-75)**\n   - Training classification, regression, and clustering algorithms in Scikit-Learn.\n4. **Phase 4: Deep Learning & Deployment (Days 76-100)**\n   - Custom neural networks in TensorFlow/Keras & model API wrapping.`
    };
    setRoadmap(roadmaps[role] || '');
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Sparkles size={16} /> Skill Learning Roadmap
        </h3>
        <p className="text-xs text-white/50">Identify step-by-step phases to master target career paths.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase tracking-widest">Target Path</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white">
          <option value="Data Analyst">Data Analyst</option>
          <option value="Data Scientist">Data Scientist</option>
        </select>
      </div>

      <button onClick={handleGenerate} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Build Skill Roadmap
      </button>

      {roadmap && (
        <div className="relative border border-white/5 rounded-xl bg-black/30 p-4">
          <pre className="whitespace-pre-line leading-relaxed font-sans text-white/80">{roadmap}</pre>
          <button
            onClick={() => onCopy(roadmap, 'roadmap-copy')}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded hover:bg-white/5"
          >
            {copied === 'roadmap-copy' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* 6. Semester GPA Predictor                                                 */
/* ========================================================================== */
function GpaPredictorTool() {
  const [currCgpa, setCurrCgpa] = useState('8.0');
  const [doneCredits, setDoneCredits] = useState('40');
  const [targetCgpa, setTargetCgpa] = useState('8.5');
  const [nextCredits, setNextCredits] = useState('20');
  const [result, setResult] = useState<string | null>(null);

  const handlePredict = () => {
    const cc = parseFloat(currCgpa);
    const dc = parseFloat(doneCredits);
    const tc = parseFloat(targetCgpa);
    const nc = parseFloat(nextCredits);
    if (isNaN(cc) || isNaN(dc) || isNaN(tc) || isNaN(nc)) return;

    // target_cgpa = (curr_cgpa * done_credits + required_gpa * next_credits) / (done_credits + next_credits)
    // required_gpa = (target_cgpa * (done_credits + next_credits) - curr_cgpa * done_credits) / next_credits
    const totalCredits = dc + nc;
    const reqGpa = (tc * totalCredits - cc * dc) / nc;
    setResult(reqGpa.toFixed(2));
  };

  return (
    <div className="space-y-4 text-xs font-medium">
      <div>
        <h3 className="text-base font-bold flex items-center gap-2 text-blue-400">
          <Calculator size={16} /> Semester GPA Target Predictor
        </h3>
        <p className="text-xs text-white/50">Determine what GPA you need in your next semester to reach your target CGPA.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Current CGPA</label>
          <input type="number" step="0.01" value={currCgpa} onChange={(e) => setCurrCgpa(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Completed Credits</label>
          <input type="number" value={doneCredits} onChange={(e) => setDoneCredits(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Target CGPA</label>
          <input type="number" step="0.01" value={targetCgpa} onChange={(e) => setTargetCgpa(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-white/40 uppercase tracking-widest">Next Sem Credits</label>
          <input type="number" value={nextCredits} onChange={(e) => setNextCredits(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" />
        </div>
      </div>

      <button onClick={handlePredict} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-bold uppercase tracking-wider transition-all">
        Predict Required GPA
      </button>

      {result && (
        <div className="border border-white/5 rounded-xl bg-black/30 p-4 text-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-0.5">Required GPA in Next Semester</span>
          <span className={`text-2xl font-black ${parseFloat(result) > 10 ? 'text-red-400' : 'text-green-400'}`}>
            {parseFloat(result) > 10 ? `${result} (Mathematically Impossible)` : result}
          </span>
        </div>
      )}
    </div>
  );
}
