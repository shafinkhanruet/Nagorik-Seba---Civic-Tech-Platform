import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { ComplianceBanner } from '../components/ComplianceBanner';
import { 
  Unlock, 
  Shield, 
  CheckCircle2, 
  Clock, 
  FileText, 
  UserCheck, 
  AlertTriangle,
  Lock,
  ArrowRight,
  Scale
} from 'lucide-react';

export const IdentityUnlock: React.FC = () => {
  const { t } = useApp();
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: t('unlock_request'), icon: FileText },
    { id: 2, label: t('dual_approval'), icon: UserCheck },
    { id: 3, label: t('legal_review'), icon: Scale }, // Using Scale locally, need import or mock
    { id: 4, label: t('identity_revealed'), icon: Unlock },
  ];

  // Helper for step 3 icon since Scale wasn't in top imports for this file
  const StepIcon = ({ stepId }: { stepId: number }) => {
    if (stepId === 3) return <Shield size={18} />; 
    const s = steps.find(s => s.id === stepId);
    if (!s) return null;
    const Icon = s.icon;
    return <Icon size={18} />;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <ComplianceBanner />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
           <Unlock size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t('identityUnlock')} Flow
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex justify-between mb-8 relative">
         <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
         {steps.map((s) => (
           <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${
                step >= s.id 
                ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-900 text-white' 
                : 'bg-slate-300 dark:bg-slate-700 border-slate-100 dark:border-slate-800 text-slate-500'
              }`}>
                <s.icon size={16} />
              </div>
              <span className={`text-[10px] font-bold uppercase ${step >= s.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {s.label}
              </span>
           </div>
         ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <GlassCard className="min-h-[400px] flex flex-col justify-between">
           
           {/* Step 1: Request */}
           {step === 1 && (
             <div className="animate-fade-in">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <FileText className="text-blue-500" /> Initiate Request
               </h2>
               <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-xl mb-6 flex gap-3">
                 <AlertTriangle className="text-amber-600 shrink-0" />
                 <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                   Unmasking an anonymous reporter requires a valid court order and dual administrator approval. This action will be permanently logged.
                 </p>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Report ID</label>
                   <input type="text" value="REP-8821" readOnly className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-slate-600 dark:text-slate-300" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Court Order Reference</label>
                   <input type="text" placeholder="Enter Case Number..." className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                 </div>
               </div>
             </div>
           )}

           {/* Step 2: Dual Approval */}
           {step === 2 && (
             <div className="animate-fade-in text-center py-8">
               <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                 <Clock size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('dual_approval')}</h3>
               <p className="text-slate-500 text-sm mb-6">Waiting for 2nd Administrator to authorize...</p>
               <div className="flex justify-center gap-4">
                 <div className="flex items-center gap-2 opacity-50">
                   <CheckCircle2 size={20} className="text-emerald-500" /> Admin 1 (You)
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-5 h-5 border-2 border-slate-300 rounded-full border-t-blue-500 animate-spin"></div> Admin 2
                 </div>
               </div>
             </div>
           )}

           {/* Step 3: Legal Review */}
           {step === 3 && (
             <div className="animate-fade-in text-center py-8">
               <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mb-4">
                 <Shield size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('legal_review')}</h3>
               <p className="text-slate-500 text-sm mb-6">System verifying court order authenticity hash...</p>
               <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs text-left">
                 <p>> Verifying signature...</p>
                 <p>> Hash: 0x8f2d...9a1b [MATCH]</p>
                 <p>> Checking jurisdiction... [OK]</p>
                 <p className="animate-pulse">> Decrypting identity key...</p>
               </div>
             </div>
           )}

           {/* Step 4: Reveal */}
           {step === 4 && (
             <div className="animate-fade-in">
               <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl mb-6 text-center">
                 <CheckCircle2 className="text-emerald-500 mx-auto mb-2" size={32} />
                 <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">{t('identity_revealed')}</h3>
                 <p className="text-xs text-emerald-600 dark:text-emerald-300">Audit Log #L-9021 Created</p>
               </div>

               <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">Full Name</p>
                     <p className="font-bold text-lg dark:text-white">Rahim Uddin</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">NID Number</p>
                     <p className="font-bold text-lg dark:text-white">829 392 1102</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">Registered Address</p>
                     <p className="font-bold text-sm dark:text-white">House 45, Road 3, Sector 11, Uttara</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">Mobile</p>
                     <p className="font-bold text-sm dark:text-white">+880 1711 000000</p>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Footer Actions */}
           <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto flex justify-end">
             {step < 4 ? (
               <button 
                 onClick={handleNext}
                 className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"
               >
                 {step === 1 ? 'Submit Request' : step === 2 ? 'Simulate Approval' : 'Complete Review'} <ArrowRight size={16} />
               </button>
             ) : (
               <button className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                 Close Case
               </button>
             )}
           </div>

        </GlassCard>
      </div>
    </div>
  );
};