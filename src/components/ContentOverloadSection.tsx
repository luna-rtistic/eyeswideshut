"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1610337691244-93c7882245b3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Glitch Art 1",
    variants: {
      hidden: { opacity: 0, scale: 0.5, rotate: -15 },
      visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5 } },
    },
    className: "absolute top-10 left-10 w-3/5 h-3/5"
  },
  {
    src: "https://images.unsplash.com/photo-1632266818854-4927f33d7d89?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Glitch Art 2",
    variants: {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    },
    className: "absolute bottom-10 right-10 w-1/2 h-1/2"
  },
  {
    src: "https://images.unsplash.com/photo-1620392189495-a631d87a63e9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Glitch Art 3",
    variants: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.4 } },
    },
    className: "absolute top-1/4 left-1/4 w-2/5 h-2/5"
  },
];

const ContentOverloadSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="relative h-screen w-full bg-black overflow-hidden">
      {images.map((image, i) => (
        <motion.div
          key={i}
          className={image.className}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={image.variants}
        >
          <Image src={image.src} alt={image.alt} fill={true} className="object-cover" />
        </motion.div>
      ))}
    </section>
  );
};

export default ContentOverloadSection;
