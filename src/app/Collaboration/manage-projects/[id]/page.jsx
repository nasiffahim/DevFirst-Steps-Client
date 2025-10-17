"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../utils/api";
import { CheckCircle, XCircle } from "lucide-react";

const ProjectJoinRequests = () => {
  const { id } = useParams(); // projectId
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchRequests = async () => {
      try {
        const res = await api.get(`/collaboration/join-requests-by-project/${id}`);
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch join requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [id]);

  const handleAction = async (requestId, action) => {
    try {
      const endpoint =
        action === "accept"
          ? `/collaboration/request/${requestId}/accept`
          : `/collaboration/request/${requestId}/reject`;

      let body = {};
      if (action === "reject") {
        if (!rejectionReason) {
          alert("Please enter a rejection reason.");
          return;
        }
        body = { reason: rejectionReason };
      }

      await api.patch(endpoint, body);
      alert(`Request ${action}ed successfully`);
      setIsModalOpen(false);
      setRejectionReason("");
      setSelectedRequest(null);

      // Refresh data after update
      const res = await api.get(`/collaboration/join-requests-by-project/${id}`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  };

  if (loading)
    return <div className="flex justify-center min-h-screen">Loading...</div>;

  if (requests.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        No join requests found.
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Project Join Requests
      </h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-semibold">{req.name}</h2>
            <p className="text-gray-500">{req.userEmail}</p>
            <p className="mt-1 text-sm">Role: {req.role}</p>
            <p className="mt-1 text-sm">Message: {req.message || "No message"}</p>
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                req.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : req.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {req.status}
            </span>

            {req.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleAction(req._id, "accept")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  <CheckCircle size={18} /> Accept
                </button>
                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Back
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reject Request</h2>
            <p className="mb-2">
              Enter rejection reason for <strong>{selectedRequest.name}</strong>:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-md mb-4 dark:bg-gray-800 dark:text-white"
              rows={4}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedRequest._id, "reject")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
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

export default ProjectJoinRequests;
