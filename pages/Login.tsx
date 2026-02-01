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
  Users,
  Sparkles,
  Shield,
  Zap,
  Star,
  // Added ShieldAlert to fix missing import error on line 250
  ShieldAlert
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (password.length < 4) throw new Error("Invalid credentials");
      const response = await api.auth.login(identifier);
      const user = response as any; 
      
      if (['admin', 'superadmin', 'moderator'].includes(user.role)) {
        setTempUser(user);
        setStep(2);
        setIsLoading(false);
      } else {
        completeLogin(user);
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Check your ID.");
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      if (otp.join('').length === 6) {
        if (tempUser) completeLogin(tempUser);
      } else {
        setIsLoading(false);
        setError('Invalid Security Code.');
      }
    }, 1500);
  };

  const completeLogin = (user: any) => {
    login(user);
    setIsLoading(false);
    navigate(user.role === 'citizen' ? '/app' : '/admin');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      
      {/* Dynamic Left Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-slate-900 items-center justify-center p-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-950 to-emerald-950"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Floating Neon Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>

        <div className="relative z-20 w-full max-w-2xl">
           <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl mb-12 shadow-2xl animate-float">
              <Sparkles size={20} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Next Gen Civic Governance</span>
           </div>
           
           <h1 className="text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
             Modernize Your <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">
               Civic Rights.
             </span>
           </h1>
           
           <p className="text-xl text-slate-300/80 leading-relaxed mb-12 font-medium max-w-lg">
             Transparent. Accountable. Powered by Citizens.
           </p>
           
           <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
             {[
               { icon: Shield, label: 'Secure', val: '256-bit', color: 'text-emerald-400' },
               { icon: Activity, label: 'Realtime', val: 'Live Hub', color: 'text-indigo-400' },
               { icon: Star, label: 'Incentives', val: 'Rewards', color: 'text-amber-400' },
             ].map((stat, i) => (
               <div key={i} className="space-y-2">
                 <stat.icon size={24} className={`${stat.color} mb-3`} />
                 <p className="text-2xl font-black text-white">{stat.val}</p>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{stat.label}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Sleek Right Panel */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 sm:p-20 relative bg-white dark:bg-slate-950">
         <div className="w-full max-w-[420px]">
            
            <div className="flex justify-between items-center mb-20">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Shield size={24} strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase">Nagorik Hub</span>
               </div>
               <button 
                 onClick={toggleLanguage}
                 className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300"
               >
                 <Globe size={14} />
                 {language === 'bn' ? 'EN' : 'বাংলা'}
               </button>
            </div>

            <div className="mb-12">
               <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                 {step === 1 ? (language === 'bn' ? 'স্বাগতম!' : 'Log In') : (language === 'bn' ? 'নিরাপত্তা যাচাই' : '2FA Verify')}
               </h2>
               <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] opacity-60">
                 Secure Digital Identity Gateway
               </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    {t('mobileNumber')} / Digital ID
                  </label>
                  <div className="relative group">
                    <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-[1.5rem] outline-none transition-all dark:text-white font-bold text-base shadow-inner"
                      placeholder="citizen-demo"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {t('password')}
                    </label>
                  </div>
                  <div className="relative group">
                    <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-[1.5rem] outline-none transition-all dark:text-white font-bold text-base shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white font-black rounded-[1.5rem] shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{t('login')} <ArrowRight size={20} /></>}
                </button>

                <div className="pt-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">
                    New Citizen?{' '}
                    <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-black uppercase hover:underline">
                      Create ID
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-12 animate-fade-in">
                <div className="flex justify-between gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className="w-full aspect-square text-center text-3xl font-black rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleOtpVerify}
                    disabled={isLoading}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{language === 'bn' ? 'যাচাই করুন' : 'Unlock Portal'} <KeyRound size={20} /></>}
                  </button>
                  <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">
                    Cancel Request
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-20 flex justify-center items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               {/* Fixed: ShieldAlert is now imported from lucide-react */}
               <ShieldAlert size={20} />
               <Zap size={20} />
               <Fingerprint size={20} />
            </div>
         </div>
      </div>
    </div>
  );
