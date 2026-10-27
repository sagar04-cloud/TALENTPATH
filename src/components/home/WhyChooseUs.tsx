import { 
  CheckCircle, 
  BookMarked, 
  Clock, 
  Users2, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../common/SpotlightCard';

export const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Accessible & Unbiased Guidance",
      desc: "We focus on understanding your real-world background, financial framework, and academic pace before suggesting courses or universities.",
      icon: HelpCircle
    },
    {
      title: "Multiple Legitimate Pathways",
      desc: "Whether you need secondary school completion (SSLC / PUC), a recognized bachelor's degree, or postgraduate specialization, we provide clear routes.",
      icon: BookMarked
    },
    {
      title: "Flexible Learning For Working Adults",
      desc: "Distance and online programs allow working professionals to earn certified qualifications without having to put their careers or family obligations on pause.",
      icon: Clock
    },
    {
      title: "Comprehensive Student Support",
      desc: "From initial application guidance and university registration to syllabus explanations and exam date notifications, you are supported throughout.",
      icon: CheckCircle
    },
    {
      title: "Corporate Recruitment Support",
      desc: "We assist hiring organizations with pre-screened candidate pipelines, bridging the gap between education completion and workforce readiness.",
      icon: Users2
    },
    {
      title: "Transparent & Verified Information",
      desc: "We only provide verified fee schedules and university recognition details. No fabricated promises, no hidden surprises.",
      icon: ShieldAlert
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-bgLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
            Our Foundation
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
            Why Choose Us.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
            Built on integrity, realistic guidance, and authentic pathways tailored to students, lifelong learners, and hiring partners.
          </p>
        </motion.div>

        {/* 6 Grid items with Framer Motion hover & scroll stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <SpotlightCard className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-soft-xl text-left flex flex-col justify-between group h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center mb-6 shadow-soft-sm group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-heading font-black text-xl text-brand-darkText mb-2.5 group-hover:text-brand-blue transition-colors">
                      {b.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {b.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-darkText">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    <span>Verified Transparency</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
