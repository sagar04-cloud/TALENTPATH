import { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, CheckCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';
import { trackWhatsAppClick, trackCallClick } from '../../lib/analytics';

export const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickTopics = [
    "Admission enquiry for Degree programs",
    "SSLC / PUC course completion guidance",
    "1-on-1 Career Counseling session",
    "Recruitment & Corporate Staffing inquiry",
    "Flexible & Distance Learning degree options"
  ];

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message.trim() || COMPANY_CONFIG.whatsapp.defaultMessage;
    trackWhatsAppClick('floating_widget');
    const encoded = encodeURIComponent(finalMsg);
    const url = `https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCall = () => {
    trackCallClick('floating_widget');
    window.location.href = `tel:${COMPANY_CONFIG.phone.raw}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Popover Sheet */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white shadow-soft-xl border border-brand-borderLight overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-brand-navy p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center font-bold text-white shadow-sm">
                  TP
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-brand-navy"></span>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm leading-tight text-white">
                  Talent Path Support Desk
                </h4>
                <p className="text-xs text-blue-200 flex items-center mt-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400 mr-1 inline" />
                  Typically replies within minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 border-b border-brand-borderLight space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs text-slate-700 border border-slate-100 leading-relaxed">
              👋 Hi there! How can our academic counselors or recruitment team help you today? Choose a topic or type a custom note:
            </div>

            {/* Quick chips */}
            <div className="space-y-1.5">
              {quickTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(`Hello, I'm reaching out regarding: ${topic}`)}
                  className="w-full text-left text-xs bg-white hover:bg-brand-blueLight hover:text-brand-blue hover:border-brand-blue/30 border border-slate-200 p-2 rounded-lg font-medium text-slate-700 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{topic}</span>
                  <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Input & Call options */}
          <div className="p-3 bg-white space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
              />
              <button
                onClick={() => handleSend()}
                className="bg-brand-blue hover:bg-brand-blueHover text-white p-2 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Prefer phone call?</span>
              <button
                onClick={handleCall}
                className="text-brand-blue font-semibold hover:underline inline-flex items-center"
              >
                <PhoneCall className="w-3 h-3 mr-1" />
                {COMPANY_CONFIG.phone.display}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main floating pill/button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center space-x-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-sm font-semibold tracking-wide hidden sm:inline">
          {isOpen ? 'Close Chat' : 'Chat on WhatsApp'}
        </span>
      </button>
    </div>
  );
};
