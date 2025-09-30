// "use client";
// import { useEffect, useState } from "react";
// import {
//   MessageSquare,
//   Users,
//   TrendingUp,
//   CheckCircle,
//   AlertCircle,
//   Star,
//   MessageCircle,
//   Eye,
//   Clock,
// } from "lucide-react";
// import axios from "axios";
// import useAuth from "../../app/hooks/useAuth";
// import PageViewCount from "react-page-view-count";
// import { Comments } from "../shared/Comments";
// import { VoteButtons } from "../shared/VoteButtons";

// // Main Community Discussions
// export const CommunityDiscussions = () => {
//   const { user } = useAuth();
//   const [discussions, setDiscussions] = useState([]);
//   const [communityStats, setCommunityStats] = useState([]);
//   const [hoveredDiscussion, setHoveredDiscussion] = useState(null);
//   const [commentCounts, setCommentCounts] = useState({}); // store total comment count

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const { data: discussionData } = await axios.get(
//         "http://localhost:5000/api/discussions"
//       );
//       const { data: statsData } = await axios.get(
//         "http://localhost:5000/api/stats"
//       );

//       setDiscussions(discussionData);
//       setCommunityStats(Array.isArray(statsData.stats) ? statsData.stats : []);

//       // Fetch comment counts
//       const countsPromises = discussionData.map(async (d) => {
//         const res = await axios.get(`http://localhost:5000/api/comments/${d._id}`);
//         const comments = res.data || [];
//         const count = comments.reduce(
//           (acc, comment) => acc + 1 + (Array.isArray(comment.replies) ? comment.replies.length : 0),
//           0
//         );
//         return { id: d._id, count };
//       });

//       const countsArray = await Promise.all(countsPromises);
//       const countsObj = {};
//       countsArray.forEach((c) => (countsObj[c.id] = c.count));
//       setCommentCounts(countsObj);

//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchData(); // initial fetch

//   const interval = setInterval(fetchData, 1000); // refresh every 1 second

//   return () => clearInterval(interval); // cleanup on unmount
// }, []);

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "solved":
//         return <CheckCircle className="w-6 h-6 text-green-600" />;
//       case "active":
//         return <AlertCircle className="w-6 h-6 text-blue-600" />;
//       case "featured":
//         return <Star className="w-6 h-6 text-yellow-500" />;
//       default:
//         return <MessageCircle className="w-6 h-6 " />;
//     }
//   };

//   return (
//     <section className="py-20 bg-black text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//   {/* Stats */}
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//   {communityStats.map((stat, index) => {
//     const Icon = { MessageSquare, Users, TrendingUp, CheckCircle }[stat.icon];
//     return (
//       <div
//         key={index}
//         className="rounded-2xl p-6 shadow-sm bg-gray-900 hover:bg-gray-800 transition-all duration-300"
//       >
//         <div className={`inline-flex p-3 rounded-xl mb-4 ${stat.color}`}>
//           {Icon && <Icon className="w-8 h-8 sm:w-10 sm:h-10" />}
//         </div>
//         <div className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</div>
//         <div className="text-sm">{stat.label}</div>
//       </div>
//     );
//   })}
// </div>

// {/* Discussions */}
// <div className="space-y-6 mb-12">
//   {discussions.length > 0 ? (
//     discussions.map((discussion) => (
//       <div
//         key={discussion._id}
//         className={`rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
//           hoveredDiscussion === discussion._id ? "" : "bg-gray-900"
//         }`}
//         onMouseEnter={() => setHoveredDiscussion(discussion._id)}
//         onMouseLeave={() => setHoveredDiscussion(null)}
//       >
//         <div className="p-4 sm:p-6 rounded-xl">
//           {/* Top Row */}
//           <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
//             {/* Avatar */}
//             {discussion.author.avatar ? (
//               <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
//                 <img
//                   src={discussion.author.avatar}
//                   alt="Avatar"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ) : (
//               <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl border-2 border-white shadow-sm">
//                 {discussion.author.username?.charAt(0)}
//               </div>
//             )}

//             {/* Title & preview */}
//             <div className="flex-1">
//               <h3 className="text-base sm:text-lg font-semibold">{discussion.title}</h3>
//               <p className="text-sm sm:text-base text-gray-300 line-clamp-3">{discussion.preview}</p>
//             </div>

//             {/* Status */}
//             <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 mt-2 sm:mt-0">
//               {getStatusIcon(discussion.status)}
//               <span className="text-xs sm:text-sm">{discussion.status}</span>
//             </div>
//           </div>

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             <span className="px-3 py-1 rounded-full text-xs bg-blue-600">
//               {discussion.category}
//             </span>
//             {discussion.tags.map((tag, idx) => (
//               <span key={idx} className="px-3 py-1 rounded-full text-xs bg-gray-700">
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Metrics */}
//           <div className="flex flex-wrap gap-4 items-center text-xs sm:text-sm mb-4">
//             <VoteButtons
//               discussionId={discussion._id}
//               initialVotes={discussion.votes}
//               initialUserVote={discussion.userVote}
//             />

//             <div className="flex items-center gap-1">
//               <MessageCircle className="w-4 h-4" />
//               <span>{commentCounts[discussion._id] || 0} replies</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <Eye className="w-4 h-4" />
//               <PageViewCount id={discussion._id} type="discussion" />
//             </div>

//             <div className="flex items-center gap-1">
//               <Clock className="w-4 h-4" />
//               <span>
//                 {new Date(discussion.timestamp).toLocaleString("en-US", {
//                   dateStyle: "medium",
//                   timeStyle: "short",
//                 })}
//               </span>
//             </div>
//           </div>

//           {/* Comments */}
//           <Comments discussionId={discussion._id} />
//         </div>
//       </div>
//     ))
//   ) : (
//     <p className="text-center text-gray-400">No discussions found</p>
//   )}
// </div>
//       </div>
//     </section>
//   );
// };
"use client";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Star,
  MessageCircle,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import useAuth from "../../app/hooks/useAuth";
import PageViewCount from "react-page-view-count";
import { Comments } from "../shared/Comments";
import { VoteButtons } from "../shared/VoteButtons";

// Main Community Discussions
export const CommunityDiscussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [hoveredDiscussion, setHoveredDiscussion] = useState(null);
  const [commentCounts, setCommentCounts] = useState({}); // store total comment count

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: discussionData } = await axios.get(
          "http://localhost:5000/api/discussions"
        );
        setDiscussions(discussionData);

        // Fetch comment counts
        const countsPromises = discussionData.map(async (d) => {
          const res = await axios.get(
            `http://localhost:5000/api/comments/${d._id}`
          );
          const comments = res.data || [];
          const count = comments.reduce(
            (acc, comment) =>
              acc + 1 + (Array.isArray(comment.replies) ? comment.replies.length : 0),
            0
          );
          return { id: d._id, count };
        });

        const countsArray = await Promise.all(countsPromises);
        const countsObj = {};
        countsArray.forEach((c) => (countsObj[c.id] = c.count));
        setCommentCounts(countsObj);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 1000); // refresh every 1 second
    return () => clearInterval(interval); // cleanup
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "active":
        return <AlertCircle className="w-6 h-6 text-blue-600" />;
      case "featured":
        return <Star className="w-6 h-6 text-yellow-500" />;
      default:
        return <MessageCircle className="w-6 h-6 " />;
    }
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ Stats moved into its own component */}
       

        {/* Discussions */}
        <div className="space-y-6 mb-12">
          {discussions.length > 0 ? (
            discussions.map((discussion) => (
              <div
                key={discussion._id}
                className={`rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  hoveredDiscussion === discussion._id ? "" : "bg-gray-900"
                }`}
                onMouseEnter={() => setHoveredDiscussion(discussion._id)}
                onMouseLeave={() => setHoveredDiscussion(null)}
              >
                <div className="p-4 sm:p-6 rounded-xl">
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                    {/* Avatar */}
                    {discussion.author.avatar ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                        <img
                          src={discussion.author.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl border-2 border-white shadow-sm">
                        {discussion.author.username?.charAt(0)}
                      </div>
                    )}

                    {/* Title & preview */}
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold">
                        {discussion.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 line-clamp-3">
                        {discussion.preview}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 mt-2 sm:mt-0">
                      {getStatusIcon(discussion.status)}
                      <span className="text-xs sm:text-sm">{discussion.status}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-600">
                      {discussion.category}
                    </span>
                    {discussion.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs bg-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-4 items-center text-xs sm:text-sm mb-4">
                    <VoteButtons
                      discussionId={discussion._id}
                      initialVotes={discussion.votes}
                      initialUserVote={discussion.userVote}
                    />

                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{commentCounts[discussion._id] || 0} replies</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <PageViewCount id={discussion._id} type="discussion" />
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(discussion.timestamp).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Comments */}
                  <Comments discussionId={discussion._id} />
                </div>
              </div>
            ))

          ) : (
            <p className="text-center text-gray-400">No discussions found</p>
          )}
        </div>
      </div>
    </section>
  );
};
