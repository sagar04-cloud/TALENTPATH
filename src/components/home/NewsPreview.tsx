import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { newsService } from '../../services/newsService';
import { NewsArticle } from '../../types';

export const NewsPreview = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const list = await newsService.getPublishedArticles();
        setArticles(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4"
        >
          <div className="text-left space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Knowledge Hub
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-brand-darkText tracking-tight">
              News & Insights.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
              Stay informed about higher education policies, distance learning developments, open schooling updates, and modern hiring trends.
            </p>
          </div>

          <Link
            to="/news"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-blue hover:text-brand-blueHover transition-colors self-start sm:self-end group"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading insights...
          </div>
        )}

        {/* Empty state */}
        {!loading && articles.length === 0 && (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 text-sm font-medium">
              No articles published yet. Check back soon for education analysis and career guides.
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {articles.slice(0, 3).map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-soft-xl transition-all duration-300 flex flex-col group"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-brand-darkText uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1" />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-xl text-brand-darkText group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                      <Link to={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 font-normal">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <Link
                      to={`/news/${article.slug}`}
                      className="text-xs font-bold text-brand-blue hover:text-brand-blueHover inline-flex items-center group/link"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
