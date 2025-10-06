import { useState } from "react";

export default function AuthForm({ onLogin }) {
  const [tab, setTab] = useState("login"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API || "http://localhost:4000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (tab === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        onLogin(data);
      } else {
        alert("Registration successful! Please login.");
        setTab("login");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, try again later");
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg text-black dark:text-white">
      {/* Tabs */}
      <div className="flex justify-around mb-6">
        <button
          className={`py-2 px-4 rounded-lg ${tab === "login" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-800"}`}
          onClick={() => { setTab("login"); setError(""); }}
        >
          Login
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${tab === "register" ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-800"}`}
          onClick={() => { setTab("register"); setError(""); }}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {tab === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
