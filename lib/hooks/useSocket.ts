import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface UseSocketOptions {
  autoConnect?: boolean;
  roomId?: string;
  userId?: string;
}

interface Message {
  roomId: string;
  message: string;
  userId: string;
  timestamp: string;
}

interface TypingIndicator {
  roomId: string;
  userId: string;
  isTyping: boolean;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, roomId, userId } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to Socket.IO server with ID:', socket.id);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from Socket.IO server');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        setIsConnected(false);
      });

      socket.on('receive-message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('user-typing', (data: TypingIndicator) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      });

      if (autoConnect) {
        socket.connect();
      }

      return () => {
        socket.disconnect();
      };
    }
  }, [autoConnect]);

  // Join room when roomId changes
  useEffect(() => {
    if (socketRef.current && roomId && isConnected) {
      socketRef.current.emit('join-room', roomId);
    }
  }, [roomId, isConnected]);

  // Leave room when component unmounts or roomId changes
  useEffect(() => {
    return () => {
      if (socketRef.current && roomId) {
        socketRef.current.emit('leave-room', roomId);
      }
    };
  }, [roomId]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && roomId && userId) {
      const messageData = {
        roomId,
        message,
        userId,
      };
      socketRef.current.emit('send-message', messageData);
      
      // Add message to local state immediately
      setMessages(prev => [...prev, {
        ...messageData,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [roomId, userId]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('typing', {
        roomId,
        userId,
        isTyping,
      });
    }
  }, [roomId, userId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  return {
    isConnected,
    messages,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    setTyping,
    disconnect,
    connect,
    socket: socketRef.current,
  };
}; 