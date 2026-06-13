import { Briefcase, Calendar, MapPin, Send, Mail, Award, Download } from 'lucide-react';
import FadeIn from './FadeIn';

export default function RecruiterHub() {
  const getWhatsAppLink = () => {
    const msg = `Hi Avinash, I visited your portfolio and would like to schedule an interview with you for a Data Analyst / BI Developer role. Let me know when you are available.`;
    return `https://wa.me/919377778051?text=${encodeURIComponent(msg)}`;
  };

  const getGmailLink = () => {
    const subject = `Interview Invitation`;
    const body = `Hello Avinash,\n\nI came across your portfolio and would like to discuss a potential opportunity with you.\n\nBest Regards`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=patiluday8035@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="recruiter-hub"
      className="relative z-10 w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 border-t border-[#D7E2EA]/10 overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/[0.03] blur-[150px] pointer-events-none" />

      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center mb-16">
        <FadeIn y={30}>
          <span className="text-xs font-bold uppercase tracking-widest text-[#007AFF] bg-[#007AFF]/10 border border-[#007AFF]/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Recruiter Hub
          </span>
        </FadeIn>
        <FadeIn y={40} delay={0.1}>
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 80px)' }}
          >
            Hire Avinash
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.2}>
          <p className="mx-auto max-w-lg text-xs sm:text-sm font-light text-[#D7E2EA]/60 leading-relaxed uppercase tracking-wider">
            Interested in working together? Schedule an interview directly or download my resume.
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Recruiter Card Panel */}
        <FadeIn y={40} delay={0.3}>
          <div className="rounded-[32px] border border-white/10 bg-[#141418]/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-[#007AFF]/5 blur-3xl pointer-events-none" />
            
            <div className="space-y-8">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Avinash Patil</h3>
                  <p className="text-xs text-[#007AFF] font-bold uppercase tracking-widest mt-0.5">
                    Data Analyst & BI Developer
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Available Immediately
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-xs">
                {/* Experience */}
                <div className="flex items-start gap-3.5">
                  <div className="text-[#007AFF] mt-0.5 shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider font-bold mb-0.5">Experience</span>
                    <span className="text-sm font-semibold text-white/95 leading-normal">QuadSync Internships</span>
                  </div>
                </div>

                {/* Job Type */}
                <div className="flex items-start gap-3.5">
                  <div className="text-[#007AFF] mt-0.5 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider font-bold mb-0.5">Job Type</span>
                    <span className="text-sm font-semibold text-white/95 leading-normal">Full-Time / Contract</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="text-[#007AFF] mt-0.5 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider font-bold mb-0.5">Location</span>
                    <span className="text-sm font-semibold text-white/95 leading-normal">India (Open to Remote / Hybrid)</span>
                  </div>
                </div>

                {/* Key Focus */}
                <div className="flex items-start gap-3.5">
                  <div className="text-[#007AFF] mt-0.5 shrink-0">
                    <Award size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider font-bold mb-0.5">Key Focus</span>
                    <span className="text-sm font-semibold text-white/95 leading-normal">SQL, Python, Power BI & Excel</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-6 border-t border-white/5">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-white px-6 py-3 text-xs font-semibold tracking-wider text-[#D7E2EA] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 cursor-pointer"
                >
                  <Send size={13} className="text-emerald-400" /> WhatsApp
                </a>

                <a
                  href={getGmailLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/50 hover:text-white px-6 py-3 text-xs font-semibold tracking-wider text-[#D7E2EA] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-95 cursor-pointer"
                >
                  <Mail size={13} className="text-red-400" /> Email (Gmail)
                </a>

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
                  className="inline-flex items-center gap-2 rounded-full border border-[#007AFF]/30 bg-[#007AFF]/5 hover:bg-[#007AFF]/15 hover:border-[#007AFF] hover:text-white px-6 py-3 text-xs font-semibold tracking-wider text-[#D7E2EA] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,122,255,0.2)] active:scale-95 cursor-pointer relative"
                >
                  <Briefcase size={13} className="text-[#007AFF]" />
                  <span>Customize Resume (PDF)</span>
                  <span className="relative flex h-1.5 w-1.5 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007AFF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#007AFF]"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
