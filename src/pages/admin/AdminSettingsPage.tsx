import { useState } from 'react';
import { COMPANY_CONFIG, CompanyConfig } from '../../config/company';
import { Save, CheckCircle2, Building, Phone, Mail, MapPin, Globe } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [config, setConfig] = useState<CompanyConfig>(COMPANY_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">
            Company Content & Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage verified contact details, WhatsApp numbers, social links, and Google Analytics configuration.
          </p>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center">
            <Building className="w-4 h-4 text-brand-blue mr-2" />
            Brand Identity & Taglines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Short Description (for Hero/Footer)</label>
            <input
              type="text"
              value={config.shortDescription}
              onChange={(e) => setConfig({ ...config, shortDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Contact Numbers & WhatsApp */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center">
            <Phone className="w-4 h-4 text-emerald-500 mr-2" />
            Phone Numbers & WhatsApp Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Display Phone Number</label>
              <input
                type="text"
                value={config.phone.display}
                onChange={(e) => setConfig({
                  ...config,
                  phone: { ...config.phone, display: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Raw Phone (for tel: link, e.g. +919876543210)</label>
              <input
                type="text"
                value={config.phone.raw}
                onChange={(e) => setConfig({
                  ...config,
                  phone: { ...config.phone, raw: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Display Number</label>
              <input
                type="text"
                value={config.whatsapp.display}
                onChange={(e) => setConfig({
                  ...config,
                  whatsapp: { ...config.whatsapp, display: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Raw Number (No +, e.g. 919876543210)</label>
              <input
                type="text"
                value={config.whatsapp.raw}
                onChange={(e) => setConfig({
                  ...config,
                  whatsapp: { ...config.whatsapp, raw: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center">
            <Mail className="w-4 h-4 text-brand-blue mr-2" />
            Official Email Inboxes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admissions Desk Email</label>
              <input
                type="email"
                value={config.email.admissions}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, admissions: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">General Support Email</label>
              <input
                type="email"
                value={config.email.support}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, support: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Corporate Recruitment Email</label>
              <input
                type="email"
                value={config.email.recruitment}
                onChange={(e) => setConfig({
                  ...config,
                  email: { ...config.email, recruitment: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Office Address & Map Link */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center">
            <MapPin className="w-4 h-4 text-amber-500 mr-2" />
            Physical Address & Maps
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Formatted Address</label>
            <input
              type="text"
              value={config.address.fullFormatted}
              onChange={(e) => setConfig({
                ...config,
                address: { ...config.address, fullFormatted: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Google Maps URL</label>
            <input
              type="url"
              value={config.address.googleMapsUrl}
              onChange={(e) => setConfig({
                ...config,
                address: { ...config.address, googleMapsUrl: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Analytics & Web URLs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center">
            <Globe className="w-4 h-4 text-purple-500 mr-2" />
            Analytics & Deploy URL
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={config.analytics.gaMeasurementId}
                onChange={(e) => setConfig({
                  ...config,
                  analytics: { gaMeasurementId: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Live Site URL</label>
              <input
                type="text"
                value={config.siteUrl}
                onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-white font-heading font-bold uppercase tracking-wider text-xs shadow-soft transition-colors inline-flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            <span>Save Company Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
