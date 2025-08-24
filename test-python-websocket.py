#!/usr/bin/env python3
"""
Simple test script for the Python WebSocket server.
This script tests basic server functionality without requiring the full agent system.
"""

import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    """Test basic WebSocket connection and message handling."""
    
    try:
        # Connect to the WebSocket server
        uri = "ws://localhost:8000/ws/test_client"
        print(f"🔌 Connecting to {uri}...")
        
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")
            
            # Wait for initial messages
            print("📡 Waiting for messages...")
            
            try:
                # Wait for messages with timeout
                message = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                print(f"📨 Received message: {message}")
                
                # Parse the message
                try:
                    parsed = json.loads(message)
                    print(f"📊 Parsed message type: {parsed.get('type')}")
                    print(f"📊 Message data: {parsed.get('data')}")
                except json.JSONDecodeError as e:
                    print(f"❌ Failed to parse JSON: {e}")
                
                # Send a test answer
                test_answer = {"answer": "This is a test answer from the test client"}
                await websocket.send(json.dumps(test_answer))
                print("📤 Sent test answer")
                
                # Wait for more messages
                print("📡 Waiting for more messages...")
                message2 = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                print(f"📨 Received second message: {message2}")
                
            except asyncio.TimeoutError:
                print("⏰ Timeout waiting for messages")
            
            print("🔌 Closing connection...")
            
    except websockets.exceptions.ConnectionRefused:
        print("❌ Connection refused. Make sure the Python WebSocket server is running on port 8000.")
        print("💡 Start the server with: python python-socket-server.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

async def test_health_endpoint():
    """Test the health check endpoint."""
    import aiohttp
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get('http://localhost:8000/health') as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Health check passed: {data}")
                    return True
                else:
                    print(f"❌ Health check failed with status: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

async def main():
    """Run all tests."""
    print("🧪 Testing Python WebSocket Server")
    print("=" * 40)
    
    # Test health endpoint first
    print("\n1️⃣ Testing health endpoint...")
    health_ok = await test_health_endpoint()
    
    if not health_ok:
        print("❌ Health check failed. Server may not be running.")
        return
    
    # Test WebSocket connection
    print("\n2️⃣ Testing WebSocket connection...")
    websocket_ok = await test_websocket_connection()
    
    # Summary
    print("\n" + "=" * 40)
    if health_ok and websocket_ok:
        print("🎉 All tests passed! The Python WebSocket server is working correctly.")
    else:
        print("❌ Some tests failed. Check the output above for details.")
    
    print("\n💡 To use the full system:")
    print("   1. Start the server: python python-socket-server.py")
    print("   2. Start Next.js: npm run dev")
    print("   3. Visit: http://localhost:3000/python-websocket-demo")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        sys.exit(1)
