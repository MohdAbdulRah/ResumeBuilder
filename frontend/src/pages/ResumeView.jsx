import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";

export default function ResumeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get(`/resumes/${id}`);
        setResume(res.data);
      } catch (err) {
        console.error(err);
        alert("Error loading resume");
      }
    };
    fetchResume();
  }, [id]);

  // ---- Download PDF ----
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

  if (!resume) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">{resume.personal.fullName}</h1>
        <p className="mt-2">{resume.personal.email} | {resume.personal.phone}</p>
        <p>{resume.personal.address}</p>
      </div>

      {/* Education */}
      <section className="mt-6">
        <h2 className="text-xl font-bold border-b-2 border-blue-600 pb-1">🎓 Education</h2>
        {resume.education.map((edu, i) => (
          <p key={i} className="mt-2">{edu.degree} - {edu.institute} ({edu.year})</p>
        ))}
      </section>

      {/* Experience */}
      <section className="mt-6">
        <h2 className="text-xl font-bold border-b-2 border-green-600 pb-1">💼 Experience</h2>
        {resume.experience.map((exp, i) => (
          <p key={i} className="mt-2">{exp.title} at {exp.company} ({exp.years} years)</p>
        ))}
      </section>

 {/* Projects */}
<section className="mt-6">
  <h2 className="text-xl font-bold border-b-2 border-purple-600 pb-1">📂 Projects</h2>
  {resume.projects.map((proj, i) => (
    <div key={i} className="mt-3">
      <h3 className="font-semibold text-blue-700">{proj.title}</h3>
      <p className="whitespace-pre-line break-words text-gray-700 leading-relaxed">
        {proj.description}
      </p>
      {proj.urls && (
        <a
          href={proj.urls}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-sm break-words"
        >
          {proj.urls}
        </a>
      )}
    </div>
  ))}
</section>



      {/* Skills */}
      <section className="mt-6">
        <h2 className="text-xl font-bold border-b-2 border-pink-600 pb-1">🛠 Skills</h2>
        <p className="mt-2">{resume.skills.join(", ")}</p>
      </section>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate(`/resume/edit/${resume._id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          ✏️ Edit
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Download PDF
        </button>
      </div>
    </div>
  );
}
