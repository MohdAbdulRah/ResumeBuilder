import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
      // navigate("/");
    } catch (err) {
      alert("Invalid credentials, please try again!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/photo-1503264116251-35a269479413.avif')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
          🔐 Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border border-white/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border border-white/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-4 py-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition transform"
        >
          Login
        </button>

        <p className="text-center text-gray-200 mt-6 text-sm sm:text-base">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-300 font-semibold cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}
