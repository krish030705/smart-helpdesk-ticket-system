export enum Role {
  USER = 'User',
  AGENT = 'Agent',
}

export enum Category {
  ELECTRICITY = 'Electricity',
  SOFTWARE = 'Software',
  NETWORK = 'Network',
  HARDWARE = 'Hardware',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Status {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  domain?: Category; // Only for agents
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  createdBy: string; // User Name
  assignedTo?: string; // Agent Name
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
