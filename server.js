
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/deskflow';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve Chrome DevTools app-specific manifest to avoid 404/CSP logs from the browser
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.type('application/json');
  // A minimal, harmless response — Chrome DevTools uses this to detect app-specific settings
  res.send(JSON.stringify({ name: 'com.chrome.devtools', description: 'DevTools app manifest' }));
});

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// --- Schemas ---

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'AGENT'], required: true },
  domain: { type: String, default: null }, // For agents: NETWORK, HARDWARE, SOFTWARE, ELECTRICITY
  avatar: { type: String, default: 'https://picsum.photos/100/100?random=default' },
  createdAt: { type: Date, default: Date.now },
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['NETWORK', 'HARDWARE', 'SOFTWARE', 'ELECTRICITY'], required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'], required: true },
  createdBy: { type: String, required: true },
  assignedTo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: [{
    id: String,
    author: String,
    text: String,
    timestamp: Date,
    isInternal: Boolean,
  }],
});

const User = mongoose.model('User', userSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);

// --- Helper Functions ---

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- Routes ---

// 1. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, role, password } = req.body;

    if (!email || !role || !password) {
      return res.status(400).json({ message: 'Email, role, and password are required' });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(401).json({ message: `No ${role} found with this email address.` });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        domain: user.domain || null,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. GET ALL USERS (for seeding/admin only)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. GET ALL TICKETS
app.get('/api/tickets', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. CREATE TICKET
app.post('/api/tickets', verifyToken, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ticketCount = await Ticket.countDocuments();
    const newTicket = new Ticket({
      id: `T-${1001 + ticketCount}`,
      title,
      description,
      category,
      priority,
      status: 'OPEN',
      createdBy: user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    });

    await newTicket.save();

    res.status(201).json({
      success: true,
      ticket: newTicket,
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. GET TICKET BY ID
app.get('/api/tickets/:id', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. UPDATE TICKET
app.put('/api/tickets/:id', verifyToken, async (req, res) => {
  try {
    const { status, assignedTo, title, description, priority } = req.body;
    const update = {
      updatedAt: new Date(),
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
      ...(title && { title }),
      ...(description && { description }),
      ...(priority && { priority }),
    };

    const ticket = await Ticket.findOneAndUpdate(
      { id: req.params.id },
      update,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 7. ADD COMMENT TO TICKET
app.post('/api/tickets/:id/comments', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = {
      id: `c-${Date.now()}`,
      author: user.name,
      text,
      timestamp: new Date(),
      isInternal: false,
    };

    const ticket = await Ticket.findOneAndUpdate(
      { id: req.params.id },
      {
        $push: { comments: comment },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 8. SEED INITIAL DATA (POST to /api/seed)
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({}); 

    // Create users
    const users = [
      {
        id: 'u1',
        name: 'Alice Johnson',
        email: 'alice@company.com',
        password: await hashPassword('alice123'),
        role: 'USER',
        avatar: 'https://picsum.photos/100/100?random=1',
      },
      {
        id: 'u2',
        name: 'John Doe',
        email: 'john@company.com',
        password: await hashPassword('john123'),
        role: 'USER',
        avatar: 'https://picsum.photos/100/100?random=4',
      },
      {
        id: 'u3',
        name: 'Hari',
        email: 'hari@company.com',
        password: await hashPassword('hari123'),
        role: 'USER',
        avatar: 'https://picsum.photos/100/100?random=4',
      },
      {
        id: 'a1',
        name: 'Bob Smith',
        email: 'bob@company.com',
        password: await hashPassword('bob123'),
        role: 'AGENT',
        domain: 'NETWORK',
        avatar: 'https://picsum.photos/100/100?random=2',
      },
      {
        id: 'a2',
        name: 'Sarah Connor',
        email: 'sarah@company.com',
        password: await hashPassword('sarah123'),
        role: 'AGENT',
        domain: 'HARDWARE',
        avatar: 'https://picsum.photos/100/100?random=3',
      },
      {
        id: 'a3',
        name: 'Mike Dev',
        email: 'mike@company.com',
        password: await hashPassword('mike123'),
        role: 'AGENT',
        domain: 'SOFTWARE',
        avatar: 'https://picsum.photos/100/100?random=5',
      },
      {
        id: 'a4',
        name: 'Charlie Power',
        email: 'charlie@company.com',
        password: await hashPassword('charlie123'),
        role: 'AGENT',
        domain: 'ELECTRICITY',
        avatar: 'https://picsum.photos/100/100?random=6',
      },
    ];

    await User.insertMany(users);

    // Create sample tickets
    const tickets = [
      {
        id: 'T-1001',
        title: 'WiFi keeps disconnecting in Meeting Room B',
        description: 'Every time we try to present, the connection drops. It happens every 10 minutes.',
        category: 'NETWORK',
        priority: 'HIGH',
        status: 'OPEN',
        createdBy: 'Alice Johnson',
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        comments: [],
      },
      {
        id: 'T-1002',
        title: 'Monitr flickering',
        description: 'My secondary monitor has a weird pink tint and flickers.',
        category: 'HARDWARE',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdBy: 'John Doe',
        assignedTo: 'Sarah Connor',
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000 * 1),
        comments: [
          {
            id: 'c1',
            author: 'Sarah Connor',
            text: 'Ordering a replacement cable to test.',
            timestamp: new Date(Date.now() - 86400000 * 1),
            isInternal: false,
          },
        ],
      },
      {
        id: 'T-1003',
        title: 'Need IntelliJ License',
        description: 'My trial expired, need a corporate key.',
        category: 'SOFTWARE',
        priority: 'LOW',
        status: 'RESOLVED',
        createdBy: 'Alice Johnson',
        assignedTo: 'Mike Dev',
        createdAt: new Date(Date.now() - 86400000 * 10),
        updatedAt: new Date(Date.now() - 86400000 * 9),
        comments: [],
      },
      {
        id: 'T-1004',
        title: 'Power outlet sparking',
        description: 'The outlet near desk 4B sparked when I plugged in my charger.',
        category: 'ELECTRICITY',
        priority: 'HIGH',
        status: 'OPEN',
        createdBy: 'Alice Johnson',
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
      },
    ];

    await Ticket.insertMany(tickets);

    res.json({
      message: 'Database seeded successfully',
      users: users.length,
      tickets: tickets.length,
    });
  } catch (error) {
    console.error('Seed error:', error.message || error);
    res.status(500).json({ 
      message: 'Server error during seeding',
      error: error.message || String(error)
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
