import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';

interface ProjectData {
  number: string;
  category: string;
  tags: string[];
  name: string;
  liveUrl: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
  glowColor: string;
  borderColor: string;
  accentColor: string;
}

const PROJECTS: ProjectData[] = [
  {
    number: '01',
    category: 'Power BI · SQL · DAX',
    tags: ['Power BI', 'SQL', 'DAX', 'Excel'],
    name: 'Sales Performance Dashboard',
    liveUrl: 'https://github.com/Patilavinash4433/Sales-Performance-Dashboard',
    col1Image1: '/sales-dashboard-1.webp',
    col1Image2: '/sales-dashboard-2.webp',
    col2Image: '/sales-dashboard-3.webp',
    glowColor: 'from-blue-600/15 via-cyan-500/5 to-transparent',
    borderColor: 'hover:border-blue-500/40',
    accentColor: 'text-blue-400',
  },
  {
    number: '02',
    category: 'Power BI · SQL · Python',
    tags: ['Power BI', 'SQL', 'Python', 'GitHub'],
    name: 'Zomato Restaurant Analytics',
    liveUrl: 'https://github.com/Patilavinash4433/Zomato_Performance_Analytics_Dashboard',
    col1Image1: '/zomato-dashboard-1.webp',
    col1Image2: '/zomato-dashboard-3.webp',
    col2Image: '/zomato-dashboard-2.webp',
    glowColor: 'from-red-600/15 via-rose-500/5 to-transparent',
    borderColor: 'hover:border-red-500/40',
    accentColor: 'text-red-400',
  },
  {
    number: '03',
    category: 'Python · FastAPI · SQL',
    tags: ['Python', 'FastAPI', 'SQL', 'Excel'],
    name: 'Student Data Management System',
    liveUrl: 'https://github.com/Patilavinash4433/Student_Data_Manager',
    col1Image1: '/student-system-1.webp',
    col1Image2: '/student-system-2.webp',
    col2Image: '/student-system-3.webp',
    glowColor: 'from-emerald-600/15 via-teal-500/5 to-transparent',
    borderColor: 'hover:border-emerald-500/40',
    accentColor: 'text-emerald-400',
  },
  {
    number: '04',
    category: 'Python · Matplotlib · Seaborn',
    tags: ['Matplotlib', 'Seaborn', 'HTML', 'CSS', 'JS'],
    name: 'TechNova_Revenue_Dashboard',
    liveUrl: 'https://patilavinash4433.github.io/TechNova_Revenue_Dashboard/',
    col1Image1: '/technova-1.webp',
    col1Image2: '/technova-2.webp',
    col2Image: '/technova-3.webp',
    glowColor: 'from-amber-600/15 via-yellow-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/40',
    accentColor: 'text-amber-400',
  },
  {
    number: '05',
    category: 'Excel · Pivot Tables · KPIs',
    tags: ['Excel', 'Pivot Tables', 'KPI Reporting'],
    name: 'Global Sales Dashboard',
    liveUrl: 'https://github.com/Patilavinash4433/Sales_Analytics_Dashboard_Excel',
    col1Image1: '/excel-sales-1.webp',
    col1Image2: '/excel-sales-2.webp',
    col2Image: '/excel-sales-3.webp',
    glowColor: 'from-violet-600/15 via-fuchsia-500/5 to-transparent',
    borderColor: 'hover:border-violet-500/40',
    accentColor: 'text-violet-400',
  },
];

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
  containerRef: React.RefObject<HTMLDivElement>;
  onImageClick: (src: string, alt: string) => void;
}

const ProjectCard = ({ project, index, total, containerRef, onImageClick }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll progress for THIS card relative to the whole projects scroll range.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  // Cards further down the stack stay full-size; earlier cards scale DOWN
  // as later cards stack on top of them.
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="sticky top-24 md:top-32 h-auto md:h-[85vh] w-full"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.article
        style={{ scale }}
        className={`origin-top mx-auto h-auto md:h-full w-full flex flex-col gap-4 sm:gap-6 md:gap-8 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-white/10 bg-[#141418]/65 backdrop-blur-xl shadow-2xl p-4 sm:p-6 md:p-8 ${project.borderColor} hover:bg-[#1C1C22]/85 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 relative overflow-hidden group`}
      >
        {/* Inside card subtle neon mesh backglows */}
        <div className={`absolute -top-20 -right-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-br ${project.glowColor} blur-[80px] pointer-events-none`} />
        <div className={`absolute -bottom-20 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-br ${project.glowColor} blur-[80px] pointer-events-none`} />

        {/* Top row: number + meta + button */}
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 sm:gap-6">
          <div className="flex flex-row items-start gap-3 sm:gap-6 md:gap-10 min-w-0 w-full">
            <div
              className={`shrink-0 font-black leading-none select-none transition-colors duration-500 ${project.accentColor} opacity-20 group-hover:opacity-45`}
              style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)' }}
            >
              {project.number}
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2.5 pt-1.5 sm:pt-3 md:pt-4 min-w-0 flex-1">
              {/* Glass Pill Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-white/80 hover:bg-white/15 hover:text-white transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3
                className="font-semibold uppercase text-white tracking-wide leading-tight group-hover:text-[#007AFF] transition-colors duration-300"
                style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-auto pt-1 sm:pt-2 md:pt-3 w-full sm:w-auto">
            <LiveProjectButton 
              href={project.liveUrl} 
              className={`border-white/20 text-white bg-white/5 hover:border-transparent ${
                project.number === '01' ? 'hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]' :
                project.number === '02' ? 'hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]' :
                project.number === '03' ? 'hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                project.number === '04' ? 'hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]' :
                'hover:bg-violet-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
              } transition-all duration-300 hover:scale-105`}
            />
          </div>
        </div>

        {/* Bottom row: image grid/container */}
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-3 sm:gap-4 md:gap-5 flex-1 min-h-0">
          {/* Left column - 2 stacked (hidden on mobile, visible on desktop) */}
          <div className="hidden md:flex flex-col gap-3 sm:gap-4 md:gap-5 min-h-0">
            <div
              className="overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[30px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            >
              <img
                src={project.col1Image1}
                alt={`${project.name} preview 1`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105 cursor-zoom-in"
                onClick={() => onImageClick(project.col1Image1, `${project.name} preview 1`)}
                loading="lazy"
                draggable={false}
              />
            </div>
            <div
              className="overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[30px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            >
              <img
                src={project.col1Image2}
                alt={`${project.name} preview 2`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105 cursor-zoom-in"
                onClick={() => onImageClick(project.col1Image2, `${project.name} preview 2`)}
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>

          {/* Right column - 1 tall */}
          <div className="overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[30px] min-h-0 w-full aspect-[16/10] md:aspect-auto md:h-full">
            <img
              src={project.col2Image}
              alt={`${project.name} preview 3`}
              className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105 cursor-zoom-in"
              onClick={() => onImageClick(project.col2Image, `${project.name} preview 3`)}
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#0C0C0C] px-4 sm:px-6 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 -z-10 h-[550px] w-[550px] rounded-full bg-purple-600/5 blur-[160px] pointer-events-none" />

      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-7xl">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={PROJECTS.length}
            containerRef={containerRef}
            onImageClick={(src, alt) => setActiveImage({ src, alt })}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 md:p-10 backdrop-blur-md cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2.5 rounded-full bg-white/10 hover:bg-white/20 z-[110]"
              aria-label="Close image preview"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Enlarged Image */}
            <motion.img
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
