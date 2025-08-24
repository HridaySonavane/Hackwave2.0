'use client';

import React, { useState, useEffect } from 'react';
import { usePythonWebSocket } from '@/lib/hooks/usePythonWebSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function PythonWebSocketDemo() {
  const [clientId, setClientId] = useState('user_placeholder');
  const [answer, setAnswer] = useState('');

  // Handle client ID after hydration to avoid mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('websocket-client-id');
      if (stored) {
        setClientId(stored);
      } else {
        const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('websocket-client-id', newId);
        setClientId(newId);
      }
    }
  }, []);

  // Don't show connection controls until client ID is properly set
  const isClientIdReady = clientId !== 'user_placeholder';

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
    clientId,
    autoConnect: false,
    onStatus: (status) => console.log('Status:', status),
    onProgress: (progress) => console.log('Progress:', progress),
    onQuestion: (question) => console.log('Question:', question),
    onResult: (agent, data) => console.log('Result:', agent, data),
    onComplete: (summary) => console.log('Complete:', summary),
    onError: (error) => console.error('Error:', error),
  });

  const handleSendAnswer = () => {
    if (answer.trim() && currentQuestion) {
      sendAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendAnswer();
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'status': return 'bg-blue-100 text-blue-800';
      case 'progress': return 'bg-yellow-100 text-yellow-800';
      case 'question': return 'bg-green-100 text-green-800';
      case 'result': return 'bg-purple-100 text-purple-800';
      case 'complete': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Python WebSocket Agent Demo</CardTitle>
          <CardDescription>
            Connect to the Python WebSocket server and interact with the agent conversation system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Controls */}
          {isClientIdReady ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={connect}
                disabled={isConnected}
                className="bg-green-600 hover:bg-green-700"
              >
                🔌 Connect
              </Button>
              <Button
                onClick={disconnect}
                disabled={!isConnected}
                variant="destructive"
              >
                ❌ Disconnect
              </Button>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </Badge>
              <span className="text-sm text-gray-600">Client ID: {clientId}</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
              <span className="text-sm text-gray-500">Initializing...</span>
            </div>
          )}

          {/* Current Status */}
          {currentStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">Status: {currentStatus}</p>
            </div>
          )}

          {/* Current Question */}
          {currentQuestion && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800">🤔 Current Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-4">{currentQuestion}</p>
                <div className="flex gap-2">
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your answer here..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendAnswer} disabled={!answer.trim()}>
                    Send Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Results */}
          {Object.keys(agentResults).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📊 Agent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(agentResults).map(([agent, data]) => (
                    <div key={agent} className="border rounded-lg p-3">
                      <h4 className="font-semibold capitalize text-purple-700 mb-2">
                        {agent} Agent
                      </h4>
                      <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final Summary */}
          {finalSummary && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">✅ Final Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">{finalSummary}</p>
              </CardContent>
            </Card>
          )}

          {/* Message History */}
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📝 Message History</CardTitle>
                <CardDescription>
                  All messages received from the Python WebSocket server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getMessageTypeColor(message.type)}>
                          {message.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <pre className="whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(message.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
