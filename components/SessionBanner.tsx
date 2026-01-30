import React from 'react';
import { ShieldCheck, Lock, Clock } from 'lucide-react';

export const SessionBanner: React.FC = () => {
  return (
    <div className="bg-red-950 text-red-200 text-[10px] uppercase font-bold tracking-widest py-1 px-4 flex justify-between items-center border-b border-red-900 select-none">
      <div className="flex items-center gap-2">
        <ShieldCheck size={12} className="text-red-500" />
        <span>Secure Admin Session Active</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={12} />
        <span>Auto-Logout: 29:59</span>
        <Lock size={12} className="text-red-500 ml-2" />
      </div>
    </div>
  );
};