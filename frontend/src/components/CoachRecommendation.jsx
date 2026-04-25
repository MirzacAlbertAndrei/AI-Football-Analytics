export default function CoachRecommendation({ title, insight, action }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-indigo-600 text-xl">💡</span>
          <h3 className="text-indigo-900 font-bold text-lg">{title}</h3>
        </div>
        
        <p className="text-indigo-800 text-sm mb-4 leading-relaxed">
          {insight}
        </p>
        
        {action && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            {action}
          </button>
        )}
      </div>
    </div>
  );
}