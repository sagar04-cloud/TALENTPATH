import { NewsArticle } from '../types';
import { INITIAL_NEWS } from '../data/initialData';

const STORAGE_KEY = 'tps_news_v1';

const getStoredNews = (): NewsArticle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWS));
      return INITIAL_NEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NEWS;
  }
};

const setStoredNews = (articles: NewsArticle[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (err) {
    console.error('Failed to save news to localStorage', err);
  }
};

export const newsService = {
  async getNewsArticles(): Promise<NewsArticle[]> {
    return getStoredNews();
  },

  async getPublishedArticles(): Promise<NewsArticle[]> {
    const all = await this.getNewsArticles();
    return all.filter(a => a.is_published);
  },

  async getArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const all = await this.getNewsArticles();
    return all.find(a => a.slug === slug) || null;
  },

  async saveArticle(article: Omit<NewsArticle, 'id' | 'created_at'> & { id?: string }): Promise<NewsArticle> {
    const isNew = !article.id;
    const articleId = article.id || `news-${Date.now()}`;
    const fullArticle: NewsArticle = {
      ...article,
      id: articleId,
      created_at: isNew ? new Date().toISOString() : (article as any).created_at || new Date().toISOString(),
      published_at: article.published_at || new Date().toISOString(),
    };

    const current = getStoredNews();
    if (isNew) {
      setStoredNews([fullArticle, ...current]);
    } else {
      const idx = current.findIndex(a => a.id === articleId);
      if (idx !== -1) {
        current[idx] = fullArticle;
        setStoredNews(current);
      }
    }

    return fullArticle;
  },

  async togglePublish(id: string): Promise<boolean> {
    const current = getStoredNews();
    const idx = current.findIndex(a => a.id === id);
    if (idx === -1) return false;

    current[idx].is_published = !current[idx].is_published;
    setStoredNews(current);
    return true;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const current = getStoredNews();
    const filtered = current.filter(a => a.id !== id);
    setStoredNews(filtered);
    return true;
  }
};
