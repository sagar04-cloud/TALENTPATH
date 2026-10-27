import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { AdmissionEnquiryForm } from '../components/forms/AdmissionEnquiryForm';
import { CareerGuidanceForm } from '../components/forms/CareerGuidanceForm';
import { RecruitmentEnquiryForm } from '../components/forms/RecruitmentEnquiryForm';
import { GeneralContactForm } from '../components/forms/GeneralContactForm';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  GraduationCap, 
  Compass, 
  Building2,
  Send,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { COMPANY_CONFIG } from '../config/company';
import { trackWhatsAppClick, trackCallClick, trackEmailClick } from '../lib/analytics';

import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from '../components/common/SpotlightCard';

export const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'admission' | 'career' | 'recruitment' | 'general'>('admission');
  const programFromQuery = searchParams.get('program') || '';

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'career') setActiveTab('career');
    else if (tabParam === 'recruitment') setActiveTab('recruitment');
    else if (tabParam === 'general') setActiveTab('general');
    else if (tabParam === 'admission' || programFromQuery) setActiveTab('admission');
  }, [searchParams, programFromQuery]);

  const faqs = [
    {
      q: "Are the distance and flexible degree programs recognized for government exams?",
      a: "Yes. All programs we guide are selected from universities accredited by statutory regulatory bodies (including UGC and DEB), ensuring equivalence for state and central competitive exams and private employment."
    },
    {
      q: "Can I complete my SSLC (10th) or PUC (12th) if I dropped out several years ago?",
      a: "Absolutely. Recognized open schooling frameworks (like NIOS and state open boards) are specifically designed for candidates needing to complete their secondary education at their own pace without age restrictions."
    },
    {
      q: "What does the 1-on-1 career guidance session cost?",
      a: "Our initial exploratory advisory discussion is offered at no charge to help you understand available pathways, eligibility criteria, and examination formats."
    },
    {
      q: "Do you provide recruitment and corporate staffing services?",
      a: "Yes. Our recruitment vertical partners with corporate firms, SMEs, and institutions to supply pre-screened graduates, certified diploma holders, and entry-level professionals."
    },
    {
      q: "How fast will an academic counselor or recruitment lead contact me?",
      a: "Our team reviews all submissions promptly and typically responds within 2 to 4 working hours via WhatsApp or your preferred contact method."
    }
  ];

  return (
    <>
      <SEOHead
        title="Contact Us | Admissions, Career Advisory & Corporate Recruitment"
        description="Connect with Talent Path Solutions. Submit degree admission enquiries, corporate recruitment requirements, book personalized career counseling, or visit our advisory center."
      />

      {/* Header with animated subtle floating glow */}
      <section className="bg-brand-navy text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none animate-float-slow"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4 animate-fade-in-up">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>Get in Touch</span>
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
              Connect With Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Advisors.</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              Whether you are an aspiring student or a working professional seeking flexible degrees, our dedicated advisory team is here to guide your educational journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Hub */}
      <section className="py-20 bg-brand-bgLight relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Contact Information & Details */}
            <div className="lg:col-span-5 space-y-8 text-left animate-fade-in-up">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
                  Direct Advisory Line
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-darkText tracking-tight">
                  Reach Our Counseling Desk
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We maintain multiple verified communication channels so you can reach an authorized educational mentor without delay.
                </p>
              </div>

              {/* Contact Detail Cards with smooth hover lifts and cursor spotlight */}
              <div className="space-y-4">
                {/* Phone Card */}
                <SpotlightCard className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-brand-darkText">Call Our Office</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Admissions & immediate queries</p>
                    <a
                      href={`tel:${COMPANY_CONFIG.phone.raw}`}
                      onClick={() => trackCallClick('contact_page_card')}
                      className="text-sm font-bold text-brand-blue hover:underline mt-1 inline-block"
                    >
                      {COMPANY_CONFIG.phone.display}
                    </a>
                  </div>
                </SpotlightCard>

                {/* WhatsApp Card */}
                <SpotlightCard className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-brand-darkText">WhatsApp Helpdesk</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Instant messaging & syllabus guidance</p>
                    <a
                      href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent(COMPANY_CONFIG.whatsapp.defaultMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick('contact_page_card')}
                      className="text-sm font-bold text-emerald-600 hover:underline mt-1 inline-block"
                    >
                      {COMPANY_CONFIG.whatsapp.display} (Chat Now &rarr;)
                    </a>
                  </div>
                </SpotlightCard>

                {/* Email Card */}
                <SpotlightCard className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-brand-darkText">Official Inquiries</h4>
                    <p className="text-xs text-slate-600">
                      Admissions: <a href={`mailto:${COMPANY_CONFIG.email.admissions}`} onClick={() => trackEmailClick('contact_admissions')} className="text-brand-blue font-semibold hover:underline">{COMPANY_CONFIG.email.admissions}</a>
                    </p>
                    <p className="text-xs text-slate-600">
                      Recruitment: <a href={`mailto:${COMPANY_CONFIG.email.recruitment}`} onClick={() => trackEmailClick('contact_recruitment')} className="text-brand-blue font-semibold hover:underline">{COMPANY_CONFIG.email.recruitment}</a>
                    </p>
                    <p className="text-xs text-slate-600">
                      General: <a href={`mailto:${COMPANY_CONFIG.email.support}`} onClick={() => trackEmailClick('contact_general')} className="text-brand-blue font-semibold hover:underline">{COMPANY_CONFIG.email.support}</a>
                    </p>
                  </div>
                </SpotlightCard>

                {/* Address Card */}
                <SpotlightCard className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-brand-darkText">Office Location</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {COMPANY_CONFIG.address.fullFormatted}
                    </p>
                    <a
                      href={COMPANY_CONFIG.address.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-blue hover:underline mt-2 inline-block"
                    >
                      Open Google Maps Location &rarr;
                    </a>
                  </div>
                </SpotlightCard>

                {/* Operating Hours */}
                <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-700 flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>
                    <strong>Counseling Timings:</strong> {COMPANY_CONFIG.operatingHours}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Interactive Form Tabs Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft-xl relative overflow-hidden">
                
                {/* Form Tabs Header with fluid spring sliding pill */}
                <div className="mb-8 pb-5 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-left">
                    Select Enquiry Pathway
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 relative">
                    {[
                      { id: 'admission' as const, label: 'Admission', icon: GraduationCap },
                      { id: 'career' as const, label: 'Guidance', icon: Compass },
                      { id: 'recruitment' as const, label: 'Recruitment', icon: Building2 },
                      { id: 'general' as const, label: 'General', icon: Send }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-colors z-10 ${
                            isActive ? 'text-white' : 'text-slate-600 hover:text-brand-blue'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeContactTab"
                              className="absolute inset-0 bg-brand-blue rounded-xl shadow-pill -z-10"
                              transition={{ type: "spring", stiffness: 450, damping: 35 }}
                            />
                          )}
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Forms with smooth blur-fade transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {activeTab === 'admission' && (
                      <AdmissionEnquiryForm 
                        defaultProgram={programFromQuery} 
                        sourcePage="/contact" 
                      />
                    )}

                    {activeTab === 'career' && (
                      <CareerGuidanceForm 
                        sourcePage="/contact" 
                      />
                    )}

                    {activeTab === 'recruitment' && (
                      <RecruitmentEnquiryForm 
                        sourcePage="/contact" 
                      />
                    )}

                    {activeTab === 'general' && (
                      <GeneralContactForm />
                    )}
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

          </div>

          {/* Interactive FAQs Section */}
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="max-w-3xl mx-auto text-center mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blueLight px-3.5 py-1.5 rounded-full inline-block">
                Help & Clarifications
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-brand-darkText">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <SpotlightCard className="p-6 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 space-y-2 h-full">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-brand-darkText flex items-start">
                      <HelpCircle className="w-4 h-4 text-brand-blue mr-2 flex-shrink-0 mt-1" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

