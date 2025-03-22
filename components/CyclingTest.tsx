"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CyclingTextProps {
  words: string[];
  interval?: number;
  prefix?: string;
}

const CyclingText: React.FC<CyclingTextProps> = ({
  words,
  interval = 2000,
  prefix = "Plan your next",
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length]);

  const maxWordLength = words.reduce(
    (max, word) => (word.length > max ? word.length : max),
    0
  );

  // Pad words to same length using non-breaking space
  const paddedWords = words.map(
    (word) => word + "\u00A0".repeat(maxWordLength - word.length) // nbsp padding
  );

  return (
    <div className="flex items-center justify-center mt-[20px] font-dm text-[100px] leading-none">
      <span className="mr-4 mb-1">{prefix}</span>
      <div
        className="relative overflow-hidden"
        style={{ width: "auto", minWidth: "8ch", height: "1.2em" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 top-0 mt-2"
            style={{ whiteSpace: "pre" }} // preserve spacing
          >
            {paddedWords[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CyclingText;
