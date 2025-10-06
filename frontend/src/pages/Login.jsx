import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API || "http://localhost:4000";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("mf_token", data.token);
      localStorage.setItem("email", data.user.email);

      onLogin({ email: data.user.email });
      nav("/");
    } catch (err) {
      console.error(err);
      setError("Server error, try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen relative bg-gradient-to-br from-sky-400 to-indigo-600 overflow-hidden">
      {/* Animated floating shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/20 dark:bg-gray-900/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/40">
        <h2 className="text-2xl font-bold text-white dark:text-sky-400 mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-400 bg-red-100/20 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/50 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-4 text-white/70 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base text-sm transition-all"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full p-4 rounded-xl bg-white/30 dark:bg-gray-800/50 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-4 text-white/70 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base text-sm transition-all"
            >
              Password
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 transition text-white font-semibold disabled:opacity-60"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-white/70">
          Don't have an account?{" "}
          <span
            onClick={() => nav("/register")}
            className="text-sky-200 hover:text-white cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
