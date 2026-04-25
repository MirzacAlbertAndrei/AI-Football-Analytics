// src/components/Chart.jsx
export default function Chart({ title }) {
  // Mock data for the chart
  const data = [
    { label: '15m', value: 40 },
    { label: '30m', value: 65 },
    { label: '45m', value: 85 },
    { label: '60m', value: 55 },
    { label: '75m', value: 90 },
    { label: '90m', value: 100 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>
      
      {/* Chart Area */}
      <div className="flex-1 flex items-end justify-between gap-2 pt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group">
            {/* Tooltip (shows on hover) */}
            <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
              {item.value}
            </span>
            
            {/* Bar */}
            <div 
              className="w-full bg-emerald-100 group-hover:bg-emerald-400 rounded-t-md transition-colors relative"
              style={{ height: `${item.value}%` }}
            >
              {/* Optional: Add a top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-md"></div>
            </div>
            
            {/* Label */}
            <span className="text-xs text-slate-400 mt-3 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}