"use client";
import useAuth from "../../app/hooks/useAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ThumbsUp, ThumbsDown } from "lucide-react";

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
        const res = await axios.get(
          `http://localhost:5000/api/discussions/${discussionId}/vote-status`,
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
      const res = await axios.patch(
        `http://localhost:5000/api/discussions/${discussionId}/vote`,
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

  return (
    <div className="flex items-center gap-2">
      {/* Upvote */}
      <button
        onClick={() => handleVote("up")}
        className={`p-2 rounded transition-all duration-200 ${
          userVote === "up"
            ? "bg-green-500 text-white"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        disabled={loadingVote}
      >
        {userVote === "up" ? (
          <Image src="/like.png" alt="Like" width={20} height={20} />
        ) : (
          <ThumbsUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Vote Count */}
      <span className="font-medium text-gray-800 dark:text-gray-200 pr-2">{votes.up}</span>
      <span className="font-medium text-gray-800 dark:text-gray-200">{votes.down}</span>

      {/* Downvote */}
      <button
        onClick={() => handleVote("down")}
        className={`p-2 rounded transition-all duration-200 ${
          userVote === "down"
            ? "bg-red-500 text-white"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        disabled={loadingVote}
      >
        {userVote === "down" ? (
          <Image src="/dislike.png" alt="Dislike" width={20} height={20} />
        ) : (
          <ThumbsDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
};
