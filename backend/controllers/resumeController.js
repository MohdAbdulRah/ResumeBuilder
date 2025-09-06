const Resume = require("../models/Resume");

exports.createResume = async (req, res) => {
  const resume = await Resume.create({ ...req.body, user: req.user._id });
  res.status(201).json(resume);
};

exports.getResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id });
  res.json(resumes);
};

exports.updateResume = async (req, res) => {
  const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(resume);
};

exports.deleteResume = async (req, res) => {
  await Resume.findByIdAndDelete(req.params.id);
  res.json({ message: "Resume deleted" });
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate("user", "name email");

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // Ensure user is authorized
    if (resume.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
