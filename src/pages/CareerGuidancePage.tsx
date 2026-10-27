import { SEOHead } from '../components/common/SEOHead';
import { CareerGuidanceForm } from '../components/forms/CareerGuidanceForm';
import { 
  Compass, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  HelpCircle, 
  Phone,
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_CONFIG } from '../config/company';
import { trackWhatsAppClick, trackCallClick } from '../lib/analytics';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';

export const CareerGuidancePage = () => {
  const counselingPillars = [
    {
      title: "Stream & Course Direction",
      desc: "For students completing 10th or 12th who need objective insights on Science, Commerce, Arts, or Technical Diplomas before committing.",
      icon: Target,
      badge: "School Passouts"
    },
    {
      title: "Working Professional Transition",
      desc: "For full-time employees seeking higher degrees (MBA, MCA, M.Com) to qualify for leadership roles and salary band elevations.",
      icon: Lightbulb,
      badge: "Career Growth"
    },
    {
      title: "Second Chance & Restart Guidance",
      desc: "Compassionate, practical counseling for learners who discontinued education and wish to resume their academic milestones.",
      icon: Compass,
      badge: "Fresh Restart"
    },
    {
      title: "Industry Alignment & Skills",
      desc: "Bridging theoretical degree requirements with corporate hiring trends so you invest time and resources in viable skills.",
      icon: Users,
      badge: "Job Readiness"
    }
  ];

  return (
    <>
      <SEOHead
        title="Career Guidance & Counseling Services | Talent Path Solutions"
        description="Receive 1-on-1 personalized career counseling, course selection roadmaps, and educational mentoring at Talent Path Solutions."
      />

      {/* Header with animated glowing background orbs */}
      <section className="bg-brand-navy text-white py-16 sm:py-24 relative overflow-hidden">
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
          <div className="max-w-3xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Personalized Advisory</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
            >
              Career Guidance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Educational Counseling.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-light"
            >
              Make confident decisions about your academic journey. Our counselors provide personalized, unbiased guidance tailored to your strengths, goals, and lifestyle.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Trust Infinite Marquee Banner */}
      <InfiniteMarquee className="border-t-0 shadow-sm" />

      {/* Main Section with Counseling Overview & Form */}
      <section className="py-20 bg-brand-bgLight relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-brand-blue/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
                  How We Guide You
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
                  Clarity Over Confusion
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Choosing an academic path can be overwhelming with hundreds of colleges and conflicting advice. At Talent Path Solutions, we don't push pre-packaged solutions. We evaluate your unique profile, budget, and time availability to build a viable educational roadmap.
                </p>
              </motion.div>

              {/* 4 Pillars with SpotlightCard Cursor Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {counselingPillars.map((p, idx) => {
                  const Icon = p.icon;
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
                              {p.badge}
                            </span>
                          </div>
                          <h4 className="font-heading font-black text-base text-brand-darkText group-hover:text-brand-blue transition-colors">
                            {p.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            {p.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-blue">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2"></span>
                          <span>Tailored Roadmap</span>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>

              {/* Verified Counseling Philosophy */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-7 rounded-3xl border border-slate-100 shadow-soft hover:shadow-soft-xl space-y-4"
              >
                <h4 className="font-heading font-black text-lg text-brand-darkText flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2.5 flex-shrink-0" />
                  <span>What You Can Expect During Your Session</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2.5 mt-2 flex-shrink-0"></span>
                    <span>A dedicated 30-minute one-on-one session with a qualified counselor.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2.5 mt-2 flex-shrink-0"></span>
                    <span>Honest review of eligibility criteria, university accreditations, and exam formats.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2.5 mt-2 flex-shrink-0"></span>
                    <span>Realistic cost breakdowns without hidden agency markups.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Quick WhatsApp or Call Prompt */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="p-5 rounded-3xl bg-brand-navy text-white flex items-center justify-between shadow-soft-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-blue/20 blur-xl pointer-events-none"></div>

                <div className="relative z-10">
                  <p className="text-xs font-bold text-white">Need an immediate answer?</p>
                  <p className="text-[11px] text-blue-200">Our advisory desk is reachable directly</p>
                </div>
                <div className="flex items-center space-x-2 relative z-10">
                  <a
                    href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent('Hello, I would like to schedule a career guidance session.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('career_page_callout')}
                    className="p-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-soft-sm transition-transform hover:scale-110"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>
                  <a
                    href={`tel:${COMPANY_CONFIG.phone.raw}`}
                    onClick={() => trackCallClick('career_page_callout')}
                    className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-transform hover:scale-110"
                    title="Call Office"
                  >
                    <Phone className="w-4 h-4" />
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
                    1-on-1 Consultation
                  </span>
                  <h3 className="font-heading font-black text-2xl text-brand-darkText">
                    Request a Career Guidance Session
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Fill in your details below and an advisor will arrange your confidential consultation within 24 hours.
                  </p>
                </div>
                <CareerGuidanceForm sourcePage="/career-guidance" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
