import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  FileText, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  BrainCircuit, 
  Eye, 
  Flag,
  ChevronRight,
  Gavel,
  History,
  AlertOctagon,
  Search,
  Filter
} from 'lucide-react';

// --- Types & Mock Data ---

interface TimelineEvent {
  id: string;
  action: string;
  actor: 'AI' | 'Moderator' | 'System';
  timestamp: string;
  note?: string;
}

interface AdminReportData {
  id: string;
  title: string;
  category: string;
  location: string;
  submittedTime: string;
  truthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'pending' | 'reviewing' | 'escalated';
  flagCount: number;
  reporterTrustScore: number; // Anonymized
  description: string;
  evidence: string[]; // URLs
  aiSummary: string;
  timeline: TimelineEvent[];
}

const MOCK_ADMIN_REPORTS: AdminReportData[] = [
  {
    id: 'REP-2024-8821',
    title: 'Illegal Sand Mining in River',
    category: 'Environment',
    location: 'Munshiganj, Dhaka',
    submittedTime: '2 hours ago',
    truthScore: 92,
    riskLevel: 'High',
    status: 'pending',
    flagCount: 0,
    reporterTrustScore: 88,
    description: 'Local syndicate extracting sand illegally near the bridge pillars. Heavy machinery is being used at night. Threat to bridge structural integrity.',
    evidence: [
      'https://images.unsplash.com/photo-1621946881958-69279440656a?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1599839556133-c0d4812f8f7b?auto=format&fit=crop&q=80&w=300'
    ],
    aiSummary: 'High confidence visual match for dredging equipment. Geolocation matches restricted zone. Pattern matches previous syndicate activity.',
    timeline: [
      { id: '1', action: 'Report Submitted', actor: 'System', timestamp: '10:00 AM' },
      { id: '2', action: 'AI Risk Analysis: HIGH', actor: 'AI', timestamp: '10:01 AM' },
      { id: '3', action: 'Auto-Escalated to Admin', actor: 'System', timestamp: '10:02 AM' }
    ]
  },
  {
    id: 'REP-2024-8825',
    title: 'Hospital Equipment Theft',
    category: 'Healthcare',
    location: 'Chittagong Medical',
    submittedTime: '5 hours ago',
    truthScore: 65,
    riskLevel: 'Critical',
    status: 'reviewing',
    flagCount: 3,
    reporterTrustScore: 45,
    description: 'New X-ray machines are being moved out of the back gate at night. Staff claims maintenance but no work order shown.',
    evidence: [],
    aiSummary: 'Text analysis detects urgent keywords. Low trust score of reporter requires manual verification. No visual evidence provided.',
    timeline: [
      { id: '1', action: 'Report Submitted', actor: 'System', timestamp: '07:00 AM' },
      { id: '2', action: 'Flagged by Community', actor: 'Moderator', timestamp: '09:30 AM', note: 'Potential defamation' }
    ]
  },
  {
    id: 'REP-2024-8830',
    title: 'Road Construction Corruption',
    category: 'Infrastructure',
    location: 'Sylhet Sadar',
    submittedTime: '1 day ago',
    truthScore: 85,
    riskLevel: 'Medium',
    status: 'pending',
    flagCount: 1,
    reporterTrustScore: 95,
    description: 'Contractors using low grade bitumen mixed with kerosene. Road surface peeling off within 2 days of carpeting.',
    evidence: [
       'https://images.unsplash.com/photo-1584463635296-6e1b6c7a3366?auto=format&fit=crop&q=80&w=300'
    ],
    aiSummary: 'Visuals confirm poor material quality. Cross-referenced with active tender ID #T-992.',
    timeline: [
      { id: '1', action: 'Report Submitted', actor: 'System', timestamp: 'Yesterday' },
      { id: '2', action: 'AI Validation Passed', actor: 'AI', timestamp: 'Yesterday' }
    ]
  }
];

export const ReportReview: React.FC = () => {
  const { t } = useApp();
  const [selectedId, setSelectedId] = useState<string>(MOCK_ADMIN_REPORTS[0].id);
  const [actionReason, setActionReason] = useState('');
  const [actionNote, setActionNote] = useState('');

  const selectedReport = MOCK_ADMIN_REPORTS.find(r => r.id === selectedId) || MOCK_ADMIN_REPORTS[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* 1) Report List (Left Column) */}
      <div className="lg:w-1/3 flex flex-col gap-4 h-full">
        {/* List Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-slate-400" /> Review Queue
          </h2>
          <span className="bg-red-900/50 text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-800">
            {MOCK_ADMIN_REPORTS.length} Pending
          </span>
        </div>

        {/* Search/Filter */}
        <div className="flex gap-2">
           <div className="relative flex-1">
             <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
             <input 
               type="text" 
               placeholder="Search ID..." 
               className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 outline-none focus:border-red-800 transition-colors"
             />
           </div>
           <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white">
             <Filter size={18} />
           </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {MOCK_ADMIN_REPORTS.map((report) => (
            <div 
              key={report.id}
              onClick={() => setSelectedId(report.id)}
              className={`
                p-4 rounded-xl cursor-pointer border transition-all duration-200 group
                ${selectedId === report.id 
                  ? 'bg-slate-800 border-red-600 shadow-lg shadow-red-900/20' 
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getRiskColor(report.riskLevel)}`}>
                  {report.riskLevel}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{report.submittedTime}</span>
              </div>
              
              <h3 className={`font-bold text-sm mb-1 ${selectedId === report.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                {report.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <MapPin size={12} /> {report.location}
              </div>

              <div className="flex justify-between items-center border-t border-slate-700/50 pt-2 mt-2">
                <span className="text-[10px] font-mono text-slate-500">{report.id}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <BrainCircuit size={12} /> {report.truthScore}% Truth
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2) Detail Review Panel (Right Column) */}
      <div className="lg:w-2/3 h-full flex flex-col">
        <GlassCard className="flex-1 flex flex-col overflow-hidden border-slate-700 bg-slate-900/80" noPadding>
          
          {/* Safety Banner */}
          <div className="bg-red-950/40 border-b border-red-900/30 p-3 flex items-center justify-center gap-2 text-red-200">
            <Gavel size={16} className="text-red-500" />
            <span className="text-xs font-bold font-sans">
              "সব সিদ্ধান্ত আইনি ও নৈতিক নীতিমালার অধীনে নেওয়া হয়।" (All decisions are legally & ethically bound)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
             {/* Header Info */}
             <div className="flex justify-between items-start mb-6">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">{selectedReport.category}</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded font-mono">{selectedReport.id}</span>
                 </div>
                 <h1 className="text-2xl font-bold text-white mb-1">{selectedReport.title}</h1>
                 <p className="text-slate-400 text-sm flex items-center gap-2">
                   <MapPin size={14} /> {selectedReport.location}
                 </p>
               </div>
               <div className="text-right">
                 <div className="text-xs text-slate-500 font-bold uppercase mb-1">Reporter Trust</div>
                 <div className="flex items-center justify-end gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${selectedReport.reporterTrustScore}%` }}></div>
                    </div>
                    <span className="text-emerald-500 font-bold">{selectedReport.reporterTrustScore}%</span>
                 </div>
                 <span className="text-[10px] text-slate-600 uppercase tracking-widest">Anonymous</span>
               </div>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* Description & Evidence */}
                <div className="space-y-6">
                   <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <FileText size={14} /> Incident Report
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {selectedReport.description}
                      </p>
                   </div>
                   
                   <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Eye size={14} /> Evidence Gallery
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedReport.evidence.length > 0 ? (
                          selectedReport.evidence.map((img, idx) => (
                            <img key={idx} src={img} alt="Evidence" className="rounded-lg border border-slate-700 h-32 w-full object-cover hover:opacity-80 cursor-pointer" />
                          ))
                        ) : (
                          <div className="col-span-2 h-24 flex items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700 border-dashed text-slate-500 text-xs">
                             No Visual Evidence Provided
                          </div>
                        )}
                      </div>
                   </div>
                </div>

                {/* AI & Influence */}
                <div className="space-y-6">
                   <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/30 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-indigo-900/20">
                        <BrainCircuit size={120} />
                      </div>
                      <h3 className="text-xs font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2 relative z-10">
                        <BrainCircuit size={14} /> AI Forensics
                      </h3>
                      <p className="text-sm text-indigo-200 relative z-10 mb-4">
                        {selectedReport.aiSummary}
                      </p>
                      
                      <div className="space-y-3 relative z-10">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Content Integrity</span>
                            <span className="text-emerald-400 font-bold">{selectedReport.truthScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedReport.truthScore}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Risk Assessment</span>
                            <span className="text-red-400 font-bold">{selectedReport.riskLevel}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: selectedReport.riskLevel === 'Critical' ? '95%' : selectedReport.riskLevel === 'High' ? '75%' : '40%' }}></div>
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Decision Timeline */}
                   <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <History size={14} /> Decision Timeline
                      </h3>
                      <div className="space-y-4 pl-2">
                        {selectedReport.timeline.map((event, idx) => (
                           <div key={idx} className="relative pl-6 border-l border-slate-700">
                             <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${event.actor === 'AI' ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
                             <div className="flex justify-between items-start">
                               <div>
                                 <p className="text-xs font-bold text-slate-200">{event.action}</p>
                                 <p className="text-[10px] text-slate-500">{event.actor}</p>
                                 {event.note && <p className="text-[10px] text-red-400 mt-1 italic">Note: {event.note}</p>}
                               </div>
                               <span className="text-[10px] text-slate-600 font-mono">{event.timestamp}</span>
                             </div>
                           </div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 3) Actions Panel (Fixed Bottom) */}
          <div className="p-4 border-t border-slate-800 bg-slate-950">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
               
               <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Admin Note (Legal Record)</label>
                 <textarea 
                   value={actionNote}
                   onChange={(e) => setActionNote(e.target.value)}
                   placeholder="Justification for action..."
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-slate-500 h-16 resize-none"
                 />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Reason Code</label>
                  <select 
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-slate-500 h-[38px]"
                  >
                    <option value="">Select Reason...</option>
                    <option value="verified">Verified Accurate</option>
                    <option value="insufficient">Insufficient Evidence</option>
                    <option value="violation">Policy Violation</option>
                    <option value="legal">Legal Request</option>
                  </select>
                  <button className="w-full py-2 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                     Request Redaction
                  </button>
               </div>

               <div className="flex flex-col gap-2">
                  <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} /> প্রকাশ করুন (Publish)
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg">
                      Hold
                    </button>
                    <button className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
               </div>
             </div>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};