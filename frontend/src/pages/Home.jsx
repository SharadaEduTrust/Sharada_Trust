import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/sections/home/Hero";
import Programs from "../components/sections/home/Programs";
import EducationForAll from "../components/sections/home/EducationForAll";
import FlagshipPrograms from "../components/sections/home/FlagshipPrograms";
import VolunteerSection from "../components/sections/home/VolunteerSection";
import DonationSection from "../components/sections/home/DonationSection";
import NewsLetter from "../components/sections/home/NewsLetter";
import { homeAPI } from "../services/api";

const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await homeAPI.get();
        if (res.data.success) {
          setHomeData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching home data", error);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero data={homeData?.hero} />
      {/* <Programs />   */}
      <EducationForAll data={homeData?.education} />
      <FlagshipPrograms data={homeData?.flagshipPrograms} />
      <NewsLetter />
      <VolunteerSection data={homeData?.volunteer} />
      <DonationSection data={homeData?.donation} />
    </motion.div>
  );
};

export default Home;
