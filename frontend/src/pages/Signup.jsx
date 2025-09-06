import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      console.log(res);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href="/"
        // navigate("/");
      } else if (res.data.success) {
        alert(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong, please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),url('/images/photo-1503264116251-35a269479413.avif')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
          ✨ Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="border border-white/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border border-white/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border border-white/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-4 py-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition transform"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-200 mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-300 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}


