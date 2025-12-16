import React, { useState } from 'react';
import { Category, Priority, Role, Status } from './types';
import { INITIAL_TICKETS } from './constants';
import {
  login as apiLogin,
  clearAuthToken,
  getTickets as apiGetTickets,
  createTicket as apiCreateTicket,
  updateTicket as apiUpdateTicket,
  addComment as apiAddComment,
} from './src/services/api';
import LoginPage from './components/pages/LoginPage';
import Dashboard from './components/pages/Dashboard';
import RaiseTicket from './components/pages/RaiseTicket';
import TicketListPage from './components/pages/TicketListPage';
import TicketDetailPage from './components/pages/TicketDetailPage';
import Sidebar from './components/Sidebar';

// --- Main App Component ---

export default function App() {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState(null);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  
  // Navigation State
  // Views: 'dashboard' | 'raise_ticket' | 'ticket_list' | 'ticket_detail' | 'profile'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // helper to normalize server-side enum values (UPPERCASE) to client-friendly Title Case
  const normalizeTicket = (t) => ({
    ...t,
    category: t.category ? t.category.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' ') : t.category,
    status: t.status ? (t.status === 'IN_PROGRESS' ? 'In Progress' : t.status[0] + t.status.slice(1).toLowerCase()) : t.status,
    priority: t.priority ? t.priority[0] + t.priority.slice(1).toLowerCase() : t.priority,
  });

  // --- Login Logic ---
  const [loginRole, setLoginRole] = useState(Role.USER);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      // server expects role like 'USER' or 'AGENT' — normalize
      const roleForServer = (typeof loginRole === 'string' ? loginRole : String(loginRole)).toUpperCase();
      const user = await apiLogin(loginEmail, roleForServer, loginPassword);
      // normalize server role/category/status values to client-friendly strings
      const normalizedUser = {
        ...user,
        role: user.role === 'AGENT' ? Role.AGENT : Role.USER,
      };
      setCurrentUser(normalizedUser);
      setLoginEmail('');
      setLoginPassword('');
      // fetch tickets from server
      try {
        const ticketsFromServer = await apiGetTickets();
        const normalizeTicket = (t) => ({
          ...t,
          category: t.category ? t.category.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' ') : t.category,
          status: t.status ? (t.status === 'IN_PROGRESS' ? 'In Progress' : t.status[0] + t.status.slice(1).toLowerCase()) : t.status,
          priority: t.priority ? t.priority[0] + t.priority.slice(1).toLowerCase() : t.priority,
        });
        setTickets(ticketsFromServer.map(normalizeTicket));
      } catch (err) {
        // fallback to initial tickets
        setTickets(INITIAL_TICKETS);
      }
      setCurrentView('dashboard');
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedTicketId(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };

  // --- Ticket Logic ---
  const handleRaiseTicket = async (newTicket) => {
    try {
      const created = await apiCreateTicket(newTicket);
      setTickets(prev => [normalizeTicket(created), ...prev]);
      try {
        const ticketsFromServer = await apiGetTickets();
        setTickets(ticketsFromServer.map(normalizeTicket));
      } catch (err) {
        console.error('Refresh tickets after create failed', err);
      }
      setCurrentView('ticket_list');
    } catch (err) {
      console.error('Create ticket failed', err);
    }
  };

  const handleUpdateTicket = async (id, updates) => {
    try {
      const updated = await apiUpdateTicket(id, updates);
      setTickets(prev => prev.map(t => t.id === id ? normalizeTicket(updated) : t));
    } catch (err) {
      console.error('Update ticket failed', err);
    }
  };

  const handleAddComment = async (id, text) => {
    try {
      const updated = await apiAddComment(id, text);
      setTickets(prev => prev.map(t => t.id === id ? normalizeTicket(updated) : t));
    } catch (err) {
      console.error('Add comment failed', err);
    }
  };

  // --- Routing / Navigation Helpers ---
  const navigateTo = (view, ticketId) => {
    setSelectedTicketId(ticketId || null);
    setCurrentView(view);
  };

  // --- Render Login Page ---
  if (!currentUser) {
    return (
      <LoginPage
        loginRole={loginRole}
        setLoginRole={setLoginRole}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  // --- Layout & Logic for Authenticated User ---

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentUser={currentUser} currentView={currentView} navigateTo={navigateTo} handleLogout={handleLogout} />
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {currentView === 'dashboard' && <Dashboard user={currentUser} tickets={tickets} onNavigate={navigateTo} />}
        {currentView === 'raise_ticket' && <RaiseTicket onSubmit={handleRaiseTicket} />}
        {currentView === 'ticket_list' && <TicketListPage user={currentUser} tickets={tickets} onSelect={(id) => navigateTo('ticket_detail', id)} />}
        {currentView === 'ticket_detail' && selectedTicketId && (() => {
          const selected = tickets.find(t => t.id === selectedTicketId);
          if (!selected) {
            return (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-slate-600">
                <div className="font-semibold text-slate-800">Ticket not found.</div>
                <button onClick={() => navigateTo('ticket_list')} className="mt-4 text-blue-600 font-medium hover:underline">
                  Back to Tickets
                </button>
              </div>
            );
          }
          return (
            <TicketDetailPage 
              user={currentUser} 
              ticket={selected} 
              onUpdate={handleUpdateTicket}
              onComment={handleAddComment}
              onBack={() => navigateTo('ticket_list')}
              onDomainMismatch={() => navigateTo('ticket_list')}
            />
          );
        })()}
      </main>
    </div>
  );
}

// Sub-pages moved to `components/pages/*`
