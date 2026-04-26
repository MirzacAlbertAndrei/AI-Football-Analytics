from fastapi import APIRouter
from services.trend_analyzer import (
    analyze_player_trends,
    get_top_risky_players,
    get_top_attacking_players,
    get_stable_players
)
from services.stats_parser import get_players_by_match, get_all_matches
from services.player_analyzer import analyze_player


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def normalize(value, min_value, max_value):
    if max_value == min_value:
        return 0
    return (value - min_value) / (max_value - min_value)

def calculate_match_performance_index(players, season_trends):
    if not players or not season_trends:
        return 50

    match_avg_losses = sum(p["raw_stats"]["losses"] for p in players) / len(players)
    match_avg_danger = sum(p["raw_stats"]["dangerous_losses"] for p in players) / len(players)

    season_losses = [p["averages"]["losses"] for p in season_trends]
    season_danger = [p["averages"]["dangerous_losses"] for p in season_trends]

    normalized_losses = normalize(
        match_avg_losses,
        min(season_losses),
        max(season_losses)
    )

    normalized_danger = normalize(
        match_avg_danger,
        min(season_danger),
        max(season_danger)
    )

    attacking_count = sum(
        1 for p in players
        if p["attacking_impact"] == "High"
    )

    stable_count = sum(
        1 for p in players
        if p["risk"] != "High"
    )

    score = 60

    # penalties
    score -= normalized_losses * 20
    score -= normalized_danger * 30

    # bonuses
    score += attacking_count * 3
    score += stable_count * 2

    return max(0, min(100, round(score)))

def calculate_performance_index(trends):
    matches = get_all_matches()

    match_scores = []

    for match in matches:
        players = match["players"]

        played_players = [
            player for player in players
            if player.get("total", {}).get("minutesOnField", 0) > 0
        ]

        analyzed = [analyze_player(player) for player in played_players]

        if analyzed:
            score = calculate_match_performance_index(analyzed, trends)
            match_scores.append(score)

    if not match_scores:
        return 50

    return int(sum(match_scores) / len(match_scores))

def build_main_problem(trends):
    if not trends:
        return "No player trend data available."

    avg_losses = sum(p["averages"]["losses"] for p in trends) / len(trends)
    avg_danger = sum(p["averages"]["dangerous_losses"] for p in trends) / len(trends)

    high_risk_count = sum(
        1 for p in trends
        if p["trend_label"] in [
            "Consistent high possession risk",
            "Dangerous transition risk",
            "Frequent ball losses"
        ]
    )

    attacking_count = sum(
        1 for p in trends
        if p["trend_label"] == "Consistent attacking impact"
    )

    stable_count = sum(
        1 for p in trends
        if p["trend_label"] == "Stable profile"
    )


    problems = []

    if avg_danger >= 0.7:
        problems.append("Dangerous own-half losses are a major team issue.")

    if high_risk_count >= 4 and avg_losses >= 8:
        problems.append("Several players repeatedly lose possession, creating unstable buildup phases.")

    if high_risk_count >= 3:
        problems.append("The team has multiple high-attention profiles who need role protection.")

    if attacking_count <= 1:
        problems.append("The team lacks enough consistent attacking contributors.")

    if stable_count <= 2:
        problems.append("The team lacks enough stable profiles to control possession.")

    if avg_losses >= 8:
        problems.append("Overall ball retention is weak across the squad.")

    if not problems:
        return "No major systemic tactical issue detected from current player trends."

    return " ".join(problems)


def build_main_recommendation(trends):
    if not trends:
        return "Collect more match data before making a tactical recommendation."

    avg_danger = sum(p["averages"]["dangerous_losses"] for p in trends) / len(trends)

    high_risk_players = [
        p for p in trends
        if p["trend_label"] in [
            "Consistent high possession risk",
            "Dangerous transition risk",
            "Frequent ball losses"
        ]
    ]

    attacking_players = [
        p for p in trends
        if p["trend_label"] == "Consistent attacking impact"
    ]

    stable_players = [
        p for p in trends
        if p["trend_label"] == "Stable profile"
    ]

    recommendations = []

    if avg_danger >= 0.7:
        recommendations.append("Avoid risky central buildup and create safer wide or backward passing options.")

    if len(high_risk_players) >= 4:
        recommendations.append("Reduce buildup responsibility for high-risk players and support them with nearby passing options.")

    if len(attacking_players) <= 1:
        recommendations.append("Increase final-third involvement for the most productive attackers and create more support around them.")

    if len(stable_players) <= 2:
        recommendations.append("Use the most stable midfielders as possession anchors to improve control.")

    if len(stable_players) >= 4:
        recommendations.append("Build possession through stable profiles and allow riskier players to act higher up the pitch.")

    if not recommendations:
        return "Maintain the current structure while monitoring high-risk players in buildup."

    return " ".join(recommendations)


@router.get("/overview")
def dashboard_overview(match_id: str | None = None):
    trends = analyze_player_trends()

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
            "performance_index": calculate_match_performance_index(analyzed, trends),
            "top_risky_players": risky,
            "top_attackers": attackers,
            "stable_players": stable
        }

    return {
        "mode": "all_matches",
        "players_analyzed": len(trends),
        "performance_index": calculate_performance_index(trends),
        "top_risky_players": get_top_risky_players(limit=5),
        "top_attackers": get_top_attacking_players(limit=5),
        "stable_players": get_stable_players(limit=5),
        "main_problem": build_main_problem(trends),
        "main_recommendation": build_main_recommendation(trends),
    }