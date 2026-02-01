
import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { TenderNode, TenderLink } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const TenderAnalysis: React.FC = () => {
  const [data, setData] = useState<{ nodes: TenderNode[], links: TenderLink[] } | null>(null);

  useEffect(() => {
    mockApi.tenders.getNetwork().then(setData);
  }, []);

  if (!data) return <div>Loading analysis...</div>;

  // Transform nodes for simple scatter plot simulation of a network graph
  // In a real app, use D3.js or React-Flow for actual force-directed graphs
  const chartData = data.nodes.map((node, i) => ({
    x: (i + 1) * 20,
    y: node.riskScore,
    z: node.riskScore > 50 ? 500 : 200, // Size based on risk
    name: node.name,
    type: node.type,
    risk: node.riskScore
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Procurement Syndicate Detection</h1>
      
      <GlassCard className="h-[500px]">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Risk Distribution Network</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="Entity" hide />
            <YAxis type="number" dataKey="y" name="Risk Score" unit="%" domain={[0, 100]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter name="Entities" data={chartData} fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.risk > 70 ? '#ef4444' : entry.type === 'official' ? '#3b82f6' : '#10b981'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-bold text-slate-200 mb-4">High Risk Alerts</h3>
          <ul className="space-y-3">
            {data.nodes.filter(n => n.riskScore > 70).map(node => (
              <li key={node.id} className="flex justify-between items-center p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
                <div>
                  <div className="font-bold text-red-200">{node.name}</div>
                  <div className="text-xs text-red-400 uppercase">{node.type}</div>
                </div>
                <div className="text-2xl font-bold text-red-500">{node.riskScore}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl">
        <p className="font-bold text-white">{data.name}</p>
        <p className="text-sm text-slate-400 capitalize">{data.type}</p>
        <p className="text-sm mt-1">Risk Score: <span className={data.risk > 70 ? "text-red-400" : "text-emerald-400"}>{data.risk}</span></p>
      </div>
    );
  }
  return null;
};
