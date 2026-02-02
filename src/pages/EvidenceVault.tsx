
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { SensitiveContentWrapper } from '../components/SensitiveContentWrapper';
import { EvidenceAnalysis } from '../components/EvidenceAnalysis';
import { EvidenceMetrics } from '../types';
import { 
  Shield, 
  Filter, 
  Search, 
  FileImage, 
  FileVideo, 
  FileText, 
  Lock, 
  Eye, 
  MoreVertical, 
  X, 
  Fingerprint, 
  MapPin, 
  Clock, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  EyeOff,
  Download
} from 'lucide-react';

// --- Types & Mock Data ---

type EvidenceType = 'image' | 'video' | 'document';
type Sensitivity = 'Low' | 'Medium' | 'High';
type Status = 'pending' | 'approved' | 'restricted';

interface CustodyEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

interface EvidenceItem {
  id: string;
  reportId: string;
  type: EvidenceType;
  fileName: string;
  thumbnailUrl?: string;
  sensitivity: Sensitivity;
  status: Status;
  uploadTime: string;
  hash: string; // Cryptographic hash
  location: string;
  uploaderTrust: number;
  fileSize: string;
  custodyLog: CustodyEvent[];
  analysis?: EvidenceMetrics; // New field
}

// Generate consistent mock analysis if missing
const generateMockAnalysis = (id: string): EvidenceMetrics => {
  const seed = id.charCodeAt(id.length - 1);
  return {
    credibilityScore: (seed % 40) + 60, // 60-99
    forensicResult: seed % 3 === 0 ? 'authentic' : seed % 3 === 1 ? 'edited' : 'unclear',
    tamperingRisk: seed % 3 === 0 ? 'low' : seed % 3 === 1 ? 'medium' : 'high',
    freshness: seed % 2 === 0 ? 'recent' : 'old',
    chainStatus: seed % 2 === 0 ? 'verified' : 'pending',
    metadataCheck: seed % 2 === 0,
    elaAnalysis: (seed % 100)
  };
};

const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-9921',
    reportId: 'REP-8821',
    type: 'image',
    fileName: 'sand_mining_site_01.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621946881958-69279440656a?auto=format&fit=crop&q=80&w=300',
    sensitivity: 'High',
    status: 'pending',
    uploadTime: '2023-11-20 10:00 AM',
    hash: '0x7f8a...9b2c',
    location: 'Munshiganj (Blurred)',
    uploaderTrust: 88,
    fileSize: '4.2 MB',
    custodyLog: [
      { id: '1', action: 'Uploaded (Encrypted)', actor: 'User_Anonymous', timestamp: '10:00 AM' },
      { id: '2', action: 'Virus Scan Passed', actor: 'System', timestamp: '10:01 AM' }
    ]
  },
  {
    id: 'EVD-9922',
    reportId: 'REP-8821',
    type: 'video',
    fileName: 'dredger_operation.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599839556133-c0d4812f8f7b?auto=format&fit=crop&q=80&w=300',
    sensitivity: 'High',
    status: 'restricted',
    uploadTime: '2023-11-20 10:05 AM',
    hash: '0xe1d2...4f5a',
    location: 'Munshiganj (Blurred)',
    uploaderTrust: 88,
    fileSize: '45.8 MB',
    custodyLog: [
      { id: '1', action: 'Uploaded', actor: 'User_Anonymous', timestamp: '10:05 AM' },
      { id: '2', action: 'Marked Restricted (Privacy)', actor: 'AI_Sentinel', timestamp: '10:06 AM' }
    ]
  },
  {
    id: 'EVD-9925',
    reportId: 'REP-8830',
    type: 'document',
    fileName: 'tender_doc_leaked.pdf',
    sensitivity: 'Medium',
    status: 'approved',
    uploadTime: '2023-11-19 04:30 PM',
    hash: '0x3c4b...1a9d',
    location: 'Dhaka',
    uploaderTrust: 95,
    fileSize: '1.5 MB',
    custodyLog: [
      { id: '1', action: 'Uploaded', actor: 'Engr. Rahman', timestamp: 'Yesterday' },
      { id: '2', action: 'Approved for Review', actor: 'Moderator_01', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'EVD-9928',
    reportId: 'REP-8845',
    type: 'image',
    fileName: 'bribe_exchange.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300',
    sensitivity: 'Low',
    status: 'pending',
    uploadTime: '2023-11-21 09:15 AM',
    hash: '0x9a8b...7c6d',
    location: 'Chittagong',
    uploaderTrust: 65,
    fileSize: '2.8 MB',
    custodyLog: [
      { id: '1', action: 'Uploaded', actor: 'User_902', timestamp: '09:15 AM' }
    ]
  }
];

export const EvidenceVault: React.FC = () => {
  const { t } = useApp();
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSensitivity, setFilterSensitivity] = useState<string>('all');

  const getIcon = (type: EvidenceType) => {
    switch (type) {
      case 'image': return <FileImage size={24} />;
      case 'video': return <FileVideo size={24} />;
      case 'document': return <FileText size={24} />;
    }
  };

  const getSensitivityColor = (level: Sensitivity) => {
    switch (level) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'approved': return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-500/30">Approved</span>;
      case 'restricted': return <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-500/30">Restricted</span>;
      default: return <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-500/30">Pending</span>;
    }
  };

  const filteredEvidence = MOCK_EVIDENCE.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterSensitivity !== 'all' && item.sensitivity !== filterSensitivity) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      
      {/* 5) Security Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center justify-center gap-3 shadow-lg">
        <Lock size={16} className="text-emerald-500" />
        <span className="text-xs font-mono font-bold text-slate-300 tracking-wide">
          "এই প্রমাণগুলো এনক্রিপ্টেড এবং সীমিত অনুমতিতে ব্যবহৃত হয়।" (SECURE VAULT ACCESS)
        </span>
      </div>

      {/* 2) Filters & Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-slate-400" /> Evidence Vault
          </h1>
          <p className="text-slate-500 text-sm mt-1">Secure storage for forensic data and user uploads.</p>
        </div>
        
        <GlassCard className="p-3 flex items-center gap-3 bg-slate-900/80" noPadding>
          <div className="flex items-center gap-2 px-3 text-slate-400 border-r border-slate-700">
            <Filter size={16} />
          </div>
          <select 
            className="bg-transparent text-slate-300 text-sm outline-none cursor-pointer"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
          <div className="w-px h-4 bg-slate-700"></div>
          <select 
            className="bg-transparent text-slate-300 text-sm outline-none cursor-pointer"
            value={filterSensitivity}
            onChange={(e) => setFilterSensitivity(e.target.value)}
          >
            <option value="all">Sensitivity: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="w-px h-4 bg-slate-700"></div>
          <div className="relative">
            <Search size={14} className="absolute left-2 top-2 text-slate-500" />
            <input type="text" placeholder="Hash / ID" className="bg-slate-800 rounded px-2 pl-7 py-1 text-xs text-slate-200 outline-none w-32 focus:w-48 transition-all" />
          </div>
        </GlassCard>
      </div>

      {/* 1) Evidence Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pb-4 custom-scrollbar flex-1">
        {filteredEvidence.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10 flex flex-col"
          >
            {/* Thumbnail */}
            <SensitiveContentWrapper isSensitive={item.sensitivity === 'High'} className="aspect-square bg-slate-950 relative flex items-center justify-center overflow-hidden">
              {item.type === 'image' || item.type === 'video' ? (
                <>
                  <img src={item.thumbnailUrl} alt={item.fileName} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <FileVideo size={32} className="text-white opacity-80" />
                    </div>
                  )}
                </>
              ) : (
                <FileText size={48} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
              )}
              
              {/* Sensitivity Badge */}
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getSensitivityColor(item.sensitivity)} z-30`}>
                {item.sensitivity}
              </div>
            </SensitiveContentWrapper>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 bg-slate-900 flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
                {getStatusBadge(item.status)}
              </div>
              <h4 className="text-xs font-bold text-slate-200 truncate" title={item.fileName}>
                {item.fileName}
              </h4>
              <div className="mt-auto pt-2 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800">
                <span className="flex items-center gap-1"><Lock size={8} /> Encrypted</span>
                <span>{item.fileSize}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3) Detail Drawer (Right Side Overlay) */}
      {selectedItem && (
        <div className="absolute top-0 right-0 bottom-0 w-full md:w-[450px] z-50 animate-slide-in-right">
          <div className="h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Fingerprint className="text-emerald-500" size={18} /> Evidence Details
                </h2>
                <p className="text-xs text-slate-500 font-mono">{selectedItem.id}</p>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
              
              {/* Preview */}
              <div className="bg-black rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center min-h-[200px]">
                <SensitiveContentWrapper isSensitive={selectedItem.sensitivity === 'High'} className="w-full h-full flex items-center justify-center">
                  {selectedItem.type === 'image' ? (
                    <img src={selectedItem.thumbnailUrl} alt="Preview" className="w-full h-auto object-contain" />
                  ) : selectedItem.type === 'video' ? (
                    <div className="text-center">
                      <FileVideo size={48} className="mx-auto text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">Video Preview Unavailable in Safe Mode</p>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <FileText size={48} className="mx-auto text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">{selectedItem.fileName}</p>
                    </div>
                  )}
                </SensitiveContentWrapper>
              </div>

              {/* NEW: Evidence Analysis Panel */}
              <EvidenceAnalysis 
                metrics={selectedItem.analysis || generateMockAnalysis(selectedItem.id)} 
                isAdmin={true} 
              />

              {/* Metadata Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> Metadata
                </h3>
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Hash (SHA-256)</span>
                    <span className="font-mono text-emerald-500">{selectedItem.hash}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Uploaded</span>
                    <span className="text-slate-300">{selectedItem.uploadTime}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Location</span>
                    <span className="text-slate-300 flex items-center gap-1">
                      <MapPin size={10} /> {selectedItem.location}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Report ID</span>
                    <span className="font-mono text-blue-400">{selectedItem.reportId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Uploader Trust</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${selectedItem.uploaderTrust}%` }}></div>
                      </div>
                      <span className="text-emerald-500 font-bold">{selectedItem.uploaderTrust}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chain of Custody */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <History size={14} /> Chain of Custody
                </h3>
                <div className="relative pl-4 space-y-4 border-l border-slate-800 ml-2">
                  {selectedItem.custodyLog.map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-950"></div>
                      <p className="text-xs text-slate-300 font-bold">{log.action}</p>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                        <span>by {log.actor}</span>
                        <span className="font-mono">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 4) Admin Actions */}
            <div className="p-5 border-t border-slate-800 bg-slate-900 space-y-3">
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors">
                  <EyeOff size={14} /> Redact
                </button>
                <button className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-900 hover:border-red-500 font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors">
                  <AlertTriangle size={14} /> Restrict
                </button>
              </div>
              <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold rounded text-xs flex items-center justify-center gap-2 transition-colors">
                <Download size={14} /> Download Original (Audit Logged)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};