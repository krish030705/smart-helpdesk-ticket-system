import React, { useState } from 'react';
import { Category } from '../../types';
import { getCategoryIcon, PriorityBadge, StatusBadge } from '../SharedComponents';
import { User, Ticket, Role } from '../../types';

interface Props { user: User; tickets: Ticket[]; onSelect: (id: string) => void }

export default function TicketListPage({ user, tickets, onSelect }: Props) {
  const isAgent = user.role === Role.AGENT;
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>(isAgent && user.domain ? user.domain : 'All');

  const filteredTickets = tickets.filter(t => {
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (!isAgent && t.createdBy !== user.name) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">{isAgent ? 'Incoming Requests' : 'My Support Tickets'}</h2>
           <p className="text-slate-500 text-sm">Manage and track the status of support requests.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
           <button 
             onClick={() => setFilterCategory('All')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterCategory === 'All' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
           >
             All
           </button>
           {Object.values(Category).map(c => (
             <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${filterCategory === c ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
             >
                {getCategoryIcon(c)} {c}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Ticket ID</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group">
                   <td className="p-4 pl-6 font-mono text-xs text-slate-500">#{ticket.id}</td>
                   <td className="p-4">
                      <div className="font-medium text-slate-800">{ticket.title}</div>
                      <div className="text-xs text-slate-500 mt-1">Created by {ticket.createdBy} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                   </td>
                   <td className="p-4">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
                       {getCategoryIcon(ticket.category)} {ticket.category}
                     </div>
                   </td>
                   <td className="p-4"><PriorityBadge priority={ticket.priority} /></td>
                   <td className="p-4"><StatusBadge status={ticket.status} /></td>
                   <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => onSelect(ticket.id)}
                        className="text-blue-600 font-medium text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                      </button>
                   </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                     No tickets found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
