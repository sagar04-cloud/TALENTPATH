import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, MessageCircle, Send, ArrowRight } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { COMPANY_CONFIG } from '../../config/company';
import { trackFormStart, trackWhatsAppClick } from '../../lib/analytics';
import { AuthRequiredGateway } from '../auth/AuthRequiredGateway';
import { UserAccount } from '../../types';

const admissionSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (minimum 2 characters)'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Please enter a valid email address'),
  interestedProgram: z.string().min(1, 'Please select or specify a program'),
  educationLevel: z.string().min(1, 'Please indicate your current qualification'),
  learningMode: z.enum(['online', 'distance', 'blended', 'regular', 'flexible'] as const),
  cityDistrict: z.string().min(2, 'City / District is required'),
  message: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
  honeypot: z.string().optional()
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

interface AdmissionEnquiryFormProps {
  defaultProgram?: string;
  sourcePage?: string;
  onSuccess?: (refId: string) => void;
}

export const AdmissionEnquiryForm = ({ defaultProgram = '', sourcePage, onSuccess }: AdmissionEnquiryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      interestedProgram: defaultProgram,
      educationLevel: '',
      learningMode: 'distance',
      cityDistrict: '',
      message: '',
      consentGiven: false,
      honeypot: ''
    }
  });

  // Pre-fill user data when authenticated
  const handleAuthenticated = (user: UserAccount) => {
    if (user.full_name) setValue('fullName', user.full_name);
    if (user.email) setValue('email', user.email);
    if (user.phone) setValue('phone', user.phone);
  };

  const onSubmit = async (values: AdmissionFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await enquiryService.submitEnquiry({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        service_type: 'admission',
        source_page: sourcePage || window.location.pathname,
        interested_program: values.interestedProgram,
        education_level: values.educationLevel,
        learning_mode: values.learningMode,
        city_district: values.cityDistrict,
        message: values.message,
        consent_given: values.consentGiven,
        honeypot: values.honeypot
      });

      if (res.success) {
        setSubmittedRefId(res.id);
        reset();
        if (onSuccess) onSuccess(res.id);
      } else {
        setServerError(res.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setServerError('An unexpected network error occurred. Please try again or chat via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRefId) {
    const waText = encodeURIComponent(
      `Hello Talent Path Solutions! I submitted an admission enquiry (Ref: ${submittedRefId}) for ${defaultProgram || 'Degree/Course Programs'}. Please connect me with an academic advisor.`
    );

    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-soft text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-heading font-black text-2xl text-brand-darkText">
          Admission Enquiry Registered!
        </h3>
        <p className="text-slate-600 mt-2 text-xs max-w-md mx-auto">
          Thank you for reaching out. Your enquiry is stored with real-time tracking under Reference ID:
        </p>
        <div className="inline-block bg-brand-blueLight px-4 py-2 rounded-xl text-brand-blue font-mono font-bold text-base my-4 border border-brand-blue/20">
          {submittedRefId}
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
          Our admissions counselor will review your requirements and provide real-time updates directly in your Student Portal.
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
            onClick={() => trackWhatsAppClick('form_success_button')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Connect via WhatsApp
          </a>
          <button
            onClick={() => setSubmittedRefId(null)}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-slate-600 hover:text-brand-darkText border border-slate-200 text-xs font-semibold transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthRequiredGateway 
      actionLabel="register an admission enquiry"
      onAuthenticated={handleAuthenticated}
    >
      {(user) => (
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          onFocus={() => trackFormStart('admission_enquiry')}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4 text-left"
        >
          {/* Honeypot field for spam prevention */}
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Full Name <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                defaultValue={user.full_name}
                {...register('fullName')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Phone */}
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
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Email Address <span className="text-brand-blue">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. rahul@example.com"
                defaultValue={user.email}
                {...register('email')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
            </div>

            {/* City / District */}
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                City / District <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru / Mysuru"
                {...register('cityDistrict')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.cityDistrict ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.cityDistrict && <p className="text-red-500 text-[11px] mt-1">{errors.cityDistrict.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Interested Program */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Interested Program / Service <span className="text-brand-blue">*</span>
              </label>
              <select
                {...register('interestedProgram')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs bg-white focus:outline-none transition-all ${
                  errors.interestedProgram ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              >
                <option value="">Select a Program / Service</option>
                <option value="Bachelor of Business Administration (BBA)">BBA (Distance / Flexible)</option>
                <option value="Bachelor of Computer Applications (BCA)">BCA (Flexible)</option>
                <option value="Bachelor of Commerce (B.Com)">B.Com (Flexible)</option>
                <option value="Master of Business Administration (MBA)">MBA (Executive / Distance)</option>
                <option value="Master of Computer Applications (MCA)">MCA (Distance)</option>
                <option value="Master of Commerce (M.Com)">M.Com</option>
                <option value="SSLC / 10th Secondary Fast-Track">SSLC / 10th Secondary Pathway</option>
                <option value="PUC / 12th Senior Secondary Program">PUC / 12th Senior Secondary Pathway</option>
                <option value="Comprehensive Career Guidance">Comprehensive Career Guidance</option>
                <option value="Other Certificate or Degree">Other Custom Program</option>
              </select>
              {errors.interestedProgram && <p className="text-red-500 text-[11px] mt-1">{errors.interestedProgram.message}</p>}
            </div>

            {/* Preferred Learning Mode */}
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Learning Mode
              </label>
              <select
                {...register('learningMode')}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-blue"
              >
                <option value="distance">Distance Mode</option>
                <option value="online">Online Mode</option>
                <option value="blended">Blended / Hybrid</option>
                <option value="flexible">Flexible Pace</option>
                <option value="regular">Regular Campus</option>
              </select>
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
              Current Education Level <span className="text-brand-blue">*</span>
            </label>
            <select
              {...register('educationLevel')}
              className={`w-full px-4 py-2.5 rounded-full border text-xs bg-white focus:outline-none transition-all ${
                errors.educationLevel ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
              }`}
            >
              <option value="">Select your current qualification</option>
              <option value="Below 10th / Middle School">Below 10th / Middle School</option>
              <option value="10th Standard / SSLC Passed">10th Standard / SSLC Passed</option>
              <option value="12th Standard / PUC Passed">12th Standard / PUC Passed</option>
              <option value="Diploma Holder">Diploma Holder</option>
              <option value="Graduation in Progress">Graduation in Progress</option>
              <option value="Graduate / Degree Completed">Graduate / Degree Completed</option>
              <option value="Post-Graduate Completed">Post-Graduate Completed</option>
              <option value="Working Professional">Working Professional</option>
            </select>
            {errors.educationLevel && <p className="text-red-500 text-[11px] mt-1">{errors.educationLevel.message}</p>}
          </div>

          {/* Specific Message / Query */}
          <div>
            <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
              Additional Notes or Questions (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Share any specific requirements, timing constraints, or questions regarding exams and study material..."
              {...register('message')}
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue resize-none"
            ></textarea>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGiven')}
                className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>
                I consent to Talent Path Solutions collecting my contact details to provide admissions guidance, syllabus schedules, and program updates in accordance with the <a href="/privacy-policy" target="_blank" className="text-brand-blue underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.consentGiven && <p className="text-red-500 text-[11px] mt-1">{errors.consentGiven.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full font-heading font-bold text-xs tracking-wider uppercase bg-brand-blue hover:bg-brand-blueHover text-white shadow-pill hover:shadow-pill-hover transition-all flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Registering Admission Enquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Admission Enquiry</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthRequiredGateway>
  );
};
