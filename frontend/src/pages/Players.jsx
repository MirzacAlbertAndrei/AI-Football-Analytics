import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';

// Temporary mock of available matches for your dropdown
const AVAILABLE_MATCHES = [
  { id: '5828095', label: 'Univ. Craiova vs CFR Cluj (2-0)' },
  { id: '5828096', label: 'Univ. Craiova vs FCSB (1-1)' },
  { id: '5828097', label: 'Rapid vs Univ. Craiova (0-1)' }
];

export default function Players() {
  const navigate = useNavigate();
  
  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('match'); // 'match' or 'history'
  const [selectedMatchId, setSelectedMatchId] = useState(AVAILABLE_MATCHES[0].id);

  // --- DATA STATES ---
  const [matchData, setMatchData] = useState({ players: [] });
  const [playerInfo, setPlayerInfo] = useState({ players: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API FETCH LAYER ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Determine which endpoint to hit based on the toggle
        const statsEndpoint = viewMode === 'history' 
          ? `https://your-api-url.com/team-stats/60374/season-history` 
          : `https://your-api-url.com/match-stats/${selectedMatchId}`;

        // 2. Fetch both the stats and the roster info
        const [statsResponse, infoResponse] = await Promise.all([
          fetch(statsEndpoint),
          fetch('https://your-api-url.com/team-roster/60374') // Roster stays the same
        ]);

        if (!statsResponse.ok || !infoResponse.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const statsJson = await statsResponse.json();
        const infoJson = await infoResponse.json();

        setMatchData(statsJson);
        setPlayerInfo(infoJson);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode, selectedMatchId]); // Re-run this whenever the mode or match changes!

  // --- DATA TRANSFORMATION LAYER ---
  const enrichedSquad = useMemo(() => {
    const allBios = playerInfo.players || [];
    const allStats = matchData.players || [];
    
    const targetTeamId = 60374;
    const teamBios = allBios.filter(p => p.currentTeamId == targetTeamId);

    const infoDict = teamBios.reduce((acc, p) => {
      if (p.wyId) acc[p.wyId.toString()] = p;
      return acc;
    }, {});
    
    return allStats
      .filter(stat => infoDict[stat.playerId.toString()])
      .map(stat => {
        const bio = infoDict[stat.playerId.toString()];
        
        // --- KEY STAT LOGIC ---
        const getBestStat = () => {
          // If we are looking at history, we might look at averages instead of totals
          const metrics = viewMode === 'history' ? (stat.average || stat.total || {}) : (stat.total || {});
          const percent = stat.percent || {};

          if (metrics.xgShot > 0.5) return `${metrics.xgShot.toFixed(2)} xG (High Threat)`;
          if (metrics.recoveries > 8) return `${metrics.recoveries} Ball Recoveries`;
          if (metrics.accelerations > 5) return `${metrics.accelerations} Explosive Runs`;
          if (percent.successfulPasses > 85) return `${percent.successfulPasses}% Elite Passing`;
          if (metrics.shotsOnTarget > 1) return `${metrics.shotsOnTarget} Shots on Target`;
          
          return `${percent.successfulPasses || 0}% Pass Accuracy`;
        };

        return {
          ...stat,
          displayName: bio?.shortName || stat.name || `Player #${stat.playerId}`,
          position: bio?.role?.name || "Other",
          bestStat: getBestStat()
        };
      });
  }, [matchData, playerInfo, viewMode]);

  const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const filteredSquad = enrichedSquad.filter(p => activeTab === 'All' || p.position === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
            Squad Dashboard
          </h2>
          <p className="text-slate-500 font-medium mt-2">Team ID: 60374</p>
        </div>

        {/* --- THE TOGGLE & DROPDOWN UI --- */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          
          {/* History vs Match Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setViewMode('history')}
              className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Full Season History
            </button>
            <button
              onClick={() => setViewMode('match')}
              className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'match' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Specific Match
            </button>
          </div>

          {/* Match Selector Dropdown (Only shows if 'match' is selected) */}
          {viewMode === 'match' && (
            <select 
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm cursor-pointer"
            >
              {AVAILABLE_MATCHES.map(match => (
                <option key={match.id} value={match.id}>
                  {match.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ERROR & LOADING STATES */}
      {loading && (
        <div className="py-20 text-center animate-pulse">
          <div className="h-12 w-12 bg-emerald-500 rounded-full mb-4 mx-auto"></div>
          <p className="font-bold text-slate-400">Syncing with wyscout database...</p>
        </div>
      )}

      {error && !loading && (
        <div className="py-10 text-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold">API Connection Failed</h2>
          <p>{error}</p>
          <p className="text-sm mt-2">Make sure your backend server is running.</p>
        </div>
      )}

      {/* ROSTER GRID */}
      {!loading && !error && (
        <>
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
            {positions.map(pos => (
              <button
                key={pos}
                onClick={() => setActiveTab(pos)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === pos ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {pos}s
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSquad.map((player) => (
              <div 
                key={player.playerId} 
                onClick={() => navigate(`/player/${player.playerId}`)}
                className="cursor-pointer transform transition hover:-translate-y-1 active:scale-95"
              >
                <PlayerCard 
                  name={player.displayName}
                  position={player.position}
                  number={viewMode === 'history' ? 'SEASON' : `${player.total?.minutesOnField || 0}m`}              
                  keyStat={player.bestStat}
                  injuryRisk={player.total?.accelerations > 4 ? "High" : "Low"}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}   