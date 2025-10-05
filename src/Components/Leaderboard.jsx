
"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Badge from "./Badge";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/leaderboard");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg shadow-md mt-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3 text-center">🏆 Leaderboard</h2>
      <ul className="divide-y divide-slate-700">
        {users.map((u, idx) => (
          <li
            key={u.email}
            className="flex justify-between items-center py-2 hover:bg-slate-800 rounded-md px-2 transition"
          >
            <span>
              {idx + 1}. {u.name || u.email}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">{u.points} pts</span>
              <Badge badge={u.badge} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;







