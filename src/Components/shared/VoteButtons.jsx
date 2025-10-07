"use client";
import useAuth from "../../app/hooks/useAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import api from "../../utils/api";

export const VoteButtons = ({ discussionId, initialVotes }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [votes, setVotes] = useState(initialVotes || { up: 0, down: 0 });
  const [userVote, setUserVote] = useState(null);
  const [loadingVote, setLoadingVote] = useState(false);

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!user?.email) return;
      try {
        const res = await api.get(
          `/api/discussions/${discussionId}/vote-status`,
          { params: { userEmail: user.email } }
        );
        setVotes(res.data.votes);
        setUserVote(res.data.userVote);
      } catch (err) {
        console.error("Failed to fetch vote status:", err.message);
      }
    };

    fetchUserVote();
  }, [user?.email, discussionId]);

  const handleVote = async (type) => {
    if (!user?.email) {
      Swal.fire({
        title: "Login Required",
        text: "You must log in to vote!",
        icon: "info",
        confirmButtonText: "Login",
      }).then((res) => {
        if (res.isConfirmed) router.push("/login");
      });
      return;
    }

    if (loadingVote) return;
    setLoadingVote(true);

    try {
      const res = await api.patch(
        `/api/discussions/${discussionId}/vote`,
        {
          type,
          userEmail: user.email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setVotes(res.data.votes);
      setUserVote(res.data.userVote);
    } catch (err) {
      console.error("Vote failed:", err.message);
      Swal.fire({
        title: "Error",
        text: "Failed to submit your vote. Try again!",
        icon: "error",
      });
    } finally {
      setLoadingVote(false);
    }
  };

  const totalVotes = votes.up - votes.down;

  return (
    <div className="flex items-center gap-1">
      {/* Upvote */}
      <button
        onClick={() => handleVote("up")}
        className={`p-1 rounded transition-colors duration-200 ${
          userVote === "up"
            ? "text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        disabled={loadingVote}
        aria-label="Upvote"
      >
        <ArrowBigUp 
          className={`w-5 h-5 ${userVote === "up" ? "fill-current" : ""}`} 
        />
      </button>

      {/* Up Vote */}
      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[2ch] text-center">
        {votes.up}
      </span>

      {/* Downvote */}
      <button
        onClick={() => handleVote("down")}
        className={`p-1 rounded transition-colors duration-200 ${
          userVote === "down"
            ? "text-red-600 dark:text-red-400"
            : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        disabled={loadingVote}
        aria-label="Downvote"
      >
        <ArrowBigDown
          className={`w-5 h-5 ${userVote === "down" ? "fill-current" : ""}`} 
        />
      </button>

      {/* Down Vote */}
      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[2ch] text-center">
        {votes.down}
      </span>
    </div>
  );
};