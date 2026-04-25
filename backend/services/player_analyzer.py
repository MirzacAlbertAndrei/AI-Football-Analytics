def analyze_player(player):
    total = player.get("total", {})
    percent = player.get("percent", {})

    losses = total.get("losses", 0)
    own_half_losses = total.get("ownHalfLosses", 0)
    dangerous_losses = total.get("dangerousOwnHalfLosses", 0)

    goals = total.get("goals", 0)
    assists = total.get("assists", 0)
    shots = total.get("shots", 0)
    xg = total.get("xgShot", 0)
    xa = total.get("xgAssist", 0)

    key_passes = total.get("keyPasses", 0)
    progressive_passes = total.get("progressivePasses", 0)
    passes_to_final_third = total.get("passesToFinalThird", 0)

    recoveries = total.get("recoveries", 0)
    interceptions = total.get("interceptions", 0)
    successful_defensive_actions = total.get("successfulDefensiveAction", 0)

    pass_accuracy = percent.get("successfulPasses", 0)
    duels_won = percent.get("duelsWon", 0)

    if dangerous_losses > 0 or own_half_losses >= 3 or losses > 10:
        risk = "High"
    elif own_half_losses > 0 or losses >= 6:
        risk = "Medium"
    else:
        risk = "Low"

    if goals > 0 or xg >= 0.30 or key_passes >= 2:
        attacking_impact = "High"
    elif assists > 0 or xa >= 0.10 or shots > 0 or key_passes == 1:
        attacking_impact = "Medium"
    else:
        attacking_impact = "Low"

    if progressive_passes >= 8 or passes_to_final_third >= 5 or key_passes >= 2:
        creativity = "High"
    elif progressive_passes >= 3 or passes_to_final_third >= 2 or key_passes == 1:
        creativity = "Medium"
    else:
        creativity = "Low"

    if successful_defensive_actions >= 8 or interceptions >= 4 or recoveries >= 8:
        defensive_stability = "High"
    elif successful_defensive_actions >= 4 or interceptions >= 2 or recoveries >= 4:
        defensive_stability = "Medium"
    else:
        defensive_stability = "Low"

    recommendation = build_recommendation(
        risk,
        attacking_impact,
        creativity,
        defensive_stability
    )

    return {
        "playerId": player.get("playerId"),
        "matchId": player.get("matchId"),
        "source_file": player.get("source_file"),
        "position": get_main_position(player),

        "risk": risk,
        "attacking_impact": attacking_impact,
        "creativity": creativity,
        "defensive_stability": defensive_stability,
        "recommendation": recommendation,

        "raw_stats": {
            "minutes": total.get("minutesOnField", 0),
            "goals": goals,
            "assists": assists,
            "shots": shots,
            "xg": xg,
            "xa": xa,
            "losses": losses,
            "own_half_losses": own_half_losses,
            "dangerous_losses": dangerous_losses,
            "pass_accuracy": pass_accuracy,
            "duels_won": duels_won,
            "key_passes": key_passes,
            "progressive_passes": progressive_passes,
            "passes_to_final_third": passes_to_final_third,
            "recoveries": recoveries,
            "interceptions": interceptions,
            "successful_defensive_actions": successful_defensive_actions
        }
    }


def get_main_position(player):
    positions = player.get("positions", [])

    if not positions:
        return "Unknown"

    position = positions[0].get("position", {})
    return position.get("name", "Unknown")


def build_recommendation(risk, attacking_impact, creativity, defensive_stability):
    if attacking_impact == "High" and risk == "High":
        return "High-impact but risky player. Use higher up the pitch and avoid deep buildup responsibility."

    if attacking_impact == "High":
        return "Strong attacking contributor. Keep involved in final-third actions."

    if risk == "High":
        return "Possession risk detected. Avoid using this player under heavy pressure in buildup."

    if creativity == "High":
        return "Creative progression player. Use as a connector between midfield and attack."

    if defensive_stability == "High":
        return "Defensively reliable player. Useful for protecting structure and winning the ball back."

    return "Balanced profile. No major tactical warning detected."