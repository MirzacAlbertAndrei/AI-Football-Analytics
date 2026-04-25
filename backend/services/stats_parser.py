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


def normalize_player_id(player):
    """
    Makes sure playerId is always an int.
    This avoids bugs like '83590' not matching 83590.
    """
    player_id = player.get("playerId")

    try:
        return int(player_id)
    except (TypeError, ValueError):
        return None


def is_u_cluj_player(player):
    """
    Returns True only if the player belongs to our predefined U Cluj squad.
    """
    player_id = normalize_player_id(player)

    if player_id is None:
        return False

    return player_id in U_CLUJ_PLAYER_IDS


def has_played_minutes(player):
    """
    Removes players with 0 minutes.
    """
    minutes = player.get("total", {}).get("minutesOnField", 0)

    try:
        minutes = float(minutes)
    except (TypeError, ValueError):
        return False

    return minutes > 0


def prepare_player(player, match):
    """
    Adds useful frontend/backend metadata to each player.
    """
    player_copy = player.copy()

    player_copy["playerId"] = normalize_player_id(player)
    player_copy["source_file"] = match["file_name"]
    player_copy["match_id"] = match["match_id"]

    return player_copy


def load_all_matches():
    """
    Loads all JSON match files from data/matches.
    This function does NOT filter players yet.
    Filtering is done in get_all_players() and get_players_by_match().
    """
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
    """
    Returns only U Cluj players from all matches.
    This is used for full-season overview/trends.
    """
    all_players = []

    for match in load_all_matches():
        for player in match["players"]:

            if not has_played_minutes(player):
                continue

            if not is_u_cluj_player(player):
                continue

            player_copy = prepare_player(player, match)
            all_players.append(player_copy)

    return all_players


def get_players_by_match(match_id):
    """
    Returns only U Cluj players from one selected match.
    This is used for single-match analysis.
    """
    for match in load_all_matches():
        if str(match["match_id"]) == str(match_id):

            match_players = []

            for player in match["players"]:

                if not has_played_minutes(player):
                    continue

                if not is_u_cluj_player(player):
                    continue

                player_copy = prepare_player(player, match)
                match_players.append(player_copy)

            return match_players

    return []


def get_available_matches():
    """
    Returns match list for frontend dropdown.
    Does not return all player data, only basic match info.
    """
    available_matches = []

    for match in load_all_matches():
        available_matches.append({
            "file_name": match["file_name"],
            "match_id": match["match_id"],
            "players_count": len([
                player for player in match["players"]
                if has_played_minutes(player) and is_u_cluj_player(player)
            ])
        })

    return available_matches


def debug_unexpected_players():
    """
    Optional debug helper.
    Shows players that are inside match files but NOT in U_CLUJ_PLAYER_IDS.
    """
    unexpected_players = set()

    for match in load_all_matches():
        for player in match["players"]:
            player_id = normalize_player_id(player)

            if player_id is None:
                continue

            if player_id not in U_CLUJ_PLAYER_IDS:
                unexpected_players.add(player_id)

    return sorted(unexpected_players)