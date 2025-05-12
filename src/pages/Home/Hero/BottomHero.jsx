import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

const BottomHero = () => {
  const words = ["experiences.", "creativity.", "technology.", "magic."];

  return (
    <div className="flex flex-col px-6 py-3 text-md text-[#131313] leading-[1.1]">
      <motion.h1
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        className={cn(
          "relative lg:mb-6 max-w-lg text-left text-lg leading-normal font-bold tracking-tight text-[#131313] md:text-2xl dark:text-zinc-100"
        )}
        layout
      >
        <div className="z-10 inline-block">
          Turn ideas into <ContainerTextFlip words={words} />
          {/* <Blips /> */}
        </div>
      </motion.h1>{" "}
    </div>
  );
};

export default BottomHero;
