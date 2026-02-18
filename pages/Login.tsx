
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiClient from '../services/apiClient';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  Globe,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const Login: React.FC = () => {
  const { language, login, toggleLanguage, t } = useApp();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { identifier, password });
      const { user, token } = response.data;
      
      // Inject into context
      localStorage.setItem('auth_token', token);
      login(user);
      
      navigate(user.role === 'citizen' ? '/app' : '/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-950"></div>
        <div className="relative z-10 text-white max-w-lg">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8"><Building2 size={32} /></div>
           <h1 className="text-5xl font-black mb-6">OpenNation</h1>
           <p className="text-xl text-slate-300">Modern Civic Infrastructure for Bangladesh.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
            <div className="flex justify-between items-center mb-10">
               <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all">
                 <Globe size={14} /> {language === 'bn' ? 'English' : 'বাংলা'}
               </button>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('mobileNumber')}</label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 dark:text-white"
                    placeholder="017..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('password')}</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-xs text-red-500 font-bold p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:opacity-90"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Login <ArrowRight size={18} /></>}
              </button>
            </form>
            
            <div className="mt-12 text-center flex justify-center items-center gap-2 opacity-30">
               <ShieldCheck size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Secure Civic Node</span>
            </div>
        </div>
      </div>
    </div>
  );
};
