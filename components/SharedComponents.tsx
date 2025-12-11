import React from 'react';
import { Category, Priority, Status } from '../types';
import { AlertCircle, CheckCircle2, Clock, Zap, Wifi, Monitor, Code, FileText, User, X } from 'lucide-react';

// --- Icons Helper ---
export const getCategoryIcon = (category: Category) => {
  switch (category) {
    case Category.ELECTRICITY: return <Zap className="w-5 h-5 text-yellow-500" />;
    case Category.NETWORK: return <Wifi className="w-5 h-5 text-blue-500" />;
    case Category.HARDWARE: return <Monitor className="w-5 h-5 text-gray-500" />;
    case Category.SOFTWARE: return <Code className="w-5 h-5 text-purple-500" />;
    default: return <FileText className="w-5 h-5 text-gray-400" />;
  }
};

// --- Badges ---
export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles = {
    [Status.OPEN]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [Status.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
    [Status.RESOLVED]: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const icon = {
    [Status.OPEN]: <AlertCircle className="w-3 h-3 mr-1" />,
    [Status.IN_PROGRESS]: <Clock className="w-3 h-3 mr-1" />,
    [Status.RESOLVED]: <CheckCircle2 className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icon[status]}
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    [Priority.LOW]: 'bg-slate-100 text-slate-600',
    [Priority.MEDIUM]: 'bg-orange-100 text-orange-600',
    [Priority.HIGH]: 'bg-red-100 text-red-600 font-semibold',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs ${styles[priority]}`}>
      {priority}
    </span>
  );
};

// --- Stat Card ---
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
    <div className={`p-4 rounded-full ${colorClass} bg-opacity-10 text-opacity-100`}>
      {icon}
    </div>
  </div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  type?: 'default' | 'warning';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, type = 'default' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 ${type === 'warning' ? 'border-t-4 border-orange-500' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xl font-bold ${type === 'warning' ? 'text-orange-600 flex items-center gap-2' : 'text-slate-800'}`}>
               {type === 'warning' && <AlertCircle className="w-6 h-6" />}
               {title}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-slate-600">
            {children}
          </div>
        </div>
        {footer && (
          <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
