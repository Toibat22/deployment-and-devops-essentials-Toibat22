// src/pages/PostDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts/${id}')
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">Post not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
        <p className="text-gray-700 mb-6">{post.content}</p>
        <Link
          to="/"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}

export default PostDetails;