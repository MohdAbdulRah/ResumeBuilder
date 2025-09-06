import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResumeForm from "../components/ResumeForm";
import API from "../services/api";

export default function Home() {
  const [resumes, setResumes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login state
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resumes");
      setResumes(res.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchResumes();
    }
  }, [isLoggedIn]);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/photo-1503264116251-35a269479413.avif')",
      }}
    >
      <div className="max-w-6xl w-full mx-auto p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg ">
          📄 Resume Dashboard
        </h1>

        {isLoggedIn ? (
          <>
            {/* Resume Form */}
            <div className="bg-white/50 shadow-xl rounded-2xl p-6 mb-10 hover:shadow-2xl transition">
              <h2 className="text-xl font-semibold mb-4 text-yellow-500">
                ✍️ Create a New Resume
              </h2>
              <ResumeForm
                onSave={(resume) => setResumes([...resumes, resume])}
              />
            </div>

            {/* Saved Resumes */}
            <div className="bg-white/80 shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                📂 Your Saved Resumes
              </h2>
              {resumes.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((r) => (
  <div
    key={r._id}
    className="cursor-pointer border border-gray-200 rounded-xl p-6 bg-white/70 
               hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 
               transition transform hover:scale-105 shadow-md hover:shadow-xl"
  >
    <p className="font-bold text-lg text-gray-900">{r.personal.fullName}</p>
    <p className="text-sm text-gray-700 mt-1">{r.personal.email}</p>
    <p className="text-sm text-gray-700">{r.personal.phone}</p>

    <div className="flex gap-3 mt-4">
      {/* View Resume Button */}
      <button
        onClick={() => navigate(`/resume/${r._id}`)}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700"
      >
        View Resume
      </button>

      {/* Delete Resume Button */}
      <button
        onClick={async (e) => {
          e.stopPropagation(); // prevent navigate click
          if (window.confirm("Are you sure you want to delete this resume?")) {
            try {
              await API.delete(`/resumes/${r._id}`);
              alert("✅ Resume deleted successfully!");
              // Refresh list after deletion
              setResumes(resumes.filter((item) => item._id !== r._id));
            } catch (err) {
              alert("❌ Failed to delete resume");
              console.error(err);
            }
          }
        }}
        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>
))}

                </div>
              ) : (
                <p className="text-gray-700">No resumes saved yet.</p>
              )}
            </div>
          </>
        ) : (
          // If not logged in
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="mb-6 text-2xl text-white font-semibold drop-shadow">
              🚀 Please log in to create and manage your resumes.
            </p>
            <div className="space-x-6">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
