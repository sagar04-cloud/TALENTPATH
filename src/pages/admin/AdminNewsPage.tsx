import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  X, 
  Calendar, 
  User 
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import { NewsArticle } from '../../types';

export const AdminNewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Education Trends');
  const [author, setAuthor] = useState('Academic Advisory Team');
  const [isPublished, setIsPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const loadArticles = async () => {
    try {
      const data = await newsService.getNewsArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setBody('');
    setCoverImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80');
    setCategory('Education Trends');
    setAuthor('Academic Advisory Team');
    setIsPublished(true);
    setSeoTitle('');
    setSeoDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setExcerpt(article.excerpt);
    setBody(article.body);
    setCoverImage(article.cover_image);
    setCategory(article.category);
    setAuthor(article.author);
    setIsPublished(article.is_published);
    setSeoTitle(article.seo_title || '');
    setSeoDescription(article.seo_description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await newsService.saveArticle({
      ...(editingArticle ? { id: editingArticle.id, created_at: editingArticle.created_at } : {}),
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      body: body.trim(),
      cover_image: coverImage.trim(),
      category: category.trim(),
      author: author.trim(),
      is_published: isPublished,
      published_at: editingArticle?.published_at || new Date().toISOString(),
      seo_title: seoTitle.trim(),
      seo_description: seoDescription.trim(),
    });

    setIsModalOpen(false);
    await loadArticles();
  };

  const handleTogglePublish = async (id: string) => {
    await newsService.togglePublish(id);
    await loadArticles();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await newsService.deleteArticle(id);
      await loadArticles();
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">
            News & Insights Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish educational analysis, admission announcements, and career guidance articles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Article List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-heading text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Article</th>
                <th className="p-4">Category & Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">Loading articles...</td>
                </tr>
              )}

              {!loading && articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 max-w-sm">
                    <span className="font-bold text-brand-navy text-sm block truncate">{article.title}</span>
                    <span className="text-[11px] text-slate-400 block truncate font-mono">/{article.slug}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700 block">{article.category}</span>
                    <span className="text-[11px] text-slate-400 block">{article.author}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {new Date(article.published_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(article.id)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        article.is_published
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {article.is_published ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                          Published
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1 text-slate-400" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(article)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-brand-blue hover:bg-slate-100"
                        title="Edit article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Article Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-xl text-brand-navy">
                {editingArticle ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Byline</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Body (separate paragraphs with blank lines) *</label>
                <textarea
                  rows={8}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SEO Title (Optional)</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SEO Description (Optional)</label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-brand-blue"
                  />
                  <span className="font-bold text-slate-700">Published on Live Site</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white font-bold"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
