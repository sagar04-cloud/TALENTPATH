import { SEOHead } from '../components/common/SEOHead';
import { AdmissionEnquiryForm } from '../components/forms/AdmissionEnquiryForm';
import { 
  Clock, 
  CheckCircle, 
  Briefcase, 
  Award, 
  BookOpen, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';

export const FlexibleLearningPage = () => {
  const highlights = [
    {
      title: "Earn While You Learn",
      desc: "Designed specifically so you never have to choose between keeping your full-time job and advancing your academic qualifications.",
      icon: Briefcase,
      badge: "Career First"
    },
    {
      title: "Recognized Accreditations",
      desc: "Guidance exclusively for universities approved by UGC-DEB and relevant statutory bodies, ensuring your degree is valid for government and private employment.",
      icon: Award,
      badge: "UGC-DEB Approved"
    },
    {
      title: "Self-Paced Study Schedules",
      desc: "Digital learning materials, structured recorded lectures, and flexible weekend support sessions tailored for busy adult routines.",
      icon: Clock,
      badge: "Flexible"
    },
    {
      title: "Continuous Counseling Support",
      desc: "We assist with enrollment verification, assignment submissions, exam cycle registrations, and result collation.",
      icon: ShieldCheck,
      badge: "Dedicated Mentor"
    }
  ];

  return (
    <>
      <SEOHead
        title="Distance & Flexible Learning | UGC-Approved Degree Programs"
        description="Earn accredited undergraduate and postgraduate degrees with flexible scheduling for working professionals at Talent Path Solutions."
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
              <span>Work & Learn Pathways</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
            >
              Distance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Flexible Learning.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-light"
            >
              Upgrade your qualifications with accredited university degrees without pausing your career. Flexible schedules, self-paced learning, and end-to-end academic support.
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
                  Why Flexible Learning?
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
                  Higher Education Adapted to Your Lifestyle
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Career promotions, managerial roles, and public service exams increasingly require recognized bachelor's or master's degrees. Distance and flexible learning bridge this gap by offering rigorous academic curricula with scheduling adaptability.
                </p>
              </motion.div>

              {/* 4 Feature Cards with SpotlightCard Cursor Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((h, idx) => {
                  const Icon = h.icon;
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
                              {h.badge}
                            </span>
                          </div>
                          <h4 className="font-heading font-black text-base text-brand-darkText group-hover:text-brand-blue transition-colors">
                            {h.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            {h.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-blue">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                          <span>UGC-DEB Equivalence</span>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* Programs Quick List */}
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
                      Popular Flexible Degrees Supported
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Accredited bachelor's and master's degree programs with flexible exam formats
                    </p>
                  </div>
                  <BookOpen className="w-5 h-5 text-brand-blue flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <div>
                      <p className="font-heading font-bold text-sm text-brand-darkText">BBA</p>
                      <p className="text-[11px] text-slate-500">Business Administration</p>
                    </div>
                    <span className="text-[10px] bg-brand-blueLight text-brand-blue px-2.5 py-1 rounded-full font-bold">3 Yrs</span>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <div>
                      <p className="font-heading font-bold text-sm text-brand-darkText">BCA</p>
                      <p className="text-[11px] text-slate-500">Computer Applications</p>
                    </div>
                    <span className="text-[10px] bg-brand-blueLight text-brand-blue px-2.5 py-1 rounded-full font-bold">3 Yrs</span>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <div>
                      <p className="font-heading font-bold text-sm text-brand-darkText">MBA</p>
                      <p className="text-[11px] text-slate-500">Master of Business</p>
                    </div>
                    <span className="text-[10px] bg-brand-blueLight text-brand-blue px-2.5 py-1 rounded-full font-bold">2 Yrs</span>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-brand-blueLight/30 hover:border-brand-blue/20 transition-all">
                    <div>
                      <p className="font-heading font-bold text-sm text-brand-darkText">MCA</p>
                      <p className="text-[11px] text-slate-500">Master of Comp. Apps</p>
                    </div>
                    <span className="text-[10px] bg-brand-blueLight text-brand-blue px-2.5 py-1 rounded-full font-bold">2 Yrs</span>
                  </motion.div>
                </div>

                <div className="pt-2 text-right">
                  <Link to="/courses" className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center group">
                    <span>View full course catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
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
                    Direct Degree Enquiry
                  </span>
                  <h3 className="font-heading font-black text-2xl text-brand-darkText">
                    Enquire for Flexible Degrees
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Receive verified university curriculum schedules, eligibility requirements, and transparent fee breakdowns.
                  </p>
                </div>
                <AdmissionEnquiryForm 
                  defaultProgram="Flexible Degree Program" 
                  sourcePage="/flexible-learning" 
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
