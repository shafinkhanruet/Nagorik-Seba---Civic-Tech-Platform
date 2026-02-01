
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, verifyOtp } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'creds' | 'otp'>('creds');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier);
      setStep('otp');
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(otp);
      // Auth context will update user state, redirect happens in App.tsx or here
      // But explicit redirect is safer
      navigate('/app'); 
    } catch (err) {
      alert('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900 opacity-90"></div>
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
            <Building2 size={32} />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Empowering Citizens, Enabling Trust.</h1>
          <p className="text-slate-400 text-lg">Join the next-generation civic engagement platform. Track projects, report issues, and build a transparent future together.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {step === 'creds' ? 'Welcome Back' : 'Security Check'}
          </h2>
          <p className="text-slate-500 mb-8">
            {step === 'creds' ? 'Please sign in to your account.' : 'Enter the code sent to your device.'}
          </p>

          {step === 'creds' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile or NID</label>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  placeholder="e.g. 017..."
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">One-Time Password</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('creds')}
                className="w-full text-slate-500 text-sm hover:text-emerald-600"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
