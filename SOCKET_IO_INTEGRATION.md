# Socket.IO Integration Guide

This project now includes a complete Socket.IO integration for real-time communication. Here's how to use it:

## 🚀 Features

- **Real-time messaging** with room-based chat
- **Typing indicators** to show when users are typing
- **Automatic reconnection** handling
- **Room management** for organizing conversations
- **User presence** tracking
- **TypeScript support** with full type safety

## 📦 Installation

The required packages are already installed:

```bash
npm install socket.io socket.io-client
```

## 🏗️ Architecture

### Server Side
- **`app/api/socketio/socket.ts`** - Socket.IO server configuration
- **`app/api/socketio/route.ts`** - API route for Socket.IO connections

### Client Side
- **`lib/hooks/useSocket.ts`** - Custom React hook for Socket.IO
- **`components/providers/socket-provider.tsx`** - Context provider for global socket state
- **`components/chat/chat-component.tsx`** - Sample chat component

## 🎯 Basic Usage

### 1. Using the useSocket Hook

```tsx
import { useSocket } from '@/lib/hooks/useSocket';

function MyComponent() {
  const {
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    setTyping,
  } = useSocket({
    roomId: 'my-room',
    userId: 'user-123',
    autoConnect: true,
  });

  const handleSend = () => {
    sendMessage('Hello, world!');
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleSend}>Send Message</button>
    </div>
  );
}
```

### 2. Using the Socket Context Provider

```tsx
import { SocketProvider } from '@/components/providers/socket-provider';

function App() {
  return (
    <SocketProvider options={{ roomId: 'global', userId: 'user-123' }}>
      <YourApp />
    </SocketProvider>
  );
}
```

### 3. Using the Context in Components

```tsx
import { useSocketContext } from '@/components/providers/socket-provider';

function ChatComponent() {
  const { sendMessage, messages, isConnected } = useSocketContext();
  
  // Use socket methods...
}
```

## 🔧 Configuration

### Server Configuration

The Socket.IO server is configured in `app/api/socketio/socket.ts` with:

- **Path**: `/api/socketio`
- **CORS**: Configured for development and production
- **Event handlers**: For messages, typing, room management

### Client Configuration

The client connects to the server with:

```tsx
const socket = io({
  path: '/api/socketio',
  addTrailingSlash: false,
});
```

## 📡 Available Events

### Server Events (Client → Server)
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message to a room
- `typing` - Indicate typing status

### Client Events (Server → Client)
- `receive-message` - Receive a new message
- `user-typing` - User typing indicator
- `connect` - Connection established
- `disconnect` - Connection lost

## 🎨 Sample Components

### Chat Component
The `ChatComponent` demonstrates:
- Real-time messaging
- Typing indicators
- Room switching
- Message history
- Auto-scrolling

### Demo Page
Visit `/chat-demo` to see a working example with:
- Multiple chat rooms
- User profile setup
- Real-time communication

## 🔒 Security Considerations

- **Room-based isolation**: Users can only see messages from rooms they've joined
- **User validation**: Implement proper user authentication before allowing connections
- **Rate limiting**: Consider implementing rate limiting for message sending
- **Input sanitization**: Always sanitize user input before broadcasting

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### WebSocket Support
Ensure your hosting provider supports WebSockets:
- **Vercel**: ✅ Supported
- **Netlify**: ❌ Not supported (use external Socket.IO server)
- **AWS**: ✅ Supported with proper configuration
- **Docker**: ✅ Supported

## 🧪 Testing

### Manual Testing
1. Open `/chat-demo` in multiple browser tabs
2. Join different rooms
3. Send messages between tabs
4. Test typing indicators
5. Test room switching

### Automated Testing
```bash
# Run your existing test suite
npm test

# The Socket.IO integration is designed to work with your existing tests
```

## 🔧 Customization

### Adding New Events
1. Add event handler in `socket.ts`
2. Update the `useSocket` hook
3. Use in your components

### Custom Message Types
```tsx
interface CustomMessage {
  type: 'text' | 'image' | 'file';
  content: string;
  metadata?: any;
}

// Emit custom message
socket.emit('custom-message', customMessageData);
```

### Room Management
```tsx
// Create private rooms
const privateRoomId = `private-${userId1}-${userId2}`;

// Join multiple rooms
socket.emit('join-room', 'room1');
socket.emit('join-room', 'room2');
```

## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks](https://react.dev/reference/react/hooks)

## 🐛 Troubleshooting

### Common Issues

1. **Connection failed**
   - Check if the server is running
   - Verify the Socket.IO path configuration
   - Check CORS settings

2. **Messages not received**
   - Ensure users are in the same room
   - Check event names match between client and server
   - Verify socket connection status

3. **TypeScript errors**
   - Ensure all types are properly exported
   - Check import paths
   - Verify interface definitions

### Debug Mode
Enable debug logging:

```tsx
const socket = io({
  path: '/api/socketio',
  addTrailingSlash: false,
  debug: true, // Enable debug mode
});
```

## 🤝 Contributing

When adding new Socket.IO features:
1. Update TypeScript interfaces
2. Add proper error handling
3. Include tests
4. Update this documentation

---

Happy real-time coding! 🚀 