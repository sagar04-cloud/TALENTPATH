import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { Home, Search, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <>
      <SEOHead
        title="Page Not Found (404)"
        description="The requested page could not be found. Return to Talent Path Solutions homepage."
      />

      <section className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-brand-bgLight text-center">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-brand-borderLight shadow-soft-xl space-y-6">
          <div className="w-16 h-16 bg-brand-blueLight text-brand-blue rounded-2xl flex items-center justify-center font-heading font-extrabold text-2xl mx-auto">
            404
          </div>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We couldn't find the page you are looking for. It may have moved or the address may be mistyped.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-bold uppercase tracking-wider shadow-soft transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              to="/courses"
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Explore Programs & Courses</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
