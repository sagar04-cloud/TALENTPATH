import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { programService } from '../../services/programService';
import { newsService } from '../../services/newsService';
import { Enquiry } from '../../types';

export const AdminDashboardPage = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [programCount, setProgramCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);

  useEffect(() => {
    // 1. Subscribe to real-time enquiries stream
    const unsubEnquiries = enquiryService.subscribeToEnquiries(undefined, (data) => {
      setEnquiries(data);
    });

    // 2. Load program & news counts
    const loadCounts = async () => {
      try {
        const [progs, news] = await Promise.all([
          programService.getPrograms(),
          newsService.getNewsArticles()
        ]);
        setProgramCount(progs.length);
        setNewsCount(news.length);
      } catch (err) {
        console.error(err);
      }
    };
    loadCounts();

    return () => {
      unsubEnquiries();
    };
  }, []);

  const total = enquiries.length;
  const newLeads = enquiries.filter(e => e.status === 'new').length;
  const contacted = enquiries.filter(e => e.status === 'contacted').length;
  const qualified = enquiries.filter(e => e.status === 'qualified').length;
  const converted = enquiries.filter(e => e.status === 'converted').length;

  const serviceBreakdown = {
    admission: enquiries.filter(e => e.service_type === 'admission').length,
    career_guidance: enquiries.filter(e => e.service_type === 'career_guidance').length,
    flexible_learning: enquiries.filter(e => e.service_type === 'flexible_learning').length,
    sslc_puc: enquiries.filter(e => e.service_type === 'sslc_puc').length,
    recruitment: enquiries.filter(e => e.service_type === 'recruitment').length,
    general: enquiries.filter(e => e.service_type === 'general').length,
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-amber-100 text-amber-800 border-amber-200',
    qualified: 'bg-purple-100 text-purple-800 border-purple-200',
    follow_up: 'bg-orange-100 text-orange-800 border-orange-200',
    converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    closed: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline performance and lead management metrics.
          </p>
        </div>

        <Link
          to="/admin/leads"
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <span>Manage All Leads</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</p>
          <p className="font-heading font-extrabold text-3xl text-brand-navy mt-2">{total}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Lifetime Submissions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-soft-sm">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">New Enquiries</p>
          <p className="font-heading font-extrabold text-3xl text-brand-blue mt-2">{newLeads}</p>
          <span className="text-[11px] text-blue-500 mt-1 block">Awaiting First Contact</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-soft-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Contacted</p>
          <p className="font-heading font-extrabold text-3xl text-amber-600 mt-2">{contacted}</p>
          <span className="text-[11px] text-amber-500 mt-1 block">Counselor Engaged</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft-sm">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Qualified Leads</p>
          <p className="font-heading font-extrabold text-3xl text-purple-600 mt-2">{qualified}</p>
          <span className="text-[11px] text-purple-500 mt-1 block">Eligible Candidates</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-soft-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Converted</p>
          <p className="font-heading font-extrabold text-3xl text-emerald-600 mt-2">{converted}</p>
          <span className="text-[11px] text-emerald-500 mt-1 block">Enrolled / Placed</span>
        </div>
      </div>

      {/* Service Distribution & System Counts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Service Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-brand-navy">
              Enquiries by Service Vertical
            </h3>
            <span className="text-xs text-slate-400">Total: {total}</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Admission Enquiries (Degree & Diplomas)</span>
                <span>{serviceBreakdown.admission} ({total > 0 ? Math.round((serviceBreakdown.admission / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-brand-blue rounded-full"
                  style={{ width: `${total > 0 ? (serviceBreakdown.admission / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Career Guidance & Counseling</span>
                <span>{serviceBreakdown.career_guidance} ({total > 0 ? Math.round((serviceBreakdown.career_guidance / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${total > 0 ? (serviceBreakdown.career_guidance / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Distance & Flexible Learning</span>
                <span>{serviceBreakdown.flexible_learning} ({total > 0 ? Math.round((serviceBreakdown.flexible_learning / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${total > 0 ? (serviceBreakdown.flexible_learning / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>SSLC & PUC Education Services</span>
                <span>{serviceBreakdown.sslc_puc} ({total > 0 ? Math.round((serviceBreakdown.sslc_puc / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${total > 0 ? (serviceBreakdown.sslc_puc / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Recruitment & Manpower Services</span>
                <span>{serviceBreakdown.recruitment} ({total > 0 ? Math.round((serviceBreakdown.recruitment / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${total > 0 ? (serviceBreakdown.recruitment / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Module Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-brand-navy">
            CMS Database Status
          </h3>

          <div className="space-y-3 pt-1">
            <Link
              to="/admin/programs"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-brand-blueLight/50 border border-slate-100 flex items-center justify-between transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-brand-navy group-hover:text-brand-blue">Academic Programs</p>
                <p className="text-[11px] text-slate-500">{programCount} catalog programs</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue" />
            </Link>

            <Link
              to="/admin/news"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-brand-blueLight/50 border border-slate-100 flex items-center justify-between transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-brand-navy group-hover:text-brand-blue">News & Insights</p>
                <p className="text-[11px] text-slate-500">{newsCount} published articles</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue" />
            </Link>

            <Link
              to="/admin/settings"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-brand-blueLight/50 border border-slate-100 flex items-center justify-between transition-colors group"
            >
              <div>
                <p className="text-xs font-bold text-brand-navy group-hover:text-brand-blue">Company Configuration</p>
                <p className="text-[11px] text-slate-500">Contact, WhatsApp, GA4 ID</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Enquiries Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-brand-navy">
            Recent Enquiries Activity
          </h3>
          <Link
            to="/admin/leads"
            className="text-xs font-bold text-brand-blue hover:underline"
          >
            View all ({total})
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {enquiries.slice(0, 5).map((enq) => (
            <div key={enq.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {enq.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColors[enq.status] || 'bg-slate-100'}`}>
                    {enq.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    • {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="font-heading font-bold text-sm text-brand-navy">
                  {enq.full_name} {enq.organization_name ? `(${enq.organization_name})` : ''}
                </p>

                <p className="text-xs text-slate-600">
                  {enq.interested_program || enq.recruitment_requirement || enq.area_of_interest || 'General Consultation'} • {enq.phone}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/leads"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Inspect Lead
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
