import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useMockApi } from '../hooks/useMockApi';
import { ReportCard } from '../components/ReportCard';
import { Report } from '../types';
import { GlassCard } from '../components/GlassCard';
import { EthicsBanner } from '../components/EthicsBanner';
import { Filter, Map, Plus, Loader2 } from 'lucide-react';

export const LiveReports: React.FC = () => {
  const { t } = useApp();
  const api = useMockApi();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (e) {
      console.error("Failed to load reports", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Ethics Banner */}
      <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-6">
        <EthicsBanner />
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t('liveReports')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            নাগরিকদের সরাসরি অভিযোগ এবং সমস্যার তালিকা
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
             <Filter size={16} /> ফিল্টার
           </button>
           <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-2">
             <Plus size={16} /> নতুন রিপোর্ট
           </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">
              No reports found.
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Map Widget */}
          <GlassCard className="h-64 flex flex-col items-center justify-center text-slate-400">
             <Map size={48} className="mb-2 opacity-50" />
             <p className="text-sm font-medium">লাইভ ম্যাপ (শীঘ্রই আসছে)</p>
          </GlassCard>

          {/* Guidelines */}
          <GlassCard className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 border-none">
            <h3 className="font-bold text-lg mb-3">রিপোর্ট করার নির্দেশিকা</h3>
            <ul className="space-y-2 text-sm opacity-80 list-disc list-inside">
              <li>সঠিক তথ্য ও প্রমাণ দিন</li>
              <li>ভুল তথ্য দিলে ট্রাস্ট স্কোর কমবে</li>
              <li>ব্যক্তিগত আক্রমণ থেকে বিরত থাকুন</li>
              <li>জরুরি প্রয়োজনে ৯৯৯ এ কল করুন</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};