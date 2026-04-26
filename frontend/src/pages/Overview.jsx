import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the navigation hook
import { apiGet } from "../api";

// Helper to clean up match filenames for the dropdown
function formatMatchName(rawName) {
  if (!rawName) return "Unknown Match";
  let cleanName = rawName.replace("_players_stats.json", "");
  cleanName = cleanName.replace(/,\s*(\d+-\d+)/, " ($1)");
  return cleanName;
}

// Simplified StatCard with consistent black branding
function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className="absolute top-0 left-0 w-full h-1 bg-black group-hover:h-1.5 transition-all"></div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <h2 className="text-4xl font-black mt-2 tracking-tight text-black">
        {value}
      </h2>
      {subtitle && <p className="text-sm font-medium mt-1 text-gray-400 uppercase text-[10px] tracking-widest">{subtitle}</p>}
    </div>
  );
}

// Updated PlayerList to accept an onPlayerClick prop
function PlayerList({ title, players, type, onPlayerClick }) {
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
              onClick={() => onPlayerClick(player.playerId)} // Trigger navigation on click
              className="bg-gray-50 p-4 rounded-lg border border-gray-100 group hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-black text-lg">
                      {player.playerName || `Player #${player.playerId}`}
                    </p>
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
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide">{player.position || "Unknown position"}</p>
                </div>
              </div>
              {player.trend_label && (
                <p className="text-[11px] font-bold text-gray-800 mt-3 bg-white border border-gray-200 inline-block px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                  {player.trend_label}
                </p>
              )}
              {player.recommendation && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed border-t border-gray-200/50 pt-2">
                  <span className="font-semibold text-black">Focus: </span>{player.recommendation}
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
  const navigate = useNavigate(); // Initialize the navigate function
  const [overview, setOverview] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadOverview(matchId = "all") {
    try {
      setLoading(true);
      const path = matchId === "all" ? "/dashboard/overview" : `/dashboard/overview?match_id=${matchId}`;
      const data = await apiGet(path);
      setOverview(data);
    } catch (err) {
      console.error("Error loading overview", err);
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
        console.error("Error loading matches", err);
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

  // Navigation handler
  const handlePlayerClick = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">Synchronizing Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const performanceIndex = overview.performance_index ?? 50;

  const totalThreat = parseFloat(overview.top_attackers?.reduce((sum, p) => 
    sum + (p.raw_stats?.xg || p.totals?.xg || 0), 0).toFixed(2)) || 0;

  const getPerformanceBranding = () => {
    if (performanceIndex >= 75) return { label: 'Peak Performance', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    return { label: 'Standard Analysis', color: 'bg-zinc-50 text-zinc-700 border-zinc-200' };
  };

  const branding = getPerformanceBranding();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans text-black">
      
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
            Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600">Intelligence</span>
          </h1>
          <div className="flex items-center gap-3">
             <p className="text-gray-500 font-medium tracking-wide text-xs uppercase">U CLUJ ANALYTICS • DATA-DRIVEN INSIGHTS</p>
             <div className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${branding.color}`}>
               <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${branding.color.split(' ')[1].replace('text', 'bg')}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${branding.color.split(' ')[1].replace('text', 'bg')}`}></span>
               </span>
               {branding.label}
             </div>
          </div>
        </div>

        <select
          value={selectedMatchId}
          onChange={handleMatchChange}
          className="bg-white border-2 border-gray-200 rounded-lg px-4 py-3 shadow-sm font-semibold text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors appearance-none min-w-[220px] cursor-pointer"
        >
          <option value="all">Season Performance View</option>
          {matches.map((match) => (
            <option key={match.match_id} value={match.match_id}>
              {formatMatchName(match.file_name)}
            </option>
          ))}
        </select>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Current Scope" value={overview.mode === "single_match" ? "Match" : "Season"} subtitle="Analysis Range" />
        <StatCard title="Active Profiles" value={overview.players_analyzed || 0} subtitle="Data points" />
        <StatCard 
          title="Performance Index" 
          value={`${performanceIndex}%`} 
          subtitle="Squad execution rate" 
        />
        <StatCard 
          title="Attacking Impact" 
          value={totalThreat.toFixed(2)} 
          subtitle="Cumulative xG" 
        />
      </div>

      {/* AI TACTICAL SUMMARY */}
      {(overview.main_problem || overview.main_recommendation) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {overview.main_problem && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-3 pl-2">Primary Tactical Focus</h3>
              <p className="text-gray-700 leading-relaxed pl-2 text-lg font-medium">{overview.main_problem}</p>
            </div>
          )}
          {overview.main_recommendation && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-black"></div>
              <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-3 pl-2">Optimization Strategy</h3>
              <p className="text-gray-700 leading-relaxed pl-2 text-lg font-medium">{overview.main_recommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* DRILL-DOWN LISTS with Click Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 items-stretch">
        <PlayerList 
            title="High Attention Profiles" 
            players={overview.top_risky_players || []} 
            type="risk" 
            onPlayerClick={handlePlayerClick}
        />
        <PlayerList 
            title="Key Offensive Drivers" 
            players={overview.top_attackers || []} 
            type="attack" 
            onPlayerClick={handlePlayerClick}
        />
        <PlayerList 
            title="Performance Anchors" 
            players={overview.stable_players || []} 
            type="stable" 
            onPlayerClick={handlePlayerClick}
        />
      </div>
    </div>
  );
}