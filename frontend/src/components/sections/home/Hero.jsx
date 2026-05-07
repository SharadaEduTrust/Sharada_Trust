import React, { useState, useEffect } from "react";
import { heroImagesAPI } from "../../../services/api";
import { API_BASE_URL } from "../../../utils/constants";

// Invisible SVG defining the clip path for the hero section
const SvgClipPath = () => (
  <svg width="0" height="0" className="absolute pointer-events-none">
    <defs>
      <clipPath id="hero-curve" clipPathUnits="objectBoundingBox">
        <path d="M 0.1,0 L 1,0 L 1,1 L 0.1,1 C 0.2,0.75 0.2,0.25 0.1,0 Z" />
      </clipPath>
    </defs>
  </svg>
);

const HeroSection = ({ data }) => {
  const [bgImage, setBgImage] = useState("/herosectionimage.jpg");

  // Fallbacks
  const motto = data?.motto || "Empowering Lives Through Education";
  const quote = data?.quote || "Education is the most powerful weapon you can use to change the world";
  const quoteBy = data?.quoteWrittenBy || "Nelson Mandela";

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const { data } = await heroImagesAPI.get("home");
        if (data.success && data.data.imageUrl) {
          setBgImage(`${API_BASE_URL}${data.data.imageUrl}`);
        }
      } catch (error) {
        // Silent failure to default image
      }
    };
    fetchHeroImage();
  }, []);

  return (
    <>
      <SvgClipPath />
      <div className="relative -mt-20 pt-20 flex flex-col justify-center lg:justify-normal lg:flex-row min-h-screen font-sans bg-[#0a2540] overflow-hidden">
        <div className="w-full lg:w-1/2 text-white flex flex-col items-center lg:items-start justify-center p-8 lg:p-16 z-10 relative">
          <div className="max-w-lg">
            <span className="text-orange-500 text-xl font-semibold tracking-wider flex items-center justify-center lg:justify-start gap-2">
              <span className="text-[#E57C23] text-2xl">♡</span>
              {motto}
            </span>

            <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold my-6 leading-tight text-white text-center lg:text-left">
              {quote} <span className="font-light italic">– {quoteBy}</span>
            </h1>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full lg:w-1/2 lg:h-full lg:absolute lg:top-0 lg:right-0 lg:left-auto z-0">
          <div className="relative w-full h-full lg:[clip-path:url(#hero-curve)]">
            <div className="absolute inset-0 bg-black/60 lg:hidden z-10"></div>
            <img
              src={bgImage}
              alt="Children studying"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/herosectionimage.jpg";
                e.currentTarget.onerror = null;
              }}
            />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-0 left-0 w-full lg:w-1/2 h-1/2 z-0">
          <img
            src="/hands.png"
            alt="Decorative hands overlay"
            className="w-full object-contain object-bottom opacity-10"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
