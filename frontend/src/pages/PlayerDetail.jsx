import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../api";

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
      {/* Accent line on top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black group-hover:bg-red-600 transition-colors duration-300"></div>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <h2 className="text-4xl font-black text-black mt-2 tracking-tight group-hover:scale-[1.02] origin-left transition-transform duration-300">{value}</h2>
    </div>
  );
}

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet(`/players/${id}/profile`);

        if (data.error) {
          setError(data.error);
        } else {
          setPlayer(data);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load player profile from backend.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">Retrieving profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 bg-zinc-50 min-h-screen font-sans">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back to Roster
        </button>
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-5 rounded-r-xl shadow-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-2 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back to Roster
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            Player{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              {player.playerName || `Player #${player.playerId}`}
            </span>
          </h1>
          <p className="text-red-600 font-bold mt-2 tracking-widest uppercase text-sm">
            {player.position || "Unknown position"}
          </p>
        </div>
      </div>

      {/* Averages / Base Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Matches Played" value={player.matches_played} />
        <StatCard title="Avg Losses" value={player.averages?.losses ?? 0} />
        <StatCard title="Avg Own-Half Losses" value={player.averages?.own_half_losses ?? 0} />
        <StatCard title="Avg Danger Losses" value={player.averages?.dangerous_losses ?? 0} />
      </div>

      {/* Totals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Goals" value={player.totals?.goals ?? 0} />
        <StatCard title="Total xG" value={player.totals?.xg ?? 0} />
        <StatCard title="Total Losses" value={player.totals?.losses ?? 0} />
        <StatCard title="High-Risk Matches" value={player.high_risk_matches ?? 0} />
      </div>

      {/* Tactical Profile Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Trend Label Box */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 w-1.5 group-hover:w-2.5 h-full bg-black transition-all duration-300"></div>
          <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-3 pl-2 group-hover:translate-x-1 transition-transform duration-300">
            Current Trend
          </h3>
          <p className="text-gray-700 leading-relaxed pl-2 text-lg">
            {player.trend_label || "No trend data available."}
          </p>
        </div>

        {/* Coach Recommendation Box */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 w-1.5 group-hover:w-2.5 h-full bg-red-600 transition-all duration-300"></div>
          <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-3 pl-2 group-hover:translate-x-1 transition-transform duration-300">
            Coach Recommendation
          </h3>
          <p className="text-gray-700 leading-relaxed pl-2 text-lg">
            {player.recommendation || "No specific recommendation at this time."}
          </p>
        </div>
      </div>
      
    </div>
  );
}