import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import AnimatedText from './AnimatedText';

const ABOUT_PARAGRAPHS = [
  "I am an Information Technology (IT) student at GTU and currently working as a Data Analytics Intern at QuadSync Tech Solutions. I am passionate about transforming raw data into meaningful insights that help businesses make smarter, data-driven decisions.",
  "My expertise includes SQL, Power BI, Python, Tableau, and Excel, with a strong focus on data analysis, dashboard development, reporting automation, and business intelligence. I enjoy working with complex datasets, identifying trends, and building interactive dashboards that turn data into actionable business insights.",
  "Alongside my internship, I work as a Computer Trainer at Tech-G Computer Academy, where I teach students computer fundamentals, programming, Excel, SQL, Power BI, and data analytics. This experience has strengthened my communication, leadership, and problem-solving skills while allowing me to help others build technical expertise.",
  "I believe that data is more than just numbers—it is a powerful asset that drives innovation, growth, and strategic decision-making. My goal is to create impactful analytics solutions that help organizations unlock the full potential of their data."
];

const AboutSection = () => {
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
                  </div>      </div>
    </section>
  );
};

export default AboutSection;
