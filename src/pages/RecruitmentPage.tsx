import { SEOHead } from '../components/common/SEOHead';
import { RecruitmentEnquiryForm } from '../components/forms/RecruitmentEnquiryForm';
import { 
  Building2, 
  Users2, 
  CheckCircle, 
  Briefcase, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  FileCheck,
  Sparkles,
  Zap,
  ArrowRight,
  Mail,
  MessageCircle,
  Code,
  LineChart,
  Headphones,
  Award,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_CONFIG } from '../config/company';
import { trackWhatsAppClick, trackEmailClick } from '../lib/analytics';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';
import { SpotlightCard } from '../components/common/SpotlightCard';

export const RecruitmentPage = () => {
  const serviceOfferings = [
    {
      title: "Corporate Workforce Staffing",
      desc: "Sourcing entry-level and junior professionals across administrative, business development, accounting, and technical operations.",
      icon: Users2,
      badge: "Core Service"
    },
    {
      title: "Pre-Screened Talent Pools",
      desc: "Candidates are screened for communication, domain fundamentals, and resume authenticity before presentation to your hiring team.",
      icon: FileCheck,
      badge: "Verified Quality"
    },
    {
      title: "Campus & Institutional Liaison",
      desc: "Direct access to fresh degree graduates and diploma holders from accredited universities and vocational cohorts.",
      icon: Building2,
      badge: "Direct Pipeline"
    },
    {
      title: "Rapid 48h Turnaround",
      desc: "Dedicated recruitment account managers to match candidate profiles with your urgent staffing timelines.",
      icon: Clock,
      badge: "High Speed"
    }
  ];

  const candidateVerticals = [
    { title: "Business Development & Sales", icon: TrendingUp, level: "Entry to Mid" },
    { title: "Accounts & Financial Ops", icon: LineChart, level: "Graduate / Semi-Qualified" },
    { title: "Junior Software & Web Dev", icon: Code, level: "BCA / B.Tech / MCA" },
    { title: "Customer Support & Desk", icon: Headphones, level: "Bilingual / Multi-Lingual" },
    { title: "Administrative & Operations", icon: Layers, level: "Degree / Diploma" },
    { title: "HR & Talent Coordination", icon: Briefcase, level: "MBA / BBA / B.Com" }
  ];

  const stats = [
    { target: 500, suffix: "+", label: "Pre-Vetted Graduates", icon: Users2 },
    { target: 98, suffix: "%", label: "Screening Accuracy", icon: ShieldCheck },
    { target: 48, suffix: "h", label: "Average Shortlist Time", icon: Zap },
    { target: 50, suffix: "+", label: "Hiring Partners", icon: Building2 }
  ];

  return (
    <>
      <SEOHead
        title="Recruitment & Manpower Services | Corporate Staffing Solutions"
        description="Connect with qualified, pre-screened talent. Talent Path Solutions provides workforce staffing, graduate hiring, and corporate manpower services."
      />

      {/* Header with animated subtle floating glow */}
      <section className="bg-brand-navy text-white py-16 sm:py-24 relative overflow-hidden">
        {/* Animated ambient gradient glowing orbs */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#3563F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-5">
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-blue animate-spin-slow" />
              <span>Corporate & Enterprise Solutions</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </motion.div>

            {/* Headline with animated entrance */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
            >
              Recruitment & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Manpower Services.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-light"
            >
              Connecting high-growth enterprises, corporations, and institutions with verified, job-ready candidates across varied functional verticals.
            </motion.p>
          </div>

          {/* Quick Metrics Ribbon with Smooth Animated Counters */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10"
          >
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center space-x-3.5 group hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/20 text-brand-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-xl text-white">
                      <AnimatedCounter to={st.target} suffix={st.suffix} duration={1.6 + i * 0.2} />
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{st.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Corporate Trust & Accreditation Infinite Marquee */}
      <InfiniteMarquee className="border-t-0 shadow-sm" />

      {/* Main Grid */}
      <section className="py-20 bg-brand-bgLight relative overflow-hidden">
        {/* Ambient floating glow */}
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-10 text-left">
              
              {/* Intro Title Block */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
                  Employer Partnership
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
                  High-Quality Staffing Without Hiring Friction
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Finding dependable candidates who possess verified academic credentials and practical skills can be time-consuming. Talent Path Solutions bridges the gap between educational institutions and employers.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We pre-assess candidates on fundamental competencies, ensuring your HR teams receive qualified shortlists rather than hundreds of unvetted resumes.
                </p>
              </motion.div>

              {/* 4 Feature Pillars with SpotlightCard Cursor Glow & Micro-Interactions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceOfferings.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <SpotlightCard className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-soft-xl flex flex-col justify-between group transition-all h-full">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-11 h-11 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                              {s.badge}
                            </span>
                          </div>
                          <h4 className="font-heading font-black text-base text-brand-darkText group-hover:text-brand-blue transition-colors">
                            {s.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {s.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-blue">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                          <span>Pre-screened & verified</span>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* Staffing Roles Matrix with Interactive Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-7 rounded-3xl border border-slate-100 shadow-soft hover:shadow-soft-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-black text-lg text-brand-darkText">
                      Candidate Verticals We Source For
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tailored pipelines matching technical, commercial, and operational requirements
                    </p>
                  </div>
                  <Award className="w-5 h-5 text-brand-blue flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {candidateVerticals.map((v, i) => {
                    const VIcon = v.icon;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03, x: 3, transition: { duration: 0.2 } }}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-brand-blueLight/40 hover:border-brand-blue/30 transition-all flex items-start space-x-3 group cursor-default"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white text-slate-700 group-hover:text-brand-blue group-hover:bg-brand-blueLight flex items-center justify-center flex-shrink-0 shadow-soft-sm transition-colors mt-0.5">
                          <VIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-brand-darkText group-hover:text-brand-blue transition-colors">
                            {v.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {v.level}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Direct Corporate Contact Card with interactive action pills */}
              <motion.div 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-3xl bg-brand-navy text-white text-xs space-y-4 relative overflow-hidden shadow-soft-xl"
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-blue/20 blur-2xl pointer-events-none"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-brand-blue bg-white/10 px-2.5 py-1 rounded-full">
                      Corporate SLAs
                    </span>
                    <h5 className="font-heading font-black text-lg text-white mt-1">Direct Corporate Desk</h5>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-brand-blue" />
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed relative z-10">
                  For enterprise master service agreements (MSAs), campus recruitment drives, or high-volume seasonal staffing:
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 relative z-10">
                  <a
                    href={`mailto:${COMPANY_CONFIG.email.recruitment}`}
                    onClick={() => trackEmailClick('recruitment_page_desk')}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold shadow-pill hover:shadow-pill-hover transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{COMPANY_CONFIG.email.recruitment}</span>
                  </a>

                  <a
                    href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent('Hello Talent Path Solutions! I would like to inquire about corporate recruitment and workforce staffing tie-ups.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('recruitment_page_desk')}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </motion.div>

            </div>

            {/* Right Form Column with Framer Motion entry and elevated glass styling */}
            <div className="lg:col-span-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="sticky top-28 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft-xl"
              >
                <div className="mb-6 text-left space-y-1.5 pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3 py-1 rounded-full inline-block">
                    Hiring Partnership Request
                  </span>
                  <h3 className="font-heading font-black text-2xl text-brand-darkText">
                    Submit Corporate Hiring Requirement
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Provide your hiring requirements and our talent acquisition lead will follow up with verified candidate profiles within 24–48 hours.
                  </p>
                </div>
                <RecruitmentEnquiryForm sourcePage="/recruitment" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

