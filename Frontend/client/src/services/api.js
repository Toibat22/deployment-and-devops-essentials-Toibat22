// api.js - API service for making requests to the backend
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Correctly use template literal
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handles expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Post API Services
export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    const response = await api.get(url);
    return response.data;
  },

  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Create Post (supports image upload)
  createPost: async (formData) => {
    const response = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update Post (supports replacing image)
  updatePost: async (id, formData) => {
    const response = await api.put(`/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete Post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Add Comment
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}`/comments, commentData);
    return response.data;
  },

  // Search Posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return response.data;
  },

  // Get Posts of Logged-in User
  getMyPosts: async () => {
    const response = await api.get("/posts/my-posts");
    return response.data;
  },
};

// Category API Services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },
};

// Auth API Services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default api;