import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    setMenuOpen(false); // close menu on logout
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left side brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:scale-105 transform transition"
        >
          Resume<span className="text-yellow-300">Platform</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6 text-lg">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-300 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow hover:bg-yellow-300 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 flex flex-col items-center text-lg">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-center bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center hover:text-yellow-300 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow hover:bg-yellow-300 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
