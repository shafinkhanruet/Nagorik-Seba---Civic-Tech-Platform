import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  FileClock, 
  Filter, 
  Bot, 
  ShieldAlert, 
  Gavel, 
  Hash, 
  Calendar
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: 'AI' | 'Moderator' | 'Court';
  action: string;
  contentId: string;
  hash: string;
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: 'L-9021',
    timestamp: '2023-11-20 14:30:22',
    actor: 'Court',
    action: 'Identity Reveal Order Executed',
    contentId: 'REP-8821',
    hash: '0x8f2d...9a1b'
  },
  {
    id: 'L-9020',
    timestamp: '2023-11-20 12:15:00',
    actor: 'Moderator',
    action: 'Flagged for Hate Speech',
    contentId: 'COM-1102',
    hash: '0x3c4e...7f1a'
  },
  {
    id: 'L-9019',
    timestamp: '2023-11-20 12:14:55',
    actor: 'AI',
    action: 'Automated Risk Assessment (High)',
    contentId: 'COM-1102',
    hash: '0xa1b2...c3d4'
  },
  {
    id: 'L-9018',
    timestamp: '2023-11-19 09:45:10',
    actor: 'Moderator',
    action: 'Content Removed (Misinfo)',
    contentId: 'REP-7734',
    hash: '0xe5f6...g7h8'
  },
];

export const AuditLogs: React.FC = () => {
  const { t } = useApp();

  const getActorIcon = (actor: string) => {
    switch(actor) {
      case 'AI': return <Bot size={16} className="text-purple-500" />;
      case 'Court': return <Gavel size={16} className="text-red-500" />;
      default: return <ShieldAlert size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileClock className="text-indigo-500" />
          {t('auditLogs')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Immutable system records of all sensitive actions.
        </p>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex gap-4 items-center">
         <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Filter size={16} /> Filter:
         </div>
         <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Last 7 Days</span>
         </div>
         <select className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>All Actors</option>
            <option>AI</option>
            <option>Moderator</option>
            <option>Court</option>
         </select>
      </GlassCard>

      {/* Logs List */}
      <GlassCard className="min-h-[500px]">
         <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 py-2">
            {MOCK_LOGS.map((log) => (
              <div key={log.id} className="relative pl-8">
                 <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700"></div>
                 
                 <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            {getActorIcon(log.actor)}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{log.action}</span>
                       </div>
                       <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <span className="font-semibold uppercase">Content ID:</span>
                          <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{log.contentId}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Hash size={12} />
                          <span className="font-semibold uppercase">{t('audit_hash')}:</span>
                          <span className="font-mono text-indigo-500">{log.hash}</span>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </GlassCard>
    </div>
  );
};