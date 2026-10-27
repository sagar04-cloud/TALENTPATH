import { useEffect } from 'react';
import { COMPANY_CONFIG } from '../../config/company';
import { trackPageView } from '../../lib/analytics';

interface SEOHeadProps {
  title: string;
  description?: string;
  path?: string;
}

export const SEOHead = ({ title, description, path }: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = `${title} | ${COMPANY_CONFIG.name}`;
    document.title = fullTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    const content = description || COMPANY_CONFIG.shortDescription;
    if (metaDesc) {
      metaDesc.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = content;
      document.head.appendChild(meta);
    }

    const currentPath = path || window.location.pathname;
    trackPageView(currentPath, fullTitle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, path]);

  return null;
};
