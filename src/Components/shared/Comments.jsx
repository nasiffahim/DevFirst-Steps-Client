"use client";
import useAuth from "../.././app/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const Comments = ({ discussionId }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  //  all comment
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
        if (result.isConfirmed) router.push("/login");
      });
      return;
    }
    // add comment
    await axios.post(`http://localhost:5000/api/comments/${discussionId}`, {
      text,
      userEmail: user.email,
      username: user.displayName,
      photoURL: user.photoURL,
      parentId,
    });
    setMessage("");
    setReplyText("");
    setReplyingTo(null);
    fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    if (!user?.email) return; // safety check

    Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      // delete comment
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
          data: { userEmail: user.email }, // pass userEmail for ownership check
        });
        fetchComments();
        Swal.fire("Deleted!", "Your comment has been deleted.", "success");
      }
    });
  };

  return (
    <div className="my-8">
      {/* Comments Header */}
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Comments
      </h3>

      {/* Add Comment Input */}
      <div className="mb-8">
        <input
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment..."
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={() => handleAddComment(null, message)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                       transition-colors duration-200"
          >
            Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="space-y-3">
            {/* Main Comment */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={c.photoURL}
                      alt={c.username}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {c.username}:
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 break-words">
                        {c.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-3 ml-11">
                  <button
                    onClick={() => {
                      if (!user?.email) {
                        Swal.fire({
                          title: "Login Required",
                          text: "You need to log in to reply!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Login Now",
                          cancelButtonText: "Cancel",
                        }).then((result) => {
                          if (result.isConfirmed) router.push("/login");
                        });
                        return;
                      }
                      setReplyingTo(replyingTo === c._id ? null : c._id);
                      setReplyText("");
                    }}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 
                               dark:hover:text-blue-300 transition-colors"
                  >
                    {replyingTo === c._id ? "Cancel" : "Reply"}
                  </button>

                  {user?.email === c.userEmail && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 
                                 dark:hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Input Field */}
              {replyingTo === c._id && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="ml-11">
                    <input
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 placeholder-gray-500 dark:placeholder-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-all text-sm"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddComment(c._id, replyText)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium 
                                   rounded-lg transition-colors duration-200"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  {c.replies.map((r) => (
                    <div
                      key={r._id}
                      className="p-4 ml-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <img
                            className="h-7 w-7 rounded-full object-cover"
                            src={r.photoURL}
                            alt={r.username}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {r.username}:
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 break-words">
                              {r.text}
                            </p>
                          </div>
                        </div>

                        {user?.email === r.userEmail && (
                          <button
                            onClick={() => handleDeleteComment(r._id)}
                            className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 
                                       dark:hover:text-red-300 transition-colors ml-2"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
