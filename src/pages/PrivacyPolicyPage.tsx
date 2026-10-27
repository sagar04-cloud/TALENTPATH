import { SEOHead } from '../components/common/SEOHead';
import { COMPANY_CONFIG } from '../config/company';

export const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Read the Privacy Policy for Talent Path Solutions regarding student enquiry collection, consent, and data protection."
      />

      <section className="bg-brand-navy text-white py-14 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Last Updated: March 2025 • Talent Path Solutions
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">1. Overview</h2>
            <p>
              At {COMPANY_CONFIG.name}, we value and respect your personal privacy. This Privacy Policy outlines our procedures regarding the collection, use, and protection of information submitted through our website forms and advisory communication channels.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">2. Information We Collect</h2>
            <p>
              When you submit an admission enquiry, request career counseling, or lodge an employer recruitment brief, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Contact details: Name, phone number, and email address.</li>
              <li>Academic background: Previous education status, intended degree program, or school board preference.</li>
              <li>Corporate details: Company name, hiring job titles, and positions required.</li>
              <li>Communication preferences: Preferred contact method (e.g. WhatsApp, phone, email).</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">3. How We Use Your Information</h2>
            <p>The information you provide is utilized solely for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Contacting you with verified university admission schedules, curriculum details, and fee structures.</li>
              <li>Conducting scheduled career advisory and mentoring calls.</li>
              <li>Matching candidate qualifications with corporate hiring requirements.</li>
              <li>Internal record-keeping and audit compliance.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">4. WhatsApp and Transactional Communications</h2>
            <p>
              By voluntarily submitting your phone number and selecting contact consent, you authorize {COMPANY_CONFIG.name} to send you transactional messages, admission alerts, and counseling replies via WhatsApp and telephone. We will never sell or rent your contact number to third-party marketing brokers.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">5. Data Protection and Security</h2>
            <p>
              We implement industry-standard database access security and Row Level Security (RLS) policies. Only authorized counselors and administrators have access to submitted lead data.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">6. Contacting Our Data Officer</h2>
            <p>
              If you have any questions or wish to request the deletion or update of your submitted contact record, please reach out to us at:
            </p>
            <p className="mt-2 font-semibold text-brand-navy">
              Email: {COMPANY_CONFIG.email.support} <br />
              Address: {COMPANY_CONFIG.address.fullFormatted}
            </p>
          </div>

        </div>
      </section>
    </>
  );
};
