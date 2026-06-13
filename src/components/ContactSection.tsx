import { Mail, MessageCircle, Linkedin, Github, Instagram, ArrowUpRight } from 'lucide-react';
import FadeIn from './FadeIn';

interface ContactMethod {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  glowClass: string;
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'patiluday8035@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=patiluday8035@gmail.com',
    glowClass: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91 93777 78051',
    href: 'https://wa.me/919377778051',
    glowClass: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:border-green-500/30',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'patilavinash4046',
    href: 'https://www.linkedin.com/in/patilavinash4046/',
    glowClass: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'Patilavinash4433',
    href: 'https://github.com/Patilavinash4433',
    glowClass: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:border-white/20',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: 'avinashhpatill',
    href: 'https://www.instagram.com/avinashhpatill/',
    glowClass: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-500/30',
  },
];

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[360px] w-[360px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      {/* Heading */}
      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Get in touch
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <p
          className="text-center font-light uppercase tracking-widest text-[#D7E2EA]/60 mb-12 sm:mb-16 md:mb-20"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
        >
          Pick whichever channel suits you
        </p>
      </FadeIn>

      {/* Contact cards */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {CONTACT_METHODS.map((method, i) => {
          const Icon = method.icon;
          const isMail = method.href.startsWith('mailto:');
          
          // Tailored branding colors
          const brandStyles = 
            method.label === 'Email' ? { text: 'text-indigo-400', border: 'group-hover:border-indigo-500/30', glow: 'hover:shadow-[0_0_35px_rgba(99,102,241,0.12)] hover:border-indigo-500/40', valText: 'text-indigo-300' } :
            method.label === 'WhatsApp' ? { text: 'text-green-400', border: 'group-hover:border-green-500/30', glow: 'hover:shadow-[0_0_35px_rgba(34,197,94,0.12)] hover:border-green-500/40', valText: 'text-green-300' } :
            method.label === 'LinkedIn' ? { text: 'text-blue-400', border: 'group-hover:border-blue-500/30', glow: 'hover:shadow-[0_0_35px_rgba(59,130,246,0.12)] hover:border-blue-500/40', valText: 'text-blue-300' } :
            method.label === 'GitHub' ? { text: 'text-white', border: 'group-hover:border-white/30', glow: 'hover:shadow-[0_0_35px_rgba(255,255,255,0.06)] hover:border-white/40', valText: 'text-white' } :
            { text: 'text-pink-400', border: 'group-hover:border-pink-500/30', glow: 'hover:shadow-[0_0_35px_rgba(236,72,153,0.12)] hover:border-pink-500/40', valText: 'text-pink-300' };

          return (
            <FadeIn key={method.label} delay={i * 0.1} y={30}>
              <a
                href={method.href}
                target={isMail ? undefined : "_blank"}
                rel={isMail ? undefined : "noopener noreferrer"}
                className={`group relative flex h-full flex-col justify-between gap-8 sm:gap-10 rounded-[28px] sm:rounded-[32px] border border-white/10 bg-[#141418]/50 backdrop-blur-md p-6 sm:p-7 md:p-8 transition-all duration-500 hover:bg-[#1C1C22]/80 hover:border-transparent hover:-translate-y-1.5 cursor-pointer shadow-lg ${brandStyles.glow}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-full border border-white/10 p-3 sm:p-3.5 transition-all duration-500 group-hover:bg-white/5 ${brandStyles.border}`}>
                    <Icon
                      className={`text-[#D7E2EA] transition-colors duration-500 ${brandStyles.text}`}
                      size={22}
                      strokeWidth={1.5}
                    />
                  </div>
                  <ArrowUpRight
                    className="text-[#D7E2EA]/40 transition-all duration-300 group-hover:text-white group-hover:rotate-12"
                    size={22}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <span
                    className="font-light uppercase tracking-widest text-[#D7E2EA]/50 group-hover:text-white/40 transition-colors duration-500"
                    style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
                  >
                    {method.label}
                  </span>
                  <span
                    className={`font-semibold break-all transition-colors duration-500 text-[#D7E2EA]/90 group-hover:${brandStyles.valText}`}
                    style={{ fontSize: 'clamp(0.72rem, 1.1vw, 0.85rem)' }}
                  >
                    {method.value}
                  </span>
                </div>
              </a>
            </FadeIn>
          );
        })}
      </div>

      {/* Footer line */}
      <FadeIn delay={0.4} y={20}>
        <div className="mx-auto mt-20 sm:mt-24 md:mt-28 flex max-w-5xl flex-col items-center gap-3 border-t border-[#D7E2EA]/10 pt-8 text-center sm:flex-row sm:justify-between">
          <span
            className="font-light uppercase tracking-widest text-[#D7E2EA]/50"
            style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
          >
            © 2026 Avinash Patil
          </span>
          <span
            className="font-light uppercase tracking-widest text-[#D7E2EA]/50"
            style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)' }}
          >
            Designed & built in Surat
          </span>
        </div>
      </FadeIn>
    </section>
  );
};

export default ContactSection;
