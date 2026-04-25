from fastapi import APIRouter
from services.trend_analyzer import (
    analyze_player_trends,
    get_top_risky_players,
    get_top_attacking_players,
    get_stable_players
)
from services.stats_parser import get_players_by_match
from services.player_analyzer import analyze_player

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def dashboard_overview(match_id: str | None = None):
    if match_id:
        players = get_players_by_match(match_id)

        played_players = [
            player for player in players
            if player.get("total", {}).get("minutesOnField", 0) > 0
        ]

        analyzed = [analyze_player(player) for player in played_players]

        risky = sorted(
            analyzed,
            key=lambda p: (
                p["risk"] == "High",
                p["raw_stats"]["dangerous_losses"],
                p["raw_stats"]["losses"]
            ),
            reverse=True
        )[:5]

        attackers = sorted(
            analyzed,
            key=lambda p: (
                p["raw_stats"]["goals"],
                p["raw_stats"]["xg"],
                p["attacking_impact"] == "High"
            ),
            reverse=True
        )[:5]

        stable = [
            p for p in analyzed
            if p["risk"] == "Low" or p["defensive_stability"] == "High"
        ][:5]

        return {
            "mode": "single_match",
            "match_id": match_id,
            "players_analyzed": len(analyzed),
            "top_risky_players": risky,
            "top_attackers": attackers,
            "stable_players": stable
        }

    trends = analyze_player_trends()

    return {
        "mode": "all_matches",
        "players_analyzed": len(trends),
        "top_risky_players": get_top_risky_players(limit=5),
        "top_attackers": get_top_attacking_players(limit=5),
        "stable_players": get_stable_players(limit=5),
        "main_problem": "Repeated possession losses in own half and dangerous zones",
        "main_recommendation": "Use stable midfielders in buildup and keep risky attacking players higher up the pitch."
    }