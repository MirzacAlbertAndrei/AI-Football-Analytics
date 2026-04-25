import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";

function getRiskClass(risk) {
  if (risk === "High") return "bg-red-600 text-white";
  if (risk === "Medium") return "bg-black text-white";
  return "bg-gray-200 text-gray-800";
}

function PlayerCard({ player, mode, onClick }) {
  const isMatchMode = mode === "match";

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-black group-hover:bg-red-600 transition-colors duration-300"></div>
      
      <div className="flex justify-between items-start gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-black tracking-tight uppercase">
              {player.playerName || `Player #${player.playerId}`}
            </h3>
            <svg 
              className="w-5 h-5 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1.5 transition-all duration-300" 
              fill="none" 
              strokeWidth="3" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mt-1">
            {player.position || "Unknown position"}
          </p>
        </div>

        {isMatchMode ? (
          <span
            className={`px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105 ${getRiskClass(
              player.risk
            )}`}
          >
            {player.risk} Risk
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            {player.matches_played} Matches
          </span>
        )}
      </div>

      <div className="border-t border-gray-100 pt-5 mb-5 flex-grow group-hover:border-gray-200 transition-colors duration-300">
        {isMatchMode ? (
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <StatItem label="Minutes" value={player.raw_stats?.minutes ?? 0} />
            <StatItem label="Losses" value={player.raw_stats?.losses ?? 0} />
            <StatItem label="Own-half Loss" value={player.raw_stats?.own_half_losses ?? 0} />
            <StatItem label="Danger Loss" value={player.raw_stats?.dangerous_losses ?? 0} />
            <StatItem label="xG" value={player.raw_stats?.xg ?? 0} />
            <StatItem label="Key Passes" value={player.raw_stats?.key_passes ?? 0} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <StatItem label="Avg Losses" value={player.averages?.losses ?? 0} />
            <StatItem label="Avg Danger" value={player.averages?.dangerous_losses ?? 0} />
            <StatItem label="Total Goals" value={player.totals?.goals ?? 0} />
            <StatItem label="Total xG" value={player.totals?.xg ?? 0} />
            <StatItem label="High-Risk Gms" value={player.high_risk_matches ?? 0} />
            <StatItem label="High-Impact Gms" value={player.high_impact_matches ?? 0} />
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-auto group-hover:bg-red-50 group-hover:border-red-100 transition-colors duration-300">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 group-hover:text-red-400 transition-colors">
          {isMatchMode ? "Match Analysis" : "Season Trend"}
        </p>
        <p className="text-sm font-bold text-black mb-1">
          {isMatchMode ? player.recommendation : player.trend_label}
        </p>

        {!isMatchMode && (
          <p className="text-sm text-gray-600 leading-relaxed mt-2 border-t border-gray-200 pt-2 group-hover:border-red-200 transition-colors">
            <span className="font-semibold text-black">Action: </span>
            {player.recommendation}
          </p>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
        {label}
      </p>
      <p className="text-lg font-black text-black leading-tight">
        {value}
      </p>
    </div>
  );
}

export default function Players() {
  const navigate = useNavigate();
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
      setError("Could not load player trends from backend.");
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
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Analysis</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 tracking-wide uppercase text-sm">
            AI ANALYSIS INTERFACE • U CLUJ ROSTER DATA
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex bg-gray-200 p-1 rounded-lg shadow-inner">
            <button
              onClick={() => handleModeChange("season")}
              className={`px-6 py-2.5 rounded-md font-bold text-sm uppercase tracking-wider transition-all ${
                mode === "season"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Full Season
            </button>
            <button
              onClick={() => handleModeChange("match")}
              className={`px-6 py-2.5 rounded-md font-bold text-sm uppercase tracking-wider transition-all ${
                mode === "match"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Single Match
            </button>
          </div>

          {mode === "match" && (
            <select
              value={selectedMatchId}
              onChange={handleMatchChange}
              className="bg-white border-2 border-gray-200 rounded-lg px-4 py-3 shadow-sm font-semibold text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors appearance-none min-w-[220px] cursor-pointer"
            >
              {matches.map((match) => (
                <option key={match.match_id} value={match.match_id}>
                  {match.file_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">
            Compiling player data...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-5 rounded-r-xl shadow-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-black rounded-sm"></div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wider">
              {mode === "season" ? "Roster Overview" : "Match Squad"} 
              <span className="text-gray-400 ml-2 text-sm">({players.length} PROFILES)</span>
            </h3>
          </div>

          {players.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
              <p className="text-gray-500 font-medium uppercase tracking-wide">No players found for this selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {players.map((player) => (
                <PlayerCard
                  key={`${player.playerId}-${player.matchId || "season"}`}
                  player={player}
                  mode={mode}
                  onClick={() => navigate(`/players/${player.playerId}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}