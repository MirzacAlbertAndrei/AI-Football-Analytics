from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from services.ai_coach import generate_coach_report, answer_coach_question

router = APIRouter(prefix="/coach", tags=["AI Coach"])


class CoachQuestion(BaseModel):
    question: str


@router.get("/report")
def coach_report():
    return generate_coach_report()


@router.get("/report/html", response_class=HTMLResponse)
def coach_report_html():
    result = generate_coach_report()
    formatted = result["coach_report"].replace("\n", "<br>")

    return f"""
    <html>
        <body style="font-family: Arial; padding: 32px; max-width: 900px; margin: auto;">
            <h1>U Cluj AI Coach Report</h1>
            <div style="line-height: 1.6;">{formatted}</div>
        </body>
    </html>
    """


@router.post("/chat")
def coach_chat(request: CoachQuestion):
    return answer_coach_question(request.question)