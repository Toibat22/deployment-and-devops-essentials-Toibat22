import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postService } from "../services/api";

const DeletePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await postService.getPostById(id);
      setPost(data);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    await postService.deletePost(id);
    navigate("/posts"); // go back to posts list
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Delete Post</h2>
      <p className="mb-4">Are you sure you want to delete this post?</p>
      <h3 className="font-semibold">{post.title}</h3>
      <p className="mb-6">{post.content}</p>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/posts")}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeletePost;