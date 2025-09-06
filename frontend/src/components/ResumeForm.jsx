import React, { useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";

export default function ResumeForm({ onSave }) {
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [education, setEducation] = useState([
    { degree: "", institute: "", year: "" },
  ]);

  const [experience, setExperience] = useState([
    { title: "", company: "", years: "" },
  ]);

  const [projects, setProjects] = useState([
    { title: "", description: "", urls: "" },
  ]);

  const [skills, setSkills] = useState([""]);

  // ---- Handlers ----
  const handlePersonalChange = (e) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (i, e) => {
    const newEdu = [...education];
    newEdu[i][e.target.name] = e.target.value;
    setEducation(newEdu);
  };
  const addEducation = () => {
    setEducation([...education, { degree: "", institute: "", year: "" }]);
  };

  const handleExperienceChange = (i, e) => {
    const newExp = [...experience];
    newExp[i][e.target.name] = e.target.value;
    setExperience(newExp);
  };
  const addExperience = () => {
    setExperience([...experience, { title: "", company: "", years: "" }]);
  };

  const handleProjectChange = (i, e) => {
    const newProjects = [...projects];
    newProjects[i][e.target.name] = e.target.value;
    setProjects(newProjects);
  };
  const addProject = () => {
    setProjects([...projects, { title: "", description: "", urls: "" }]);
  };

  const handleSkillChange = (i, value) => {
    const newSkills = [...skills];
    newSkills[i] = value;
    setSkills(newSkills);
  };
  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const resume = { personal, education, experience, projects, skills };
    const res = await API.post("/resumes", resume);
    onSave(res.data);
    alert("✅ Resume saved successfully!");

    // Reset
    setPersonal({ fullName: "", email: "", phone: "", address: "" });
    setEducation([{ degree: "", institute: "", year: "" }]);
    setExperience([{ title: "", company: "", years: "" }]);
    setProjects([{ title: "", description: "", urls: "" }]);
    setSkills([""]);
  };

  // ---- PDF ----
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(personal.fullName || "Your Name", 105, 20, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${personal.email} | ${personal.phone} | ${personal.address}`,
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
    education.forEach((edu) => {
      doc.text(`${edu.degree} - ${edu.institute} (${edu.year})`, 25, y);
      y += 7;
    });
    y += 5;

    // Experience
    addSection("Experience");
    experience.forEach((exp) => {
      doc.text(`${exp.title} at ${exp.company} (${exp.years} years)`, 25, y);
      y += 7;
    });
    y += 5;

    // Projects
addSection("Projects");
projects.forEach((proj) => {
  // Project Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 128, 185); // blue
  doc.setFontSize(12);
  doc.text(`• ${proj.title}`, 25, y);
  y += 6;

  // Description (multi-line wrap)
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  let descriptionLines = doc.splitTextToSize(proj.description, 160);
  doc.text(descriptionLines, 30, y);
  y += descriptionLines.length * 6;

  // URL
  if (proj.urls) {
    doc.setTextColor(0, 102, 204); // hyperlink blue
    doc.setFontSize(10);
    doc.textWithLink(proj.urls, 30, y, { url: proj.urls });
    y += 8;
  }

  // spacing between projects
  y += 5;
});


    // Skills
    addSection("Skills");
    doc.text(skills.filter(Boolean).join(", "), 25, y);

    doc.save(`${personal.fullName || "resume"}.pdf`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Personal Details */}
      <div>
        <h2 className="text-xl font-bold">👤 Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="fullName"
            placeholder="Full Name"
            value={personal.fullName}
            onChange={handlePersonalChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="email"
            placeholder="Email"
            value={personal.email}
            onChange={handlePersonalChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={personal.phone}
            onChange={handlePersonalChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="address"
            placeholder="Address"
            value={personal.address}
            onChange={handlePersonalChange}
            className="border p-2 w-full mb-2"
          />
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-bold">🎓 Education</h2>
        {education.map((edu, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-2"
          >
            <input
              name="degree"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(i, e)}
              className="border p-2"
            />
            <input
              name="institute"
              placeholder="Institute"
              value={edu.institute}
              onChange={(e) => handleEducationChange(i, e)}
              className="border p-2"
            />
            <input
              name="year"
              placeholder="Year"
              value={edu.year}
              onChange={(e) => handleEducationChange(i, e)}
              className="border p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          ➕ Add Education
        </button>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-bold">💼 Experience</h2>
        {experience.map((exp, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-2"
          >
            <input
              name="title"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => handleExperienceChange(i, e)}
              className="border p-2"
            />
            <input
              name="company"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleExperienceChange(i, e)}
              className="border p-2"
            />
            <input
              name="years"
              placeholder="Years"
              value={exp.years}
              onChange={(e) => handleExperienceChange(i, e)}
              className="border p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          ➕ Add Experience
        </button>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-bold">📂 Projects</h2>
        {projects.map((proj, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2"
          >
            <input
              name="title"
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => handleProjectChange(i, e)}
              className="border p-2"
            />
            <input
              name="description"
              placeholder="Description"
              value={proj.description}
              onChange={(e) => handleProjectChange(i, e)}
              className="border p-2"
            />
            <input
              name="urls"
              placeholder="Project URL"
              value={proj.urls}
              onChange={(e) => handleProjectChange(i, e)}
              className="border p-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addProject}
          className="bg-orange-500 text-white px-3 py-1 rounded"
        >
          ➕ Add Project
        </button>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-bold">🛠 Skills</h2>
        {skills.map((skill, i) => (
          <input
            key={i}
            placeholder="Skill"
            value={skill}
            onChange={(e) => handleSkillChange(i, e.target.value)}
            className="border p-2 w-full mb-2"
          />
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="bg-purple-500 text-white px-3 py-1 rounded"
        >
          ➕ Add Skill
        </button>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Save Resume
        </button>
        <button
          type="button"
          onClick={downloadPDF}
          className="bg-green-600 text-white p-2 rounded w-full"
        >
          Download PDF
        </button>
      </div>
    </form>
  );
}

