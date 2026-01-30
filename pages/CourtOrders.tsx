import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { ComplianceBanner } from '../components/ComplianceBanner';
import { 
  Gavel, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const CourtOrders: React.FC = () => {
  const { t } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <ComplianceBanner />
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
           <Gavel size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t('courtOrders')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Admin Panel for processing legal disclosure requests.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {!isSuccess ? (
          <GlassCard className="border-t-4 border-t-red-500">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              {t('upload_order')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    {t('court_case_no')}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. WP-2024-5521"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    {t('court_name')}
                  </label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500">
                    <option>High Court Division</option>
                    <option>Magistrate Court</option>
                    <option>Cyber Tribunal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Digital Copy (PDF)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                   <Upload size={32} className="text-slate-400 mb-3 group-hover:text-red-500 transition-colors" />
                   <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Drag & Drop court order here</p>
                   <p className="text-xs text-slate-400 mt-1">Max 10MB, PDF only</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Justification / Notes
                </label>
                <textarea 
                  rows={3}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter details..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                 <button 
                   type="button"
                   className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                 >
                   {isSubmitting ? 'Processing...' : 'Submit Order'}
                 </button>
              </div>
            </form>
          </GlassCard>
        ) : (
          <GlassCard className="text-center py-12 border-t-4 border-t-emerald-500">
             <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6 animate-scale-in">
               <CheckCircle2 size={40} />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Order Logged Successfully</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-6">
               Reference ID: <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">ORD-2024-998</span>
             </p>
             <button 
               onClick={() => setIsSuccess(false)}
               className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
             >
               Submit Another Order
             </button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};