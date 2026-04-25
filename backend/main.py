from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import players

app = FastAPI(title="U Cluj Smart Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router)


@app.get("/")
def root():
    return {"message": "U Cluj Smart Coach API is running"}