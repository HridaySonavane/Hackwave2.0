# Python WebSocket + JavaScript Integration Guide

This guide explains how to make your Python FastAPI WebSocket server compatible with JavaScript WebSocket clients, specifically for the agent conversation system.

## 🎯 Overview

The integration allows your JavaScript frontend to communicate with a Python backend that runs AI agents (Clarifier, Product, Customer, Engineer, Risk) through real-time WebSocket connections.

## 🏗️ Architecture

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│   JavaScript    │ ←──────────────→ │   Python FastAPI │
│   Frontend      │   (Port 8000)   │   WebSocket      │
│                 │                  │   Server         │
└─────────────────┘                  └──────────────────┘
```

## 📁 File Structure

```
├── python-socket-server.py          # Python WebSocket server
├── requirements.txt                  # Python dependencies
├── lib/hooks/usePythonWebSocket.ts  # React hook for WebSocket
├── components/chat/
│   └── python-websocket-demo.tsx   # Demo component
└── app/python-websocket-demo/
    └── page.tsx                     # Demo page
```

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start Python WebSocket Server

```bash
python python-socket-server.py
```

The server will start on `http://localhost:8000`

### 3. Start Your Next.js App

```bash
npm run dev
```

Your app will run on `http://localhost:3000`

### 4. Test the Integration

Navigate to `/python-websocket-demo` and click "Connect" to test the WebSocket connection.

## 🔌 WebSocket Message Format

### Server → Client Messages

All messages follow this structure:

```json
{
  "type": "message_type",
  "data": {
    // Message-specific data
  }
}
```

#### Message Types

1. **`status`** - General status updates
   ```json
   {
     "type": "status",
     "data": {
       "message": "Starting Clarifier conversation..."
     }
   }
   ```

2. **`progress`** - Progress updates from agents
   ```json
   {
     "type": "progress",
     "data": {
       "message": "Clarifier (Round 1): I need to understand your requirements..."
     }
   }
   ```

3. **`question`** - Questions requiring user input
   ```json
   {
     "type": "question",
     "data": {
       "question": "What is the main purpose of your app?"
     }
   }
   ```

4. **`result`** - Agent processing results
   ```json
   {
     "type": "result",
     "data": {
       "agent": "clarifier",
       "data": {
         "done": false,
         "resp": [...]
       }
     }
   }
   ```

5. **`complete`** - Final summary
   ```json
   {
     "type": "complete",
     "data": {
       "summary": "Project requirements gathered successfully..."
     }
   }
   ```

6. **`error`** - Error messages
   ```json
   {
     "type": "error",
     "data": {
       "message": "Error description"
     }
   }
   ```

### Client → Server Messages

For user answers:

```json
{
  "answer": "User's response to the question"
}
```

## 🎣 Using the React Hook

### Basic Usage

```tsx
import { usePythonWebSocket } from '@/lib/hooks/usePythonWebSocket';

function MyComponent() {
  const {
    isConnected,
    sendAnswer,
    connect,
    disconnect,
    messages,
    currentQuestion,
    currentStatus,
    agentResults,
    finalSummary,
  } = usePythonWebSocket({
    clientId: 'user-123',
    autoConnect: true,
    onStatus: (status) => console.log('Status:', status),
    onProgress: (progress) => console.log('Progress:', progress),
    onQuestion: (question) => console.log('Question:', question),
    onResult: (agent, data) => console.log('Result:', agent, data),
    onComplete: (summary) => console.log('Complete:', summary),
    onError: (error) => console.error('Error:', error),
  });

  const handleAnswer = () => {
    if (currentQuestion) {
      sendAnswer('My answer to the question');
    }
  };

  return (
    <div>
      <p>Status: {currentStatus}</p>
      {currentQuestion && (
        <div>
          <p>Question: {currentQuestion}</p>
          <button onClick={handleAnswer}>Send Answer</button>
        </div>
      )}
    </div>
  );
}
```

### Hook Options

- **`clientId`** (required): Unique identifier for the client
- **`autoConnect`**: Whether to connect automatically (default: true)
- **`onMessage`**: Callback for all messages
- **`onStatus`**: Callback for status messages
- **`onProgress`**: Callback for progress messages
- **`onQuestion`**: Callback for questions
- **`onResult`**: Callback for agent results
- **`onComplete`**: Callback for completion
- **`onError`**: Callback for errors

### Hook Return Values

- **`isConnected`**: Connection status
- **`sendAnswer`**: Function to send user answers
- **`connect`**: Function to connect manually
- **`disconnect`**: Function to disconnect
- **`messages`**: Array of all received messages
- **`currentQuestion`**: Current question (if any)
- **`currentStatus`**: Current status message
- **`agentResults`**: Results from all agents
- **`finalSummary`**: Final summary (if available)

## 🔧 Customizing the Python Server

### Adding New Message Types

1. **Define the message structure** in your Python code:

```python
await send_message("custom_type", {
    "custom_data": "value",
    "timestamp": time.time()
})
```

2. **Handle the message** in your JavaScript hook:

```tsx
const {
  // ... other options
  onCustomType: (data) => console.log('Custom:', data),
} = usePythonWebSocket({
  // ... other options
  onCustomType: (data) => {
    // Handle custom message type
  },
});
```

3. **Add the handler** in the hook's `handleMessage` function:

```tsx
case 'custom_type':
  onCustomType?.(message.data);
  break;
```

### Adding New Agents

1. **Create the agent function** in Python:

```python
async def new_agent(websocket: WebSocket, data: dict):
    # Agent logic here
    result = await process_with_agent(data)
    await send_message("result", {
        "agent": "new_agent",
        "data": result
    })
```

2. **Call it** in your conversation flow:

```python
# In run_conversation function
await send_message("status", {"message": "Running new agent..."})
await new_agent(websocket, final_data)
```

## 🚨 Error Handling

### Python Server Errors

```python
try:
    # Your agent logic
    result = await agent.invoke(data)
except Exception as e:
    await send_message("error", {
        "message": f"Agent error: {str(e)}"
    })
```

### JavaScript Client Errors

```tsx
const {
  // ... other options
  onError: (error) => {
    console.error('WebSocket error:', error);
    // Show user-friendly error message
    setErrorMessage(error);
  },
} = usePythonWebSocket({
  // ... other options
});
```

## 🔒 Security Considerations

### CORS Configuration

The Python server includes CORS middleware:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Production Settings

For production, restrict origins:

```python
allow_origins=[
    "https://yourdomain.com",
    "https://app.yourdomain.com"
]
```

## 🧪 Testing

### Manual Testing

1. Start the Python server
2. Start your Next.js app
3. Navigate to the demo page
4. Click "Connect"
5. Watch the conversation flow
6. Answer questions when prompted

### Automated Testing

```tsx
// Test connection
expect(isConnected).toBe(true);

// Test message handling
expect(messages).toHaveLength(1);
expect(messages[0].type).toBe('status');

// Test question handling
expect(currentQuestion).toBe('What is the main purpose of your app?');
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if Python server is running on port 8000
   - Verify CORS settings
   - Check firewall settings

2. **Messages Not Received**
   - Verify WebSocket connection status
   - Check browser console for errors
   - Ensure message format matches expected structure

3. **Python Import Errors**
   - Install all requirements: `pip install -r requirements.txt`
   - Check Python version compatibility
   - Verify import paths

4. **Agent Not Working**
   - Uncomment agent imports in Python code
   - Ensure agent modules are available
   - Check agent configuration

### Debug Mode

Enable debug logging in Python:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Enable debug logging in JavaScript:

```tsx
const {
  // ... other options
  onMessage: (message) => {
    console.log('Raw message:', message);
  },
} = usePythonWebSocket({
  // ... other options
});
```

## 🚀 Production Deployment

### Python Server

1. **Use a production ASGI server**:
   ```bash
   pip install gunicorn
   gunicorn python-socket-server:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Environment variables**:
   ```bash
   export HOST=0.0.0.0
   export PORT=8000
   export CORS_ORIGINS=https://yourdomain.com
   ```

3. **Reverse proxy** (nginx):
   ```nginx
   location /ws/ {
       proxy_pass http://localhost:8000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
   }
   ```

### JavaScript Client

1. **Update WebSocket URL**:
   ```tsx
   const ws = new WebSocket(`wss://yourdomain.com/ws/${clientId}`);
   ```

2. **Environment variables**:
   ```bash
   NEXT_PUBLIC_WEBSOCKET_URL=wss://yourdomain.com
   ```

## 📚 Additional Resources

- [FastAPI WebSocket Documentation](https://fastapi.tiangolo.com/advanced/websockets/)
- [WebSocket API Reference](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)

## 🤝 Contributing

When adding new features:

1. Update the message type definitions
2. Add proper error handling
3. Include TypeScript types
4. Update this documentation
5. Add tests

---

Happy real-time coding! 🚀
