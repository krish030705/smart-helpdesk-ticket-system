import React, { useEffect, useState } from 'react';
import { ArrowLeft, UserCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Status, Role } from '../../types';
import { Modal, getCategoryIcon, PriorityBadge, StatusBadge } from '../SharedComponents';

export default function TicketDetailPage({ user, ticket, onUpdate, onComment, onBack, onDomainMismatch }) {
  const isAgent = user.role === Role.AGENT;
  const [commentText, setCommentText] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isAgent && user.domain && user.domain.toLowerCase() !== ticket.category?.toLowerCase()) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [isAgent, user.domain, ticket.category]);

  const handleStatusChange = (newStatus) => {
    onUpdate(ticket.id, { status: newStatus });
  };

  const handleAssign = () => {
    onUpdate(ticket.id, { assignedTo: user.name, status: Status.IN_PROGRESS });
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(ticket.id, commentText);
    setCommentText('');
  };

  return (
    <>
      <Modal 
        isOpen={showWarning} 
        onClose={onDomainMismatch} 
        title="Access Restricted"
        type="warning"
        footer={
           <button onClick={onDomainMismatch} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Go Back to My Domain
           </button>
        }
      >
        <p className="font-medium text-slate-800">This ticket belongs to the <span className="font-bold">{ticket.category}</span> department.</p>
        <p className="mt-2 text-sm">As an agent of the <span className="font-bold">{user.domain}</span> domain, you are not authorized to manage this request.</p>
      </Modal>

      <div className={`space-y-6 ${showWarning ? 'blur-sm pointer-events-none' : ''}`}>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
           <ArrowLeft size={18} /> Back to Tickets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl font-bold text-slate-800">{ticket.title}</h1>
                          <StatusBadge status={ticket.status} />
                       </div>
                       <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><UserCircle size={14} /> {ticket.createdBy}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {new Date(ticket.createdAt).toLocaleString()}</span>
                       </div>
                    </div>
                    <PriorityBadge priority={ticket.priority} />
                 </div>
                 
                 <div className="prose prose-slate max-w-none">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                       {ticket.description}
                    </p>
                 </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                 <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Timeline</h3>
                 <div className="space-y-8 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100">
                    {ticket.comments.length === 0 && (
                       <p className="text-slate-400 italic pl-10">No comments yet.</p>
                    )}
                    {ticket.comments.map(comment => (
                       <div key={comment.id} className="relative pl-10">
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border-2 border-white">
                             {comment.author.charAt(0)}
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg rounded-tl-none border border-slate-100">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm text-slate-800">{comment.author}</span>
                                <span className="text-xs text-slate-400">{new Date(comment.timestamp).toLocaleString()}</span>
                             </div>
                             <p className="text-slate-600 text-sm">{comment.text}</p>
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="mt-8 pl-10">
                    <form onSubmit={submitComment} className="relative">
                       <textarea 
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                          placeholder="Add a comment or update..."
                          rows={2}
                       />
                       <button 
                          type="submit"
                          disabled={!commentText.trim()}
                          className="absolute right-2 bottom-2.5 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                       >
                          <Send size={16} />
                       </button>
                    </form>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                 <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Ticket Details</h3>
                 <div className="space-y-4">
                    <div>
                       <span className="text-xs text-slate-500 block mb-1">Category</span>
                       <div className="flex items-center gap-2 font-medium text-slate-700">
                          {getCategoryIcon(ticket.category)} {ticket.category}
                       </div>
                    </div>
                    <div>
                       <span className="text-xs text-slate-500 block mb-1">Assigned Agent</span>
                       {ticket.assignedTo ? (
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                             <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">
                                {ticket.assignedTo.charAt(0)}
                             </div>
                             {ticket.assignedTo}
                          </div>
                       ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                       )}
                    </div>

                    {/* Agent Assignment Section */}
                    {isAgent && (
                       <div className="pt-4 border-t border-slate-100">
                          {!ticket.assignedTo ? (
                             <button onClick={handleAssign} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mb-3">
                                Assign to Me
                             </button>
                          ) : ticket.assignedTo === user.name ? (
                             <div className="bg-green-50 border border-green-200 p-2 rounded-lg mb-3 text-center">
                                <p className="text-xs font-semibold text-green-700">Assigned to you</p>
                             </div>
                          ) : (
                             <p className="text-xs text-slate-500 italic mb-3">Assigned to {ticket.assignedTo}</p>
                          )}
                       </div>
                    )}

                    {/* Status Dropdown - only for agents */}
                    {isAgent && (
                       <div className="pt-4 border-t border-slate-100">
                          <label className="text-xs text-slate-500 block mb-2">Status</label>
                          <select 
                             value={ticket.status} 
                             onChange={(e) => handleStatusChange(e.target.value)}
                             className="w-full p-2 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                          >
                             {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
