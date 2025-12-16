

# DeskFlow - IT Service Desk with MongoDB

A modern IT service desk application built with React, TypeScript, and MongoDB for managing support tickets.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Setup

1. **Install    dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Update `.env` with your MongoDB connection:**
```
MONGODB_URI=mongodb://localhost:27017/deskflow
JWT_SECRET=your_secret_key
PORT=5000
```

4. **Start MongoDB:**
```bash
mongod
```

5. **In Terminal 1 - Start Backend:**
```bash
npm run server
# or with auto-reload
npm run server:dev
```

6. **In Terminal 2 - Start Frontend:**
```bash
npm run dev
```

7. **Seed Database:**
Visit `http://localhost:5000/api/seed` or use:
```bash
curl -X POST http://localhost:5000/api/seed
```

## 📋 Features

### For Users
- ✅ Create support tickets
- ✅ View their own tickets
- ✅ Add comments to tickets
- ✅ Track ticket status
- ✅ See assigned agent

### For Agents
- ✅ View tickets by domain
- ✅ Assign tickets to themselves
- ✅ Update ticket status
- ✅ Add comments/notes
- ✅ Multi-domain support

### Authentication
- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control

## 🔐 Sample Credentials

### Users
- alice@company.com / alice123
- john@company.com / john123

### Agents
- bob@company.com / bob123 (Network)
- sarah@company.com / sarah123 (Hardware)
- mike@company.com / mike123 (Software)
- charlie@company.com / charlie123 (Electricity)

## 🤝 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** JWT, bcryptjs

## 📚 Documentation

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed API endpoints and troubleshooting.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
