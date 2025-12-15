const API_BASE_URL = 'http://localhost:5000/api';

let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { Authorization: `Bearer ${authToken}` }),
});

// Login API
export const login = async (email, role, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setAuthToken(data.token);
    return data.user;
  } catch (error) {
    throw error;
  }
};

// Get all tickets
export const getTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tickets');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get single ticket
export const getTicket = async (ticketId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch ticket');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Create ticket
export const createTicket = async (ticket) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ticket),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create ticket');
    }

    return data.ticket;
  } catch (error) {
    throw error;
  }
};

// Update ticket
export const updateTicket = async (ticketId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update ticket');
    }

    return data.ticket;
  } catch (error) {
    throw error;
  }
};

// Add comment to ticket
export const addComment = async (ticketId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add comment');
    }

    return data.ticket;
  } catch (error) {
    throw error;
  }
};

// Seed database (for development only)
export const seedDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to seed database');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
