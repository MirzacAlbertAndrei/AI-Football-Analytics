import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import CoachRecommendation from '../components/CoachRecommendation';

export default function Overview() {
  // --- STATE MANAGEMENT ---
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API FETCH LAYER ---
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        
        // Replace with your actual backend endpoint for the match overview
        const response = await fetch('https://your-api-url.com/team-overview/60374/next-match');
        
        if (!response.ok) {
          throw new Error('Failed to fetch overview data from the server.');
        }

        const data = await response.json();
        setOverviewData(data);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // --- UI STATES ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center animate-pulse">
        <div className="h-12 w-12 bg-emerald-500 rounded-full mb-4 mx-auto"></div>
        <h2 className="text-xl font-bold text-slate-400">Analyzing Pre-Match Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
        <h2 className="text-2xl font-bold">Analysis Unavailable</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Fallback in case data is empty
  if (!overviewData) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Dynamic Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pre-Match Analysis</h2>
        <p className="text-gray-500 mt-1">
          Next Opponent: <span className="font-bold text-gray-700">{overviewData.matchInfo?.opponent}</span> • {overviewData.matchInfo?.venue} • {overviewData.matchInfo?.day}
        </p>
      </div>

      {/* Dynamic Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Win Probability" 
          value={overviewData.metrics?.winProbability} 
          trend={overviewData.metrics?.winProbabilityTrend > 0 ? "up" : "down"} 
          trendLabel={`${Math.abs(overviewData.metrics?.winProbabilityTrend)}%`} 
        />
        <MetricCard 
          title="Squad Fatigue" 
          value={overviewData.metrics?.squadFatigue} 
          // If fatigue is worsening (going up), we might want a "down" or negative indicator
          trend={overviewData.metrics?.fatigueWorsening ? "down" : "up"} 
          trendLabel={overviewData.metrics?.previousFatigue} 
        />
        <MetricCard 
          title="Expected Goals" 
          value={overviewData.metrics?.expectedGoals} 
          trend="up" 
          trendLabel={overviewData.metrics?.xGTrend} 
        />
        <MetricCard 
          title="Opponent Form" 
          value={overviewData.metrics?.opponentForm} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Chart Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center min-h-[300px] shadow-sm">
          <p className="text-gray-400 font-medium">Data Visualization / Chart Component will load here</p>
        </div>

        {/* Right Column (Dynamic AI Insights) */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span>🪄</span> Tactical Assistant
          </h3>
          
          {/* Map through the AI recommendations array from the API */}
          {overviewData.insights?.map((insight, index) => (
            <CoachRecommendation 
              key={index}
              title={insight.title} 
              insight={insight.description} 
              action={insight.actionText}
            />
          ))}

          {(!overviewData.insights || overviewData.insights.length === 0) && (
            <p className="text-sm text-gray-500 italic">No specific tactical insights generated for this match.</p>
          )}
        </div>
        
      </div>
    </div>
  );
}