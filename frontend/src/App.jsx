import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar"; 

import Overview from "./pages/Overview";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";
import CoachChat from "./pages/CoachChat";
import CoachReport from "./pages/CoachReport";

function Layout() {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans text-black">
      {/* Vertical Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/tactics" element={<CoachReport />} />
          <Route path="/chat" element={<CoachChat />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}