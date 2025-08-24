'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket, UseSocketOptions } from '@/lib/hooks/useSocket';

interface SocketContextType {
  isConnected: boolean;
  messages: any[];
  typingUsers: string[];
  sendMessage: (message: string) => void;
  setTyping: (isTyping: boolean) => void;
  disconnect: () => void;
  connect: () => void;
  socket: any;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
  options?: UseSocketOptions;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  const socketData = useSocket(options);

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}; 