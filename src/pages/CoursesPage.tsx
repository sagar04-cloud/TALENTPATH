import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { 
  Search, 
  Clock, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare,
  X,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { programService } from '../services/programService';
import { Program } from '../types';
import { trackProgramView } from '../lib/analytics';
import { SpotlightCard } from '../components/common/SpotlightCard';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';

export const CoursesPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProgram, setActiveModalProgram] = useState<Program | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await programService.getPublishedPrograms();
        setPrograms(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = [
    { key: 'all', label: 'All Offerings' },
    { key: 'undergraduate', label: 'Undergraduate (UG)' },
    { key: 'postgraduate', label: 'Postgraduate (PG)' },
    { key: 'sslc_puc', label: 'SSLC & PUC Pathways' }
  ];

  const filtered = programs.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const openProgramModal = (prog: Program) => {
    setActiveModalProgram(prog);
    trackProgramView(prog.slug, prog.title);
  };

  return (
    <>
      <SEOHead
        title="Courses & Programs | Undergraduate, Postgraduate, Flexible Degrees"
        description="Browse accredited degree courses, undergraduate and master's programs, SSLC & PUC completion, and flexible distance education at Talent Path Solutions."
      />

      {/* Page Header with Ambient Floating Glow */}
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
          <div className="max-w-3xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Academic Offerings</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight"
            >
              Courses & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Degree Programs.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed font-light"
            >
              Explore accredited university degree pathways, executive postgraduate courses, and secondary school completion designed with genuine flexibility for working learners and students.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Trust Infinite Marquee Banner */}
      <InfiniteMarquee className="border-t-0 shadow-sm" />

      {/* Filter and Search Bar with Sticky Backdrop */}
      <section className="py-6 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-16 z-30 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-blue transition-colors" />
              <input
                type="text"
                placeholder="Search programs (BBA, MCA, etc.)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 bg-slate-50/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills with fluid spring sliding pill */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto p-1.5 bg-slate-100/80 rounded-full border border-slate-200/60 relative">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:inline mr-2 ml-2 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Filter:
              </span>
              {categories.map((c) => {
                const isActive = selectedCategory === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:text-brand-blue'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="coursesFilterPill"
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
        </div>
      </section>

      {/* Program Catalog Grid with Framer Motion Stagger */}
      <section className="py-16 lg:py-24 bg-brand-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading && (
            <div className="py-20 text-center text-slate-500 text-sm flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
              <span>Loading available programs...</span>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft max-w-md mx-auto space-y-3"
            >
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-heading font-black text-lg text-brand-darkText">No matching programs found</h3>
              <p className="text-xs text-slate-500">
                Try adjusting your search query or view all program categories.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-2 text-xs font-bold text-brand-blue hover:underline"
              >
                Reset filters
              </button>
            </motion.div>
          )}

          {!loading && filtered.length > 0 && (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
            >
              <AnimatePresence>
                {filtered.map((prog, idx) => (
                  <motion.div
                    key={prog.id}
                    layout
                    initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <SpotlightCard className="bg-white rounded-3xl p-7 border border-slate-100 shadow-soft hover:shadow-soft-xl flex flex-col justify-between group transition-all h-full">
                      <div className="space-y-4">
                        {/* Category & Duration */}
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blueLight text-brand-blue border border-brand-blue/20">
                            {prog.category.replace('_', ' ')}
                          </span>
                          <span className="flex items-center text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {prog.duration}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading font-black text-xl text-brand-darkText group-hover:text-brand-blue transition-colors leading-snug">
                          {prog.title}
                        </h3>

                        {/* Short Description */}
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {prog.short_description}
                        </p>

                        {/* Specs List */}
                        <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                          <div className="flex items-start">
                            <GraduationCap className="w-4 h-4 text-brand-blue mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-brand-darkText">Eligibility:</strong> {prog.eligibility}
                            </span>
                          </div>

                          <div className="flex items-start">
                            <Calendar className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-brand-darkText">Study Mode:</strong> {prog.learning_mode}
                            </span>
                          </div>

                          <div className="flex items-start">
                            <ShieldCheck className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-brand-darkText">Fee Info:</strong> {prog.fees}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card CTAs */}
                      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                        <button
                          onClick={() => openProgramModal(prog)}
                          className="flex-1 py-2.5 px-3 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:text-brand-darkText hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          View Details
                        </button>
                        <Link
                          to={`/contact?program=${encodeURIComponent(prog.title)}`}
                          className="flex-1 py-2.5 px-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold uppercase tracking-wider text-center shadow-pill hover:shadow-pill-hover transition-all flex items-center justify-center transform hover:-translate-y-0.5"
                        >
                          <span>Enquire</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </section>

      {/* Program Detail Modal with AnimatePresence */}
      <AnimatePresence>
        {activeModalProgram && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalProgram(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-left space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModalProgram(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blueLight text-brand-blue border border-brand-blue/20">
                  {activeModalProgram.category.replace('_', ' ')}
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-brand-darkText mt-2">
                  {activeModalProgram.title}
                </h2>
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-5">
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-blue mb-1">
                    Program Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeModalProgram.full_description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-brand-darkText block">Eligibility:</span>
                    <span className="text-slate-600">{activeModalProgram.eligibility}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-brand-darkText block">Duration:</span>
                    <span className="text-slate-600">{activeModalProgram.duration}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-brand-darkText block">Learning Mode:</span>
                    <span className="text-slate-600">{activeModalProgram.learning_mode}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-brand-darkText block">Fee Structure:</span>
                    <span className="text-slate-600">{activeModalProgram.fees}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveModalProgram(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-slate-600 hover:text-brand-darkText border border-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
                <Link
                  to={`/contact?program=${encodeURIComponent(activeModalProgram.title)}`}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold uppercase tracking-wider text-center shadow-pill hover:shadow-pill-hover transition-all"
                >
                  Apply / Enquire for This Course
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
