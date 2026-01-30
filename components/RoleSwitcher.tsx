import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { UserCog, ChevronUp, ChevronDown } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const roles: Role[] = ['citizen', 'moderator', 'admin', 'superadmin'];

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className={`bg-slate-800 text-white rounded-lg shadow-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'w-48' : 'w-12 h-12 rounded-full'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 flex items-center justify-center hover:bg-slate-700 transition-colors ${isOpen ? 'justify-between px-4' : ''}`}
        >
          {isOpen ? (
            <>
              <span className="text-xs font-bold uppercase">Dev: Roles</span>
              <ChevronDown size={16} />
            </>
          ) : (
            <UserCog size={24} className="text-emerald-400" />
          )}
        </button>

        {isOpen && (
          <div className="p-2 space-y-1 bg-slate-900 border-t border-slate-700">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-bold uppercase transition-colors ${
                  role === r 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};