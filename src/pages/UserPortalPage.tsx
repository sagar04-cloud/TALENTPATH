import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  LogOut, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  FileText 
} from 'lucide-react';
import { authService } from '../services/authService';
import { enquiryService } from '../services/enquiryService';
import { UserAccount, Enquiry } from '../types';
import { COMPANY_CONFIG } from '../config/company';
import { SEOHead } from '../components/common/SEOHead';

export const UserPortalPage = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [myEnquiries, setMyEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(session);

    // Subscribe to real-time updates (Firestore & local cache)
    const unsubscribe = enquiryService.subscribeToUserEnquiries(
      session.email,
      session.id,
      (list) => {
        setMyEnquiries(list);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const handleLogout = () => {
    authService.signOut();
    navigate('/', { replace: true });
  };

  if (!user) return null;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-amber-100 text-amber-800',
    qualified: 'bg-purple-100 text-purple-800',
    follow_up: 'bg-orange-100 text-orange-800',
    converted: 'bg-emerald-100 text-emerald-800',
    closed: 'bg-slate-100 text-slate-800',
  };

  return (
    <>
      <SEOHead
        title={`Student Portal | ${user.full_name}`}
        description="View your admissions applications, program counseling progress, and advisor replies."
      />

      <section className="py-12 bg-brand-bgLight min-h-[80vh] text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top User Welcome Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-brand-blueLight text-brand-blue flex items-center justify-center font-heading font-black text-xl">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blueLight text-brand-blue">
                  {user.role === 'admin' ? 'Administrative Staff' : 'Student Account'}
                </span>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-brand-darkText mt-1">
                  Hello, {user.full_name}!
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user.email} • Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-5 py-2.5 rounded-full bg-brand-navy hover:bg-brand-navyLight text-white text-xs font-bold inline-flex items-center shadow-soft"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  <span>Open Admin CRM</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold inline-flex items-center"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Admin Clearance Banner if user is admin */}
          {user.role === 'admin' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-blueLight to-indigo-50 border border-brand-blue/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-brand-navy">You have Administrative Clearance</p>
                  <p className="text-[11px] text-slate-600">Access full lead CRM, program CMS, and user permissions.</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="px-5 py-2 rounded-full bg-brand-blue text-white text-xs font-bold self-start sm:self-auto"
              >
                Access Admin Panel &rarr;
              </Link>
            </div>
          )}

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/courses"
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-blueLight text-brand-blue flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-lg text-brand-darkText group-hover:text-brand-blue transition-colors">
                Explore Courses
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Browse accredited undergraduate and postgraduate degree pathways.
              </p>
            </Link>

            <Link
              to="/career-guidance"
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-indigo-600 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-lg text-brand-darkText group-hover:text-brand-blue transition-colors">
                Book Guidance
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Schedule a 1-on-1 counseling session with an academic mentor.
              </p>
            </Link>

            <a
              href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent(`Hello Talent Path Solutions! This is ${user.full_name} (${user.email}). I have a question regarding my application.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-soft-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-lg text-brand-darkText group-hover:text-brand-blue transition-colors">
                WhatsApp Advisor
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Connect directly with our admissions help desk on WhatsApp.
              </p>
            </a>
          </div>

          {/* Applications & Enquiries Tracking */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-heading font-black text-xl text-brand-darkText">
                  My Enquiries & Applications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track the status of your admission enquiries and counseling requests.
                </p>
              </div>

              <Link
                to="/contact?tab=admission"
                className="px-4 py-2 rounded-full bg-brand-blue text-white text-xs font-bold shadow-pill hover:shadow-pill-hover transition-all"
              >
                + New Enquiry
              </Link>
            </div>

            {loading && (
              <p className="text-xs text-slate-400 py-8 text-center">Loading your applications...</p>
            )}

            {!loading && myEnquiries.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-heading font-bold text-base text-brand-darkText">No enquiries submitted yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ready to explore a degree or book career counseling? Submit your first enquiry to get paired with an advisor.
                </p>
                <Link
                  to="/contact?tab=admission"
                  className="inline-flex items-center px-6 py-2.5 rounded-full bg-brand-blue text-white text-xs font-bold shadow-pill mt-2"
                >
                  <span>Submit Admission Enquiry</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            )}

            {!loading && myEnquiries.length > 0 && (
              <div className="divide-y divide-slate-100">
                {myEnquiries.map((enq) => (
                  <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {enq.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[enq.status] || 'bg-slate-100'}`}>
                          {enq.status}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-base text-brand-darkText">
                        {enq.interested_program || enq.service_type.replace('_', ' ')}
                      </h4>

                      <p className="text-xs text-slate-500">
                        Submitted: {new Date(enq.created_at).toLocaleDateString()} • City: {enq.city_district || 'Not specified'}
                      </p>

                      {enq.message && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 italic">
                          "{enq.message}"
                        </p>
                      )}
                    </div>

                    <div>
                      <a
                        href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${encodeURIComponent(`Hello, I'm checking in on my enquiry ${enq.id} for ${enq.interested_program || enq.service_type}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
};
