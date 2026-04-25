// src/pages/TacticalInsights.jsx
import { useState } from 'react';

export default function TacticalInsights() {
  // Mock StatsBomb-style pattern data
  const reviewPatterns = [
    {
      id: 1,
      type: 'success',
      title: 'Effective Counter-Pressing',
      timestamp: '14:22 - 18:45',
      metric: '8 Recoveries in Final Third',
      description: 'The front three successfully collapsed on the opponent\'s pivot, forcing high turnovers that led to 2 big chances.',
    },
    {
      id: 2,
      type: 'error',
      title: 'Dangerous Central Turnovers',
      timestamp: '32:10 - 45:00',
      metric: '5 Turnovers in Zone 14',
      description: 'Midfielders attempted low-percentage through balls through the center instead of recycling possession wide, exposing us to counter-attacks.',
    },
    {
      id: 3,
      type: 'success',
      title: 'Line-Breaking Passes (Left Flank)',
      timestamp: '60:00 - 75:00',
      metric: '12 Completed Passes',
      description: 'Left-back successfully bypassed the opponent\'s first line of pressure, isolating our winger 1-on-1.',
    },
    {
      id: 4,
      type: 'error',
      title: 'Low xG Shot Selection',
      timestamp: '78:00 - 90:00',
      metric: 'Average xG: 0.04',
      description: 'Players settled for shots outside the box against a set defense rather than working the ball into the penalty area.',
    }
  ];

  const [activePattern, setActivePattern] = useState(reviewPatterns[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Post-Match Review</h2>
          <p className="text-slate-500 mt-1">vs. United FC • AI Pattern Recognition</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
          Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of Patterns */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Identified Patterns</h3>
          
          {reviewPatterns.map((pattern) => {
            const isSelected = activePattern.id === pattern.id;
            const isSuccess = pattern.type === 'success';
            
            return (
              <button
                key={pattern.id}
                onClick={() => setActivePattern(pattern)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? (isSuccess ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50')
                    : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isSuccess ? 'Positive Pattern' : 'Critical Error'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{pattern.timestamp}</span>
                </div>
                <h4 className="font-bold text-slate-900 mt-2">{pattern.title}</h4>
              </button>
            )
          })}
        </div>

        {/* Right Column: Deep Dive & Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">{activePattern.title}</h3>
            <p className="text-lg text-slate-500 font-medium mt-1">{activePattern.metric}</p>
            <p className="text-slate-700 mt-4 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {activePattern.description}
            </p>
          </div>

          {/* Hackathon Pitch Visualization (CSS Only) */}
          <div className="flex-1 bg-emerald-800 rounded-lg border-2 border-emerald-900 relative overflow-hidden min-h-[300px] flex items-center justify-center">
            {/* Fake Pitch Lines */}
            <div className="absolute inset-0 border-4 border-white/30 m-4 rounded"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full"></div>
            
            {/* Event Markers based on pattern type */}
            {activePattern.type === 'success' ? (
              <div className="absolute top-1/3 left-2/3 flex items-center space-x-2">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                </span>
                <span className="text-white text-xs font-bold bg-slate-900/50 px-2 py-1 rounded">Event Data Loaded</span>
              </div>
            ) : (
              <div className="absolute bottom-1/3 left-1/4 flex items-center space-x-2">
                 <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
                </span>
                <span className="text-white text-xs font-bold bg-slate-900/50 px-2 py-1 rounded">Turnover Clustered Here</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex space-x-3">
             <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 rounded-lg transition">
               Watch Video Clips (3)
             </button>
             <button className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium py-2 rounded-lg transition">
               Send to Players
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}