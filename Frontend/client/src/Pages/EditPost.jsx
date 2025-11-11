import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postService, categoryService } from "../services/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats || []);

        const p = await postService.getPost(id);
        const post = p.post || p;

        setTitle(post.title || "");
        setContent(post.content || "");
        setFeaturedImage(post.featuredImage || "");
        setCategory(post.category?._id || post.category || "");
        setTags(Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || ""));
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
    formData.append("tags", tagsArray.join(","));

    // If user selected new image, send file, else keep old one
    if (newImage) {
      formData.append("featuredImage", newImage);
    } else {
      formData.append("featuredImage", "featuredImage");
    }

    try {
      await postService.updatePost(id, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading post...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="border w-full p-2" required />
        </div>

        <div>
          <label className="block font-medium">Content</label>
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={8} className="border w-full p-2" required />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border w-full p-2" required>
            <option value="">Select category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input value={tags} onChange={(e)=>setTags(e.target.value)} className="border w-full p-2" placeholder="tech, education" />
        </div>

        <div>
          <label className="block font-medium">Current Image</label>
          {featuredImage && (
            <img src={featuredImage} alt="Current" className="w-40 h-40 object-cover rounded mb-2" />
          )}

          <label className="block font-medium mt-2">Upload New Image</label>
          <input type="file" accept="image/*" onChange={(e)=>setNewImage(e.target.files[0])} />
        </div>

<button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}