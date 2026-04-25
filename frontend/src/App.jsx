import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Overview from "./pages/Overview";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";
import CoachChat from "./pages/CoachChat";
import CoachReport from "./pages/CoachReport";

function Layout() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl font-semibold ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex gap-3">
        <NavLink to="/" className={linkClass}>
          Overview
        </NavLink>

        <NavLink to="/players" className={linkClass}>
          Players
        </NavLink>

        <NavLink to="/coach-report" className={linkClass}>
          Coach Report
        </NavLink>

        <NavLink to="/coach-chat" className={linkClass}>
          AI Chat
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/coach-report" element={<CoachReport />} />
        <Route path="/coach-chat" element={<CoachChat />} />
      </Routes>
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