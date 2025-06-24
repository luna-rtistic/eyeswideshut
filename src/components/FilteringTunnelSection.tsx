"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const tunnelBackgroundImage = "https://images.unsplash.com/photo-1530912402434-a36c8452187a?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const contentImages = [
  "https://images.unsplash.com/photo-1594399908316-0428a2a51f67?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1627793435227-3e5f225337e3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1618510203409-760331034aa3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const FilteringTunnelSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Create different paths for each image
  const y1 = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["-10%", "5%"]);
  
  const y2 = useTransform(scrollYProgress, [0.2, 1], ["-20%", "100%"]);
  const x2 = useTransform(scrollYProgress, [0.2, 1], ["40%", "50%"]);
  
  const y3 = useTransform(scrollYProgress, [0.4, 1], ["-40%", "110%"]);
  const x3 = useTransform(scrollYProgress, [0.4, 1], ["-20%", "-15%"]);

  const paths = [
    { y: y1, x: x1, rotate: useTransform(scrollYProgress, [0, 1], [0, 30]) },
    { y: y2, x: x2, rotate: useTransform(scrollYProgress, [0.2, 1], [0, -25]) },
    { y: y3, x: y3, rotate: useTransform(scrollYProgress, [0.4, 1], [0, 15]) },
  ];

  return (
    <section ref={targetRef} className="relative h-[250vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Image src={tunnelBackgroundImage} alt="Wormhole background" fill={true} className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        
        {contentImages.map((src, i) => (
          <motion.div
            key={src}
            style={{ y: paths[i].y, x: paths[i].x, rotate: paths[i].rotate }}
            className="absolute top-0 left-1/4 w-1/4 h-1/4"
          >
            <Image
              src={src}
              alt={`Falling content ${i + 1}`}
              fill={true}
              className="object-contain"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FilteringTunnelSection;
