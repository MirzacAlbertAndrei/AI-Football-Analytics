from fastapi import APIRouter
from services.stats_parser import (
    load_all_matches,
    get_all_players,
    get_players_by_match
)
from services.player_analyzer import analyze_player

router = APIRouter(prefix="/players", tags=["Players"])


@router.get("/")
def get_players():
    players = get_all_players()

    return {
        "total_player_entries": len(players),
        "players": players
    }


@router.get("/matches")
def get_matches():
    matches = load_all_matches()

    return {
        "total_matches": len(matches),
        "matches": [
            {
                "file_name": match["file_name"],
                "match_id": match["match_id"],
                "players_count": len(match["players"]),
                "error": match.get("error")
            }
            for match in matches
        ]
    }


@router.get("/match/{match_id}")
def get_match_players(match_id: str):
    players = get_players_by_match(match_id)

    return {
        "match_id": match_id,
        "players_count": len(players),
        "players": players
    }


@router.get("/analysis")
def get_player_analysis():
    players = get_all_players()
    analyzed_players = [analyze_player(player) for player in players]

    return {
        "total_analyzed_players": len(analyzed_players),
        "analysis": analyzed_players
    }


@router.get("/analysis/match/{match_id}")
def get_player_analysis_by_match(match_id: str):
    players = get_players_by_match(match_id)
    analyzed_players = [analyze_player(player) for player in players]

    return {
        "match_id": match_id,
        "total_analyzed_players": len(analyzed_players),
        "analysis": analyzed_players
    }