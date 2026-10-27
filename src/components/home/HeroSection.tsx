import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_CONFIG } from '../../config/company';
import { trackWhatsAppClick } from '../../lib/analytics';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-brand-bgLight pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background ambient photographic backdrop with smooth white overlay wash */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80"
          alt="Students studying and collaborating"
          className="w-full h-full object-cover object-center opacity-30 lg:opacity-40"
        />
        {/* Soft gradient wash ensuring maximum text readability like the reference */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bgLight via-transparent to-white/60"></div>
        
        {/* Ambient floating glows with gentle breathing animation */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-brand-blue/15 blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-purple-400/15 blur-3xl pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Block with smooth staggered animation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Pill Badge matching "Future Focused Learning" in reference */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft-sm cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping"></span>
              <span className="font-heading font-bold text-xs text-brand-blue tracking-wide">
                Future-Focused Guidance
              </span>
            </motion.div>

            {/* Headline matching "Learn Smarter. Grow Faster." layout */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-brand-darkText tracking-tight leading-[1.08]">
              Learn <br />
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-brand-blue inline-block"
              >
                Smarter.
              </motion.span> <br />
              Grow Faster.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              A modern educational and career guidance platform with accredited flexible degree options, clean pathways, and a fresh student-focused experience.
            </p>

            {/* Pill CTAs matching the reference design */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/courses"
                  className="pill-shimmer inline-flex items-center justify-center px-8 py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-white bg-brand-blue hover:bg-brand-blueHover shadow-pill hover:shadow-pill-hover transition-all"
                >
                  <span>Start Learning</span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact?tab=career"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-slate-700 bg-white/95 hover:bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft transition-all"
                >
                  <span>Explore Courses</span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent('Hello Talent Path Solutions! I would like to explore programs and guidance options.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('hero_button')}
                  className="inline-flex items-center justify-center px-4 py-3 text-emerald-600 hover:text-emerald-700 font-semibold text-xs transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 inline fill-current animate-bounce" />
                  <span className="underline underline-offset-4">Chat on WhatsApp</span>
                </a>
              </motion.div>
            </div>

          </motion.div>

          {/* Right Visual Image Card with Floating Stats Pill matching the reference */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Elevated Portrait Image Card */}
              <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-xl border border-white/80 bg-white p-3 hover:shadow-2xl transition-shadow duration-500 group">
                {/* Floating Top Badge with smooth breathing levitation */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-100 shadow-soft-lg flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="text-xs font-bold text-brand-darkText">100% Verified Pathways</span>
                </motion.div>

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[420px] sm:h-[460px]">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                    alt="Students laughing and studying in library"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                </div>

                {/* Floating Stat Card with Framer Motion floating levitation & Animated Counters */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 border border-slate-100 shadow-soft-xl"
                >
                  <div className="grid grid-cols-2 divide-x divide-slate-100 text-center">
                    
                    <div className="pr-4">
                      <p className="font-heading font-black text-2xl sm:text-3xl text-brand-darkText">
                        <AnimatedCounter to={10} suffix="K+" duration={1.8} />
                      </p>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        Students Guided
                      </p>
                    </div>

                    <div className="pl-4">
                      <p className="font-heading font-black text-2xl sm:text-3xl text-brand-darkText">
                        <AnimatedCounter to={96} suffix="%" duration={1.8} />
                      </p>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        Advisory Satisfaction
                      </p>
                    </div>

                  </div>
                </motion.div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

