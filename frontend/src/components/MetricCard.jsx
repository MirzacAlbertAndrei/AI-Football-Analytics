// src/components/MetricCard.jsx

export default function MetricCard({ title, value, trend, trendLabel }) {
  // Determine if the trend is positive or negative for styling
  const isPositive = trend === 'up';
  
  // Choose colors based on the trend
  const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500';
  const TrendIcon = isPositive ? '↑' : '↓';

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      {/* Title */}
      <h3 className="text-slate-500 text-sm font-medium tracking-wide">
        {title}
      </h3>
      
      {/* Main Value & Trend Container */}
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-slate-900">
          {value}
        </span>
        
        {/* Only render this part if a trend is provided */}
        {trend && trendLabel && (
          <span className={`text-sm font-semibold flex items-center ${trendColor}`}>
            {TrendIcon} {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}