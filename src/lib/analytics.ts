import { COMPANY_CONFIG } from '../config/company';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Initializes Google Analytics 4 dynamically if measurement ID is provided
 */
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || COMPANY_CONFIG.analytics.gaMeasurementId;
  
  if (!measurementId || measurementId === 'G-XXXXXXXXXX' || typeof window === 'undefined') {
    return;
  }

  // Inject Google Tag script if not present
  if (!document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false // Managed via React Router route changes
    });
  }
};

/**
 * Generic event tracker that enforces strict privacy (No PII)
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  // Ensure no PII keys exist in parameters
  const forbiddenKeys = ['name', 'full_name', 'email', 'phone', 'message', 'address'];
  const sanitizedParams: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (!forbiddenKeys.includes(key.toLowerCase())) {
      sanitizedParams[key] = value;
    }
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, sanitizedParams);
  } else {
    // Development tracking log
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event] ${eventName}:`, sanitizedParams);
    }
  }
};

// Specialized event dispatchers specified in prompt
export const trackPageView = (path: string, title: string) => {
  trackEvent('page_view', { page_path: path, page_title: title });
};

export const trackFormStart = (formName: string) => {
  trackEvent('form_start', { form_name: formName });
};

export const trackFormSubmitSuccess = (formName: string, serviceType: string) => {
  trackEvent('form_submit_success', { form_name: formName, service_type: serviceType });
};

export const trackWhatsAppClick = (source: string) => {
  trackEvent('click_whatsapp', { source_placement: source });
};

export const trackCallClick = (source: string) => {
  trackEvent('click_call', { source_placement: source });
};

export const trackEmailClick = (source: string) => {
  trackEvent('click_email', { source_placement: source });
};

export const trackProgramView = (programSlug: string, programTitle: string) => {
  trackEvent('view_program', { program_slug: programSlug, program_title: programTitle });
};

export const trackCareerGuidanceClick = (source: string) => {
  trackEvent('click_career_guidance', { source_placement: source });
};

export const trackRecruitmentEnquiryClick = (source: string) => {
  trackEvent('click_recruitment_enquiry', { source_placement: source });
};
