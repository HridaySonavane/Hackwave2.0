'use client';

import React, { useState } from 'react';
import { ChatComponent } from '@/components/chat/chat-component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ChatDemoPage() {
  const [currentRoom, setCurrentRoom] = useState('general');
  const [userId, setUserId] = useState('user-' + Math.random().toString(36).substr(2, 9));
  const [userName, setUserName] = useState('Anonymous');
  const [showUserSetup, setShowUserSetup] = useState(true);

  const rooms = ['general', 'random', 'help', 'off-topic'];

  const handleUserSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowUserSetup(false);
    }
  };

  if (showUserSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setup Your Chat Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserSetup} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium mb-2">
                  Display Name
                </label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="userId" className="block text-sm font-medium mb-2">
                  User ID (auto-generated)
                </label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="User ID"
                  readOnly
                />
              </div>
              <Button type="submit" className="w-full">
                Start Chatting
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Socket.IO Chat Demo</h1>
          <p className="text-muted-foreground">
            Real-time chat powered by Socket.IO and Next.js
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline">
              User: {userName}
            </Badge>
            <Badge variant="outline">
              ID: {userId}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUserSetup(true)}
            >
              Change Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Chat Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <Button
                      key={room}
                      variant={currentRoom === room ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setCurrentRoom(room)}
                    >
                      # {room}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <ChatComponent
              roomId={currentRoom}
              userId={userId}
              userName={userName}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Open this page in multiple browser tabs to test real-time communication!
          </p>
        </div>
      </div>
    </div>
  );
} 