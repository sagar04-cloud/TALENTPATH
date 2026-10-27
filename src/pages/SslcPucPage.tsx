import { SEOHead } from '../components/common/SEOHead';
import { AdmissionEnquiryForm } from '../components/forms/AdmissionEnquiryForm';
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';

export const SslcPucPage = () => {
  const steps = [
    {
      title: "SSLC / 10th Standard Completion",
      desc: "Complete your fundamental secondary school certification via accredited open boards (e.g. NIOS or State Open School). Recognized across India for employment and subsequent 11th/PUC admissions.",
      icon: BookOpen,
      badge: "Open Schooling"
    },
    {
      title: "PUC / 12th Senior Secondary",
      desc: "Finish your Pre-University course in Commerce, Arts, or Science streams. Enables eligibility for university degrees (BBA, B.Com, BCA, BA, B.Sc) and competitive examinations.",
      icon: GraduationCap,
      badge: "Higher Secondary"
    },
    {
      title: "Dedicated Study Guidance",
      desc: "We supply comprehensive syllabus modules, model question papers, and mentor check-ins so you are well prepared for examination schedules.",
      icon: ShieldCheck,
      badge: "Mentor Support"
    },
    {
      title: "Flexible Examination Cycles",
      desc: "Open schooling offers flexible exam schedules twice a year, as well as on-demand options, allowing students to pass at their own pace.",
      icon: Sparkles,
      badge: "Twice a Year"
    }
  ];

  return (
    <>
      <SEOHead
        title="SSLC & PUC Education Services | 10th & 12th Board Completion"
        description="Complete your SSLC (10th) and PUC (12th) through recognized open schooling and private board programs with Talent Path Solutions."
      />

      {/* Header with animated glowing ambient orbs */}
      <section className="bg-brand-navy text-white py-16 sm:py-24 relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#3563F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Secondary & Senior Secondary</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
            >
              SSLC & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">PUC Education Services.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-light"
            >
              It is never too late to complete your secondary education. We provide structured, recognized 10th and 12th board completion pathways for learners of all ages.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Trust Infinite Marquee Banner */}
      <InfiniteMarquee className="border-t-0 shadow-sm" />

      {/* Main Grid */}
      <section className="py-20 bg-brand-bgLight relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
                  Second Chance Pathways
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
                  Unlock Higher Degrees and Career Eligibility
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Many students discontinue their schooling due to unforeseen family obligations, financial pressure, or health challenges. Without an SSLC (10th) or PUC (12th) certificate, pursuing a degree or qualifying for government exams is restricted.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Talent Path Solutions guides learners through accredited open schooling and private board programs. The certifications awarded are legally recognized for higher college admissions and employment.
                </p>
              </motion.div>

              {/* 4 Feature Pillars with SpotlightCard Cursor Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
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
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            {s.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-blue">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                          <span>Nationally Recognized</span>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* Streams Available in PUC */}
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
                      PUC / 12th Streams Offered
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select subject combinations matching your undergraduate aspirations
                    </p>
                  </div>
                  <Award className="w-5 h-5 text-brand-blue flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <p className="font-heading font-bold text-sm text-brand-darkText">Commerce Stream</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Accountancy, Economics, Business Studies, Math</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <p className="font-heading font-bold text-sm text-brand-darkText">Arts / Humanities</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">History, Political Science, Sociology, Languages</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <p className="font-heading font-bold text-sm text-brand-darkText">Science Stream</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Physics, Chemistry, Biology, Mathematics</p>
                  </motion.div>
                </div>
              </motion.div>

            </div>

            {/* Right Form with Framer Motion entry and elevated glass styling */}
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
                    Board Completion Assistance
                  </span>
                  <h3 className="font-heading font-black text-2xl text-brand-darkText">
                    Enquire for SSLC / PUC Admission
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Connect with an advisor for registration dates, board eligibility, fee schedules, and syllabus details.
                  </p>
                </div>
                <AdmissionEnquiryForm 
                  defaultProgram="SSLC / 10th Secondary Fast-Track" 
                  sourcePage="/sslc-puc" 
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
