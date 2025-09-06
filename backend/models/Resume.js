const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  personal: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
  },
  education: [{ degree: String, institute: String, year: String }],
  experience: [{ title: String, company: String, years: String }],
  projects: [{ title: String, description: String, urls: String }],
  skills: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);
