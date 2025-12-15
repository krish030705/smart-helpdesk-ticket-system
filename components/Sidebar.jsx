import React from 'react';
import { LayoutDashboard, PlusCircle, List, LogOut } from 'lucide-react';
import { Role } from '../types';
import { getCategoryIcon } from './SharedComponents';

export const SidebarItem = ({ icon, label, view, currentView, navigateTo }) => (
  <button
    onClick={() => navigateTo(view)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      currentView === view 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default function Sidebar({ currentUser, currentView, navigateTo, handleLogout }) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">HD</div>
        <span className="font-bold text-xl text-slate-800">HelpDesk</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" view="dashboard" currentView={currentView} navigateTo={(v) => navigateTo(v)} />
        {currentUser.role === Role.USER && (
          <SidebarItem icon={<PlusCircle size={20} />} label="Raise Ticket" view="raise_ticket" currentView={currentView} navigateTo={(v) => navigateTo(v)} />
        )}
        <SidebarItem 
          icon={<List size={20} />} 
          label={currentUser.role === Role.AGENT ? "All Tickets" : "My Tickets"} 
          view="ticket_list" 
          currentView={currentView}
          navigateTo={(v) => navigateTo(v)}
        />
        {currentUser.role === Role.AGENT && currentUser.domain && (
           <div className="mt-8 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Domain</div>
        )}
        {currentUser.role === Role.AGENT && currentUser.domain && (
             <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
                {getCategoryIcon(currentUser.domain)}
                {currentUser.domain}
             </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
          <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 w-full px-2 py-2 text-sm font-medium transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
