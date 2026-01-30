import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { ProcurementViewer, ProcurementDoc, TimelineEvent } from '../components/ProcurementViewer';
import { 
  Filter, 
  AlertTriangle, 
  BrainCircuit, 
  Building2, 
  User, 
  Ghost, 
  AlertOctagon, 
  ArrowRight,
  ShieldAlert,
  Search,
  Repeat,
  DollarSign,
  TrendingUp,
  X,
  Network,
  FileCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// --- MOCK DATA ---

interface Node {
  id: string;
  type: 'govt' | 'contractor' | 'shell';
  name: string;
  risk: 'high' | 'medium' | 'low';
  x: number;
  y: number;
  r: number; // radius
}

interface Edge {
  source: string;
  target: string;
  value: number; // thickness/amount
  risk: 'high' | 'medium' | 'low';
}

const NODES: Node[] = [
  { id: 'dept1', type: 'govt', name: 'Executive Engineer (LGRD)', risk: 'medium', x: 400, y: 300, r: 40 },
  { id: 'c1', type: 'contractor', name: 'Alpha Builders Ltd', risk: 'high', x: 250, y: 150, r: 25 },
  { id: 'c2', type: 'contractor', name: 'Beta Construction', risk: 'high', x: 550, y: 150, r: 25 },
  { id: 'c3', type: 'contractor', name: 'Gamma Enterprise', risk: 'medium', x: 600, y: 400, r: 20 },
  { id: 's1', type: 'shell', name: 'Unknown Trading', risk: 'high', x: 300, y: 450, r: 15 },
  { id: 's2', type: 'shell', name: 'Verified Supply Co', risk: 'low', x: 200, y: 300, r: 15 },
];

const EDGES: Edge[] = [
  { source: 'dept1', target: 'c1', value: 5, risk: 'high' },
  { source: 'dept1', target: 'c2', value: 4, risk: 'high' },
  { source: 'dept1', target: 'c3', value: 2, risk: 'medium' },
  { source: 'c1', target: 's1', value: 1, risk: 'high' }, // Money flow to shell
  { source: 'c2', target: 'c1', value: 2, risk: 'high' }, // Collusion
  { source: 'dept1', target: 's2', value: 1, risk: 'low' },
];

const ANOMALIES = [
  { 
    id: 1, 
    type: 'Collusion', 
    title: 'Repeated Winners', 
    desc: 'Alpha Builders & Beta Construction won 85% of tenders in 2023.', 
    severity: 'High',
    icon: Repeat 
  },
  { 
    id: 2, 
    type: 'Cost', 
    title: 'Overpriced Bids', 
    desc: '3 recent projects were 40% above estimated govt rate.', 
    severity: 'Medium',
    icon: DollarSign 
  },
  { 
    id: 3, 
    type: 'Competition', 
    title: 'Limited Competition', 
    desc: 'Only 1 bidder submitted for "Bridge Repair - Sector 4".', 
    severity: 'High',
    icon: User 
  }
];

const CONTRACTOR_DETAILS = {
  id: 'c1',
  name: 'Alpha Builders Ltd',
  founded: '2015',
  totalProjects: 24,
  totalValue: '১২০ কোটি টাকা',
  avgOverrun: 35, // %
  delayRate: 60, // %
  blacklist: false,
  history: [
    { year: '2021', status: 'Completed', value: 40 },
    { year: '2022', status: 'Late', value: 65 },
    { year: '2023', status: 'Ongoing', value: 80 },
  ]
};

// Mock Docs for Procurement Viewer
const MOCK_DOCS: ProcurementDoc[] = [
  {
    id: 'DOC-101',
    type: 'notice',
    title: 'Tender Notice: Bridge Construction',
    date: '2023-10-01',
    version: '1.0',
    status: 'active',
    access: 'public',
    hash: '0x7f8...9a2',
    uploadedBy: 'LGRD Admin',
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=300',
    fileType: 'image'
  },
  {
    id: 'DOC-102',
    type: 'bid',
    title: 'Bid: Alpha Builders Financial',
    date: '2023-10-15',
    version: '1.2',
    status: 'active',
    access: 'restricted',
    hash: '0xe1d...4f5',
    uploadedBy: 'Alpha Rep',
    url: '',
    fileType: 'pdf'
  },
  {
    id: 'DOC-103',
    type: 'evaluation',
    title: 'Technical Evaluation Report',
    date: '2023-10-25',
    version: '1.0',
    status: 'active',
    access: 'restricted',
    hash: '0x3c4...1a9',
    uploadedBy: 'Eval Committee',
    url: '',
    fileType: 'pdf'
  },
  {
    id: 'DOC-104',
    type: 'award',
    title: 'Notification of Award',
    date: '2023-11-01',
    version: '1.0',
    status: 'active',
    access: 'public',
    hash: '0x9a8...7c6',
    uploadedBy: 'LGRD Admin',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300',
    fileType: 'image'
  }
];

const MOCK_TIMELINE: TimelineEvent[] = [
  { stage: 'notice', date: 'Oct 01, 2023', completed: true, active: false },
  { stage: 'bidding', date: 'Oct 15, 2023', completed: true, active: false },
  { stage: 'evaluation', date: 'Oct 25, 2023', completed: true, active: false },
  { stage: 'award', date: 'Nov 01, 2023', completed: false, active: true },
];

export const TenderAnalysis: React.FC = () => {
  const { t, language, role } = useApp();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'network' | 'docs'>('network');

  const isAdmin = ['admin', 'superadmin', 'moderator'].includes(role);

  // Helper to get node colors
  const getNodeColor = (type: string, risk: string) => {
    if (type === 'govt') return 'fill-slate-800 dark:fill-slate-200 stroke-slate-500';
    if (risk === 'high') return 'fill-red-500 stroke-red-700';
    if (risk === 'medium') return 'fill-amber-500 stroke-amber-700';
    return 'fill-emerald-500 stroke-emerald-700';
  };

  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'govt': return Building2;
      case 'shell': return Ghost;
      default: return User;
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in relative min-h-screen">
      
      {/* 1) Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="text-amber-600" />
              {t('tenderTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn' 
                ? 'সরকারি ক্রয়ে ঠিকাদারদের নেটওয়ার্ক এবং ঝুঁকি বিশ্লেষণ ড্যাশবোর্ড' 
                : 'Government procurement network and contractor risk analysis dashboard'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-full flex items-center gap-2 animate-pulse">
               <span className="w-2 h-2 rounded-full bg-red-500"></span>
               <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                 {t('syndicateDetected')}
               </span>
             </div>
          </div>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 flex flex-wrap gap-4 items-center">
           <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
             <Filter size={16} />
             <span className="font-semibold uppercase text-xs">Filters:</span>
           </div>
           
           <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
             <option>Ministry: LGRD</option>
             <option>Ministry: Health</option>
           </select>
           
           <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
             <option>Year: 2023-2024</option>
             <option>Year: 2022-2023</option>
           </select>

           <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
             <option>District: Dhaka</option>
             <option>District: Chittagong</option>
           </select>

           <div className="ml-auto relative hidden md:block">
             <Search size={16} className="absolute left-3 top-2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search Contractor ID..." 
               className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 w-64"
             />
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* 2) Main Content Area (Tabs) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('network')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all ${
                activeTab === 'network'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Network size={16} /> Network Analysis
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all ${
                activeTab === 'docs'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCheck size={16} /> Procurement Documents
            </button>
          </div>

          <GlassCard className="bg-slate-900 dark:bg-slate-950 min-h-[550px] flex flex-col relative overflow-hidden border-slate-800" noPadding>
            
            {activeTab === 'network' ? (
              <>
                <div className="absolute top-4 left-4 z-10">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <BrainCircuit size={14} /> {t('networkGraph')}
                  </h3>
                </div>

                {/* SVG Graph Visualization */}
                <div className="w-full h-[550px] cursor-move">
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    <defs>
                       {/* Glow Filter */}
                       <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                         <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                         <feMerge>
                           <feMergeNode in="coloredBlur"/>
                           <feMergeNode in="SourceGraphic"/>
                         </feMerge>
                       </filter>
                    </defs>

                    {/* Edges */}
                    {EDGES.map((edge, idx) => {
                      const s = NODES.find(n => n.id === edge.source)!;
                      const t = NODES.find(n => n.id === edge.target)!;
                      const isHighRisk = edge.risk === 'high';
                      
                      return (
                        <g key={idx}>
                          <line 
                            x1={s.x} y1={s.y} x2={t.x} y2={t.y} 
                            stroke={isHighRisk ? '#ef4444' : '#64748b'} 
                            strokeWidth={edge.value} 
                            strokeOpacity={0.6}
                            className={isHighRisk ? 'animate-pulse' : ''}
                          />
                          {/* Animated Particle for flow */}
                          {isHighRisk && (
                            <circle r="3" fill="#ef4444">
                              <animateMotion 
                                dur="2s" 
                                repeatCount="indefinite"
                                path={`M${s.x},${s.y} L${t.x},${t.y}`}
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {NODES.map((node) => (
                      <g 
                        key={node.id} 
                        onClick={() => setSelectedNode(node.id)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      >
                        {/* Ripple for High Risk */}
                        {node.risk === 'high' && (
                          <circle cx={node.x} cy={node.y} r={node.r + 10} className="fill-red-500/20 animate-ping" />
                        )}
                        
                        {/* Main Circle */}
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={node.r} 
                          className={`${getNodeColor(node.type, node.risk)} hover:stroke-white transition-colors duration-200 stroke-2`}
                          filter={node.risk === 'high' ? 'url(#glow)' : ''}
                        />

                        {/* Shell Company Dashed Border */}
                        {node.type === 'shell' && (
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={node.r + 4} 
                            fill="none" 
                            stroke="#94a3b8" 
                            strokeDasharray="4 4" 
                          />
                        )}

                        {/* Label */}
                        <text 
                          x={node.x} 
                          y={node.y + node.r + 20} 
                          textAnchor="middle" 
                          className="fill-slate-300 text-[10px] font-bold uppercase tracking-wider pointer-events-none"
                        >
                          {node.name}
                        </text>

                        {/* Tooltip on Hover */}
                        {hoveredNode === node.id && (
                           <foreignObject x={node.x + 20} y={node.y - 40} width="150" height="60">
                             <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-xl border border-slate-700">
                               <p className="font-bold">{node.name}</p>
                               <p className="text-[10px] opacity-80 uppercase">{node.type} • {node.risk} risk</p>
                             </div>
                           </foreignObject>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>

                {/* AI Explanation Card (Overlay) */}
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-black/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl text-slate-200">
                  <div className="flex gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg h-fit">
                      <BrainCircuit size={20} className="text-indigo-400" />
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-indigo-300 uppercase mb-1">AI Analysis</h4>
                       <p className="text-sm leading-relaxed">
                         "একই তিনটি কোম্পানি গত দুই বছরে অধিকাংশ কাজ পেয়েছে এবং তাদের মধ্যে অস্বাভাবিক অর্থের লেনদেন লক্ষ্য করা যাচ্ছে।"
                       </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
                <ProcurementViewer docs={MOCK_DOCS} timeline={MOCK_TIMELINE} isAdmin={isAdmin} />
              </div>
            )}
          </GlassCard>
        </div>

        {/* 3) Anomaly Panel (Sidebar) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertOctagon size={20} className="text-slate-500" />
            {t('anomalies')}
          </h3>
          
          <div className="space-y-3">
            {ANOMALIES.map((item) => (
              <GlassCard key={item.id} className="hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg ${
                    item.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    item.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.severity} Risk
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </GlassCard>
            ))}
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
             <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
               + Generate Full Investigation Report
             </p>
          </div>
        </div>

        {/* 4) Contractor History Drawer (Overlay) */}
        {selectedNode && selectedNode.startsWith('c') && (
          <div className="absolute top-0 right-0 bottom-0 w-full md:w-[400px] z-50 animate-slide-in-right">
            <div className="h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                    A
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{CONTRACTOR_DETAILS.name}</h2>
                    <p className="text-xs text-slate-500">ID: {selectedNode} • Est. {CONTRACTOR_DETAILS.founded}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{t('totalProjects')}</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{CONTRACTOR_DETAILS.totalProjects}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">{t('avgOverrun')}</p>
                     <p className="text-xl font-bold text-red-500">+{CONTRACTOR_DETAILS.avgOverrun}%</p>
                  </div>
                </div>

                {/* Performance Chart */}
                <div>
                   <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3 flex items-center gap-2">
                     <TrendingUp size={14} /> Performance Trend
                   </h4>
                   <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CONTRACTOR_DETAILS.history}>
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', background: '#1e293b', border: 'none', color: '#fff', fontSize: '12px' }}
                            cursor={{fill: 'transparent'}}
                          />
                          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30}>
                            {CONTRACTOR_DETAILS.history.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.status === 'Late' ? '#f59e0b' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Risk Indicators */}
                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Risk Indicators</h4>
                   
                   <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">{t('delayRate')}</span>
                      </div>
                      <span className="font-bold text-red-700 dark:text-red-400">{CONTRACTOR_DETAILS.delayRate}%</span>
                   </div>

                   <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('blacklistStatus')}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">Clean</span>
                   </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  View Full Profile <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};