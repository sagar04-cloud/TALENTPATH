import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, Send, ArrowRight } from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { trackFormStart } from '../../lib/analytics';
import { AuthRequiredGateway } from '../auth/AuthRequiredGateway';
import { UserAccount } from '../../types';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().refine(val => !val || /^[0-9]{10}$/.test(val), 'Phone must be a valid 10-digit number'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  consentGiven: z.boolean().refine(val => val === true, 'Consent is required'),
  honeypot: z.string().optional()
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const GeneralContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      consentGiven: false,
      honeypot: ''
    }
  });

  const handleAuthenticated = (user: UserAccount) => {
    if (user.full_name) setValue('name', user.full_name);
    if (user.email) setValue('email', user.email);
    if (user.phone) setValue('phone', user.phone);
  };

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await enquiryService.submitEnquiry({
        full_name: values.name,
        email: values.email,
        phone: values.phone || 'Not provided',
        service_type: 'general',
        source_page: window.location.pathname,
        interested_program: values.subject,
        message: values.message,
        consent_given: values.consentGiven,
        honeypot: values.honeypot
      });

      if (res.success) {
        setSubmittedRefId(res.id);
        reset();
      } else {
        setServerError(res.error || 'Failed to submit message.');
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRefId) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-soft text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-heading font-black text-2xl text-brand-darkText">
          Message Sent Successfully
        </h3>
        <p className="text-slate-600 mt-2 text-xs max-w-md mx-auto">
          Thank you for getting in touch. Your message ticket is registered with real-time tracking under ID:
        </p>
        <div className="inline-block bg-brand-blueLight px-4 py-2 rounded-xl text-brand-blue font-mono font-bold text-base my-4 border border-brand-blue/20">
          Ref: {submittedRefId}
        </div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
          Our team will reply to your registered account email address promptly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/portal"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-blue hover:bg-brand-blueHover text-white font-bold text-xs uppercase tracking-wider shadow-pill transition-all"
          >
            <span>View In My Portal</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <button
            onClick={() => setSubmittedRefId(null)}
            className="w-full sm:w-auto px-5 py-3 rounded-full text-slate-600 hover:text-brand-darkText border border-slate-200 text-xs font-semibold transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthRequiredGateway 
      actionLabel="send an inquiry message"
      onAuthenticated={handleAuthenticated}
    >
      {(user) => (
        <form
          onSubmit={handleSubmit(onSubmit)}
          onFocus={() => trackFormStart('general_contact_form')}
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
                Your Name <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                defaultValue={user.full_name}
                {...register('name')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Email Address <span className="text-brand-blue">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                defaultValue={user.email}
                {...register('email')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                10-Digit Mobile (Optional)
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
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:border-brand-blue font-mono"
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
                Subject <span className="text-brand-blue">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. General Inquiry / Partnership"
                {...register('subject')}
                className={`w-full px-4 py-2.5 rounded-full border text-xs focus:outline-none transition-all ${
                  errors.subject ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
                }`}
              />
              {errors.subject && <p className="text-red-500 text-[11px] mt-1">{errors.subject.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-darkText uppercase tracking-wider mb-1.5">
              Message <span className="text-brand-blue">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="How can we assist you today?"
              {...register('message')}
              className={`w-full p-4 rounded-2xl border text-xs focus:outline-none transition-all resize-none ${
                errors.message ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-brand-blue'
              }`}
            ></textarea>
            {errors.message && <p className="text-red-500 text-[11px] mt-1">{errors.message.message}</p>}
          </div>

          <div className="pt-1">
            <label className="flex items-start space-x-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGiven')}
                className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>
                I agree to the <a href="/privacy-policy" target="_blank" className="text-brand-blue underline">Privacy Policy</a> and allow Talent Path Solutions to contact me.
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
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthRequiredGateway>
  );
};
