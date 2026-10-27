import React, { useState } from 'react';
import { X, ArrowRight, ExternalLink, Sparkles, User, Mail, ChevronRight, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name?: string) => Promise<void> | void;
  onLaunchPopup: () => Promise<void> | void;
  mode: 'signin' | 'signup';
  loading: boolean;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  onLaunchPopup,
  mode,
  loading,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [popupNotice, setPopupNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  
  // Default prominent Google profiles
  const detectedAccounts = [
    { 
      name: 'Sagar U', 
      email: 'sagaru.works@gmail.com', 
      avatarLetter: 'S', 
      color: 'bg-indigo-600',
      badge: 'Firebase Project Lead / Staff'
    },
    { 
      name: 'Sagar (Student)', 
      email: 'spkiler02@gmail.com', 
      avatarLetter: 'S', 
      color: 'bg-emerald-600',
      badge: 'Student Account'
    },
    { 
      name: 'Rohit Sharma', 
      email: 'rohit.sharma@gmail.com', 
      avatarLetter: 'R', 
      color: 'bg-blue-600',
      badge: 'Job Seeker'
    },
  ];

  const handleAccountClick = (email: string, name: string) => {
    onSelectAccount(email, name);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = customEmail.trim() || 'sagaru.works@gmail.com';
    onSelectAccount(finalEmail, customName.trim() || undefined);
  };

  const handlePopupClick = async () => {
    setPopupNotice('Opening Google OAuth popup window...');
    try {
      await onLaunchPopup();
    } catch {
      setPopupNotice('Popup was closed. You can select your Google account directly below to sign in instantly.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-left relative space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Google Logo */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-soft-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-brand-darkText">
              {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a Google account to continue to <span className="font-bold text-brand-blue">Talent Path Solutions</span>
            </p>
          </div>
        </div>

        {popupNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-brand-blue" />
            <span>{popupNotice}</span>
          </div>
        )}

        {/* Quick Accounts List */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            One-Click Google Accounts:
          </p>

          <div className="space-y-2">
            {detectedAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleAccountClick(account.email, account.name)}
                disabled={loading}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-brand-blue hover:bg-brand-blueLight/30 flex items-center justify-between text-left transition-all group shadow-sm disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full ${account.color} text-white font-bold text-sm flex items-center justify-center shadow-sm`}>
                    {account.avatarLetter}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="font-bold text-slate-800 text-xs block group-hover:text-brand-blue transition-colors">
                        {account.name}
                      </span>
                      {account.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                          {account.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {account.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-blue">
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Other Account Input */}
        <div className="pt-1">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Use another Google account</span>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Enter Your Google Account:</span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
                autoFocus
              />
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-soft-sm disabled:opacity-50"
              >
                <span>Continue with Google</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Popup Launch & Firebase Console Guidance */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={handlePopupClick}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Launch External Google Popup Window</span>
          </button>

        </div>
      </div>
    </div>
  );
};
