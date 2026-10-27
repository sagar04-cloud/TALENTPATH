import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_CONFIG } from '../config/company';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';

export const AboutPage = () => {
  const principles = [
    {
      num: "01",
      title: "Authentic Guidance",
      desc: "We never mislead applicants with fabricated affiliations or unrealistic guarantees. We share verified facts.",
      color: "bg-blue-100 text-brand-blue"
    },
    {
      num: "02",
      title: "Total Accessibility",
      desc: "Education must be attainable for students who paused school, full-time employees, and non-traditional learners.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      num: "03",
      title: "Candidate Centric",
      desc: "We match students with universities that fit their schedules, not arbitrary institutional quotas.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      num: "04",
      title: "Workforce Connection",
      desc: "We maintain active corporate relationships to understand real employer hiring standards and create direct pipelines.",
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <>
      <SEOHead
        title="About Us | Dedicated Education & Career Pathways"
        description="Learn about Talent Path Solutions: our mission, values, student-centered educational guidance, flexible degree options, and professional recruitment services."
      />

      {/* Hero Header with Animated Glowing Orbs */}
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
          <div className="max-w-3xl space-y-5">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Corporate Overview</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
            >
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Talent Path Solutions.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-light"
            >
              Empowering students, working professionals, and institutions through accredited educational pathways, transparent career guidance, and dependable recruitment support.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Infinite Trust Marquee */}
      <InfiniteMarquee className="border-t-0 shadow-sm" />

      {/* Narrative Section with Staggered Entrance */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
                Our Purpose
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
                Bridging Academic Ambition and Real-World Career Success
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Talent Path Solutions was founded with a singular commitment: to make quality education and professional career navigation accessible, transparent, and realistically achievable for every learner.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Too often, students and working adults encounter fragmented information, unrealistic claims, or rigid study formats that force them to compromise between livelihood and education. We provide an integrated ecosystem of academic counseling, recognized flexible degree programs, secondary board support, and corporate talent acquisition.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="p-5 rounded-2xl bg-brand-bgLight border border-slate-100 shadow-soft-sm"
                >
                  <h4 className="font-heading font-bold text-base text-brand-darkText flex items-center">
                    <ShieldCheck className="w-4 h-4 text-brand-blue mr-2" />
                    Student-First
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Every counseling session centers on student reality and goals.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="p-5 rounded-2xl bg-brand-bgLight border border-slate-100 shadow-soft-sm"
                >
                  <h4 className="font-heading font-bold text-base text-brand-darkText flex items-center">
                    <Award className="w-4 h-4 text-emerald-500 mr-2" />
                    Verified Options
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Recognized university boards and transparent fee guidelines.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-slate-100 group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                  alt="Counseling and collaborative education discussion"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="p-6 bg-brand-navy text-white text-left relative z-10">
                  <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
                    Our Operational Promise
                  </p>
                  <p className="text-sm font-medium mt-1 leading-relaxed">
                    "We do not promise shortcuts. We provide legitimate, structured, accredited pathways that withstand verification."
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Cards with Hover Depth */}
      <section className="py-20 bg-brand-bgLight border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              <SpotlightCard className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-soft hover:shadow-soft-xl flex flex-col justify-between group h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-brand-darkText group-hover:text-brand-blue transition-colors">
                    Our Mission
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    To guide individuals through personalized educational choices, eliminate educational disruption through flexible degree and secondary certifications, and supply growing enterprises with verified, competent workforce talent.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2"></span>
                  <span>Driven by Academic Integrity</span>
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              <SpotlightCard className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-soft hover:shadow-soft-xl flex flex-col justify-between group h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-brand-darkText group-hover:text-brand-blue transition-colors">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    To be the regional standard for credible educational advisory and career enablement — recognized for honest counseling, accessible lifelong learning frameworks, and trusted institutional partnerships.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mr-2"></span>
                  <span>Shaping Lifelong Opportunities</span>
                </div>
              </SpotlightCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core Principles with Staggered Hover Cards */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-12 space-y-2"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
              Foundational Values
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
              Guiding Principles of Our Advisory Practice
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((pr, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              >
                <SpotlightCard className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-blue/30 hover:bg-white shadow-soft-sm hover:shadow-soft-xl transition-all space-y-3 group h-full">
                  <div className={`w-10 h-10 rounded-xl ${pr.color} flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform`}>
                    {pr.num}
                  </div>
                  <h4 className="font-heading font-bold text-lg text-brand-darkText group-hover:text-brand-blue transition-colors">
                    {pr.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pr.desc}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Action CTA with motion hover & tap */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-brand-navy text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-blue/15 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                Have questions about our advisory approach?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Speak directly with an education counselor or recruitment coordinator.
              </p>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
              <Link
                to="/contact?tab=admission"
                className="pill-shimmer inline-flex items-center px-7 py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider bg-brand-blue hover:bg-brand-blueHover text-white shadow-pill hover:shadow-pill-hover transition-all"
              >
                <span>Get in Touch With Us</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
