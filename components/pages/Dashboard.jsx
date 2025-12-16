import React, { useMemo } from 'react';
import { LayoutDashboard, PlusCircle, List, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Role, Status, Category } from '../../types';
import { StatCard, getCategoryIcon, StatusBadge } from '../SharedComponents';

export default function Dashboard({ user, tickets, onNavigate }) {
  const isAgent = user.role === Role.AGENT;

  const relevantTickets = useMemo(() => {
    if (isAgent) {
      // Show tickets from agent's domain (case-insensitive) or assigned to them
      return tickets.filter(t => 
        (t.category && user.domain && t.category.toLowerCase() === user.domain.toLowerCase()) || 
        t.assignedTo === user.name
      );
    }
    return tickets.filter(t => t.createdBy === user.name);
  }, [tickets, user, isAgent]);

  const stats = {
    total: relevantTickets.length,
    open: relevantTickets.filter(t => t.status === Status.OPEN).length,
    inProgress: relevantTickets.filter(t => t.status === Status.IN_PROGRESS).length,
    resolved: relevantTickets.filter(t => t.status === Status.RESOLVED).length,
  };

  const chartData = [
    { name: 'Open', count: stats.open },
    { name: 'In Progress', count: stats.inProgress },
    { name: 'Resolved', count: stats.resolved },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">
             Good Night, {user.name.split(' ')[0]}
           </h1>
           <p className="text-slate-500 mt-1">
             Here is what's happening {isAgent ? `in your ${user.domain} domain` : 'with your tickets'}.
           </p>
        </div>
        {!isAgent && (
          <button 
            onClick={() => onNavigate('raise_ticket')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={20} /> Raise New Ticket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Tickets" value={stats.total} icon={<List className="text-blue-600" />} colorClass="bg-blue-500 text-blue-600" />
        <StatCard title="Open" value={stats.open} icon={<AlertTriangle className="text-yellow-600" />} colorClass="bg-yellow-500 text-yellow-600" />
        <StatCard title="In Progress" value={stats.inProgress} icon={<Clock className="text-indigo-600" />} colorClass="bg-indigo-500 text-indigo-600" />
        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 className="text-green-600" />} colorClass="bg-green-500 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ticket Overview</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Latest Updates</h3>
             <button onClick={() => onNavigate('ticket_list')} className="text-sm text-blue-600 font-medium hover:underline">View All</button>
           </div>
           <div className="space-y-4">
             {relevantTickets
               .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
               .slice(0, 4)
               .map(ticket => (
                 <div 
                   key={ticket.id} 
                   className="p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                   onClick={() => onNavigate('ticket_detail', ticket.id)}
                 >
                   <div className="flex justify-between items-start">
                     <span className="text-sm font-semibold text-slate-800 line-clamp-1">{ticket.title}</span>
                     <StatusBadge status={ticket.status} />
                   </div>
                   <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                     <span>#{ticket.id}</span>
                     <span>•</span>
                     <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                   </div>
                 </div>
               ))}
             {relevantTickets.length === 0 && (
               <p className="text-slate-400 text-center py-4">No recent tickets found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
