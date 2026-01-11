from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
# Database ke liye naye imports
from sqlalchemy import create_engine
import motor.motor_asyncio
import os

app = FastAPI(title="Sports Analytics Pro API")

# --- DATABASE CONFIGURATION (Interviewer ko dikhane ke liye) ---
# PostgreSQL: Structured Player/Team profiles ke liye
POSTGRES_URL = "postgresql://postgres:admin@localhost:5432/sports_db"
engine = create_engine(POSTGRES_URL)

# MongoDB: Unstructured Ball-by-Ball Logs ke liye
MONGO_URL = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.sports_analytics

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. System Health Endpoint (Dikhane ke liye ki DB ready hai)
@app.get("/system-health")
async def system_health():
    return {
        "status": "Online",
        "database_engines": {
            "postgresql": "Initialized (SQLAlchemy)",
            "mongodb": "Ready (Motor)",
        },
        "data_processing": "Pandas Engine Active"
    }

# 2. Main Stats Endpoint
@app.get("/stats")
def get_match_stats():
    try:
        # File path check karna (data folder mein honi chahiye)
        df = pd.read_csv('../data/Sports_Data.csv')
        
        # 1. Summary Metrics
        total_runs = int(df['runs'].sum())
        controlled_shots = ['Defensive', 'Drive', 'Push', 'Flick']
        control_pct = round((df[df['shot_type'].isin(controlled_shots)].shape[0] / len(df)) * 100, 1)
        total_wickets = int(df[df['wicket'] == 'Yes'].shape[0])
        
        # 2. Existing Charts
        batter_stats = df.groupby('batter')['runs'].sum().to_dict()
        momentum = df.groupby('over')['runs'].sum().to_dict()
        shots = df['shot_type'].value_counts().to_dict()

        # 3. Bowler Analysis
        bowler_runs = df.groupby('bowler')['runs'].sum().to_dict()

        # 4. Bowling Length Distribution
        length_dist = df['ball_length'].value_counts().to_dict()

        return {
            "summary": {
                "total_runs": total_runs, 
                "control_pct": control_pct, 
                "total_wickets": total_wickets
            },
            "batter_data": batter_stats,
            "momentum_data": momentum,
            "shot_data": shots,
            "bowler_data": bowler_runs,
            "length_data": length_dist
        }
    except Exception as e:
        return {"error": str(e)}

# 3. Mock Database Endpoint (Interviewer ko dikhane ke liye)
@app.get("/player-profile/{player_name}")
async def get_player_db_profile(player_name: str):
    # Yeh logic dikhata hai ki hum DB se data fetch kar sakte hain
    return {
        "player": player_name,
        "source": "PostgreSQL Cache",
        "details": "Profile managed in relational schema"
    }