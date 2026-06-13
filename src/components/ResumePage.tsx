import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Download, Briefcase, Mail, MapPin, Award, Calendar, FileText, Check } from 'lucide-react';

interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  duration: string;
  bullets: string[];
}

interface ProjectItem {
  name: string;
  date: string;
  stack: string;
  link: string;
  bullets: string[];
}

interface EducationItem {
  degree: string;
  duration: string;
  school: string;
  bullets: string[];
}

interface ResumeData {
  name: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: {
    languages: string;
    analytics: string;
    libraries: string;
    databases: string;
    tools: string;
    competencies: string;
  };
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: string[];
}

const INITIAL_RESUME_DATA: ResumeData = {
  name: 'AVINASH PATIL',
  role: 'Data Analyst & BI Developer',
  location: 'Surat, Gujarat, India',
  phone: '+91 9377778051',
  email: 'patiluday8035@gmail.com',
  linkedin: 'linkedin.com/in/patilavinash4046',
  github: 'Github.com/Patilavinash4433',
  summary: 'Detail-oriented and results-driven Data Analyst with hands-on experience in data analysis, dashboard development, reporting automation, and business intelligence. Proficient in Power BI, SQL, Python, Excel, and Tableau. Skilled in ETL processes, KPI reporting, DAX, data transformation, and statistical analysis. Proven ability to translate complex datasets into actionable business insights. Founder of a data-focused training academy with demonstrated leadership and instructional design experience. Actively seeking a data-focused role to contribute to data-driven decision-making at scale.',
  skills: {
    languages: 'Python, SQL, HTML, CSS, JS, Others',
    analytics: 'Power BI (DAX, Power Query), Tableau, Microsoft Excel (Advanced), SAP Analytics Cloud',
    libraries: 'Pandas, NumPy, Matplotlib',
    databases: 'MySQL, PostgreSQL, SQLite, Relational Database Design',
    tools: 'Git, GitHub, Jupyter Notebook/Lab, VS Code, Google Sheets, SQL, Python, Power BI, Tableau, Excel, MySQL/PG, Pandas, NumPy, DAX',
    competencies: 'Data Cleaning, Dashboard Development, KPI Reporting, ETL, EDA, Business Intelligence, Reporting Automation, Statistical Analysis, Stakeholder Reporting'
  },
  experience: [
    {
      role: 'Data Analytics Intern',
      company: 'QuadSync Tech Solutions',
      location: 'Surat, Gujarat',
      duration: 'Mar 2026 – Jun 2026',
      bullets: [
        'Analyzed and transformed 10,000+ business records using SQL, Python, and Excel, enabling actionable insights and data-driven decision-making.',
        'Built and maintained interactive Power BI and Tableau dashboards to monitor KPIs, track business performance, and support executive reporting.',
        'Performed data cleaning, preprocessing, and exploratory data analysis (EDA) using Pandas, NumPy, and Matplotlib, improving data quality and reporting accuracy.',
        'Automated recurring reporting processes, reducing manual effort and improving dashboard refresh efficiency.',
        'Conducted trend and performance analysis to identify key business opportunities and operational bottlenecks.',
        'Assisted in designing and optimizing ETL workflows for efficient data integration and transformation.',
        'Collaborated with cross-functional teams to gather business requirements and deliver analytics solutions aligned with organizational goals.'
      ]
    },
    {
      role: 'Computer Trainer',
      company: 'Tech-G Computer Academy',
      location: 'Surat, Gujarat',
      duration: 'Jan 2024 – Present',
      bullets: [
        'Founded and managed a computer training academy offering courses in CCC, Basic Computer Applications, MS Office, Programming Languages, and Data Analytics.',
        'Trained 20+ students in computer fundamentals, Microsoft Office (Word, Excel, PowerPoint), internet applications, and programming concepts.',
        'Delivered hands-on training in Excel, SQL, Power BI, and Data Analytics, focusing on practical business and reporting use cases.',
        'Designed automated attendance and fee management systems using Excel, Pivot Tables, and advanced formulas, reducing manual administrative effort by 70%.',
        'Developed dashboards and reports to track student performance, enrollment trends, and operational metrics.',
        'Created training materials, assignments, and project-based learning activities to improve student engagement and learning outcomes.',
        'Managed day-to-day academy operations, student records, and reporting processes through data-driven approaches.'
      ]
    }
  ],
  projects: [
    {
      name: 'Sales Performance Dashboard',
      date: '2026',
      stack: 'Power BI | SQL | Excel | DAX',
      link: 'https://github.com/Patilavinash4433/Sales-Performance-Dashboard',
      bullets: [
        'Developed an interactive Power BI dashboard using 10,000+ sales records to analyze revenue, regional performance, and product-wise KPIs.',
        'Utilized SQL for data extraction, transformation, and preparation, improving reporting efficiency and reducing manual processing time.',
        'Created advanced DAX measures, drill-through reports, slicers, and dynamic visualizations for business performance monitoring.',
        'Enabled data-driven decision-making through automated reporting and real-time KPI tracking.'
      ]
    },
    {
      name: 'Zomato Restaurant Analytics Dashboard',
      date: '2026',
      stack: 'Power BI | SQL | Excel | DAX | GitHub',
      link: 'https://github.com/Patilavinash4433/Zomato_Performance_Analytics_Dashboard',
      bullets: [
        'Analyzed restaurant and customer data to evaluate ratings, cuisines, pricing categories, and location-based performance trends.',
        'Performed data cleaning, transformation, and modeling using SQL and Power BI to ensure accurate reporting and analysis.',
        'Developed interactive dashboards featuring KPI cards, filters, drill-down reports, and geographical insights for restaurant performance evaluation.',
        'Identified key factors influencing restaurant ratings and customer preferences through data-driven analysis.',
        'Created visual reports to support business decisions related to pricing strategy, cuisine popularity, and market trends.'
      ]
    },
    {
      name: 'Student Data Management System',
      date: '2025',
      stack: 'Python | SQL | Excel',
      link: 'https://github.com/Patilavinash4433/Student_Data_Manager',
      bullets: [
        'Developed a web application for managing student records through forms and Excel uploads.',
        'Implemented FastAPI backend APIs for data processing and database operations.',
        'Automated Excel-to-SQL data ingestion and storage.',
        'Integrated SQL database for efficient record management and retrieval.'
      ]
    },
    {
      name: 'Global Sales Performance Dashboard',
      date: '2025',
      stack: 'Excel | Pivot Tables | KPI Reporting',
      link: 'https://patilavinash4433.github.io/TechNova_Revenue_Dashboard/',
      bullets: [
        'Developed an interactive sales analytics dashboard to monitor revenue, profit, product performance, regional trends, and sales representative performance.',
        'Utilized Pivot Tables, Pivot Charts, Slicers, Conditional Formatting, and advanced Excel formulas for automated reporting and KPI tracking.',
        'Enabled country-wise and region-wise performance analysis through dynamic filtering and visualization.',
        'Reduced manual reporting effort and improved business decision-making through dashboard automation.'
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Applied Science (B.Sc) in Information Technology (IT)',
      duration: 'Aug 2024 – Jun 2027',
      school: 'Gujarat Technological University (GTU) | Surat, Gujarat',
      bullets: [
        'Relevant Coursework: Data Structures, Database Management Systems, Python Programming, Data Analytics & Visualization, Computer Networks, Web Technologies'
      ]
    }
  ],
  certifications: [
    'SQL Certification (Query Optimization, Joins & Aggregations)',
    'Cisco Python Programming Certification',
    'SAP Analytics Cloud – AI-Powered Data Visualization',
    'SAP Learning – Data Modelling & Data Transformation',
    'JPMorgan Software Engineering Simulation (Forage)',
    'Deloitte Data Analytics Simulation (Forage)',
    'Siemens Project Management Simulation (Forage)',
    'AI-Powered Data Analytics Course (CodeWithHarry)'
  ]
};

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [editorSection, setEditorSection] = useState<string>('profile');

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = window.innerWidth < 640 ? 48 : 80;
        const availableWidth = containerWidth - padding;
        const newScale = Math.min(1, availableWidth / 794);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle simple input changes
  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  // Handle skills inputs
  const handleSkillChange = (field: keyof ResumeData['skills'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [field]: value }
    }));
  };

  // Handle list inputs via textareas (one item per line)
  const handleExperienceBulletsChange = (index: number, text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], bullets: lines };
      return { ...prev, experience: updated };
    });
  };

  const handleExperienceItemChange = (index: number, field: keyof ExperienceItem, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value } as any;
      return { ...prev, experience: updated };
    });
  };

  const handleProjectBulletsChange = (index: number, text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    setResumeData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], bullets: lines };
      return { ...prev, projects: updated };
    });
  };

  const handleProjectItemChange = (index: number, field: keyof ProjectItem, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value } as any;
      return { ...prev, projects: updated };
    });
  };

  const handleEducationBulletsChange = (index: number, text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], bullets: lines };
      return { ...prev, education: updated };
    });
  };

  const handleEducationItemChange = (index: number, field: keyof EducationItem, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value } as any;
      return { ...prev, education: updated };
    });
  };

  const handleCertificationsChange = (text: string) => {
    const list = text.split('\n').filter(line => line.trim() !== '');
    setResumeData(prev => ({ ...prev, certifications: list }));
  };

  // Reset to original data
  const handleReset = () => {
    if (window.confirm("Are you sure you want to discard your changes and reset to Avinash Patil's original resume?")) {
      setResumeData(INITIAL_RESUME_DATA);
    }
  };

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="resume-workspace-root" className="min-h-screen bg-[#0C0C0C] text-white flex flex-col font-sans relative">
      
      {/* Print styles loaded globally from index.css */}

      {/* Top Navbar Menu */}
      <header className="no-print shrink-0 border-b border-white/10 bg-[#141418]/80 backdrop-blur-md sticky top-0 z-30 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#D7E2EA] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            aria-label="Go back to portfolio"
          >
            <ArrowLeft size={16} />
          </a>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wider">Resume Workspace</h1>
            <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-widest font-semibold">A4 Resume Template Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#141418] hover:bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#D7E2EA] transition-all cursor-pointer"
          >
            <RotateCcw size={12} /> Reset Original
          </button>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00C6FF] hover:opacity-95 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#007AFF]/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download size={12} /> Download PDF
          </button>
        </div>
      </header>

      {/* Mobile Tab Swapper */}
      <div className="no-print lg:hidden shrink-0 flex border-b border-white/5 bg-[#101014]">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'edit' ? 'border-[#007AFF] text-[#007AFF] bg-white/[0.02]' : 'border-transparent text-[#D7E2EA]/40'
          }`}
        >
          Edit Resume Details
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'preview' ? 'border-[#007AFF] text-[#007AFF] bg-white/[0.02]' : 'border-transparent text-[#D7E2EA]/40'
          }`}
        >
          Preview A4 PDF
        </button>
      </div>

      {/* Main Workspace Frame */}
      <div id="resume-workspace-frame" className="flex-1 flex overflow-hidden min-h-0">
        
        {/* LEFT PANEL: RESUME FORM EDITOR */}
        <div className={`no-print flex-col w-full lg:w-[40%] border-r border-white/10 bg-[#141418]/40 overflow-y-auto shrink-0 ${
          activeTab === 'edit' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Section Selector Pills */}
          <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto scrollbar-none scroll-smooth">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'summary', label: 'Summary' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Experience' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education & Certs' }
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setEditorSection(sec.id)}
                className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all shrink-0 cursor-pointer ${
                  editorSection === sec.id
                    ? 'border-[#007AFF] bg-[#007AFF]/10 text-white'
                    : 'border-white/5 bg-[#141418] text-[#D7E2EA]/50 hover:text-white hover:border-white/10'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="p-6 space-y-6">
            
            {/* PROFILE DETAILS */}
            {editorSection === 'profile' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF]">Profile Details</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">Professional Title</label>
                    <input
                      type="text"
                      value={resumeData.role}
                      onChange={e => handleInputChange('role', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={e => handleInputChange('location', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resumeData.linkedin}
                      onChange={e => handleInputChange('linkedin', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">GitHub Profile</label>
                    <input
                      type="text"
                      value={resumeData.github}
                      onChange={e => handleInputChange('github', e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PROFESSIONAL SUMMARY */}
            {editorSection === 'summary' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF]">Professional Summary</h2>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">Summary Description</label>
                  <textarea
                    rows={8}
                    value={resumeData.summary}
                    onChange={e => handleInputChange('summary', e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/20 focus:border-[#007AFF] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TECHNICAL SKILLS */}
            {editorSection === 'skills' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF]">Technical Skills</h2>
                <div className="space-y-3">
                  {Object.keys(resumeData.skills).map((key) => {
                    const skillKey = key as keyof ResumeData['skills'];
                    const labels: Record<string, string> = {
                      languages: 'Languages & Queries',
                      analytics: 'Analytics & Visualization',
                      libraries: 'Python Libraries',
                      databases: 'Databases',
                      tools: 'Tools & Platforms',
                      competencies: 'Core Competencies'
                    };
                    
                    return (
                      <div key={skillKey}>
                        <label className="block text-[9px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1.5 font-bold">{labels[skillKey]}</label>
                        <input
                          type="text"
                          value={resumeData.skills[skillKey]}
                          onChange={e => handleSkillChange(skillKey, e.target.value)}
                          className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PROFESSIONAL EXPERIENCE */}
            {editorSection === 'experience' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF]">Professional Experience</h2>
                
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-[#1C1C22]/40 p-4 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#D7E2EA]/40 tracking-wider">Role #{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={e => handleExperienceItemChange(idx, 'role', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => handleExperienceItemChange(idx, 'company', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={e => handleExperienceItemChange(idx, 'location', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={e => handleExperienceItemChange(idx, 'duration', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Bullet Points (one per line)</label>
                      <textarea
                        rows={6}
                        value={exp.bullets.join('\n')}
                        onChange={e => handleExperienceBulletsChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-[11px] text-white focus:border-[#007AFF] focus:outline-none resize-none leading-relaxed font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {editorSection === 'projects' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF]">Projects</h2>
                
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-[#1C1C22]/40 p-4 space-y-4">
                    <span className="text-[10px] font-black uppercase text-[#D7E2EA]/40 tracking-wider">Project #{idx + 1}</span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={e => handleProjectItemChange(idx, 'name', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Date</label>
                        <input
                          type="text"
                          value={proj.date}
                          onChange={e => handleProjectItemChange(idx, 'date', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Tech Stack</label>
                        <input
                          type="text"
                          value={proj.stack}
                          onChange={e => handleProjectItemChange(idx, 'stack', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">GitHub / Live Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={e => handleProjectItemChange(idx, 'link', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Bullet Points (one per line)</label>
                      <textarea
                        rows={4}
                        value={proj.bullets.join('\n')}
                        onChange={e => handleProjectBulletsChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-[11px] text-white focus:border-[#007AFF] focus:outline-none resize-none leading-relaxed font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION & CERTS */}
            {editorSection === 'education' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF]">Education</h2>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-[#1C1C22]/40 p-4 space-y-4">
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Degree / Course</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => handleEducationItemChange(idx, 'degree', e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={e => handleEducationItemChange(idx, 'school', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Duration</label>
                        <input
                          type="text"
                          value={edu.duration}
                          onChange={e => handleEducationItemChange(idx, 'duration', e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#007AFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Education Details (one per line)</label>
                      <textarea
                        rows={3}
                        value={edu.bullets.join('\n')}
                        onChange={e => handleEducationBulletsChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-[11px] text-white focus:border-[#007AFF] focus:outline-none resize-none leading-relaxed font-mono"
                      />
                    </div>
                  </div>
                ))}

                <h2 className="text-xs font-bold uppercase tracking-widest text-[#007AFF] pt-4 border-t border-white/5">Certifications</h2>
                <div>
                  <label className="block text-[8px] uppercase tracking-wider text-[#D7E2EA]/40 mb-1 font-bold">Certifications List (one per line)</label>
                  <textarea
                    rows={6}
                    value={resumeData.certifications.join('\n')}
                    onChange={e => handleCertificationsChange(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-[11px] text-white focus:border-[#007AFF] focus:outline-none resize-none leading-relaxed font-mono"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: LIVE PREVIEW CANVAS */}
        <div 
          ref={containerRef}
          id="resume-preview-container" 
          className={`flex-1 flex flex-col bg-[#0A0A0D] overflow-y-auto items-center p-6 sm:p-10 ${
            activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          
          {/* A4 sheet preview container */}
          <div 
            id="resume-preview-sheet"
            className="print-area select-text relative font-sans text-left flex flex-col gap-6 print:gap-0 print:bg-transparent"
            style={{
              width: '210mm',
              zoom: scale
            }}
          >
            {/* Page 1 Indicator */}
            <div className="no-print w-full flex justify-between items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/30 px-2 select-none">
              <span>Page 1 · Profile, Skills & Experience</span>
              <span>A4 (210mm x 297mm)</span>
            </div>

            {/* PAGE 1 */}
            <div 
              className="print-page bg-white text-[#111827] shadow-2xl print:shadow-none"
              style={{
                width: '210mm',
                height: '297mm',
                padding: '16mm 16mm 14mm 16mm',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              {/* NAVY HEADER BLOCK */}
              <div className="bg-[#1B365D] text-white p-6 -mx-[16mm] -mt-[16mm] mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-wider leading-none mb-1">
                    {resumeData.name}
                  </h1>
                  <p className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-widest leading-none">
                    {resumeData.role}
                  </p>
                </div>

                <div className="text-left sm:text-right text-[10px] text-gray-200 space-y-0.5 leading-tight font-medium">
                  <div>{resumeData.location} | {resumeData.phone}</div>
                  <div>{resumeData.email}</div>
                  <div>{resumeData.linkedin}</div>
                  <div>{resumeData.github}</div>
                </div>
              </div>

              {/* PROFESSIONAL SUMMARY */}
              <div className="mb-5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1B365D] border-b border-[#1B365D] pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-[9.5px] text-[#374151] leading-relaxed text-justify">
                  {resumeData.summary}
                </p>
              </div>

              {/* TECHNICAL SKILLS TABLE */}
              <div className="mb-5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1B365D] border-b border-[#1B365D] pb-1 mb-2">
                  Technical Skills
                </h2>
                
                <table className="w-full text-[9px] border-collapse border border-[#E2E8F0]">
                  <tbody>
                    {[
                      { label: 'Languages & Query', val: resumeData.skills.languages },
                      { label: 'Analytics & Visualization', val: resumeData.skills.analytics },
                      { label: 'Python Libraries', val: resumeData.skills.libraries },
                      { label: 'Databases', val: resumeData.skills.databases },
                      { label: 'Tools & Platforms', val: resumeData.skills.tools },
                      { label: 'Core Competencies', val: resumeData.skills.competencies }
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-[#E2E8F0] last:border-b-0">
                        <td className="w-[25%] bg-[#F8FAFC] font-bold text-[#1B365D] p-2 border-r border-[#E2E8F0] align-middle">
                          {row.label}
                        </td>
                        <td className="w-[75%] bg-white text-[#374151] p-2 align-middle leading-normal">
                          {row.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PROFESSIONAL EXPERIENCE */}
              <div className="mb-5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1B365D] border-b border-[#1B365D] pb-1 mb-3">
                  Professional Experience
                </h2>

                <div className="space-y-3">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1 break-avoid">
                      <div className="flex justify-between items-baseline leading-none">
                        <span className="text-[10px] font-bold text-[#1B365D]">{exp.role}</span>
                        <span className="text-[9px] font-bold text-[#374151]">{exp.duration}</span>
                      </div>
                      
                      <div className="text-[9.5px] font-semibold text-[#6B7280] leading-none mb-1">
                        {exp.company} | {exp.location}
                      </div>

                      <ul className="list-disc pl-4 text-[9px] text-[#374151] space-y-0.5 leading-relaxed">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="bullet-point">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROJECTS (First 2) */}
              <div className="mb-0">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1B365D] border-b border-[#1B365D] pb-1 mb-3">
                  Projects
                </h2>

                <div className="space-y-3">
                  {resumeData.projects.slice(0, 2).map((proj, idx) => (
                    <div key={idx} className="space-y-1 break-avoid">
                      <div className="flex justify-between items-baseline leading-none">
                        <span className="text-[10px] font-bold text-[#1B365D]">{proj.name}</span>
                        <span className="text-[9px] font-bold text-[#374151]">{proj.date}</span>
                      </div>
                      
                      <div className="text-[9.5px] font-semibold text-[#6B7280] leading-none mb-1">
                        {proj.stack}
                      </div>

                      <ul className="list-disc pl-4 text-[9px] text-[#374151] space-y-0.5 leading-relaxed">
                        {proj.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="bullet-point">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page 2 Indicator */}
            <div className="no-print w-full flex justify-between items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/30 px-2 mt-4 select-none">
              <span>Page 2 · Projects, Education & Certs</span>
              <span>A4 (210mm x 297mm)</span>
            </div>

            {/* PAGE 2 */}
            <div 
              className="print-page bg-white text-[#111827] shadow-2xl print:shadow-none"
              style={{
                width: '210mm',
                height: '297mm',
                padding: '16mm 16mm 14mm 16mm',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              {/* PROJECTS (Remaining 2) */}
              <div className="mb-5">
                <div className="space-y-3">
                  {resumeData.projects.slice(2).map((proj, idx) => (
                    <div key={idx} className="space-y-1 break-avoid">
                      <div className="flex justify-between items-baseline leading-none">
                        <span className="text-[10px] font-bold text-[#1B365D]">{proj.name}</span>
                        <span className="text-[9px] font-bold text-[#374151]">{proj.date}</span>
                      </div>
                      
                      <div className="text-[9.5px] font-semibold text-[#6B7280] leading-none mb-1">
                        {proj.stack}
                      </div>

                      <ul className="list-disc pl-4 text-[9px] text-[#374151] space-y-0.5 leading-relaxed">
                        {proj.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="bullet-point">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* EDUCATION */}
              <div className="mb-5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1B365D] border-b border-[#1B365D] pb-1 mb-2">
                  Education
                </h2>

                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="space-y-1 break-avoid">
                    <div className="flex justify-between items-baseline leading-none">
                      <span className="text-[10px] font-bold text-[#1B365D]">{edu.degree}</span>
                      <span className="text-[9px] font-bold text-[#374151]">{edu.duration}</span>
                    </div>
                    
                    <div className="text-[9.5px] font-semibold text-[#6B7280] leading-none mb-1.5">
                      {edu.school}
                    </div>

                    <ul className="list-disc pl-4 text-[9px] text-[#374151] space-y-0.5">
                      {edu.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="bullet-point">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* CERTIFICATIONS (2 Column Layout) */}
              <div className="break-avoid">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1B365D] border-b border-[#1B365D] pb-1 mb-2">
                  Certifications
                </h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 pl-4 list-disc text-[9px] text-[#374151] leading-relaxed">
                  {resumeData.certifications.map((cert, idx) => (
                    <li key={idx} className="bullet-point">{cert}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
