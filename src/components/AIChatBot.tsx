import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Copy, Check } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const AVINASH_KNOWLEDGE = {
  about: `Avinash Patil is an Information Technology (IT) student at GTU and currently working as a Data Analyst at Indo Era (since July 2026). He is also a Computer Trainer at Tech-G Computer Academy.

💻 Education: IT Student at Gujarat Technological University (GTU)
🏢 Current Job: Data Analyst at Indo Era (Jul 2026 – Present)
🎓 Previous Internship: Data Analytics Intern at QuadSync Tech Solutions (Mar 2026 – Jun 2026)
🏫 Training: Teaching subjects like Excel, SQL, Power BI, and Python at Tech-G Computer Academy.`,

  contact: `You can reach Avinash via any of these channels:
• 📧 Email: patiluday8035@gmail.com
• 💬 WhatsApp: +91 93777 78051
• 🔗 LinkedIn: https://www.linkedin.com/in/patilavinash4046/
• 🐙 GitHub: https://github.com/Patilavinash4433
• 📸 Instagram: https://www.instagram.com/avinashhpatill/`,

  skills: `Here is a detailed breakdown of Avinash's technical skillset:
• 💻 Languages & Query: Python, SQL, HTML5 & CSS3, JavaScript (JS), Others
• 📊 Analytics & Visualization: Power BI (DAX, Power Query), Tableau Desktop, Microsoft Excel (Advanced), SAP Analytics Cloud
• 🐍 Python Libraries: Pandas, NumPy, Matplotlib, Seaborn
• 🗄️ Databases: MySQL, PostgreSQL, SQLite, MS SQL Server, Relational Database Design
• 🛠️ Tools & Platforms: Git, GitHub, Jupyter Notebook/Lab, VS Code, Google Sheets
• 📈 Core Competencies: Data Cleaning & Prep, Dashboard Development, KPI Reporting, Business Intelligence (BI), EDA, Reporting Automation, Statistical Analysis, Stakeholder Reporting`,

  projects: `Avinash has built 4 key analytics projects:
1. 📈 **Sales Performance Dashboard** (Power BI, SQL, DAX) - Multi-tab dashboard measuring sales KPIs and trend analyses. [GitHub](https://github.com/Patilavinash4433/Sales-Performance-Dashboard)
2. 🍔 **Zomato Restaurant Analytics** (Power BI, SQL, Python) - Comprehensive exploratory analysis of Zomato's metrics. [GitHub](https://github.com/Patilavinash4433/Zomato_Performance_Analytics_Dashboard)
3. 🎓 **Student Data Management System** (Python, FastAPI, SQL) - A database CRUD tool for managing student records. [GitHub](https://github.com/Patilavinash4433/Student_Data_Manager)
4. 🌍 **Global Sales Dashboard** (Excel, Pivot Tables, KPIs) - TechNova Revenue Dashboard with interactive pivots. [Live App](https://patilavinash4433.github.io/TechNova_Revenue_Dashboard/)`,

  certificates: `Avinash holds 12 verified certifications:
1. SQL Certification (One Roadmap)
2. Python Programming (Cisco / Credly)
3. AI-Powered Data Analytics (CodeWithHarry)
4. Power BI Micro Course (Skill Course)
5. Data Visualisation (Tata / Forage)
6. Data Analytics Simulation (Deloitte / Forage)
7. Software Engineering Simulation (JPMorgan / Forage)
8. Security Analyst Certificate Programme (Reliance Skilling Academy)
9. Excel VBA Certification (Excel Campus)
10. Emerging Technologies / SAP (Edunet Foundation)
11. Data Analytics (30 Days Coding)
12. Project Manager Simulation (Siemens / Forage)`
};

const SUGGESTIONS = [
  { label: 'Show Skills 📊', value: 'skills' },
  { label: 'View Projects 📈', value: 'projects' },
  { label: 'Contact Info 📧', value: 'contact' },
  { label: 'Certifications 🎓', value: 'certificates' },
  { label: 'About Avinash 💻', value: 'about' }
];

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show chatbot when scrolled past 300px (entering about section)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false); // auto-close if user scrolls back to top
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am Avinash's AI Assistant. Ask me anything about his skills, projects, certificates, or contact details! \n\nHaanji! Main Avinash ka AI assistant hoon. Aap mujhse uske projects, skills, certificates ya contact details ke baare me pooch sakte hain!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleCopyContact = () => {
    navigator.clipboard.writeText(AVINASH_KNOWLEDGE.contact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateResponse = (input: string): string => {
    const cleanInput = input.toLowerCase().trim();

    if (cleanInput.includes('phone') || cleanInput.includes('number') || cleanInput.includes('mobile') || cleanInput.includes('whatsapp') || cleanInput.includes('call') || cleanInput.includes('phno') || cleanInput.includes('wa.me')) {
      return `Sure! You can contact Avinash on WhatsApp or Call at:\n📞 +91 93777 78051\n\nDirect link: https://wa.me/919377778051\n\nHindi me bolu toh: Aap directly WhatsApp par +91 93777 78051 par message kar sakte hain.`;
    }

    if (cleanInput.includes('email') || cleanInput.includes('mail') || cleanInput.includes('gmail') || cleanInput.includes('patiluday')) {
      return `Avinash's primary email address is:\n📧 patiluday8035@gmail.com\n\nFeel free to write to him anytime. Aap is email par direct reach out kar sakte hain.`;
    }

    if (cleanInput.includes('linkedin') || cleanInput.includes('linkedin link')) {
      return `Avinash's LinkedIn profile is:\n🔗 https://www.linkedin.com/in/patilavinash4046/\n\nAap LinkedIn par connect kar sakte hain profile: patilavinash4046`;
    }

    if (cleanInput.includes('instagram') || cleanInput.includes('insta')) {
      return `You can find Avinash on Instagram here:\n📸 https://www.instagram.com/avinashhpatill/\n\nUsername is: avinashhpatill`;
    }

    if (cleanInput.includes('github') || cleanInput.includes('git')) {
      return `Avinash's GitHub profile is:\n🐙 https://github.com/Patilavinash4433\n\nAll project source codes are stored here.`;
    }

    if (cleanInput.includes('contact') || cleanInput.includes('reach') || cleanInput.includes('social') || cleanInput.includes('connect')) {
      return `Here are the contact options for Avinash:\n\n${AVINASH_KNOWLEDGE.contact}`;
    }

    if (cleanInput.includes('skill') || cleanInput.includes('know') || cleanInput.includes('language') || cleanInput.includes('python') || cleanInput.includes('sql') || cleanInput.includes('power bi') || cleanInput.includes('excel') || cleanInput.includes('tableau') || cleanInput.includes('libraries') || cleanInput.includes('database')) {
      return AVINASH_KNOWLEDGE.skills;
    }

    if (cleanInput.includes('project') || cleanInput.includes('build') || cleanInput.includes('dashboards') || cleanInput.includes('zomato') || cleanInput.includes('sales') || cleanInput.includes('student') || cleanInput.includes('technova')) {
      return AVINASH_KNOWLEDGE.projects;
    }

    if (cleanInput.includes('certificate') || cleanInput.includes('cert') || cleanInput.includes('credential') || cleanInput.includes('deloitte') || cleanInput.includes('reliance') || cleanInput.includes('jpmorgan') || cleanInput.includes('tata') || cleanInput.includes('cisco') || cleanInput.includes('siemens') || cleanInput.includes('excel campus') || cleanInput.includes('30 days') || cleanInput.includes('sap')) {
      return AVINASH_KNOWLEDGE.certificates;
    }

    if (cleanInput.includes('about') || cleanInput.includes('who is') || cleanInput.includes('education') || cleanInput.includes('collage') || cleanInput.includes('college') || cleanInput.includes('degree') || cleanInput.includes('studying') || cleanInput.includes('gtu') || cleanInput.includes('quadsync') || cleanInput.includes('academy') || cleanInput.includes('trainer') || cleanInput.includes('tech-g')) {
      return AVINASH_KNOWLEDGE.about;
    }

    if (cleanInput.includes('hi') || cleanInput.includes('hello') || cleanInput.includes('hey') || cleanInput.includes('naam') || cleanInput.includes('name') || cleanInput.includes('kaisa') || cleanInput.includes('how are you')) {
      return `Hello! Main Avinash ka AI assistant hoon. Main fine hoon, aap batao kya chal raha hai? 😊\n\nAap mujhse uske projects, skills, contact info, ya certificates ke baare me pooch sakte hain. Ask me anything!`;
    }

    // Default response
    return `Main samajh nahi paya. Please skills, projects, certificates, ya contact details ke baare me likhiye.\n\nI couldn't quite catch that. Try asking about:\n- "What are your skills?"\n- "Tell me about your projects"\n- "Show your certificates"\n- "How can I contact you?"`;
  };

  const simulateBotResponse = (responseText: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const newBotMsgId = Date.now() + 1;
      setMessages(prev => [...prev, { id: newBotMsgId, sender: 'bot', text: '' }]);

      let index = 0;
      const chars = Array.from(responseText);
      const interval = setInterval(() => {
        if (index < chars.length) {
          setMessages(prev =>
            prev.map(msg => msg.id === newBotMsgId ? { ...msg, text: msg.text + chars[index] } : msg)
          );
          index++;
        } else {
          clearInterval(interval);
        }
      }, 4); // Fast, snappy character streaming
    }, 900);
  };

  const handleSendMessage = (textToSend = inputValue) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate and simulate bot response
    const botResponse = generateResponse(textToSend);
    simulateBotResponse(botResponse);
  };

  const handleSuggestionClick = (val: keyof typeof AVINASH_KNOWLEDGE) => {
    const labelMapping = {
      skills: 'What are your skills? 📊',
      projects: 'Show me your projects 📈',
      contact: 'How to contact you? 📧',
      certificates: 'Show your certificates 🎓',
      about: 'Tell me about yourself 💻'
    };

    const userText = labelMapping[val];
    const botText = AVINASH_KNOWLEDGE[val];

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };
    setMessages(prev => [...prev, userMessage]);

    simulateBotResponse(botText);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="mb-4 flex h-[500px] sm:h-[580px] w-[90vw] sm:w-[400px] flex-col overflow-hidden rounded-[24px] border border-[#D7E2EA]/15 bg-[#141418]/95 shadow-2xl backdrop-blur-xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#D7E2EA]/10 bg-[#1C1C22]/80 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20">
                      <img src="/avinash-photo.webp?v=3" alt="Avinash Patil" className="h-full w-full object-cover" />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#141418] bg-green-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Avinash's AI Assistant</h4>
                      <p className="text-[10px] text-green-500 font-medium tracking-wide">Online & Ready</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Close chat"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                  {/* Welcoming Profile Card */}
                  <div className="flex flex-col items-center justify-center text-center p-5 mb-2 rounded-2xl bg-[#1C1C22]/40 border border-[#D7E2EA]/5">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#007AFF]/40 mb-3 shadow-lg">
                      <img src="/avinash-photo.webp?v=3" alt="Avinash Patil" className="h-full w-full object-cover" />
                    </div>
                    <h5 className="text-sm font-semibold text-white">Avinash Patil</h5>
                    <p className="text-[10px] text-[#D7E2EA]/50 mt-0.5 uppercase tracking-wider">Data Analyst @ Indo Era</p>
                    <div className="flex items-center gap-1 mt-2.5 rounded-full bg-[#007AFF]/10 px-3 py-0.5 text-[9px] text-[#007AFF] font-medium tracking-wide">
                      <Sparkles size={10} /> AI Agent Active
                    </div>
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`rounded-[18px] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white rounded-br-none shadow-md'
                            : 'bg-[#1C1C22] text-[#D7E2EA] border border-[#D7E2EA]/10 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="mr-auto max-w-[80%] flex flex-col items-start">
                      <div className="rounded-[18px] bg-[#1C1C22] border border-[#D7E2EA]/10 px-4 py-3 text-sm rounded-bl-none">
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-[#D7E2EA]/50" style={{ animationDelay: '0ms' }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-[#D7E2EA]/50" style={{ animationDelay: '150ms' }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-[#D7E2EA]/50" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions chips */}
                <div className="flex flex-wrap gap-1.5 bg-[#1C1C22]/30 px-4 py-2 border-t border-[#D7E2EA]/5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSuggestionClick(s.value as keyof typeof AVINASH_KNOWLEDGE)}
                      className="rounded-full border border-[#D7E2EA]/10 bg-[#1C1C22] px-2.5 py-1 text-[11px] text-[#D7E2EA]/75 hover:border-[#D7E2EA]/40 hover:bg-[#25252d] hover:text-white transition-all cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Bottom Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 border-t border-[#D7E2EA]/10 bg-[#1C1C22]/60 p-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about Avinash..."
                    className="flex-1 rounded-full border border-[#D7E2EA]/10 bg-black/40 px-4 py-2.5 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 focus:border-[#007AFF] focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white hover:bg-[#0062CC] active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Toggle Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg cursor-pointer overflow-hidden border border-white/10 bg-[#141418]/50 backdrop-blur-md hover:bg-[#141418]/80 transition-all duration-300"
            style={{
              boxShadow: '0 8px 30px rgba(0, 122, 255, 0.3)',
            }}
            aria-label="Toggle AI assistant"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#007AFF] to-[#00C6FF] text-white"
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative h-full w-full"
                >
                  <img src="/chatbot-icon.webp?v=6" alt="AI Assistant" className="h-full w-full object-cover" />
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 border border-[#141418] animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
