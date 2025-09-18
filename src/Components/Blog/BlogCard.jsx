import Link from 'next/link';
import React from 'react';

const BlogCard = ({blog}) => {
    return (
          <div className="p-4 rounded-xl shadow hover:shadow-lg transition bg-gradient-to-r from-blue-600 to-purple-500 text-black">
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="rounded-lg mb-3 w-full h-40 object-cover"
      />
      <h2 className="text-xl font-bold">{blog.title}</h2>
      <p className="text-sm text-white">
        By {blog.author} | {blog.date}
      </p>
      <p className="text-gray-300 mt-2">
        {blog.content.slice(0, 100)}...
      </p>
      {/* <Link href={`/blog/${blog._id}`}>
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Read More
        </button>
      </Link> */}
    </div>
    );
};

export default BlogCard;