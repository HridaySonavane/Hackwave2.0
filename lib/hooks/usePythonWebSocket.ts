import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UsePythonWebSocketOptions {
  clientId: string;
  autoConnect?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onStatus?: (status: string) => void;
  onProgress?: (progress: string) => void;
  onQuestion?: (question: string) => void;
  onResult?: (agent: string, data: any) => void;
  onComplete?: (summary: string) => void;
  onError?: (error: string) => void;
}

interface UsePythonWebSocketReturn {
  isConnected: boolean;
  sendAnswer: (answer: string) => void;
  connect: () => void;
  disconnect: () => void;
  messages: WebSocketMessage[];
  currentQuestion: string | null;
  currentStatus: string;
  agentResults: Record<string, any>;
  finalSummary: string | null;
}

export function usePythonWebSocket({
  clientId,
  autoConnect = true,
  onMessage,
  onStatus,
  onProgress,
  onQuestion,
  onResult,
  onComplete,
  onError,
}: UsePythonWebSocketOptions): UsePythonWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const [agentResults, setAgentResults] = useState<Record<string, any>>({});
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = useCallback((message: WebSocketMessage) => {
    setMessages(prev => [...prev, message]);
    onMessage?.(message);
  }, [onMessage]);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      addMessage(message);

      // Handle different message types
      switch (message.type) {
        case 'status':
          setCurrentStatus(message.data.message);
          onStatus?.(message.data.message);
          break;
        
        case 'progress':
          onProgress?.(message.data.message);
          break;
        
        case 'question':
          setCurrentQuestion(message.data.question);
          onQuestion?.(message.data.question);
          break;
        
        case 'result':
          if (message.data.agent && message.data.data) {
            setAgentResults(prev => ({
              ...prev,
              [message.data.agent]: message.data.data
            }));
            onResult?.(message.data.agent, message.data.data);
          }
          break;
        
        case 'complete':
          setFinalSummary(message.data.summary);
          onComplete?.(message.data.summary);
          break;
        
        case 'error':
          onError?.(message.data.message);
          break;
        
        case 'connect':
          setIsConnected(true);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      onError?.(`Failed to parse message: ${error}`);
    }
  }, [addMessage, onStatus, onProgress, onQuestion, onResult, onComplete, onError]);

  const connect = useCallback(() => {
    console.log('🔌 Attempting to connect...', { 
      currentState: wsRef.current?.readyState,
      clientId 
    });
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔌 Already connected, skipping');
      return;
    }

    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setCurrentStatus('Connected to Python WebSocket server');
        console.log('🔌 Connected to Python WebSocket server');
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        setIsConnected(false);
        setCurrentStatus('Disconnected from server');
        console.log('❌ WebSocket connection closed:', event.code, event.reason);
        
        // Only attempt to reconnect if this wasn't a manual disconnect
        if (event.code !== 1000 && autoConnect) {
          console.log('🔄 Attempting to reconnect in 3 seconds...');
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            if (autoConnect) {
              connect();
            }
          }, 3000);
        } else {
          console.log('🔒 Manual disconnect or normal closure, not reconnecting');
        }
      };

      ws.onerror = (error) => {
        console.error('🚨 WebSocket error:', error);
        onError?.('WebSocket connection error');
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      onError?.(`Failed to connect: ${error}`);
    }
  }, [clientId, autoConnect, handleMessage, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendAnswer = useCallback((answer: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ answer });
      wsRef.current.send(message);
      setCurrentQuestion(null); // Clear current question after answering
    } else {
      onError?.('Cannot send answer: WebSocket not connected');
    }
  }, [onError]);

  // Auto-connect effect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    // Don't disconnect on dependency changes, only on unmount
  }, [autoConnect, connect]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      // Only disconnect if we're actually unmounting
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, []);

  return {
    isConnected,
    sendAnswer,
    connect,
    disconnect,
    messages,
    currentQuestion,
    currentStatus,
    agentResults,
    finalSummary,
  };
}
