from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import motor.motor_asyncio
import os

app = FastAPI(title="Sports Analytics Pro API")

# --- DATABASE CONFIGURATION ---
POSTGRES_URL = "postgresql://postgres:admin@localhost:5432/sports_db"
engine = create_engine(POSTGRES_URL)
MONGO_URL = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stats")
def get_match_stats():
    try:
        df = pd.read_csv('Backend/Sports_Data.csv')
        
        # 1. Basic Summary
        total_runs = int(df['runs'].sum())
        total_wickets = int(df[df['wicket'] == 'Yes'].shape[0])
        controlled_shots = ['Defensive', 'Drive', 'Push', 'Flick']
        control_pct = round((df[df['shot_type'].isin(controlled_shots)].shape[0] / len(df)) * 100, 1)

        # --- 2. Batting Leaderboard Logic ---
        batter_grouped = df.groupby('batter')
        b_runs = batter_grouped['runs'].sum()
        b_balls = batter_grouped.size()
        b_sr = round((b_runs / b_balls) * 100, 2)
        
        # List of dicts banana frontend tables ke liye easy hota hai
        batting_leaderboard = []
        for name in b_runs.index:
            batting_leaderboard.append({
                "name": name,
                "runs": int(b_runs[name]),
                "sr": b_sr[name]
            })

        # --- 3. Bowling Leaderboard Logic ---
        # Sirf wahi rows consider hongi jahan 'bowler' column mein naam ho
        bowler_grouped = df.groupby('bowler')
        bowler_runs = bowler_grouped['runs'].sum()
        bowler_balls = bowler_grouped.size()
        # Economy = Total Runs / (Total Balls / 6)
        bowler_econ = round(bowler_runs / (bowler_balls / 6), 2)
        
        bowling_leaderboard = []
        for name in bowler_runs.index:
            bowling_leaderboard.append({
                "name": name,
                "overs": round(bowler_balls[name] / 6, 1), # Kitne over phenke
                "economy": bowler_econ[name]
            })

        # 4. Charts Data
        momentum = df.groupby('over')['runs'].sum().to_dict()
        shots = df['shot_type'].value_counts().to_dict()
        length_dist = df['ball_length'].value_counts().to_dict()

        return {
            "summary": {
                "total_runs": total_runs, 
                "control_pct": control_pct, 
                "total_wickets": total_wickets
            },
            "batting_leaderboard": batting_leaderboard, # Alag table 1
            "bowling_leaderboard": bowling_leaderboard, # Alag table 2
            "momentum_data": momentum,
            "shot_data": shots,
            "length_data": length_dist
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/system-health")
async def system_health():
    return {"status": "Online", "database": "Active"}
