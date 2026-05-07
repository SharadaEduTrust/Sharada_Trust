import React, { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import volunteerBackgroundImage from "../../../assets/volunteer.webp";
import OrangeButton from "../../common/buttons/OrangeButton";

import { API_BASE_URL } from "../../../utils/constants";

export default function VolunteerComponent({ data }) {
  const [expandedSection, setExpandedSection] = useState("");

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  // Fallbacks
  const title = data?.title || "Why we need You to Volunteer with Us";
  const subtitle = data?.subtitle || "We need more Volunteers like these inspiring youngsters, eager to create real change in the world!";
  const boldSubtitle = data?.boldSubtitle || "Young, Driven & Making a Difference!";
  const image = data?.image ? `${API_BASE_URL}/${data.image}` : volunteerBackgroundImage;
  
  const defaultAccordion = [
    {
      id: "recognition",
      title: "Recognition and Fulfillment",
      description: "We need more passionate change-makers and young minds ready to shape a more inclusive and empowered future for education in India.",
    },
    {
      id: "community",
      title: "Be Part of a Community",
      description: "Join a vibrant network of Volunteers who share your passion for education and social change, creating lasting impact together.",
    },
    {
      id: "why-join",
      title: "Why Join Us as a Volunteer?",
      description: "Make a tangible impact on education, develop leadership skills, connect with like-minded change makers, and be part of a movement transforming communities across India.",
    },
  ];

  const accordionItems = (data?.accordion && data.accordion.length > 0) ? data.accordion : defaultAccordion;

  return (
    <div className="bg-gray-100 px-4 sm:px-6 md:px-8 py-12">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* ================= LEFT : IMAGE ================= */}
          <div className="relative p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl rotate-2"></div>
              <div className="relative bg-white p-2 rounded-2xl">
                <img
                  src={image}
                  alt="Young volunteers"
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>
            </div>

            <OrangeButton
              path="https://docs.google.com/forms/d/e/1FAIpQLSd26LDpdB_b9Ar3y2-11KLDx_nq3NlJGvwApx3W0hxAwRHATw/viewform"
              work="Click to register as a Volunteer with us"
            />
          </div>

          {/* ================= RIGHT : CONTENT ================= */}
          <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            {/* -------- Header -------- */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-[#0B0B45] leading-tight mb-4">
                {title}
              </h1>

              <p className=" text-base sm:text-md leading-relaxed text-[#0B0B45]">
                {subtitle}
                <br />
                <span className="font-semibold md:text-1xl text-[#0B0B45]">
                  {boldSubtitle}
                </span>
              </p>
            </div>

            {/* -------- Accordion -------- */}
            <div className="space-y-4">
              {accordionItems.map((item, index) => {
                const itemId = item.id || `item-${index}`;
                return (
                  <div key={itemId} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(itemId)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={`text-lg sm:text-xl font-semibold ${
                          expandedSection === itemId
                            ? "text-orange-500"
                            : "text-[#0B0B45]"
                        }`}
                      >
                        {item.title}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSection === itemId
                            ? "rotate-180 text-orange-500"
                            : "text-[#0B0B45]"
                        }`}
                      />
                    </button>

                    {expandedSection === itemId && (
                      <div className="px-4 sm:px-5 pb-5 pt-2">
                        <p className="text-gray-700 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
