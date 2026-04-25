import { useParams, useNavigate } from 'react-router-dom';
import matchData from '../data/match_stats.json';
import playerInfo from '../data/player_info.json';
import MetricCard from '../components/MetricCard';

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. SAFE LOOKUP: Always point to the .players array
  // We use || [] as a safety net so .find() never runs on 'undefined'
  const bio = (playerInfo.players || []).find(p => p.wyId.toString() === id.toString());
  const stats = (matchData.players || []).find(s => s.playerId.toString() === id.toString());

  // 2. CRASH PROTECTION: If we don't find the stats, stop here and show a message
  if (!stats) {
    return (
      <div className="p-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Player Data Not Found</h2>
        <p className="text-slate-500">We couldn't find match statistics for Player ID: {id}</p>
        <button onClick={() => navigate('/players')} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold">
          Return to Roster
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-900 font-bold flex items-center gap-2 transition-colors">
        ← BACK TO SQUAD
      </button>

      {/* Profile Header */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center border-b-8 border-emerald-500 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase">
            {bio?.shortName || stats.name || `Player #${id}`}
          </h1>
          <p className="text-emerald-400 font-bold tracking-[0.2em]">
            {bio?.role?.name || 'FIELD PLAYER'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-800 p-6 rounded-2xl text-center border border-slate-700 min-w-[120px]">
            <p className="text-xs text-slate-500 font-black uppercase mb-1">Mins</p>
            <p className="text-4xl font-black text-white">{stats.total?.minutesOnField || 0}</p>
          </div>
          {/* Added a Team Badge for extra detail */}
          <div className="bg-slate-800 p-6 rounded-2xl text-center border border-slate-700 min-w-[120px]">
            <p className="text-xs text-slate-500 font-black uppercase mb-1">Team ID</p>
            <p className="text-4xl font-black text-emerald-500">{bio?.currentTeamId || '—'}</p>
          </div>
        </div>
      </div>

      {/* Significant Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Expected Goals (xG)" value={stats.total?.xgShot || 0} />
        <MetricCard title="Pass Accuracy" value={`${stats.percent?.successfulPasses || 0}%`} />
        <MetricCard title="Total Recoveries" value={stats.total?.recoveries || 0} />
        <MetricCard title="Accelerations" value={stats.total?.accelerations || 0} />
      </div>

      {/* Match Performance Detail */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-6 uppercase italic">Technical Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <DetailRow label="Total Passes" value={stats.total?.passes} />
          <DetailRow label="Successful Passes" value={stats.total?.successfulPasses} />
          <DetailRow label="Duels Won (%)" value={`${stats.percent?.duelsWon || 0}%`} />
          <DetailRow label="Shots on Target" value={stats.total?.shotsOnTarget} />
          <DetailRow label="Interceptions" value={stats.total?.interceptions} />
          <DetailRow label="Fouls Committed" value={stats.total?.fouls} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 py-4">
      <span className="text-slate-500 font-bold text-sm uppercase">{label}</span>
      <span className="text-slate-900 font-black text-lg">{value || 0}</span>
    </div>
  );
}