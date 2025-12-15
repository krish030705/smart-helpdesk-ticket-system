import React, { useState } from 'react';
import { ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { Category, Priority } from '../../types';
import { Modal } from '../SharedComponents';

export default function RaiseTicket({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.SOFTWARE,
    priority: Priority.LOW
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
         <div className="mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">Raise New Ticket</h2>
            <p className="text-slate-500 mt-1">Describe your issue and we'll assign it to an expert.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ticket Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                placeholder="Brief summary of the issue"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none bg-white"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                      <ChevronRight className="rotate-90 w-4 h-4" />
                    </div>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none bg-white"
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                      <ChevronRight className="rotate-90 w-4 h-4" />
                    </div>
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                placeholder="Please provide detailed information..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Submit Ticket <Send size={18} />
            </button>
         </form>
      </div>

      <Modal isOpen={isSuccess} onClose={() => setIsSuccess(false)} title="Success">
         <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ticket Created!</h3>
            <p className="text-slate-500">Your ticket has been successfully raised. An agent will be assigned shortly.</p>
         </div>
      </Modal>
    </div>
  );
}
