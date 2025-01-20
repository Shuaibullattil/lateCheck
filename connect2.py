import os
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from pymongo import MongoClient

import json
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from pymongo.server_api import ServerApi
import base64
from fastapi.responses import JSONResponse
import requests
from typing import Optional
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://vivekofficial619:RE91nMfcWsXM0TDq@miniproject.dmmkl.mongodb.net/?retryWrites=true&w=majority&appName=MiniProject"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client["sample"]  # Replace with your database name
collection = db["first"]  # Replace with your collection name

app= FastAPI()

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
    
@app.post("/insert/timing")
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
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "history data inserted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)