const HomeData = require("../models/HomeData");
const fs = require("fs");
const path = require("path");

// @desc    Get Home Data
// @route   GET /api/home
const getHomeData = async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (!homeData) {
      // Create default if not exists
      homeData = await HomeData.create({});
    }
    res.json({ success: true, data: homeData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Home Data
// @route   PUT /api/home
const updateHomeData = async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (!homeData) {
      homeData = new HomeData({});
    }

    const {
      hero,
      education,
      flagshipPrograms,
      volunteer,
      donation
    } = req.body;

    // Parse JSON strings if they come from FormData
    const parsedHero = typeof hero === 'string' ? JSON.parse(hero) : hero;
    const parsedEducation = typeof education === 'string' ? JSON.parse(education) : education;
    const parsedFlagshipPrograms = typeof flagshipPrograms === 'string' ? JSON.parse(flagshipPrograms) : flagshipPrograms;
    const parsedVolunteer = typeof volunteer === 'string' ? JSON.parse(volunteer) : volunteer;
    const parsedDonation = typeof donation === 'string' ? JSON.parse(donation) : donation;

    // Handle Image Deletion for replacement
    const deleteOldImage = (oldPath) => {
      if (oldPath) {
        const fullPath = path.join(__dirname, "..", oldPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    };

    // Update Text Data
    if (parsedHero) {
        homeData.hero = { ...homeData.hero, ...parsedHero };
    }
    
    if (parsedEducation) {
        if (parsedEducation.hashtag !== undefined) homeData.education.hashtag = parsedEducation.hashtag;
        if (req.body.deleteEducationImage === 'true') {
            deleteOldImage(homeData.education.backgroundImage);
            homeData.education.backgroundImage = "";
        }
    }

    if (parsedFlagshipPrograms) {
        if (parsedFlagshipPrograms.sectionTitle !== undefined) {
            homeData.flagshipPrograms.sectionTitle = parsedFlagshipPrograms.sectionTitle;
        }
        if (parsedFlagshipPrograms.programs) {
            // Find images that are being removed
            const newImages = parsedFlagshipPrograms.programs.map(p => p.image).filter(Boolean);
            homeData.flagshipPrograms.programs.forEach(oldP => {
                if (oldP.image && !newImages.includes(oldP.image) && oldP.image.startsWith('uploads/')) {
                    deleteOldImage(oldP.image);
                }
            });
            homeData.flagshipPrograms.programs = parsedFlagshipPrograms.programs;
        }
    }

    if (parsedVolunteer) {
        homeData.volunteer = { ...homeData.volunteer, ...parsedVolunteer };
        if (req.body.deleteVolunteerImage === 'true') {
            deleteOldImage(homeData.volunteer.image);
            homeData.volunteer.image = "";
        }
    }

    if (parsedDonation) {
        homeData.donation = { ...homeData.donation, ...parsedDonation };
        if (req.body.deleteDonationImage === 'true') {
            deleteOldImage(homeData.donation.image);
            homeData.donation.image = "";
        }
    }

    // Handle Uploaded Files
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.fieldname === "educationBackgroundImage") {
          deleteOldImage(homeData.education.backgroundImage);
          homeData.education.backgroundImage = file.path.replace(/\\/g, "/");
        } else if (file.fieldname === "volunteerImage") {
          deleteOldImage(homeData.volunteer.image);
          homeData.volunteer.image = file.path.replace(/\\/g, "/");
        } else if (file.fieldname === "donationImage") {
          deleteOldImage(homeData.donation.image);
          homeData.donation.image = file.path.replace(/\\/g, "/");
        } else if (file.fieldname.startsWith("programImage_")) {
          const index = parseInt(file.fieldname.split("_")[1]);
          if (homeData.flagshipPrograms.programs[index]) {
            deleteOldImage(homeData.flagshipPrograms.programs[index].image);
            homeData.flagshipPrograms.programs[index].image = file.path.replace(/\\/g, "/");
          }
        }
      });
    }

    await homeData.save();
    res.json({ success: true, data: homeData });
  } catch (error) {
    // If error occurs and files were uploaded, clean them up
    if (req.files) {
      const filesToCleanup = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      filesToCleanup.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHomeData,
  updateHomeData,
};
