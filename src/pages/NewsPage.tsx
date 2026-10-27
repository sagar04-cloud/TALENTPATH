import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Tag 
} from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsArticle } from '../types';

export const NewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const categories = ['all', 'Education Trends', 'Career Guidance', 'Recruitment Insights'];

  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <SEOHead
        title="News & Insights | Educational Analysis & Career Guidance"
        description="Read educational insights, distance degree updates, SSLC & PUC examination advice, and recruitment trends from Talent Path Solutions."
      />

      {/* Header */}
      <section className="bg-brand-navy text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3563F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Insights & Updates
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
              News & Educational Insights
            </h1>
            <p className="text-slate-300 text-base leading-relaxed font-light">
              Expert articles, regulatory updates on distance learning, syllabus guidance, and talent acquisition best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="py-8 bg-white border-b border-brand-borderLight sticky top-16 z-30 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === c
                      ? 'bg-brand-navy text-white shadow-soft'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? 'All Articles' : c}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-brand-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading && (
            <div className="py-20 text-center text-slate-400 text-sm">
              Loading insights...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-brand-borderLight max-w-md mx-auto space-y-3">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-brand-navy">No articles match your criteria</h3>
              <p className="text-xs text-slate-500">
                Try a different search term or check all categories.
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {filtered.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden border border-brand-borderLight shadow-soft hover:shadow-soft-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {new Date(article.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {article.author}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-brand-navy group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                        <Link to={`/news/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <Link
                        to={`/news/${article.slug}`}
                        className="text-xs font-bold text-brand-blue hover:text-brand-blueHover inline-flex items-center"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
};
