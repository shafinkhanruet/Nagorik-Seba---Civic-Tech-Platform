
import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { Report } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { MapPin, CheckCircle2, AlertTriangle, ArrowUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenFeed: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const { crisisMode } = useApp();

  useEffect(() => {
    mockApi.reports.getAll().then(setReports);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Live Reports</h1>
        {!crisisMode && (
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
            + New Report
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <GlassCard key={report.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                report.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {report.status.replace('_', ' ')}
              </span>
              <span className="text-slate-400 text-xs">{new Date(report.timestamp).toLocaleDateString()}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{report.title}</h3>
            
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <MapPin size={16} />
              {report.location.address}
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
              {report.description}
            </p>

            {report.evidence.length > 0 && (
              <div className="mb-4 h-40 bg-slate-100 rounded-lg overflow-hidden">
                <img src={report.evidence[0].url} alt="Evidence" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex justify-between items-center">
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                <CheckCircle2 size={16} />
                {report.truthScore}% Verified
              </div>
              
              <button 
                disabled={crisisMode}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp size={16} /> Support
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
