import React from 'react';
import BlogCard from './BlogCard';
const blogs = [
  {
    _id: "1",
    title: "How to Start Contributing to Open Source",
    author: "Admin",
    date: "2025-09-16",
    content: "Open source contribution is a great way to learn...",
    thumbnail: "https://i.ibb.co.com/d4HftJKf/Howto-Get-Started-With-Open-Source-Contribution.png"
  },
  {
    _id: "2",
    title: "Top 10 Beginner Friendly Repos",
    author: "Hasan",
    date: "2025-09-12",
    content: "Here is a curated list of GitHub repos...",
    thumbnail: "https://i.ibb.co.com/h1BJ36Yz/images-3.jpg"
  },
  {
    _id: "3",
    title: "Why You Should Contribute to Open Source",
    author: "Guest Writer",
    date: "2025-09-10",
    content: "Contributing to open source not only helps projects...",
    thumbnail: "https://i.ibb.co.com/Q7LWJmSW/download-7.jpg"
  }
];

const BlogPage = () => {
    return (
         <div className='bg-gradient-to-r min-h-[80vh] from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% pt-32 pb-16'>
            <h2 className='text-center text-3xl font-bold'>Blogs</h2>
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
         </div>
    );
};

export default BlogPage;