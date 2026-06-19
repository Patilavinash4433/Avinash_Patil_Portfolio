import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, ShieldCheck, Database, FileSpreadsheet, Eye, ExternalLink, X } from 'lucide-react';
import FadeIn from './FadeIn';

interface Certification {
  title: string;
  issuer: string;
  icon: any;
  color: string;
  image?: string;
  verifyUrl?: string;
  glowClass: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    title: 'SQL Certification (Query Optimization, Joins & Aggregations)',
    issuer: 'One Roadmap',
    icon: Database,
    color: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    image: '/cert-oneroadmap-sql.webp',
    verifyUrl: 'https://www.oneroadmap.io/skills/sql/certificate/CERT-4FDBCC70',
    glowClass: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/30',
  },
  {
    title: 'Cisco Python Programming Certification',
    issuer: 'Cisco Networking Academy',
    icon: ShieldCheck,
    color: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
    image: '/cert-cisco-python.webp',
    verifyUrl: 'https://www.credly.com/badges/ea5e0fc0-52c1-4d14-b37e-db7d6fcaedd7/linked_in_profile',
    glowClass: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-500/30',
  },
  {
    title: 'Ultimate Job-Ready AI-Powered Data Analytics Course',
    issuer: 'CodeWithHarry Training',
    icon: FileSpreadsheet,
    color: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
    image: '/cert-codewithharry.webp',
    verifyUrl: 'https://www.codewithharry.com/courses/the-ultimate-job-ready-ai-powered-data-analytics-course/certificate',
    glowClass: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-500/30',
  },
  {
    title: 'Complete Python Bootcamp: Learn Python from Scratch',
    issuer: 'CodeWithHarry Training',
    icon: ShieldCheck,
    color: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
    image: '/cert-cwh-python.webp',
    verifyUrl: 'https://www.codewithharry.com/courses/complete-python-bootcamp-learn-python-from-scratch/certificate',
    glowClass: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-500/30',
  },
  {
    title: 'The Ultimate Job Ready Data Science Course',
    issuer: 'CodeWithHarry Training',
    icon: Database,
    color: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
    image: '/cert-cwh-datascience.webp',
    verifyUrl: 'https://www.codewithharry.com/courses/the-ultimate-job-ready-data-science-course/certificate',
    glowClass: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-500/30',
  },
  {
    title: 'Power BI Micro Course (Dashboard Design & DAX)',
    issuer: 'Skill Course',
    icon: FileSpreadsheet,
    color: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    image: '/cert-powerbi-micro.webp',
    verifyUrl: 'https://exam.skillcourse.in/student/view_certificate?uid=SC-E92B2DA32C',
    glowClass: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30',
  },
  {
    title: 'Data Visualisation: Empowering Business with Effective Insights',
    issuer: 'TATA (Forage)',
    icon: CheckCircle2,
    color: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    image: '/cert-tata-datavis.webp',
    verifyUrl: 'https://www.theforage.com/completion-certificates/Tata/MyXvBcppsW2FkNYCX_Tata%20Group_D3WSrSTA5wK9aLrt7_1722603086885_completion_certificate.pdf',
    glowClass: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30',
  },
  {
    title: 'Deloitte Data Analytics Simulation',
    issuer: 'Deloitte (Forage)',
    icon: CheckCircle2,
    color: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    image: '/cert-deloitte.webp',
    verifyUrl: 'https://verify.theforage.com/verify/ifuAwzGLosDctqGde',
    glowClass: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/30',
  },
  {
    title: 'JPMorgan Software Engineering Simulation',
    issuer: 'JPMorgan Chase & Co. (Forage)',
    icon: CheckCircle2,
    color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    image: '/cert-jpmorgan.webp',
    verifyUrl: 'https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_D3WSrSTA5wK9aLrt7_1766586712832_completion_certificate.pdf',
    glowClass: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30',
  },
  {
    title: 'Security Analyst Certificate Programme',
    issuer: 'Reliance Foundation Skilling Academy',
    icon: ShieldCheck,
    color: 'text-red-500 border-red-500/20 bg-red-500/5',
    image: '/cert-reliance-security.webp',
    verifyUrl: '/cert-reliance-security.webp',
    glowClass: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:border-red-500/30',
  },
  {
    title: 'Learn VBA to Write Codes in Excel',
    issuer: 'Excel Campus',
    icon: FileSpreadsheet,
    color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    image: '/cert-excel-vba.webp',
    verifyUrl: 'https://courses.excelchamps.com/tutor-certificate/?cert_hash=7a164dbfb3fd86d4',
    glowClass: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30',
  },
  {
    title: 'Emerging Technologies Program (SAP Analytics Cloud, ABAP & AI/ML)',
    issuer: 'Edunet Foundation (SAP)',
    icon: Award,
    color: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    image: '/cert-sap-codeunnati.webp',
    verifyUrl: 'https://codeunnati.edunetfoundation.com/verify-certificate26/CU26_41912',
    glowClass: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30',
  },
  {
    title: 'Data Analytics Course Certification',
    issuer: '30 Days Coding',
    icon: CheckCircle2,
    color: 'text-purple-500 border-purple-500/20 bg-purple-500/5',
    image: '/cert-30dayscoding.webp',
    verifyUrl: 'https://30dc.graphy.com/verify-certificate?serialno=GPSRLNB8',
    glowClass: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30',
  },
  {
    title: 'Project Manager Job Simulation',
    issuer: 'Siemens (Forage)',
    icon: CheckCircle2,
    color: 'text-pink-500 border-pink-500/20 bg-pink-500/5',
    image: '/cert-siemens.webp',
    verifyUrl: 'https://www.theforage.com/completion-certificates/YtWaumzWHmKiqP63y/zSefEeEKvojiQqiaH_YtWaumzWHmKiqP63y_D3WSrSTA5wK9aLrt7_1767183992579_completion_certificate.pdf',
    glowClass: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-500/30',
  },
];

const CertificationsSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleCertificates = !showAll
    ? CERTIFICATIONS.slice(0, 8)
    : CERTIFICATIONS;

  return (
    <section
      id="certifications"
      className="relative z-10 w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 border-t border-[#D7E2EA]/10"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -z-10 h-[380px] w-[380px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-16 sm:mb-20 md:mb-28 text-[#D7E2EA]"
          style={{ fontSize: 'clamp(3rem, 10vw, 120px)' }}
        >
          Certificates
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {visibleCertificates.map((cert, i) => {
          const Icon = cert.icon;
          return (
            <FadeIn key={i} delay={i * 0.05} y={30} className="h-full">
              <div className={`group relative flex h-full flex-col justify-between gap-6 rounded-[28px] border border-white/10 bg-[#141418]/50 backdrop-blur-md p-6 transition-all duration-300 hover:bg-[#141418]/80 hover:-translate-y-1 ${cert.glowClass}`}>
                {/* Icon row */}
                <div className="flex items-start justify-between">
                  <div className={`rounded-full border p-3 ${cert.color}`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 flex-1">
                  <span className="font-light uppercase tracking-widest text-[#D7E2EA]/40 text-[10px] sm:text-xs">
                    {cert.issuer}
                  </span>
                  <h3 className="font-semibold text-[#D7E2EA] text-sm sm:text-base leading-snug group-hover:text-white transition-colors duration-300">
                    {cert.title}
                  </h3>
                </div>

                {/* Preview and verify row */}
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-[#D7E2EA]/10">
                  {cert.image ? (
                    <div
                      onClick={() => setSelectedImage(cert.image!)}
                      className="relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-[#D7E2EA]/20 bg-[#0C0C0C] cursor-zoom-in group/img"
                    >
                      <img
                        src={cert.image}
                        alt={`${cert.title} preview`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye size={14} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-14 rounded-lg border border-dashed border-[#D7E2EA]/10 bg-black/20 flex items-center justify-center text-[10px] text-[#D7E2EA]/30 text-center px-1">
                      No Image
                    </div>
                  )}

                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wider uppercase text-teal-400 hover:text-teal-300 transition-colors duration-200"
                    >
                      Verify <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#D7E2EA]/30 uppercase tracking-widest">
                      In-Progress
                    </span>
                  )}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {CERTIFICATIONS.length > 8 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/20 bg-[#141418] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#D7E2EA] hover:border-[#D7E2EA]/50 hover:bg-[#1a1a20] transition-all cursor-pointer active:scale-95 shadow-md"
          >
            {showAll ? 'Show Less' : 'Show More Certificates'}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#D7E2EA]/20 bg-[#0C0C0C] p-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white hover:bg-black/80 transition-colors duration-200"
              >
                <X size={20} />
              </button>

              <img
                src={selectedImage}
                alt="Certificate Fullscreen"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificationsSection;
