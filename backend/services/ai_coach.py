import os
import json
from dotenv import load_dotenv
from google import genai

from services.trend_analyzer import (
    get_top_risky_players,
    get_top_attacking_players,
    get_stable_players,
)

load_dotenv()

# Client automatically reads GEMINI_API_KEY
client = genai.Client()


def generate_coach_report():
    risky_players = get_top_risky_players(limit=5)
    attacking_players = get_top_attacking_players(limit=5)
    stable_players = get_stable_players(limit=5)

    data = {
        "risky_players": risky_players,
        "attacking_players": attacking_players,
        "stable_players": stable_players,
    }

    prompt = f"""
You are an elite football tactical analyst working with U Cluj's coaching staff.

You must base your answer ONLY on the provided data.
Do not invent player names. If names are missing, use playerId.

Important tactical principles:
- Not all losses are equal.
- Own-half losses create transition danger.
- Dangerous own-half losses are the most important risk indicator.
- A player can be both valuable and risky.
- High attacking output should not automatically mean the player should be removed.
- Risky attacking players should usually receive the ball higher up the pitch.
- Risky defenders or midfielders may need safer passing options or role adjustment.
- Stable players can be used to support buildup phases.

Data:
{json.dumps(data, indent=2)}

Create a professional coach report with this exact structure:

Executive Summary
2–3 sentences on the team’s main tactical pattern.

Key Tactical Risks
List risky players and explain why using their stats.

Attacking Assets
Identify key attackers and how to use them.

Stable Profiles
Mention players who stabilize possession.

Training Priorities
List exactly 3 actionable focuses.

Final Match Plan
Give a clear tactical plan for the next match.

Keep it clear, direct, and useful for a coach. Keep it concise(maximum 1-2 sentences) and only in English.
"""
    
    

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    return {
        "coach_report": response.text
    }

def answer_coach_question(question):
    risky_players = get_top_risky_players(limit=5)
    attacking_players = get_top_attacking_players(limit=5)
    stable_players = get_stable_players(limit=5)

    data = {
        "risky_players": risky_players,
        "attacking_players": attacking_players,
        "stable_players": stable_players,
    }

    prompt = f"""
You are an elite football tactical analyst for U Cluj.

Use ONLY this data:
{json.dumps(data, indent=2)}

Coach question:
{question}

Answer clearly and tactically.
Use playerId if names are missing.
Do not include special symbols or formatting just plain language.
Answer in English and in maximum 2-3 paragraphs made of 1-2(maximum 3) sentences each.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "question": question,
        "answer": response.text
    }