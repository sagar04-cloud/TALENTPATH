import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { programService } from '../../services/programService';
import { Program } from '../../types';
import { trackProgramView } from '../../lib/analytics';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../common/SpotlightCard';

export const FeaturedPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const list = await programService.getPublishedPrograms();
        setPrograms(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const categories = [
    { key: 'all', label: 'All Programs' },
    { key: 'undergraduate', label: 'Undergraduate' },
    { key: 'postgraduate', label: 'Postgraduate' },
    { key: 'sslc_puc', label: 'SSLC & PUC' }
  ];

  const filtered = activeCategory === 'all'
    ? programs
    : programs.filter(p => p.category === activeCategory);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Category Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="text-left space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Academic Catalog
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
              Featured Pathways.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
              Explore degree and school completion programs with flexible study architectures, verified eligibility, and comprehensive counseling.
            </p>
          </div>

          {/* Rounded Pill Filter Tabs with fluid spring sliding pill */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-full border border-slate-200/60 relative">
            {categories.map((c) => {
              const isActive = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`relative px-5 py-2.5 rounded-full text-xs font-bold transition-colors z-10 ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-brand-blue'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-brand-blue rounded-full shadow-pill -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-slate-400 text-sm">
            Loading programs...
          </div>
        )}

        {/* Programs Grid with SpotlightCard & optical blur-in */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {filtered.slice(0, 6).map((prog, idx) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <SpotlightCard className="bg-white rounded-3xl p-7 border border-slate-100 shadow-soft hover:shadow-soft-xl transition-all duration-300 flex flex-col justify-between group h-full">
                  <div className="space-y-4">
                    {/* Category Pill & Duration */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blueLight text-brand-blue">
                        {prog.category.replace('_', ' ')}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {prog.duration}
                      </span>
                    </div>

                    {/* Program Title */}
                    <h3 className="font-heading font-black text-xl text-brand-darkText group-hover:text-brand-blue transition-colors leading-snug">
                      {prog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                      {prog.short_description}
                    </p>

                    {/* Metadata Specs */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-start">
                        <GraduationCap className="w-4 h-4 text-brand-blue mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-brand-darkText">Eligibility:</strong> {prog.eligibility}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-brand-darkText">Mode:</strong> {prog.learning_mode}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <ShieldCheck className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-brand-darkText">Fee:</strong> {prog.fees}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Pill Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      to={`/contact?program=${encodeURIComponent(prog.title)}`}
                      onClick={() => trackProgramView(prog.slug, prog.title)}
                      className="pill-shimmer w-full inline-flex items-center justify-center py-3 px-4 rounded-full font-heading font-bold text-xs uppercase tracking-wider bg-slate-900 group-hover:bg-brand-blue text-white shadow-soft transition-colors"
                    >
                      <span>Enquire for Course</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Programs Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-soft-sm hover:shadow-soft transition-all hover:-translate-y-1"
          >
            <span>View Full Program Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
