import os
import random
import cv2
from fastapi import BackgroundTasks, FastAPI, HTTPException, File, UploadFile, Form
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

uri = "mongodb+srv://vivekofficial619:RE91nMfcWsXM0TDq@miniproject.dmmkl.mongodb.net/?retryWrites=true&w=majority&appName=MiniProject"

# Create a new client and connect to the servers
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client["sample"]  # Replace with your database names
collection = db["first"]  # Replace with your collection name
cluster = db["users"]

app= FastAPI()

@app.get("/user/pass")
async def get_user(
    username: str
):
    u1=cluster.find_one({"username":username},{"_id":0})
    if u1:
        return u1
    else:
        raise HTTPException(status_code=404, detail="Student not found")
    
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
        {"name": 1, "student_id": 1, "details": 1, "_id": 0}  
    )
    if query_result:
        return query_result
    else:
        raise HTTPException(status_code=404, detail="Student not found")
    

async def insert_memory(
    name: str,
    student_id: int,
    timing: str,
    purpose: str,
):
    history = {
        'timing': timing,
        'purpose': purpose
    }

    result = collection.update_one(
        {'name': name, 'student_id': student_id},
        {'$push': {'history': history}}
    )

    if result.matched_count == 0:
        print("User not found")
        return
    print("History data inserted successfully")

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
                            student_id = 22021740
                            timing = "2025-01-21 12:00:00"
                            purpose = "Rayan house demolish"
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)