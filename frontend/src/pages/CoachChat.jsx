// src/pages/CoachChat.jsx
export default function CoachChat() {
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h2 className="text-white font-bold">Gaffer AI Assistant</h2>
          <p className="text-slate-400 text-xs font-medium">Powered by Match Data</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-emerald-500 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
            <p className="text-sm">Why did our expected goals (xG) drop so drastically in the final 20 minutes?</p>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex justify-start">
          <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
            <p className="text-sm leading-relaxed mb-3">
              Based on the StatsBomb tracking data, there are two main reasons for the xG drop:
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside text-slate-600 mb-3">
              <li><strong className="text-slate-800">Fatigue in midfield:</strong> Bruno Fernandes's high-intensity runs decreased by 40%.</li>
              <li><strong className="text-slate-800">Tactical shift:</strong> The opponent switched to a low-block (5-4-1), reducing space in Zone 14.</li>
            </ul>
            <p className="text-sm text-slate-600">
              Would you like to see the player heatmaps for the final 20 minutes?
            </p>
          </div>
        </div>

      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Ask about player stats, tactics, or match events..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Send
          </button>
        </div>
      </div>

    </div>
  );
}