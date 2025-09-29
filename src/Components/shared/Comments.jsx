"use client"
import useAuth from "../.././app/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
//  Component 
export const Comments = ({ discussionId }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
 const router = useRouter();
  const fetchComments = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/comments/${discussionId}`
    );
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  const handleAddComment = async (parentId = null, text) => {
    if (!text) return;
    if (!user?.email) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to comment!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed)   router.push("/login"); //  client-side navigation
      });
      return;
    }
    await axios.post(`http://localhost:5000/api/comments/${discussionId}`, {
      text,
      userEmail: user?.email,
      username: user?.displayName,
      parentId,
    });
    setMessage("");
    fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
        fetchComments();
        Swal.fire("Deleted!", "Your comment has been deleted.", "success");
      }
    });
  };
// console.log(comments);

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={() => handleAddComment(null, message)}
          className=" text-white px-4 rounded"
        >
          Comment
        </button>
      </div>
      {comments.map((c) => (
        <div key={c._id} className="ml-0 mb-2">
          <div className="  p-2 rounded mb-1 flex justify-between items-center">
            <div>
              <span className="font-medium"> {c.username}:</span> {c.text}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Reply",
                    input: "text",
                    inputPlaceholder: "Write your reply...",
                    showCancelButton: true,
                    confirmButtonText: "Send",
                  }).then((result) => {
                    if (result.isConfirmed && result.value) {
                      handleAddComment(c._id, result.value);
                    }
                  });
                }}
                className=" text-blue-600"
              >
                Reply
              </button>
              <button
                onClick={() => handleDeleteComment(c._id)}
                className=" text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          {c.replies?.map((r) => (
            <div
              key={r._id}
              className="ml-6  p-2 rounded mb-1 flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{r.userEmail}:</span> {r.text}
              </div>
              <button
                onClick={() => handleDeleteComment(r._id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};