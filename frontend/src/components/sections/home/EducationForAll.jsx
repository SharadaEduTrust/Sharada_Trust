import React from "react";
import ImageCard from "../../common/cards/ImageCard";
import DonationButton from "../../common/buttons/OrangeButton";
import { API_BASE_URL } from "../../../utils/constants";
import BackGroundImage from "../../../assets/Background_Image_EducationForAll.jpg";

const EducationForAll = ({ data }) => {
  const hashtag = data?.hashtag || "#EDUCATIONFORALL";
  const bgImg = data?.backgroundImage 
    ? `${API_BASE_URL}/${data.backgroundImage}` 
    : BackGroundImage;

  return (
    <section className="relative min-h-[70vh] md:min-h-screen w-full overflow-hidden bg-[#FFFBED]">
      {/* Background Image (right side) with curved edge */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImg})`,
          // ellipse with percentage radii stays responsive across widths/heights [web:62][web:15]
          clipPath: "ellipse(52% 100% at 100% 50%)",
        }}
      >
        {/* Dark overlay on image */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20">
        {/* Header Section */}
        <div className="mb-10 sm:mb-12 max-w-xl">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold text-orange-500 mb-4 sm:mb-6 tracking-widest">
            {hashtag}
          </h1>
          {/* <DonationButton work="Make a Donation" path="#donation" /> */}
        </div>

        {/* Cards Section (Full width) */}
        <div className="mt-10 sm:mt-12 md:mt-16 w-full">
          <ImageCard />
        </div>
      </div>
    </section>
  );
};

export default EducationForAll;
