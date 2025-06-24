"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FilteredEmptySpaceSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section ref={ref} className="h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="text-2xl md:text-4xl font-mono text-green-400"
      >
        What’s missing?
      </motion.h2>
    </section>
  );
};

export default FilteredEmptySpaceSection;
