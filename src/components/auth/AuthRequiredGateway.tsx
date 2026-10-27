import { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  LogOut,
  UserCheck
} from 'lucide-react';
import { authService, formatAuthError } from '../../services/authService';
import { isFirebaseConfigured } from '../../lib/firebase';
import { UserAccount } from '../../types';

interface AuthRequiredGatewayProps {
  actionLabel?: string;
  onAuthenticated?: (user: UserAccount) => void;
  children: (user: UserAccount) => React.ReactNode;
}

export const AuthRequiredGateway = ({
  actionLabel = 'submit an enquiry or register',
  onAuthenticated,
  children
}: AuthRequiredGatewayProps) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(authService.getSession());
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Listen to session changes
    const unsub = authService.onSessionChange((user) => {
      setCurrentUser(user);
      if (user && onAuthenticated) {
        onAuthenticated(user);
      }
    });
    return unsub;
  }, [onAuthenticated]);

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signup') {
        if (!fullName.trim() || !email.trim() || !password) {
          setError('Please provide your name, email and password.');
          setLoading(false);
          return;
        }
        if (phone.trim() && phone.trim().length !== 10) {
          setError('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
          setLoading(false);
          return;
        }
        const res = await authService.signUp(fullName, email, password, phone, 'user');
        if (res.user) {
          setSuccessMsg('Account created successfully! You can now proceed with your registration.');
          setCurrentUser(res.user);
          if (onAuthenticated) onAuthenticated(res.user);
        } else {
          setError(formatAuthError(res.error || 'Failed to create account.'));
        }
      } else {
        const res = await authService.signIn(email, password);
        if (res.user) {
          setSuccessMsg('Signed in successfully!');
          setCurrentUser(res.user);
          if (onAuthenticated) onAuthenticated(res.user);
        } else {
          setError(formatAuthError(res.error || 'Invalid email or password.'));
        }
      }
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.signInWithGoogle();
      if (res.user) {
        setCurrentUser(res.user);
        if (onAuthenticated) onAuthenticated(res.user);
      } else {
        setError(res.error || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setError(formatAuthError(err, 'google'));
    } finally {
      setLoading(false);
    }
  };


  // If user is already authenticated, show the verified badge banner and child form
  if (currentUser) {
    return (
      <div className="space-y-6 text-left">
        <div className="p-3.5 bg-brand-blueLight/60 border border-brand-blue/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-brand-darkText flex items-center">
                <span>Logged in as {currentUser.full_name || currentUser.email}</span>
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-700">
                  Verified Account
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                {currentUser.email} • Real-time status sync active
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>

        {/* Render Form with authenticated user details passed */}
        {children(currentUser)}
      </div>
    );
  }

  // If user is NOT authenticated, display the Account Creation / Sign-In required card
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft text-left space-y-6 animate-in fade-in duration-300">
      
      {/* Header Badge & Title */}
      <div className="space-y-2 text-center max-w-md mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Step 1: Account Required to Register or Enquire</span>
        </div>

        <h3 className="font-heading font-black text-xl sm:text-2xl text-brand-darkText">
          {mode === 'signup' ? 'Create Your Student Account' : 'Sign In to Your Account'}
        </h3>
        
        <p className="text-xs text-slate-500">
          To {actionLabel}, track admission deadlines, and receive real-time advisor updates, please create an account or sign in.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-full bg-slate-100 border border-slate-200 max-w-xs mx-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(null); }}
          className={`py-2 rounded-full transition-all ${
            mode === 'signup'
              ? 'bg-white text-brand-darkText shadow-sm'
              : 'text-slate-500 hover:text-brand-darkText'
          }`}
        >
          Create Free Account
        </button>
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
      <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs max-w-md mx-auto">
        {mode === 'signup' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
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
          <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
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
            <label className="block font-bold text-slate-700 mb-1">10-Digit Mobile Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-10 pr-14 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-brand-blue font-mono text-xs"
              />
              {phone.length > 0 && (
                <span className={`text-[10px] font-bold absolute right-3.5 top-1/2 -translate-y-1/2 ${
                  phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {phone.length}/10
                </span>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 mb-1">Password *</label>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full font-heading font-bold text-xs uppercase tracking-wider text-white bg-brand-blue hover:bg-brand-blueHover shadow-pill hover:shadow-pill-hover transition-all flex items-center justify-center disabled:opacity-75"
        >
          <span>{mode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue'}</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>

        {/* Optional Google Sign In if Firebase is configured */}
        {isFirebaseConfigured() && (
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-soft-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{mode === 'signup' ? 'Sign Up with Google' : 'Sign In with Google'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
