import { useEffect, useState } from "react";
import { postService, categoryService } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]); // now an array of tags
  const [tagInput, setTagInput] = useState(""); // for typing new tags
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    loadCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Add a tag when pressing Enter or comma
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("author", userId);
      formData.append("tags", tags.join(",")); // send as comma-separated
      if (image) {
        formData.append("image", image);
      }

      await postService.createPost(formData);
      alert("Post created!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center sm:text-4xl">
          Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-shadow sm:text-base"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            placeholder="Post Content"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-shadow resize-none sm:text-base"
          />

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-shadow bg-white sm:text-base"
>
              <option value="">Select Category</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {/* Tags Input */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type tag and press Enter"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm sm:text-base"
            />
          </div>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm cursor-pointer transition-shadow sm:text-base"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3">
              <p className="text-gray-700 font-semibold mb-1">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 sm:text-lg"
          >
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;