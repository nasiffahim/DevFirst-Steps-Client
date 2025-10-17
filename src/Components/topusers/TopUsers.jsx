"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Badge from "../badge/Badge";

const TopUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await api.get("/leaderboard");
        console.log("Leaderboard data:", res.data); // debug
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };
    fetchTopUsers();
  }, []);

  if (!users || users.length === 0) {
    return <p className="text-center">No users found yet!</p>;
  }

  return (
    <div className="p-6 mx-4 bg-white text-black rounded-xl shadow my-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🏆 Top 10 Users</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <li
            key={user._id || index}
            className="p-4 bg-gray-200 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.name || user.email}</p>
              {/* <p className="text-sm text-gray-400">{user.points || 0} pts</p> */}
            </div>
            <Badge badge={user.badge || "Newbie"} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;
