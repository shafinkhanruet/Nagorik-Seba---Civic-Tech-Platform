import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { 
  FileText, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Archive,
  Hash,
  Download,
  Calendar,
  User,
  X,
  Gavel,
  Scale,
  Award,
  Bell
} from 'lucide-react';

export interface ProcurementDoc {
  id: string;
  type: 'notice' | 'bid' | 'evaluation' | 'award';
  title: string;
  date: string;
  version: string;
  status: 'active' | 'archived' | 'superseded';
  access: 'public' | 'restricted';
  hash: string;
  uploadedBy: string;
  url: string;
  fileType: 'pdf' | 'image';
}

export interface TimelineEvent {
  stage: 'notice' | 'bidding' | 'evaluation' | 'award';
  date: string;
  completed: boolean;
  active: boolean;
}

interface ProcurementViewerProps {
  docs: ProcurementDoc[];
  timeline: TimelineEvent[];
  isAdmin: boolean;
}

export const ProcurementViewer: React.FC<ProcurementViewerProps> = ({ docs, timeline, isAdmin }) => {
  const { t } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<ProcurementDoc | null>(null);

  // Filter docs based on access level
  const visibleDocs = docs.filter(doc => isAdmin || doc.access === 'public');

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'notice': return <Bell size={14} />;
      case 'bidding': return <Gavel size={14} />;
      case 'evaluation': return <Scale size={14} />;
      case 'award': return <Award size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getStageLabel = (stage: string) => t(`stage_${stage}`);

  const getDocTypeBadge = (type: string) => {
    switch(type) {
      case 'notice': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'bid': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'evaluation': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'award': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      
      {/* 1) Timeline (Top) */}
      <div className="mb-6 px-2">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
          <Clock size={14} /> {t('tender_timeline')}
        </h4>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
          {timeline.map((event, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-900 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                event.active 
                  ? 'bg-indigo-500 border-indigo-200 dark:border-indigo-900 text-white shadow-lg shadow-indigo-500/30' 
                  : event.completed 
                    ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-900 text-white' 
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
                {event.completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <div className="text-center">
                <span className={`text-[10px] font-bold uppercase block ${event.active ? 'text-indigo-500' : 'text-slate-500'}`}>
                  {getStageLabel(event.stage)}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">{event.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2) Document List */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-2 px-2">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
            <Archive size={14} /> {t('procurement_docs')}
          </h4>
          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
            {t('official_archive')}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4 pl-2">{t('doc_type')}</div>
            <div className="col-span-3">{t('upload_date')}</div>
            <div className="col-span-2">{t('version')}</div>
            <div className="col-span-3 text-right pr-2">Access</div>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {visibleDocs.length > 0 ? (
              visibleDocs.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="grid grid-cols-12 gap-2 p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <div className="col-span-4 pl-2 flex items-center gap-2">
                    <FileText size={14} className="text-slate-400 group-hover:text-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{doc.title}</p>
                      <span className={`inline-block text-[9px] px-1.5 rounded mt-0.5 ${getDocTypeBadge(doc.type)}`}>
                        {doc.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center text-xs text-slate-500 font-mono">
                    {doc.date}
                  </div>
                  <div className="col-span-2 flex items-center text-xs text-slate-500">
                    v{doc.version}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
                    {doc.access === 'restricted' ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                        <Lock size={8} /> {t('access_restricted')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                        <ShieldCheck size={8} /> {t('access_public')}
                      </span>
                    )}
                    <Eye size={14} className="text-slate-300 group-hover:text-indigo-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-400 text-xs">
                No documents available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3) Preview Drawer */}
      {selectedDoc && (
        <div className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-sm rounded-xl flex flex-col animate-fade-in border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <FileText className="text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedDoc.title}</h3>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                  ID: {selectedDoc.id} • <span className="text-emerald-500">Verified</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedDoc(null)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-6">
            {/* Preview Area */}
            <div className="flex-1 bg-black/50 rounded-lg border border-slate-800 flex items-center justify-center min-h-[300px]">
              {selectedDoc.fileType === 'image' ? (
                <img src={selectedDoc.url} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-center text-slate-500">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">PDF Preview Unavailable in Demo</p>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded flex items-center gap-2 mx-auto">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              )}
            </div>

            {/* Metadata Sidebar */}
            <div className="w-full md:w-64 space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Metadata</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase mb-0.5">{t('hash')}</span>
                    <span className="text-[10px] font-mono text-indigo-400 break-all">{selectedDoc.hash}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase mb-0.5">{t('uploaded_by')}</span>
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                      <User size={10} /> {selectedDoc.uploadedBy}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase mb-0.5">{t('upload_date')}</span>
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                      <Calendar size={10} /> {selectedDoc.date}
                    </div>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
                  <p className="text-[10px] text-red-400 font-bold mb-2">Admin Controls</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded">
                      Revoke
                    </button>
                    <button className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded">
                      Re-Hash
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};