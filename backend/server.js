require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resumes");
const cors = require("cors");

connectDB();
const app = express();

app.use(cors({
    origin: 'https://resumebuilder-frontend-sf15.onrender.com', 
    credentials: true 
  }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
