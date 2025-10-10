"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api"; // তোমার axios instance

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 bg-slate-900 text-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">🏆 Top 10 Users</h2>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li
            key={user._id}
            className="flex justify-between border-b border-slate-700 pb-1"
          >
            <span>
              {index + 1}. {user.name || user.email}
            </span>
            <span>{user.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
