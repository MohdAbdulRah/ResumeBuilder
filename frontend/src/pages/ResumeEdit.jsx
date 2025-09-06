import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";

export default function ResumeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);

  // 🟢 Fetch resume by id
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get(`/resumes/${id}`);
        setResume(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load resume");
      }
    };
    fetchResume();
  }, [id]);

  if (!resume) return <p className="p-6">Loading...</p>;

  // 🟢 Handlers
  const handleChange = (section, field, value, index = null) => {
    if (Array.isArray(resume[section])) {
      setResume({
        ...resume,
        [section]: resume[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      });
    } else {
      setResume({
        ...resume,
        [section]: { ...resume[section], [field]: value },
      });
    }
  };

  const handleSkillsChange = (value) => {
    setResume({ ...resume, skills: value.split(",") });
  };

  const addField = (section, newObj) => {
    setResume({ ...resume, [section]: [...resume[section], newObj] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/resumes/${id}`, resume);
      alert("✅ Resume updated successfully!");
      navigate(`/resume/${id}`);
    } catch (err) {
      alert("❌ Failed to update resume");
      console.error(err);
    }
  };

  const downloadPDF = () => {
    if (!resume) return;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(resume.personal.fullName, 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(
      `${resume.personal.email} | ${resume.personal.phone} | ${resume.personal.address}`,
      105,
      30,
      { align: "center" }
    );

    doc.setTextColor(0, 0, 0);
    let y = 50;

    const addSection = (title) => {
      doc.setFillColor(41, 128, 185);
      doc.rect(20, y - 6, 170, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(title, 25, y);
      doc.setTextColor(0, 0, 0);
      y += 10;
    };

    // Education
    addSection("Education");
    resume.education.forEach((edu) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`${edu.degree} - ${edu.institute} (${edu.year})`, 25, y);
      y += 7;
    });
    y += 5;

    // Experience
    addSection("Experience");
    resume.experience.forEach((exp) => {
      doc.text(`${exp.title} at ${exp.company} (${exp.years} years)`, 25, y);
      y += 7;
    });
    y += 5;

    // Projects
    addSection("Projects");
    resume.projects.forEach((proj) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 128, 185);
      doc.text(`• ${proj.title}`, 25, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      let descLines = doc.splitTextToSize(proj.description, 160);
      doc.text(descLines, 30, y);
      y += descLines.length * 6;

      if (proj.urls) {
        doc.setTextColor(0, 102, 204);
        doc.textWithLink(proj.urls, 30, y, { url: proj.urls });
        y += 8;
      }
      y += 5;
    });

    // Skills
    addSection("Skills");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(resume.skills.join(", "), 25, y);

    doc.save(`${resume.personal.fullName || "resume"}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6 pt-20">
      <h1 className="text-2xl font-bold mb-4 text-center">✏️ Edit Resume</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal */}
        <h2 className="text-lg font-semibold">Personal Info</h2>
        <input
          placeholder="Full Name"
          value={resume.personal.fullName}
          onChange={(e) => handleChange("personal", "fullName", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Email"
          value={resume.personal.email}
          onChange={(e) => handleChange("personal", "email", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Phone"
          value={resume.personal.phone}
          onChange={(e) => handleChange("personal", "phone", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Address"
          value={resume.personal.address}
          onChange={(e) => handleChange("personal", "address", e.target.value)}
          className="border p-2 w-full"
        />

        {/* Skills */}
        <h2 className="text-lg font-semibold">Skills</h2>
        <input
          placeholder="Comma separated skills"
          value={resume.skills.join(",")}
          onChange={(e) => handleSkillsChange(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Education */}
        <h2 className="text-lg font-semibold">Education</h2>
        {resume.education.map((edu, i) => (
          <div key={i} className="space-y-2 border p-3 rounded">
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) =>
                handleChange("education", "degree", e.target.value, i)
              }
              className="border p-2 w-full"
            />
            <input
              placeholder="Institute"
              value={edu.institute}
              onChange={(e) =>
                handleChange("education", "institute", e.target.value, i)
              }
              className="border p-2 w-full"
            />
            <input
              placeholder="Year"
              value={edu.year}
              onChange={(e) =>
                handleChange("education", "year", e.target.value, i)
              }
              className="border p-2 w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addField("education", { degree: "", institute: "", year: "" })
          }
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          ➕ Add Education
        </button>

        {/* Experience */}
        <h2 className="text-lg font-semibold">Experience</h2>
        {resume.experience.map((exp, i) => (
          <div key={i} className="space-y-2 border p-3 rounded">
            <input
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) =>
                handleChange("experience", "title", e.target.value, i)
              }
              className="border p-2 w-full"
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) =>
                handleChange("experience", "company", e.target.value, i)
              }
              className="border p-2 w-full"
            />
            <input
              placeholder="Years"
              value={exp.years}
              onChange={(e) =>
                handleChange("experience", "years", e.target.value, i)
              }
              className="border p-2 w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addField("experience", { title: "", company: "", years: "" })
          }
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          ➕ Add Experience
        </button>

        {/* Projects */}
        <h2 className="text-lg font-semibold">Projects</h2>
        {resume.projects?.map((proj, i) => (
          <div key={i} className="space-y-2 border p-3 rounded">
            <input
              placeholder="Title"
              value={proj.title}
              onChange={(e) =>
                handleChange("projects", "title", e.target.value, i)
              }
              className="border p-2 w-full"
            />
            <textarea
              placeholder="Description"
              value={proj.description}
              onChange={(e) =>
                handleChange("projects", "description", e.target.value, i)
              }
              className="border p-2 w-full"
            />
            <input
              placeholder="URL"
              value={proj.urls}
              onChange={(e) =>
                handleChange("projects", "urls", e.target.value, i)
              }
              className="border p-2 w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addField("projects", { title: "", description: "", urls: "" })
          }
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          ➕ Add Project
        </button>

        {/* Submit + Download */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ⬇️ Download PDF
          </button>
        </div>
      </form>
    </div>
  );
}

