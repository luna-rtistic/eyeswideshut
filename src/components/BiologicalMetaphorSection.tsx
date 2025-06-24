"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const images = [
  "https://images.unsplash.com/photo-1598977114457-3a72dfac4544?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1627933930299-e093d56b2c2d?q=80&w=2869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1589578138713-1389815509b3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const BiologicalMetaphorSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const imageOpacities = [
    useTransform(scrollYProgress, [0, 0.33, 0.34], [1, 1, 0]),
    useTransform(scrollYProgress, [0.34, 0.66, 0.67], [0, 1, 0]),
    useTransform(scrollYProgress, [0.67, 1], [0, 1]),
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {images.map((src, i) => (
          <motion.div
            key={i}
            style={{ opacity: imageOpacities[i] }}
            className="absolute h-3/4 w-3/4"
          >
            <Image
              src={src}
              alt={`Biological Metaphor ${i + 1}`}
              fill={true}
              className="object-contain"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BiologicalMetaphorSection;
