import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Calendar, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_CONFIG } from '../../config/company';
import { SpotlightCard } from '../common/SpotlightCard';

export const CareerGuidanceCTA = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-20 lg:pt-28 lg:pb-32 border-t border-slate-100">
      
      {/* Background photographic student with headphones & laptop from reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-xl border border-slate-100 bg-slate-900 min-h-[500px] flex items-center group"
        >
          
          {/* Background image: Student with headphones studying at desk */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
              alt="Focused student studying with headphones and laptop"
              className="w-full h-full object-cover object-left group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* White/lavender wash on right side so text stands out identically to reference */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-white/80 to-white/95"></div>
          </div>

          {/* Right Floating Content matching the reference */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 p-8 sm:p-14">
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 lg:col-start-7 text-left space-y-5"
            >
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-soft-sm">
                <span className="font-heading font-bold text-xs text-brand-blue tracking-wide">
                  Premium Learning Experience
                </span>
              </div>

              {/* Headline matching "Education That Feels Inspiring." */}
              <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight leading-tight">
                Education That <br />
                <span className="text-brand-blue">Feels</span> Inspiring.
              </h2>

              {/* Supporting Copy */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Clean white and soft purple aesthetics combined with modern layouts, strong typography, and smooth premium guidance.
              </p>

              {/* Button with pill-shimmer and hover scale */}
              <div className="pt-2">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} className="inline-block">
                  <Link
                    to="/contact?tab=admission"
                    className="pill-shimmer inline-flex items-center justify-center px-8 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-white bg-brand-blue hover:bg-brand-blueHover shadow-pill hover:shadow-pill-hover transition-all"
                  >
                    <span>Join Talent Path</span>
                  </Link>
                </motion.div>
              </div>

            </motion.div>
          </div>

        </motion.div>

        {/* Two Floating Info Cards at the bottom with SpotlightCard cursor glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
          
          {/* Card 1: Visit Office / Campus */}
          <SpotlightCard className="bg-white rounded-3xl p-7 border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-2 transition-all duration-300 flex items-start space-x-5 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-2 text-xs text-slate-600 flex-1">
              <h3 className="font-heading font-black text-lg text-brand-darkText">
                Visit Office
              </h3>
              <p className="flex items-start text-slate-600">
                <span className="leading-snug">{COMPANY_CONFIG.address.fullFormatted}</span>
              </p>
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-slate-500">
                <a href={`tel:${COMPANY_CONFIG.phone.raw}`} className="hover:text-brand-blue font-semibold flex items-center transition-colors">
                  <Phone className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                  {COMPANY_CONFIG.phone.display}
                </a>
                <span className="hidden sm:inline text-slate-300">•</span>
                <a href={`mailto:${COMPANY_CONFIG.email.admissions}`} className="hover:text-brand-blue flex items-center transition-colors">
                  <Mail className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                  {COMPANY_CONFIG.email.admissions}
                </a>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Advisory Timings */}
          <SpotlightCard className="bg-white rounded-3xl p-7 border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-2 transition-all duration-300 flex items-start space-x-5 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-2 text-xs text-slate-600 flex-1">
              <h3 className="font-heading font-black text-lg text-brand-darkText">
                Advisory Timings
              </h3>
              <div className="space-y-1.5 text-slate-600">
                <p className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Monday – Friday</span>
                  <span>9:30 AM – 6:30 PM</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Saturday</span>
                  <span>9:30 AM – 4:00 PM</span>
                </p>
                <p className="flex items-center justify-between text-brand-blue font-medium">
                  <span>Sunday</span>
                  <span>Online WhatsApp Support</span>
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>

      </div>
    </section>
  );
};
