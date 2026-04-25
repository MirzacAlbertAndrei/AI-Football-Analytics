from collections import defaultdict, Counter
from services.stats_parser import get_all_players
from services.player_analyzer import analyze_player


def analyze_player_trends(min_matches=2):
    players = get_all_players()
    grouped_players = defaultdict(list)

    for player in players:
        player_id = player.get("playerId")

        if not player_id:
            continue

        grouped_players[player_id].append(player)

    trends = []

    for player_id, entries in grouped_players.items():
        if len(entries) < min_matches:
            continue

        analyzed_entries = [analyze_player(player) for player in entries]
        matches_played = len(analyzed_entries)

        total_losses = sum(item["raw_stats"]["losses"] for item in analyzed_entries)
        total_own_half_losses = sum(item["raw_stats"]["own_half_losses"] for item in analyzed_entries)
        total_dangerous_losses = sum(item["raw_stats"]["dangerous_losses"] for item in analyzed_entries)
        total_goals = sum(item["raw_stats"]["goals"] for item in analyzed_entries)
        total_xg = sum(item["raw_stats"]["xg"] for item in analyzed_entries)

        high_risk_matches = sum(1 for item in analyzed_entries if item["risk"] == "High")
        high_impact_matches = sum(1 for item in analyzed_entries if item["attacking_impact"] == "High")

        avg_losses = round(total_losses / matches_played, 2)
        avg_own_half_losses = round(total_own_half_losses / matches_played, 2)
        avg_dangerous_losses = round(total_dangerous_losses / matches_played, 2)
        avg_xg = round(total_xg / matches_played, 2)

        trend_label = build_trend_label(
            avg_losses,
            avg_dangerous_losses,
            high_risk_matches,
            matches_played,
            high_impact_matches
        )

        trends.append({
            "playerId": player_id,
            "position": get_best_position(analyzed_entries),
            "matches_played": matches_played,
            "averages": {
                "losses": avg_losses,
                "own_half_losses": avg_own_half_losses,
                "dangerous_losses": avg_dangerous_losses,
                "xg": avg_xg
            },
            "totals": {
                "goals": total_goals,
                "xg": round(total_xg, 2),
                "losses": total_losses,
                "own_half_losses": total_own_half_losses,
                "dangerous_losses": total_dangerous_losses
            },
            "high_risk_matches": high_risk_matches,
            "high_impact_matches": high_impact_matches,
            "trend_label": trend_label,
            "recommendation": build_trend_recommendation(trend_label)
        })

    return sorted(
        trends,
        key=lambda player: (
            player["high_risk_matches"],
            player["averages"]["losses"]
        ),
        reverse=True
    )


def get_top_risky_players(limit=10):
    return analyze_player_trends()[:limit]


def get_top_attacking_players(limit=10):
    trends = analyze_player_trends()

    return sorted(
        trends,
        key=lambda player: (
            player["totals"]["goals"],
            player["totals"]["xg"],
            player["high_impact_matches"]
        ),
        reverse=True
    )[:limit]


def get_stable_players(limit=10):
    trends = analyze_player_trends()

    stable_players = [
        player for player in trends
        if player["trend_label"] == "Stable profile"
    ]

    return stable_players[:limit]


def get_best_position(analyzed_entries):
    positions = [
        item["position"]
        for item in analyzed_entries
        if item["position"] != "Unknown"
    ]

    if not positions:
        return "Unknown"

    return Counter(positions).most_common(1)[0][0]


def build_trend_label(
    avg_losses,
    avg_dangerous_losses,
    high_risk_matches,
    matches_played,
    high_impact_matches
):
    risk_ratio = high_risk_matches / matches_played
    impact_ratio = high_impact_matches / matches_played

    if risk_ratio >= 0.65 and avg_dangerous_losses >= 0.5:
        return "Consistent high possession risk"

    if avg_dangerous_losses >= 0.7:
        return "Dangerous transition risk"

    if impact_ratio >= 0.5:
        return "Consistent attacking impact"

    if avg_losses >= 9:
        return "Frequent ball losses"

    return "Stable profile"


def build_trend_recommendation(trend_label):
    if trend_label == "Consistent high possession risk":
        return "Repeated high-risk possession losses. Reduce buildup responsibility and provide safer passing options."

    if trend_label == "Dangerous transition risk":
        return "Dangerous own-half losses are above acceptable levels. Avoid risky central buildup through this player."

    if trend_label == "Consistent attacking impact":
        return "Player shows repeated attacking value. Keep him involved in final-third actions."

    if trend_label == "Frequent ball losses":
        return "Player loses possession often, but not always in dangerous zones. Use with closer support."

    return "Player profile appears stable across matches."