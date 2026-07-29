import React, { useState } from 'react';
import { ShieldCheck, Lock, User, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import { Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: Role | 'admin';
  onAuthenticated: (role: Role | 'admin', userEmail?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onAuthenticated
}) => {
  // Admin Login Form state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [adminError, setAdminError] = useState('');

  // Google Login state for user roles
  const [googleUserEmail, setGoogleUserEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin') {
      setAdminError('');
      onAuthenticated('admin', 'admin@shinenative.com');
      onClose();
    } else {
      setAdminError('Invalid credentials. Hint: Username = admin, Password = admin');
    }
  };

  const handleGoogleAuth = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      setGoogleSuccess(true);
      setTimeout(() => {
        const email = googleUserEmail.trim() || `user_${targetRole}@gmail.com`;
        onAuthenticated(targetRole as Role, email);
        onClose();
      }, 1000);
    }, 1200);
  };

  const getRoleTitle = () => {
    switch (targetRole) {
      case 'admin':
        return 'System Administrator Login';
      case 'builder':
        return 'Builder Portal Account';
      case 'broker':
        return 'Agent & Broker Portal Account';
      case 'owner':
        return 'Property Owner Account';
      case 'buyer':
        return 'Home Buyer Account';
      default:
        return 'User Account Login';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-400/40 rounded-2xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Shine Native Auth Portal
              </span>
              <h3 className="text-lg font-extrabold text-white">{getRoleTitle()}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {targetRole === 'admin' ? (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <p>
                  <span className="font-bold">Admin Credentials:</span> Username: <code className="font-bold text-amber-700 bg-amber-100 px-1 rounded">admin</code> | Password: <code className="font-bold text-amber-700 bg-amber-100 px-1 rounded">admin</code>
                </p>
              </div>

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
                Login to Admin Dashboard
              </button>
            </form>
          ) : (
            /* GOOGLE SIGNUP / LOGIN FOR OTHER ROLES */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-600">
                  Sign up or sign in directly with your Google account to access your <span className="font-bold capitalize">{targetRole}</span> dashboard.
                </p>
              </div>

              {googleSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-sm">Google Authentication Successful!</h4>
                  <p className="text-xs">Redirecting to {targetRole} dashboard...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Gmail / Google Account Address</label>
                    <input
                      type="email"
                      placeholder={`e.g. yourname.${targetRole}@gmail.com`}
                      value={googleUserEmail}
                      onChange={(e) => setGoogleUserEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Google Login Button */}
                  <button
                    onClick={handleGoogleAuth}
                    disabled={isSigningIn}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold py-3 px-4 rounded-xl shadow-md text-xs flex items-center justify-center space-x-3 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isSigningIn ? 'Connecting to Google OAuth...' : 'Continue with Google / Gmail'}</span>
                  </button>

                  <div className="relative text-center my-2">
                    <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase">
                      Instant One-Click Login
                    </span>
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
