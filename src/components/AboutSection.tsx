import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X } from 'lucide-react';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import AnimatedText from './AnimatedText';

const ABOUT_PARAGRAPHS = [
  "Hi, I'm Avinash Patil, a Data Analyst at Indo Era and a B.Sc. IT student passionate about transforming raw data into meaningful business insights.",
  "I specialize in Excel, SQL, Power BI, and Python, with a strong focus on data analysis, dashboard development, business intelligence, and reporting automation. I enjoy working with complex datasets, uncovering trends, and building data-driven solutions that help organizations make smarter decisions.",
  "As the first Data Analyst in my organization, I work on analyzing business data, identifying growth opportunities, improving reporting processes, and creating actionable dashboards that support strategic decision-making.",
  "Beyond analytics, I have experience as a Computer Trainer, where I have guided students in Excel, SQL, Power BI, programming, and data analytics. This experience has strengthened my communication, leadership, and problem-solving abilities.",
  "I believe data is not just numbers—it is a powerful asset that drives innovation, efficiency, and business growth. My goal is to build impactful analytics solutions that help organizations unlock the full potential of their data."
];

const AboutSection = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const getSkillColorClass = (item: string) => {
    const cleanItem = item.toLowerCase();
    if (cleanItem.includes('python') || cleanItem.includes('pandas') || cleanItem.includes('numpy')) {
      return 'hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-100';
    }
    if (cleanItem.includes('sql') || cleanItem.includes('postgres') || cleanItem.includes('mysql') || cleanItem.includes('sqlite') || cleanItem.includes('database')) {
      return 'hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-100';
    }
    if (cleanItem.includes('power bi') || cleanItem.includes('tableau') || cleanItem.includes('sap')) {
      return 'hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-100';
    }
    if (cleanItem.includes('excel')) {
      return 'hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-100';
    }
    if (cleanItem.includes('git') || cleanItem.includes('github')) {
      return 'hover:border-purple-400/40 hover:bg-purple-400/10 hover:text-purple-100';
    }
    if (cleanItem.includes('jupyter') || cleanItem.includes('code') || cleanItem.includes('sheets')) {
      return 'hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100';
    }
    return 'hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-100';
  };

  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 sm:px-8 md:px-10 py-20"
    >
      {/* Corner decorative 3D images (hidden on mobile, visible on desktop) */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="hidden sm:block pointer-events-none absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[60px] sm:w-[160px] md:w-[210px] transition-transform duration-700 ease-out hover:scale-105 hover:rotate-3 pointer-events-auto"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt=""
          className="w-full h-auto drop-shadow-md"
          loading="lazy"
          draggable={false}
        />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
          className="hidden sm:block pointer-events-none absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[55px] sm:w-[140px] md:w-[180px] transition-transform duration-700 ease-out hover:scale-105 hover:-rotate-3 pointer-events-auto"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt=""
          className="w-full h-auto drop-shadow-md"
          loading="lazy"
          draggable={false}
        />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
          className="hidden sm:block pointer-events-none absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[60px] sm:w-[160px] md:w-[210px] transition-transform duration-700 ease-out hover:scale-105 hover:-rotate-3 pointer-events-auto"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt=""
          className="w-full h-auto drop-shadow-md"
          loading="lazy"
          draggable={false}
        />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
          className="hidden sm:block pointer-events-none absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[65px] sm:w-[170px] md:w-[220px] transition-transform duration-700 ease-out hover:scale-105 hover:rotate-3 pointer-events-auto"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt=""
          className="w-full h-auto drop-shadow-md"
          loading="lazy"
          draggable={false}
        />
      </FadeIn>

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 text-center">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20">
                    <div className="flex flex-col gap-6 sm:gap-8 max-w-[680px]">
                      {ABOUT_PARAGRAPHS.map((para, idx) => (
                        <AnimatedText
                          key={idx}
                          text={para}
                          className="font-medium leading-relaxed text-[#D7E2EA] text-center"
                          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
                        />
                      ))}
                    </div>

                    {/* QuadSync Internship & Certificates */}
                    <FadeIn delay={0.1} className="w-full max-w-[720px]">
                      <div className="rounded-[28px] border border-white/10 bg-[#141418]/30 backdrop-blur-md p-6 sm:p-8 text-left transition-all duration-300 hover:border-white/15">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-6">
                          <div>
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-teal-400">
                              Internship Completed
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                              QuadSync Tech Solutions
                            </h3>
                            <p className="text-sm text-[#D7E2EA]/60 font-medium">
                              Data Analyst Intern
                            </p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-[#D7E2EA]/85 font-medium">
                              April 20, 2026 – June 20, 2026
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm sm:text-base text-[#D7E2EA]/75 leading-relaxed mb-6 font-medium">
                          During this 2-month training-based internship, I actively worked on analyzing business data, designing dashboard mockups, writing SQL queries, and preparing data-driven presentations. This experience deepened my understanding of industry workflows, structured data handling, and analytics storytelling.
                        </p>

                        {/* Document Previews */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              title: "Internship Appreciation Certificate",
                              image: "/quadsync-appreciation.webp",
                              label: "Appreciation Cert."
                            },
                            {
                              title: "Internship Completion Certificate",
                              image: "/quadsync-completion.webp",
                              label: "Completion Cert."
                            },
                            {
                              title: "Letter of Recommendation",
                              image: "/quadsync-lor.webp",
                              label: "Recommendation LOR"
                            }
                          ].map((doc, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedDoc(doc.image)}
                              className="group/doc relative overflow-hidden rounded-2xl border border-white/5 bg-[#0C0C0C]/50 p-2.5 cursor-zoom-in transition-all duration-300 hover:border-teal-500/30 hover:bg-[#141418] hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]"
                            >
                              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#141418] border border-white/5">
                                <img
                                  src={doc.image}
                                  alt={doc.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/doc:scale-105"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/doc:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="rounded-full bg-teal-500/20 border border-teal-500/30 p-2 text-teal-400 backdrop-blur-sm transform scale-90 group-hover/doc:scale-100 transition-all duration-300">
                                    <Eye size={16} />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 text-center">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D7E2EA]/50 group-hover/doc:text-teal-400 transition-colors duration-300 block truncate px-1">
                                  {doc.label}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeIn>

                    {/* Skills */}
                    <FadeIn delay={0.15} className="w-full max-w-3xl">
                      <div className="flex flex-col gap-5 sm:gap-6">
                        {[
                          {
                            label: 'Languages & Query',
                            items: ['Python', 'SQL', 'HTML5 & CSS3', 'JavaScript (JS)', 'Others'],
                          },
                          {
                            label: 'Analytics & Visualization',
                            items: ['Power BI (DAX, Power Query)', 'Tableau Desktop', 'Microsoft Excel (Advanced)', 'SAP Analytics Cloud'],
                          },
                          {
                            label: 'Python Libraries',
                            items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
                          },
                          {
                            label: 'Databases',
                            items: ['MySQL', 'PostgreSQL', 'SQLite', 'MS SQL Server', 'Relational Database Design'],
                          },
                          {
                            label: 'Tools & Platforms',
                            items: ['Git', 'GitHub', 'Jupyter Notebook/Lab', 'VS Code', 'Google Sheets'],
                          },
                          {
                            label: 'Core Competencies',
                            items: ['Data Cleaning & Prep', 'Dashboard Development', 'KPI Reporting', 'Business Intelligence (BI)', 'Exploratory Data Analysis (EDA)', 'Reporting Automation', 'Statistical Analysis', 'Stakeholder Reporting'],
                          },
                        ].map((group) => (
                          <div
                            key={group.label}
                            className="group flex flex-col items-center sm:flex-row sm:items-baseline gap-2 sm:gap-5 py-2.5 border-b border-white/[0.03] last:border-b-0 transition-colors duration-300"
                          >
                            <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 text-center sm:text-right sm:w-52 sm:shrink-0 font-medium group-hover:text-[#D7E2EA]/75 transition-colors duration-300">
                              {group.label}
                            </span>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                              {group.items.map((item) => (
                                <span
                                  key={item}
                                  className={`rounded-full border border-white/5 bg-[#1C1C22]/40 backdrop-blur-sm px-3.5 py-1 text-xs text-[#D7E2EA]/85 transition-all duration-300 select-none ${getSkillColorClass(item)}`}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </FadeIn>

                    <FadeIn delay={0.25}>
                      <ContactButton />
                    </FadeIn>
                  </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 bg-[#0C0C0C] p-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white hover:bg-black/80 transition-colors duration-200"
              >
                <X size={20} />
              </button>

              <img
                src={selectedDoc}
                alt="Internship Document"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
