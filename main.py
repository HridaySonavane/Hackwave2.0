import json
import time
import asyncio
from uuid import uuid4
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Data Models ---
class StartConversationRequest(BaseModel):
    text_input: str
    image_input: Optional[str] = None
    audio_input: Optional[str] = None

class ContinueClarifierRequest(BaseModel):
    thread_id: str
    answers: List[str]

class RunWorkflowRequest(BaseModel):
    thread_id: str

class RunWorkflowStreamRequest(BaseModel):
    text_input: str
    image_input: Optional[str] = None
    audio_input: Optional[str] = None

class ClarifierQuestion(BaseModel):
    question: str
    answer: Optional[str] = None

class ClarifierResponse(BaseModel):
    resp: List[ClarifierQuestion]
    done: bool

class ConversationState(BaseModel):
    clarifier: ClarifierResponse
    current_round: int
    workflow_started: bool = False
    workflow_result: Optional[Dict[str, Any]] = None

# --- FastAPI App ---
app = FastAPI(title="Product Conversation API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory storage for conversations ---
conversations: Dict[str, ConversationState] = {}

# --- Helper Functions ---
def generate_mock_product_result():
    return {
        "product": {
            "name": "Fitness Tracker Pro",
            "features": [
                "Workout tracking",
                "Progress analytics",
                "Social sharing",
                "Personalized recommendations",
                "Nutrition tracking"
            ]
        },
        "diagram_url": "https://example.com/diagram.png"
    }

def generate_mock_customer_result():
    return {
        "segment": "Health & Fitness Enthusiasts",
        "needs": [
            "Easy progress tracking",
            "Motivation through gamification",
            "Social features for accountability",
            "Personalized insights"
        ]
    }

def generate_mock_engineer_result():
    return {
        "feasibility": "High",
        "timeline": "4-6 months",
        "tech_stack": ["React Native", "Node.js", "MongoDB", "AWS"],
        "complexity": "Medium"
    }

def generate_mock_risk_result():
    return {
        "level": "Medium",
        "mitigations": [
            "Start with MVP to validate market fit",
            "Implement robust data privacy measures",
            "Plan for scalability from the beginning",
            "Regular security audits"
        ],
        "concerns": [
            "Market competition",
            "User retention",
            "Data security"
        ]
    }

def generate_mock_summary():
    return "A comprehensive fitness tracking application that helps users monitor workouts, track nutrition, and share progress with their community. The app will feature personalized recommendations, social challenges, and detailed analytics to keep users motivated."

# --- API Endpoints ---

@app.post("/start_conversation")
async def start_conversation(request: StartConversationRequest):
    """Start a new clarifier conversation with initial input."""
    thread_id = str(uuid4())
    
    # Initialize conversation state with clarifier questions
    clarifier_questions = [
        "What is the main purpose of your app?",
        "Who is your target audience?",
        "What platforms do you want to support (iOS/Android)?",
        "What is your budget range?",
        "When do you need it completed?"
    ]
    
    # Set the first answer to the initial text input
    clarifier_resp = [
        ClarifierQuestion(question=clarifier_questions[0], answer=request.text_input)
    ]
    
    # Add remaining questions without answers
    for question in clarifier_questions[1:]:
        clarifier_resp.append(ClarifierQuestion(question=question))
    
    conversations[thread_id] = ConversationState(
        clarifier=ClarifierResponse(resp=clarifier_resp, done=False),
        current_round=1
    )
    
    return {"type": "start", "thread_id": thread_id}

@app.post("/continue_clarifier")
async def continue_clarifier(request: ContinueClarifierRequest):
    """Continue the clarifier conversation by providing answers to previous questions."""
    if request.thread_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv = conversations[request.thread_id]
    
    # Update answers
    questions = conv.clarifier.resp
    unanswered_questions = [q for q in questions if q.answer is None]
    
    # Update with provided answers
    for i, answer in enumerate(request.answers):
        if i < len(unanswered_questions):
            unanswered_questions[i].answer = answer
    
    # Check if all questions are answered
    all_answered = all(q.answer is not None for q in questions)
    conv.clarifier.done = all_answered
    conv.current_round += 1
    
    return {
        "type": "continue",
        "thread_id": request.thread_id,
        "content": conv.clarifier.json()
    }

@app.get("/get_state/{thread_id}")
async def get_state(thread_id: str):
    """Retrieve the current state of a conversation."""
    if thread_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv = conversations[thread_id]
    return {
        "thread_id": thread_id,
        "state": conv.dict(),
        "clarifier_done": conv.clarifier.done,
        "current_round": conv.current_round
    }

@app.post("/run_workflow")
async def run_workflow(request: RunWorkflowRequest):
    """Start the product analysis workflow in the background."""
    if request.thread_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if not conversations[request.thread_id].clarifier.done:
        raise HTTPException(status_code=400, detail="Clarifier not completed")
    
    # Mark workflow as started
    conversations[request.thread_id].workflow_started = True
    
    # Simulate async workflow processing
    asyncio.create_task(process_workflow_async(request.thread_id))
    
    return {"status": "workflow_started", "thread_id": request.thread_id}

async def process_workflow_async(thread_id: str):
    """Simulate workflow processing in the background."""
    # Simulate processing time
    await asyncio.sleep(2)
    
    if thread_id in conversations:
        # Generate mock results
        conversations[thread_id].workflow_result = {
            "clarifier": conversations[thread_id].clarifier.dict(),
            **generate_mock_product_result(),
            **generate_mock_customer_result(),
            **generate_mock_engineer_result(),
            **generate_mock_risk_result(),
            "summary": generate_mock_summary(),
            "tts_file": "https://example.com/speech.mp3"
        }

@app.get("/get_result/{thread_id}")
async def get_result(thread_id: str):
    """Retrieve the final result of the workflow after it completes."""
    if thread_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv = conversations[thread_id]
    
    if not conv.workflow_started:
        raise HTTPException(status_code=400, detail="Workflow not started")
    
    if not conv.workflow_result:
        raise HTTPException(status_code=202, detail="Workflow still processing")
    
    return conv.workflow_result

@app.post("/run_workflow_stream")
async def run_workflow_stream(request: RunWorkflowStreamRequest):
    """Run the entire workflow in one go and stream the results in real-time."""
    thread_id = str(uuid4())
    
    # Initialize conversation with first answer
    clarifier_questions = [
        "What is the main purpose of your app?",
        "Who is your target audience?",
        "What platforms do you want to support (iOS/Android)?",
        "What is your budget range?",
        "When do you need it completed?"
    ]
    
    clarifier_resp = [
        ClarifierQuestion(question=clarifier_questions[0], answer=request.text_input)
    ]
    
    # Add remaining questions with mock answers
    for i, question in enumerate(clarifier_questions[1:], 1):
        clarifier_resp.append(ClarifierQuestion(
            question=question,
            answer=f"Mock answer to question {i+1}"
        ))
    
    clarifier = ClarifierResponse(resp=clarifier_resp, done=True)
    
    # Store conversation
    conversations[thread_id] = ConversationState(
        clarifier=clarifier,
        current_round=1,
        workflow_started=True
    )
    
    async def generate_stream():
        timestamp = time.time()
        
        # Start
        yield json.dumps({
            "step": "start",
            "status": "success",
            "data": {"thread_id": thread_id},
            "thread_id": thread_id,
            "timestamp": timestamp
        }) + "\n"
        
        # Clarifier
        yield json.dumps({
            "step": "clarifier",
            "status": "success",
            "data": clarifier.dict(),
            "thread_id": thread_id,
            "timestamp": timestamp + 1
        }) + "\n"
        
        # Product
        yield json.dumps({
            "step": "product",
            "status": "success",
            "data": generate_mock_product_result(),
            "thread_id": thread_id,
            "timestamp": timestamp + 2
        }) + "\n"
        
        # Customer
        yield json.dumps({
            "step": "customer",
            "status": "success",
            "data": generate_mock_customer_result(),
            "thread_id": thread_id,
            "timestamp": timestamp + 3
        }) + "\n"
        
        # Engineer
        yield json.dumps({
            "step": "engineer",
            "status": "success",
            "data": generate_mock_engineer_result(),
            "thread_id": thread_id,
            "timestamp": timestamp + 4
        }) + "\n"
        
        # Risk
        yield json.dumps({
            "step": "risk",
            "status": "success",
            "data": generate_mock_risk_result(),
            "thread_id": thread_id,
            "timestamp": timestamp + 5
        }) + "\n"
        
        # Summary
        yield json.dumps({
            "step": "summary",
            "status": "success",
            "data": {"summary": generate_mock_summary()},
            "thread_id": thread_id,
            "timestamp": timestamp + 6
        }) + "\n"
        
        # TTS
        yield json.dumps({
            "step": "tts",
            "status": "success",
            "data": {"tts_file": "https://example.com/speech.mp3"},
            "thread_id": thread_id,
            "timestamp": timestamp + 7
        }) + "\n"
        
        # Final result
        final_result = {
            "clarifier": clarifier.dict(),
            **generate_mock_product_result(),
            **generate_mock_customer_result(),
            **generate_mock_engineer_result(),
            **generate_mock_risk_result(),
            "summary": generate_mock_summary(),
            "tts_file": "https://example.com/speech.mp3"
        }
        
        # Store the result
        conversations[thread_id].workflow_result = final_result
        
        yield json.dumps(final_result) + "\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="application/x-ndjson"
    )

# --- Health Check ---
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": time.time(),
        "conversations": len(conversations)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)