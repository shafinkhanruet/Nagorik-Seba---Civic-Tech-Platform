import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { RestrictedButton } from '../components/RestrictedWrapper';
import { 
  Siren, 
  ShieldAlert, 
  Lock, 
  Power, 
  AlertTriangle, 
  AlertOctagon, 
  PauseCircle, 
  MessageSquareOff, 
  FileWarning, 
  Fingerprint, 
  CheckCircle2, 
  Clock, 
  X,
  History
} from 'lucide-react';

type SystemStatus = 'normal' | 'elevated' | 'lockdown';

interface CrisisLog {
  id: string;
  activatedBy: string;
  reason: string;
  scope: string;
  timestamp: string;
  active: boolean;
}

const INITIAL_LOGS: CrisisLog[] = [
  {
    id: 'CR-102',
    activatedBy: 'Admin_Super',
    reason: 'Cyber Attack (DDoS) on Voting Nodes',
    scope: 'System Wide',
    timestamp: '2023-10-15 14:30',
    active: false
  }
];

export const CrisisControl: React.FC = () => {
  const { t } = useApp();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('normal');
  const [reason, setReason] = useState('');
  const [reasonCategory, setReasonCategory] = useState('Cyber Attack');
  const [logs, setLogs] = useState<CrisisLog[]>(INITIAL_LOGS);
  
  // Toggles State
  const [toggles, setToggles] = useState({
    freezeVoting: false,
    pauseReports: false,
    lockEvidence: false,
    disableComments: false,
    legalMode: false,
    forceReAuth: false
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [admin1Code, setAdmin1Code] = useState('');
  const [admin2Code, setAdmin2Code] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown Effect
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isProcessing) {
      // Activation complete
      activateCrisis();
    }
    return () => clearInterval(timer);
  }, [countdown, isProcessing]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const initiateActivation = () => {
    setShowModal(true);
  };

  const confirmActivation = () => {
    if (admin1Code && admin2Code) {
      setIsProcessing(true);
      setCountdown(3); // 3 seconds simulation
    }
  };

  const activateCrisis = () => {
    setSystemStatus('lockdown');
    setToggles({
      freezeVoting: true,
      pauseReports: true,
      lockEvidence: true,
      disableComments: true,
      legalMode: true,
      forceReAuth: true
    });
    
    // Add log
    const newLog: CrisisLog = {
      id: `CR-${Math.floor(Math.random() * 1000)}`,
      activatedBy: 'Admin_Current & Admin_Auth2',
      reason: `${reasonCategory}: ${reason}`,
      scope: 'Full Lockdown',
      timestamp: new Date().toLocaleString(),
      active: true
    };
    setLogs([newLog, ...logs]);
    
    setIsProcessing(false);
    setShowModal(false);
    setAdmin1Code('');
    setAdmin2Code('');
  };

  const deactivateCrisis = () => {
    setSystemStatus('normal');
    setToggles({
      freezeVoting: false,
      pauseReports: false,
      lockEvidence: false,
      disableComments: false,
      legalMode: false,
      forceReAuth: false
    });
    // Update log to show inactive (mock logic)
    setLogs(prev => prev.map((l, i) => i === 0 ? { ...l, active: false } : l));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1) Header & Status Banner */}
      <div className={`
        rounded-xl p-6 border-l-8 shadow-xl transition-all duration-500
        ${systemStatus === 'lockdown' 
          ? 'bg-red-950/90 border-red-600 shadow-red-900/20' 
          : 'bg-slate-900 border-slate-700'}
      `}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Siren className={`w-8 h-8 ${systemStatus === 'lockdown' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              জরুরি অবস্থা নিয়ন্ত্রণ (Crisis Control)
            </h1>
            <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-wider">
              System Status: <span className={`font-bold ${systemStatus === 'lockdown' ? 'text-red-500' : 'text-emerald-500'}`}>{systemStatus.toUpperCase()}</span>
            </p>
          </div>
          
          {systemStatus === 'lockdown' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600 rounded-lg animate-pulse">
              <AlertTriangle className="text-red-500" size={20} />
              <span className="text-red-500 font-bold text-sm uppercase">Active Emergency Protocol</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2) Emergency Toggles (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="bg-slate-900/50 border-slate-800">
            <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <Power size={20} className="text-amber-500" /> System Overrides
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'freezeVoting', label: 'Freeze All Voting', icon: AlertOctagon, desc: 'Stop all vote inputs immediately.' },
                { key: 'pauseReports', label: 'Pause New Reports', icon: PauseCircle, desc: 'Prevent new citizen submissions.' },
                { key: 'lockEvidence', label: 'Lock Evidence Vault', icon: Lock, desc: 'Read-only mode for all evidence.' },
                { key: 'disableComments', label: 'Disable Comments', icon: MessageSquareOff, desc: 'Stop public discussions.' },
                { key: 'legalMode', label: 'Legal-Only Mode', icon: FileWarning, desc: 'Only verify court orders.' },
                { key: 'forceReAuth', label: 'Force Admin Re-Auth', icon: ShieldAlert, desc: 'Logout all active sessions.' },
              ].map((item) => (
                <div 
                  key={item.key}
                  // onClick={() => handleToggle(item.key as keyof typeof toggles)} 
                  // REPLACED with Restricted logic below
                  className={`
                    p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-4 relative overflow-hidden group
                    ${toggles[item.key as keyof typeof toggles] 
                      ? 'bg-red-900/30 border-red-600/50' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}
                  `}
                >
                  {/* Overlay Restricted Button if logic needed per item, but here we toggle state */}
                  <div className="absolute inset-0 z-10" onClick={() => handleToggle(item.key as keyof typeof toggles)}></div>

                  <div className={`p-3 rounded-full ${toggles[item.key as keyof typeof toggles] ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${toggles[item.key as keyof typeof toggles] ? 'text-red-400' : 'text-slate-300'}`}>
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`ml-auto w-10 h-5 rounded-full relative transition-colors ${toggles[item.key as keyof typeof toggles] ? 'bg-red-600' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${toggles[item.key as keyof typeof toggles] ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 3) Activation Panel */}
          {systemStatus !== 'lockdown' ? (
            <GlassCard className="border-l-4 border-l-red-600 bg-slate-900/80">
              <h3 className="text-lg font-bold text-slate-200 mb-4">Activation Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Crisis Category</label>
                  <select 
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm outline-none focus:border-red-500"
                  >
                    <option>Cyber Attack</option>
                    <option>Mass Misinformation</option>
                    <option>Court Order</option>
                    <option>National Emergency</option>
                    <option>System Breach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Specific Reason</label>
                  <input 
                    type="text" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="জরুরি অবস্থা চালু করার কারণ লিখুন..."
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm outline-none focus:border-red-500 placeholder-slate-600"
                  />
                </div>
              </div>

              <RestrictedButton 
                permission="action:manage_crisis"
                onClick={initiateActivation}
                disabled={!reason}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                <Siren size={18} /> Activate Crisis Mode
              </RestrictedButton>
            </GlassCard>
          ) : (
            // 6) Deactivation Panel
            <GlassCard className="border-l-4 border-l-emerald-600 bg-slate-900/80 text-center py-10">
               <div className="w-20 h-20 mx-auto bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-pulse">
                 <ShieldAlert size={40} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">System is in Lockdown</h3>
               <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                 All safety protocols are active. Normal operations are suspended. Return to normal only when the threat is neutralized.
               </p>
               <RestrictedButton 
                 permission="action:manage_crisis"
                 onClick={deactivateCrisis}
                 className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all"
               >
                 Return to Normal Operations
               </RestrictedButton>
            </GlassCard>
          )}
        </div>

        {/* 5) Right Column: Logs */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
              <History size={16} /> Crisis Log
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-6 relative pl-2">
               <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-slate-800"></div>
               {logs.map((log, idx) => (
                 <div key={log.id} className="relative pl-8">
                   <div className={`absolute left-2 top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${log.active ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                   <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                     <div className="flex justify-between items-start mb-1">
                       <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${log.active ? 'bg-red-900/50 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                         {log.active ? 'ACTIVE' : 'RESOLVED'}
                       </span>
                       <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                     </div>
                     <p className="text-sm font-bold text-slate-300 mb-1">{log.reason}</p>
                     <p className="text-xs text-slate-500">By: {log.activatedBy}</p>
                   </div>
                 </div>
               ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* 4) Activation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-red-600/50 rounded-2xl shadow-2xl p-6 animate-scale-in">
            
            {!isProcessing ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-3 border border-red-900/50">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Dual Authorization Required</h2>
                  <p className="text-slate-400 text-sm mt-1">Enter admin approval codes to proceed.</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admin 1 Code</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-3 text-slate-600" size={18} />
                      <input 
                        type="password"
                        value={admin1Code}
                        onChange={(e) => setAdmin1Code(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-red-500 font-mono tracking-widest"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admin 2 Code</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-3 text-slate-600" size={18} />
                      <input 
                        type="password" 
                        value={admin2Code}
                        onChange={(e) => setAdmin2Code(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-red-500 font-mono tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-lg mb-6 flex gap-3 items-start">
                   <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                   <p className="text-xs text-red-200">
                     Warning: This action will be permanently logged in the audit trail. False activation is a punishable offense.
                   </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmActivation}
                    disabled={!admin1Code || !admin2Code}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                 <div className="text-6xl font-black text-red-500 mb-4 animate-ping font-mono">
                   {countdown}
                 </div>
                 <h3 className="text-xl font-bold text-white uppercase tracking-widest">Engaging Protocols</h3>
                 <p className="text-slate-500 text-sm mt-2">Do not close this window...</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};