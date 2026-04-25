import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api";

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mt-2">{value}</h2>
    </div>
  );
}

export default function PlayerDetail() {
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet(`/players/${id}/profile`);

        if (data.error) {
          setError(data.error);
        } else {
          setPlayer(data);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load player profile.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading player profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Player #{player.playerId}
        </h1>
        <p className="text-gray-500 mt-1">
          {player.position || "Unknown position"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Matches played" value={player.matches_played} />
        <StatCard title="Avg losses" value={player.averages?.losses ?? 0} />
        <StatCard
          title="Avg own-half losses"
          value={player.averages?.own_half_losses ?? 0}
        />
        <StatCard
          title="Avg dangerous losses"
          value={player.averages?.dangerous_losses ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total goals" value={player.totals?.goals ?? 0} />
        <StatCard title="Total xG" value={player.totals?.xg ?? 0} />
        <StatCard title="Total losses" value={player.totals?.losses ?? 0} />
        <StatCard
          title="High-risk matches"
          value={player.high_risk_matches ?? 0}
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Trend Label
        </h3>
        <p className="text-gray-700">{player.trend_label}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Coach Recommendation
        </h3>
        <p className="text-gray-700">{player.recommendation}</p>
      </div>
    </div>
  );
}