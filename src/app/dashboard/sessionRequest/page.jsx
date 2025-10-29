"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  FileText,
  Tags,
  MessageSquare,
  Loader2,
  Calendar,
  Search,
  BookOpen,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function SessionRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all session requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/session-requests", {
        params: {
          email: user?.email,
        },
      });
      // Filter out rejected requests
      const filteredRequests = res.data.filter(
        (req) => req.status !== "rejected"
      );
      setRequests(filteredRequests);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not fetch session requests.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle status change
  const handleStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${status} this session?`,
      text:
        status === "approved"
          ? "This session will be marked as approved."
          : "This session will be rejected and removed from the list.",
      icon: status === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status} it!`,
    });

    if (confirm.isConfirmed) {
      try {
        await api.patch(`/session-requests/${id}`, { status });

        if (user?.email) {
          await api.post("/update-activity", {
            email: user?.email,
            activityType:
              status === "approved" ? "approve-addition" : "reject-addition",
          });
        }

        await Swal.fire({
          icon: "success",
          title:
            status === "approved" ? "Session Approved!" : "Session Rejected!",
          text:
            status === "approved"
              ? "The session has been successfully approved."
              : "The session has been rejected and removed.",
          timer: 1800,
          showConfirmButton: false,
        });

        // Remove rejected request from state immediately
        if (status === "rejected") {
          setRequests((prevRequests) =>
            prevRequests.filter((req) => req._id !== id)
          );
        } else {
          fetchRequests();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Action Failed!",
          text: "Something went wrong. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRequests = requests.filter((req) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      req.title?.toLowerCase().includes(searchLower) ||
      req.description?.toLowerCase().includes(searchLower) ||
      req.skills?.toLowerCase().includes(searchLower) ||
      req.menteeEmail?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading session requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Session Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review and manage mentorship session requests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, description, skills, or email..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Session Requests Table */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No session requests found
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "All requests have been processed"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Title
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Tags className="w-4 h-4" />
                        Skills
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Requested By
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created At
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {req.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {req.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {req.skills}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {req.menteeEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(req.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {req.status === "approved" ? (
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg">
                              <CheckCircle className="w-4 h-4" />
                              Approved
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleStatus(req._id, "approved")
                                }
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                title="Approve session"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatus(req._id, "rejected")
                                }
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                title="Reject session"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((req) => (
                <div key={req._id} className="p-6 space-y-4">
                  {/* Title */}
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Title
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {req.title}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {req.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex items-start gap-3">
                    <Tags className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Skills/Topics
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {req.skills}
                      </p>
                    </div>
                  </div>

                  {/* Requested By & Date */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                          Requested By
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                          {req.menteeEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                          Created At
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(req.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Status:
                    </p>
                    {getStatusBadge(req.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {req.status === "approved" ? (
                      <div className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        Session Approved
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStatus(req._id, "approved")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatus(req._id, "rejected")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
