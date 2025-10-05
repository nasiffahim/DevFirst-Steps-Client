
"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Badge from "./Badge";

const UserProfile = ({ email }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${email}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [email]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!user) return <p className="text-red-400">User not found</p>;

  return (
    <div className="p-4 bg-slate-800 text-white rounded-lg shadow mt-4">
      <h2 className="text-lg font-bold mb-1">{user.name || user.email}</h2>
      <p className="text-sm mb-1">Points: {user.points || 0}</p>
      <div>
        Badge: <Badge badge={user.badge} />
      </div>
    </div>
  );
};

export default UserProfile;
