import React, { useState } from 'react';
import { Category, Priority, Role, Status } from './types';
import { MOCK_USERS } from './constants';
import { INITIAL_TICKETS } from './constants';
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

  // --- Login Logic ---
  const [loginRole, setLoginRole] = useState(Role.USER);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Find user with matching email and role
    const user = MOCK_USERS.find(
      u => u.email === loginEmail && u.role === loginRole
    );

    if (!user) {
      setLoginError(`No ${loginRole} found with this email address.`);
      return;
    }

    // Validate password
    if (user.password !== loginPassword) {
      setLoginError('Invalid password. Please try again.');
      return;
    }

    // Login successful
    setCurrentUser(user);
    setCurrentView('dashboard');
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedTicketId(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };

  // --- Ticket Logic ---
  const handleRaiseTicket = (newTicket) => {
    const ticket = {
      id: `T-${1000 + tickets.length + 1}`,
      title: newTicket.title || '',
      description: newTicket.description || '',
      category: newTicket.category || Category.SOFTWARE,
      priority: newTicket.priority || Priority.LOW,
      status: Status.OPEN,
      createdBy: currentUser?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    setTickets([ticket, ...tickets]);
    setCurrentView('ticket_list');
  };

  const handleUpdateTicket = (id, updates) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  };

  const handleAddComment = (id, text) => {
    const comment = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || 'Anonymous',
      text,
      timestamp: new Date().toISOString(),
      isInternal: false,
    };
    setTickets(tickets.map(t => {
      if (t.id === id) {
        return { ...t, comments: [...t.comments, comment] };
      }
      return t;
    }));
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
        {currentView === 'ticket_detail' && selectedTicketId && (
          <TicketDetailPage 
            user={currentUser} 
            ticket={tickets.find(t => t.id === selectedTicketId)} 
            onUpdate={handleUpdateTicket}
            onComment={handleAddComment}
            onBack={() => navigateTo('ticket_list')}
            onDomainMismatch={() => navigateTo('ticket_list')}
          />
        )}
      </main>
    </div>
  );
}

// Sub-pages moved to `components/pages/*`
