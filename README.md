# AI Football Analytics Platform

An AI-powered football analytics platform that transforms player performance data into actionable tactical insights.

The application processes match statistics, evaluates player profiles across multiple performance dimensions, and combines rule-based analytics with generative AI to produce concise tactical recommendations for coaches.

## Features

- Analyze individual player performance from match data
- Evaluate possession risk, attacking impact, creativity, and defensive stability
- Identify tactical trends across multiple players
- Generate AI-assisted coaching reports and recommendations
- Explore player statistics through an interactive dashboard
- Ask tactical questions using an AI coaching assistant

## Tech Stack

### Frontend
- React
- Vite
- JavaScript

### Backend
- Python
- FastAPI

### AI & Data Analysis
- Google Gemini API
- Custom player analysis logic
- Football performance data processing

## Architecture

The application is split into a React frontend and a FastAPI backend.

The backend processes player statistics through dedicated analysis services that identify tactical patterns such as:

- dangerous possession losses
- attacking contribution
- progressive passing
- defensive actions
- player stability

The processed data is then used by the AI coaching service to generate tactical summaries and actionable recommendations.

## Project Structure

```text
GDG_HACKATHON/
├── backend/
│   ├── data/
│   ├── routes/
│   │   ├── coach.py
│   │   ├── dashboard.py
│   │   └── players.py
│   ├── services/
│   │   ├── ai_coach.py
│   │   ├── player_analyzer.py
│   │   ├── stats_parser.py
│   │   └── trend_analyzer.py
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── api.js
    └── package.json
```

## Running the Project

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file based on `backend/.env.example` and add your Gemini API key.

Run the backend:

```bash
uvicorn main:app --reload
```

The API runs at:

```text
http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## AI Coach

The AI coaching component uses structured player analytics as context for Gemini.

Instead of generating recommendations directly from raw statistics, the system first evaluates players across several tactical dimensions and then provides the resulting structured data to the AI model.

This allows the generated reports to focus on actionable concepts such as possession risk, attacking contribution, defensive stability, and player roles.
