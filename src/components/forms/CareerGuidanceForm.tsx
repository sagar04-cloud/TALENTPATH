import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, MessageCircle, Send, ArrowRight } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { COMPANY_CONFIG } from '../../config/company';
import { trackFormStart, trackCareerGuidanceClick, trackWhatsAppClick } from '../../lib/analytics';
import { AuthRequiredGateway } from '../auth/AuthRequiredGateway';
import { UserAccount } from '../../types';

const careerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Please enter a valid email address'),
  currentStatus: z.string().min(1, 'Please select your current status'),
  areaOfInterest: z.string().min(2, 'Area of interest is required'),
  careerGoal: z.string().min(3, 'Please outline your primary career goal'),
  preferredContactMethod: z.enum(['whatsapp', 'phone', 'email'] as const),
  cityDistrict: z.string().optional(),
  message: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
  honeypot: z.string().optional()
});

type CareerFormValues = z.infer<typeof careerSchema>;

interface CareerGuidanceFormProps {
  sourcePage?: string;
}

export const CareerGuidanceForm = ({ sourcePage }: CareerGuidanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CareerFormValues>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      currentStatus: '',
      areaOfInterest: '',
      careerGoal: '',
      preferredContactMethod: 'whatsapp',
      cityDistrict: '',
      message: '',
      consentGiven: false,
      honeypot: ''
    }
  });

  const handleAuthenticated = (user: UserAccount) => {
    if (user.full_name) setValue('fullName', user.full_name);
    if (user.email) setValue('email', user.email);
    if (user.phone) setValue('phone', user.phone);
  };

  const onSubmit = async (values: CareerFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await enquiryService.submitEnquiry({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        service_type: 'career_guidance',
        source_page: sourcePage || window.location.pathname,
        current_status: values.currentStatus,
        area_of_interest: values.areaOfInterest,
        career_goal: values.careerGoal,
        preferred_contact_method: values.preferredContactMethod,
        city_district: values.cityDistrict,
        message: values.message,
        consent_given: values.consentGiven,
        honeypot: values.honeypot
      });

      if (res.success) {
        setSubmittedRefId(res.id);
        reset();
      } else {
        setServerError(res.error || 'Failed to submit request.');
      }
    } catch {
      setServerError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRefId) {
    const waText = encodeURIComponent(
      `Hello Talent Path Advisory! I just booked a Career Guidance Request (Ref: ${submittedRefId}). Please let me know when our advisor is free for an exploratory call.`
    );

    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-soft text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-heading font-black text-2xl text-brand-darkText">
          Career Guidance Request Confirmed!
        </h3>
        <p className="text-slate-600 mt-2 text-xs max-w-md mx-auto">
          We have received your career profile and advisory request under Reference ID:
        </p>
        <div className="inline-block bg-brand-blueLight px-4 py-2 rounded-xl text-brand-blue font-mono font-bold text-base my-4 border border-brand-blue/20">
          Ref ID: {submittedRefId}
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
          Our senior guidance counselor will review your goals and provide real-time updates directly in your Student Portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/portal"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-bold text-xs uppercase tracking-wider shadow-pill transition-all"
          >
            <span>View In My Student Portal</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <a
            href={`https://wa.me/${COMPANY_CONFIG.whatsapp.raw}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('career_form_success')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Connect via WhatsApp
          </a>
          <button
            onClick={() => setSubmittedRefId(null)}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-slate-600 hover:text-brand-darkText border border-slate-200 text-xs font-semibold transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthRequiredGateway 
      actionLabel="schedule personalized career guidance"
      onAuthenticated={handleAuthenticated}
    >
      {(user) => (
        <form
          onSubmit={handleSubmit(onSubmit)}
          onFocus={() => {
            trackFormStart('career_guidance_form');
            trackCareerGuidanceClick('career_form');
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
                Full Name <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Nair"
                defaultValue={user.full_name}
                {...register('fullName')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                10-Digit Mobile Number <span className="text-brand-blue">*</span>
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
                Email Address <span className="text-brand-blue">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. priya@example.com"
                defaultValue={user.email}
                {...register('email')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Current Education / Status <span className="text-brand-blue">*</span>
              </label>
              <select
                {...register('currentStatus')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs bg-white focus:outline-none transition-all ${
                  errors.currentStatus ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              >
                <option value="">Select your status</option>
                <option value="Completed 10th / SSLC">Completed 10th / SSLC</option>
                <option value="Completed 12th / PUC">Completed 12th / PUC</option>
                <option value="College Student (Undergraduate)">College Student (Undergraduate)</option>
                <option value="College Student (Postgraduate)">College Student (Postgraduate)</option>
                <option value="Working Professional (0-3 yrs experience)">Working Professional (0-3 yrs)</option>
                <option value="Mid-Career Professional (3+ yrs experience)">Mid-Career Professional (3+ yrs)</option>
                <option value="Looking to restart education">Looking to restart education</option>
              </select>
              {errors.currentStatus && <p className="text-red-500 text-[11px] mt-1">{errors.currentStatus.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Primary Area of Interest <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Software, Management, Banking, Civil Services"
                {...register('areaOfInterest')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.areaOfInterest ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.areaOfInterest && <p className="text-red-500 text-[11px] mt-1">{errors.areaOfInterest.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Preferred Contact Method
              </label>
              <select
                {...register('preferredContactMethod')}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue"
              >
                <option value="whatsapp">WhatsApp Message</option>
                <option value="phone">Phone Call</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
              What is your ultimate career goal? <span className="text-brand-blue">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe what kind of job or industry you want to reach, or what dilemmas you currently face in choosing a stream..."
              {...register('careerGoal')}
              className={`w-full p-4 rounded-2xl border text-xs focus:outline-none transition-all resize-none ${
                errors.careerGoal ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
              }`}
            ></textarea>
            {errors.careerGoal && <p className="text-red-500 text-[11px] mt-1">{errors.careerGoal.message}</p>}
          </div>

          <div className="pt-1">
            <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGiven')}
                className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>
                I agree to the <a href="/privacy-policy" target="_blank" className="text-brand-blue underline">Privacy Policy</a> and allow Talent Path Solutions counselors to review my profile for advisory guidance.
              </span>
            </label>
            {errors.consentGiven && <p className="text-red-500 text-[11px] mt-1">{errors.consentGiven.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full font-heading font-bold text-xs tracking-wider uppercase bg-brand-blue hover:bg-brand-blueHover text-white shadow-pill hover:shadow-pill-hover transition-all flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Scheduling Request...</span>
              </>
            ) : (
              <>
                <span>Request Career Guidance</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthRequiredGateway>
  );
};
