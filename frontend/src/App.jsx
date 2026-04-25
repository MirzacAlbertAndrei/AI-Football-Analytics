import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Players from './pages/Players';
import TacticalInsights from './pages/TacticalInsights';
import CoachChat from './pages/CoachChat';
import PlayerDetail from './pages/PlayerDetail';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 font-sans">
        {/* Sidebar sits outside the Routes so it never disappears */}
        <Sidebar />
        
        {/* Main content area changes based on the URL */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/players" element={<Players />} />
            <Route path="/tactics" element={<TacticalInsights />} />
            <Route path="/chat" element={<CoachChat />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            {/* Add more routes here later if needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;