import React from "react";
import OrangeButton from "../../common/buttons/OrangeButton";
import FlagshipCard from "../../common/cards/FlagshipCard";

// Images for Flagship Programs
import sharada from "../../../assets/home/FlagshipPrograms_images/Sharada_Academy.webp";
import JnanaShala from "../../../assets/home/FlagshipPrograms_images/Project_JnanaShala.webp";
import others from "../../../assets/home/FlagshipPrograms_images/Other_Programs.webp";
import sulabhapp from "../../../assets/home/FlagshipPrograms_images/sulabhapp.webp";

import { API_BASE_URL } from "../../../utils/constants";

export default function FlagshipPrograms({ data }) {
  const sectionTitle = data?.sectionTitle || "Know More About Our Flagship Programs";
  
  const defaultPrograms = [
    {
      image: sharada,
      title: "Sharada Academy",
      subtitle: "A structured learning initiative that supports after-school academics.",
    },
    {
      image: sulabhapp,
      title: "Project Sulabh",
      subtitle: "An ed-tech and community empowerment programme: online spoken English and soft-skills courses. ",
    },
    {
      image: JnanaShala,
      title: "Project JnanaShala",
      subtitle: "A school-support programme that provides library kits, digital learning tools, etc.",
    },
    {
      image: others,
      title: "Others",
      subtitle: "Many other programmes which help the students grow.",
    },
  ];

  const displayPrograms = (data?.programs && data.programs.length > 0) ? data.programs : defaultPrograms;

  return (
    <section className="relative bg-[#0a2540] py-12 px-4 md:py-16 md:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* --- Top Section (Updated Styles) --- */}
        <div className="flex flex-col items-center text-center mb-14">
          <h2 className="text-white text-2xl md:text-2xl lg:text-3xl font-bold flex flex-col md:flex-row items-center gap-3 mb-6 tracking-tight">
            <span className="text-[#E57C23] text-3xl md:text-4xl drop-shadow-md">
              ♡
            </span>
            <span>{sectionTitle}</span>
          </h2>

          <div className="mt-2 transform hover:scale-105 transition-transform duration-300">
            <OrangeButton work="Explore More" path="/programs" />
          </div>
        </div>

        {/* --- Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {displayPrograms.map((p, idx) => {
            const imgSrc = p.image?.startsWith("uploads") 
                ? `${API_BASE_URL}/${p.image}` 
                : p.image;

            return (
              <FlagshipCard
                key={idx}
                image={imgSrc}
                title={p.title}
                desc={p.subtitle || p.desc}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
