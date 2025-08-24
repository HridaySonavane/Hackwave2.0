import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from langchain_core.messages import HumanMessage
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Import your agent modules here
# from agent import clarifier, product
# from agentComp import ClarifierResp, ProductResp
# from helper import process_agent_response
# from engineer import engineer
# from customer import customer
# from risk import risk
# from summarizer import summarizer_agent

# --- Configuration ---
config = {"configurable": {"thread_id": "product_conversation"}}

app = FastAPI()

# Add CORS middleware to match your JavaScript client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Your Next.js and Socket.IO ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.rooms = {}  # room_id -> list of websockets

    async def connect(self, websocket: WebSocket, room_id: str = "default"):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        print(f"Connected websocket: {id(websocket)} to room: {room_id}")
        print(f"Active connections: {len(self.active_connections)}")
        
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)
        
        # Send connection confirmation
        print(f"Sending connect message to websocket: {id(websocket)}")
        await self.send_personal_message({
            "type": "connect",
            "data": {
                "message": f"Connected to room: {room_id}",
                "roomId": room_id,
                "timestamp": asyncio.get_event_loop().time()
            }
        }, websocket)
        
        # Send a simple ping to test connection
        print(f"Sending ping message to websocket: {id(websocket)}")
        await self.send_personal_message({
            "type": "ping",
            "data": {
                "message": "Connection test - ping",
                "timestamp": asyncio.get_event_loop().time()
            }
        }, websocket)
        
        # Broadcast user joined
        await self.broadcast_to_room({
            "type": "user-joined",
            "data": {
                "userId": str(id(websocket)),
                "roomId": room_id,
                "timestamp": asyncio.get_event_loop().time()
            }
        }, room_id, exclude_websocket=websocket)

    def disconnect(self, websocket: WebSocket):
        print(f"Disconnecting websocket: {id(websocket)}")
        
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"Removed from active connections. Active: {len(self.active_connections)}")
        
        # Remove from all rooms
        for room_id, connections in self.rooms.items():
            if websocket in connections:
                connections.remove(websocket)
                print(f"Removed from room: {room_id}")
                # Don't broadcast user left after disconnect to avoid ASGI errors

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        # Simple check if websocket is in active connections
        if websocket not in self.active_connections:
            print(f"WebSocket {id(websocket)} not in active connections, skipping message")
            return
        
        print(f"Sending message to websocket: {id(websocket)}")
        
        try:
            await websocket.send_text(json.dumps(message))
            print(f"Message sent successfully to websocket: {id(websocket)}")
            return True
        except Exception as e:
            print(f"Error sending message to websocket {id(websocket)}: {e}")
            # Remove websocket on any error
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
            # Also remove from rooms
            for room_id, connections in self.rooms.items():
                if websocket in connections:
                    connections.remove(websocket)
            return False

    async def broadcast_to_room(self, message: dict, room_id: str, exclude_websocket: WebSocket = None):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                if connection != exclude_websocket and connection in self.active_connections:
                    try:
                        await connection.send_text(json.dumps(message))
                    except Exception as e:
                        print(f"Error broadcasting to room: {e}")
                        # Remove problematic connection
                        if connection in self.active_connections:
                            self.active_connections.remove(connection)
                        if connection in self.rooms[room_id]:
                            self.rooms[room_id].remove(connection)

    async def broadcast(self, message: dict):
        for connection in self.active_connections[:]:  # Copy list to avoid modification during iteration
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                print(f"Error broadcasting: {e}")
                # Remove problematic connection
                if connection in self.active_connections:
                    self.active_connections.remove(connection)
                # Remove from all rooms
                for room_id, connections in self.rooms.items():
                    if connection in connections:
                        connections.remove(connection)

manager = ConnectionManager()

# --- WebSocket endpoint ---
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, f"client_{client_id}")
    try:
        
        await manager.broadcast_to_room({
            "type": "receive-message",
            "data": {
                "message": f"📢 Client #{client_id} joined the chat",
                "roomId": f"client_{client_id}",
                "userId": client_id,
                "timestamp": asyncio.get_event_loop().time()
            }
        }, f"client_{client_id}")
        
        await run_conversation(websocket, client_id)
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for client {client_id}")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error in websocket endpoint for client {client_id}: {e}")
        manager.disconnect(websocket)

# --- Agent Conversation Handler ---
async def run_conversation(websocket: WebSocket, client_id: str):
    
    final_data = {
        "clarifier": None,
        "product": None,
        "customer": None,
        "engineer": None,
        "risk": None
    }

    # Helper function to send JSON messages in Socket.IO compatible format
    async def send_message(message_type: str, data: dict):
        message = {
            "type": message_type,
            "data": data
        }
        result = await manager.send_personal_message(message, websocket)
        if not result:
            print(f"Failed to send message: {message_type}")
        return result

    # --- Start Clarifier conversation ---
    if not await send_message("status", {"message": "Starting Clarifier conversation..."}):
        print("Connection lost during status message")
        return  # Stop if connection lost
    
    # Add a small delay to prevent overwhelming the client
    await asyncio.sleep(0.5)
    
    # Simulate agent responses for demo purposes
    # In production, uncomment and use your actual agent code
    """
    initial_message = HumanMessage(
        content="Start gathering requirements for a new mobile app. Only ask 3-5 critical questions that require user input."
    )

    clarifier_result = await asyncio.to_thread(clarifier.invoke, {"messages": [initial_message]}, config)
    clarifier_messages = clarifier_result["messages"]
    clarifier_response = clarifier_messages[-1].content
    """
    
    # Demo response
    clarifier_response = "I need to understand your mobile app requirements. Please answer these questions:\n1. What is the main purpose of your app?\n2. Who is your target audience?\n3. What platforms do you want to support (iOS/Android)?\n4. What is your budget range?\n5. When do you need it completed?"
    
    if not await send_message("progress", {"message": f"Clarifier (Round 1): {clarifier_response}"}):
        print("Connection lost during progress message")
        return  # Stop if connection lost
    
    # Add a small delay to prevent overwhelming the client
    await asyncio.sleep(0.5)

    # Simulate processing agent response
    # clarifier_obj = process_agent_response(clarifier_response, ClarifierResp)
    clarifier_obj = {
        "done": False,
        "resp": [
            {"question": "What is the main purpose of your app?", "answer": ""},
            {"question": "Who is your target audience?", "answer": ""},
            {"question": "What platforms do you want to support (iOS/Android)?", "answer": ""},
            {"question": "What is your budget range?", "answer": ""},
            {"question": "When do you need it completed?", "answer": ""}
        ]
    }
    
    if clarifier_obj:
        final_data["clarifier"] = clarifier_obj
        if not await send_message("result", {"agent": "clarifier", "data": final_data["clarifier"]}):
            print("Connection lost during clarifier result")
            return
        await asyncio.sleep(0.3)  # Small delay

    # --- Collect user inputs ---
    user_inputs_collected = 0
    max_user_inputs = 2  # Reduced from 4 to prevent overwhelming
    rounds = 3  # Reduced from 5 to prevent overwhelming

    for i in range(1, rounds):
        if clarifier_obj and clarifier_obj.get("done", False):
            if not await send_message("status", {"message": f"Clarifier finished after {i} rounds"}):
                print("Connection lost during clarifier finished status")
                return
            break

        user_inputs_needed = False
        if clarifier_obj:
            for req in clarifier_obj["resp"]:
                if not req.get("answer") and user_inputs_collected < max_user_inputs:
                    # Send question to client
                    if not await send_message("question", {"question": req["question"]}):
                        print("Connection lost during question")
                        return
                    await asyncio.sleep(0.3)  # Small delay

                    # Wait for user answer
                    try:
                        response = await websocket.receive_text()
                        response_data = json.loads(response)
                        user_answer = response_data.get("answer", "")
                    except Exception as e:
                        print(f"Error receiving answer: {str(e)} - continuing without error message")
                        continue

                    req["answer"] = user_answer
                    user_inputs_collected += 1
                    user_inputs_needed = True
                    
                    if not await send_message("status", {
                        "message": f"User inputs collected: {user_inputs_collected}/{max_user_inputs}"
                    }):
                        print("Connection lost during user input status")
                        return
                    await asyncio.sleep(0.3)  # Small delay

        # Simulate agent processing
        if not await send_message("progress", {"message": f"Clarifier (Round {i+1}): Processing user inputs..."}):
            print("Connection lost during progress update")
            return
        await asyncio.sleep(0.3)  # Small delay

    # --- Product agent ---
    if not await send_message("status", {"message": "Generating Product response..."}):
        print("Connection lost during product status")
        return
    await asyncio.sleep(0.3)  # Small delay
    
    # Simulate product response
    product_response = "Based on your requirements, here are the key features:\n1. User authentication system\n2. Core app functionality\n3. Push notifications\n4. Offline support\n5. Analytics dashboard"
    
    if not await send_message("progress", {"message": f"Product Response: {product_response}"}):
        print("Connection lost during product progress")
        return
    await asyncio.sleep(0.3)  # Small delay

    final_data["product"] = {"features": product_response.split("\n")[1:]}
    if not await send_message("result", {"agent": "product", "data": final_data["product"]}):
        print("Connection lost during product result")
        return
    await asyncio.sleep(0.3)  # Small delay

    # --- Customer agent ---
    if not await send_message("status", {"message": "Generating Customer response..."}):
        print("Connection lost during customer status")
        return
    await asyncio.sleep(0.3)  # Small delay
    final_data["customer"] = {"feedback": "Positive feedback on proposed features"}
    if not await send_message("result", {"agent": "customer", "data": final_data["customer"]}):
        print("Connection lost during customer result")
        return
    await asyncio.sleep(0.3)  # Small delay

    # --- Engineer agent ---
    if not await send_message("status", {"message": "Generating Engineer response..."}):
        print("Connection lost during engineer status")
        return
    await asyncio.sleep(0.3)  # Small delay
    final_data["engineer"] = {"analysis": "Technical feasibility confirmed"}
    if not await send_message("result", {"agent": "engineer", "data": final_data["engineer"]}):
        print("Connection lost during engineer result")
        return
    await asyncio.sleep(0.3)  # Small delay

    # --- Risk agent ---
    if not await send_message("status", {"message": "Generating Risk response..."}):
        print("Connection lost during risk status")
        return
    await asyncio.sleep(0.3)  # Small delay
    final_data["risk"] = {"assessment": "Low risk, standard development approach recommended"}
    if not await send_message("result", {"agent": "risk", "data": final_data["risk"]}):
        print("Connection lost during risk result")
        return
    await asyncio.sleep(0.3)  # Small delay

    # --- Final merged JSON ---
    if not await send_message("status", {"message": "✅ Final Merged JSON generated"}):
        print("Connection lost during final status")
        return
    await asyncio.sleep(0.3)  # Small delay
    if not await send_message("result", {"agent": "final", "data": final_data}):
        print("Connection lost during final result")
        return
    await asyncio.sleep(0.3)  # Small delay

    # --- Final Summary ---
    if not await send_message("status", {"message": "Generating Final Summary..."}):
        print("Connection lost during summary status")
        return
    await asyncio.sleep(0.3)  # Small delay
    summary = "Project requirements gathered successfully. Ready for development phase."
    if not await send_message("complete", {"summary": summary}):
        print("Connection lost during complete message")
        return

# --- Health check endpoint ---
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": asyncio.get_event_loop().time(),
        "connections": len(manager.active_connections)
    }

# --- Socket info endpoint ---
@app.get("/socket-info")
async def socket_info():
    return {
        "server": "Python WebSocket Server",
        "version": "1.0.0",
        "connections": len(manager.active_connections),
        "rooms": len(manager.rooms),
        "timestamp": asyncio.get_event_loop().time()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
