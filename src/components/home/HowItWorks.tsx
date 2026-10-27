import { Search, Send, PhoneCall, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../common/SpotlightCard';

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Explore Opportunities",
      desc: "Browse our degree catalog, open school pathways, or personalized guidance to discover options aligned with your goals.",
      icon: Search,
    },
    {
      number: "02",
      title: "Submit Your Enquiry",
      desc: "Fill out a straightforward enquiry form or start a quick WhatsApp conversation with your specific background and query.",
      icon: Send,
    },
    {
      number: "03",
      title: "Connect With Advisor",
      desc: "A dedicated academic counselor reviews your background and contacts you for an in-depth personalized advisory discussion.",
      icon: PhoneCall,
    },
    {
      number: "04",
      title: "Begin Your Program",
      desc: "Receive clear, verified guidance on syllabus options, examination schedules, and complete university admission paperwork.",
      icon: Compass,
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
            The Process
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
            How It Works.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
            A clear, dependable, four-step journey designed to provide total transparency from your initial inquiry to final admission.
          </p>
        </motion.div>

        {/* 4 Clean Cards with Framer Motion stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <SpotlightCard className="bg-white rounded-3xl p-7 border border-slate-100 shadow-soft hover:shadow-soft-xl flex flex-col justify-between text-left group h-full">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center shadow-soft-sm group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-heading font-black text-2xl text-slate-300 group-hover:text-brand-blue transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-lg text-brand-darkText mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-brand-blue">
                    <span>Step {step.number} of 04</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom actionable pill prompt */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <Link
            to="/contact?tab=admission"
            className="pill-shimmer inline-flex items-center justify-center px-8 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider bg-brand-blue hover:bg-brand-blueHover text-white shadow-pill hover:shadow-pill-hover transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>Begin Step 1: Submit Your Enquiry</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
