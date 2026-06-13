import FadeIn from './FadeIn';


const SERVICES = [
  {
    number: '01',
    title: 'Business Intelligence & Dashboards',
    description:
      'Designing interactive Power BI and Tableau dashboards with KPIs, business metrics, drill-through reports, and executive insights.',
  },
  {
    number: '02',
    title: 'SQL & Database Analytics',
    description:
      'Writing optimized SQL queries, designing relational databases, performing data extraction, transformation, and reporting.',
  },
  {
    number: '03',
    title: 'Data Cleaning & Transformation',
    description:
      'Cleaning raw datasets, handling missing values, transforming data, and preparing analytics-ready datasets.',
  },
  {
    number: '04',
    title: 'Data Analysis with Python',
    description:
      'Performing EDA, trend analysis, statistical analysis, and business insight generation using Pandas, NumPy, and Matplotlib.',
  },
  {
    number: '05',
    title: 'Reporting Automation',
    description:
      'Automating reports, dashboards, and recurring business processes using Excel, SQL, Power BI, and Python.',
  },
];

const ServicesSection = () => {
  return (
    <section
      id="services"
      className="relative w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[140px] pointer-events-none" />

      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl space-y-6">
        {SERVICES.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.08} y={25}>
            <div
              className="group relative flex flex-row items-start gap-6 sm:gap-10 md:gap-14 py-8 px-6 sm:px-10 md:px-12 rounded-[24px] border border-white/5 bg-[#141418]/30 backdrop-blur-md hover:bg-[#1C1C22]/50 hover:border-white/10 hover:shadow-[0_0_40px_rgba(0,122,255,0.05)] transition-all duration-500 overflow-hidden"
            >
              {/* Left blue accent indicator line that animates height on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#007AFF] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-500 rounded-r-full shadow-[0_0_15px_rgba(0,122,255,0.8)]" />

              {/* Service Number */}
              <div
                className="shrink-0 font-black text-white/5 group-hover:text-[#007AFF]/20 transition-colors duration-500 leading-none select-none"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 120px)' }}
              >
                {service.number}
              </div>

              {/* Service Info */}
              <div className="group flex flex-col gap-3 sm:gap-4 pt-1 sm:pt-2">
                <h3
                  className="font-bold uppercase tracking-wide text-[#D7E2EA] group-hover:text-white transition-colors duration-300 leading-tight relative inline-block w-fit"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.6rem)' }}
                >
                  {service.title}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)] transition-all duration-500 group-hover:w-full" />
                </h3>
                <p
                  className="font-light leading-relaxed text-[#D7E2EA]/60 group-hover:text-[#D7E2EA]/85 transition-colors duration-300 max-w-2xl text-justify sm:text-left"
                  style={{
                    fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
