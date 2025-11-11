import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search
  const [search, setSearch] = useState("");

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts?page=${page}&limit=6&search=${search}`
      );

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch posts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete posts.");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post._id !== id));
      alert(response.data.message);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-medium animate-pulse">Loading posts...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Blog Posts</h1>
        <Link
          to="/create-post"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Create Post
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
      </div>

      {/* Tag filter display */}
      {selectedTag && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-700">Filtering by:</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            #{selectedTag}
          </span>
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={() => setSelectedTag("")}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <p className="text-gray-600">
          {selectedTag
            ? `No posts found for #${selectedTag}`
            : "No posts found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

{filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 border border-gray-100"
            >
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <Link to={`/post/${post._id}`}>
                <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 mt-2">
                {post.content.slice(0, 120)}...
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags?.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/post/${post._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read more →
                </Link>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-5 py-2 rounded-lg shadow ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          ← Prev
        </button>

        <span className="font-semibold text-gray-800">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-5 py-2 rounded-lg shadow ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Home;