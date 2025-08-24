# Socket.IO Setup Guide

## 🚀 Quick Start

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev:all
```

This will start both:
- Next.js app on port 3000
- Socket.IO server on port 3001

### Option 2: Run Servers Separately

**Terminal 1 - Next.js App:**
```bash
npm run dev
```

**Terminal 2 - Socket.IO Server:**
```bash
npm run socket
```

## 📍 Ports
- **Next.js App**: http://localhost:3000
- **Socket.IO Server**: http://localhost:3001
- **WebSocket**: ws://localhost:3001

## ✅ Verification

### Check Socket.IO Server
Visit: http://localhost:3001/health
Should show: `{"status":"ok","connections":0}`

### Check Socket.IO Info
Visit: http://localhost:3001/socket-info
Should show server information

## 🔧 Troubleshooting

### If Socket.IO Server Won't Start
1. Check if port 3001 is available
2. Try: `netstat -an | findstr :3001` (Windows) or `lsof -i :3001` (Mac/Linux)
3. Kill any process using port 3001

### If Connection Still Fails
1. Ensure both servers are running
2. Check browser console for CORS errors
3. Verify the Socket.IO server shows "Client connected" in terminal

## 🎯 Testing

1. Start both servers
2. Open `/chat-demo` in your browser
3. Check browser console for connection success
4. Open multiple tabs to test real-time messaging

## 🚨 Important Notes

- **Always run both servers** for Socket.IO to work
- **Keep both terminal windows open** when developing
- **Socket.IO server must be running** before connecting from the client 