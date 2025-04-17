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
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          variants={titleVariants}
        >
          <span className="block">Colman's</span>
          <span className="block">Projects Day</span>
          {/* <RainbowButton /> */}
        </motion.h1>

        <motion.div variants={buttonVariants}>
          <Button
            onClick={handleEnter}
            className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
          >
            Go to Website
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OpenPage;
