const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// --- Create uploads folders if missing ---
const uploadDirs = [
  "uploads",
  "uploads/educationImages",
  "uploads/programs",
  "uploads/sulabh",
  "uploads/hero",
  "uploads/home",
];
uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
});

const auth = require("./routes/auth");
const members = require("./routes/members");
const blogs = require("./routes/blogs");
const educationImg = require("./routes/educationImages");
const events = require("./routes/eventRoute");
const mediaTestimonialRoutes = require("./routes/mediaTestimonialRoutes");
const screenshotRoutes = require("./routes/screenshotRouter");
const videoTestimonialRoutes = require("./routes/videoTestimonialRoute");
const programRoutes = require("./routes/programRoutes");
const partnerRoutes = require("./routes/partnerRoute");
const sulabhRoutes = require("./routes/sulabhRoutes");
const heroImageRoutes = require("./routes/heroImageRoutes");
const homeRoutes = require("./routes/homeRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS Configuration
app.use(
  cors({
    origin: [
      "https://sharadatrust.org",
      "https://www.sharadatrust.org",
      "https://sharadatrust.in",
      "https://www.sharadatrust.in",
      "http://localhost:5173",
      "https://ngo-internship.vercel.app",
    ],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", auth);
app.use("/api/members", members);
app.use("/api/blogs", blogs);
app.use("/api/education-images", educationImg);
app.use("/api/events", events);
app.use("/api/media", mediaTestimonialRoutes);
app.use("/api/screenshots", screenshotRoutes);
app.use("/api/videos", videoTestimonialRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/sulabh", sulabhRoutes);
app.use("/api/hero-images", heroImageRoutes);
app.use("/api/home", homeRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
