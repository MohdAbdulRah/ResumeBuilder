const express = require("express");
const { createResume, getResumes, updateResume, deleteResume, getResumeById } = require("../controllers/resumeController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getResumes).post(protect, createResume);
router.route("/:id")
.get(protect,getResumeById)
.put(protect, updateResume).delete(protect, deleteResume);

module.exports = router;
