import { PythonWebSocketDemo } from '@/components/chat/python-websocket-demo';

export default function PythonWebSocketDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Python WebSocket Agent Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This demo shows how to connect your JavaScript frontend to a Python WebSocket server 
            running the agent conversation system. The Python server handles the AI agents while 
            the frontend provides a real-time interface for user interaction.
          </p>
        </div>
        
        <PythonWebSocketDemo />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 How It Works
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Python WebSocket Server</h3>
                  <p>
                    The Python server runs on port 8000 and handles the agent conversation logic. 
                    It sends structured messages that your JavaScript client can understand.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Communication</h3>
                  <p>
                    The server sends different types of messages: status updates, questions, 
                    agent results, and progress indicators. All communication happens in real-time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Agent Workflow</h3>
                  <p>
                    The system runs through multiple AI agents: Clarifier, Product, Customer, 
                    Engineer, and Risk. Each agent processes information and generates responses.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">User Interaction</h3>
                  <p>
                    Users can answer questions from the Clarifier agent, and the system 
                    processes their responses to generate comprehensive project requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔧 Setup Instructions
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">1. Install Python Dependencies</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
pip install -r requirements.txt
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2. Start Python WebSocket Server</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
python python-socket-server.py
                </pre>
                <p className="text-sm text-gray-600 mt-1">
                  The server will start on http://localhost:8000
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3. Start Your Next.js App</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
npm run dev
                </pre>
                <p className="text-sm text-gray-600 mt-1">
                  Your app will run on http://localhost:3000
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">4. Connect and Test</h3>
                <p>
                  Navigate to this page, click "Connect" to establish a WebSocket connection, 
                  and watch the agent conversation unfold in real-time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
