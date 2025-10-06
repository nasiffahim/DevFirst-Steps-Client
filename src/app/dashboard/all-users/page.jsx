"use client";
import React, { useEffect, useState } from "react";
import { User, Mail, Loader2 } from "lucide-react";
import ProtectedPage from "../../../Components/Protected/ProtectedPage";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/all/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "moderator":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "silver":
        return "bg-gray-100 text-gray-800";
      case "bronze":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <ProtectedPage>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found 😢</p>
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((user, index) => (
              <div
                key={user._id || index}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium text-gray-800">{user.username}</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>{user.email}</span>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role || "user"}
                  </span>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(
                      user.badge
                    )}`}
                  >
                    {user.badge || "-"}
                  </span>
                </div>
                <div className="font-medium text-gray-700">{user.points || 0} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedPage>
  );
};

export default AllUser;
