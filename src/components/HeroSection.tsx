import { useState, useEffect, useRef } from 'react';
import FadeIn from './FadeIn';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certifications' },
  { label: 'Resume', href: '#recruiter-hub' },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [useVideoFallback, setUseVideoFallback] = useState(false);

  // Auto-hide "Tap for sound" hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowSoundHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Handle browser autoplay policy restrictions
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Always start muted to guarantee autoplay works and does not hang the page
    v.muted = true;
    v.play().catch((err) => {
      console.warn("Autoplay failed:", err);
    });

    return () => {
      if (v) {
        v.pause();
      }
    };
  }, [useVideoFallback]);

  // Unmute as soon as the user interacts with the page (to satisfy browser autoplay rules)
  useEffect(() => {
    let unmuted = false;

    const unmute = () => {
      if (unmuted) return;
      const v = videoRef.current;
      if (!v) return;

      if (window.scrollY < 50) {
        v.muted = false;
        setMuted(false);
        unmuted = true;
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', unmute);
      window.removeEventListener('touchstart', unmute);
      window.removeEventListener('mousemove', unmute);
      window.removeEventListener('scroll', unmute);
      window.removeEventListener('keydown', unmute);
    };

    window.addEventListener('click', unmute);
    window.addEventListener('touchstart', unmute);
    window.addEventListener('mousemove', unmute);
    window.addEventListener('scroll', unmute, { passive: true });
    window.addEventListener('keydown', unmute);

    return cleanup;
  }, []);

  // Auto-mute video when scrolling past hero towards About section
  useEffect(() => {
    const handleScroll = () => {
      const v = videoRef.current;
      if (!v) return;

      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        // If About section starts entering viewport, mute the video
        if (rect.top <= window.innerHeight) {
          if (!v.muted) {
            v.muted = true;
            setMuted(true);
          }
        }
      } else {
        if (window.scrollY > 100 && !v.muted) {
          v.muted = true;
          setMuted(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Snap-scroll: one wheel tick / keypress while at top → jump to About
  useEffect(() => {
    let fired = false;

      const goToAbout = () => {
        if (fired) return;
        fired = true;
        const about = document.getElementById('about');
        if (about) about.scrollIntoView({ behavior: 'auto', block: 'start' });
      };

    const onWheel = (e: WheelEvent) => {
      if (fired) return;
      if (e.deltaY <= 0) return;
      if (window.scrollY > 50) return;
      e.preventDefault();
      goToAbout();
    };

    const onKey = (e: KeyboardEvent) => {
      if (fired) return;
      if (window.scrollY > 50) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToAbout();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setShowSoundHint(false);
  };

  return (
    <section ref={sectionRef} className="relative h-[75vh] md:h-screen w-full overflow-hidden bg-black">
      {/* Video or Image background */}
      {!useVideoFallback ? (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={() => setUseVideoFallback(true)}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-[center_top]"
          style={{ backgroundImage: "url('/avatar.webp?v=3')" }}
        />
      )}

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Content layer */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top bar */}
        <FadeIn delay={0} y={-20} className="relative">
          <div className="flex items-center justify-end sm:justify-between px-6 md:px-10 pt-6 md:pt-8 w-full">
            <ul className="hidden sm:flex items-center gap-5 sm:gap-8 md:gap-12">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:text-white relative py-1 group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#007AFF]/35 bg-white/5 px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:bg-[#007AFF]/10 hover:border-[#007AFF]/70 hover:shadow-[0_0_20px_rgba(0,122,255,0.35)] hover:scale-[1.05] active:scale-95 group"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007AFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#007AFF] shadow-[0_0_6px_rgba(0,122,255,0.8)]"></span>
              </span>
              <span>Contact me</span>
            </a>
          </div>
        </FadeIn>

        {/* Middle-left: PORTFOLIO + Name + Subtitle */}
        <div className="flex flex-1 items-end md:items-center pb-12 md:pb-0">
          <div className="w-full max-w-7xl px-6 md:px-10">
            <FadeIn delay={0.3} y={20}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.25em] text-white/80 backdrop-blur-md mb-3 sm:mb-6 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-[#007AFF] shadow-[0_0_6px_rgba(0,122,255,0.8)] animate-pulse" />
                <span>Portfolio · 2026</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} y={40}>
              <h1
                className="font-black uppercase leading-[0.88] tracking-tight bg-gradient-to-br from-white/90 via-white/30 to-[#007AFF]/60 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,122,255,0.45)] transition-transform duration-500 hover:scale-[1.01] cursor-default"
                style={{
                  fontSize: 'clamp(1.75rem, 7vw, 6.5rem)',
                  WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.28)',
                  textShadow: '0 0 40px rgba(0, 122, 255, 0.15)',
                }}
              >
                Avinash<br />Patil
              </h1>
            </FadeIn>

            <FadeIn delay={0.85} y={20}>
              <div className="mt-4 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 select-none">
                {[
                  { text: 'Data Analyst', glow: 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:text-blue-300' },
                  { text: 'BI Developer', glow: 'hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:text-cyan-300' },
                  { text: 'Data Visualization', glow: 'hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:text-emerald-300' }
                ].map((role, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {idx > 0 && <span className="text-white/20 font-light text-sm hidden sm:inline">·</span>}
                    <span className={`px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[#D7E2EA] transition-all duration-300 ${role.glow} hover:scale-105 cursor-default`}>
                      {role.text}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-end justify-between px-6 md:px-10 pb-7 sm:pb-10 md:pb-12">
          {/* Scroll indicator */}
          <FadeIn delay={1.1} y={20}>
            <a href="#about" aria-label="Scroll to next section" className="group flex flex-col items-center gap-3">
              <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.35em] text-white/70 transition group-hover:text-white">
                Scroll
              </span>
              <div className="relative h-12 w-px overflow-hidden bg-white/20">
                <span
                  className="absolute inset-x-0 top-0 h-1/2 w-full bg-white"
                  style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }}
                />
              </div>
            </a>
          </FadeIn>

          {/* Mute toggle + Sound hint */}
          <FadeIn delay={1.1} y={20}>
            <div className="flex items-center gap-3">
              {showSoundHint && muted && (
                <span
                  className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.25em] text-white/80"
                  style={{ animation: 'pulseFade 2s ease-in-out infinite' }}
                >
                  Tap for sound
                </span>
              )}
              <button
                onClick={toggleMute}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-110"
              >
                {muted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes pulseFade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
