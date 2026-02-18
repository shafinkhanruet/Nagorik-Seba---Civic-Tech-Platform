
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../hooks/api/useAdmin';
import { GlassCard } from '../components/GlassCard';
import { 
  Siren, 
  ShieldAlert, 
  Power, 
  AlertTriangle, 
  Lock, 
  Fingerprint, 
  Loader2 
} from 'lucide-react';

export const CrisisControl: React.FC = () => {
  const { crisisMode } = useApp();
  const { toggleCrisisMode, loading } = useAdmin();
  const [reason, setReason] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authCodes, setAuthCodes] = useState({ a1: '', a2: '' });

  const handleToggle = async () => {
    if (!reason) return;
    await toggleCrisisMode(!crisisMode, reason);
    setShowAuth(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className={`rounded-xl p-6 border-l-8 transition-all duration-500 ${crisisMode ? 'bg-red-950/90 border-red-600' : 'bg-slate-900 border-slate-700'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Siren className={crisisMode ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
              System Crisis Control
            </h1>
            <p className="text-slate-400 mt-2 font-mono uppercase tracking-widest text-xs">
              Status: <span className={crisisMode ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{crisisMode ? 'LOCKDOWN' : 'NORMAL'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <GlassCard className="bg-slate-900/50 border-slate-800">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Power size={20} className="text-amber-500" /> Administrative Override
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Activation Reason (Publicly Logged)</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter justification for system freeze..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-4 text-sm outline-none focus:border-red-500 h-32"
              />
            </div>

            {!showAuth ? (
              <button 
                onClick={() => setShowAuth(true)}
                disabled={!reason || loading}
                className={`w-full py-4 rounded-xl font-black uppercase text-sm tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${crisisMode ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white shadow-lg shadow-red-900/40'}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Siren size={20} /> {crisisMode ? 'End Lockdown' : 'Engage Lockdown'}</>}
              </button>
            ) : (
              <div className="space-y-4 animate-scale-in">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="password" 
                    placeholder="Admin 1 Token" 
                    className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-mono"
                    onChange={(e) => setAuthCodes({...authCodes, a1: e.target.value})}
                  />
                  <input 
                    type="password" 
                    placeholder="Admin 2 Token" 
                    className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-mono"
                    onChange={(e) => setAuthCodes({...authCodes, a2: e.target.value})}
                  />
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowAuth(false)} className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-lg">Cancel</button>
                   <button onClick={handleToggle} disabled={!authCodes.a1 || !authCodes.a2} className="flex-[2] py-3 bg-red-600 text-white font-bold rounded-lg shadow-xl">Confirm Override</button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
