import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function PlayerList({ title, players, type }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {!players || players.length === 0 ? (
        <p className="text-sm text-gray-500">No players found.</p>
      ) : (
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.playerId}
              className="border-b pb-3 last:border-b-0"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Player #{player.playerId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {player.position || "Unknown position"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    type === "risk"
                      ? "bg-red-100 text-red-700"
                      : type === "attack"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {type === "risk"
                    ? "Risk"
                    : type === "attack"
                    ? "Attack"
                    : "Stable"}
                </span>
              </div>

              {player.trend_label && (
                <p className="text-sm text-gray-700 mt-2">
                  {player.trend_label}
                </p>
              )}

              {player.recommendation && (
                <p className="text-xs text-gray-500 mt-1">
                  {player.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Overview() {
  const [overview, setOverview] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOverview(matchId = "all") {
    try {
      setLoading(true);
      setError("");

      const path =
        matchId === "all"
          ? "/dashboard/overview"
          : `/dashboard/overview?match_id=${matchId}`;

      const data = await apiGet(path);
      setOverview(data);
    } catch (err) {
      console.error(err);
      setError("Could not load overview from backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        const matchesData = await apiGet("/players/matches");
        setMatches(matchesData.matches || []);
      } catch (err) {
        console.error("Could not load matches", err);
      }

      await loadOverview("all");
    }

    loadInitialData();
  }, []);

  function handleMatchChange(e) {
    const value = e.target.value;
    setSelectedMatchId(value);
    loadOverview(value);
  }

  if (loading && !overview) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading tactical overview...</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tactical Overview
          </h1>
          <p className="text-gray-500 mt-1">
            AI overview based on U Cluj match data.
          </p>
        </div>

        <select
          value={selectedMatchId}
          onChange={handleMatchChange}
          className="bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm"
        >
          <option value="all">All matches overview</option>
          {matches.map((match) => (
            <option key={match.match_id} value={match.match_id}>
              {match.file_name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Analysis mode"
          value={overview.mode === "single_match" ? "Match" : "Season"}
          subtitle="Current scope"
        />

        <StatCard
          title="Players analyzed"
          value={overview.players_analyzed || 0}
          subtitle="Available player profiles"
        />

        <StatCard
          title="Risky players"
          value={overview.top_risky_players?.length || 0}
          subtitle="Possession risk"
        />

        <StatCard
          title="Top attackers"
          value={overview.top_attackers?.length || 0}
          subtitle="Offensive impact"
        />
      </div>

      {overview.mode === "all_matches" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Main Tactical Problem
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {overview.main_problem || "No main problem available."}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Coach Recommendation
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {overview.main_recommendation ||
                "No recommendation available."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlayerList
          title="Top Risky Players"
          players={overview.top_risky_players || []}
          type="risk"
        />

        <PlayerList
          title="Top Attackers"
          players={overview.top_attackers || []}
          type="attack"
        />

        <PlayerList
          title="Stable Players"
          players={overview.stable_players || []}
          type="stable"
        />
      </div>
    </div>
  );
}