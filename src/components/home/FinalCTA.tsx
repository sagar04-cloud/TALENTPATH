import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_CONFIG } from '../../config/company';
import { trackWhatsAppClick, trackCallClick } from '../../lib/analytics';

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-brand-bgLight text-brand-darkText relative overflow-hidden border-t border-slate-100">
      {/* Ambient background glow orb */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full bg-brand-blue/15 blur-3xl pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7"
      >
        
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-brand-blue shadow-soft-sm">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping"></span>
          <span>Admissions & Counseling Open for Current Academic Cycles</span>
        </div>

        <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight leading-tight">
          Ready to Take Your Next Step with Confidence?
        </h2>

        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
          Connect with Talent Path Solutions today. Our counselors and recruitment advisors are ready to walk you through programs, eligibility, and career milestones.
        </p>

        {/* Action Pill CTAs with motion tap and hover */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/contact?tab=admission"
              className="pill-shimmer inline-flex items-center justify-center px-8 py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider bg-brand-blue hover:bg-brand-blueHover text-white shadow-pill hover:shadow-pill-hover transition-all"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent('Hello Talent Path Solutions! I would like to speak with a counselor regarding my next educational step.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('final_cta')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-soft-sm hover:shadow-soft transition-all"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-emerald-600 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <a
              href={`tel:${COMPANY_CONFIG.phone.raw}`}
              onClick={() => trackCallClick('final_cta')}
              className="inline-flex items-center justify-center px-6 py-4 rounded-full font-heading font-semibold text-xs text-slate-600 hover:text-brand-blue transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-blue" />
              <span>{COMPANY_CONFIG.phone.display}</span>
            </a>
          </motion.div>
        </div>

        <p className="text-xs text-slate-400 pt-3">
          Unbiased Guidance • Verified Program Details • No High-Pressure Tactics
        </p>

      </motion.div>
    </section>
  );
};
