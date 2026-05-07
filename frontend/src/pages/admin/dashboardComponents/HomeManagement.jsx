import React, { useState, useEffect } from "react";
import { homeAPI } from "../../../services/api";
import {
  FaHome,
  FaGraduationCap,
  FaFlag,
  FaHandsHelping,
  FaDonate,
  FaSave,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaTimes,
  FaBold,
  FaItalic,
} from "react-icons/fa";
import { API_BASE_URL } from "../../../utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeManagement = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("homeActiveTab") || "hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeData, setHomeData] = useState({
    hero: { motto: "", quote: "", quoteWrittenBy: "" },
    education: { hashtag: "", backgroundImage: "" },
    flagshipPrograms: { sectionTitle: "", programs: [] },
    volunteer: {
      title: "",
      subtitle: "",
      boldSubtitle: "",
      accordion: [],
      image: "",
    },
    donation: {
      title: "",
      quote: "",
      listTitle: "",
      points: [],
      note: "",
      image: "",
    },
  });

  const [files, setFiles] = useState({
    educationBackgroundImage: null,
    volunteerImage: null,
    donationImage: null,
    programImages: {}, // map of index -> file
  });

  const [deletions, setDeletions] = useState({
    education: false,
    volunteer: false,
    donation: false,
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await homeAPI.get();
      if (res.data.success) {
        setHomeData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching home data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setHomeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e, field) => {
    setFiles((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleProgramFileChange = (e, index) => {
    setFiles((prev) => ({
      ...prev,
      programImages: {
        ...prev.programImages,
        [index]: e.target.files[0],
      },
    }));
  };

  const handleArrayChange = (section, field, index, subField, value) => {
    const updatedArray = [...homeData[section][field]];
    if (subField) {
      updatedArray[index] = { ...updatedArray[index], [subField]: value };
    } else {
      updatedArray[index] = value;
    }
    setHomeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: updatedArray,
      },
    }));
  };

  const addArrayItem = (section, field, defaultValue) => {
    setHomeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], defaultValue],
      },
    }));
  };

  const removeArrayItem = (section, field, index) => {
    const updatedArray = homeData[section][field].filter((_, i) => i !== index);
    setHomeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: updatedArray,
      },
    }));
  };

  const handleSectionSave = async (section) => {
    setSaving(true);
    const formData = new FormData();
    
    // Add text data for the specific section
    formData.append(section, JSON.stringify(homeData[section]));
    
    // Add flagship programs separately if needed (though the backend handles whatever is sent)
    // Actually, it's easier to just send the whole object or the specific section.
    // My backend updateHomeData processes whatever is in req.body.
    
    // Add specific image for the section
    if (section === "education") {
      if (files.educationBackgroundImage) {
        formData.append("educationBackgroundImage", files.educationBackgroundImage);
      }
      if (deletions.education) {
        formData.append("deleteEducationImage", "true");
      }
    } else if (section === "volunteer") {
      if (files.volunteerImage) {
        formData.append("volunteerImage", files.volunteerImage);
      }
      if (deletions.volunteer) {
        formData.append("deleteVolunteerImage", "true");
      }
    } else if (section === "donation") {
      if (files.donationImage) {
        formData.append("donationImage", files.donationImage);
      }
      if (deletions.donation) {
        formData.append("deleteDonationImage", "true");
      }
    } else if (section === "flagshipPrograms") {
      // Append program images with indices
      Object.keys(files.programImages).forEach((index) => {
        formData.append(`programImage_${index}`, files.programImages[index]);
      });
    }

    try {
      const res = await homeAPI.update(formData);
      if (res.data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
        setHomeData(res.data.data);
        // Clear files for this section
        if (section === "education") setFiles(p => ({...p, educationBackgroundImage: null}));
        if (section === "volunteer") setFiles(p => ({...p, volunteerImage: null}));
        if (section === "donation") setFiles(p => ({...p, donationImage: null}));
        if (section === "flagshipPrograms") setFiles(p => ({...p, programImages: {}}));
        
        // Reset deletions
        setDeletions(p => ({...p, [section]: false}));
      }
    } catch (error) {
      console.error(`Error updating ${section}`, error);
      toast.error(`Error updating ${section}`);
    } finally {
      setSaving(false);
    }
  };

  const handleNoteFormat = (tag) => {
    const textarea = document.getElementById("donation-note-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = homeData.donation.note;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = `${before}<${tag}>${selectedText}</${tag}>${after}`;
    handleInputChange("donation", "note", newText);

    // Focus back and set cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tag.length + 2 + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toggleDeletion = (section) => {
    setDeletions(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tabs = [
    { id: "hero", label: "Hero Section", icon: <FaHome /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "programs", label: "Flagship Programs", icon: <FaFlag /> },
    { id: "volunteer", label: "Volunteer", icon: <FaHandsHelping /> },
    { id: "donation", label: "Donation", icon: <FaDonate /> },
  ];

  if (loading)
    return <div className="p-8 text-center">Loading Home Data...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">
            Home Page Management
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-white p-2 rounded-xl shadow-sm mb-6 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                localStorage.setItem("homeActiveTab", tab.id);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-orange-100 text-orange-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white p-6 md:p-8 rounded-xl shadow-md"
        >
          {/* Hero Section */}
          {activeTab === "hero" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                Hero Content
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Motto
                  </label>
                  <input
                    type="text"
                    value={homeData.hero.motto}
                    onChange={(e) =>
                      handleInputChange("hero", "motto", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Main Quote
                  </label>
                  <textarea
                    rows="3"
                    value={homeData.hero.quote}
                    onChange={(e) =>
                      handleInputChange("hero", "quote", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quote Author
                  </label>
                  <input
                    type="text"
                    value={homeData.hero.quoteWrittenBy}
                    onChange={(e) =>
                      handleInputChange(
                        "hero",
                        "quoteWrittenBy",
                        e.target.value,
                      )
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                    onClick={() => handleSectionSave("hero")}
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
                >
                    <FaSave /> {saving ? "Saving..." : "Save Hero"}
                </button>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeTab === "education" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                Education Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hashtag
                  </label>
                  <input
                    type="text"
                    value={homeData.education.hashtag}
                    onChange={(e) =>
                      handleInputChange("education", "hashtag", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Background Image (Recommended: 1920x1080px)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative">
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "educationBackgroundImage")
                      }
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {files.educationBackgroundImage
                          ? files.educationBackgroundImage.name
                          : "Change Background Image"}
                      </span>
                    </div>
                  </div>
                  {homeData.education.backgroundImage &&
                    !files.educationBackgroundImage && !deletions.education && (
                      <div className="mt-2 h-20 w-32 overflow-hidden rounded border relative group">
                        <img
                          src={`${API_BASE_URL}/${homeData.education.backgroundImage}`}
                          alt="Current Background"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleDeletion("education")}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          title="Delete image and use fallback"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    {deletions.education && (
                        <div className="mt-2 text-xs text-orange-600 flex items-center gap-1 font-semibold">
                            <span>Image marked for deletion. Fallback will be used.</span>
                            <button onClick={() => toggleDeletion("education")} className="text-blue-500 underline">Undo</button>
                        </div>
                    )}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                    onClick={() => handleSectionSave("education")}
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
                >
                    <FaSave /> {saving ? "Saving..." : "Save Education"}
                </button>
              </div>
            </div>
          )}

          {/* Flagship Programs */}
          {activeTab === "programs" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                Flagship Programs
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={homeData.flagshipPrograms.sectionTitle}
                  onChange={(e) =>
                    handleInputChange(
                      "flagshipPrograms",
                      "sectionTitle",
                      e.target.value,
                    )
                  }
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-600">Programs List</h3>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("flagshipPrograms", "programs", {
                        title: "",
                        subtitle: "",
                        image: "",
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded transition"
                  >
                    <FaPlus size={12} /> Add Program
                  </button>
                </div>

                {homeData.flagshipPrograms.programs.map((program, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("flagshipPrograms", "programs", index)
                      }
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Title
                        </label>
                        <input
                          type="text"
                          value={program.title}
                          onChange={(e) =>
                            handleArrayChange(
                              "flagshipPrograms",
                              "programs",
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 p-2 rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={program.subtitle}
                          onChange={(e) =>
                            handleArrayChange(
                              "flagshipPrograms",
                              "programs",
                              index,
                              "subtitle",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 p-2 rounded mt-1"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Program Image
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="flex-1 w-full">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleProgramFileChange(e, index)
                                }
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="flex flex-col items-center justify-center gap-1 text-sm text-gray-600">
                                <FaCloudUploadAlt className="text-2xl text-gray-400" />
                                <span>
                                  {files.programImages[index]
                                    ? files.programImages[index].name
                                    : "Upload Program Image"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {program.image && !files.programImages[index] && (
                            <div className="shrink-0 h-20 w-32 overflow-hidden rounded-lg border shadow-sm">
                              <img
                                src={
                                  program.image.startsWith("http")
                                    ? program.image
                                    : `${API_BASE_URL}/${program.image}`
                                }
                                alt="Program Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button
                    onClick={() => handleSectionSave("flagshipPrograms")}
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
                >
                    <FaSave /> {saving ? "Saving..." : "Save Programs"}
                </button>
              </div>
            </div>
          )}

          {/* Volunteer Section */}
          {activeTab === "volunteer" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                Volunteer Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={homeData.volunteer.title}
                      onChange={(e) =>
                        handleInputChange("volunteer", "title", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={homeData.volunteer.subtitle}
                      onChange={(e) =>
                        handleInputChange(
                          "volunteer",
                          "subtitle",
                          e.target.value,
                        )
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Bold Subtitle
                    </label>
                    <input
                      type="text"
                      value={homeData.volunteer.boldSubtitle}
                      onChange={(e) =>
                        handleInputChange(
                          "volunteer",
                          "boldSubtitle",
                          e.target.value,
                        )
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Side Image (Recommended: 1920x1080px)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "volunteerImage")}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                        <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {files.volunteerImage
                            ? files.volunteerImage.name
                            : "Change Volunteer Image"}
                        </span>
                      </div>
                    </div>
                    {homeData.volunteer.image && !files.volunteerImage && !deletions.volunteer && (
                      <div className="mt-2 h-20 w-32 overflow-hidden rounded border relative group">
                        <img
                          src={`${API_BASE_URL}/${homeData.volunteer.image}`}
                          alt="Current Volunteer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleDeletion("volunteer")}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          title="Delete image and use fallback"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    {deletions.volunteer && (
                        <div className="mt-2 text-xs text-orange-600 flex items-center gap-1 font-semibold">
                            <span>Image marked for deletion.</span>
                            <button onClick={() => toggleDeletion("volunteer")} className="text-blue-500 underline">Undo</button>
                        </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-600">Accordion Items</h3>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("volunteer", "accordion", {
                          title: "",
                          description: "",
                        })
                      }
                      className="flex items-center gap-1 text-sm bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded transition"
                    >
                      <FaPlus size={12} /> Add Item
                    </button>
                  </div>
                  {homeData.volunteer.accordion.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("volunteer", "accordion", index)
                        }
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaTrash />
                      </button>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleArrayChange(
                              "volunteer",
                              "accordion",
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 p-2 rounded mt-1"
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Description
                        </label>
                        <textarea
                          rows="2"
                          value={item.description}
                          onChange={(e) =>
                            handleArrayChange(
                              "volunteer",
                              "accordion",
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 p-2 rounded mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                    onClick={() => handleSectionSave("volunteer")}
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
                >
                    <FaSave /> {saving ? "Saving..." : "Save Volunteer"}
                </button>
              </div>
            </div>
          )}

          {/* Donation Section */}
          {activeTab === "donation" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                Donation Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={homeData.donation.title}
                      onChange={(e) =>
                        handleInputChange("donation", "title", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Quote
                    </label>
                    <textarea
                      rows="2"
                      value={homeData.donation.quote}
                      onChange={(e) =>
                        handleInputChange("donation", "quote", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      List Title
                    </label>
                    <input
                      type="text"
                      value={homeData.donation.listTitle}
                      onChange={(e) =>
                        handleInputChange(
                          "donation",
                          "listTitle",
                          e.target.value,
                        )
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={homeData.donation.upiId}
                      onChange={(e) =>
                        handleInputChange("donation", "upiId", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-sm font-semibold text-gray-700">
                        Bottom Note
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleNoteFormat("b")}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition flex items-center gap-1 text-xs font-bold"
                          title="Bold"
                        >
                          <FaBold size={10} /> Bold
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNoteFormat("i")}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition flex items-center gap-1 text-xs italic"
                          title="Italic"
                        >
                          <FaItalic size={10} /> Italic
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="donation-note-textarea"
                      rows="3"
                      value={homeData.donation.note}
                      onChange={(e) =>
                        handleInputChange("donation", "note", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Add formatting using buttons above or HTML tags..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      QR Image (Recommended: 1000x800px)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "donationImage")}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                        <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {files.donationImage
                            ? files.donationImage.name
                            : "Change Donation QR"}
                        </span>
                      </div>
                    </div>
                    {homeData.donation.image && !files.donationImage && !deletions.donation && (
                      <div className="mt-2 h-20 w-32 overflow-hidden rounded border relative group">
                        <img
                          src={`${API_BASE_URL}/${homeData.donation.image}`}
                          alt="Current Donation"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleDeletion("donation")}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          title="Delete image and use fallback"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    {deletions.donation && (
                        <div className="mt-2 text-xs text-orange-600 flex items-center gap-1 font-semibold">
                            <span>Image marked for deletion.</span>
                            <button onClick={() => toggleDeletion("donation")} className="text-blue-500 underline">Undo</button>
                        </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-600">Impact Points / List</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem("donation", "points", "")}
                      className="flex items-center gap-1 text-sm bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 rounded transition"
                    >
                      <FaPlus size={12} /> Add Item
                    </button>
                  </div>
                  {homeData.donation.points.map((point, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) =>
                          handleArrayChange(
                            "donation",
                            "points",
                            index,
                            null,
                            e.target.value,
                          )
                        }
                        className="flex-1 border border-gray-300 p-2 rounded"
                        placeholder="List item..."
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("donation", "points", index)
                        }
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                    onClick={() => handleSectionSave("donation")}
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold transition disabled:opacity-50"
                >
                    <FaSave /> {saving ? "Saving..." : "Save Donation"}
                </button>
              </div>
            </div>
          )}
        </form>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default HomeManagement;
