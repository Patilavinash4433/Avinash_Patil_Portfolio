import { useState, lazy, Suspense } from 'react';
import { 
  ArrowLeft, Search, Briefcase, BarChart, FileSpreadsheet, Sparkles, GraduationCap, FileText, Image as ImageIcon, Code, DollarSign,
  FileCheck, ClipboardList, BadgeInfo, User, Linkedin, FileSignature, HelpCircle, Calculator,
  Database, TableProperties, BarChart3, LineChart, Trash2, Copy, ShieldAlert, Palette, Mail,
  BookOpen, Percent, CalendarRange, Map, Milestone, Combine, Split, Shrink, ImageUp, QrCode, ScanBarcode, FileCode, Terminal, Binary, Landmark, LandmarkIcon
} from 'lucide-react';

// Lazy load tool category components
const CareerTools = lazy(() => import('./tools/CareerTools'));
const AnalyticsTools = lazy(() => import('./tools/AnalyticsTools'));
const ExcelTools = lazy(() => import('./tools/ExcelTools'));
const AITools = lazy(() => import('./tools/AITools'));
const StudentTools = lazy(() => import('./tools/StudentTools'));
const PdfTools = lazy(() => import('./tools/PdfTools'));
const ImageTools = lazy(() => import('./tools/ImageTools'));
const DevTools = lazy(() => import('./tools/DevTools'));
const BusinessTools = lazy(() => import('./tools/BusinessTools'));

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: string;
}

const ALL_TOOLS: ToolItem[] = [
  // Career Tools
  { id: 'ats-checker', name: 'Resume ATS Checker', desc: 'Check your resume alignment with job descriptions.', category: 'career' },
  { id: 'bullet-gen', name: 'Resume Bullet Point Generator', desc: 'Create impact-driven resume bullet points.', category: 'career' },
  { id: 'skill-suggest', name: 'Resume Skill Suggestion', desc: 'Identify core technical skills for target roles.', category: 'career' },
  { id: 'summary-gen', name: 'Resume Summary Generator', desc: 'Draft a professional profile summary statement.', category: 'career' },
  { id: 'headline-gen', name: 'LinkedIn Headline Generator', desc: 'Draft headlines that get noticed by recruiters.', category: 'career' },
  { id: 'about-gen', name: 'LinkedIn About Generator', desc: 'Draft a clear and engaging profile summary.', category: 'career' },
  { id: 'cover-letter', name: 'Cover Letter Generator', desc: 'Generate a clean, targeted cover letter.', category: 'career' },
  { id: 'jd-analyzer', name: 'Job Description Analyzer', desc: 'Identify key technical skills and experience levels.', category: 'career' },
  { id: 'interview-questions', name: 'Interview Prep Assistant', desc: 'Get common technical questions and answers.', category: 'career' },
  { id: 'salary-calc', name: 'Salary Hike Calculator', desc: 'Calculate annual package increases and take-home pay.', category: 'career' },
  
  // Analytics Tools
  { id: 'sql-formatter', name: 'SQL Query Formatter', desc: 'Tidy up SQL queries with proper indents and capitalization.', category: 'analytics' },
  { id: 'dax-formatter', name: 'DAX Formula Formatter', desc: 'Clean up Power BI DAX calculations.', category: 'analytics' },
  { id: 'dax-gen', name: 'DAX Measure Generator', desc: 'Build common time-intelligence DAX measures visually.', category: 'analytics' },
  { id: 'kpi-gen', name: 'Business KPI Catalog', desc: 'Lookup standard calculations and explanations.', category: 'analytics' },
  { id: 'dashboard-gen', name: 'BI Dashboard Layout Generator', desc: 'Get wireframe recommendations by target audience.', category: 'analytics' },
  { id: 'insight-gen', name: 'Business Insight Builder', desc: 'Translate raw numbers into executive stories.', category: 'analytics' },
  { id: 'dataset-analyzer', name: 'Dataset Analyzer', desc: 'Inspect column counts, headers, and rows.', category: 'analytics' },
  { id: 'csv-cleaner', name: 'CSV Deduplicator', desc: 'Clean raw datasets by eliminating duplicate rows.', category: 'analytics' },
  { id: 'dup-finder', name: 'Duplicate Finder', desc: 'Find duplicate values in any list.', category: 'analytics' },
  { id: 'missing-checker', name: 'Missing Value Checker', desc: 'Identify empty cells in CSV columns.', category: 'analytics' },
  { id: 'pbi-theme', name: 'Power BI Custom Theme Generator', desc: 'Create JSON themes for Power BI Desktop.', category: 'analytics' },

  // Excel Tools
  { id: 'formula-builder', name: 'Excel Formula Builder', desc: 'Build SUMIFS, COUNTIFS, and other logical formulas.', category: 'excel' },
  { id: 'xlookup', name: 'XLOOKUP Formula Builder', desc: 'Build flexible lookup search formulas.', category: 'excel' },
  { id: 'index-match', name: 'INDEX MATCH Builder', desc: 'Build advanced two-way search formulas.', category: 'excel' },
  { id: 'cond-format', name: 'Conditional Formatting Rules', desc: 'Follow step guides to color-code cells.', category: 'excel' },
  { id: 'pivot-suggest', name: 'Pivot Table Suggestions', desc: 'Get Pivot Table suggestions based on headers.', category: 'excel' },
  { id: 'data-cleaning', name: 'Excel Data Cleaning Assistant', desc: 'Lookup text formulas (TRIM, PROPER, CLEAN).', category: 'excel' },

  // AI Tools
  { id: 'prompt-gen', name: 'Structured Prompt Generator', desc: 'Build expert persona prompts for LLMs.', category: 'ai' },
  { id: 'prompt-improve', name: 'Prompt Improver', desc: 'Translate basic requests into context-rich prompts.', category: 'ai' },
  { id: 'email-writer', name: 'AI Email Writer', desc: 'Draft professional emails in seconds.', category: 'ai' },
  { id: 'report-writer', name: 'Executive Report Outliner', desc: 'Draft markdown outlines for business reports.', category: 'ai' },
  { id: 'meeting-notes', name: 'Meeting Notes Formatter', desc: 'Convert raw transcripts to action items.', category: 'ai' },
  { id: 'storytelling', name: 'Data Storytelling Generator', desc: 'Turn numeric stats into narratives.', category: 'ai' },

  // Student Tools
  { id: 'cgpa-calc', name: 'CGPA / SGPA Calculator', desc: 'Calculate academic CGPA based on credits.', category: 'student' },
  { id: 'pct-conv', name: 'CGPA to Percentage Converter', desc: 'Convert GPA to percentage representations.', category: 'student' },
  { id: 'attendance', name: 'Attendance target Calculator', desc: 'Determine skipping limits or lectures needed.', category: 'student' },
  { id: 'study-plan', name: 'Study Schedule Planner', desc: 'Generate day-by-day learning timelines.', category: 'student' },
  { id: 'roadmap', name: 'Skill Learning Roadmap', desc: 'Master career paths with structured timelines.', category: 'student' },
  { id: 'gpa-predict', name: 'GPA Target Predictor', desc: 'Calculate required GPA for upcoming semesters.', category: 'student' },

  // PDF Tools
  { id: 'merge-pdf', name: 'Merge PDF Documents', desc: 'Combine multiple PDF files into one.', category: 'pdf' },
  { id: 'split-pdf', name: 'Split PDF Pages', desc: 'Split a PDF file into separate pages.', category: 'pdf' },
  { id: 'compress-pdf', name: 'Compress PDF Files', desc: 'Reduce PDF file sizes.', category: 'pdf' },
  { id: 'extract-pages', name: 'Extract PDF Pages', desc: 'Isolate and extract pages from a document.', category: 'pdf' },
  { id: 'pdf-to-word', name: 'Convert PDF to Word', desc: 'Extract contents to editable DOCX format.', category: 'pdf' },
  { id: 'word-to-pdf', name: 'Convert Word to PDF', desc: 'Create PDF documents from Word files.', category: 'pdf' },
  { id: 'watermark', name: 'PDF Watermark Tool', desc: 'Apply watermarks to document pages.', category: 'pdf' },

  // Image Tools
  { id: 'compressor', name: 'Image Compressor', desc: 'Compress images using HTML5 Canvas.', category: 'image' },
  { id: 'resizer', name: 'Image Resizer', desc: 'Resize image dimensions client-side.', category: 'image' },
  { id: 'bg-remove', name: 'Background Remover', desc: 'Isolate subjects and create PNG masks.', category: 'image' },
  { id: 'ocr-text', name: 'Image to Text (OCR)', desc: 'Extract plain text from document pictures.', category: 'image' },
  { id: 'qr-gen', name: 'QR Code Generator', desc: 'Generate and download custom QR codes.', category: 'image' },
  { id: 'barcode-gen', name: 'Barcode Generator', desc: 'Generate and download barcode graphics.', category: 'image' },

  // Developer Tools
  { id: 'json-formatter', name: 'JSON Formatter & Validator', desc: 'Format and validate JSON text configs.', category: 'developer' },
  { id: 'json-to-csv', name: 'JSON to CSV Converter', desc: 'Convert JSON arrays to CSV rows.', category: 'developer' },
  { id: 'csv-to-json', name: 'CSV to JSON Converter', desc: 'Convert CSV rows to JSON arrays.', category: 'developer' },
  { id: 'regex-tester', name: 'Regex Pattern Tester', desc: 'Test regular expressions in real-time.', category: 'developer' },
  { id: 'base64', name: 'Base64 Encoder/Decoder', desc: 'Encode or decode strings.', category: 'developer' },
  { id: 'color-picker', name: 'Web Color Converter', desc: 'Translate color formats (HEX, RGB).', category: 'developer' },
  { id: 'uuid-gen', name: 'UUID v4 Generator', desc: 'Create secure v4 UUID strings.', category: 'developer' },

  // Business Tools
  { id: 'roi-calc', name: 'ROI Calculator', desc: 'Compute capital investment returns.', category: 'business' },
  { id: 'margin-calc', name: 'Profit Margin Calculator', desc: 'Calculate gross profit margins and markups.', category: 'business' },
  { id: 'gst-calc', name: 'GST Tax Calculator', desc: 'Calculate bills with CGST and SGST splits.', category: 'business' },
  { id: 'breakeven', name: 'Break-even Calculator', desc: 'Determine minimum sales volume to break-even.', category: 'business' },
  { id: 'emi-calc', name: 'EMI Loan Calculator', desc: 'Calculate monthly installments and interest.', category: 'business' },
  { id: 'revenue-forecast', name: 'Revenue Growth Forecast', desc: 'Project 5-year CAGR growth values.', category: 'business' }
];

const CATEGORIES = [
  { id: 'career', label: 'Resume & Career', icon: Briefcase, color: 'text-blue-400', border: 'hover:border-blue-500/30' },
  { id: 'analytics', label: 'Data Analytics', icon: BarChart, color: 'text-cyan-400', border: 'hover:border-cyan-500/30' },
  { id: 'excel', label: 'Excel Tools', icon: FileSpreadsheet, color: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
  { id: 'ai', label: 'AI Writing & Prompts', icon: Sparkles, color: 'text-amber-400', border: 'hover:border-amber-500/30' },
  { id: 'student', label: 'Student Tools', icon: GraduationCap, color: 'text-purple-400', border: 'hover:border-purple-500/30' },
  { id: 'pdf', label: 'PDF Utilities', icon: FileText, color: 'text-red-400', border: 'hover:border-red-500/30' },
  { id: 'image', label: 'Image Tools', icon: ImageIcon, color: 'text-pink-400', border: 'hover:border-pink-500/30' },
  { id: 'developer', label: 'Developer Tools', icon: Code, color: 'text-indigo-400', border: 'hover:border-indigo-500/30' },
  { id: 'business', label: 'Business & Finance', icon: DollarSign, color: 'text-teal-400', border: 'hover:border-teal-500/30' }
];

const getToolIcon = (id: string) => {
  switch (id) {
    // Career
    case 'ats-checker': return FileCheck;
    case 'bullet-gen': return ClipboardList;
    case 'skill-suggest': return BadgeInfo;
    case 'summary-gen': return User;
    case 'headline-gen': return Linkedin;
    case 'about-gen': return Linkedin;
    case 'cover-letter': return FileSignature;
    case 'jd-analyzer': return Search;
    case 'interview-questions': return HelpCircle;
    case 'salary-calc': return Calculator;

    // Analytics
    case 'sql-formatter': return Database;
    case 'dax-formatter': return Code;
    case 'dax-gen': return TableProperties;
    case 'kpi-gen': return BarChart3;
    case 'dashboard-gen': return FileSpreadsheet;
    case 'insight-gen': return LineChart;
    case 'dataset-analyzer': return Search;
    case 'csv-cleaner': return Trash2;
    case 'dup-finder': return Copy;
    case 'missing-checker': return ShieldAlert;
    case 'pbi-theme': return Palette;

    // Excel
    case 'formula-builder': return Sparkles;
    case 'xlookup': return Search;
    case 'index-match': return TableProperties;
    case 'cond-format': return Palette;
    case 'pivot-suggest': return TableProperties;
    case 'data-cleaning': return Trash2;

    // AI
    case 'prompt-gen': return Sparkles;
    case 'prompt-improve': return LineChart;
    case 'email-writer': return Mail;
    case 'report-writer': return FileText;
    case 'meeting-notes': return ClipboardList;
    case 'storytelling': return BookOpen;

    // Student
    case 'cgpa-calc': return GraduationCap;
    case 'pct-conv': return Percent;
    case 'attendance': return CalendarRange;
    case 'study-plan': return Map;
    case 'roadmap': return Milestone;
    case 'gpa-predict': return LineChart;

    // PDF
    case 'merge-pdf': return Combine;
    case 'split-pdf': return Split;
    case 'compress-pdf': return Shrink;
    case 'extract-pages': return FileText;
    case 'pdf-to-word': return FileText;
    case 'word-to-pdf': return FileText;
    case 'watermark': return FileSignature;

    // Image
    case 'compressor': return ImageIcon;
    case 'resizer': return ImageIcon;
    case 'bg-remove': return ImageUp;
    case 'ocr-text': return Search;
    case 'qr-gen': return QrCode;
    case 'barcode-gen': return ScanBarcode;

    // Dev
    case 'json-formatter': return FileCode;
    case 'json-to-csv': return FileSpreadsheet;
    case 'csv-to-json': return FileCode;
    case 'regex-tester': return Terminal;
    case 'base64': return Binary;
    case 'color-picker': return Palette;
    case 'uuid-gen': return Code;

    // Business
    case 'roi-calc': return LineChart;
    case 'margin-calc': return Percent;
    case 'gst-calc': return Calculator;
    case 'breakeven': return Landmark;
    case 'emi-calc': return LandmarkIcon;
    case 'revenue-forecast': return LineChart;

    default: return Code;
  }
};

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Search filter
  const filteredTools = searchQuery.trim() === ''
    ? []
    : ALL_TOOLS.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchResultClick = (t: ToolItem) => {
    setActiveTool(t);
    setSearchQuery('');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getCategoryDetails = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col font-sans relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-600/[0.03] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-purple-600/[0.03] blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="shrink-0 border-b border-white/10 bg-[#141418]/80 backdrop-blur-md sticky top-0 z-30 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => activeTool ? setActiveTool(null) : window.location.hash = '#/'}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#D7E2EA] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wider">Avinash's Tool Suite</h1>
            <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest font-semibold">Free Career & Analytical Tools</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-44 sm:w-64">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white">
            <Search size={14} className="text-white/40 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50+ tools..."
              className="w-full bg-transparent outline-none placeholder-white/20 font-medium"
            />
          </div>

          {/* Search Dropdown Results */}
          {filteredTools.length > 0 && (
            <div className="absolute top-11 right-0 w-72 sm:w-80 rounded-xl border border-white/10 bg-[#141418] shadow-2xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
              {filteredTools.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSearchResultClick(t)}
                  className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-left transition-colors"
                >
                  <span className="block text-xs font-bold text-blue-400 capitalize">{t.category}</span>
                  <span className="block text-xs font-bold text-white mt-0.5">{t.name}</span>
                  <span className="block text-[10px] text-white/50 truncate font-medium">{t.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-h-0">
        {!activeTool ? (
          // ==========================================
          // DIRECTORY VIEW (Dashboard listing sections)
          // ==========================================
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-12 max-w-7xl mx-auto w-full">
            {/* Hero / Quick Introduction */}
            <div className="text-center py-6 max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Explore Career & Analytics Toolkit
              </h2>
              <p className="text-xs sm:text-sm text-white/60 font-medium">
                No logins, no paywalls. A collection of tools to supercharge your resume, write formulas, clean datasets, format queries, and optimize your workflows.
              </p>
            </div>

            {/* Quick Category Anchor Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-white/5 justify-start md:justify-center">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToSection(cat.id)}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 hover:bg-white/5 hover:border-white/10 text-white/70 hover:text-white cursor-pointer"
                  >
                    <Icon size={14} className={cat.color} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sections Listing */}
            <div className="space-y-12">
              {CATEGORIES.map((cat) => {
                const CategoryIcon = cat.icon;
                const categoryTools = ALL_TOOLS.filter(t => t.category === cat.id);

                return (
                  <section
                    key={cat.id}
                    id={`section-${cat.id}`}
                    className="scroll-mt-24 space-y-4"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/5 ${cat.color}`}>
                          <CategoryIcon size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                            {cat.label}
                          </h3>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                            {categoryTools.length} Interactive Utilities
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section Tools Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {categoryTools.map((tool) => {
                        const ToolIcon = getToolIcon(tool.id);
                        return (
                          <div
                            key={tool.id}
                            onClick={() => setActiveTool(tool)}
                            className={`group relative rounded-2xl border border-white/5 bg-white/[0.01] p-5 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer flex flex-col justify-between h-36 ${cat.border}`}
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className={`p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:${cat.color} transition-colors`}>
                                  <ToolIcon size={14} />
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                  {tool.name}
                                </h4>
                              </div>
                              <p className="text-xs text-white/50 font-medium mt-1.5 leading-relaxed line-clamp-2">
                                {tool.desc}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-white/30 group-hover:text-blue-400/80 transition-colors">
                                Open Tool
                              </span>
                              <span className="text-white/20 group-hover:translate-x-1 group-hover:text-blue-400 transition-all font-bold text-xs">
                                &rarr;
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        ) : (
          // ==========================================
          // ACTIVE TOOL FOCUS VIEW
          // ==========================================
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
            {/* Focused Workspace Navigation breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141418]/50 backdrop-blur-md rounded-2xl border border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTool(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline uppercase tracking-wider cursor-pointer"
                >
                  &larr; Back to Directory
                </button>
                <div className="hidden sm:block text-white/20">|</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${getCategoryDetails(activeTool.category).color}`}>
                    {getCategoryDetails(activeTool.category).label}
                  </span>
                  <span className="text-white/20 text-xs">/</span>
                  <span className="text-xs text-white/80 font-black uppercase tracking-wider truncate max-w-[200px]">
                    {activeTool.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Render selected tool component dynamically */}
            <div className="w-full">
              <Suspense fallback={
                <div className="h-[450px] flex flex-col items-center justify-center gap-3 text-white/30 text-xs font-mono bg-[#141418]/20 rounded-2xl border border-white/5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  Loading Workspace Canvas...
                </div>
              }>
                {activeTool.category === 'career' && <CareerTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'analytics' && <AnalyticsTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'excel' && <ExcelTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'ai' && <AITools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'student' && <StudentTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'pdf' && <PdfTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'image' && <ImageTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'developer' && <DevTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
                {activeTool.category === 'business' && <BusinessTools key={activeTool.id} activeToolId={activeTool.id} hideSidebar={true} />}
              </Suspense>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
