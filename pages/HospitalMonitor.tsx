import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { InfoTooltip } from '../components/InfoTooltip';
import { 
  Stethoscope, 
  Clock, 
  MapPin, 
  Pill, 
  Users, 
  AlertTriangle, 
  Filter, 
  ArrowUpDown,
  MessageSquarePlus,
  Building
} from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  nameBn: string;
  type: 'govt' | 'private';
  district: string;
  districtBn: string;
  fairnessScore: number; // 0-100
  queueTime: number; // minutes
  medicineStock: 'high' | 'medium' | 'low';
  staffPresence: number; // %
  bribeRisk: 'high' | 'medium' | 'low';
  location: string;
}

const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: 'Dhaka Medical College Hospital',
    nameBn: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    type: 'govt',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    fairnessScore: 42,
    queueTime: 145,
    medicineStock: 'low',
    staffPresence: 65,
    bribeRisk: 'high',
    location: 'Bakshibazar, Dhaka-1000'
  },
  {
    id: '2',
    name: 'Square Hospital',
    nameBn: 'স্কয়ার হাসপাতাল',
    type: 'private',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    fairnessScore: 88,
    queueTime: 15,
    medicineStock: 'high',
    staffPresence: 95,
    bribeRisk: 'low',
    location: 'Panthapath, Dhaka'
  },
  {
    id: '3',
    name: 'Chittagong Medical College',
    nameBn: 'চট্টগ্রাম মেডিকেল কলেজ',
    type: 'govt',
    district: 'Chittagong',
    districtBn: 'চট্টগ্রাম',
    fairnessScore: 55,
    queueTime: 90,
    medicineStock: 'medium',
    staffPresence: 75,
    bribeRisk: 'medium',
    location: 'KB Fazlul Kader Rd, Chittagong'
  },
  {
    id: '4',
    name: 'Kurmitola General Hospital',
    nameBn: 'কুর্মিটোলা জেনারেল হাসপাতাল',
    type: 'govt',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    fairnessScore: 72,
    queueTime: 45,
    medicineStock: 'medium',
    staffPresence: 85,
    bribeRisk: 'low',
    location: 'Cantonment, Dhaka'
  },
  {
    id: '5',
    name: 'Sylhet MAG Osmani Medical',
    nameBn: 'সিলেট এম এ জি ওসমানী মেডিকেল',
    type: 'govt',
    district: 'Sylhet',
    districtBn: 'সিলেট',
    fairnessScore: 60,
    queueTime: 80,
    medicineStock: 'low',
    staffPresence: 70,
    bribeRisk: 'medium',
    location: 'Kajolshah, Sylhet'
  },
  {
    id: '6',
    name: 'Popular Diagnostic Centre',
    nameBn: 'পপুলার ডায়াগনস্টিক সেন্টার',
    type: 'private',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    fairnessScore: 82,
    queueTime: 30,
    medicineStock: 'high',
    staffPresence: 90,
    bribeRisk: 'low',
    location: 'Dhanmondi, Dhaka'
  },
  {
    id: '7',
    name: 'Sher-e-Bangla Medical College',
    nameBn: 'শেরে বাংলা মেডিকেল কলেজ',
    type: 'govt',
    district: 'Barisal',
    districtBn: 'বরিশাল',
    fairnessScore: 48,
    queueTime: 110,
    medicineStock: 'low',
    staffPresence: 60,
    bribeRisk: 'high',
    location: 'Band Road, Barisal'
  },
  {
    id: '8',
    name: 'Upazila Health Complex, Savar',
    nameBn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স, সাভার',
    type: 'govt',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    fairnessScore: 58,
    queueTime: 65,
    medicineStock: 'medium',
    staffPresence: 70,
    bribeRisk: 'medium',
    location: 'Savar, Dhaka'
  }
];

export const HospitalMonitor: React.FC = () => {
  const { t, language } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'govt' | 'private'>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'queue' | 'risk'>('score');

  const filteredHospitals = MOCK_HOSPITALS.filter(h => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterDistrict !== 'all' && h.district !== filterDistrict) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.fairnessScore - a.fairnessScore;
    if (sortBy === 'queue') return a.queueTime - b.queueTime;
    if (sortBy === 'risk') {
       const riskVal = (risk: string) => risk === 'high' ? 3 : risk === 'medium' ? 2 : 1;
       return riskVal(b.bribeRisk) - riskVal(a.bribeRisk);
    }
    return 0;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500';
    if (score >= 50) return 'text-amber-500 border-amber-500';
    return 'text-red-500 border-red-500';
  };

  const getBribeRiskBadge = (risk: string) => {
    if (risk === 'high') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">{t('bribe_high')}</span>;
    if (risk === 'medium') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">{t('bribe_medium')}</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">{t('bribe_low')}</span>;
  };

  const getStockColor = (stock: string) => {
    if (stock === 'high') return 'text-emerald-600';
    if (stock === 'medium') return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1) Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="text-emerald-500" />
            {t('hospitalTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'হাসপাতালের সেবার মান, অপেক্ষার সময় এবং দুর্নীতির ঝুঁকি পর্যবেক্ষণ' 
              : 'Monitor hospital service quality, wait times, and corruption risks'}
          </p>
        </div>
        
        <button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all active:scale-95">
           <MessageSquarePlus size={18} />
           {t('giveFeedback')}
        </button>
      </div>

      {/* 2) Controls */}
      <GlassCard className="p-4 flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Filter size={16} /> Filters:
         </div>
         
         <select 
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
         >
           <option value="all">{t('filterDistrict')}: All</option>
           <option value="Dhaka">Dhaka</option>
           <option value="Chittagong">Chittagong</option>
           <option value="Sylhet">Sylhet</option>
           <option value="Barisal">Barisal</option>
         </select>

         <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
            {(['all', 'govt', 'private'] as const).map((type) => (
               <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-all ${
                     filterType === type 
                     ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                     : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
               >
                  {type === 'all' ? (language === 'bn' ? 'সব' : 'All') : t(`type_${type}`)}
               </button>
            ))}
         </div>

         <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="score">{t('sortBy')}: Score</option>
              <option value="queue">{t('sortBy')}: Queue Time</option>
              <option value="risk">{t('sortBy')}: Risk Level</option>
            </select>
         </div>
      </GlassCard>

      {/* 3) Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredHospitals.map((hospital) => (
           <GlassCard key={hospital.id} noPadding className="flex flex-col h-full group">
              {/* Map Preview Header */}
              <div className="h-24 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                 {/* Placeholder Map Pattern */}
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:12px_12px]"></div>
                 <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <MapPin size={10} /> Map
                 </div>
                 {/* Type Badge */}
                 <div className={`absolute bottom-0 left-0 px-3 py-1 text-[10px] font-bold uppercase rounded-tr-lg ${
                    hospital.type === 'govt' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                 }`}>
                    {t(`type_${hospital.type}`)}
                 </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                    {language === 'bn' ? hospital.nameBn : hospital.name}
                 </h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
                    <MapPin size={12} /> {hospital.location}
                 </p>

                 {/* Main Score */}
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center ${getScoreColor(hospital.fairnessScore)}`}>
                       <span className="text-xl font-bold">{hospital.fairnessScore}%</span>
                    </div>
                    <div>
                       <div className="flex items-center gap-1">
                         <p className="text-xs text-slate-400 uppercase font-bold">{t('fairnessScore')}</p>
                         <InfoTooltip text="রোগীদের ফিডব্যাক, ডাক্তার উপস্থিতি এবং ঔষধের প্রাপ্যতার ওপর ভিত্তি করে এই স্কোর দেওয়া হয়েছে।" />
                       </div>
                       <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-slate-500">{t('bribeRisk')}:</span>
                          {getBribeRiskBadge(hospital.bribeRisk)}
                       </div>
                    </div>
                 </div>

                 {/* Metrics Grid */}
                 <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                       <div className="flex items-center gap-1 text-slate-400 mb-1">
                          <Clock size={12} /> <span className="text-[10px] uppercase font-bold">{t('queueTime')}</span>
                       </div>
                       <p className={`text-sm font-bold ${hospital.queueTime > 60 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                          {hospital.queueTime} {t('minutes')}
                       </p>
                    </div>

                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                       <div className="flex items-center gap-1 text-slate-400 mb-1">
                          <Pill size={12} /> <span className="text-[10px] uppercase font-bold">{t('medicineStock')}</span>
                       </div>
                       <p className={`text-sm font-bold capitalize ${getStockColor(hospital.medicineStock)}`}>
                          {t(`stock_${hospital.medicineStock}`)}
                       </p>
                    </div>

                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 col-span-2 flex items-center justify-between">
                       <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t('staffPresence')}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 rounded-full" style={{ width: `${hospital.staffPresence}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-blue-600">{hospital.staffPresence}%</span>
                       </div>
                    </div>
                 </div>

              </div>
           </GlassCard>
        ))}
      </div>

    </div>
  );
};