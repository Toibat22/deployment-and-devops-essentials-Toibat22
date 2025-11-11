import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Logo */}
      <Link className="font-extrabold text-2xl tracking-wide hover:text-pink-400 transition-colors" to="/">
        My Blog
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {!token && (
          <>
            <Link
              to="/login"
              className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}

        {token && (
          <>
            <Link
              to="/"
              className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create-post"
              className="px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            >
              Create Post
            </Link>
            <button
              onClick={logoutUser}
              className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;