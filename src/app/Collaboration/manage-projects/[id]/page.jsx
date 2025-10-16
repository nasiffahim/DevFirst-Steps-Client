"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../utils/api";
import { CheckCircle, XCircle } from "lucide-react";

const JoinRequestDetail = () => {
  const router = useRouter();
  const { requestId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/collaboration/join-request/${requestId}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch join request detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [requestId]);

  const handleAction = async (action) => {
    try {
      const endpoint =
        action === "accept"
          ? `/collaboration/request/${requestId}/accept`
          : `/collaboration/request/${requestId}/reject`;

      let body = {};
      if (action === "reject") {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        body = { reason };
      }

      await api.patch(endpoint, body);
      alert(`Request ${action}ed successfully`);
      router.back();
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Request not found
      </div>
    );

  const { request, project } = data;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Project Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          {project.title} - Join Request
        </h1>

        {/* Request Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 transition-all hover:scale-[1.01] duration-300">
          <div className="flex items-center gap-6">
            {request.photoURL ? (
              <img
                src={request.photoURL}
                alt={request.name}
                className="w-28 h-28 rounded-full border-4 border-indigo-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-3xl font-bold">
                {request.name?.[0] || "?"}
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {request.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {request.userEmail}
              </p>
              <p className="mt-2">
                <strong>Role:</strong> {request.role}
              </p>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                <strong>Message:</strong>{" "}
                {request.message || "No message provided."}
              </p>
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                statusColors[request.status]
              }`}
            >
              {request.status.toUpperCase()}
            </span>
          </div>

          {/* Rejection Reason */}
          {request.status === "rejected" && (
            <p className="mt-4 text-red-500 font-medium">
              <XCircle className="inline mr-1" size={18} />
              Reason: {request.reason}
            </p>
          )}

          {/* Action Buttons */}
          {request.status === "pending" && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => handleAction("accept")}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium shadow-md transition-all transform hover:scale-105"
              >
                <CheckCircle size={20} /> Accept
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium shadow-md transition-all transform hover:scale-105"
              >
                <XCircle size={20} /> Reject
              </button>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRequestDetail;
