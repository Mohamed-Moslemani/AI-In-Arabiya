from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["ai_app_db"]

users_collection = db["users"]
exams_collection = db["exams"]
