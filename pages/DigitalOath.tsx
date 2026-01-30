import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  ScrollText, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Moon, 
  Sun, 
  Cross, 
  Flower, 
  Globe 
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Religion = 'islam' | 'hindu' | 'christian' | 'buddhist' | 'secular';

export const DigitalOath: React.FC = () => {
  const { t, language } = useApp();
  const [selectedReligion, setSelectedReligion] = useState<Religion>('islam');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timestamp, setTimestamp] = useState<string>('');

  const handleConfirm = () => {
    if (hasAgreed) {
      const now = new Date();
      setTimestamp(now.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
      setIsSubmitted(true);
    }
  };

  const religions: { id: Religion; icon: React.ReactNode }[] = [
    { id: 'islam', icon: <Moon size={16} /> },
    { id: 'hindu', icon: <Sun size={16} /> },
    { id: 'christian', icon: <Cross size={16} /> },
    { id: 'buddhist', icon: <Flower size={16} /> },
    { id: 'secular', icon: <Globe size={16} /> },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 mb-4 shadow-lg ring-4 ring-slate-50 dark:ring-slate-900">
             <ScrollText size={40} strokeWidth={1.5} />
           </div>
           <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-serif">
             {t('oathPageTitle')}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2">
             {language === 'bn' ? 'দায়িত্বশীল নাগরিক হিসেবে শপথ গ্রহণ করুন' : 'Take the oath as a responsible citizen'}
           </p>
        </div>

        {!isSubmitted ? (
          <GlassCard className="border-t-4 border-t-emerald-600">
            {/* Religion Selector */}
            <div className="flex flex-wrap gap-2 justify-center mb-8 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
              {religions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedReligion(r.id); setHasAgreed(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    selectedReligion === r.id 
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm scale-105' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {r.icon}
                  {t(`rel_${r.id}`)}
                </button>
              ))}
            </div>

            {/* Oath Text Box */}
            <div className="relative p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl mb-8 text-center">
              <span className="absolute top-4 left-4 text-4xl text-slate-200 dark:text-slate-700 font-serif">"</span>
              <p className="text-xl md:text-2xl font-serif text-slate-700 dark:text-slate-200 leading-relaxed italic">
                 {t(`text_${selectedReligion}`)}
              </p>
              <span className="absolute bottom-[-10px] right-4 text-4xl text-slate-200 dark:text-slate-700 font-serif">"</span>
            </div>

            {/* Action Area */}
            <div className="space-y-6">
              <label className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <input 
                  type="checkbox" 
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                />
                <span className="font-bold text-slate-700 dark:text-slate-300 select-none">
                  {t('acceptOath')}
                </span>
              </label>

              <button
                onClick={handleConfirm}
                disabled={!hasAgreed}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                {t('confirmOath')} <ArrowRight size={20} />
              </button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="text-center py-10 border-t-4 border-t-emerald-500 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

             <div className="relative z-10">
               <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6 animate-scale-in">
                 <ShieldCheck size={40} />
               </div>
               
               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                 {t('oathAccepted')}
               </h2>
               
               <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 max-w-sm mx-auto mb-8 border border-slate-200 dark:border-slate-700">
                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">
                   {t('acceptedOn')}
                 </p>
                 <p className="text-lg font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                   {timestamp}
                 </p>
               </div>

               <Link 
                 to="/"
                 className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors"
               >
                 {t('backToHome')} <ArrowRight size={16} />
               </Link>
             </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
};