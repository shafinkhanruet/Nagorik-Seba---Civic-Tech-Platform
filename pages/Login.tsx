
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useMockApi } from '../hooks/useMockApi';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  KeyRound,
  Fingerprint,
  Building2,
  Globe,
  Activity,
  Users
} from 'lucide-react';

export const Login: React.FC = () => {
  const { t, language, login, toggleLanguage } = useApp();
  const api = useMockApi();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [tempUser, setTempUser] = useState<any>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate network delay for effect
      await new Promise(resolve => setTimeout(resolve, 800));

      if (password.length < 4) throw new Error("Invalid credentials");
      const user = await api.login(identifier);
      
      if (['admin', 'superadmin', 'moderator'].includes(user.role)) {
        setTempUser(user);
        setStep(2);
        setIsLoading(false);
      } else {
        completeLogin(user);
      }

    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (otp.join('').length === 6) {
        if (tempUser) {
          completeLogin(tempUser);
        }
      } else {
        setIsLoading(false);
        setError('Invalid OTP Code.');
      }
    }, 1000);
  };

  const completeLogin = (user: any) => {
    login(user);
    setIsLoading(false);
    if (user.role === 'citizen') {
      navigate('/app');
    } else {
      navigate('/admin');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Left Panel - Hero/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center p-12">
        {/* Background Gradients/Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-900/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577017040065-6505283101c7?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay z-0"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/30 rounded-full blur-[100px] animate-pulse z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-400/30 rounded-full blur-[100px] animate-pulse z-10" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-20 text-white max-w-lg">
           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl shadow-emerald-900/20">
             <Building2 size={32} className="text-emerald-300" />
           </div>
           
           <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">
             Building a Better <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-100">
               Tomorrow, Together.
             </span>
           </h1>
           
           <p className="text-lg text-emerald-100/90 leading-relaxed mb-10 font-light">
             {language === 'bn' 
               ? 'নাগরিক সেবা প্ল্যাটফর্মে আপনাকে স্বাগতম। আপনার মতামত এবং অংশগ্রহণ আমাদের শহরের উন্নয়নে গুরুত্বপূর্ণ ভূমিকা রাখবে।'
               : 'Join the transparent civic engagement platform. Report issues, track projects, and vote on community initiatives securely.'}
           </p>
           
           {/* Stats */}
           <div className="flex gap-8 border-t border-white/10 pt-8">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <Users size={18} className="text-emerald-300" />
                 <p className="text-3xl font-bold">12k+</p>
               </div>
               <p className="text-xs text-emerald-200 uppercase tracking-wider font-bold">Active Citizens</p>
             </div>
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <Activity size={18} className="text-emerald-300" />
                 <p className="text-3xl font-bold">98%</p>
               </div>
               <p className="text-xs text-emerald-200 uppercase tracking-wider font-bold">Resolution Rate</p>
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
         {/* Mobile Background Texture */}
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50 dark:opacity-5 lg:hidden -z-10"></div>
         
         <div className="w-full max-w-[400px]">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-10">
               <div className="lg:hidden flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                 <Building2 size={24} />
                 <span>Nagorik Seba</span>
               </div>
               <button 
                 onClick={toggleLanguage}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-auto"
               >
                 <Globe size={14} />
                 {language === 'bn' ? 'English' : 'বাংলা'}
               </button>
            </div>

            {/* Header Text */}
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                 {step === 1 ? (language === 'bn' ? 'স্বাগতম!' : 'Welcome Back') : (language === 'bn' ? 'নিরাপত্তা যাচাই' : 'Security Check')}
               </h2>
               <p className="text-slate-500 dark:text-slate-400">
                 {step === 1 
                   ? (language === 'bn' ? 'প্রবেশ করতে আপনার তথ্য দিন' : 'Please enter your details to sign in.') 
                   : (language === 'bn' ? 'আপনার ডিভাইসে পাঠানো কোডটি দিন' : 'Enter the code sent to your device.')}
               </p>
            </div>

            {/* Step 1: Credentials */}
            {step === 1 && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2 ml-1">
                    {t('mobileNumber')} / ID
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors text-slate-400 group-focus-within:text-emerald-500">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white text-sm font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                      placeholder="citizen@test..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      {t('password')}
                    </label>
                    <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:underline" tabIndex={-1}>
                      {language === 'bn' ? 'ভুলে গেছেন?' : 'Forgot?'}
                    </a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors text-slate-400 group-focus-within:text-emerald-500">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white text-sm font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {t('login')} 
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="pt-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                    <Link to="/signup" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4">
                      {t('signup')}
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: OTP (For Admin/Mod) */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white caret-emerald-500"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-mono bg-slate-100 dark:bg-slate-900 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Fingerprint size={16} className="text-emerald-500" /> 
                  <span className="tracking-wider">SECURE VERIFICATION</span>
                </div>

                {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

                <button
                  onClick={handleOtpVerify}
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{language === 'bn' ? 'যাচাই করুন' : 'Verify Login'} <KeyRound size={18} /></>}
                </button>
                
                <button 
                  onClick={() => setStep(1)} 
                  className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Back to Login'}
                </button>
              </div>
            )}
            
            {/* Footer Text */}
            <div className="mt-12 text-center">
               <div className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                 <ShieldCheck size={12} />
                 Secure Civic Gateway
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
