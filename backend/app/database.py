from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["ai_in_arabiya"]
users_collection = db["users"]
