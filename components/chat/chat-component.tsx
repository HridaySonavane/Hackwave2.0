'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/lib/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatComponentProps {
  roomId: string;
  userId: string;
  userName?: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  roomId,
  userId,
  userName = 'Anonymous',
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    setTyping,
  } = useSocket({
    roomId,
    userId,
    autoConnect: true,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    if (inputMessage.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        setTyping(true);
      }
      
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        setTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
      setTyping(false);
    }

    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [inputMessage, isTyping, setTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
      setIsTyping(false);
      setTyping(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Chat Room: {roomId}</span>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {typingUsers.length > 0 && (
              <Badge variant="secondary">
                {typingUsers.length} typing...
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-2 p-2 border rounded">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.userId === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.userId === userId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {message.userId === userId ? 'You' : message.userId}
                  </div>
                  <div className="text-sm">{message.message}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button type="submit" disabled={!isConnected || !inputMessage.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 