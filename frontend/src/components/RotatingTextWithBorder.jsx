"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RotatingTextWithBorder({
  texts = ["Sneakers", "Watches", "Handbags"],
  rotationInterval = 2500,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  return (
    <div className="relative inline-block">
      <div className="relative inline-block p-[2px] -top-4 rounded-lg ">
        {/* Spinning gradient border */}
        
        {/* Inner background + rotating words */}
       <div className="relative bg-white text-black rounded-lg pr-4 inline-flex justify-center items-center align-middle">
        <AnimatePresence mode="wait">
          <motion.span
            key={texts[index]}
            initial={{ opacity: 0, y: "30%", filter: "blur(4px)" }}
            animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-30%", filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="font-semibold text-6xl whitespace-nowrap align-middle relative top-[10px]"
          >
            {texts[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
