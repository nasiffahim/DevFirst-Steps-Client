"use client";

import React, { useState } from "react";

const Page = () => {
  const [joinRequests, setJoinRequests] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      photoURL: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Frontend Developer",
      message: "Excited to contribute!",
      status: "Pending",
      rejectionReason: "",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      photoURL: "https://randomuser.me/api/portraits/men/2.jpg",
      role: "Backend Developer",
      message: "I can help with APIs and database.",
      status: "Approved",
      rejectionReason: "",
    },
    {
      id: 3,
      name: "Clara Lee",
      email: "clara@example.com",
      photoURL: "https://randomuser.me/api/portraits/women/3.jpg",
      role: "UI/UX Designer",
      message: "Love designing user interfaces.",
      status: "Rejected",
      rejectionReason: "Not enough experience",
    },
  ]);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const [reason, setReason] = useState("");

  const updateStatus = (id, newStatus, rejectionReason = "") => {
    setJoinRequests((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: newStatus, rejectionReason }
          : user
      )
    );
  };

  const handleRejectClick = (id) => {
    setCurrentRejectId(id);
    setReason("");
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    updateStatus(currentRejectId, "Rejected", reason);
    console.log("Rejected Reason:", reason);
    setRejectModalOpen(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Project Join Requests
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Message</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {joinRequests.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{user.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.role}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.message}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : user.status === "Approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {user.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(user.id, "Approved")}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectClick(user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Reject Join Request
            </h2>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Write rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
