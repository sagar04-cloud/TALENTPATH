import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { authService, formatAuthError } from '../services/authService';
import { isFirebaseConfigured } from '../lib/firebase';
import { SEOHead } from '../components/common/SEOHead';
import { GoogleAccountChooserModal } from '../components/auth/GoogleAccountChooserModal';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    location.pathname === '/signup' || searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestAdmin, setRequestAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Existing session management
  const [existingSession, setExistingSession] = useState<any | null>(null);

  // Google Account Chooser Modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const redirectParam = searchParams.get('redirect');
  const reasonParam = searchParams.get('reason');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
  };

  const getRedirectDestination = (_role?: string) => {
    if (redirectParam) return redirectParam;
    // Direct admin login route (/admin/login) goes to /admin
    if (window.location.pathname.startsWith('/admin') && _role === 'admin') {
      return '/admin';
    }
    // Direct user or admin login/signup lands directly on the Home page ("/")
    return '/';
  };

  useEffect(() => {
    if (searchParams.get('mode') === 'signup' || location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login' || searchParams.get('mode') === 'signin') {
      setMode('signin');
    }

    const current = authService.getSession();
    if (current) {
      if (searchParams.get('switch') === 'true') {
        authService.signOut();
        setExistingSession(null);
      } else {
        setExistingSession(current);
      }
    }
  }, [searchParams, location.pathname]);


  const handleSelectGoogleAccount = async (googleEmail: string, googleName?: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const roleToAssign = requestAdmin ? 'admin' : 'user';
      const res = await authService.signInWithGoogleAccount(googleEmail, googleName, roleToAssign);
      if (res.user) {
        setIsGoogleModalOpen(false);
        navigate(getRedirectDestination(res.user?.role));
      } else {
        setError(res.error || 'Failed to sign in with Google account.');
      }
    } catch (err: any) {
      setError(formatAuthError(err, 'google'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInDirect = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const roleToAssign = requestAdmin ? 'admin' : 'user';
      const res = await authService.signInWithGoogle(roleToAssign);
      if (res.user) {
        setIsGoogleModalOpen(false);
        navigate(getRedirectDestination(res.user?.role));
      } else {
        // If popup was cancelled or closed or blocked, seamlessly offer Google Account Chooser
        setIsGoogleModalOpen(true);
        if (res.error && res.code !== 'auth/popup-closed-by-user') {
          setError(res.error);
        }
      }
    } catch (err: any) {
      console.warn('Google signin direct note:', err);
      setIsGoogleModalOpen(true);
      setError(formatAuthError(err, 'google'));
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchGooglePopup = async () => {
    await handleGoogleSignInDirect();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signin') {
        const res = await authService.signIn(email, password);
        if (res.user) {
          navigate(getRedirectDestination(res.user.role));
        } else {
          setError(formatAuthError(res.error || 'Invalid credentials. Please verify your email and password.'));
        }
      } else {
        // Sign Up
        if (!fullName.trim() || !email.trim() || !password) {
          setError('Please fill out all required fields.');
          setLoading(false);
          return;
        }

        if (phoneNumber.trim() && phoneNumber.trim().length !== 10) {
          setError('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
          setLoading(false);
          return;
        }

        const roleToAssign = requestAdmin ? 'admin' : 'user';
        const res = await authService.signUp(fullName, email, password, phoneNumber, roleToAssign);

        if (res.user) {
          setSuccessMsg('Account registered successfully! Redirecting to home...');
          setTimeout(() => {
            navigate(getRedirectDestination(res.user?.role));
          }, 800);
        } else {
          setError(formatAuthError(res.error || 'Failed to create account.'));
        }
      }
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={mode === 'signin' ? "Sign In | Talent Path Portal" : "Create Account | Talent Path Portal"}
        description="Access student applications, course updates, counseling sessions, and management tools at Talent Path Solutions."
      />

      <section className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-brand-bgLight relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-soft-xl relative z-10 text-left space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block mb-1">
              <span className="font-heading font-black text-2xl tracking-tighter text-brand-darkText">
                TALENT<span className="text-brand-blue">PATH</span>
              </span>
            </Link>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-brand-darkText">
              {mode === 'signin' ? 'Welcome Back.' : 'Create Account.'}
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              {mode === 'signin'
                ? 'Sign in to access your student portal or admin management console.'
                : 'Join Talent Path to track admissions, courses, and advisory guidance.'}
            </p>
          </div>

          {/* Account required notice if arriving from enquiry/registration flow */}
          {(reasonParam || redirectParam) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center text-left">
              <ShieldCheck className="w-4 h-4 mr-2 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Account Required:</strong> Please sign in or create a free account to complete your registration or enquiry.
              </span>
            </div>
          )}

          {/* Existing Active Session Banner */}
          {existingSession && (
            <div className="p-3.5 bg-brand-blueLight/70 border border-brand-blue/30 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-left animate-in fade-in">
              <div>
                <span className="font-bold text-slate-800 block">Already signed in as:</span>
                <span className="text-brand-blue font-semibold text-[11px] block">
                  {existingSession.full_name} ({existingSession.email})
                </span>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate(getRedirectDestination(existingSession.role))}
                  className="flex-1 sm:flex-initial px-3 py-1.5 bg-brand-blue text-white rounded-full text-[11px] font-bold hover:bg-brand-blueHover shadow-soft-sm transition-all"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    authService.signOut();
                    setExistingSession(null);
                  }}
                  className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-rose-600 text-[11px] font-bold hover:bg-slate-50 transition-all"
                >
                  Switch
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-slate-100 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`py-2 rounded-full transition-all ${
                mode === 'signin'
                  ? 'bg-white text-brand-darkText shadow-sm'
                  : 'text-slate-500 hover:text-brand-darkText'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2 rounded-full transition-all ${
                mode === 'signup'
                  ? 'bg-white text-brand-darkText shadow-sm'
                  : 'text-slate-500 hover:text-brand-darkText'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-14 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
                  />
                  {phoneNumber.length > 0 && (
                    <span className={`text-[10px] font-bold absolute right-3.5 top-1/2 -translate-y-1/2 ${
                      phoneNumber.length === 10 ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {phoneNumber.length}/10
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <label className="flex items-center space-x-2 cursor-pointer text-slate-700 font-semibold text-xs">
                  <input
                    type="checkbox"
                    checked={requestAdmin}
                    onChange={(e) => setRequestAdmin(e.target.checked)}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>Create with Administrative Clearance (Staff Access)</span>
                </label>
                <p className="text-[10px] text-slate-400 pl-6">
                  Check this if you are a counselor or authorized company team member to unlock the CRM management panel.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-white bg-brand-blue hover:bg-brand-blueHover shadow-pill hover:shadow-pill-hover transition-all flex items-center justify-center disabled:opacity-75"
            >
              <span>{mode === 'signin' ? 'Sign In to Portal' : 'Register & Continue'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>

            {isFirebaseConfigured() && (
              <div className="pt-1">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold uppercase">Or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  id="google-auth-button"
                  onClick={handleGoogleSignInDirect}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-soft-sm active:scale-[0.99] disabled:opacity-75"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? 'Connecting with Google...' : mode === 'signup' ? 'Sign Up with Google' : 'Sign In with Google'}</span>
                </button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(true)}
                    className="text-[11px] text-slate-400 hover:text-brand-blue font-medium transition-colors"
                  >
                    Having trouble? Choose a Google account directly &rarr;
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer toggle note */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-brand-blue hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-brand-blue hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Google Account Chooser Dialogue */}
        <GoogleAccountChooserModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSelectAccount={handleSelectGoogleAccount}
          onLaunchPopup={handleLaunchGooglePopup}
          mode={mode}
          loading={loading}
        />
      </section>
    </>
  );
};
