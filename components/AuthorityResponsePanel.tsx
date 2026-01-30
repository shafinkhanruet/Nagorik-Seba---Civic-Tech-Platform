import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  Send, 
  Paperclip,
  X
} from 'lucide-react';

export interface AuthorityResponseData {
  department: string;
  content: string;
  date: string;
  status: 'verified' | 'review' | 'disputed';
  attachments: string[];
}

interface AuthorityResponseProps {
  data?: AuthorityResponseData;
  canManage: boolean;
  onSave: (data: AuthorityResponseData) => void;
}

export const AuthorityResponsePanel: React.FC<AuthorityResponseProps> = ({ data, canManage, onSave }) => {
  const { language } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [dept, setDept] = useState(data?.department || '');
  const [text, setText] = useState(data?.content || '');
  // Mock file handling for UI
  const [files, setFiles] = useState<string[]>(data?.attachments || ['official_statement.pdf']);

  const handleSubmit = () => {
    onSave({
      department: dept,
      content: text,
      date: new Date().toLocaleDateString(),
      status: 'review',
      attachments: files
    });
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified': return <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200"><CheckCircle2 size={10} /> Verified</span>;
      case 'disputed': return <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200"><AlertCircle size={10} /> Disputed</span>;
      default: return <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200"><Clock size={10} /> Under Review</span>;
    }
  };

  // If no data and no permission to add, render nothing
  if (!data && !canManage) return null;

  // Edit Mode or Add Mode
  if (isEditing || (!data && canManage)) {
    // Only auto-open if there is no data. If there is data, user must click Edit.
    // However, if we just clicked Edit, show form.
    // If !data and canManage, we show a placeholder "Add Response" button first? 
    // Let's show form immediately if editing, or if no data (implicit "Add" mode for admin viewing empty slot)
    
    // To prevent cluttering admin view for every report, let's show a button "Add Response" if no data.
    if (!isEditing && !data) {
       return (
         <button 
           onClick={() => setIsEditing(true)}
           className="mt-6 w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
         >
           <Building2 size={16} />
           {language === 'bn' ? 'কর্তৃপক্ষের বক্তব্য যোগ করুন' : 'Add Authority Response'}
         </button>
       );
    }

    return (
      <div className="mt-6 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden animate-fade-in shadow-sm">
        <div className="bg-slate-100 dark:bg-slate-800 p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Building2 size={16} /> 
            {language === 'bn' ? 'কর্তৃপক্ষের প্রতিক্রিয়া' : 'Authority Response Form'}
          </h4>
          <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"><X size={16} /></button>
        </div>
        <div className="p-4 bg-white dark:bg-slate-950 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Department Name</label>
            <input 
              value={dept} 
              onChange={(e) => setDept(e.target.value)}
              className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="e.g. Dhaka WASA"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Statement</label>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none" 
              placeholder="Official statement..."
            />
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs border-dashed border-2 border-slate-200 dark:border-slate-700 p-3 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <Upload size={14} /> Upload Official Documents (PDF/JPG)
          </div>
          <button 
            onClick={handleSubmit}
            disabled={!dept || !text}
            className="w-full py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
          >
            <Send size={12} /> Submit Response
          </button>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="mt-6 relative group animate-fade-in">
      <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-slate-400 rounded-r-xl shadow-sm p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Building2 size={80} />
        </div>
        
        <div className="flex justify-between items-start relative z-10 mb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 size={16} className="text-slate-600 dark:text-slate-400" />
              {language === 'bn' ? 'কর্তৃপক্ষের বক্তব্য' : 'Authority Statement'}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{data?.department}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar size={10} /> {data?.date}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getStatusBadge(data?.status || 'review')}
            {canManage && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-[10px] font-bold text-indigo-500 hover:underline mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit Response
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          {data?.content}
        </div>

        {data?.attachments && data.attachments.length > 0 && (
          <div className="mt-3 flex gap-2 relative z-10">
            {data.attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                <Paperclip size={10} /> {file}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};