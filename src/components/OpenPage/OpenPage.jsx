import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import RainbowButton from "../RainbowButton";

const OpenPage = ({ setShowLightTheme, setShowWelcome }) => {
  const handleEnter = () => {
    setShowLightTheme(true);
    setShowWelcome(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const titleVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 12,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="h-[100dvh] fixed top-0 left-0 w-full z-50 flex items-center justify-center text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center">
        <motion.h1
          className="mb-6 text-5xl font-bold leading-tight md:text-6xl"
          variants={titleVariants}
        >
          <span className="block">Colman's</span>
          <span className="block">Graduation Day</span>
          {/* <RainbowButton /> */}
        </motion.h1>

        <motion.div variants={buttonVariants}>
          <Button
            onClick={handleEnter}
            className="px-6 py-3 mt-4 font-semibold text-black transition-all duration-300 bg-white rounded-lg hover:bg-gray-200"
          >
            Go to Website
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OpenPage;
