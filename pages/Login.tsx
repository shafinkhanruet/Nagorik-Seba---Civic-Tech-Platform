import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { Lock, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { t, language } = useApp();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t('welcome')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {language === 'bn' 
              ? 'নাগরিক সেবায় প্রবেশ করতে লগইন করুন' 
              : 'Login to access civic services'}
          </p>
        </div>

        <GlassCard className="border-t-4 border-t-emerald-500">
          <form className="space-y-5">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {t('login')} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'অ্যাকাউন্ট নেই?' : 'Don\'t have an account?'}{' '}
              <Link to="/signup" className="text-emerald-600 font-semibold hover:underline">
                {t('signup')}
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};