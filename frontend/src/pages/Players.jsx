import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

function getRiskClass(risk) {
  if (risk === "High") return "bg-red-100 text-red-700";
  if (risk === "Medium") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

function PlayerCard({ player, mode }) {
  const isMatchMode = mode === "match";

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            Player #{player.playerId}
          </h3>
          <p className="text-sm text-gray-500">
            {player.position || "Unknown position"}
          </p>
        </div>

        {isMatchMode ? (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskClass(
              player.risk
            )}`}
          >
            {player.risk} risk
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {player.matches_played} matches
          </span>
        )}
      </div>

      {isMatchMode ? (
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <p>Minutes: {player.raw_stats?.minutes ?? 0}</p>
          <p>Losses: {player.raw_stats?.losses ?? 0}</p>
          <p>Own-half losses: {player.raw_stats?.own_half_losses ?? 0}</p>
          <p>Dangerous losses: {player.raw_stats?.dangerous_losses ?? 0}</p>
          <p>xG: {player.raw_stats?.xg ?? 0}</p>
          <p>Key passes: {player.raw_stats?.key_passes ?? 0}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <p>Avg losses: {player.averages?.losses ?? 0}</p>
          <p>Avg dangerous: {player.averages?.dangerous_losses ?? 0}</p>
          <p>Total goals: {player.totals?.goals ?? 0}</p>
          <p>Total xG: {player.totals?.xg ?? 0}</p>
          <p>High-risk matches: {player.high_risk_matches ?? 0}</p>
          <p>High-impact matches: {player.high_impact_matches ?? 0}</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-800">
          {isMatchMode ? player.recommendation : player.trend_label}
        </p>

        {!isMatchMode && (
          <p className="text-sm text-gray-500 mt-1">
            {player.recommendation}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Players() {
  const [mode, setMode] = useState("season");
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSeasonTrends() {
    try {
      setLoading(true);
      setError("");

      const data = await apiGet("/players/trends");
      setPlayers(data.trends || []);
    } catch (err) {
      console.error(err);
      setError("Could not load player trends.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMatchAnalysis(matchId) {
    if (!matchId) return;

    try {
      setLoading(true);
      setError("");

      const data = await apiGet(`/players/analysis/match/${matchId}`);
      setPlayers(data.analysis || []);
    } catch (err) {
      console.error(err);
      setError("Could not load match player analysis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        const matchesData = await apiGet("/players/matches");
        const loadedMatches = matchesData.matches || [];

        setMatches(loadedMatches);

        if (loadedMatches.length > 0) {
          setSelectedMatchId(loadedMatches[0].match_id);
        }
      } catch (err) {
        console.error("Could not load matches", err);
      }

      await loadSeasonTrends();
    }

    loadInitialData();
  }, []);

  function handleModeChange(newMode) {
    setMode(newMode);

    if (newMode === "season") {
      loadSeasonTrends();
    } else {
      loadMatchAnalysis(selectedMatchId);
    }
  }

  function handleMatchChange(e) {
    const matchId = e.target.value;
    setSelectedMatchId(matchId);

    if (mode === "match") {
      loadMatchAnalysis(matchId);
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Players</h1>
        <p className="text-gray-500 mt-1">
          Analyze players across the full season or inside one selected match.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange("season")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              mode === "season"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            All matches
          </button>

          <button
            onClick={() => handleModeChange("match")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              mode === "match"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            One match
          </button>
        </div>

        <select
          value={selectedMatchId}
          onChange={handleMatchChange}
          disabled={mode !== "match"}
          className="bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm disabled:opacity-50"
        >
          {matches.map((match) => (
            <option key={match.match_id} value={match.match_id}>
              {match.file_name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-600">Loading players...</p>}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500">
            Showing {players.length} players.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {players.map((player) => (
              <PlayerCard
                key={`${player.playerId}-${player.matchId || "season"}`}
                player={player}
                mode={mode}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}