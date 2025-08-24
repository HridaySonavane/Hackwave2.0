const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);

// Enable CORS for the Socket.IO server
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL 
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL 
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Handle user joining a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      roomId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle user leaving a room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`👋 User ${socket.id} left room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-left', {
      userId: socket.id,
      roomId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    console.log(`💬 Message in room ${data.roomId}: ${data.message}`);
    
    // Broadcast to all users in the room (including sender for confirmation)
    io.to(data.roomId).emit('receive-message', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user-typing', data);
  });

  // Handle user presence
  socket.on('user-presence', (data) => {
    socket.to(data.roomId).emit('user-presence-update', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('🚨 Socket error:', error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount
  });
});

// Socket.IO server info endpoint
app.get('/socket-info', (req, res) => {
  res.json({
    server: 'Socket.IO Server',
    version: '4.x',
    connections: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log('🚀 Socket.IO Server is running!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 CORS Origin: ${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_APP_URL : 'http://localhost:3000'}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🔌 Transport: websocket, polling`);
  console.log('✅ Ready to handle real-time connections!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}); 