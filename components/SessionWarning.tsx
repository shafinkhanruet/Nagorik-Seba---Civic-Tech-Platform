import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, AlertTriangle, LogOut, RefreshCw, X, ShieldAlert } from 'lucide-react';

export const SessionWarning: React.FC = () => {
  const { timeLeft, extendSession, logout, user } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);

  // Show warning if less than 2 minutes (120000 ms) remain
  const showWarning = timeLeft !== Infinity && timeLeft <= 120000 && timeLeft > 0;
  
  // Format MS to MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reset minimized state if timer resets (e.g. session extended)
  useEffect(() => {
    if (timeLeft > 120000) {
      setIsMinimized(false);
    }
  }, [timeLeft]);

  if (!showWarning || !user) return null;

  // Banner Mode (Fallback)
  if (isMinimized) {
    const isCritical = timeLeft < 30000; // Red if < 30s
    return (
      <div className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 flex items-center justify-between shadow-lg animate-slide-down ${isCritical ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'}`}>
        <div className="flex items-center gap-3">
          <Clock className="animate-pulse" size={18} />
          <span className="text-sm font-bold">
            সেশন শেষ হতে বাকি: <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={extendSession}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} /> বাড়ান
          </button>
          <button 
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ShieldAlert size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Modal Mode (Main)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500 animate-scale-in">
        
        {/* Header */}
        <div className="bg-amber-500 p-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle size={24} /> সেশন শীঘ্রই শেষ হবে
          </h2>
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            title="Minimize"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              নিরাপত্তার কারণে আপনার সেশন <span className="font-bold text-amber-600 dark:text-amber-500">২ মিনিটের</span> মধ্যে শেষ হবে।
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Time Remaining</span>
            <div className={`text-5xl font-mono font-black ${timeLeft < 30000 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-100'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={logout}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> লগ আউট
            </button>
            <button
              onClick={extendSession}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> সেশন বাড়ান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};