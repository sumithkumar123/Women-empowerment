from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId, json_util
import simplejson as json
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri)
db = client.get_database('feminine_shakthi' if 'feminine_shakthi' not in mongo_uri else None)
if 'result' in mongo_uri: # Handle cases where db name might be implicit or in uri
     pass 

# If URI doesn't have a DB name, default to 'feminine_shakthi'
try:
    if client.get_database().name:
         db = client.get_database()
except:
     db = client.feminine_shakthi

users_collection = db.users
tasks_collection = db.tasks
messages_collection = db.messages

# --- Helper ---
def parse_json(data):
    return json.loads(json_util.dumps(data))

# --- Mock Aadhaar Service ---
def verify_aadhaar_mock(aadhaar_num):
    if len(aadhaar_num) != 12:
        return {"valid": False, "message": "Invalid Aadhaar Number"}
    
    if aadhaar_num.startswith('1'):
        return {
            "valid": True, 
            "gender": "Female", 
            "verified": True,
            "name": "Verified Woman User",
            "address": "123, Shakti Nagar, Hyderabad"
        }
    elif aadhaar_num.startswith('2'):
         return {
            "valid": True, 
            "gender": "Male", 
            "verified": False,
            "message": "Registration Restricted to Women Only"
        }
    else:
        return {"valid": False, "message": "Aadhaar Verification Failed"}

# --- Routes ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Feminine Shakthi Backend Running"}), 200

# Auth
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    phone = data.get('phone')
    aadhaar = data.get('aadhaar')
    skills = data.get('skills', []) 
    
    if users_collection.find_one({"phone": phone}):
        return jsonify({"success": False, "message": "User already exists"}), 400

    verification = verify_aadhaar_mock(aadhaar)
    if not verification['valid']:
        return jsonify({"success": False, "message": verification['message']}), 400
    
    # Allow simulated Male for demonstration if requested? No, strict rule.
    # But checking if starts with '2' is the mock failure condition
    
    if verification.get('gender') != 'Female':
        return jsonify({"success": False, "message": "Access restricted to Women only."}), 403

    user = {
        "phone": phone,
        "name": data.get('name') or verification['name'], # Prefer user input, fallback to verification
        "aadhaar": aadhaar,
        "gender": "Female",
        "address": data.get('address') or verification['address'], # Prefer user input
        "skills": skills,
        "password": data.get('password'), 
        "balance": 0.0,
        "role": data.get('role', 'worker'), 
        "profile_pic": f"https://api.dicebear.com/7.x/initials/svg?seed={data.get('phone')}",
        "created_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user)
    return jsonify({"success": True, "message": "Registration Successful", "user": parse_json(user)}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    phone = data.get('phone')
    password = data.get('password')
    
    user = users_collection.find_one({"phone": phone, "password": password})
    if user:
        return jsonify({"success": True, "message": "Login Successful", "user": parse_json(user)}), 200
    
    return jsonify({"success": False, "message": "Invalid Credentials"}), 401

# Tasks
@app.route('/api/tasks/create', methods=['POST'])
def create_task():
    data = request.json
    # Expected: posted_by (user_id), description, category, budget, lat, lng, delivery_mode
    
    task = {
        "posted_by": data.get('posted_by'), # Phone or ID
        "posted_by_name": data.get('posted_by_name'),
        "description": data.get('description'),
        "category": data.get('category', 'General'),
        "budget": data.get('budget'),
        "location": {
            "lat": data.get('lat'),
            "lng": data.get('lng'),
            "address": data.get('address')
        },
        "delivery_mode": data.get('delivery_mode'), # Pickup, Online, Home
        "status": "OPEN", # OPEN, ASSIGNED, COMPLETED
        "assigned_to": None,
        "created_at": datetime.utcnow()
    }
    
    result = tasks_collection.insert_one(task)
    return jsonify({"success": True, "message": "Task Posted", "task_id": str(result.inserted_id)}), 201

@app.route('/api/tasks/list', methods=['GET'])
def list_tasks():
    # Filters
    category = request.args.get('category')
    
    query = {"status": "OPEN"}
    if category:
        query["category"] = category
        
    tasks = list(tasks_collection.find(query).sort("created_at", -1))
    return jsonify(parse_json(tasks)), 200

@app.route('/api/tasks/my', methods=['GET'])
def my_tasks():
    user_phone = request.args.get('phone')
    role = request.args.get('role')
    
    if role == 'customer':
        query = {"posted_by": user_phone}
    else:
        query = {"assigned_to": user_phone}
        
    tasks = list(tasks_collection.find(query).sort("created_at", -1))
    return jsonify(parse_json(tasks)), 200

@app.route('/api/tasks/accept', methods=['POST'])
def accept_task():
    data = request.json
    task_id = data.get('task_id')
    worker_phone = data.get('worker_phone')
    worker_name = data.get('worker_name')
    
    # Check if task is open
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task or task['status'] != 'OPEN':
        return jsonify({"success": False, "message": "Task not available"}), 400
        
    tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "ASSIGNED", "assigned_to": worker_phone, "assigned_to_name": worker_name}}
    )
    
    return jsonify({"success": True, "message": "Task Accepted!"}), 200

# Chat
@app.route('/api/chat/send', methods=['POST'])
def send_message():
    data = request.json
    msg = {
        "task_id": data.get('task_id'),
        "sender": data.get('sender'), # phone
        "text": data.get('text'),
        "timestamp": datetime.utcnow()
    }
    messages_collection.insert_one(msg)
    return jsonify({"success": True}), 201

@app.route('/api/chat/<task_id>', methods=['GET'])
def get_messages(task_id):
    msgs = list(messages_collection.find({"task_id": task_id}).sort("timestamp", 1))
    return jsonify(parse_json(msgs)), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
