// src/components/PlayerCard.jsx
import RiskBadge from './RiskBadge';

export default function PlayerCard({ name, position, number, injuryRisk, keyStat }) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
      
      {/* Left side: Player Info */}
      <div className="flex items-center space-x-4">
        {/* Mock Jersey Number Avatar */}
        <div className="h-12 w-12 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-lg font-bold text-slate-700">
          {number}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500 font-medium">{position}</p>
        </div>
      </div>

      {/* Right side: Stats & Risk */}
      <div className="text-right flex flex-col items-end space-y-2">
        <RiskBadge level={injuryRisk} />
        <p className="text-sm text-slate-600 font-medium">{keyStat}</p>
      </div>
      
    </div>
  );
}