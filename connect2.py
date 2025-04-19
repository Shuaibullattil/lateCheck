import os
import random
import cv2
from fastapi import BackgroundTasks, FastAPI, HTTPException, File, Query, UploadFile, Form,WebSocket,WebSocketDisconnect, Header, APIRouter, Request
from pymongo import MongoClient
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from pymongo.server_api import ServerApi
from openai import OpenAI
import json
from bson import ObjectId
from datetime import datetime
import base64
from fastapi.responses import JSONResponse, StreamingResponse
import requests
from typing import Any, Optional
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from passlib.context import CryptContext
from datetime import datetime, time
from typing import Dict,List
from datetime import datetime, timedelta, timezone
from typing import Dict
import asyncio
from bson import ObjectId
import jwt, smtplib, ssl  
import hashlib  # For password hashing
from dotenv import load_dotenv
from pytz import timezone as tz
from pytz import UTC
from email.message import EmailMessage
import json
import json
import os
import tempfile
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from openai import OpenAI
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import io

load_dotenv()

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
warden_collection = db["wardens"]  
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
    
class FrequentLateEntry(BaseModel):
    user_id: str
    user_name: str
    total_late_entries: int
    last_late_entry_time: str

class LateEntryTimePattern(BaseModel):
    time_range: str
    count: int

class BehavioralInsight(BaseModel):
    description: str
    users: Optional[List[dict]] = Field(default_factory=list)
    related_event: Optional[str] = None

class Recommendation(BaseModel):
    action: str
    expected_outcome: str
    priority: str  # High, Medium, Low

class LateEntryReport(BaseModel):
    overview: str
    total_users: int
    total_late_entries: int
    frequent_late_entries: List[FrequentLateEntry]
    most_common_late_time: LateEntryTimePattern
    late_entry_patterns: List[LateEntryTimePattern]
    average_delay_time: str
    alert_warnings: List[str] = Field(default_factory=list)
    behavioral_insights: List[BehavioralInsight] = Field(default_factory=list)
    recommendations: List[Recommendation] = Field(default_factory=list)
    behavioral_analysis: Optional[str] = None
    seasonal_patterns: Optional[str] = None
    future_projections: Optional[str] = None

# Modified input model for the API endpoint
class GenerateReportOptions(BaseModel):
    generate_ai_content: bool = True
    custom_title: Optional[str] = None
    
def load_json_data(file_path: str = "./late_entries_data_updated.json") -> Dict[str, Any]:
    """Load late entry data from JSON file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data file {file_path} not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format in {file_path}")

def generate_enhanced_ai_content(json_data):
    """Generate additional AI-driven content for the report based on the data."""
    client = OpenAI()
    
    # Convert to string if it's not already
    if not isinstance(json_data, str):
        json_string = json.dumps(json_data)
    else:
        json_string = json_data
    
    # Generate enhanced behavioral analysis
    behavioral_analysis_response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an expert behavioral analyst specializing in student dormitory patterns."},
            {"role": "user", "content": f"""
            Based on this late entry data, provide a comprehensive behavioral analysis (around 300 words).
            Focus on possible psychological and sociological factors, group behaviors, and individual motivation patterns.
            Be insightful and specific, connecting patterns to potential underlying causes.
            
            Data to analyze:
            {json_string}
            """} 
        ]
    )
    
    # Generate AI recommendations
    recommendations_response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an expert in student affairs and dormitory management."},
            {"role": "user", "content": f"""
            Based on this late entry data, provide 5 specific, actionable recommendations in JSON format.
            For each recommendation, include:
            - action: The specific action to take
            - expected_outcome: What the likely result will be
            - priority: Priority level (High, Medium, or Low)
            
            Format as a JSON array of objects.
            
            Data to analyze:
            {json_string}
            """} 
        ],
        response_format={"type": "json_object"}
    )
    
    # Generate seasonal patterns analysis
    seasonal_response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an expert in student behavior pattern analysis."},
            {"role": "user", "content": f"""
            Based on this late entry data, provide an analysis of potential seasonal patterns (around 200 words).
            Consider how weather, academic calendar (exams, holidays), and social events might influence late entry patterns.
            
            Data to analyze:
            {json_string}
            """} 
        ]
    )
    
    # Generate future projections
    projections_response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are an expert in predictive analytics for student behavior."},
            {"role": "user", "content": f"""
            Based on this late entry data, provide future projections and trends (around 150 words).
            What patterns might emerge in the coming months if no intervention is made?
            What leading indicators should administrators watch for?
            
            Data to analyze:
            {json_string}
            """} 
        ]
    )
    
    # Process and return the enhanced content
    recommendations_json = json.loads(recommendations_response.choices[0].message.content)
    
    # Make sure we're getting the actual recommendations array from the response
    recommendations_data = recommendations_json.get("recommendations", [])
    if not recommendations_data and isinstance(recommendations_json, list):
        recommendations_data = recommendations_json
    elif not recommendations_data and isinstance(recommendations_json, dict):
        # Look for any array in the response that might contain our recommendations
        for key, value in recommendations_json.items():
            if isinstance(value, list) and len(value) > 0 and isinstance(value[0], dict):
                if "action" in value[0]:
                    recommendations_data = value
                    break
    
    enhanced_content = {
        "behavioral_analysis": behavioral_analysis_response.choices[0].message.content,
        "recommendations": recommendations_data,
        "seasonal_patterns": seasonal_response.choices[0].message.content,
        "future_projections": projections_response.choices[0].message.content
    }
    
    return enhanced_content

def adapt_data_format(report):
    """Convert the LateEntryReport model data to the format expected by generate_pdf_report."""
    adapted_data = {
        "overview": report.overview,
        "total_users": report.total_users,
        "total_late_entries": report.total_late_entries,
        "most_common_late_time": f"{report.most_common_late_time.time_range} ({report.most_common_late_time.count} entries)",
        "average_delay_time": report.average_delay_time,
        "frequent_late_entries": [
            {
                "name": entry.user_name,
                "id": entry.user_id, 
                "late_entries": entry.total_late_entries,
                "last_entry_time": entry.last_late_entry_time
            } for entry in report.frequent_late_entries
        ],
        "late_entry_patterns": ", ".join([f"{pattern.time_range}: {pattern.count} entries" for pattern in report.late_entry_patterns]),
        "alert_warnings": "\n".join([f"• {warning}" for warning in report.alert_warnings]) if report.alert_warnings else "No alerts at this time.",
        "behavioral_insights": "\n".join([
            f"• {insight.description}" + 
            (f" [Users: {', '.join([user.get('user_name', '') for user in insight.users])}]" if insight.users else "") +
            (f" [Related Event: {insight.related_event}]" if insight.related_event else "")
            for insight in report.behavioral_insights
        ]) if report.behavioral_insights else "No behavioral insights available.",
        "recommendations": report.recommendations if hasattr(report, 'recommendations') else [],
        "behavioral_analysis": report.behavioral_analysis if hasattr(report, 'behavioral_analysis') else None,
        "seasonal_patterns": report.seasonal_patterns if hasattr(report, 'seasonal_patterns') else None,
        "future_projections": report.future_projections if hasattr(report, 'future_projections') else None
    }
    return adapted_data

def generate_pdf_report(report_data, title=None, output_file="hostel_late_entry_report.pdf"):
    """Generate a PDF report from the hostel late entry data."""
    
    # Adapt the data format if necessary
    if isinstance(report_data, LateEntryReport):
        data = adapt_data_format(report_data)
    elif isinstance(report_data, str):
        # Assuming it's a JSON string
        report = LateEntryReport.model_validate(json.loads(report_data))
        data = adapt_data_format(report)
    elif isinstance(report_data, dict):
        # Check if it's already in the right format
        if "overview" in report_data and "frequent_late_entries" in report_data and isinstance(report_data["frequent_late_entries"], list):
            data = report_data
        else:
            # Try to parse as our report model
            try:
                report = LateEntryReport.model_validate(report_data)
                data = adapt_data_format(report)
            except Exception as e:
                print(f"Error adapting data format: {e}")
                return None
    else:
        print("Unsupported data format")
        return None
    
    # Create the PDF document
    doc = SimpleDocTemplate(output_file, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Create better styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles["Heading1"],
        fontSize=20,
        textColor=colors.HexColor("#2c3e50"),
        alignment=1,
        spaceAfter=12
    )
    
    heading_style = ParagraphStyle(
        'Heading',
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.HexColor("#16a085"),
        spaceBefore=12,
        spaceAfter=6
    )
    
    subheading_style = ParagraphStyle(
        'SubHeading',
        parent=styles["Heading3"],
        fontSize=12,
        textColor=colors.HexColor("#2980b9"),
        spaceBefore=8,
        spaceAfter=4
    )
    
    normal_style = ParagraphStyle(
        'Normal',
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.black,
        spaceBefore=4,
        spaceAfter=4
    )
    
    # Create a list to store the flowable elements
    elements = []
    
    # Add title (use custom title if provided)
    report_title = title if title else "Hostel Late Entry Report"
    elements.append(Paragraph(report_title, title_style))
    elements.append(Spacer(1, 0.15*inch))
    
    # Add date
    date_style = ParagraphStyle(
        'DateStyle',
        parent=normal_style,
        alignment=1,
        spaceAfter=0.3*inch
    )
    current_date = datetime.now().strftime("%B %d, %Y")
    elements.append(Paragraph(f"Generated on: {current_date}", date_style))
    
    # Add overview
    elements.append(Paragraph("Executive Summary", heading_style))
    elements.append(Paragraph(data["overview"], normal_style))
    elements.append(Spacer(1, 0.15*inch))
    
    # Add summary statistics
    elements.append(Paragraph("Summary Statistics", heading_style))
    
    stats_data = [
        ["Total Residents", str(data["total_users"])],
        ["Total Late Entries", str(data["total_late_entries"])],
        ["Most Common Late Time", data["most_common_late_time"]],
        ["Average Delay", data["average_delay_time"]]
    ]
    
    # Create a table for the statistics
    stats_table = Table(stats_data, colWidths=[2.5*inch, 3*inch])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#ecf0f1")),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#2c3e50")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey)
    ]))
    
    elements.append(stats_table)
    elements.append(Spacer(1, 0.15*inch))
    
    # Add charts for visual representation
    elements.append(Paragraph("Visual Analysis", heading_style))
    
    # Create a pie chart for late entry patterns if the original data is available
    if isinstance(report_data, LateEntryReport):
        buffer = io.BytesIO()
        plt.figure(figsize=(6, 4))
        
        # Extract data for pie chart
        patterns = report_data.late_entry_patterns
        labels = [p.time_range for p in patterns]
        sizes = [p.count for p in patterns]
        
        # Plot pie chart with better colors
        colors_palette = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']
        plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors_palette[:len(sizes)])
        plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
        plt.title('Late Entry Time Distribution')
        
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # Add the pie chart to the PDF
        img = Image(buffer)
        img.drawHeight = 3*inch
        img.drawWidth = 5*inch
        elements.append(img)
        elements.append(Spacer(1, 0.15*inch))
    
    # Add frequent late entries section
    elements.append(Paragraph("Frequent Late Entries", heading_style))
    
    # Create header for the table
    freq_data = [["Name", "ID", "Late Entries", "Last Entry Time"]]
    
    # Add data rows
    for entry in data["frequent_late_entries"]:
        # Format the date from ISO format
        try:
            date_obj = datetime.fromisoformat(entry["last_entry_time"].replace("Z", "+00:00"))
            formatted_date = date_obj.strftime("%Y-%m-%d %H:%M")
        except:
            formatted_date = entry["last_entry_time"]
        
        freq_data.append([
            entry["name"], 
            entry["id"],
            str(entry["late_entries"]), 
            formatted_date
        ])
    
    # Create a table for frequent late entries
    freq_table = Table(freq_data, colWidths=[1.5*inch, 1*inch, 1*inch, 2*inch])
    freq_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#34495e")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#ecf0f1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#ecf0f1")]),
        ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey)
    ]))
    
    elements.append(freq_table)
    elements.append(Spacer(1, 0.15*inch))
    
    # Create a bar chart for top late entries
    drawing = Drawing(400, 200)
    bc = VerticalBarChart()
    bc.x = 50
    bc.y = 50
    bc.height = 125
    bc.width = 300
    bc.data = [[entry["late_entries"] for entry in data["frequent_late_entries"]]]
    bc.categoryAxis.categoryNames = [entry["name"] for entry in data["frequent_late_entries"]]
    bc.categoryAxis.labels.boxAnchor = 'ne'
    bc.categoryAxis.labels.dx = 8
    bc.categoryAxis.labels.dy = -2
    bc.categoryAxis.labels.angle = 30
    bc.valueAxis.valueMin = 0
    max_late_entries = max([entry["late_entries"] for entry in data["frequent_late_entries"]])
    bc.valueAxis.valueMax = max_late_entries + 1
    bc.valueAxis.valueStep = 1
    bc.bars[0].fillColor = colors.HexColor("#3498db")
    drawing.add(bc)
    elements.append(drawing)
    elements.append(Spacer(1, 0.15*inch))
    
    # Add late entry patterns
    elements.append(Paragraph("Late Entry Patterns", heading_style))
    elements.append(Paragraph(data["late_entry_patterns"], normal_style))
    elements.append(Spacer(1, 0.15*inch))
    
    # Add alerts and warnings
    if data["alert_warnings"] and data["alert_warnings"] != "No alerts at this time.":
        elements.append(Paragraph("Alerts & Warnings", heading_style))
        warning_style = ParagraphStyle(
            'Warning',
            parent=normal_style,
            textColor=colors.HexColor("#e74c3c")
        )
        elements.append(Paragraph(data["alert_warnings"], warning_style))
        elements.append(Spacer(1, 0.15*inch))
    
    # Add behavioral insights
    elements.append(Paragraph("Behavioral Insights", heading_style))
    insight_style = ParagraphStyle(
        'Insight',
        parent=normal_style,
        textColor=colors.HexColor("#2980b9")
    )
    elements.append(Paragraph(data["behavioral_insights"], insight_style))
    elements.append(Spacer(1, 0.15*inch))
    
    # Add AI-generated behavioral analysis
    if data["behavioral_analysis"]:
        elements.append(Paragraph("Comprehensive Behavioral Analysis", heading_style))
        analysis_style = ParagraphStyle(
            'Analysis',
            parent=normal_style,
            textColor=colors.HexColor("#2c3e50")
        )
        elements.append(Paragraph(data["behavioral_analysis"], analysis_style))
        elements.append(Spacer(1, 0.15*inch))
    
    # Add seasonal patterns
    if data["seasonal_patterns"]:
        elements.append(Paragraph("Seasonal Pattern Analysis", heading_style))
        seasonal_style = ParagraphStyle(
            'Seasonal',
            parent=normal_style,
            textColor=colors.HexColor("#16a085")
        )
        elements.append(Paragraph(data["seasonal_patterns"], seasonal_style))
        elements.append(Spacer(1, 0.15*inch))
    
    # Add future projections
    if data["future_projections"]:
        elements.append(Paragraph("Future Projections", heading_style))
        projection_style = ParagraphStyle(
            'Projection',
            parent=normal_style,
            textColor=colors.HexColor("#8e44ad")
        )
        elements.append(Paragraph(data["future_projections"], projection_style))
        elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("AI-Generated Recommendations", heading_style))

    if isinstance(data["recommendations"], list) and len(data["recommendations"]) > 0:
        # Create a table for recommendations with proper word wrapping
        recommendation_data = [["Action", "Expected Outcome", "Priority"]]
        
        for rec in data["recommendations"]:
            if isinstance(rec, dict):
                # For dictionary format
                action = rec.get("action", "")
                outcome = rec.get("expected_outcome", "")
                priority = rec.get("priority", "")
            elif isinstance(rec, Recommendation):
                # For Recommendation model
                action = rec.action
                outcome = rec.expected_outcome
                priority = rec.priority
            else:
                continue
                
            # Use Paragraph objects for each cell to enable word wrapping
            action_para = Paragraph(action, normal_style)
            outcome_para = Paragraph(outcome, normal_style)
            priority_para = Paragraph(priority, normal_style)
            
            recommendation_data.append([action_para, outcome_para, priority_para])
        
        # Create a table for recommendations with adjusted column widths
        if len(recommendation_data) > 1:  # Only create if we have actual recommendations
            # Adjust column widths to better accommodate content
            rec_table = Table(recommendation_data, colWidths=[2.2*inch, 3.3*inch, 1*inch])
            rec_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#16a085")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),  # Add left padding
                ('RIGHTPADDING', (0, 0), (-1, -1), 6), # Add right padding
                ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#ecf0f1")]),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),  # Align text to top of cell
            ]))
            elements.append(rec_table)
    else:
        elements.append(Paragraph("No specific recommendations available.", normal_style))

    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("This report is confidential and intended for hostel administration only."))
    
    # Build the PDF document
    doc.build(elements)
    print(f"PDF report generated successfully: {output_file}")
    return output_file

# Function to clean up temporary files
def remove_file(path: str):
    """Remove a file after it has been sent to the client."""
    if os.path.exists(path):
        os.unlink(path)
        
def custom_serializer(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()  # Or any format you prefer
    raise TypeError(f"Type {type(obj)} not serializable")

def export_to_json():
    data = list(collection.find())
    json_bytes = json.dumps(data, default=custom_serializer)
    return json_bytes
# Modified FastAPI endpoint to use the JSON file
@app.post("/generate-report/", response_class=FileResponse, summary="Generate a hostel late entry report from JSON file")
async def generate_report(options: GenerateReportOptions = None, background_tasks: BackgroundTasks = None):
    """
    Generate a comprehensive PDF report from hostel late entry data stored in 'late_entries_data_updated.json'.
    
    - **generate_ai_content**: Whether to generate additional AI analysis (default: True)
    - **custom_title**: Optional custom title for the report
    
    Returns a downloadable PDF report.
    """
    try:
        # Set default options if not provided
        if options is None:
            options = GenerateReportOptions()
        
        # Load data from the JSON file
        input_data = export_to_json()
        
        # Initialize OpenAI client
        client = OpenAI()
        
        # Generate structured report from data
        response = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are an expert at advanced structured data analysis and detailed report generation."},
                {"role": "user", "content": f"""
                Analyze this late entry data and provide a structured report following this exact JSON schema:
                {json.dumps(LateEntryReport.model_json_schema())}
                
                Make sure to include both user_id and user_name in the frequent_late_entries section,
                and include users with both their IDs and names in the behavioral_insights section.
                
                Be detailed in your behavioral insights, identifying specific patterns and psychological factors.
                
                Data to analyze:
                {json.dumps(input_data)}
                """} 
            ],
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        report_json = json.loads(response.choices[0].message.content)
        report = LateEntryReport.model_validate(report_json)
        
        # Generate enhanced AI content if requested
        if options.generate_ai_content:
            enhanced_content = generate_enhanced_ai_content(input_data)
            
            # Add the enhanced content to the report
            report.behavioral_analysis = enhanced_content["behavioral_analysis"]
            report.seasonal_patterns = enhanced_content["seasonal_patterns"]
            report.future_projections = enhanced_content["future_projections"]
            report.recommendations = [
                Recommendation(
                    action=item["action"],
                    expected_outcome=item["expected_outcome"],
                    priority=item["priority"]
                ) for item in enhanced_content["recommendations"]
            ]
        
        # Generate the PDF report
        # Use a temporary file for the PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_filename = temp_file.name
        
        generate_pdf_report(report, title=options.custom_title, output_file=temp_filename)
        
        # Schedule the file to be removed after the response is sent
        if background_tasks:
            background_tasks.add_task(remove_file, temp_filename)
        
        # Return the file
        return FileResponse(
            path=temp_filename, 
            filename="hostel_late_entry_report.pdf", 
            media_type="application/pdf",
            background=background_tasks
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

# Add a new endpoint to just process the JSON file directly
@app.get("/generate-report-from-file/", response_class=FileResponse, summary="Generate report directly from JSON file")
async def generate_report_from_file(
    background_tasks: BackgroundTasks = None
):
    """
    Generate a comprehensive PDF report directly from the 'late_entries_data_updated.json' file.
    
    - **generate_ai_content**: Whether to generate additional AI analysis (query parameter)
    - **custom_title**: Optional custom title for the report (query parameter)
    
    Returns a downloadable PDF report.
    """
    options = GenerateReportOptions(generate_ai_content=True, custom_title="Late Entry Report")
    return await generate_report(options, background_tasks)


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

client = OpenAI()

# Define response model
class MostLateReason(BaseModel):
    most_common_reason: str
    count: int
    
@app.get("/most-common-late-reason", response_model=MostLateReason)
def get_most_common_late_reason():
    # Load JSON data from file
    json_string = export_to_json()

    # Call OpenAI to extract most common late reason
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert at structured data extraction. "
                    "You will be given structured JSON data from a database and should convert it into the given structure, "
                    "create a description on the most common reason and its count."
                ),
            },
            {
                "role": "user",
                "content": json_string,
            },
        ],
        response_format=MostLateReason,
    )

    return completion.choices[0].message.parsed



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

def student_serializer(student) -> dict:
    details = student.get("details", {})
    return {
        "id": str(student.get("_id", "")),
        "name": student.get("name", ""),
        "student_id": details.get("id", ""),
        "branch": details.get("branch", ""),
        "sem": str(details.get("sem", "")),
        "hostel": details.get("hostel", ""),
        "room_no": str(details.get("room_no", "")),
        "phone_no": details.get("phone_no", ""),
        "email": details.get("email", "")
    }


@app.get("/students")
def get_students():
    students = collection.find()
    return [student_serializer(student) for student in students]

@app.get("/studentstable", response_model=List[dict])
def get_students_for_table(hostel: str, status: str,):
    # Step 1: Get users based on status and usertype
    filtered_users = list(users_collection.find({
        "status": status,
        "usertype": "student"
    }))

    # Step 2: Extract emails
    emails = [user["username"] for user in filtered_users]

    # Step 3: Get user details that match both email and hostel
    student_details = collection.find({
        "details.email": {"$in": emails},
        "details.hostel": hostel
    })

    # Step 4: Serialize the student data
    return [student_serializer(student) for student in student_details]

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
        {"name": name, "details.id": student_id},
        {"history": 1, "_id": 0}
    )
    if query_result:
        return query_result.get("history", [])
    else:
        return []   
    
@app.get("/get/student")
async def get_student_details(name: str, student_id: int):
    query_result = collection.find_one(
        {"name": name, "details.id": student_id},
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

def get_initials(name: str) -> str:
    parts = name.strip().split()
    if len(parts) == 0:
        return ""
    elif len(parts) == 1:
        return parts[0][0].upper()
    else:
        return (parts[0][0] + parts[-1][0]).upper()

@app.get("/students/today")
async def get_students_with_today_entries():
    # Use UTC for consistent timing (adjust if your DB uses local time)
    now_utc = datetime.now()
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
                "details.phone_no": 1,
                "details.room_no": 1,
                "total_entries": {"$size": "$history"},  # ➕ Count all entries in history
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
    count = 0
    flat_result = []

    for student in students:
        name = student["name"]
        sem = student["details"]["sem"]
        phone_no = student["details"]["phone_no"]
        room = student["details"]["room_no"]
        branch = student["details"]["branch"]
        batch = f"S{sem} | {branch}"
        total_entries = student["total_entries"]

        for entry in student["history"]:
            count += 1
            utc_time = entry["timing"]
            ist_time = utc_time.astimezone(IST)
            formatted_time = ist_time.strftime("%I:%M %p")

            flat_result.append({
                "id": count,
                "name": name,
                "batch": batch,
                "phone_no": phone_no,
                "room_no": room,
                "avatar": get_initials(name),
                "time": formatted_time,
                "reason": entry["purpose"],
                "total_late_entries": total_entries  # ➕ Added field
            })

    return {
        "count": count,
        "entries": flat_result
    }



@app.get("/filter/date")
async def filter_date_get_student(start_date: str, end_date: str):
    try:
        # Parse the date strings to date objects
        start_date_obj = datetime.strptime(start_date.strip(), "%Y-%m-%d")
        end_date_obj = datetime.strptime(end_date.strip(), "%Y-%m-%d")

        # Set to full-day range with UTC timezone
        start_utc = UTC.localize(datetime.combine(start_date_obj, time.min))
        end_utc = UTC.localize(datetime.combine(end_date_obj, time.max))
    except Exception as e:
        return {"error": f"Invalid date format: {e}"}

    # MongoDB pipeline
    pipeline = [
        {
            "$match": {
                "history": {
                    "$elemMatch": {
                        "timing": {
                            "$gte": start_utc,
                            "$lte": end_utc
                        }
                    }
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "name": 1,
                "details": 1,
                "history": {
                    "$filter": {
                        "input": "$history",
                        "as": "entry",
                        "cond": {
                            "$and": [
                                {"$gte": ["$$entry.timing", start_utc]},
                                {"$lte": ["$$entry.timing", end_utc]}
                            ]
                        }
                    }
                }
            }
        }
    ]

    results = list(collection.aggregate(pipeline))
    filtered_students = []

    for student in results:
        if student["history"]:
            # Sort and take earliest entry within the range
            student["history"].sort(key=lambda x: x["timing"])
            first_entry = student["history"][0]

            ist_time = first_entry["timing"].astimezone(IST)
            formatted_time = ist_time.strftime("%Y-%m-%d %I:%M %p")

            filtered_students.append({
                "name": student["name"],
                "batch": f'S{student["details"]["sem"]} | {student["details"]["branch"]}',
                "hostel": student["details"]["hostel"],
                "room_no": student["details"]["room_no"],
                "entry_time": formatted_time,
                "reason": first_entry["purpose"]
            })

    return filtered_students

otp_store = {}
class EmailRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str

@app.post("/send-otp")
def send_otp(request: EmailRequest):
    existing = otp_store.get(request.email)
    if existing and datetime.now() < existing["expires"]:
        return {"message": "OTP already sent. Try again later."}  # Don't resend
    otp = str(random.randint(100000, 999999))
    expiry = datetime.now() + timedelta(minutes=3)
    otp_store[request.email] = {"otp": otp, "expires": expiry}

    # Send Email
    port = 465
    smtp_server = "smtp.gmail.com"
    sender_email = "latecheckofficial@gmail.com"
    password = "rfzx jboz xmue yuqr"  # Use Gmail app password
    subject = "Your OTP for LateCheck Verification"
    body = f"Hello,\n\nYour OTP is: {otp}\nIt will expire in 3 minutes.\n\nThank you,\nLateCheck Team"

    # Use EmailMessage for proper formatting
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = request.email
    msg.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.send_message(msg)

    return {"message": "OTP sent"}

@app.post("/verify-otp")
def verify_otp(data: OTPVerify):
    if data.email not in otp_store:
        raise HTTPException(status_code=400, detail="OTP not found")

    entry = otp_store[data.email]
    if datetime.now() > entry["expires"]:
        del otp_store[data.email]
        raise HTTPException(status_code=400, detail="OTP expired")

    if entry["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    del otp_store[data.email]
    return {"message": "OTP verified"}

@app.delete("/delete/user")
async def delete_user(email: str):
    collection.delete_one({"details.email":email})
    users_collection.delete_one({"username":email})

@app.post("/approve/student")
async def approve_user(email: str):
    result = users_collection.update_one(
        {"username": email},
        {"$set": {"status": "verified"}}
    )
    if result.modified_count == 1:
        return {"message": f"{email} approved successfully."}
    else:
        return {"message": f"No user found with email {email} or already verified."}
    
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

    usertype = user_data["usertype"]
    status = user_data["status"]

    # Generate JWT Token
    access_token = create_access_token({"sub": user.username})

    if (usertype == "warden"):
        user_detail = warden_collection.find_one({"email" : user_data["username"]})
        
    else:
        user_detail = collection.find_one({"details.email": user_data["username"]})
    
    user_detail["usertype"] = usertype
    user_detail["status"] = status

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
    id: int
    message: str
    sender_id: str
    timestamp: str
    type:str

# API endpoint to create a notification
@app.post("/notifications/create")
async def create_notification(notification: NotificationCreate):
    try:
        # Create notification document
        notification_doc = {
            "id": notification.id,
            "message": notification.message,
            "sender_id": notification.sender_id,
            "timestamp": notification.timestamp,
            "type" : notification.type,
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
    
@app.delete("/notifications/{id}")
def delete_notification(id: int):
    result = notification_collection.delete_one({"id": id})
    
    if result.deleted_count == 1:
        return {"success": True, "message": "Notification deleted from database."}
    
    raise HTTPException(status_code=404, detail="Notification not found")
    
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