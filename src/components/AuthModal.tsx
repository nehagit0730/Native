import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, CheckCircle2, AlertCircle, Sparkles, X, Home, Building2, Briefcase, ArrowRight, Check, KeyRound, Mail } from 'lucide-react';
import { Role } from '../types';
import { signInWithGoogle, registerWithEmail, loginWithEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: Role | 'admin';
  initialMode?: 'login' | 'signup';
  onAuthenticated: (role: Role | 'admin', userEmail?: string, userName?: string, userPicture?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetRole: initialTargetRole,
  initialMode = 'login',
  onAuthenticated
}) => {
  const [activeRole, setActiveRole] = useState<Role | 'admin'>(initialTargetRole);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [authType, setAuthType] = useState<'google' | 'email'>('google');

  // Admin Login Form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Email / Password Auth State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Google Login state for user roles
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);
  const [oauthStep, setOauthStep] = useState<'form' | 'connecting' | 'success'>('form');

  useEffect(() => {
    setActiveRole(initialTargetRole);
    setAuthMode(initialMode);
    setGoogleSuccess(false);
    setOauthStep('form');
    setAuthError('');
    setEmailInput('');
    setPasswordInput('');
    setNameInput('');
  }, [initialTargetRole, initialMode, isOpen]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin123') {
      setAdminError('');
      onAuthenticated('admin', 'admin@shinenative.com', 'System Administrator', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80');
      onClose();
    } else {
      setAdminError('Invalid Admin credentials.');
    }
  };

  // Real Firebase Google Sign-In
  const handleRealFirebaseGoogle = async () => {
    setOauthStep('connecting');
    setIsSigningIn(true);
    setAuthError('');

    try {
      const fbUser = await signInWithGoogle();
      const email = fbUser.email || `${activeRole}@shinenative.com`;
      const name = fbUser.displayName || `Verified ${activeRole.toUpperCase()}`;
      const picture = fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

      setIsSigningIn(false);
      setOauthStep('success');
      setGoogleSuccess(true);

      setTimeout(() => {
        onAuthenticated(activeRole, email, name, picture);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Firebase Google Sign-In error:', err);
      setIsSigningIn(false);
      setOauthStep('form');

      if (
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain')
      ) {
        setAuthError('Domain Authorization: Please add your domain in Firebase Console > Authentication > Settings > Authorized Domains to enable Google Sign-In popup. Alternatively, use Email & Password auth.');
      } else {
        setAuthError(err.message || 'Firebase Google sign-in failed. Please try again or use Email & Password.');
      }
    }
  };

  // Real Email & Password Firebase Auth
  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    setIsSigningIn(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        const fbUser = await registerWithEmail(emailInput.trim(), passwordInput.trim(), nameInput.trim() || undefined);
        onAuthenticated(
          activeRole,
          fbUser.email || emailInput.trim(),
          fbUser.displayName || nameInput.trim() || emailInput.split('@')[0],
          fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        );
      } else {
        const fbUser = await loginWithEmail(emailInput.trim(), passwordInput.trim());
        onAuthenticated(
          activeRole,
          fbUser.email || emailInput.trim(),
          fbUser.displayName || emailInput.split('@')[0],
          fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        );
      }
      onClose();
    } catch (err: any) {
      console.error('Firebase Email Auth Error:', err);
      let errMsg = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Email is already registered. Please log in instead.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password should be at least 6 characters.';
      }
      setAuthError(errMsg);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-400/40 rounded-2xl text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Shine Native Firebase Auth
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Real Firebase Auth
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                {authMode === 'signup' ? 'Create Account & Sign Up' : 'Log In to Portal'}
              </h3>
            </div>
          </div>

          {/* Role Tabs inside Modal Header */}
          <div className="flex items-center space-x-1.5 mt-5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 overflow-x-auto">
            {[
              { id: 'buyer', label: 'Buyer', icon: User },
              { id: 'owner', label: 'Owner', icon: Home },
              { id: 'broker', label: 'Broker', icon: Briefcase },
              { id: 'builder', label: 'Builder', icon: Building2 },
              { id: 'admin', label: 'Admin', icon: Lock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveRole(tab.id as Role | 'admin');
                  setOauthStep('form');
                  setAuthError('');
                }}
                className={`flex-1 min-w-[70px] py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  activeRole === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="capitalize">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode Switcher: Sign Up vs Log In */}
          {activeRole !== 'admin' && (
            <div className="space-y-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    authMode === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Provider selector: Google vs Email/Password */}
              <div className="flex items-center justify-center space-x-4 text-xs font-bold border-b border-slate-100 pb-2">
                <button
                  onClick={() => setAuthType('google')}
                  className={`pb-1 transition-all cursor-pointer flex items-center space-x-1.5 ${
                    authType === 'google' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google SSO</span>
                </button>
                <button
                  onClick={() => setAuthType('email')}
                  className={`pb-1 transition-all cursor-pointer flex items-center space-x-1.5 ${
                    authType === 'email' ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>
              </div>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {activeRole === 'admin' ? (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminLogin} className="space-y-4">

              {adminError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl shadow-lg text-xs cursor-pointer transition-all"
              >
                Authenticate System Administrator
              </button>
            </form>
          ) : authType === 'email' ? (
            /* EMAIL / PASSWORD REAL FIREBASE AUTH FORM */
            <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder={`your.${activeRole}@gmail.com`}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-extrabold py-3 rounded-xl shadow-md text-xs cursor-pointer transition-all flex items-center justify-center space-x-2"
              >
                {isSigningIn ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{authMode === 'signup' ? `Create Firebase ${activeRole.toUpperCase()} Account` : `Sign In to Firebase ${activeRole.toUpperCase()} Account`}</span>
                )}
              </button>
            </form>
          ) : (
            /* GOOGLE OAUTH FOR BUYER, OWNER, BROKER, BUILDER */
            <div className="space-y-5">
              {oauthStep === 'connecting' && (
                <div className="p-8 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Connecting to Firebase Google Auth...</h4>
                    <p className="text-xs text-slate-500 mt-1">Authenticating profile with Google Accounts & Firebase Auth</p>
                  </div>
                </div>
              )}

              {oauthStep === 'success' && (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-base">Firebase Google SSO Complete!</h4>
                  <p className="text-xs text-emerald-700">
                    Successfully authenticated for <span className="font-bold">{activeRole.toUpperCase()}</span> portal.
                  </p>
                </div>
              )}

              {oauthStep === 'form' && (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-600">
                      {authMode === 'signup' 
                        ? `Create a real Firebase-authenticated Google profile for your `
                        : `Sign in with Google to access your `}
                      <span className="font-bold uppercase text-blue-600">{activeRole}</span> portal.
                    </p>
                  </div>

                  {/* REAL FIREBASE GOOGLE AUTH BUTTON */}
                  <button
                    onClick={handleRealFirebaseGoogle}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg text-xs flex items-center justify-center space-x-3 transition-all cursor-pointer hover:scale-[1.01]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>
                      {authMode === 'signup' ? 'Sign Up with Google' : 'Google Login'}
                    </span>
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-slate-500">
                      Or switch to <button onClick={() => setAuthType('email')} className="text-blue-600 font-bold underline cursor-pointer">Email & Password</button> for direct credentials.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

