import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  CreditCard, 
  Smartphone, 
  Lock, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2,
  RefreshCw
} from 'lucide-react';

export const Signup: React.FC = () => {
  const { t, language } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1:Form, 2:OTP, 3:Oath, 4:Profile
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  // Timer logic for OTP
  useEffect(() => {
    let interval: number;
    if (step === 2 && otpTimer > 0) {
      interval = window.setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setOtpTimer(30);
    }, 1500);
  };

  const handleOtpVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3); // Go to Oath
    }, 1500);
  };

  const handleOathAccept = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4); // Go to Profile
    }, 1000);
  };

  // Step 1: Registration Form
  const renderForm = () => (
    <div className="animate-fade-in space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl flex gap-3">
        <ShieldAlert className="text-amber-600 dark:text-amber-500 shrink-0" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {t('secureNote')}
        </p>
      </div>

      <form onSubmit={handleInitialSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('nidNumber')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
              placeholder="XXXXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('mobileNumber')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Smartphone size={18} className="text-slate-400" />
            </div>
            <input
              type="tel"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
              placeholder="01XXXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-400" />
            </div>
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none dark:text-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <>{t('verifyIdentity')} <ArrowRight size={18} /></>}
        </button>
      </form>
    </div>
  );

  // Step 2: OTP
  const renderOTP = () => (
    <div className="animate-fade-in text-center space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('otpTitle')}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('otpSent')}</p>
      </div>

      <div className="flex gap-2 justify-center">
        {otpValues.map((val, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            className="w-10 h-12 text-center text-xl font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
            value={val}
            onChange={(e) => {
              const newOtp = [...otpValues];
              newOtp[idx] = e.target.value;
              setOtpValues(newOtp);
              // Auto focus next
              if (e.target.value && idx < 5) {
                const nextInput = document.querySelector(`input:nth-child(${idx + 2})`) as HTMLInputElement;
                nextInput?.focus();
              }
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-center text-sm px-4">
        <span className="text-slate-500">{otpTimer}s remaining</span>
        <button 
          onClick={() => setOtpTimer(30)}
          disabled={otpTimer > 0}
          className={`font-semibold flex items-center gap-1 ${otpTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'}`}
        >
          <RefreshCw size={14} /> {t('resend')}
        </button>
      </div>

      <button
        onClick={handleOtpVerify}
        disabled={isLoading}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <>{t('verify')} <CheckCircle2 size={18} /></>}
      </button>
    </div>
  );

  // Step 3: Oath Modal (Rendered inline for this flow)
  const renderOath = () => (
    <div className="animate-scale-in text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 ring-4 ring-emerald-50 dark:ring-emerald-900/20">
        <ShieldCheck size={40} />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {t('oathTitle')}
      </h2>
      
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif relative">
        <span className="text-4xl text-slate-200 dark:text-slate-700 absolute top-2 left-4">"</span>
        {t('oathText')}
        <span className="text-4xl text-slate-200 dark:text-slate-700 absolute bottom-[-10px] right-4">"</span>
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
          <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">
            {t('iAgree')}
          </span>
        </label>

        <button
          onClick={handleOathAccept}
          disabled={isLoading}
          className="w-full py-3.5 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-xl shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center"
        >
           {isLoading ? <Loader2 className="animate-spin" /> : t('continue')}
        </button>
      </div>
    </div>
  );

  // Step 4: Profile Preview
  const renderProfile = () => (
    <div className="animate-fade-in text-center">
      <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase mb-6 border border-emerald-200 dark:border-emerald-700">
        {t('verifiedCitizen')}
      </div>

      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full animate-pulse opacity-20"></div>
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          alt="Avatar" 
          className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 shadow-xl bg-white"
        />
        <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
          <ShieldCheck size={16} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
        Citizen_98241
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        {t('generatedId')}
      </p>

      {/* Trust Score Meter */}
      <div className="max-w-xs mx-auto mb-8">
        <div className="flex justify-between text-xs font-semibold mb-2">
          <span className="text-slate-500">{t('trustScore')}</span>
          <span className="text-emerald-600">85%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          * {language === 'bn' ? 'নিয়মিত অংশগ্রহণের মাধ্যমে স্কোর বাড়ান' : 'Increase score through regular participation'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all">
          {t('dashboard')} এ যান
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar (Only for steps 1-3) */}
        {step < 4 && (
          <div className="mb-8 px-2">
             <div className="flex justify-between mb-2">
               <span className={`text-xs font-bold ${step >= 1 ? 'text-emerald-600' : 'text-slate-300'}`}>Identity</span>
               <span className={`text-xs font-bold ${step >= 2 ? 'text-emerald-600' : 'text-slate-300'}`}>Verify</span>
               <span className={`text-xs font-bold ${step >= 3 ? 'text-emerald-600' : 'text-slate-300'}`}>Oath</span>
             </div>
             <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                 style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
               ></div>
             </div>
          </div>
        )}

        <GlassCard className={`transition-all duration-500 ${step === 4 ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''}`}>
          {step === 1 && renderForm()}
          {step === 2 && renderOTP()}
          {step === 3 && renderOath()}
          {step === 4 && renderProfile()}
        </GlassCard>
      </div>
    </div>
  );
};