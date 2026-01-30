import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { Role } from '../types';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  KeyRound,
  Fingerprint,
  Building2
} from 'lucide-react';

export const Login: React.FC = () => {
  const { t, language, login } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedRole, setDetectedRole] = useState<Role>('citizen');

  // Step 1: Verify Credentials & Detect Role
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock Backend Logic
    setTimeout(() => {
      const lowerId = identifier.toLowerCase();
      
      // Admin/Mod Simulation
      if (lowerId.includes('admin') || lowerId.includes('mod') || lowerId.includes('super')) {
        if (password.length > 3) {
          const role = lowerId.includes('super') ? 'superadmin' : lowerId.includes('mod') ? 'moderator' : 'admin';
          setDetectedRole(role);
          setStep(2); // Move to OTP
          setIsLoading(false);
        } else {
          setError('Invalid credentials.');
          setIsLoading(false);
        }
      } 
      // Citizen Simulation
      else if (identifier.length > 0 && password.length > 3) {
        completeLogin('citizen');
      } else {
        setError('Invalid ID or Password.');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Step 2: OTP Verification (For Admins)
  const handleOtpVerify = () => {
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (otp.join('').length === 6) {
        completeLogin(detectedRole);
      } else {
        setIsLoading(false);
        setError('Invalid OTP Code.');
      }
    }, 1500);
  };

  // Finalize Login
  const completeLogin = (role: Role) => {
    login({
      id: `usr-${Math.floor(Math.random() * 10000)}`,
      name: role === 'citizen' ? 'Citizen User' : 'System Administrator',
      role: role,
      token: 'secure-token-xyz-999',
      expiresAt: Date.now() + (role === 'citizen' ? 86400000 : 3600000) // 24h citizen, 1h admin
    });

    setIsLoading(false);

    // Role Router
    if (role === 'citizen') {
      navigate('/app');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 mb-4 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:ring-slate-800">
            {step === 2 ? <ShieldCheck size={40} /> : <Building2 size={40} />}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-serif">
            {t('welcome')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {step === 2 
              ? 'Secure verification required for administrative access.' 
              : (language === 'bn' ? 'নাগরিক সেবা প্ল্যাটফর্মে প্রবেশ করুন' : 'Sign in to the Civic Platform')}
          </p>
        </div>

        <GlassCard className={`border-t-4 ${step === 2 ? 'border-t-red-500' : 'border-t-emerald-500'} shadow-2xl`}>
          
          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  {t('mobileNumber')} / ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white placeholder-slate-400"
                    placeholder="Enter your ID..."
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {t('password')}
                  </label>
                  <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white placeholder-slate-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-slate-900 dark:bg-emerald-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{t('login')} <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold uppercase mb-4">
                  <Lock size={12} /> Admin Access
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Enter Security Code</h3>
                <p className="text-xs text-slate-500 mt-1">We sent a code to your registered device.</p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className="w-10 h-12 text-center text-xl font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all dark:text-white"
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && idx < 5) {
                        document.getElementById(`otp-${idx + 1}`)?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-mono">
                <Fingerprint size={14} /> Biometric ID: Active
              </div>

              {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

              <button
                onClick={handleOtpVerify}
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Secure Login <KeyRound size={18} /></>}
              </button>
              
              <button onClick={() => setStep(1)} className="w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline">
                Cancel Login
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'অ্যাকাউন্ট নেই?' : 'Don\'t have an account?'}{' '}
                <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
                  {t('signup')}
                </Link>
              </p>
            </div>
          )}
        </GlassCard>
        
        <div className="mt-8 text-center">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
             Govt. of Bangladesh Civic Tech Platform
           </p>
        </div>
      </div>
    </div>
  );
};