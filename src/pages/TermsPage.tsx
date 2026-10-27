import { SEOHead } from '../components/common/SEOHead';
import { COMPANY_CONFIG } from '../config/company';

export const TermsPage = () => {
  return (
    <>
      <SEOHead
        title="Terms & Conditions"
        description="Terms and conditions governing the educational advisory and recruitment services of Talent Path Solutions."
      />

      <section className="bg-brand-navy text-white py-14 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Terms & Conditions
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Last Updated: March 2025 • Talent Path Solutions
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">1. Educational Advisory Scope</h2>
            <p>
              {COMPANY_CONFIG.name} acts as an independent education guidance, counseling, and corporate recruitment facilitator. We assist candidates in understanding accredited board options, syllabus requirements, and admission procedures for recognized educational boards and universities.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">2. Admissions and Certifications</h2>
            <p>
              Final admission decisions, examination dates, syllabus changes, and certificate issuance rest solely with the respective universities, open boards (such as NIOS or State Open Boards), and examining authorities. {COMPANY_CONFIG.name} does not issue degrees or certificates directly.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">3. Accurate Candidate Information</h2>
            <p>
              Candidates agree to furnish truthful academic records, certificates, and personal details. Submission of falsified documents or misrepresentation of eligibility criteria will result in immediate termination of advisory services.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">4. Corporate Recruitment Terms</h2>
            <p>
              For enterprise clients utilizing our recruitment and manpower services, specific fee structures, guarantees, and replacement clauses are governed by formal corporate service agreements executed between the client organization and {COMPANY_CONFIG.name}.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">5. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in {COMPANY_CONFIG.address.city}, {COMPANY_CONFIG.address.state}.
            </p>
          </div>

        </div>
      </section>
    </>
  );
};
