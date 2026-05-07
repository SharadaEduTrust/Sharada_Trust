const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getHomeData, updateHomeData } = require("../controllers/homeController");
const { protect } = require("../middleware/auth");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/home/");
  },
  filename: function (req, file, cb) {
    cb(null, `home-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get("/", getHomeData);

router.put(
  "/",
  protect,
  upload.any(),
  updateHomeData
);

module.exports = router;
