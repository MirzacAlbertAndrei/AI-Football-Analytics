import json
from pathlib import Path

U_CLUJ_PLAYER_IDS = {
    1157870, 1047336, 1024565, 779379, 778883, 759616, 748513,
    630268, 619309, 577452, 560364, 556020, 83590, 83838, 85113,
    169037, 220694, 227952, 239290, 240507, 270356, 338220,
    346908, 441683, 445824, 462140, 506853, 526387, 532568, 541971
}

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "matches"


def load_all_matches():
    matches = []

    if not DATA_DIR.exists():
        return matches

    for file_path in DATA_DIR.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            players = data.get("players", [])

            match_id = file_path.stem
            if players and players[0].get("matchId"):
                match_id = players[0]["matchId"]

            matches.append({
                "file_name": file_path.name,
                "match_id": match_id,
                "players": players
            })

        except Exception as error:
            matches.append({
                "file_name": file_path.name,
                "match_id": file_path.stem,
                "players": [],
                "error": str(error)
            })

    return matches


def get_all_players():
    all_players = []

    for match in load_all_matches():
        for player in match["players"]:
            minutes = player.get("total", {}).get("minutesOnField", 0)

            if minutes <= 0:
                continue

            player_copy = player.copy()
            player_copy["source_file"] = match["file_name"]
            player_copy["match_id"] = match["match_id"]

            # ✅ FILTER HERE
            if player_copy.get("playerId") in U_CLUJ_PLAYER_IDS:
                all_players.append(player_copy)

    return all_players


def get_players_by_match(match_id):
    for match in load_all_matches():
        if str(match["match_id"]) == str(match_id):
            return match["players"]

    return []