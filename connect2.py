import os
import random
import cv2
from fastapi import BackgroundTasks, FastAPI, HTTPException, File, UploadFile, Form,WebSocket,WebSocketDisconnect, Header, APIRouter
from pymongo import MongoClient
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from pymongo.server_api import ServerApi
import base64
from fastapi.responses import JSONResponse, StreamingResponse
import requests
from typing import Optional
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from passlib.context import CryptContext
from datetime import datetime
from typing import Dict,List
from datetime import datetime, timedelta, timezone
from typing import Dict
import asyncio
from bson import ObjectId
import jwt  # For JWT authentication
import hashlib  # For password hashing
from dotenv import load_dotenv
from pytz import timezone as tz

UTC = timezone.utc
IST = tz("Asia/Kolkata")


uri = "mongodb+srv://vivekofficial619:RE91nMfcWsXM0TDq@miniproject.dmmkl.mongodb.net/?retryWrites=true&w=majority&appName=MiniProject"

# Create a new client and connect to the servers
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client["sample"]  
collection = db["first"]  
users_collection = db["users"]
message_collection = db["messages"]
notification_collection = db["notifications"]

app= FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use ["http://localhost:3000"] for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    sender_id: str
    receiver_id: str
    message: str
    timestamp: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

class PasswordData(BaseModel):
    email: str
    password: str

@app.post("/set-password")
async def set_password(data: PasswordData):
    hashed_pwd = hash_password(data.password)
    new_data={
        "username": data.email,
        "password": hashed_pwd,
        "usertype": "student",
        "status": "unverified"
    }
    users_collection.insert_one(new_data)
    return {"message": "Password set successfully"}



# Function to verify passwords
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

HOSTEL_IDS = {
    "sarover": "111111",
    "sahara": "222222",
    "swaraj": "333333",
    "sagar": "444444"
}

def get_available_room():
    while True:
        room_no = random.randint(201, 301)
        if not collection.find_one({"details.room_no": room_no}):
            return room_no
        
def convert_datetime(data):
    if "timing" in data and isinstance(data["timing"], datetime):
        data["timing"] = data["timing"].isoformat()  # Convert datetime to string
    return data

def student_serializer(student):
    return {
        "id": str(student["_id"]),
        "name": student["name"],
        "hostel_id": student["details"]["hostel_id"],
        "branch": student["details"]["branch"],
        "sem": student["details"]["sem"],
        "hostel": student["details"]["hostel"],
        "room_no": student["details"]["room_no"],
        "phone_no": student["details"]["phone_no"],
        "email": student["details"]["email"],
    }

@app.get("/students")
def get_students():
    students = collection.find()
    return [student_serializer(student) for student in students]

@app.post("/add/user")
async def add_user(
    name: str,
    address: str,
    email: str,
    hostel: str,
    sem: int,
    branch: str,
    phone_no: str,
    student_id: str
):
    if hostel.lower() not in HOSTEL_IDS:
        raise HTTPException(status_code=400, detail="Invalid hostel name")

    hostel_id = HOSTEL_IDS[hostel.lower()]
    room_no = get_available_room()

    if collection.find_one({"name": name, "id": student_id}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_data = {
        "name": name,
        "details": {
            "address": address,
            "email": email,
            "hostel": hostel,
            "sem": sem,
            "branch": branch,
            "hostel_id": hostel_id,
            "phone_no": phone_no,
            "room_no": room_no,
            "id": student_id
        },
        "history": [],
    }

    collection.insert_one(user_data)
    return {"message": "User added successfully"}

@app.get("/get/history")
async def get_person(name: str, student_id: int):
    query_result = collection.find_one(
        {"name": name, "student_id": student_id},
        {"history": 1, "_id": 0}
    )
    if query_result:
        return query_result.get("history", [])
    else:
        return []   
    
@app.get("/get/student")
async def get_student_details(name: str, student_id: int):
    query_result = collection.find_one(
        {"name": name, "student_id": student_id},
        {"name": 1, "id": 1, "details": 1, "_id": 0}  
    )
    if query_result:
        return query_result
    else:
        raise HTTPException(status_code=404, detail="Student not found")
    
    

class HistoryRequest(BaseModel):
    name: str
    hostel_id: str
    purpose: str

def convert_datetime(obj):
    if isinstance(obj, dict):
        return {k: convert_datetime(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_datetime(i) for i in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()  # Convert datetime to string
    return obj

@app.post("/update/history")
async def insert_memory(request: HistoryRequest):
    current_time = datetime.now()

    history = {
        'timing': current_time,
        'purpose': request.purpose
    }

    result = collection.update_one(
        {'name': request.name, 'details.hostel_id': request.hostel_id},
        {'$push': {'history': history}}
    )

    if result.matched_count == 0:
        return {"message": "User not found"}

    return {"message": "History data inserted successfully"}

@app.get("/students/today")
async def get_students_with_today_entries():
    # Use UTC for consistent timing (adjust if your DB uses local time)
    now_utc = datetime.now(timezone.utc)
    today_start = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now_utc.replace(hour=23, minute=59, second=59, microsecond=999999)

    pipeline = [
        {
            "$match": {
                "history": {
                    "$elemMatch": {
                        "timing": {
                            "$gte": today_start,
                            "$lte": today_end
                        }
                    }
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "name": 1,
                "details.sem": 1,
                "details.branch": 1,
                "history": {
                    "$filter": {
                        "input": "$history",
                        "as": "entry",
                        "cond": {
                            "$and": [
                                {"$gte": ["$$entry.timing", today_start]},
                                {"$lte": ["$$entry.timing", today_end]}
                            ]
                        }
                    }
                }
            }
        }
    ]

    students = list(collection.aggregate(pipeline))
    count=0
    # Flatten results
    flat_result = []
    for student in students:
        name = student["name"]
        sem = student["details"]["sem"]
        branch = student["details"]["branch"]
        batch = f"S{sem} | {branch}"

        for entry in student["history"]:
            count=count+1
            utc_time = entry["timing"]
            ist_time = utc_time.astimezone(IST)
            formatted_time = ist_time.strftime("%I:%M %p")
            flat_result.append({
                "id": count,
                "name": name,
                "batch": batch,
                "avatar": "https://i.pinimg.com/736x/c4/ea/8b/c4ea8bf28dd46e81339c825ff8248533.jpg",
                "time": formatted_time,
                "reason": entry["purpose"]
            })

    return flat_result

@app.get("/stream/qr-detection")
async def stream_qr_detection():
    async def generate_frames():
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise HTTPException(status_code=500, detail="Webcam could not be opened")
        qr_detector = cv2.QRCodeDetector()
        detected_qr_data = set()
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            data, points, _ = qr_detector.detectAndDecode(frame)
            if points is not None:
                points = points[0]
                for i in range(len(points)):
                    pt1 = tuple(map(int, points[i]))
                    pt2 = tuple(map(int, points[(i + 1) % len(points)]))
                    cv2.line(frame, pt1, pt2, (0, 255, 0), 2)

                if data:
                    if data not in detected_qr_data:
                        print(f"{data}")
                        detected_qr_data.add(data)
                        if data == "sahara":
                            name = "Jane Doe"
                            student_id = 12341111
                            timing = "2025-01-21 12:00:00"
                            purpose = "Going to a friend's room"
                            await insert_memory(name, student_id, timing, purpose)
                        else:
                            print("Illegal entry is not allowed!")
                    cv2.putText(frame, f"{data}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                                0.7, (0, 255, 0), 2, cv2.LINE_AA)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        cap.release()

    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1

# Function to Create JWT Token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ✅ LOGIN Endpoint (Returns JWT Token)
@app.post("/login")
async def login(user: User):
    user_data = users_collection.find_one({"username": user.username})
    
    if not user_data or not verify_password(user.password, user_data["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Convert ObjectId and datetime fields
    user_data["_id"] = str(user_data["_id"])
    user_data = convert_datetime(user_data)

    # Generate JWT Token
    access_token = create_access_token({"sub": user.username})

    user_detail = collection.find_one({"details.email": user_data["username"]})

    if user_detail:
        user_detail["_id"] = str(user_detail["_id"])
        user_detail = convert_datetime(user_detail)
    else:
        user_detail = {}

    return JSONResponse(content={"message": "Login successful", "token": access_token, "user": user_data, "detail": user_detail})

# ✅ Protected Route (Example)
@app.get("/protected")
async def protected_route(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split("Bearer ")[-1]  # Extract token

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return JSONResponse(content={"message": "You have access!", "user": username})


# Store connected users
active_connections: Dict[str, WebSocket] = {}
print(active_connections)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    active_connections[user_id] = websocket
    print(active_connections)
    print(f"User {user_id} connected")

    try:
        while True:
            print("enter while loop")
            data = await websocket.receive_json()
            if not isinstance(data, dict):
                print(f"Invalid message format from {user_id}: {data}")
                continue

            receiver_id = data.get("receiver_id")
            message = data.get("message")

            if not receiver_id or not message:
                print(f"Incomplete message from {user_id}: {data}")
                continue

            sender_doc = collection.find_one({"details.email": user_id}, {"name": 1, "_id": 0})
            sender_name = sender_doc.get("name") if sender_doc else "warden"

            timestamp = convert_datetime(datetime.now())

            message_data = {
                "sender_name": sender_name,
                "sender_id": user_id,
                "receiver_id": receiver_id,
                "message": message,
                "timestamp": timestamp,
            }

            if receiver_id in active_connections:
                receiver_socket = active_connections[receiver_id]
                
                print(f"Receiver {receiver_id} is connected: {receiver_socket}")
                print(f"Sending message: {message_data}")
                
                try:
                    await receiver_socket.send_json(message_data)
                    message_collection.insert_one(message_data)
                    print("Message successfully sent over WebSocket")
                except Exception as e:
                    print(f"WebSocket send error: {e}")
            else:
                print(f"Receiver {receiver_id} is NOT connected.")

    except WebSocketDisconnect:
        print(f"User {user_id} disconnected")
    except asyncio.CancelledError:
        print(f"WebSocket task for {user_id} was cancelled")
    except Exception as e:
        print(f"Unexpected error for {user_id}: {e}")
    finally:
        # Remove connection if it exists
        if user_id in active_connections:
            del active_connections[user_id]
        print(f"Connection removed for {user_id}")

def message_serializer(message):
    """Convert MongoDB document to JSON serializable format"""
    message["_id"] = str(message["_id"])  # Convert ObjectId to string
    return message

@app.get("/inbox/{receiver_id}")
def get_inbox(receiver_id: str):
    try:
        # Get all messages for the receiver
        all_messages = list(message_collection.find({"receiver_id": receiver_id}))
        
        # Create a dictionary to store the latest message from each sender
        latest_messages = {}
        
        # Process each message
        for message in all_messages:
            sender_id = message.get("sender_id")
            timestamp = message.get("timestamp")
            
            # If sender not in dictionary or this message is newer
            if sender_id not in latest_messages or timestamp > latest_messages[sender_id].get("timestamp"):
                latest_messages[sender_id] = message
        
        # Get the list of latest messages and sort by timestamp (newest first)
        result = list(latest_messages.values())
        result.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        # Limit to 100 results
        result = result[:100]
        
        # Serialize and return
        return [message_serializer(message) for message in result]
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    

@app.get("/messages/{user_id}/{receiver_id}")
async def get_chat_history(user_id: str, receiver_id: str):
    messages = list(message_collection.find({
        "$or": [
            {"sender_id": user_id, "receiver_id": receiver_id},
            {"sender_id": receiver_id, "receiver_id": user_id}
        ]
    }).sort("timestamp", 1))  # Sort by timestamp (oldest to newest)

    # Convert ObjectId to string
    for msg in messages:
        msg["_id"] = str(msg["_id"])

    return messages

# Model for notification data
class NotificationCreate(BaseModel):
    message: str
    sender_id: str
    timestamp: str

# API endpoint to create a notification
@app.post("/notifications/create")
async def create_notification(notification: NotificationCreate):
    try:
        # Create notification document
        notification_doc = {
            "message": notification.message,
            "sender_id": notification.sender_id,
            "timestamp": notification.timestamp,
        }
        
        # Insert into MongoDB
        result = notification_collection.insert_one(notification_doc)
        
        return {
            "success": True,
            "id": str(result.inserted_id),
            "message": "Notification created successfully"
        }
    except Exception as e:
        print(f"Error creating notification: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
@app.get("/notifications/all")
async def get_all_notifications():
    try:
        notifications = list(notification_collection.find().sort("timestamp", -1))  # Sort by newest first
        for note in notifications:
            note["_id"] = str(note["_id"])
        return {"success": True, "data": notifications}
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})


if __name__ == "__main__":
    import uvicorn
    #uvicorn.run("connect2:app", host="0.0.0.0", port=8000, reload=True)
    uvicorn.run(app, host="127.0.0.1", port=8000)