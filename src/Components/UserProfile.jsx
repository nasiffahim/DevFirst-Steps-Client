"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import Badge from "./Badge";


const UserProfile = ({ email }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${email}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [email]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-slate-800 text-white rounded shadow">
      <h2 className="text-xl font-bold">{user.email}</h2>
      <p>Points: {user.points}</p>
      <div>
        Badge: <Badge badge={user.badge} />
      </div>
    </div>
  );
};

export default UserProfile;
