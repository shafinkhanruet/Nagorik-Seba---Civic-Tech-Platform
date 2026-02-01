
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShieldAlert, FileSearch, Gavel, Network, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { logout, user } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed h-full">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <span className="text-xl font-bold tracking-tight text-white">Nagorik Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          <div className="px-3 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Overview</div>
          <NavItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          
          <div className="px-3 pb-2 pt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Management</div>
          <NavItem to="/admin/moderation" icon={<Gavel size={18} />} label="Moderation" />
          <NavItem to="/admin/tenders" icon={<Network size={18} />} label="Procurement" />
          <NavItem to="/admin/audit" icon={<FileSearch size={18} />} label="Audit Logs" />
          
          {user?.role === 'superadmin' && (
            <>
              <div className="px-3 pb-2 pt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency</div>
              <NavItem to="/admin/crisis" icon={<ShieldAlert size={18} />} label="Crisis Control" isDanger />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, isDanger }: { to: string; icon: React.ReactNode; label: string; isDanger?: boolean }) => (
  <NavLink 
    to={to} 
    end={to === '/admin'}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
      ${isActive 
        ? isDanger ? 'bg-red-900/30 text-red-400' : 'bg-indigo-600 text-white' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'}
    `}
  >
    {icon}
    {label}
  </NavLink>
);
