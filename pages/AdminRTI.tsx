import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useMockApi } from '../hooks/useMockApi';
import { useToast } from '../context/ToastContext';
import { GlassCard } from '../components/GlassCard';
import { RTIRequest } from '../types';
import { 
  FileQuestion, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Upload,
  Send,
  X
} from 'lucide-react';

export const AdminRTI: React.FC = () => {
  const { t } = useApp();
  const api = useMockApi();
  const { addToast } = useToast();
  
  const [requests, setRequests] = useState<RTIRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Reply State
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await api.getRTIRequests(false);
    setRequests(data);
    if (data.length > 0) setSelectedId(data[0].id);
    setLoading(false);
  };

  const selectedRequest = requests.find(r => r.id === selectedId);

  const handleReply = async () => {
    if (!selectedId || !responseText) return;
    
    setIsSubmitting(true);
    try {
      await api.updateRTIStatus(selectedId, 'responded', responseText);
      addToast('Response sent successfully', 'success');
      setResponseText('');
      loadRequests();
    } catch (e) {
      addToast('Error sending response', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* 1) Request List (Left Column) */}
      <div className="lg:w-1/3 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileQuestion className="text-slate-400" /> RTI Queue
          </h2>
          <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded-full border border-slate-700">
            {requests.filter(r => r.status !== 'responded').length} Pending
          </span>
        </div>

        {/* Search */}
        <div className="relative">
           <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
           <input 
             type="text" 
             placeholder="Search ID or Subject..." 
             className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 outline-none focus:border-indigo-500 transition-colors"
           />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {requests.map((req) => (
            <div 
              key={req.id}
              onClick={() => setSelectedId(req.id)}
              className={`
                p-4 rounded-xl cursor-pointer border transition-all duration-200 group
                ${selectedId === req.id 
                  ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-900/20' 
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-slate-500">{req.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  req.status === 'responded' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
                }`}>
                  {req.status}
                </span>
              </div>
              
              <h3 className={`font-bold text-sm mb-1 ${selectedId === req.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                {req.subject}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{req.department}</span>
                <span>•</span>
                <span>{req.dateFiled.split('T')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2) Detail & Action Panel (Right Column) */}
      <div className="lg:w-2/3 h-full flex flex-col">
        {selectedRequest ? (
          <GlassCard className="flex-1 flex flex-col overflow-hidden border-slate-700 bg-slate-900/80" noPadding>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               {/* Header Info */}
               <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-800">
                 <div>
                   <span className="text-xs font-bold text-indigo-400 bg-indigo-900/20 px-2 py-1 rounded mb-2 inline-block">
                     {selectedRequest.category}
                   </span>
                   <h1 className="text-2xl font-bold text-white mb-2">{selectedRequest.subject}</h1>
                   <div className="flex gap-4 text-sm text-slate-400">
                     <span className="flex items-center gap-1"><Clock size={14} /> Due: {selectedRequest.deadline.split('T')[0]}</span>
                     <span>Applicant: {selectedRequest.applicantName}</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Tracking ID</p>
                   <p className="font-mono text-slate-300">{selectedRequest.trackingId}</p>
                 </div>
               </div>

               {/* Request Body */}
               <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 mb-6">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Request Details</h4>
                 <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                   {selectedRequest.details}
                 </p>
               </div>

               {/* Previous Response (if any) */}
               {selectedRequest.response && (
                 <div className="bg-emerald-900/10 p-5 rounded-xl border border-emerald-900/30 mb-6">
                   <h4 className="text-xs font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2">
                     <CheckCircle2 size={14} /> Official Response Sent
                   </h4>
                   <p className="text-slate-300 leading-relaxed">
                     {selectedRequest.response}
                   </p>
                 </div>
               )}
            </div>

            {/* Action Panel */}
            {selectedRequest.status !== 'responded' && (
              <div className="p-5 border-t border-slate-800 bg-slate-950">
                <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <MessageSquare size={16} /> Draft Response
                </h4>
                <textarea 
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-indigo-500 mb-3 resize-none"
                  placeholder="Type your official response here..."
                />
                
                <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                    <Upload size={14} /> Attach Documents
                  </button>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors">
                      Save Draft
                    </button>
                    <button 
                      onClick={handleReply}
                      disabled={isSubmitting || !responseText}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      <Send size={14} /> Send Response
                    </button>
                  </div>
                </div>
              </div>
            )}

          </GlassCard>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a request to view details
          </div>
        )}
      </div>
    </div>
  );
};