import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const CompanyIntro = () => {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Big rounded photo matching the reference */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 group"
          >
            <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-xl border border-slate-100 hover:shadow-2xl transition-all duration-500">
              {/* Floating trust badge with gentle animation */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-soft-lg flex items-center space-x-2.5"
              >
                <div className="w-7 h-7 rounded-xl bg-brand-blueLight text-brand-blue flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-darkText">Recognized Standards</p>
                  <p className="text-[10px] text-slate-500">UGC & Board Compliant</p>
                </div>
              </motion.div>

              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating on laptop with notes"
                className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right Column matching the exact typography and stats in the reference */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            
            {/* Eyebrow */}
            <p className="font-heading font-bold text-xs uppercase tracking-wider text-brand-blue">
              Modern Education
            </p>

            {/* Headline */}
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight leading-tight">
              Built For The <br />
              Next Generation.
            </h2>

            {/* Accent underline bar with motion expansion */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-brand-blue rounded-full"
            />

            {/* Narrative copy */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Designed with smooth visual flow, modern spacing, minimal layouts, and premium educational guidance that feels completely different from ordinary coaching websites.
            </p>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We connect students and working professionals with accredited university degrees, secondary certification fast-tracks (SSLC & PUC), and structured academic counseling.
            </p>

            {/* Big bold stats row matching "120+ Expert Mentors" and "35+ Advanced Programs" */}
            <div className="pt-4 flex items-center space-x-12 sm:space-x-16">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="transition-transform cursor-default"
              >
                <p className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
                  <AnimatedCounter to={120} suffix="+" duration={1.8} />
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Expert Mentors
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="transition-transform cursor-default"
              >
                <p className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
                  <AnimatedCounter to={35} suffix="+" duration={1.8} />
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Advanced Programs
                </p>
              </motion.div>
            </div>

            {/* Subtle explore link */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center text-xs font-bold text-brand-blue hover:text-brand-blueHover transition-colors group"
              >
                <span>Discover our full methodology</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
