import { Category, Priority, Role, Status, Ticket, User } from './types';

export interface UserCredentials extends User {
  password: string;
}

export const MOCK_USERS: UserCredentials[] = [
  // Users
  {
    id: 'u1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    password: 'alice123',
    role: Role.USER,
    avatar: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john@company.com',
    password: 'john123',
    role: Role.USER,
    avatar: 'https://picsum.photos/100/100?random=4',
  },
  
  // Agents
  {
    id: 'a1',
    name: 'Bob Smith',
    email: 'bob@company.com',
    password: 'bob123',
    role: Role.AGENT,
    domain: Category.NETWORK,
    avatar: 'https://picsum.photos/100/100?random=2',
  },
  {
    id: 'a2',
    name: 'Sarah Connor',
    email: 'sarah@company.com',
    password: 'sarah123',
    role: Role.AGENT,
    domain: Category.HARDWARE,
    avatar: 'https://picsum.photos/100/100?random=3',
  },
  {
    id: 'a3',
    name: 'Mike Dev',
    email: 'mike@company.com',
    password: 'mike123',
    role: Role.AGENT,
    domain: Category.SOFTWARE,
    avatar: 'https://picsum.photos/100/100?random=5',
  },
  {
    id: 'a4',
    name: 'Charlie Power',
    email: 'charlie@company.com',
    password: 'charlie123',
    role: Role.AGENT,
    domain: Category.ELECTRICITY,
    avatar: 'https://picsum.photos/100/100?random=6',
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'T-1001',
    title: 'WiFi keeps disconnecting in Meeting Room B',
    description: 'Every time we try to present, the connection drops. It happens every 10 minutes.',
    category: Category.NETWORK,
    priority: Priority.HIGH,
    status: Status.OPEN,
    createdBy: 'Alice Johnson',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    comments: [],
  },
  {
    id: 'T-1002',
    title: 'Monitor flickering',
    description: 'My secondary monitor has a weird pink tint and flickers.',
    category: Category.HARDWARE,
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    createdBy: 'John Doe',
    assignedTo: 'Sarah Connor',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    comments: [
      {
        id: 'c1',
        author: 'Sarah Connor',
        text: 'Ordering a replacement cable to test.',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        isInternal: false,
      }
    ],
  },
  {
    id: 'T-1003',
    title: 'Need IntelliJ License',
    description: 'My trial expired, need a corporate key.',
    category: Category.SOFTWARE,
    priority: Priority.LOW,
    status: Status.RESOLVED,
    createdBy: 'Alice Johnson',
    assignedTo: 'Mike Dev',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    comments: [],
  },
  {
    id: 'T-1004',
    title: 'Power outlet sparking',
    description: 'The outlet near desk 4B sparked when I plugged in my charger.',
    category: Category.ELECTRICITY,
    priority: Priority.HIGH,
    status: Status.OPEN,
    createdBy: 'Alice Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  }
];
