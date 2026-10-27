import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../common/SpotlightCard';

export const ServicesGrid = () => {
  const programs = [
    {
      id: "degree-prep",
      title: "Flexible Degree Programs",
      subtitle: "BBA, BCA, B.Com, MBA & MCA",
      description: "Advanced preparation and accredited degree pathways designed with flexible learning schedules and continuous mentor guidance.",
      icon: GraduationCap,
      link: "/courses",
      enquiryTab: "admission"
    },
    {
      id: "sslc-puc",
      title: "SSLC & PUC Education",
      subtitle: "10th & 12th Board Completion",
      description: "Premium secondary education guidance with personalized support systems, flexible exam cycles, and recognized open schooling.",
      icon: BookOpen,
      link: "/sslc-puc",
      enquiryTab: "admission"
    },
    {
      id: "career-guidance",
      title: "Career & Guidance Pathways",
      subtitle: "1-on-1 Academic Roadmaps",
      description: "Future-ready advisory programs designed for students and working professionals aiming for competitive careers and corporate recruitment.",
      icon: Award,
      link: "/career-guidance",
      enquiryTab: "career"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-bgLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header matching reference */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
            Popular Programs.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
            Structured modern sections with balanced spacing, smooth visuals, and clean desktop-first layouts.
          </p>
        </motion.div>

        {/* 3 Elevated Cards matching reference image with Framer Motion hover & view */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <SpotlightCard className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-soft-xl flex flex-col justify-between text-left group h-full">
                  <div className="space-y-4">
                    {/* Purple/Indigo Squircle Icon Container matching reference with hover micro-rotation */}
                    <div className="w-12 h-12 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center shadow-soft-sm group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-black text-xl text-brand-darkText group-hover:text-brand-blue transition-colors">
                      {p.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {p.description}
                    </p>
                  </div>

                  {/* Bottom link */}
                  <div className="pt-6 mt-6 border-t border-slate-100/80 flex items-center justify-between">
                    <Link
                      to={p.link}
                      className="text-xs font-bold text-brand-darkText group-hover:text-brand-blue inline-flex items-center transition-colors"
                    >
                      <span>View program details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to={`/contact?tab=${p.enquiryTab}`}
                      className="text-[11px] font-bold text-brand-blue hover:underline"
                    >
                      Enquire
                    </Link>
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
