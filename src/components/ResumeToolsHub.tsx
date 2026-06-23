import { FileText, Cpu, ArrowRight } from 'lucide-react';
import FadeIn from './FadeIn';

export default function ResumeToolsHub() {
  return (
    <section
      id="recruiter-hub"
      className="relative z-10 w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 border-t border-[#D7E2EA]/10 overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/[0.02] blur-[150px] pointer-events-none" />

      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center mb-16">
        <FadeIn y={30}>
          <span className="text-xs font-bold uppercase tracking-widest text-[#007AFF] bg-[#007AFF]/10 border border-[#007AFF]/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Resources Hub
          </span>
        </FadeIn>
        <FadeIn y={40} delay={0.1}>
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none mb-4 text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 80px)' }}
          >
            Resume & Tools
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.2}>
          <p className="mx-auto max-w-lg text-xs sm:text-sm font-light text-[#D7E2EA]/60 leading-relaxed uppercase tracking-wider">
            Explore my A4 professional resume or access free interactive utilities built for data analysts and students.
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Card 1: Resume Workspace */}
        <FadeIn y={40} delay={0.3} className="h-full">
          <div className="group relative flex h-full flex-col justify-between gap-6 rounded-[32px] border border-white/10 bg-[#141418]/50 backdrop-blur-xl p-8 sm:p-10 shadow-2xl hover:bg-[#141418]/80 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(0,122,255,0.1)] transition-all duration-300">
            <div className="space-y-4">
              <div className="rounded-full border border-blue-500/20 bg-blue-500/5 p-4 w-14 h-14 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                <FileText size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">Professional Resume</h3>
              <p className="text-xs sm:text-sm text-[#D7E2EA]/60 leading-relaxed font-medium">
                View my structured A4 data analytics resume. Designed following industry standard ATS templates, optimized for technical stack layout, and ready for instant print or PDF downloading.
              </p>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <a
                href="#/resume"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof (window as any).__routeTo === 'function') {
                    (window as any).__routeTo('#/resume');
                  } else {
                    window.location.hash = '#/resume';
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                Open Resume <ArrowRight size={13} className="text-[#D7E2EA]/50 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Card 2: Interactive Tool Suite */}
        <FadeIn y={40} delay={0.4} className="h-full">
          <div className="group relative flex h-full flex-col justify-between gap-6 rounded-[32px] border border-white/10 bg-[#141418]/50 backdrop-blur-xl p-8 sm:p-10 shadow-2xl hover:bg-[#141418]/80 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(142,91,240,0.1)] transition-all duration-300">
            <div className="space-y-4">
              <div className="rounded-full border border-purple-500/20 bg-purple-500/5 p-4 w-14 h-14 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                <Cpu size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">Analyst Tool Suite</h3>
              <p className="text-xs sm:text-sm text-[#D7E2EA]/60 leading-relaxed font-medium">
                Try my interactive suite of 50+ free client-side utility tools. Features SQL & DAX code formatters, interactive Excel formula builders, CGPA calculators, canvas-based image compressors, and resume ATS checker.
              </p>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <a
                href="#/tools"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof (window as any).__routeTo === 'function') {
                    (window as any).__routeTo('#/tools');
                  } else {
                    window.location.hash = '#/tools';
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Tool Suite <ArrowRight size={13} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
