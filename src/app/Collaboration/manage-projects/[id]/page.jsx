"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../utils/api";
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Users, 
  Mail, 
  Briefcase,
  MessageSquare,
  Clock,
  UserCheck,
  AlertCircle,
  Inbox
} from "lucide-react";
import { toast } from "react-toastify";

const ProjectJoinRequests = () => {
  const { id } = useParams();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchRequests = async () => {
      try {
        const res = await api.get(`/collaboration/join-requests-by-project/${id}`);
        setRequests(res.data.requests || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setRequests([]);
        } else {
          console.error("Failed to fetch join requests:", err);
          toast.error("Failed to load join requests");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [id]);

  const handleAction = async (requestId, action) => {
    try {
      setActionLoading(true);
      const endpoint =
        action === "accept"
          ? `/collaboration/request/${requestId}/accept`
          : `/collaboration/request/${requestId}/reject`;

      let body = {};
      if (action === "reject") {
        if (!rejectionReason.trim()) {
          toast.error("Please enter a rejection reason.");
          return;
        }
        body = { reason: rejectionReason };
      }

      await api.patch(endpoint, body);
      toast.success(`Request ${action}ed successfully!`);
      setIsModalOpen(false);
      setRejectionReason("");
      setSelectedRequest(null);

      // Refresh data after update
      const res = await api.get(`/collaboration/join-requests-by-project/${id}`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      toast.error(`Failed to ${action} request. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const statusConfig = {
    pending: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      text: "text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: <Clock className="w-4 h-4" />,
    },
    accepted: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
      icon: <UserCheck className="w-4 h-4" />,
    },
    rejected: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 shadow-lg max-w-md">
          <Inbox className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Join Requests
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are no join requests for this project yet.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
        </div>
      </div>
    );

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const acceptedCount = requests.filter(r => r.status === "accepted").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Projects</span>
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Join Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review and manage collaboration requests for this project
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
                    <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{pendingCount}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400">Accepted</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{acceptedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {requests.map((req) => {
            const status = statusConfig[req.status];
            return (
              <div
                key={req._id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {req.name}
                          </h2>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>{req.userEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}
                    >
                      {status.icon}
                      <span className="capitalize">{req.status}</span>
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Requested Role
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {req.role}
                        </p>
                      </div>
                    </div>

                    {req.message && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Message
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                            {req.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {req.status === "rejected" && req.reason && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                            Rejection Reason
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            {req.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {req.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => handleAction(req._id, "accept")}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsModalOpen(true);
                        }}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejection Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                Reject Request
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You are about to reject the join request from{" "}
                <strong className="text-gray-900 dark:text-white">{selectedRequest.name}</strong>.
                Please provide a reason:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 outline-none resize-none transition-all"
                rows={4}
              ></textarea>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
                disabled={actionLoading}
                className="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedRequest._id, "reject")}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Reject Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectJoinRequests;