import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, Building2, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { COMPANY_CONFIG } from '../../config/company';
import { trackFormStart, trackRecruitmentEnquiryClick, trackWhatsAppClick } from '../../lib/analytics';
import { AuthRequiredGateway } from '../auth/AuthRequiredGateway';
import { UserAccount } from '../../types';

const recruitmentSchema = z.object({
  contactPerson: z.string().min(2, 'Contact person name is required'),
  organizationName: z.string().min(2, 'Organization / Company name is required'),
  workEmail: z.string().email('Please enter a valid corporate email'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit phone number is required'),
  recruitmentRequirement: z.string().min(3, 'Please specify your hiring requirements'),
  numberOfPositions: z.string().optional(),
  cityDistrict: z.string().optional(),
  message: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true, 'Consent is required'),
  honeypot: z.string().optional()
});

type RecruitmentFormValues = z.infer<typeof recruitmentSchema>;

interface RecruitmentEnquiryFormProps {
  sourcePage?: string;
}

export const RecruitmentEnquiryForm = ({ sourcePage }: RecruitmentEnquiryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<RecruitmentFormValues>({
    resolver: zodResolver(recruitmentSchema),
    defaultValues: {
      contactPerson: '',
      organizationName: '',
      workEmail: '',
      phone: '',
      recruitmentRequirement: '',
      numberOfPositions: '1-5',
      cityDistrict: '',
      message: '',
      consentGiven: false,
      honeypot: ''
    }
  });

  const handleAuthenticated = (user: UserAccount) => {
    if (user.full_name) setValue('contactPerson', user.full_name);
    if (user.email) setValue('workEmail', user.email);
    if (user.phone) setValue('phone', user.phone);
  };

  const onSubmit = async (values: RecruitmentFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await enquiryService.submitEnquiry({
        full_name: values.contactPerson,
        email: values.workEmail,
        phone: values.phone,
        service_type: 'recruitment',
        source_page: sourcePage || window.location.pathname,
        organization_name: values.organizationName,
        recruitment_requirement: values.recruitmentRequirement,
        number_of_positions: values.numberOfPositions,
        city_district: values.cityDistrict,
        message: values.message,
        consent_given: values.consentGiven,
        honeypot: values.honeypot
      });

      if (res.success) {
        setSubmittedRefId(res.id);
        reset();
      } else {
        setServerError(res.error || 'Failed to submit staffing inquiry.');
      }
    } catch {
      setServerError('A network error occurred. Please try again or reach out by corporate email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRefId) {
    const waText = encodeURIComponent(
      `Hello Talent Path Recruitment Team! We just submitted a staffing request (Ref: ${submittedRefId}) for corporate hiring. Let's schedule an introductory discussion.`
    );

    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-soft text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-black text-2xl text-brand-darkText">
          Corporate Hiring Inquiry Registered
        </h3>
        <p className="text-slate-600 mt-2 text-xs max-w-md mx-auto">
          Thank you for trusting Talent Path Solutions with your workforce staffing and manpower requirements.
        </p>
        <div className="inline-block bg-brand-blueLight px-4 py-2 rounded-xl text-brand-blue font-mono font-bold text-base my-4 border border-brand-blue/20">
          Ref ID: {submittedRefId}
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
          Our corporate talent acquisition lead will contact your office within 24 business hours. You can also view this inquiry in your portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/portal"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-bold text-xs uppercase tracking-wider shadow-pill transition-all"
          >
            <span>View In My Portal</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <a
            href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('recruitment_form_success')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Discuss on WhatsApp
          </a>
          <button
            onClick={() => setSubmittedRefId(null)}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-slate-600 hover:text-brand-darkText border border-slate-200 text-xs font-semibold transition-colors"
          >
            Submit Another Requirement
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthRequiredGateway 
      actionLabel="submit an employer hiring requirement"
      onAuthenticated={handleAuthenticated}
    >
      {(user) => (
        <form
          onSubmit={handleSubmit(onSubmit)}
          onFocus={() => {
            trackFormStart('recruitment_enquiry_form');
            trackRecruitmentEnquiryClick('recruitment_form');
          }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4 text-left"
        >
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Contact Person <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. S. Radhakrishnan"
                defaultValue={user.full_name}
                {...register('contactPerson')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.contactPerson ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.contactPerson && <p className="text-red-500 text-[11px] mt-1">{errors.contactPerson.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Organization / Company <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Tech Solutions"
                {...register('organizationName')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.organizationName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.organizationName && <p className="text-red-500 text-[11px] mt-1">{errors.organizationName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Work Email Address <span className="text-brand-blue">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. hr@acmetech.com"
                defaultValue={user.email}
                {...register('workEmail')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.workEmail ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.workEmail && <p className="text-red-500 text-[11px] mt-1">{errors.workEmail.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                10-Digit Phone / Contact Number <span className="text-brand-blue">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="e.g. 9876543210"
                defaultValue={user.phone}
                {...register('phone', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  }
                })}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all font-mono ${
                  errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Recruitment Requirement / Roles <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineers, Sales Executives, Accountants"
                {...register('recruitmentRequirement')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.recruitmentRequirement ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.recruitmentRequirement && <p className="text-red-500 text-[11px] mt-1">{errors.recruitmentRequirement.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Estimated Number of Openings
              </label>
              <select
                {...register('numberOfPositions')}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue"
              >
                <option value="1-5">1 – 5 Positions</option>
                <option value="6-15">6 – 15 Positions</option>
                <option value="16-50">16 – 50 Positions (Bulk Staffing)</option>
                <option value="50+">50+ Enterprise Scale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
              Role Details, Experience Requirements, or Locations (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Specify key skills, target cities, required education backgrounds, or any urgent timelines..."
              {...register('message')}
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue resize-none"
            ></textarea>
          </div>

          <div className="pt-1">
            <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGiven')}
                className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>
                I consent to Talent Path Solutions storing these corporate contact details to facilitate employer talent matching in line with the <a href="/privacy-policy" target="_blank" className="text-brand-blue underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.consentGiven && <p className="text-red-500 text-[11px] mt-1">{errors.consentGiven.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full font-heading font-bold text-xs tracking-wider uppercase bg-brand-darkText hover:bg-black text-white shadow-pill hover:shadow-pill-hover transition-all flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Transmitting Corporate Brief...</span>
              </>
            ) : (
              <>
                <span>Submit Employer Enquiry</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthRequiredGateway>
  );
};
