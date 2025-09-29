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
  const [votes, setVotes] = useState(initialVotes || { up: 0, down: 0 });
  const [userVote, setUserVote] = useState(null); // will fetch on mount
  const router = useRouter();

  // Fetch user vote on mount
  useEffect(() => {
    const fetchUserVote = async () => {
      if (user?.email) {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/discussions/${discussionId}/vote-status?userEmail=${user.email}`
          );
          setUserVote(data.userVote); // "up", "down", or null
        } catch (err) {
          console.error("Failed to fetch user vote:", err.message);
        }
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

    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/discussions/${discussionId}/vote`,
        { type, userEmail: user.email },
        { headers: { "Content-Type": "application/json" } }
      );

      setVotes(data.votes);
      setUserVote(data.userVote);
    } catch (err) {
      console.error("Vote failed:", err.message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote("up")}
        className={`p-2 rounded ${
          userVote === "up" ? "" : "hover:bg-gray-800"
        } transition-all duration-200`}
      >
        {userVote === "up" ? (
          <Image src="/like.png" alt="Like" width={20} height={20} />
        ) : (
          <ThumbsUp className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Vote Count */}
      <span className="font-medium text-white">{votes.up - votes.down}</span>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote("down")}
        className={`p-2 rounded ${
          userVote === "down" ? "" : "hover:bg-gray-800"
        } transition-all duration-200`}
      >
        {userVote === "down" ? (
          <Image src="/dislike.png" alt="Dislike" width={20} height={20} />
        ) : (
          <ThumbsDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};

