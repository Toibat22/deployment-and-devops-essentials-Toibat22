import { useState } from "react";
import { authService } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register({ name, email, password });
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.log(err);
      const error = err?.response?.data?.message || "Registration failed";
      setMessage(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center sm:text-4xl">
          Register
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm sm:text-base text-red-500 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm sm:text-base transition-shadow"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm sm:text-base transition-shadow"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm sm:text-base transition-shadow"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 sm:text-lg"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;