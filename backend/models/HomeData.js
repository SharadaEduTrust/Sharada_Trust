const mongoose = require("mongoose");

const HomeDataSchema = new mongoose.Schema(
  {
    hero: {
      motto: { type: String, default: "Empowering Lives Through Education" },
      quote: {
        type: String,
        default:
          "Education is the most powerful weapon which you can use to change the world.",
      },
      quoteWrittenBy: { type: String, default: "Nelson Mandela" },
    },
    education: {
      hashtag: { type: String, default: "#EducationForAll" },
      backgroundImage: { type: String, default: "" },
    },
    flagshipPrograms: {
      sectionTitle: {
        type: String,
        default: "Know More About Our Flagship Programs",
      },
      programs: [
        {
          image: { type: String, default: "" },
          title: { type: String, default: "" },
          subtitle: { type: String, default: "" },
        },
      ],
    },
    volunteer: {
      title: { type: String, default: "Become a Volunteer" },
      subtitle: {
        type: String,
        default: "Join our mission to make a difference",
      },
      boldSubtitle: { type: String, default: "Ready to help?" },
      image: { type: String, default: "" },
      accordion: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },
    donation: {
      title: { type: String, default: "Support Our Cause" },
      quote: {
        type: String,
        default:
          "Giving is not just about making a donation. It is about making a difference.",
      },
      listTitle: { type: String, default: "How your donation helps:" },
      points: [{ type: String }],
      upiId: { type: String, default: "sharadaeducationaltrust.ibz@icici" },
      note: { type: String, default: "Every contribution counts." },
      image: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HomeData", HomeDataSchema);
