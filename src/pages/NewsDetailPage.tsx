import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Check, 
  MessageCircle, 
  GraduationCap 
} from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsArticle } from '../types';
import { COMPANY_CONFIG } from '../config/company';
import { trackWhatsAppClick } from '../lib/analytics';

export const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!slug) return;
      try {
        const item = await newsService.getArticleBySlug(slug);
        setArticle(item);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-500 text-sm">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-32 text-center max-w-md mx-auto px-4 space-y-4">
        <h2 className="font-heading font-bold text-2xl text-brand-navy">Article Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested article could not be found or may have been unpublished.
        </p>
        <Link
          to="/news"
          className="inline-flex items-center text-xs font-bold text-brand-blue hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to News & Insights
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={article.seo_title || article.title}
        description={article.seo_description || article.excerpt}
      />

      {/* Article Top Breadcrumb & Hero */}
      <section className="bg-brand-navy text-white pt-12 pb-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          
          <Link
            to="/news"
            className="inline-flex items-center text-xs font-semibold text-blue-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to All Articles
          </Link>

          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blue/30 text-blue-200 border border-brand-blue/40">
              {article.category}
            </span>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-brand-blue" />
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5 text-brand-blue" />
                {article.author}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center text-slate-300 hover:text-white transition-colors ml-auto"
                title="Share this article"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-1" />
                    <span>Share Article</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
          
          {/* Featured Image */}
          {article.cover_image && (
            <div className="rounded-3xl overflow-hidden border border-brand-borderLight shadow-soft-xl max-h-[480px]">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lead Excerpt */}
          <p className="text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-brand-blue pl-4 italic">
            {article.excerpt}
          </p>

          {/* Body content with paragraphs */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-5 text-sm sm:text-base">
            {article.body.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Consultation Callout Box */}
          <div className="mt-12 p-8 rounded-3xl bg-brand-bgLight border border-brand-borderLight flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-lg text-brand-navy">
                Have questions regarding this topic?
              </h4>
              <p className="text-xs text-slate-600">
                Reach out to our educational advisors to discuss your curriculum and enrollment queries.
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link
                to="/contact?tab=admission"
                className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                Enquire Now
              </Link>
              <a
                href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent(`Hello, I read your article "${article.title}" and would like to learn more.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('news_detail_cta')}
                className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-sm"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </article>
    </>
  );
};
