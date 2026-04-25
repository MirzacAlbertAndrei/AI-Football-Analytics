import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
      {/* Red accent line on top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black group-hover:bg-red-600 transition-colors duration-300"></div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <h2 className="text-4xl font-black text-black mt-2 tracking-tight group-hover:scale-[1.02] origin-left transition-transform duration-300">{value}</h2>
      {subtitle && <p className="text-sm font-medium text-red-600 mt-1">{subtitle}</p>}
    </div>
  );
}

function PlayerList({ title, players, type }) {
  // Determine accent color based on list type
  const accentColor = type === "risk" ? "bg-red-600" : type === "attack" ? "bg-black" : "bg-gray-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-2 h-6 ${accentColor} rounded-sm`}></div>
        <h3 className="text-lg font-bold text-black uppercase tracking-wider">{title}</h3>
      </div>

      {!players || players.length === 0 ? (
        <p className="text-sm text-gray-500 italic px-2">No players found.</p>
      ) : (
        <div className="space-y-4 flex-grow">
          {players.map((player) => (
            <div
              key={player.playerId}
              className="bg-gray-50 p-4 rounded-lg border border-gray-100 group hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-black text-lg">
                      {player.playerName || `Player #${player.playerId}`}
                    </p>
                    {/* Animated hover icon */}
                    <svg 
                      className="w-4 h-4 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      strokeWidth="3" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                    {player.position || "Unknown position"}
                  </p>
                </div>
              </div>

              {player.trend_label && (
                <p className="text-[11px] font-bold text-gray-800 mt-3 bg-white border border-gray-200 inline-block px-2 py-1 rounded shadow-sm group-hover:border-gray-300 transition-colors uppercase tracking-wider">
                  {player.trend_label}
                </p>
              )}

              {player.recommendation && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed border-t border-gray-200/50 pt-2 group-hover:border-gray-200 transition-colors">
                  <span className="font-semibold text-black">Action: </span>
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
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">Loading tactical overview...</p>
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="p-8 bg-zinc-50 min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-5 rounded-r-xl shadow-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Overview</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 tracking-wide text-sm uppercase">
            AI ANALYSIS INTERFACE • U CLUJ MATCH DATA
          </p>
        </div>

        <select
          value={selectedMatchId}
          onChange={handleMatchChange}
          className="bg-white border-2 border-gray-200 rounded-lg px-4 py-3 shadow-sm font-semibold text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors appearance-none min-w-[220px] cursor-pointer"
        >
          <option value="all">All Matches Overview</option>
          {matches.map((match) => (
            <option key={match.match_id} value={match.match_id}>
              {match.file_name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-r-xl font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Analysis Mode"
          value={overview.mode === "single_match" ? "Match" : "Season"}
          subtitle="Current scope"
        />
        <StatCard
          title="Players Analyzed"
          value={overview.players_analyzed || 0}
          subtitle="Available profiles"
        />
        <StatCard
          title="Risky Players"
          value={overview.top_risky_players?.length || 0}
          subtitle="Possession risk"
        />
        <StatCard
          title="Top Attackers"
          value={overview.top_attackers?.length || 0}
          subtitle="Offensive impact"
        />
      </div>

      {/* Tactical Problems Section */}
      {overview.mode === "all_matches" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {/* Animated side accent line */}
            <div className="absolute top-0 left-0 w-1.5 group-hover:w-2.5 h-full bg-red-600 transition-all duration-300"></div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-3 pl-2 group-hover:translate-x-1 transition-transform duration-300">
              Main Tactical Problem
            </h3>
            <p className="text-gray-700 leading-relaxed pl-2 text-lg">
              {overview.main_problem || "No main problem available."}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {/* Animated side accent line */}
            <div className="absolute top-0 left-0 w-1.5 group-hover:w-2.5 h-full bg-black transition-all duration-300"></div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-3 pl-2 group-hover:translate-x-1 transition-transform duration-300">
              Coach Recommendation
            </h3>
            <p className="text-gray-700 leading-relaxed pl-2 text-lg">
              {overview.main_recommendation || "No recommendation available."}
            </p>
          </div>
        </div>
      )}

      {/* Player Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 items-stretch">
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