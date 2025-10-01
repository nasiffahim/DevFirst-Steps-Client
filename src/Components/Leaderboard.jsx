"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Badge from "./Badge";



const Leaderboard = () => {
  const [users, setUsers] = useState([]);

useEffect(() => {
    const fetchLeaderboard = async () => {
      try {const response = await api.get("/leaderboard");
      setUsers(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 bg-slate-900 text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
      <ul>
        {users.map((u, idx) => (
          <li key={u.email} className="flex justify-between py-1 border-b border-slate-700">
            <span>
              {idx + 1}. {u.email} → {u.points} pts
            </span>
            <Badge badge={u.badge} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
